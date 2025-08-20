import React, { useState } from "react";
import {
    Button,
    LinearProgress,
    Dialog,
    DialogContent,
    DialogActions,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks";
import { createOrder, type OrderNomenclatureItem } from "../redux/slice/sendingSlice";
import { resetClient } from "../redux/slice/clientsSlice";
import { resetNomenclature } from "../redux/slice/nomenclatureSlice";
import { resetOrders } from "../redux/slice/ordersSlice";

const CreateSaleButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.token.token);
    const client = useAppSelector(state => state.clients.selected);
    const { selectedPaybox, selectedOrganization, selectedWarehouse, selectedPriceType } =
        useAppSelector(state => state.orders);
    const nomenclature = useAppSelector(state => state.nomenclature.selected);

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // true для мобильных

    const totalFields = 6;
    const filledFields =
        (client ? 1 : 0) +
        (selectedOrganization ? 1 : 0) +
        (selectedWarehouse ? 1 : 0) +
        (selectedPaybox ? 1 : 0) +
        (selectedPriceType ? 1 : 0) +
        (nomenclature.length ? 1 : 0);
    const progress = (filledFields / totalFields) * 100;

    const handleClick = (status: boolean) => {
        if (filledFields < totalFields) {
            setErrorDialogOpen(true);
            return;
        }

        const formattedNomenclature: OrderNomenclatureItem[] = nomenclature.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price || 0,
            unit_id: item.unit_id || 1,
            unit_name: item.unit_name || "шт",
            tax: item.tax || 0
        }));

        dispatch(createOrder({
            clientId: client!.id,
            organizationId: selectedOrganization!.id,
            warehouseId: selectedWarehouse!.id,
            payboxId: selectedPaybox!.id,
            priceTypeId: selectedPriceType!.id,
            nomenclature: formattedNomenclature,
            token,
            status
        })).then(() => {
            dispatch(resetClient());
            dispatch(resetNomenclature());
            dispatch(resetOrders());
            setSuccessDialogOpen(true);
        });
    };

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-4 flex flex-col gap-3 rounded-xl shadow-xl bg-white">
            <LinearProgress
                variant="determinate"
                value={progress}
                className="h-2 rounded-full mb-3"
                style={{ backgroundColor: "#e5e7eb" }}
            />
            <div className="flex flex-row gap-3 justify-center items-center">
                <Button
                    variant="contained"
                    onClick={() => handleClick(false)}
                    sx={{
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        textTransform: "none",
                        flex: 1,
                        padding: "10px 0",
                        fontSize: isMobile ? "12px" : "14px"
                    }}
                >
                    Создать
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleClick(true)}
                    sx={{
                        borderColor: "#1677ff",
                        color: "#1677ff",
                        textTransform: "none",
                        flex: 1,
                        padding: "10px 0",
                        fontSize: isMobile ? "12px" : "14px"
                    }}
                >
                    Создать и провести
                </Button>
            </div>

            <Dialog open={successDialogOpen} onClose={() => setSuccessDialogOpen(false)}>
                <DialogContent>
                    <Typography>Заказ отправлен</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSuccessDialogOpen(false)} autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)}>
                <DialogContent>
                    <Typography>Заполнены не все поля</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setErrorDialogOpen(false)} autoFocus>
                        ОК
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateSaleButtons;
