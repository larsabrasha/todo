import { Body, Controller, Get, Header, Put, Response } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { settings } from 'src/environments/environment';
import { Todo } from 'src/models/todo';

@Controller('todos')
export class TodosController {
  sourceFilePath: string;

  constructor() {
    this.sourceFilePath = this.getAbsoluteFilePath(settings.sourceFilePath);
  }

  @Get()
  getTodos(): Todo[] {
    return [
      { id: 1, title: 'att göra 1', checked: false },
      { id: 2, title: 'att göra 2', checked: false },
      { id: 3, title: 'att göra 3', checked: true },
    ];
  }

  @Get('source')
  @Header('content-type', 'text/plain')
  getSource(@Response() res) {
    res.send(this.readFileAsString(this.sourceFilePath));
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
