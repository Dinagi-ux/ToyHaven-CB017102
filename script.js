

const products = [
    {
        id: 1,
        name: "Building Blocks",
        category: "Toys",
        price: 2500,
        image: "toy1.jpg",
        description: "Creative building blocks for fun and imaginative play."
    },
    {
        id: 2,
        name: "Racing Car",
        category: "Diecast Model Cars",
        price: 1800,
        image: "toy2.jpg",
        description: "A detailed diecast racing car for collectors."
    },
    {
        id: 3,
        name: "Collector Figure",
        category: "Collectible Figurines",
        price: 3200,
        image: "action-figures.jpg",
        description: "A collectible figure perfect for your collection."
    },
    {
        id: 4,
        name: "Strategy Board Game",
        category: "Board Games",
        price: 4500,
        image: "board-games.jpg",
        description: "An exciting board game for family and friends."
    },
    {
        id: 5,
        name: "Diecast Model Car",
        category: "Model Cars",
        price: 3500,
        image: "diecast.jpg",
        description: "A detailed model car for family."
    },
    {
        id: 6,
        name: "Toy Truck",
        category: "Toys",
        price: 2200,
        image: "truck.jpg",
        description: "A fun toy truck for imaginative play."
    }
];




function formatPrice(price) {
    return "Rs. " + price.toLocaleString();
}

function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}



function displayFeaturedProduct() {
    const box = document.getElementById("featured-product");

    if (!box) {
        return;
    }

    const product = products[new Date().getDate() % products.length];

    box.innerHTML = `
        <div class="featured-product-card">
            <img src="${product.image}" alt="${product.name}">
            <div class="featured-product-info">
                <p>${product.category}</p>
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong>${formatPrice(product.price)}</strong>
            </div>
        </div>
    `;
}




function displayProducts(category = "All", search = "") {
    const grid = document.getElementById("products-grid");

    if (!grid) {
        return;
    }

    let result = products;

    if (category !== "All") {
        result = result.filter(function(product) {
            return product.category === category;
        });
    }

    if (search !== "") {
        result = result.filter(function(product) {
            return product.name.toLowerCase().includes(search.toLowerCase());
        });
    }

    grid.innerHTML = "";

    result.forEach(function(product) {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}">
                <p>${product.category}</p>
                <h3>${product.name}</h3>
                <strong>${formatPrice(product.price)}</strong>
                <br><br>
                <button class="view-product" data-id="${product.id}">
                    View Details
                </button>
            </div>
        `;
    });

    if (result.length === 0) {
        grid.innerHTML = "<p>No products found.</p>";
    }
}

let currentCategory = "All";

const searchInput = document.getElementById("product-search");

document.querySelectorAll(".product-filters button").forEach(function(button) {
    button.addEventListener("click", function() {
        currentCategory = button.dataset.category;

        let search = "";

        if (searchInput) {
            search = searchInput.value;
        }

        displayProducts(currentCategory, search);
    });
});

if (searchInput) {
    searchInput.addEventListener("input", function() {
        displayProducts(currentCategory, searchInput.value);
    });
}




document.addEventListener("click", function(event) {

    if (event.target.classList.contains("view-product")) {

        const id = Number(event.target.dataset.id);
        const product = products.find(function(item) {
            return item.id === id;
        });

        const modal = document.getElementById("product-modal");
        const modalProduct = document.getElementById("modal-product");

        if (modal && modalProduct) {
            modalProduct.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.category}</p>
                <p>${product.description}</p>
                <strong>${formatPrice(product.price)}</strong>
                <br><br>
                <button class="add-to-cart" data-id="${product.id}">
                    Add to Cart
                </button>
                <button class="add-wishlist" data-id="${product.id}">
                    Add to Wishlist
                </button>
            `;

            modal.style.display = "flex";
        }
    }


    // Add to cart
    if (event.target.classList.contains("add-to-cart")) {
        const id = Number(event.target.dataset.id);

        addToCart(id);
    }


    // Add to wishlist
    if (event.target.classList.contains("add-wishlist")) {
        const id = Number(event.target.dataset.id);

        addToWishlist(id);
    }


    // Close modal
    if (event.target.id === "close-modal") {
        const modal = document.getElementById("product-modal");

        if (modal) {
            modal.style.display = "none";
        }
    }


    // Cart quantity
    if (event.target.classList.contains("quantity-btn")) {

        const id = Number(event.target.dataset.id);
        const cart = getCart();

        const item = cart.find(function(product) {
            return product.id === id;
        });

        if (item) {

            if (event.target.dataset.action === "plus") {
                item.quantity++;
            }

            if (event.target.dataset.action === "minus" && item.quantity > 1) {
                item.quantity--;
            }

            saveCart(cart);
            displayCart();
        }
    }


    // Remove cart item
    if (event.target.classList.contains("remove-item")) {

        const id = Number(event.target.dataset.id);

        let cart = getCart();

        cart = cart.filter(function(item) {
            return item.id !== id;
        });

        saveCart(cart);
        displayCart();
    }


    // Clear cart
    if (event.target.id === "clear-cart") {
        localStorage.removeItem("cart");
        displayCart();
    }


    // Remove wishlist
    if (event.target.classList.contains("remove-wishlist")) {

        const id = Number(event.target.dataset.id);

        let wishlist = getWishlist();

        wishlist = wishlist.filter(function(item) {
            return item !== id;
        });

        localStorage.setItem("wishlist", JSON.stringify(wishlist));
        localStorage.removeItem("status-" + id);

        displayWishlist();
    }
});



