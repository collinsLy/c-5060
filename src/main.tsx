
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Create a basic error boundary component
const ErrorFallback = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center">
      <h1 className="text-2xl font-bold text-primary mb-4">Something went wrong</h1>
      <p className="text-muted-foreground mb-6">
        The application encountered an error. Please refresh the page or try again later.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
      >
        Refresh Page
      </button>
    </div>
  );
};

// Wrap the app in a try-catch to prevent white screen errors
try {
  createRoot(document.getElementById("root")!).render(<App />);
} catch (error) {
  console.error("Failed to render application:", error);
  createRoot(document.getElementById("root")!).render(<ErrorFallback />);
}
