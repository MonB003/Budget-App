// Account section
function showAccount() {
    let accountDiv = document.getElementById('accountDiv');
    accountDiv.style.display = "flex";

    let securityDiv = document.getElementById('securityDiv');
    securityDiv.style.display = "none";

    let budgetDiv = document.getElementById('budgetDiv');
    budgetDiv.style.display = "none";

    let moneyEarnedDiv = document.getElementById('moneyEarnedDiv');
    moneyEarnedDiv.style.display = "none";

    let moneySpentCategoriesDiv = document.getElementById('moneySpentCategoriesDiv');
    moneySpentCategoriesDiv.style.display = "none";
}


async function updateAccount() {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;
    let username = document.getElementById('username').value;
    let birthday = document.getElementById('birthday').value;
    let budget = document.getElementById('budget').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let validBudget = budget > 0 && budget < 1000000001;


    // If one or more fields are empty
    if (containsEmptyFields()) {
        document.getElementById('errorMsg').textContent = "All fields must be filled out.";
        return;
    }

    // If bugdet is not valid
    if (!validBudget) {
        document.getElementById("errorMsg").innerHTML = "Budget must be between 1 and 1000000000.";
        document.getElementById("budget").style.borderBottom = "1px solid red";
        return;
    }


    // Store user's data that was filled into the text fields on the page
    const dataSent = {
        firstName,
        lastName,
        username,
        birthday,
        budget,
        email,
        password
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
    const postResponse = await fetch('/update-account', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Fail") {
        let errorField = jsonData.field;
        document.getElementById(errorField).style.border = "1px solid red";
        document.getElementById('errorMsg').textContent = jsonData.msg;

    } else {
        document.getElementById('errorMsg').textContent = jsonData.msg;
        document.getElementById('errorMsg').style.color = "black";
    }
};


// Checks if any of the text fields are empty before user signs up
function containsEmptyFields() {
    let formInputs = document.querySelectorAll(".account-input");
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



// Security section
function showSecurity() {
    let accountDiv = document.getElementById('accountDiv');
    accountDiv.style.display = "none";

    let securityDiv = document.getElementById('securityDiv');
    securityDiv.style.display = "flex";

    let budgetDiv = document.getElementById('budgetDiv');
    budgetDiv.style.display = "none";

    let moneyEarnedDiv = document.getElementById('moneyEarnedDiv');
    moneyEarnedDiv.style.display = "none";

    let moneySpentCategoriesDiv = document.getElementById('moneySpentCategoriesDiv');
    moneySpentCategoriesDiv.style.display = "none";
}



// Shows appropriate security option in settings sidebar depending on if security answers exist or not with this user's account
async function checkSecurityAnswersExist() {

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/check-security-answers-exists', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {

        let securityResult = jsonData.securityResult;
        let question1Option = securityResult.securityQ1;
        let question2Option = securityResult.securityQ2;
        let answer1 = securityResult.securityA1;
        let answer2 = securityResult.securityA2;

        // Select the users questions as default
        document.getElementById(question1Option).setAttribute("selected", "selected");
        document.getElementById(question2Option).setAttribute("selected", "selected");

        document.getElementById("answer1").value = answer1;
        document.getElementById("answer2").value = answer2;

        document.getElementById("securityUpdateBtn").style.display = "block";
        document.getElementById("securityBtn").style.display = "none";
        document.getElementById("securityInstr").style.display = "none";

    } else {
        document.getElementById("securityUpdateBtn").style.display = "none";
        document.getElementById("securityBtn").style.display = "block";
        document.getElementById("securityInstr").style.display = "block";
    }
}
checkSecurityAnswersExist();


async function saveSecurityAnswers() {
    let q1Dropdown = document.getElementById("question1");
    let answer1 = document.getElementById("answer1").value;
    let q2Dropdown = document.getElementById("question2");
    let answer2 = document.getElementById("answer2").value;

    let question1 = q1Dropdown.options[q1Dropdown.selectedIndex].value;
    let question2 = q2Dropdown.options[q2Dropdown.selectedIndex].value;

    // If answer input value is empty
    if (answer1 == "" || answer2 == "") {
        document.getElementById("securityErrorMsg").innerHTML = "Please fill in answers to both questions.";
        return;
    }

    const dataSent = {
        question1,
        answer1,
        question2,
        answer2
    };

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get response from server side post request
    const postResponse = await fetch('/save-security-answers', postDetails);
    const jsonData = await postResponse.json();

    document.getElementById("securityErrorMsg").innerHTML = jsonData.msg;

    // Change the save button to update so users don't create multiple sets of security answers
    document.getElementById("securityUpdateBtn").style.display = "block";
    document.getElementById("securityBtn").style.display = "none";
    document.getElementById("securityInstr").style.display = "none";
}



async function updateSecurityAnswers() {
    let q1Dropdown = document.getElementById("question1");
    let answer1 = document.getElementById("answer1").value;
    let q2Dropdown = document.getElementById("question2");
    let answer2 = document.getElementById("answer2").value;

    let question1 = q1Dropdown.options[q1Dropdown.selectedIndex].value;
    let question2 = q2Dropdown.options[q2Dropdown.selectedIndex].value;

    if (answer1 == "" || answer2 == "") {
        document.getElementById("securityErrorMsg").innerHTML = "Please fill in answers to both questions.";
        return;
    }

    const dataSent = {
        question1,
        answer1,
        question2,
        answer2
    };

    // Details for post request
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(dataSent)
    };

    // Get response from server side post request
    const postResponse = await fetch('/update-security-answers', postDetails);
    const jsonData = await postResponse.json();

    document.getElementById("securityErrorMsg").innerHTML = jsonData.msg;
}



