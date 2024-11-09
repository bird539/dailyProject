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

function emtyFieldRe(x, y) {
    let target = document.querySelector(`.f_${x}_${y}`);
    //console.log(x, y);
    //console.log(target);
    if (target == null) { return; }
    let value = target.value.split(",");
    let info = {
        bombBool: Number(value[0]),
        restBoomNum: Number(value[1]),
        openBool: Number(value[2]),
        flagBool: Number(value[3]),
    }
    if (info.openBool == 0) {
        if (info.restBoomNum == 0) {
            target.innerText = " ";
            target.style.border = "none"; succesEvent();
            info.openBool = 1;
            target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
            x = Number(x); y = Number(y);

            emtyFieldRe(x + 1, y); //위
            emtyFieldRe(x - 1, y); //아래 
            emtyFieldRe(x, y - 1); //왼옆
            emtyFieldRe(x, y - 1); //오엽

            emtyFieldRe(x + 1, y - 1); //대각선 위 왼
            emtyFieldRe(x + 1, y + 1); //대각선 위 오
            emtyFieldRe(x - 1, y - 1); //대각선 아래 왼
            emtyFieldRe(x - 1, y + 1); //대각선 아래 오
        } else if (info.restBoomNum > 0) {
            info.openBool = 1;
            target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
            target.innerText = info.restBoomNum; 
            target.style.border = "none"; succesEvent();
        }
    }
}

setInterval(secondTime, 1000);
function secondTime() {
    const target = "playTime";
    let query = document.querySelector(`.${target}`);
    let befoTime = query.innerText.split(":");
    let m = Number(befoTime[0]);
    let s = Number(befoTime[1]) + 1;
    if (s > 59) { m += 1; s = 0; }
    //console.log(m, s);
    query.innerText = `${m}:${s}`;
}
function boomDieEvent() {
    const answerDiv = document.querySelector(".answerDiv");
    answerDiv.innerText = "faile"

    const field = document.querySelector(".field");
    //console.log(field.childNodes, field.childNodes.length, field.childNodes[0].childNodes.length, field.childNodes[0].childNodes[0]);
    for (let i = 0; i < field.childNodes.length; i++) {
        for (let j = 0; j < field.childNodes[i].childNodes.length; j++) {
            const target = field.childNodes[i].childNodes[j];
            let value = target.value.split(",");
            let info = {
                bombBool: Number(value[0]),
                restBoomNum: Number(value[1]),
                openBool: Number(value[2]),
                flagBool: Number(value[3]),
            }
            if (target.style.border != "none") {
                if (info.bombBool == 0) {
                    //숫자 필드 - 단일
                    if (info.restBoomNum > 0) {
                        target.innerText = info.restBoomNum;
                    } else if (info.restBoomNum == 0) {
                        //그냥 필드
                        target.innerText = "";
                    }
                } else if (info.bombBool == 1) {
                    //폭발 - 게임
                    target.innerText = "💥";
                }
                info.openBool = 1;
                target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
                target.style.border = "none";
            }
        }
    }

    const pageFoot = document.querySelector(".pageFoot");
    let playTime = document.querySelector(`.playTime`);
    let record2 = document.querySelector(`.record2`);
    record2.innerText = "🕓" + playTime.innerText;
    
    pageFoot.style.display = "flex";
}

