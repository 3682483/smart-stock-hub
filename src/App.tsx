import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import WMSLayout from "@/components/layout/WMSLayout";
import DashboardPage from "@/pages/DashboardPage";
import ProductsPage from "@/pages/ProductsPage";
import LocationsPage from "@/pages/LocationsPage";
import SuppliersPage from "@/pages/SuppliersPage";
import PurchaseOrdersPage from "@/pages/PurchaseOrdersPage";
import SalesOrdersPage from "@/pages/SalesOrdersPage";
import PickingPage from "@/pages/PickingPage";
import InventoryPage from "@/pages/InventoryPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import InboundPage from "@/pages/InboundPage";
import PackingPage from "@/pages/PackingPage";
import FinancePage from "@/pages/FinancePage";
import TransferPage from "@/pages/TransferPage";
import StocktakingPage from "@/pages/StocktakingPage";
import InterceptPage from "@/pages/InterceptPage";
import ReturnsPage from "@/pages/ReturnsPage";
import MerchantPage from "@/pages/MerchantPage";
import MerchantApplyPage from "@/pages/MerchantApplyPage";
import ProductApplyPage from "@/pages/ProductApplyPage";
import AutoDevicePage from "@/pages/AutoDevicePage";
import ExhibitPage from "@/pages/ExhibitPage";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <WMSLayout>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/locations" element={<LocationsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/merchant" element={<MerchantPage />} />
            <Route path="/merchant-apply" element={<MerchantApplyPage />} />
            <Route path="/product-apply" element={<ProductApplyPage />} />
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/inbound" element={<InboundPage />} />
            <Route path="/sales-orders" element={<SalesOrdersPage />} />
            <Route path="/picking" element={<PickingPage />} />
            <Route path="/packing" element={<PackingPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/transfer" element={<TransferPage />} />
            <Route path="/stocktaking" element={<StocktakingPage />} />
            <Route path="/intercept" element={<InterceptPage />} />
            <Route path="/returns" element={<ReturnsPage />} />
            <Route path="/auto-device" element={<AutoDevicePage />} />
            <Route path="/alerts" element={<InventoryPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/exhibit" element={<ExhibitPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WMSLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
