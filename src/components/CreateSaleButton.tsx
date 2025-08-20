import React, { useState, useEffect } from "react";
import {
    Button,
    LinearProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography
} from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks";
import {
    createOrder,
    selectOrdersState,
    type OrderNomenclatureItem
} from "../redux/slice/sendingSlice";
import {resetClient} from "../redux/slice/clientsSlice.ts";
import {resetOrders} from "../redux/slice/ordersSlice.ts";
import {resetNomenclature} from "../redux/slice/nomenclatureSlice.ts";

const CreateSaleButtons: React.FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector(state => state.token.token);
    const { selected: client } = useAppSelector(state => state.clients);
    const { selectedPaybox, selectedOrganization, selectedWarehouse, selectedPriceType } = useAppSelector(
        state => state.orders
    );
    const nomenclature = useAppSelector(state => state.nomenclature.selected);
    const { loading, error, response } = useAppSelector(selectOrdersState);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [dialogSeverity, setDialogSeverity] = useState<"success" | "error" | "info">("info");

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
            setDialogMessage("Заполните все поля!");
            setDialogSeverity("error");
            setDialogOpen(true);
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


        setDialogSeverity("info");
        setDialogMessage("Заказ отправлен");
        setDialogOpen(true);

        useEffect(() => {
            if (!loading && dialogOpen) {
                setDialogMessage("Заказ отправлен");
                setDialogSeverity("success");

                dispatch(resetClient());
                dispatch(resetOrders());
                dispatch(resetNomenclature());

            }
        }, [loading, response, error]);

        dispatch(
            createOrder({
                clientId: client!.id,
                organizationId: selectedOrganization!.id,
                warehouseId: selectedWarehouse!.id,
                payboxId: selectedPaybox!.id,
                priceTypeId: selectedPriceType!.id,
                nomenclature: formattedNomenclature,
                token,
                status
            })
        );
    };

    useEffect(() => {
        if (!loading && dialogOpen) {
            if (response) {
                setDialogMessage("Заказ создан успешно!");
                setDialogSeverity("success");
            } else if (error) {
                setDialogMessage(error);
                setDialogSeverity("error");
            }
        }
    }, [loading, response, error]);

    return (
        <div className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto mt-6 p-4 flex flex-col gap-3 rounded-xl shadow-xl bg-white">
            <LinearProgress
                variant="determinate"
                value={progress}
                className="h-2 rounded-full mb-3"
                style={{ backgroundColor: "#e5e7eb" }}
            />

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                    variant="contained"
                    onClick={() => handleClick(false)}
                    disabled={loading}
                    style={{
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        textTransform: "none",
                        flex: 1,
                        padding: "10px 0",
                        fontSize: "14px"
                    }}
                >
                    Создать
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => handleClick(true)}
                    disabled={loading}
                    style={{
                        borderColor: "#1677ff",
                        color: "#1677ff",
                        textTransform: "none",
                        flex: 1,
                        padding: "10px 0",
                        fontSize: "14px"
                    }}
                >
                    Создать и провести
                </Button>
            </div>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>
                    {dialogSeverity === "success" ? "Успех" : dialogSeverity === "error" ? "Ошибка" : "Отправка"}
                </DialogTitle>
                <DialogContent>
                    <Typography>{dialogMessage}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>OK</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default CreateSaleButtons;
