// functions/payout.ts
// Firebase Cloud Function to payout order amount to vendor's UPI ID using Razorpay (test mode)
// This file assumes you have Firebase Functions set up in the project.

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Razorpay from 'razorpay';

admin.initializeApp();
const db = admin.firestore();

// Razorpay credentials – set in environment variables (Firebase functions config or .env)
const razorpay = new Razorpay({
  key_id: functions.config().razorpay.key_id || process.env.RAZORPAY_KEY_ID,
  key_secret: functions.config().razorpay.key_secret || process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Cloud Function triggered on order payment status change.
 * When an order's paymentStatus becomes "paid" and payout hasn't been done yet,
 * it creates a UPI payout to the vendor's UPI ID stored in the vendor document.
 */
export const payoutOnPaid = functions.firestore
  .document('orders/{orderId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Proceed only when paymentStatus transitioned to 'paid' and payout not already done
    if (before?.paymentStatus !== 'paid' && after?.paymentStatus === 'paid' && !after?.payoutDone) {
      const orderId = context.params.orderId;
      const vendorId = after.vendorId as string;
      const amountInPaise = Math.round((after.total as number) * 100); // Razorpay expects amount in paise

      // Fetch vendor UPI ID
      const vendorSnap = await db.collection('vendors').doc(vendorId).get();
      if (!vendorSnap.exists) {
        console.error(`Vendor ${vendorId} not found for payout.`);
        return null;
      }
      const vendorData = vendorSnap.data();
      const upiId = vendorData?.upiId as string;
      if (!upiId) {
        console.error(`Vendor ${vendorId} does not have a UPI ID.`);
        return null;
      }

      try {
        // NOTE: Razorpay's payout API for UPI is available in the Production account.
        // In test mode, the API will simulate a payout and return a mock response.
        // The request format follows Razorpay's documentation.
        const payoutResponse = await razorpay.transfers.create({
          account_number: upiId, // UPI ID of the vendor
          amount: amountInPaise,
          currency: 'INR',
          mode: 'UPI', // Specify UPI mode
          purpose: 'payout',
          reference_id: orderId,
          notes: {
            order_id: orderId,
            vendor_id: vendorId,
          },
        });

        // Mark payout as done on the order document
        await db.collection('orders').doc(orderId).update({
          payoutDone: true,
          payoutDetails: payoutResponse,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        console.log(`Payout successful for order ${orderId}:`, payoutResponse);
      } catch (err) {
        console.error(`Payout failed for order ${orderId}:`, err);
        // Optionally, you could write the error back to the order document for later inspection
        await db.collection('orders').doc(orderId).update({
          payoutError: (err as any).toString(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }
    return null;
  });
