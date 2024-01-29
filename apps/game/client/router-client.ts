import { createClient } from '@core/router';
import { AppRouter } from '../server/router-server';

export const client = createClient<AppRouter>();
