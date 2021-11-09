
const formatMoney = (amount) => {
  const money = Number(amount);

  if (typeof money != 'number') {
    throw new Error('value is not a number');
  }

  if (money < 0) return `($${money.toFixed(2).toLocaleString('en-US')})`;

  return `$${money.toFixed(2).toLocaleString('en-US')}`;
}

export {
  formatMoney
}