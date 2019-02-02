import { CompletedTodosWasDeletedPayload } from './payloads/completed-todos-was-deleted-payload';
import { SourceWasUpdatedPayload } from './payloads/source-was-updated-payload';
import { TodoWasAddedPayload } from './payloads/todo-was-added-payload';
import { TodoWasMovedPayload } from './payloads/todo-was-moved-payload';
import { TodoWasUpdatedPayload } from './payloads/todo-was-updated-payload';
import { TodoEventType } from './toto-event-type';

export class TodoEvent {
  userId: string;
  timestamp: number;
  type: TodoEventType;
  payload:
    | TodoWasAddedPayload
    | TodoWasUpdatedPayload
    | TodoWasMovedPayload
    | CompletedTodosWasDeletedPayload
    | SourceWasUpdatedPayload;
}
