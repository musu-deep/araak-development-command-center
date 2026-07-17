create extension if not exists "pgcrypto";

create table if not exists agents (
 id text primary key, name text not null, role text not null, state text not null default 'online',
 current_task text, progress int not null default 0 check (progress between 0 and 100),
 last_seen timestamptz default now(), created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists tasks (
 id uuid primary key default gen_random_uuid(), title text not null, agent_id text references agents(id),
 status text not null default 'queued', progress int not null default 0 check (progress between 0 and 100),
 priority text not null default 'medium', due_at timestamptz, payload jsonb default '{}'::jsonb,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists content_items (
 id uuid primary key default gen_random_uuid(), title text not null, type text, channel text,
 status text not null default 'draft', publish_at timestamptz, quality_score int default 0,
 body text, metadata jsonb default '{}'::jsonb, created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists programs (
 id uuid primary key default gen_random_uuid(), name text not null, status text default 'active',
 leads int default 0, enrolled int default 0, target int default 0, revenue numeric default 0,
 created_at timestamptz default now(), updated_at timestamptz default now()
);
create table if not exists activity_log (
 id bigint generated always as identity primary key, type text not null, title text not null,
 details text, metadata jsonb default '{}'::jsonb, created_at timestamptz default now()
);

alter table agents enable row level security;
alter table tasks enable row level security;
alter table content_items enable row level security;
alter table programs enable row level security;
alter table activity_log enable row level security;

insert into agents(id,name,role,state,current_task,progress) values
('planning','وكيل التخطيط التنموي','الاستراتيجية والتقويم التحريري','working','إعداد خطة محتوى أغسطس',84),
('editorial','وكيل التحرير','الكتابة والتحرير والتدقيق','working','صياغة سلسلة عصارة الخبرات',71),
('design','وكيل التصميم','الهوية والإنتاج البصري','working','كاروسيل قياس الأثر',63),
('publisher','وكيل النشر','الجدولة والتوزيع','online','مزامنة جدول الأسبوع',100),
('community','وكيل المجتمع','التفاعل وخدمة المستفيدين','working','معالجة الاستفسارات الجديدة',91),
('academy','وكيل الأكاديمية','البرامج ورحلة المتدرب','online','متابعة طلبات التسجيل',78)
on conflict(id) do update set name=excluded.name,role=excluded.role;

insert into programs(name,leads,enrolled,target,revenue) values
('إعداد المشاريع التنموية',38,12,25,18000),
('الذكاء الاصطناعي للقيادات',51,17,30,27200),
('تدريب المدربين RTOT',29,8,20,12800),
('البناء القيادي',24,6,20,9600);

insert into tasks(title,agent_id,status,progress,priority,due_at) values
('إعداد خطة النشر الأسبوعية','planning','done',100,'high',now()+interval '1 day'),
('صياغة منشور من المعرفة إلى الأثر','editorial','done',100,'high',now()+interval '1 day'),
('تصميم كاروسيل مؤشرات الأثر','design','running',63,'high',now()+interval '2 days'),
('جدولة محتوى الأسبوع','publisher','queued',10,'medium',now()+interval '3 days'),
('تصنيف استفسارات البرامج','community','running',91,'medium',now()+interval '1 day'),
('متابعة المتقدمين غير المكتملين','academy','running',78,'high',now()+interval '1 day');

insert into content_items(title,type,channel,status,publish_at,quality_score) values
('أراك للتنمية… من المعرفة إلى الأثر','منشور مؤسسي','all','published',now()-interval '1 day',92),
('لماذا تفشل بعض المشاريع رغم جودة فكرتها؟','كاروسيل','linkedin,instagram','scheduled',now()+interval '1 day',88),
('عصارة خبرات أراك للتنمية','فيديو إطلاق','all','production',now()+interval '2 days',76),
('إعداد المشاريع التنموية','إعلان برنامج','instagram,facebook','ready',now()+interval '3 days',90),
('النشاط والمخرج والنتيجة والأثر','إنفوجرافيك','linkedin,x','design',now()+interval '4 days',81);
