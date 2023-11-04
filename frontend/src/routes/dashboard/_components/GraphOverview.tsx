import { useMemo } from "react";
import { useGetFavoriteGraphsQuery, useGetGraphsQuery } from "@/app/api";

export default function GraphOverview() {
  const {
    data: favoriteGraphsData = { graphs: [], count: 0 },
    isLoading: isLoadingFavoriteGraphs,
    error: isFavoriteGraphsError
  } = useGetFavoriteGraphsQuery({ skip: 0, limit: 50 })

  const {
    data: graphsData = { graphs: [], count: 0 },
    isLoading: isLoadingGraphs,
    error: isGraphsError
  } = useGetGraphsQuery({ skip: 0, limit: 50, isFavorite: true })

  const graphs = useMemo(() => {
    const sortedGraphs = graphsData.graphs.slice()
    sortedGraphs.sort((a, b) => b.created.localeCompare(a.created))
    return sortedGraphs
  }, [graphsData])

  const favoriteGraphs = useMemo(() => {
    const sortedGraphs = favoriteGraphsData.graphs.slice()
    sortedGraphs.sort((a, b) => b.created.localeCompare(a.created))
    return sortedGraphs
  }, [graphsData])

  return <>
    <div className="w-full items-center justify-center my-14">
      <div className="grid place-items-center relative z-10 text-slate-400">
        <div className="bg-dark-600 border-dark-400 border rounded-md grid place-items-center my-8 py-16 px-4 md:px-16 lg:px-20">
          {favoriteGraphs.length === 0 && graphs.length === 0 && (
            <>
              <h1 className="text-slate-300 text-3xl lg:text-4xl font-bold pt-12 sm:pt-14 lg:pt-8 ">Oh no!</h1>
              <p className="py-6 md:py-8 max-w-lg">
                We're usually a treasure chest of knowledge,
                but we couldn't find any graphs. Get started
                by creating a new graph
              </p>
            </>
          )}
          {(graphs.length > 0 || favoriteGraphs.length > 0) && (
            <>
              <h1 className="text-slate-300 text-3xl lg:text-4xl font-bold pt-12 sm:pt-14 lg:pt-8 ">
                {graphs.length + favoriteGraphs.length} {(graphs.length ? graphs.length : 0 + favoriteGraphs.length ? favoriteGraphs.length : 0) === 1 ? 'graph' : 'graphs'} available</h1>
              <p className="py-6 md:py-8 max-w-md">
                Get started by selecting an existing graph from the sidebar
                on the left, or try creating a new graph
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  </>
}