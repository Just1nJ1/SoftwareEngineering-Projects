document.addEventListener('DOMContentLoaded', function() {
    // document.getElementById('checkout-button').addEventListener('click', () => {
    //     window.location.href = '../payment.html';
    // });
    let cartIds = [];
    let productIDs = [];
    let NUMBERs = [];
    fetch('/api/cart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(cartItems => {
            const cartTableBody = document.getElementById('cartItems');
            cartTableBody.innerHTML = ''; // Clear existing items

            cartItems.forEach(item => {
                cartIds.push(item.CartID);
                productIDs.push(item.ProductID);
                NUMBERs.push(item.NUMBER);

                const row = `<tr>
                           <td>${item.Name}</td>
                           <td>$${item.Price}</td>
                           <td>${item.Description}</td>
                         </tr>`;
                cartTableBody.innerHTML += row;
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    document.getElementById('checkout-button').addEventListener('click', () => {
        fetch('/api/store-cart-ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartIds, productIDs, NUMBERs })
        })
            .then(response => response.json())
            .then(data => {
                if(data.success) {
                    window.location.href = '../payment.html';
                } else {
                    console.error('Failed to store cart IDs');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});
