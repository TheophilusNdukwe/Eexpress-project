var trash = document.getElementsByClassName("fa-trash");
var audit  = document.getElementsByClassName("fa-pencil")
//create a fetch for the price of degen

Array.from(audit).forEach(function (element) {
      element.addEventListener('click', function(){        
        const coin = this.parentNode.parentNode.childNodes[1].innerText
        const buyPrice = this.parentNode.parentNode.childNodes[3].innerText
        const amount = this.parentNode.parentNode.childNodes[5].innerText
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
        }).then(function (response) {
          window.location.reload()
        })
      });
});
