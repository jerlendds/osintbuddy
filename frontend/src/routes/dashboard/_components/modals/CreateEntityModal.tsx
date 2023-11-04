import { PencilIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useCreateEntityMutation } from '@/app/api';
import InputField from '@/components/inputs/InputField';
import OverlayModal, { OverlayModalProps } from '@/components/modals/OverlayModal';

type EntityFormData = {
  name: string
  description: string
  label: string
  author: string
}

const entitySchema: Yup.ObjectSchema<EntityFormData> = Yup.object().shape({
  name: Yup.string().required("Required"),
  description: Yup.string().required().default("No description found..."),
  label: Yup.string().required(),
  author: Yup.string().required()
});

export function CreateEntityForm({ closeModal }: JSONObject) {
  const [createEntity, { isLoading, data }] = useCreateEntityMutation()

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<EntityFormData>({ resolver: yupResolver(entitySchema) });

  useEffect(() => {
    if (!isSubmitSuccessful) return
    reset({ name: "", description: "", label: "", author: "" })
  }, [isSubmitSuccessful])

  const onSubmitHandler = async (postEntityCreate: EntityFormData) => {
    // console.log("postEntityCreate: ", { postEntityCreate });
    createEntity({ postEntityCreate }).then((data) => console.log('create entity data', data))
    closeModal()
  };

  return (

    <form onSubmit={handleSubmit(onSubmitHandler)} className='bg-dark-600 w-full  shadow sm:rounded-lg'>
      <div className='border-b border-dark-300 mx-4 py-5 sm:px-6'>
        <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
          <div className='ml-4 mt-2'>
            <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>New Entity</h1>
          </div>
        </div>
      </div>
      <InputField register={register} name="label" />
      <InputField register={register} name="description" />
      <InputField register={register} name="author" />

      <div className='flex justify-end items-center px-8 pb-6 w-full relative'>
        <div className='mt-2 flex-shrink-0 flex items-center'>
          <button
            onClick={() => closeModal()}
            type='button'
            className='relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4'
          >
            Cancel
          </button>
          <button
            type='submit'
            className='flex  px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
          >
            <span className='mx-2'>Start editing</span>
            <PencilIcon className='w-5 h-5 text-inherit' />
          </button>
        </div>
      </div>
    </form>
  );
}

export default function CreateEntityModal({
  closeModal,
  isOpen,
  cancelCreateRef,
}: OverlayModalProps) {
  return (
    <OverlayModal isOpen={isOpen} closeModal={closeModal} cancelCreateRef={cancelCreateRef}>
      <CreateEntityForm />
    </OverlayModal>
  );
}