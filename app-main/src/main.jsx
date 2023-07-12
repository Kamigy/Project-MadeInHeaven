import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Profile from './pages/profile'
import Apimport from './pages/apimport'
import Albumdetail from './pages/albumdetail'
import Filmport from './pages/filmport'
import Filmdetail from './pages/filmdetail'
import 'uno.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './components/home'
import Post from './pages/post'
import Admin from './pages/admin'
import Event from './pages/event'
import Mention from './pages/mention'
import Politique from './pages/politique'

import User from './pages/user'
import Users from './pages/users'
import DetailEvent from './pages/DetailEvent'



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home/>,
      },

      {
        path: "page1",
        element: <div> Page1 </div>,
      },

      {
        path: "page2",
        element: <div> Page2 </div>,
      },

      {
        path: "profile",
        element: <Profile/>,
      },

      {
      path: "post/:postID",
      element: <Post/>,
      },
      {
        path: "apimport",
        element: <Apimport/>,
      },
      {
        path : "filmport",
        element: <Filmport/>,
      },
      {
        path : "filmdetail/:id",
        element: <Filmdetail/>,
      },
      
      {
        path: "admin",
        element: <Admin/>,
      },
   
    

      {
        path: "event",
        element: <Event/>,
      },
      {
        path: "DetailEvent/:id",
        element: <DetailEvent/>,
      },
      {
        path: "/albumdetail/:id",
        element: <Albumdetail />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/user/:id",
        element: <User />,
      },
      {
         path: "mention",
         element: <Mention/>,
       },
       {
         path: "politique",
         element: <Politique/>,
       }
      

      // {
      //   path: "login",
      //   element: <Login/>,
      // }


    ]
  },
  {
    // path: "/login",
    // element: < Login />,

    //page with no header

  }

 
  

]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router = {router} />
  </React.StrictMode>,
)
