import sqlite3
from database import Database
import re
import csv
import datetime
import random
import env_dev
import requests
import os

def reforme_data(data):
    reforme = {}
    for d in data:
        buf = d[1]
        buf = buf.replace('</p>', ',')
        buf = buf.replace('<p>', '')
        buf = buf.replace(' ', '')
        buf = buf.split(',')[0]
        reforme[d[0]] = buf
        #reforme.append(buf)
    with open('reforme_data.csv', 'w') as f:
        for k, v in reforme.items():
            f.write(k+','+v+'\n')
    
def init_db(data):
    if not os.path.isfile(env_dev.DB_NAME):
        os.system('sqlite3 mydictionary.db < schema.sql')
    else:
        return

    api_url = "https://pixabay.com/api"
    api_key = env_dev.API_KEY
    headers= {

    }
    params={
        "key":api_key,
        "q":"",
        "lang":"en",
        "image_type":"photo"
    }
    db = Database(dbname='./mydictionary.db')
    db.connectdb()
    db.get_cur()
    for d in data:
        buf = d
        params["q"] = d[0]
        res = requests.get(api_url, headers=headers, params=params)
        jsn = res.json()
        hit = None
        try:
            hit = jsn['hits'][0]
            buf.append(hit["previewURL"])
        except:
            buf.append(hit)

        for i in range(2):
            buf.append(datetime.datetime.today())
        db.cur.execute("INSERT INTO dictionary (word, mean, img_url, created_at, updated_at) VALUES(?, ?, ?, ?, ?)", buf)
    db.commitdb()
    db.closedb()

def insert_mydic():
    db = Database(dbname='./mydictionary.db')
    db.connectdb()
    db.get_cur()
    db.cur.execute("select * from dictionary;")
    count = 0
    data = []
    for row in db.cur:
        buf = []
        if count > 9:
            break
        level = random.randint(0, 5)
        buf.append(row["id"])
        buf.append(level)
        for i in range(3):
            buf.append(datetime.datetime.today())
        data.append(buf)
        count += 1
    db.get_cur()
    for d in data:
        db.cur.execute("INSERT INTO mydictionary (word_id, memory, nextdate, created_at, updated_at) VALUES(?, ?, ?, ?, ?)", d)
    db.commitdb()
    db.closedb()

def setup(data):
    # init_db(data)
    insert_mydic()

def main():
    # data = None
    # with open('data.csv', 'r') as f:
    #     data = csv.reader(f)
    #     reforme_data(data)
    with open('reforme_data.csv', 'r', encoding="utf-8") as f:
        data = csv.reader(f)
        setup(data)

if __name__ == "__main__":
    main()