"use strict";
(function () {
  if (sessionStorage.getItem("tv_access")) { location.replace("intro.html"); return; }
  const form = document.getElementById("gate-form");
  const input = document.getElementById("gate-input");
  const status = document.getElementById("gate-status");
  const box = document.querySelector(".gate-box");
  const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const codes = (window.ACCESS_CODES || []).map((c) => String(c).trim().toUpperCase());
  input.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim().toUpperCase();
    if (val && codes.includes(val)) {
      sessionStorage.setItem("tv_access", "1");
      location.assign("intro.html");
    } else {
      status.textContent = "코드를 확인해 주세요.";
      if (!prefersReduced) { box.classList.remove("shake"); void box.offsetWidth; box.classList.add("shake"); }
      input.select();
    }
  });
})();
