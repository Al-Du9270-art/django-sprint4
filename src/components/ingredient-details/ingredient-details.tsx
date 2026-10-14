import { Preloader, IngredientDetailsUI } from '@ui';
import { useParams } from 'react-router-dom';
import { useSelector } from '@/services/store';

export const IngredientDetails = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const params = useParams();
  const ingredientData = useSelector((state) => state.ingredients.ingredients);
  const ingredient = ingredientData.find((item) => item._id === params.id);

  if (!ingredient) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredient} />;
};
