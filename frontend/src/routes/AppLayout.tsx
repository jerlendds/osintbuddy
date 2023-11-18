import { useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TourProvider, StepType } from "@reactour/tour";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsSidebarOpen, selectIsAuthenticated, setSidebar } from "@/features/account/accountSlice";
import IncidentCard from "@/components/IncidentCard";
import OverlayModal from "@/components/modals/OverlayModal";
import AppLayoutSidebar from "@/components/AppLayoutSidebar";



const graphTourSteps: StepType[] = [
  {
    selector: "#main-view",
    content:
      "Welcome to OSINTBuddy, this is your investigation graph where you can start with one data point and continue mining for more related information",
  },
  {
    selector: "#node-options-tour",
    content:
      "These are entities, the building blocks of an investigation. Try opening the entities panel now, you can drag an entity to the graph to get started. Once you have an entity on the graph you can right click the entity to transform it into new data",
  },
];

export default function AppLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const showSidebar: boolean = useAppSelector((state) => selectIsSidebarOpen(state));
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const cancelIncidentsModalRef = useRef(null);

  const isAuthenticated = useAppSelector(state => selectIsAuthenticated(state));

  const toggleSidebar = () => {
    dispatch(setSidebar(!showSidebar));
  };

  if (!isAuthenticated) return <Navigate to="/" replace />
  return (
    <>
      <TourProvider
        steps={graphTourSteps}
        onClickClose={({ setCurrentStep, currentStep, steps, setIsOpen }) =>
          setIsOpen(false)
        }
        padding={{
          mask: 10,
          popover: [5, 10],
          wrapper: 0,
        }}
        prevButton={({ currentStep, setCurrentStep, steps }: JSONObject) => {
          const first = currentStep === 0;
          return (
            <button
              className="flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 "
              onClick={() => {
                if (first) {
                  setCurrentStep((s: number) => steps.length - 1);
                } else {
                  setCurrentStep((s: number) => s - 1);
                }
              }}
            >
              <ChevronLeftIcon className="w-5 h-5 text-slate-400" />
              <span className="mx-2"> Back</span>
            </button>
          );
        }}
        nextButton={({
          Button,
          currentStep,
          stepsLength,
          setIsOpen,
          setCurrentStep,
          steps,
        }: JSONObject) => {
          const last = currentStep === stepsLength - 1;
          return (
            <button
              onClick={() => {
                if (last) {
                  setIsOpen(false);
                } else {
                  setCurrentStep((s: number) =>
                    s === steps?.length - 1 ? 0 : s + 1
                  );
                }
              }}
              className="flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 "
            >
              <span className="mx-2"> {last ? "Next" : null}</span>
              <ChevronRightIcon className="w-5 h-5 text-slate-400" />
            </button>
          );
        }}
        currentStep={currentStep}
        setCurrentStep={() => {
          if (currentStep === graphTourSteps.length - 1) {
            setCurrentStep(0);
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
        styles={{
          popover: (base) => ({
            ...base,
            "--reactour-accent": "#2181B5",
            borderRadius: 5,
            backgroundColor: "rgb(15 23 42)",
            color: "rgb(148 163 184)",
          }),
          maskArea: (base) => ({ ...base, rx: 10 }),
          maskWrapper: (base) => ({ ...base, color: "#0B111F", opacity: 0.8 }),
          badge: (base) => ({ ...base, left: "auto", right: "-0.8125em" }),
          controls: (base) => ({ ...base, marginTop: 100 }),
          close: (base) => ({ ...base, right: "auto", left: 8, top: 8 }),
        }}
      >
        <div className="flex flex-col max-w-screen">
          <AppLayoutSidebar setShowIncidentsModal={setShowIncidentsModal} toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
          <div
            id="main-view"
            style={{ width: `calc(100% - ${showSidebar ? 16 : 3}rem)` }}
            className={classNames(
              " w-full transition-all overflow-hidden duration-100 relative ",
              showSidebar ? "translate-x-64" : "translate-x-12"
            )}
          >
            <main className="flex-1 block h-screen relative w-full overflow-y-scroll">
              <Outlet />
            </main>
          </div>
        </div>

        <OverlayModal
          cancelCreateRef={cancelIncidentsModalRef}
          isOpen={showIncidentsModal}
          closeModal={() => setShowIncidentsModal(false)}
        >
          <IncidentCard closeModal={() => setShowIncidentsModal(false)} />
        </OverlayModal>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastStyle={{
            backgroundColor: "rgb(23 35 65)",
            color: "rgb(148, 163, 184)",
          }}
        />
      </TourProvider>
    </>
  );
}
