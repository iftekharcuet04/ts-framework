// src/controllers/UserController.ts
import { Controller, Get } from '../core/controller-decorator';
import { Inject } from '../core/di';
import { UserService } from '../services/UserService';

@Controller('posts')
export class PostController {
  

  @Get('/:id')
  getPost(req: any, params: { id: string }) {
    return { id: params.id, name: 'Injected post' };
  }

  @Get('/')
  listPosts() {
    return [{ id: '1', name: 'Injected post' }];
  }
}
