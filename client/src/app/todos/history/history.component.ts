import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { TodoEventSummary } from 'src/app/models/todo-event-summary';
import { GetTodoEvents } from 'src/app/store/history/history.actions';
import { HistoryState } from 'src/app/store/history/history.state';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  @Select(HistoryState.getTodoEventSummaries)
  todoEventSummaries$: Observable<TodoEventSummary[]>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetTodoEvents());
  }
}
