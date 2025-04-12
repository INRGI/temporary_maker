import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Common/Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const Home = lazy(() => import("../../pages/Home/Home"));
const HealthHome = lazy(() => import("../../pages/HealthHome/HealthHome"));
const ProductPreview = lazy(() => import("../../pages/ProductPreview/ProductPreview"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        
        <Route path="/health" element={<HealthHome />} />

        <Route path="/product-preview" element={<ProductPreview />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