function succesEvent() {
    //score.innerText = `${this.gameInfo.fieldWidth * this.gameInfo.fieldHeight}/${this.gameInfo.bombNum}`;

    const score = document.querySelector(".score");
    let array = score.innerText.split("/"); 
    let fieldN = Number(array[0]) - 1;
    let bombN = Number(array[1]);
    score.innerText = `${fieldN}/${bombN}`;

    if(fieldN == bombN){
        const field = document.querySelector(".field");
        for (let i = 0; i < field.childNodes.length; i++) {
            for (let j = 0; j < field.childNodes[i].childNodes.length; j++) {
                const target = field.childNodes[i].childNodes[j];
                let value = target.value.split(",");
                let info = {
                    bombBool: Number(value[0]),
                    restBoomNum: Number(value[1]),
                    openBool: Number(value[2]),
                    flagBool: Number(value[3]),
                }
                if (target.style.border != "none") {
                    if (info.bombBool == 1) {
                        //폭발 - 게임
                        target.innerText = "💥";
                    }
                    info.openBool = 1;
                    target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
                    target.style.border = "none";
                }
            }
        }
        let playTime = document.querySelector(`.playTime`);
        let record2 = document.querySelector(`.record2`);
        record2.innerText = "🕓" + playTime.innerText;
        
        const answerDiv = document.querySelector(".answerDiv");
        answerDiv.innerText = "success";
        const pageFoot = document.querySelector(".pageFoot");
        pageFoot.style.display = "flex";
    }
}
//실제 화면에 표시될 객체들
class gamePage {
    css = {
        backgroundColor: "white",
        fieldSize: "30",
        fontColor: "black",
        fontSize: "14",
        fontFamily: "sans-serif"
    }
    gameInfo = {
        gameTitle: "mineField game",
        lifeNum: 0,
        fieldWidth: 6,
        fieldHeight: 5,
        bombNum: 5,
        plagNum: 0,
        playerName: "player",
        playTime: "0:0"
    }
    constructor() {
        this.css.backgroundColor = "white";
        this.css.fieldSize = "60";
        this.css.fontColor = "black";
        this.css.fontSize = "14";
        this.css.fontFamily = "sans-serif";

        this.gameTitle = "mineField game";
        this.lifeNum = 0;
        this.fieldWidth = 6;
        this.fieldHeight = 5;
        this.bombNum = 16;
        this.plagNum = 0;
        this.playerName = "player";
        this.playTime = "00:00";
    }
    Create() {
        let div = document.createElement("div");
        div.style.backgroundColor = "transparent";
        div.style.fontSize = `${this.css.fontSize}pt`;
        div.style.fontFamily = this.css.fontFamily;
        div.style.fontColor = this.css.fontColor;
        div.style.display = "flex";
        div.style.flexWrap = "wrap";
        div.style.flexDirection = "column";

        const gamePage = div.cloneNode(false);
        gamePage.className = "gamePage";

        gamePage.appendChild(this.makeHead());
        gamePage.appendChild(this.makeBody());
        gamePage.appendChild(this.makeFoot());

        return gamePage;
    }

