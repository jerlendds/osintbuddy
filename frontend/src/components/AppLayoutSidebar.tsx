import classNames from "classnames";
import { ReactComponent as OSINTBuddyLogo } from "@images/logo.svg";
import { Link, NavLink } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { toast } from "react-toastify";
import { CogIcon, DocumentMagnifyingGlassIcon, FolderOpenIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Icon } from "./Icons";


const navigation = [
  { name: "Dashboard", to: "/dashboard", icon: HomeIcon },
  { name: "Workspaces *", to: "/workspaces", icon: FolderOpenIcon },
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
        "fixed inset-y-0 flex border-r from-mirage-600/40 to-mirage-600/50 bg-gradient-to-br shadow-xl border-mirage-600/70 w-64 flex-col transition-transform duration-100",
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
                    isActive && "active mx-2",
                    "sidebar-link ",
                    !showSidebar ? "mx-0 ml-0 mr-px" : 'mr-2'
                  )
                }
              >
                <item.icon
                  className={classNames(
                    "transition-all",
                    location.pathname.includes(item.to)
                      ? "text-slate-500"
                      : "",
                    "mr-2 flex-shrink-0 h-6 w-6 duration-100",
                    showSidebar
                      ? "translate-x-0"
                      : "translate-x-[12.75rem] "
                  )}
                />
                {item.name}
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
              />
              Settings
            </NavLink>
            <a
              href="https://discord.gg/gsbbYHA3K3"
              className={
                classNames(
                  "sidebar-link focus:text-primary !bg-transparent !hover:bg-transparent",
                  !showSidebar && "mx-0"
                )
              }
            >
              <Icon
                icon="brand-discord"
                className={classNames(
                  "transition-all",
                  location.pathname.includes("settings")
                    ? "text-primary"
                    : "text-slate-600 group-hover:text-slate-300",
                  "mr-3 flex-shrink-0 h-6 w-6 duration-100",
                  showSidebar ? "translate-x-0" : "translate-x-[13.16rem]"
                )}
              />
              Discord
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}