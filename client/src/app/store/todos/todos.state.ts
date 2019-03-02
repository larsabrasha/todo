import { Action, Selector, State, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { TodoListsService } from 'src/app/todo-lists.service';
import { TodosService } from 'src/app/todos.service';
import { HideHistory } from '../layout/layout.actions';
import {
  AddTodo,
  CreateTodoList,
  DeleteCompletedTodos,
  DeleteSelectedTodoList,
  LoadTodoLists,
  LoadTodos,
  MoveTodo,
  SelectTodoList,
  ShowTodosAtHistoryIndex,
  ToggleChecked,
  UpdateSelectedTodoListName,
} from './todos.actions';
import { defaults, TodosStateModel } from './todos.model';

@State<TodosStateModel>({
  name: 'todos',
  defaults: defaults,
})
export class TodosState {
  constructor(
    private todoService: TodosService,
    private todoListsService: TodoListsService
  ) {}

  @Selector()
  static anyCheckedTodos(todosState: TodosStateModel): boolean {
    return todosState.todos.filter(x => x.checked).length > 0;
  }

  @Action(LoadTodoLists)
  loadTodoLists(context: StateContext<TodosStateModel>, action: LoadTodoLists) {
    return this.todoListsService.get().pipe(
      tap(x => {
        if (x.length > 0) {
          let selectedTodoList = x.find(
            y => y.id === action.selectedTodoListId
          );

          if (selectedTodoList == null) {
            selectedTodoList = x[0];
          }

          context.patchState({
            todoLists: x,
            selectedTodoListId: selectedTodoList ? selectedTodoList.id : null,
            selectedTodoListName: selectedTodoList
              ? selectedTodoList.name
              : null,
          });

          context.dispatch(new LoadTodos());
        }
      })
    );
  }

  @Action(SelectTodoList)
  selectTodoList(
    context: StateContext<TodosStateModel>,
    action: SelectTodoList
  ) {
    const state = context.getState();

    const todoList = state.todoLists.find(x => x.id === action.id);

    if (todoList == null) {
      return;
    }

    context.patchState({
      selectedTodoListId: todoList.id,
      selectedTodoListName: todoList.name,
      showingTodosAtHistoryIndex: null,
    });

    context.dispatch([new HideHistory(), new LoadTodos()]);
  }

  @Action(DeleteSelectedTodoList)
  deleteSelectedTodoList(context: StateContext<TodosStateModel>) {
    const state = context.getState();

    return this.todoListsService.delete(state.selectedTodoListId).pipe(
      tap(() => {
        context.dispatch(new LoadTodoLists(null));
      })
    );
  }

  @Action(CreateTodoList)
  createTodoList(
    context: StateContext<TodosStateModel>,
    action: CreateTodoList
  ) {
    return this.todoListsService.post({ id: null, name: action.name }).pipe(
      tap(x => {
        const createdTodoList = x.find(
          todoList => todoList.name === action.name
        );
        context.patchState({
          todoLists: x,
          selectedTodoListId: createdTodoList.id,
          selectedTodoListName: createdTodoList.name,
        });

        context.dispatch([new HideHistory(), new LoadTodos()]);
      })
    );
  }

  @Action(UpdateSelectedTodoListName)
  updateSelectedTodoListName(
    context: StateContext<TodosStateModel>,
    action: UpdateSelectedTodoListName
  ) {
    const state = context.getState();

    const todoList = state.todoLists.find(
      x => x.id === state.selectedTodoListId
    );

    if (todoList != null) {
      return this.todoListsService
        .put({
          ...todoList,
          name: action.name,
        })
        .pipe(
          tap(x => {
            context.dispatch(new LoadTodoLists(state.selectedTodoListId));
          })
        );
    }
  }

  @Action(LoadTodos)
  loadTodos(context: StateContext<TodosStateModel>) {
    const state = context.getState();

    return this.todoService
      .getTodos(state.selectedTodoListId, state.showingTodosAtHistoryIndex)
      .pipe(
        tap(x =>
          context.patchState({
            todos: x,
          })
        )
      );
  }

  @Action(ToggleChecked)
  toggleChecked(context: StateContext<TodosStateModel>, action: ToggleChecked) {
    const state = context.getState();

    const updatedTodo = {
      ...state.todos[action.index],
      checked: !state.todos[action.index].checked,
    };

    const todos = [...state.todos];
    todos[action.index] = updatedTodo;

    context.patchState({
      todos: todos,
    });

    return this.todoService.putTodo(
      state.selectedTodoListId,
      action.index,
      updatedTodo
    );
  }

  @Action(AddTodo)
  addTodo(context: StateContext<TodosStateModel>, action: AddTodo) {
    const state = context.getState();

    const newTodo = {
      title: action.title,
      checked: false,
    };

    const todos = [...state.todos, newTodo];
    context.patchState({
      todos: todos,
    });

    return this.todoService.postTodo(state.selectedTodoListId, newTodo);
  }

  @Action(MoveTodo)
  moveTodo(context: StateContext<TodosStateModel>, action: MoveTodo) {
    const state = context.getState();

    const todos = [...state.todos];
    todos.splice(action.newIndex, 0, todos.splice(action.previousIndex, 1)[0]);

    context.patchState({
      todos: todos,
    });

    return this.todoService.moveTodo(
      state.selectedTodoListId,
      action.previousIndex,
      action.newIndex
    );
  }

  @Action(DeleteCompletedTodos)
  deleteCompletedTodos(context: StateContext<TodosStateModel>) {
    const state = context.getState();

    return this.todoService.deleteCompletedTodos(state.selectedTodoListId).pipe(
      tap(x =>
        context.patchState({
          todos: x,
        })
      )
    );
  }

  @Action(ShowTodosAtHistoryIndex)
  showTodosAtHistoryIndex(
    context: StateContext<TodosStateModel>,
    action: ShowTodosAtHistoryIndex
  ) {
    context.patchState({
      showingTodosAtHistoryIndex: action.historyIndex,
    });

    context.dispatch(new LoadTodos());
  }
}
