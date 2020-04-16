# Dependencies
import requests
from bs4 import BeautifulSoup as bs
from splinter import Browser
import os
import time
import re
import pandas as pd
import json

# Set-up dictionary of all Mars urls to be scraped
url_dict = {"url_confirmed": "https://api.covid19api.com/dayone/country/us/status/confirmed",
            "url_deaths": "https://api.covid19api.com/dayone/country/us/status/deaths",
            "url_recovered": "https://api.covid19api.com/dayone/country/us/status/recovered"}


def get_date_data_nostatus(dates, data_list):
    data_nostatus = dict()
    for i in range(len(dates)):
        current = []
        for j in range(len(data_list)):
            if dates[i] == data_list[j]["Date"]:
                current.append(data_list[j])
        data_nostatus[dates[i][0:10]] = current
    return data_nostatus


def get_date_list(list):
    dates = []
    for i in range(len(list)):
        if list[i]['Date'] not in dates:
            dates.append(list[i]['Date'])
    return sorted(dates)


def update_covid_data():
    response_confirmed = requests.get(url_dict["url_confirmed"]).json()
    dates_us_confirmed = get_date_list(response_confirmed)
    us_confirmed_by_dates = get_date_data_nostatus(
        dates_us_confirmed, response_confirmed)

    with open("static/data/covid_us_confirmed.json", 'w') as jsonfile:
        json.dump(us_confirmed_by_dates, jsonfile)

    date_list = list(us_confirmed_by_dates.keys())
    adate = date_list

    response_deaths = requests.get(url_dict["url_deaths"]).json()

    dates_us_deaths = get_date_list(response_deaths)
    us_deaths_by_dates = get_date_data_nostatus(
        dates_us_deaths, response_deaths)

    with open("static/data/covid_us_deaths.json", 'w') as jsonfile:
        json.dump(us_deaths_by_dates, jsonfile)

    response_recovered = requests.get(url_dict["url_recovered"]).json()
    dates_us_recovered = get_date_list(response_recovered)
    us_recovered_by_dates = get_date_data_nostatus(
        dates_us_recovered, response_recovered)

    with open("static/data/covid_us_recovered.json", 'w') as jsonfile:
        # with open("templates/covid_us_recovered.json", 'w') as jsonfile:
        json.dump(us_recovered_by_dates, jsonfile)

    return [us_confirmed_by_dates, us_deaths_by_dates, us_recovered_by_dates]
