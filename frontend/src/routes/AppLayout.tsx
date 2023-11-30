import { useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TourProvider, StepType } from "@reactour/tour";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectIsSidebarOpen, selectIsAuthenticated, setSidebar, selectActiveTour } from "@/features/account/accountSlice";
import IncidentCard from "@/components/IncidentCard";
import OverlayModal from "@/components/modals/OverlayModal";
import AppLayoutSidebar from "@/components/AppLayoutSidebar";

export default function AppLayout() {
  const dispatch = useAppDispatch();
  const showSidebar: boolean = useAppSelector((state) => selectIsSidebarOpen(state));
  const [showIncidentsModal, setShowIncidentsModal] = useState(false);
  const cancelIncidentsModalRef = useRef(null);
  const isAuthenticated = useAppSelector(state => selectIsAuthenticated(state));

  const toggleSidebar = () => {
    dispatch(setSidebar(!showSidebar));
  };

  if (!isAuthenticated) return <Navigate to="/" replace />

  return (
    <>
      <div className="flex flex-col max-w-screen">
        <AppLayoutSidebar setShowIncidentsModal={setShowIncidentsModal} toggleSidebar={toggleSidebar} showSidebar={showSidebar} />
        <div
          style={{ width: `calc(100% - ${showSidebar ? 16 : 3}rem)` }}
          className={classNames(
            " w-full transition-all overflow-hidden duration-100 relative ",
            showSidebar ? "translate-x-64" : "translate-x-12"
          )}
        >
          <main id="main-view" className="flex-1 block h-screen relative w-full overflow-y-scroll">
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
    </>
  );
}
