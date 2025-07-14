const compareBySelector = <T, X>(a: T, b: T, selector: (element: T) => X) => {
  const af = selector(a);
  const bf = selector(b);
  return af > bf ? 1 : af < bf ? -1 : 0;
};

export const sortBySelector = <T, X>(array: T[], selector: (element: T) => X, asc: boolean) => {
  return [...array].sort((a, b) => compareBySelector(a, b, selector) * (asc ? 1 : -1));
};

export const takeLast = <T>(array: T[], count?: number) => array.slice(-(count ?? 1));

export const takeFirst = <T>(array: T[], count?: number) => array.slice(0, count ?? 1);
