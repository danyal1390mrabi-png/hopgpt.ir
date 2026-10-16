// auth.js — محافظ ورود. در <head> همهٔ صفحه‌های محافظت‌شده قبل از بقیهٔ اسکریپت‌ها قرار می‌گیرد.
(function () {
  const token = localStorage.getItem("hop_token");
  if (!token) { location.replace("login.html"); return; }

  // به هر درخواست مربوط به Worker هدر Authorization اضافه می‌شود؛ کد چت نیازی به تغییر ندارد.
  const origFetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    init = init || {};
    const url = typeof input === "string" ? input : input.url;
    const guarded = /\/web\/(chat|image|fetch)(\?|$)/.test(url);
    if (guarded) init.headers = Object.assign({}, init.headers || {}, { authorization: "Bearer " + token });
    const res = await origFetch(input, init);
    if (guarded && res.status === 401) {
      localStorage.removeItem("hop_token");
      localStorage.removeItem("hop_user");
      location.replace("login.html");
    }
    return res;
  };

  window.hopLogout = function () {
    localStorage.removeItem("hop_token");
    localStorage.removeItem("hop_user");
    location.replace("login.html");
  };
})();
