document.addEventListener('DOMContentLoaded', function() {
    fetchOrders();
});

function fetchOrders() {
    fetch('/api/order')
        .then(response => response.json())
        .then(data => {
            populateOrders(data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

function populateOrders(orders) {
    const table = document.getElementById('orderTable').getElementsByTagName('tbody')[0];
    orders.forEach(order => {
        let row = table.insertRow();
        row.innerHTML = `
          <td>${order.OrderID}</td>
          <td>${order.CustomerID}</td>
          <td>${formatProducts(order.ProductIDs, order.NUMBERs)}</td>
          <td>${order.Total}</td>
          <td><button class="cancelButton" data-orderid="${order.OrderID}">Cancel</button></td>
      `;
    });

    document.querySelectorAll('.cancelButton').forEach(button => {
        button.addEventListener('click', function() {
            cancelOrder(this.getAttribute('data-orderid'));
        });
    });
}

function cancelOrder(orderId) {
    fetch(`/api/order/cancel/${orderId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Order cancelled successfully');
                location.reload(); // Refresh the page to update the order list
            } else {
                alert('Failed to cancel order');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


function formatProducts(productIDs, quantities) {
    const products = productIDs.split(',');
    const nums = quantities.split(',');
    return products.map((pid, index) => `Product ${pid}: ${nums[index]}`).join(', ');
}
