import { Controller, Get } from '@nestjs/common';
import { Todo } from 'src/models/todo';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos(): Todo[] {
    return [{ title: 'att göra 1' }, { title: 'att göra 2' }, { title: 'att göra 3' }];
  }
}
