import { initDB } from "./database/knex";

function bootstrap() {
	initDB();
}

bootstrap();
