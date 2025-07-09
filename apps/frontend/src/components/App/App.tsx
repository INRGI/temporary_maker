import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Common/Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const Home = lazy(() => import("../../pages/Home/Home"));
const HealthHome = lazy(() => import("../../pages/HealthHome/HealthHome"));
const ProductPreview = lazy(() => import("../../pages/ProductPreview/ProductPreview"));
const HealthProductPreview = lazy(() => import("../../pages/HealthProductPreview/HealthProductPreview"));

const Organic = lazy(() => import("../../pages/Organic/Organic"));

const BroadcastTool = lazy(() => import("../../pages/BroadcastTool/BroadcastTool"));
const AdminBroadcastTool = lazy(() => import("../../pages/AdminBroadcastTool/AdminBroadcastTool"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />

        <Route path="/broadcast-tool" element={<BroadcastTool />}/>
        <Route path="/admin-broadcast-tool" element={<AdminBroadcastTool />}/>
        
        <Route path="/health" element={<HealthHome />} />
        <Route path="/health/product-preview" element={<HealthProductPreview />} />
        <Route path="/product-preview" element={<ProductPreview />} />

        <Route path="/organic" element={<Organic />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
