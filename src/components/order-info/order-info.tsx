import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '@/services/store';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const params = useParams();
  const orderData = useSelector((state) => state.feeds.orders);
  const order = orderData.find((item) => item.number === Number(params.number));
  const ingredients = useSelector((state) => state.ingredients.ingredients);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total,
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
