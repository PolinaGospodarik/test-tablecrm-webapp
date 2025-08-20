import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { createApi } from "../../api/axios";

export interface Item {
    id: number | string;
    name?: string;
    number?: string;
}

interface OrderState {
    payboxes: Item[];
    organizations: Item[];
    warehouses: Item[];
    priceTypes: Item[];
    selectedPaybox: Item | null;
    selectedOrganization: Item | null;
    selectedWarehouse: Item | null;
    selectedPriceType: Item | null;
    loading: boolean;
    error: string | null;
    response: any;
}

const initialState: OrderState = {
    payboxes: [],
    organizations: [],
    warehouses: [],
    priceTypes: [],
    selectedPaybox: null,
    selectedOrganization: null,
    selectedWarehouse: null,
    selectedPriceType: null,
    loading: false,
    error: null,
    response: null,
};

export const fetchOrderData = createAsyncThunk(
    "order/fetchOrderData",
    async ({ token, limit = 100, offset = 0 }: { token: string; limit?: number; offset?: number }) => {
        const api = createApi(token);
        const [payboxesRes, orgsRes, warehousesRes, priceTypesRes] = await Promise.all([
            api.get("/payboxes_alt/", { params: { token, limit, offset, sort: "created_at:desc" } }),
            api.get("/organizations/", { params: { token, limit, offset } }),
            api.get("/warehouses/", { params: { token, limit, offset } }),
            api.get("/price_types/", { params: { token, limit, offset } }),
        ]);

        return {
            payboxes: payboxesRes.data.result || payboxesRes.data,
            organizations: orgsRes.data.result || orgsRes.data,
            warehouses: warehousesRes.data.result || warehousesRes.data,
            priceTypes: priceTypesRes.data.result || priceTypesRes.data,
        };
    }
);

export const createOrder = createAsyncThunk(
    "order/createOrder",
    async (data: { clientId: number; organizationId: number; warehouseId: number; payboxId: number; priceTypeId: number; nomenclature: any; token: string }, { rejectWithValue }) => {
        try {
            const api = createApi(data.token);
            const response = await api.post("/orders/", {
                client_id: data.clientId,
                organization_id: data.organizationId,
                warehouse_id: data.warehouseId,
                paybox_id: data.payboxId,
                price_type_id: data.priceTypeId,
                nomenclature: data.nomenclature,
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.message || "Ошибка создания заказа");
        }
    }
);

const orderSlice = createSlice({
    name: "order",
    initialState,
    reducers: {
        resetOrders: state => {
            state.selectedPaybox = null;
            state.selectedOrganization = null;
            state.selectedWarehouse = null;
            state.selectedPriceType = null;
        },
        setSelectedPaybox: (state, action: PayloadAction<Item | null>) => { state.selectedPaybox = action.payload; },
        setSelectedOrganization: (state, action: PayloadAction<Item | null>) => { state.selectedOrganization = action.payload; },
        setSelectedWarehouse: (state, action: PayloadAction<Item | null>) => { state.selectedWarehouse = action.payload; },
        setSelectedPriceType: (state, action: PayloadAction<Item | null>) => { state.selectedPriceType = action.payload; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrderData.pending, (state) => { state.loading = true; })
            .addCase(fetchOrderData.fulfilled, (state, action) => {
                state.loading = false;
                state.payboxes = action.payload.payboxes;
                state.organizations = action.payload.organizations;
                state.warehouses = action.payload.warehouses;
                state.priceTypes = action.payload.priceTypes;
            })
            .addCase(fetchOrderData.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "Ошибка загрузки данных"; })
            .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; state.response = null; })
            .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.response = action.payload; })
            .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload as string || "Ошибка создания заказа"; });
    },
});

export const { setSelectedPaybox, setSelectedOrganization, setSelectedWarehouse, setSelectedPriceType, resetOrders } = orderSlice.actions;
export default orderSlice.reducer;
