import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Todo } from '../models/todo';
import { TodoEventType } from '../models/toto-event-type';
import { TodosService } from './todos.service';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get('source')
  @Header('content-type', 'text/plain')
  getSource() {
    const source = this.todosService.getTodosAsString();
    return source != null ? source : '';
  }

  @Put('source')
  @Header('content-type', 'text/plain')
  putSource(@Body() text, @Req() req) {
    this.todosService.handleTodoEvent({
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.SourceWasUpdated,
      payload: { text },
    });

    return text;
  }

  @Get()
  getTodos(@Query() query): Promise<Todo[]> | Todo[] {
    if (query.untilHistoryIndex != null) {
      return this.todosService.getTodosFromEventsUntilIndex(
        query.untilHistoryIndex
      );
    } else {
      return this.todosService.getTodos();
    }
  }

  @Post()
  addTodo(@Body() todo: Todo, @Req() req): Todo[] {
    return this.todosService.handleTodoEvent({
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasAdded,
      payload: { todo },
    });
  }

  @Put(':index')
  updateTodo(
    @Body() todo: Todo,
    @Param('index') index: number,
    @Req() req
  ): Todo[] {
    return this.todosService.handleTodoEvent({
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasUpdated,
      payload: { todo, index },
    });
  }

  @Post('move-todo')
  moveTodo(@Query() query, @Req() req): Todo[] {
    return this.todosService.handleTodoEvent({
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasMoved,
      payload: { fromIndex: query.fromIndex, toIndex: query.toIndex },
    });
  }

  @Post('delete-completed')
  deleteCompletedTodos(@Req() req) {
    return this.todosService.handleTodoEvent({
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.CompletedTodosWasDeleted,
      payload: {},
    });
  }

  @Get('todo-events')
  getTodoEvents() {
    return this.todosService.getTodoEvents();
  }

  getSub(req) {
    return req.decodedToken.sub;
  }
}
