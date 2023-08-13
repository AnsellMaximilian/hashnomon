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

export function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function rollChance(percentage: number) {
  if (percentage < 0 || percentage > 100) {
    throw new Error("Percentage must be a number between 0 and 100.");
  }

  const randomValue = Math.random() * 100;

  return randomValue <= percentage;
}
