const formatCount = (count: number | undefined, noun: string, empty: string) => {
  if (!count || count === 0) return empty;
  if (count === 1) return `${count} ${noun}`;
  if (count > 1) return `${count} ${noun}s`;
  return '';
};

export default formatCount;
