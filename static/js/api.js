// ページネーション切り替え時のボタンの挙動を処理する関数
function change_list_active(page, num, myopt=null){  // myoptがあればレベルボタンの挙動を制御、そうでなければ単語のページネーションを制御
  let class_root = '.list-'
  if (myopt != null){
    class_root = myopt;
  }
  for (let i = 0; i < page; i++){
    let elem = document.querySelector(class_root+i);
    if (num == i){  // 該当するボタンをアクティブに
      if (!elem.classList.contains('active')){
        elem.classList.add('active');
      }
    }
    else{  // それ以外からアクティブを解除
      if (elem.classList.contains('active')){
        elem.classList.remove('active');
      }  
    }
  }
}

// ページネーションを作成する関数
function make_pagenation() {
  let p = Url.searchParams;// URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
  let t = params.get('dictype');  // クエリパラメータを取得
  let page = Math.floor(Number(length / Div)); // ページ数を取得
  if (page <= 0){  // 0の場合、最低1ページは必要なので
    page = 1;
  }
  else{
    page+=1;
  }
  // ページネーション部分のエレメントを取得
  let pg_items = document.querySelector("#pagenation-area");
  // ページネーション部分の要素を空にする (前の処理のデータが残ってしまうため)
  pg_items.innerHTML = '';
  for (let i = 0; i < page; i++){
    // liタグを生成し、そこにクラスを付与
    let li_e = document.createElement("li");
    li_e.classList.add('page-item');
    li_e.classList.add('list-'+i);
    if (i <= 0){  // 初期の処理としてページ1をアクティブに
      li_e.classList.add('active');
    }
    // ボタンタグを作成
    let page_button = document.createElement('button');
    // ボタンに各ページ数をテキストとして挿入
    page_button.innerText = i + 1;
    // 各ページのクラスを付与
    page_button.classList.add('page-link');
    page_button.classList.add('page-'+i);
    // リストタグにボタンを挿入
    li_e.appendChild(page_button);
    // リストを表示エリアに挿入
    pg_items.appendChild(li_e);
  }
  // 各ボタンにイベントをクリック付与
  pg_items.addEventListener('click', (event)=> {
    let class_name = event.target.className.split(' ');
    let page = Math.floor(Number(length / Div)); // ページ数
    // ページの移動
    if (page <= 0){
      page = 1;
    }
    else{
      page+=1;
    }
    let p_num = Number((class_name[1].split('-'))[1]);
    // アクティブなボタンの変更
    change_list_active(page, p_num, null);
    // 該当ページを表示
    show_page(p_num);
    // 一番上へスクロール
    let word_area = document.querySelector(".table-head");
    word_area.scrollIntoView({  
      behavior: 'smooth'  
    });
  });
  
  // 初期は一番最初のページを表示
  show_page(0);
}

// 辞書データ全てとMyDictionaryとの切り替えを行う関数 (切り替えボタンを押されすると起動するイベント)
function change_mode() {
  let p = Url.searchParams;// URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
  let t = params.get('dictype'); // getパラメータを取得する
  let myopt = document.querySelector('.myopt'); // レベルボタンのエレメントを取得
  let mode_text = document.querySelector('.mode-text'); // 切り替えボタンのテキストのエレメントを取得
  let l = null; 
  if (Number(t) > 0) { // 全データにに切り替え
    t = Number(t) - 1; // パラメータを切り替え
    p.set('dictype', t); 
    myopt.classList.add('elem-hidden'); // レベルボタンを隠す
    mode_text.innerText = "全";  // ボタンのテキストを変更
    get_words('http://127.0.0.1:5000/get_words/'+t);  // 全データを取得
  }
  else {  // MyDictionaryに切り替え
    t = Number(t) + 1;  // パラメータ切り替え
    p.set('dictype', t);
    myopt.classList.remove('elem-hidden');  // レベルボタンを表示
    mode_text.innerText = "My";  // ボタンのテキストを変更
    get_level_words('http://127.0.0.1:5000/get_level_words/'+0);  // データの取得
  }
}

// 単語データの表示を行う関数 (非同期関数)
async function show_page(p){
    // 単語データの表示部分のエレメントを取得
    let word_area = document.querySelector('.word-area');
    word_area.innerHTML = '';  // エレメントのHTML要素を空に (切り替え時に前のデータが残ってしまうため)
    let pn = length - (p * Div);  // ページ数を取得
    if (pn >= Div){  // 四捨五入
      pn = Div;
    }
    // 単語データ表示のための要素生成
    for (let i = p * Div; i < (p*Div+pn); i++) {
      // エレメントの取得
      let e_tr = document.createElement('tr');
      // 取得データをtdタグに入れる
      e_tr.innerHTML = "<td>"+data[i]["word"]+"</td>";
      e_tr.innerHTML += "<td>"+data[i]["mean"]+"</td>";
      if (data[i]['img_url'] == null){  // 画像データがなければメッセージを挿入
        e_tr.innerHTML += "<td><h3>No image...</h3></td>";
      }
      else{  // 画像データがある場合
        e_tr.innerHTML += "<td>"+'<img src="'+data[i]['img_url']+'" class="table-img">'+"</td>";
      }
      word_area.appendChild(e_tr);  // 上記で生成した単語のタグ群を表示エリアに挿入
    }  
}

// 
async function get_api_key(url){
  const response = await fetch(url);
  const json = await response.json();
  return json
}

// 全単語データを取得するためのAPIを呼ぶ関数
async function get_words(url) {
  // データを初期化
  data = [];
  // フェッチ処理
  const response = await fetch(url);
  // レスポンスからデータを取得
  const json = await response.json();
  for (key in json) {  // データ変数に格納
    data.push(json[key]);
  }
  length = data.length;  // データの総数を格納
  make_pagenation();  //　ページネーションの作成
}

// MyDictionaryデータを取得するためのAPIを呼ぶ関数
async function get_level_words(url) {
  // データの初期化
  data = [];
  // フェッチ処理
  const response = await fetch(url);
  // レスポンスからデータを取得
  const json = await response.json();
  for (key in json) {
    console.log(key);
    console.log(json[key]);
    data.push(json[key]);
  }
  length = data.length;  // データの総数を取得
  make_pagenation();  // ページネーションの作成
}

// MyDictionaryのレベルの切り替え
function set_change_level(){
  // レベルボタンのエリアのエレメントを取得
  let level_area = document.querySelector("#level-area");
  // クリックイベントの付与
  level_area.addEventListener('click', (event)=> {
    // クラスの取得
    let class_name = event.target.className.split(' ');
    console.log(event);
    // レベルの取得
    let p_num = Number((class_name[1].split('-'))[1]);
    console.log('p_num: '+p_num);
    //　選択したレベルをアクティブにする
    change_list_active(5, p_num, '.level-list-');
    // レベルに応じたデータをAPIで呼び出す
    get_level_words('http://127.0.0.1:5000/get_level_words/'+p_num);
    // 単語の切り替わり時に上部までスクロールする
    let word_area = document.querySelector(".table-head");
    word_area.scrollIntoView({  
      behavior: 'smooth'  
    });
  });
}


let data = [];  // データの変数
let length = 0; // data length
let Div = 100;  // 1ページあたりの単語数
let Url = new URL(window.location.href);  // URLを取得
let params = Url.searchParams;  // URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
let type = params.get('dictype');  // クエリパラメータの取得
get_words('http://127.0.0.1:5000/get_words/'+type);  // 全データの取得
let mode_button = document.querySelector('#mode-btn');  // モードの切り替えボタンにイベントを付与
mode_button.addEventListener('click', change_mode);
set_change_level();  // レベルのセッティング