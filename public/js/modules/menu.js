import { clearHtml } from '../main.js'

//Readind data form Local Storage

const details = JSON.parse(localStorage.getItem('reference'))

//!Making active the icon menu
const menuLink = document.querySelector('#menuLink')

window.addEventListener('DOMContentLoaded', () => {
    menuLink.classList.add('linkActive')
})

/*

//////////////////////////////////////////////////

Here the main content for this section

//////////////////////////////////////////////////
*/

const cards = document.querySelectorAll('[data-card-food]')
const noFood = document.querySelector('.main__sideSlide__container__noFood')
const sectionOrder = document.querySelector(
    '.main__sideSlide__container__contentDetails__orders'
)
const detailsOrderSide = document.querySelector(
    '.main__sideSlide__container__contentDetails'
)
const sectionPayment = document.querySelector(
    '.main__sideSlide__container__contentDetails__payment'
)

//!DOM manipulation TOP SLIDE SIDE ORDERS;

const numberOrder = document.querySelector('.orderNumber')
const tableNumber = document.querySelector('p.tableDetails--number')
const guessNumber = document.querySelector('p.tableGuess--number')

numberOrder.textContent = details.order
tableNumber.textContent = details.table
guessNumber.textContent = details.guess

//!Read data from JSON Storage

const url = './js/data.json'

fetch(url)
    .then((response) => response.json())
    .then((data) => insertFood(data))

//! Inserting food for each sections

function insertFood(data) {
    cardFood(data.starter, 'starter')
    cardFood(data.main, 'main')
    cardFood(data.drink, 'drinks')
    cardFood(data.dessert, 'dessert')
}

//!Function Inserting cards food FIGCAPTION

function cardFood(data, name) {
    const foodContainer = document.querySelector(`#${name}`)

    data.forEach((item) => {
        const { image, title, id, price, category = { allergy, extra } } = item

        const figcaption = document.createElement('figcaption')
        figcaption.setAttribute('data-card-food', `#${name}-${id}`)
        figcaption.setAttribute('value', `${price}`)
        figcaption.classList.add('foodWrapper')

        figcaption.innerHTML = `
        
        <div class="foodWrapper__img">
        <img src="./img/${image}" alt="${title}" />
        </div>
        <figure class="foodWrapper__bottom">
        <h4 class="h4">${title}</h4>
        <div
        class="foodWrapper__bottom__categories"
        >
        <p>category:</p>
        <div
        class="foodWrapper__bottom__categories--icons"
        >
        <img
        src="./img/${category.allergy}.svg"
        /><img src="./img/${category.extra}.svg" />
        </div>
        </div>
        <div class="counterFood" id=${name}-${id}>
        <button
        class="btn-counterFood minus"
        >
        <img
        src="./img/minus.svg"
        /></button
        ><button
        class="btn-counterFood__value"
        type="input"
        value="0"
        >
        <p>0</p></button
        ><button
        class="btn-counterFood add"
        >
        <img src="./img/plus.svg" />
        </button>
        </div>
        </figure>
        
        `
        foodContainer.appendChild(figcaption)

        //!target for selection card counters

        let valueIncrease = 0
        let reduceNumber
        figcaption.addEventListener('click', (e) => {
            valueIncrease++
            reduceNumber--

            const targetCounter = document.querySelector(
                figcaption.dataset.cardFood
            )

            targetCounter.classList.add('showCounter')

            const minus = targetCounter.children[0]
            const valueQt = targetCounter.children[1]
            const plus = targetCounter.children[2]

            //!Manipulating the DOM with values
            plus.addEventListener('click', () => {
                valueQt.value = valueIncrease
                valueQt.textContent = valueIncrease
                reduceNumber = valueIncrease
                storageCard(figcaption)
            })

            minus.addEventListener('click', () => {
                if (reduceNumber >= 0) {
                    valueQt.value = reduceNumber
                    valueQt.textContent = reduceNumber
                    valueIncrease = reduceNumber
                    storageCard(figcaption)
                }
            })
        })
    })
}

//! hidden section and showing sections

function showSection() {
    noFood.classList.add('display')
    sectionOrder.classList.remove('display')
    sectionPayment.classList.remove('display')
}

// Tabs food and content
const tabs = document.querySelectorAll('[data-tab-target]')
const tabContents = document.querySelectorAll(
    '.menuContainer__middle__food__section'
)

tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.tabTarget)

        tabContents.forEach((tabContent) => {
            tabContent.classList.remove('activeBlock')
        })
        tabs.forEach((tab) => {
            tab.classList.remove('tabActive')
        })

        tab.classList.add('tabActive')
        target.classList.add('activeBlock')
        console.log(target)
    })
})

//!Function to storage card for each figcaption

//!Object storage information

let detailsOrder = {}

