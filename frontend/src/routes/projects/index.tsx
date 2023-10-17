import { useCallback, useEffect, useRef, useState } from "react";
import CreateProjectModal from "./_components/CreateProjectModal";
import { Outlet, useOutletContext } from "react-router-dom";
import InquirySidebar from "./_components/InquirySidebar";
import { sdk } from "@/app/api";

type ContextType = {
  activeInquiryTab: string
  graphsData: JSONObject[]
  favoriteGraphsData: JSONObject[]
  fetchGraphs: Function
  fetchGraphsIdRef: any
  isGraphsError: boolean
  isLoadingGraphs: boolean
  graphsPageCount: number
  setGraphsPageCount: Function
  fetchFavoritesIdRef: any
  isFavoritesError: boolean
  isLoadingFavorites: boolean
  favoritesPageCount: number
  setFavoritesPageCount: Function
  setFavoriteGraphsData: Function
  setGraphsData: Function
}

export default function DashboardPage() {
  const [activeInquiryTab, setActiveInquiryTab] = useState<'graphs' | 'entities' | 'market'>('graphs')

  const [favoriteGraphsData, setFavoriteGraphsData] = useState<any>([])
  const [graphsData, setGraphsData] = useState<any>([]);
  let [showCreateGraphModal, setShowCreateGraphModal] = useState(false);
  const cancelCreateGraphRef = useRef<HTMLElement>(null);


  const updateGraphsData = (newProject: JSONObject) => {
    setGraphsData([...graphsData, newProject]);
  };

  const [favoritesPageCount, setFavoritesPageCount] = useState(0);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(false);
  const [isFavoritesError, setIsFavoritesError] = useState(false);
  const fetchFavoritesIdRef = useRef(0);

  const [graphsPageCount, setGraphsPageCount] = useState(0);
  const [isLoadingGraphs, setIsLoadingGraphs] = useState(false);
  const [isGraphsError, setIsGraphsError] = useState(false);
  const fetchGraphsIdRef = useRef(0);


  const fetchGraphsData = useCallback(
    ({ pageSize, pageIndex, isFavorite }: FetchProps & { isFavorite: boolean }) => {
      setIsGraphsError(false);
      setIsFavoritesError(false);
      let fetchId;
      if (isFavorite) {
        fetchId = ++fetchFavoritesIdRef.current;
        setIsLoadingFavorites(true);
      } else {
        fetchId = ++fetchGraphsIdRef.current;
        setIsLoadingGraphs(true);
      }
      if (fetchId === (isFavorite
        ? fetchFavoritesIdRef.current
        : fetchGraphsIdRef.current)
      ) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        if (fetchId === (isFavorite
          ? fetchFavoritesIdRef.current
          : fetchGraphsIdRef.current)
        ) {
          sdk.graphs.getGraphs(pageSize * pageIndex, pageSize, isFavorite).
            then((data: any) => {
              if (isFavorite) {
                setFavoritesPageCount(Math.ceil(data?.count / pageSize));
                setFavoriteGraphsData(data.projects);
                setIsLoadingFavorites(false);
              } else {
                setGraphsPageCount(Math.ceil(data?.count / pageSize));
                setGraphsData(data.projects);
                setIsLoadingGraphs(false);
              }
            }).catch((error) => {
              console.error(error);
              if (isFavorite) {
                setIsFavoritesError(true);
                setIsLoadingFavorites(false);
              } else {
                setIsGraphsError(true);
                setIsLoadingGraphs(false);
              }
            });
        }
      }
    },
    [graphsPageCount, favoritesPageCount]
  );


  const fetchGraphs = () => {
    fetchGraphsData({ pageSize: 20, pageIndex: 0, isFavorite: false })
    fetchGraphsData({ pageSize: 20, pageIndex: 0, isFavorite: true })
  }

  return (
    <>

      <div className="flex overflow-y-hidden">
        <InquirySidebar
          setActiveTab={setActiveInquiryTab}
          projectsData={graphsData}
          setProjectsData={setGraphsData}
          activeTab={activeInquiryTab}
          openGraphModal={() => {
            setShowCreateGraphModal(true)
          }}
          fetchGraphs={fetchGraphs}
          graphsData={graphsData}
          favoriteGraphsData={favoriteGraphsData}
          setGraphsData={setGraphsData}
          setFavoriteGraphsData={setFavoriteGraphsData}
          fetchGraphsData={fetchGraphsData}
          isGraphsError={isGraphsError}
          isLoadingGraphs={isLoadingGraphs}
          isFavoritesError={isFavoritesError}
          isLoadingFavorites={isLoadingFavorites}
        />
        <Outlet context={{
          activeInquiryTab,
          graphsData,
          favoriteGraphsData,
          setGraphsData,
          setFavoriteGraphsData,
          fetchGraphsData,
          fetchGraphs,
          fetchGraphsIdRef,
          isGraphsError,
          isLoadingGraphs,
          graphsPageCount,
          setGraphsPageCount,
          fetchFavoritesIdRef,
          isFavoritesError,
          isLoadingFavorites,
          favoritesPageCount,
          setFavoritesPageCount
        }} />
      </div>
      <CreateProjectModal
        updateTable={(project: JSONObject) => updateGraphsData(project)}
        cancelCreateRef={cancelCreateGraphRef}
        isOpen={showCreateGraphModal}
        closeModal={() => setShowCreateGraphModal(false)}
      />
      {/* <CreateEntityModal
        updateTable={(project: JSONObject) => updateEntityTable(project)}
        cancelCreateRef={cancelCreateEntityRef}
        isOpen={isEntityOpen}
        closeModal={() => setIsEntityOpen(false)}
      /> */}
    </>
  );
}

export function useDashboardContext() {
  return useOutletContext<ContextType>()
}



