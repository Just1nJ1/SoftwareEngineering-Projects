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
            let subtotal = 0;
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
                subtotal += item.Price * item.NUMBER;
            });

            // Display subtotal
            document.getElementById('subtotal').innerText = `Subtotal: $${subtotal.toFixed(2)}`;
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    document.getElementById('checkout-button').addEventListener('click', () => {
        let subtotal = parseFloat(document.getElementById('subtotal').innerText.replace('Subtotal: $', ''));
        let discountedSubtotalElement = document.getElementById('discountedSubtotal');
        let taxAmountElement = document.getElementById('taxAmount');

        // Check if a discount has been applied
        let finalSubtotal = discountedSubtotalElement && discountedSubtotalElement.style.display !== 'none'
            ? parseFloat(discountedSubtotalElement.innerText.replace('Discounted Subtotal: $', ''))
            : subtotal;

        // Get tax amount
        let taxAmount = taxAmountElement ? parseFloat(taxAmountElement.innerText.replace('Tax: $', '')) : 0;
        let totalAmount = finalSubtotal + taxAmount;

        // Store the total amount in the session
        sessionStorage.setItem('totalAmount', totalAmount.toFixed(2));

        fetch('/api/store-cart-ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartIds, productIDs, NUMBERs, totalAmount: sessionStorage.getItem('totalAmount') })
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

document.getElementById('applyCouponButton').addEventListener('click', () => {
    const couponCode = document.getElementById('couponCode').value;

    fetch('/api/cart/validate-coupon', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ couponCode })
    })
        .then(response => response.json())
        .then(data => {
            if(data.isValid) {
                alert('Coupon applied successfully!');
                applyDiscountToSubtotal(data.discountPercentage);
            } else {
                alert('Invalid or expired coupon code');
                resetSubtotalDisplay();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

function applyDiscountToSubtotal(discountPercentage) {
    let originalSubtotalElement = document.getElementById('subtotal');
    let newSubtotalElement = document.getElementById('discountedSubtotal');

    let originalSubtotal = parseFloat(originalSubtotalElement.innerText.replace('Subtotal: $', ''));
    let discount = originalSubtotal * (discountPercentage / 100);
    let newSubtotal = originalSubtotal - discount;

    // Apply strikethrough style to the original subtotal
    originalSubtotalElement.style.textDecoration = 'line-through';
    originalSubtotalElement.style.color = 'red';

    // Update the new subtotal display
    newSubtotalElement.innerText = `Discounted Subtotal: $${newSubtotal.toFixed(2)}`;
    newSubtotalElement.style.display = 'block'; // Ensure it's visible

    calculateAndDisplayTax(currentTaxRate);
}

function resetSubtotalDisplay() {
    let originalSubtotalElement = document.getElementById('subtotal');
    let newSubtotalElement = document.getElementById('discountedSubtotal');

    // Reset original subtotal style
    originalSubtotalElement.style.textDecoration = 'none';
    originalSubtotalElement.style.color = 'black';

    // Hide the discounted subtotal
    newSubtotalElement.style.display = 'none';
}

document.getElementById('calculateTaxButton').addEventListener('click', () => {
    const stateCode = document.getElementById('stateCode').value;
    fetchTaxRateAndCalculateTax(stateCode);
});
let currentTaxRate = 0;
function fetchTaxRateAndCalculateTax(stateCode) {
    fetch(`/api/cart/tax-rate/${stateCode}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(data => {
            if(data.success) {
                currentTaxRate = data.taxRate; // Update the global tax rate
                calculateAndDisplayTax(data.taxRate);
            } else {
                alert('Failed to fetch tax rate for the state');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function calculateAndDisplayTax(taxRate) {
    let originalSubtotal = parseFloat(document.getElementById('subtotal').innerText.replace('Subtotal: $', ''));
    let discountedSubtotalElement = document.getElementById('discountedSubtotal');
    let discountedSubtotal = discountedSubtotalElement.style.display !== 'none'
        ? parseFloat(discountedSubtotalElement.innerText.replace('Discounted Subtotal: $', ''))
        : originalSubtotal;

    let taxAmount = discountedSubtotal * (taxRate / 100);
    document.getElementById('taxAmount').innerText = `Tax: $${taxAmount.toFixed(2)}`;
}

