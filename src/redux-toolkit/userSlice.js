import { createSlice } from '@reduxjs/toolkit';

const savedAuth = localStorage?.getItem("auth");

const userSlice = createSlice({
    name: "user",
    initialState: JSON.parse(savedAuth) || null,
    reducers: {
        addUser: (state, action) => {
            return action.payload;
        },
        removeUser: () => {
            return null;
        }
    }
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;