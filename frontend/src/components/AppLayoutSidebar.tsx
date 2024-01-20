import classNames from "classnames";
import { ReactComponent as OSINTBuddyLogomark } from "@images/logo-ext.svg"; // OSINTBuddy-text.svg
import { Link, NavLink } from "react-router-dom";
import HamburgerMenu from "./HamburgerMenu";
import { toast } from "react-toastify";
import { CogIcon, DocumentMagnifyingGlassIcon, FolderOpenIcon, PlusIcon, HomeIcon } from "@heroicons/react/24/outline";
import { Icon } from "./Icons";


const navigation = [
  { name: <><span>Dashboard</span></>, to: "/dashboard", icon: HomeIcon },
  { name: <><span>Workspaces</span> <span className="half-grayscale ml-auto mr-2.5 opacity-30 right-0">🚧</span></>, to: "/workspaces", icon: FolderOpenIcon },
  { name: <><span>Scans</span> <span className="half-grayscale ml-auto mr-2.5 opacity-30 right-0">🚧</span></>, to: "/scans", icon: DocumentMagnifyingGlassIcon },
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
            <OSINTBuddyLogomark className="h-7 ml-1 w-auto fill-slate-400" />
          </Link>

          <HamburgerMenu
            isOpen={showSidebar}
            className={!showSidebar ? 'mr-1.5' : ''}
            onClick={toggleSidebar}
          />
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 flex  flex-col">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  classNames(
                    isActive && "active mx-2",
                    "sidebar-link ",
                    !showSidebar ? "mx-0 ml-0 mr-px " : 'mr-2.5'
                  )
                }
              >
                <item.icon
                  className={classNames(
                    "transition-all mr-2 flex-shrink-0 h-6 w-6 duration-100",
                    location.pathname.includes(item.to) && "text-slate-400/30",
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
              className={({ isActive, }) =>
                classNames(
                  !showSidebar ? "mx-0 ml-0 mr-px" : 'mr-2.5',
                  "sidebar-link transition-all mt-auto sidebar-link text-slate-400/30 ",
                  isActive && "active mx-2"
                )
              }
            >
              <CogIcon
                className={classNames(
                  "transition-all ",
                  location.pathname.includes("settings") && "!mr-2 hover:-ml-0.5 ",
                  "mr-2 flex-shrink-0 h-6 w-6 duration-100",
                  showSidebar
                    ? "translate-x-0"
                    : "translate-x-[12.75rem] "
                )}
              />
              <span>Settings</span> <span className="half-grayscale ml-auto mr-2.5 right-0 opacity-30">🚧</span>
            </NavLink>
            <a
              href="https://discord.gg/gsbbYHA3K3"
              className={
                classNames(
                  "sidebar-link ",
                  !showSidebar ? "mx-0 ml-0 mr-px" : 'mr-2.5'
                )
              }
            >
              <Icon
                icon="brand-discord"
                className={classNames(
                  "transition-all",
                  "mr-2 flex-shrink-0 h-6 w-6 duration-100",
                  showSidebar
                    ? "translate-x-0"
                    : "translate-x-[12.75rem] "
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