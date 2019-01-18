import { Controller, Get } from '@nestjs/common';
import { Todo } from 'src/models/todo';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos(): Todo[] {
    return [
      { id: 1, title: 'att göra 1', checked: false },
      { id: 2, title: 'att göra 2', checked: false },
      { id: 3, title: 'att göra 3', checked: false },
    ];
  }
}
