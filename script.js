// script.js - فایلی سەرەکی کارپێکردن

// --- ١. ڕێکخستنی سوپابەیس ---
const SUPABASE_URL = 'https://mygqlubvxdbbsygitjuj.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15Z3FsdWJ2eGRiYnN5Z2l0anVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3MjA3NzIsImV4cCI6MjA5MTI5Njc3Mn0.bAecJcTMfZEiT1doet_PgH3EEjjAB6juNRoCJlK9qeA';

// --- PWA Logic & Service Worker Registration ---
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => console.error("SW failed", err));
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // نیشاندانی بانەری پێشنیار دوای ٣ چرکە
    setTimeout(showPwaPrompt, 3000);
});

function showPwaPrompt() {
    const banner = document.getElementById('pwaBanner');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) return; // ئەگەر ئەپەکە پێشتر دابەزێنرابوو

    if (banner) {
        banner.classList.add('show');
        if (isIOS) {
            document.getElementById('pwaInstallBtn').style.display = 'none';
            document.getElementById('pwaIosHint').style.display = 'block';
        }
    }
}

document.getElementById('pwaInstallBtn')?.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') hidePwaPrompt();
        deferredPrompt = null;
    }
});

function hidePwaPrompt() {
    document.getElementById('pwaBanner')?.classList.remove('show');
}

// داخستنی بانەرەکە ئەگەر بەکارهێنەر دەستی بە "Handle"ەکەدا هێنا بۆ خوارەوە
document.getElementById('pwaBanner')?.addEventListener('click', (e) => {
    if (e.target.className === 'pwa-handle') hidePwaPrompt();
    // Also hide if the close button is clicked
    if (e.target.closest('.pwa-close-btn')) hidePwaPrompt();
});

// --- Version Check for Forced Refresh ---
async function checkAppVersion() {
    try {
        // Add a cache-buster to ensure we always fetch the latest version.json
        const response = await fetch('version.json?t=' + new Date().getTime());
        const data = await response.json();
        const serverVersion = data.version;
        const clientVersion = localStorage.getItem('app_version');

        if (clientVersion && clientVersion !== serverVersion) {
            showUpdateModal(serverVersion);
            return true; // Indicate that a reload was triggered
        } else if (!clientVersion) {
            // First time load or version not set, store it
            localStorage.setItem('app_version', serverVersion);
        }
    } catch (error) {
        console.error('Failed to check app version:', error);
    }
    return false; // Indicate no reload was triggered
}

function showUpdateModal(newVersion) {
    const modal = document.getElementById('updateModal');
    if (modal) {
        modal.setAttribute('data-new-version', newVersion);
        modal.style.display = 'flex';
    }
}

function forceUpdateApp() {
    const modal = document.getElementById('updateModal');
    const newVersion = modal.getAttribute('data-new-version');
    
    // پارێزگاری لە ڕێکخستنە سەرەکییەکان
    const lang = localStorage.getItem('lang');
    const theme = localStorage.getItem('theme');
    const deviceID = localStorage.getItem('device_id');
    const uniqueSeed = localStorage.getItem('ihec_unique_seed');

    localStorage.clear();

    if (lang) localStorage.setItem('lang', lang);
    if (theme) localStorage.setItem('theme', theme);
    if (deviceID) localStorage.setItem('device_id', deviceID);
    if (uniqueSeed) localStorage.setItem('ihec_unique_seed', uniqueSeed);
    localStorage.setItem('app_version', newVersion);

    window.location.reload(true);
}

// لێرە ناوی گۆڕاوەکەمان گۆڕی بۆ supabaseClient بۆ ئەوەی چیتر تووشی هەڵەی (already declared) نەبیت
// بەکارهێنانی var یان window بۆ دڵنیابوون لەوەی گۆڕاوەکە بە جیهانی دەناسرێت
var supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// --- ٢. دۆخی تاریک و ڕوون (Theme) ---
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme() {
    const body = document.documentElement;
    const themeIcon = document.querySelector('.theme-icon');
    const themeBtn = document.getElementById('themeBtn');

    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-moon theme-icon-anim" style="color: #ffffff;"></i>';
    } else {
        body.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
        if (themeBtn) themeBtn.innerHTML = '<i class="fas fa-sun theme-icon-anim" style="color: #ff9f43;"></i>';
    }
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', currentTheme);
    applyTheme();
}

