import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';
import { useDispatch } from '@/services/store';
import { logoutUser } from '@/slices/userSlice';

export const ProfileMenu = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = (): void => {
    // TODO: Разлогинить пользователя
    dispatch(logoutUser());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
