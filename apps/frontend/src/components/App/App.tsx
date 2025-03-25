import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const Home = lazy(() => import("../../pages/Home/Home"));
const ProductPreview = lazy(() => import("../../pages/ProductPreview/ProductPreview"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/product-preview" element={<ProductPreview />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
