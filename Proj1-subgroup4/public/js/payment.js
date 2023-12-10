document.getElementById('paymentForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const billingAddress = document.getElementById('billingAddress').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;

    fetch('/api/payment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ billingAddress, cardNumber, expiryDate, cvv }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem('paymentInfoId', data.paymentInfoId);
                window.location.href = '../order.html';
            } else {
                alert('Payment information submission failed');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});
