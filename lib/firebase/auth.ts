import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

import { app } from "./firebase";


export const auth = getAuth(app);


if (typeof window !== "undefined") {

  setPersistence(
    auth,
    browserLocalPersistence
  );

}