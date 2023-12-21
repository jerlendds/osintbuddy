import { useState } from 'react'
import Subpanel from '../Subpanel'
import styles from '../subpanel.module.css'

export default function MarketPanel() {
  const [showProviders, setShowProviders] = useState(false)
  const [showCommunityPlugins, setShowCommunityPlugins] = useState(false);

  return (
    <>
      <section className={styles["subpanel-wrapper"]}>
        <Subpanel
          label="Community"
          showError={true}
          showEntities={showCommunityPlugins}
          setShowEntities={() => setShowCommunityPlugins(!showCommunityPlugins)}
          isLoading={false}
          isSuccess={false}
          items={[]}
          onClick={async (hid: string) => null}
          to="/dashboard/graph"
          errorMessage={"The market will be here one day... Follow the project on the forum or on discord to get the latest updates"}
        />
        <Subpanel
          label="Providers"
          showError={true}
          showEntities={showProviders}
          setShowEntities={() => setShowProviders(!showProviders)}
          isLoading={false}
          isSuccess={false}
          items={[]}
          onClick={async (hid: string) => null}
          to="/dashboard/graph"
          errorMessage={"Coming eventually... Stay tuned!"}
        />
      </section>
    </>
  )
}