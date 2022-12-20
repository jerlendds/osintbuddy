import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/PublicNavbar';

export default function PublicLayout(): React.ReactElement {
  return (
    <>
      <PublicNavbar />
      <Outlet />
    </>
  );
}
