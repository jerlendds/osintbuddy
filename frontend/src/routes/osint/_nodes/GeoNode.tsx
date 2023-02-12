import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { ClockIcon, LockOpenIcon, MagnifyingGlassIcon, MapIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

let nodeId = 0;

export function GeoNode({ flowData }: any) {
  const [geoData, setGeoData] = useState<any>(flowData.data.geolocation);
  const [summaryData, setSummaryData] = useState<any>(flowData.data.summary);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-[37rem] max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-primary text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-dark-300  whitespace-wrap font-display'>Geolocation</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-dark-300 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>City</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapPinIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.city && geoData.city}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                Coordinates
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.coordinates && geoData.coordinates}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Country</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.country && geoData.country}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Postal</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapPinIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.postal && geoData.postal}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>State</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.state && geoData.state}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Timezone</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <ClockIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={geoData && geoData.timezone && geoData.timezone}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
            </form>
          </div>
          <div className='md:flex-col md:flex w-full ml-4 md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>ASN</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapPinIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.asn && summaryData.asn}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Hostname</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.hostname && summaryData.hostname}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Range</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.range && summaryData.range}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Company</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapPinIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.company && summaryData.company}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                Hosted Domains
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MapIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.hostedDomains && summaryData.hostedDomains}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Privacy</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <ClockIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.privacy && summaryData.privacy}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Anycast</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <ClockIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.anycast && summaryData.anycast}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>ASN type</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <ClockIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.asnType && summaryData.asnType}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                Abuse contact
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <ClockIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={summaryData && summaryData.abuseContact && summaryData.abuseContact}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function GeoNodeContext({
  node,
  reactFlowInstance,

  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
}: NodeContextProps) {
  const getId = () => `rnode_${nodeId++}`;
  return <></>;
}
