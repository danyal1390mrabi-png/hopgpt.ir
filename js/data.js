const N = {
 top:"ChatGPT,Claude,Google Gemini,DeepSeek,Grok,Claude Code,Cursor,Midjourney,FLUX,Llama,Qwen,Mistral Le Chat",
 chat:"ChatGPT,Claude,Google Gemini,Microsoft Copilot,DeepSeek,Qwen Chat,Mistral Le Chat,Grok,Perplexity,Poe,Kimi,Z.ai GLM,MiniMax,You.com,Meta AI",
 code:"Claude Code,OpenAI Codex,Cursor,Windsurf,GitHub Copilot,Google Antigravity,Replit Agent,Lovable,Bolt.new,v0,Cline,Roo Code,Aider,Continue,Tabnine,Amazon Q Developer,Sourcegraph Cody,Augment Code,Qwen Coder,DeepSeek Coder,Codeium,Blackbox AI",
 img:"Midjourney,OpenAI Image Generation,Google Imagen,FLUX,Stable Diffusion,Qwen Image,Ideogram,Adobe Firefly,Leonardo AI,Recraft,Black Forest Labs,Microsoft Designer,Canva AI,Playground AI,Krea AI,NightCafe,DreamStudio,Tensor.Art,PixAI,ComfyUI",
 oss:"Llama,Qwen,DeepSeek,Mistral,Gemma,OLMo,Phi,Falcon,GLM,MiniCPM,StarCoder2,Code Llama,DeepSeek Coder,Qwen Coder,Whisper,Kokoro,Stable Diffusion,FLUX,Qwen Image,ComfyUI"
};
const TABS = {"پرکاربردترین‌ها":"top","چت":"chat","برنامه‌نویسی":"code","تولید تصویر":"img","متن‌باز":"oss"};
const DESC = {top:"محبوب و پرکاربرد",chat:"دستیار هوشمند گفتگو",code:"دستیار برنامه‌نویسی",img:"تولید تصویر از متن",oss:"مدل متن‌باز"};
const IMG = /midjourney|image|imagen|flux|diffusion|ideogram|firefly|leonardo|recraft|black forest|designer|canva|playground|krea|nightcafe|dreamstudio|tensor|pixai|comfy/i;
const MODES = {auto:"✨ خودکار",chat:"💬 فقط گفتگو",research:"🔎 تحقیق",image:"🎨 ساخت تصویر"};

const CODE_SET = new Set(N.code.split(",")), CHAT_SET = new Set(N.chat.split(","));

