//옵저버 패턴
class pipe_get {
    constructor() { this.observers = []; this.exValue = null; this.target = null; }
    subscribe(observer) { this.observers.push(observer); }
    unsubscribe(observer) { this.observers = this.observers.filter((obs) => obs !== observer); }
    clear() { this.observers = [this.observers[0],]; } //컨트롤러는 항시 놔두기

    notifyAll() {
        for (let i = this.observers.length - 1; i > -1; i--) {
            let subscriber = this.observers[i];
            try { //컨트롤러는 무조건 실행 
                if (subscriber.target == "Controller") {
                    subscriber.getValue(this.target, this.exValue);
                } else {
                    this.exValue = subscriber.sendValue();
                    this.target = subscriber.sendTarget();
                }
            } catch (err) { console.error("error", err); }
        }
        this.clear();
    }
}
class pipe_send {
    check = null; value = null; target = null;
    constructor(check) { this.check = check; this.value = null; this.target = null; }
    sendValue() { return this.value; }
    getValue(value) { this.value = value; }
    sendTarget() { return this.target; }
}
const pipe = new pipe_get();

//실제 화면에 표시될 객체들
class gamePage {
    //머리 - 게임명, 폭탄수, 깃발수, 목숨 개수, 플탐 시간,  
    //본문 - 필드들
    //바닥 - 전체수
}
class field {
    //값 - 폭탄여부, 근처 폭탄 수, 공개 여부, 깃발 여부
    //공개 전 배경 - 깃발여부 | 공개 후 배경 - 빈 배경, 근처 폭탄 숫자, 폭탄 배경
    //공개 이벤트(폭탄 폭발, 폭판 수 공간 공개, 빈 공간 공개)
    //깃발 이벤트(깃발 추가)  
}
class remote {
    //새로운 게임 세팅 후 시작 - 필드 크기, 폭탄 비율 or 폭탄 수 
    //현재에서 재시작
    //화면 css 조정 - 글자크기, 배경색
    //기록 보기 - 성공 / 실패 (순위, 게임일자, 플레이어명, 필드, 폭탄비율(개수), 목숨 수, 플레이시간)
}
class resultPage {
    //머리 - 게임명, 승리여부
    //본문 - 총 계산 점수, 순위, 게임 플레이어명 입력란
    //바닥 - 게임 플레이어 순위(점수로, 성공여부로 나눠서,)
}
function makeMineFieldArray(row, colum, bombNum) {
    let array = []; 
    for (let i = 0; i < row; i++) { 
        let newArr = [];
        for (let j = 0; j < colum; j++) { newArr.push("o"); }
        array.push(newArr); 
    }
    bombCount = Math.floor((row * colum) * (bombNum / 100));

    let RowArr = []; for (let i = 0; i < row; i++) { RowArr.push(i) };
    let ColumArr = []; for (let i = 0; i < colum; i++) { ColumArr.push(i) };
    function shuffle(arr) { arr.sort(() => Math.random() - 0.5); }

    let ranBomArr = []; 
    for(let i=0; i<row * colum; i++){ranBomArr.push( Math.floor(Math.random() * 2) )};

    let exa = [];
    exBombCount = 0;
    while(exBombCount < bombCount){
        shuffle(RowArr); shuffle(ColumArr); 
        if(Math.floor(Math.random() * 2) == 1){
            exa.push([RowArr[0], ColumArr[0]]);
            array[ RowArr[0] ][ ColumArr[0] ] = "x";
            exBombCount += 1;
        }
    }
    return array;
}


class basic_nowPlayInfo {
    mapRow = 10;
    mapColum = 8;
    bombNum = 20;
    flagNum = 0; playerName = "player";
    fieldArray = [];
    constructor() {
        this.mapSize = 80;
        this.bombNum = 16;
        this.flagNum = 0;
        this.playerName = "player";
    }
}

class Model { //CRUD
    nowPlayInfo = null; historyPlay = null; gameCss = null;
    DBname = {
        nowPlayInfo: "nowPlayInfo",
        historyPlay: "historyPlay",
        gameCss: "gameCss",
    }
    constructor() {
        this.nowPlayInfo = JSON.parse(localStorage.getItem(this.DBname.nowPlayInfo));
        if (this.nowPlayInfo == null) {
            this.nowPlayInfo = {};
            this.nowPlayInfo_save();
        }
        this.historyPlay = JSON.parse(localStorage.getItem(this.DBname.historyPlay));
        this.gameCss = JSON.parse(localStorage.getItem(this.DBname.gameCss));
    }

    nowPlayInfo_save() {
        localStorage.setItem(this.DBname.nowPlayInfo, JSON.stringify(this.nowPlayInfo));
    }
}
class View {

}
class Controller {

}



//================
const mainDiv = document.querySelector(".main");

let rarr = makeMineFieldArray(10, 8, 20);
console.log(rarr);
