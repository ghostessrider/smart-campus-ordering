export type CartItem = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

let cart: CartItem[] = [];
let selectedVendorId: string | null = null;

// Listener management for external store subscribers
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  // Return an unsubscribe function
  return () => {
    listeners.delete(listener);
  };
}

export function setCartVendorId(vendorId: string) {
  if (selectedVendorId && selectedVendorId !== vendorId && cart.length > 0) {
    cart = [];
  }
  selectedVendorId = vendorId;
  notifyListeners();
}

export function getCartVendorId() {
  return selectedVendorId;
}

export function addToCart(item: CartItem) {
  const existing = cart.find((i) => i.itemId === item.itemId);

  if (existing) {
    existing.quantity += item.quantity;
  } else {
    cart.push(item);
  }
  notifyListeners();
}

export function updateCartQuantity(itemId: string, quantity: number) {
  const item = cart.find((i) => i.itemId === itemId);

  if (item) {
    item.quantity = Math.max(1, quantity);
    notifyListeners();
  }
}

export function removeCartItem(itemId: string) {
  cart = cart.filter((item) => item.itemId !== itemId);
  if (cart.length === 0) {
    selectedVendorId = null;
  }
  notifyListeners();
}

export function getCart() {
  return cart;
}

export function clearCart() {
  cart = [];
  selectedVendorId = null;
  notifyListeners();
}
