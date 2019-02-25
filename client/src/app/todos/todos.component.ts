import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoEvent } from '../models/todo-event';
import { IAppState } from '../store/app.state';
import { ToggleHistory } from '../store/layout/layout.actions';
import {
  AddTodo,
  DeleteCompletedTodos,
  LoadTodos,
  MoveTodo,
  ToggleChecked,
} from '../store/todos/todos.actions';
import { TodosState } from '../store/todos/todos.state';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit, OnDestroy {
  @Select((state: IAppState) => state.todos.todos)
  todos$: Observable<Todo[]>;

  @Select(TodosState.anyCheckedTodos)
  anyCheckedTodos$: Observable<boolean>;

  @Select((state: IAppState) => state.todos.showingTodosAtHistoryIndex)
  showingTodosAtHistoryIndex$: Observable<TodoEvent[]>;

  showingHistory: boolean;
  showingHistorySub: Subscription;

  form: FormGroup;

  ADD_A_TODO = 'Add a todo';
  placeholder = this.ADD_A_TODO;

  constructor(private store: Store, private fb: FormBuilder) {}

  get title() {
    return this.form.get('title');
  }

  ngOnInit() {
    this.store.dispatch(new LoadTodos());

    this.form = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.max(500)]),
    });

    this.showingHistorySub = this.store
      .select((state: IAppState) => state.layout.showingHistory)
      .subscribe(x => (this.showingHistory = x));
  }

  ngOnDestroy() {
    this.showingHistorySub.unsubscribe();
  }

  toggle(index: number) {
    if (!this.showingHistory) {
      this.store.dispatch(new ToggleChecked(index));
    }
  }

  onSubmit() {
    if (!this.showingHistory) {
      const title = this.form.value.title.trim();

      if (title !== '') {
        this.store.dispatch(new AddTodo(this.form.value.title));
        this.title.setValue('');
      }
    }
  }

  toggleHistory() {
    this.store.dispatch(new ToggleHistory());
  }

  deleteCompletedTodos() {
    if (!this.showingHistory) {
      this.store.dispatch(new DeleteCompletedTodos());
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    this.store.dispatch(new MoveTodo(event.previousIndex, event.currentIndex));
  }

  onFocus() {
    this.placeholder = '';
  }

  onBlur() {
    this.placeholder = this.ADD_A_TODO;
  }
}
