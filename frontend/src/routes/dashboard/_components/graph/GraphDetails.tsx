import { useEffect, useMemo, useRef, useState } from "react"
import { useOutletContext, useParams } from "react-router-dom"
import 'chartist/dist/index.css';
import { BarChart } from "chartist"
import { Graph, useGetGraphQuery, } from "@src/app/api";
import GraphHeader from "./GraphHeader"
import { DashboardContextType } from "../..";
import { GridPanel } from "@src/components/Grid";
import { Responsive, WidthProvider } from "react-grid-layout";
import { useAppSelector } from "@src/app/hooks";
import { selectIsSidebarOpen } from "@src/features/account/accountSlice";

const ResponsiveGridLayout = WidthProvider(Responsive)

export default function GraphDetails() {
  const { hid } = useParams()
  const { data: activeGraph } = useGetGraphQuery({ hid: hid as string })

  const uniqueChartRef = useRef(null);
  const uniqueOutEdgesChartRef = useRef(null);
  const { graphStats, refetchGraphs } = useOutletContext<DashboardContextType>();

  const [isEdgesLocked, setIsEdgesLocked] = useState(false);
  const [isEntityLocked, setIsEntityLocked] = useState(false);

  const isSidebarOpen = useAppSelector((state) => selectIsSidebarOpen(state))

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
  }, [graphStats?.unique_entity_counts, isEdgesLocked, isSidebarOpen])


  // const layouts = {
  //   'lg': [
  //     {
  //       i: 'u-entity-count',
  //       x: 0,
  //       y: 0,
  //       w: 20,
  //       h: 20,
  //       minH: 20,
  //       isDraggable: isEntityLocked
  //     },
  //     {
  //       i: 'u-edges-count',
  //       x: 0,
  //       y: 0,
  //       w: 20,
  //       h: 20,
  //       minH: 20,
  //       isDraggable: isEdgesLocked
  //     }
  //   ]
  // }
  return (
    <>
      <section className="flex flex-col h-screen w-full">
        <header className="flex w-full">
          <GraphHeader refetchGraphs={async () => await refetchGraphs()} stats={graphStats} graph={activeGraph as Graph} />
        </header>
        <ResponsiveGridLayout
          className="relative flex-grow h-full z-10 w-full"
          rowHeight={1}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 50, md: 50, sm: 50, xs: 50, xxs: 50 }}
          isResizable={true}
          allowOverlap={true}
        >
          <div data-grid={{
            x: 0,
            y: 0,
            w: 15,
            h: 20,
            static: !isEntityLocked,
            isBounded: true
          }} key="u-entity-count" className={isEntityLocked ? 'z-50' : '-z-10'}>
            <GridPanel setIsLocked={setIsEntityLocked} isLocked={isEntityLocked} icon='graph' label="Unique Entity Counts" >
              <div className="w-full mb-0 bar-hz" ref={uniqueChartRef} />
            </GridPanel>
          </div>
          <div data-grid={{
            x: 0,
            y: 20,
            w: 15,
            h: 20,
            cols: 1,
            static: !isEdgesLocked,
            isBounded: true
          }} key="u-edges-count" className={isEdgesLocked ? 'z-50' : '-z-10'}>

            <GridPanel setIsLocked={setIsEdgesLocked} isLocked={isEdgesLocked} icon='graph' label="Outgoing Edges Count by Entity">
              <div className="w-full mb-0 bar-hz" ref={uniqueOutEdgesChartRef} />
            </GridPanel>
          </div>
        </ResponsiveGridLayout>
      </section >

    </>
  )
}
