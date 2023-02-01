const btnContainer = document.querySelector('.btn-container')
const previousBtn = document.querySelector('.btn-prev')
const nextBtn = document.querySelector('.btn-next')
const submitBtn = document.querySelector('.btn-submit')
const checkBox = document.querySelectorAll('.checkbox-input')
const tabTargets = document.querySelectorAll('.tab')
const tabPanels = document.querySelectorAll('.tabpanel')
const textInput = document.querySelectorAll('.text-input')
const nameError = document.querySelector('[data-name-error]')
const emailError = document.querySelector('[data-email-error]')
const phoneError = document.querySelector('[data-phone-error]')
const switcher = document.querySelector('.toggle')
const plans = document.querySelectorAll('.plan')
const addOns = document.querySelectorAll('.add-service')
const total = document.querySelector('.total b')
const totalText = document.querySelector('.total span')
const planPrice = document.querySelector('.plan-price')

let year
let currentStep = 0 
const formData = {
  plan: null,
  type: null,
  price: null,
}

// Next: Change UI relative to current step and account for button permissions
nextBtn.addEventListener('click', (event) => {
  event.preventDefault()
  // Make sure the first 2 steps are filled in
  if (currentStep === 0) {
    validateInputText()
    validatePersonalInfo()
  } else {
    hideCurrentTab()
    showNextTab()
    updateStatusDisplay()
    setTotal()
    formSummary(formData)
  }
})

// Previous: Change UI relative to current step and account for button permissions
previousBtn.addEventListener('click', (event) => {
  event.preventDefault()
  hideCurrentTab()
  showPreviousTab()
  updateStatusDisplay()
})

// Submit: Change UI to a thanks tab
submitBtn.addEventListener('click', (event) => {
  event.preventDefault()
  btnContainer.classList.add('hidden')
  hideCurrentTab()
  tabPanels[currentStep + 1].classList.remove('hidden')
})

// Select a plan when clicked
plans.forEach((plan) => {
  plan.addEventListener('click', () => {
    document.querySelector('.selected').classList.remove('selected')
    plan.classList.add('selected')
    const planName = plan.querySelector('b')
    const planPrice = plan.querySelector('.plan-priced')
    formData.plan = planName
    formData.price = planPrice
  })
})

switcher.addEventListener('click', () => {
  const toggle = switcher.querySelector('input').checked
  if (toggle) {
    document.querySelector('.monthly').classList.remove('toggle-active')
    document.querySelector('.yearly').classList.add('toggle-active')
  } else {
    document.querySelector('.monthly').classList.add('toggle-active')
    document.querySelector('.yearly').classList.remove('toggle-active')
  }
  switchPrice(toggle)
  formData.type = toggle
})

addOns.forEach((addon) => {
  addon.addEventListener('click', (e) => {
    const addonSelect = addon.querySelector('input')
    const addonID = addon.getAttribute('data-id')
    if (addonSelect.checked) {
      addonSelect.checked = false
      addon.classList.remove('ad-selected')
      showAddon(addonID, false)
    } else {
      addonSelect.checked = true
      addon.classList.add('ad-selected')
      showAddon(addon, true)
      e.preventDefault()
    }
  })
})

function hideCurrentTab() {
  tabPanels[currentStep].classList.add('hidden')
  tabTargets[currentStep].classList.remove('current-tab')
}

function showNextTab() {
  tabPanels[currentStep + 1].classList.remove('hidden')
  tabTargets[currentStep + 1].classList.add('current-tab')
  currentStep += 1
}

function showPreviousTab() {
  tabPanels[currentStep - 1].classList.remove('hidden')
  tabTargets[currentStep - 1].classList.add('current-tab')
  currentStep -= 1
}

function updateStatusDisplay() {
  // If on the last step, hide the next button and show submit
  if (currentStep === tabPanels.length - 2) {
    nextBtn.classList.add('hidden')
    previousBtn.classList.remove('invisible')
    submitBtn.classList.remove('hidden')

    // If it's the first step hide the previous button
  } else if (currentStep == 0) {
    nextBtn.classList.remove('hidden')
    previousBtn.classList.add('invisible')
    submitBtn.classList.add('hidden')

    // In all other instances display previous & next buttons
  } else {
    nextBtn.classList.remove('hidden')
    previousBtn.classList.remove('invisible')
    submitBtn.classList.add('hidden')
  }
}

