import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { app } from "./firebase";


export const auth = getAuth(app);


export async function initAuth() {

  if (typeof window !== "undefined") {

    await setPersistence(
      auth,
      browserLocalPersistence
    );

  }

}