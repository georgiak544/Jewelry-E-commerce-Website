import { bag, addToBag } from '/bag.js';
import { products } from '/products.js';
import { updateBagQuantity } from './utils.js';


// Filters at the begging
let selectedCategory = 'all';
let selectedColor = 'all';
let selectedMaxPrice = 200;  
let selectedSortOption = 'price-low-high'; 

// Set listeners when the page will be opened 
window.addEventListener('DOMContentLoaded', () => {
  updateBagQuantity();

  const urlParams = new URLSearchParams(window.location.search);
  selectedCategory = urlParams.get('category') || 'all';

  // Categories
  const categoryButtons = document.querySelectorAll('.category');
  categoryButtons.forEach((button) => {
    button.addEventListener('click', function () {
      selectedCategory = button.getAttribute('data-category');
      applyAllFilters();
    });
  });

  // Colors
  const colorButtons = document.querySelectorAll('.color-button');
  colorButtons.forEach((button) => {
    button.addEventListener('click', function () {
      selectedColor = button.getAttribute('data-color');
      applyAllFilters();
    });
  });

  // Slider for the price
  const slider = document.getElementById('js-slider-price');
  const priceValue = document.getElementById('js-price-value');
  slider.oninput = function () {
    selectedMaxPrice = Number(slider.value);
    priceValue.textContent = slider.value + '$';
    applyAllFilters();
  };

  // Sort
  const sortDropdown = document.getElementById('sort-options');
  sortDropdown.addEventListener('change', function () {
    selectedSortOption = this.value;
    applyAllFilters();
  });

  applyAllFilters();
});


function applyAllFilters() {
  // Always filter all the products
  let filtered = [...products];

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(product => product.category.includes(selectedCategory));
  }

  if (selectedColor !== 'all') {
    filtered = filtered.filter(product => product.color === selectedColor);
  }

  filtered = filtered.filter(product => product.price <= selectedMaxPrice);

  if (selectedSortOption === 'price-low-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (selectedSortOption === 'price-high-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  displayProducts(filtered);
}

function displayProducts(productsArray) {
  let productsHTML = '';

  productsArray.forEach((product) => {
    productsHTML += `
      <a  href="product.html?product-id=${product.id}" 
        class="product-container js-show-product" 
        style="text-decoration: none; color: inherit;">
         
        <div class="container-img">
          
          <div><img src="${product.image[0]}" class="product-img" ></div>
          
        </div>
        <div class="product-title">${product.name}</div>
        <div class="product-price">
          <button class="button-price js-add-to-bag" data-product-id="${product.id}">
            <p><strong>$${product.price}</strong></p>
            <p>Add to Bag</p>
          </button>
          
        </div>
      </div>`;
  });

  let title = selectedCategory === 'all' 
  ? 'All' 
  : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + 's';
  document.querySelector('.js-category-title').innerHTML = title;

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  document.querySelectorAll('.js-add-to-bag').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;
      addToBag(productId);
      updateBagQuantity();
      
    });
  });
}

