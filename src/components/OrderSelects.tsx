import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
    fetchOrderData,
    setSelectedPaybox,
    setSelectedOrganization,
    setSelectedWarehouse,
    setSelectedPriceType
} from "../redux/slice/ordersSlice.ts";

const OrderSelects: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.token.token);
    const {
        payboxes,
        organizations,
        warehouses,
        priceTypes,
        selectedPaybox,
        selectedOrganization,
        selectedWarehouse,
        selectedPriceType,
        loading
    } = useAppSelector(state => state.orders);

    useEffect(() => {
        if (token) {
            dispatch(fetchOrderData({ token, limit: 100, offset: 0 }));
        }
    }, [token, dispatch]);

    const renderAutocomplete = (
        options: any[],
        value: any,
        label: string,
        onChange: any,
        labelKey: string = "name"
    ) => (
        <Autocomplete
            options={options}
            getOptionLabel={(opt) => opt[labelKey] || opt.number || ""}
            value={value}
            onChange={(_, val) => onChange(val)}
            isOptionEqualToValue={(option, val) => option.id === val?.id}
            renderOption={(props, option) => (
                <li {...props} key={option.id || option[labelKey] || option.number}>
                    {option[labelKey] || option.number}
                </li>
            )}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    variant="outlined"
                    className="bg-gray-50 rounded-md text-sm sm:text-base"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading && <CircularProgress color="inherit" size={20} />}
                                {params.InputProps?.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
            PaperComponent={({ children }) => (
                <div className="bg-white shadow-lg rounded-md">{children}</div>
            )}
        />
    );

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-6 rounded-xl shadow-xl bg-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 text-center sm:text-left text-gray-800">
                Выбор параметров заказа
            </h2>
            <div className="flex flex-col gap-4 w-full">
                {renderAutocomplete(payboxes, selectedPaybox, "Счёт", (val: any) => dispatch(setSelectedPaybox(val)))}
                {renderAutocomplete(organizations, selectedOrganization, "Организация", (val: any) => dispatch(setSelectedOrganization(val)), "short_name")}
                {renderAutocomplete(warehouses, selectedWarehouse, "Склад", (val: any) => dispatch(setSelectedWarehouse(val)))}
                {renderAutocomplete(priceTypes, selectedPriceType, "Тип цены", (val: any) => dispatch(setSelectedPriceType(val)))}
            </div>
        </div>
    );
};

export default OrderSelects;
