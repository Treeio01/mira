import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { HomePage } from '../pages/HomePage';
import { CardsPage } from '../pages/CardsPage';
import { RefferPage } from '../pages/RefferPage';
import { CardPage } from '../pages/CardPage';
import { CardCreatePage } from '../pages/CardCreatePage';
import { CardConfirmPage } from '../pages/CardConfirmPage';
import { EsimPage } from '../pages/EsimPage';
import { EsimConfirmPage } from '../pages/EsimConfirmPage';
import { TopUpPage } from '../pages/TopUpPage';
import { CardTopUpPage } from '../pages/CardTopUpPage';
import { ROUTES } from '../lib/routes';

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.CARDS, element: <CardsPage /> },
      { path: ROUTES.CARDS_CREATE, element: <CardCreatePage /> },
      { path: `${ROUTES.CARDS_CREATE}/:type`, element: <CardConfirmPage /> },
      { path: `${ROUTES.CARDS}/:id`, element: <CardPage /> },
      { path: `${ROUTES.CARDS}/:id/top-up`, element: <CardTopUpPage /> },
      { path: ROUTES.ESIM, element: <EsimPage /> },
      { path: `${ROUTES.ESIM}/:type`, element: <EsimConfirmPage /> },
      { path: ROUTES.REFERRAL, element: <RefferPage /> },
      { path: ROUTES.TOP_UP, element: <TopUpPage /> },
    ],
  },
]);
