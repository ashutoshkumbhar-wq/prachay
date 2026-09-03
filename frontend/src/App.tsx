import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { api } from "./api";

type User={id:string;name:string;email:string;role:"EMPLOYEE"|"DIRECTOR"|"ACCOUNTS";employeeId?:string|null};
const statusLabel=(s:string)=>s.replaceAll("_"," ");

function Login({onLogin}:{onLogin:(u:User)=>void}) {
  const [email,setEmail]=useState("employee1@abc.com"),[password,setPassword]=useState("Password123!"),[error,setError]=useState("");
  const nav=useNavigate();
  async function submit(e:any){e.preventDefault();setError("");try{const r=await api.post("/auth/login",{email,password});localStorage.setItem("token",r.data.token);localStorage.setItem("user",JSON.stringify(r.data.user));onLogin(r.data.user);nav("/") }catch(e:any){setError(e.response?.data?.message||"Login failed")}}
  return <div className="container" style={{maxWidth:450,marginTop:80}}><div className="card"><h1>ABC Company</h1><h2>Expense Voucher Login</h2><form onSubmit={submit}><div className="field">Email<input className="input" value={email} onChange={e=>setEmail(e.target.value)}/></div><div className="field">Password<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)}/></div>{error&&<p className="error">{error}</p>}<button className="btn">Login</button></form><hr/><small>Demo: employee1@abc.com / Password123!</small></div></div>
}

function Layout({user,onLogout,children}:{user:User;onLogout:()=>void;children:any}) {
 const nav=useNavigate(); const home=`/${user.role.toLowerCase()}/dashboard`;
 return <><div className="nav"><div><b>ABC Expense System</b> <Link to={home}>Dashboard</Link><Link to={`/${user.role.toLowerCase()}/vouchers`}>Vouchers</Link></div><div>{user.name} ({user.role}) <button className="btn secondary" onClick={()=>{localStorage.clear();onLogout();nav("/login")}}>Logout</button></div></div>{children}</>
}

function Dashboard({user}:{user:User}) {
 const [d,setD]=useState<any>(null); useEffect(()=>{api.get("/vouchers/dashboard").then(r=>setD(r.data.data))},[]);
 return <div className="container"><h1>{user.role} Dashboard</h1>{d&&<div className="grid">{Object.entries(d).map(([k,v])=><div className="card" key={k}><small>{k.toUpperCase()}</small><h2>{String(v)}</h2></div>)}</div>}<div className="card" style={{marginTop:20}}><p>Use the Vouchers page to manage the reimbursement workflow.</p></div></div>
}

function Vouchers({user}:{user:User}) {
 const [items,setItems]=useState<any[]>([]),[search,setSearch]=useState("");
 async function load(){const r=await api.get("/vouchers",{params:{search,limit:50}});setItems(r.data.data)}
 useEffect(()=>{load()},[]);
 return <div className="container"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h1>Vouchers</h1>{user.role==="EMPLOYEE"&&<Link className="btn" to="/employee/vouchers/create">Create Voucher</Link>}</div><div className="card"><input className="input" placeholder="Search voucher, title, department, employee..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/></div><div className="card" style={{marginTop:16}}><table className="table"><thead><tr><th>Voucher</th><th>Employee</th><th>Department</th><th>Amount</th><th>Status</th><th></th></tr></thead><tbody>{items.map(v=><tr key={v.id}><td>{v.voucherNumber}</td><td>{v.employee?.name}</td><td>{v.department}</td><td>₹{Number(v.amount).toFixed(2)}</td><td><span className="badge">{statusLabel(v.status)}</span></td><td><Link to={`/${user.role.toLowerCase()}/vouchers/${v.id}`}>View</Link></td></tr>)}</tbody></table></div></div>
}

