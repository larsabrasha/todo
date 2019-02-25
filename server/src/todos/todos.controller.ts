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

@Controller('todo-lists/:todoListId/todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Get('source')
  @Header('content-type', 'text/plain')
  getSource(@Param('todoListId') todoListId: string) {
    const source = this.todosService.getTodosAsString(todoListId);
    return source != null ? source : '';
  }

  @Put('source')
  @Header('content-type', 'text/plain')
  putSource(@Param('todoListId') todoListId: string, @Body() text, @Req() req) {
    this.todosService.handleTodoEvent(todoListId, {
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.SourceWasUpdated,
      payload: { text },
    });

    return text;
  }

  @Get()
  getTodos(
    @Param('todoListId') todoListId: string,
    @Query() query
  ): Promise<Todo[]> | Todo[] {
    if (query.untilHistoryIndex != null) {
      return this.todosService.getTodosFromEventsUntilIndex(
        todoListId,
        query.untilHistoryIndex
      );
    } else {
      return this.todosService.getTodos(todoListId);
    }
  }

  @Post()
  addTodo(
    @Param('todoListId') todoListId: string,
    @Body() todo: Todo,
    @Req() req
  ): Todo[] {
    return this.todosService.handleTodoEvent(todoListId, {
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasAdded,
      payload: { todo },
    });
  }

  @Put(':index')
  updateTodo(
    @Param('todoListId') todoListId: string,
    @Body() todo: Todo,
    @Param('index') index: number,
    @Req() req
  ): Todo[] {
    return this.todosService.handleTodoEvent(todoListId, {
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasUpdated,
      payload: { todo, index },
    });
  }

  @Post('move-todo')
  moveTodo(
    @Param('todoListId') todoListId: string,
    @Query() query,
    @Req() req
  ): Todo[] {
    return this.todosService.handleTodoEvent(todoListId, {
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.TodoWasMoved,
      payload: { fromIndex: query.fromIndex, toIndex: query.toIndex },
    });
  }

  @Post('delete-completed')
  deleteCompletedTodos(@Param('todoListId') todoListId: string, @Req() req) {
    return this.todosService.handleTodoEvent(todoListId, {
      userId: this.getSub(req),
      timestamp: new Date().getTime(),
      type: TodoEventType.CompletedTodosWasDeleted,
      payload: {},
    });
  }

  @Get('todo-events')
  getTodoEvents(@Param('todoListId') todoListId: string) {
    return this.todosService.getTodoEvents(todoListId);
  }

  getSub(req) {
    return req.decodedToken.sub;
  }
}
