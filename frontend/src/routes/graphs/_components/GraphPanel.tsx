import { sdk } from "@/app/api";
import { formatPGDate, useEffectOnce } from "@/components/utils";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useCallback, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDashboardContext } from "..";


export function GraphLoaderCard() {
  return (
    <>
      <div className="mb-2">
        <div className="w-full py-6 space-y-5 rounded-md rounded-r-none bg-dark-800  before:absolute  px-4  bg-gradient-to-r from-transparent via-dark-900/10 to-transparent relative before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-dark-700 before:to-transparent isolate overflow-hidden shadow-xl shadow-black/5 border-l border-y border-dark-500">
          <div className="space-y-3">
            <div className="h-2 w-3/5 rounded-lg bg-slate-900 animate-pulse"></div>
            <div className="h-2 w-4/5 rounded-lg bg-slate-900/80 animate-pulse"></div>
            <div className="h-2 w-2/5 rounded-lg bg-slate-900/80 animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  )
}

interface GraphPanelProps {
  graphsData: JSONObject[]
  setGraphsData: Function
  activeTab: string
  favoritesData: JSONObject[]
  setFavoritesData: Function
}

export default function GraphPanel({
  graphsData,
  favoriteGraphsData,
  setGraphsData,
  setFavoriteGraphsData,
  fetchGraphs,
  isGraphsError,
  isLoadingGraphs,
  isFavoritesError,
  isLoadingFavorites }: JSONObject) {
  const navigate = useNavigate();
  const params: JSONObject = useParams();

  const [showAllGraphs, setShowAllGraphs] = useState(true);
  const [showFavoriteGraphs, setShowFavoriteGraphs] = useState(true);

  useEffectOnce(() => {
    fetchGraphs()
  })
  const MAX_DESCRIPTION_LENGTH = 63

  return (
    <section className="flex flex-col">
      <div className="py-4 h-80 flex flex-col">
        <div className="pb-1 flex items-center hover:border-dark-300 border-b transition-colors duration-100 ease-in-out border-transparent" onClick={() => setShowFavoriteGraphs(!showFavoriteGraphs)}>
          <p className="text-xs font-medium leading-3 text-slate-500 focus:outline-none cursor-pointer">FAVORITES</p>
          <ChevronDownIcon className={classNames("h-4 w-4 text-slate-400 ml-auto transform focus:outline-none cursor-pointer origin-center -rotate-180 mr-3", showFavoriteGraphs && 'rotate-0')} />
        </div>
        {showFavoriteGraphs && !isLoadingFavorites && isFavoritesError && (
          <>
            <h2 className="text-slate-400 text-display">
              We ran into an error retrieving your favorite graphs. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github
            </h2>
          </>
        )}
        {showFavoriteGraphs && isLoadingFavorites && !isFavoritesError && (
          <>
            <GraphLoaderCard />
            <GraphLoaderCard />
          </>
        )}
        {showFavoriteGraphs && !isLoadingFavorites && (
          <div className="mt-2 h-full overflow-y-scroll overflow-x-hidden">
            {favoriteGraphsData.map((graph: JSONObject) => {
              return <> <button key={graph.uuid} onClick={() => navigate(`graphs/${graph.uuid}`)} className={classNames("mb-1 focus:outline-none py-3 bg-dark-700 border-y rounded-md border-transparent hover:border-dark-400 border-l px-3 rounded-r-none hover:translate-x-px transition-transform focus:translate-x-px  hover:bg-dark-900 text-slate-600 hover:text-slate-400 focus:bg-dark-900 focus:text-slate-400  w-full  flex items-center ", params?.graphId === graph.uuid && "!border-dark-400 bg-dark-900 translate-x-px")}>
                <div className="flex w-full flex-col items-start mr-3 space-y-1">
                  <p className={classNames("text-sm font-medium leading-none", params?.graphId === graph.uuid && "text-slate-400")}>{graph.name}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600 mt-1 text-left", params?.graphId === graph.uuid && "!text-slate-500")}>{graph?.description?.length >= MAX_DESCRIPTION_LENGTH ? `${graph.description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : graph.description}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600 mt-1.5 text-left", params?.graphId === graph.uuid && "!text-slate-500")}>Last seen {formatPGDate(graph.last_seen)}</p>
                </div>
                <StarIcon onClick={() => {
                  sdk.graphs.updateFavoriteGraphUuid(graph.uuid, !graph.is_favorite).
                    then((data: any) => {
                      setFavoriteGraphsData([...favoriteGraphsData.filter((graph: JSONObject) =>
                        graph.uuid !== data.uuid
                      ).map((graph: JSONObject) => ({ ...graph }))])
                      setGraphsData([data, ...graphsData])
                    }).catch(error => console.warn(error))
                }} className={classNames("bg-slate-900 ml-auto rounded-md p-1 h-8 w-8 transition-colors duration-150 hover:text-info-200/80", graph.is_favorite ? 'text-info-200' : 'text-slate-600', params?.graphId !== graph.uuid && '!bg-transparent hover:!bg-slate-900')} />
              </button></>
            })}
          </div>
        )}
      </div>
      <div className="h-96 flex flex-col">
        <div className="pb-1 flex items-center hover:border-dark-300 border-b transition-colors duration-100 ease-in-out border-transparent" onClick={() => setShowAllGraphs(!showAllGraphs)}>
          <p className="text-xs font-medium leading-3 text-slate-500 focus:outline-none cursor-pointer">ALL GRAPHS</p>
          <ChevronDownIcon className={classNames("h-4 w-4 text-slate-400 ml-auto transform focus:outline-none cursor-pointer origin-center -rotate-180 mr-3", showAllGraphs && 'rotate-0')} />
        </div>
        {showAllGraphs && !isLoadingGraphs && isGraphsError && (
          <>
            <h2 className="text-slate-400 text-display">
              We ran into an error retrieving your graphs. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github
            </h2>
          </>
        )}
        {showAllGraphs && isLoadingGraphs && !isGraphsError && (
          <>
            <GraphLoaderCard />
            <GraphLoaderCard />
          </>
        )}
        {showAllGraphs && !isLoadingGraphs && (
          <div className="mt-2 h-full overflow-y-scroll overflow-x-hidden">
            {graphsData.map((graph: JSONObject) => {
              return (
                <button key={graph.uuid} onClick={() => navigate(`graphs/${graph.uuid}`)} className={classNames("mb-1 focus:outline-none py-3 bg-dark-700 border-y rounded-md border-transparent hover:border-dark-400 border-l px-3 rounded-r-none hover:translate-x-px transition-transform focus:translate-x-px  hover:bg-dark-900 text-slate-600 hover:text-slate-400 focus:bg-dark-900 focus:text-slate-400  w-full  flex items-center ", params?.graphId === graph.uuid && "!border-dark-400 bg-dark-900 translate-x-px")}>
                  <div className="flex w-full flex-col items-start mr-3 space-y-1.5">
                    <p className={classNames("text-sm font-medium leading-none", params?.graphId === graph.uuid && "text-slate-400")}>{graph.name}</p>
                    <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === graph.uuid && "!text-slate-500")}>{graph?.description?.length >= MAX_DESCRIPTION_LENGTH ? `${graph.description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : graph.description}</p>
                    <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === graph.uuid && "!text-slate-500")}>Last seen {formatPGDate(graph.last_seen)}</p>
                  </div>
                  <StarIcon
                    onClick={() => {
                      sdk.graphs.updateFavoriteGraphUuid(graph.uuid, !graph.is_favorite).
                        then((data: JSONObject) => {
                          setFavoriteGraphsData([data, ...favoriteGraphsData])
                          setGraphsData(graphsData.filter((graph: JSONObject) =>
                            graph.uuid !== data.uuid
                          ).map((graph: JSONObject) => ({ ...graph })))
                        }).catch(error => console.warn(error))
                    }}
                    className={classNames("bg-slate-900 ml-auto rounded-md p-1 h-8 w-8 transition-colors duration-150 hover:text-info-200/80",
                      graph.is_favorite ? 'text-info-200' : 'text-slate-600',
                      params?.graphId !== graph.uuid && '!bg-transparent hover:!bg-slate-900')
                    }
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
