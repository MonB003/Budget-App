// Requires
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const {
    JSDOM
} = require('jsdom');

// Static paths
app.use('/images', express.static('./images'));
app.use('/pages', express.static('./pages'));
app.use('/scripts', express.static('./scripts'));
app.use('/styles', express.static('./styles'));

// MySQL Connection
const mysql = require("mysql2");
const connection = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "BudgetAppDB",
    multipleStatements: true
});

// Session details
app.use(session({
    secret: "budget secret",
    name: "budgetAppSessionID",
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));


// Home page on localhost:8000
app.get('/', function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        let home = fs.readFileSync("./pages/home.html", "utf8");

        res.set("Server", "Monicode Engine");
        res.set("X-Powered-By", "Monicode");
        res.send(home);
    }
});


// When a user tries to login
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    checkLoginData(req.body.email, req.body.password,
        function (userRecord) {
            if (userRecord == null) {
                // User login in unsuccessful
                res.send({
                    status: "Fail",
                    msg: "Account not found."
                });

            } else {
                // If user successfully logged in, create a session, store their data in the session
                req.session.loggedIn = true;
                req.session.userID = userRecord.id;
                req.session.firstName = userRecord.firstName;
                req.session.lastName = userRecord.lastName;
                req.session.username = userRecord.username;
                req.session.birthday = userRecord.birthday;
                req.session.budget = userRecord.budget;
                req.session.email = userRecord.email;
                req.session.password = userRecord.password;

                req.session.moneySaved = userRecord.moneySaved;
                req.session.moneySpent = userRecord.moneySpent;

                req.session.save(function (err) {
                    // session saved
                });

                // Send message saying user's login was successful
                res.send({
                    status: "Success",
                    msg: "Logged in."
                });
            }
        });
});


// When a user logs out
app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Cannot log out");
            } else {
                // Session deleted, redirect to home page
                res.redirect("/");
            }
        });
    }
});


// Home page on localhost:8000
app.get('/forgot-password', function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        let forgotPassword = fs.readFileSync("./pages/forgot-password.html", "utf8");
        let forgotPasswordDOM = new JSDOM(forgotPassword);
        res.send(forgotPasswordDOM.serialize());
    }
});


// Signup page
app.get("/signup", function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("/main");

    } else {
        let signup = fs.readFileSync("./pages/signup.html", "utf8");
        let signupDOM = new JSDOM(signup);

        res.set("Server", "Monicode Engine");
        res.set("X-Powered-By", "Monicode");
        res.send(signupDOM.serialize());
    }
});


// When a user signs up
app.post("/signup", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    checkExistingEmail(req.body.email,
        function (userEmailRecord) {

            // When checkExistingEmail() returns null because user isn't currently in database
            if (userEmailRecord == null) {

                checkExistingUsername(req.body.username,
                    function (usernameRecord) {

                        if (usernameRecord == null) {

                            let budgetInput = parseFloat(req.body.budget);
                            let roundBudget = budgetInput.toFixed(2);

                            // Add new user to the database
                            connection.query('INSERT INTO users (firstName, lastName, username, birthday, budget, moneySpent, moneySaved, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
                                [req.body.firstName, req.body.lastName, req.body.username, req.body.birthday, roundBudget, 0, 0, req.body.email, req.body.password],

                                function (error, result) {
                                    if (error) {
                                        // Send message saying there was an error when signing up
                                        res.send({
                                            status: "Fail",
                                            msg: "Error when signing up."
                                        });

                                    } else {
                                        // Create a session, store their data in the session
                                        req.session.loggedIn = true;
                                        req.session.userID = result.insertId;
                                        req.session.firstName = req.body.firstName;
                                        req.session.lastName = req.body.lastName;
                                        req.session.username = req.body.username;
                                        req.session.birthday = req.body.birthday;
                                        req.session.budget = roundBudget;
                                        req.session.email = req.body.email;
                                        req.session.password = req.body.password;

                                        req.session.moneySaved = 0;
                                        req.session.moneySpent = 0;

                                        req.session.save(function (err) {
                                            // Session saved
                                        });

                                        res.send({
                                            status: "Success",
                                            msg: "New user signed up."
                                        });
                                    }
                                });

                        } else {
                            // Send message saying account already exists
                            res.send({
                                status: "Fail",
                                field: "username",
                                msg: "Account already exists with this username."
                            });
                        }
                    });


            } else {

                // Send message saying account already exists
                res.send({
                    status: "Fail",
                    field: "email",
                    msg: "Account already exists with this email."
                });
            }
        });
});



