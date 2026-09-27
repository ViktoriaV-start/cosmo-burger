import { FeedPage } from '@/pages/feed-page';
import { ForgotPasswordPage } from '@/pages/forgot-password-page';
import { HomePage } from '@/pages/home-page';
import { IngredientPage } from '@/pages/ingredient-page';
import { LoginPage } from '@/pages/login-page';
import { NotFoundPage } from '@/pages/not-found-page';
import { ProfileOrderPage } from '@/pages/profile-order-page';
import { ProfilePage } from '@/pages/profile-page';
import { RegisterPage } from '@/pages/register-page';
import { ResetPasswordPage } from '@/pages/reset-password-page';

import { AppLayout } from '@components/app-layout';
import { ProfileForm } from '@components/profile-form';

export const routes = [
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        children: [
          {
            path: 'ingredients/:id',
            element: <IngredientPage />,
          },
        ],
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
        children: [
          {
            index: true,
            element: <ProfileForm />,
          },
          {
            path: 'orders',
            element: <ProfileOrderPage />,
          },
        ],
      },
      {
        path: '/feed',
        element: <FeedPage />,
      },
      {
        path: '/404',
        element: <NotFoundPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
];
