class CardData {
    constructor(id, probability) {
        this.id = id;
        this.probability = probability;
    }
}
let Cards;
function InitData() {
    fetch('./CardData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json(); // 解析成 JS 物件
        })
        .then(data => {
            Cards = data.map(d => new CardData(d.id, d.probability));
        })
        .catch(err => {
            console.error('讀取 JSON 失敗:', err);
        });
}
