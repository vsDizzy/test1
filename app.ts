import * as express from 'express';
import fetch from 'node-fetch';
import * as fs from 'fs';

const app = express();

app.get('/api/user/:userId', async (req, res) => {
  const userId = req.params['userId'];
  res.json(await getUser(userId));
});

app.get('/api/user/:userId/avatar', async (req, res) => {
  const userId = req.params['userId'];

  let data: Buffer;
  const filename = `avatars/${userId}`;
  if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename);
  } else {
    const user = await getUser(userId);

    const avatar = user['data']['avatar'];
    const r = await fetch(avatar);
    data = await r.buffer();
    fs.writeFileSync(filename, data);
  }

  res.end(data.toString('base64'));
});

app.delete('/api/user/:userId/avatar', (req, res) => {
  const userId = req.params['userId'];
  const filename = `avatars/${userId}`;
  fs.unlinkSync(filename);
});

app.listen(3000, () => {
  console.info('Server started.');
});

async function getUser(userId) {
  const res = await fetch(`https://reqres.in/api/users/${userId}`);
  return await res.json();
}
