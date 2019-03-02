import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { IAppState } from 'src/app/store/app.state';
import {
  GetTodosSource,
  PutTodosSource,
} from 'src/app/store/todos-source/todos-source.actions';

@Component({
  selector: 'app-source-editor',
  templateUrl: './source-editor.component.html',
  styleUrls: ['./source-editor.component.css'],
})
export class SourceEditorComponent implements OnInit, OnDestroy {
  form: FormGroup;
  sourceSub: Subscription;
  routeSub: Subscription;

  selectedTodoListId: string;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  get source() {
    return this.form.get('source');
  }

  ngOnInit() {
    this.routeSub = this.activatedRoute.params.subscribe(routeParams => {
      this.selectedTodoListId = routeParams['id'];
      this.store.dispatch(new GetTodosSource(this.selectedTodoListId));
    });

    this.form = this.fb.group({
      source: this.fb.control('', [Validators.required]),
    });

    this.sourceSub = this.store
      .select((state: IAppState) => state.todosSource.source)
      .subscribe(x => this.source.setValue(x));
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.sourceSub.unsubscribe();
  }

  saveAndClose() {
    this.store.dispatch(
      new PutTodosSource(this.selectedTodoListId, this.source.value)
    );

    this.router.navigate(['/todo-lists/' + this.selectedTodoListId]);
  }
}
