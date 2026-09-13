import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 9444;
const APP_URL = 'http://localhost:3008';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');

async function main() {
  const edgeProfile = path.join(process.env.TEMP || 'C:\\temp', 'edge_full_verify');
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
    const { sessionId } = await sendBrowser('Target.attachToTarget', {
      targetId,
      flatten: true,
    });

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
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await new Promise((r) => setTimeout(r, 2000));

    // Scroll to sections and take screenshots
    const sections = [
      { id: 'watch', name: 'section_featured' },
      { id: 'paths', name: 'section_paths' },
      { id: 'manifesto', name: 'section_manifesto' },
      { id: 'method', name: 'section_method' },
      { id: 'archive', name: 'section_archive' },
      { id: 'final-cta', name: 'section_cta' },
    ];

    for (const sec of sections) {
      await sendSession('Runtime.evaluate', {
        expression: `(() => {
          const el = document.getElementById('${sec.id}') || document.querySelector('[aria-labelledby*="${sec.id}"]');
          if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
        })()`,
      });
      await new Promise((r) => setTimeout(r, 800));

      const shot = await sendSession('Page.captureScreenshot', { format: 'png' });
      const p = path.join(SCREENSHOT_DIR, `${sec.name}.png`);
      fs.writeFileSync(p, Buffer.from(shot.data, 'base64'));
      console.log(`Captured ${sec.name}`);
    }

    await sendBrowser('Target.closeTarget', { targetId });
    browserWs.close();
  } catch (err) {
    console.error(err);
  } finally {
    edge.kill();
    process.exit(0);
  }
}

main();
