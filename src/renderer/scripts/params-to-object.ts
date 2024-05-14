const paramsToObject = (entries: IterableIterator<[string, string]> | undefined) => {
  if (!entries) return undefined;
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
};

export default paramsToObject;