// Make sure all fields are filled out
function validatePersonalInfo() {
  if (nameError.classList.contains('hidden') && emailError.classList.contains('hidden') && phoneError.classList.contains('hidden')) {
    hideCurrentTab()
    currentStep = 1
    tabPanels[currentStep].classList.remove('hidden')
    tabTargets[currentStep].classList.add('current-tab')
    updateStatusDisplay()
  }
}

// Display an error if an input text is empty
function validateInputText() {
  textInput.forEach(input => {
    const msg = input.previousElementSibling
    if (!input.value) {
      msg.classList.remove('hidden')
      input.style.border = '1px solid red'
    } else {
      msg.classList.add('hidden')
      input.style.borderColor = 'hsl(229, 24%, 87%)'
    }
  })
}

// Display all the data collected in step 4
function formSummary(formData) {
  const planName = document.querySelector('.plan-name')
  const planPrice = document.querySelector('.plan-price')
  planPrice.innerHTML = `${formData.price.innerText}`
  planName.innerHTML = `${formData.plan.innerText} (${
    formData.type ? 'Yearly' : 'Monthly'
  })`
}

function showAddon(adOn, selected) {
  const temp = document.getElementsByTagName('template')[0]
  const clone = temp.content.cloneNode(true)
  const serviceName = clone.querySelector('.service-name')
  const servicePrice = clone.querySelector('.service-price')
  const serviceID = clone.querySelector('.selected-addon')
  // Display addon if it is selected
  if (adOn && selected) {
    serviceName.innerText = adOn.querySelector('.addon-name').innerText
    servicePrice.innerText = adOn.querySelector('.addon-priced').innerText
    serviceID.setAttribute('data-id', adOn.dataset.id)
    document.querySelector('.addons').appendChild(clone)
  } else {
    const addons = document.querySelectorAll('.selected-addon')
    addons.forEach((addon) => {
      const attr = addon.getAttribute('data-id')
      if (attr == adOn) {
        addon.remove()
      }
    })
  }
}

// Toggle between yearly & monthly prices
function switchPrice(checked) {
  const planYearlyPrice = [90, 120, 150]
  const planMonthlyPrice = [9, 12, 15]
  const addonMonthlyPrice = [1, 2, 2]
  const addonYearlyPrice = [10, 20, 20]
  const planPrices = document.querySelectorAll('.plan-priced')
  const addonPrices = document.querySelectorAll('.addon-priced')
  if (checked) {
    planPrices[0].innerHTML = `$${planYearlyPrice[0]}/yr`
    planPrices[1].innerHTML = `$${planYearlyPrice[1]}/yr`
    planPrices[2].innerHTML = `$${planYearlyPrice[2]}/yr`
    addonPrices[0].innerHTML = `$${addonYearlyPrice[0]}/yr`
    addonPrices[1].innerHTML = `$${addonYearlyPrice[1]}/yr`
    addonPrices[2].innerHTML = `$${addonYearlyPrice[2]}/yr`
    setYear(true)
  } else {
    planPrices[0].innerHTML = `$${planMonthlyPrice[0]}/mo`
    planPrices[1].innerHTML = `$${planMonthlyPrice[1]}/mo`
    planPrices[2].innerHTML = `$${planMonthlyPrice[2]}/mo`
    addonPrices[0].innerHTML = `$${addonMonthlyPrice[0]}/mo`
    addonPrices[1].innerHTML = `$${addonMonthlyPrice[1]}/mo`
    addonPrices[2].innerHTML = `$${addonMonthlyPrice[2]}/mo`
    setYear(false)
  }
}

// Calculate the total based on the inputs
function setTotal() {
  const str = planPrice.innerHTML
  const res = str.replace(/\D/g, '')
  const addonPrices = document.querySelectorAll(
    '.selected-addon .service-price'
  )
  
  // Add all the add-on prices
  let totalPrice = 0
  for (let i = 0; i < addonPrices.length; i++) {
    const str = addonPrices[i].innerHTML
    const res = str.replace(/\D/g, "")

    totalPrice += Number(res)
  }
  totalText.innerHTML = `Total ${year?'(per year)':'(per month)'}`
  total.innerHTML = `$${totalPrice + Number(res)}/${year?'yr':'mo'}`
}

// Return true if the year is set up
function setYear(t) {
  return year = t
}
