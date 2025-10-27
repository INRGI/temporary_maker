import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "../Common/Layout";
import { lazy } from "react";
import NotFound from "../../pages/NotFound";

const Home = lazy(() => import("../../pages/Home/Home"));
const HealthHome = lazy(() => import("../../pages/HealthHome/HealthHome"));
const ProductPreview = lazy(
  () => import("../../pages/ProductPreview/ProductPreview")
);
const HealthProductPreview = lazy(
  () => import("../../pages/HealthProductPreview/HealthProductPreview")
);
const OrganicProductPreview = lazy(
  () => import("../../pages/OrganicProductPreview/OrganicProductPreview")
);

const Organic = lazy(() => import("../../pages/Organic/Organic"));

const BizOpHome = lazy(() => import("../../pages/BizOpHome/BizOpHome"));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<NotFound />} />
        <Route path="/backup/finance" element={<Home />} />
        <Route path="/backup/health" element={<HealthHome />} />
        <Route
          path="/health/product-preview"
          element={<HealthProductPreview />}
        />
        <Route
          path="/organic/product-preview"
          element={<OrganicProductPreview />}
        />
        <Route path="/product-preview" element={<ProductPreview />} />

        <Route path="backup/organic" element={<Organic />} />

        <Route path="backup/bizop" element={<BizOpHome />} />

        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
