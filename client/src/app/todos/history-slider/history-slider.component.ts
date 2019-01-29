import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subscription } from 'rxjs';
import { TodoEvent } from 'src/app/models/todo-event';
import { IAppState } from 'src/app/store/app.state';
import { LoadTodoEvents } from 'src/app/store/history/history.actions';
import { ShowTodosAtHistoryIndex } from 'src/app/store/todos/todos.actions';

@Component({
  selector: 'app-history-slider',
  templateUrl: './history-slider.component.html',
  styleUrls: ['./history-slider.component.scss'],
})
export class HistorySliderComponent implements OnInit, OnDestroy {
  @Select((state: IAppState) => state.history.todoEvents)
  todoEvents$: Observable<TodoEvent[]>;

  @Select((state: IAppState) => state.history.maxHistoryIndex)
  maxHistoryIndex$: Observable<number>;

  @Select((state: IAppState) => state.todos.showingTodosAtHistoryIndex)
  showingTodosAtHistoryIndex$: Observable<number>;

  showingTodosAtHistoryIndexSub: Subscription;

  form: FormGroup;

  get slider() {
    return this.form.get('slider');
  }

  constructor(private store: Store, private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      slider: this.fb.control(0),
    });

    this.store.dispatch(new LoadTodoEvents());

    this.showingTodosAtHistoryIndexSub = this.store
      .select((state: IAppState) => state.todos.showingTodosAtHistoryIndex)
      .subscribe(x => {
        this.slider.setValue(x);
      });
  }

  ngOnDestroy() {
    this.showingTodosAtHistoryIndexSub.unsubscribe();

    this.store.dispatch(new ShowTodosAtHistoryIndex(null));
  }

  _updateHistoryIndex() {
    this.store.dispatch(new ShowTodosAtHistoryIndex(this.slider.value));
  }
}