// Checks that email and password combination exist as a user in the database
function checkLoginData(email, password, callback) {
    connection.query(
        "SELECT * FROM users WHERE email = ? AND password = ?", [email, password],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // email and password found
                return callback(results[0]);
            } else {
                // user not found
                return callback(null);
            }
        }
    );
}


// Checks that email exists as a user in the database
function checkExistingEmail(email, callback) {
    connection.query(
        "SELECT * FROM users WHERE email = ?",
        [email],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // email exists in database
                return callback(results[0]);
            } else {
                // email does not exist
                return callback(null);
            }
        }
    );
}

// Checks that email exists as a user in the database
function checkExistingUsername(username, callback) {
    connection.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        function (error, results) {
            if (error) {}
            if (results.length > 0) {
                // username exists in database
                return callback(results[0]);
            } else {
                // username does not exist
                return callback(null);
            }
        }
    );
}


// Main page
app.get("/main", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let main = fs.readFileSync("./pages/main.html", "utf8");
        let mainDOM = new JSDOM(main);

        // Get the user's data and put it into the page
        mainDOM.window.document.getElementById("userFullName").innerHTML = "Hey, " + req.session.firstName +
            " " + req.session.lastName;

        mainDOM.window.document.getElementById("userFullNameDropdown").innerHTML = "Hey, " + req.session.firstName +
            " " + req.session.lastName;

        res.set("Server", "Monicode Engine");
        res.set("X-Powered-By", "Monicode");
        res.send(mainDOM.serialize());

    } else {
        // Not logged in, so direct to home page
        res.redirect("/");
    }

});


// New purchase page
app.get("/new-purchase", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let newPurchase = fs.readFileSync("./pages/new-purchase.html", "utf8");
        let newPurchaseDOM = new JSDOM(newPurchase);
        res.send(newPurchaseDOM.serialize());

    } else {
        // Not logged in, direct to home page
        res.redirect("/");
    }

});


// Adds a new purchase to the database
app.post('/add-purchase', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    // Round price to 2 decimal places
    let priceInput = parseFloat(req.body.price);
    let roundPrice = priceInput.toFixed(2);

    // Get the current time 
    let today = new Date();
    let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let currDateAndTime = date + ' ' + time;

    connection.query('INSERT INTO purchases (userID, item, expenseType, price, date, time) VALUES (?, ?, ?, ?, ?, ?)',
        [req.session.userID, req.body.item, req.body.expenseType, roundPrice, req.body.date, currDateAndTime],
        function (error) {
            if (error) {

            } else {

                res.send({
                    status: "Success",
                    msg: "New purchase added."
                });
            }
        });
});


// Removes a purchase from the database
app.post('/remove-purchase', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('DELETE FROM purchases WHERE purchaseID = ?',
        [req.body.purchaseID],
        function (error) {
            if (error) {

            } else {
                res.send({
                    status: "Success",
                    msg: "Purchase deleted."
                });
            }
        });
});


// All purchases page
app.get("/all-purchases", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let allPurchases = fs.readFileSync("./pages/all-purchases.html", "utf8");
        let allPurchasesDOM = new JSDOM(allPurchases);
        res.send(allPurchasesDOM.serialize());

    } else {
        // Not logged in, direct to home page
        res.redirect("/");
    }

});


// Gets all of the current session user's purchases
app.post("/all-this-users-purchases", function (req, res) {

    // Gets all purchases from this user
    let sqlStatement = "SELECT * FROM purchases WHERE userID = '" + req.session.userID + "' ORDER BY date DESC";
    connection.query(sqlStatement,
        function (error, purchases) {
            res.send({
                status: "Success",
                thisUsersPurchases: purchases
            });
        }
    );
});


