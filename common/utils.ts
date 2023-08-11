export function generateUniqueRandomNumbers(count: number, n: number) {
  if (count > n) {
    throw new Error("Count cannot be greater than n.");
  }

  let uniqueNumbers = new Set<number>();

  while (uniqueNumbers.size < count) {
    let randomNumber = Math.floor(Math.random() * n);
    uniqueNumbers.add(randomNumber);
  }

  return Array.from(uniqueNumbers);
}
