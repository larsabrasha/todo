import { Body, Controller, Get, Header, Param, Post, Put } from '@nestjs/common';
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
    return source != null ? this.parseSource(source) : [];
  }

  parseSource(source: string): Todo[] {
    if (source.trim() === '') {
      return [];
    }

    const sourceRows = source.trim().split('\n');

    return sourceRows.map((x, index) => {
      const m = this.regex.exec(x.trim());
      return m !== null
        ? {
            index,
            title: m[5],
            checked: m[1] === 'x' ? true : false,
          }
        : null;
    }).filter(x => x != null);
  }

  @Post()
  addTodo(@Body() todo: Todo): Todo[] {
    const source = this.readFileAsString(this.sourceFilePath);

    fs.appendFileSync(
      this.sourceFilePath,
      `${source != null ? '\n' : ''}${todo.title}`,
    );
    return this.getTodos();
  }

  @Put(':index')
  updateTodo(@Body() todo: Todo, @Param('index') index: number): Todo[] {
    const todos = this.getTodos();

    if (index !== todo.index) {
      todos[index] = todos[todo.index];
    }

    todos[todo.index] = todo;

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
    return fs.existsSync(filePath)
      ? fs.readFileSync(filePath).toString()
      : null;
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
