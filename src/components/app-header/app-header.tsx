import { AppHeaderUI } from '@ui';
import { useSelector } from '@/services/store';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const userName = useSelector((state) => state.user.data?.name);

  return <AppHeaderUI userName={userName} />;
};
