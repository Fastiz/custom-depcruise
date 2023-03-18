export const isLiteralObject = (a: unknown): a is object => {
  // eslint-disable-next-line
  return !!a && a.constructor === Object;
}
