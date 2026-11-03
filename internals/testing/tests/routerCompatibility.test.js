import { Map } from 'immutable';
import { createMemoryHistory } from 'history';
import { LOCATION_CHANGE, connectRouter } from 'connected-react-router';
import { connectRouter as connectImmutableRouter } from 'connected-react-router/immutable';

describe('router compatibility', () => {
  const history = createMemoryHistory({ initialEntries: ['/'] });
  const location = { ...history.location, pathname: '/features' };
  const action = {
    type: LOCATION_CHANGE,
    payload: { location, action: 'PUSH' },
  };

  it('preserves plain Redux router state on navigation', () => {
    const reducer = connectRouter(history);
    const initialState = reducer(undefined, {});
    const nextState = reducer(initialState, action);

    expect(nextState.location.pathname).toBe('/features');
    expect(initialState.location.pathname).toBe('/');
    expect(nextState.action).toBe('PUSH');
  });

  it('preserves Immutable router state and the previous location', () => {
    const reducer = connectImmutableRouter(history);
    const initialState = reducer(undefined, {});
    const nextState = reducer(initialState, action);

    expect(Map.isMap(nextState)).toBe(true);
    expect(nextState.getIn(['location', 'pathname'])).toBe('/features');
    expect(initialState.getIn(['location', 'pathname'])).toBe('/');
    expect(nextState.get('action')).toBe('PUSH');
  });
});
