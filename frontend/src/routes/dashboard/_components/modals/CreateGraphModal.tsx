import { useEffect, useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useTour } from '@reactour/tour';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Graph, useCreateGraphMutation } from '@/app/api';
import OverlayModal, { OverlayModalProps } from '@/components/modals/OverlayModal';
import InputField from '@/components/inputs/InputField';
import InputTextarea from '@/components/inputs/InputTextArea';
import InputToggleSwitch from '@/components/inputs/InputToggleSwitch';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from "./form.module.css"

type GraphFormData = {
  name: string
  description: string
  showTour?: boolean | undefined
}

const graphSchema: Yup.ObjectSchema<GraphFormData> = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().optional().default("No description found..."),
  showTour: Yup.boolean()
});


export function CreateGraphForm({ closeModal, updateTable }: JSONObject) {
  const navigate = useNavigate()
  const [showTour, setShowTour] = useState(false)
  const { setIsOpen, setCurrentStep } = useTour();
  const [createGraph, { data: newGraph, isError: createGraphError }] = useCreateGraphMutation()

  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful, isSubmitting }
  } = useForm<GraphFormData>({ resolver: yupResolver(graphSchema) });

  useEffect(() => {
    if (!isSubmitSuccessful) return
    if (newGraph && newGraph?.id) {
      closeModal()
      const replace = { replace: true }
      if (showTour) {
        setIsOpen(true)
        navigate(`/graph/inquiry/${newGraph.id}`, replace)
      } else {
        navigate(`/dashboard/graph/${newGraph.id}`, replace)
      }
    } else {
      console.error(createGraphError)
      toast.error("We ran into an error creating your graph. Please try again")
    }
    reset({ name: "", description: "", showTour: false })
  }, [isSubmitSuccessful])

  const onSubmitHandler = async (graphCreate: GraphFormData) => {
    setShowTour(graphCreate?.showTour ?? false)
    delete graphCreate.showTour
    await createGraph({ graphCreate })
    await updateTable()
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles["modal-form"]}>
      <section>
        <div>
          <h1>New Graph</h1>
        </div>
      </section>

      <InputField register={register} name="name" label="Name" />
      <InputTextarea register={register} name="description" label="Description" />
      <InputToggleSwitch label="Enable Guide" className="mt-4" control={control} name={"showTour"} description="Get a step-by-step tour on how to perform OSINTBuddy investigations" />

      <section>
        <div>
          <button
            onClick={() => closeModal()}
            type='button'
            className="btn-danger"
          >
            <span>Cancel</span>
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-form '
          >
            <span>Create graph</span>
            <PlusIcon />
          </button>
        </div>
      </section>
    </form>
  );
}

interface CreateGraphModalProps extends OverlayModalProps {
  refreshAllGraphs: () => void
}

export default function CreateGraphModal({
  closeModal,
  isOpen,
  cancelCreateRef,
  refreshAllGraphs
}: CreateGraphModalProps) {
  return (
    <OverlayModal isOpen={isOpen} closeModal={closeModal} cancelCreateRef={cancelCreateRef}>
      <CreateGraphForm
        updateTable={async (graph: Graph) => await refreshAllGraphs()}
        closeModal={() => closeModal()}
      />
    </OverlayModal>
  );
}
