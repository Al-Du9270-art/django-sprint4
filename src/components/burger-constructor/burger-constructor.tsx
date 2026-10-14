import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useSelector } from '@/services/store';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@/services/store';
import { createOrder } from '@/slices/orderSlice';
import { closeOrder } from '@/slices/orderSlice';

import type { TConstructorIngredient } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  /** TODO: Взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector((state) => state.burgerConstructor);
  const orderRequest = useSelector((state) => state.burgerOrder.orderRequest);
  const orderModalData = useSelector((state) => state.burgerOrder.orderModalData);

  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const navigate = useNavigate();

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;
    // TODO: Оформить заказ
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ids = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
    ];

    console.log('ids =', ids);

    dispatch(createOrder(ids));
  };

  const closeOrderModal = (): void => {
    // TODO: Закрыть модальное окно и сбросить заказ
    dispatch(closeOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
