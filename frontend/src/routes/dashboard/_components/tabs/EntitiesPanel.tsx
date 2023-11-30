import { useUpdateEntityFavoriteIdMutation } from "@/app/api";
import { useMemo, useState } from "react";
import styles from "./subpanel.module.css"
import Subpanel from "./Subpanel";


export default function EntitiesPanel({
  entitiesData,
  isLoading,
  isError,
  isSuccess,
  refreshAllEntities,
}: JSONObject) {
  const [showFavoriteEntities, setShowFavoriteEntities] = useState<boolean>(true);
  const [showEntities, setShowEntities] = useState(true);



  const entities = useMemo(() => {
    const sortedEntities = entitiesData.entities.slice()
    sortedEntities.sort((a: any, b: any) => b.last_edited.localeCompare(a.last_edited))
    return sortedEntities
  }, [entitiesData])

  const favoriteEntities = useMemo(() => {
    const sortedEntities = entitiesData.favorite_entities.slice()
    sortedEntities.sort((a: any, b: any) => b.last_edited.localeCompare(a.last_edited))
    return sortedEntities
  }, [entitiesData])

  const [updateEntityIsFavorite] = useUpdateEntityFavoriteIdMutation()

  const updateEntityOnBookmark = async (hid: string) => {
    await updateEntityIsFavorite({ hid })
    refreshAllEntities()
  }

  return (
    <section className={styles["subpanel-wrapper"]}>
      <Subpanel
        label="Favorites"
        showError={isError}
        showEntities={showFavoriteEntities}
        setShowEntities={() => setShowFavoriteEntities(!showFavoriteEntities)}
        isLoading={isLoading}
        isSuccess={isSuccess}
        items={favoriteEntities}
        onClick={async (hid) => await updateEntityOnBookmark(hid)}
        to="/dashboard/entity"
      />
      <Subpanel
        label="All entities"
        showError={isError}
        showEntities={showEntities}
        setShowEntities={() => setShowEntities(!showEntities)}
        isLoading={isLoading}
        isSuccess={isSuccess}
        items={entities}
        onClick={async (hid) => await updateEntityOnBookmark(hid)}
        to="/dashboard/entity"
      />
    </section >
  )
}
