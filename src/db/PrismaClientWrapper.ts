import { PrismaClient } from '@prisma/client';
import { Injectable } from '../core/di';
import { DatabaseClient } from './DataBaeClient';

@Injectable()
export class PrismaClientWrapper implements DatabaseClient {
  private client: PrismaClient;

  constructor() {
    this.client = new PrismaClient();

    // 🔁 Return a Proxy for dynamic model access
    return new Proxy(this, {
      get: (target, prop: string) => {
        console.log("target",target,"++++prop",prop);
        if (prop in target) return (target as any)[prop];
        if (prop in target.client) return (target.client as any)[prop];
        return undefined;
      },
    });
  }


  async connect() {
    await this.client.$connect();
    console.log('Connected with Prisma');
  }

  async disconnect() {
    await this.client.$disconnect();
    console.log('Disconnected Prisma');
  }

  getClient() {
    return this.client;
  }
}
