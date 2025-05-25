import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import routes from './routes';

import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import { AppProvider } from './useContext/AppContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 2e3,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 0,
      // onError: (e: any) => {
      //   console.log(e?.message);
      //   // toast.error(e?.message);
      // }
    },
    mutations: {
      onError: (e) => {
        console.log(e?.message);
        // toast.error(e?.message);
      },
    },
  },
});
ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <React.Fragment>
        <RouterProvider router={routes} />
        <ToastContainer
          position="top-center"
          transition={Flip}
          stacked={true}
          autoClose={3000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="colored"
        />
      </React.Fragment>
    </AppProvider>
  </QueryClientProvider>
);
