import { ReactElement, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import NotFound from "./NotFound";
import AppLayout from "./AppLayout";
import PublicLayout from "./PublicLayout";

// Public routes
const LandingPage = lazy(() => import("@routes/public/LandingPage"));
const AboutPage = lazy(() => import("@routes/public/AboutPage"));
import CallbackPage from './public/CallbackPage';

// Private routes
const DashboardPage = lazy(() => import("./dashboard"));

const Market = lazy(() => import("./dashboard/_components/tabs/MarketPanel"))
const GraphOverview = lazy(() => import("./dashboard/_components/graph/GraphOverview"))
const GraphDetails = lazy(() => import("./dashboard/_components/graph/GraphDetails"))
const EntitiesOverview = lazy(() => import("./dashboard/_components/entity/EntitiesOverview"))
const EntityDetails = lazy(() => import("./dashboard/_components/entity/EntityDetails"))
const GraphInquiry = lazy(() => import("./graph-inquiry"));

const Settings = lazy(() => import("./settings"));
const Incidents = lazy(() => import("./incidents"));

const ScansCreate = lazy(() => import("./scans-create"))
const ScansOverview = lazy(() => import("./scans"));


export default function AppRoutes(): ReactElement {
  return (
    <Routes>
      <Route path="/callback" element={<><CallbackPage /></>} />
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Suspense><LandingPage /></Suspense>} />
        <Route path="about" element={<Suspense><AboutPage /></Suspense>} />
      </Route>
      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<Suspense><DashboardPage /></Suspense>}>
          <Route path='market' element={<Suspense><Market /></Suspense>} />
          <Route path='graph' element={<Suspense><GraphOverview /></Suspense>} />
          <Route path='graph/:hid' element={<Suspense><GraphDetails /></Suspense>} />
          <Route path='entity' element={<Suspense><EntitiesOverview /></Suspense>} />
          <Route path='entity/:hid' element={<Suspense><EntityDetails /></Suspense>} />
        </Route>
        <Route path="graph/inquiry/:hid" element={<Suspense><GraphInquiry /></Suspense>} />
        <Route path="settings" element={<Suspense><Settings /></Suspense>} />
        <Route path="incidents" element={<Suspense><Incidents /></Suspense>} />
        <Route path="scans">
          <Route element={<Suspense><ScansOverview /></Suspense>} />
          <Route path="" element={<Suspense><ScansOverview /></Suspense>} />
          <Route path=":uuid" element={<Suspense><ScansCreate /></Suspense>} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
