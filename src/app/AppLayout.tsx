import { ThemeProvider } from './ThemeProvider';
import { BottomNav } from '../components/BottomNav';
import { PageTransition } from '../components/PageTransition';
import { FixedLayerProvider } from '../components/ui/FixedLayer';

export function AppLayout() {
  return (
    <ThemeProvider>
      <FixedLayerProvider>
        <div className="flex min-h-full flex-col bg-black">
          <PageTransition />
          <BottomNav />
        </div>
      </FixedLayerProvider>
    </ThemeProvider>
  );
}
