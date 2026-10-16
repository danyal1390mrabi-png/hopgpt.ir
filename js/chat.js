// ===== صفحهٔ اختصاصی هر مدل: chat.html?model=نام =====
const P = new URLSearchParams(location.search);
const cur = P.get("model") || localStorage.model || "ChatGPT";
try{ localStorage.model = cur; }catch(e){}
const INFO = modelInfo(cur);
const CAPS = INFO.caps;
window.FILE_OK = CAPS.file;
applyTheme(INFO.th);
document.title = cur + " | " + SITE.fa;

const KEY = "hopgpt_convs_v2";
let mode = "auto", img = null, items = [], cid = null, busy = false, convs = [], timers = [];
try{ convs = JSON.parse(localStorage[KEY] || "[]"); }catch(e){}
const CODE_Q = /کد|برنامه|اسکریپت|تابع|باگ|\bcode\b|function|python|javascript|html|css|sql|bug/i;

// ---------- راه‌اندازی ظاهر مدل ----------
$("hav").textContent = INFO.ini;
$("hname").textContent = cur;
$("greet").textContent = INFO.greet;
$("inp").placeholder = INFO.ph;
if(!CAPS.vision) $("attach").style.display = "none";
$("note").textContent = SITE.fa + " — رابط غیررسمی؛ پاسخ‌ها با مدل‌های متن‌باز ساخته می‌شوند و ممکن است اشتباه باشند.";
$("samples").innerHTML = INFO.samples.map((s,i) => '<button class="sample" data-i="'+i+'">'+esc(s)+'</button>').join("");
$("samples").onclick = e => { const b = e.target.closest(".sample"); if(b) send(INFO.samples[+b.dataset.i]); };

function allowedModes(){
  return Object.keys(MODES).filter(k => k == "auto" || k == "chat" || (k == "research" && CAPS.research) || (k == "image" && CAPS.image));
}
function chips(){
  if(INFO.cat == "img"){ $("chips").innerHTML = ""; return; }
  const ks = allowedModes();
  if(ks.indexOf(mode) < 0) mode = "auto";
  $("chips").innerHTML = ks.map(k => '<button class="chip '+(k==mode?'on':'')+'" data-m="'+k+'">'+MODES[k]+'</button>').join("");
}
$("chips").onclick = e => { const b = e.target.closest(".chip"); if(b){ mode = b.dataset.m; chips(); } };

// ---------- نوار کناری و تاریخچه ----------
function side(on){ $("side").classList.toggle("on", !!on); $("shade").classList.toggle("on", !!on); if(on) drawHist(); }
function drawHist(){
  $("hist").innerHTML = convs.map((c,i) => '<button class="h" onclick="loadConv('+i+')"><span>'+esc(c.title)+'</span><small>'+esc(c.model)+'</small></button>').join("")
    || '<p style="color:var(--mu)">هنوز گفتگویی نیست</p>';
}
function loadConv(i){
  const c = convs[i]; if(!c) return;
  if(c.model != cur){ location.href = "chat.html?model=" + encodeURIComponent(c.model) + "&c=" + encodeURIComponent(c.id); return; }
  cid = c.id; items = c.items.map(x => Object.assign({}, x)); render(); side(0);
}
function newChat(){ if(busy) return; items = []; cid = null; render(); side(0); }
function persist(){
  if(!items.length) return;
  const clean = items.map(x => x.r == "u"
    ? {r:"u", text:x.text, hadImg:!!(x.img || x.hadImg)}
    : {r:"a", text:x.text, kind:x.kind, gen:(x.gen && !/^data:/.test(x.gen)) ? x.gen : null, fb:x.fb || 0, err:!!x.err});
  const title = (items[0].text || "گفتگو با تصویر").slice(0,40);
  let c = convs.find(c => c.id === cid);
  if(!c){ cid = Date.now().toString(36); c = {id:cid, model:cur}; convs.unshift(c); }
  Object.assign(c, {title, items:clean, t:Date.now()});
  convs = convs.slice(0,30);
  try{ localStorage[KEY] = JSON.stringify(convs); }catch(e){}
}

// ---------- ساخت پیام‌ها ----------
const mk = (tag, cls) => { const e = document.createElement(tag); if(cls) e.className = cls; return e; };

function fillBub(bub, it){
  bub.innerHTML = "";
  if(it.r == "u"){
    bub.innerHTML = esc(it.text) + (it.img ? '<img src="'+it.img+'">' : it.hadImg ? '<div class="tag">🖼 تصویر پیوست‌شده</div>' : "");
  }else if(it.kind == "img"){
    if(it.gen){
      const box = mk("div","imgbox"), im = mk("img","gen"), b = mk("button","dl");
      im.src = it.gen; im.onerror = () => { box.replaceWith(Object.assign(mk("div","tag"), {textContent:"🖼 این تصویر دیگر موجود نیست"})); };
      b.textContent = "⬇ دانلود"; b.onclick = () => dl(it.gen);
      box.append(im, b); bub.appendChild(box);
    }else bub.innerHTML = '<div class="tag">🖼 این تصویر دیگر موجود نیست</div>';
  }else bub.innerHTML = md(it.text);
}

