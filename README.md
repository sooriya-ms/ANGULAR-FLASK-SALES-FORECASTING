# Angular Sales Forecasting

This project is a Sales Forecasting project.

## Installation

This project uses Flask to run the Machine Learning Model and Angular for Frontend. Install Flask and corresponding libraries that present in the `flask.py`. Make sure you have the [Angular CLI](https://github.com/angular/angular-cli#installation) installed globally.
You can use this command to install it `npm install -g @angular/cli`.

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Overview

This project gets the input data from a CSV file and predicts the output sales for the mentioned period using the ARIMA or SARIMA model. It contains three pages: an intro, login/signup, and prediction page.

By clicking the intro card, we can navigate to the login page. If you are a new user, create an account using the signup button. After logging in, upload a csv file, which has only two columns: date and sales. Select the period of that dataset using the drop-down menu and the time to predict. If the data has seasonality, enter it accordingly. After toggling the submit button, it will take some time to predict accurately. As a result, we can see the actual graph, the predicted graph, and the predicted data.

## Preview

![Intro Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/blob/main/Preview_Images/Intro_page.png)
<br />
![Login Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/blob/main/Preview_Images/Login_page.png)
<br />
![Signin Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/blob/main/Preview_Images/Signup_page.png)
<br />
![Upload Page](https://github.com/sooriya-ms/Angular-Flask-Sales-Forecasting/blob/main/Preview_Images/Main_page.png)

