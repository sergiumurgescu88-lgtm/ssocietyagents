import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
            <AlertTriangle className="h-7 w-7 text-destructive" />
          </div>
          <h2 className="text-lg font-semibold mb-2">Ceva nu a mers bine</h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {this.state.error?.message || "A apărut o eroare neașteptată."}
          </p>
          <Button onClick={this.handleRetry} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Încearcă din nou
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