// ---------- تم هر مدل (رنگ‌ها شبیه هویت بصری هر محصول) ----------
const BASE = {bg:"#0b1530",bg2:"#101d3d",card:"#16254a",line:"#24365f",tx:"#eef2ff",mu:"#8fa0c8",ac:"#3b9bff",ac2:"#7b5cff",ub:"#1d4fa8",ubt:"#ffffff",act:"#ffffff",code:"#060d1f"};
const T = o => Object.assign({}, BASE, o);
const THEMES = [
 ["claude code", T({ac:"#d97757",ac2:"#c15f3c",bg:"#1a1918",bg2:"#211f1e",card:"#2a2826",line:"#3a3733",tx:"#f4f1ea",mu:"#a39e93",ub:"#b9573a",code:"#121110",greet:"امروز روی چه پروژه‌ای کار کنیم؟"})],
 ["claude", T({light:1,ac:"#c96442",ac2:"#d97757",bg:"#faf9f5",bg2:"#f0eee6",card:"#ffffff",line:"#e4e0d4",tx:"#29261b",mu:"#6f6a5c",ub:"#ebe6d8",ubt:"#29261b",code:"#f3f0e6",greet:"سلام! امروز چطور می‌تونم کمکت کنم؟"})],
 ["chatgpt", T({ac:"#10a37f",ac2:"#0d8a6a",bg:"#212121",bg2:"#171717",card:"#2a2a2a",line:"#3a3a3a",tx:"#ececec",mu:"#9b9b9b",ub:"#303030",code:"#121212",greet:"امروز چه کمکی از من برمیاد؟"})],
 ["openai", T({ac:"#10a37f",ac2:"#0d8a6a",bg:"#212121",bg2:"#171717",card:"#2a2a2a",line:"#3a3a3a",tx:"#ececec",mu:"#9b9b9b",ub:"#303030",code:"#121212"})],
 ["gemini", T({ac:"#4c8df6",ac2:"#a56cf5",bg:"#131314",bg2:"#1b1c1d",card:"#1e1f20",line:"#303134",tx:"#e3e3e3",mu:"#9aa0a6",ub:"#2b3a67",code:"#0e0e0f",greet:"سلام! امروز چه کاری می‌تونم برات انجام بدم؟"})],
 ["deepseek", T({ac:"#4d6bfe",ac2:"#3a54d6",bg:"#0e1015",bg2:"#14161d",card:"#1a1d26",line:"#282c38",ub:"#2b3a8c",code:"#0a0c10",greet:"سلام! چطور می‌تونم کمکت کنم؟"})],
 ["grok", T({ac:"#ffffff",ac2:"#bdbdbd",act:"#000000",bg:"#000000",bg2:"#0a0a0a",card:"#101010",line:"#222222",tx:"#f2f2f2",mu:"#8a8a8a",ub:"#1d1d1d",code:"#0a0a0a",greet:"چی تو ذهنته؟"})],
 ["perplexity", T({ac:"#20b8cd",ac2:"#1a8fa0",act:"#04222a",bg:"#191a1a",bg2:"#202222",card:"#232525",line:"#323535",ub:"#14606b",code:"#131414",greet:"هر چیزی می‌خوای بدونی بپرس",ph:"هر سؤالی بپرس…"})],
 ["copilot", T({ac:"#7c6cf8",ac2:"#ff8a3d",bg:"#14121f",bg2:"#1b1830",card:"#201d36",line:"#322e52",ub:"#4a3fb5",code:"#0e0c18",greet:"امروز چی تو ذهنته؟"})],
 ["mistral", T({ac:"#ff7000",ac2:"#ffb000",act:"#1a0c00",bg:"#16110c",bg2:"#1d1710",card:"#241c13",line:"#3a2d1e",ub:"#8a3e00",code:"#100c08"})],
 ["qwen", T({ac:"#615ced",ac2:"#8b5cf6",bg:"#0f0f1f",bg2:"#151530",card:"#1b1b3b",line:"#2c2c58",ub:"#3f3bb5",code:"#0a0a16"})],
 ["meta ai", T({ac:"#0866ff",ac2:"#00c2ff",bg:"#0b1220",bg2:"#101a2e",card:"#14213a",line:"#22335a",ub:"#0b4fc2"})],
 ["llama", T({ac:"#0866ff",ac2:"#00c2ff",bg:"#0b1220",bg2:"#101a2e",card:"#14213a",line:"#22335a",ub:"#0b4fc2"})],
 ["kimi", T({ac:"#2f7bff",ac2:"#6aa5ff",bg:"#0c0d10",bg2:"#121318",card:"#17181e",line:"#25272f",ub:"#1f4fb0",code:"#08090b"})],
 ["midjourney", T({ac:"#f2f2f2",ac2:"#9a9a9a",act:"#000000",bg:"#0b0b0b",bg2:"#121212",card:"#171717",line:"#262626",mu:"#8c8c8c",ub:"#222222",code:"#0a0a0a",greet:"چه تصویری در ذهن داری؟"})],
 ["flux", T({ac:"#ffd23f",ac2:"#ff8c00",act:"#1a1300",bg:"#0d0c08",bg2:"#15130b",card:"#1c1a0f",line:"#332f18",ub:"#7a5d00",code:"#0a0905"})],
 ["black forest", T({ac:"#ffd23f",ac2:"#ff8c00",act:"#1a1300",bg:"#0d0c08",bg2:"#15130b",card:"#1c1a0f",line:"#332f18",ub:"#7a5d00",code:"#0a0905"})]
];
const CATTH = {
 chat: T({}),
 code: T({ac:"#3fb950",ac2:"#2ea043",act:"#04140a",bg:"#0d1117",bg2:"#161b22",card:"#161b22",line:"#30363d",ub:"#1f6f35",code:"#010409",greet:"کدوم پروژه رو شروع کنیم؟"}),
 img:  T({ac:"#c057ff",ac2:"#ff5fa2",bg:"#130c24",bg2:"#1b1233",card:"#21173d",line:"#34255c",ub:"#6d2fb0",code:"#0d0818",greet:"چه تصویری برات بسازم؟"}),
 oss:  T({ac:"#2dd4bf",ac2:"#38bdf8",act:"#04201c",bg:"#0a1a1c",bg2:"#102527",card:"#143034",line:"#1f4a4f",ub:"#0f766e",code:"#071314"})
};

