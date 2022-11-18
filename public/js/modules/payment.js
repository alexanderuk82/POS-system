import { clearHtml } from '../main.js'

const paymentLink = document.querySelector('#paymentLink')
const orderNUmber = document.querySelector('.orderNumber')
const tableNUmber = document.querySelector('.tableDetails--number')
const timeOrder = document.querySelector('.tableDetails--hour')
const guessNumber = document.querySelector('.tableGuess--number')
const amountToPay = document.querySelector('.priceAmount')

//!Defining variables for total and subTotals sections

const subTotalOrder = document.querySelector('#subtotal')
const tipsOrder = document.querySelector('#tipsValue')
const chargeOrder = document.querySelector('#serviceCharge')
const finalTotal = document.querySelector('.totalValue')

const time = moment().format('LT')

//!Getting details from Local storage

const details = JSON.parse(localStorage.getItem('customerOrder'))
console.log(details)

window.addEventListener('DOMContentLoaded', () => {
    const { order, table, guess, total, subTotal, serviceCharge } = details
    paymentLink.classList.add('linkActive')
    orderNUmber.textContent = order
    tableNUmber.textContent = table
    timeOrder.textContent = time
    guessNumber.textContent = guess
    amountToPay.textContent = `$${total}`
    chargeOrder.textContent = `$${serviceCharge}`
    subTotalOrder.textContent = `$${subTotal}`
    tipsOrder.textContent = `$-`
    finalTotal.textContent = `$${total}`

    displayTable()
})
//////////////////////////////////////////////////

//!Here the main content for this section

//////////////////////////////////////////////////

// !Function to display the table and the orders
const tableContainer = document.querySelector('.paymentSection__resume__table')

function displayTable() {
    const { orders } = details

    const tableOrder = document.createElement('table')
    tableOrder.classList.add('tableOrder')
    tableOrder.setAttribute('align', 'center')
    tableOrder.setAttribute('cellspacing', '0')

    //!Header of the table or titles table
    const tableHeader = document.createElement('tr')
    tableHeader.classList.add('tableHeader')
    const thItem = document.createElement('th')
    thItem.textContent = 'item'
    const thPrice = document.createElement('th')
    thPrice.textContent = 'price'
    const thQuantity = document.createElement('th')
    thQuantity.textContent = 'quantity'
    const thSubtotal = document.createElement('th')
    thSubtotal.textContent = 'subtotal'
    thSubtotal.setAttribute('colspan', '3')

    tableHeader.appendChild(thItem)
    tableHeader.appendChild(thPrice)
    tableHeader.appendChild(thQuantity)
    tableHeader.appendChild(thSubtotal)

    tableOrder.appendChild(tableHeader)

    //!Items FOOD generated from Array

    orders.forEach((order) => {
        const { counterValue, idFood, priceFood, titleCard } = order

        const trItem = document.createElement('tr')
        trItem.classList.add('tableItem')
        trItem.setAttribute('id', `${idFood}`)

        const tdItem = document.createElement('td')
        tdItem.classList.add('nameUpper')
        tdItem.innerHTML = `${titleCard}<br><sub>(${idFood})</sub>`

        const tdPrice = document.createElement('td')
        tdPrice.textContent = `$${priceFood}`
        const tdQuantity = document.createElement('td')
        tdQuantity.textContent = counterValue

        const tdSubtotal = document.createElement('td')
        tdSubtotal.classList.add('subTotalDelete')
        tdSubtotal.setAttribute('colspan', '3')
        tdSubtotal.textContent = `$${priceFood * counterValue}`

        const btnDelete = document.createElement('button')
        btnDelete.classList.add('btn-delete')
        btnDelete.setAttribute('id', `${idFood}`)

        const iconTRash = document.createElement('img')
        iconTRash.src = './img/remove.svg'
        btnDelete.appendChild(iconTRash)

        tdSubtotal.appendChild(btnDelete)

        trItem.appendChild(tdItem)
        trItem.appendChild(tdPrice)
        trItem.appendChild(tdQuantity)
        trItem.appendChild(tdSubtotal)

        tableOrder.appendChild(trItem)

        btnDelete.addEventListener('click', updateTable)
    })

    tableContainer.appendChild(tableOrder)
}

//!Function update Table

function updateTable(e) {
    const targetBtn = e.target.closest('.btn-delete').getAttribute('id')
    const resultOrder = details.orders.filter(
        (order) => order.idFood !== targetBtn
    )

    details.orders = [...resultOrder]

    updateTotalsOrder()
}

//! Function to update Order removed

function updateTotalsOrder() {
    clearHtml(tableContainer)

    displayTable()

    subTotals()
}

//!Function to calculate SUBTOTAL to pay when one Items has been removed

function subTotals() {
    let subTotals = 0

    const { orders, total } = details

    orders.forEach((orderItem) => {
        subTotals += orderItem.counterValue * orderItem.priceFood
    })

    const serviceCharge = (subTotals * 10) / 100
    const totalTotals = subTotals + serviceCharge
    amountToPay.textContent = `$${totalTotals}`
    details.subTotal = subTotals
    subTotalOrder.textContent = `$${subTotals}`
    details.serviceCharge = serviceCharge
    chargeOrder.textContent = `$${serviceCharge}`
    details.total = totalTotals
    finalTotal.textContent = `$${totalTotals}`
    console.log(details)
}

//!BTNS tips header payment section and getting the value

const tipBt = document.querySelectorAll('[data-btn-tips]')
const btnTips = document.querySelectorAll('button')

tipBt.forEach((tip) => {
    tip.addEventListener('click', (e) => {
        const target = tip.children[0]

        btnTips.forEach((btnTip) => {
            btnTip.classList.remove('tipActive')
        })
        target.classList.add('tipActive')
        const tipSelected = target.getAttribute('value')
        details.tips = Number(tipSelected)
        tipsOrder.textContent = `$${details.tips}`
        const { total } = details

        finalTotal.textContent = `$${total + details.tips}`
    })
})

//!Update=ing localstorage and PayNow event

const btnPayNow = document.querySelector('.btn-payNow')

btnPayNow.addEventListener('click', () => {
    localStorage.setItem('customerOrder', JSON.stringify(details))
})
