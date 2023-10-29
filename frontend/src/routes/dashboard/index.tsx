import { Fragment, useRef, useState } from "react";
import CreateProjectModal from "./_components/CreateProjectModal";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectActiveTab, setActiveTab } from "@/features/dashboard/dashboardSlice";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Tab } from "@headlessui/react";
import classNames from "classnames";
import GraphPanel from "./_components/GraphPanel";
import EntitiesPanel from "./_components/EntityPanel";
import { useEffectOnce } from "@/components/utils";
import { sdk } from "@/app/api";
import { CasdoorUser } from "@/app/openapi";

interface DashboardTabsProps {
  tabs: JSX.Element
  panels: JSX.Element
}

function DashboardTabs({ tabs, panels }: DashboardTabsProps) {
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
export default function DashboardPage() {
  useEffectOnce(() => {
    sdk.users.getAccount()
      .then((user: CasdoorUser) => console.log(user))
      .catch((error: Error) => console.error(error))
  })

  const [activeInquiryTab, setActiveInquiryTab] = useState<'graphs' | 'entities' | 'market'>('graphs')

  let [showCreateGraphModal, setShowCreateGraphModal] = useState(false);
  const cancelCreateGraphRef = useRef<HTMLElement>(null);

  const dispatch = useAppDispatch()

  const activeTab = useAppSelector(state => selectActiveTab(state))

  const navigate = useNavigate()

  return (
    <>
      <div className="flex overflow-y-hidden">
        <div className="h-screen !min-w-[20rem] max-w-[20rem] justify-between flex flex-col w-full py-8 bg-dark-700 border-r border-dark-400 pl-3">
          <div className="flex items-center relative bg-dark-900 border-y border-l border-dark-400 rounded rounded-r-none -mr-px">
            <MagnifyingGlassIcon className="w-5 h-5 text-slate-700 ml-2" />
            <input type="text" className="py-3 pl-1 w-full focus:outline-none relative  bg-dark-700 text-sm font-medium text-slate-400 bg-transparent placeholder-slate-700" placeholder={`Search ${activeTab}...`} />
          </div>
          <DashboardTabs
            tabs={
              <>
                <Tab as={Fragment}>
                  {({ selected }) => (
                    <button
                      onClick={() => {
                        dispatch(setActiveTab('graphs'))
                        navigate('/app/dashboard/graphs', { replace: true })
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
                        dispatch(setActiveTab('entities'))

                        navigate('/app/dashboard/entities', { replace: true })
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
                        dispatch(setActiveTab('market'))
                        navigate('/app/dashboard/market', { replace: true })
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
                  <GraphPanel />
                </Tab.Panel>
                <Tab.Panel className="flex flex-col justify-between h-full w-full relative">
                  <EntitiesPanel />
                </Tab.Panel>
                <Tab.Panel className="flex flex-col justify-between h-full w-full relative">
                  TODO: Market
                  {/* <MarketPanel /> */}
                </Tab.Panel>
              </>
            }
          />
          {activeTab !== 'market' && (
            <button
              onClick={() => {
                if (activeTab === 'entities') {

                }
                if (activeTab === 'graphs') {
                  setShowCreateGraphModal(true)
                }
              }}
              className=' ring-1 ring-info-200 text-left text-sm font-semibold text-info-200 hover:text-info-300 flex items-center border border-info-200 hover:border-info-300 py-2 px-3 rounded-md mx-4 mt-auto justify-center'
            >
              Create {activeTab === 'entities' ? 'entity' : activeTab?.replace('s', '')}
              <PlusIcon className='ml-5 w-5 h-5 ' />
            </button>
          )}
        </div >
        <Outlet />
      </div>
      <CreateProjectModal
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


