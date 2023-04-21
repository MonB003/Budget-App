// Creates HTML elements for each of this user's purchases returned from the database
async function displayAllPurchases() {
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/all-this-users-purchases', postDetails);
    const jsonData = await postResponse.json();

    let allPurchases = jsonData.thisUsersPurchases;

    // Get each purchase's data
    for (let index = 0; index < allPurchases.length; index++) {
        let currPurchase = allPurchases[index];

        let purchaseDate = new Date(currPurchase.date);
        let purchaseDateFormatted = purchaseDate.getFullYear() + '-' + (purchaseDate.getMonth() + 1) + '-' + purchaseDate.getDate();

        let purchaseTemplate = document.getElementById("purchaseTemplate");
        let allPurchasesDiv = document.getElementById("allPurchasesDiv");
        let purchaseDiv = purchaseTemplate.content.cloneNode(true);
        purchaseDiv.querySelector(".purchaseDiv").id = "purchaseDiv" + currPurchase.purchaseID;
        purchaseDiv.querySelector(".purchase-price").id = "purchase-price-" + currPurchase.purchaseID;
        purchaseDiv.getElementById("purchase-price-" + currPurchase.purchaseID).innerHTML = "$" + currPurchase.price;

        purchaseDiv.querySelector(".purchase-item").id = "purchase-item-" + currPurchase.purchaseID;
        purchaseDiv.getElementById("purchase-item-" + currPurchase.purchaseID).innerHTML = currPurchase.item;

        purchaseDiv.querySelector(".purchase-expense").id = "purchase-expense-" + currPurchase.purchaseID;
        purchaseDiv.getElementById("purchase-expense-" + currPurchase.purchaseID).innerHTML = "Expense: " + currPurchase.expenseType;

        purchaseDiv.querySelector(".purchase-date").id = "purchase-date-" + currPurchase.purchaseID;
        purchaseDiv.getElementById("purchase-date-" + currPurchase.purchaseID).innerHTML = "<b>Purchased on: </b>" + purchaseDateFormatted;

        let savedTime = new Date(currPurchase.time);
        let savedDate = savedTime.getFullYear() + '-' + (savedTime.getMonth() + 1) + '-' + savedTime.getDate();
        let savedTimeFormatted = getTimeFormat(savedTime);
        purchaseDiv.querySelector(".purchase-time").id = "purchase-time-" + currPurchase.purchaseID;
        purchaseDiv.getElementById("purchase-time-" + currPurchase.purchaseID).innerHTML = "<b>Saved on: </b>" + savedDate + " <b>at</b> " + savedTimeFormatted;

        purchaseDiv.querySelector(".remove-purchase-btn").setAttribute("onclick", "showRemovePopup(" + currPurchase.purchaseID + ")");
        allPurchasesDiv.appendChild(purchaseDiv);
    }

}
displayAllPurchases();


// Formats the time returned from the database
function getTimeFormat(time) {
    let hours = time.getHours();
    let period = "am";
    if (time.getHours() > 12) {
        hours = time.getHours() - 12;
        period = "pm";
    }

    let seconds = time.getSeconds();
    if (time.getSeconds() < 10) {
        seconds = "0" + time.getSeconds();
    }

    let timeFormat = hours + ":" + seconds + period;
    return timeFormat;
}



// When the cancel button is clicked in confirm remove purchase popup
function cancelRemove() {
    let removePurchaseDiv = document.getElementById('removePurchaseDiv');
    removePurchaseDiv.style.display = "none";
}

// Makes the confirm remove purchase popup div visible
function showRemovePopup(purchaseID) {
    let removePurchaseDiv = document.getElementById('removePurchaseDiv');
    removePurchaseDiv.style.display = "block";
    document.getElementById("removeMsgBtn").setAttribute("onclick", "removePurchase(" + purchaseID + ")");
}

async function removePurchase(purchaseID) {
    const dataSent = {
        purchaseID
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
    const postResponse = await fetch('/remove-purchase', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        // Hide popup
        let removePurchaseDiv = document.getElementById('removePurchaseDiv');
        removePurchaseDiv.style.display = "none";

        // Remove HTML element for that purchase
        document.getElementById("purchaseDiv" + purchaseID).remove();
    }
}