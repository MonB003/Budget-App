// When signup button is clicked
async function signup() {
    let firstName = document.getElementById("firstName").value;
    let lastName = document.getElementById("lastName").value;
    let username = document.getElementById("username").value;
    let birthday = document.getElementById("birthday").value;
    let budget = document.getElementById("budget").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let validBudget = budget > 0 && budget < 1000000001;

    const dataSent = {
        firstName,
        lastName,
        username,
        birthday,
        budget,
        email,
        password
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

    } else if (!validBudget) {
        document.getElementById("errorMsg").innerHTML = "Budget must be between 1 and 1000000000.";
        document.getElementById("budget").style.borderBottom = "1px solid red";

    } else {
        // Get response from server side post request
        const postResponse = await fetch('/signup', postDetails);
        const jsonData = await postResponse.json();

        if (jsonData.status == "Success") {
            window.location.replace("/main");
        } else {
            document.getElementById("errorMsg").innerHTML = jsonData.msg;
        }
    }
};


// Checks if any of the text fields are empty before user signs up
function containsEmptyFields() {
    let formInputs = document.querySelectorAll(".signup-input");
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


// function checkBirthdayFormat(birthday) {
//     // Format: year-month-day
//     // ####-##-##
//     // 10 character length
//     // Month + 1 must be < 13 (chars 5 & 6)
//     // Day must be < 32

//     let dateValid = true;

//     for (let index = 0; index < birthday.length; index++) {
//         let currChar = birthday[index];

//         // Dashes
//         if (index == 4 || index == 7) {
//             if (currChar != '-') {
//                 dateValid = false;
//                 console.log("Not a dash");
//             }
//         } else if (!Number.isInteger(currChar)) {
//             dateValid = false;
//             console.log("Not a number");
//         } 
//     }

//     return dateValid;
// }


// Redirects back to login page
function loginPage() {
    window.location.replace("/");
}