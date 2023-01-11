import sqlite3

class Database():
    def __init__(self, dbname):
        self.dbname = dbname
        self.conn = None
        self.cur = None
    
    def connectdb(self):  # connect database
        try:
            print("success connect db: {}".format(self.dbname))
            self.conn = sqlite3.connect(self.dbname)
            self.conn.row_factory = sqlite3.Row
            
        except:
            print("can not connect db: {}".format(self.dbname))
    
    def closedb(self):  # close database
        try:
            print("success close db: {}".format(self.dbname))
            self.conn.close()
            self.conn = None
            self.cur = None

        except:
            print("can not close db: {}".format(self.dbname))
    
    def get_cur(self):  # make cursor for using table and database
        self.cur = self.conn.cursor()
    
    def commitdb(self):
        self.conn.commit()