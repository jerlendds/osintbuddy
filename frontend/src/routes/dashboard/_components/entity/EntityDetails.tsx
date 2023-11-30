import { useParams } from "react-router-dom"
import EntityEditor from "../../../../components/EntityEditor/EntityEditor";
import { useGetEntityQuery } from "@/app/api";


export default function EntityDetailsPage() {
  const { hid = "" } = useParams()
  const { isLoading, data: activeEntity, refetch: refetchEntity } = useGetEntityQuery({ hid })
  console.log(activeEntity, hid)
  return (
    <>
      <div className="flex flex-col h-screen w-full">
        <section className="flex w-full h-full relative">
          <EntityEditor key={`${isLoading}${hid}`} activeEntity={activeEntity} />
        </section>
      </div>
    </>
  )
}
