import { DatabaseClient } from "./DataBaeClient";
import { PrismaClientWrapper } from "./PrismaClientWrapper";


let dbClient: DatabaseClient;

export const initDb = async (): Promise<DatabaseClient> => {
  const adapter = process.env.DB_ADAPTER || 'prisma';

  console.log(`Using DB adapter: ${adapter}`);
  if (adapter === 'prisma') {
    dbClient = new PrismaClientWrapper();
  } else if (adapter === 'typeorm') {
    // dbClient = new TypeOrmClientWrapper();
  } else {
    throw new Error(`Unsupported DB adapter: ${adapter}`);
  }

  await dbClient.connect();
  return dbClient;
};

export const getDbClient = (): DatabaseClient => {
  if (!dbClient) throw new Error('DB client is not initialized!');
  return dbClient;
};
