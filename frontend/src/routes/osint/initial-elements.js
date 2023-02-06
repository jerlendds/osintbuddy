import React from 'react';
import { MarkerType, Position } from 'reactflow';
import { Formik } from 'formik';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const GoogleSearchNode = () => (
  <div className='bg-light-200 rounded-lg flex flex-col'>
    <Formik
      initialValues={{ query: '', pages: 1 }}
      validate={(values) => {
        const errors = {};
        if (!values.query) {
          errors.query = 'Required';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));

          setSubmitting(false);
        }, 400);
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
        <form className='flex flex-col' onSubmit={handleSubmit}>
          <div class='group flex flex-col items-start w-72 md:w-80 lg:w-full px-2'>
              <label htmlFor="query">Search query</label>
        
            <div class='relative flex items-center'>
              <input
                type='text'
                className='peer relative h-8 w-full rounded-md bg-light-100 border-2 border-dark-50 pl-8 pr-4 font-thin outline-none drop-shadow-sm transition-all duration-200 ease-in-out focus:bg-light-50 focus:border-blue-400 focus:drop-shadow-lg'
                name='query'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.query}
              />

              <MagnifyingGlassIcon class='h-4 w-4 absolute left-2 transition-all duration-200 ease-in-out group-focus-within:text-blue-400' />
              <input
                className='w-10 h-8 mx-4 border-2 border-dark-50 rounded-md text-base bg-light-100 pl-1'
                type='number'
                name='pages'
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.pages}
              />
              {errors.pages && touched.pages && errors.pages}
              <button
                type='submit'
                className='text-white font-semibold flex bg-primary items-center font-display my-3 hover:bg-primary-600  py-2 px-4 rounded-md hover:border-primary-400 transition-colors duration-75 ease-in'
                disabled={isSubmitting}
              >
                Search
              </button>
            </div>
          </div>
          {errors.query && touched.query && errors.query}
          <div className='flex items-center'></div>
        </form>
      )}
    </Formik>
  </div>
);

export const nodes = [
  {
    id: '1',
    type: 'input',
    data: {
      label: (
        <>
          <GoogleSearchNode />
        </>
      ),
    },
    style: {
      'width': '24rem',
    },
    position: { x: 250, y: 0 },
  },
  {
    id: '2',
    data: {
      label: 'Default Node',
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'output',
    data: {
      label: 'Output Node',
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 100, y: 200 },
    data: {
      selects: {
        'handle-0': 'smoothstep',
        'handle-1': 'smoothstep',
      },
    },
  },
  {
    id: '5',
    type: 'output',
    data: {
      label: 'custom style',
    },
    className: 'circle',
    style: {
      background: '#2B6CB0',
      color: 'white',
    },
    position: { x: 400, y: 200 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: '6',
    type: 'output',
    style: {
      background: '#63B3ED',
      color: 'white',
      width: 100,
    },
    data: {
      label: 'Node',
    },
    position: { x: 400, y: 325 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  
];

export const edges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  {
    id: 'e4-5',
    source: '4',
    target: '5',
    type: 'smoothstep',
    sourceHandle: 'handle-0',
    data: {
      selectIndex: 0,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
  {
    id: 'e4-6',
    source: '4',
    target: '6',
    type: 'smoothstep',
    sourceHandle: 'handle-1',
    data: {
      selectIndex: 1,
    },
    markerEnd: {
      type: MarkerType.ArrowClosed,
    },
  },
];