// Budget section
async function showBudget() {
    let accountDiv = document.getElementById('accountDiv');
    accountDiv.style.display = "none";

    let securityDiv = document.getElementById('securityDiv');
    securityDiv.style.display = "none";

    let budgetDiv = document.getElementById('budgetDiv');
    budgetDiv.style.display = "flex";

    let moneyEarnedDiv = document.getElementById('moneyEarnedDiv');
    moneyEarnedDiv.style.display = "none";

    let moneySpentCategoriesDiv = document.getElementById('moneySpentCategoriesDiv');
    moneySpentCategoriesDiv.style.display = "none";


    let totalSpent = await getTotalMoneySpent();
    let moneySpentMonthly = document.getElementById('moneySpentMonthly');
    moneySpentMonthly.textContent = totalSpent;

    let userBudget = document.getElementById('storedBudget').textContent;
    calculateBudgetDifference(totalSpent, userBudget);
}

async function getTotalMoneySpent() {
    const postDetails = {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    };

    // Get response from server side post request
    const postResponse = await fetch('/all-this-users-purchases', postDetails);
    const jsonData = await postResponse.json();

    // Get today's month
    let today = new Date();
    let monthToday = (today.getMonth() + 1);

    let allPurchases = jsonData.thisUsersPurchases;

    let totalMoneySpent = 0;

    // Get each purchase's data
    for (let index = 0; index < allPurchases.length; index++) {
        let currPurchase = allPurchases[index];

        // Get purchase month
        let purchaseDate = new Date(currPurchase.date);
        let purchaseMonth = (purchaseDate.getMonth() + 1);

        // If purchase is from this month, add the purchase price to the sum
        if (purchaseMonth == monthToday) {
            let purchasePrice = currPurchase.price;
            totalMoneySpent += purchasePrice;
        }
    }

    return totalMoneySpent;
}

function getMonthString(monthNum) {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
        "October", "November", "December"
    ];
    let monthString = "January";

    // Checks which number matches the current month
    for (let m = 0; m < months.length; m++) {
        if (m == monthNum) {
            // Save current month
            monthString = months[m];
        }
    }

    return monthString;
}


