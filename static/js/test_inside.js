//click <button> next ⇒ Update Q&A
document.getElementById("button_next").onclick = function() {
    //get Question
    get_info();
    if(index!=-1){
        //jsonデータ作成処理 error
        //add score_data
        //post_data.push({
        //    word : Dic[index].word,
        //    index : index,
        //    understand_level : -1,
        //});
    }
    document.getElementById("button_next").style.pointerEvents = "none";
    document.getElementById("button_next").disabled = true;
    document.getElementById("button_level").style.pointerEvents = "auto";
    document.getElementById("button_level").disabled = false;
}

// click <button> lebel of understanding
document.getElementById("button_level").onclick = function() {
    //to userjudge step
    document.getElementById("button_level").style.pointerEvents = "none";
    document.getElementById("button_level").disabled = true;
    document.getElementById("button_judge").style.pointerEvents = "auto";
    document.getElementById("button_judge").disabled = false;
    //get answer
    var Answer = "A." + Dic[index].mean;
    //replace A
    document.getElementById("Answer").innerText =Answer;
}
//if click 1,2,3 <button>
document.getElementById("level1").onclick = function() {
    score_buf = 1;
}
document.getElementById("level2").onclick = function() {
    score_buf = 2;
}
document.getElementById("level3").onclick = function() {
    score_buf = 3;
}

// click <button>  user judge
document.getElementById("button_judge").onclick = function() {
    //to next step
    document.getElementById("button_judge").style.pointerEvents = "none";
    document.getElementById("button_judge").disabled = true;
    document.getElementById("button_next").style.pointerEvents = "auto";
    document.getElementById("button_next").disabled = false;
    document.getElementById("score").innerText =score_all;
}
//if click 〇✕△ <button>
document.getElementById("circle").onclick = function() {
    score_all += score_buf * 10;
}
document.getElementById("triangle").onclick = function() {
    score_all += score_buf * 5;
}
document.getElementById("cross").onclick = function() {
    score_all += score_buf * 3;
}

function get_info(){
    //get dictionary
    Dic = JSON.parse(JSON.stringify(data));
    //select word_index_number(random)
    index+=1;/*rand(Dic.length-1)*/
    //get question
    var Question = "Q." + Dic[index].word;
    console.log(Question);
    //replace Q&A
    document.getElementById("Question").innerText = Question;
    document.getElementById("Answer").innerText = "A.";
}

function get_words(url) {
    fetch(url)
    .then(function (response){
      return response.json();
    })
    .then(function (json){
        // remake or origin
        // set_words(data)
      console.log(json);
      data = json;
      return
    });
};

// click <button> finish
document.getElementById("button_finish").onclick = function() {
    //データを送る処理 error
    //fetch(post_data, {
    //    method: 'POST',
    //    body: post_data,
    //})
}

var Dic;//a dictionary word receive
var post_level;//understand level(word)
var score_buf;//score buffur
var score_all=0;//sum score
var index =-1;//index number(word)
post_data = {}//jsondata (send word_indexnumber and understand_level)
data = {}//all dictionary receive

get_words('http://127.0.0.1:5000/get_words/0');
