function displayCart() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || []; 
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    
    cartContainer.innerHTML = ''; 
    let totalPrice = 0; 
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-center">Tu carrito está vacío.</p>';
        totalPriceElement.textContent = '0';
    } else {
        cart.forEach((item, index) => {
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item mb-3 p-3 border';
            cartItemDiv.innerHTML = `
                <div class="d-flex justify-content-between">
                    <div>
                        <h5>${item.name}</h5>   
                        <img src="${item.images ? item.images.small : ''}" class="card-img-top" alt="${item.name}">                     
                        <p>Precio: $${item.cardmarket?.prices?.trendPrice}</p>
                        <p>Cantidad: 
                            <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, -1)">-</button>
                            <span id="item-quantity-${index}">${item.quantity || 1}</span>
                            <button class="btn btn-sm btn-secondary" onclick="changeQuantity(${index}, 1)">+</button>
                        </p>
                    </div>
                    <div>
                        <p>Total: $${(item.cardmarket?.prices?.trendPrice * (item.quantity || 1)).toFixed(2)}</p>
                        <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">Eliminar</button>
                    </div>
                </div>
            `;
            cartContainer.appendChild(cartItemDiv);
            totalPrice += item.cardmarket?.prices?.trendPrice * (item.quantity || 1);
        });
        
        totalPriceElement.textContent = totalPrice.toFixed(2);
    }
}
updateCartCounter();
function changeQuantity(index, delta) {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const item = cart[index];
    if (item.quantity + delta > 0) {
        item.quantity += delta;
        sessionStorage.setItem("cart", JSON.stringify(cart)); 
        displayCart();
        updateCartCounter(); 
    }
}

function removeFromCart(index) {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    sessionStorage.setItem("cart", JSON.stringify(cart)); 
    displayCart();
    updateCartCounter(); 
}

function updateCartCounter() {
    const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    let cartCount = 0; 
    cart.forEach(item => {
        cartCount += item.quantity || 1;
    });
    const cartCounter = document.getElementById('cart-counter');
    cartCounter.textContent = cartCount; 
}

const buttonBuy = document.getElementById('buttonBuy');

buttonBuy.addEventListener('click', () => {
    sessionStorage.removeItem("cart");

    Swal.fire({
        title: 'Compra Realizada',
        text: `Le llegará un mail con la compra realizada`,
        icon: 'success',
        confirmButtonText: 'Cerrar'
    }).then(() => {
        displayCart();
        updateCartCounter();
    });
});

window.addEventListener('load', displayCart);