// ---------- سوال‌های نمونه ----------
const SAMPLES = {
 chat:["یه برنامهٔ ۴ هفته‌ای برای یادگیری زبان انگلیسی بساز","تفاوت هوش مصنوعی و یادگیری ماشین رو ساده توضیح بده","یه ایمیل رسمی برای درخواست مرخصی بنویس","۵ ایدهٔ کسب‌وکار کوچک با سرمایهٔ کم پیشنهاد بده"],
 code:["یه تابع پایتون بنویس که اعداد اول تا n رو پیدا کنه","تفاوت let و const و var در جاوااسکریپت چیه؟","یه صفحهٔ لاگین ساده با HTML و CSS بساز","چطور یه API ساده با Node.js بسازم؟"],
 img: ["یه گربهٔ فضانورد روی ماه، سبک سینمایی","شهر آینده‌نگر در شب با نورهای نئونی","لوگوی مینیمال برای کافه‌ای به اسم «آرامش»","پرتره‌ای از یک شیر با سبک نقاشی رنگ‌روغن"],
 oss: ["مدل‌های متن‌باز چه تفاوتی با مدل‌های بسته دارن؟","یه شعر کوتاه دربارهٔ بهار بگو","چطور برنامه‌نویسی رو از صفر شروع کنم؟","یه خلاصهٔ ساده از انقلاب صنعتی بنویس"]
};
const SP = [
 ["claude code",["یه پروژهٔ Todo با React از صفر بساز","ساختار یه ریپوی تمیز برای پروژهٔ Node.js پیشنهاد بده","این خطا یعنی چی و چطور رفعش کنم؟ (خطا رو می‌فرستم)","برای کد من تست واحد با Jest بنویس"]],
 ["claude",["یه متن ۳ پاراگرافی دربارهٔ اهمیت خواب خوب بنویس","این متن رو ویرایش و روان‌تر کن (متن رو می‌فرستم)","مزایا و معایب کار از راه دور رو تحلیل کن","یه داستان کوتاه با پایان غیرمنتظره بنویس"]],
 ["chatgpt",["یه برنامهٔ غذایی هفتگی سالم و ارزون بچین","به زبان ساده توضیح بده بلاک‌چین چطور کار می‌کنه","یه رزومهٔ کوتاه برای برنامه‌نویس جونیور بنویس","برای سفر سه‌روزه به شیراز برنامه بریز"]],
 ["openai codex",["تابعی بنویس که یه آرایه رو بدون استفاده از sort مرتب کنه","این SQL رو بهینه کن (کوئری رو می‌فرستم)","Regex برای تشخیص ایمیل معتبر بنویس","یه اسکریپت پایتون برای تغییر نام دسته‌ای فایل‌ها بنویس"]],
 ["openai image",["پوستر یه جشنوارهٔ موسیقی با رنگ‌های گرم","یه ربات مهربون که داره گل آبیاری می‌کنه","آیکون اپلیکیشن هواشناسی به سبک مینیمال","صبح مه‌آلود روی دریاچه، سبک واقع‌گرایانه"]],
 ["gemini",["این مفهوم رو مثل یه معلم صبور توضیح بده: تورم","سه روش برای افزایش تمرکز موقع مطالعه بگو","یه جدول مقایسهٔ لپ‌تاپ و تبلت برای دانشجو بساز","برای یه ارائهٔ ۵ دقیقه‌ای دربارهٔ انرژی خورشیدی سرفصل بنویس"]],
 ["deepseek coder",["این الگوریتم رو با پیچیدگی بهتر بازنویسی کن","تفاوت مرتب‌سازی سریع و ادغامی رو با کد نشون بده","یه کلاس پایتون برای مدیریت صف بنویس","چطور باگ حافظه (memory leak) رو پیدا کنم؟"]],
 ["deepseek",["یه مسئلهٔ ریاضی دبیرستانی رو قدم‌به‌قدم حل کن","منطق پشت الگوریتم دایکسترا رو توضیح بده","مزایا و معایب سرمایه‌گذاری در طلا رو تحلیل کن","یه معمای منطقی بگو تا حلش کنم"]],
 ["grok",["آخرین روندهای دنیای فناوری چیه؟","یه جوک باحال دربارهٔ برنامه‌نویس‌ها بگو","نظرت دربارهٔ آیندهٔ هوش مصنوعی چیه؟","یه توییت خلاقانه برای معرفی یه محصول جدید بنویس"]],
 ["perplexity",["تفاوت پنل خورشیدی مونوکریستال و پلی‌کریستال چیه؟","مهم‌ترین اتفاقات علمی امسال چی بوده؟","بهترین روش‌های یادگیری سریع یه مهارت جدید چیه؟","خلاصه‌ای از تاریخچهٔ اینترنت با منابع بگو"]],
 ["microsoft copilot",["یه ایمیل کاری شیک برای پیگیری پروژه بنویس","فرمول Excel برای جمع شرطی چیه؟","یه ارائهٔ ۵ اسلایدی دربارهٔ مدیریت زمان طراحی کن","جلسه‌ام رو در ۵ نکته خلاصه کن (متن رو می‌فرستم)"]],
 ["github copilot",["این تابع رو کامل کن و کامنت فارسی بذار","برای این کد README حرفه‌ای بنویس","تفاوت Git merge و rebase رو با مثال بگو","یه workflow ساده برای GitHub Actions بنویس"]],
 ["cursor",["این پروژه رو به TypeScript تبدیل کن (کد رو می‌فرستم)","کد این کامپوننت رو تمیزتر و خواناتر کن","یه رابط کاربری برای فروشگاه آنلاین با React بساز","تست‌های ناقص این ماژول رو کامل کن"]],
 ["windsurf",["یه اپ ساده یادداشت‌برداری با JavaScript بساز","ساختار فولدر مناسب برای یه پروژهٔ بزرگ پیشنهاد بده","این تابع رو سریع‌تر کن","یه API REST با Express بنویس"]],
 ["midjourney",["پرتره‌ای سینمایی از یه دختر با نور غروب","معماری شهر آینده با درختان عظیم، بسیار دقیق","تصویر مفهومی یه دراگون روی قله کوه برفی","غذای ایرانی روی میز چوبی، عکاسی حرفه‌ای"]],
 ["flux",["واقع‌گرایانه: چای داغ کنار پنجره در روز بارانی","یه ربات قدیمی در جنگل پاییزی، رنگ‌های گرم","پوستر مینیمال برای یه فیلم علمی‌تخیلی","نمای نزدیک از قطرهٔ آب روی برگ سبز"]],
 ["stable diffusion",["منظرهٔ کوهستانی با مه صبحگاهی، سبک نقاشی","شخصیت کارتونی یه روباه جنگجو","قلعه‌ای روی ابرها، فانتزی","اتاق مطالعهٔ دنج با نور شمع"]],
 ["whisper",["Whisper چیه و چه کاری انجام میده؟","چطور صدای فارسی رو به متن تبدیل کنم؟","تفاوت مدل‌های tiny و large در Whisper چیه؟","یه کد پایتون ساده برای تبدیل گفتار به متن بنویس"]],
 ["kokoro",["Kokoro چیه و برای چی استفاده می‌شه؟","مدل‌های تبدیل متن به گفتار چطور کار می‌کنن؟","چطور یه مدل TTS رو روی کامپیوتر اجرا کنم؟","تفاوت TTS و STT رو توضیح بده"]],
 ["code llama",["این تابع رو بهینه و تمیز بازنویسی کن","یه کلاس جاوا برای مدیریت کاربران بنویس","تفاوت لیست و تاپل در پایتون چیه؟","یه اسکریپت ساده برای خوندن فایل JSON بنویس"]],
 ["llama",["مدل‌های Llama چه مزیتی نسبت به مدل‌های بسته دارن؟","یه برنامهٔ ورزشی مبتدی برای خونه بنویس","کدنویسی مرتب‌سازی حبابی رو توضیح بده","یه خلاصهٔ کوتاه از تاریخ ایران بگو"]],
 ["qwen coder",["این تابع رو به زبان Go بازنویسی کن","یه اسکریپت Bash برای بکاپ‌گیری روزانه بنویس","الگوی Singleton رو با مثال توضیح بده","یه پرس‌وجوی SQL با JOIN چندجدولی بنویس"]],
 ["qwen image",["پوستر تبلیغاتی یه رستوران سنتی","تصویر تخیلی از یه شهر زیر دریا","طراحی یه کاراکتر انیمه با لباس سنتی","کارت دعوت عروسی با گل‌های ظریف"]],
 ["qwen",["یه متن دوزبانه فارسی-انگلیسی برای معرفی شرکتم بنویس","یه برنامهٔ مطالعه برای کنکور بچین","مفهوم یادگیری عمیق رو با مثال ساده توضیح بده","یه جدول مقایسهٔ زبان‌های برنامه‌نویسی بساز"]],
 ["mistral",["یه ایمیل مودبانه به زبان فرانسه بنویس","تفاوت مدل‌های زبانی بزرگ و کوچک چیه؟","سه ایدهٔ استارتاپی در حوزهٔ آموزش بگو","یه قطعه کد پایتون برای خوندن فایل CSV بنویس"]],
 ["kimi",["یه متن بلند رو در ۵ نکته خلاصه کن (متن رو می‌فرستم)","مقالهٔ علمی رو ساده توضیح بده","یه برنامهٔ سفر ۵ روزه به ترکیه بچین","چطور یه کتاب رو سریع‌تر و بهتر مطالعه کنم؟"]],
 ["meta ai",["یه ایدهٔ جذاب برای جشن تولد دوستم بگو","یه کپشن کوتاه برای عکس طبیعت بنویس","چند ایدهٔ ساده برای شام امشب بده","تفاوت اینستاگرام و تیک‌تاک برای کسب‌وکار چیه؟"]],
 ["gemma",["یه خلاصهٔ کوتاه از رمان «بوف کور» بنویس","این جمله رو به انگلیسی ترجمه کن: «امروز هوا عالیه»","یه برنامهٔ یادگیری پایتون برای مبتدی‌ها بنویس","چند نکته برای مصاحبهٔ شغلی بگو"]]
];

