export function getDateString() {
  const now = new Date();
  return `${now.getFullYear()}_${now.getUTCMonth() + 1}_${now.getUTCDate()}`;
}