// Gets the current session user's recent purchases
app.post("/this-users-recent-purchases", function (req, res) {

    // Gets all purchases from this user
    let sqlStatement = "SELECT * FROM purchases WHERE userID = '" + req.session.userID + "' ORDER BY date DESC LIMIT 4";
    connection.query(sqlStatement,
        function (error, purchases) {
            res.send({
                status: "Success",
                thisUsersPurchases: purchases
            });
        }
    );
});


// User settings page
app.get("/settings", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let settings = fs.readFileSync("./pages/settings.html", "utf8");
        let settingsDOM = new JSDOM(settings);

        settingsDOM.window.document.getElementById("firstName").defaultValue = req.session.firstName;
        settingsDOM.window.document.getElementById("lastName").defaultValue = req.session.lastName;
        settingsDOM.window.document.getElementById("username").defaultValue = req.session.username;

        let dbBirthday = new Date(req.session.birthday);
        let month = dbBirthday.getMonth() + 1;
        if (month < 10) {
            month = "0" + (dbBirthday.getMonth() + 1);
        }

        let day = dbBirthday.getDate();
        if (day < 10) {
            day = "0" + dbBirthday.getDate();
        }
        let birthday = dbBirthday.getFullYear() + '-' + month + '-' + day;
        settingsDOM.window.document.getElementById("birthday").defaultValue = birthday;
        settingsDOM.window.document.getElementById("budget").defaultValue = req.session.budget;
        settingsDOM.window.document.getElementById("email").defaultValue = req.session.email;
        settingsDOM.window.document.getElementById("password").defaultValue = req.session.password;

        settingsDOM.window.document.getElementById("storedBudget").innerHTML = req.session.budget;
        settingsDOM.window.document.getElementById("storedMoneyEarned").innerHTML = req.session.moneySaved;

        res.send(settingsDOM.serialize());

    } else {
        // Not logged in, direct to home page
        res.redirect("/");
    }

});


// Update current user's account
app.post("/update-account", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    checkExistingEmail(req.body.email,
        function (emailRecord) {

            // If user isn't currently in database or the returned email is the same as the session user's email
            if (emailRecord == null || emailRecord.id == req.session.userID) {

                checkExistingUsername(req.body.username,
                    function (usernameRecord) {

                        // If user isn't currently in database or the returned username is the same as the session user's username
                        if (usernameRecord == null || usernameRecord.id == req.session.userID) {

                            connection.query("UPDATE users SET firstName = ?, lastName = ?, username = ?, birthday = ?, budget = ?, email = ?, password = ? WHERE id = ?",
                                [req.body.firstName, req.body.lastName, req.body.username, req.body.birthday, req.body.budget, req.body.email, req.body.password, req.session.userID],
                                function (error) {
                                    if (error) {
                                        res.send({
                                            status: "Fail",
                                            msg: "Account could not be updated."
                                        });
                                    }

                                    req.session.firstName = req.body.firstName;
                                    req.session.lastName = req.body.lastName;
                                    req.session.username = req.body.username;
                                    req.session.birthday = req.body.birthday;
                                    req.session.budget = req.body.budget;
                                    req.session.email = req.body.email;
                                    req.session.password = req.body.password;

                                    res.send({
                                        status: "Success",
                                        msg: "Account was updated."
                                    });
                                }
                            );

                        } else {
                            // Send message saying account already exists
                            res.send({
                                status: "Fail",
                                field: "username",
                                msg: "Account already exists with this username."
                            });
                        }
                    });

            } else {

                // Send message saying account already exists
                res.send({
                    status: "Fail",
                    field: "email",
                    msg: "Account already exists with this email."
                });
            }
        });
});


// CANNOT USE USERID IN SQL STATEMENT ***********PROBLEM
app.post("/this-users-budget", function (req, res) {

    // Gets all purchases from this user
    let sqlStatement = "SELECT * FROM users WHERE userID = '" + req.session.userID + "'";
    connection.query(sqlStatement,
        function (error, budget) {
            if (error) {
                console.log("Error")
            } else {
                console.log("No error")
                res.send({
                    status: "Success",
                    thisUsersBudget: budget
                });
            }
        }
    );
});



