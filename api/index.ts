import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type Agent = { id:string; name:string; role:string; state:string; current_task:string; progress:number; last_seen:string };
type Task = { id:string; title:string; agent_id:string; status:string; progress:number; priority:string; due_at:string; created_at:string };
type Content = { id:string; title:string; type:string; channel:string; status:string; publish_at:string; quality_score:number; created_at:string };

const seedAgents: Agent[] = [
  ['planning','وكيل التخطيط التنموي','الاستراتيجية والتقويم التحريري','working','إعداد خطة محتوى أغسطس',84],
  ['editorial','وكيل التحرير','الكتابة والتحرير والتدقيق','working','صياغة سلسلة عصارة الخبرات',71],
  ['design','وكيل التصميم','الهوية والإنتاج البصري','working','كاروسيل قياس الأثر',63],
  ['publisher','وكيل النشر','الجدولة والتوزيع','online','مزامنة جدول الأسبوع',100],
  ['community','وكيل المجتمع','التفاعل وخدمة المستفيدين','working','معالجة الاستفسارات الجديدة',91],
  ['academy','وكيل الأكاديمية','البرامج ورحلة المتدرب','online','متابعة طلبات التسجيل',78],
].map(x=>({id:String(x[0]),name:String(x[1]),role:String(x[2]),state:String(x[3]),current_task:String(x[4]),progress:Number(x[5]),last_seen:new Date().toISOString()}));

const seedTasks: Task[] = [
  ['T-1001','إعداد خطة النشر الأسبوعية','planning','done',100,'high'],
  ['T-1002','صياغة منشور من المعرفة إلى الأثر','editorial','done',100,'high'],
  ['T-1003','تصميم كاروسيل مؤشرات الأثر','design','running',63,'high'],
  ['T-1004','جدولة محتوى الأسبوع','publisher','queued',10,'medium'],
  ['T-1005','تصنيف استفسارات البرامج','community','running',91,'medium'],
  ['T-1006','متابعة المتقدمين غير المكتملين','academy','running',78,'high'],
].map((x,i)=>({id:String(x[0]),title:String(x[1]),agent_id:String(x[2]),status:String(x[3]),progress:Number(x[4]),priority:String(x[5]),due_at:new Date(Date.now()+(i+1)*86400000).toISOString(),created_at:new Date().toISOString()}));

const seedContent: Content[] = [
 ['C-101','أراك للتنمية… من المعرفة إلى الأثر','منشور مؤسسي','all','published',-1,92],
 ['C-102','لماذا تفشل بعض المشاريع رغم جودة فكرتها؟','كاروسيل','linkedin,instagram','scheduled',1,88],
 ['C-103','عصارة خبرات أراك للتنمية','فيديو إطلاق','all','production',2,76],
 ['C-104','إعداد المشاريع التنموية','إعلان برنامج','instagram,facebook','ready',3,90],
 ['C-105','النشاط والمخرج والنتيجة والأثر','إنفوجرافيك','linkedin,x','design',4,81],
].map(x=>({id:String(x[0]),title:String(x[1]),type:String(x[2]),channel:String(x[3]),status:String(x[4]),publish_at:new Date(Date.now()+Number(x[5])*86400000).toISOString(),quality_score:Number(x[6]),created_at:new Date().toISOString()}));

export function db(): SupabaseClient|null {
 const url=process.env.SUPABASE_URL; const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 return url&&key ? createClient(url,key,{auth:{persistSession:false}}) : null;
}
async function read<T>(client:SupabaseClient|null, table:string, fallback:T[]):Promise<T[]> {
 if(!client) return fallback;
 const {data,error}=await client.from(table).select('*').order('created_at',{ascending:false});
 if(error) throw error; return (data||fallback) as T[];
}
async function log(client:SupabaseClient|null, type:string, title:string, details:string) {
 if(client) await client.from('activity_log').insert({type,title,details});
}
function metrics(tasks:Task[],content:Content[]){
 const completed=tasks.filter(t=>t.status==='done').length;
 return {health:Math.round(70+(completed/Math.max(tasks.length,1))*25),published:content.filter(c=>c.status==='published').length,total_content:content.length,active_tasks:tasks.filter(t=>['running','queued'].includes(t.status)).length,completed_tasks:completed,agents_online:seedAgents.filter(a=>a.state!=='offline').length,reach:46400,leads:142,enrollments:43,revenue:67600};
}
async function dashboard(client:SupabaseClient|null){
 const [agents,tasks,content,activities]=await Promise.all([
  read<Agent>(client,'agents',seedAgents), read<Task>(client,'tasks',seedTasks), read<Content>(client,'content_items',seedContent),
  read<any>(client,'activity_log',[])
 ]);
 return {mode:client?'live':'demo',generated_at:new Date().toISOString(),metrics:metrics(tasks,content),agents,tasks,content,activities:activities.slice(0,20)};
}
export async function runEngine(client:SupabaseClient|null){
 if(!client) return {ok:true,mode:'demo',message:'Engine simulation completed',processed:seedTasks.length};
 const {data:queued}=await client.from('tasks').select('*').in('status',['queued','running']).limit(20);
 let processed=0;
 for(const task of queued||[]){
  const next=Math.min(100,(task.progress||0)+(task.status==='queued'?15:10));
  const status=next>=100?'done':'running';
  await client.from('tasks').update({progress:next,status,updated_at:new Date().toISOString()}).eq('id',task.id);
  await client.from('agents').update({state:status==='done'?'online':'working',progress:next,current_task:task.title,last_seen:new Date().toISOString()}).eq('id',task.agent_id);
  if(status==='done') await log(client,'task','اكتملت مهمة',task.title);
  processed++;
 }
 await log(client,'engine','دورة تشغيل','اكتملت دورة محرك الوكلاء بنجاح');
 return {ok:true,mode:'live',processed,ran_at:new Date().toISOString()};
}

export default async function handler(req:VercelRequest,res:VercelResponse){
 res.setHeader('Cache-Control','no-store');
 const action=String(req.query.action||'dashboard'); const client=db();
 try{
  if(req.method==='GET'&&action==='health') return res.status(200).json({ok:true,service:'araak-command-engine',database:client?'connected':'not-configured',time:new Date().toISOString()});
  if(req.method==='GET'&&action==='dashboard') return res.status(200).json(await dashboard(client));
  if(req.method==='POST'&&action==='run') return res.status(200).json(await runEngine(client));
  if(req.method==='POST'&&action==='task'){
   if(!client) return res.status(503).json({ok:false,error:'Database is not configured'});
   const {title,agent_id,priority='medium',due_at}=req.body||{};
   if(!title||!agent_id) return res.status(400).json({ok:false,error:'title and agent_id are required'});
   const {data,error}=await client.from('tasks').insert({title,agent_id,priority,due_at,status:'queued',progress:0}).select().single();
   if(error) throw error; await log(client,'task','مهمة جديدة',title); return res.status(201).json({ok:true,data});
  }
  return res.status(404).json({ok:false,error:'Unknown action'});
 }catch(error:any){return res.status(500).json({ok:false,error:error?.message||'Internal error'});}
}
