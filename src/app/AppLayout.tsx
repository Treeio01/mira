import { ThemeProvider } from './ThemeProvider';
import { AuthGate } from './AuthGate';
import { BottomNav } from '../components/BottomNav';
import { PageTransition } from '../components/PageTransition';
import { FixedLayerProvider } from '../components/ui/FixedLayer';

export function AppLayout() {
  return (
    <ThemeProvider>
      <AuthGate>
        <FixedLayerProvider>
          <div className="flex min-h-full flex-col bg-black">
            <PageTransition />
            <BottomNav />
          </div>
        </FixedLayerProvider>
      </AuthGate>
    </ThemeProvider>
  );
}
