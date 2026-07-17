# ARAAK Development & Academy Command Center

منصة تنفيذية عربية مستقلة لعرض أداء قطاع التنمية، المحتوى الرقمي، أكاديمية أراك، وفريق الوكلاء الذكيين.

## التشغيل المحلي

```bash
npm install
npm run dev
```

ثم افتح الرابط الذي يظهر في الطرفية (عادة `http://localhost:5173`).

## بناء نسخة الإنتاج

```bash
npm run build
npm run preview
```

## الوحدات الحالية

- المشهد التنفيذي ومؤشرات الأداء.
- خط إنتاج المحتوى وجدول النشر.
- الأكاديمية والبرامج ومسار التحويل.
- فريق الوكلاء والمهام الجارية.
- التحليلات والتوصيات.
- صفحة التكاملات والجاهزية.
- تصميم عربي RTL ومتجاوب مع الجوال.

## حالة البيانات

يتضمن المشروع باك إند Serverless على Vercel ومحرك مهام يعمل يدوياً ومن خلال Cron يومي. من دون متغيرات Supabase يعمل في وضع العرض التجريبي، وبعد إعدادها يتحول تلقائياً إلى الوضع الحي ويحفظ المهام وحالات الوكلاء وسجل النشاط.

## تفعيل قاعدة البيانات والمحرك

1. أنشئ مشروع Supabase وشغّل ملف `supabase/migrations/001_initial_schema.sql` في SQL Editor.
2. أضف إلى Vercel Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `CRON_SECRET`
3. أعد نشر المشروع. يظهر أعلى الواجهة `LIVE` عند نجاح الاتصال.
4. المسارات الأساسية: `/api?action=health` و`/api?action=dashboard` و`POST /api?action=run`.

مفتاح `SUPABASE_SERVICE_ROLE_KEY` يبقى في إعدادات Vercel فقط ولا يوضع في ملفات المستودع.

## النشر

المشروع مناسب للنشر على Vercel أو Netlify بعد رفعه إلى GitHub. أمر البناء هو `npm run build` ومجلد الناتج `dist`.