    makeHead() {
        let div = document.createElement("div");
        div.style.backgroundColor = "transparent";
        div.style.fontSize = `${this.css.fontSize}pt`;
        div.style.fontFamily = this.css.fontFamily;
        div.style.fontColor = this.css.fontColor;
        div.style.display = "flex";
        div.style.flexWrap = "wrap";

        let input = document.createElement("input");
        input.style.backgroundColor = "transparent";
        input.style.fontSize = `${this.css.fontSize}pt`;
        input.style.fontFamily = this.css.fontFamily;
        input.style.fontColor = this.css.fontColor;
        input.style.display = "flex";
        input.style.flexWrap = "wrap";

        const pageHead = div.cloneNode(false);
        pageHead.style.justifyContent = "center";
        pageHead.style.flexDirection = "column";
        pageHead.style.height = `${this.css.fontSize * 7}px`;

        const gameTitle = div.cloneNode(false);
        gameTitle.innerText = "mine field game";
        gameTitle.style.fontSize = `${this.css.fontSize * 2}pt`
        gameTitle.style.justifyContent = "center";
        pageHead.appendChild(gameTitle);

        const playerName = input.cloneNode(false);
        playerName.value = `${this.gameInfo.playerName}`;
        playerName.style.textAlign = "center";
        playerName.style.border = "0";
        pageHead.appendChild(playerName);

        const gameInfos = div.cloneNode(false);
        gameInfos.style.justifyContent = "center";
        gameInfos.style.width = "100%";

        const gameInfosL = div.cloneNode(false);
        gameInfosL.style.justifyContent = "left";
        gameInfosL.style.width = "50%";
        const fieldNum = div.cloneNode(false);
        fieldNum.style.paddingRight = "10px";
        fieldNum.innerText = `🟩${this.gameInfo.fieldWidth}x${this.gameInfo.fieldHeight} `;
        const bombNum = div.cloneNode(false);
        bombNum.style.paddingRight = "10px";
        bombNum.innerText = `💣${this.gameInfo.bombNum}(${Math.floor(this.gameInfo.bombNum / (this.gameInfo.fieldWidth * this.gameInfo.fieldHeight) * 100)}%) `;

        const gameInfosR = div.cloneNode(false);
        gameInfosR.style.justifyContent = "right";
        gameInfosR.style.width = "50%";
        const plagNum = div.cloneNode(false);
        plagNum.style.paddingRight = "10px";
        plagNum.innerText = `🚩${this.gameInfo.plagNum} `;
        const lifeNum = div.cloneNode(false);
        lifeNum.style.paddingRight = "10px";
        lifeNum.innerText = `❤️${this.gameInfo.lifeNum} `;

        const time = div.cloneNode(false);
        time.innerText = `🕓`;
        const playTime = div.cloneNode(false);
        playTime.innerText = `${this.gameInfo.playTime} `;
        playTime.style.justifyContent = "right";
        playTime.className = "playTime";

        gameInfosR.appendChild(fieldNum);
        gameInfosR.appendChild(bombNum);
        gameInfosL.appendChild(plagNum);
        gameInfosL.appendChild(lifeNum);
        gameInfosL.appendChild(time);
        gameInfosL.appendChild(playTime);

        gameInfos.appendChild(gameInfosR);
        gameInfos.appendChild(gameInfosL);
        pageHead.appendChild(gameInfos);

        return pageHead;
    }
    makeBody() {
        let div = document.createElement("div");
        div.style.backgroundColor = "transparent";
        div.style.fontSize = `${this.css.fieldSize}px`;
        div.style.fontFamily = this.css.fontFamily;
        div.style.fontColor = this.css.fontColor;
        div.style.display = "flex";
        div.style.flexWrap = "wrap";

        let btn = document.createElement("button");
        //btn.style.backgroundColor = "transparent";
        btn.style.padding = 0;
        btn.style.border = 0;
        btn.style.width = `${this.css.fieldSize}px`;
        btn.style.height = `${this.css.fieldSize}px`;
        btn.style.fontSize = `${this.css.fieldSize / 1.9}pt`;
        btn.style.fontFamily = this.css.fontFamily;
        btn.style.fontColor = this.css.fontColor;
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.justifyContent = "center";

        const field = div.cloneNode(false);
        field.style.flexDirection = "column";
        //bombBool; restBoomNum; openBool; flagBool;
        let fieldInfo = makeMineFieldArray(this.gameInfo.fieldWidth, this.gameInfo.fieldHeight, this.gameInfo.bombNum);

        for (let x = 0; x < fieldInfo.length; x++) {
            const row = div.cloneNode(false);
            row.style.justifyContent = "center";
            for (let y = 0; y < fieldInfo[x].length; y++) {
                const fieldN = btn.cloneNode(false);
                fieldN.innerText = "🟩";
                fieldN.value = fieldInfo[x][y].returnValue();
                fieldN.className = `f_${x}_${y}`;
                fieldN.addEventListener("click", this.fieldEvent);
                row.appendChild(fieldN);
            }
            field.appendChild(row);
        }
        field.className = "field";
        return field;
    }
    makeFoot() {
        let div = document.createElement("div");
        div.style.backgroundColor = "transparent";
        div.style.fontSize = `${this.css.fontSize}pt`;
        div.style.fontFamily = this.css.fontFamily;
        div.style.fontColor = this.css.fontColor;
        div.style.display = "flex";
        div.style.flexWrap = "wrap";

        div.style.justifyContent = "center";

        let input = document.createElement("input");
        input.style.backgroundColor = "transparent";
        input.style.fontSize = `${this.css.fontSize}pt`;
        input.style.fontFamily = this.css.fontFamily;
        input.style.fontColor = this.css.fontColor;
        input.style.display = "flex";
        input.style.flexWrap = "wrap";

        const pageFoot = div.cloneNode(false);
        pageFoot.style.justifyContent = "center";
        pageFoot.style.flexDirection = "column";
        pageFoot.style.display = "none";
        const answer = div.cloneNode(false);
        answer.style.fontSize = `${this.css.fontSize * 2}pt`;
        answer.className = "answerDiv";
        answer.innerText = "success or fail"

        const playerName = div.cloneNode(false);
        playerName.innerText = `${this.gameInfo.playerName}`;

        const record1 = div.cloneNode(false);
        record1.innerText = `🟩${this.gameInfo.fieldWidth}x${this.gameInfo.fieldHeight} 💣${this.bombNum}(${Math.floor(this.gameInfo.bombNum / (this.gameInfo.fieldWidth * this.gameInfo.fieldHeight) * 100)}%) 🚩${this.gameInfo.plagNum} ❤️${this.gameInfo.lifeNum} 🕓${this.gameInfo.playTime}`
        
        
        const record2 = div.cloneNode(false);
        record2.innerText  = `${Date()}`;
        record2.className = "record2";

        const score = div.cloneNode(false);
        score.className = "score";
        score.style.display = "none";
        score.innerText = `${this.gameInfo.fieldWidth * this.gameInfo.fieldHeight}/${this.gameInfo.bombNum}`;


        pageFoot.appendChild(answer);
        pageFoot.appendChild(playerName);
        pageFoot.appendChild(record1);
        pageFoot.appendChild(record2);
        pageFoot.appendChild(score);
        pageFoot.className = "pageFoot";
        return pageFoot;
    }
    fieldEvent(event) {
        let value = event.target.value.split(",");
        let info = {
            bombBool: Number(value[0]),
            restBoomNum: Number(value[1]),
            openBool: Number(value[2]),
            flagBool: Number(value[3]),
        }

        if (info.bombBool == 0) {
            //숫자 필드 - 단일
            if (info.restBoomNum > 0) {
                info.openBool = 1;
                event.target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
                if(event.target.innerText == "🟩"){succesEvent();}
                event.target.innerText = info.restBoomNum;
                event.target.style.border = "none";
            } else if (info.restBoomNum == 0) {
                //그냥 필드 - 연쇄
                let xy = event.target.className.split('_');
                emtyFieldRe(xy[1], xy[2]);
            }
        } else if (info.bombBool == 1) {
            //폭발 - 게임
            info.openBool = 1;
            event.target.value = `${info.bombBool},${info.restBoomNum},${info.openBool},${info.plagNum}`;
            event.target.innerText = "💥";
            event.target.style.border = "none";
            boomDieEvent();
        }
    }