function addToCart(id) {

    const cart = getCart();

    const item = cart.find(function(product) {
        return product.id === id;
    });

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            id: id,
            quantity: 1
        });
    }

    saveCart(cart);

    alert("Product added to cart!");
}

function displayCart() {

    const box = document.getElementById("cart-items");

    if (!box) {
        return;
    }

    const cart = getCart();

    box.innerHTML = "";

    let subtotal = 0;

    cart.forEach(function(item) {

        const product = products.find(function(p) {
            return p.id === item.id;
        });

        const itemTotal = product.price * item.quantity;

        subtotal += itemTotal;

        box.innerHTML += `
            <div class="cart-item">

                <img src="${product.image}" alt="${product.name}">

                <div>
                    <h3>${product.name}</h3>
                    <p>${formatPrice(product.price)}</p>

                    <button class="quantity-btn"
                            data-id="${product.id}"
                            data-action="minus">−</button>

                    <span>${item.quantity}</span>

                    <button class="quantity-btn"
                            data-id="${product.id}"
                            data-action="plus">+</button>

                    <p>Subtotal: ${formatPrice(itemTotal)}</p>

                    <button class="remove-item" data-id="${product.id}">
                        Remove
                    </button>
                </div>

            </div>
        `;
    });

    if (cart.length === 0) {
        box.innerHTML = "<p>Your cart is empty.</p>";
    }

    const delivery = cart.length > 0 ? 300 : 0;

    const subtotalBox = document.getElementById("cart-subtotal");
    const deliveryBox = document.getElementById("cart-delivery");
    const totalBox = document.getElementById("cart-total");

    if (subtotalBox) {
        subtotalBox.textContent = formatPrice(subtotal);
    }

    if (deliveryBox) {
        deliveryBox.textContent = formatPrice(delivery);
    }

    if (totalBox) {
        totalBox.textContent = formatPrice(subtotal + delivery);
    }
}


function displayOrderSummary() {

    const box = document.getElementById("order-summary");

    if (!box) {
        return;
    }

    const cart = getCart();

    let total = 0;

    box.innerHTML = "";

    cart.forEach(function(item) {

        const product = products.find(function(p) {
            return p.id === item.id;
        });

        const itemTotal = product.price * item.quantity;

        total += itemTotal;

        box.innerHTML += `
            <p>
                ${product.name} x ${item.quantity}
                - ${formatPrice(itemTotal)}
            </p>
        `;
    });

    const delivery = cart.length > 0 ? 300 : 0;

    total += delivery;

    box.innerHTML += `
        <strong>Total: ${formatPrice(total)}</strong>
    `;
}

