import { Body, Controller, Get, Header, Post, Put } from '@nestjs/common';
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

  @Get('source')
  @Header('content-type', 'text/plain')
  getSource() {
    return this.readFileAsString(this.sourceFilePath);
  }

  @Put('source')
  @Header('content-type', 'text/plain')
  putSource(@Body() text) {
    this.ensureDirectoryExistence(this.sourceFilePath);
    fs.writeFileSync(this.sourceFilePath, text, 'utf8');
    return text;
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
