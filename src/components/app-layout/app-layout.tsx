import { Outlet } from 'react-router-dom';

import { AppHeader } from '@components/app-header';

import styles from './app-layout.module.css';

export const AppLayout = () => {
  return (
    <div className={styles.app}>
      <AppHeader />
      <Outlet />
    </div>
  );
};
