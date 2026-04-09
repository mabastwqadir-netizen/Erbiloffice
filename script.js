// script.js - فایلی سەرەکی کارپێکردن

// --- ١. ڕێکخستنی سوپابەیس ---
const SUPABASE_URL = 'https://mygqlubvxdbbsygitjuj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Z3FsdWJ2eGRiYnN5Z2l0anVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjA3NzIsImV4cCI6MjA5MTI5Njc3Mn0.bAecJcTMfZEiT1doet_PgH3EEjjAB6juNRoCJlK9qeA';

// لێرە ناوی گۆڕاوەکەمان گۆڕی بۆ supabaseClient بۆ ئەوەی چیتر تووشی هەڵەی (already declared) نەبیت
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ٢. دۆخی تاریک و ڕوون (Theme) ---
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    const body = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    const themeBtn = document.getElementById('themeBtn');

    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.innerText = "☀️";
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<span class="theme-icon">☀️</span>';
    } else {
        body.removeAttribute('data-theme');
        if (themeIcon) themeIcon.innerText = "🌙";
        document.body.classList.remove('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<span class="theme-icon">🌙</span>';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// دڵنیابوونەوە لەوەی کاتێک لاپەڕەکە کرایەوە Theme جێبەجێ دەبێت
document.addEventListener('DOMContentLoaded', applyTheme);

// --- ٣. فانکشنەکانی لاپەڕەی چوونەژوورەوە ---

// --- Language Dropdown Toggle ---
function toggleLangDropdown(event) {
    if (event) event.stopPropagation();
    const dropdownContent = document.querySelector('.lang-dropdown-content');
    if (dropdownContent) {
        dropdownContent.classList.toggle('show');
    }
}

document.addEventListener('click', () => {
    const dropdownContent = document.querySelector('.lang-dropdown-content');
    if (dropdownContent) dropdownContent.classList.remove('show');
});

// Close the dropdown if the user clicks outside of it
document.addEventListener('click', function(event) {
    const dropdownContent = document.querySelector('.lang-dropdown-content');
    if (dropdownContent && dropdownContent.classList.contains('show')) {
        dropdownContent.classList.remove('show');
    }
});

function togglePassword() {
    const passInput = document.getElementById('password');
    const eyeIconSpan = document.querySelector('.eye-icon'); // Select the span element
    const eyeIconSvg = eyeIconSpan ? eyeIconSpan.querySelector('svg') : null; // Select the SVG inside the span

    if (passInput && eyeIconSpan && eyeIconSvg) {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            eyeIconSvg.innerHTML = '<path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-4.143 1.12l.57.57a3.501 3.501 0 0 1-4.743-4.743l.57.57a2.5 2.5 0 0 0 3.603 3.603z"/><path d="M12.457 13.359c-1.518 1.708-3.237 2.641-4.457 2.641-5 0-8-5.5-8-5.5a7.028 7.028 0 0 1 1.053-1.638L.15 7.15a.5.5 0 0 1 .708-.708l12.303 12.303a.5.5 0 0 1-.708.708l-1.457-1.457z"/>';
            eyeIconSpan.classList.add('eye-slash-active'); // Add class for specific color
        } else {
            passInput.type = 'password';
            eyeIconSvg.innerHTML = '<path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/><path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>';
            eyeIconSpan.classList.remove('eye-slash-active'); // Remove class
        }
    }
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const loader = document.getElementById('loader');
    const btnText = document.getElementById('btnText');
    const errorMsg = document.getElementById('error-msg');

    errorMsg.style.display = 'none';

    if (!email || !password) {
        errorMsg.innerText = translations[currentLang].errorEmpty;
        errorMsg.style.display = 'block';
        return;
    }

    // دەستپێکردنی لۆدینگ و گۆڕینی تێکستی دوگمەکە
    btn.disabled = true;
    loader.style.display = 'block';
    btnText.innerText = translations[currentLang].waitText;

    try {
        // بەکارهێنانی supabaseClient بۆ چوونەژوورەوە
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // ئەگەر هەڵەیەک هەبوو لە لایەن سوپابەیسەوە
            errorMsg.innerText = currentLang === 'ku' ? "ئیمەیڵ یان پاسوۆرد هەڵەیە!" : "البريد الإلكتروني أو كلمة المرور غير صحيحة!";
            errorMsg.style.display = 'block';
            
            // گەڕاندنەوەی دوگمەکە بۆ دۆخی ئاسایی
            btn.disabled = false;
            loader.style.display = 'none';
            btnText.innerText = translations[currentLang].loginBtnText;
        } else {
            // ئەگەر سەرکەوتوو بوو
            console.log("Login successful:", data);
            window.location.href = "dashboard.html"; 
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.innerText = translations[currentLang].loginBtnText;
    }
}