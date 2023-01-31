from flask import Flask, jsonify, abort, make_response, render_template, request, redirect, url_for
from flask_cors import CORS
import os
from dotenv import load_dotenv
from mydatabase import MyDatabase
import env_dev as ed
import init_db
import json

load_dotenv(override=True)

if not os.path.isfile('./mydictionary.db'):
    init_db.setup()

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)  # CORS有効化
dbname = os.getenv('DB_NAME')
database = MyDatabase(dbname=dbname)  # make instance of database 

##########################################################################
# API
# This function get dictionary data. dictype is 0 or 1.
# dictype -> 0: all, 1: mydic
@app.route('/get_words/<int:dictype>', methods=['GET'])  # GET method
def get_words(dictype):  # データベースから全単語データを読み出してjson形式で返す
    result = database.read_dic(dictype)
    print(result)
    return jsonify(result)

# MyDictionaryのデータをクエリで渡されたレベルに合わせてとってくる
@app.route('/get_level_words/<int:level>', methods=['GET'])
def get_level_words(level):
    result = database.read_level(level)
    print(result)
    return jsonify(result)  # json形式で返す

# 画像取得の際に用いたAPI (本アプリで最終的には用いていない)
@app.route("/get_api_key", methods=["GET"])
def get_api_key():
    result = ed.API_KEY
    return jsonify(result)

@app.route('/add_mydic', methods=["POST"])
def add_mydic(data):
    # TODO: add mydic
    return redirect(url_for('/dictionary'))

@app.route('/add_word', methods=["POST"])  # Postだけ受け付ける
def add_word():
    if request.method == "POST":
        #result = request.form["param"]  # Postで送ったときのパラメータの名前を指定する
        post_data = json.loads(request.get_data(as_text=True, parse_form_data=True))
        # 単語の追加処理を入れる
        # 単語があれば入れずにメッセージを返信
        # 単語がなければ追加する。また、追加の際はAPIで画像をついでに追加する
        res = None
        print("Successfull connecting database.")
        res = database.add_word(post_data)
        # except:
        #     res = "Can not connect database."
        #     print("Can not connect database.")

        res = {'message': res}
        return jsonify(res)

    return jsonify({"message": "You must use post method."})

@app.route('/edit_word', methods=['POST'])
def edit_word(data):
    return redirect(url_for('/dictionary'))

@app.route('/post_test', methods=['POST'])
def post_test(data):
    print(data)
    return jsonify('OK')

#########################################################################

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/dictionary', methods=['GET'])
def dictionary():
    return render_template('dictionary.html')

@app.route('/edit/<int:word_id>', methods=['GET'])
def edit(word_id):
    return render_template('edit.html')

@app.route('/search')
def search():
    return render_template('search.html')


@app.route('/study_select')
def study_select():
    return render_template('test_select.html')


@app.route('/study')
def study():
    return render_template('test_inside.html')


# 5000番ポートでWebサーバを起動する
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)