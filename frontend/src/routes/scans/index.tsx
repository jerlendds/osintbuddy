import { PageHeader } from '@/components/Headers';
import { UnderConstruction } from '@/components/Loaders';
import classNames from 'classnames';

export default function SettingsPage() {
  const secondaryNavigation = [
    { name: 'Anonymization', href: '#', current: true },
    { name: 'Plugins', href: '#', current: false },
    { name: 'Keys', href: '#', current: false },
    { name: 'Features', href: '#', current: false },
  ];

  return (
    <>
      <PageHeader title='Scans' header='Passive Reconnaissance' />
      <div className='flex flex-col sm:px-2 lg:px-6 my-2 relative mx-auto w-full justify-center'>
        <p className='text-slate-400'>Automate your data gathering by scheduling scans</p>
      </div>
      <UnderConstruction
        header='OSINTBuddy Scans'
        description='This feature is currently being planned out and created and will be finished by around October. 
            You can help shape this feature by contributing to the discussions on Github!'
      />
    </>
  );
}
