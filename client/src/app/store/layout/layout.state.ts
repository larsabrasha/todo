import { Action, State, StateContext } from '@ngxs/store';
import { HideHistory, ShowHistory, ToggleHistory } from './layout.actions';
import { defaults, LayoutStateModel } from './layout.model';

@State<LayoutStateModel>({
  name: 'layout',
  defaults,
})
export class LayoutState {
  @Action(ShowHistory)
  showHistory(context: StateContext<LayoutStateModel>) {
    context.patchState({
      showingHistory: true,
    });
  }

  @Action(HideHistory)
  hideHistory(context: StateContext<LayoutStateModel>) {
    context.patchState({
      showingHistory: false,
    });
  }

  @Action(ToggleHistory)
  toggleHistory(context: StateContext<LayoutStateModel>) {
    const state = context.getState();

    context.patchState({
      showingHistory: !state.showingHistory,
    });
  }
}
