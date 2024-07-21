import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../shared/types";

const initialState: IUserState = {
  uid: null,
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  email: null,
  avatars: [],
  friends: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.dateOfBirth = action.payload.dateOfBirth;

      state.friends = action.payload.friends;

      state.avatars = action.payload.avatars;
    },
    logoutUser: (state) => {
      state.uid = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.dateOfBirth = null;

      state.friends = [];

      state.avatars = [];
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
