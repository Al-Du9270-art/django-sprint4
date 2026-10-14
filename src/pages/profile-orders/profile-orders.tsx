import { useSelector, useDispatch } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { getProfileOrders } from '@/slices/profileOrdersSlice';
import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

export const ProfileOrders = (): React.JSX.Element => {
  /** TODO: взять переменную из стора */
  const orders = useSelector((state) => state.profileOrders.orders);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getProfileOrders());
  }, []);

  return (
    <>
      <ProfileOrdersUI orders={orders} />
      <Outlet />
    </>
  );
};
