import React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { setSelectedClient, type Client } from "../redux/slice/clientsSlice";
import type { RootState } from "../redux/store/store";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const Clients: React.FC = () => {
    const dispatch = useAppDispatch();
    const { items, loading, selected } = useAppSelector((state: RootState) => state.clients);

    const handleSelect = (client: Client | null) => {
        if (client) dispatch(setSelectedClient(client));
    };

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-6 rounded-xl shadow-xl bg-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 text-center sm:text-left text-gray-800">
                Выбор клиента
            </h2>
            <Autocomplete
                options={items}
                getOptionLabel={(option) => `${option.name}${option.phone ? ` (${option.phone})` : ""}`}
                loading={loading}
                value={selected ?? null}
                onChange={(_, newValue) => handleSelect(newValue)}
                isOptionEqualToValue={(option, value) => option.id === (value as Client)?.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Выберите клиента"
                        variant="outlined"
                        InputProps={{
                            ...params.InputProps,
                            className: "text-sm sm:text-base",
                            endAdornment: (
                                <>
                                    {loading && <CircularProgress color="inherit" size={20} />}
                                    {params.InputProps?.endAdornment}
                                </>
                            ),
                        }}
                        className="bg-gray-50 rounded-md"
                    />
                )}
                PaperComponent={({ children }) => (
                    <div className="bg-white shadow-lg rounded-md">{children}</div>
                )}
                filterOptions={(options, state) =>
                    options.filter(
                        (client) =>
                            client.name.toLowerCase().includes(state.inputValue.toLowerCase()) ||
                            client.phone?.includes(state.inputValue)
                    )
                }
            />
        </div>
    );
};

export default Clients;
