import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '@/services/store';
import { loginUser } from '@/slices/userSlice';
import { Navigate } from 'react-router-dom';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const errorText = useSelector((state) => state.user.loginUserError?.message ?? '');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
