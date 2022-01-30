// This function will display the specified tab of the form and fix the Previous/Next buttons
const showTab = (n) => {
    const x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == 0) {
        document.getElementById("prevBtn").style.display = "none";
    } else {
        document.getElementById("prevBtn").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // Run a function that displays the correct step indicator
    fixStepIndicator(n)
}

// This function removes the "active" class of all steps
const fixStepIndicator = n => {
    const x = document.getElementsByClassName("step");
    for (let i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    // Adds the "active" class to the current step:
    x[n].className += " active";
}

// This function will figure out which tab to display
const nextPrev = n => {
    const x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid
    if ( n == 1 && !validateForm() ) {
        return false;
    }
    if ( n == 1 && currentTab == 1 && !ValidateEmail(document.getElementById('email')) ) {
        return false;
    }
    // Hide the current tab
    x[currentTab].style.display = "none";
    // Increase or decrease the current tab by 1
    currentTab = currentTab + n;
    // if you have reached the end of the form...
    if (currentTab >= x.length) {
        document.body.innerHTML = `<h1>Submiting was complette</h1>`;
        return false;
    }
    // Display the current tab
    showTab(currentTab);
    // Fill the last tab
    setRecapitulation();
}

// This function deals with validation of the form fields
const validateForm = () => {
    let x, y, i, valid = true;
    x = document.getElementsByClassName("tab");
    y = x[currentTab].getElementsByTagName("input");
    // A loop that checks every input field in the current tab except the first tab
    if(currentTab > 0 ){
        for (i = 0; i < y.length; i++) {
            // When a field is empty
            if (y[i].value == "" && currentTab >0) {
                // Add an "invalid" class to the field
                y[i].className += " invalid";
                // Set the current valid status to false:
                valid = false;
            }
        }
    }
    // If the valid status is true, mark the step as finished and valid:
    if (valid) {
        document.getElementsByClassName("step")[currentTab].className += " finish";
    }
    return valid; // return the valid status
}

// This function validate format of e-mail
function ValidateEmail(inputText)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.value.match(mailformat))
    {
        document.form1.email.focus();
        return true;
    }
    else
    {
        document.form1.email.focus();
        return false;
    }
}

// This function set a table of added products
const loadTableData = productsData => {
    const tableBody = document.getElementById('tableData');
    let dataHtml = '';
    let length = 0;
    // Set the total price
    totalPrice = 0;
    // Sets the cells of the table, amount of products a total price of added product
    for(let product of productsData){
        dataHtml += `<tr><td>${product.name}</td><td>${product.price}</td></tr>`;
        length++;
        totalPrice += Number(product.price);
    }
    tableBody.innerHTML = dataHtml;
    document.getElementById('numberOfProducts').innerHTML = `${length}`;
    document.getElementById('totalPrice').innerHTML = `${totalPrice}`;
}

// This function adds product name and its price and validate inputs
const addProduct = () => {
    const nameProduct = getValue('product');
    const priceProduct = getValue('price');
    // Chek if inputs are empty, when inputs are not empty, they are valid
    if(nameProduct == ''){
        document.getElementById('product').className += " invalid";
    } else {
        document.getElementById('product').classList.remove("invalid");
    }
    if(priceProduct == ''){
        document.getElementById('price').className += " invalid";
    } else{
        document.getElementById('price').classList.remove("invalid");
    }
    // If both inputs are valid, add product
    if(nameProduct != '' && priceProduct != ''){
        productsData.push({name: nameProduct, price: priceProduct});
        loadTableData(productsData);
    }
}
// Helping functions
const getValue = idName => document.getElementById(idName).value;
const setValue = (className, value) => document.getElementById(className).innerHTML = value;

// Set the last tab with data
const setRecapitulation = () => {
    setValue('s-fname',getValue('fname'));
    setValue('s-email',getValue('email'));
    setValue('s-adr',getValue('adr'));
    setValue('s-city',getValue('city'));
    setValue('s-state',getValue('state'));
    setValue('s-zip',getValue('zip'));
    setValue('s-price',`${parseFloat(totalPrice).toFixed(2)}`);
    setValue('s-price-vat',`${parseFloat(totalPrice*0.85).toFixed(2)}`);
    loadSelect();
    setShipPayment('shipment');
    setShipPayment('payment');
};

// This function load the data from kurzy.cz and set the price
const changePriceByCurrency = () => {
    let price = totalPrice;
    let thx = getValue('currency').toUpperCase();
    if(!thx.includes('CZK')){
        let current = window.kurzycz_listky_b6["kurzy"][thx]['dev_stred'];
        let unit = window.kurzycz_listky_b6["kurzy"][thx]['jednotka'];
        price = totalPrice*unit/current;
    }
        setValue('s-price',`${parseFloat(price).toFixed(2)}`);
        setValue('s-price-vat',`${parseFloat(price*0.85).toFixed(2)}`);
}

// This function load the data from kurzy.cz and set options of select
const loadSelect = () => {
    const currencies = Object.keys(window.kurzycz_listky_b6["kurzy"]);
    let currencySelect = `<option value='czk'>CZK</option>`;
    for(let currency of currencies){
        currencySelect += `<option value='${currency.toLowerCase()}'>${currency}</option>`;
    }
    document.getElementById('currency').innerHTML = currencySelect;
}

// this function read the data from radio buttons and sets them
const setShipPayment = name => {
    const radioButtons = document.querySelectorAll(`input[name=${name}]`);
    let selectedOne;
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            selectedOne = radioButton.value;
            break;
        }
    }
    document.getElementById(`${name}`).innerText = `${selectedOne}`;
};

// Set initial conditions
let currentTab = 0;
let productsData = [];
let totalPrice = 0;

//helps to load the table
window.onload = () => {loadTableData(productsData);setRecapitulation();loadSelect();setShipPayment('shipment');setShipPayment('payment');}
// Display the current tab
showTab(currentTab);
