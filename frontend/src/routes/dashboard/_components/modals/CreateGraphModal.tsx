import { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useTour } from '@reactour/tour'
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";
import { Graph, useCreateGraphMutation } from '@src/app/api';
import OverlayModal, { OverlayModalProps } from '@src/components/modals/OverlayModal';
import InputField from '@src/components/inputs/InputField';
import InputTextarea from '@src/components/inputs/InputTextArea';
import InputToggleSwitch from '@src/components/inputs/InputToggleSwitch';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import styles from "./form.module.css"
import { useAppDispatch } from '@src/app/hooks';
import { setGraphTour } from '@src/features/account/accountSlice';

type GraphFormData = {
  label: string
  description: string
  enableGraphGuide?: boolean | undefined
}

const graphSchema: Yup.ObjectSchema<GraphFormData> = Yup.object().shape({
  label: Yup.string().required("Required"),
  description: Yup.string().optional().default("No description found..."),
  enableGraphGuide: Yup.boolean()
});


export function CreateGraphForm({ closeModal, refreshGraphs }: JSONObject) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [showGraphGuide, setShowGraphGuide] = useState(false);
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
      // we only navigate to the graph when the guide is enabled
      refreshGraphs()
      if (showGraphGuide) {
        navigate(`/graph/inquiry/${newGraph.id}`, { ...replace, state: { showGraphGuide, } })
      } else {
        navigate(`/dashboard/graph/${newGraph.id}`, replace)
      }
    } else {
      console.error(createGraphError)
      toast.error("We ran into an error creating your graph. Please try again")
    }
    reset({ label: "", description: "", enableGraphGuide: false })
  }, [isSubmitSuccessful, showGraphGuide])

  const onSubmitHandler = async (graphCreate: GraphFormData) => {
    if (graphCreate?.enableGraphGuide) {
      dispatch(setGraphTour())
      setShowGraphGuide(true)
    }
    delete graphCreate.enableGraphGuide
    await createGraph({ graphCreate })
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className={`${styles["modal-form"]} px-8`}>
      <section>
        <div>
          <h1>New Graph</h1>
        </div>
      </section>

      <InputField register={register} name="label" label="Label" />
      <InputTextarea register={register} name="description" label="Description" />
      <InputToggleSwitch label="Enable Guide" className="mt-4" control={control} name={"enableGraphGuide"} description="Click the toggle and get a step-by-step tour on how to perform OSINTBuddy investigations" />

      <section>
        <div>
          <button
            onClick={() => closeModal()}
            type='button'
            className="btn-danger"
          >
            <span>Cancel</span>
            <TrashIcon />
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='btn-primary ml-4'
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
        refreshGraphs={async (graph: Graph) => await refreshAllGraphs()}
        closeModal={() => closeModal()}
      />
    </OverlayModal>
  );
}