// ---------- قابلیت‌های واقعی هر مدل (هر مدل فقط کارهایی را دارد که محصول اصلی‌اش در دنیای واقعی دارد) ----------
const CAP_LABEL = {research:"🔎 تحقیق", image:"🎨 ساخت تصویر", file:"📄 تحویل فایل", vision:"🖼 دیدن عکس"};
// چت‌بات‌هایی که در دنیای واقعی خودشان تصویر هم می‌سازند (Claude، DeepSeek، Kimi، GLM در این فهرست نیستند)
const CAP_IMG_CHAT = /chatgpt|gemini|copilot|grok|meta ai|le chat|qwen chat|poe|you\.com|perplexity|minimax/i;
// مدل‌هایی که عکس نمی‌بینند / ابزارهایی که ورودی عکس ندارند
const CAP_NO_VISION = /whisper|kokoro|starcoder|code llama|olmo|falcon|^glm$|tabnine|aider|^continue$|deepseek coder/i;
// ابزارهای کدنویسی که خودشان جستجوی وب دارند
const CAP_CODE_WEB = /claude code|codex|cursor|antigravity|replit|windsurf|github copilot/i;
// مدل‌های صوتی: نه فایل، نه تصویر، نه تحقیق
const CAP_AUDIO = /whisper|kokoro/i;

