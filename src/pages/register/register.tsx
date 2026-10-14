import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '@/services/store';
import { registerUser } from '@/slices/userSlice';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const errorText = useSelector((state) => state.user.loginUserError?.message ?? '');

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(registerUser({ email, password, name: userName }));
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
