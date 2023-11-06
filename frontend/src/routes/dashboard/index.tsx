import { Fragment, useRef, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import GraphPanel from "./_components/tabs/GraphPanel";
import EntitiesPanel from "./_components/tabs/EntitiesPanel";
import MarketPanel from './_components/tabs/MarketPanel';
import CreateGraphModal from "./_components/modals/CreateGraphModal";
import styles from "./dashboard.module.css"
import { AllGraphsList, useGetEntitiesQuery, useGetGraphStatsQuery, useGetGraphsQuery } from "@/app/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { GetGraphStatsApiResponse } from '../../app/api';
import CreateEntityModal from "./_components/modals/CreateEntityModal";
import { UseQueryStateOptions } from "@reduxjs/toolkit/dist/query/react/buildHooks";

export interface ScrollGraphs {
  skip?: number | undefined
  limit?: number | undefined
  favoriteSkip?: number | undefined
  favoriteLimit?: number | undefined
}

export type DashboardContextType = {
  graphStats: GetGraphStatsApiResponse
  refreshGraphStats: () => void;
  refetchGraphs: () => void;
  graphsData: AllGraphsList
  isLoadingGraphs: boolean
  isGraphsError: FetchBaseQueryError | SerializedError | undefined
};

export default function DashboardPage() {
  const { hid } = useParams();
  const location = useLocation()
  const initialTab = location.pathname.includes("entity") ?
    1 : location.pathname.includes("market")
      ? 2 : 0

  const [tabIndex, setTabIndex] = useState<number>(initialTab)

  const [showCreateEntityModal, setShowCreateEntityModal] = useState<boolean>(false);
  const cancelCreateEntityRef = useRef<HTMLElement>(null);

  const [showCreateGraphModal, setShowCreateGraphModal] = useState<boolean>(false);
  const cancelCreateGraphRef = useRef<HTMLElement>(null);

  const [graphsQuery, setGraphsQuery] = useState({ skip: 0, limit: 50 })
  const [favoriteGraphsQuery, setFavoriteGraphsQuery] = useState({ favoriteSkip: 0, favoriteLimit: 50 })

  const {
    data: allGraphsData = { graphs: [], count: 0, favorite_graphs: [], favorite_count: 0 },
    isLoading: isLoadingGraphs,
    error: isGraphsError,
    refetch: refetchGraphs,
    isSuccess: isGraphsSuccess
  } = useGetGraphsQuery({ ...graphsQuery, ...favoriteGraphsQuery })

  const {
    data: entitiesData = { entities: [], count: 0, favorite_entities: [], favorite_count: 0 },
    isLoading,
    isError,
    isSuccess,
    refetch: refreshAllEntities,
  } = useGetEntitiesQuery({ skip: 0, limit: 50 })

  const scrollGraphs = ({ skip, limit, favoriteSkip, favoriteLimit }: ScrollGraphs) => {
    if (skip !== undefined && limit !== undefined) setGraphsQuery({ skip, limit })
    if (favoriteSkip !== undefined && favoriteLimit !== undefined) setFavoriteGraphsQuery({ favoriteSkip, favoriteLimit })
  }
  const {
    data: graphStats,
    refetch: refreshGraphStats } = useGetGraphStatsQuery(
      { hid: hid as string },
      {
        skip: hid === undefined && !location.pathname.includes("/dashboard/graph/"),
        refetchOnMountOrArgChange: true
      }
    )

  return (
    <>
      <div className="flex max-h-screen">
        <aside className={styles["sidebar-wrapper"]}>
          <div className={styles["search-container"]}>
            <MagnifyingGlassIcon />
            <input
              type="text"
              placeholder={`Search ${tabIndex === 0 ? 'graphs' : tabIndex === 1 ? 'entities' : 'marketplace'}...`}
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
                    to='graph'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Graphs
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='entity'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Entities
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='market'
                    className={styles["tab"] + " " + styles[`tab-${selected}`]}
                  >
                    Market
                  </Link>
                )}
              </Tab>
            </Tab.List>
            <section>
              <Tab.Panel className={styles["tab-panel"]}>
                <GraphPanel
                  refetchGraphs={async () => await refetchGraphs()}
                  graphsData={allGraphsData}
                  isLoadingGraphs={isLoadingGraphs}
                  isGraphsError={isGraphsError}
                  isGraphsSuccess={isGraphsSuccess}
                />
              </Tab.Panel>
              <Tab.Panel className={styles["tab-panel"]}>
                <EntitiesPanel
                  entitiesData={entitiesData}
                  isLoading={isLoading}
                  isError={isError}
                  isSuccess={isSuccess}
                  refreshAllEntities={refreshAllEntities}
                />
              </Tab.Panel>
              <Tab.Panel className={styles["tab-panel"]}>
                <MarketPanel />
              </Tab.Panel>
            </section>
          </Tab.Group>
          {tabIndex !== 2 ? (
            <button
              onClick={() => {
                if (tabIndex === 0) setShowCreateGraphModal(true)
                if (tabIndex === 1) setShowCreateEntityModal(true) // TODO
              }}
              className='btn-primary'
            >
              Create {tabIndex === 0 ? 'graph' : 'entity'}
              <PlusIcon />
            </button>
          ) : (
            <button
              className='btn-primary'
            >Upload a plugin</button>
          )}
        </aside>
        <Outlet context={{
          refetchGraphs,
          graphsData: allGraphsData,
          isLoadingGraphs,
          isGraphsError,
          graphStats,
          refreshGraphStats,
        } satisfies DashboardContextType} />
      </div>
      <CreateGraphModal
        cancelCreateRef={cancelCreateGraphRef}
        isOpen={showCreateGraphModal}
        closeModal={() => setShowCreateGraphModal(false)}
        refreshAllGraphs={async () => await refetchGraphs()}
      />
      <CreateEntityModal
        refreshAllEntities={refreshAllEntities}
        cancelCreateRef={cancelCreateEntityRef}
        isOpen={showCreateEntityModal}
        closeModal={() => setShowCreateEntityModal(false)}
      />
    </>
  );
}


