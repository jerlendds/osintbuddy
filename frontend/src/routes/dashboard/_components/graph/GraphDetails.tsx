import { useEffect, useRef } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import 'chartist/dist/index.css';
import { BarChart } from "chartist"
import { Graph, useGetGraphQuery, useGetGraphStatsQuery } from "@/app/api";
import CaseNotes from "@/components/Notes/CaseNotes"
import GraphHeader from "./GraphHeader"
import { DashboardContextType } from "../..";
import { useEffectOnce } from "@/app/hooks";



export default function GraphDetails() {
  const { hid } = useParams()
  const { data: activeGraph } = useGetGraphQuery({ hid: hid as string })

  const uniqueChartRef = useRef(null);
  const uniqueOutEdgesChartRef = useRef(null);
  const { graphStats, refreshAllGraphs } = useOutletContext<DashboardContextType>();

  useEffect(() => {
    if (uniqueChartRef?.current) {
      let data = graphStats?.unique_entity_counts ? graphStats?.unique_entity_counts : {
        labels: [],
        series: []
      };
      new BarChart(
        uniqueChartRef.current,
        data,
        {
          distributeSeries: true,
          reverseData: true,
          horizontalBars: true,
          axisY: {
            offset: 150,
            position: "end",
          },
        }
      );
    }
    if (uniqueOutEdgesChartRef?.current) {
      let data = graphStats?.entity_out_edges_count ? graphStats.entity_out_edges_count : {
        labels: [],
        series: []
      };
      new BarChart(
        uniqueOutEdgesChartRef.current,
        data,
        {
          distributeSeries: true,
          reverseData: true,
          horizontalBars: true,
          axisY: {
            offset: 150,
            position: "end",
          },
        }
      );
    }
  }, [graphStats?.unique_entity_counts])


  return (
    <>
      <section className="flex flex-col w-full">
        <GraphHeader refreshAllGraphs={async () => await refreshAllGraphs()} stats={graphStats} graph={activeGraph as Graph} />
        <section className="flex w-full h-full relative">
          <div className="flex flex-col w-2/5">
            <div className="flex flex-col pl-4 mx-4 mt-4 bg-dark-600 rounded-md ">
              <h3 className="text-slate-300 mt-3 font-display font-medium text-md">
                Unique Entity Counts
              </h3>
              <div className=" mb-3 overflow-y-scroll h-auto max-h-72 bar-hz" ref={uniqueChartRef}></div>
            </div>
            <div className="flex flex-col pl-4 mx-4 mt-4 bg-dark-600 rounded-md ">
              <h3 className="text-slate-300 mt-3 font-display font-medium text-md">
                Outgoing Relations Count by Entity
              </h3>
              <div className=" mb-3 overflow-y-scroll h-auto max-h-72 bar-hz" ref={uniqueOutEdgesChartRef}></div>
            </div>
          </div>
          <section className="flex flex-col w-3/5 pl-6 h-full py-2 overflow-y-scroll pt-4 rounded-br-md absolute right-0 bg-black/20 pr-4 bg-dark-950 border-l border-b border-dark-400">
            <CaseNotes />
          </section>
        </section>
      </section>
    </>
  )
}
