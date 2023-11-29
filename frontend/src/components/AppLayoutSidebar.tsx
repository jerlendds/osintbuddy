import classNames from "classnames";
import { ReactComponent as OSINTBuddyLogo } from "@images/logo.svg";
import { Link, NavLink } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { toast } from "react-toastify";
import { CogIcon, DocumentMagnifyingGlassIcon, FolderOpenIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";


const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon },
  { name: "Incidents *", to: "/incidents", icon: FolderOpenIcon },
  { name: "Scans *", to: "/scans", icon: DocumentMagnifyingGlassIcon },
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
        "fixed inset-y-0 flex border-r from-mirage-900/20 to-mirage-600/20 bg-gradient-to-br shadow border-mirage-800/80 w-64 flex-col transition-transform duration-100",
        showSidebar ? "translate-x-0" : "-translate-x-52 border-r-2"
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col mt-2 ">
        <div
          className={classNames(
            "flex h-10 my-1 flex-shrink-0 items-center justify-between",
            showSidebar ? "px-3.5" : "px-1"
          )}
        >
          <Link to="/" replace>
            <OSINTBuddyLogo className="h-7 w-auto fill-slate-400" />
          </Link>

          <HamburgerMenu
            isOpen={showSidebar}
            className={!showSidebar ? 'mr-1.5' : ''}
            onClick={toggleSidebar}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 flex py-4 pt-1 flex-col">
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
                      ? "text-slate-500"
                      : "",
                    "mr-3 flex-shrink-0 h-6 w-6 duration-100",
                    showSidebar
                      ? "translate-x-0"
                      : "translate-x-[13.15rem]"
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
                            className="text-primary"
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
                    className="ml-auto -mr-0.5 relative bg-dark-400 transition-colors duration-75 hover:bg-dark-500 p-1.5 rounded-full"
                  >
                    <PlusIcon className="text-white w-4 h-4" />
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
                    ? "text-primary"
                    : "text-slate-600 group-hover:text-slate-300",
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