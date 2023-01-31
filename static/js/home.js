let search = document.querySelector(`input[name='search']`);
let submit = document.querySelector(`input[name='submit']`);
let button = document.querySelector(`input[name='button']`);
let mean = document.querySelector(`input[name='mean']`);

const checkboxStatus = document.getElementById('checkbox_status');
const checkbox = document.getElementById('checkbox');


// 検索ボタンが押された時
submit.addEventListener('click', function() {
    var url = "https://ejje.weblio.jp/content/"+search.value; //URLの取得
    let frame = document.querySelector("#output_frame"); 
    frame.src = url;
});

//checkboxの状態確認
window.addEventListener('DOMContentLoaded',function(){

    checkbox.addEventListener('change',function(){
        if(this.checked){ //チェックされたとき
            checkboxStatus.textContent = search.value;

            //MyDictionaryへの追加処理
            button.addEventListener('click',function(){
                alert('追加されました');
                let post_data = {}
                let new_mean = mean.value;
                let new_word = search.value;
                post_data = {
                    'new_word': new_word,
                    'new_mean': new_mean
                };
                let post_url = "http://127.0.0.1:5000/add_word"
                post_data = JSON.stringify(post_data);
                console.log("post data: ")
                console.log(post_data);
                fetch(post_url, {
                    method: 'POST',
                    body: post_data
                })
                .then((response) => {
                    if (!response.ok) {
                        console.log("error!");
                    }
                    console.log('OK');
                    return response.json();
                })
                .then((data) => {
                    console.log(data);
                })
                .catch((error) => {
                    console.log(error);
                })
                console.log(mean.value);
                console.log(search.value);
            });
        }
        else{ //チェックされていないとき
             checkboxStatus.textContent = "-----";
        }
    });
});



// function connecttext(textid, checkbox_status){

//     if(checkbox_status==true){
//         document.getElementById(textid).disabled=false;
//         checkboxStatus.textContent = search.value;
//         button.addEventListener('click',function(){
                
//         })
//     }
//     else{
//         document.getElementById(textid).disabled=true;
//         checkboxStatus.textContent = "-----";
//     }
// }