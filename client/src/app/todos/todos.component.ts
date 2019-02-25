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
import { TodoList } from '../models/todo-list';
import { IAppState } from '../store/app.state';
import { ToggleHistory } from '../store/layout/layout.actions';
import {
  AddTodo,
  CreateTodoList,
  DeleteCompletedTodos,
  DeleteSelectedTodoList,
  LoadTodoLists,
  MoveTodo,
  SelectTodoList,
  ToggleChecked,
  UpdateSelectedTodoListName,
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

  @Select((state: IAppState) => state.todos.todoLists)
  todoLists$: Observable<TodoList[]>;

  @Select((state: IAppState) => state.todos.selectedTodoListId)
  selectedTodoListId$: Observable<string>;

  @Select((state: IAppState) => state.todos.selectedTodoListName)
  selectedTodoListName$: Observable<string>;

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
    this.store.dispatch(new LoadTodoLists());

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

  selectTodoList(id: string) {
    this.store.dispatch(new SelectTodoList(id));
  }

  createTodoList() {
    const name = prompt('Enter list name', 'New List');
    if (name != null) {
      this.store.dispatch(new CreateTodoList(name));
    }
  }

  editListName() {
    const selectedTodoListName = this.store.selectSnapshot(
      (state: IAppState) => state.todos.selectedTodoListName
    );
    const name = prompt('Enter list name', selectedTodoListName);

    if (name != null) {
      this.store.dispatch(new UpdateSelectedTodoListName(name));
    }
  }

  deleteSelectedTodoList() {
    const result = confirm('Do you really want to delete this list?');

    if (result === true) {
      this.store.dispatch(new DeleteSelectedTodoList());
    }
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
