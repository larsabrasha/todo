import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { IAppState } from '../store/app.state';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @Select((state: IAppState) => state.userContext.isAuthenticated)
  isAuthenticated$: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit() {}
}
