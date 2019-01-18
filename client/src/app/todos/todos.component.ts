import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Todo } from '../models/todo';
import { IAppState } from '../store/app.state';
import { GetTodos } from '../store/todos/todos.actions';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  @Select((state: IAppState) => state.todos.todoIds)
  todoIds$: number[];

  @Select((state: IAppState) => state.todos.todos)
  todos$: { [id: number]: Todo };

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(new GetTodos());
  }
}
