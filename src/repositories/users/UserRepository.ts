import { Injectable } from "../../core/di";
import { getDbClient } from "../../db/DBModule";
import { BaseRepository } from "../BaseRepository";

interface User {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class UserRepository implements BaseRepository<User> {
  private client = getDbClient() as any;

  async findAll(): Promise<User[]> {
    return this.client.user.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return this.client.users.findUnique({ where: { id } });
  }

  async create(data: Partial<User>): Promise<User> {
    return this.client.user.create({ data });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    return this.client.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.client.user.delete({ where: { id } });
  }
}
