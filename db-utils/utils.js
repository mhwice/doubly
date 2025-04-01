import { readFile } from 'fs/promises';
import { customAlphabet } from "nanoid";

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function loadLocationData() {
  try {
    const data = await readFile(new URL('./location.json', import.meta.url), 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    console.error('Error reading or parsing the file:', err);
  }
}

// to determine change of collision
// https://zelark.github.io/nano-id-cc/
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 30);
export function makeCode(len = 12) {
  try {
    return nanoid(len);
  } catch (error) {
    return null;
  }

}

export function makeShortUrl(code) {
  return `${env.APP_URL}/${code}`;
}

export function getRandomDate(start = new Date(1980, 0, 1), end = new Date()) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
