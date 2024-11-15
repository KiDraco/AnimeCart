function getRandomPrice() {
    return (Math.random() * (5 - 1) + 1).toFixed(2);
}

fetch('https://api.pokemontcg.io/v2/cards?pageSize=10')
    .then(response => response.json())
    .then(data => {
        const cardTable = document.getElementById('cardTable');
        data.data.forEach(card => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'col-md-4 mb-4';
            cardDiv.innerHTML = `
                <div class="card">
                    <img src="${card.images ? card.images.large : ''}" class="card-img-top" alt="${card.name}">
                    <div class="card-body">
                        <h5 class="card-title">${card.name}</h5>
                        <p class="card-text">Tipo: ${card.types ? card.types.join(', ') : 'N/A'}</p>
                        <p class="card-text">Rareza: ${card.rarity || 'Common'}</p>
                        <p class="card-text">Precio: $${getRandomPrice()}</p>
                        <a href="#" class="btn btn-primary">Add</a>
                    </div>
                </div>
            `;
            cardTable.appendChild(cardDiv);
        });
    })
    .catch(error => console.error('Error:', error));
