
const categoryConfig = {
  thaqafa: { label: "ثقافة",  color: "#f0b429", textColor: "#7a4200" },
  riyadha: { label: "رياضة",  color: "#1db97b", textColor: "#0b5a36" },
  musiqa:  { label: "موسيقى", color: "#c84ab7", textColor: "#5e1457" },
  aaila:   { label: "عائلي",  color: "#4a6ee0", textColor: "#1a2f8a" },
  ilm:     { label: "علمي",   color: "#7c3ccc", textColor: "#3a1068" }
};
const DEFAULT_IMAGE = "https://placehold.co/600x400/0d2e6e/ffffff?text=فعالية";
function getAllEvents() {
  const stored = localStorage.getItem('eventsData');
  return stored ? JSON.parse(stored) : [];
}

function saveEvents(events) {
  localStorage.setItem('eventsData', JSON.stringify(events));
}

function getNextId() {
  const events = getAllEvents();
  if (events.length === 0) return 1;
  return Math.max(...events.map(e => e.id)) + 1;
}


function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
}

function createEventCard(ev, showDetails = true) {
  const cat = categoryConfig[ev.category] || { label: ev.category, color: '#888', textColor: '#333' };
  return `
    <div class="col-md-6 col-lg-4 event-item" data-category="${ev.category}" data-date="${ev.date}">
      <div class="event-card">
        <img src="${ev.image || DEFAULT_IMAGE}" alt="${ev.title}" class="event-card-img"
             onerror="this.src='${DEFAULT_IMAGE}'">
        <div class="event-card-body">
          <span class="event-cat-badge"
                style="background:${cat.color}22;color:${cat.textColor};border:1px solid ${cat.color}50">
            ${cat.label}
          </span>
          <div class="event-card-title">${ev.title}</div>
          <div class="event-card-meta">
            <span>📅 ${ev.dateLabel}</span>
            <span>📍 ${ev.location}</span>
          </div>
          <div class="event-card-desc">${ev.description}</div>
          ${showDetails ? `<a href="event.html?id=${ev.id}" class="btn-primary-custom btn-sm mt-auto">التفاصيل <i class="bi bi-arrow-left"></i></a>` : ''}
        </div>
      </div>
    </div>
  `;
}

function initSlider() {
  const track         = document.getElementById('slider-track');
  const dotsContainer = document.getElementById('slider-dots');
  if (!track || !dotsContainer) return;

  const events = getAllEvents();

  if (events.length === 0) {
    track.innerHTML = `
      <div class="slide d-flex align-items-center justify-content-center"
           style="background:rgba(0,0,0,0.4)">
        <div style="text-align:center;color:#fff;padding:2rem">
          <p style="font-size:1.1rem;margin-bottom:1rem">لا توجد فعاليات حتى الآن</p>
          <a href="events.html" class="btn-accent">إضافة فعالية</a>
        </div>
      </div>`;
    dotsContainer.innerHTML = '';
    return;
  }

  track.innerHTML = events.slice(0, 5).map(ev => `
    <div class="slide">
      <img src="${ev.image || DEFAULT_IMAGE}" alt="${ev.title}"
           onerror="this.src='${DEFAULT_IMAGE}'">
      <div class="slide-overlay">
        <h3>${ev.title}</h3>
        <p>📅 ${ev.dateLabel} — ${ev.location}</p>
      </div>
    </div>
  `).join('');

  const slides = track.querySelectorAll('.slide');
  dotsContainer.innerHTML = [...slides].map((_, i) =>
    `<button class="slider-btn ${i === 0 ? 'active' : ''}"></button>`
  ).join('');

  const dots  = dotsContainer.querySelectorAll('.slider-btn');
  let current = 0;
  const total = slides.length;

  function goTo(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
  }

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));
  document.querySelector('.slider-arrow.next')?.addEventListener('click', () => goTo(current - 1));
  document.querySelector('.slider-arrow.prev')?.addEventListener('click', () => goTo(current + 1));
  setInterval(() => goTo(current + 1), 4000);
  goTo(0);
}

