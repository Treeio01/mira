import { RouterProvider } from 'react-router-dom';
import { TelegramProvider } from './TelegramProvider';
import { router } from './router';

export function App() {
  return (
    <TelegramProvider>
      <RouterProvider router={router} />
    </TelegramProvider>
  );
}
