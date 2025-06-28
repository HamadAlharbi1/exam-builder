# إرشادات النشر

## النشر على Vercel (موصى به)

### 1. إعداد Vercel

1. اذهب إلى [vercel.com](https://vercel.com)
2. سجل دخول أو أنشئ حساب جديد
3. انقر على "New Project"
4. اربط حساب GitHub الخاص بك

### 2. استيراد المشروع

1. اختر مستودع `qa-test-generator` من قائمة المشاريع
2. Vercel سيكتشف تلقائياً أنه مشروع Next.js
3. انقر على "Deploy"

### 3. إعدادات النشر

```bash
# إعدادات البناء (Build Settings)
Framework Preset: Next.js
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 4. متغيرات البيئة (Environment Variables)

لا تحتاج إلى متغيرات بيئة إضافية لهذا المشروع.

## النشر على Netlify

### 1. إعداد Netlify

1. اذهب إلى [netlify.com](https://netlify.com)
2. سجل دخول أو أنشئ حساب جديد
3. انقر على "New site from Git"

### 2. إعدادات البناء

```bash
Build command: npm run build
Publish directory: .next
```

### 3. إعدادات إضافية

أضف ملف `netlify.toml` في جذر المشروع:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## النشر على GitHub Pages

### 1. إعداد GitHub Actions

أنشئ ملف `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
    push:
        branches: [main]

jobs:
    build-and-deploy:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v2

            - name: Setup Node.js
              uses: actions/setup-node@v2
              with:
                  node-version: '18'

            - name: Install dependencies
              run: npm install

            - name: Build
              run: npm run build

            - name: Deploy to GitHub Pages
              uses: peaceiris/actions-gh-pages@v3
              with:
                  github_token: ${{ secrets.GITHUB_TOKEN }}
                  publish_dir: ./out
```

### 2. إعداد Next.js للتصدير الثابت

أضف في `next.config.ts`:

```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'export',
	trailingSlash: true,
	images: {
		unoptimized: true,
	},
};

module.exports = nextConfig;
```

## النشر المحلي

### 1. بناء المشروع

```bash
npm run build
```

### 2. تشغيل الخادم المحلي

```bash
npm start
```

### 3. الوصول للتطبيق

افتح المتصفح واذهب إلى `http://localhost:3000`

## ملاحظات مهمة

### الأمان

-   ✅ لا تنشر ملفات الأسئلة الخاصة
-   ✅ تأكد من أن مجلد `private/` مدرج في `.gitignore`
-   ✅ لا تضع معلومات حساسة في الكود

### الأداء

-   ✅ استخدم Vercel للحصول على أفضل أداء
-   ✅ فعّل التخزين المؤقت (Caching)
-   ✅ اضغط الصور والملفات الثابتة

### المراقبة

-   ✅ راقب أداء التطبيق
-   ✅ تحقق من الأخطاء بانتظام
-   ✅ احتفظ بنسخ احتياطية

## استكشاف الأخطاء

### مشاكل شائعة

1. **خطأ في البناء**

    ```bash
    # تأكد من تثبيت التبعيات
    npm install

    # امسح التخزين المؤقت
    npm run build -- --no-cache
    ```

2. **مشاكل في التصميم**

    - تأكد من تحميل Tailwind CSS
    - تحقق من إعدادات RTL

3. **مشاكل في الطباعة**
    - اختبر في متصفحات مختلفة
    - تحقق من إعدادات الطباعة

## الدعم

إذا واجهت مشاكل في النشر:

1. تحقق من سجلات البناء
2. راجع إرشادات المنصة المستخدمة
3. أنشئ Issue في GitHub
