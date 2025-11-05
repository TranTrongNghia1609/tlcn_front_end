import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import { User, MapPinHouse, Mail } from 'lucide-react';

const UserInfo = ({ profileData }) => {
  const { user } = useAuth();
  const isOwner = profileData.isOwner || (user && user._id === profileData._id);

  return (
    <div className='p-4 flex space-y-8 flex-col'>
      <div className='space-y-8 flex-col items-center justinty-center flex'>
        <div className='flex space-x-4'>
          <div className='h-20 w-20 flex-shrink-0'>
            <img 
              src={profileData.avatar} 
              alt={profileData.userName}
              className='h-full w-full object-cover rounded-full'
            />
          </div>

          <div>
            <div className='flex space-x-2'>
              <User size='20px'/>
              <p className='font-bold'>{profileData.userName}</p>
            </div>
            <div className='flex space-x-2 mt-2'>
              <Mail size='20px'/>
              <p className='text-gray-500'>{profileData.email}</p>
            </div>
            <div className='flex space-x-2 mt-2'>
              <MapPinHouse size={'20px'}/>
              <p className='text-gray-500 text-sm'>Vietnam</p>
            </div>
          </div>
        </div>
        
        {isOwner && (
          <Button className={'w-2/3 bg-violet-600/80 hover:bg-violet-600 text-white cursor-pointer'}>
            Edit Profile
          </Button>
        )}
      </div>

      {/* language */}
      <div className=''>
        <div>Languages</div>
      </div>
    </div>
  );
};

export default UserInfo;