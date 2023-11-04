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
    if (newGraph && newGraph?.uuid) {
      updateTable()
      closeModal()
      if (showTour) {
        setIsOpen(true)
        navigate(`/graph/inquiry/${newGraph.uuid}`)
      } else {
        navigate(`${newGraph.uuid}`)
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
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className='bg-dark-600 w-full  shadow sm:rounded-lg'>
      <div className='border-b border-dark-300 mx-4 py-5 sm:px-6'>
        <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
          <div className='ml-4 mt-2'>
            <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>New Graph</h1>
          </div>
        </div>
      </div>

      <InputField register={register} name="name" />
      <InputTextarea register={register} name="description" />
      <InputToggleSwitch control={control} name={"showTour"} />

      <div className='flex justify-end items-center px-8 pb-6 w-full relative'>
        <div className='mt-2 flex-shrink-0 flex items-center'>
          <button
            onClick={() => closeModal()}
            type='button'
            className='relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4'
          >
            Cancel
          </button>
          <button
            type='submit'
            disabled={isSubmitting}
            className='flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
          >
            <span className='mx-2'>Create graph</span>
            <PlusIcon className='w-5 h-5 text-white' />
          </button>
        </div>
      </div>
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
        updateTable={(graph: Graph) => refreshAllGraphs()}
        closeModal={() => closeModal()}
      />
    </OverlayModal>
  );
}
