import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from '../pages/HomePage';
import { CardsPage } from '../pages/CardsPage';
import { RefferPage } from '../pages/RefferPage';
import { CardPage } from '../pages/CardPage';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: '/cards', element: <CardsPage /> },
      { path: '/cards/:id', element: <CardPage /> },
      { path: '/reffer', element: <RefferPage /> },
    ],
  },
]);
