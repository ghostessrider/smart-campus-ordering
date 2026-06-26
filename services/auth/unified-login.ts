import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";


import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";


import {
  auth,
  initAuth
} from "@/lib/firebase/auth";


import {
  db
} from "@/lib/firebase/firestore";





export async function signInUnified(){



  await initAuth();




  const provider =
    new GoogleAuthProvider();




  const result =
    await signInWithPopup(
      auth,
      provider
    );




  const user =
    result.user;




  const email =
    user.email?.toLowerCase();




  if(!email){


    throw new Error(
      "No email found"
    );


  }







  /*
    ADMIN CHECK
  */


  const adminQuery =
    query(

      collection(
        db,
        "admins"
      ),

      where(
        "uid",
        "==",
        user.uid
      )

    );



  const adminSnap =
    await getDocs(
      adminQuery
    );



  if(!adminSnap.empty){


    return {

      role:"admin",

      user

    };


  }









  /*
    VENDOR CHECK
  */


  const vendorQuery =
    query(

      collection(
        db,
        "vendors"
      ),

      where(
        "email",
        "==",
        email
      )

    );




  const vendorSnap =
    await getDocs(
      vendorQuery
    );




  if(!vendorSnap.empty){


    const vendorDoc =
      vendorSnap.docs[0];

    // NOTE: schema has no account-suspension flag for vendors today —
    // `status` is open/closed for the *store*, not the account, so a
    // closed store can still log in to reopen itself. If account-level
    // suspension is ever needed, that is a separate schema decision.

    return {


      role:"vendor",

      vendorId: vendorDoc.id,

      user


    };



  }









  /*
    STUDENT CHECK
  */



  if(
    email.endsWith(
      "@iitbhilai.ac.in"
    )
  ){



    const userRef =
      doc(

        db,

        "users",

        user.uid

      );




    const userSnap =
      await getDoc(
        userRef
      );




    if(!userSnap.exists()){



      await setDoc(

        userRef,

        {

          uid:user.uid,


          name:
          user.displayName || "",


          email:
          user.email,


          phone:"",


          role:"student",


          createdAt:
          new Date(),


          updatedAt:
          new Date()

        }

      );



    }






    return {


      role:"student",

      user


    };



  }







  throw new Error(
    "Access denied"
  );


}