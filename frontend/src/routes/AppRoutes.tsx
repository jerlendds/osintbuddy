import React, { ReactElement, Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "./AppLayout";
import NotFound from "./NotFound";
import PublicLayout from "./PublicLayout";
import ScansCreatePage from "./scans-create";
import GraphDetails from "./projects/GraphDetails";
import Graphs from "./projects/Graphs";
import Entities from "./projects/Entities";
import Market from "./projects/Market";
import EntityDetails from "./projects/EntityDetails";
const SigninPage = lazy(() => import("./public/SigninPage"));
const DashboardPage = lazy(() => import("./projects"));
const AboutPage = lazy(() => import("@routes/public/AboutPage"));
const LandingPage = lazy(() => import("@routes/public/LandingPage"));
const InquiryGraph = lazy(() => import("./project-graph"));
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
            path='graph'
            element={
              <>
                <Graphs />
              </>
            } />
          <Route
            path='graph/:graphId'
            element={
              <>
                <GraphDetails />
              </>
            } />

          <Route
            path='entity'
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
          path="inquiries/investigation/:graphId"
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
