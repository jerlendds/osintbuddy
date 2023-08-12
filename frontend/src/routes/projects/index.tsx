import { CodeBracketIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import React, { useCallback, useRef, useState } from 'react';
import { type Column, type CellValue } from 'react-table';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/Headers';
import Table from '@/components/Table';
import { api } from '@/app/services';
import { useAppDispatch } from '@/app/hooks';
import { resetGraph, setActiveProject } from '@/features/graph/graphSlice';
import entities from '@/app/services/entities.service';
import CreateEntityModal from './_components/CreateEntityModal';
import CreateProjectModal from './_components/CreateProjectModal';
import projects from '@/app/services/projects.service';

const ProjectsActionsRow = ({ row, updateTable }: JSONObject) => {
  const dispatch = useAppDispatch();
  return (
    <div className='flex items-center justify-between relative z-40 mb-1'>
      <Link
        to={`/app/projects/${row.original.uuid}`}
        state={{ activeProject: row.original }}
        onClick={() => {
          dispatch(setActiveProject({ ...row.original }));
          dispatch(resetGraph());
        }}
        className='flex whitespace-nowrap px-2 py-2 hover:ring-2 transition-all duration-75 ring-info-300 hover:ring-info-200 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Investigate</span>
        <EyeIcon className='w-5 h-5 text-slate-400 mr-2' />
      </Link>
      <button
        onClick={() => {
          api
            .delete(`/projects?id=${row.original.id}`)
            .then(() => updateTable())
            .catch((error) =>
              toast.error('We ran into an error deleting your project. Please file an issue on Github')
            );
        }}
        className='flex whitespace-nowrap ml-4 mr-auto px-2 py-2 hover:ring-2 ring-danger-600 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Delete</span>
        <TrashIcon className='w-5 h-5 text-slate-400 mr-2' />
      </button>
    </div>
  );
};

const EntitiesActionsRow = ({ row, updateTable }: JSONObject) => {
  const dispatch = useAppDispatch();
  return (
    <div className='flex items-center justify-between relative z-40 mb-1'>
      <Link
        to={`/app/entity/${row.original.uuid}`}
        state={{ activeProject: row.original }}
        onClick={() => {
          dispatch(setActiveProject({ ...row.original }));
          dispatch(resetGraph());
        }}
        className='flex whitespace-nowrap px-2 py-2 hover:ring-2 transition-all duration-75 ring-info-300 hover:ring-info-200 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Edit Entity</span>
        <CodeBracketIcon className='w-5 h-5 text-slate-400 mr-2' />
      </Link>
      <button
        onClick={() => {
          if (row.original.author.toLowerCase().includes('osintbuddy')) {
            toast.warn('You cannot delete a core entity.');
          } else {
            api
              .delete(`/entities?uuid=${row.original.uuid}`)
              .then(() => updateTable())
              .catch((error) =>
                toast.error('We ran into an error deleting your project. Please file an issue on Github')
              );
          }
        }}
        className='flex whitespace-nowrap ml-4 mr-auto px-2 py-2 hover:ring-2 ring-danger-600 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Delete</span>
        <TrashIcon className='w-5 h-5 text-slate-400 mr-2' />
      </button>
    </div>
  );
};

export function ProjectsDataRow({ row }: JSONObject) {
  return (
    <tr className='' {...row.getRowProps()}>
      {row.cells.map((cell: any) => {
        return (
          <td
            colSpan={1}
            className='lg:first:w-32 lg:last:w-72  last:mr-auto min-w-min py-2 pr-3 text-sm text-slate-400 first:pl-8'
            {...cell.getCellProps()}
          >
            {cell.render('Cell')}
          </td>
        );
      })}
    </tr>
  );
}

export function EntitiesDataRow({ row }: JSONObject) {
  return (
    <tr className='entity-row' {...row.getRowProps()}>
      {row.cells.map((cell: any) => {
        return (
          <td
            colSpan={1}
            {...cell.getCellProps()}
          >
            {cell.render('Cell')}
          </td>
        );
      })}
    </tr>
  );
}

export default function DashboardPage() {
  let [isOpen, setIsOpen] = useState(false);
  let [isEntityOpen, setIsEntityOpen] = useState(false);
  const cancelCreateRef = useRef<HTMLElement>(null);
  const cancelCreateEntityRef = useRef<HTMLElement>(null);

  const columns = React.useMemo<Column[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Project name',
        accessor: 'name',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Short description',
        accessor: 'description',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: (props): CellValue => new Date(props.value).toDateString(),
      },
    ],
    []
  );

  const entityColumns = React.useMemo<Column[]>(
    () => [
      {
        Header: 'Label',
        accessor: 'label',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Short description',
        accessor: 'description',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Author',
        accessor: 'author',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: (props): CellValue => new Date(props.value).toDateString(),
      },
    ],
    []
  );

  const [projectsPageCount, setProjectsPageCount] = useState(0);
  const [projectsData, setProjectsData] = useState<any>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fetchProjectIdRef = useRef(0);

  const fetchProjectsData = useCallback(
    ({ pageSize, pageIndex }: FetchProps) => {
      const fetchId = ++fetchProjectIdRef.current;
      setLoadingProjects(true);
      if (fetchId === fetchProjectIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        if (fetchId === fetchProjectIdRef.current) {
          // @todo remove timeout
          setTimeout(() => {
            projects
              .getProjects(pageSize * pageIndex, pageSize)
              .then((resp) => {
                if (resp?.data) {
                  setProjectsPageCount(Math.ceil(resp.data?.count / pageSize));
                  setProjectsData(resp.data.projects);
                  setLoadingProjects(false);
                }
              })
              .catch((error) => {
                console.warn(error);
                setLoadingProjects(false);
              });
          }, 300);
        }
      }
    },
    [projectsPageCount]
  );

  const [entitiesPageCount, setEntitiesPageCount] = useState(0);
  const [entitiesData, setEntitiesData] = useState<any>([]);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const fetchIdEntityRef = useRef(0);

  const fetchEntitiesData = useCallback(
    ({ pageSize, pageIndex }: FetchProps) => {
      const fetchId = ++fetchIdEntityRef.current;
      setLoadingEntities(true);
      if (fetchId === fetchIdEntityRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        if (fetchId === fetchIdEntityRef.current) {
          entities
            .getEntities(pageSize * pageIndex, pageSize)
            .then((resp) => {
              if (resp?.data) {
                setEntitiesPageCount(Math.ceil(resp.data?.count / pageSize));
                setEntitiesData(resp.data.entities);
                setLoadingEntities(false);
              }
            })
            .catch((error) => {
              console.warn(error);
              setLoadingEntities(false);
            });
        }
      }
    },
    [projectsPageCount]
  );

  const updateTable = (newProject: JSONObject) => {
    setProjectsData([...projectsData, { ...newProject }]);
  };

  const updateEntityTable = (newEntity: JSONObject) => {
    setEntitiesData([...entitiesData, newEntity]);
  };

  return (
    <>
    <div className="mt-4"></div>
      <PageHeader title='Graphs' header='All Projects' />
      <Table
        emptyTitle='No Projects found'
        emptyDescription='Get started by creating a project'
        createButtonLabel={'Create project'}
        createButtonFunction={() => setIsOpen(true)}
        columns={columns}
        data={projectsData}
        fetchData={({ pageSize, pageIndex }: FetchProps) => fetchProjectsData({ pageSize, pageIndex })}
        loading={loadingProjects}
        CustomRow={ProjectsActionsRow}
        pageCount={projectsPageCount}
        DataRow={ProjectsDataRow}
      />
      <PageHeader title='Plugins' header='All entities' />
      <Table
        emptyTitle='No Entities found'
        emptyDescription='Get started by creating an entity'
        createButtonLabel={'Create entities'}
        createButtonFunction={() => setIsEntityOpen(true)}
        columns={entityColumns}
        data={entitiesData}
        CustomRow={EntitiesActionsRow}
        fetchData={({ pageSize, pageIndex }: FetchProps) => fetchEntitiesData({ pageSize, pageIndex })}
        loading={loadingEntities}
        pageCount={entitiesPageCount}
        DataRow={EntitiesDataRow}
      />
      <CreateProjectModal
        updateTable={(project: JSONObject) => updateTable(project)}
        cancelCreateRef={cancelCreateRef}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
      <CreateEntityModal
        updateTable={(project: JSONObject) => updateEntityTable(project)}
        cancelCreateRef={cancelCreateEntityRef}
        isOpen={isEntityOpen}
        closeModal={() => setIsEntityOpen(false)}
      />
    </>
  );
}
