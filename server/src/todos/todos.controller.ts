import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { settings } from 'src/environments/environment';
import { Todo } from 'src/models/todo';

@Controller('todos')
export class TodosController {
  sourceFilePath: string;
  regex = /(x)?\s?(\([A-Z]\))?\s?(\d{4}\-\d{2}\-\d{2})?\s?(\d{4}\-\d{2}\-\d{2})?\s?(.*)/;

  constructor() {
    this.sourceFilePath = this.getAbsoluteFilePath(settings.sourceFilePath);
    this.ensureDirectoryExistence(this.sourceFilePath);
  }

  @Get('source')
  @Header('content-type', 'text/plain')
  getSource() {
    return this.readFileAsString(this.sourceFilePath);
  }

  @Put('source')
  @Header('content-type', 'text/plain')
  putSource(@Body() text) {
    fs.writeFileSync(this.sourceFilePath, text, 'utf8');
    return text;
  }

  @Get()
  getTodos(): Todo[] {
    const source = this.readFileAsString(this.sourceFilePath);
    return this.parseSource(source);
  }

  parseSource(source: string): Todo[] {
    const sourceRows = source.trim().split('\n');

    return sourceRows.map((x, index) => {
      const m = this.regex.exec(x.trim());
      return m !== null
        ? {
            id: index + 1,
            title: m[5],
            checked: m[1] === 'x' ? true : false,
          }
        : {
            id: index + 1,
            title: '',
            checked: false,
          };
    });
  }

  @Post()
  addTodo(@Body() todo: Todo): Todo[] {
    fs.appendFileSync(this.sourceFilePath, `\n${todo.title}`);
    return this.getTodos();
  }

  @Put(':id')
  updateTodo(@Body() todo: Todo, @Param('id') id: number): Todo[] {
    const todos = this.getTodos();
    todos[id - 1] = todo;

    const source = this.convertToSource(todos);

    this.ensureDirectoryExistence(this.sourceFilePath);
    fs.writeFileSync(this.sourceFilePath, source, 'utf8');

    return this.getTodos();
  }

  @Post('delete-completed')
  deleteCompletedTodos() {
    const todos = this.getTodos().filter(x => !x.checked);

    const source = this.convertToSource(todos);

    this.ensureDirectoryExistence(this.sourceFilePath);
    fs.writeFileSync(this.sourceFilePath, source, 'utf8');

    return this.getTodos();
  }

  convertToSource(todos: Todo[]): string {
    return todos
      .map(todo => `${todo.checked ? 'x ' : ''}${todo.title}`)
      .join('\n');
  }

  readFileAsString(filePath: string) {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath).toString() : '';
  }

  ensureDirectoryExistence(filePath: string) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    this.ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  getAbsoluteFilePath(sourceFilePath: string) {
    return sourceFilePath.startsWith('.')
      ? path.join(__dirname, '../../', sourceFilePath)
      : sourceFilePath;
  }
}
