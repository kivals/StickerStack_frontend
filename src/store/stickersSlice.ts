import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { IStickersState } from '../interfaces/IStickersState';
import { cartApi } from '../utils/api/CartApi';
import { ISticker } from '../interfaces/ISticker';
import { calculateStickerOnList } from '../utils/calculateStickerOnList';
import { pageSizePx } from '../utils/constants';

export const getStickers = createAsyncThunk(
  'sticker/getStickers',
  async (_, { rejectWithValue }) => {
    try {
      return await cartApi.getCart();
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const clearStickers = createAsyncThunk('clear_cart', async (data, { rejectWithValue }) => {
  try {
    return await cartApi.clearCart();
  } catch (err) {
    return rejectWithValue(err);
  }
});

export const putStickerInCart = createAsyncThunk(
  'sticker/putStickerInCart',
  async (sticker: ISticker, { rejectWithValue }) => {
    try {
      return await cartApi.putStickerInCart(sticker);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const addStickers = createAsyncThunk(
  'sticker/addStickers',
  async (stickers: Array<ISticker>, { rejectWithValue }) => {
    try {
      return await cartApi.addStickers(stickers);
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

export const deleteSticker = createAsyncThunk(
  'sticker/deleteSticker',
  async (id: string, { rejectWithValue }) => {
    try {
      await cartApi.deleteSticker(id);
      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  },
);

// Добавить pages массив для посчитаных стикеров
const initialState: IStickersState = {
  stickers: [
    {
      id: 'newSticker',
      image: '',
      shape: 'square',
      amount: 1,
      width: 5,
      height: 5,
      optimal_width: 5,
      optimal_height: 5,
    },
  ],
  pages: [],
};

const stickerSlice = createSlice({
  name: 'sticker',
  initialState,
  reducers: {
    updateSticker(state, action) {
      state.stickers = state.stickers.map((sticker) => {
        if (sticker.id === action.payload.id) {
          sticker = action.payload;
        }
        return sticker;
      });
    },
    removeAllStickers(state) {
      state.stickers = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStickers.fulfilled, (state, action) => {
      state.stickers = [
        ...action.payload,
        {
          id: 'newSticker',
          image: '',
          shape: 'square',
          amount: 1,
          width: 5,
          height: 5,
          optimal_width: 5,
          optimal_height: 5,
        },
      ];

      state.pages = calculateStickerOnList(
        state.stickers.slice(0, state.stickers.length - 1),
        pageSizePx,
      );
    });
    builder.addCase(putStickerInCart.fulfilled, (state, action) => {
      state.stickers = state.stickers.map((sticker) => {
        if (sticker.id === action.payload.id) {
          sticker = action.payload;
        }
        return sticker;
      });

      state.pages = calculateStickerOnList(
        state.stickers.slice(0, state.stickers.length - 1),
        pageSizePx,
      );
    });
    builder.addCase(clearStickers.fulfilled, (state) => {
      state.stickers = [];
    });
    builder.addCase(deleteSticker.fulfilled, (state, action) => {
      state.stickers = state.stickers.filter((sticker) => sticker.id !== action.payload);

      state.pages = calculateStickerOnList(
        state.stickers.slice(0, state.stickers.length - 1),
        pageSizePx,
      );
    });
  },
});

export const stickerSliceReducer = stickerSlice.reducer;
export const { updateSticker, removeAllStickers } = stickerSlice.actions;