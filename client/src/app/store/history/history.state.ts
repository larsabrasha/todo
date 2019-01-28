import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { SourceWasUpdatedPayload } from 'src/app/models/payloads/source-was-updated-payload';
import { TodoWasAddedPayload } from 'src/app/models/payloads/todo-was-added-payload';
import { TodoWasMovedPayload } from 'src/app/models/payloads/todo-was-moved-payload';
import { TodoWasUpdatedPayload } from 'src/app/models/payloads/todo-was-updated-payload';
import { TodoEventSummary } from 'src/app/models/todo-event-summary';
import { TodoEventType } from 'src/app/models/todo-event-type';
import { TodosService } from 'src/app/todos.service';
import { GetTodoEvents } from './history.actions';
import { defaults, HistoryStateModel } from './history.model';

@State<HistoryStateModel>({
  name: 'history',
  defaults,
})
export class HistoryState {
  constructor(private todosService: TodosService) {}

  @Selector()
  static getTodoEventSummaries(state: HistoryStateModel): TodoEventSummary[] {
    return state.todoEvents.map(x => {
      let title = '';
      let summary = '';

      if (x.type === TodoEventType.TodoWasAdded) {
        title = 'Added';
        summary = (x.payload as TodoWasAddedPayload).todo.title;
      } else if (x.type === TodoEventType.TodoWasUpdated) {
        title = 'Updated';
        const payload = x.payload as TodoWasUpdatedPayload;
        summary = `${payload.todo.checked ? '[completed]' : '[incompleted]'} ${
          payload.todo.title
        }`;
      } else if (x.type === TodoEventType.TodoWasMoved) {
        title = 'Moved';
        const payload = x.payload as TodoWasMovedPayload;
        summary = `[${payload.fromIndex}] → [${payload.toIndex}]`;
      } else if (x.type === TodoEventType.CompletedTodosWasDeleted) {
        title = 'Completed Deleted';
        summary = '';
      } else if (x.type === TodoEventType.SourceWasUpdated) {
        title = 'Source Updated';
        const payload = x.payload as SourceWasUpdatedPayload;
        summary = payload.text;
      }

      return {
        timestamp: x.timestamp,
        title: title,
        summary: summary,
      };
    });
  }

  @Action(GetTodoEvents)
  getTodoEvents(context: StateContext<HistoryStateModel>) {
    return this.todosService.getTodoEvents().pipe(
      tap(x => {
        context.patchState({
          todoEvents: x,
        });
      })
    );
  }
}