function tbtn(ic, title, fn, cls){ const b = mk("button","tbn "+(cls||"")); b.innerHTML = ic; b.title = title; b.onclick = fn; return b; }

function toolbar(it){
  const tb = mk("div","tb");
  if(it.r == "u"){
    tb.append(
      tbtn("📋","کپی", async () => { toast(await copyText(it.text) ? "کپی شد ✓" : "کپی نشد"); }),
      tbtn("✏️","ویرایش و ارسال دوباره", () => editMsg(items.indexOf(it)))
    );
    return tb;
  }
  if(it.kind == "img" && it.gen) tb.append(tbtn("⬇","دانلود تصویر", () => dl(it.gen)));
  else if(!it.err && it.kind != "img") tb.append(tbtn("📋","کپی پاسخ", async () => { toast(await copyText(it.text) ? "کپی شد ✓" : "کپی نشد"); }));
  tb.append(tbtn("🔄","پاسخ دوباره", () => regen(items.indexOf(it))));
  if(!it.err){
    const q = mk("span","q"); q.textContent = "راضی بودی؟";
    const up = tbtn("👍","راضی بودم", () => fb(it, 1, up, down), it.fb == 1 ? "on" : "");
    const down = tbtn("👎","راضی نبودم", () => fb(it, -1, up, down), it.fb == -1 ? "on" : "");
    tb.append(q, up, down);
  }
  return tb;
}
function fb(it, v, up, down){
  it.fb = it.fb == v ? 0 : v;
  up.classList.toggle("on", it.fb == 1); down.classList.toggle("on", it.fb == -1);
  if(it.fb) toast(it.fb == 1 ? "ممنون که راضی بودی 🙏" : "ممنون؛ بازخوردت ثبت شد");
  persist();
}

function rowEl(it){
  const d = mk("div","msg "+it.r), col = mk("div","col"), bub = mk("div","bub");
  fillBub(bub, it); col.append(bub, toolbar(it));
  if(it.r == "a"){ const av = mk("div","av"); av.textContent = INFO.ini; d.appendChild(av); }
  d.appendChild(col); return d;
}
function render(){
  const box = $("msgs"); box.innerHTML = "";
  $("welcome").style.display = items.length ? "none" : "flex";
  items.forEach(it => box.appendChild(rowEl(it)));
  $("main").scrollTop = $("main").scrollHeight;
}
function follow(){ const m = $("main"); if(m.scrollHeight - m.scrollTop - m.clientHeight < 170) m.scrollTop = m.scrollHeight; }

// ---------- ویرایش / پاسخ دوباره ----------
function editMsg(i){
  if(busy || i < 0) return;
  const it = items[i], rw = $("msgs").children[i], bub = rw.querySelector(".bub");
  const ta = mk("textarea","edit"), bar = mk("div","editbar");
  ta.value = it.text; ta.rows = Math.min(8, Math.max(2, it.text.split("\n").length));
  const ok = mk("button","btn sm"), no = mk("button","btn ghost sm");
  ok.textContent = "ارسال دوباره"; no.textContent = "لغو";
  ok.onclick = () => { const v = ta.value.trim(); if(!v && !it.img) return; it.text = v; delete it.lt; items.length = i + 1; persist(); render(); answer(); };
  no.onclick = () => fillBub(bub, it);
  bar.append(ok, no); bub.innerHTML = ""; bub.append(ta, bar); ta.focus();
}
function regen(i){
  if(busy || i < 1 || items[i-1].r != "u") return;
  items.length = i; render(); answer();
}

// ---------- ساخت پیام‌ها برای ارسال (دستورات هوش مصنوعی فقط داخل Worker است) ----------
function buildMessages(extra){
  const msgs = [];
  const last = items[items.length - 2]; // آخرین پیام کاربر (آخرین آیتم همان پاسخ در حال ساخت است)
  items.slice(0, -1).forEach(x => {
    if(x.r == "u"){
      let t = x.text || (x.img ? "این عکس را توضیح بده" : "");
      if(x === last){
        t += extra;
        msgs.push({role:"user", content: x.img ? [{type:"text", text:t},{type:"image_url", image_url:{url:x.img}}] : t});
      }else msgs.push({role:"user", content:t});
    }else if(!x.err) msgs.push({role:"assistant", content: x.kind == "img" ? "[تصویر ساخته شد]" : x.text});
  });
  return msgs;
}

// ---------- وضعیت لحظه‌ای ("در حال تحقیق...") ----------
function status(bub, txt){ bub.innerHTML = '<span class="st">'+txt+'<i>.</i><i>.</i><i>.</i></span>'; }
function clr(){ timers.forEach(clearTimeout); timers = []; }
function phases(bub, first, later){
  status(bub, first);
  later.forEach(([ms, t]) => timers.push(setTimeout(() => status(bub, t), ms)));
}

