import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationMiddleware } from './authentication.middleware';
import { environment } from './environments/environment';
import { TodoListsController } from './todo-lists/todo-lists.controller';
import { TodosController } from './todos/todos.controller';
import { TodosService } from './todos/todos.service';

@Module({
  imports: [JwtModule.register({ secretOrPrivateKey: environment.secret })],
  controllers: [TodosController, TodoListsController],
  providers: [TodosService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware).forRoutes('-*');
  }
}
