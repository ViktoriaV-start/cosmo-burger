import { useEffect } from 'react';

import { useAppDispatch } from '@hooks/redux.ts';
import { checkUserAuth } from '@services/user/actions.ts';

import { AppRoutes } from './router';

export const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return <AppRoutes />;
};

export default App;
