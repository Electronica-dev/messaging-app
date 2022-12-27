import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Chat from './chat/Chat';
import { Chatclass } from './chat/Chatclass';
import Customer from './chat/components/customer/Customer';
import CustomerChannel from './chat/components/customer/CustomerChannel';
import Chatgptfunc from './chat/Chatgptfunc';
import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Chatclass />
  },
  {
    path: "/customer",
    element: <Customer />
  },
  {
    path: "/customer/:cid",
    element: <CustomerChannel />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
