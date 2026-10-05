import { useSelector } from '@/services/store';
import { Preloader } from '../ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  children: React.JSX.Element;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthChecked = useSelector((state) => state.user.isAuthChecked);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  if (!isAuthChecked) {
    // пока идёт чекаут пользователя, показываем прелоадер
    return <Preloader />;
  }

  if (!isAuthenticated) {
    // если пользователя в хранилище нет, то делаем редирект
    return <Navigate replace to="/login" />;
  }

  return children;
};
