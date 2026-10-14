import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';
import { useSelector } from '@/services/store';
import { updateUser } from '@/slices/userSlice';
import { useDispatch } from '@/services/store';

export const Profile = (): React.JSX.Element => {
  /** TODO: Взять переменную из стора */
  const user = useSelector((state) => state.user.data);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    dispatch(
      updateUser({
        name: formValue.name,
        email: formValue.email,
        password: formValue.password,
      })
    );
  };

  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