function storageCard(card) {
    const idFood = card.getAttribute('data-card-food')
    const priceFood = card.getAttribute('value')
    const imgSrc = card.children[0].children[0].src
    const titleCard = card.children[1].children[0].textContent
    const counterValue = card.children[1].children[2].children[1].value

    if (counterValue > 0) {
        //!Check if the Order exist in the Array
        if (details.orders.some((order) => order.idFood === idFood)) {
            //*The order exist in the Array

            const orderUpdated = details.orders.map((order) => {
                if (order.idFood === idFood) {
                    order.counterValue = counterValue
                }
                return order
            })
            //! Update with the new array

            details.orders = [...orderUpdated]
        } else {
            //*The order does not exist in the Array

            let resume = {
                idFood,
                priceFood,
                imgSrc,
                titleCard,
                counterValue,
            }
            details.orders = [...details.orders, resume]
        }
    } else {
        //!Remove the order when the qty. is equal to 0 and empty the Array
        const resultOrder = details.orders.filter(
            (order) => order.idFood !== idFood
        )

        details.orders = [...resultOrder]

        hideSection()
    }

    console.log(details.orders)

    //!Removing no product ADDEd image section and showing the rest

    showSection()

    clearHtml(sectionOrder)
    displayOrder()
}

//!Function to Hide the section when the array Is 0

function hideSection() {
    const { orders } = details

    if (orders.length === 0) {
        clearHtml(detailsOrderSide)
        window.location.reload()
    }
}

//!Displaying the order on the side of the page

function displayOrder() {
    const { orders } = details

    orders.forEach((order) => {
        const { titleCard, idFood, priceFood, imgSrc, counterValue } = order

        const orderItem = document.createElement('div')
        orderItem.classList.add(
            'main__sideSlide__container__contentDetails__orders--item'
        )

        //!LeftSide card
        const divLeft = document.createElement('div')
        divLeft.classList.add('order-leftContent')

        const image = document.createElement('img')
        image.src = imgSrc

        const divLefDetails = document.createElement('div')
        divLefDetails.classList.add('order-leftContent__details')

        const titleFood = document.createElement('p')
        titleFood.textContent = titleCard
        const priceH3 = document.createElement('h3')
        priceH3.classList.add('h3')
        priceH3.textContent = `$${priceFood}`

        divLefDetails.appendChild(titleFood)
        divLefDetails.appendChild(priceH3)

        divLeft.appendChild(image)
        divLeft.appendChild(divLefDetails)

        //!Rightside cards

        const divRight = document.createElement('div')
        divRight.classList.add('order-rightContent')

        const quantity = document.createElement('p')
        quantity.textContent = 'Quantity'
        const quantityH3 = document.createElement('h3')
        quantityH3.classList.add('h3')
        quantityH3.textContent = counterValue

        divRight.appendChild(quantity)
        divRight.appendChild(quantityH3)

        orderItem.appendChild(divLeft)
        orderItem.appendChild(divRight)
        sectionOrder.appendChild(orderItem)

        //!Calculate Generals Totals to pay

        subTotals()
    })
}

//!Function to calclutate SUBTOTAL to pay

function subTotals() {
    let subTotals = 0

    const { orders } = details

    orders.forEach((orderItem) => {
        subTotals += orderItem.counterValue * orderItem.priceFood
    })

    const subTotalValue = document.querySelector('.subtotal--value')
    subTotalValue.textContent = `$${subTotals},00`

    const chargeValue = document.querySelector('.charge--value')
    const serviceCharge = (subTotals * 10) / 100

    chargeValue.textContent = `$${serviceCharge}`

    const totalValue = document.querySelector('.totalValue')
    const totalTotals = subTotals + serviceCharge
    totalValue.textContent = `$${totalTotals}`
    details.subTotal = subTotals
    details.serviceCharge = serviceCharge
    details.total = totalTotals
}

//Action button cancel and send order

const cancel = document.querySelector('.btn-cancel')
const send = document.querySelector('.btn-send')
const sendOrderContainer = document.querySelector('#sendOrder')

const tablesBtn = document.querySelector('.btn-tables')
const paymentBtn = document.querySelector('.btn-pay')

send.addEventListener('click', () => {
    const sendPath =
        'https://lottie.host/c7cc4f2a-6f6f-4137-ac3e-0090194715e8/Gr0MIM0Uag.json'

    lotties(sendPath)
    sendOrderContainer.classList.add('sendOrderActive')
    localStorage.setItem('customerOrder', JSON.stringify(details))
})

paymentBtn.addEventListener('click', () => {
    window.location = './payment.html'
})
tablesBtn.addEventListener('click', (e) => {
    window.location = './index.html'
})

//!Cancel order event

cancel.addEventListener('click', cancelOrder)

function cancelOrder() {
    const { order } = details
    // Sweetalert initializing
    swal({
        title: 'Are you sure?',
        text: `Once cancelled the order #${order}, you will not be able to recover this!`,
        icon: 'warning',
        buttons: true,
        buttons: ['Cancel', 'Yes, continue'],
    }).then((willDelete) => {
        if (willDelete) {
            swal('Your order has been cancelled', {
                icon: 'success',
            })
            window.location = './index.html'
        }
    })
}

//Loties animations

const lottiesContainer = document.querySelector('.lotties')

function lotties(section) {
    const lottie = bodymovin.loadAnimation({
        container: lottiesContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `${section}`,
    })
}

//Slider Swiper Initializing

const swiper = new Swiper('.menuContainer__middle__tabs', {
    // Optional parameters
    slidesPerView: 'auto',
    spaceBetween: 35,
    breakpoints: {},
})
