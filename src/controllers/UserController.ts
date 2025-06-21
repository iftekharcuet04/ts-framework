// src/controllers/UserController.ts
import { Controller, Get } from '../core/controller-decorator';
import { Inject } from '../core/di';
import { UserService } from '../services/UserService';

@Controller('users')
export class UserController {
  @Inject(UserService)
  private userService!: UserService;

  @Get('/:id')
  getUser(req: any, params: { id: string }) {
    return this.userService.getUserById(params.id);
  }

  @Get('/')
  listUsers() {
    return this.userService.listUsers();
  }
}
