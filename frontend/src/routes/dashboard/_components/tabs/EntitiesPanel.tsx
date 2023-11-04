import { Entity, useGetEntitiesQuery, useUpdateEntityFavoriteIdMutation } from "@/app/api";
import { useEffectOnce } from "@/app/hooks";
import { formatPGDate } from "@/app/utilities";
import { ChevronDownIcon, StarIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

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


interface EntitiesSubpanelProps {
  showError: boolean
  showEntities: boolean
  isLoading: boolean
  setShowEntities: () => void
  isSuccess: boolean
  label: string
  onClick: (hid: string) => void
  entities: Entity[]
}

export function EntitiesSubpanel({
  showError,
  showEntities,
  isLoading,
  setShowEntities,
  isSuccess,
  label,
  onClick,
  entities
}: EntitiesSubpanelProps) {
  const { hid } = useParams();

  return (
    <div className="flex flex-col pb-2">
      <div className="pb-1 flex items-center hover:border-dark-300 border-b transition-colors duration-100 ease-in-out border-transparent" onClick={setShowEntities}>
        <p className="text-xs font-medium leading-3 text-slate-500 focus:outline-none cursor-pointer">{label}</p>
        <ChevronDownIcon className={classNames("h-4 w-4 text-slate-400 ml-auto transform focus:outline-none cursor-pointer origin-center -rotate-180 mr-3", showEntities && 'rotate-0')} />
      </div>
      {showError && showEntities && !isLoading && (
        <>
          <h2 className="text-slate-400 text-display">
            We ran into an error retrieving your entities. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github
          </h2>
        </>
      )}
      {showEntities && isLoading && !showError && (
        <>
          <GraphLoaderCard />
          <GraphLoaderCard />
        </>
      )}
      {isSuccess && showEntities && (
        <div className="mt-2 overflow-y-scroll overflow-x-hidden">
          {entities?.length && entities.map((entity) => {
            return (
              <Link
                key={entity.id}
                to={`entity/${entity.id}`}
                className={classNames("mb-1 focus:outline-none py-3 bg-dark-700 border-y rounded-md border-transparent hover:border-dark-400 border-l px-3 rounded-r-none hover:translate-x-px transition-transform focus:translate-x-px  hover:bg-dark-900 text-slate-600 hover:text-slate-400 focus:bg-dark-900 focus:text-slate-400  w-full  flex items-center ", hid === entity.id && "!border-dark-400 bg-dark-900 translate-x-px")}>
                <div className="flex w-full flex-col items-start mr-3 space-y-1.5">
                  <p className={classNames("text-sm font-medium leading-none", hid === entity.id && "text-slate-400")}>{entity.label}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", hid === entity.id && "!text-slate-500")}>{entity?.description?.length ?? 0 >= MAX_DESCRIPTION_LENGTH ? `${entity?.description?.slice(0, MAX_DESCRIPTION_LENGTH)}...` : entity.description}</p>
                  <p className={classNames("text-xs font-medium leading-none text-slate-600  text-left", hid === entity.id && "!text-slate-500")}>Last seen {formatPGDate(entity?.last_edited)}</p>
                </div>
                <StarIcon
                  onClick={async () => await onClick(entity.id)}
                  className={classNames("bg-slate-900 ml-auto rounded-md p-1 h-8 w-8 transition-colors duration-150 hover:text-info-200/80",
                    entity.is_favorite ? '!text-info-200' : 'text-slate-600',
                    hid !== entity.id && '!bg-transparent hover:!bg-slate-900')
                  }
                />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

const MAX_DESCRIPTION_LENGTH = 63

export default function EntitiesPanel() {
  const [showFavoriteEntities, setShowFavoriteEntities] = useState<boolean>(true);
  const [showEntities, setShowEntities] = useState(true);

  const {
    data: entitiesData = { entities: [], count: 0, favorite_entities: [], favorite_count: 0 },
    isLoading,
    isError,
    isSuccess,
    refetch: refreshAllEntities
  } = useGetEntitiesQuery({ skip: 0, limit: 50 })

  console.log(isLoading, isError)

  const entities = useMemo(() => {
    const sortedEntities = entitiesData.entities.slice()
    sortedEntities.sort((a: any, b: any) => b.created.localeCompare(a.created))
    return sortedEntities
  }, [entitiesData])

  const favoriteEntities = useMemo(() => {
    const sortedEntities = entitiesData.favorite_entities.slice()
    sortedEntities.sort((a: any, b: any) => b.created.localeCompare(a.created))
    return sortedEntities
  }, [entitiesData])

  const [updateEntityIsFavorite] = useUpdateEntityFavoriteIdMutation()

  const updateEntityOnBookmark = async (hid: string) => {
    await updateEntityIsFavorite({ hid })
    refreshAllEntities()
  }

  return (
    <section className="mt-5 px-2 flex-col justify-between h-full">
      <EntitiesSubpanel
        label="FAVORITES"
        showError={isError}
        showEntities={showFavoriteEntities}
        setShowEntities={() => setShowFavoriteEntities(!showFavoriteEntities)}
        isLoading={isLoading}
        isSuccess={isSuccess}
        entities={favoriteEntities}
        onClick={async (hid) => await updateEntityOnBookmark(hid)}
      />
      <EntitiesSubpanel
        label="ALL ENTITIES"
        showError={isError}
        showEntities={showEntities}
        setShowEntities={() => setShowEntities(!showEntities)}
        isLoading={isLoading}
        isSuccess={isSuccess}
        entities={entities}
        onClick={async (hid) => await updateEntityOnBookmark(hid)}
      />
    </section >
  )
}
