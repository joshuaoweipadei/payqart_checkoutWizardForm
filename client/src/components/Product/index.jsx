import React from 'react'
import NumberFormat from 'react-number-format';

import NairaSign from '../NairaSign'

const Product = ({ product }) => {
  return (
    <>
      <div className="product">
        <div className="product-container">
          <div className="product-img-container">
            <img src={product.img} alt={product.name+'-'+product.id} />
          </div>
          <div className="product-info">
            <div className="name">{product.name}</div>
            <div className="price">
              <NairaSign />
              <NumberFormat
                value={product.price}
                displayType="text"
                thousandSeparator
                decimalScale={2}
              />
            </div>
            <div className="quantity">Qty: {product.qty}</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Product
