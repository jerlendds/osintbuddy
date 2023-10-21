import { Tab } from "@headlessui/react"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline"
import classNames from "classnames"
import { Fragment, useState } from "react"
import { useNavigate } from "react-router-dom"
import GraphPanel from "./GraphPanel"
import EntitiesPanel from "./EntityPanel"
import { useEffectOnce } from "@/components/utils"
import { sdk } from "@/app/api"

interface InquiryTabsProps {
  tabs: JSX.Element
  panels: JSX.Element
}

function InquiryTabs({ tabs, panels }: InquiryTabsProps) {

  return (
    <Tab.Group as='section' className="flex flex-col h-full relative" defaultIndex={0}>
      <Tab.List className="flex w-full justify-between px-2 py-3">
        {tabs}
      </Tab.List>
      <Tab.Panels className="flex w-full justify-between pl-3 flex-col">
        {panels}
      </Tab.Panels>
    </Tab.Group>
  )
}

interface InquirySidebarProps {
  setActiveTab: any
  activeTab: string
  favoritesData: JSONObject[]
  setFavoritesData: Function
  openGraphModal: Function
  graphsData: any
  favoriteGraphsData: any
  setGraphsData: any
  setFavoriteGraphsData: any
  fetchGraphsData: any
  fetchGraphs: any
  fetchGraphsIdRef: any
  isGraphsError: any
  isLoadingGraphs: any
  graphsPageCount: any
  setGraphsPageCount: any
  fetchFavoritesIdRef: any
  isFavoritesError: any
  isLoadingFavorites: any
  favoritesPageCount: any
  setFavoritesPageCount: any
}

export default function InquirySidebar({
  setActiveTab,
  activeTab,
  openGraphModal,
  graphsData,
  favoriteGraphsData,
  setGraphsData,
  setFavoriteGraphsData,
  fetchGraphsData,
  isGraphsError,
  isLoadingGraphs,
  isFavoritesError,
  isLoadingFavorites,
  fetchGraphs
}: JSONObject) {
  const navigate = useNavigate();

  const [entitiesData, setEntitiesData] = useState<JSONObject[]>([]);
  const [isLoadingEntities, setLoadingEntities] = useState<boolean>(false);
  const [isEntitiesError, setIsEntitiesError] = useState<boolean>(false);

  const [entitiesFavoriteData, setEntitiesFavoriteData] = useState<JSONObject[]>([]);
  const [isLoadingFavoriteEntities, setLoadingFavoriteEntities] = useState<boolean>(false);
  const [isEntitiesFavoriteError, setIsEntitiesFavoriteError] = useState<boolean>(false);


  useEffectOnce(() => {
    const skip = 0;
    const limit = 20;
    setLoadingEntities(true);

  })

  const fetchEntities = ({ skip, limit }: JSONObject) => {
    setIsEntitiesError(false);
    setIsEntitiesFavoriteError(false);

    sdk.entities.getEntities(skip, limit, true).then((data) => {
      setEntitiesFavoriteData(data.entities);
      setLoadingFavoriteEntities(false);
    }).catch((error) => {
      console.error(error);
      setLoadingFavoriteEntities(false);
      setIsEntitiesFavoriteError(true);
    })
    sdk.entities.getEntities(skip, limit, false).then((data) => {
      setEntitiesData(data.entities);
      setLoadingEntities(false);
    }).catch((error) => {
      console.error(error);
      setLoadingEntities(false);
      setIsEntitiesError(true);
    })
  }
  return (
    <>
      <div className="h-screen !min-w-[20rem] max-w-[20rem] justify-between flex flex-col w-full py-8 bg-dark-700 border-r border-dark-400 pl-3">
        <div className="flex items-center relative bg-dark-900 border-y border-l border-dark-400 rounded rounded-r-none -mr-px">
          <MagnifyingGlassIcon className="w-5 h-5 text-slate-700 ml-2" />
          <input type="text" className="py-3 pl-1 w-full focus:outline-none relative  bg-dark-700 text-sm font-medium text-slate-400 bg-transparent placeholder-slate-700" placeholder={`Search ${activeTab}...`} />
        </div>
        <InquiryTabs
          tabs={
            <>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    onClick={() => {
                      setActiveTab('graphs')
                      navigate('/app/inquiries/graphs', { replace: true })
                    }}
                    className={classNames("focus:outline-none transition-colors duration-75 ease-in-out flex items-center justify-center px-3 py-2.5 font-display rounded-full text-sm leading-none ", selected ? 'bg-info-300 text-slate-300 ' : 'text-slate-700 hover:text-slate-600')}>
                    Graphs
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    onClick={() => {
                      setActiveTab('entities')
                      navigate('/app/inquiries/entities', { replace: true })
                    }}
                    className={classNames("focus:outline-none transition-colors duration-75 ease-in-out flex items-center justify-center px-3 py-2.5 font-display rounded-full text-sm leading-none ", selected ? 'bg-info-300 text-slate-300 ' : 'text-slate-700 hover:text-slate-600')}>
                    Entities
                  </button>
                )}
              </Tab>
              <Tab as={Fragment}>
                {({ selected }) => (
                  <button
                    onClick={() => {
                      setActiveTab('market')
                      navigate('/app/inquiries/market', { replace: true })
                    }}
                    className={classNames("focus:outline-none transition-colors duration-75 ease-in-out flex items-center justify-center px-3 py-2.5 font-display rounded-full text-sm leading-none ", selected ? 'bg-info-300 text-slate-300 ' : 'text-slate-700 hover:text-slate-600')}>
                    Market
                  </button>
                )}
              </Tab>
            </>
          }
          panels={
            <>
              <Tab.Panel className="flex flex-col justify-between h-full w-full relative">
                <GraphPanel
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
              </Tab.Panel>
              <Tab.Panel className="flex flex-col justify-between h-full w-full relative">
                <EntitiesPanel
                  entitiesFavoriteData={entitiesFavoriteData}
                  setEntitiesFavoriteData={setEntitiesFavoriteData}
                  isLoadingFavoriteEntities={isLoadingFavoriteEntities}
                  isEntitiesFavoriteError={isEntitiesFavoriteError}
                  fetchEntities={fetchEntities}
                  isEntitiesError={isEntitiesError}
                  setEntitiesData={setEntitiesData}
                  entitiesData={entitiesData}
                  isLoadingEntities={isLoadingEntities}
                />
              </Tab.Panel>
              <Tab.Panel className="flex flex-col justify-between h-full w-full relative">
                <MarketPanel />
              </Tab.Panel>
            </>
          }
        />
        {activeTab !== 'market' && (
          <button
            onClick={() => {
              if (activeTab === 'graphs') {
                openGraphModal()
              }
              if (activeTab === 'entities') { // TODO }
              }
            }}
            className=' ring-1 ring-info-200 text-left text-sm font-semibold text-info-200 hover:text-info-300 flex items-center border border-info-200 hover:border-info-300 py-2 px-3 rounded-md mx-4 mt-auto justify-center'
          >
            Create {activeTab === 'entities' ? 'entity' : activeTab?.replace('s', '')}
            <PlusIcon className='ml-5 w-5 h-5 ' />
          </button>
        )}
      </div >
    </>
  );
}

function MarketPanel() {
  return <>
    <h2 className="text-slate-400 flex items-center justify-center">TODO: Market panel 'coming soon' page</h2>
  </>
}
