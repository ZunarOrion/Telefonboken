export function nubmerNormalizer(raw: string): string {
  let phoneNumber = raw.trim();

  if (phoneNumber.startsWith("00")) phoneNumber = "+" + phoneNumber.slice(2);

  if (phoneNumber.startsWith("0")) phoneNumber = "+46" + phoneNumber.slice(1);

  if (!phoneNumber.startsWith("+")) phoneNumber = "+" + phoneNumber;

  return phoneNumber;
}
