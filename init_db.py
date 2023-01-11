import sqlite3
from database import Database
import re
import csv
import datetime
import random

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
    db = Database(dbname='./mydictionary.db')
    db.connectdb()
    db.get_cur()
    for d in data:
        buf = d
        for i in range(2):
            buf.append(datetime.datetime.today())
        db.cur.execute("INSERT INTO dictionary (word, mean, created_at, updated_at) VALUES(?, ?, ?, ?)", buf)
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

        

def main():
    # data = None
    # with open('data.csv', 'r') as f:
    #     data = csv.reader(f)
    #     reforme_data(data)
    with open('reforme_data.csv', 'r', encoding="utf-8") as f:
        data = csv.reader(f)
        init_db(data)
    insert_mydic()

if __name__ == "__main__":
    main()