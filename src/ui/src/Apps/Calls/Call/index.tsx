import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { fetch } from '../../../utils/fetch';

export const Call = () => {
  const hasCalled = useRef(false);
  const params = useParams<{ phoneNumber: string }>();

  const { mutate: call } = useMutation({
    mutationFn: async () => {
      console.log('calling ...');
      const response = await fetch(`/calls/create`, {
        body: JSON.stringify({ phoneNumber: params.phoneNumber }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    console.log('useEffect: calling ...');
    call();
  }, []);

  return (
    <main className="p-8 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Calling ... {params.phoneNumber ?? 'unknown'}</h1>

      <Link to={-1 as any} relative="path">
        <button className="px-4 py-2 border rounded-lg">end call</button>
      </Link>
    </main>
  );
};
