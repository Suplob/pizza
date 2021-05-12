import axios from 'axios'
import Noty from 'noty'
import { initAdmin } from './admin'
import moment from 'moment'

let addToCart = document.querySelectorAll('.add-to-cart');
const cartCounter = document.getElementById('cartCounter')


function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res =>{
        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout: 1000,
            text: "Item Added To Cart",
          }).show()
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Something Went Wrong",
          }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
         let pizza = JSON.parse(btn.dataset.pizza);
         updateCart(pizza);
    })
})

const alertMsg = document.getElementById('success-alert')
if(alertMsg){
    setTimeout(()=> {
        alertMsg.remove()
    }, 2000)
}


let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.getElementById('hiddenInput')
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')


function updateStatus(order){
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    
    let stepCompleted = true
    statuses.forEach((status) =>{
        let dataProp = status.dataset.status
        
        if(stepCompleted){
            status.classList.add('step-completed')
        }
        if(dataProp === order.status){
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current')
            }
        }
    })
}

updateStatus(order)

//socket
let socket = io()

initAdmin(socket)


if(order){
    socket.emit('join', `order_${order._id}`)
}

let adminAreaPath = window.location.pathname

if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom')
}


socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)

    new Noty({
        type: 'success',
        timeout: 1000,
        text: "Order Updated",
      }).show()
})