import { Bird } from 'lucide-react';

export function LifeInvaderTitle() {
  return (
    <div className='h-[50px] w-full flex nowrap flex-row justify-center items-center bg-neutral-700 rounded border border-neutral-600'>
      <Bird size={24} className='text-sky-400'/>
    </div>
  );
}