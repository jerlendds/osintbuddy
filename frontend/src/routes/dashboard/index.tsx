import { Fragment, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import GraphPanel from "./_components/tabs/GraphPanel";
import EntitiesPanel from "./_components/tabs/EntitiesPanel";
import MarketPanel from './_components/tabs/MarketPanel';
import CreateEntityModal from "./_components/modals/CreateEntityModal";
import CreateGraphModal from "./_components/modals/CreateGraphModal";
import styles from "./dashboard.module.css"

export default function DashboardPage() {
  const location = useLocation()
  const initialTab = location.pathname.includes("entities") ?
    1 : location.pathname.includes("market")
      ? 2 : 0

  const [tabIndex, setTabIndex] = useState<number>(initialTab)

  const [showCreateEntityModal, setShowCreateEntityModal] = useState<boolean>(false);
  const cancelCreateEntityRef = useRef<HTMLElement>(null);

  const [showCreateGraphModal, setShowCreateGraphModal] = useState<boolean>(false);
  const cancelCreateGraphRef = useRef<HTMLElement>(null);
  return (
    <>
      <div className="flex overflow-y-hidden">
        <div className={styles["dashboard-wrapper"]}>
          <div className={styles["search-container"]}>
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-700 ml-2" />
            <input
              type="text"
              placeholder={`Search ${tabIndex === 0 ? 'graph' : tabIndex === 1 ? 'entity' : 'marketplace'}...`}
            />
          </div>
          <Tab.Group
            vertical={false}
            as='section'
            selectedIndex={tabIndex}
            onChange={setTabIndex}
            className={styles["dashboard-tabs"]}
          >
            <Tab.List className={styles["tabs-list"]}>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='/dashboard/graph'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Graphs
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='/dashboard/entity'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Entities
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='/dashboard/market'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Market
                  </Link>
                )}
              </Tab>
            </Tab.List>
            <Tab.Panel className={styles["tab-panel"]}>
              <GraphPanel />
            </Tab.Panel>
            <Tab.Panel className={styles["tab-panel"]}>
              <EntitiesPanel />
            </Tab.Panel>
            <Tab.Panel className={styles["tab-panel"]}>
              <MarketPanel />
            </Tab.Panel>
          </Tab.Group>
          {tabIndex !== 2 && (
            <button
              onClick={() => {
                if (tabIndex === 0) setShowCreateGraphModal(true)
                if (tabIndex === 1) { } // TODO
              }}
              className='btn-primary'
            >
              Create {tabIndex === 0 ? 'graph' : 'entity'}
              <PlusIcon />
            </button>
          )}
        </div>
        <Outlet />
      </div>
      <CreateGraphModal
        cancelCreateRef={cancelCreateGraphRef}
        isOpen={showCreateGraphModal}
        closeModal={() => setShowCreateGraphModal(false)}
      />
      <CreateEntityModal
        cancelCreateRef={cancelCreateEntityRef}
        isOpen={showCreateEntityModal}
        closeModal={() => setShowCreateEntityModal(false)}
      />
    </>
  );
}


