import { Link, useParams } from "react-router-dom"
import styles from "./subpanel.module.css"
import { ChevronDownIcon } from "@heroicons/react/20/solid"
import { StarIcon } from "@heroicons/react/24/outline";
import { formatPGDate } from "@/app/utilities"
import { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import { SerializedError } from "@reduxjs/toolkit"


const MAX_DESCRIPTION_LENGTH = 63


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
  showError: boolean | FetchBaseQueryError | SerializedError | undefined
  showEntities: boolean
  isLoading: boolean | undefined
  setShowEntities: () => void
  isSuccess: boolean | undefined
  label: string
  onClick: (hid: string) => void
  items: JSONObject[] | undefined // Entity[] | Graph[]
  to: "/dashboard/entity" | "/dashboard/graph"
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
  to
}: EntitiesSubpanelProps) {
  const { hid } = useParams();

  return (
    <div className={styles["subpanel"]}>
      <div className={styles["subpanel-header"]} onClick={setShowEntities}>
        <p>{label ?? ""}</p>
        <ChevronDownIcon className={styles[`show-header-icon-${showEntities}`]} />
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
        <section className={styles["subpanel-section"]}>
          {items && items.map((item) => {
            return (
              <Link
                key={item.id}
                to={`${to}/${item.id}`}
                className={styles["subpanel-link"] + " " + styles[`subpanel-link-${hid === item.id}`]}>
                <div>
                  <p className={styles["subpanel-label"] + " " + styles[`subpanel-label-${hid === item.id}`]}>{item?.label ? item.label : item.name}</p>
                  <p className={styles["subpanel-desc"] + " " + styles[`subpanel-desc-${hid === item.id}`]}>{item?.description?.length ?? 0 >= MAX_DESCRIPTION_LENGTH ? `${item?.description?.slice(0, MAX_DESCRIPTION_LENGTH)}...` : item.description}</p>
                  <p className={styles["subpanel-desc"] + " " + styles[`subpanel-desc-${hid === item.id}`]}>Last seen {formatPGDate(item?.last_edited ? item.last_edited : item.last_seen)}</p>
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
      )}
    </div>
  )
}