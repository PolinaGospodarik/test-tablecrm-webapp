import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface NomenclatureItem {
    id: number;
    name: string;
    short_name: string;
    price?: number;
    unit_id?: number;
    unit_name?: string;
    tax?: number;
}

interface NomenclatureState {
    items: NomenclatureItem[];
    loading: boolean;
    error: string | null;
    selected: NomenclatureItem[];
}

const initialState: NomenclatureState = {
    items: [],
    loading: false,
    error: null,
    selected: [],
};

export const fetchNomenclature = createAsyncThunk(
    'nomenclature/fetchNomenclature',
    async (token: string) => {
        const response = await axios.get(`https://app.tablecrm.com/api/v1/nomenclature/`, {
            params: { token, limit: 100, offset: 0, with_prices: true, with_balance: false, with_attributes: false, only_main_from_group: false },
        });
        return response.data.result;
    }
);

const nomenclatureSlice = createSlice({
    name: 'nomenclature',
    initialState,
    reducers: {
        setSelectedNomenclature: (state, action: PayloadAction<NomenclatureItem[]>) => {
            state.selected = action.payload;
        },
        resetNomenclature: state => {
            state.selected = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNomenclature.pending, (state) => { state.loading = true; })
            .addCase(fetchNomenclature.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; state.error = null; })
            .addCase(fetchNomenclature.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to fetch nomenclature'; });
    },
});

export const { setSelectedNomenclature, resetNomenclature } = nomenclatureSlice.actions;
export default nomenclatureSlice.reducer;
