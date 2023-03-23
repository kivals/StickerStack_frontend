import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../utils/api';

const signUp = createAsyncThunk('user/signUp',
  async (data: { email: string; password: string }) => {
    const response = await api.signUp(data.email, data.password);
    return response;
  }
);

const signIn = createAsyncThunk('user/signIn',
  async (data: { email: string; password: string }) => {
    const response = await api.signIn(data.email, data.password);
    return response;
  }
);

const logOut = createAsyncThunk('user/logOut', async () => {
  const response = await api.logOut();
  return response;
});

const getUser = createAsyncThunk('user/getUser', async () => {
  const response = await api.getUser();
  return response;
});

const updateUser = createAsyncThunk('user/updateUser',
  async (data: { email: string; password: string }) => {
    const response = await api.updateUser(data.email, data.password);
    return response.data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    email: '',
    isLogged: false,
    loading: false,
    success: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    // Регистрация пользователя
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signUp.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    });
    builder.addCase(signUp.rejected, (state) => {
      state.loading = false;
    });

    // Вход пользователя
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signIn.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.isLogged = true;
    });
    builder.addCase(signIn.rejected, (state) => {
      state.loading = false;
    });

    // Получение юзера, если есть token
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;
      state.email = action.payload.email;
      state.isLogged = true;
    });
    builder.addCase(getUser.rejected, (state) => {
      state.loading = false;
      state.success = false;
      state.email = '';
      state.isLogged = false;
    })

    // Выход пользователя, если есть token
    builder.addCase(logOut.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logOut.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
      state.email = '';
      state.isLogged = false;
    });
    builder.addCase(logOut.rejected, (state) => {
      state.loading = false;
      state.success = false;
    });
  }
});

const userSliceReducer = userSlice.reducer;

export { userSliceReducer, getUser, updateUser, logOut, signIn, signUp };