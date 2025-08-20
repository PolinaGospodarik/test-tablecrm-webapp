import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TokenState {
    token: string;
}

const DEFAULT_TOKEN = 'ee11a697097d6abebc25c4041b9a3243ea93e2d75b84f4114da318d8b6f74bbc';

const initialState: TokenState = { token: DEFAULT_TOKEN };

const tokenSlice = createSlice({
    name: "token",
    initialState,
    reducers: {
        setToken(state, action: PayloadAction<string>) {
            state.token = action.payload;
        },
    },
});

export const { setToken } = tokenSlice.actions;
export default tokenSlice.reducer;
