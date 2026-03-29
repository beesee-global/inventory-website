import { lazy } from 'react'; 
import { Navigate, createBrowserRouter } from 'react-router-dom';  
   
const NotFound = lazy(() => import('../pages/Error/404NotFound'));  

/* Homepage */
const HomePageLayout = lazy(() => import ("../../src/layout/HomePageLayout"))  
const Login = lazy(() => import('../pages/HomePagesPage/Login'));
const Register = lazy(() => import("../pages/HomePagesPage/Register"));
const ForgetPassword = lazy(() => import ("../pages/HomePagesPage/ForgetPasswordPages"));  

/* MainLayout */
const MainLayout = lazy(() => import("../../src/layout/MainLayout"));
import CategoryForm from '../pages/MainLayout/Categories/CategoryForm';
import Categories from '../pages/MainLayout/Categories/Categories';
import Products from '../pages/MainLayout/Products/Products';
import ProductsForm from '../pages/MainLayout/Products/ProductsForm';
import Supplier from '../pages/MainLayout/Suppliers/Supplier';
import SupplierForm from '../pages/MainLayout/Suppliers/SupplierForm';

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
    {
        path: '/main',
        element: <MainLayout />,
        layout: 'blank',
        children: [
            {
                index: true,
                element: <Navigate to="category" replace />,
            },
            {
                path: 'category',
                element: <Categories />
            },
            {
                path: 'category/form/:categoryId?',
                element: <CategoryForm />
            },
            {
                path: 'product',
                element: <Products />
            },
            {
                path: 'product/form/:productId?',
                element: <ProductsForm />
            },
            {
                path: 'supplier',
                element: <Supplier />
            },
            {
                path: 'supplier/form/:supplierId?',
                element: <SupplierForm />
            }
        ]
    },
    {
        path: '/beesee/ecommerce',
        element: <MainLayout />,
        layout: 'blank',
        children: [
            {
                path: 'category',
                element: <Categories />,
            },
            {
                path: 'category/form/:categoryId?',
                element: <CategoryForm />,
            },
            {
                path: 'product',
                element: <Products />,
            },
            {
                path: 'product/form/:productId?',
                element: <ProductsForm />,
            },
            {
                path: 'supplier',
                element: <Supplier />,
            },
            {
                path: 'supplier/form/:supplierId?',
                element: <SupplierForm />,
            },
        ],
    },
    /* Not found routes */
    {
        path: '*', // Catch-all route
        element: <Navigate to="/" replace />, // Redirect to root instead of a missing route
        layout: 'blank', 
    },  
];

export { routes };
