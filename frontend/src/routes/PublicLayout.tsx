import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import PublicNavbar from '../components/PublicNavbar';

export default function PublicLayout(): React.ReactElement {
  return (
    <>
      <PublicNavbar />
      <main id="main-view">
        <Outlet />
      </main>
      <ToastContainer
        position='bottom-right'
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </>
  );
}
