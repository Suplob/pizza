let addToCart = document.querySelectorAll('.add-to-cart');

function updateCart(pizza){
    
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
         let pizza = JSON.parse(btn.dataset.pizza);
         updateCart(pizza);
    })
})
