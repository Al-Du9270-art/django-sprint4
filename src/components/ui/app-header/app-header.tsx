import {
  BurgerIcon,
  ListIcon,
  ProfileIcon,
  Logo,
} from '@krgaa/react-developer-burger-ui-components';

import { NavLink } from 'react-router-dom';

import type { TAppHeaderUIProps } from './type';

import styles from './app-header.module.css';

export const AppHeaderUI = ({ userName }: TAppHeaderUIProps): React.JSX.Element => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <NavLink to="/" className={styles.link} end>
          {({ isActive }) => (
            <>
              <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 mr-10 ${
                  isActive ? styles.link_active : ''
                }`}
              >
                Конструктор
              </p>
            </>
          )}
        </NavLink>
        <NavLink to="/feed" className={styles.link} end>
          {({ isActive }) => (
            <>
              <ListIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
              >
                Лента заказов
              </p>
            </>
          )}
        </NavLink>
      </div>
      <div className={styles.logo}>
        <Logo className="" />
      </div>
      <div className={styles.link_position_last}>
        <NavLink to="/profile" className={styles.link}>
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p
                className={`text text_type_main-default ml-2 ${isActive ? styles.link_active : ''}`}
              >
                {userName ?? 'Личный кабинет'}
              </p>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  </header>
);
