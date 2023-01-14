from flask import Flask, jsonify, abort, make_response, render_template, request, redirect, url_for
from flask_cors import CORS
import os
from dotenv import load_dotenv
from mydatabase import MyDatabase
import env_dev as ed
import init_db
load_dotenv(override=True)

if not os.path.isfile('./mydictionary.db'):
    init_db.setup()

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)  # CORS有効化
dbname = os.getenv('DB_NAME')
database = MyDatabase(dbname=dbname)  # make instance of database 

##########################################################################

# This function get dictionary data. dictype is 0 or 1.
# dictype -> 0: all, 1: mydic
@app.route('/get_words/<int:dictype>', methods=['GET'])  # GET method
def get_words(dictype):
    result = database.read_dic(dictype)
    print(result)
    return jsonify(result)

@app.route('/get_level_words/<int:level>', methods=['GET'])
def get_level_words(level):
    result = database.read_level(level)
    print(result)
    return jsonify(result)


@app.route("/get_api_key", methods=["GET"])
def get_api_key():
    result = ed.API_KEY
    return jsonify(result)

@app.route('/add_mydic', methods=["POST"])
def add_mydic(data):
    # TODO: add mydic
    return redirect(url_for('/dictionary'))

@app.route('/add_word', methods=['POST'])  # Postだけ受け付ける
def add_word(data):
    # result = request.form["param"]  # Postで送ったときのパラメータの名前を指定する
    return redirect(url_for('/dictionary', dictype="0"))

@app.route('/edit_word', methods=['POST'])
def edit_word(data):
    return redirect(url_for('/dictionary'))

#########################################################################

@app.route('/')
def index():
    return render_template('index.html')

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
    return render_template('study_select.html')


@app.route('/study')
def study():
    return render_template('study.html')


# 5000番ポートでWebサーバを起動する
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)