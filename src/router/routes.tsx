import { lazy } from 'react'; 
import { Navigate, createBrowserRouter } from 'react-router-dom';  
   
const NotFound = lazy(() => import('../pages/Error/404NotFound'));  

/* Homepage */
const HomePageLayout = lazy(() => import ("../../src/layout/HomePageLayout"))  
const Login = lazy(() => import('../pages/HomePagesPage/Login'));
const Register = lazy(() => import("../pages/HomePagesPage/Register"));
const ForgetPassword = lazy(() => import ("../pages/HomePagesPage/ForgetPasswordPages"));  
   
const routes = [
    {
        path: '/',
        element: <HomePageLayout />,
        layout: 'blank',
        children: [
            {
                index:true,     
                element:<Navigate to="sign-in" replace />,
            }, 
            {
                path: "sign-in",
                element: <Login />
            }, 
            {
                path: "sign-up/2046",
                element: <Register />
            }, 
            {
                path:  "forget-password",
                element: <ForgetPassword />
            }
        ]
    }, 
    /* Not found routes */ 
    {
        path: '*', // Catch-all route
        element: <Navigate to="/home" replace />, // CHANGED: Redirect to home instead of 404
        layout: 'blank', 
    },  
];

export { routes };
