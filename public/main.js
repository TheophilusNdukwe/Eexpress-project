// main.js (adjusted for the new index.ejs)
var audit = document.querySelectorAll(".fa-pencil");

Array.from(audit).forEach(function (element) {
  element.addEventListener('click', function (event) {
    event.preventDefault();
    const transactionRow = this.closest('tr');

    // Extract data using CSS selectors, since the HTML is well-structured
    const coin = transactionRow.querySelector('.coin-symbol').innerText;
    const buyPrice = transactionRow.querySelector('.coin').innerText.replace('$', '');
    const amount = transactionRow.querySelector('.amount-cell').innerText;

    fetch('transactions', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'coin': coin,
        'buyPrice': buyPrice,
        'amount': amount
      })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(data => {
        console.log('Success:', data);
        window.location.reload();
      })
      .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while updating the transaction.');
      });
  });
});