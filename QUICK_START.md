# البدء السريع 🚀

## خطوات سريعة لإنشاء مستودع GitHub

### 1. إنشاء المستودع على GitHub

1. اذهب إلى [github.com](https://github.com)
2. انقر على "+" → "New repository"
3. اسم المستودع: `exam-builder`
4. اختر Public
5. فعّل "Add a README file"
6. انقر "Create repository"

### 2. ربط المشروع المحلي بـ GitHub

```bash
# إضافة Remote (استبدل YOUR_USERNAME باسم المستخدم)
git remote add origin https://github.com/YOUR_USERNAME/exam-builder.git

# رفع الكود
git branch -M main
git push -u origin main
```

### 3. النشر على Vercel (موصى به)

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول بـ GitHub
3. انقر "New Project"
4. اختر مستودع `exam-builder`
5. انقر "Deploy"

## استخدام التطبيق

### 1. تشغيل محلي

```bash
npm install
npm run dev
```

### 2. رفع ملف الأسئلة

-   ضع ملفات الأسئلة في `private/questions/`
-   استخدم التطبيق لرفع الملفات
-   هذه الملفات لن تُنشر على GitHub

### 3. إنشاء نموذج اختبار

1. ارفع ملف `qa.md`
2. أدخل معلومات الاختبار
3. اختر نوع النموذج (دراسة/اختبار)
4. اختر الأسئلة المطلوبة
5. اضبط الإعدادات
6. اطبع النموذج

## ملفات مهمة

-   `private/questions/` - ملفات الأسئلة الخاصة (غير منشورة)
-   `example-numbered.md` - مثال على ملف الأسئلة
-   `README.md` - التوثيق الكامل
-   `GITHUB_SETUP.md` - إرشادات GitHub المفصلة

## ملاحظات سريعة

✅ **آمن**: ملفات الأسئلة في `private/` لن تُنشر  
✅ **سهل**: واجهة عربية بسيطة  
✅ **مرن**: اختيار الأسئلة والإعدادات  
✅ **احترافي**: تنسيق طباعة ممتاز

## الدعم

-   📖 راجع `README.md` للتوثيق الكامل
-   🐛 أنشئ Issue للإبلاغ عن الأخطاء
-   💡 اقترح ميزات جديدة عبر Issues
