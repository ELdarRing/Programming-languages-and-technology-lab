const cartItemsElement = document.getElementById("cart-items");
const cartCountElement = document.getElementById("cart-count");
const totalCountElement = document.getElementById("total-count");
const totalPriceElement = document.getElementById("total-price");
const emptyCartElement = document.getElementById("empty-cart");
const clearCartButton = document.getElementById("clear-cart");

let cart = JSON.parse(localStorage.getItem("cart")) || [
{
id: 1,
name: "Беспроводные наушники",
price: 25000,
quantity: 1
},
{
id: 2,
name: "Клавиатура",
price: 18000,
quantity: 2
},
{
id: 3,
name: "Компьютерная мышь",
price: 12000,
quantity: 1
}
];

function formatPrice(price) {
return price.toLocaleString("ru-RU") + " ₸";
}

function saveCart() {
localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
cartItemsElement.innerHTML = "";

if (cart.length === 0) {
    emptyCartElement.classList.remove("hidden");
} else {
    emptyCartElement.classList.add("hidden");
}

cart.forEach(item => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");

    const productInfo = document.createElement("div");
    productInfo.classList.add("product-info");

    const productName = document.createElement("div");
    productName.classList.add("product-name");
    productName.textContent = item.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("product-price");
    productPrice.textContent = "Цена: " + formatPrice(item.price);

    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);

    const quantityControl = document.createElement("div");
    quantityControl.classList.add("quantity-control");

    const minusButton = document.createElement("button");
    minusButton.textContent = "−";
    minusButton.setAttribute("aria-label", "Уменьшить количество");

    const quantity = document.createElement("span");
    quantity.classList.add("quantity");
    quantity.textContent = item.quantity;

    const plusButton = document.createElement("button");
    plusButton.textContent = "+";
    plusButton.setAttribute("aria-label", "Увеличить количество");

    minusButton.addEventListener("click", () => {
        changeQuantity(item.id, -1);
    });

    plusButton.addEventListener("click", () => {
        changeQuantity(item.id, 1);
    });

    quantityControl.appendChild(minusButton);
    quantityControl.appendChild(quantity);
    quantityControl.appendChild(plusButton);

    const itemTotal = document.createElement("div");
    itemTotal.classList.add("item-total");
    itemTotal.textContent = formatPrice(item.price * item.quantity);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "Удалить";

    deleteButton.addEventListener("click", () => {
        removeItem(item.id);
    });

    cartItem.appendChild(productInfo);
    cartItem.appendChild(quantityControl);
    cartItem.appendChild(itemTotal);
    cartItem.appendChild(deleteButton);

    cartItemsElement.appendChild(cartItem);
});

updateSummary();


}

function changeQuantity(id, change) {
const item = cart.find(product => product.id === id);

if (!item) {
    return;
}

item.quantity += change;

if (item.quantity <= 0) {
    removeItem(id);
    return;
}

saveCart();
renderCart();


}

function removeItem(id) {
const item = cart.find(product => product.id === id);

if (!item) {
    return;
}

const confirmed = confirm(
    `Удалить товар "${item.name}" из корзины?`
);

if (!confirmed) {
    return;
}

cart = cart.filter(product => product.id !== id);

saveCart();
renderCart();


}

function updateSummary() {
const totalCount = cart.reduce(
(sum, item) => sum + item.quantity,
0
);

const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
);

cartCountElement.textContent = totalCount;
totalCountElement.textContent = totalCount;
totalPriceElement.textContent = formatPrice(totalPrice);


}

clearCartButton.addEventListener("click", () => {
if (cart.length === 0) {
return;
}

const confirmed = confirm("Вы действительно хотите очистить корзину?");

if (!confirmed) {
    return;
}

cart = [];

saveCart();
renderCart();


});

renderCart();