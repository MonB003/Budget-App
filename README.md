# Budget App
> This is an app that helps you keep track of your purchases and how much money you're spending.

<br>

## Table of Contents
- [Technologies](#technologies)
- [How to run the project](#how-to-run-project)
- [How to use the app](#how-to-use-app)
- [References](#references)

<br>

## Technologies
* Frontend: HTML, CSS, JavaScript
* Backend: Node.js, Express
* Database: MySQL

<br>

## <a id="how-to-run-project">How to run the project</a>
### Prerequisites:
- Have a Git and GitHub account
- Have Visual Studio Code or another coding editor

### Configuration instructions:

You will need to install:
- [Node package manager](https://nodejs.org/en/download/) (npm)
- [Xampp](https://www.apachefriends.org/download.html) (comes with MySQL)

Cloning the repository:
- Open Command Prompt 
- `cd` into the folder you want the repository stored in
- Type: `git clone https://github.com/MonB2020/Budget-App.git`

In your folder, you will need to install these node packages:
```
npm install express 
npm install express-session 
npm install jsdom 
npm install mysql2
```

### Running the project:
1. Open the Xampp control panel and click ‘Run as administrator’.
2. Click the ‘Start’ button to the right of MySQL to connect to the database.
3. Open Command Prompt
4. `cd` into your project folder
5. Type `node database`
6. Go to http://localhost:8000 on any browser
7. This will direct you to the login page, where you can either login or signup.
8. Once successfully logged in, you will be directed to the main page, where you can view all your purchases.

<br>

## <a id="how-to-use-app">How to use the app</a>
### Add a Purchase:
- Click the *New Purchase* option in the navbar. This will redirect you to the new purchase page.
- Fill in all the fields with your purchase information.
- Click the *Add Purchase* button.

### Delete a Purchase:
- From either the main page or all purchases page, click the *Remove* button on the purchase you want to remove.
- A popup will appear asking to confirm that you want to delete the purchase.
- To delete the purchase, click the *Remove* button.

### View and Edit Your Account:
- Click the *Settings* option in the navbar. This will redirect you to the settings page.
- On the left side of the page, click the *Account* option.
- Your current information will be filled into the input fields. You can edit any of these fields to change your information.
- To save your edited account information, click the *Save* button.

### View Your Budget Information:
- Click the *Settings* option in the navbar. This will redirect you to the settings page.
- On the left side of the page, click the *Budget* option.
- Your current budget will be at the top of the page.
- You will see how much money you've currently spent this month.
- If you have gone over your budget, you will see how much you went over your budget by. If you have not gone over your budget, you will see how much money you have left to spend.

### Add to Your Money Earned:
- Click the *Settings* option in the navbar. This will redirect you to the settings page.
- On the left side of the page, click the *Money Earned* option.
- Fill in the input field with the amount of money you've earned.
  - <b>Note:</b> The amount inputted must be between 1 and 1000000000.
- To add your money earned to your account, click the *Save* button.
- You will see your updated total money earned on the page.

<br>

## References
- [Google icons](https://fonts.google.com/icons)