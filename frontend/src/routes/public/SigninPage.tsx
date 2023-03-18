import * as Yup from 'yup';

import { withFormik, FormikProps, FormikErrors, Form, Field, Formik, ErrorMessage, FormikHelpers } from 'formik';
import RoundLoader from '@/components/Loaders';
import authService from '@/services/auth.service';
import { Link, NavLink, useNavigate, Navigate } from 'react-router-dom';
import { login, selectUser } from '@/features/auth/authSlice';
import { useAppSelector, useAppDispatch } from '@/app/hooks';
import { selectAuthenticated } from '@/features/auth/authSlice';
import OSINTBuddyLogo from '@images/logo.svg';
import blurCyanImage from '@images/blur-cyan.png';
import { toast } from 'react-toastify';
import { PageHeader } from '../settings/SettingsPage';

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
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector((state) => selectAuthenticated(state));
  const user = useAppSelector((state) => selectUser(state));
  console.log('isAuthenticated', isAuthenticated);
  console.log('user', user);
  if (isAuthenticated) return <Navigate to='/app/dashboard' replace />;
  return (
    <Formik
      initialValues={{
        email: initialEmail || '',
        password: '',
        remembered: remembered || false,
      }}
      onSubmit={(values: LoginFormValues, { setSubmitting, setErrors }: FormikHelpers<LoginFormValues>) => {
        const errors = { email: '', password: '' };
        if (!values.email) errors.email = 'required';
        if (!values.password) errors.password = 'required';
        setErrors(errors);

        if (!errors.email && !errors.password) {
          dispatch(login(values))
            .unwrap()
            .then((data) => {
              setSubmitting(false);
            })
            .catch((error) => {
              setSubmitting(false);
              toast.error(`${error}`.replace('Error:', ''));
            });
        } else {
          setSubmitting(false);
        }
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
          <label htmlFor='email' className='block text-sm font-medium text-slate-400'>
            Email address
            {errors.email && <span className='text-danger text-sm'> ({errors.email})</span>}
          </label>
          <Field
            className='block bg-slate-700 w-full appearance-none rounded-md border border-info-400 focus:border-info-300 active:border-info-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-info-50 sm:text-sm text-light-200'
            type='email'
            name='email'
            placeholder='Your email'
          />
          <label htmlFor='password' className='block text-sm font-medium text-slate-400 mt-1'>
            Password
            {errors.password && <span className='text-danger text-sm'> ({errors.password})</span>}
          </label>
          <Field
            className='block w-full appearance-none rounded-md px-3 py-2 placeholder-slate-400 shadow-sm focus:outline-none border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm text-light-200'
            type='password'
            name='password'
            placeholder='Your password'
          />

          <div className='flex items-center justify-between my-4'>
            <div className='flex items-center'>
              <input
                id='remembered'
                name='remembered'
                type='checkbox'
                className=' h-4 w-4 rounded border-info-100 text-info-50 focus:ring-info-50'
              />
              <label htmlFor='remembered' className='ml-2 block text-sm text-slate-400 font-medium'>
                Remember me
              </label>
            </div>

            <div className='text-sm'>
              <a href='#' className='font-medium text-info-100 hover:text-info-50'>
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type='submit'
            className='flex relative w-full justify-center rounded-md border border-transparent bg-info-400 py-2 px-4 text-base font-medium text-slate-100 shadow-sm hover:bg-info-300 focus:outline-none focus:ring-2 focus:ring-info-200'
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
      <div className='py-16 sm:px-2 lg:relative lg:py-20 lg:px-0'>
        <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12'>
          <div className='relative z-10 md:text-center lg:text-left'>
            <img
              className='absolute bottom-full right-full -mr-72 -mb-56 opacity-50'
              src={blurCyanImage}
              alt=''
              width={530}
              height={530}
            />
          </div>
        </div>
      </div>
      <div className='flex items-center justify-center min-h-full'>
        <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
          <p className='inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent'>
            Sign in to OSINTBuddy
          </p>
          <p className='mt-3 mx-auto text-lg tracking-tight text-slate-400'>
            (default login: admin@osintbuddy.com, password)
          </p>

          <div className='mt-6'>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
}
