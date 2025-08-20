import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "../../api/axios";
import type { RootState } from "../store/store";

export interface Client {
    id: string;
    name: string;
    phone?: string;
}

interface ClientsState {
    items: Client[];
    loading: boolean;
    error: string | null;
    selected: Client | null;
}

const initialState: ClientsState = {
    items: [],
    loading: false,
    error: null,
    selected: null,
};

export const fetchClients = createAsyncThunk<Client[], void, { state: RootState }>(
    "clients/fetchClients",
    async (_, { getState, rejectWithValue }) => {
        const token = getState().token.token;
        if (!token) return rejectWithValue("Токен не задан");

        try {
            const api = createApi(token);
            const response = await api.get("/contragents/", {
                params: { limit: 100, offset: 0, sort: "created_at:desc", add_tags: false },
            });
            return response.data.result;
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка при загрузке клиентов");
        }
    }
);

const clientsSlice = createSlice({
    name: "clients",
    initialState,
    reducers: {
        resetClient: state => {
            state.selected = null;
        },
        setSelectedClient(state, action: PayloadAction<Client | null>) {
            state.selected = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(fetchClients.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
            .addCase(fetchClients.rejected, (state, action) => { state.loading = false; state.error = action.payload as string || "Ошибка при загрузке клиентов"; });
    },
});

export const { setSelectedClient, resetClient } = clientsSlice.actions;
export default clientsSlice.reducer;
