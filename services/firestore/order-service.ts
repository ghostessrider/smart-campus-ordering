import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  runTransaction,
  onSnapshot,
} from "firebase/firestore";

import { db } from "@/lib/firebase/firestore";
import { OrderStatus } from "@/constants/enums";
import { VendorOrder } from "@/types/order";

type CreateOrderPayload = {
  vendorId: string;
  userId: string;
  items: Array<{ itemId: string; name: string; price: number; quantity: number }>;
  total: number;
  status?: string;
  paymentStatus?: string;
  [key: string]: unknown;
};

// STUDENT: create order

export async function createOrder(order: CreateOrderPayload) {
  if (!order.vendorId) {
    throw new Error("Order must include a vendorId to generate vendor-relative orderNumber.");
  }

  const ordersCollection = collection(db, "orders");
  const orderRef = doc(ordersCollection);
  const vendorRef = doc(db, "vendors", order.vendorId);

  await runTransaction(db, async (transaction) => {
    const vendorSnapshot = await transaction.get(vendorRef);
    if (!vendorSnapshot.exists()) {
      throw new Error(`Vendor ${order.vendorId} not found for order creation.`);
    }

    const vendorData = vendorSnapshot.data() as { queueNumber?: number | string };
    const currentQueueNumber = Number(vendorData.queueNumber ?? 0);
    const nextOrderNumber = currentQueueNumber + 1;

    transaction.update(vendorRef, {
      queueNumber: nextOrderNumber,
    });

    transaction.set(orderRef, {
      ...order,
      orderNumber: String(nextOrderNumber),
      status: "pending",
      paymentStatus: "pending",
      paymentUTR: null,
      createdAt: serverTimestamp(),
      acceptedAt: null,
      completedAt: null,
      deliveredAt: null,
      updatedAt: serverTimestamp(),
    });
  });

  return orderRef.id;
}

// STUDENT: cancel own order — only allowed while status is still "pending",
// i.e. before the vendor has accepted it. Enforced here via a transaction
// read-check, not just trusted from the client.
export async function cancelOrder(orderId: string, userId: string) {
  const ref = doc(db, "orders", orderId);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);

    if (!snapshot.exists()) {
      throw new Error("Order not found.");
    }

    const orderData = snapshot.data();

    if (orderData.userId !== userId) {
      throw new Error("You can only cancel your own orders.");
    }

    if (orderData.status !== "pending") {
      throw new Error(
        "This order has already been accepted and can no longer be cancelled."
      );
    }

    transaction.update(ref, {
      status: "cancelled",
      updatedAt: serverTimestamp(),
    });
  });
}

// STUDENT: get own orders

export async function getStudentOrders(
  userId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "userId",
      "==",
      userId
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );


}







// VENDOR: get pending orders

// VENDOR: get pending orders

export async function getPendingOrders(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "status",
      "==",
      "pending"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );

}



export async function getAcceptedOrders(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "status",
      "==",
      "accepted"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );

}

export async function getCompletedOrders(
  vendorId:string
){


  const q =
  query(

    collection(
      db,
      "orders"
    ),


    where(
      "vendorId",
      "==",
      vendorId
    ),


    where(
      "status",
      "==",
      "completed"
    )

  );



  const snapshot =
  await getDocs(q);



  return snapshot.docs.map(
    (order)=>({

      id:order.id,

      ...order.data()

    })
  );

}



export async function updateOrderStatus(
  orderId: string,
  status: Exclude<OrderStatus, "pending" | "rejected">
) {
  const ref = doc(db, "orders", orderId);

  const updateData: {
    status: string;
    updatedAt: ReturnType<typeof serverTimestamp>;
    acceptedAt?: ReturnType<typeof serverTimestamp>;
    preparingAt?: ReturnType<typeof serverTimestamp>;
    readyAt?: ReturnType<typeof serverTimestamp>;
    completedAt?: ReturnType<typeof serverTimestamp>;
    deliveredAt?: ReturnType<typeof serverTimestamp>;
  } = {
    status,
    updatedAt: serverTimestamp(),
  };

  if (status === "accepted") {
    updateData.acceptedAt = serverTimestamp();
  }

  if (status === "preparing") {
    updateData.preparingAt = serverTimestamp();
  }

  if (status === "ready_for_pickup") {
    updateData.readyAt = serverTimestamp();
  }

  if (status === "completed") {
    updateData.completedAt = serverTimestamp();
  }

  if (status === "delivered") {
    updateData.deliveredAt = serverTimestamp();
  }

  await updateDoc(ref, updateData);
}

// VENDOR: reject a pending order with a required reason.
// Kept separate from updateOrderStatus since rejection always needs
// rejectionReason — this is enforced here, not left optional.
export async function rejectOrder(orderId: string, reason: string) {
  const trimmedReason = reason.trim();

  if (!trimmedReason) {
    throw new Error("A rejection reason is required.");
  }

  const ref = doc(db, "orders", orderId);

  await updateDoc(ref, {
    status: "rejected",
    rejectionReason: trimmedReason,
    updatedAt: serverTimestamp(),
  });
}

export function listenToVendorOrders(
  vendorId: string,
  callback: (orders: VendorOrder[]) => void
) {
  const q = query(collection(db, "orders"), where("vendorId", "==", vendorId));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map((order) => ({
      id: order.id,
      ...order.data(),
    })) as VendorOrder[];
    callback(orders);
  });

  return unsubscribe;
}