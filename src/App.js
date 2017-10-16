import React, { Component } from 'react';
import NumericInput from 'react-numeric-input';
import './App.css';

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
    priceText: '$0.50 each or 3 for $1',
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
        'apple': 5,
        'banana': 8,
        'orange': 3,
        'papaya': 4,
      }
    };
  }
  addFruit(productName) {
    this.setState( (prevState) => {
      prevState.cart[productName]++;
      return prevState;
    } );
  }
  zeroFruit(productName) {
    this.setState( (prevState) => {
      prevState.cart[productName] = 0;
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
    let productNames = PRODUCTS.map( (p, i) => {
      return (<li key={i}>{this.state.cart[p.name]} {p.pluralName}</li>);
    } );
    let productImages = PRODUCTS.map( (p, i) => {
      return (
        <a key={i} href={'#' + p.name} onClick={() => this.addFruit(p.name)}>
          <img className="fruit" src={p.image} alt={p.name} />
        </a>
      );
    } );
    let productRows = PRODUCTS.map( (p, i) => {
      let quantity = this.state.cart[p.name];
      let name = (quantity === 1) ? p.name : p.pluralName;
      let price = p.price(quantity);
      total += price;
      return (
        <tr key={i}>
          <td>
            {name}&nbsp;
            <button onClick={() => this.zeroFruit(p.name)}>x</button>
          </td>
          <td><NumericInput min={0} value={quantity} onChange={this.cartChange(p.name)}/></td>
          <td>{p.priceText}</td>
          <td className="currency">{ dollarsFromCents(price) }</td>
        </tr>
      );
    } );
    return (
      <div className="App">
        <section>
          <ul>
            {productNames}
          </ul>
        </section>
        <section>
          {productImages}
        </section>
        <section>
          <table>
            <thead>
              <tr>
                <th>product</th>
                <th>quantity</th>
                <th>price</th>
                <th>subtotal</th>
              </tr>
            </thead>
            <tbody>
              {productRows}
            </tbody>
            <tfoot>
              <tr key="total">
                <td colSpan="2"></td>
                <td><strong>total</strong></td>
                <td className="currency">{ dollarsFromCents(total) }</td>
              </tr>
            </tfoot>
          </table>
        </section>
        <section>
          <h1>Ideas</h1>
          <ul>
            <li>clickable images + regular side shopping cart</li>
            <li>cart as simple table with click-to-buy total</li>
            <li>random fruit option</li>
            <li>fruit roll up option; slot machine style buy</li>
            <li>no drag and drop from inventory into cart
              <br />because we want buying fruit to be easy, impulsive, fun.</li>
            <li>admin view for price and deal manipulation?
              <br />Not this time, because we're focusing on customer experience.</li>
            <li>animation? Yes! Fun!</li>
            <li>different product categories that get shown in balance chart
              <br />(ex: pie chart of veggies vs. fruits vs. meat vs. other)</li>
            <li>implement sales tax</li>
          </ul>
        </section>
      </div>
    );
  }
}

export default App;
