import React from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material';
import { Twitter } from 'lucide-react';

export function LifeInvaderTitle() {
  return (
    <div className='h-[50px] w-full flex nowrap flex-row justify-center items-center bg-neutral-700 rounded border border-neutral-600'>
      <Twitter size={24} className='text-sky-400'/>
    </div>
  );
}