import { dbService } from "./firebase"
import type { UserDoc, UserRole } from "./models"

/** Authenticates user via dbService (Firebase or Mock) */
export async function signInWithEmailAndPassword(
  email: string,
  password: string,
  role: UserRole,
): Promise<UserDoc> {
  return dbService.login(email, password, role)
}

/** Registers user via dbService (Firebase or Mock) */
export async function createUserWithEmailAndPassword(
  name: string,
  email: string,
  password: string,
  role: UserRole,
): Promise<UserDoc> {
  return dbService.register(name, email, password, role)
}

/** Signs user out via dbService (Firebase or Mock) */
export async function signOut(): Promise<void> {
  return dbService.logout()
}
