function homePage() {
    window.location.replace("/");
}

function settingsPage() {
    window.location.replace("/settings");
}

function newPurchasePage() {
    window.location.replace("/new-purchase");
}

function allPurchasesPage() {
    window.location.replace("/all-purchases");
}

function helpPage() {
    window.location.replace("/help");
}



// *Mobile screen vertical circle menubar*

// Current menubar status
var navbarOpen = false;

// When menubar is clicked, check current status and change it to the opposite
function menubarStatus() {
    navbarOpen = (navbarOpen == true ? false : true);

    if (navbarOpen) {
        openMenubar();
    } else {
        closeMenubar();
    }
}

// Expand menubar to view options
function openMenubar() {
    let navbarMenu = document.getElementById("dropdownNavbar");
    navbarMenu.style.display = "flex";
    navbarMenu.style.flexDirection = "column";

    document.getElementById("vertMenuIcon").style.color = "white";
    document.getElementById("dropdownNavbarDiv").style.backgroundColor = "#D5B9B2";
}

// Close menubar
function closeMenubar() {
    document.getElementById("dropdownNavbar").style.display = "none";
    document.getElementById("dropdownNavbarDiv").style.background = "none";
    
    document.getElementById("vertMenuIcon").style.color = "black";
}
