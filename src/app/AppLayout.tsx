import { ThemeProvider } from './ThemeProvider';
import { AuthGate } from './AuthGate';
import { BottomNav } from '../components/BottomNav';
import { PageTransition } from '../components/PageTransition';
import { FixedLayerProvider } from '../components/ui/FixedLayer';
import { ModalProvider } from '../components/ui/ModalProvider';

export function AppLayout() {
  return (
    <ThemeProvider>
      <AuthGate>
        <ModalProvider>
          <FixedLayerProvider>
            <div className="flex min-h-full flex-col bg-black">
              <PageTransition />
              <BottomNav />
            </div>
          </FixedLayerProvider>
        </ModalProvider>
      </AuthGate>
    </ThemeProvider>
  );
}
