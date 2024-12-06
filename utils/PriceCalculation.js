export function calculateProductsTotal(userCart) {
  for (let i = 0; i < userCart.length; i++) {
    // const heightWidth = userCart[i].size.name.split("x");
    // if (heightWidth.length === 2) userCart[i].product.price = (userCart[i].product.price * heightWidth[0] * heightWidth[1]).toFixed(2);
    // userCart[i].product.price = (userCart[i].product.price * userCart[i].size.squareMeters).toFixed(2);
    userCart[i].product.price = calculatePriceForProduct(userCart[i].product, userCart[i].size);
  }

  // Calculate the total price
  const totalPrice = userCart.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);

  return { products: userCart, total: totalPrice.toFixed(2) };
}

export function calculatePriceForProduct(product, size) {
  //   console.log("Product:", product);
  //   console.log("Size:", size);
  return (product.price * size.squareMeters).toFixed(2);
}
