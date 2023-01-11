import sqlite3
from database import Database

class MyDatabase(Database):
    def add_word(self, data):  # add word
        self.connectdb()
        self.get_cur()
        # add word data
        self.cur.execute(
            "INSERT INTO dictionary (word, mean, sample_sentence, word_level, img_url, vc_url, created_at, updated_at) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
            data
        )
        self.closedb()

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