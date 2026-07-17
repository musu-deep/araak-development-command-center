export type NavKey = 'overview' | 'content' | 'academy' | 'agents' | 'analytics' | 'settings';

export const weeklyReach = [
  { day: 'السبت', reach: 4200, engagement: 820 }, { day: 'الأحد', reach: 5800, engagement: 1100 },
  { day: 'الاثنين', reach: 5100, engagement: 980 }, { day: 'الثلاثاء', reach: 7900, engagement: 1540 },
  { day: 'الأربعاء', reach: 6800, engagement: 1320 }, { day: 'الخميس', reach: 9200, engagement: 1880 },
  { day: 'الجمعة', reach: 7400, engagement: 1450 },
];

export const channels = [
  { name: 'LinkedIn', value: 86, color: '#2d83c5', followers: '12.8K' },
  { name: 'Instagram', value: 74, color: '#a66bf2', followers: '18.4K' },
  { name: 'X', value: 68, color: '#36b8d4', followers: '9.7K' },
  { name: 'Facebook', value: 57, color: '#4b70d6', followers: '21.2K' },
];

export const activities = [
  { time: '10:42', title: 'نُشر كاروسيل «من النشاط إلى الأثر»', meta: 'LinkedIn · Instagram', tone: 'green' },
  { time: '10:18', title: 'تحويل 4 مهتمين إلى صفحة التسجيل', meta: 'برنامج إعداد المشاريع', tone: 'blue' },
  { time: '09:51', title: 'اكتمل تصميم حملة عصارة الخبرات', meta: '6 تصاميم جاهزة', tone: 'violet' },
  { time: '09:20', title: 'رُصد ارتفاع في تفاعل محتوى الذكاء الاصطناعي', meta: '+38% عن المتوسط', tone: 'amber' },
  { time: '08:45', title: 'تم الرد على 11 استفساراً', meta: 'متوسط الرد 14 دقيقة', tone: 'green' },
];

export const contentItems = [
  { title: 'أراك للتنمية… من المعرفة إلى الأثر', type: 'منشور مؤسسي', channel: 'جميع المنصات', date: '18 يوليو', status: 'منشور', score: 92 },
  { title: 'لماذا تفشل بعض المشاريع رغم جودة فكرتها؟', type: 'كاروسيل', channel: 'LinkedIn · Instagram', date: '19 يوليو', status: 'مجدول', score: 88 },
  { title: 'عصارة خبرات أراك للتنمية', type: 'فيديو إطلاق', channel: 'جميع المنصات', date: '20 يوليو', status: 'قيد الإنتاج', score: 76 },
  { title: 'إعداد المشاريع التنموية', type: 'إعلان برنامج', channel: 'Instagram · Facebook', date: '21 يوليو', status: 'جاهز', score: 90 },
  { title: 'النشاط والمخرج والنتيجة والأثر', type: 'إنفوجرافيك', channel: 'LinkedIn · X', date: '22 يوليو', status: 'قيد التصميم', score: 81 },
  { title: 'الأخلاق أساس العمران', type: 'قصاصة قيمية', channel: 'جميع المنصات', date: '23 يوليو', status: 'مسودة', score: 72 },
];

export const programs = [
  { name: 'إعداد المشاريع التنموية', leads: 38, enrolled: 12, target: 25, revenue: '18,000', color: '#29c3a1' },
  { name: 'الذكاء الاصطناعي للقيادات', leads: 51, enrolled: 17, target: 30, revenue: '27,200', color: '#5b8def' },
  { name: 'تدريب المدربين RTOT', leads: 29, enrolled: 8, target: 20, revenue: '12,800', color: '#a879f7' },
  { name: 'البناء القيادي', leads: 24, enrolled: 6, target: 20, revenue: '9,600', color: '#f3aa54' },
];

export const agents = [
  { name: 'وكيل التخطيط التنموي', role: 'الاستراتيجية والتقويم التحريري', state: 'يعمل الآن', task: 'إعداد خطة محتوى أغسطس', done: 84, icon: 'تخطيط' },
  { name: 'وكيل التحرير', role: 'الكتابة والتحرير والتدقيق', state: 'يعمل الآن', task: 'صياغة سلسلة عصارة الخبرات', done: 71, icon: 'تحرير' },
  { name: 'وكيل التصميم', role: 'الهوية والإنتاج البصري', state: 'يعمل الآن', task: 'كاروسيل قياس الأثر', done: 63, icon: 'تصميم' },
  { name: 'وكيل النشر', role: 'الجدولة والتوزيع', state: 'متصل', task: 'مزامنة جدول الأسبوع', done: 100, icon: 'نشر' },
  { name: 'وكيل المجتمع', role: 'التفاعل وخدمة المستفيدين', state: 'يعمل الآن', task: 'معالجة 3 استفسارات', done: 91, icon: 'مجتمع' },
  { name: 'وكيل الأكاديمية', role: 'البرامج ورحلة المتدرب', state: 'متصل', task: 'متابعة طلبات التسجيل', done: 78, icon: 'أكاديمية' },
];
