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
const TOTAL_ENVELOPES = 50;

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    setupDragScroll();
});

function initApp() {
    const carouselWrapper = document.getElementById('carousel');
    carouselWrapper.innerHTML = ''; // Xóa nội dung cũ

    // 1. Tạo danh sách 50 bao lì xì
    let envelopes = generateEnvelopes(TOTAL_ENVELOPES);

    // 2. Random thứ tự mỗi lần reload
    envelopes = shuffleArray(envelopes);

    // 3. Render ra màn hình
    envelopes.forEach(env => {
        const card = document.createElement('div');
        card.className = 'envelope-card';
        // Kiểm tra trạng thái đã mở chưa
        const isOpened = localStorage.getItem(`envelope_${env.id}`);
        
        // Nút mở lì xì
        const btnText = isOpened ? "Đã mở" : "Mở lì xì đi";
        const btnClass = isOpened ? "open-btn disabled" : "open-btn";
        const btnDisabled = isOpened ? "disabled" : "";

        card.innerHTML = `
            <div class="envelope-body image-mode">
                <img src="${env.bgImage}" alt="Lì xì" class="envelope-img">
                <button class="${btnClass}" ${btnDisabled} onclick="handleOpenEnvelope(${env.id}, '${env.amount}', '${env.moneyImg}', '${env.wish}')">
                    ${btnText}
                </button>
            </div>
        `;
        carouselWrapper.appendChild(card);
    });
}

function generateEnvelopes(count) {
    const list = [];
    for (let i = 1; i <= count; i++) {
        const randomWish = wishes[Math.floor(Math.random() * wishes.length)];
        const randomMoney = luckyMoneyAmounts[Math.floor(Math.random() * luckyMoneyAmounts.length)];
        const randomBg = envelopeImages[Math.floor(Math.random() * envelopeImages.length)];
        
        list.push({
            id: i, // ID cố định để track trạng thái
            wish: randomWish,
            amount: randomMoney.value,
            moneyImg: randomMoney.image,
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
window.handleOpenEnvelope = function(id, amount, moneyImg, wish) {
    // Lưu vào localStorage
    localStorage.setItem(`envelope_${id}`, "opened");

    // Hiển thị nội dung lên Modal
    document.getElementById('modal-wish').innerText = wish;
    document.getElementById('modal-money-img').src = moneyImg;
    
    // Disable nút vừa bấm ngay lập tức trên UI (để không cần reload)
    // Tìm button trong DOM dựa trên onclick text hoặc id (ở đây đơn giản là reload lại button text cũng được, hoặc query selector phức tạp hơn)
    // Tuy nhiên, vì danh sách đã shuffle, ta cần tìm đúng nút.
    // Cách đơn giản: Sau khi đóng modal, ta có thể để nguyên hoặc reload UI. 
    // Nhưng tốt nhất là cập nhật visual ngay.
    const allButtons = document.querySelectorAll('.open-btn');
    // Ở đây ta dùng cách đơn giản là disable nút đang được focus (nút vừa bấm)
    if(document.activeElement && document.activeElement.classList.contains('open-btn')) {
        document.activeElement.innerText = "Đã mở";
        document.activeElement.classList.add('disabled');
        document.activeElement.disabled = true;
    }

    openModal();
}

// --- Modal Logic ---
const modal = document.getElementById('lixiModal');
window.openModal = function() { modal.classList.add('active'); }
window.closeModal = function() { modal.classList.remove('active'); }
window.onclick = function(event) { if (event.target == modal) closeModal(); }

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