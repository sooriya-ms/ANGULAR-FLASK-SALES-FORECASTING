import base64
from io import BytesIO
from statsmodels.tsa.arima.model import ARIMA
from pmdarima import auto_arima
import matplotlib.pylab as plt
from flask import Flask, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')


app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data1.db'
db = SQLAlchemy(app)


class Userdata(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    email = db.Column(db.String(50))
    password = db.Column(db.String(20))

    def __repr__(self):
        var = {"id": self.id, "username": self.username,
               "email": self.email, "password": self.password}
        return str(var)


@app.route('/')
def index():
    user = Userdata.query.all()
    print("user ---------- ", user)
    return "heillo"


@app.route('/user')
def get_users():
    users = Userdata.query.all()
    output = []

    for user in users:
        user_data = {"username": user.username,
                     "email": user.email, "password": user.password}
        output.append(user_data)

    return {"Users": output}


@app.route('/user', methods=["POST"])
def add_user():
    res = {}
    user = Userdata(username=request.json['username'],
                    email=request.json['email'], password=request.json['password'])

    find_email = Userdata.query.filter_by(email=user.email).first()

    if not find_email:
        with app.app_context():
            db.create_all()
            db.session.add(user)
            db.session.commit()
        res['auth'] = {"success": True}
    else:
        res['auth'] = {'success': False}

    return res


@app.route('/auth_user', methods=['POST'])
def auth_user():
    res = {}
    email = request.json['email']
    password = request.json['password']

    user = Userdata.query.filter_by(email=email).first()

    if not user or not (user.password == password):
        status = {
            "success": False
        }
        res['auth'] = status
        return res

    status = {
        "success": True
    }
    res['auth'] = status
    return res


@app.route('/upload_file', methods=['POST'])
def file_upload():
    res = {}
    try:
        file = request.files['file']
        time = int(request.form['time'])
        period = request.form['period']
        seasonal = int(request.form['seasonal'])
        type = file.content_type.split("/")

        period_matcher = {'week': 'W',
                          'month': 'M',
                          'year': 'Y',
                          'day': 'D',
                          'hour': 'H'}

        file.save(f'dataset/dataset.{type[-1]}')

        # cols = [0, 4]
        names = ['Date', 'Sales',]
        df = pd.read_csv('dataset/dataset.csv', names=names)
        df = df.drop(0)
        df['Date'] = pd.to_datetime(df['Date'])
        df.set_index('Date', inplace=True)
        df['Sales'] = df['Sales'].astype(float)

        # Filling NULL values with mean
        mean_val = df['Sales'].mean()
        df['Sales'].fillna(value=mean_val, inplace=True)

        df.to_csv('dataset/dataset.csv', header=True)

        # Visualising initial data
        # df['Sales'].plot(figsize=(12, 6))
        plt.figure(figsize=(12, 6))
        plt.plot(df['Sales'], label='Actual')

        # Encode the graph as a PNG image file
        img = BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        encoded_img1 = base64.b64encode(img.read()).decode('utf-8')
        plt.clf()

        # Finding the best parameter using auto arima
        model = auto_arima(df['Sales'], trace=True,
                           suppress_warnings=True, seasonal=True, m=seasonal)
        order = model.get_params()['order']
        seasonal_ord = model.get_params()['seasonal_order']

        # Predicting output
        pred = model.predict(n_periods=time+1)

        index_future_dates = pd.date_range(
            start=df.index[-1], periods=time+1, freq=period_matcher[period])
        
        names = ['Sales']
        pred = pd.DataFrame(pred, columns=names, index=index_future_dates)
        pred.index.name = 'Date'

        pred.to_csv("dataset/result.csv", header=True)

        # Plotting output result
        plt.figure(figsize=(12, 6))
        plt.plot(pred, label="Predicted")
        plt.plot(df['Sales'], label="Actual")

        # model = ARIMA(df['Sales'], order=order, seasonal_order=seasonal_ord)
        # model = model.fit()
        # print(model)

        # Encode the graph as a PNG image file
        img = BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        encoded_img2 = base64.b64encode(img.read()).decode('utf-8')

        pred.index = pred.index.map(str)
        pred.reset_index(level=0, inplace=True)
        predjson = pred.to_json(orient = 'index')
        print("predjson", predjson)

        status = {
            "success": True,
            "sentimg": encoded_img1,
            "returnimg": encoded_img2,
            "preddata": predjson
        }
    except Exception as e:
        print(e)
        status = {
            "success": False,
            "sentimg": str(e),
            "returnimg": str(e),
            "preddata": str(e)
        }
    res["status"] = status
    return res


if __name__ == '__main__':
    app.run(debug=True)
