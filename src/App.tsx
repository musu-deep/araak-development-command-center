import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlarmClock, BarChart3, Bell, BookOpen, Bot, CalendarDays, CheckCircle2, ChevronLeft,
  CircleDollarSign, FileText, GraduationCap, LayoutDashboard, Menu, MessageSquareText, MoreHorizontal,
  Radio, Search, Settings, Share2, Sparkles, Target, TrendingUp, Users, X, Zap,
} from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { activities, agents, channels, contentItems, programs, weeklyReach, type NavKey } from './data';

const nav = [
  { id: 'overview' as NavKey, label: 'المشهد التنفيذي', icon: LayoutDashboard },
  { id: 'content' as NavKey, label: 'المحتوى والنشر', icon: FileText, badge: 6 },
  { id: 'academy' as NavKey, label: 'الأكاديمية والبرامج', icon: GraduationCap },
  { id: 'agents' as NavKey, label: 'فريق الوكلاء', icon: Bot, badge: 5 },
  { id: 'analytics' as NavKey, label: 'التحليلات والأثر', icon: BarChart3 },
  { id: 'settings' as NavKey, label: 'التكاملات والإعدادات', icon: Settings },
];

function App() {
  const [page, setPage] = useState<NavKey>('overview');
  const [menu, setMenu] = useState(false);
  const [period, setPeriod] = useState('هذا الأسبوع');
  const [notice, setNotice] = useState(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [engineBusy, setEngineBusy] = useState(false);
  const [engineMessage, setEngineMessage] = useState('');
  const loadDashboard = () => fetch('/api/index?action=dashboard').then(r=>r.ok?r.json():Promise.reject()).then(setLiveData).catch(()=>setLiveData(null));
  useEffect(()=>{ loadDashboard(); const timer=setInterval(loadDashboard,60000); return()=>clearInterval(timer); },[]);
  const runEngine = async()=>{setEngineBusy(true);setEngineMessage('');try{const r=await fetch('/api/index?action=run',{method:'POST'});const j=await r.json();setEngineMessage(j.ok?`اكتملت دورة التشغيل · ${j.processed} مهام`:(j.error||'تعذر التشغيل'));await loadDashboard();}catch{setEngineMessage('تعذر الاتصال بمحرك التشغيل');}finally{setEngineBusy(false);}};
  const titles: Record<NavKey, [string, string]> = {
    overview: ['المشهد التنفيذي', 'صورة حية لما تنجزه منظومة التنمية والأكاديمية'],
    content: ['المحتوى والنشر', 'خط الإنتاج التحريري وجدولة المنصات'],
    academy: ['الأكاديمية والبرامج', 'التسجيلات والتحويل والأداء المالي'],
    agents: ['فريق الوكلاء', 'حالة فريق التنفيذ الذكي والمهام الجارية'],
    analytics: ['التحليلات والأثر', 'قراءة الأداء والاتجاهات وفرص التحسين'],
    settings: ['التكاملات والإعدادات', 'جاهزية الاتصالات ومصادر البيانات'],
  };

  return <div className="app-shell">
    <aside className={`sidebar ${menu ? 'open' : ''}`}>
      <div className="brand"><div className="brand-mark">أ</div><div><strong>أراك</strong><span>مركز قيادة التنمية والأكاديمية</span></div></div>
      <button className="close-menu" onClick={() => setMenu(false)}><X size={20}/></button>
      <div className="system-state"><span className="pulse"/><div><strong>المنظومة تعمل</strong><small>6 وكلاء متصلون الآن</small></div></div>
      <nav>{nav.map(({ id, label, icon: Icon, badge }) => <button key={id} className={page === id ? 'active' : ''} onClick={() => {setPage(id); setMenu(false)}}><Icon size={19}/><span>{label}</span>{badge && <b>{badge}</b>}</button>)}</nav>
      <div className="sidebar-foot"><div className="quarter"><small>الربع الثالث 2026</small><strong>التقدم العام 68%</strong><div><i style={{width:'68%'}}/></div></div><div className="vision">نحو توطين القيم<br/>لتمكين التنمية</div></div>
    </aside>
    {menu && <div className="scrim" onClick={() => setMenu(false)}/>}

    <main>
      <header><button className="menu-btn" onClick={() => setMenu(true)}><Menu/></button><div className="search"><Search size={18}/><input placeholder="ابحث في المحتوى والبرامج والنتائج…"/></div><div className="head-actions"><button className="icon-btn" onClick={() => setNotice(!notice)}><Bell size={19}/><i/></button><div className="avatar">ل</div><div className="user"><strong>د. لؤي أحمد</strong><span>نائب الرئيس التنفيذي للتنمية</span></div></div>{notice && <div className="notifications"><strong>التنبيهات</strong><p>أداء محتوى الذكاء الاصطناعي أعلى من المتوسط بـ38%.</p><p>3 فرص شراكة جديدة تحتاج تصنيفاً آلياً.</p></div>}</header>
      <section className="page-head"><div><span className="eyebrow"><Sparkles size={15}/> ARAAK DEVELOPMENT COMMAND · {liveData?.mode==='live'?'LIVE':'DEMO'}</span><h1>{titles[page][0]}</h1><p>{titles[page][1]}</p></div><div className="page-actions"><select value={period} onChange={e=>setPeriod(e.target.value)}><option>اليوم</option><option>هذا الأسبوع</option><option>هذا الشهر</option><option>الربع الثالث</option></select><button className="primary" onClick={runEngine} disabled={engineBusy}><Radio size={17}/> {engineBusy?'جارٍ التشغيل…':'تشغيل المحرك'}</button></div></section>
      {engineMessage&&<div className="engine-toast"><CheckCircle2 size={17}/>{engineMessage}</div>}
      {page === 'overview' && <Overview setPage={setPage} data={liveData}/>} 
      {page === 'content' && <Content data={liveData}/>} 
      {page === 'academy' && <Academy/>}
      {page === 'agents' && <Agents data={liveData}/>} 
      {page === 'analytics' && <Analytics/>}
      {page === 'settings' && <SettingsPage/>}
    </main>
  </div>;
}

function Overview({setPage,data}:{setPage:(p:NavKey)=>void,data:any}) {
  const m=data?.metrics||{};
  return <div className="dashboard">
    <div className="hero-status"><div><span><Zap size={16}/> موجز التنفيذ الآن</span><h2>العمل يسير وفق الخطة <em>وبزخم متصاعد</em></h2><p>تم إنجاز {m.completed_tasks??23} مهمة، وهناك {m.active_tasks??5} مهام نشطة، وتحويل {m.enrollments??43} مهتماً إلى برامج الأكاديمية.</p></div><div className="hero-score"><div><b>{m.health??86}</b><small>/100</small></div><span>مؤشر صحة التشغيل</span></div></div>
    <div className="kpis">
      <Kpi icon={FileText} label="إجمالي المحتوى" value={String(m.total_content??38)} delta={`${m.published??8} منشور`} color="blue"/>
      <Kpi icon={TrendingUp} label="إجمالي الوصول" value={`${((m.reach??46400)/1000).toFixed(1)}K`} delta="+28.6%" color="violet"/>
      <Kpi icon={Users} label="المهتمون المؤهلون" value={String(m.leads??142)} delta="+43 جديداً" color="green"/>
      <Kpi icon={CircleDollarSign} label="عائد البرامج" value={`${((m.revenue??67600)/1000).toFixed(1)}K`} delta="ريال سعودي" color="amber"/>
    </div>
    <div className="grid-2 wide-left">
      <Card title="الوصول والتفاعل" sub="الأداء خلال الأيام السبعة الماضية" action={<button className="text-btn" onClick={()=>setPage('analytics')}>التفاصيل <ChevronLeft size={15}/></button>}><ReachChart/></Card>
      <Card title="نبض المنصات" sub="مؤشر الأداء النسبي"><div className="channels">{channels.map(c=><div className="channel" key={c.name}><div><strong>{c.name}</strong><small>{c.followers} متابع</small></div><div className="bar"><i style={{width:`${c.value}%`,background:c.color}}/></div><b>{c.value}%</b></div>)}</div></Card>
    </div>
    <div className="grid-2">
      <Card title="ما الذي حدث اليوم؟" sub="سجل تنفيذ مباشر" action={<span className="live"><i/> مباشر</span>}><div className="activity-list">{activities.map((a,i)=><div className="activity-row" key={i}><span className={`activity-dot ${a.tone}`}/><div><strong>{a.title}</strong><small>{a.meta}</small></div><time>{a.time}</time></div>)}</div></Card>
      <Card title="الأكاديمية في لمحة" sub="مسار التحويل والتسجيل" action={<button className="text-btn" onClick={()=>setPage('academy')}>عرض البرامج <ChevronLeft size={15}/></button>}><div className="funnel"><div><b>142</b><span>مهتم</span></div><ChevronLeft/><div><b>78</b><span>طلب</span></div><ChevronLeft/><div><b>43</b><span>مسجل</span></div><ChevronLeft/><div className="accent"><b>30%</b><span>تحويل</span></div></div><div className="best-program"><div className="mini-icon"><GraduationCap/></div><div><small>البرنامج الأسرع نمواً</small><strong>الذكاء الاصطناعي للقيادات التنموية</strong></div><b>+41%</b></div></Card>
    </div>
  </div>;
}

function Kpi({icon:Icon,label,value,delta,color}:{icon:any,label:string,value:string,delta:string,color:string}){return <div className="kpi"><div className={`kpi-icon ${color}`}><Icon/></div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div><MoreHorizontal size={18}/></div>}
function Card({title,sub,action,children}:{title:string,sub:string,action?:any,children:any}){return <article className="card"><div className="card-head"><div><h3>{title}</h3><p>{sub}</p></div>{action}</div>{children}</article>}
function ReachChart(){return <div className="chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={weeklyReach}><defs><linearGradient id="reach" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4bb8ec" stopOpacity={.35}/><stop offset="95%" stopColor="#4bb8ec" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1b3654" vertical={false}/><XAxis dataKey="day" stroke="#7891aa" tickLine={false} axisLine={false}/><YAxis stroke="#7891aa" tickLine={false} axisLine={false}/><Tooltip contentStyle={{background:'#0d223b',border:'1px solid #28445f',borderRadius:12}}/><Area type="monotone" dataKey="reach" stroke="#56c2f0" strokeWidth={3} fill="url(#reach)"/></AreaChart></ResponsiveContainer></div>}

function Content({data}:{data:any}){const items=data?.content?.map((x:any)=>({title:x.title,type:x.type,channel:x.channel,date:new Date(x.publish_at).toLocaleDateString('ar-SA',{day:'numeric',month:'long'}),status:({published:'منشور',scheduled:'مجدول',production:'قيد الإنتاج',ready:'جاهز',design:'قيد التصميم',draft:'مسودة'} as any)[x.status]||x.status,score:x.quality_score}))||contentItems;return <div className="dashboard"><div className="sub-kpis"><Mini label="الخطة الحالية" value={`${items.length} مواد`} icon={CalendarDays}/><Mini label="منشور" value={`${items.filter((x:any)=>x.status==='منشور').length} مواد`} icon={CheckCircle2}/><Mini label="قيد الإنتاج" value={`${items.filter((x:any)=>x.status.includes('قيد')).length} مواد`} icon={Activity}/><Mini label="الالتزام" value="92%" icon={Target}/></div><Card title="خط إنتاج المحتوى" sub="بيانات محرك التشغيل"><div className="content-table"><div className="table-head"><span>المادة</span><span>النوع والمنصة</span><span>موعد النشر</span><span>الحالة</span><span>الجودة</span></div>{items.map((x:any,i:number)=><div className="table-row" key={i}><div><b>{x.title}</b><small>AR-{String(i+1).padStart(3,'0')}</small></div><div><b>{x.type}</b><small>{x.channel}</small></div><time>{x.date}</time><span className={`status s-${x.status.replace(' ','-')}`}>{x.status}</span><strong className="quality">{x.score}%</strong></div>)}</div></Card></div>}
function Mini({label,value,icon:Icon}:{label:string,value:string,icon:any}){return <div className="mini-kpi"><Icon/><div><small>{label}</small><strong>{value}</strong></div></div>}

function Academy(){return <div className="dashboard"><div className="sub-kpis"><Mini label="إجمالي المهتمين" value="142" icon={Users}/><Mini label="التسجيلات" value="43" icon={GraduationCap}/><Mini label="معدل التحويل" value="30.3%" icon={TrendingUp}/><Mini label="العائد المتوقع" value="67,600 ر.س" icon={CircleDollarSign}/></div><div className="program-grid">{programs.map(p=><article className="program-card" key={p.name}><div className="program-top"><div className="program-icon" style={{color:p.color,background:`${p.color}18`}}><BookOpen/></div><span>نشط</span></div><h3>{p.name}</h3><div className="program-stats"><div><small>المهتمون</small><b>{p.leads}</b></div><div><small>المسجلون</small><b>{p.enrolled}</b></div><div><small>العائد</small><b>{p.revenue}</b></div></div><div className="target-line"><span>التقدم نحو المستهدف</span><b>{Math.round(p.enrolled/p.target*100)}%</b></div><div className="bar program-progress"><i style={{width:`${Math.min(100,p.enrolled/p.target*100)}%`,background:p.color}}/></div></article>)}</div><Card title="رحلة التحويل" sub="من أول تفاعل إلى التسجيل"><div className="journey">{[['الوصول','46.4K'],['التفاعل','4,780'],['الاهتمام','142'],['طلبات التسجيل','78'],['المسجلون','43']].map((x,i)=><div key={i}><span>{x[0]}</span><b>{x[1]}</b><small>{i?`${Math.round([0,10.3,3,55,55][i])}% تحويل`:'نقطة البداية'}</small></div>)}</div></Card></div>}

function Agents({data}:{data:any}){const list=data?.agents?.map((a:any)=>({name:a.name,role:a.role,state:a.state==='working'?'يعمل الآن':'متصل',task:a.current_task,done:a.progress}))||agents;const m=data?.metrics||{};return <div className="dashboard"><div className="agent-summary"><div><Bot/><span><b>{list.length}</b> وكلاء متصلون</span></div><div><CheckCircle2/><span><b>{m.completed_tasks??23}</b> مهمة مكتملة</span></div><div><AlarmClock/><span><b>{m.active_tasks??5}</b> مهام جارية</span></div><div><Zap/><span><b>94%</b> كفاءة الفريق</span></div></div><div className="agents-grid">{list.map((a:any,i:number)=><article className="agent-card" key={a.name}><div className="agent-head"><div className="agent-avatar"><Bot/></div><div><h3>{a.name}</h3><p>{a.role}</p></div><span className={a.state==='يعمل الآن'?'working':''}><i/>{a.state}</span></div><div className="current-task"><small>المهمة الحالية</small><strong>{a.task}</strong></div><div className="target-line"><span>نسبة الإنجاز</span><b>{a.done}%</b></div><div className="bar"><i style={{width:`${a.done}%`}}/></div><footer><span>AGENT-0{i+1}</span><button><Activity size={16}/> سجل النشاط</button></footer></article>)}</div></div>}

function Analytics(){const totals=useMemo(()=>weeklyReach.reduce((a,b)=>a+b.reach,0),[]);return <div className="dashboard"><div className="insight-banner"><Sparkles/><div><span>توصية المنظومة</span><strong>ضاعف محتوى «الذكاء الاصطناعي والقيادة» في الأسبوع القادم</strong><p>يحقق هذا المحور تفاعلاً أعلى بـ38% وتحويلاً أفضل بـ22% من متوسط المحتوى.</p></div><button>تطبيق التوصية</button></div><div className="grid-2 wide-left"><Card title="اتجاه الوصول" sub={`إجمالي ${totals.toLocaleString('ar')} خلال 7 أيام`}><ReachChart/></Card><Card title="مؤشرات الجودة" sub="تقييم شامل للأداء"><div className="score-list">{[['جودة المحتوى',91],['الالتزام بالنشر',92],['سرعة الاستجابة',88],['كفاءة التحويل',76],['اتساق الهوية',96]].map(x=><div key={x[0] as string}><span>{x[0]}</span><div className="bar"><i style={{width:`${x[1]}%`}}/></div><b>{x[1]}%</b></div>)}</div></Card></div><div className="grid-3"><Insight icon={TrendingUp} title="أفضل نمو" text="LinkedIn حقق نمواً قدره 31% في الوصول المهني."/><Insight icon={MessageSquareText} title="أكثر سؤال" text="الرسوم ومواعيد برنامج إعداد المشاريع هما الأكثر تكراراً."/><Insight icon={Target} title="فرصة تحويل" text="إعادة استهداف 99 مهتماً لم يكملوا التسجيل."/></div></div>}
function Insight({icon:Icon,title,text}:{icon:any,title:string,text:string}){return <div className="insight"><Icon/><div><strong>{title}</strong><p>{text}</p></div></div>}

function SettingsPage(){const integrations=[['Meta Business Suite','Facebook وInstagram',true],['LinkedIn Pages','النشر والتحليلات',false],['X / Twitter','النشر والتفاعل',false],['أكاديمية أراك','البرامج والتسجيلات',true],['Google Analytics','الزيارات والتحويل',true],['CEO OFFICE 360','الدمج المستقبلي',false]];return <div className="dashboard"><div className="settings-note"><Zap/><div><strong>البنية جاهزة للتكامل</strong><p>هذه نسخة تجريبية مستقلة. مفاتيح الاتصال الفعلية تحفظ لاحقاً في الخادم ولا تظهر داخل الواجهة.</p></div></div><Card title="التكاملات" sub="حالة مصادر البيانات وقنوات التنفيذ"><div className="integration-list">{integrations.map((x,i)=><div key={i}><div className="integration-icon"><Share2/></div><div><strong>{x[0]}</strong><small>{x[1]}</small></div><span className={x[2]?'demo':'pending'}>{x[2]?'بيانات تجريبية':'بانتظار الربط'}</span><button>إعداد الاتصال</button></div>)}</div></Card><div className="grid-2"><Card title="سياسة التشغيل" sub="حدود التفويض المعتمدة"><div className="policy"><p><CheckCircle2/> تخطيط وإنتاج ونشر المحتوى المعرفي</p><p><CheckCircle2/> الرد على الاستفسارات العامة</p><p><CheckCircle2/> تحسين الحملات بناء على الأداء</p><p className="warn"><AlarmClock/> القرارات المالية والقانونية تصعّد للإدارة</p></div></Card><Card title="جاهزية النظام" sub="قبل الانتقال إلى التشغيل الحقيقي"><div className="readiness"><div className="ring"><b>72%</b><span>جاهزية</span></div><ul><li className="done">الواجهة والتقارير</li><li className="done">نموذج البيانات</li><li>ربط حسابات النشر</li><li>إضافة الخادم وقاعدة البيانات</li></ul></div></Card></div></div>}

export default App;
