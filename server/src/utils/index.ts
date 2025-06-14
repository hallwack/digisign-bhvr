export async function verifyHash(hash: string, password: string) {
  const passwordHash = await Bun.password.verify(password, hash);
  return passwordHash;
}

export async function generateHash(password: string) {
  const passwordHash = await Bun.password.hash(password);
  return passwordHash;
}
