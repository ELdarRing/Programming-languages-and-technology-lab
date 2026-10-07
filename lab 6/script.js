const products = [
    {
    id: 1,
    name: "Беспроводные наушники",
    price: 25000,
    icon: "🎧"
    },
    {
    id: 2,
    name: "Механическая клавиатура",
    price: 18000,
    icon: "⌨️"
    },
    {
    id: 3,
    name: "Компьютерная мышь",
    price: 12000,
    icon: "🖱️"
    },
    {
    id: 4,
    name: "Ноутбук",
    price: 350000,
    icon: "💻"
    },
    {
    id: 5,
    name: "Смартфон",
    price: 180000,
    icon: "📱"
    },
    {
    id: 6,
    name: "Монитор",
    price: 95000,
    icon: "🖥️"
    }
    ];
    
    
    const catalogPage = document.getElementById("catalog-page");
    const cartPage = document.getElementById("cart-page");
    
    const catalogButton = document.getElementById("catalog-button");
    const cartButton = document.getElementById("cart-button");
    const shopButton = document.getElementById("shop-button");
    
    const cartCountElement = document.getElementById("cart-count");
    
    const cartItemsElement = document.getElementById("cart-items");
    const emptyCartElement = document.getElementById("empty-cart");
    const cartSummaryElement = document.getElementById("cart-summary");
    
    const totalCountElement = document.getElementById("total-count");
    const totalPriceElement = document.getElementById("total-price");
    
    const clearCartButton = document.getElementById("clear-cart");
    const continueShoppingButton = document.getElementById("continue-shopping");
    const goToCatalogButton = document.getElementById("go-to-catalog");
    
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    
    function formatPrice(price) {
    return price.toLocaleString("ru-RU") + " ₸";
    }
    
    function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    }
    
    function getProductById(id) {
    return products.find(product => product.id === id);
    }
    
    
    function showCatalog() {
    catalogPage.classList.remove("hidden");
    cartPage.classList.add("hidden");
    
    catalogButton.classList.add("active");
    cartButton.classList.remove("active");
    
    updateAddButtons();
    
    
    }
    
    function showCart() {
    catalogPage.classList.add("hidden");
    cartPage.classList.remove("hidden");
    
    catalogButton.classList.remove("active");
    cartButton.classList.add("active");
    
    renderCart();
    
    
    }
    
    catalogButton.addEventListener("click", showCatalog);
    
    shopButton.addEventListener("click", showCatalog);
    
    cartButton.addEventListener("click", showCart);
    
    continueShoppingButton.addEventListener(
    "click",
    showCatalog
    );
    
    goToCatalogButton.addEventListener(
    "click",
    showCatalog
    );
    
    
    const addButtons = document.querySelectorAll(".add-button");
    
    addButtons.forEach(button => {
    
    button.addEventListener("click", () => {
    
        const productId = Number(button.dataset.id);
    
        addToCart(productId);
    
    });
    
    
    });
    
    function addToCart(productId) {
    
    const existingItem = cart.find(
        item => item.id === productId
    );
    
    if (existingItem) {
    
        existingItem.quantity++;
    
    } else {
    
        cart.push({
            id: productId,
            quantity: 1
        });
    
    }
    
    saveCart();
    
    updateCartCount();
    
    updateAddButtons();
    
    
    }
    
    function updateAddButtons() {
    
    addButtons.forEach(button => {
    
        const productId = Number(button.dataset.id);
    
        const item = cart.find(
            item => item.id === productId
        );
    
        if (item) {
    
            button.textContent =
                `В корзине: ${item.quantity}`;
    
            button.classList.add("added");
    
        } else {
    
            button.textContent = "В корзину";
    
            button.classList.remove("added");
    
        }
    
    });
    
    
    }
    
    
    function updateCartCount() {
    
    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    
    cartCountElement.textContent = totalCount;
    
    
    }
    
    
    function renderCart() {
    
    cartItemsElement.innerHTML = "";
    
    if (cart.length === 0) {
    
        emptyCartElement.classList.remove("hidden");
    
        cartSummaryElement.classList.add("hidden");
    
        updateSummary();
    
        return;
    
    }
    
    emptyCartElement.classList.add("hidden");
    
    cartSummaryElement.classList.remove("hidden");
    
    
    cart.forEach(item => {
    
        const product = getProductById(item.id);
    
        if (!product) {
            return;
        }
    
    
        const cartItem = document.createElement("div");
    
        cartItem.classList.add("cart-item");
    
    
        const icon = document.createElement("div");
    
        icon.classList.add("cart-product-icon");
    
        icon.textContent = product.icon;
    
    
        const productInfo = document.createElement("div");
    
        productInfo.classList.add("cart-product-info");
    
    
        const productName = document.createElement("h3");
    
        productName.textContent = product.name;
    
    
        const productPrice = document.createElement("div");
    
        productPrice.classList.add("cart-product-price");
    
        productPrice.textContent =
            formatPrice(product.price) + " за шт.";
    
    
        productInfo.appendChild(productName);
        productInfo.appendChild(productPrice);
    
    
        const quantityControl =
            document.createElement("div");
    
        quantityControl.classList.add("quantity-control");
    
    
        const minusButton =
            document.createElement("button");
    
        minusButton.classList.add("quantity-button");
    
        minusButton.textContent = "−";
    
        minusButton.setAttribute(
            "aria-label",
            "Уменьшить количество"
        );
    
    
        const quantity =
            document.createElement("span");
    
        quantity.classList.add("quantity");
    
        quantity.textContent = item.quantity;
    
    
        const plusButton =
            document.createElement("button");
    
        plusButton.classList.add("quantity-button");
    
        plusButton.textContent = "+";
    
        plusButton.setAttribute(
            "aria-label",
            "Увеличить количество"
        );
    
    
        minusButton.addEventListener(
            "click",
            () => {
                changeQuantity(product.id, -1);
            }
        );
    
    
        plusButton.addEventListener(
            "click",
            () => {
                changeQuantity(product.id, 1);
            }
        );
    
    
        quantityControl.appendChild(minusButton);
        quantityControl.appendChild(quantity);
        quantityControl.appendChild(plusButton);
    
    
        const itemTotal =
            document.createElement("div");
    
        itemTotal.classList.add("item-total");
    
        itemTotal.textContent =
            formatPrice(product.price * item.quantity);
    
    
        const deleteButton =
            document.createElement("button");
    
        deleteButton.classList.add("delete-button");
    
        deleteButton.textContent = "Удалить";
    
    
        deleteButton.addEventListener(
            "click",
            () => {
                removeFromCart(product.id);
            }
        );
    
    
        cartItem.appendChild(icon);
        cartItem.appendChild(productInfo);
        cartItem.appendChild(quantityControl);
        cartItem.appendChild(itemTotal);
        cartItem.appendChild(deleteButton);
    
    
        cartItemsElement.appendChild(cartItem);
    
    });
    
    
    updateSummary();
    
    
    }
    
    
    function changeQuantity(productId, change) {
    
    const item = cart.find(
        item => item.id === productId
    );
    
    if (!item) {
        return;
    }
    
    
    item.quantity += change;
    
    
    if (item.quantity <= 0) {
    
        removeFromCart(productId);
    
        return;
    }
    
    
    saveCart();
    
    renderCart();
    
    updateCartCount();
    
    updateAddButtons();
    
    
    }
    
    
    function removeFromCart(productId) {
    
    const product = getProductById(productId);
    
    if (!product) {
        return;
    }
    
    
    const confirmed = confirm(
        `Удалить "${product.name}" из корзины?`
    );
    
    
    if (!confirmed) {
        return;
    }
    
    
    cart = cart.filter(
        item => item.id !== productId
    );
    
    
    saveCart();
    
    renderCart();
    
    updateCartCount();
    
    updateAddButtons();
    
    
    }
    
    
    function updateSummary() {
    
    const totalCount = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );
    
    
    let totalPrice = 0;
    
    
    cart.forEach(item => {
    
        const product = getProductById(item.id);
    
        if (product) {
    
            totalPrice +=
                product.price * item.quantity;
    
        }
    
    });
    
    
    totalCountElement.textContent =
        totalCount;
    
    totalPriceElement.textContent =
        formatPrice(totalPrice);
    
    cartCountElement.textContent =
        totalCount;
    
    
    }
    
    
    clearCartButton.addEventListener(
    "click",
    () => {
    
        if (cart.length === 0) {
            return;
        }
    
    
        const confirmed = confirm(
            "Вы действительно хотите очистить корзину?"
        );
    
    
        if (!confirmed) {
            return;
        }
    
    
        cart = [];
    
        saveCart();
    
        renderCart();
    
        updateCartCount();
    
        updateAddButtons();
    
    }
    
    
    );
    
    
    updateCartCount();
    
    updateAddButtons();
    
    renderCart();