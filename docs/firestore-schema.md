# Firestore Schema V1

## users

```plaintext
users/{uid}
```

```ts
{
  uid,
  role,
  email,
  name?,
  ownerName?,
  studentId?,
  createdAt,
  updatedAt
}
```

---

## stores

```plaintext
stores/{storeId}
```

```ts
{
  ownerUid,
  storeName,
  imageUrl,
  relativeLocation,
  phoneNumber,
  isOpen,
  isSuspended,
  createdAt,
  updatedAt
}
```

---

## categories

```plaintext
stores/{storeId}/categories/{categoryId}
```

```ts
{
  storeId,
  name,
  isSystemCategory,
  createdAt,
  updatedAt
}
```

---

## menuItems

```plaintext
stores/{storeId}/menuItems/{itemId}
```

```ts
{
  storeId,
  categoryId,
  name,
  peripherals,
  imageUrl,
  price,
  prepTime,
  availability,
  rating,
  createdAt,
  updatedAt
}
```

---

## carts

```plaintext
carts/{userId}
```

```ts
{
  userId,
  items[],
  updatedAt
}
```

---

## orderGroups

```plaintext
orderGroups/{groupId}
```

```ts
{
  studentUid,
  totalAmount,
  createdAt
}
```

---

## orders

```plaintext
orders/{orderId}
```

```ts
{
  orderGroupId,
  studentUid,
  vendorId,
  vendorName,
  items[],
  status,
  rejectionReason,
  createdAt,
  acceptedAt,
  readyAt,
  completedAt
}
```

---

## feedback

```plaintext
feedback/{feedbackId}
```

```ts
{
  orderId,
  studentUid,
  vendorId,
  comment,
  createdAt
}
```

---

## menuChangeRequests

```plaintext
menuChangeRequests/{requestId}
```

```ts
{
  vendorId,
  storeId,
  changeType,
  targetId,
  payload,
  status,
  reviewedBy,
  reviewComment,
  createdAt,
  reviewedAt
}
```

```
```
