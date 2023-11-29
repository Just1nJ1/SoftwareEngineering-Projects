describe("Payment Page Tests", () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="paymentForm">
                <input type="text" id="billingAddress" />
                <input type="text" id="cardNumber" />
                <input type="text" id="expiryDate" />
                <input type="text" id="cvv" />
                <button type="submit">Submit Payment Info</button>
            </form>
        `;
    });

    it("should prevent default form submission", () => {
        const form = document.getElementById('paymentForm');
        const event = new Event('submit');
        spyOn(event, 'preventDefault');

        form.dispatchEvent(event);

        expect(event.preventDefault).toHaveBeenCalled();
    });
});
