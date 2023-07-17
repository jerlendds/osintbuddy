import dorksService from '@/app/services/dorks.service';
import { useEffect, useState } from 'react';
import { DocumentMagnifyingGlassIcon, PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import api from '@/app/services/api.service';

const stats = [
  { name: 'Total Subscribers', stat: '71,897' },
  { name: 'Avg. Open Rate', stat: '58.16%' },
  { name: 'Avg. Click Rate', stat: '24.57%' },
];

interface StatsCardProps {
  title: string;
  name: string;
  stat: string;
  className?: string;
  Icon: any;
}

export default function StatsCard({ title, name, stat, className, Icon }: StatsCardProps) {
  return (
    <dl className='relative flex mr-4 last:mr-0 w-1/3'>
      {/* Gradient background of same width & height  as Blog post card  */}
      <div className=' rounded-lg w-full flex p-[2px] '>
        <div className={classNames('flex  justify-between items-center h-full w-full rounded-lg py-3.5 px-6 ', className)}>
          <div className='flex flex-col justify-center text-light w-full'>
            {/* PostImage */}

            {/* Post title */}
            <div className='w-full flex items-center'>
              
              <h3 className='text-lg font-bold font-sans mb-auto leading-6 py-1 w-full text-light-200'>{title}</h3>
              <div className='flex flex-col !ml-auto relative'>
                <dd className='mt-1 ml-auto text-5xl font-semibold leading-8 tracking-tight text-light-200'>{stat}</dd>
                <h3 className='text-sm font-medium font-sans mb-auto leading-6 ml-auto text-light-200'>{name}</h3>
              </div>
            </div>

            {/* Post Data/excerpt */}
          </div>
        </div>
      </div>
    </dl>
  );
}
export function DorkStats() {
  const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isError, setError] = useState<boolean>(false);
  const [dorksCount, setDorksCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    if (isFirstLoad) {
      setLoading(true);
      api.get('/ghdb/dorks/count')
        .then((resp) => {
          if (resp.data) {
            if (resp.data.dorksCount) setDorksCount(resp.data.dorksCount);
            if (resp.data.authorsCount) setAuthorsCount(resp.data.authorsCount);
            if (resp.data.categoriesCount) setCategoriesCount(resp.data.categoriesCount);
            setLoading(false);
          } else {
            setLoading(false);

            setError(true);
          }
        })
        .catch((error) => {
          console.warn(error);
          setLoading(false);
          setError(true);
        });
    }
    setFirstLoad(false);
  });

  return (
    <>
      {isLoading ? (
        <span>Loading...</span>
      ) : (
        <div className='flex w-full'>
          <StatsCard
            className=' flex bg-gradient-to-br  items-center justify-center p-3 rounded-full from-[#3B9649] to-[#287515]'
            Icon={DocumentMagnifyingGlassIcon}
            title='All Google Dorks'
            name='Dorks'
            stat={`${dorksCount}`}
          />
          <StatsCard
            className=' bg-gradient-to-br   flex items-center justify-center p-3 rounded-full to-[#208e80] from-[#2daaa4] '
            Icon={PencilSquareIcon}
            title='Google Dork Authors'
            name='Authors'
            stat={`${authorsCount}`}
          />
          <StatsCard
            className='bg-gradient-to-br  flex items-center justify-center p-3 rounded-full to-[#16168C] from-[#1D1DB8]'
            Icon={TagIcon}
            title='Dork Categories'
            name='Categories'
            stat={`${categoriesCount}`}
          />
        </div>
      )}
    </>
  );
}
