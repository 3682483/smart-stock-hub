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
            <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
            <Route path="/inbound" element={<PlaceholderPage title="入库作业" description="PDA扫码入库、上架引导、库位推荐" />} />
            <Route path="/sales-orders" element={<SalesOrdersPage />} />
            <Route path="/picking" element={<PickingPage />} />
            <Route path="/packing" element={<PlaceholderPage title="打包发货" description="组合面单打印、边拣边贴、多品订单分流" />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/transfer" element={<PlaceholderPage title="移库/补货" description="存储区到拣货区调拨、PDA扫码移库" />} />
            <Route path="/stocktaking" element={<PlaceholderPage title="盘点管理" description="周期性盘点、动态盘点、差异报告" />} />
            <Route path="/intercept" element={<PlaceholderPage title="出库拦截" description="出库前扫描面单，自动拦截已取消订单" />} />
            <Route path="/returns" element={<PlaceholderPage title="退货处理" description="退货归位引导、异常件处理" />} />
            <Route path="/alerts" element={<InventoryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </WMSLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
