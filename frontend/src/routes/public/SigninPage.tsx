import * as Yup from 'yup';

import { withFormik, FormikProps, FormikErrors, Form, Field, Formik, ErrorMessage, FormikHelpers } from 'formik';
import RoundLoader from '@/components/Loaders';
import authService from '@/services/auth.service';
import { NavLink, useNavigate } from 'react-router-dom';
import { login } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';

export interface LoginFormValues {
  email: string;
  password: string;
  remembered: boolean;
}

interface FormProps {
  initialEmail?: string;
  remembered?: boolean;
}

const LoginForm = ({ initialEmail, remembered }: FormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Formik
      initialValues={{
        email: initialEmail || '',
        password: '',
        remembered: remembered || false,
      }}
      onSubmit={(values: LoginFormValues, { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>) => {
        dispatch(login(values))
          .unwrap()
          .then((data) => {
            navigate('/app/dashboard');
            setSubmitting(false);
          })
          .catch((error) => {
            setSubmitting(false);
            console.log('catching??', error);
          });
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
      }: FormikProps<LoginFormValues>) => (
        <Form onSubmit={handleSubmit}>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
            Email address
          </label>
          <Field
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            type='email'
            name='email'
          />

          {touched.email && errors.email && <div>{errors.email}</div>}
          <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
            Password
          </label>
          <Field
            className='block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
            type='password'
            name='password'
          />

          {touched.password && errors.password && <div>{errors.password}</div>}
          <div className='flex items-center justify-between'>
            <div className='flex items-center'>
              <input
                id='remembered'
                name='remembered'
                type='checkbox'
                className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
              />
              <label htmlFor='remembered' className='ml-2 block text-sm text-gray-900'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a href='#' className='font-medium text-indigo-600 hover:text-indigo-500'>
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type='submit'
            className='flex relative w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
          >
            Sign in {isSubmitting && <RoundLoader className='absolute right-5' />}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default function SigninPage(): React.ReactElement {
  return (
    <>
      {' '}
      <div className='flex min-h-full'>
        <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <div className='mx-auto w-full max-w-sm lg:w-96'>
            <div>
              <img
                className='h-12 w-auto'
                src='https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600'
                alt='Your Company'
              />
              <h2 className='mt-6 text-3xl font-bold tracking-tight text-gray-900'>Sign in to OSINTBuddy</h2>
              <p className='mt-2 text-sm text-gray-600'>
                Or{' '}
                <NavLink to='/sign-up' replace className='font-medium text-indigo-600 hover:text-indigo-500'>
                  create an account
                </NavLink>
              </p>
            </div>

            <div className='mt-8'>
              <div>
                <div className='relative mt-6'>
                  <div className='absolute inset-0 flex items-center' aria-hidden='true'>
                    <div className='w-full border-t border-gray-300' />
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='bg-white px-2 text-gray-500'>Or continue with</span>
                  </div>
                </div>
              </div>

              <div className='mt-6'>
                <LoginForm />
              </div>
            </div>
          </div>
        </div>
        <div className='relative hidden w-0 flex-1 lg:block'>
          <img
            className='absolute inset-0 h-full w-full object-cover'
            src='https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80'
            alt=''
          />
        </div>
      </div>
    </>
  );
}
