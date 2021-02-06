import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'

import { Container } from 'react-bootstrap'

import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Shipping from './pages/Shipping'
import Payment from './pages/Payment'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import UserList from './pages/UserList'
import UserEdit from './pages/UserEdit'
import ProductList from './pages/ProductList'
import ProductEdit from './pages/ProductEdit'
import OrderList from './pages/OrderList'



const App = () => {
  return (
    <Router>
        <Header />
        <main className="py-3">
          <Container>
            <Route path="/order/:id" component={Order}/>
            <Route path="/login" component={Login}/>
            <Route path="/shipping" component={Shipping}/>
            <Route path="/payment" component={Payment}/>
            <Route path="/placeorder" component={PlaceOrder}/>
            <Route path="/register" component={Register}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/product/:id" component={Product}/>
            {/* Id je opcionalan zato smo stavili ? iza */}
            <Route path="/cart/:id?" component={Cart}/>
            <Route path="/admin/userlist" component={UserList}/>
            <Route path="/admin/productlist" component={ProductList} exact/>
            <Route path="/admin/productlist/:pageNumber" component={ProductList} exact/>
            <Route path="/admin/orderlist" component={OrderList}/>
            <Route path="/admin/user/:id/edit" component={UserEdit}/>
            <Route path="/admin/product/:id/edit" component={ProductEdit}/>
            <Route path="/search/:keyword" component={Home} exact/>
            <Route path="/page/:pageNumber" component={Home}/>
            <Route path="/search/:keyword/page/:pageNumber" component={Home}/>
            <Route path="/" exact component={Home}/>
          </Container>
        </main>
        <Footer />
    </Router>
  );
}

export default App;
