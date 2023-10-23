import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Contact, contactLoader, destroyAction, EditContact, favoriteAction, Index, Root} from "./routes";
import {ErrorPage} from "./ErrorPage.tsx";
import {loader, submitAction} from "./routes/Root.tsx";
import {editAction} from "./routes/Edit.tsx";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Root/>,
        errorElement: <ErrorPage/>,
        loader: loader,
        action: submitAction,
        children: [
            {
                errorElement: <ErrorPage/>,
                children: [
                    {
                        element: <Index/>,
                        index: true,
                    },
                    {
                        path: 'contacts/:contactId',
                        element: <Contact/>,
                        loader: contactLoader,
                        action: favoriteAction,
                    },
                    {
                        path: 'contacts/:contactId/edit',
                        element: <EditContact/>,
                        loader: contactLoader,
                        action: editAction,
                    },
                    {
                        path: 'contacts/:contactId/destroy',
                        action: destroyAction,
                        errorElement: <div>Oops! There was an error.</div>
                    },
                ]
            }
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>,
)
