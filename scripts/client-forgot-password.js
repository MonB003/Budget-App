function redirectLogin() {
    window.location.replace("/");
}

var accountID = 0;

async function getSecurityQuestions() {
    let email = document.getElementById("email").value;

    const dataSent = {
        email
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
    const postResponse = await fetch('/get-security-questions', postDetails);
    const jsonData = await postResponse.json();

    document.getElementById("emailInputMsg").innerHTML = jsonData.msg;

    if (jsonData.status == "Success") {
        // Store account ID
        accountID = jsonData.acctID;

        // Show security questions form
        document.getElementById("securityFormDiv").style.display = "block";

        let securityQsResults = jsonData.securityResult;
        let selectQ1 = securityQsResults.securityQ1;
        let selectQ2 = securityQsResults.securityQ2;

        // Select the users questions as default
        document.getElementById(selectQ1).setAttribute("selected", "selected");
        document.getElementById(selectQ2).setAttribute("selected", "selected");
    }
}



async function checkSecurityAnswers() {
    // let email = document.getElementById("email").value;
    // let question1 = document.getElementById("question1").textContent;
    let q1Dropdown = document.getElementById("question1");
    let answer1 = document.getElementById("answer1").value;
    // let question2 = document.getElementById("question2").textContent;
    let q2Dropdown = document.getElementById("question2");
    let answer2 = document.getElementById("answer2").value;

    let question1 = q1Dropdown.options[q1Dropdown.selectedIndex].value;
    let question2 = q2Dropdown.options[q2Dropdown.selectedIndex].value;

    // console.log(question1)
    // console.log(answer1)
    // console.log(question2)
    // console.log(answer2)

    const dataSent = {
        accountID,
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
    const postResponse = await fetch('/check-security-answers', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        // document.getElementById("errorMsg").innerHTML = jsonData.msg;

        // let securityDiv = document.getElementById("page");
        // securityDiv.scrollTop = securityDiv.scrollHeight;

        await loginAfterSecurityVerified();

    } else {
        document.getElementById("errorMsg").innerHTML = jsonData.msg;
    }

}


async function loginAfterSecurityVerified() {
    const dataSent = {
        accountID
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
    const postResponse = await fetch('/verified-security-login', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        window.location.replace("/main");
    }
}