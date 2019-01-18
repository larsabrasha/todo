import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  styleUrls: ['./source-editor.component.scss'],
})
export class SourceEditorComponent implements OnInit {
  form: FormGroup;
  sourceSub: Subscription;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {}

  get source() {
    return this.form.get('source');
  }

  ngOnInit() {
    this.form = this.fb.group({
      source: this.fb.control('', [Validators.required]),
    });

    this.store.dispatch(new GetTodosSource());

    this.sourceSub = this.store
      .select((state: IAppState) => state.todosSource.source)
      .subscribe(x => this.source.setValue(x));
  }

  save() {
    this.store.dispatch(new PutTodosSource(this.source.value));

    this.router.navigate(['/todos']);
  }
}
