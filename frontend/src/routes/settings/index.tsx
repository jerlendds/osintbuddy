import { EyeIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
  useTable,
  usePagination,
  type Column,
  type CellProps,
  CellValue,
} from "react-table";
import classNames from "classnames";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { InquiryHeader } from "@/components/Headers";
import { sdk } from "@/app/api";

interface CreateGraphForm {
  name: string;
  description: string;
}

export const CreateCasesForm: React.FC<{ closeModal: Function }> = ({
  closeModal,
}) => {
  const initialValues: CreateGraphForm = { name: "", description: "" };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values: CreateGraphForm, actions) => {
          sdk.graphs.createGraph(values.name, values.description)
            .catch((error: Error) => console.error(error))

          actions.setSubmitting(false);
          closeModal();
        }}
      >
        <Form className="flex flex-col ">
          <div className="py-2">
            <label
              className="text-sm font-medium text-slate-400  font-display mt-1"
              htmlFor="name"
            >
              Case name
            </label>
            <Field
              className="block placeholder:text-slate-400 w-full py-2 px-3 rounded-md shadow-sm  relative border-opacity-60  text-slate-200 focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm"
              id="name"
              name="name"
              placeholder="Your name"
            />
          </div>
          <div className="py-2">
            <label
              className="text-sm font-medium text-slate-400  font-display mt-1"
              htmlFor="description"
            >
              Case description
            </label>

            <Field name="description">
              {({ field, form, meta }: any) => {
                return (
                  <textarea
                    rows={4}
                    value={field.value}
                    onChange={field.onChange}
                    name="description"
                    id="description"
                    className="block placeholder:text-slate-400 w-full py-2 px-3 rounded-md  text-slate-200 shadow-sm  relative border-opacity-60   focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm"
                    defaultValue={""}
                    placeholder="Your description"
                  />
                );
              }}
            </Field>
          </div>
          <div className="flex items-center w-full justify-between">
            <button
              type="button"
              onClick={() => closeModal()}
              className="text-white font-medium flex bg-danger items-center font-display my-3 hover:text-slate-200  py-2 px-6 rounded-full hover:bg-danger-600 transition-colors duration-75 ease-in"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-white font-medium flex bg-info-200 items-center font-display my-3 hover:bg-info-300  py-2 px-6 rounded-full hover:border-info-300 transition-colors duration-75 ease-in"
            >
              Create case
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

interface TableProps {
  columns: Array<Column>;
  data: Array<object>;
  fetchData: Function;
  loading: boolean;
  pageCount: number;
  setIsOpen: Function;
}