    //머리 - 게임명, 폭탄수, 깃발수, 목숨 개수, 플탐 시간,  
    //본문 - 필드들
    //바닥 - 게임 결과, 플레이어명, 점수(기존 세팅), 날짜, 순위표
}

function makeMineFieldArray(row, colum, bombNum) {
    class field {
        bombBool; restBoomNum; openBool; flagBool;
        constructor() { this.bombBool = 0; this.restBoomNum = 0; this.openBool = 0; this.flagBool = 0; }

        returnValue() {
            return `${this.bombBool},${this.restBoomNum},${this.openBool},${this.flagBool}`;
        }
    }
    let array = []; //최종 결과물

    //기본 필드 생성
    for (let i = 0; i < row; i++) {
        let newArr = [];
        for (let j = 0; j < colum; j++) { newArr.push(new field()); }
        array.push(newArr);
    }
    //bombCount = Math.floor((row * colum) * (bombNum / 100));
    bombCount = bombNum;

    let RowArr = []; for (let i = 0; i < row; i++) { RowArr.push(i) };
    let ColumArr = []; for (let i = 0; i < colum; i++) { ColumArr.push(i) };
    function shuffle(arr) { arr.sort(() => Math.random() - 0.5); }

    let ranBomArr = [];
    for (let i = 0; i < row * colum; i++) { ranBomArr.push(Math.floor(Math.random() * 2)) };

    //폭탄 생성
    let exa = [];

    exBombCount = 0;
    while (exBombCount < bombCount) {
        shuffle(RowArr); shuffle(ColumArr);

        target = array[RowArr[0]][ColumArr[0]];
        if (target.bombBool == 0) {
            if (Math.floor(Math.random() * 2) == 1) {
                exa.push([RowArr[0], ColumArr[0]]);
                target.bombBool = 1;
                exBombCount += 1;
            }
        }
    }
    //console.log(bombCount, exBombCount);
    //폭탄 근처 필드 숫자 생성
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < colum; j++) {
            if (array[i][j].bombBool == 1) {
                //위(x+1) 아래(x-) 옆(y+) 옆(y-) 대각선 위위(x+ y--)(x+ y++) 아래아래(x- y++)(x- y--)
                if (i + 1 <= row - 1) { array[i + 1][j].restBoomNum += 1 }
                if (i - 1 >= 0) { array[i - 1][j].restBoomNum += 1 }
                if (j + 1 <= colum - 1) { array[i][j + 1].restBoomNum += 1 }
                if (j - 1 >= 0) { array[i][j - 1].restBoomNum += 1 }

                if (i + 1 <= row - 1 && j - 1 >= 0) { array[i + 1][j - 1].restBoomNum += 1 }
                if (i + 1 <= row - 1 && j + 1 <= colum - 1) { array[i + 1][j + 1].restBoomNum += 1 }

                if (i - 1 >= 0 && j - 1 >= 0) { array[i - 1][j - 1].restBoomNum += 1 }
                if (i - 1 >= 0 && j + 1 <= colum - 1) { array[i - 1][j + 1].restBoomNum += 1 }
            }
        }
    }

    /** 결과 확인
    let rarrArr = [];
    for (let i = 0; i < array.length; i++) {
        rarrArr.push([])
        for (let j = 0; j < array[i].length; j++) {
            rarrArr[i].push(array[i][j].returnValue());
        }
    }
    console.log(rarrArr);
    */
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

let rarr = makeMineFieldArray(5, 5, 20);
let rarrArr = [];
for (let i = 0; i < rarr.length; i++) {
    rarrArr.push([])
    for (let j = 0; j < rarr[i].length; j++) {
        rarrArr[i].push(rarr[i][j].returnValue());
    }
}

const newGame = new gamePage();
mainDiv.appendChild(newGame.Create());
//console.log(rarrArr);
