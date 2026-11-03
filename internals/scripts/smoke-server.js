const assert = require('assert');
const { spawn } = require('child_process');
const fs = require('fs');
const http = require('http');
const net = require('net');
const path = require('path');

const delay = milliseconds =>
  new Promise(resolve => setTimeout(resolve, milliseconds));

function request(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, { agent: false }, res => {
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        body += chunk;
      });
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.setTimeout(30000, () => req.destroy(new Error(`HTTP timeout: ${url}`)));
    req.on('error', reject);
  });
}

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function checkHmr(baseUrl) {
  const entry = path.resolve('app/app.js');
  const original = fs.readFileSync(entry);
  const probe = Buffer.concat([original, Buffer.from('\n')]);
  const agent = new http.Agent({ keepAlive: true, timeout: 0 });
  return new Promise((resolve, reject) => {
    let touched = false;
    let buffer = '';
    const req = http.get(`${baseUrl}/__webpack_hmr`, { agent }, res => {
      if (res.statusCode !== 200) {
        clearTimeout(timer);
        req.destroy();
        reject(new Error(`HMR returned ${res.statusCode}`));
        return;
      }
      if (
        !String(res.headers['content-type']).startsWith('text/event-stream')
      ) {
        clearTimeout(timer);
        req.destroy();
        reject(new Error('HMR endpoint did not return an event stream'));
        return;
      }
      res.setEncoding('utf8');
      res.on('end', () => {
        clearTimeout(timer);
        reject(
          new Error(`HMR stream ended before rebuilding (sync=${touched})`),
        );
      });
      res.on('data', chunk => {
        buffer += chunk;
        if (!touched && buffer.includes('"action":"sync"')) {
          touched = true;
          buffer = '';
          fs.writeFileSync(entry, probe);
        }
        if (touched && buffer.includes('"action":"built"')) {
          clearTimeout(timer);
          req.destroy();
          resolve();
        }
      });
    });
    const timer = setTimeout(() => {
      req.destroy();
      reject(
        new Error(
          `HMR did not publish a rebuild (sync=${touched}): ${buffer.slice(
            -500,
          )}`,
        ),
      );
    }, 120000);
    req.on('error', error => {
      clearTimeout(timer);
      reject(error);
    });
  }).finally(() => {
    agent.destroy();
    if (fs.readFileSync(entry).equals(probe)) {
      fs.writeFileSync(entry, original);
    }
  });
}

async function checkServer(mode) {
  const port = await availablePort();
  const baseUrl = `http://127.0.0.1:${port}`;
  let output = '';
  const child = spawn(process.execPath, ['server'], {
    env: { ...process.env, NODE_ENV: mode, HOST: '127.0.0.1', PORT: `${port}` },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  child.stdout.on('data', chunk => {
    output += chunk;
  });
  child.stderr.on('data', chunk => {
    output += chunk;
  });
  try {
    let page;
    const deadline = Date.now() + 180000;
    while (Date.now() < deadline) {
      if (child.exitCode !== null) {
        throw new Error(`Server exited: ${output}`);
      }
      try {
        page = await request(baseUrl);
        if (page.status === 200) break;
      } catch (error) {
        page = null;
      }
      await delay(1000);
    }
    assert(
      page && page.status === 200,
      `Server did not become ready: ${output}`,
    );
    const script = page.body.match(/<script[^>]+src=["']?([^"'\s>]+\.js)/);
    assert(script, 'The app shell must reference a JavaScript bundle');
    const bundle = await request(new URL(script[1], baseUrl));
    assert.strictEqual(bundle.status, 200);

    if (mode === 'development') {
      const route = await request(`${baseUrl}/features`);
      assert.strictEqual(route.status, 200);
      assert.strictEqual(route.body, page.body);
      await checkHmr(baseUrl);
    } else {
      const worker = await request(`${baseUrl}/sw.js`);
      assert.strictEqual(worker.status, 200);
      assert(
        worker.body.includes('assets'),
        'Offline worker must contain assets',
      );
      const files = fs.readdirSync(path.resolve('build'));
      assert(files.some(file => file.endsWith('.js.gz')));
      assert(
        files.some(
          file => file.startsWith('manifest') && file.endsWith('.json'),
        ),
      );
      assert(/rel=["']?manifest\b/.test(page.body));
      const icons = files.filter(file => /^icon_\d+x\d+.*\.png$/.test(file));
      assert(icons.length > 0);
      icons.forEach(file => {
        const [, width, height] = file.match(/^icon_(\d+)x(\d+)/);
        const png = fs.readFileSync(path.resolve('build', file));
        assert.strictEqual(png.readUInt32BE(16), Number(width));
        assert.strictEqual(png.readUInt32BE(20), Number(height));
      });
    }
    process.stdout.write(
      `${mode}: shell, assets${
        mode === 'development'
          ? ', SPA fallback, HMR'
          : ', offline/PWA/gzip output'
      } passed\n`,
    );
  } catch (error) {
    throw new Error(`${error.stack}\nServer output:\n${output.slice(-8000)}`);
  } finally {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill();
      await new Promise(resolve => child.once('exit', resolve));
    }
  }
}

checkServer('development')
  .then(() => checkServer('production'))
  .catch(error => {
    process.stderr.write(`${error.stack}\n`);
    process.exitCode = 1;
  });
