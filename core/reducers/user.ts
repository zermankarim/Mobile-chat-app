import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../shared/types";

const initialState: IUserState = {
  uid: null,
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  email: null,
  avatar: null,
  friends: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<IUserState>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.dateOfBirth = action.payload.dateOfBirth;

      state.friends = action.payload.friends;

      state.avatar = action.payload.avatar;
    },
    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.dateOfBirth = null;

      state.friends = [];

      state.avatar = null;
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
