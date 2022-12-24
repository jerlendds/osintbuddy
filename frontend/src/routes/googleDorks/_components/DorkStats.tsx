import dorksService from '@/services/dorks.service';
import { useEffect, useState } from 'react';
import { DocumentMagnifyingGlassIcon, PencilSquareIcon, TagIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

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
    <dl className='relative flex w-ful mr-6 mx-auto '>
      {/* Gradient background of same width & height  as Blog post card  */}
      <div className=' rounded-lg w-full bg-gradient-to-r flex p-[2px] from-[#4082EE] to-[#1462E2] '>
        <div className='flex  justify-between items-center h-full bg-primary rounded-lg py-3.5 px-6 '>
          <div className='flex flex-col justify-center text-white'>
            {/* PostImage */}

            {/* Post title */}
            <div className='w-full flex items-center'>
              <div className={classNames('min-w-[1.5rem] min-h-[1.5rem] -mt-5 mr-2 mb-2 text-light-200', className)}>
                <Icon className='w-6 h-6 text-light-200' />
              </div>{' '}
              <h3 className='text-lg font-bold font-sans mb-auto leading-6 py-1 w-52 text-light-200'>{title}</h3>
              <div className='flex flex-col'>
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
  const [dorksData, setDorksData] = useState([]);
  const [dorksCount, setDorksCount] = useState(0);
  const [authorsCount, setAuthorsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);

  useEffect(() => {
    if (isFirstLoad) {
      setLoading(true);
      dorksService
        .getDorks(1, 0)
        .then((resp) => {
          console.log(resp);
          if (resp.data) {
            console.log(resp.data.dorksCount);
            if (resp.data.dorks) setDorksData(resp.data.dorks);
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
        <div className='flex'>
          <StatsCard
            className='bg-primary flex items-center justify-center p-3 rounded-full'
            Icon={DocumentMagnifyingGlassIcon}
            title='All Google Dorks'
            name='Dorks'
            stat={`${dorksCount}`}
          />
          <StatsCard
            className='bg-primary flex items-center justify-center p-3 rounded-full'
            Icon={PencilSquareIcon}
            title='Google Dork Authors'
            name='Authors'
            stat={`${authorsCount}`}
          />
          <StatsCard
            className='bg-primary flex items-center justify-center p-3 rounded-full'
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