const checkoutForm = document.getElementById("checkout-form");

if (checkoutForm) {

    displayOrderSummary();

    checkoutForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("full-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const payment = document.getElementById("payment-method").value;
        const message = document.getElementById("checkout-message");

        if (name === "" || email === "" || phone === "" ||
            address === "" || payment === "") {

            message.textContent = "Please fill in all fields.";
            return;
        }

        if (!email.includes("@")) {
            message.textContent = "Please enter a valid email.";
            return;
        }

        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push({
            name: name,
            email: email,
            phone: phone,
            address: address,
            payment: payment,
            cart: getCart(),
            date: new Date().toLocaleString()
        });

        localStorage.setItem("orders", JSON.stringify(orders));

        localStorage.removeItem("cart");

        message.textContent = "Order placed successfully!";

        checkoutForm.reset();

        displayOrderSummary();
    });
}



function addToWishlist(id) {

    const wishlist = getWishlist();

    if (wishlist.includes(id)) {
        alert("Product is already in your wishlist.");
        return;
    }

    wishlist.push(id);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    alert("Product added to wishlist!");

    displayWishlist();
}

function displayWishlist() {

    const box = document.getElementById("wishlist-items");

    if (!box) {
        return;
    }

    const wishlist = getWishlist();

    if (wishlist.length === 0) {
        box.innerHTML = "<p>Your wishlist is empty.</p>";
        return;
    }

    box.innerHTML = "";

    wishlist.forEach(function(id) {

        const product = products.find(function(p) {
            return p.id === id;
        });

        const status =
            localStorage.getItem("status-" + id) || "Interested";

        box.innerHTML += `
            <div class="product-card">

                <img src="${product.image}" alt="${product.name}">

                <p>${product.category}</p>

                <h3>${product.name}</h3>

                <strong>${formatPrice(product.price)}</strong>

                <br><br>

                <select class="wishlist-status" data-id="${product.id}">
                    <option ${status === "Interested" ? "selected" : ""}>
                        Interested
                    </option>

                    <option ${status === "Owned" ? "selected" : ""}>
                        Owned
                    </option>

                    <option ${status === "Not Interested" ? "selected" : ""}>
                        Not Interested
                    </option>
                </select>

                <br><br>

                <button class="remove-wishlist" data-id="${product.id}">
                    Remove
                </button>

            </div>
        `;
    });
}

document.addEventListener("change", function(event) {

    if (event.target.classList.contains("wishlist-status")) {

        const id = event.target.dataset.id;

        localStorage.setItem(
            "status-" + id,
            event.target.value
        );
    }
});




const feedbackForm = document.getElementById("feedback-form");

if (feedbackForm) {

    feedbackForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("feedback-name").value.trim();

        const email =
            document.getElementById("feedback-email").value.trim();

        const message =
            document.getElementById("feedback-message").value.trim();

        if (name === "" || email === "" || message === "") {
            alert("Please complete all fields.");
            return;
        }

        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        const feedback =
            JSON.parse(localStorage.getItem("feedback")) || [];

        feedback.push({
            name: name,
            email: email,
            message: message,
            date: new Date().toLocaleString()
        });

        localStorage.setItem(
            "feedback",
            JSON.stringify(feedback)
        );

        alert("Thank you! Your feedback has been submitted.");

        feedbackForm.reset();
    });
}




document.querySelectorAll(".faq-question").forEach(function(button) {

    button.addEventListener("click", function() {

        const answer = button.nextElementSibling;

        if (answer.style.display === "block") {
            answer.style.display = "none";
        } else {
            answer.style.display = "block";
        }
    });
});


// ===============================
// SCROLL ANIMATION
// ===============================

window.addEventListener("scroll", function() {

    document.querySelectorAll("section").forEach(function(section) {

        const position = section.getBoundingClientRect().top;

        if (position < window.innerHeight - 100) {
            section.classList.add("show");
        }
    });
});


// ===============================
// START FUNCTIONS
// ===============================

displayFeaturedProduct();
displayProducts();
displayCart();
displayWishlist();
displayOrderSummary();