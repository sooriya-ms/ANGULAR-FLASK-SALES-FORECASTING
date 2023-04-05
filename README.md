# FirstApp

This project is a Sales Forecasting project.

## Installation

This project uses Flask to run the Machine Learning Model and Angular for Frontend. Install Flask and corresponding libraries that present in the `flask.py`. Make sure you have the [Angular CLI](https://github.com/angular/angular-cli#installation) installed globally.
You can use this command to install it `npm install -g @angular/cli`.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Overview

This project gets the input data from a CSV file and predicts the output sales for the mentioned period using the ARIMA or SARIMA model. It contains three pages: an intro, login/signup, and prediction page.
By clicking the intro card, we can navigate to the login page. If you are a new user, create an account using the signup button. After logging in, upload a csv file, which has only two columns: date and sales. Select the period of that dataset using the drop-down menu and the time to predict. If the data has seasonality, enter it accordingly. After toggling the submit button, it will take some time to predict accurately. As a result, we can see the actual graph, the predicted graph, and the predicted data.

## Preview

![Intro Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/Preview_Images/Intro_page.png)
![Login Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/Preview_Images/Login_page.png)
![Signin Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/Preview_Images/Signup_page.png)
![Upload Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/Preview_Images/Main_page.png)

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
