// Block input style: a full-width background-colored input area with a `›`
// prompt that adapts to the terminal theme (see terminal-bg.ts). Raw mode.

const WHITE = '\x1b[97m';
const RESET = '\x1b[0m';

export function styledReadLine(bg: string): Promise<string> {
  return new Promise((resolve) => {
    let line = '';
    let first = true;

    function draw() {
      if (first) {
        process.stdout.write(`\n${bg}\x1b[K${RESET}\n`);
        process.stdout.write(`${bg}\x1b[K ${WHITE}›${RESET}${bg}${WHITE} ${line}${RESET}\n`);
        process.stdout.write(`${bg}\x1b[K${RESET}\x1b[1A\r\x1b[4G`);
        first = false;
      } else {
        process.stdout.write(`\r\x1b[2K`);
        process.stdout.write(`${bg}\x1b[K ${WHITE}›${RESET}${bg}${WHITE} ${line}${RESET}`);
      }
    }

    draw();

    process.stdin.setRawMode(true);
    process.stdin.resume();

    const onData = (data: Buffer) => {
      const str = data.toString('utf-8');
      if (str.startsWith('\x1b')) return;
      for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);
        if (code === 13 || code === 10) {
          process.stdin.off('data', onData);
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write(`${RESET}\n`);
          resolve(line);
          return;
        } else if (code === 127 || code === 8) {
          line = line.slice(0, -1);
          draw();
        } else if (code === 3) {
          process.stdout.write(`${RESET}\n`);
          process.exit(0);
        } else if (code >= 32) {
          line += str[i];
          draw();
        }
      }
    };

    process.stdin.on('data', onData);
  });
}
