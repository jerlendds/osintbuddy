import * as Yup from 'yup';

import { withFormik, FormikProps, FormikErrors, Form, Field, Formik, ErrorMessage, FormikHelpers } from 'formik';
import RoundLoader from '@/components/Loaders';
import authService from '@/services/auth.service';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { login } from '@/features/auth/authSlice';
import { useAppDispatch } from '@/app/hooks';
import OSINTBuddyLogo from '@images/logo.svg'
import blurCyanImage from '@images/blur-cyan.png'

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
          <label htmlFor='email' className='block text-sm font-medium text-slate-400'>
            Email address
          </label>
          <Field
            className='block bg-slate-700 w-full  appearance-none rounded-md border border-info-400 focus:border-info-300 active:border-info-300 px-3 py-2 placeholder-slate-400 shadow-sm focus:outline-none focus:ring-info-50 sm:text-sm text-light-200'
            type='email'
            name='email'
            placeholder='Your email'
          />

          {touched.email && errors.email && <div>{errors.email}</div>}
          <label htmlFor='password' className='block text-sm font-medium text-slate-400 mt-1'>
            Password
          </label>
          <Field
            className='block w-full  appearance-none rounded-md px-3 py-2 placeholder-slate-400 shadow-sm focus:outline-none border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm text-light-200'
            type='password'
            name='password'
            placeholder='Your password'
          />

          {touched.password && errors.password && <div>{errors.password}</div>}
          <div className='flex items-center justify-between my-2'>
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
              <a href='#' className='font-medium text-info-100 hover:text-persian-500'>
                Forgot your password?
              </a>
            </div>
          </div>
          <button
            disabled={isSubmitting}
            type='submit'
            className='flex relative w-full justify-center rounded-md border border-transparent bg-info-400 py-2 px-4 text-sm font-medium text-slate-100 shadow-sm hover:bg-info-200 focus:outline-none focus:ring-2 focus:ring-info-200 focus:ring-offset-2'
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
      <div className="py-16 sm:px-2 lg:relative lg:py-20 lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 gap-x-8 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          <div className="relative z-10 md:text-center lg:text-left">
            <img
              className="absolute bottom-full right-full -mr-72 -mb-56 opacity-50"
              src={blurCyanImage}
              alt=""
              width={530}
              height={530}
            />
            
          </div>
          </div>
          </div>
      <div className='flex items-center justify-center min-h-full'>
        <div className='flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24'>
 <p className="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">
                Sign in to OSINTBuddy
              </p>
              <p className="mt-3 text-2xl tracking-tight text-slate-400">
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
