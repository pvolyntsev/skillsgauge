const charlist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('');
const charlistLength = charlist.length;

export function pseudoRandom(lenght) {
  const str = [];
  for (let i = 0; i < lenght; i++) {
    str.push(charlist[Math.floor(Math.random() * charlistLength)]);
  }
  return str.join('');
}
