import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "@/lib/firebase/auth";

export async function loginWithEmail(
  email: string,
  password: string
) {
  const credential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  return credential.user;
}

// Alias for compatibility with other parts of the app
export async function signInWithEmail(
  email: string,
  password: string
) {
  return loginWithEmail(email, password);
}