import { Body, Controller, Get, Header, Put } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { settings } from 'src/environments/environment';
import { Todo } from 'src/models/todo';
const parser = require('todotxt-parser');

@Controller('todos')
export class TodosController {
  sourceFilePath: string;

  constructor() {
    console.log(settings.sourceFilePath);
    this.sourceFilePath = this.getAbsoluteFilePath(settings.sourceFilePath);
    console.log(this.sourceFilePath);
  }

  @Get()
  getTodos(): Todo[] {
    const source = this.readFileAsString(this.sourceFilePath);
    return this.parseSource(source);
  }

  parseSource(source: string): Todo[] {
    // TODO use my own parse instead. (x )?(\([A-Z]\) )?(\d{4}\-\d{2}\-\d{2} )?(\d{4}\-\d{2}\-\d{2} )?(.*)
    const tasks = parser.relaxed(source.trim());
    console.log(tasks);

    const todos = tasks.map((x, index) => ({
      id: index + 1,
      title: x.text,
      checked: x.complete,
    }));
    console.log(todos);

    return todos;
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
