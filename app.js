// 卡包資料
const cardPacks = [
    { 
        id: 1, 
        name: '超級進化 夢想EX', 
        description: '測試測試',
        rarity: '★★☆☆☆',
    }
];

// 儲存和載入資料
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function loadData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// 頁面切換
function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// 註冊功能
function handleRegister() {
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value.trim();

    if (!username || !email || !password) {
        alert('請填寫所有欄位！');
        return;
    }

    // 檢查用戶是否已存在
    const users = loadData('pokemonUsers') || [];
    if (users.find(u => u.username === username)) {
        alert('用戶名已存在！');
        return;
    }

    // 新增用戶
    const newUser = {
        username,
        email,
        password,
        joinDate: new Date().toLocaleDateString()
    };

    users.push(newUser);
    saveData('pokemonUsers', users);

    alert('註冊成功！請登入');
    
    // 清空表單
    document.getElementById('registerUsername').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    
    showPage('loginPage');
}

// 登入功能
function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!username || !password) {
        alert('請填寫所有欄位！');
        return;
    }

    const users = loadData('pokemonUsers') || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        saveData('currentUser', user);
        
        // 清空表單
        document.getElementById('loginUsername').value = '';
        document.getElementById('loginPassword').value = '';
        
        // 顯示卡包頁面
        loadPacksPage(user);
    } else {
        alert('用戶名或密碼錯誤！');
    }
}

// 登出功能
function handleLogout() {
    localStorage.removeItem('currentUser');
    showPage('homePage');
}

// 載入卡包頁面
function loadPacksPage(user) {
    // 設置用戶名
    document.getElementById('username').textContent = user.username;
    
    // 生成卡包
    const packsGrid = document.getElementById('packsGrid');
    packsGrid.innerHTML = '';
    
    cardPacks.forEach(pack => {
        const packCard = document.createElement('div');
        packCard.className = `pack-card ${pack.id}`;
        backgroundImagePath = `./Image/CardPillow/${pack.id}.png`;
        packCard.style.backgroundImage = `url(${backgroundImagePath})`;
        packCard.innerHTML = `
            <div class="pack-header">
                <div class="pack-info">
                    <h3>${pack.name}</h3>
                    <p>${pack.description}</p>
                </div>
                <div class="pack-icon">📦</div>
            </div>
            <div class="pack-footer">
                <span class="pack-rarity">${pack.rarity}</span>
                <button class="pack-btn" onclick="selectPack(${pack.id})">選擇</button>
            </div>
        `;
        packsGrid.appendChild(packCard);
    });
    
    // 顯示收藏
    displayCollection(user.username);
    
    showPage('packsPage');
}

// 選擇卡包
function selectPack(packId) {
    const currentUser = loadData('currentUser');
    if (!currentUser) {
        alert('請先登入！');
        return;
    }

    const pack = cardPacks.find(p => p.id === packId);
    const userPacks = loadData('userPacks') || {};
    
    // 獲取該用戶的卡包列表
    const userPackList = userPacks[currentUser.username] || [];
    
    // 新增卡包記錄
    const newPack = {
        ...pack,
        openedDate: new Date().toLocaleString(),
        packNumber: userPackList.length + 1
    };
    
    userPackList.push(newPack);
    userPacks[currentUser.username] = userPackList;
    
    saveData('userPacks', userPacks);
}

// 顯示收藏
function displayCollection(username) {
    const userPacks = loadData('userPacks') || {};
    const userPackList = userPacks[username] || [];
    
    const collectionContainer = document.getElementById('collectionContainer');
    const collectionList = document.getElementById('collectionList');
    
    if (userPackList.length === 0) {
        collectionContainer.style.display = 'none';
        return;
    }
    
    collectionContainer.style.display = 'block';
    collectionList.innerHTML = '';
    
    userPackList.forEach(pack => {
        const item = document.createElement('div');
        item.className = 'collection-item';
        item.innerHTML = `
            <div class="collection-item-info">
                <span class="collection-item-name">#${pack.packNumber} ${pack.name}</span>
                <span class="collection-item-date">${pack.openedDate}</span>
            </div>
            <span class="collection-item-rarity">${pack.rarity}</span>
        `;
        collectionList.appendChild(item);
    });
}

function drawCards(packId) {
    const pool = Cards;

    const result = [];

    // 1. 計算總權重 
    const totalWeight = pool.reduce((sum, card) => sum + card.probability, 0);

    for (var i = 0; i < 5; i++) {
        // 2. 產生 0 到 總權重 之間的隨機數
        let random = Math.random() * totalWeight;
        // 3. 累積權重判斷
        for (const card of pool) {

            if (random < card.probability) {
                result.push({ ...card, packId });
                break;
            }
            random -= card.probability;
        }
    }
    return result;
}

function selectPack(packId) {
    const pulledCards = drawCards(packId);
    const overlay = document.getElementById('drawOverlay');
    const container = document.getElementById('cardsContainer');

    container.innerHTML = ''; // 清空舊的
    overlay.style.display = 'flex';

    pulledCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'card-item back'; // 初始為背面
        cardEl.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <img src="./Image/Card/${packId}/${card.id}.png" id ="card">
                </div>
                <div class="card-back">
                    <img src="./Image/Card_Backend.png" id ="card"> 
                </div>
            </div>
        `;

        cardEl.onclick = function () {
            this.classList.toggle('flipped'); // 點擊翻牌
            checkAllFlipped();
        };

        container.appendChild(cardEl);
    });

    // 儲存到本地
    saveToCollection(pulledCards);
}

// 儲存格式重構
function saveToCollection(newCards) {
    const currentUser = loadData('currentUser');
    const collection = loadData('userCollection') || {};
    const userList = collection[currentUser.username] || [];

    // 合併新抽到的卡片
    const updatedList = [...userList, ...newCards];
    collection[currentUser.username] = updatedList;

    saveData('userCollection', collection);
}

// 顯示收藏冊（獨立頁面入口）
function openCollectionPage () {
    showPage('collectionPage');
    const currentUser = loadData('currentUser');
    const userList = (loadData('userCollection') || {})[currentUser.username] || [];

    const grid = document.getElementById('collectionGrid');
    grid.innerHTML = userList.map(card => `
        <div class="collected-card">
            <img src="./Image/Card/${card.packId}/${card.img}">
            <p>${card.name}</p>
            <span>${card.rarity}</span>
        </div>
    `).join('');
}

function checkAllFlipped() {
    const flipped = document.querySelectorAll('.card-item.flipped').length;
    if (flipped === 5) {
        document.getElementById('closeDrawBtn').style.display = 'block';
    }
}

function closeDrawOverlay() {
    const overlay = document.getElementById('drawOverlay');
    const container = document.getElementById('cardsContainer');

    container.innerHTML = ''; // 清空舊的
    overlay.style.display = 'None';
}

// 頁面載入時檢查登入狀態
window.addEventListener('DOMContentLoaded', () => {
    InitData();
    const currentUser = loadData('currentUser');
    if (currentUser) {
        loadPacksPage(currentUser);
    }
});

// 支援 Enter 鍵登入和註冊
document.addEventListener('DOMContentLoaded', () => {
    // 登入頁面 Enter 鍵
    const loginInputs = ['loginUsername', 'loginPassword'];
    loginInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleLogin();
                }
            });
        }
    });
    
    // 註冊頁面 Enter 鍵
    const registerInputs = ['registerUsername', 'registerEmail', 'registerPassword'];
    registerInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleRegister();
                }
            });
        }
    });
});