function capsOf(name, cat){
  const c = {research:false, image:false, file:false, vision:false};
  if(cat == "img"){ c.image = true; return c; }          // مدل تصویری: فقط ساخت تصویر
  if(CAP_AUDIO.test(name)) return c;
  c.file = true;                                          // همهٔ مدل‌های متنی/کدنویسی می‌توانند کد را به‌صورت فایل تحویل بدهند
  c.vision = !CAP_NO_VISION.test(name);
  if(cat == "chat"){ c.research = true; c.image = CAP_IMG_CHAT.test(name); }
  else if(cat == "code"){ c.research = CAP_CODE_WEB.test(name); }
  return c;                                               // متن‌باز خام: بدون وب و بدون تصویر
}

function modelInfo(name){
  const k = name.toLowerCase();
  let cat = IMG.test(name) ? "img" : CODE_SET.has(name) ? "code" : CHAT_SET.has(name) ? "chat" : "oss";
  if(cat == "oss" && /code/i.test(name)) cat = "code";
  const hit = THEMES.find(t => k.includes(t[0]));
  const th = hit ? hit[1] : CATTH[cat];
  const sp = SP.find(s => k.includes(s[0]));
  const samples = (sp ? sp[1] : SAMPLES[cat]).slice(0,4);
  const greet = th.greet || ({img:"چه تصویری برات بسازم؟",code:"کدوم پروژه رو شروع کنیم؟"}[cat]) || "امروز چه کمکی از من برمیاد؟";
  const ph = th.ph || (cat == "img" ? "توضیح تصویر را بنویس…" : cat == "code" ? "سؤال یا کد خودت را بفرست…" : "پیام به " + name);
  return {cat, th, samples, greet, ph, ini: name[0].toUpperCase(), caps: capsOf(name, cat)};
}
