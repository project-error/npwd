import { Outlet } from 'react-router';

export function MessagesLayout() {
  return (
    <main className="bg-neutral-900 h-full w-full">
      <header>
        <p>Messages</p>
      </header>
      <Outlet />
    </main>
  );
}
