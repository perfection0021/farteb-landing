/* ---------- تنظیم سال فوتر ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- تولید اسلایدها از فولدر images/ ---------- */
const galleryWrapper = document.getElementById("gallery-slides");

// فقط اسم فایل‌هارو اینجا بنویس ✅
const galleryFiles = [
  "1.png",
  "2.jpg",
  "4.jpg",
  "5.jpg"
  // هر چی خواستی اضافه کن
];

/* ---------- ساخت اسلایدها ---------- */
galleryFiles.forEach((file, i) => {
  const path = `images/${file}`;
  const ext = file.split(".").pop().toLowerCase();

  if (ext === "mp4") {
    // ویدیو
    const slideEl = document.createElement("div");
    slideEl.className = "swiper-slide";

    const wrapper = document.createElement("div");
    wrapper.className = "video-wrapper";

    const video = document.createElement("video");
    video.src = path;
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;

    // پوستر اختیاری (هم‌نام jpg)
    const posterPath = path.replace(".mp4", ".jpg");
    fetch(posterPath, { method: "HEAD" })
      .then(res => {
        if (res.ok) video.setAttribute("poster", posterPath);
      })
      .catch(() => {});

    const btn = document.createElement("div");
    btn.className = "play-btn";
    btn.textContent = "▶";

    wrapper.appendChild(video);
    wrapper.appendChild(btn);
    slideEl.appendChild(wrapper);
    galleryWrapper.appendChild(slideEl);
  } 
  else {
    // تصویر
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `<img src="${path}" alt="تصویر ${i + 1}" loading="lazy" />`;
    galleryWrapper.appendChild(slide);
  }
});


/* ---------- تعریف Swiper ---------- */
let gallerySwiper;
function initSwiper() {
  if (gallerySwiper) gallerySwiper.destroy(true, true);
  gallerySwiper = new Swiper(".gallery-swiper", {
    loop: false,
    spaceBetween: 10,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    speed: 600,
    effect: "fade",
    fadeEffect: { crossFade: true },

    // 🔥 این قسمت رو اضافه کن:
on: {
  transitionStart: () => {
    document.querySelectorAll("video").forEach(v => {
      v.pause();
      v.currentTime = 0;
      v.muted = true;
      const btn = v.closest(".swiper-slide")?.querySelector(".play-btn");
      if (btn) btn.classList.remove("hidden", "fade-out");
    });
  }
}
});
}

setTimeout(initSwiper, 1500);

/* ---------- نمایش صفحه موفقیت نهایی ---------- */
function showSuccessScreen() {
  document.body.innerHTML = `
    <div style="
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      height:100vh;
      background:#1ba88e;
      color:#fff;
      text-align:center;
      font-family:sans-serif;
      padding:20px;
    ">
      <h2 style="font-size:1.8rem;">✅ شماره شما با موفقیت ثبت شد</h2>
      <p style="margin-top:10px;font-size:1.1rem;max-width:400px;line-height:1.8;">
        اطلاعات شما دریافت شد.<br>
        لطفاً منتظر تماس مشاوران ما باشید 💬
      </p>
    </div>
  `;
}


/* ---------- کنترل پخش ویدیوها ---------- */
document.addEventListener("click", (e) => {
  // دکمه پخش وسط ویدیو
  if (e.target.classList.contains("play-btn")) {
    const btn = e.target;
    const video = btn.previousElementSibling;

    // توقف بقیه ویدیوها
    document.querySelectorAll("video").forEach(v => {
      v.pause();
      v.muted = true;
      v.closest(".swiper-slide")?.querySelector(".play-btn")?.classList.remove("hidden", "fade-out");
    });

    // پخش ویدیو با صدا
    if (video.readyState < 1) {
      video.addEventListener("loadedmetadata", () => {
        video.muted = false;
        video.play();
      }, { once: true });
    } else {
      video.muted = false;
      video.play();
    }

    // دکمه پخش رو محو کن
    btn.classList.add("fade-out");
    setTimeout(() => btn.classList.add("hidden"), 300);

    // وقتی ویدیو تموم شد، دکمه برگرده
    video.onended = () => {
  btn.classList.remove("hidden", "fade-out");
};
  }

  // کلیک روی خود ویدیو → پخش / توقف
  if (e.target.tagName === "VIDEO") {
    const video = e.target;
    const btn = video.nextElementSibling;
    if (!video.paused) {
      video.pause();
      btn.classList.remove("hidden", "fade-out");
    } else {
      if (video.readyState < 1) {
        video.addEventListener("loadedmetadata", () => {
          video.muted = false;
          video.play();
        }, { once: true });
      } else {
        video.muted = false;
        video.play();
      }
      btn.classList.add("fade-out");
      setTimeout(() => btn.classList.add("hidden"), 300);
    }
  }
});

