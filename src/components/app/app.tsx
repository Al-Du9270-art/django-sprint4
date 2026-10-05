import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
// import { AppHeader } from '../app-header';
import {
  ConstructorPage,
  Register,
  Feed,
  Login,
  ForgotPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  ResetPassword,
} from '@pages';

import { Preloader } from '@ui';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from '@/services/store';
import { useEffect } from 'react';
import { getIngredient } from '@/slices/ingredientsSlice';
import { getUser } from '@/slices/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';
import type { AppContentProps } from './type';
import { useNavigate } from 'react-router-dom';
//import type { TIngredient } from '@utils-types';

import '../../index.css';

import styles from './app.module.css';

const App = (): React.JSX.Element => {
  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const isIngredientsLoading = useSelector((state) => state.ingredients.isLoading);
  const ingredientsError = useSelector((state) => state.ingredients.errorMessage);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getIngredient());
    dispatch(getUser());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  //ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  // if (!ingredients.length) {
  //   return (
  //     <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
  //   );
  // }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const navigate = useNavigate();
  return (
    <>
      <Routes>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />}>
          <Route
            path=":number"
            element={
              <Modal title="Детали заказа" onClose={() => navigate('/feed')}>
                <OrderInfo />
              </Modal>
            }
          />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/orders"
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingredients/:id"
          element={
            <Modal title="Детали ингредиента" onClose={() => navigate('/')}>
              <IngredientDetails />
            </Modal>
          }
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>
    </>
  );
};
