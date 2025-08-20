import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store/store";


interface CreateOrderPayload {
    clientId: string;
    organizationId: number | string;
    warehouseId: number | string;
    payboxId: number | string;
    priceTypeId: number | string;
    nomenclature: OrderNomenclatureItem[];
    status: boolean;
}

export interface OrderNomenclatureItem {
    id: number;
    name: string;
    price: number;
    unit_id: number;
    unit_name: string;
    tax: number;
}

interface OrdersState {
    loading: boolean;
    error: string | null;
    response: any;
}

const initialState: OrdersState = {
    loading: false,
    error: null,
    response: null
};


export const createOrder = createAsyncThunk(
    "orders/createOrder",
    async ({ clientId, organizationId, warehouseId, payboxId, priceTypeId, nomenclature, token, status }: CreateOrderPayload & { token: string }, { rejectWithValue }) => {

        const body = [
            {
                number: Date.now(),
                dated: Math.floor(Date.now() / 1000),
                operation: "Заказ",
                client: clientId,
                organization: organizationId,
                warehouse: warehouseId,
                paybox: payboxId,
                tax_included: true,
                tax_active: true,
                settings: {
                    repeatability_period: "minutes",
                    repeatability_value: 0,
                    date_next_created: 0,
                    transfer_from_weekends: true,
                    skip_current_month: true,
                    repeatability_count: 0,
                    default_payment_status: false,
                    repeatability_tags: false,
                    repeatability_status: true
                },
                sales_manager: 0,
                paid_rubles: 0,
                paid_lt: 0,
                status: status,
                goods: nomenclature.map(item => ({
                    price_type: priceTypeId,
                    price: item.price,
                    quantity: 1,
                    unit: item.unit_id,
                    unit_name: item.unit_name,
                    tax: item.tax,
                    discount: 0,
                    sum_discounted: 0,
                    status: "new",
                    nomenclature: item.id,
                    nomenclature_name: item.name
                })),
                priority: 10
            }
        ];

        try {
            const res = await fetch(`https://app.tablecrm.com/api/v1/docs_sales/?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            if (!res.ok) throw new Error("Ошибка при создании заказа");
            return await res.json();
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

const sendingSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(createOrder.pending, state => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.response = action.payload;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const selectOrdersState = (state: RootState) => state.orders;
export default sendingSlice.reducer;
