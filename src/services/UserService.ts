import { Injectable } from "../core/di";
import { UserRepository } from "../repositories/users/UserRepository";

@Injectable()
export class UserService {
  constructor(private userRepo = new UserRepository()) {}
  getUserById(id: string) {
    return { id, name: 'Injected Alice' };
  }

  listUsers() {
    console.log(this.userRepo);
    return this.userRepo.findAll();
  }
}
