import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopNavigation } from '../../../components/Navigation/TopNavigation';

export const KeypadView = () => {
  const [search] = useSearchParams();
  const navigate = useNavigate();

  const handleCall = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const number = formData.get('number') as string;

    if (!number) {
      return;
    }
    navigate(`../call/${number}`);
  };

  const phoneNumber = search.get('phoneNumber');

  return (
    <div className="flex flex-col gap-2">
      <TopNavigation title="Keypad" />

      <form onSubmit={handleCall} className="flex flex-col gap-2 p-4">
        <input
          name="number"
          placeholder="Number .."
          defaultValue={phoneNumber || undefined}
          className="border px-4 py-2 w-full flex-1 rounded-lg bg-primary text-primary"
        />

        <button className="border-2 px-4 py-2 rounded-lg flex-4 bg-secondary hover:bg-cyan-200">
          call number
        </button>
      </form>
    </div>
  );
};
