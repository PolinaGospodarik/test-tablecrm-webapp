import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setToken } from "../redux/slice/tokenSlice";
import { fetchClients } from "../redux/slice/clientsSlice";

export const TokenInput: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.token.token);

    // При изменении токена автоматически грузим клиентов
    useEffect(() => {
        if (token) {
            dispatch(fetchClients());
        }
    }, [token, dispatch]);

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-6 rounded-xl shadow-xl bg-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 text-center sm:text-left text-gray-800">
                Авторизация
            </h2>
            <TextField
                fullWidth
                label="API Token"
                value={token}
                onChange={(e) => dispatch(setToken(e.target.value))}
                variant="outlined"
                className="bg-gray-50 rounded-md text-sm sm:text-base"
            />
        </div>
    );
};

export default TokenInput;
