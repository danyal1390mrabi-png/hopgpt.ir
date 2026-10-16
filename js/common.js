const $ = i => document.getElementById(i);
const esc = s => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;");
const EXT = {html:"html",css:"css",js:"js",javascript:"js",ts:"ts",typescript:"ts",jsx:"jsx",tsx:"tsx",py:"py",python:"py",json:"json",md:"md",markdown:"md",sh:"sh",bash:"sh",shell:"sh",sql:"sql",java:"java",c:"c",cpp:"cpp","c++":"cpp",cs:"cs",csharp:"cs",go:"go",rs:"rs",rust:"rs",php:"php",rb:"rb",ruby:"rb",kt:"kt",kotlin:"kt",swift:"swift",xml:"xml",yaml:"yml",yml:"yml",dart:"dart",lua:"lua",r:"r",vue:"vue",svg:"svg",csv:"csv",ini:"ini",toml:"toml",bat:"bat",powershell:"ps1",ps1:"ps1",txt:"txt",text:"txt"};
function md(s){
  const fileOk = !!window.FILE_OK;
  return esc(s)
   .replace(/```(\w*)\n?([\s\S]*?)(```|$)/g, (m,l,c,e,off,str) => {
     let btn = "";
     if(fileOk){
       const fm = str.slice(Math.max(0, off-160), off).match(/([\w.\-]{1,60}\.[A-Za-z0-9]{1,8})[`*\s:：]*$/);
       btn = '<button class="dlc" data-l="'+l.toLowerCase()+'" data-n="'+(fm ? fm[1] : "")+'" onclick="dlcode(this)">ذخیره به‌صورت فایل</button>';
     }
     return '<pre>'+btn+'<button onclick="cp(this)">کپی کد</button><code>'+c+'</code></pre>';
   })
   .replace(/`([^`\n]+)`/g, '<code class="i">$1</code>')
   .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");
}
function dlcode(b){
  const code = b.parentNode.querySelector("code").textContent;
  let name = b.dataset.n;
  if(!name){ const ext = EXT[b.dataset.l] || "txt"; name = SITE.en.toLowerCase() + "-" + Date.now().toString(36) + "." + ext; }
  const o = URL.createObjectURL(new Blob([code], {type:"text/plain;charset=utf-8"})), a = document.createElement("a");
  a.href = o; a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(o), 4000);
  const t = b.textContent; b.textContent = "ذخیره شد ✓"; setTimeout(() => b.textContent = t, 1500);
}
async function copyText(s){
  try{ await navigator.clipboard.writeText(s); return true; }catch(e){}
  try{
    const t = document.createElement("textarea"); t.value = s; t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.select(); const ok = document.execCommand("copy"); t.remove(); return ok;
  }catch(e){ return false; }
}
function cp(b){ copyText(b.nextSibling.textContent); const t = b.textContent; b.textContent = "کپی شد ✓"; setTimeout(() => b.textContent = t, 1500); }
function toast(m){
  let t = $("toast");
  if(!t){ t = document.createElement("div"); t.id = "toast"; document.body.appendChild(t); }
  t.textContent = m; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove("on"), 1900);
}
async function dl(url){
  const base = SITE.en.toLowerCase() + "-" + Date.now();
  try{
    const b = await (await fetch(url)).blob();
    const o = URL.createObjectURL(b), a = document.createElement("a");
    a.href = o; a.download = base + (/png/.test(b.type) ? ".png" : /webp/.test(b.type) ? ".webp" : ".jpg");
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(o), 4000);
  }catch(e){ window.open(url, "_blank"); }
}
function applyTheme(t){
  const r = document.documentElement.style, m = {bg:"--bg",bg2:"--bg2",card:"--card",line:"--line",tx:"--tx",mu:"--mu",ac:"--ac",ac2:"--ac2",ub:"--ub",ubt:"--ubt",act:"--act",code:"--code"};
  for(const k in m) if(t[k]) r.setProperty(m[k], t[k]);
  document.documentElement.classList.toggle("light", !!t.light);
}
function tilt(sel){
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect(), x = (e.clientX-r.left)/r.width-.5, y = (e.clientY-r.top)/r.height-.5;
      el.style.setProperty("--ry", (x*9)+"deg"); el.style.setProperty("--rx", (-y*9)+"deg");
    });
    el.addEventListener("pointerleave", () => { el.style.setProperty("--ry","0deg"); el.style.setProperty("--rx","0deg"); });
  });
}
function nav(active){
  const L = [["index.html","خانه"],["models.html","مدل‌ها"],["chat.html","چت"]];
  document.body.insertAdjacentHTML("afterbegin",
   '<nav class="nav"><a class="logo" href="index.html"><img src="'+SITE.icon+'" alt="" class="logo-img"><span>'+SITE.fa+'</span></a><div class="links">' +
   L.map(l => '<a href="'+l[0]+'" class="'+(l[0]==active?'on':'')+'">'+l[1]+'</a>').join("") + '<a href="#" onclick="hopLogout();return false">خروج</a></div></nav>');
}
document.querySelectorAll("[data-site]").forEach(e => e.textContent = SITE.fa);
document.title = document.title.replace("{S}", SITE.fa);

(function(){
  const h = document.head;
  const m = document.createElement("meta"); m.setAttribute("property","og:image"); m.content = SITE.url + "/" + SITE.logo; h.appendChild(m);
})();
