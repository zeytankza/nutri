// ==================== ДАННЫЕ ПРОГРАММ ====================
const programsData = [
    {
        id: 1, name: "Похудение", icon: "🔥", duration: "3 месяца", price: 14990, popular: true,
        features: ["Индивидуальный план питания", "Ежедневное меню", "Чек-листы продуктов", "Поддержка в чате 24/7"]
    },
    {
        id: 2, name: "Набор веса", icon: "💪", duration: "4 месяца", price: 16990, popular: false,
        features: ["Расчет КБЖУ", "План питания для массы", "Рекомендации по тренировкам", "Еженедельные отчеты"]
    },
    {
        id: 3, name: "Здоровое питание", icon: "🥗", duration: "2 месяца", price: 12990, popular: false,
        features: ["Сбалансированное меню", "Рецепты здоровых блюд", "Детокс-программа", "Консультации специалиста"]
    },
    {
        id: 4, name: "Экспресс-курс", icon: "⚡", duration: "1 месяц", price: 9990, popular: false,
        features: ["Быстрый старт", "Готовое меню на месяц", "Список продуктов", "Чат поддержки"]
    },
    {
        id: 5, name: "Персональный план", icon: "👤", duration: "6 месяцев", price: 24990, popular: true,
        features: ["Полная диагностика", "Индивидуальный план", "Личный нутрициолог", "Еженедельные созвоны"]
    },
    {
        id: 6, name: "Спортивное питание", icon: "🏋️", duration: "3 месяца", price: 18990, popular: false,
        features: ["Питание для спортсменов", "Расчет нагрузок", "Спортивные добавки", "Тренировочный план"]
    }
];

// ==================== КОРЗИНА ====================
let cart = [];

function loadPrograms() {
    const grid = document.getElementById('programsGrid');
    programsData.forEach(program => {
        const card = document.createElement('div');
        card.className = `program-card animate-on-scroll ${program.popular ? 'popular' : ''}`;
        
        const featuresList = program.features.map(f => `<li><i class="fas fa-check"></i> ${f}</li>`).join('');
        
        card.innerHTML = `
            <div class="program-icon">${program.icon}</div>
            <h3>${program.name}</h3>
            <div class="duration">📅 ${program.duration}</div>
            <div class="price">${program.price.toLocaleString()} ₽</div>
            <ul>${featuresList}</ul>
            <button class="add-to-cart-btn" onclick="addToCart(${program.id})">
                <i class="fas fa-shopping-cart"></i> Добавить в корзину
            </button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(programId) {
    const program = programsData.find(p => p.id === programId);
    if (!program) return;
    
    const existing = cart.find(item => item.id === programId);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ ...program, quantity: 1 });
    }
    
    updateCartUI();
    showNotification(`✅ ${program.name} добавлен в корзину!`);
    
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(btn => {
        if (btn.parentElement.querySelector('h3').textContent === program.name) {
            btn.innerHTML = '<i class="fas fa-check"></i> Добавлено!';
            btn.classList.add('added');
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Добавить в корзину';
                btn.classList.remove('added');
            }, 2000);
        }
    });
}

function updateCartUI() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
    
    const itemsContainer = document.getElementById('cartItems');
    const totalElement = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        itemsContainer.innerHTML = '<p class="empty-cart">🛒 Корзина пуста</p>';
        totalElement.textContent = '0 ₽';
        return;
    }
    
    itemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.icon} ${item.name}</h4>
                <div class="item-price">${item.price.toLocaleString()} ₽ × ${item.quantity}</div>
            </div>
            <div class="cart-item-actions">
                <button onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    totalElement.textContent = total.toLocaleString() + ' ₽';
}

function removeFromCart(programId) {
    cart = cart.filter(item => item.id !== programId);
    updateCartUI();
    showNotification('🗑️ Программа удалена из корзины');
}

function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('active');
}

// ==================== ОФОРМЛЕНИЕ ЗАЯВКИ ====================
function openOrderModal() {
    if (cart.length === 0) {
        showNotification('❌ Корзина пуста!');
        return;
    }
    
    const summary = document.getElementById('orderSummary');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    summary.innerHTML = `
        <h4>📋 Ваш заказ</h4>
        ${cart.map(item => `
            <div class="payment-order-item">
                <span class="item-name">${item.icon} ${item.name}</span>
                <span>${item.price.toLocaleString()} ₽ × ${item.quantity}</span>
            </div>
        `).join('')}
        <div class="payment-order-total">
            <span>Итого:</span>
            <span>${total.toLocaleString()} ₽</span>
        </div>
    `;
    
    document.getElementById('orderTotal').textContent = total.toLocaleString() + ' ₽';
    
    document.getElementById('orderOverlay').classList.add('active');
    document.getElementById('orderModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderModal() {
    document.getElementById('orderOverlay').classList.remove('active');
    document.getElementById('orderModal').classList.remove('active');
    document.body.style.overflow = '';
}

function submitOrder(event) {
    event.preventDefault(); // Предотвращаем перезагрузку страницы
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    
    if (!fullName || !phone) {
        showNotification('❌ Заполните все поля!');
        return;
    }

    // Имитация успешной отправки заявки
    showNotification('🎉 Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму и корзину
    document.getElementById('orderForm').reset();
    cart = [];
    updateCartUI();
    closeOrderModal();
    toggleCart(); // Закрываем боковую панель корзины
}

// ==================== УВЕДОМЛЕНИЯ ====================
function showNotification(message) {
    document.querySelectorAll('.notification').forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// ==================== АНИМАЦИИ ПРИ СКРОЛЛЕ ====================
function handleScrollAnimation() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    elements.forEach(el => observer.observe(el));
}

// ==================== МОБИЛЬНОЕ МЕНЮ И ESC ====================
function toggleMenu() { document.querySelector('.nav-links').classList.toggle('active'); }

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const sidebar = document.getElementById('cartSidebar');
        if (sidebar.classList.contains('open')) toggleCart();
        closeOrderModal();
    }
});

// ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', () => {
    loadPrograms();
    handleScrollAnimation();
    updateCartUI();
});