(function(){
  const c = $("sphere"); if(!c) return;
  const x = c.getContext("2d"); let W, P = [], t = 0, k = 0, rgb = "80,160,255";
  const size = () => { W = c.width = c.height = c.clientWidth * devicePixelRatio; };
  size(); addEventListener("resize", size);
  function col(){
    let h = getComputedStyle(document.documentElement).getPropertyValue("--ac").trim().replace("#","");
    if(h.length == 3) h = h.split("").map(a => a+a).join("");
    if(/^[0-9a-f]{6}$/i.test(h)) rgb = parseInt(h.slice(0,2),16)+","+parseInt(h.slice(2,4),16)+","+parseInt(h.slice(4,6),16);
  }
  for(let i=0;i<110;i++){ const y = 1-2*(i+.5)/110, r = Math.sqrt(1-y*y), a = i*2.39996; P.push([Math.cos(a)*r, y, Math.sin(a)*r]); }
  (function frame(){
    if(k++ % 30 == 0) col();
    x.clearRect(0,0,W,W); t += .004; const cs = Math.cos(t), sn = Math.sin(t), R = W*.4, q = [];
    for(const p of P) q.push([W/2 + (p[0]*cs+p[2]*sn)*R, W/2 + p[1]*R, -p[0]*sn+p[2]*cs]);
    x.lineWidth = devicePixelRatio*.6;
    for(let i=0;i<q.length;i++) for(let j=i+1;j<q.length;j++){
      const d = Math.hypot(q[i][0]-q[j][0], q[i][1]-q[j][1]);
      if(d < R*.34){ x.strokeStyle = "rgba("+rgb+","+(.35*(1-d/(R*.34))*((q[i][2]+q[j][2])/4+.6))+")"; x.beginPath(); x.moveTo(q[i][0],q[i][1]); x.lineTo(q[j][0],q[j][1]); x.stroke(); }
    }
    for(const p of q){ x.fillStyle = "rgba("+rgb+","+(.45+.45*p[2])+")"; x.beginPath(); x.arc(p[0],p[1],(1.6+p[2])*devicePixelRatio,0,7); x.fill(); }
    requestAnimationFrame(frame);
  })();
})();
