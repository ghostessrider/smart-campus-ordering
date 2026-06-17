export const DUMMY_STORES = [
  { id: "1", name: "Canteen 1", category: "Indian Food", rating: 4.2, deliveryTime: "15-20 min", imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop" },
  { id: "2", name: "Nescafe", category: "Coffee & Snacks", rating: 4.5, deliveryTime: "10-15 min", imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2047&auto=format&fit=crop" },
  { id: "3", name: "Amul Parlour", category: "Dairy & Ice Cream", rating: 4.8, deliveryTime: "5-10 min", imageUrl: "https://images.unsplash.com/photo-1586816001966-79b736744398?q=80&w=2070&auto=format&fit=crop" },
];

export const DUMMY_PRODUCTS: Record<string, { id: string; name: string; description: string; price: number }[]> = {
  "1": [
    { id: "p1_1", name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato curry.", price: 60 },
    { id: "p1_2", name: "Idli Sambar", description: "Soft steamed rice cakes served with lentil soup.", price: 40 },
    { id: "p1_3", name: "Veg Fried Rice", description: "Wok-tossed rice with fresh vegetables.", price: 80 },
    { id: "p1_4", name: "Paneer Butter Masala", description: "Rich and creamy curry made with paneer, spices, onions, tomatoes, cashews and butter.", price: 120 },
  ],
  "2": [
    { id: "p2_1", name: "Cold Coffee", description: "Refreshing cold coffee blended with ice cream.", price: 50 },
    { id: "p2_2", name: "Masala Maggi", description: "Classic Maggi noodles with extra spices.", price: 30 },
    { id: "p2_3", name: "Grilled Cheese Sandwich", description: "Crispy bread layered with melting cheese.", price: 45 },
    { id: "p2_4", name: "Hot Chocolate", description: "Rich and creamy hot chocolate.", price: 40 },
  ],
  "3": [
    { id: "p3_1", name: "Amul Butter Milk", description: "Refreshing spiced buttermilk.", price: 15 },
    { id: "p3_2", name: "Vanilla Ice Cream", description: "Classic vanilla scoop.", price: 25 },
    { id: "p3_3", name: "Chocolate Cone", description: "Crispy cone filled with chocolate ice cream.", price: 40 },
    { id: "p3_4", name: "Cheese Slices (Pack of 10)", description: "Amul cheese slices.", price: 130 },
  ],
};
