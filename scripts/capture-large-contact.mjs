import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';

const PORT = 9999;
const REVIEW_DIR = path.resolve(process.cwd(), 'review');
const CONTACT_HTML_PATH = 'file:///' + path.resolve(process.cwd(), 'scripts/contact-sheet.html').replace(/\\/g, '/');

async function run() {
  console.log('Capturing 15-art-contact-sheet-large.png...');
  const edgeProfile = path.join(process.env.TEMP || 'C:\\temp', 'edge_large_contact');
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

    const { targetId } = await sendBrowser('Target.createTarget', { url: CONTACT_HTML_PATH });
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
    await new Promise((r) => setTimeout(r, 2000));

    // High-resolution 2000px width contact sheet
    await sendSession('Emulation.setDeviceMetricsOverride', {
      width: 2000,
      height: 1600,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await new Promise((r) => setTimeout(r, 800));

    const shot = await sendSession('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    const targetFile = path.join(REVIEW_DIR, '15-art-contact-sheet-large.png');
    fs.writeFileSync(targetFile, Buffer.from(shot.data, 'base64'));
    console.log('Successfully captured', targetFile);

    await sendBrowser('Target.closeTarget', { targetId });
    browserWs.close();
  } catch (err) {
    console.error('Error capturing large contact sheet:', err);
  } finally {
    edge.kill();
    process.exit(0);
  }
}

run();
