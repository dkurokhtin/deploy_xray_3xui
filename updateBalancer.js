require('dotenv').config();
const { Client } = require('ssh2');
const https = require('https');

async function getPublicIP() {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data.trim()));
    }).on('error', reject);
  });
}

(async () => {
  const ip = await getPublicIP();
  const conn = new Client();
  conn.on('ready', () => {
    const cmd = `sudo sed -i '/stream {/,/}/s/upstream backend {/upstream backend {\n    server ${ip};/' /etc/nginx/nginx.conf && sudo systemctl restart nginx`;
    conn.exec(cmd, (err, stream) => {
      if (err) throw err;
      stream.on('close', () => {
        conn.end();
        console.log('Balancer updated');
      }).stderr.on('data', data => console.error('STDERR: ' + data));
    });
  }).connect({
    host: process.env.BALANCER_IP,
    username: process.env.SSH_USER,
    privateKey: require('fs').readFileSync(process.env.SSH_KEY_PATH)
  });
})();
