import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { ReactEventHandler, useMemo, useState } from 'react';
import DorksTable from './_components/DorksTable';
import { DorkStats } from './_components/DorkStats';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps } from 'formik';
import casesService from '@/services/cases.service';
import { formatDork } from '../dashboard/DashboardPage';
import { CellValue, Column } from 'react-table';

interface DorkInputValues {
  pages: string;
  query: string;
}

export const DorkSearchForm: React.FC<{ dorkQuery: any }> = ({ dorkQuery }) => {
  const [queryField, setQueryField] = useState(dorkQuery);
  const [errorMessage, setErrorMessage] = useState('');
  const initialValues = { query: dorkQuery, pages: '' };
  console.log(initialValues);
  const isValid = (values: DorkInputValues) => {
    if (values.query === '') {
      return false;
    }
    if (values.pages === '') {
      return false;
    }
    return true;
  };

  return (
    <div>
      {!errorMessage ? <h1 className='text-2xl'>Start a new dork</h1> : <span>{errorMessage}</span>}

      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          if (isValid(values)) {
            casesService
              .createCase(values.query, values.pages)
              .then((resp: any) => {
                console.log(resp.data);
              })
              .catch((error: any) => console.warn(error));
            alert(JSON.stringify(values, null, 2));
            actions.setSubmitting(false);
          }
        }}
      >
        <Form className='flex flex-col my-5'>
          <div className='py-2'>
            <label className='block text-lg font-medium text-light-700' htmlFor='query'>
              Dork
            </label>
            <Field
              className='block w-full py-2 px-3 rounded-sm bg-dark-500 text-light-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '
              id='query'
              name='query'
              value={queryField}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQueryField(e.currentTarget.value)}
              placeholder='Your dork'
            />
          </div>
          <div className='py-2'>
            <label className='block text-lg font-medium text-light-700' htmlFor='pages'>
              Pages
            </label>
            <Field
              className='block w-full py-2 px-3 rounded-sm bg-dark-500 text-light-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '
              id='pages'
              name='pages'
              placeholder='Total pages'
            />
          </div>
          <button
            type='submit'
            className='text-white font-medium flex bg-lime-700 items-center font-display text-sm my-3 hover:text-light-200 border-lime-700 border-2 py-2 px-4 hover:border-primary-400 transition-colors duration-75 ease-in'
          >
            Search
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default function GoogleDorksPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [dork, setDork] = useState(null);

  const columns = useMemo<Column[]>(
    () => [
      {
        Header: 'Google dorks',
        accessor: 'dork',
        Cell: (props): CellValue => formatDork(props.value),
      },
      {
        Header: 'Created',
        accessor: 'date',
      },
    ],
    []
  );

  const updateGhdb = () => {
    dorksService
      .updateDorks()
      .then((resp) => {
        console.log(resp);
      })
      .catch((error) => console.warn(error));
  };

  return (
    <>
      <div className='w-full flex px-4 '>
        <div className='flex w-full mt-4 flex-col'>
          <div className='w-full  overflow-hidden'>
            <div className='flex'></div>{' '}
            <DorksTable updateGhdb={updateGhdb} columns={columns} setDork={setDork} setShowCreate={setShowCreate} />
          </div>
        </div>
      </div>

      <div
        className={classNames(
          'h-full flex flex-col absolute right-0 w-1/3 bg-dark-700 top-0 transition-transform  py-16',
          {
            'translate-x-[50rem]': !showCreate,
          }
        )}
      >
        <div className='py-4 px-5'>
          <button onClick={() => setShowCreate(false)}>
            <XMarkIcon className='text-light-50 h-5 w-5' />
          </button>
          <DorkSearchForm key={dork} dorkQuery={formatDork(dork || '')} />
        </div>
      </div>
    </>
  );
}
