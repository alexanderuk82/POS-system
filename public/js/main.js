//Setting uop the time with moment.JS

//!Date and time functions

const date = moment().format('MMMM Do YYYY, h:mm:ss a')
const dateContainer = document.querySelector('.topHeaderTime')

dateContainer.textContent = date

// displaying the hamburgermenu icon

const iconHamburger = document.querySelector('.hamburger')
const addTable = document.getElementById('addTable')

//displaying the side panel and
const sidePanel = document.querySelector('.main__sideSlide')

const noFood = document.querySelector('.main__sideSlide__container__noFood')

iconHamburger.addEventListener('click', () => {
    iconHamburger.classList.toggle('is-active')
    addTable.classList.toggle('display')
    sidePanel.classList.toggle('active-side')
})

//Menu links variables
const homeLink = document.querySelector('#homeLink')
const menuLink = document.querySelector('#menuLink')
const paymentLink = document.querySelector('#paymentLink')

//Buttons for floor variables

const btnFloor1 = document.querySelector('#firstFloor')
const btnFloor2 = document.querySelector('#secondFloor')

//Displaying the bottom select and continue  for the Homepage Menu
const bottom = document.querySelector('.main__bottom')

const tableSelected = document.querySelectorAll(
    '.main__rightSide__container__table--label'
)

const tablesContent = document.querySelector('.main__rightSide')

tableSelected.forEach((table) => {
    table.addEventListener('click', (e) => {
        bottom.classList.remove('display')
        // tablesContent.style.height = '77vh'
    })
})

//Defining localhost or website server

const port = '58642'
// const localHost = `http://127.0.0.1:${port}`
const localHost = `https://www.alexandersstudio.uk/pos`

// Initializing the app

document.addEventListener('DOMContentLoaded', activeMenuLinks)

function activeMenuLinks() {
    if (`${localHost}/public/index.html` == location.href) {
        homeLink.classList.add('linkActive')
    }

    if (`${localHost}/public/menu.html` == location.href) {
        menuLink.classList.add('linkActive')
    }
    if (`${localHost}/public/payment.html` == location.href) {
        paymentLink.classList.add('linkActive')
    }
}

// // Checking buttos active tab tale list
// btnFloor1.addEventListener('click', () => {
//     btnFloor1.classList.add('floorActive')
//     btnFloor2.classList.remove('floorActive')
// })
// btnFloor2.addEventListener('click', () => {
//     btnFloor1.classList.remove('floorActive')
//     btnFloor2.classList.add('floorActive')
// })

//counter functionality

const counter = document.querySelectorAll('.counter')

let detailsGuess = {
    order: '',
    guess: 1,
    table: '',
    orders: [],
}

//selecting the id

const idTable = document.querySelectorAll('.img__table')
let tableNumber

idTable.forEach((item) => {
    item.addEventListener('click', (e) => {
        //Getting Table Number
        detailsGuess.guess = 1
        tableNumber = e.target.closest('.main__rightSide__container__table')
            .children[0].id
        detailsGuess.table = tableNumber

        selectDetails(detailsGuess)
    })
})

counter.forEach((item) => {
    item.addEventListener('click', counterFun(item))
})

function counterFun(item) {
    let valueIncrease = 1
    let reduceNumber

    item.addEventListener('click', (e) => {
        valueIncrease++
        reduceNumber--

        const target = e.target.closest('.counter')

        //Getting the ID counter
        let targetId = `#${target.id}`

        const targetSel = document.querySelector(targetId)

        const plus = target.children[2]
        const minus = target.children[0]

        const valueBtn = targetSel.children[1]

        //Manipulating the DOM with values
        plus.addEventListener('click', () => {
            detailsGuess.guess = Number(valueIncrease)
            detailsGuess.table = tableNumber
            valueBtn.value = valueIncrease
            valueBtn.textContent = valueIncrease
            reduceNumber = valueIncrease
        })

        minus.addEventListener('click', () => {
            if (reduceNumber > 0) {
                valueBtn.value = reduceNumber
                valueBtn.textContent = reduceNumber
                valueIncrease = reduceNumber
                detailsGuess.guess = Number(valueIncrease)
                detailsGuess.table = tableNumber
            }
        })
        selectDetails(detailsGuess)
    })
}

// Changing the DOM values in the selection box

const mainContainer = document.querySelector('.main__bottom')

function selectDetails(details) {
    clearHtml(mainContainer)

    const detailsContainer = document.createElement('div')
    detailsContainer.classList.add('main__bottom__container')

    const { guess, table } = details

    detailsContainer.innerHTML = `
    
   
        <div class="main__bottom__container__details">
                <div class="tableDetails">
                    <img src="./img/small-table-icon.svg" />
                    <p class="tableDetails--table">
                        table:
                    </p>
                    <p class="tableDetails--number">${table}</p>
                </div>
                <div class="tableGuess">
                    <img src="./img/guess-dark.svg" />
                    <p class="tableGuess--table">Guess:</p>
                    <p class="tableGuess--number">${guess}</p>
                </div>
            
            </div>
            <div class="main__bottom__container__continue">
            
                <button
                    class="btn btn-select" id="selectionTable"
                    type="submit"
                >
                    select and continue
                </button>
       </div>
       
    `

    mainContainer.appendChild(detailsContainer)

    const buttonSelection = document.querySelector('.btn-select')

    buttonSelection.addEventListener('click', () => {
        detailsGuess.order = Math.floor(Math.random() * 85) + 1876259

        localStorage.setItem('reference', JSON.stringify(detailsGuess))
        window.location = './menu.html'
    })
}

export function clearHtml(section) {
    while (section.firstChild) {
        section.removeChild(section.firstChild)
    }
}
