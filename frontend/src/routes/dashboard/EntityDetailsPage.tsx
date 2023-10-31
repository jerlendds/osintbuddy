// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import EntityEditor from "../../components/EntityEditor/EntityEditor";





export default function EntityDetailsPage() {
  const params: { entityId: string | undefined } = useParams()
  const [activeGraph, setActiveGraph] = useState<any>(null);
  const [graphStats, setGraphStats] = useState<any>(null);
  const dispatch = useAppDispatch()

  useEffect(() => {
    params?.entityId && dispatch(setActiveEntityId(params.entityId))
  }, [params])
  const activeEntity = useAppSelector((state) => selectActiveEntity(state))

  return (
    <>
      <div className="flex flex-col h-screen w-full">
        <section className="flex w-full h-full relative">
          <EntityEditor activeEntity={activeEntity} />
        </section>
      </div>
    </>
  )
}
