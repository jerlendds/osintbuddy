import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { ReactEventHandler, useCallback, useMemo, useRef, useState } from 'react';
import DorksTable from './_components/DorksTable';
import { DorkStats } from './_components/DorkStats';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, FormikHelpers, FormikProps, Form, Field, FieldProps } from 'formik';
import casesService from '@/services/projects.service';
import { CellValue, Column } from 'react-table';
import { PageHeader } from '@/components/Headers';

export const formatDork = (dorkTag: string) => {
  const matches = dorkTag.matchAll(/(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/a>))/g);
  const myDork = Array.from(matches);
  if (myDork && myDork[0] && myDork[0][0]) {
    return myDork[0][0];
  }
  return dorkTag;
};

interface DorkInputValues {
  pages: string;
  query: string;
}

export const DorkSearchForm: React.FC<{ dorkQuery: any }> = ({ dorkQuery }) => {
  const [queryField, setQueryField] = useState(dorkQuery);
  const [errorMessage, setErrorMessage] = useState('');
  const initialValues = { query: dorkQuery, pages: '' };
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
          if (isValid(values)) {
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
        Cell: (props): CellValue => new Date(props.value).toDateString(),
      },
    ],
    []
  );



  const [pageCount, setPageCount] = useState(0);
  const [dorksData, setDorksData] = useState<any>([]);
  const [loadingDorks, setLoadingDorks] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchDorks = useCallback(
    ({ pageSize, pageIndex }: FetchProps) => {
      const fetchId = ++fetchIdRef.current;
      setLoadingDorks(true);
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        if (fetchId === fetchIdRef.current) {
          // @todo remove timeout
          setTimeout(() => {
            dorksService.getDorks(pageSize * pageIndex, pageCount)
              .then((resp) => {
                if (resp?.data) {
                  setPageCount(Math.ceil(resp.data?.dorksCount / pageSize));
                  setDorksData(resp.data.dorks);
                  setLoadingDorks(false);
                }
              })
              .catch((error) => {
                console.warn(error);
                setLoadingDorks(false);
              });
          }, 300);
        }
      }
    },
    [pageCount]
  );

  console.log(dorksData)
  return (
    <>
      <PageHeader title='Dorks' header='Google Dorking' />

      <div className='w-full flex  '>
        <div className='flex w-full flex-col'>
          <div className='w-full  '>
            <div className='flex'></div>{' '}
            <DorksTable fetchData={fetchDorks} data={dorksData} columns={columns} setDork={setDork} setShowCreate={setShowCreate} />
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
