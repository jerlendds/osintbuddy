import { api } from "@/app/api";
import { useEffectOnce } from "@/app/hooks";
import { formatPGDate } from "@/app/utilities";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

export function FavoriteEntities({ showFavoriteEntities, setShowFavoriteEntities }: any) {
  const navigate = useNavigate();
  const params: JSONObject = useParams();

  const {
    data: favoriteEntities,
    isLoading: isLoadingFavoriteEntities,
    isError: isFavoriteEntitiesError,
    isSuccess
  } = api.useGetEntitiesQuery({ skip: 0, limit: 50, isFavorite: true })

  console.log(favoriteEntities, isSuccess, isLoadingFavoriteEntities, isFavoriteEntitiesError)

  return (
    <>
      {showFavoriteEntities && !isLoadingFavoriteEntities && isFavoriteEntitiesError && (
        <>
          <h2 className="text-slate-400 text-display">
            We ran into an error retrieving your graphs. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github
          </h2>
        </>
      )}
      {showFavoriteEntities && isLoadingFavoriteEntities && !isFavoriteEntitiesError && (
        <>
          <GraphLoaderCard />
          <GraphLoaderCard />
        </>
      )}
      {isSuccess && (
        <div className="mt-2 h-full overflow-y-scroll overflow-x-hidden">
          {favoriteEntities?.length && favoriteEntities.map((entity: JSONObject) => {
            return (
              <button key={entity.uuid} onClick={() => {
                navigate(`entity/${entity.uuid}`)

              }} className={classNames("mb-1 focus:outline-none py-3 bg-dark-700 border-y rounded-md border-transparent hover:border-dark-400 border-l px-3 rounded-r-none hover:translate-x-px transition-transform focus:translate-x-px  hover:bg-dark-900 text-slate-600 hover:text-slate-400 focus:bg-dark-900 focus:text-slate-400  w-full  flex items-center ", params?.entityId === entity.uuid && "!border-dark-400 bg-dark-900 translate-x-px")}>
                <div className="flex w-full flex-col items-start mr-3 space-y-1.5">
                  <p className={classNames("text-sm font-medium leading-none", params?.graphId === entity.uuid && "text-slate-400")}>{entity.label}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === entity.uuid && "!text-slate-500")}>{entity?.description?.length >= MAX_DESCRIPTION_LENGTH ? `${entity.description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : entity.description}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === entity.uuid && "!text-slate-500")}>Last seen {formatPGDate(entity.last_seen)}</p>
                </div>
                <StarIcon
                  onClick={() => {
                    // sdk.entities.updateFavoriteEntityUuid(entity.uuid, false)
                    //   .then((data: any) => {
                    //     const filteredFavorites = favoriteEntities.filter((entity: JSONObject) =>
                    //       entity.uuid !== data.uuid
                    //     ).map((entity: JSONObject) => ({ ...entity }))
                    //     setEntitiesFavoriteData(filteredFavorites)
                    //     setEntitiesData(entitiesData.concat(data))
                    //   }).catch(error => console.error(error))
                  }}
                  className={classNames("bg-slate-900 ml-auto rounded-md p-1 h-8 w-8 transition-colors duration-150 hover:text-info-200/80",
                    entity.is_favorite ? '!text-info-200' : 'text-slate-600',
                    params?.graphId !== entity.uuid && '!bg-transparent hover:!bg-slate-900')
                  }
                />
              </button>
            )
          })}
        </div>
      )}
    </>
  )
}

const MAX_DESCRIPTION_LENGTH = 63

export default function EntitiesPanel() {
  const navigate = useNavigate();
  const params = useParams();
  const [showFavoriteEntities, setShowFavoriteEntities] = useState<boolean>(true);

  const [showFavoriteGraphs, setShowFavoriteGraphs] = useState(true);
  const [showAllEntities, setShowAllEntities] = useState(true);

  const {
    data: entities,
    isLoading: isLoadingEntities,
    isError: isEntitiesError,

  } = api.useGetEntitiesQuery({ skip: 0, limit: 50, isFavorite: false })

  return (
    <section>
      <div className="h-80 mb-5 flex flex-col">
        <div className="pb-1 flex items-center hover:border-dark-300 border-b transition-colors duration-100 ease-in-out border-transparent" onClick={() => setShowFavoriteEntities(!showFavoriteEntities)}>
          <p className="text-xs font-medium leading-3 text-slate-500 focus:outline-none cursor-pointer">FAVORITES</p>
          <ChevronDownIcon className={classNames("h-4 w-4 text-slate-400 ml-auto transform focus:outline-none cursor-pointer origin-center -rotate-180 mr-3", showFavoriteEntities && 'rotate-0')} />
        </div>
        <FavoriteEntities showFavoriteEntities={showFavoriteEntities} setShowFavoriteEntities={setShowFavoriteEntities} />
      </div>
      <div className="h-96 flex flex-col">
        <div className="pb-1 flex items-center hover:border-dark-300 border-b transition-colors duration-100 ease-in-out border-transparent" onClick={() => setShowAllEntities(!showAllEntities)}>
          <p className="text-xs font-medium leading-3 text-slate-500 focus:outline-none cursor-pointer">ALL ENTITIES</p>
          <ChevronDownIcon className={classNames("h-4 w-4 text-slate-400 ml-auto transform focus:outline-none cursor-pointer origin-center -rotate-180 mr-3", showAllEntities && 'rotate-0')} />
        </div>
        {showAllEntities && !isLoadingEntities && isEntitiesError && (
          <>
            <h2 className="text-slate-400 text-display">
              We ran into an error retrieving your graphs. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github
            </h2>
          </>
        )}
        {showAllEntities && isLoadingEntities && !isEntitiesError && (
          <>
            <GraphLoaderCard />
            <GraphLoaderCard />
          </>
        )}
        {showAllEntities && !isLoadingEntities && (
          <div className="mt-2 h-full overflow-y-scroll overflow-x-hidden">
            {entities?.length && entities.map((entity: JSONObject) => {
              return (
                <button key={entity.uuid} onClick={() => {
                  navigate(`entity/${entity.uuid}`)
                }} className={classNames("mb-1 focus:outline-none py-3 bg-dark-700 border-y rounded-md border-transparent hover:border-dark-400 border-l px-3 rounded-r-none hover:translate-x-px transition-transform focus:translate-x-px  hover:bg-dark-900 text-slate-600 hover:text-slate-400 focus:bg-dark-900 focus:text-slate-400  w-full  flex items-center ", params?.entityId === entity.uuid && "!border-dark-400 bg-dark-900 translate-x-px")}>
                  <div className="flex w-full flex-col items-start mr-3 space-y-1.5">
                    <p className={classNames("text-sm font-medium leading-none", params?.graphId === entity.uuid && "text-slate-400")}>{entity.label}</p>
                    <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === entity.uuid && "!text-slate-500")}>{entity?.description?.length >= MAX_DESCRIPTION_LENGTH ? `${entity.description.slice(0, MAX_DESCRIPTION_LENGTH)}...` : entity.description}</p>
                    <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", params?.graphId === entity.uuid && "!text-slate-500")}>Last seen {formatPGDate(entity.last_seen)}</p>
                  </div>
                  <StarIcon
                    onClick={() => {
                      // sdk.entities.updateFavoriteEntityUuid(entity.uuid, true).
                      //   then((data: JSONObject) => {
                      //     const filteredEntities = entitiesData.filter((graph: JSONObject) =>
                      //       graph.uuid !== data.uuid
                      //     ).map((entity: JSONObject) => ({ ...entity }))
                      //     setEntitiesData(filteredEntities)
                      //     setEntitiesFavoriteData([...entitiesFavoriteData, data])
                      //   }).catch(error => console.error(error))
                    }}
                    className={classNames("bg-slate-900 ml-auto rounded-md p-1 h-8 w-8 transition-colors duration-150 hover:text-info-200/80",
                      entity.is_favorite ? 'text-info-200' : 'text-slate-600',
                      params?.graphId !== entity.uuid && '!bg-transparent hover:!bg-slate-900')
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
