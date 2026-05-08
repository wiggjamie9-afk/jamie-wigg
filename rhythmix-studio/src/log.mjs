const C = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

const tty = process.stdout.isTTY;
const paint = (color, s) => (tty ? `${color}${s}${C.reset}` : s);

export const log = {
  info: (msg) => console.log(`${paint(C.cyan, "ℹ")} ${msg}`),
  ok: (msg) => console.log(`${paint(C.green, "✓")} ${msg}`),
  warn: (msg) => console.log(`${paint(C.yellow, "!")} ${msg}`),
  err: (msg) => console.error(`${paint(C.red, "✗")} ${msg}`),
  step: (n, total, msg) =>
    console.log(`${paint(C.dim, `[${n}/${total}]`)} ${msg}`),
  json: (obj) => console.log(paint(C.dim, JSON.stringify(obj, null, 2))),
  header: (msg) => console.log(`\n${paint(C.bold + C.magenta, msg)}\n`),
  cost: (label, usd) =>
    console.log(`${paint(C.yellow, "$")} ${label}: ${paint(C.bold, `$${usd.toFixed(2)}`)}`),
};
