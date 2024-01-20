import { Fragment, useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
import { MagnifyingGlassIcon, PlusIcon, CloudIcon } from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import GraphPanel from "./_components/tabs/GraphPanel";
import EntitiesPanel from "./_components/tabs/EntitiesPanel";
import MarketPanel from './_components/tabs/MarketPanel';
import CreateGraphModal from "./_components/modals/CreateGraphModal";
import styles from "./index.module.css"
import { AllGraphsList, useGetEntitiesQuery, useGetGraphStatsQuery, useGetGraphsQuery } from "@src/app/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { GetGraphStatsApiResponse } from '../../app/api';
import CreateEntityModal from "./_components/modals/CreateEntityModal";
import { UseQueryStateOptions } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { useAppDispatch } from "@src/app/hooks";
import { resetGraph, setPositionMode } from "@src/features/graph/graphSlice";

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
  const dispatch = useAppDispatch()
  const location = useLocation()
  const initialTab = location.pathname.includes("entity") ?
    0 : location.pathname.includes("market")
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
    refetch: refetchEntities,
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
        skip: hid === undefined || !location.pathname.includes("/dashboard/graph/"),
        refetchOnMountOrArgChange: !location.pathname.includes("/dashboard/entity/")
      }
    )

  useEffect(() => {
    dispatch(resetGraph())
  }, [])

  return (
    <>
      <div className="flex ">
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
            <Tab.List className={`${styles["tabs-list"]}`}>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='graph'
                    className={`${styles["tab"]} ${styles["graph-tab"]} ${styles[`tab-${selected}`]}`}
                    aria-selected={selected}
                  >
                    Graphs
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='entity'
                    className={`${styles["tab"]} ${styles["entities-tab"]} ${styles[`tab-${selected}`]}`}
                    aria-selected={selected}
                  >
                    <span>
                      Entities
                    </span>
                  </Link>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <Link
                    to='market'
                    className={`${styles["tab"]} ${styles["market-tab"]} ${styles[`tab-${selected}`]}`}
                    aria-selected={selected}
                  >
                    Market
                  </Link>
                )}
              </Tab>
              <div className={styles["tab-slider"]} />
            </Tab.List>
            <div className="h-full overflow-y-scroll ">
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
                  refetchEntities={refetchEntities}

                />
              </Tab.Panel>
              <Tab.Panel className={styles["tab-panel"]}>
                <MarketPanel />
              </Tab.Panel>
            </div>
          </Tab.Group>
          {tabIndex !== 2 ? (
            <button
              onClick={() => {
                if (tabIndex === 0) setShowCreateGraphModal(true)
                if (tabIndex === 1) setShowCreateEntityModal(true) // TODO
              }}
              className='btn-primary mt-auto mb-4 mx-4 mr-6'
            >
              Create {tabIndex === 0 ? 'graph' : 'entity'}
              <PlusIcon className="!ml-7" />
            </button>
          ) : (
            <button
              className='btn-primary mx-4 mr-6 mt-auto mb-4'
            >
              Connect server plugins
              <CloudIcon />
            </button>
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
        refreshAllEntities={async () => await refetchEntities()}
        cancelCreateRef={cancelCreateEntityRef}
        isOpen={showCreateEntityModal}
        closeModal={() => setShowCreateEntityModal(false)}
      />
    </>
  );
}


