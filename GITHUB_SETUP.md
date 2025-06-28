# إرشادات إعداد GitHub

## خطوات إنشاء مستودع GitHub

### 1. إنشاء مستودع جديد على GitHub

1. اذهب إلى [github.com](https://github.com)
2. سجل دخول إلى حسابك
3. انقر على زر "+" في الزاوية العلوية اليمنى
4. اختر "New repository"

### 2. إعداد المستودع

**اسم المستودع**: `exam-builder`

**الوصف**: `مولد الاختبار الذاتي القابل للطباعة - تطبيق Next.js لإنشاء نماذج اختبار ذاتي من ملفات Markdown`

**الخيارات**:

-   ✅ Public (عام)
-   ❌ Private (خاص)
-   ✅ Add a README file
-   ✅ Add .gitignore (اختر Node.js)
-   ✅ Choose a license (اختر MIT License)

### 3. ربط المستودع المحلي بـ GitHub

```bash
# إضافة Remote للمستودع
git remote add origin https://github.com/YOUR_USERNAME/exam-builder.git

# رفع الكود إلى GitHub
git branch -M main
git push -u origin main
```

### 4. تحديث package.json

تأكد من تحديث رابط المستودع في `package.json`:

```json
{
	"repository": {
		"type": "git",
		"url": "https://github.com/YOUR_USERNAME/exam-builder.git"
	}
}
```

## إعدادات GitHub

### 1. إعدادات المستودع

1. اذهب إلى Settings > General
2. فعّل "Issues" و "Discussions"
3. أضف وصف للمستودع
4. أضف موقع الويب (بعد النشر)

### 2. إعدادات الأمان

1. اذهب إلى Settings > Security
2. فعّل "Dependency graph"
3. فعّل "Dependabot alerts"
4. فعّل "Code scanning"

### 3. إعدادات Pages (اختياري)

إذا أردت نشر التطبيق على GitHub Pages:

1. اذهب إلى Settings > Pages
2. اختر "GitHub Actions" كمصدر
3. اتبع إرشادات النشر في `deploy.md`

## إعدادات إضافية

### 1. إضافة Topics

أضف هذه الكلمات المفتاحية للمستودع:

-   nextjs
-   react
-   typescript
-   test-generator
-   printable
-   markdown
-   arabic
-   rtl

### 2. إضافة Badges

أضف هذه الشارات إلى README.md:

```markdown
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)
```

### 3. إعداد GitHub Actions (اختياري)

أنشئ ملف `.github/workflows/ci.yml`:

```yaml
name: CI

on:
    push:
        branches: [main]
    pull_request:
        branches: [main]

jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            - uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                  node-version: '18'

            - name: Install dependencies
              run: npm install

            - name: Build
              run: npm run build

            - name: Lint
              run: npm run lint
```

## ملاحظات مهمة

### الأمان

-   ✅ لا ترفع ملفات الأسئلة الخاصة
-   ✅ تأكد من أن مجلد `private/` مدرج في `.gitignore`
-   ✅ راجع الملفات قبل الرفع

### التوثيق

-   ✅ اكتب README واضح ومفصل
-   ✅ أضف أمثلة على الاستخدام
-   ✅ وضح كيفية التثبيت والتشغيل

### المساهمة

-   ✅ فعّل Issues للمساهمات
-   ✅ أضف قوالب للـ Issues
-   ✅ اكتب إرشادات المساهمة

## الخطوات التالية

1. **إنشاء المستودع** على GitHub
2. **ربط المستودع المحلي** بـ GitHub
3. **رفع الكود** إلى GitHub
4. **إعداد النشر** (Vercel موصى به)
5. **إضافة Topics والشارات**
6. **كتابة التوثيق** الإضافي

## روابط مفيدة

-   [GitHub Guides](https://guides.github.com/)
-   [GitHub Pages](https://pages.github.com/)
-   [GitHub Actions](https://github.com/features/actions)
-   [Vercel](https://vercel.com/)
