// Danh sách lời chúc
const wishes = [
    "Chúc bạn năm mới an khang thịnh vượng, vạn sự như ý!",
    "Chúc bạn sức khỏe dồi dào, tiền vào như nước!",
    "Chúc bạn năm mới vui vẻ, hạnh phúc bên gia đình!",
    "Chúc bạn sự nghiệp thăng tiến, công thành danh toại!",
    "Chúc bạn năm mới phát tài phát lộc, sung túc cả năm!", 
    "Chúc bạn hay ăn chóng lớn, tiền đầy túi, tình đầy tim!",
    "Chúc bạn năm mới bình an, may mắn ngập tràn!",
    "Chúc bạn tấn tài tấn lộc, mã đáo thành công!"
];

// Danh sách hình ảnh bao lì xì
const envelopeImages = [
    "images/red-envelope.png",
    "images/red-envelope2.png",
    "images/red-envelope3.png"
];

// Danh sách tiền mừng tuổi (minh họa)
const luckyMoneyAmounts = [
    { value: "1,000", image: "images/1VND.png" },
    { value: "2,000", image: "images/2VND.png" },
    { value: "5,000", image: "images/5VND.png" },
    { value: "10,000", image: "images/10VND.png" },
    { value: "20,000", image: "images/20VND.jpg" },
    { value: "50,000", image: "images/50VND.png" }
];

// Số lượng bao lì xì
const TOTAL_ENVELOPES = 10;

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupDragScroll();
});

function initApp() {
    const carouselWrapper = document.getElementById('carousel');
    carouselWrapper.innerHTML = ''; // Xóa nội dung cũ

    // 1. Tạo danh sách bao lì xì
    let envelopes = generateEnvelopes(TOTAL_ENVELOPES);

    // 2. Random thứ tự mỗi lần reload
    envelopes = shuffleArray(envelopes);

    // 3. Render ra màn hình
    envelopes.forEach(env => {
        const card = document.createElement('div');
        card.className = 'envelope-card';
        
        // Trạng thái ban đầu luôn là chưa mở (Xóa logic localStorage cũ)
        const isOpened = false; 
        
        // Nút mở lì xì
        const btnText = "Mở lì xì đi";
        const btnClass = "open-btn";
        const btnDisabled = "";

        card.innerHTML = `
            <div class="envelope-body image-mode">
                <img src="${env.bgImage}" alt="Lì xì" class="envelope-img">
                <button class="${btnClass}" ${btnDisabled} onclick="handleOpenEnvelope(this, '${env.amount}', '${env.moneyImg}', '${env.wish}')">
                    ${btnText}
                </button>
            </div>
        `;
        carouselWrapper.appendChild(card);
    });
}

function generateEnvelopes(count) {
    // 1. Tạo pool tiền theo tỉ lệ cố định cho 10 bao
    // 1x50k, 1x20k, 1x10k, 2x5k, 2x2k, 3x1k
    let moneyPool = [
        luckyMoneyAmounts.find(m => m.value === "50,000"),
        luckyMoneyAmounts.find(m => m.value === "20,000"),
        luckyMoneyAmounts.find(m => m.value === "10,000"),
        luckyMoneyAmounts.find(m => m.value === "5,000"),
        luckyMoneyAmounts.find(m => m.value === "5,000"),
        luckyMoneyAmounts.find(m => m.value === "2,000"),
        luckyMoneyAmounts.find(m => m.value === "2,000"),
        luckyMoneyAmounts.find(m => m.value === "1,000"),
        luckyMoneyAmounts.find(m => m.value === "1,000"),
        luckyMoneyAmounts.find(m => m.value === "1,000")
    ];

    // Nếu số lượng bao yêu cầu khác 10 thì tự động lấp đầy bằng random hoặc cắt bớt
    if (count > 10) {
        for(let k=10; k<count; k++) {
            moneyPool.push(luckyMoneyAmounts[Math.floor(Math.random() * luckyMoneyAmounts.length)]);
        }
    } else if (count < 10) {
        moneyPool = moneyPool.slice(0, count);
    }

    // Xáo trộn danh sách tiền này trước khi gán
    moneyPool = shuffleArray(moneyPool);

    const list = [];
    for (let i = 1; i <= count; i++) {
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        // Lấy tiền từ pool đã tạo (đảm bảo đúng tỉ lệ)
        const assignedMoney = moneyPool[i-1]; 
        const randomBg = envelopeImages[Math.floor(Math.random() * envelopeImages.length)];
        
        list.push({
            id: i, // ID cố định để track trạng thái
            wish: randomWish,
            amount: assignedMoney.value,
            moneyImg: assignedMoney.image,
            bgImage: randomBg
        });
    }
    return list;
}

// Hàm xáo trộn mảng (Fisher-Yates Shuffle)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Xử lý khi bấm nút mở
window.handleOpenEnvelope = function(btnElement, amount, moneyImg, wish) {
    // Không cần lưu localStorage nữa để reset mỗi lần load
    
    // Disable nút vừa bấm ngay lập tức trên UI (để không mở lại trong phiên này)
    btnElement.innerText = "Đã mở";
    btnElement.classList.add('disabled');
    btnElement.disabled = true;

    // Hiển thị nội dung lên Modal
    document.getElementById('modal-wish').innerText = wish;
    document.getElementById('modal-money-img').src = moneyImg;
    
    openModal();
}

// --- Modal Logic ---
const modal = document.getElementById('lixiModal');
window.openModal = function() { modal.classList.add('active'); }

// Đã tắt chức năng đóng modal để bắt buộc người dùng chỉ mở 1 lần
// window.closeModal = function() { modal.classList.remove('active'); }
// window.onclick = function(event) { if (event.target == modal) closeModal(); }

// --- Drag Scroll Logic ---
function setupDragScroll() {
    const slider = document.getElementById('carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });

    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
}