import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db, runEngine } from './index.js';

export default async function cron(req:VercelRequest,res:VercelResponse){
  const secret=process.env.CRON_SECRET;
  if(secret && req.headers.authorization!==`Bearer ${secret}`) return res.status(401).json({ok:false,error:'Unauthorized'});
  try{return res.status(200).json(await runEngine(db()));}
  catch(error:any){return res.status(500).json({ok:false,error:error?.message||'Engine failure'});}
}
