import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { Todo } from '../models/todo';
import { TodoEvent } from '../models/todo-event';
import { TodoList } from '../models/todo-list';
import { IAppState } from '../store/app.state';
import { ToggleHistory } from '../store/layout/layout.actions';
import {
  AddTodoFirst,
  AddTodoLast,
  CreateTodoList,
  DeleteCompletedTodos,
  DeleteSelectedTodoList,
  LoadTodoLists,
  MoveTodo,
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

  routeSub: Subscription;

  formFirst: FormGroup;
  formLast: FormGroup;

  ADD_A_TODO = 'Add a todo';
  placeholderFirst = this.ADD_A_TODO;
  placeholderLast = this.ADD_A_TODO;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  get titleFirst() {
    return this.formFirst.get('titleFirst');
  }

  get titleLast() {
    return this.formLast.get('titleLast');
  }

  ngOnInit() {
    this.routeSub = this.activatedRoute.params.subscribe(routeParams => {
      this.store.dispatch(new LoadTodoLists(routeParams['id']));
    });

    this.formFirst = this.fb.group({
      titleFirst: this.fb.control('', [
        Validators.required,
        Validators.max(500),
      ]),
    });

    this.formLast = this.fb.group({
      titleLast: this.fb.control('', [
        Validators.required,
        Validators.max(500),
      ]),
    });

    this.showingHistorySub = this.store
      .select((state: IAppState) => state.layout.showingHistory)
      .subscribe(x => (this.showingHistory = x));
  }

  ngOnDestroy() {
    this.showingHistorySub.unsubscribe();
    this.routeSub.unsubscribe();
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

  onSubmitFirst() {
    if (!this.showingHistory) {
      const title = this.titleFirst.value.trim();

      if (title !== '') {
        this.store.dispatch(new AddTodoFirst(title));
        this.titleFirst.setValue('');
      }
    }
  }

  onSubmitLast() {
    if (!this.showingHistory) {
      const title = this.titleLast.value.trim();

      if (title !== '') {
        this.store.dispatch(new AddTodoLast(title));
        this.titleLast.setValue('');
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

  onFocusFirst() {
    this.placeholderFirst = '';
  }

  onFocusLast() {
    this.placeholderLast = '';
  }

  onBlurFirst() {
    this.placeholderFirst = this.ADD_A_TODO;
  }

  onBlurLast() {
    this.placeholderLast = this.ADD_A_TODO;
  }
}
