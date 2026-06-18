"use client";

import { useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase/firestore";

export default function Home() {
  useEffect(() => {
    async function testFirestore() {
      try {
        const snapshot = await getDocs(collection(db, "test"));

        console.log(
          "Firestore connected. Documents:",
          snapshot.docs.length
        );
      } catch (error) {
        console.error("Firestore error:", error);
      }
    }

    testFirestore();
  }, []);

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Smart Campus Ordering</h1>
      <p>Testing Firestore connection...</p>
    </main>
  );
}
