import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { TodoList } from '../models/todo-list';
// tslint:disable-next-line:no-var-requires
const uuidv1 = require('uuid/v1');

@Controller('todo-lists')
export class TodoListsController {
  todoLists: TodoList[];
  sourceFilePath: string;

  constructor() {
    this.sourceFilePath = this.getAbsoluteFilePath('./data/todo-lists.json');
    this.ensureDirectoryExistence(this.sourceFilePath);
  }

  @Get()
  get(): TodoList[] {
    const todoListsAsString = this.readFileAsString(this.sourceFilePath);

    const todoLists = JSON.parse(todoListsAsString);

    return this.sortTodoLists(todoLists);
  }

  @Post()
  post(@Body() todoList: TodoList): TodoList[] {
    const todoLists = this.get();

    todoList.id = uuidv1();
    todoLists.push(todoList);

    this.saveTodoListsFromString(JSON.stringify(todoLists, null, '  '));

    return this.sortTodoLists(todoLists);
  }

  @Put(':id')
  put(@Body() todoList: TodoList, @Param('id') id: string) {
    const todoLists = this.get();

    const index = todoLists.findIndex(x => x.id === id);
    if (index === -1) {
      throw new NotFoundException();
    }

    todoLists[index] = todoList;

    this.saveTodoListsFromString(JSON.stringify(todoLists, null, '  '));

    return this.sortTodoLists(todoLists);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    const todoLists = this.get();

    const index = todoLists.findIndex(x => x.id === id);

    if (index !== -1) {
      todoLists.splice(index, 1);
      this.saveTodoListsFromString(JSON.stringify(todoLists, null, '  '));
    }

    return this.sortTodoLists(todoLists);
  }

  readFileAsString(filePath: string) {
    return fs.existsSync(filePath)
      ? fs.readFileSync(filePath).toString()
      : null;
  }

  saveTodoListsFromString(text: string) {
    this.ensureDirectoryExistence(this.sourceFilePath);
    fs.writeFileSync(this.sourceFilePath, text, 'utf8');
  }

  getAbsoluteFilePath(sourceFilePath: string) {
    return sourceFilePath.startsWith('.')
      ? path.join(__dirname, '../../', sourceFilePath)
      : sourceFilePath;
  }

  ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  sortTodoLists(todoLists: TodoList[]): TodoList[] {
    return todoLists != null
      ? todoLists.sort((a: TodoList, b: TodoList) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) {
            return 1;
          }

          if (a.name.toLowerCase() < b.name.toLowerCase()) {
            return -1;
          }

          return 0;
        })
      : [];
  }
}