function VoucherForm() {
 const nav=useNavigate(); const [form,setForm]=useState<any>({voucherDate:"",expenseDate:"",department:"",expenseTitle:"",expenseCategory:"",expenseDescription:"",amount:""}),[file,setFile]=useState<File|null>(null),[msg,setMsg]=useState("");
 const set=(k:string,v:any)=>setForm({...form,[k]:v});
 async function save(submit:boolean){setMsg("");try{const r=await api.post("/vouchers",form);if(submit){const fd=new FormData();if(file)fd.append("signature",file);await api.post(`/vouchers/${r.data.data.id}/submit`,fd)}setMsg(submit?"Submitted":"Draft saved");setTimeout(()=>nav("/employee/vouchers"),700)}catch(e:any){setMsg(e.response?.data?.message||"Validation failed")}}
 return <div className="container"><h1>Create Voucher</h1><div className="card">{["voucherDate","expenseDate","department","expenseTitle","expenseCategory","amount"].map(k=><div className="field" key={k}><label>{k.replace(/([A-Z])/g," $1")}<input className="input" type={k.includes("Date")?"date":k==="amount"?"number":"text"} value={form[k]} onChange={e=>set(k,e.target.value)}/></label></div>)}<div className="field">Description<textarea className="input" value={form.expenseDescription} onChange={e=>set("expenseDescription",e.target.value)}/></div><div className="field">Employee Signature<input className="input" type="file" accept=".jpg,.jpeg,.png" onChange={e=>setFile(e.target.files?.[0]||null)}/></div>{msg&&<p>{msg}</p>}<div className="actions"><button className="btn secondary" onClick={()=>save(false)}>Save Draft</button><button className="btn" onClick={()=>save(true)}>Submit</button></div></div></div>
}

function Details({user}:{user:User}) {
 const id=location.pathname.split("/").pop()!; const [v,setV]=useState<any>(null); const [file,setFile]=useState<File|null>(null); const [reason,setReason]=useState(""); const [msg,setMsg]=useState("");
 useEffect(()=>{api.get(`/vouchers/${id}`).then(r=>setV(r.data.data))},[id]);
 if(!v)return <div className="container">Loading...</div>;
 async function approve(){if(!file)return setMsg("Director signature is required");const fd=new FormData();fd.append("signature",file);try{await api.post(`/vouchers/${id}/approve`,fd);setMsg("Approved");location.reload()}catch(e:any){setMsg(e.response?.data?.message||"Approval failed")}}
 async function reject(){try{await api.post(`/vouchers/${id}/reject`,{reason});setMsg("Rejected");location.reload()}catch(e:any){setMsg(e.response?.data?.message||"Rejection failed")}}
 return <div className="container"><h1>{v.voucherNumber}</h1><div className="card"><div className="grid">{[["Status",v.status],["Employee",v.employee?.name],["Department",v.department],["Category",v.expenseCategory],["Amount",`₹${Number(v.amount).toFixed(2)}`],["Expense Date",new Date(v.expenseDate).toLocaleDateString()],["Title",v.expenseTitle],["Description",v.expenseDescription||"-"],["Rejection Reason",v.rejectionReason||"-"]].map(([a,b])=><div key={a}><b>{a}</b><p>{b}</p></div>)}</div>{user.role==="DIRECTOR"&&v.status==="PENDING_APPROVAL"&&<><hr/><h3>Director Action</h3><input className="input" type="file" accept=".jpg,.jpeg,.png" onChange={e=>setFile(e.target.files?.[0]||null)}/><textarea className="input" placeholder="Rejection reason" value={reason} onChange={e=>setReason(e.target.value)}/><div className="actions"><button className="btn success" onClick={approve}>Approve</button><button className="btn danger" onClick={reject}>Reject</button></div></>}{msg&&<p>{msg}</p>}</div></div>
}

export default function App(){
 const [user,setUser]=useState<User|null>(()=>{try{return JSON.parse(localStorage.getItem("user")||"null")}catch{return null}});
 if(!user)return <Routes><Route path="/login" element={<Login onLogin={setUser}/>}/><Route path="*" element={<Navigate to="/login"/>}/></Routes>;
 const base=`/${user.role.toLowerCase()}`;
 return <Layout user={user} onLogout={()=>setUser(null)}><Routes>
  <Route path="/" element={<Navigate to={`${base}/dashboard`}/>}/>
  <Route path={`${base}/dashboard`} element={<Dashboard user={user}/>}/>
  <Route path={`${base}/vouchers`} element={<Vouchers user={user}/>}/>
  <Route path={`${base}/vouchers/create`} element={user.role==="EMPLOYEE"?<VoucherForm/>:<Navigate to={`${base}/vouchers`}/>}/>
  <Route path={`${base}/vouchers/:id`} element={<Details user={user}/>}/>
  <Route path="*" element={<Navigate to={`${base}/dashboard`}/>}/>
 </Routes></Layout>
}