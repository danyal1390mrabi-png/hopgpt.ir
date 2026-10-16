let tab = "top", q = "";
function draw(){
  $("tabs").innerHTML = Object.keys(TABS).map(k => '<button class="tab '+(TABS[k]==tab&&!q?'on':'')+'" onclick="tab=\''+TABS[k]+'\';q=\'\';$(\'q\').value=\'\';draw()">'+k+'</button>').join("");
  const all = q ? [...new Set(Object.values(N).join(",").split(","))].filter(n => n.toLowerCase().includes(q)) : N[tab].split(",");
  $("grid").innerHTML = all.map(n => {
    const I = modelInfo(n), th = I.th;
    return '<div class="card"><div class="t"><div class="ic" style="background:linear-gradient(135deg,'+th.ac+','+th.ac2+');color:'+th.act+'">'+esc(I.ini)+'</div><b>'+esc(n)+'</b></div>'
      + '<small>'+(I.cat=="img"?DESC.img:DESC[tab]||DESC[I.cat])+'</small>'
      + '<div class="caps">'+Object.keys(CAP_LABEL).filter(k => I.caps[k]).map(k => '<span>'+CAP_LABEL[k]+'</span>').join("")+'</div>'
      + '<em class="ex">«'+esc(I.samples[0])+'»</em>'
      + '<button class="sel" data-n="'+esc(n)+'">انتخاب و شروع چت جدید</button></div>';
  }).join("") || '<p style="color:var(--mu)">چیزی پیدا نشد</p>';
  tilt(".card");
}
$("grid").onclick = e => { const b = e.target.closest(".sel"); if(b) location.href = "chat.html?model=" + encodeURIComponent(b.dataset.n); };
$("q").oninput = e => { q = e.target.value.trim().toLowerCase(); draw(); };
nav("models.html"); draw();