function calculateBudgetDifference(moneySpent, budget) {
    let difference = 0;
    let moneyLeft = false;

    if (moneySpent < budget) {
        difference = budget - moneySpent;
        moneyLeft = true;

    } else if (moneySpent > budget) {
        difference = moneySpent - budget;

    } else {
        // Money spent equals the budget
        difference = 0;
    }

    let differenceRounded = difference.toFixed(2);

    let userMoneyDiff = document.getElementById('userMoneyDiff');

    if (moneyLeft) {
        userMoneyDiff.textContent = "Money left to spend: $" + differenceRounded;
    } else {
        userMoneyDiff.textContent = "You have exceeded your budget by $" + differenceRounded;
    }
}



// Money earned section
async function showMoneyEarned() {
    let accountDiv = document.getElementById('accountDiv');
    accountDiv.style.display = "none";

    let securityDiv = document.getElementById('securityDiv');
    securityDiv.style.display = "none";

    let budgetDiv = document.getElementById('budgetDiv');
    budgetDiv.style.display = "none";

    let moneyEarnedDiv = document.getElementById('moneyEarnedDiv');
    moneyEarnedDiv.style.display = "flex";

    let moneySpentCategoriesDiv = document.getElementById('moneySpentCategoriesDiv');
    moneySpentCategoriesDiv.style.display = "none";
}

async function updateMoneySaved() {
    let moneyEarned = document.getElementById('moneyEarned').value;

    let validMoneyInput = moneyEarned > 0 && moneyEarned < 1000000001;

    if (moneyEarned == "") {
        document.getElementById('errorMsgMoneyEarned').textContent = "Money earned field must be filled out.";

    } else if (!validMoneyInput) {
        document.getElementById("errorMsgMoneyEarned").innerHTML = "Money inputted must be between 1 and 1000000000.";

    } else {
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

        if (jsonData.status == "Fail") {
            document.getElementById('errorMsgMoneyEarned').textContent = jsonData.msg;
        } else {
            document.getElementById('storedMoneyEarned').textContent = jsonData.totalMoneySaved;
            document.getElementById('errorMsgMoneyEarned').textContent = "";
            document.getElementById('moneyEarned').value = "";
        }
    }
}



// Money spent by category section
async function showMoneySpentCategories() {
    let accountDiv = document.getElementById('accountDiv');
    accountDiv.style.display = "none";

    let securityDiv = document.getElementById('securityDiv');
    securityDiv.style.display = "none";

    let budgetDiv = document.getElementById('budgetDiv');
    budgetDiv.style.display = "none";

    let moneyEarnedDiv = document.getElementById('moneyEarnedDiv');
    moneyEarnedDiv.style.display = "none";

    let moneySpentCategoriesDiv = document.getElementById('moneySpentCategoriesDiv');
    moneySpentCategoriesDiv.style.display = "flex";
}

async function getMoneySpentByCategory() {
    let categoriesArray = ["Housing", "Food", "Transportation", "Health", "Bills", "Loans", "Entertainment", "Miscellaneous"];

    for (let index = 0; index < categoriesArray.length; index++) {
        let category = categoriesArray[index];

        let dataSent = {
            category
        };

        // Additional details needed when sending data to server side
        let postDetails = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataSent)
        };

        // Get response from server side post request
        let postResponse = await fetch('/get-category-purchases', postDetails);
        let jsonData = await postResponse.json();

        let categoryPurchases = jsonData.thisCategoryPurchases;
        let purchaseCount = categoryPurchases.count;

        let categoryName = document.createElement("h4");
        categoryName.textContent = "Category: " + category;
        categoryName.setAttribute("class", "category-name");

        let categoryCount = document.createElement("p");
        categoryCount.textContent = "Number of Purchases: " + purchaseCount;
        categoryCount.setAttribute("class", "category-count");

        let categoryDiv = document.createElement("div");
        let categoryDivID = category + "Div";
        categoryDiv.setAttribute("id", categoryDivID);
        document.getElementById('categoriesCountDiv').appendChild(categoryDiv);
        document.getElementById(categoryDivID).appendChild(categoryName);
        document.getElementById(categoryDivID).appendChild(categoryCount);

    }
}
getMoneySpentByCategory();