import { Navigate, useLocation, type Location } from 'react-router-dom';

import { useAppSelector } from '@hooks/redux.ts';
import { getIsAuthChecked, getIsAuthorized } from '@services/user/reducer.ts';

import type { ReactNode } from 'react';

type ProtectedRouteProps = {
  // true — маршрут доступен только неавторизованным (логин, регистрация и т.п.)
  onlyUnAuth?: boolean;
  component: ReactNode;
};

type LocationState = { from?: Location } | null;

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component,
}: ProtectedRouteProps) => {
  const isAuthChecked = useAppSelector(getIsAuthChecked);
  const isAuthorized = useAppSelector(getIsAuthorized);
  const location = useLocation();

  // Пока идёт первичная проверка — ничего не рендерим, чтобы не было «мерцания» и ложных редиректов
  if (!isAuthChecked) {
    return null;
  }

  if (onlyUnAuth && isAuthorized) {
    // Возвращаем пользователя туда, куда он пытался попасть до авторизации
    const from = (location.state as LocationState)?.from ?? { pathname: '/' };

    return <Navigate to={from} replace />;
  }

  if (!onlyUnAuth && !isAuthorized) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return component;
};
