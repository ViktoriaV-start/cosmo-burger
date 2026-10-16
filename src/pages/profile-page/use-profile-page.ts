import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '@hooks/redux.ts';
import { fetchLogoutUser } from '@services/user/actions.ts';

type UseProfilePageReturn = {
  onLogout: () => void;
};

export const useProfilePage = (): UseProfilePageReturn => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onLogout = (): void => {
    void dispatch(fetchLogoutUser()).then(() => navigate('/login', { replace: true }));
  };

  return {
    onLogout,
  };
};