/* ---------- کنترل فرم پایین صفحه ---------- */
const form = document.querySelector(".sticky-order__form");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = form.querySelector("input[type='tel']");
    const num = input.value.trim();
    const messageBox = document.createElement("div");
    const regex = /^(?:\+98|0)?9\d{9}$/; // شماره ایرانی با یا بدون +98

    // حذف هر پیام خطای قبلی
    const oldMsg = form.querySelector(".form-message");
    if (oldMsg) oldMsg.remove();

    // ساخت پیام جدید
    messageBox.className = "form-message";
    messageBox.style.marginTop = "0.5rem";
    messageBox.style.fontWeight = "600";
    messageBox.style.textAlign = "center";

    if (!regex.test(num)) {
      input.style.border = "2px solid #ff4444";
      messageBox.textContent = "❌ لطفاً شماره تلفن معتبر ایرانی وارد کنید (مثلاً: 09123456789)";
      messageBox.style.color = "#ff4444";
      form.appendChild(messageBox);
      input.focus();
      return;
    }

    // اگر شماره درست بود
    input.style.border = "2px solid #1ba88e";
    messageBox.textContent = "در حال بررسی...";
    messageBox.style.color = "#1ba88e";
    form.appendChild(messageBox);

    // شبیه‌سازی تأیید بعد از چند ثانیه
    setTimeout(() => {
  // حذف متن "در حال بررسی..."
  const messageBox = form.querySelector(".form-message");
  if (messageBox) messageBox.remove();

  // بازگرداندن استایل ورودی به حالت اولیه
  input.style.border = "1px solid #ccc";
  input.value = "";

  // نمایش پاپ‌آپ موفقیت
  const overlay = document.createElement('div');
  overlay.className = 'success-overlay';
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.55);
    backdrop-filter:blur(4px);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:10000;
    animation:fadeIn .3s ease;
  `;

  overlay.innerHTML = `
    <div style="
      background:#fff;
      padding:2rem 1.5rem;
      border-radius:20px;
      text-align:center;
      box-shadow:0 10px 30px rgba(0,0,0,0.25);
      max-width:380px;
      width:90%;
      animation:popUp .25s ease;
    ">
      <div style="font-size:2.2rem; color:#1ba88e;">✅</div>
      <h2 style="color:#1ba88e; margin:0.6rem 0;">ثبت موفق</h2>
      <p style="color:#333; margin:0.5rem 0 1.2rem; line-height:1.8;">
        اطلاعات شما با موفقیت ثبت شد.<br>
        لطفاً منتظر تماس مشاوران ما باشید 💬
      </p>
      <button style="
        background:#1ba88e;
        color:#fff;
        border:none;
        border-radius:10px;
        padding:0.6rem 1.4rem;
        cursor:pointer;
        font-weight:600;
        font-size:0.95rem;
        transition:filter .2s;
      ">باشه</button>
    </div>
  `;

  document.body.appendChild(overlay);

  const closePopup = () => overlay.remove();

  overlay.querySelector('button').addEventListener('click', closePopup);
  overlay.addEventListener('click', e => { if (e.target === overlay) closePopup(); });
}, 1200);

  });
}



/* ---------- پاپ‌آپ ویدیو رضایت مشتریان ---------- */
const modal = document.getElementById("reviewModal");
const openBtn = document.getElementById("openReviewModal");
const closeBtn = document.querySelector(".close-btn");
const reviewVideo = document.getElementById("reviewVideo");

if (openBtn && modal && closeBtn && reviewVideo) {
  openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    reviewVideo.currentTime = 0;
    reviewVideo.muted = false;
    reviewVideo.volume = 1.0;
    reviewVideo.play();
  });

  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    reviewVideo.pause();
  });

  // بستن با کلیک بیرون از ویدیو
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      reviewVideo.pause();
    }
  });

  // باز کردن پاپ‌آپ هنگام کلیک روی "سفارش این پکیج"
document.querySelectorAll('.price-card .btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('orderPopup').classList.add('active');
  });
});

// بستن پاپ‌آپ
document.querySelector('.popup-close').addEventListener('click', () => {
  document.getElementById('orderPopup').classList.remove('active');
});

// بستن با کلیک بیرون
document.getElementById('orderPopup').addEventListener('click', e => {
  if (e.target.id === 'orderPopup') {
    document.getElementById('orderPopup').classList.remove('active');
  }
});

// بررسی و ارسال فرم داخل پاپ‌آپ
const popupForm = document.querySelector('.popup-form');
popupForm.addEventListener('submit', e => {
  e.preventDefault();

  const input = popupForm.querySelector('input[type="tel"]');
  const num = input.value.trim();
  const messageBox = document.querySelector('.popup-message');
  const regex = /^(?:\+98|0)?9\d{9}$/;

  messageBox.textContent = '';
  input.style.borderColor = '#ccc';

  if (!regex.test(num)) {
    messageBox.textContent = '❌ لطفاً شماره تلفن معتبر ایرانی وارد کنید (مثل 09123456789)';
    messageBox.style.color = '#ff4444';
    input.style.borderColor = '#ff4444';
    input.focus();
    return;
  }

  messageBox.textContent = 'در حال بررسی...';
  messageBox.style.color = '#1ba88e';

  setTimeout(() => {
    document.querySelector('.popup-box').innerHTML = `
      <h2 style="color:#1ba88e;">✅ ثبت موفق</h2>
      <p style="color:#333;margin-top:10px;">
        اطلاعات شما با موفقیت ثبت شد.<br>
        لطفاً منتظر تماس مشاوران ما باشید 💬
      </p>
    `;
  }, 1000);
});

}

/* ---------- اسکرول نرم به بخش‌ها ---------- */
document.querySelectorAll('.navbar a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 60, // فاصله از بالا (زیر هدر)
        behavior: 'smooth'
      });
    }
  });
});

