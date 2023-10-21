import React, { ReactElement, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import NotFound from "./NotFound";
import PublicLayout from "./PublicLayout";
import ScansCreatePage from "./scans-create";
import GraphDetails from "./graphs/GraphDetails";
import Graphs from "./graphs/Graphs";
import Entities from "./graphs/Entities";
import Market from "./graphs/Market";
import EntityDetails from "./graphs/EntityDetails";
const SigninPage = lazy(() => import("./public/SigninPage"));
const DashboardPage = lazy(() => import("./graphs"));
const AboutPage = lazy(() => import("@routes/public/AboutPage"));
const LandingPage = lazy(() => import("@routes/public/LandingPage"));
const InquiryGraph = lazy(() => import("./inquiry-graph"));
const EntityGraphPage = lazy(() => import("./entity-graph"));
const SettingsPage = lazy(() => import("./settings"));
const IncidentsPage = lazy(() => import("./incidents"));
const ScansPage = lazy(() => import("./scans"));

export default function AppRoutes(): ReactElement {
  return (
    <Routes>
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
        <Route
          path="sign-in"
          element={
            <Suspense>
              <SigninPage />
            </Suspense>
          }
        />
      </Route>
      <Route path="/app" element={<AppLayout />}>
        <Route
          path="inquiries"
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
          path="inquiries/graph/:graphId"
          element={
            <Suspense>
              <InquiryGraph />
            </Suspense>
          }
        />
        <Route
          path="entity/:entityId"
          element={
            <Suspense>
              <EntityGraphPage />
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
