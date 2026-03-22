import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { ROUTES } from '../lib/routes';
import { RouteErrorBoundary } from '../components/RouteErrorBoundary';

const HomePage = lazy(() => import('../pages/HomePage'));
const CardsPage = lazy(() => import('../pages/CardsPage'));
const CardPage = lazy(() => import('../pages/CardPage'));
const CardCreatePage = lazy(() => import('../pages/CardCreatePage'));
const CardConfirmPage = lazy(() => import('../pages/CardConfirmPage'));
const CardTopUpPage = lazy(() => import('../pages/CardTopUpPage'));
const EsimPage = lazy(() => import('../pages/EsimPage'));
const EsimConfirmPage = lazy(() => import('../pages/EsimConfirmPage'));
const ReferralPage = lazy(() => import('../pages/ReferralPage'));
const TopUpPage = lazy(() => import('../pages/TopUpPage'));
const TransactionsPage = lazy(() => import('../pages/TransactionsPage'));

function page(Component: React.LazyExoticComponent<() => React.JSX.Element>) {
  return (
    <Suspense fallback={null}>
      <Component />
    </Suspense>
  );
}

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: ROUTES.HOME, element: page(HomePage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.CARDS, element: page(CardsPage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.CARDS_CREATE, element: page(CardCreatePage), errorElement: <RouteErrorBoundary /> },
      { path: `${ROUTES.CARDS_CREATE}/:type`, element: page(CardConfirmPage), errorElement: <RouteErrorBoundary /> },
      { path: `${ROUTES.CARDS}/:id`, element: page(CardPage), errorElement: <RouteErrorBoundary /> },
      { path: `${ROUTES.CARDS}/:id/top-up`, element: page(CardTopUpPage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.ESIM, element: page(EsimPage), errorElement: <RouteErrorBoundary /> },
      { path: `${ROUTES.ESIM}/:type`, element: page(EsimConfirmPage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.REFERRAL, element: page(ReferralPage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.TOP_UP, element: page(TopUpPage), errorElement: <RouteErrorBoundary /> },
      { path: ROUTES.TRANSACTIONS, element: page(TransactionsPage), errorElement: <RouteErrorBoundary /> },
    ],
  },
]);