app.post("/get-this-users-budget", function (req, res) {
    connection.query("SELECT * FROM users WHERE id = ?",
        [req.session.userID],
        function (error, budget) {
            if (error) {}
            res.send({
                status: "Success",
                thisUsersBudget: budget[0]
            });
        }
    );
});



app.post('/update-money-saved', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let sessionMoney = parseFloat(req.session.moneySaved);
    let moneyInput = parseFloat(req.body.moneyEarned);

    // Round sum to 2 decimal places
    let totalMoneySaved = (sessionMoney + moneyInput).toFixed(2);

    connection.query("UPDATE users SET moneySaved = ? WHERE id = ?",
        [totalMoneySaved, req.session.userID],
        function (error) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Money saved could not be updated."
                });
            } else {
                // Update session info
                req.session.moneySaved = totalMoneySaved;

                res.send({
                    status: "Success",
                    msg: "Money saved amount updated.",
                    totalMoneySaved: totalMoneySaved
                });
            }
        });
});


app.post('/update-money-spent', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    let sessionMoney = parseFloat(req.session.moneySpent);
    let moneyInput = parseFloat(req.body.price);

    // Round sum to 2 decimal places
    let totalMoneySpent = (sessionMoney + moneyInput).toFixed(2);

    connection.query("UPDATE users SET moneySpent = ? WHERE id = ?",
        [totalMoneySpent, req.session.userID],
        function (error) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Money saved could not be updated."
                });
            } else {
                req.session.moneySpent = totalMoneySpent;

                res.send({
                    status: "Success",
                    msg: "Money spent amount updated.",
                    totalMoneySpent: totalMoneySpent
                });
            }
        });
});




app.post('/get-category-purchases', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query("SELECT Count(*) AS count FROM purchases WHERE userID = ? AND expenseType = ?",
        [req.session.userID, req.body.category],
        function (error, purchases) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error getting purchases."
                });

            } else {
                res.send({
                    status: "Success",
                    msg: "Got purchases in this category.",
                    thisCategoryPurchases: purchases[0]
                });
            }
        });
});



// Help page
app.get("/help", function (req, res) {

    // Check for a session first
    if (req.session.loggedIn) {
        let help = fs.readFileSync("./pages/help.html", "utf8");
        let helpDOM = new JSDOM(help);
        res.send(helpDOM.serialize());

    } else {
        // Not logged in, so direct to home page
        res.redirect("/");
    }

});



// Redirects to error page for paths that don't exist
app.get('*', function (req, res) {
    let errorPage = fs.readFileSync("./pages/error-page.html", "utf8");
    res.status(404).send(errorPage);
});




app.post('/get-security-questions', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    checkExistingEmail(req.body.email,
        function (emailRecord) {

            // If user isn't currently in database
            if (emailRecord == null) {
                res.send({
                    status: "Fail",
                    msg: "This email is not connected with an account."
                });
            } else {
                let emailAcctID = emailRecord.id;

                connection.query("SELECT * FROM security WHERE userID = ?",
                    [emailAcctID],
                    function (error, securityResult) {
                        if (error) {}
                        if (securityResult.length > 0) {
                            res.send({
                                status: "Success",
                                msg: "Please answer your security questions below.",
                                acctID: emailAcctID,
                                securityResult: securityResult[0]
                            });
                        } else {
                            res.send({
                                status: "Fail",
                                msg: "This account has no security questions saved."
                            });
                        }
                    });

            }
        });
});

app.post('/check-security-answers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query("SELECT * FROM security WHERE userID = ? AND securityQ1 = ? AND securityA1 = ? AND securityQ2 = ? AND securityA2 = ? ",
        [req.body.accountID, req.body.question1, req.body.answer1, req.body.question2, req.body.answer2],
        function (error, result) {
            if (error) {}
            if (result.length > 0) {
                res.send({
                    status: "Success",
                    msg: "Answers match account information."
                });
            } else {
                res.send({
                    status: "Fail",
                    msg: "Answers do not match account information."
                });
            }
        });
});


app.post('/check-security-answers-exists', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query("SELECT * FROM security WHERE userID = ?",
        [req.session.userID],
        function (error, securityResult) {
            if (error) {}
            if (securityResult.length > 0) {
                res.send({
                    status: "Success",
                    msg: "Security answers exist with this account.",
                    securityResult: securityResult[0]
                });
            } else {
                res.send({
                    status: "Fail",
                    msg: "This account has no security answers saved."
                });
            }
        });
});


