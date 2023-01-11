// function edit_words(url)
// {
//   let formData = new FormData();
//   formData.append('param', document.getElementById('post_param').value);
//   fetch('http://127.0.01:5000/edit_words', {
//     method: 'POST',
//     body: formData
//   })
//   .then((response) => {
//     if (!response.ok){
//       throw new Error("Error ...");
//     }
//   })
// }

function change_list_active(page, num, myopt=null){
  let class_root = '.list-'
  if (myopt != null){
    class_root = myopt;
  }
  for (let i = 0; i < page; i++){
    let elem = document.querySelector(class_root+i);
    if (num == i){
      if (!elem.classList.contains('active')){
        elem.classList.add('active');
      }
    }
    else{
      if (elem.classList.contains('active')){
        elem.classList.remove('active');
      }  
    }
  }
}


function make_pagenation() {
  let p = Url.searchParams;// URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
  let t = params.get('dictype');
  let page = Math.floor(Number(length / Div)); // page num
  if (page <= 0){
    page = 1;
  }
  else{
    page+=1;
  }
  let pg_items = document.querySelector("#pagenation-area");
  pg_items.innerHTML = '';
  for (let i = 0; i < page; i++){
    let li_e = document.createElement("li");
    li_e.classList.add('page-item');
    li_e.classList.add('list-'+i);
    if (i <= 0){
      li_e.classList.add('active');
    }
    let page_button = document.createElement('button');
    page_button.innerText = i + 1;
    page_button.classList.add('page-link');
    page_button.classList.add('page-'+i);
    li_e.appendChild(page_button);
    pg_items.appendChild(li_e);
  }
  pg_items.addEventListener('click', (event)=> {
    let class_name = event.target.className.split(' ');
    let page = Math.floor(Number(length / Div)); // page num
    if (page <= 0){
      page = 1;
    }
    else{
      page+=1;
    }
    let p_num = Number((class_name[1].split('-'))[1]);
    change_list_active(page, p_num, null);
    show_page(p_num);
    let word_area = document.querySelector(".table-head");
    word_area.scrollIntoView({  
      behavior: 'smooth'  
    });
  });
  show_page(0);
}

function change_mode() {
  let p = Url.searchParams;// URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
  let t = params.get('dictype');
  let myopt = document.querySelector('.myopt');
  let mode_text = document.querySelector('.mode-text');
  let l = null;
  if (Number(t) > 0) {
    t = Number(t) - 1;
    p.set('dictype', t);
    myopt.classList.add('elem-hidden');
    mode_text.innerText = "全";
    get_words('http://127.0.0.1:5000/get_words/'+t);
  }
  else {
    t = Number(t) + 1;
    p.set('dictype', t);
    myopt.classList.remove('elem-hidden');
    mode_text.innerText = "My";
    get_level_words('http://127.0.0.1:5000/get_level_words/'+0);
  }
}

function show_page(p){
    let word_area = document.querySelector('.word-area');
    word_area.innerHTML = '';
    let pn = length - (p * Div);
    if (pn >= Div){
      pn = Div;
    }
    
    for (let i = p * Div; i < (p*Div+pn); i++) {
      let e_tr = document.createElement('tr');
      e_tr.innerHTML = "<td>"+data[i]["word"]+"</td>";
      e_tr.innerHTML += "<td>"+data[i]["mean"]+"</td>";
      e_tr.innerHTML += "<td>"+data[i]["mean"]+"</td>";
      word_area.appendChild(e_tr);
    }  
}

async function get_words(url) {
  data = [];
  const response = await fetch(url);
  const json = await response.json();
  for (key in json) {
    data.push(json[key]);
  }
  length = data.length;
  make_pagenation();
}

async function get_level_words(url) {
  data = [];
  const response = await fetch(url);
  const json = await response.json();
  for (key in json){
    console.log(key);
    console.log(json[key]);
    data.push(json[key]);
  }
  length = data.length;
  make_pagenation();
}

function set_change_level(){
  let level_area = document.querySelector("#level-area");
  level_area.addEventListener('click', (event)=> {
    let class_name = event.target.className.split(' ');
    console.log(event);
    let p_num = Number((class_name[1].split('-'))[1]);
    console.log('p_num: '+p_num);
    change_list_active(5, p_num, '.level-list-');
    get_level_words('http://127.0.0.1:5000/get_level_words/'+p_num);
    let word_area = document.querySelector(".table-head");
    word_area.scrollIntoView({  
      behavior: 'smooth'  
    });
  });
}
// function get_words(url) {
//   fetch(url)
//   .then(function (response){
//     return response.json();
//   })
//   .then(function (data){
//     for (var key in data){
//       dic_data.push(data[key]);
//     }
//     return;
//     //return data;
//   });
// };
let data = [];
let length = 0; // data length
let Div = 100;
let Url = new URL(window.location.href);// URLを取得
let params = Url.searchParams;// URLSearchParamsオブジェクトを取得let url = new URL(window.location.href);// URLを取得
let type = params.get('dictype')
get_words('http://127.0.0.1:5000/get_words/'+type);
let mode_button = document.querySelector('#mode-btn');
mode_button.addEventListener('click', change_mode);
set_change_level();

// function post_func(url) {
//   // Postで送るパラメータを作成
//   let formData = new FormData();
//   formData.append('param', document.getElementById('post_param').value);
//   fetch(url, {
//     method: 'POST',  // methodを指定しないとGETになる
//     body: formData,  // Postで送るパラメータを指定
//   })
//   .then(function() {  // Postした後に結果をGetする（コールバックなのでPostが実行完了してから実行される)
//     get_words('http://127.0.0.1:5000/get_words/0');  // 今回は「http://192.168.1.100:4000/get」
//   });
//   // ここにget_funcを書くとPostとGetがほぼ同時に行われてしまい、Post結果をGetできない
//   // get_func('APIのGet用URL');
// }