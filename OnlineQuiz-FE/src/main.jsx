import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer, Flip } from 'react-toastify';
import routes from './routes';

import 'react-toastify/dist/ReactToastify.css';
import './index.scss';
import { AppProvider } from './useContext/AppContext';

ReactDOM.createRoot(document.getElementById('root')).render(
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
);
