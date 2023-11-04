// @ts-nocheck
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import EntityEditor from "../../../components/EntityEditor/EntityEditor";
import { useGetEntityQuery } from "@/app/api";





export default function EntityDetailsPage() {
  const params: { uuid: string | undefined } = useParams()
  const dispatch = useAppDispatch()

  const { isLoading, data: activeEntity } = useGetEntityQuery({
    entityUuid: params?.uuid
  })



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
