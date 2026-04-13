import { getSession, isAdmin } from '@/lib/auth';
import { ConsoleClient } from './ConsoleClient';

export const dynamic = 'force-dynamic';

export default async function ConsolePage() {
  const session = await getSession();

  const initialState = session
    ? { loggedIn: true, email: session.email, isAdmin: isAdmin(session.email) }
    : { loggedIn: false, email: '', isAdmin: false };

  return <ConsoleClient initial={initialState} />;
}
