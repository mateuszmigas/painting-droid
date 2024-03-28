export const sizeToString = (size: number) => {
  if (size > 1_000_000_000_000) {
    return `${Math.round((10 * size) / 1_000_000_000_000) / 10} TB`;
  }
  if (size > 1_000_000_000) {
    return `${Math.round((10 * size) / 1_000_000_000) / 10} GB`;
  }
  if (size > 1_000_000) {
    return `${Math.round((10 * size) / 1_000_000) / 10} MB`;
  }
  if (size > 1_000) {
    return `${Math.round((10 * size) / 1_000) / 10} KB`;
  }
  return `${Math.round(10 * size) / 10} B`;
};
