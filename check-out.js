import{bag, removeFromBag, saveToStorage} from '/bag.js';
import{products} from '/products.js';
import { updateBagQuantity } from './utils.js';


let bagSummaryHTML = '';

function displayBagItems(products){
    bagSummaryHTML = '';

    bag.forEach((bagItem) => {

        const productId = bagItem.productId;
        let matchingProduct;
    
        products.forEach((product) => {
            if(product.id == productId){
                matchingProduct = product;
            }
        });
        if(matchingProduct){
            bagSummaryHTML += `
            <div class="shopping-bag-item js-bag-item-${matchingProduct.id}">
                <div class="img-container">
                    <img src="${matchingProduct.image[0]}">
                </div>
                <div class="item-info-container">
                    <div class="title-remove-container">
                        <div class="item-title"> ${matchingProduct.name}</div>
                        <div class = "js-delete-button" data-product-id="${matchingProduct.id}">
                            <button class="remove-button">x</button>
                        </div>
                    </div>
                    <div class="item-info">
                        <div class="qty-container">
                            <div class="quantity-label">
                                <label for="quantity">Quantity</label>
                            </div>
                            <div class="quantity-container">
                            <div><button class="qty-changer js-qty-up" data-product-id="${matchingProduct.id}">+</button></div>
                            <div style=" font-size:18px; font-weight: bold; margin-left:10px; margin-right:10px;">${bagItem.quantity}</div>
                            <div><button class="qty-changer js-qty-down" data-product-id="${matchingProduct.id}">-</button></div></div>
                        </div>
                        <div class="qty-container">
                            <div class = quantity-label>Price</div>
                            <div style="margin-top: 5px; font-size:18px; font-weight: bold;">
                                $${matchingProduct.price * Number(bagItem.quantity)}
                            </div>
                        </div>
                    </div>
                </div>
            </div> `;
        }
    });
    document.querySelector('.js-order-summary').innerHTML = bagSummaryHTML;
    addEventListenersToButtons();   
}
saveToStorage();
displayBagItems(products);
updateTotal();
updateBagQuantity();


function addEventListenersToButtons() {
    // Update quantity(+) and make the essential changes
    document.querySelectorAll('.js-qty-up').forEach((button) => { 
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            bag.forEach((bagItem) => {
                if (bagItem.productId == productId) {
                    bagItem.quantity += 1;  
                }
            });
            saveToStorage();
            displayBagItems(products);
            updateTotal();
            updateBagQuantity();
        });
    });

    // Update quantity(+) and make the essential changes
    document.querySelectorAll('.js-qty-down').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            bag.forEach((bagItem) => {
                if (bagItem.productId == productId && bagItem.quantity > 1) {
                    bagItem.quantity -= 1;  
                }
            });
            saveToStorage();
            displayBagItems(products);
            updateTotal();
            updateBagQuantity();
        });
    });

    // Delete the Item from the Bag
    document.querySelectorAll('.js-delete-button').forEach((button) => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;

            removeFromBag(productId);

            const container = document.querySelector(`.js-bag-item-${productId}`);
            container.remove();

            updateTotal();
            updateBagQuantity();
        });
    });
}
// Update the prices in the order
function updateTotal(){
    let subtotal = 0;
    let shipping = 20;

    bag.forEach((bagItem) => {
        const productId = bagItem.productId;

        products.forEach((product) => {
            if(product.id == productId){
                subtotal += product.price * Number(bagItem.quantity);
            }
        });
    });
    if(subtotal  >= 129){
        shipping = 0;
    }
    document.querySelector('.js-subtotal').innerHTML = `$${subtotal}`;
    document.querySelector('.js-shipping').innerHTML = `$${shipping}`;
    document.querySelector('.js-total').innerHTML = `$${shipping + subtotal}`
}




    