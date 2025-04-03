
import { products } from '/products.js';
import { bag, saveToStorage} from '/bag.js';
import { updateBagQuantity } from './utils.js';



const params = new URLSearchParams(window.location.search);
const productId = params.get("product-id");
let selectedProduct;
let quantity = 0;

selectedProduct = products.find(product => product.id === productId);

bag.forEach(bagItem => {
  if(bagItem.productId === productId){
    quantity = bagItem.quantity;
  }
});

displayProduct(selectedProduct);
updateBagQuantity();

function displayProduct(product) {
  let productsHTML = '';

    productsHTML += `
      <div class="img-container">
      <div><button id="leftArrow" class="next-img">&lt;</button></div>
        <div><img id="productImage" class="slider-img" src="${product.image[0]}" data-index="0" data-images='${JSON.stringify(product.image)}'></div>
        <div><button id="rightArrow" class="next-img">&gt;</button></div>
      </div>
            <div class="product-info">
                <div class="product-title">
                <div>${product.name}</div> 
                <div><img class="heart-cont js-add-heart" src="icons/heart.png"></div>
                </div>
                <div>id: ${product.id}</div>
                <div class="product-price">$${product.price}</div>
                <div style="display: flex; flex-direction: row; 
                justify-content: space-between; align-items: center;">
                    <div class="q-container">
                        <div class="qty-label"><label for="quantity">Quantity:</label></div>
    
                        <button class="qty-change js-qty-up">+</button>
                        <div style=" font-size:25px; margin-left:10px; margin-right:10px;">${quantity}</div>
                        <button class="qty-change js-qty-down">-</button>
                    </div>
                    <div>
                        <button class="button-price js-add-bag">Add to Bag</button>
                    </div>
                </div>
            </div>`;

  document.querySelector('.js-show').innerHTML = productsHTML;
  addEventListenersToButtons();
  addImageSwitchListeners();

}
function addEventListenersToButtons(){
  document.querySelectorAll('.js-qty-up').forEach((button) => { 
    button.addEventListener('click', () => {
      quantity += 1;  
      displayProduct(selectedProduct);
    });
  });

  document.querySelectorAll('.js-qty-down').forEach((button) => {
    button.addEventListener('click', () => {
      if(quantity > 0){
        quantity -= 1;  
      }
      displayProduct(selectedProduct);
    });
  });

  document.querySelectorAll('.js-add-bag').forEach((button) => {
    button.addEventListener('click', () => {
      let matchingItem;
      bag.forEach(bagItem =>{

        if(bagItem.productId == productId){
          matchingItem = bagItem;
        }
      });
      if(quantity == 0){
        quantity = 1;
      }
      if(matchingItem){
              matchingItem.quantity = quantity;
          }else{
              bag.push({
                  productId: productId,
                  quantity: quantity
              });
          }
          displayProduct(selectedProduct);
          saveToStorage();
          updateBagQuantity();
    });
  });

}

function addImageSwitchListeners() {
  const img = document.getElementById("productImage");
  const leftArrow = document.getElementById("leftArrow");
  const rightArrow = document.getElementById("rightArrow");

  if (!img || !leftArrow || !rightArrow) return;

  const images = JSON.parse(img.dataset.images);
  let index = parseInt(img.dataset.index);

  leftArrow.addEventListener("click", () => {
    index = (index - 1 + images.length) % images.length;
    img.src = images[index];
    img.dataset.index = index;
  });

  rightArrow.addEventListener("click", () => {
    index = (index + 1) % images.length;
    img.src = images[index];
    img.dataset.index = index;
  });
}



