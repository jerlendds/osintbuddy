import { Dialog, Switch, Transition } from "@headlessui/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useTour } from "@reactour/tour";
import classNames from "classnames";
import { Formik } from "formik";
import { Fragment, MutableRefObject, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function NewTemplateForm({
  closeModal,
  updateTable,
  refreshData,
}: JSONObject) {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);
  const [activeOption, setActiveOption] = useState(null);

  return (
    <Formik
      initialValues={{ name: "", description: "", showTour: showTour }}
      validate={(values: JSONObject) => {
        const errors: JSONObject = {};
        if (values?.name?.length <= 1) {
          errors.name = "A project name is a required field";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {

        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <>
          <form
            onSubmit={(e: any) => handleSubmit(e)}
            className="bg-dark-600 w-full  shadow sm:rounded-lg"
          >
            <div className="border-b border-dark-300 mx-4 py-5 sm:px-6">
              <div className="-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                  <h1 className="font-display text-2xl tracking-tight text-slate-200 dark:text-white">
                    New Scan Machine
                  </h1>
                </div>
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="block font-semibold leading-6 mt-4 text-slate-200 pl-8"
              >
                Name
              </label>
              <div className="mt-2.5 px-8">
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  name="name"
                  id="name"
                  className="block w-full hover:ring-2 transition-all duration-100  bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block font-semibold leading-6 mt-4 text-slate-200 pl-8"
              >
                Description
              </label>
              <div className="mt-2.5 px-8">
                <textarea
                  name="description"
                  id="description"
                  rows={2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  className="block hover:ring-2 w-full bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="sm:col-span-2 mb-4 mx-8">
              {/* @todo add tagging use tags import above */}
              {/* <label htmlFor='description' className='block font-semibold leading-6 mt-4 text-slate-200'>
                Tags
              </label> */}
            </div>
            <div className="flex justify-end items-center px-8 pb-6 w-full relative">
              <div className="mt-2 flex-shrink-0 flex items-center">
                <button
                  onClick={() => closeModal()}
                  type="button"
                  className="relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4"
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="flex  px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 "
                >
                  <span className="mx-2">Create template</span>
                  <PlusIcon className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
}

export default function CreateScanModal({
  closeModal,
  isOpen,
  cancelCreateRef,
  refreshData,
}: {
  cancelCreateRef: MutableRefObject<HTMLElement | null>;
  closeModal: Function;
  isOpen: boolean;
  refreshData: Function;
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelCreateRef}
        onClose={() => closeModal()}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center text-center sm:items-center sm:p-0 ">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative max-w-2xl w-full transform overflow-hidden rounded-lg  text-left shadow-xl transition-all ">
                <NewTemplateForm
                  refreshData={refreshData}
                  closeModal={() => closeModal()}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
