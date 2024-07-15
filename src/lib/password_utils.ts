/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-unused-vars */

export default function generateRandomPassword(
  length: number,
  includeUppercase: boolean = true,
  includeSpecialChars: boolean = true,
  includeDigits: boolean = true
): string {
  let chars = "abcdefghijklmnopqrstuvwxyz";
  if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (includeSpecialChars) chars += "!@#$%^&*()-_+=<>?/{}~";
  if (includeDigits) chars += "0123456789";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  return password;
}
