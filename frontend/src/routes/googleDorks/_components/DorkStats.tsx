import dorksService from '@/services/dorks.service';
import { useEffect, useState } from 'react';

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
}

export default function StatsCard({ title, name, stat, className }: StatsCardProps) {
  return (
    <div className={className || ''}>
      <h3 className='text-lg font-medium leading-6 py-1 w-64 text-light-900'>{title}</h3>
      <dl className=''>
        <div className='overflow-hidden rounded-sm bg-primary px-3 py-4 shadow sm:p-6'>
          <dt className='truncate text-sm font-medium text-light-200'>{name}</dt>
          <dd className='mt-1 text-3xl font-semibold tracking-tight text-light-200'>{stat}</dd>
        </div>
      </dl>
    </div>
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
            <StatsCard className='mr-4' title='Total Dorks' name='Dorks' stat={`${dorksCount}`} />
            <StatsCard className='mr-4' title='Total Authors' name='Authors' stat={`${authorsCount}`} />
            <StatsCard title='Total Categories' name='Categories' stat={`${categoriesCount}`} />
          </div>
        )}
    
    </>
  );
}
