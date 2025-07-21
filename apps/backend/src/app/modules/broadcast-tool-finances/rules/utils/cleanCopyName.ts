export function cleanCopyName(copyName: string): string {
  const nameMatch = copyName.match(/^[a-zA-Z]+/);
  const product = nameMatch ? nameMatch[0] : "";
  const liftMatch = copyName.match(/[a-zA-Z]+(\\d+)/);
  const productLift = liftMatch ? liftMatch[1] : "";
  return `${product}${productLift}`;
}