function loadHomeEvents() {
  const container = document.getElementById('latest-events');
  if (!container) return;
  const events = getAllEvents();
  if (events.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5">
      <p style="color:var(--text-muted);font-size:1.1rem;">لا توجد فعاليات حتى الآن</p>
      <a href="events.html" class="btn-accent mt-2 d-inline-block">إضافة فعالية</a>
    </div>`;
    return;
  }
  container.innerHTML = events.slice(0, 3).map(ev => createEventCard(ev)).join('');
}

function loadFeaturedEvent() {
  const container = document.getElementById('featured-event');
  if (!container) return;
  const events = getAllEvents();

  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const ev = events.find(e => e.date === today);

  if (!ev) {
    container.innerHTML = `<div class="text-center py-4">
      <p style="color:var(--text-muted)">لا توجد فعاليات اليوم</p>
    </div>`;
    return;
  }

  const cat = categoryConfig[ev.category] || { label: ev.category, color: '#f0b429', textColor: '#7a4200' };
  container.innerHTML = `
    <div class="row align-items-center g-4"
         style="background:var(--bg-card);border-radius:var(--radius);box-shadow:var(--shadow);border:1px solid var(--border);overflow:hidden">
      <div class="col-md-5" style="padding:0">
        <img src="${ev.image || DEFAULT_IMAGE}" alt="${ev.title}"
             onerror="this.src='${DEFAULT_IMAGE}'"
             style="width:100%;height:260px;object-fit:cover;border-radius:0">
      </div>
      <div class="col-md-7" style="padding:1.8rem">
        <span class="event-cat-badge"
              style="background:${cat.color}22;color:${cat.textColor};border:1px solid ${cat.color}50;font-size:.85rem;padding:4px 14px">
          ${cat.label}
        </span>
        <h3 style="font-size:1.4rem;font-weight:900;color:var(--primary);margin:10px 0 8px">${ev.title}</h3>
        <p style="color:var(--text-muted);font-size:.93rem;line-height:1.8">${ev.description}</p>
        <div class="d-flex gap-3 mt-2 mb-3 flex-wrap justify-content-center"
             style="font-size:.85rem;color:var(--text-muted)">
          <span>📅 ${ev.dateLabel}</span>
          <span>📍 ${ev.location}</span>
          <span>🎫 دخول مجاني</span>
        </div>
        <a href="event.html?id=${ev.id}" class="btn-primary-custom mx-auto d-block" style="width:fit-content">
          التفاصيل الكاملة <i class="bi bi-arrow-left"></i>
        </a>
      </div>
    </div>
  `;
}

function loadAllEvents(filter = 'all', search = '', dateFilter = '') {
  const container = document.getElementById('all-events-container');
  if (!container) return;
  let events = getAllEvents();
  if (filter !== 'all') events = events.filter(e => e.category === filter);
  if (search) events = events.filter(e =>
    e.title.includes(search) || e.description.includes(search)
  );
  if (dateFilter) events = events.filter(e => e.date >= dateFilter);

  if (events.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5">
      <p style="color:var(--text-muted);font-size:1.1rem;">لا توجد فعاليات مطابقة للبحث</p>
    </div>`;
    return;
  }
  container.innerHTML = events.map(ev => createEventCard(ev)).join('');
}

function submitNewEvent() {
  const title       = document.getElementById('ev-title')?.value.trim();
  const category    = document.getElementById('ev-category')?.value;
  const date        = document.getElementById('ev-date')?.value;
  const location    = document.getElementById('ev-location')?.value.trim();
  const description = document.getElementById('ev-description')?.value.trim();
  const image       = document.getElementById('ev-image')?.value.trim();
  const alertEl     = document.getElementById('modal-alert');

  if (!title || !category || !date || !location || !description) {
    alertEl.className = 'alert alert-danger';
    alertEl.textContent = '⚠️ يرجى ملء جميع الحقول المطلوبة.';
    alertEl.classList.remove('d-none');
    return;
  }

  const cat = categoryConfig[category];
  const newEvent = {
    id:           getNextId(),
    title,
    category,
    catLabel:     cat.label,
    catColor:     cat.color,
    catTextColor: cat.textColor,
    date,
    dateLabel:    formatDateLabel(date),
    location,
    description,
    image:        image || DEFAULT_IMAGE,
    featured:     false
  };

  const events = getAllEvents();
  events.push(newEvent);
  saveEvents(events);


  const modal = bootstrap.Modal.getInstance(document.getElementById('addEventModal'));
  modal.hide();

 
  ['ev-title','ev-category','ev-date','ev-location','ev-description','ev-image'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  alertEl.classList.add('d-none');


  loadAllEvents();
  loadHomeEvents();
  loadFeaturedEvent();
  initSlider();
}

function resetFilters() {
  const s = document.getElementById('search-input');
  const c = document.getElementById('cat-select');
  const d = document.getElementById('date-input');
  if (s) s.value = '';
  if (c) c.value = 'all';
  if (d) d.value = '';
  loadAllEvents();
}

function initFilters() {
  document.querySelectorAll('.cat-badge[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.cat-badge[data-cat]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat    = btn.dataset.cat;
      const search = document.getElementById('search-input')?.value.trim() || '';
      const date   = document.getElementById('date-input')?.value || '';
      loadAllEvents(cat, search, date);
    });
  });

  document.getElementById('search-input')?.addEventListener('input', () => {
    const cat    = document.getElementById('cat-select')?.value || 'all';
    const search = document.getElementById('search-input').value.trim();
    const date   = document.getElementById('date-input')?.value || '';
    loadAllEvents(cat, search, date);
  });

  document.getElementById('cat-select')?.addEventListener('change', () => {
    const cat    = document.getElementById('cat-select').value;
    const search = document.getElementById('search-input')?.value.trim() || '';
    const date   = document.getElementById('date-input')?.value || '';
    loadAllEvents(cat, search, date);
  });

  document.getElementById('date-input')?.addEventListener('change', () => {
    const cat    = document.getElementById('cat-select')?.value || 'all';
    const search = document.getElementById('search-input')?.value.trim() || '';
    const date   = document.getElementById('date-input').value;
    loadAllEvents(cat, search, date);
  });
}

