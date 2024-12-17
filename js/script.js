const script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/npm/sweetalert2@11";
document.head.appendChild(script);

const pageSize = 12; 
let currentPage = 1;
let allCards = [];

const API_URL = 'https://api.pokemontcg.io/v2/cards?';

fetch(`${API_URL}&pageSize=${pageSize}&page=1`)  
    .then(response => response.json())
    .then(data => {
        allCards = data.data;
        displayPage(currentPage);
        loadOtherPages(); 
    })
    .catch(error => console.error('Error al cargar las cartas:', error));

function loadOtherPages() {
    fetch(`${API_URL}`)
        .then(response => response.json())
        .then(data => {
            allCards = data.data;
            createPaginationControls(allCards.length); 
        })
        .catch(error => console.error('Error al cargar todas las cartas:', error));
}

function displayPage(page) {
    const cardTable = document.getElementById('cardTable');
    cardTable.innerHTML = '';

    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const filteredCards = allCards.filter(card => card.name.toLowerCase().includes(searchInput));
    const paginatedCards = filteredCards.slice((page - 1) * pageSize, page * pageSize);

    paginatedCards.forEach(pokemonCard => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'col-md-4 mb-4';
        cardDiv.innerHTML = `
            <div class="card">
                <img src="${pokemonCard.images.large}" class="card-img-top" alt="${pokemonCard.name}">
                <div class="card-body">
                    <h5 class="card-title">${pokemonCard.name}</h5>
                    <p class="card-text">Tipo: ${pokemonCard.types.join(', ')}</p>
                    <p class="card-text">Rareza: ${pokemonCard.rarity || 'Común'}</p>
                    <p class="card-text">Precio: $${pokemonCard.cardmarket?.prices?.trendPrice || 'N/A'}</p>
                    <button class="btn btn-primary">Añadir</button>
                </div>
            </div>
        `;

        const addButton = cardDiv.querySelector('button');
        addButton.addEventListener('click', () => addToCart(pokemonCard));

        cardTable.appendChild(cardDiv);
    });

    createPaginationControls(filteredCards.length);
    updateCartCounter();
}

function createPaginationControls(totalFilteredCards) {
    const paginationControls = document.getElementById('pagination-controls');
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(totalFilteredCards / pageSize);
    const maxButtons = 5;
    const startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    const endPage = Math.min(startPage + maxButtons - 1, totalPages);

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Anterior';
        prevButton.className = 'page-btn btn btn-primary';
        prevButton.addEventListener('click', () => {
            currentPage--;
            displayPage(currentPage);
        });
        paginationControls.appendChild(prevButton);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = `page-btn btn btn-primary ${i === currentPage ? 'active' : ''}`;
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayPage(i);
        });
        paginationControls.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Siguiente';
        nextButton.className = 'page-btn btn btn-primary';
        nextButton.addEventListener('click', () => {
            currentPage++;
            displayPage(currentPage);
        });
        paginationControls.appendChild(nextButton);
    }
}

document.getElementById('search-input').addEventListener('input', () => {
    currentPage = 1;
    displayPage(currentPage);
});

function addToCart(product) {
    let cart = JSON.parse(sessionStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(cartItem => {
        return cartItem.name === product.name && cartItem.cardmarket?.prices?.trendPrice === product.cardmarket?.prices?.trendPrice;
    });

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    sessionStorage.setItem("cart", JSON.stringify(cart));

    Swal.fire({
        title: 'Producto añadido',
        text: `${product.name} ha sido añadido al carrito`,
        icon: 'success',
        confirmButtonText: 'Cerrar'
    });

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
