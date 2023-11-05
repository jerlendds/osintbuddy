import { Graph, useDeleteGraphMutation } from "@/app/api";
import { formatPGDate } from "@/app/utilities";
import { ClockIcon, EyeIcon, FingerPrintIcon, ScaleIcon, TrashIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface GraphHeaderProps {
  graph: Graph;
  stats: any;
  refreshAllGraphs: () => Promise<void>;
}

export default function GraphHeader({ graph, stats, refreshAllGraphs }: GraphHeaderProps) {
  const navigate = useNavigate()
  const [deleteGraph] = useDeleteGraphMutation()

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full bg-transparent border-b border-dark-400 -top-[2px] relative">
        <div className=" w-full mx-auto">
          <section className="flex flex-col items-start justify-between px-4 lg:items-center lg:px-6 md:px-4 lg:flex-row md:flex-row md:items-center  relative">
            <div className="flex flex-col w-full py-2 ">
              <h3 className="text-lg font-semibold whitespace-nowrap leading-normal text-slate-300">
                {graph?.name}
              </h3>
              <p className="text-sm leading-normal whitespace-normal h-10 truncate max-w-6xl text-slate-400">
                {graph?.description}
              </p>
            </div>
            <div className="flex w-full gap-x-4 mt-auto">
              <button
                onClick={async () => {
                  await deleteGraph({ hid: graph.id })
                    .then(() => {
                      navigate('/dashboard/graph', { replace: true })
                    })
                    .catch((error) => {
                      console.error(error)
                      toast.error("We ran into an error deleting your graph. Please try again")
                    })
                  await refreshAllGraphs()
                }}
                className="mb-3.5 ring-1 ring-danger-600 ml-auto pr-3 text-left text-sm font-semibold text-danger-600 hover:text-danger-700 flex items-center border border-danger-600 hover:border-danger-700 py-2 px-3 rounded-md mr-1 "
              >
                Delete graph
                <TrashIcon className="text-inherit h-5 w-5 ml-2" />
              </button>
              <Link
                to={`/graph/inquiry/${graph?.id}`}
                className='mb-3.5 ring-1 ring-info-200 pr-3 text-left text-sm font-semibold text-info-200 hover:text-info-300 flex items-center border border-info-200 hover:border-info-300 py-2 px-3 rounded-md mr-1'
              >
                Open graph
                <EyeIcon className='ml-2 w-5 h-5 ' />
              </Link>
            </div>
          </section>
          <hr className="mb-1 border-dark-400" />
          <section className="mb-1 flex flex-col px-4 py-1 lg:px-6 md:px-4 gap-x-5 lg:flex-row md:flex-row gap-y-4">
            {graph && stats && (
              <>
                <div className="flex items-center ml-[4px] gap-x-2">
                  <FingerPrintIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[1px]">
                    Unique Entities <span className="font-semibold">{stats.entities.length}</span>
                  </p>
                </div>
                <div className="flex items-center ml-[4px] gap-x-2">
                  <ScaleIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[1px]">
                    Entity Count <span className="font-semibold">{stats.total_entities}</span>
                  </p>
                </div>
                <div className="flex items-center ml-[4px] gap-x-2">
                  <ScaleIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[1px]">
                    Relations Count <span className="font-semibold">{stats.total_relations}</span>
                  </p>
                </div>
                <div className="flex items-center ml-auto gap-x-2">
                  <ClockIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[1px]">
                    Last updated <span className="font-semibold">{`${formatPGDate(graph.updated)}`}</span>
                  </p>
                </div>
                <div className="flex items-center ml-[4px] gap-x-2">
                  <ClockIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[1px]">
                    Created  <span className="font-semibold">{`${formatPGDate(graph.created)}`}</span>
                  </p>
                </div>
                <div className="flex gap-x-[5px] lg:mt-0 md:mt-0 -mt-[3px]">
                  <UserIcon className="h-5 w-5 text-slate-500" />
                  <p className="text-sm leading-none text-slate-500 mt-[2px]">
                    Owned by <span className="font-semibold">Jerlendds</span>
                  </p>
                </div>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}