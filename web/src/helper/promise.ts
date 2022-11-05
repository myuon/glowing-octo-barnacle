export const sequential = async <T extends NonNullable<unknown>>(
  promises: (() => Promise<T>)[]
): Promise<T[]> => {
  const first = promises.shift();
  if (first == null) {
    return [];
  }

  const results: T[] = [];

  await (promises as (() => Promise<T | undefined>)[])
    // 末尾に空のPromiseがないと、最後のPromiseの結果をresultsにpushできないため
    .concat(() => Promise.resolve(undefined))
    .reduce(async (prev, next) => {
      const res = await prev;
      if (res !== undefined) {
        results.push(res);
      }
      return next();
    }, Promise.resolve<T | undefined>(first()));

  return results;
};
