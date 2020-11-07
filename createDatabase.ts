import Knex from 'knex';
import { Client } from 'pg';


async function run() {
    const client = new Client({
        user: 'ob',
        password: 'dev',
        database: 'postgres',
    });

    await client.connect();
    try {
        await client.query(`CREATE DATABASE \"typedKnexTest\" OWNER ob;`);
        console.log('created database');
        await client.end();

        const configObj = {
            client: 'postgresql',
            connection: {
                host: '127.0.0.1',
                port: '5432',
                database: 'typedKnexTest',
                user: 'ob',
                password: 'dev',
            },
            pool: {
                min: 2,
                max: 10,
            },
            migrations: {
                tableName: 'knex_migrations',
                directory: './build/migrations',
            },
            asyncStackTraces: true,
        }
        const database = Knex(configObj);

        await database.migrate.latest();
        console.log('Database has been migrated');

        process.exit();
    } catch (e) {
        // code '42P04' means database already exists
        if (e.code === '42P04') {
            console.error(`database already exists... ${e}`);
        } else {
            console.error(e);
        }
        process.exit();
    }
}

run();
