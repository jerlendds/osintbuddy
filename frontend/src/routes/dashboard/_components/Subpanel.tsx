import { Link, useParams } from "react-router-dom"
import styles from "./subpanel.module.css"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { StarIcon } from "@heroicons/react/24/outline";
import { formatPGDate } from "@src/app/utilities"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"


const MAX_DESCRIPTION_LENGTH = 79
const MAX_LABEL_LENGTH = 32

export function GraphLoaderCard() {
  return (
    <>
      <div className="mb-2">
        <div className="w-full py-6 space-y-1 rounded-md rounded-r-none border border-mirage-400/60  from-mirage-400/50 to-mirage-400/30 shadow bg-gradient-to-tl from-10%  before:absolute  px-4  via-mirage-400/10 relative before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-mirage-300/5 before:to-transparent isolate overflow-hidden shadow-black/5 border-l border-y border-mirage-500">
          <div className="space-y-3">
            <div className="h-2 w-3/5 rounded-lg bg-slate-600/20 animate-pulse"></div>
            <div className="h-2 w-4/5 rounded-lg bg-slate-600/20 animate-pulse"></div>
            <div className="h-2 w-2/5 rounded-lg bg-slate-600/20 animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  )
}

interface EntitiesSubpanelProps {
  showError: boolean | FetchBaseQueryError | SerializedError | undefined
  showEntities: boolean
  isLoading: boolean | undefined
  setShowEntities: () => void
  isSuccess: boolean | undefined
  label: string
  onClick: (hid: string) => void
  items: JSONObject[] | undefined // Entity[] | Graph[]
  to: "/dashboard/entity" | "/dashboard/graph"
  errorMessage?: string | null
}

export default function Subpanel({
  showError,
  showEntities,
  isLoading,
  setShowEntities,
  isSuccess,
  label,
  onClick,
  items,
  to,
  errorMessage
}: EntitiesSubpanelProps) {
  const { hid } = useParams();

  return (
    <section className={styles["subpanel"]}>
      <header className={styles["subpanel-header"]} onClick={setShowEntities}>
        <h2 className={`${styles["cyberpunk"]} ${styles["glitched"]}`}>{label ?? ""}</h2>
        <ChevronDownIcon className={styles[`show-header-icon-${showEntities}`] + " transition-transform duration-100"} />
      </header>
      {showError && showEntities && !isLoading && (
        <>
          <p>
            {errorMessage?.length ? (<p className="text-slate-400/60 text-sm px-2">{errorMessage}</p>) : (
              <>We ran into an error fetching your data. Please try refreshing the page, if this error continues to occur please <a href="#" className="text-info-300">file an issue</a> on github</>
            )}
          </p>
        </>
      )}
      {showEntities && isLoading && !showError && (
        <>
          <GraphLoaderCard />
          <GraphLoaderCard />
        </>
      )}

      <section className={` transition-transform duration-150 ease-out ${showEntities ? 'translate-y-0' : '-translate-y-[45%] -scale-y-0 !h-0'}`}>
        {items && items.map((item) => {
          const isActive = hid === item.id
          const descriptionClassName = styles["subpanel-desc"] + " " + styles[`subpanel-desc-${isActive}`]
          return (
            <Link
              key={item.id}
              to={`${to}/${item.id}`}
              className={`${styles["subpanel-link"]} ${styles[`subpanel-link-${isActive}`]} ${isSuccess && showEntities ? 'translate-y-0 scale-y-100' : '-translate-y-full  scale-y-0 '}`}>
              <div>
                <p className={styles["subpanel-label"] + " " + styles[`subpanel-label-${isActive}`]}>{item.label}</p>
                <p className={descriptionClassName}>{item.description}</p>
                <p className={descriptionClassName}><span className="font-sans">Last seen </span> {formatPGDate(item?.last_edited ? item.last_edited : item.last_seen)}</p>
              </div>
              <StarIcon
                onClick={async () => await onClick(item.id)}
                className={
                  styles["link-icon"] + " " +
                  styles[`link-icon-${item.is_favorite}`] + " " +
                  styles[`link-active-${hid !== item.id}`]
                }
              />
            </Link>
          )
        })}
      </section>
    </section>
  )
}