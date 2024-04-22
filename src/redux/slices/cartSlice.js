import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [],
  totalAmount: 0,
  totalQuantity: 0,
};

const loadCartFromStorage = () => {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (cartItems) {
    const totalAmount = cartItems.reduce(
      (total, item) => total + Number(item.price) * Number(item.quantity),
      0
    );
    const totalQuantity = cartItems.reduce(
      (total, item) => total + Number(item.quantity),
      0
    );
    return { cartItems, totalAmount, totalQuantity };
  } else {
    return initialState;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: loadCartFromStorage(),
  reducers: {
    addItem: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item.id === newItem.id
      );

      state.totalQuantity++;

      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          productName: newItem.productName,
          imgUrl: newItem.imgUrl,
          price: newItem.price,
          size: newItem.size,
          quantity: 1,
          totalPrice: newItem.price,
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) + Number(newItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },
    deleteItem: (state, action) => {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;

        state.totalAmount = state.cartItems.reduce(
          (total, item) => total + Number(item.price) * Number(item.quantity),
          0
        );

        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      }
    },
  },
});

export const cartActions = cartSlice.actions;

export default cartSlice.reducer;
