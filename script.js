// انتظار تحميل الصفحة بالكامل
document.addEventListener('DOMContentLoaded', function() {
    // الحصول على العناصر
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('loginButton');
    
    // كلمة السر الصحيحة
    
    const correctPassword = '112233';
   
    // رابط الصفحة الجديدة (يمكنك تغييره حسب احتياجك)
    const newPageURL = 'gamir/index.html'; // أو 'main.html' أو أي صفحة تريدها
    
    // وظيفة التحقق من كلمة السر
    function checkPassword() {
        const enteredPassword = passwordInput.value.trim();
        
        if (enteredPassword === correctPassword) {
            // كلمة السر صحيحة
            loginSuccess();
        } else {
            // كلمة السر خاطئة
            loginError();
        }
    }
    
    // وظيفة التنفيذ عند نجاح التسجيل
    function loginSuccess() {
        // تغيير مظهر الزر
        loginButton.innerHTML = '✓ تم الدخول بنجاح!';
        loginButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        loginButton.style.boxShadow = '0 5px 15px rgba(76, 175, 80, 0.4)';
        loginButton.disabled = true;
        
        // تأثير النجاح
        passwordInput.style.borderColor = '#4CAF50';
        passwordInput.style.boxShadow = '0 0 10px rgba(76, 175, 80, 0.5)';
        
        // الانتقال للصفحة الجديدة بعد تأخير بسيط
        setTimeout(() => {
            window.location.href = newPageURL;
        }, 1500);
    }
    
    // وظيفة التنفيذ عند خطأ في التسجيل
    function loginError() {
        // تأثير الاهتزاز
        passwordInput.classList.add('shake');
        passwordInput.style.borderColor = '#ff4757';
        passwordInput.style.boxShadow = '0 0 10px rgba(255, 71, 87, 0.5)';
        
        // إعادة تعيين الحقل بعد التأثير
        setTimeout(() => {
            passwordInput.classList.remove('shake');
            alert('كلمة السر خاطئة! حاول مرة أخرى.');
            passwordInput.value = '';
            passwordInput.focus();
        }, 500);
    }
    
    // إضافة مستمعي الأحداث
    loginButton.addEventListener('click', checkPassword);
    
    // السماح بالدخول بالضغط على Enter
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // تأثيرات إضافية عند التركيز على حقل الإدخال
    passwordInput.addEventListener('focus', function() {
        this.style.background = '#ffffff';
    });
    
    passwordInput.addEventListener('blur', function() {
        this.style.background = '#f8f9fa';
    });
    
    // تحسين تجربة المستخدم للهواتف
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // تحسينات إضافية للأجهزة التي تعمل باللمس
        loginButton.style.padding = '18px 15px';
        passwordInput.style.padding = '18px 20px';
    }
    
    // إظهار رسالة ترحيب عند فتح الصفحة
    console.log('مرحباً بك في تطبيق VIP! استمتع بتجربتك.');
});