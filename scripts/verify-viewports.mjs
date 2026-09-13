import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = 9444;
const APP_URL = process.env.APP_URL || 'http://localhost:3000';
const SCREENSHOT_DIR = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '1440x1000', width: 1440, height: 1000, mobile: false },
  { name: '1280x800', width: 1280, height: 800, mobile: false },
  { name: '768x1024', width: 768, height: 1024, mobile: false },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '360x800', width: 360, height: 800, mobile: true },
];

async function main() {
  console.log('Starting Edge process...');
  const edgeProfile = path.join(process.env.TEMP || 'C:\\temp', 'edge_viewport_verify');
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
    // Wait for CDP to respond
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

    if (!versionData) {
      throw new Error('Failed to connect to Edge CDP within 5s');
    }

    console.log('Connected to Edge:', versionData.Browser);

    // Create a new target (tab)
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

    console.log('Attached to target tab session:', sessionId);

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

    const consoleMessages = [];
    browserWs.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.sessionId === sessionId && data.method === 'Runtime.consoleAPICalled') {
        const type = data.params.type;
        const text = data.params.args.map((a) => a.value || JSON.stringify(a)).join(' ');
        consoleMessages.push({ type, text });
      }
    });

    await sendSession('Runtime.enable');
    await sendSession('Page.enable');

    console.log('Navigating to', APP_URL);
    await sendSession('Page.navigate', { url: APP_URL });
    // Wait for page to finish rendering
    await new Promise((r) => setTimeout(r, 2000));

    console.log('\n--- VIEWPORT AUDIT RESULTS ---');
    const results = [];

    for (const vp of VIEWPORTS) {
      await sendSession('Emulation.setDeviceMetricsOverride', {
        width: vp.width,
        height: vp.height,
        deviceScaleFactor: 1,
        mobile: vp.mobile,
      });

      // Allow reflow
      await new Promise((r) => setTimeout(r, 600));

      // Inspect DOM for overflow
      const overflowEval = await sendSession('Runtime.evaluate', {
        returnByValue: true,
        expression: `(() => {
          const docEl = document.documentElement;
          const docScrollWidth = docEl.scrollWidth;
          const docClientWidth = docEl.clientWidth;
          const bodyScrollWidth = document.body.scrollWidth;
          const winWidth = window.innerWidth;
          
          const overflowing = [];
          const allEls = document.querySelectorAll('*');
          for (const el of allEls) {
            const rect = el.getBoundingClientRect();
            // Check if element spills past viewport width by more than 0.5px
            if (rect.right > winWidth + 0.5) {
              overflowing.push({
                tag: el.tagName.toLowerCase(),
                id: el.id || undefined,
                className: el.className?.slice ? el.className.slice(0, 60) : undefined,
                right: Math.round(rect.right),
                width: Math.round(rect.width),
                overflowAmount: Math.round(rect.right - winWidth)
              });
            }
          }
          
          return {
            windowInnerWidth: winWidth,
            docClientWidth,
            docScrollWidth,
            bodyScrollWidth,
            hasHorizontalScroll: docScrollWidth > winWidth,
            overflowingElementsCount: overflowing.length,
            topOverflowing: overflowing.slice(0, 5)
          };
        })()`,
      });

      const audit = overflowEval?.result?.value || overflowEval?.value;
      if (!audit) {
        console.error('Failed to get audit result:', JSON.stringify(overflowEval));
        continue;
      }
      const passed = !audit.hasHorizontalScroll && audit.overflowingElementsCount === 0;

      // Capture screenshot
      const shot = await sendSession('Page.captureScreenshot', {
        format: 'png',
      });
      const shotPath = path.join(SCREENSHOT_DIR, `viewport_${vp.name}.png`);
      fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));

      results.push({
        viewport: vp.name,
        passed,
        ...audit,
        screenshot: shotPath,
      });

      console.log(`[Viewport ${vp.name}]`);
      console.log(`  Window: ${audit.windowInnerWidth}px | DocScroll: ${audit.docScrollWidth}px | BodyScroll: ${audit.bodyScrollWidth}px`);
      console.log(`  Horizontal Overflow: ${audit.hasHorizontalScroll ? 'FAIL (YES)' : 'PASS (NONE)'}`);
      if (audit.overflowingElementsCount > 0) {
        console.log(`  Overflowing elements:`, audit.topOverflowing);
      }
      console.log(`  Screenshot saved: ${shotPath}`);
    }

    console.log('\n--- CONSOLE ERRORS & WARNINGS ---');
    const errors = consoleMessages.filter((m) => m.type === 'error');
    const warnings = consoleMessages.filter((m) => m.type === 'warning');
    console.log(`Errors: ${errors.length}, Warnings: ${warnings.length}`);
    for (const err of errors) {
      console.log(`  [ERROR] ${err.text}`);
    }
    for (const warn of warnings) {
      console.log(`  [WARN] ${warn.text}`);
    }

    const allPassed = results.every((r) => r.passed);
    console.log('\nFINAL AUDIT STATUS:', allPassed ? 'ALL VIEWPORTS PASSED WITH ZERO OVERFLOW' : 'SOME VIEWPORTS FAILED');

    await sendBrowser('Target.closeTarget', { targetId });
    browserWs.close();
  } catch (err) {
    console.error('Audit encountered error:', err);
  } finally {
    edge.kill();
    process.exit(0);
  }
}

main();