// دڵنیابوونەوە لەوەی کاتێک لاپەڕەکە کرایەوە Theme جێبەجێ دەبێت
document.addEventListener('DOMContentLoaded', async () => {
    const reloadTriggered = await checkAppVersion();
    if (!reloadTriggered) {
        applyTheme();

        // Update current year
        const year = new Date().getFullYear();
        document.querySelectorAll('.current-year').forEach(el => el.innerText = year);
        
        // چالاککردنی کلیلی Enter بۆ چوونەژوورەوە
        const loginInputs = document.querySelectorAll('#email, #password');
        loginInputs.forEach(input => {
            input.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleLogin(); });
        });

        // // ڕێگری لە کۆپیکردن و کلیکی ڕاست (ContextMenu) لە هەموو لاپەڕەکاندا
        // document.addEventListener('copy', (e) => e.preventDefault());
        // 
        // // ڕێگری لە کلیلە کورتکراوەکانی پشکنینی کۆد (F12, Ctrl+Shift+I, Ctrl+U)
        // document.addEventListener('keydown', (e) => {
        //     if (e.keyCode === 123 || 
        //         (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || 
        //         (e.ctrlKey && e.keyCode === 85)) {
        //         e.preventDefault();
        //     }
        // });
        // 
        // document.addEventListener('contextmenu', (e) => {
        //     // ڕێگە بدە تەنها لە ناو خانەکانی نووسین کلیکی ڕاست کار بکات
        //     if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') e.preventDefault();
        // });
    }
});

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

// فەنکشنی گشتی بۆ گۆڕینی کات (بۆ ئەوەی لە هەموو شوێنێک بەکاربێت)
function formatTime12(input) {
    if (!input) return '';
    let d = new Date(input);

    if (isNaN(d.getTime()) && typeof input === 'string') {
        d = new Date(`2000-01-01T${input.includes('T') ? input.split('T')[1] : input}`);
    }
    
    if (isNaN(d.getTime())) return '--:--';

    try {
        const options = { timeZone: 'Asia/Baghdad', hour: '2-digit', minute: '2-digit', hour12: true };
        return `\u200E${new Intl.DateTimeFormat('en-US', options).format(d)}`;
    } catch (e) {
        return '--:--';
    }
}

function togglePassword() {
    const passInput = document.getElementById('password');
    const icon = document.querySelector('.eye-icon i');

    if (passInput && icon) {
        // زیادکردنی ئەنیمەیشنێکی بچووک لەکاتی کلیک
        icon.classList.add('eye-icon-anim');
        setTimeout(() => icon.classList.remove('eye-icon-anim'), 300);

        if (passInput.type === 'password') {
            passInput.type = 'text';
            icon.className = 'fas fa-eye-slash active';
        } else {
            passInput.type = 'password';
            icon.className = 'fas fa-eye';
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
        errorMsg.innerHTML = `<i class="fas fa-exclamation-triangle"></i> <span>${translations[currentLang].errorEmpty}</span>`;
        errorMsg.style.display = 'flex';
        return;
    }

    // دەستپێکردنی لۆدینگ و گۆڕینی تێکستی دوگمەکە
    btn.disabled = true;
    loader.style.display = 'block';
    if (btnText) btnText.innerText = translations[currentLang].waitText;

    try {
        // بەکارهێنانی supabaseClient بۆ چوونەژوورەوە
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            // ئەگەر هەڵەیەک هەبوو لە لایەن سوپابەیسەوە
            const msg = currentLang === 'ku' ? "ئیمەیڵ یان پاسوۆرد هەڵەیە!" : "البريد الإلكتروني أو كلمة المرور غير صحيحة!";
            errorMsg.innerHTML = `<i class="fas fa-exclamation-circle"></i> <span>${msg}</span>`;
            errorMsg.style.display = 'flex';
            
            // گەڕاندنەوەی دوگمەکە بۆ دۆخی ئاسایی
            btn.disabled = false;
            loader.style.display = 'none';
            btnText.innerText = translations[currentLang].loginBtnText;
        } else {
            // پشکنینی ڕۆڵی بەکارهێنەر لە خشتەی profiles
            const { data: profile, error: profileError } = await supabaseClient
                .from('profiles')
                .select('role')
                .eq('id', data.user.id)
                .single();

            if (!profileError && profile && profile.role === 'admin') {
                window.location.href = "admin_dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        btn.disabled = false;
        loader.style.display = 'none';
        btnText.innerText = translations[currentLang].loginBtnText;
    }
}

let forgotPassStrength = 0; // Global variable to track password strength

// --- Forgot Password Multi-Step Logic ---
let forgotTimerInterval = null;
let otpExpired = false;

function openForgotModal() {
    switchForgotStep(1);
    otpExpired = false;
    if (forgotTimerInterval) clearInterval(forgotTimerInterval);
    document.getElementById('forgotModal').style.display = 'flex';
}

function closeForgotModal() {
    document.getElementById('forgotModal').style.display = 'none';
}

function switchForgotStep(step) {
    document.querySelectorAll('.forgot-step').forEach(s => s.classList.remove('active'));
    document.getElementById(`forgotStep${step}`).classList.add('active');
    
    // گۆڕینی ئایکۆن بەپێی هەنگاو
    const icon = document.getElementById('forgotIcon');
    if (step === 1) icon.className = 'fas fa-envelope';
    else if (step === 2) icon.className = 'fas fa-shield-alt';
    else if (step === 3) {
        icon.className = 'fas fa-lock-open';
        // ئامادەکردنی گوێگرەکان (Listeners) کاتێک دەچێتە هەنگاوی سێیەم
        document.getElementById('forgotNewPass').onkeyup = checkForgotPasswordStrength;
        document.getElementById('forgotConfirmPass').onkeyup = checkForgotPassMatch;
        checkForgotPassMatch(); // دەستپێکردنی سەرەتایی
    }
    else if (step === 4) icon.className = 'fas fa-check-circle';
}

function startForgotTimer() {
    let timeLeft = 120; // 2 minutes
    otpExpired = false;
    const timerDisplay = document.getElementById('forgotTimer');
    const verifyBtn = document.getElementById('verifyCodeBtn');
    
    if (forgotTimerInterval) clearInterval(forgotTimerInterval);
    
    forgotTimerInterval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(forgotTimerInterval);
            otpExpired = true;
            document.getElementById('otpError').innerText = translations[currentLang].timeExpired;
            document.getElementById('otpError').style.display = 'block';
            verifyBtn.querySelector('.btn-text').innerText = translations[currentLang].resendCode;
        }
        timeLeft--;
    }, 1000);
}

