import { configureStore } from '@reduxjs/toolkit'
import clientsReducer from '../slice/clientsSlice.ts';
import tokenReducer from '../slice/tokenSlice.ts';
import ordersReducer from '../slice/ordersSlice.ts';
import nomenclatureReducer from '../slice/nomenclatureSlice.ts';
import sendingReducer from '../slice/sendingSlice.ts';

const rootReducer ={
    // sale: saleReducer,
    clients: clientsReducer,
    token: tokenReducer,
    orders: ordersReducer,
    nomenclature: nomenclatureReducer,
    sending: sendingReducer,
}

const store = configureStore({
    reducer: rootReducer

})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store