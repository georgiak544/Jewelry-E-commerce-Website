import { bag } from './bag.js';

export function updateBagQuantity() {
  let bagQuantity = 0;
  bag.forEach((bagItem) => {
    bagQuantity += bagItem.quantity;
  });
  document.querySelector('.js-bag-quantity').innerHTML = bagQuantity;
}