async function handleForgotEmail() {
    const email = document.getElementById('forgotEmail').value;
    const btn = document.getElementById('sendCodeBtn');
    const errorEl = document.getElementById('emailError');

    if (!email || !email.includes('@')) {
        errorEl.innerText = translations[currentLang].errorEmpty;
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.spinner-small').style.display = 'block';

    // پشکنینی ئەوەی ئایا ئیمەیڵەکە لە سیستمدا هەیە
    const { data: profile } = await supabaseClient
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

    if (!profile) {
        errorEl.innerText = translations[currentLang].emailNotFound;
        errorEl.style.display = 'block';
        btn.disabled = false;
        btn.querySelector('.btn-text').style.display = 'block';
        btn.querySelector('.spinner-small').style.display = 'none';
        return;
    }

    // ناردنی کۆدی ڕیسێت لە ڕێگەی سوپابەیسەوە
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    
    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.spinner-small').style.display = 'none';

    if (error) {
        if (error.status === 429) {
            errorEl.innerText = translations[currentLang].rateLimitError;
        } else {
            errorEl.innerText = error.message;
        }
        errorEl.style.display = 'block';
    } else {
        switchForgotStep(2);
        startForgotTimer();
    }
}

async function handleVerifyOTP() {
    if (otpExpired) {
        switchForgotStep(1);
        return;
    }

    const email = document.getElementById('forgotEmail').value;
    const token = document.getElementById('forgotOTP').value;
    const errorEl = document.getElementById('otpError');
    const btn = document.getElementById('verifyCodeBtn');

    if (!token || token.length < 6) {
        errorEl.innerText = translations[currentLang].invalidOTP;
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.spinner-small').style.display = 'block';

    // پشکنینی کۆدەکە لە سوپابەیس
    const { error } = await supabaseClient.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
    });

    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.spinner-small').style.display = 'none';

    if (error) {
        errorEl.innerText = translations[currentLang].invalidOTP;
        errorEl.style.display = 'block';
    } else {
        if (forgotTimerInterval) clearInterval(forgotTimerInterval);
        errorEl.style.display = 'none';
        switchForgotStep(3);
    }
}

