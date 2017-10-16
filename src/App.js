import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import './App.css';

const TAX_RATE = 0.06;
const TAX_TEXT = '6% sales tax'
// prices are in cents
const PRODUCTS = [
  {
    name: 'apple',
    pluralName: 'apples',
    image: 'images/apple.png',
    priceText: '$0.25 each',
    price: (quantity) => {
      return quantity * 25;
    }
  },
  {
    name: 'banana',
    pluralName: 'bananas',
    image: 'images/banana.png',
    priceText: '$0.15 each',
    price: (quantity) => {
      return quantity * 15;
    }
  },
  {
    name: 'orange',
    pluralName: 'oranges',
    image: 'images/orange.png',
    priceText: '$0.30 each',
    price: (quantity) => {
      return quantity * 30;
    }
  },
  {
    name: 'papaya',
    pluralName: 'papayas',
    image: 'images/papaya.png',
    priceText: '$0.50 each',
    dealText: '3 for $1',
    price: (quantity) => {
      let odds = quantity % 3;
      return (((quantity - odds)/3) * 100) + (odds * 50);
    }
  },
];

function dollarsFromCents(n) {
  return '$' + parseFloat(n / 100).toFixed(2)
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: {
        'apple': 0,
        'banana': 0,
        'orange': 0,
        'papaya': 0,
      }
    };
    this.emptyCart = this.emptyCart.bind(this);
  }
  addFruit(productName) {
    return (e) => {
      e.preventDefault();
      this.setState( (prevState) => {
        prevState.cart[productName]++;
        return prevState;
      } );
    }
  }
  zeroFruit(productName) {
    return (e) => {
      e.preventDefault();
      this.setState( (prevState) => {
        prevState.cart[productName] = 0;
        return prevState;
      } );
    }
  }
  emptyCart(e) {
    e.preventDefault();
    this.setState( (prevState) => {
      prevState.cart = {
        'apple': 0,
        'banana': 0,
        'orange': 0,
        'papaya': 0,
      };
      return prevState;
    } );
  }
  cartChange(productName) {
    return (quantity) => {
      this.setState( (prevState) => {
        prevState.cart[productName] = quantity;
        return prevState;
      } );
    };
  }
  render() {
    let total = 0;
    let storeProducts = PRODUCTS.map( (p, i) => {
      let quantity = this.state.cart[p.name];
      let dealText = (p.dealText) ? (' or ' + p.dealText) : '';
      let productStyle = {
        backgroundImage: 'url(' + p.image + ')'
      };
      let quantityInfo = (quantity) ? (<div className="quantity-in-cart">{this.state.cart[p.name]} in cart</div>) : '';
      return (
        <div className="store-product" key={i}>
          <a className="fruit-link" style={productStyle} key={i} href={'#' + p.name} onClick={this.addFruit(p.name)}>
            {p.name}
          </a>
          <div className="store-product-actions">
            <button className="store-product-add" onClick={this.addFruit(p.name)}>add to cart</button>
            <div className="store-quantity-info">
              {quantityInfo}
            </div>
          </div>
          <div className="store-product-text">
            <h3 className="store-product-name">{p.name}</h3>
            <div className="store-price-info">
              <div className="store-price">{p.priceText}</div>
              <div className="store-deal">{dealText}</div>
            </div>
          </div>
        </div>
      );
    } );
    let cartProductRows = PRODUCTS
    .map( (p, i) => {
      let productStyle = {
        backgroundImage: 'url(' + p.image + ')'
      };
      let quantity = this.state.cart[p.name];
      if (!quantity) {
        return null;
      }
      let name = (quantity === 1) ? p.name : p.pluralName;
      let price = p.price(quantity);
      let priceText = (p.priceText) ? (<div>{p.priceText}</div>) : '';
      let dealText = (p.dealText) ? (<div>{' or ' + p.dealText}</div>) : '';
      total += price;
      return (
        <tr key={i}>
          <td>
            <a className="fruit-link" style={productStyle} key={i} href={'#' + p.name} onClick={this.addFruit(p.name)}>
              {p.name}
            </a>
          </td>
          <td>
            <strong>{name}</strong>
            <div className="cart-price-info">
              {priceText}
              {dealText}
            </div>
          </td>
          <td>
            <NumericInput min={0} value={quantity} onChange={this.cartChange(p.name)}/>
            &nbsp;
            <button onClick={this.zeroFruit(p.name)}>x</button>
          </td>
          <td className="currency">{ dollarsFromCents(price) }</td>
        </tr>
      );
    } );
    let cartClasses = 'cart';
    if (total) {
      cartClasses += ' cart-shown';
    } else {
      cartClasses += ' cart-hidden';
    }
    let tax = Math.ceil(total * TAX_RATE);
    return (
      <div className="App">
        <section className="store-products">
          {storeProducts}
        </section>
        <section className={cartClasses}>
          <table>
            <thead>
              <tr>
                <th colSpan="2">product</th>
                <th>quantity</th>
                <th>subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cartProductRows}
            </tbody>
            <tfoot>
              <tr key="subtotal">
                <td colSpan="2"></td>
                <td><strong>subtotal</strong></td>
                <td className="currency">{ dollarsFromCents(total) }</td>
              </tr>
              <tr key="tax">
                <td colSpan="2"></td>
                <td><strong>{TAX_TEXT}</strong></td>
                <td className="currency">{ dollarsFromCents(tax) }</td>
              </tr>
              <tr key="total">
                <td colSpan="2"></td>
                <td><strong>total</strong></td>
                <td className="currency">{ dollarsFromCents(total + tax) }</td>
              </tr>
              <tr className="cart-actions" key="cart-actions">
                <td colSpan="2"></td>
                <td>
                  <a className="cart-empty" href="#empty-cart" onClick={ this.emptyCart }>empty cart</a>
                </td>
                <td>
                  <button className="cart-pay">pay now</button>
                </td>
              </tr>
            </tfoot>
          </table>
        </section>
      </div>
    );
  }
}

export default App;
