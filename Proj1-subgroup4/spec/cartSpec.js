const { fetchCartItems, handleCheckout } = require('../public/js/cart');

describe('Cart functionality', function() {
    beforeAll(function() {
        // Create a mock DOM structure
        document.body.innerHTML = `
            <table id="cartTable">
                <tbody id="cartItems"></tbody>
            </table>
            <button id="checkout-button">Proceed to Checkout</button>
        `;

        window.fetch = jasmine.createSpy('fetch').and.returnValue(Promise.resolve({
            json: () => Promise.resolve([
                {
                    CartID: 1,
                    ProductID: 101,
                    NUMBER: 2,
                    Name: 'Product A',
                    Price: 10,
                    Description: 'Description A',
                },
                {
                    CartID: 2,
                    ProductID: 102,
                    NUMBER: 1,
                    Name: 'Product B',
                    Price: 20,
                    Description: 'Description B',
                },
            ]),
        }));
    });

    it('should fetch cart items and populate the table', function(done) {
        jasmine.clock().install();

        document.dispatchEvent(new Event('DOMContentLoaded'));

        setTimeout(() => {
            // Assertions to check if the table is populated correctly
            const cartTableBody = document.getElementById('cartItems');
            expect(cartTableBody.innerHTML).toContain('<td>Product A</td>');
            expect(cartTableBody.innerHTML).toContain('<td>Product B</td>');

            jasmine.clock().uninstall();
            done();
        }, 0);
    });

    it('should handle cart checkout', function(done) {
        window.fetch.and.returnValue(Promise.resolve({
            json: () => Promise.resolve({ success: true }),
        }));

        const checkoutButton = document.getElementById('checkout-button');
        checkoutButton.click();

        setTimeout(() => {
            expect(window.fetch).toHaveBeenCalledWith('/api/store-cart-ids', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cartIds: [],
                    productIDs: [],
                    NUMBERs: [],
                }),
            });

            expect(window.location.href).toBe('../payment.html');

            jasmine.clock().uninstall();
            done();
        }, 0);
    });
});