function toggleForgotPassVisibility(id) {
    const input = document.getElementById(id);
    const icon = input.parentElement.querySelector('.eye-icon i');
    if (input && icon) {
        icon.classList.add('eye-icon-anim');
        setTimeout(() => icon.classList.remove('eye-icon-anim'), 300);

        if (input.type === 'password') {
            input.type = 'text';
            icon.className = 'fas fa-eye-slash active';
        } else {
            input.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
}

function checkForgotPasswordStrength() {
    const pass = document.getElementById('forgotNewPass').value;
    const bar = document.getElementById('forgotStrengthBar');
    const label = document.getElementById('forgotStrengthText');
    const meterContainer = document.getElementById('forgotStrengthBarContainer');
    const t = translations[currentLang];

    if (pass.length === 0) {
        meterContainer.style.display = 'none';
        label.style.display = 'none';
        bar.style.width = '0%'; // Reset bar width
        label.innerText = ''; // Clear text
        forgotPassStrength = 0;
        checkForgotPassMatch(); // Also check match when strength changes
        return;
    }

    meterContainer.style.display = 'block';
    label.style.display = 'inline-flex';

    let strength = 0;
    if (pass.length >= 8) strength += 25;
    if (/[A-Z]/.test(pass)) strength += 25;
    if (/[0-9]/.test(pass)) strength += 25;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 25;

    forgotPassStrength = strength; // Update global strength variable

    bar.style.width = strength + '%';
    bar.className = 'bar'; // Reset classes
    label.className = 'strength-label'; // Reset classes

    if (strength <= 25) {
        bar.classList.add('weak');
        label.classList.add('weak');
        label.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
        label.innerText = t.weak;
    } else if (strength <= 50) {
        bar.classList.add('medium');
        label.classList.add('medium');
        label.style.backgroundColor = 'rgba(245, 158, 11, 0.1)';
        label.innerText = t.medium;
    } else if (strength <= 75) {
        bar.classList.add('strong');
        label.classList.add('strong');
        label.style.backgroundColor = 'rgba(34, 197, 94, 0.1)';
        label.innerText = t.strong;
    } else {
        bar.classList.add('very-strong');
        label.classList.add('very-strong');
        label.style.backgroundColor = 'rgba(14, 165, 233, 0.1)';
        label.innerText = t.veryStrong;
    }
    checkForgotPassMatch(); // Call match check after strength is updated
}

function checkForgotPassMatch() {
    const newPass = document.getElementById('forgotNewPass');
    const confirmPass = document.getElementById('forgotConfirmPass');
    const feedback = document.getElementById('forgotMatchFeedback');
    const resetBtn = document.getElementById('resetPassBtn');
    const t = translations[currentLang];

    if (!confirmPass.value) {
        feedback.style.display = 'none';
    } else {
        feedback.style.display = 'flex';
        if (newPass.value === confirmPass.value && newPass.value.length >= 6) {
            feedback.className = 'match-feedback match-success';
            feedback.querySelector('span').innerText = t.passMatch;
            feedback.querySelector('i').className = 'fas fa-check-circle';
        } else {
            feedback.className = 'match-feedback match-error';
            feedback.querySelector('span').innerText = t.passNotMatch;
            feedback.querySelector('i').className = 'fas fa-times-circle';
        }
    }

    // دوگمەکە هەمیشە بە کراوەیی دەمێنێتەوە وەک داوات کردبوو
    resetBtn.disabled = false;
}

async function handleResetPassword() {
    const newPass = document.getElementById('forgotNewPass').value;
    const confirmPass = document.getElementById('forgotConfirmPass').value;
    const errorEl = document.getElementById('passMatchError');
    const btn = document.getElementById('resetPassBtn');

    if (newPass.length < 6) {
        errorEl.innerText = "Password must be at least 6 characters";
        errorEl.style.display = 'block';
        return;
    }

    if (newPass !== confirmPass) {
        errorEl.innerText = translations[currentLang].passNotMatch;
        errorEl.style.display = 'block';
        return;
    }

    errorEl.style.display = 'none';
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.spinner-small').style.display = 'block';

    // نوێکردنەوەی پاسوۆردی بەکارهێنەر
    const { error } = await supabaseClient.auth.updateUser({
        password: newPass
    });

    btn.disabled = false;
    btn.querySelector('.btn-text').style.display = 'block';
    btn.querySelector('.spinner-small').style.display = 'none';

    if (error) {
        errorEl.innerText = error.message;
        errorEl.style.display = 'block';
    } else {
        errorEl.style.display = 'none';
        switchForgotStep(4);
        
        // دوای گۆڕینی پاسوۆرد، بەکارهێنەر دەردەکەین بۆ ئەوەی دووبارە لۆگین بێتەوە بە سەلامەتی
        await supabaseClient.auth.signOut();
    }
}