// main.js (adjusted for the new index.ejs)
var audit = document.querySelectorAll(".fa-pencil");
var status = document.querySelectorAll(".fa-square-check");
var trash = document.querySelectorAll(".fa-trash")

Array.from(audit).forEach(function(element) {
    element.addEventListener('click', function(){
        const id = this.parentNode.parentNode.parentNode.getAttribute('data-id')
     
     
        fetch('/transactions/audit', { 
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                _id: id
            })
        })
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(data => {
                console.log(data)
                
               
              
            }).then(function (response) {
            window.location.reload()
        })
    });
});

Array.from(trash).forEach(function(element) {
    element.addEventListener('click', function(){
        const id = this.parentNode.parentNode.parentNode.getAttribute('data-id')

        fetch('/transactions', { 
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                _id: id
            })
        }).then(function (response) {
            window.location.reload()
        })
    });
});