import dorksService from '@/services/dorks.service';
import DorksTable from './_components/DorksTable';
import { DorkStats } from './_components/DorkStats';

export default function GoogleDorksPage() {
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
        <div className='flex'>
      <DorkStats />
      <button
        className='absolute right-5 flex items-center rounded-sm border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
        onClick={updateGhdb}
      >
        Update dorks
      </button>
    </div>
      <DorksTable />

    </>
  );
}
