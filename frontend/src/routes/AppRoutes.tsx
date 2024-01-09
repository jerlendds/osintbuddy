import { ReactElement, Suspense, lazy } from "react";
import { Navigate, Route, RouterProvider, Routes, createBrowserRouter } from "react-router-dom";
import NotFound from "./NotFound";
import AppLayout from "./AppLayout";
import PublicLayout from "./PublicLayout";
import CallbackPage from '@routes/public/CallbackPage';
import { TourProvider } from "@reactour/tour";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import { selectActiveTour } from "@src/features/account/accountSlice";
import { useAppSelector } from "@src/app/hooks";

// Public routes
const LandingPage = lazy(() => import("@routes/public/LandingPage"));
const AboutPage = lazy(() => import("@routes/public/AboutPage"));
// Private routes
const DashboardPage = lazy(() => import("@routes/dashboard"));
const Market = lazy(() => import("@routes/dashboard/_components/Market"))

const GraphOverview = lazy(() => import("@routes/dashboard/_components/graph/GraphOverview"))
const GraphDetails = lazy(() => import("@routes/dashboard/_components/graph/GraphDetails"))
const GraphInquiry = lazy(() => import("@routes/graph-inquiry/index"));

const EntitiesOverview = lazy(() => import("@routes/dashboard/_components/entity/EntitiesOverview"))
const EntityDetails = lazy(() => import("@routes/dashboard/_components/entity/EntityDetails"))

const Settings = lazy(() => import("@routes/settings"));
const Workspaces = lazy(() => import("@src/routes/workspaces"));

const ScansCreate = lazy(() => import("@routes/scans-create"))
const ScansOverview = lazy(() => import("@routes/scans"));


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {

        path: "",
        element: <Suspense><LandingPage /></Suspense>,
      },
      {
        path: "/callback",
        element: <><CallbackPage /></>
      },
      {
        path: "",
        element: <Suspense><AboutPage /></Suspense>
      }
    ],
  },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Suspense><DashboardPage /></Suspense>,
        children: [
          {
            path: '',
            element: <Navigate to="graph" replace />
          },
          {
            path: 'market',
            element: <Suspense><Market /></Suspense>
          },
          {
            path: 'graph',
            element: <Suspense><GraphOverview /></Suspense>
          },
          {
            path: 'graph/:hid',
            element: <Suspense><GraphDetails /></Suspense>
          },
          {
            path: 'entity',
            element: <Suspense><EntitiesOverview /></Suspense>
          },
          {
            path: 'entity/:hid',
            element: <Suspense><EntityDetails /></Suspense>
          }
        ]
      },
      {
        path: 'graph/inquiry/:hid',
        element: <Suspense><GraphInquiry /></Suspense>
      },
      {
        path: 'settings',
        element: <Suspense><Settings /></Suspense>
      },
      {
        path: 'workspaces',
        element: <Suspense><Workspaces /></Suspense>
      },
      {
        path: 'scans',
        element: <Suspense><ScansOverview /></Suspense>,
        children: [
          {
            path: ':uuid',
            element: <Suspense><ScansCreate /></Suspense>
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);


export default function AppRoutes(): ReactElement {
  const tourSteps = useAppSelector(state => selectActiveTour(state))

  return (
    <TourProvider
      key={tourSteps?.length}
      steps={tourSteps}
      onClickClose={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
        setIsOpen(false)
        setCurrentStep(0)
      }}
      padding={{ mask: 10, popover: [5, 10], wrapper: 0 }}
      prevButton={({ currentStep, setCurrentStep, steps }: JSONObject) => {
        const first = currentStep === 0;
        return (
          <button
            className={`btn-primary !justify-between ${first && '!opacity-0'}`}
            onClick={() => { first ? setCurrentStep((s: number) => steps.length - 1) : setCurrentStep((s: number) => s - 1) }}
          >
            <ChevronLeftIcon className="w-5 h-5 !ml-0 mr-5" />
            <span>Back</span>
          </button>
        );
      }}
      nextButton={({
        currentStep,
        stepsLength,
        setIsOpen,
        setCurrentStep,
        steps,
      }: JSONObject) => {
        const last = currentStep === stepsLength - 1;
        return (
          <>
            <button
              onClick={() => last ? setIsOpen(false) : setCurrentStep((s: number) => s === steps?.length - 1 ? 0 : s + 1)}
              className="btn-primary"
            >
              <span>{!last ? "Next" : "Close guide"}</span>
              <ChevronRightIcon className="w-5 h-5 !ml-0" />
            </button >
          </>
        );
      }}
      styles={{
        popover: (base) => ({
          ...base, "--reactour-accent": "#2B3BFF", borderRadius: 5, backgroundColor: "#14192Aee", color: "#64748b",
        }),
        maskArea: (base) => ({ ...base, rx: 10 }),
        maskWrapper: (base) => ({ ...base, color: "#0D111C", opacity: 0.8 }),
        badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
        controls: (base) => ({ ...base, marginTop: 100 }),
        close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
      }}
    >
      <RouterProvider router={router} />
    </TourProvider >
  );
}
