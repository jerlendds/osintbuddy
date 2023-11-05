import { PencilIcon } from '@heroicons/react/24/outline';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { useCreateEntityMutation } from '@/app/api';
import InputField from '@/components/inputs/InputField';
import OverlayModal, { OverlayModalProps } from '@/components/modals/OverlayModal';
import styles from "./form.module.css"
import InputTextarea from '@/components/inputs/InputTextArea';
import classNames from 'classnames';

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

export function CreateEntityForm({ closeModal, updateList }: JSONObject) {
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

  const [createEntity, { isLoading, data }] = useCreateEntityMutation()

  const onSubmitHandler = async (postEntityCreate: EntityFormData) => {
    createEntity({ postEntityCreate }).then((data) => console.log('create entity data', data))
    closeModal()
    await updateList()
  };

  return (

    <form onSubmit={handleSubmit(onSubmitHandler)} className={styles["modal-form"]}>
      <section>
        <div>
          <h1>New Entity</h1>
        </div>
      </section>
      <InputField register={register} name="label" label="Entity Label" />
      <InputTextarea register={register} name="description" label="Description" />
      <InputField className='mb-6' register={register} name="author" label="Author(s)" />

      <section>
        <div>
          <button className="btn-danger" onClick={() => closeModal()} type='button'>
            Cancel
          </button>
          <button className="btn-form" type='submit'>
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
      <CreateEntityForm closeModal={closeModal} updateList={refreshAllEntities} />
    </OverlayModal>
  );
}