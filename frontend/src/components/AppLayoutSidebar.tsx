import classNames from "classnames";
import { ReactComponent as OSINTBuddyLogo } from "@images/logo.svg";
import { Link, NavLink } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { toast } from "react-toastify";
import { CogIcon, DocumentMagnifyingGlassIcon, FolderOpenIcon, InboxIcon, PlusIcon } from "@heroicons/react/24/outline";


const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: InboxIcon },
  { name: "Incidents *", to: "/incidents", icon: FolderOpenIcon },
  { name: "Scans", to: "/scans", icon: DocumentMagnifyingGlassIcon },
];

interface AppLayoutSidebarProps {
  showSidebar: boolean
  toggleSidebar: () => void
  setShowIncidentsModal: (value: boolean) => void
}

export default function AppLayoutSidebar({ showSidebar, toggleSidebar, setShowIncidentsModal }: AppLayoutSidebarProps) {
  return (
    <div
      className={classNames(
        "fixed inset-y-0 flex border-r border-dark-300 w-64 flex-col transition-transform duration-100",
        showSidebar ? "translate-x-0" : "-translate-x-52"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col bg-dark-700">
        <div
          className={classNames(
            "flex h-12 flex-shrink-0 items-center justify-between",
            showSidebar ? "px-3" : "px-1"
          )}
        >
          <Link to="/" replace>
            <OSINTBuddyLogo className="h-7 w-auto fill-slate-400" />
          </Link>

          <HamburgerMenu
            isOpen={showSidebar}
            className="mx-1.5"
            onClick={toggleSidebar}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 flex py-4 flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive && "active",
                    "sidebar-link",
                    !showSidebar && "mx-0"
                  )
                }
              >
                <item.icon
                  className={classNames(
                    "transition-all",
                    location.pathname.includes(item.to)
                      ? "text-info-200"
                      : "text-slate-400 group-hover:text-slate-300",
                    "mr-3 flex-shrink-0 h-6 w-6 duration-100",
                    showSidebar
                      ? "translate-x-0"
                      : "translate-x-[13.16rem]"
                  )}
                  aria-hidden="true"
                />
                {item.name}
                {item.name === "Incidents *" && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setShowIncidentsModal(true)
                      toast.info(
                        <>
                          This feature is currently being planned out and
                          created. You can help shape this feature by
                          contributing to the discussion
                          <a
                            className="text-info-200"
                            href="https://github.com/jerlendds/osintbuddy/discussions"
                            target="_blank"
                          >
                            on Github!
                          </a>
                        </>,
                        { autoClose: 10000 }
                      );
                    }}
                    title="Create new incident"
                    className="ml-auto relative bg-dark-400 transition-colors duration-75 hover:bg-dark-500 p-1.5 rounded-full"
                  >
                    <PlusIcon className="text-white w-5 h-5" />
                  </button>
                )}
              </NavLink>
            ))}
            <NavLink
              to="/settings"
              replace
              className={({ isActive }) =>
                classNames(
                  isActive && "active",
                  "sidebar-link mt-auto",
                  !showSidebar && "mx-0"
                )
              }
            >
              <CogIcon
                className={classNames(
                  "transition-all",
                  location.pathname.includes("settings")
                    ? "text-info-200"
                    : "text-slate-400 group-hover:text-slate-300",
                  "mr-3 flex-shrink-0 h-6 w-6 duration-100",
                  showSidebar ? "translate-x-0" : "translate-x-[13.16rem]"
                )}
                aria-hidden="true"
              />
              Settings
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  )
}