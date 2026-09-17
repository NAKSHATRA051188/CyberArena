 "use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {Bot, Send, ShieldCheck, X, MessageCircle, LockKeyhole} from "lucide-react";

const quick=[
 "What should I do after an unauthorized login?",
 "How can I prevent account takeover?",
 "What if the employee portal is compromised?",
 "What if an attacker accessed customer data?"
];

export default function CyberBank(){
 const [open,setOpen]=useState(false);
 const [input,setInput]=useState("");
 const [messages,setMessages]=useState<{role:"bot"|"user";text:string}[]>([
  {role:"bot",text:"Hi. I’m CyberBank Security Advisor. Ask me about account security, how to prevent attacks, what to do after an incident, or how to protect data. If CyberBank has already generated a security alert, I can explain that existing alert when you ask."}
 ]);
 const [busy,setBusy]=useState(false);
 const [securityAlert,setSecurityAlert]=useState<any>(null);

 useEffect(()=>{
  const loadAlert=()=>{
   try{
    const raw=localStorage.getItem("cyberbank_security_incident");
    if(raw){
     const parsed=JSON.parse(raw);
     setSecurityAlert(parsed.status==="ACTIVE"?{
      active:true,
      classification:parsed.classification,
      risk:parsed.risk,
      reasons:parsed.reasons||[]
     }:null);
    }else setSecurityAlert(null);
   }catch{setSecurityAlert(null);}
  };
  loadAlert();
  window.addEventListener("storage",loadAlert);
  const timer=window.setInterval(loadAlert,1000);
  return()=>{window.removeEventListener("storage",loadAlert);window.clearInterval(timer);}
 },[]);

 async function ask(text=input){
  if(!text.trim()||busy)return;
  const q=text.trim(); setInput(""); setOpen(true);
  setMessages(m=>[...m,{role:"user",text:q}]); setBusy(true);
  try{
   const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:q,securityAlert})});
   const d=await r.json();
   setMessages(m=>[...m,{role:"bot",text:d.answer||"Please try again."}]);
  }catch{
   setMessages(m=>[...m,{role:"bot",text:"The security advisor could not be reached. Please follow the incident-response guidance in the Security Centre."}]);
  }finally{setBusy(false);}
 }
 return <main className="min-h-screen bg-[#f6f7f9]">
  <header className="border-b bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"><div className="text-xl font-bold tracking-tight text-[#123b63]">CYBERBANK</div><nav className="hidden gap-7 text-sm text-slate-600 md:flex"><span>Accounts</span><span>Payments</span><span>Cards</span><span>Loans</span><span>Help</span></nav><div className="flex items-center gap-3"><button onClick={()=>setOpen(true)} className="hidden rounded-md border border-[#123b63] px-3 py-2 text-sm font-semibold text-[#123b63] sm:block">Security Advisor</button><Link href="/login" className="rounded-md bg-[#123b63] px-4 py-2 text-sm font-semibold text-white">Sign out</Link></div></div></header>
  <section className="mx-auto max-w-7xl px-6 py-10">
   <div className="mb-8"><p className="text-sm font-semibold text-[#39739d]">PERSONAL BANKING</p><h1 className="mt-2 text-3xl font-bold text-slate-900">Good afternoon</h1><p className="mt-1 text-slate-500">Your everyday banking, in one place.</p></div>
   <div className="grid gap-5 md:grid-cols-3"><div className="rounded-xl bg-[#123b63] p-6 text-white shadow-soft"><div className="text-sm text-blue-100">Everyday Account •••• 9017</div><div className="mt-8 text-3xl font-bold">₹84,250.00</div><div className="mt-2 text-sm text-blue-100">Available balance</div></div><div className="bank-card p-6"><div className="text-sm muted">Savings •••• 4421</div><div className="mt-8 text-3xl font-bold">₹2,14,800.00</div><div className="mt-2 text-sm muted">Current balance</div></div><div className="bank-card p-6"><div className="text-sm muted">Credit Card •••• 1190</div><div className="mt-8 text-3xl font-bold">₹18,420.00</div><div className="mt-2 text-sm muted">Available credit</div></div></div>
   <div className="mt-8 grid gap-5 md:grid-cols-[1.5fr_1fr]"><div className="bank-card p-6"><div className="flex justify-between"><h2 className="font-bold">Recent transactions</h2><span className="text-sm text-[#39739d]">View all</span></div><div className="mt-5 divide-y"><div className="flex justify-between py-4"><span>Metro Mart</span><span className="font-semibold">− ₹1,240.00</span></div><div className="flex justify-between py-4"><span>Salary Credit</span><span className="font-semibold text-green-700">+ ₹72,000.00</span></div><div className="flex justify-between py-4"><span>Electricity Bill</span><span className="font-semibold">− ₹3,860.00</span></div></div></div><div className="bank-card p-6"><div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-green-700"/><h2 className="font-bold">Security Centre</h2></div><p className="mt-3 text-sm muted">Review sign-in activity and get help responding to security incidents.</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>setOpen(true)} className="rounded-lg bg-[#123b63] px-4 py-2 text-sm font-semibold text-white">Ask Security Advisor</button><Link href="/login" className="rounded-lg border px-4 py-2 text-sm font-semibold">Review sign-in</Link></div></div></div>
   <div className="mt-8 rounded-xl border border-blue-100 bg-blue-50 p-5"><div className="flex gap-3"><LockKeyhole className="mt-1 h-5 w-5 text-[#123b63]"/><div><div className="font-bold text-[#123b63]">Security reminder</div><p className="mt-1 text-sm leading-6 text-slate-600">CyberBank will never ask you to share your password or one-time security code with an employee. If you suspect unauthorized access, use the Security Advisor to review defensive next steps.</p></div></div></div>
  </section>
  <footer className="border-t bg-white px-6 py-6 text-center text-xs text-slate-500">CyberBank is a fictional training environment. No real banking services are connected.</footer>

  <button onClick={()=>setOpen(true)} aria-label="Open Security Advisor" className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-[#123b63] text-white shadow-xl"><MessageCircle/></button>
  {open&&<div className="fixed bottom-5 right-5 z-50 w-[min(430px,calc(100vw-40px))] overflow-hidden rounded-2xl border bg-white shadow-2xl">
    <div className="flex items-center justify-between bg-[#123b63] p-4 text-white"><div className="flex items-center gap-3"><div className="rounded-lg bg-white/15 p-2"><Bot className="h-5 w-5"/></div><div><div className="font-bold">CyberBank Security Advisor</div><div className="text-xs text-blue-100">Defensive incident guidance</div></div></div><button onClick={()=>setOpen(false)}><X/></button></div>
    {securityAlert?.active&&<div className="border-b bg-red-50 px-4 py-2 text-xs text-red-700"><b>Active security alert:</b> I can explain the alert generated by CyberBank security systems and guide you through defensive next steps.</div>}
    <div className="h-[380px] space-y-3 overflow-y-auto bg-slate-50 p-4">
    {securityAlert?.active&&<div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-900"><div className="font-bold">Active CyberBank security alert</div><div className="mt-1">Your Security Advisor has been given the alert context so it can explain the next steps. The advisor does not detect the incident itself.</div></div>}{messages.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${m.role==="user"?"bg-[#123b63] text-white":"border bg-white text-slate-700"}`}>{m.text}</div></div>)}{busy&&<div className="text-xs text-slate-400">Security Advisor is thinking…</div>}</div>
    <div className="border-t bg-white p-3"><div className="mb-2 flex gap-2 overflow-x-auto">{quick.map(q=><button key={q} onClick={()=>ask(q)} className="whitespace-nowrap rounded-full border px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">{q}</button>)}</div><div className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")ask()}} className="min-w-0 flex-1 rounded-lg border p-3 text-sm outline-none focus:border-blue-500" placeholder="Ask about the attack or recovery…"/><button onClick={()=>ask()} disabled={busy} className="rounded-lg bg-[#123b63] px-4 text-white disabled:opacity-50"><Send className="h-4 w-4"/></button></div><div className="mt-2 text-[10px] text-slate-400">Training assistant. Do not enter passwords, OTPs or real banking information.</div></div>
  </div>}
 </main>
}