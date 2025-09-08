const fs = require("fs");
const data = fs.readFileSync("testcase2.json");
const json = JSON.parse(data);
const n = json.keys.n;
const k = json.keys.k;
const points = [];
for (const key in json) {
  if (key !== "keys") {
    const x = parseInt(key);
    const base = parseInt(json[key].base);
    const y = parseInt(json[key].value, base);
    points.push({ x, y });
  }
}
points.sort((a, b) => a.x - b.x);
const selectedPoints = points.slice(0, k);
function lagrangeInterpolation(points) {
  let secret = 0;

  for (let i = 0; i < points.length; i++) {
    let { x: xi, y: yi } = points[i];
    let li = 1;
    for (let j = 0; j < points.length; j++) {
      if (i !== j) {
        let xj = points[j].x;
        li *= (0 - xj) / (xi - xj);
      }
    }
    secret += yi * li;
  }
  return Math.round(secret);
}
const secret = lagrangeInterpolation(selectedPoints);

console.log("Secret (c):", secret);
