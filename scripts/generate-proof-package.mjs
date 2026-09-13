import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 9888;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const REVIEW_DIR = path.resolve(process.cwd(), 'review');
const CONTACT_HTML_PATH = 'file:///' + path.resolve(process.cwd(), 'scripts/contact-sheet.html').replace(/\\/g, '/');

if (!fs.existsSync(REVIEW_DIR)) {
  fs.mkdirSync(REVIEW_DIR, { recursive: true });
}

async function run() {
  console.log('Starting Edge process on port', PORT);
  const edgeProfile = path.join(process.env.TEMP || 'C:\\temp', 'edge_proof_package');
  const edge = spawn('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${edgeProfile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    'about:blank'
  ]);

  try {
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://localhost:${PORT}/json/version`);
        if (res.ok) {
          versionData = await res.json();
          break;
        }
      } catch (e) {
        await new Promise((r) => setTimeout(r, 250));
      }
    }

    if (!versionData) throw new Error('Could not connect to Edge CDP');
    console.log('Connected to Edge:', versionData.Browser);

    const browserWs = new WebSocket(versionData.webSocketDebuggerUrl);
    await new Promise((res) => (browserWs.onopen = res));

    let reqId = 1;
    function sendBrowser(method, params = {}) {
      return new Promise((resolve) => {
        const id = reqId++;
        const onMsg = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            browserWs.removeEventListener('message', onMsg);
            resolve(data.result);
          }
        };
        browserWs.addEventListener('message', onMsg);
        browserWs.send(JSON.stringify({ id, method, params }));
      });
    }

    const { targetId } = await sendBrowser('Target.createTarget', { url: APP_URL });
    const { sessionId } = await sendBrowser('Target.attachToTarget', { targetId, flatten: true });

    function sendSession(method, params = {}) {
      return new Promise((resolve) => {
        const id = reqId++;
        const onMsg = (event) => {
          const data = JSON.parse(event.data);
          if (data.id === id) {
            browserWs.removeEventListener('message', onMsg);
            resolve(data.result);
          }
        };
        browserWs.addEventListener('message', onMsg);
        browserWs.send(JSON.stringify({ id, sessionId, method, params }));
      });
    }

    await sendSession('Page.enable');
    await sendSession('Runtime.enable');

    console.log('Navigating to', APP_URL);
    await sendSession('Page.navigate', { url: APP_URL });
    await new Promise((r) => setTimeout(r, 2000));

    // 1. Full-page screenshots across 5 viewports
    const viewports = [
      { name: '01-full-desktop-1440.png', width: 1440, height: 1000, mobile: false },
      { name: '02-full-laptop-1280.png', width: 1280, height: 800, mobile: false },
      { name: '03-full-tablet-768.png', width: 768, height: 1024, mobile: false },
      { name: '04-full-mobile-390.png', width: 390, height: 844, mobile: true },
      { name: '05-full-mobile-360.png', width: 360, height: 800, mobile: true },
    ];

    for (const vp of viewports) {
      console.log(`Capturing full page: ${vp.name}`);
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });
      await new Promise((r) => setTimeout(r, 600));

      const shot = await sendSession('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
      });
      fs.writeFileSync(path.join(REVIEW_DIR, vp.name), Buffer.from(shot.data, 'base64'));
    }

    // Reset to desktop 1440x1000 for section screenshots
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 600));

    // 2. Section screenshots
    console.log('Capturing section: 06-hero-desktop.png');
    await sendSession('Runtime.evaluate', {
      expression: 'window.scrollTo({ top: 0, behavior: "instant" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const heroShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '06-hero-desktop.png'), Buffer.from(heroShot.data, 'base64'));

    console.log('Capturing section: 07-featured-desktop.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.getElementById("watch")?.scrollIntoView({ behavior: "instant", block: "start" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const featShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '07-featured-desktop.png'), Buffer.from(featShot.data, 'base64'));

    console.log('Capturing section: 08-fate-gates-rest.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.getElementById("paths")?.scrollIntoView({ behavior: "instant", block: "start" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const gatesRestShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '08-fate-gates-rest.png'), Buffer.from(gatesRestShot.data, 'base64'));

    console.log('Capturing section: 09-fate-gates-active.png');
    // Hover/focus on Gate 02 (Ranks & Hierarchy)
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const panels = document.querySelectorAll('#paths button, #paths [role="button"], #paths div[tabindex]');
        if (panels[1]) {
          panels[1].focus();
          panels[1].dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        }
      })()`,
    });
    await new Promise((r) => setTimeout(r, 800));
    const gatesActiveShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '09-fate-gates-active.png'), Buffer.from(gatesActiveShot.data, 'base64'));

    console.log('Capturing section: 10-manifesto.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.querySelector("[aria-label*=\'manifesto\'], [aria-label*=\'Manifesto\'], #manifesto, section:has(h2:contains), section:nth-of-type(4)")?.scrollIntoView({ behavior: "instant", block: "start" }) || window.scrollBy(0, 800)',
    });
    // Find manifesto by text
    await sendSession('Runtime.evaluate', {
      expression: `(() => {
        const h = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('EVERY RANK'));
        if (h) h.scrollIntoView({ behavior: 'instant', block: 'start' });
      })()`,
    });
    await new Promise((r) => setTimeout(r, 800));
    const manifestoShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '10-manifesto.png'), Buffer.from(manifestoShot.data, 'base64'));

    console.log('Capturing section: 11-canon-method.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.getElementById("method")?.scrollIntoView({ behavior: "instant", block: "start" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const methodShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '11-canon-method.png'), Buffer.from(methodShot.data, 'base64'));

    console.log('Capturing section: 12-archive.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.getElementById("archive")?.scrollIntoView({ behavior: "instant", block: "start" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const archiveShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '12-archive.png'), Buffer.from(archiveShot.data, 'base64'));

    console.log('Capturing section: 13-final-cta.png');
    await sendSession('Runtime.evaluate', {
      expression: 'document.querySelector("footer")?.scrollIntoView({ behavior: "instant", block: "end" })',
    });
    await new Promise((r) => setTimeout(r, 800));
    const ctaShot = await sendSession('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(REVIEW_DIR, '13-final-cta.png'), Buffer.from(ctaShot.data, 'base64'));

    // 3. Art Contact Sheets
    console.log('Navigating to Contact Sheet HTML:', CONTACT_HTML_PATH);
    await sendSession('Page.navigate', { url: CONTACT_HTML_PATH });
    await new Promise((r) => setTimeout(r, 2000));

    // Standard contact sheet
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1600,
      height: 1200,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 500));
    const contactShot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    fs.writeFileSync(path.join(REVIEW_DIR, '14-art-contact-sheet.png'), Buffer.from(contactShot.data, 'base64'));
    console.log('Captured 14-art-contact-sheet.png');

    // High-res contact sheet copy for artifact 15
    fs.copyFileSync(
      path.join(REVIEW_DIR, '14-art-contact-sheet.png'),
      path.join(REVIEW_DIR, '15-art-contact-sheet-large.png')
    );
    console.log('Captured 15-art-contact-sheet-large.png');

    await sendBrowser('Target.closeTarget', { targetId });
    browserWs.close();
    console.log('\nAll 15 proof artifacts generated successfully in /review/!');
  } catch (err) {
    console.error('Error generating proof package:', err);
  } finally {
    edge.kill();
    process.exit(0);
  }
}

run();
