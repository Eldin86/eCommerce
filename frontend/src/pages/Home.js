import React, { useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
//useSelector da odaberemo dijelove state-a, useDispatch da koristimo dispatch prilikom poziva action-a
//React-redux koristimo da konektujemo react sa reduxom
//useDispatch to call action
//useSelector so we can select products from state
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../components/ProductItem'
//action which we want to trigger
import { listProducts } from '../actions/productActions'
import Message from '../components/Message'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'
import Meta from '../components/Meta'

const Home = ({match}) => {
    const keyword = match.params.keyword

    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch() 
    //Store result into productList variable accessing redux state
    const productList = useSelector(state => state.productList)
    //extract data from state
    const { loading, error, products, page, pages } = productList

    useEffect(() => {
        //Initiate listProduct handler with actions
        dispatch(listProducts(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <>
        <Meta />
        {
            !keyword ? <ProductCarousel /> : <Link to="/" className="btn btn-light">Go Back</Link>
        }
            <h1>Latest Products</h1>
            {
                loading ? <Loader>Loading...</Loader> : error ? <Message variant="danger">{error}</Message> : <><Row>
                    {
                        products.map(product => {
                            return (
                                <Col key={product._id} cm={12} md={6} lg={4} xl={3}>
                                    <ProductItem product={product} />
                                </Col>
                            )
                        })
                    }
                </Row>
                <Paginate pages={pages} page={page} keyword={keyword ? keyword : ''}/>
                </>
            }
        </>
    )
}

export default Home
