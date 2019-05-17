import fetch from 'node-fetch';
import * as fs from 'fs';

const usersFilename = 'data/users.json';
const settingsFileName = 'data/settings.json';
const defaultSettings = { page: 1 };

run();
async function run() {
  const settings = readSettings();

  const page = settings.page;
  const newUsers = await getUsers(page);
  const users = readUsersFromFile();
  users.push(...newUsers);
  saveJSON(usersFilename, users);

  settings.page++;
  saveSettings(settings);

  console.log(`Added ${newUsers.length} users from page ${page}`);
}

function readUsersFromFile(): any[] {
  return readJSON(usersFilename) || [];
}

function readJSON(filename: string) {
  if (fs.existsSync(usersFilename)) {
    const json = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(json);
  }
}

function saveJSON(filename: string, obj) {
  const json = JSON.stringify(obj, undefined, 2);
  fs.writeFileSync(filename, json);
}

async function getUsers(page): Promise<any[]> {
  const res = await fetch(`https://reqres.in/api/users?page=${page}`);
  const data = await res.json();
  return data['data'];
}

function readSettings() {
  return readJSON(settingsFileName) || defaultSettings;
}

function saveSettings(settings) {
  saveJSON(settingsFileName, settings);
}
