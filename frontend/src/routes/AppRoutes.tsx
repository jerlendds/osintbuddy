import React, { ReactElement, Suspense, lazy } from "react";
import { Route, Routes, useParams } from "react-router-dom";
import AppLayout from "./AppLayout";
import NotFound from "./NotFound";
import PublicLayout from "./PublicLayout";
import ScansCreatePage from "./scans-create";
import GraphDetails from "./dashboard/GraphDetailsPage";
import Graphs from "./dashboard/_components/Graphs";
import Entities from "./dashboard/Entities";
import Market from "./dashboard/MarketPage";
import EntityDetails from "./dashboard/EntityDetailsPage";
const DashboardPage = lazy(() => import("./dashboard"));
const AboutPage = lazy(() => import("@routes/public/AboutPage"));
const LandingPage = lazy(() => import("@routes/public/LandingPage"));
const InquiryGraph = lazy(() => import("./inquiry-graph"));
const SettingsPage = lazy(() => import("./settings"));
const IncidentsPage = lazy(() => import("./incidents"));
const ScansPage = lazy(() => import("./scans"));
import CallbackPage from './public/CallbackPage';


export default function AppRoutes(): ReactElement {
  return (

    <Routes>
      <Route path="/callback" element={<><CallbackPage /></>} />
      <Route path="/" element={<PublicLayout />}>
        <Route
          index
          element={
            <Suspense>
              <LandingPage />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense>
              <AboutPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/app" element={<AppLayout />}>
        <Route
          path="dashboard"
          element={
            <Suspense>
              <DashboardPage />
            </Suspense>
          }
        >
          <Route
            path='market'
            element={
              <>
                <Market />
              </>
            } />
          <Route
            path='graphs'
            element={
              <>
                <Graphs />
              </>
            } />
          <Route
            path='graphs/:graphId'
            element={
              <>
                <GraphDetails />
              </>
            } />

          <Route
            path='entities'
            element={
              <>
                <Entities />
              </>
            } />
          <Route
            path='entity/:entityId'
            element={
              <EntityDetails />
            } />
        </Route>
        <Route
          path="settings"
          element={
            <Suspense>
              <SettingsPage />
            </Suspense>
          }
        />
        <Route
          path="dashboard/graph/:graphId"
          element={
            <Suspense>
              <InquiryGraph />
            </Suspense>
          }
        />

        <Route
          path="incidents"
          element={
            <Suspense>
              <IncidentsPage />
            </Suspense>
          }
        />
        <Route path="scans">
          <Route
            element={
              <Suspense>
                <ScansPage />
              </Suspense>
            }
          />
          <Route
            path=""
            element={
              <Suspense>
                <ScansPage />
              </Suspense>
            }
          />

          <Route
            path=":scanId"
            element={
              <Suspense>
                <ScansCreatePage />
              </Suspense>
            }
          />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>

  );
}
