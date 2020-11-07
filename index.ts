import knex from "knex";
import { TypedKnex, Column, Table } from "@wwwouter/typed-knex";
import { v4 as uuidv4 } from 'uuid';

@Table("userCategories")
export class UserCategory {
    @Column({ primary: true })
    public id: string;
    @Column()
    public name: string;
    @Column()
    public year: number;
}

@Table("users")
export class User {
    @Column({ primary: true })
    public id: string;
    @Column()
    public name: string;
    @Column({ name: "categoryId" })
    public category: UserCategory;
}


async function start() {
    console.log('Starting');
    const database = knex({
        client: "pg",
        connection: {
            user: 'ob',
            password: 'dev',
            host: '127.0.0.1',
            port: 5432,
            database: 'typedKnexTest',
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: './build/migrations',
        },
    });

    const typedKnex = new TypedKnex(database);
    const transaction = await typedKnex.beginTransaction();

    console.log('Creating cat 1');
    const id1 = uuidv4();
    const userCategory1: UserCategory = {
        id: id1,
        name: 'First Category',
        year: 1992,
    };

    console.log('Creating cat 1');
    const id2 = uuidv4();
    const userCategory2: UserCategory = {
        id: id2,
        name: 'Second Category',
        year: 1993,
    };

    console.log('user1');
    const user1 = {
        id: uuidv4(),
        name: 'Victor',
        categoryId: id1
    };

    console.log('user2');
    const user2 = {
        id: uuidv4(),
        name: 'Arthur',
        categoryId: id2
    };

    try {
        await typedKnex.query(UserCategory).transacting(transaction).insertItem(userCategory1);
        await typedKnex.query(UserCategory).transacting(transaction).insertItem(userCategory2);
        await typedKnex.query(User).transacting(transaction).insertItem(user1);
        await typedKnex.query(User).transacting(transaction).insertItem(user2);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        console.log('error: ', error);
        console.log('error: ', error.message);
    }

    process.exit(1);
}

start();


