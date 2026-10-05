import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '@/services/store';
import { getFeeds } from '@/slices/feedSlice';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const orders = useSelector((state) => state.feeds.orders);
  const dispatch = useDispatch();
  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    dispatch(getFeeds());
  };

  useEffect(() => {
    handleGetFeeds();
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
