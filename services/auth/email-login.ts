import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "@/lib/firebase/auth";

export async function emailLogin(
  email: string,
  password: string
) {
  const credential =
    await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

  return credential.user;
}