function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  setIsOpen,
}: TableProps) {
  const navigate = useNavigate();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        ...columns,
        {
          accessor: "edit",
          id: "edit",
          Header: "Actions",
          Cell: ({ row, setEditableRowIndex, editableRowIndex }) => (
            <div className="flex items-center justify-between relative z-40">
              <Link
                // @ts-ignore
                to={`/app/projects/${row.original.id}`}
                state={{ activeCase: row.original }}
                className={classNames(
                  "text-info-200 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in"
                )}
                replace
              >
                <EyeIcon className="w-5 h-5 text-slate-200 mr-2" />
                <span className="text-slate-200 font-display">
                  Investigate
                </span>{" "}
              </Link>
              <button
                className={classNames(
                  "text-danger-500 ml-2 flex items-center justify-between  text-sm font-display hover:text-slate-200 border-danger-500 border-2 py-1 rounded-full px-3 bg-danger-500 hover:border-danger-300 transition-colors duration-75 ease-in"
                )}
              >
                <TrashIcon className="w-5 h-5 text-slate-200 mr-2" />{" "}
                <span className="text-slate-200 font-display flex items-start">
                  Delete
                </span>{" "}
              </button>
            </div>
          ),
        },
      ]);
    }
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  // Render the UI for your table
  return (
    <>
      <table
        className="min-w-full divide-y divide-slate-600 table-fixed"
        {...getTableProps()}
      >
        <thead className="bg-dark-300 relative">
          {headerGroups.map((headerGroup: any) => (
            <>
              <tr
                className="first:bg-dark-400"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any) => (
                  <th
                    className="first:py-3.5 first:pl-4 min-w-min px-3 py-3.5 pr-3 text-left text-sm font-semibold text-slate-200 first:sm:pl-6"
                    {...column.getHeaderProps()}
                  >
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
              <tr className="right-0 top-0 absolute">
                <th>
                  <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="px-1 my-3.5 pr-3 text-left text-sm font-semibold text-info-100 hover:text-info-200 first:sm:pl-6 flex items-center"
                  >
                    <PlusIcon className="mr-2 w-5 h-5 " /> Create case
                  </button>
                </th>
              </tr>
            </>
          ))}
        </thead>
        <tbody className="bg-dark-300" {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr className="" {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className="lg:first:w-32 lg:last:w-72 min-w-min py-2 pl-4 pr-3 text-sm font-medium text-slate-400 sm:pl-6"
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading && (
              // Use our custom loading state to show a loading indicator
              <td className="text-slate-400 pl-6 pb-4" colSpan={10000}>
                Loading...
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
}

interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

export const formatDork = (dorkTag: string) => {
  const matches = dorkTag.matchAll(
    /(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/a>))/g
  );
  const myDork = Array.from(matches);
  if (myDork && myDork[0] && myDork[0][0]) {
    return myDork[0][0];
  }
  return dorkTag;
};

export function CasesTable({
  columns,
  setIsOpen,
}: {
  columns: any;
  setIsOpen: Function;
}) {
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }: FetchProps) => {
    const fetchId = ++fetchIdRef.current;
    if (fetchId === fetchIdRef.current) {
      setLoading(true);
      sdk.graphs.getGraphs(pageIndex, pageSize)
        .then((data) => {
          if (data) {
            setPageCount(Math.ceil(data.dorksCount / pageSize));
            setData(data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error(error);
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="flex flex-col px-8  py-4">
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <Table
              setIsOpen={setIsOpen}
              columns={columns}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const secondaryNavigation = [
    { name: "Anonymization", href: "#", current: true },
    { name: "Plugins", href: "#", current: false },
    { name: "Keys", href: "#", current: false },
    { name: "Features", href: "#", current: false },
  ];

  return (
    <>
      <header className="border-b border-dark-300">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8">
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={classNames(
                    "font-display",
                    item.current ? "text-info-100" : ""
                  )}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <InquiryHeader title="" header="Proxy configuration" />
      <div className="flex flex-col sm:px-2 lg:px-6 my-2 relative mx-auto w-full justify-center">
        <p className="text-slate-400">
          Adding proxies increases this tools reliability and speed
        </p>
      </div>
      <div className="sm:px-2 lg:px-6 my-6 relative mx-auto w-full justify-center">
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col">
              <h2 className="text-base font-semibold leading-7 text-slate-200">
                Your proxies
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Connect proxies to OSINTBuddy one by one or by uploading a txt
                file of proxies. Each new line in the text file is expected to
                be one proxy
              </p>
            </div>
            <button className="rounded-full bg-info-200 px-6 text-sm font-medium text-white hover:bg-info-300 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400">
              Upload proxies
            </button>
          </div>
          <ul className="mt-6 divide-y divide-light-100 border-t border-dark-300 text-sm leading-6">
            <li className="flex justify-between gap-x-6 py-6">
              <div className="font-medium text-slate-400">
                https://149.143.12.124:4000
              </div>
              <button
                type="button"
                className="font-semibold text-info-200 hover:text-info-100"
              >
                Delete
              </button>
            </li>
          </ul>

          <div className="flex border-t border-dark-300 pt-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-info-200 hover:text-info-100"
            >
              <span aria-hidden="true">+</span> Add another proxy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
