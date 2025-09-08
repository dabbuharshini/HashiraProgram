const fs = require("fs");
const data = fs.readFileSync("testcase2.json");
const json = JSON.parse(data);
const n = json.keys.n;
const k = json.keys.k;
function bigIntFromString(str, base) {
  const b = BigInt(base);
  str = str.toLowerCase();
  const digits = "0123456789abcdefghijklmnopqrstuvwxyz";
  let result = 0n;
  for (const ch of str) {
    const d = BigInt(digits.indexOf(ch));
    result = result * b + d;
  }
  return result;
}
const points = [];
for (const key in json) {
  if (key !== "keys") {
    const x = BigInt(key);
    const base = parseInt(json[key].base);
    const y = bigIntFromString(json[key].value, base);
    points.push({ x, y });
  }
}
points.sort((a, b) => (a.x > b.x ? 1 : -1));
const selectedPoints = points.slice(0, k);
function gcd(a, b) {
  return b === 0n ? a : gcd(b, a % b);
}
function lagrangeInterpolation(points) {
  let secretNum = 0n; 
  let secretDen = 1n; 
  const n = points.length;

  for (let i = 0; i < n; i++) {
    const { x: xi, y: yi } = points[i];
    let num = 1n;
    let den = 1n;

    for (let j = 0; j < n; j++) {
      if (i !== j) {
        const xj = points[j].x;
        num *= -xj;
        den *= xi - xj;
      }
    }

    secretNum = secretNum * den + yi * num * secretDen;
    secretDen *= den;
  }

  const divisor = gcd(secretNum, secretDen);
  secretNum /= divisor;
  secretDen /= divisor;
  const secret = secretNum / secretDen;
  return secret < 0n ? -secret : secret;
}
const secret = lagrangeInterpolation(selectedPoints);
console.log("Secret (c):", secret.toString());
