import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Todo } from '../models/todo';
import { IAppState } from '../store/app.state';
import { AddTodo, DeleteCompletedTodos, GetTodos, MoveTodo, ToggleChecked } from '../store/todos/todos.actions';

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

  toggle(todo: Todo) {
    this.store.dispatch(new ToggleChecked(todo));
  }

  onSubmit() {
    const title = this.form.value.title.trim();

    if (title !== '') {
      this.store.dispatch(new AddTodo(this.form.value.title));
      this.title.setValue('');
    }
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
