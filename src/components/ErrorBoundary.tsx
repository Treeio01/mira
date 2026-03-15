import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4 p-4">
          <span className="text-white/80 font-semibold text-lg">Что-то пошло не так</span>
          <span className="text-white/50 text-sm text-center">
            Произошла непредвиденная ошибка. Попробуйте перезагрузить приложение.
          </span>
          <button
            onClick={this.handleReset}
            className="px-6 py-3 bg-[#661AFF] rounded-lg text-white font-medium text-sm active:scale-[0.97] transition-transform"
          >
            Попробовать снова
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
