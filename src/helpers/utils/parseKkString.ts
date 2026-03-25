export const parseKkString = (
  stringWithKk: string,
  errorMessage: string = 'Invalid string format',
): number => {
  const match = stringWithKk.match(/^([\d.]+)(k+)?$/i);

  if (!match) {
    throw new Error(errorMessage);
  }

  const number = parseFloat(match[1]);
  const kCount = match[2] ? match[2].length : 0;
  const multiplier = Math.pow(1000, kCount);

  return number * multiplier;
};
