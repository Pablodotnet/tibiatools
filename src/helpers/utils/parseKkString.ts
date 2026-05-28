export const parseKkString = (
  stringWithKk: string,
): number => {
  if (!stringWithKk) return NaN;

  const match = stringWithKk.replace(/,/g, '').match(/^([\d.]+)(k+)?$/i);

  if (!match) {
    return NaN;
  }

  const number = parseFloat(match[1]);
  const kCount = match[2] ? match[2].length : 0;
  const multiplier = Math.pow(1000, kCount);

  return number * multiplier;
};
