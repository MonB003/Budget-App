// Validates email and password entered when login button is clicked
async function login() {
    // Get user's email and password
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    const dataSent = {
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

    // Get response from server side post request
    const postResponse = await fetch('/login', postDetails);
    const jsonData = await postResponse.json();

    if (jsonData.status == "Success") {
        window.location.replace("/main");
    } else {
        document.getElementById("errorMsg").innerHTML = jsonData.msg;
    }

};


// Redirects to signup page for new users
function signupPage() {
    window.location.replace("/signup");
}

// If user forgets their password
function forgotPassword() {
    window.location.replace("/forgot-password");
}