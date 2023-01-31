import sqlite3
from database import Database
import env_dev
import requests
import datetime



class MyDatabase(Database):
    def add_word(self, data):  # add word
        self.connectdb()
        self.get_cur()
        # add word data
        new_data = []
        labels = [
            'new_word',
            'new_mean',
            'new_sample_sentence',
            'new_word_level',
            'new_img_url',
            'new_vc_url'
        ]
        self.cur.execute("SELECT * FROM dictionary WHERE word = ?", (data['new_word'],))
        if self.cur.fetchone() != None:
            return "This word is already exists in dictionary."
            self.closedb()
        for l in labels:
            if l in data.keys():
                new_data.append(data[l])
                continue
            if l == 'new_img_url':
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
                params["q"] = data['new_word']
                res = requests.get(api_url, headers=headers, params=params)
                jsn = res.json()
                hit = None
                try:
                    hit = jsn['hits'][0]
                    new_data.append(hit["previewURL"])
                except:
                    new_data.append(hit)
                continue
            new_data.append(None)
        new_data.append(datetime.datetime.today())
        new_data.append(new_data[-1])
        print('newdata: ',new_data)
        self.cur.execute(
            "INSERT INTO dictionary (word, mean, sample_sentence, word_level, img_url, vc_url, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            new_data
        )
        self.commitdb()
        self.closedb()
        return "Insert into dictionary."

    # def make_dict(self, data):
    #     make_dict(data)
    # read dictionary data. all or mydic
    def read_dic(self, dictype):  # dictype is 0 or 1. select mydictionary(1) or all dictionary data(0)
        # TODO: read dic (all or mydic)
        data = {}
        self.connectdb()
        self.get_cur()
        # if all
        if not dictype or dictype == 0:
            self.cur.execute("SELECT * FROM dictionary;")

        # if mydic
        else:
            self.cur.execute("SELECT * FROM dictionary INNER JOIN mydictionary ON dictionary.id = mydictionary.word_id;")
            

        for k, v in enumerate(self.cur):  # make dict data
            buf = {}
            buf['word'] = v['word']
            buf['mean'] = v['mean']
            buf['img_url'] = v['img_url']
            if dictype:
                buf['memory'] = v['memory']
                buf['nextdate'] = v['nextdate']
            data[k] = buf

        
        self.closedb()
        return data
    
    # This function is reading mydictionary by using memory level
    def read_level(self, level):  # level is memory level.
        data = {}
        # connect db
        self.connectdb()
        self.get_cur()
        # select data
        self.cur.execute("SELECT * FROM dictionary INNER JOIN mydictionary ON dictionary.id = mydictionary.word_id WHERE memory = ?;", (level,))
        # read and reform
        for k, v in enumerate(self.cur):  # make dict data
            buf = {}
            buf['word'] = v['word']
            buf['mean'] = v['mean']
            buf['img_url'] = v['img_url']
            buf['nextdate'] = v['nextdate']
            data[k] = buf
        # close db
        self.closedb()
        return data

    
    def edit(self, data):
        if data != None:
            self.connectdb()
            self.get_cur()
            self.cur.execute(
                "UPDATE dictionary SET word=?, mean=?, smaple_sentence=?,word_level=?,img_url=?,vc_url=?,updated_at=?",
                data
            )
            self.commitdb()
            self.closedb()
            
    def record_study(self, data):
        if data != None:
            self.connectdb()
            self.get_cur()
            self.cur.execute(
                "INSERT INTO study_record (score, mode, created_at, updated_at) VALUE (?, ?, ?, ?)",
                data
            )
            self.commitdb()
            self.closedb()
        
    def add_mydic(self, data):
        if data != None:
            self.connectdb()
            self.get_cur()
            self.cur.execute(
                "INSERT INTO mydictionary (word_id, memory, nextdate, created_at, updated_at) VALUES(?, ?, ?, ?, ?)", 
                data
            )
            self.commitdb()
            self.closedb()
    
    def record_study_times(self, data):
        if data != None:
            self.connectdb()
            self.get_cur()
            self.cur.execute(
                "INSERT INTO study_times (word_id, answer_num, miss_num, created_at, updated_at) VALUES(?, ?, ?, ?, ?)",
                data
            )
            self.commitdb()
            self.closedb()

if __name__ == "__main__":
    db = MyDatabase("./mydictionary.db")
    data = db.read_dic(0)
    print(data)
    #db.readdic(1)