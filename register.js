require('dotenv').config();
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
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
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const passwordHash = await bcrypt.hash(process.env.XUI_PASSWORD, 10);
  const ip = await getPublicIP();
  await db.collection('servers').insertOne({
    ip,
    region: process.env.SERVER_REGION,
    passwordHash,
    createdAt: new Date()
  });
  await client.close();
  console.log('Server registered');
})();
