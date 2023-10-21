import GraphHeader from "./_components/GraphHeader"
import { useEffectOnce } from "@/components/utils"
import { useEffect, useRef, useState } from "react"
import { useParams } from "react-router-dom"
import 'chartist/dist/index.css';
import { BarChart } from "chartist"
import CaseNotes from "@/components/Notes/CaseNotes"
import { sdk } from "@/app/api";

export default function GraphDetails() {
  const params: any = useParams()
  const [activeGraph, setActiveGraph] = useState<any>(null);
  const [graphStats, setGraphStats] = useState<any>(null);

  useEffect(() => {
    sdk.graphs.getGraph(params.graphId)
      .then((data) => {
        setActiveGraph(data.graph)
      })
    sdk.graphs.getGraphStats(params.graphId)
      .then((data) => setGraphStats(data))
      .catch((error) => error)
  }, [params?.graphId])

  const uniqueChartRef = useRef(null);
  const uniqueOuteChartRef = useRef(null);

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
    if (uniqueOuteChartRef?.current) {
      let data = graphStats?.entity_oute_counts ? graphStats?.entity_oute_counts : {
        labels: [],
        series: []
      };
      new BarChart(
        uniqueOuteChartRef.current,
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
        <GraphHeader stats={graphStats} graph={activeGraph} />
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
              <div className=" mb-3 overflow-y-scroll h-auto max-h-72 bar-hz" ref={uniqueOuteChartRef}></div>
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
