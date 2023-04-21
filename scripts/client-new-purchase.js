// Cheks amount of money user has before making a purchase, as well as test cases for input values
async function checkUserMoneyAmt() {
    // If there's empty input fields
    if (containsEmptyFields()) {
        document.getElementById("errorMsg").innerHTML = "Please fill out all fields.";
        return;
    }


    let price = document.getElementById("price").value;
    let validPrice = price > 0 && price < 1000000001;

    // If price inputted is invalid
    if (!validPrice) {
        document.getElementById("errorMsg").innerHTML = "Price must be between 1 and 1000000000.";
        document.getElementById("price").style.borderBottom = "1px solid red";
        return;
    }


    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/get-this-users-budget', postDetails);
    const jsonData = await postResponse.json();

    let userResult = jsonData.thisUsersBudget;
    let usersMoneySaved = userResult.moneySaved;

    // Make popup div visible
    let popupBudgetComparison = document.getElementById('popupBudgetComparison');
    popupBudgetComparison.style.display = "block";

    // If purchase amount is less than the amount of money the user has, they cannot purchase it
    if (price > usersMoneySaved) {
        document.getElementById("popupErrorMsg").style.display = "block";
        document.getElementById("popupErrorMsg").textContent = "You do not have enough money to make this purchase. The purchase could not be complete. To add money you've earned to your account, go to the Settings page.";
        document.getElementById("popupMoneyMsg").style.display = "none";

        document.getElementById("okBtn").setAttribute("onclick", "purchaseDenied()");

    } else {
        // User has enough money, so get the remaining difference
        let difference = usersMoneySaved - price;

        document.getElementById("popupMoneyMsg").style.display = "block";
        document.getElementById("popupMoneyLeft").textContent = difference;
        document.getElementById("popupErrorMsg").style.display = "none";

        document.getElementById("okBtn").setAttribute("onclick", "addPurchase()");
    }
}


// Adds a purchase to the database
async function addPurchase() {
    let item = document.getElementById("item").value;
    let expenseType = document.getElementById("expenseType").value;
    let date = document.getElementById("date").value;
    let price = document.getElementById("price").value;

    let validPrice = price > 0 && price < 1000000001;

    const dataSent = {
        item,
        expenseType,
        date,
        price
    };

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    if (containsEmptyFields()) {
        document.getElementById("errorMsg").innerHTML = "Please fill out all fields.";

    } else if (!validPrice) {
        document.getElementById("errorMsg").innerHTML = "Price must be between 1 and 1000000000.";
        document.getElementById("price").style.borderBottom = "1px solid red";

    } else {
        // Get response from server side post request
        const postResponse = await fetch('/add-purchase', postDetails);
        const jsonData = await postResponse.json();

        if (jsonData.status == "Success") {
            updateMoneySpent(price);
        } else {
            document.getElementById("errorMsg").innerHTML = jsonData.msg;
        }
    }
};


// Checks if any of the text fields are empty before user adds a purchase
function containsEmptyFields() {
    let formInputs = document.querySelectorAll(".new-purchase-input");
    let checkEmptyInput = false;

    // Check for empty input fields
    for (i = 0; i < formInputs.length; i++) {
        let currInput = formInputs[i];

        if (currInput.value == "") {
            checkEmptyInput = true;
            currInput.style.borderBottom = "1px solid red";

        } else {
            currInput.style.borderBottom = "1px solid lightgrey";
        }
    }

    return checkEmptyInput;
}



// Updates user's money spent in the database
async function updateMoneySpent(price) {
    const dataSent = {
        price
    };

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };


    // Get response from server side post request
    const postResponse = await fetch('/update-money-spent', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        // Get negative value of price so it can be subtracted from the current user's saved money
        let moneyEarned = -price;
        console.log(moneyEarned)
        updateMoneySaved(moneyEarned);
    } else {
        document.getElementById("errorMsg").innerHTML = jsonData.msg;
    }
}


// Updates user's money saved in the database
async function updateMoneySaved(moneyEarned) {
    const dataSent = {
        moneyEarned
    };

    // Additional details needed when sending data to server side
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };


    // Get response from server side post request
    const postResponse = await fetch('/update-money-saved', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        window.location.replace("/main");
    }
}



// if purchase is invalid, ok button directs back to main page
function purchaseDenied() {
    window.location.replace("/main");
};


// When cancel button is clicked, close the popup div
function closePopup() {
    let popupBudgetComparison = document.getElementById('popupBudgetComparison');
    popupBudgetComparison.style.display = "none";
};