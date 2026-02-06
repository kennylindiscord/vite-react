import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export function hashPassword(plain: string): string {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(plain, salt);
}

export function verifyPassword(plain: string, hash: string): boolean {
  return bcrypt.compareSync(plain, hash);
}