app.post("/verified-security-login", function (req, res) {
    res.setHeader("Content-Type", "application/json");

    connection.query("SELECT * FROM users WHERE id = ?",
        [req.body.accountID],
        function (error, accountResult) {
            if (error) {
                res.send({
                    status: "Fail",
                    msg: "Error logging in."
                });
            }

            // Successfully logged in, create a session, store their data in the session
            req.session.loggedIn = true;
            req.session.userID = accountResult[0].id;
            req.session.firstName = accountResult[0].firstName;
            req.session.lastName = accountResult[0].lastName;
            req.session.username = accountResult[0].username;
            req.session.birthday = accountResult[0].birthday;
            req.session.budget = accountResult[0].budget;
            req.session.email = accountResult[0].email;
            req.session.password = accountResult[0].password;

            req.session.moneySaved = accountResult[0].moneySaved;
            req.session.moneySpent = accountResult[0].moneySpent;

            req.session.save(function (err) {
                // session saved
            });

            // Send message saying user's login was successful
            res.send({
                status: "Success",
                msg: "Logged in."
            });
        });
});



// When user creates new security answers
app.post('/save-security-answers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('INSERT INTO security (userID, securityQ1, securityA1, securityQ2, securityA2) VALUES (?, ?, ?, ?, ?)',
        [req.session.userID, req.body.question1, req.body.answer1, req.body.question2, req.body.answer2],
        function (error, result) {
            if (error) {

            } else {
                res.send({
                    status: "Success",
                    msg: "Security questions and answers saved."
                });
            }
        });
});

// When user updates their current security questions and answers
app.post('/update-security-answers', function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    connection.query('UPDATE security SET securityQ1 = ?, securityA1 = ?, securityQ2 = ?, securityA2 = ? WHERE userID = ?',
        [req.body.question1, req.body.answer1, req.body.question2, req.body.answer2, req.session.userID],
        function (error, result) {
            if (error) {

            } else {
                res.send({
                    status: "Success",
                    msg: "Security questions and answers saved."
                });
            }
        });
});






/*
 * Connects to the MySQL database 
 * Checks if the database and tables exist
 */
async function connectDatabaseTables() {
    // Promise
    const mysql = require("mysql2/promise");
    const connection = await mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        multipleStatements: true
    });
    // Setup database and tables
    const createDatabaseAndTables = `CREATE DATABASE IF NOT EXISTS BudgetAppDB;
        use BudgetAppDB;
        CREATE TABLE IF NOT EXISTS users(
        id INT NOT NULL AUTO_INCREMENT, 
        firstName VARCHAR(30), 
        lastName VARCHAR(30), 
        username VARCHAR(30), 
        birthday DATE, 
        budget DOUBLE,
        moneySaved DOUBLE,
        moneySpent DOUBLE,
        email VARCHAR(30), 
        password VARCHAR(30),
        PRIMARY KEY (id));
        
        CREATE TABLE IF NOT EXISTS purchases(
            purchaseID INT NOT NULL AUTO_INCREMENT, 
            userID INT NOT NULL,
            item VARCHAR(100) NOT NULL,
            expenseType VARCHAR(50),
            price DOUBLE NOT NULL,
            date DATE,
            time TIMESTAMP NOT NULL,
            PRIMARY KEY (purchaseID),
            FOREIGN KEY (userID) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE);
            
        CREATE TABLE IF NOT EXISTS security(
            securityID INT NOT NULL AUTO_INCREMENT, 
            userID INT NOT NULL,
            securityQ1 VARCHAR(50), 
            securityA1 VARCHAR(50), 
            securityQ2 VARCHAR(50), 
            securityA2 VARCHAR(50), 
            PRIMARY KEY (securityID),
            FOREIGN KEY (userID) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE)`;
    await connection.query(createDatabaseAndTables);

    console.log("Listening on port " + port + "!");
}

// Run server on port 8000
let port = 8000;
app.listen(port, connectDatabaseTables());