# Webshop MVP (Next.js + Prisma + Stripe)

متجر إلكتروني كامل باستخدام:
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Prisma + SQLite (مع قابلية التحويل إلى Postgres لاحقًا)
- Stripe Checkout (Test Mode)
- نظام مصادقة بسيط (Email/Password + JWT Cookie)

## المزايا المنفذة
- تسجيل / دخول / خروج.
- حماية صفحات `/admin` بحيث يدخلها ADMIN فقط.
- صفحات المتجر:
  - `/` الصفحة الرئيسية
  - `/products` قائمة المنتجات مع بحث + فلترة + ترتيب
  - `/products/[slugOrId]` صفحة المنتج
  - `/cart` السلة (localStorage)
  - `/checkout` بدء الدفع عبر Stripe
  - `/account/orders` طلباتي
- Stripe:
  - إنشاء Checkout Session آمن من السيرفر
  - Webhook لتحديث حالة الطلب (`PAID/FAILED`)
- لوحة الإدارة:
  - `/admin` لوحة إحصائيات
  - `/admin/products` CRUD كامل
  - رفع صور المنتجات إلى `/public/uploads` (حل MVP)
  - `/admin/orders` إدارة حالات الطلبات
- تحسينات تجربة المستخدم:
  - Navbar + Footer
  - Toasts
  - Loading state
  - 404 + Empty states
  - Validation عبر Zod

## المتطلبات
- Node.js 20+
- npm
- Stripe CLI (اختياري لكن مفيد لاختبار webhook محليًا)

## الإعداد السريع
1. تثبيت الحزم:
```bash
npm install
```

2. إعداد ملف البيئة:
```bash
cp .env.example .env
```

3. تحديث مفاتيح Stripe داخل `.env`:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

4. تشغيل Prisma migration + seed:
```bash
npm run db:migrate
npm run db:seed
```

5. تشغيل المشروع:
```bash
npm run dev
```

## أوامر مهمة
- `npm run db:migrate` تشغيل migration
- `npm run db:seed` إدخال بيانات تجريبية
- `npm run db:studio` فتح Prisma Studio
- `npm run lint` فحص الكود
- `npm run build` بناء الإنتاج

## حسابات تجريبية
- Admin:
  - Email: `admin@webshop.local`
  - Password: `Admin123!`
- User:
  - Email: `user@webshop.local`
  - Password: `User123!`

## تشغيل Stripe Webhook محليًا
1. شغّل التطبيق:
```bash
npm run dev
```

2. سجّل الدخول في Stripe CLI:
```bash
stripe login
```

3. فعّل webhook محليًا:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

4. انسخ قيمة `whsec_...` وضعها في `.env` في `STRIPE_WEBHOOK_SECRET`.

## بطاقات الدفع التجريبية
- نجاح الدفع: `4242 4242 4242 4242`
- استخدم تاريخًا مستقبليًا + أي CVC + أي ZIP.

## التحويل إلى Postgres لاحقًا
1. غيّر `provider` في `prisma/schema.prisma` إلى `postgresql`.
2. حدّث `DATABASE_URL` لرابط Postgres.
3. نفّذ migration جديدة.

## قائمة التحقق (Acceptance)
- [x] المستخدم يسجل/يدخل، يتصفح المنتجات، يضيف للسلة.
- [x] checkout ينشئ Order بحالة `PENDING` ثم يحوّل إلى Stripe.
- [x] webhook يحدّث الطلب إلى `PAID` عند نجاح الدفع.
- [x] الطلب يظهر في `/account/orders`.
- [x] Admin يضيف منتجًا جديدًا ويظهر في `/products`.
- [x] Admin يغيّر حالة الطلب من لوحة الإدارة.

## ملاحظات MVP
- رفع الصور إلى `/public/uploads` مناسب للتطوير فقط وليس للإنتاج.
- للإنتاج يفضّل استخدام S3/UploadThing + Session/Auth أقوى + Rate Limiting.
