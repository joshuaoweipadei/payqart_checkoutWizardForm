// To calculate the total price value of items in the cart
export const cartValue = (products) => {
  return products.map(product => (product.price * product.qty)).reduce((prev, curr) => prev + curr, 0);
}

// To calculate the minimum down payment
export const downPayment = (products) => {
  let value = products.map(product => (product.price * product.qty)).reduce((prev, curr) => prev + curr, 0);
  value = (30 * value) / 100;

  return value;
}

// To calculate the interest payable
export const interestPayable = (shoppingCredit) => {
  return (shoppingCredit * 4) / 100;
}

// To calculate the monthly installment payable
export const monthlyInstallment = (products, monthLength, downPayment) => {
  let cartValue = products.map(product => (product.price * product.qty)).reduce((prev, curr) => prev + curr, 0);
  // let downPayment = ((30 * cartValue) / 100);

  let shoppingCredit = cartValue - downPayment;

  let interestPayable = (shoppingCredit * 4) / 100;

  let totalInterestPayable = monthLength * interestPayable;

  return (shoppingCredit + totalInterestPayable) / monthLength;
}