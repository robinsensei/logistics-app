import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Suspense } from 'react';
import AppRouter from './routes';
import { AuthProvider } from './context/AuthContext';

// Create router with future flags enabled
const router = createBrowserRouter([
  {
    path: "*",
    Component: AppRouter,
    // Add error boundary and loading state
    errorElement: <div>Error occurred! Please try again.</div>
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Suspense fallback={<div>Loading...</div>}>
          <RouterProvider router={router} />
        </Suspense>
      </div>
    </AuthProvider>
  );
}

export default App;
