import { PlusIcon } from "@heroicons/react/24/outline";
import { useDashboardContext } from ".";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Graphs() {
  const navigate = useNavigate()
  const { activeInquiryTab, graphsData, favoriteGraphsData } = useDashboardContext()

  useEffect(() => {
    if (favoriteGraphsData?.length > 0) {
      navigate(`/app/inquiries/graphs/${favoriteGraphsData[0]?.uuid}`)
    } else {
      if (graphsData?.length) navigate(`/app/inquiries/graphs/${graphsData[0]?.uuid}`)
    }
  }, [graphsData])

  return <>
    <div className="w-full items-center justify-center my-14">
      <div className="grid place-items-center relative z-10 text-slate-400">
        <div className="bg-dark-600 border-dark-400 border rounded-md grid place-items-center my-8 py-16 px-4 md:px-16 lg:px-20">
          {activeInquiryTab === 'graphs' && favoriteGraphsData?.length === 0 && graphsData?.length === 0 && (
            <>
              <h1 className="text-slate-300 text-3xl lg:text-4xl font-bold pt-12 sm:pt-14 lg:pt-8 ">Oh no!</h1>
              <p className="py-6 md:py-8">
                We're usually a treasure chest of knowledge,
                but we couldn't find any graphs. Get started
                by creating a new graph
              </p>
            </>
          )}
          {activeInquiryTab === 'graphs' && (graphsData?.length > 0 || favoriteGraphsData?.length > 0) && (
            <>
              <h1 className="text-slate-300 text-3xl lg:text-4xl font-bold pt-12 sm:pt-14 lg:pt-8 ">{graphsData?.length + favoriteGraphsData?.length} {(graphsData?.length ? graphsData.length : 0 + favoriteGraphsData?.length ? favoriteGraphsData.length : 0) === 1 ? 'graph' : 'graphs'} available</h1>
              <p className="py-6 md:py-8 max-w-md">
                Get started by selecting an existing graph from the sidebar
                on the left, or try creating a new graph
              </p>
            </>
          )}
          <button
            className='mb-3.5 ring-1 ring-info-200 pr-3 text-left text-sm font-semibold text-info-200 hover:text-info-300 flex items-center border border-info-200 hover:border-info-300 py-2 px-3 rounded-md mr-1'
          >
            Create graph
            <PlusIcon className='ml-2 w-5 h-5 ' />
          </button>
        </div>
      </div>
    </div>
  </>
}