function loadEventDetail() {
  const container = document.getElementById('event-detail');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id     = parseInt(params.get('id'));
  const events = getAllEvents();
  const ev     = events.find(e => e.id === id) || events[0];
  if (!ev) {
    container.innerHTML = '<p class="text-center py-5">لا توجد فعالية بهذا المعرّف.</p>';
    return;
  }

  const cat = categoryConfig[ev.category] || { label: ev.category, color: '#888', textColor: '#333' };
  document.title = ev.title + ' - دليل الفعاليات';

  container.innerHTML = `
    <div class="row g-4">
      <div class="col-lg-8">
        <img src="${ev.image || DEFAULT_IMAGE}" alt="${ev.title}" class="event-detail-hero mb-3"
             onerror="this.src='${DEFAULT_IMAGE}'">
        <span class="event-cat-badge mb-2"
              style="background:${cat.color}22;color:${cat.textColor};border:1px solid ${cat.color}50;font-size:0.9rem;padding:5px 16px">
          ${cat.label}
        </span>
        <h1 style="font-size:1.7rem;font-weight:900;color:var(--primary);margin:8px 0 12px">${ev.title}</h1>
        <p style="font-size:1rem;color:var(--text-muted);line-height:1.9">${ev.description}</p>
        <div class="mt-3 d-flex gap-2 flex-wrap">
          <button class="btn-primary-custom" onclick="alert('تمت إضافة الفعالية إلى تقويمك!')">📅 أضف للتقويم</button>
          <button class="btn-outline-custom" onclick="shareEvent('${ev.title}')">🔗 شارك</button>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="event-info-card mb-3">
          <h5 style="color:var(--primary);font-weight:700;margin-bottom:0.8rem">معلومات الفعالية</h5>
          <div class="event-info-row"><span class="event-info-icon">📅</span><div><strong>التاريخ</strong><br>${ev.dateLabel}</div></div>
          <div class="event-info-row"><span class="event-info-icon">📍</span><div><strong>المكان</strong><br>${ev.location}</div></div>
          <div class="event-info-row"><span class="event-info-icon">🏷</span><div><strong>التصنيف</strong><br>${cat.label}</div></div>
          <div class="event-info-row"><span class="event-info-icon">🎫</span><div><strong>الدخول</strong><br>مجاني للطلاب</div></div>
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h4 class="section-title">فعاليات ذات صلة</h4>
      <div class="row g-3">
        ${events.filter(e => e.id !== ev.id).slice(0, 3).map(e => createEventCard(e)).join('')}
      </div>
    </div>
  `;
}

function shareEvent(title) {
  if (navigator.share) {
    navigator.share({ title, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href).then(() => alert('تم نسخ رابط الفعالية!'));
  }
}


function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name    = document.getElementById('c-name')?.value.trim();
    const email   = document.getElementById('c-email')?.value.trim();
    const msg     = document.getElementById('c-message')?.value.trim();
    const alertEl = document.getElementById('form-alert');
    if (!name || !email || !msg) {
      showAlert(alertEl, 'danger', '⚠️ يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showAlert(alertEl, 'danger', '⚠️ صيغة البريد الإلكتروني غير صحيحة.');
      return;
    }
    showAlert(alertEl, 'success', '✅ تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    form.reset();
  });
}

function showAlert(el, type, msg) {
  if (!el) return;
  el.className = `alert alert-${type} mt-3`;
  el.textContent = msg;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}


function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 300));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  loadHomeEvents();
  loadFeaturedEvent();
  loadAllEvents();
  initFilters();
  loadEventDetail();
  initContactForm();
  initScrollTop();
});