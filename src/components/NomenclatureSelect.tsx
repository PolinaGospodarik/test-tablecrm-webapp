import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../hooks';
import { fetchNomenclature, setSelectedNomenclature } from '../redux/slice/nomenclatureSlice';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';

const NomenclatureSelect: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.token.token);
    const { items, loading, error, selected } = useAppSelector((state) => state.nomenclature);

    useEffect(() => {
        if (token) dispatch(fetchNomenclature(token));
    }, [token, dispatch]);

    if (loading) return <div className="flex justify-center mt-6"><CircularProgress /></div>;
    if (error) return <div className="text-center text-red-500 mt-6">Ошибка: {error}</div>;

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-6 rounded-xl shadow-xl bg-white">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-5 text-center sm:text-left text-gray-800">
                Товары
            </h2>
            <Autocomplete
                multiple
                options={items}
                value={selected}
                onChange={(_, newValue) => dispatch(setSelectedNomenclature(newValue))}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Номенклатура"
                        variant="outlined"
                        className="bg-gray-50 rounded-md text-sm sm:text-base"
                        InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                                <>
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
        </div>
    );
};

export default NomenclatureSelect;
