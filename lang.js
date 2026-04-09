// lang.js - فایلی تایبەت بە زمانەکان و وەرگێڕان

const translations = {
    ku: {
        title: "IHEC",
        subtitle: "ئۆفیسی هەولێر",
        emailLabel: "ئیمەیڵی فەرمی",
        passLabel: "تێپەڕەوشە (پاسوۆرد)",
        loginBtnText: "چوونە ژوورەوە",
        waitText: "چاوەڕێ بکە...",
        errorEmpty: "تکایە ئیمەیڵ و پاسوۆرد بنووسە!",
        login_error: "ئیمەیڵ یان وشەی تێپەڕ هەڵەیە!",
        logout: "چوونە دەرەوە",
        employee: "فەرمانبەر",
        admin: "بەڕێوەبەر",
        clockLoading: "باردەکرێت...",
        arrival: "هاتن",
        device: "ئامێر",
        location: "لۆکەیشن",
        verifying: "پشکنین...",
        checkin: "ئامادەبووم",
        checkout: "تۆمارکردنی دەرچوون",
        history: "مێژووی هاتن و دەرچوونەکانت",
        month: "مانگ",
        confirmTitle: "دڵنیایت؟",
        confirmMsg: "ئایا دەتەوێت ئەم کردارە ئەنجام بدەیت؟",
        no: "نەخێر",
        yes: "بەڵێ، دڵنیام",
        date: "ڕێکەوت",
        close: "داخستن",
        at: "لە",
        verified: "ناسراوە",
        unverified: "نەناسراوە",
        suitable: "گونجاوە",
        notSuitable: "لۆکەیشن گونجاو نییە",
        gpsWeak: "شوێن ورد نییە",
        searching: "چاوەڕوانبە...",
        errorFetch: "هەڵە لە پشکنین",
        distBranch: "دووری لە بنکە",
        limit: "سنوور",
        gpsAcc: "وردی GPS",
        confInTitle: "تۆمارکردنی هاتن",
        confInMsg: "ئایا دڵنیایت لە تۆمارکردنی ئامادەبوونی ئێستات؟",
        confOutTitle: "تۆمارکردنی دەرچوون",
        confOutMsg: "ئایا دڵنیایت دەتەوێت دەرچوون تۆمار بکەیت؟",
        msgLocErr: "هەڵە: زانیاری لۆکەیشن یان بەکارهێنەر بەردەست نییە.",
        msgBranchErr: "هەڵە: زانیاری بنکەی کارکردن بەردەست نییە.",
        msgAccErr: "هەڵە: وردی لۆکەیشنەکەت گونجاو نییە. تکایە هەوڵ بدەرەوە.",
        msgOutsideErr: "هەڵە: تۆ لە دەرەوەی سنووری بنکەی کارکردنی خۆتیت.",
        msgOutLocErr: "هەڵە: لۆکەیشنەکەت گونجاو نییە بۆ دەرچوون. تکایە هەوڵ بدەرەوە.",
        msgInSuccess: "ئامادەبوونت تۆمار کرا!",
        msgOutSuccess: "دەرچوونەکەت تۆمار کرا. کاتێکی خۆش!",
        recordNotFound: "هیچ تۆمارێک بۆ ئەم ڕۆژە نییە",
        retryBtn: "دووبارە پشکنین",
        notRecorded: "تۆمار نەکراوە", 
        months: ["کانوونی دووەم", "شوبات", "ئازار", "نیسان", "ئایار", "حوزەیران", "تەمموز", "ئاب", "ئەیلوول", "تشرینی یەکەم", "تشرینی دووەم", "کانوونی یەکەم"],
        weekdays: ["یەکشەممە", "دووشەممە", "سێشەممە", "چوارشەممە", "پێنجشەممە", "هەینی", "شەممە"],
        noLocSupport: "وێبگەڕەکەت لۆکەیشن پشتگیری ناکات",
        invalidDevice: "ئامێر نەناسراوە",
        noBranch: "زانیاری بنکە نییە",
        waitRecord: "تۆمارکردن...",
        deviceTaken: "ئەم ئامێرە بۆ هەژمارێکی تر بەکارهاتووە"
    },
    ar: {
        title: "IHEC",
        subtitle: "مكتب أربيل",
        emailLabel: "البريد الإلكتروني الرسمي",
        passLabel: "كلمة المرور",
        loginBtnText: "تسجيل الدخول",
        waitText: "يرجى الانتظار...",
        errorEmpty: "يرجى إدخال البريد الإلكتروني وكلمة المرور!",
        login_error: "البريد الإلكتروني أو كلمة المرور غير صحيحة!",
        logout: "تسجيل الخروج",
        employee: "موظف",
        admin: "مدير",
        clockLoading: "جاري التحميل...",
        arrival: "الوصول",
        device: "الجهاز",
        location: "الموقع",
        verifying: "جاري التحقق...",
        checkin: "تسجيل حضور",
        checkout: "تسجيل انصراف",
        history: "سجل الحضور والانصراف",
        month: "الشهر",
        confirmTitle: "هل أنت متأكد؟",
        confirmMsg: "هل تريد إجراء هذه العملية؟",
        no: "لا",
        yes: "نعم، أنا متأكد",
        date: "التاريخ",
        close: "إغلاق",
        at: "في",
        verified: "معروف",
        unverified: "غير معروف",
        suitable: "مناسب",
        notSuitable: "الموقع غير مناسب",
        gpsWeak: "الموقع غير دقيق",
        searching: "انتظر قليلاً...",
        errorFetch: "خطأ في التحقق",
        distBranch: "المسافة عن المركز",
        limit: "الحد",
        gpsAcc: "دقة GPS",
        confInTitle: "تسجيل الحضور",
        confInMsg: "هل أنت متأكد من تسجيل حضورك الآن؟",
        confOutTitle: "تسجيل الانصراف",
        confOutMsg: "هل أنت متأكد من تسجيل انصرافك؟",
        msgLocErr: "خطأ: معلومات الموقع أو المستخدم غير متوفرة.",
        msgBranchErr: "خطأ: معلومات موقع العمل غير متوفرة.",
        msgAccErr: "خطأ: دقة موقعك غير كافية. يرجى المحاولة مرة أخرى.",
        msgOutsideErr: "خطأ: أنت خارج حدود موقع عملك.",
        msgOutLocErr: "خطأ: موقعك غير مناسب لتسجيل الانصراف. يرجى المحاولة مرة أخرى.",
        msgInSuccess: "تم تسجيل حضورك بنجاح!",
        msgOutSuccess: "تم تسجيل انصرافك. طاب يومك!",
        recordNotFound: "لا يوجد سجل لهذا اليوم",
        retryBtn: "إعادة التحقق",
        notRecorded: "لم يتم التسجيل", 
        months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        noLocSupport: "متصفحك لا يدعم الموقع",
        invalidDevice: "جهاز غير معروف",
        noBranch: "لا توجد معلومات عن الفرع",
        waitRecord: "جاري التسجيل...",
        deviceTaken: "هذا الجهاز مسجل لحساب آخر"
    }
};

let currentLang = localStorage.getItem('lang') || 'ku';

function applyLanguage() {
    document.documentElement.lang = currentLang;
    const langBtn = document.getElementById('current-lang-text');
    const flag = document.getElementById('current-flag');
    
    if (langBtn && flag) {
        if (currentLang === 'ku') {
            langBtn.innerText = 'کوردی';
            flag.className = 'flag-icon flag-ku';
        } else {
            langBtn.innerText = 'العربية';
            flag.className = 'flag-icon flag-ar';
        }
    }

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                el.placeholder = translations[currentLang][key];
            } else {
                el.innerText = translations[currentLang][key];
            }
        }
    });
}

function setLang(lang) { // Renamed from selectLanguage to setLang as per index.html
    currentLang = lang;
    localStorage.setItem('lang', currentLang);
    applyLanguage();
    document.getElementById('dropdown-options').classList.remove('show');
}

document.addEventListener('DOMContentLoaded', applyLanguage);