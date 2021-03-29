import React from 'react'
import { StateMachineProvider, createStore } from 'little-state-machine'
import NumberFormat from 'react-number-format';

import NairaSign from '../NairaSign'

import img_payqart from '../../images/ps5-3.jpg'
import Product from '../Product'
import CheckoutForm from './CheckoutForm'

import { products } from '../Product/data'
import { cartValue } from '../../helpers'

const Checkout = () => {

  // create your store
  createStore({
    data: {}
  });

  return (
    <div className="checkout">
      <div className="checkout-container">

        <div className="payqart-section">
          <div className="payqart-background-container">
            <img src={img_payqart} alt="img_payqart"/>
          </div>
          <div className="payqart-content">
            <a href="#back-to-store" className="back-link"><i className="fa fa-arrow-left" />Back To Store</a>
            <div className="title">
              <h1>PayQart</h1>
              <small>You shop, we pay</small>
            </div>
            <ul>
              <li>Get pre-approved instantly.</li>
              <li>Spread payment for up to six months.</li>
              <li>Provide some basic information to get started.</li>
            </ul>
          </div>
        </div>

        <div className="orders-section">
          <div className="order-content">
            <h4 className="order-content-header">Order Summary</h4>
            <div className="ordered-product">
              {products.map(product => 
                <Product key={product.id} product={product} />
              )}
            </div>
            <div className="total-price">
              <h4>Total Cart Value:</h4>
              <div className="amount">
                <NairaSign />
                <NumberFormat
                  value={cartValue(products)}
                  displayType="text"
                  thousandSeparator
                  decimalScale={2}
                  isNumericString
                />
              </div>
            </div>
          </div>
        </div>

        <div className="checkout-section">
          <div className="checkout-section-wrapper">
            <StateMachineProvider>
              <CheckoutForm />
            </StateMachineProvider>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Checkout
