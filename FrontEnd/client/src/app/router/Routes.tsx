import { Navigate, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import AboutPage from "../../features/about/AboutPage";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetail from "../../features/catalog/ProductDetail";
import Catalog from "../../features/catalog/Catalog";
import ServerError from "../errors/ServerError";
import NotFound from "../errors/NotFound";
import CartPage from "../../features/cart/CartPage";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import RequireAuth from "./RequireAuth";
import Orders from "../../features/orders/Orders";
import CheckoutWrapper from "../../features/checkout/CheckoutWrapper";

export const router = createBrowserRouter([{
    path: '/',
    element: <App />,
    children:[
        {element: <RequireAuth />, children: [
            {path: '/checkout', element: <CheckoutWrapper />},
            {path: '/orders', element: <Orders />},
        ]},
        {path: '', element: <HomePage />},
        {path: '/catalog', element: <Catalog/>},
        {path: '/catalog/:id', element: <ProductDetail/>},
        {path: '/about', element: <AboutPage />},
        {path: '/contact', element: <ContactPage />},
        {path: '/server-error', element: <ServerError />},
        {path: '/not-found', element: <NotFound />},
        {path: '/cart', element: <CartPage />},
        
        {path: '/login', element: <Login />},
        {path: '/register', element: <Register />},
        {path: '*', element: <Navigate replace to={'/not-found'} />}
    ]
}])