// ---------- ارسال و پاسخ ----------
function send(txt){
  if(busy) return;
  const inp = $("inp"), t = (typeof txt == "string" ? txt : inp.value).trim();
  if(!t && !img) return;
  inp.value = ""; inp.style.height = "40px";
  items.push({r:"u", text:t, img:img}); img = null; $("thumb").style.display = "none"; $("file").value = "";
  persist(); render(); answer();
}

async function answer(){
  busy = true; $("send").disabled = true;
  const last = items[items.length - 1];
  const it = {r:"a", kind:"text", text:""}; items.push(it);
  const rw = rowEl(it), bub = rw.querySelector(".bub"); rw.classList.add("pend"); $("msgs").appendChild(rw);
  $("main").scrollTop = $("main").scrollHeight;
  const done = () => {
    clr(); rw.classList.remove("pend");
    const col = rw.querySelector(".col"); col.replaceChild(toolbar(it), col.querySelector(".tb"));
    persist(); busy = false; $("send").disabled = false; follow();
  };
  const fail = m => { it.kind = "text"; it.err = true; it.text = m; bub.textContent = m; };

  try{
    // --- ساخت تصویر ---
    if(CAPS.image && (mode == "image" || (INFO.cat == "img" && !last.img))){
      it.kind = "img"; status(bub, "در حال ساخت تصویر");
      try{
        const r = await fetch(API+"/web/image", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({prompt:last.text, model:cur})});
        const j = await r.json();
        if(!r.ok || !j.image) throw 0;
        it.gen = j.image; it.text = "[تصویر ساخته شد]"; fillBub(bub, it);
      }catch(e){ fail("ساخت تصویر ناموفق بود؛ دوباره تلاش کن."); }
      return done();
    }

    // --- لینک‌ها ---
    const links = (last.text.match(/https?:\/\/\S+/g) || []).slice(0,2);
    let extra = "";
    if(links.length){
      status(bub, "در حال خواندن لینک");
      if(last.lt === undefined){
        last.lt = "";
        for(const l of links){
          try{ const r = await (await fetch(API+"/web/fetch?u="+encodeURIComponent(l))).json(); last.lt += "\n\n[محتوای "+l+"]:\n"+(r.text || ""); }catch(e){}
        }
      }
      extra = last.lt;
    }

    // --- وضعیت ---
    if(last.img) phases(bub, "در حال بررسی تصویر", [[6000, "در حال نوشتن پاسخ"]]);
    else if(mode == "research") phases(bub, "در حال تحقیق", [[4000, "در حال جمع‌آوری و بررسی اطلاعات"], [9000, "در حال تنظیم پاسخ نهایی"]]);
    else if(INFO.cat == "code" || CODE_Q.test(last.text)) phases(bub, "در حال نوشتن کد", [[7000, "در حال بررسی و کامل کردن کد"]]);
    else phases(bub, "در حال فکر کردن", [[6000, "در حال آماده‌سازی پاسخ"]]);

    // --- چت ---
    const r = await fetch(API+"/web/chat", {method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({model:cur, mode:mode, caps:Object.keys(CAPS).filter(k => CAPS[k]), messages:buildMessages(extra), stream:true})});
    if(!r.ok){ fail("همه مدل‌ها فعلاً شلوغ‌اند؛ چند دقیقه بعد دوباره تلاش کن."); return done(); }
    const rd = r.body.getReader(), dc = new TextDecoder(); let buf = "", full = "";
    while(true){
      const {done:dn, value} = await rd.read(); if(dn) break;
      buf += dc.decode(value, {stream:true}); const ls = buf.split("\n"); buf = ls.pop();
      for(const l of ls){
        if(!l.startsWith("data: ") || l.includes("[DONE]")) continue;
        try{
          const d = JSON.parse(l.slice(6)).choices?.[0]?.delta?.content || "";
          if(d){ if(!full) clr(); full += d; bub.innerHTML = md(full); follow(); }
        }catch(e){}
      }
    }
    if(!full) fail("پاسخی دریافت نشد؛ دوباره تلاش کنید.");
    else it.text = full;
  }catch(e){ fail("خطا در اتصال به سرور"); }
  done();
}

// ---------- ورودی‌ها ----------
$("file").onchange = () => {
  const f = $("file").files[0]; if(!f) return; const r = new FileReader();
  r.onload = () => { img = r.result; $("thumb").style.display = "block"; $("thumb").innerHTML = '<img src="'+img+'">'; };
  r.readAsDataURL(f);
};
$("inp").oninput = () => { const i = $("inp"); i.style.height = "40px"; i.style.height = Math.min(i.scrollHeight,140)+"px"; };
$("inp").onkeydown = e => { if(e.key == "Enter" && !e.shiftKey){ e.preventDefault(); send(); } };

chips();
const wanted = P.get("c");
if(wanted){ const c = convs.find(c => c.id === wanted && c.model === cur); if(c){ cid = c.id; items = c.items.map(x => Object.assign({}, x)); } }
render();
