import TokenInput from "../components/TokenInput.tsx";
import Clients from "../components/Clients.tsx";
import OrderSelects from "../components/OrderSelects.tsx";
import NomenclatureSelect from "../components/NomenclatureSelect.tsx";
import CreateSaleButton from "../components/CreateSaleButton.tsx";


const HomePage = () => {
    return (
        <>
            <div className="mx-4 mb-6">
                <TokenInput/>
                <Clients/>
                <OrderSelects/>
                <NomenclatureSelect/>
                <CreateSaleButton/>
            </div>
        </>
    );
};

export default HomePage;