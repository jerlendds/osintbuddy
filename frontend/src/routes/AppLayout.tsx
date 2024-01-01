import { useRef, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { TourProvider, StepType } from "@reactour/tour";
import classNames from "classnames";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppDispatch, useAppSelector } from "@src/app/hooks";
import { selectIsSidebarOpen, selectIsAuthenticated, setSidebar, selectActiveTour } from "@src/features/account/accountSlice";
import IncidentCard from "@src/components/IncidentCard";
import OverlayModal from "@src/components/modals/OverlayModal";
import AppLayoutSidebar from "@src/components/AppLayoutSidebar";

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
          <main id="main-view" className="flex-1 overflow-hidden h-screen ">
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
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastStyle={{
          backgroundColor: "#1C233B",
          color: "#94a3b8",
        }}
      />
    </>
  );
}
