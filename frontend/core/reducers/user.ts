import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUserState } from "../../shared/types";

const initialState: IUserState = {
  _id: null,
  firstName: null,
  lastName: null,
  dateOfBirth: null,
  email: null,
  avatars: [],
  friends: [],
  backgroundColors: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUserState>) => {
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.friends = action.payload.friends;
      state.avatars = action.payload.avatars;
      state.backgroundColors = action.payload.backgroundColors;
    },
    logoutUser: (state) => {
      state._id = null;
      state.email = null;
      state.firstName = null;
      state.lastName = null;
      state.dateOfBirth = null;
      state.friends = [];
      state.avatars = [];
      state.backgroundColors = [];
    },
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
