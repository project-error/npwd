import { initDB } from './database/knex';

function bootstrap() {
    initDB();
}

/**
 * Just to avoid crashing when running dev in root for now
 */
if (typeof RegisterCommand !== 'undefined') {
    bootstrap();
}
