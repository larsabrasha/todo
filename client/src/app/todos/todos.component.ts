import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo';
import { IAppState } from '../store/app.state';
import { ToggleHistory } from '../store/layout/layout.actions';
import {
  AddTodo,
  DeleteCompletedTodos,
  GetTodos,
  MoveTodo,
  ToggleChecked,
} from '../store/todos/todos.actions';
import { TodosState } from '../store/todos/todos.state';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodosComponent implements OnInit {
  @Select((state: IAppState) => state.todos.todos)
  todos$: Observable<Todo[]>;

  @Select(TodosState.anyCheckedTodos)
  anyCheckedTodos$: Observable<boolean>;

  @Select((state: IAppState) => state.layout.showingHistory)
  showingHistory$: Observable<boolean>;

  form: FormGroup;

  ADD_A_TODO = 'Add a todo';
  placeholder = this.ADD_A_TODO;

  constructor(private store: Store, private fb: FormBuilder) {}

  get title() {
    return this.form.get('title');
  }

  ngOnInit() {
    this.store.dispatch(new GetTodos());

    this.form = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.max(500)]),
    });
  }

  toggle(index: number) {
    this.store.dispatch(new ToggleChecked(index));
  }

  onSubmit() {
    const title = this.form.value.title.trim();

    if (title !== '') {
      this.store.dispatch(new AddTodo(this.form.value.title));
      this.title.setValue('');
    }
  }

  toggleHistory() {
    this.store.dispatch(new ToggleHistory());
  }

  deleteCompletedTodos() {
    this.store.dispatch(new DeleteCompletedTodos());
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
