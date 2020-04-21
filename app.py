from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import update_jsons
import json

app = Flask(__name__)

# Set-up connection to database
# mongo = PyMongo(app, uri="mongodb://localhost:27017/covid_db")


@app.route("/")
def index():
    with open("static/data/covid_us_confirmed.json") as json_file:
        covid_data = json.load(json_file)

    date_text = list(covid_data.keys())[-1]

    return render_template("index.html", text=date_text)


@app.route("/update")
def updater():
    covid_json_list = update_jsons.update_covid_data()
    print("LOG: data updated")

    with open("static/data/covid_us_confirmed.json") as json_file:
        covid_data = json.load(json_file)

    date_text = list(covid_data.keys())[-1]

    return render_template("index.html", text=date_text)


@app.route("/about")
def about():
    # print("log: About page is to be run")
    return render_template("about.html", )


if __name__ == "__main__":
    app.run(debug=True)
