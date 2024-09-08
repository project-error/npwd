import { useLocation, useNavigate, useParams } from 'react-router';
import { Link } from 'react-router-dom';

export const Call = () => {
  const params = useParams<{ phoneNumber: string }>();

  return (
    <main className="p-8 flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Calling ... {params.phoneNumber ?? 'unknown'}</h1>

      <Link to={-1 as any} relative="path">
        <button className="px-4 py-2 border rounded-lg">end call</button>
      </Link>
    </main>
  );
};
