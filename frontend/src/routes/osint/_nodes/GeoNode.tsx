import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { ClockIcon, LockOpenIcon, MagnifyingGlassIcon, MapIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function GeoNode({ flowData }: any) {
  const [geoData, setGeoData] = useState<any>(flowData.data.geolocation);
  const [summaryData, setSummaryData] = useState<any>(flowData.data.summary);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className='node container bg-primary bg-opacity-60 min-w-[32rem]'>
        <div className='header bg-primary bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              {' '}
              <span>ID: </span>
              {flowData.id}
            </p>
            <p >Geolocation</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-xs text-slate-200 font-display'>City</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapPinIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.city && geoData.city}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>
                Coordinates
              </p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.coordinates && geoData.coordinates}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Country</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.country && geoData.country}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Postal</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapPinIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.postal && geoData.postal}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>State</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.state && geoData.state}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Timezone</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <ClockIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={geoData && geoData.timezone && geoData.timezone}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
            </form>
          </div>
          <div className='md:flex-col md:flex w-full ml-4 md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-xs text-slate-200 font-display'>ASN</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapPinIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.asn && summaryData.asn}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Hostname</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.hostname && summaryData.hostname}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Range</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.range && summaryData.range}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Company</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapPinIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.company && summaryData.company}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>
                Hosted Domains
              </p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MapIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.hostedDomains && summaryData.hostedDomains}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Privacy</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <ClockIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.privacy && summaryData.privacy}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>Anycast</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <ClockIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.anycast && summaryData.anycast}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>ASN type</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <ClockIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.asnType && summaryData.asnType}
                    
                    placeholder='example@gmail.com'
                  />
                </div>
              </div>
              <p className='text-xs text-slate-200 font-display'>
                Abuse contact
              </p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <ClockIcon />
                  <input
                    type='text'
                    data-node='domain'
                    value={summaryData && summaryData.abuseContact && summaryData.abuseContact}
                    
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
  getId,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
}: NodeContextProps) {
  return <></>;
}
