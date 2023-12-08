import { PencilIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { PostEntityCreate, useCreateEntityMutation } from '@src/app/api';
import InputField from '@src/components/inputs/InputField';
import OverlayModal, { OverlayModalProps } from '@src/components/modals/OverlayModal';
import styles from "./form.module.css"
import InputTextarea from '@src/components/inputs/InputTextArea';
import { TrashIcon } from '@heroicons/react/20/solid';
import { CreateEntityApiArg } from '../../../../app/api';

type EntityFormData = {
  label: string
  description: string
  author: string
}

const entitySchema: Yup.ObjectSchema<EntityFormData> = Yup.object().shape({
  label: Yup.string().required(),
  description: Yup.string().optional().default("No description found..."),
  author: Yup.string().optional().default("")
});

export function CreateEntityForm({ closeModal, updateEntities }: JSONObject) {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitSuccessful }
  } = useForm<EntityFormData>({ resolver: yupResolver(entitySchema) });

  useEffect(() => {
    if (!isSubmitSuccessful) return
    reset({ description: "", label: "", author: "" })
  }, [isSubmitSuccessful])

  const [createEntity, { isLoading, data }] = useCreateEntityMutation()

  const onSubmitHandler = async (postEntityCreate: EntityFormData) => {
    createEntity({ postEntityCreate }).then((data) => console.log('create entity data', data))
    closeModal()
    await updateEntities()
  };

  return (

    <form onSubmit={handleSubmit(onSubmitHandler)} className={`${styles["modal-form"]} px-8`}>
      <section>
        <div>
          <h1>New Entity</h1>
        </div>
      </section>
      <InputField register={register} name="label" label="Label" />
      <InputTextarea register={register} name="description" label="Description" />
      <InputField className='mb-6' register={register} name="author" label="Author(s)" description="You can separate multiple authors with commas" />

      <section>
        <div>
          <button className="btn-danger" onClick={() => closeModal()} type='button'>
            Cancel
            <TrashIcon />
          </button>
          <button className="btn-primary ml-4" type='submit'>
            <span>Start editing</span>
            <PencilIcon />
          </button>
        </div>
      </section>
    </form>
  );
}

interface CreateEntityModalProps extends OverlayModalProps {
  refreshAllEntities: () => void
}

export default function CreateEntityModal({
  closeModal,
  isOpen,
  cancelCreateRef,
  refreshAllEntities
}: CreateEntityModalProps) {
  return (
    <OverlayModal isOpen={isOpen} closeModal={closeModal} cancelCreateRef={cancelCreateRef}>
      <CreateEntityForm closeModal={closeModal} updateEntities={refreshAllEntities} />
    </OverlayModal>
  );
}