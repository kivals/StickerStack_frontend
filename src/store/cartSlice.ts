import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { CartState } from '../interfaces/CartState';
import { CartItem } from '../interfaces';
import { api } from '../utils/api/Api';
import { OrderItem } from '../interfaces/OrderItem';
import { pagePrice } from '../utils/constants';

const initialState: CartState = {
  cost: 0,
  totalAmount: 0,
  address: '',
  number_of_sheets: 1,
  cropping: false,
  items: [],
};

const uploadOrder = createAsyncThunk(
  'add_order',
  async (
    data: {
      cost: number;
      address: string;
      number: number;
      cropping: boolean;
      stickers: Array<OrderItem>;
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.uploadOrder(
        data.cost,
        data.address,
        data.number,
        data.cropping,
        data.stickers,
      );
      return { data: response.data };
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    addItems(state, action: { payload: Array<CartItem>; type: string }) {
      state.items.push(...action.payload);
    },
    addItem(state, action: { payload: CartItem; type: string }) {
      const indexCard = state.items.find((card) => card.id === action.payload.id);
      if (!indexCard) {
        state.items.push({ ...action.payload });
      }
    },
    deleteItem(state, action: { payload: number; type: string }) {
      state.items = state.items.filter((card) => card.id !== action.payload);
    },
    cleanCart(state) {
      state.items = [];
    },
    updateItem(state, action: { payload: CartItem; type: string }) {
      const { id, shape, amount, size, image } = action.payload;
      const indexCard = state.items.find((card) => card.id === id);
      if (indexCard) {
        indexCard.shape = shape;
        indexCard.amount = amount;
        indexCard.size = size;
        indexCard.image = image;
      }
    },
    updateCropping(state, action) {
      state.cropping = action.payload;
    },
    countTotal(state) {
      const sumAmount = state.items.reduce((acc, item) => acc + item.amount, 0);
      const sumCost = state.number_of_sheets * pagePrice;

      state.totalAmount = sumAmount;
      state.cost = sumCost;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(uploadOrder.fulfilled, (state, action) => {
      console.log(action.payload.data);
    });
  },
});

const cartSliceReducer = cartSlice.reducer;
const { addItem, addItems, deleteItem, cleanCart, updateItem, updateCropping, countTotal } =
  cartSlice.actions;

export {
  cartSliceReducer,
  addItems,
  addItem,
  deleteItem,
  cleanCart,
  updateItem,
  updateCropping,
  uploadOrder,
  countTotal,
};