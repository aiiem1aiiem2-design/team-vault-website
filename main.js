"use strict";
const TV = window.TV;
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const onEnter = (el, cb, opt = { threshold: 0.25 }) => {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), opt);
  io.observe(el);
};
function injectSiteText() {
  const map = { "data-site-name": TV.SITE.name, "data-site-tagline": TV.SITE.tagline, "data-site-sub": TV.SITE.sub };
  for (const [attr, value] of Object.entries(map)) {
    document.querySelectorAll(`[${attr}]`).forEach(el => { el.textContent = value; });
  }
}
injectSiteText();

function initGraph() {
  const cv = document.getElementById("graph-canvas"), ctx = cv.getContext("2d");
  let W, H, raf = null; const N = 28, LINK_D = 150, MOUSE_D = 180;
  const nodes = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .0005, vy: (Math.random() - .5) * .0005, r: 1.5 + Math.random() * 2 }));
  const mouse = { x: -Infinity, y: -Infinity };
  function resize() {
    W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio;
    if (prefersReduced) { tick(); cancelAnimationFrame(raf); }
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x = (n.x + n.vx + 1) % 1; n.y = (n.y + n.vy + 1) % 1;
    }
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      const px = n.x * W, py = n.y * H;
      const nNear = Math.hypot(px - mouse.x, py - mouse.y) < MOUSE_D * devicePixelRatio;
      for (let j = i + 1; j < nodes.length; j++) {
        const m = nodes[j];
        const qx = m.x * W, qy = m.y * H, d = Math.hypot(px - qx, py - qy);
        if (d < LINK_D * devicePixelRatio && d > 0) {
          const mNear = Math.hypot(qx - mouse.x, qy - mouse.y) < MOUSE_D * devicePixelRatio;
          ctx.strokeStyle = (nNear || mNear) ? "rgba(167,139,250,.35)" : "rgba(167,139,250,.10)";
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
        }
      }
      ctx.fillStyle = nNear ? "#22d3ee" : "#7c6cc4";
      ctx.beginPath(); ctx.arc(px, py, n.r * devicePixelRatio, 0, 7); ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }
  resize(); addEventListener("resize", resize);
  cv.parentElement.addEventListener("pointermove", e => { const r = cv.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * devicePixelRatio; mouse.y = (e.clientY - r.top) * devicePixelRatio; });
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else if (!prefersReduced) tick(); });
  if (prefersReduced) { tick(); cancelAnimationFrame(raf); } else tick();  // reduced: 1프레임만 그리고 정지
}
initGraph();

function initScatter() {
  const field = document.querySelector("#problem .scatter-field");
  if (!field) return;
  TV.SCATTER.forEach((text, i) => {
    const note = document.createElement("div");
    note.className = "scatter-note";
    note.textContent = text;
    note.style.transitionDelay = `${i * 60}ms`;
    if (!prefersReduced) {
      note.style.setProperty("--rx", `${(Math.random() * 80 - 40).toFixed(1)}px`);
      note.style.setProperty("--ry", `${(Math.random() * 120 - 60).toFixed(1)}px`);
      note.style.setProperty("--rr", `${(Math.random() * 14 - 7).toFixed(1)}deg`);
    }
    field.appendChild(note);
  });
  if (prefersReduced) { field.classList.add("settled"); return; } // reduced: 랜덤 오프셋 생략 → 처음부터 정렬 상태
  onEnter(document.getElementById("problem"), () => {
    field.classList.add("settled");
    // 노트별 계단 지연(최대 6*60ms) 종료 후 인라인 transitionDelay 제거 → hover가 지연 없이 반응
    setTimeout(() => {
      field.querySelectorAll(".scatter-note").forEach(note => { note.style.transitionDelay = ""; });
    }, 6 * 60 + 500);
  });
}
initScatter();

function initTree() {
  const list = document.querySelector("#structure .tree-list");
  const detail = document.getElementById("tree-detail");
  if (!list || !detail) return;

  TV.FOLDERS.forEach((folder, i) => {
    const [num, ...rest] = folder.name.split("-");
    const li = document.createElement("li");
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tree-item";
    btn.dataset.index = String(i);
    btn.setAttribute("aria-current", i === 0 ? "true" : "false");
    btn.setAttribute("aria-controls", "tree-detail");
    const numEl = document.createElement("span");
    numEl.className = "tree-num";
    numEl.textContent = num;
    const nameEl = document.createElement("span");
    nameEl.className = "tree-name";
    nameEl.textContent = rest.join("-");
    btn.append(numEl, nameEl);
    li.appendChild(btn);
    list.appendChild(li);
  });

  function renderDetail(folder) {
    const nameEl = detail.querySelector(".tree-detail-name");
    const descEl = detail.querySelector(".tree-detail-desc");
    if (nameEl) nameEl.textContent = folder.name;
    if (descEl) descEl.textContent = folder.desc;
    if (!prefersReduced) {
      detail.classList.remove("is-animating");
      void detail.offsetWidth; // reflow: 매 갱신마다 카드 전환 애니메이션 재시작
      detail.classList.add("is-animating");
    }
  }

  // 이벤트 위임 1개: ul에서 클릭을 받아 어떤 tree-item 버튼인지 판별
  // (Enter/Space는 button 기본 동작으로 click을 발생시키므로 별도 keydown 처리 불필요)
  list.addEventListener("click", (e) => {
    const btn = e.target.closest(".tree-item");
    if (!btn || !list.contains(btn)) return;
    const folder = TV.FOLDERS[Number(btn.dataset.index)];
    if (!folder) return;
    list.querySelectorAll(".tree-item").forEach(item => {
      item.setAttribute("aria-current", item === btn ? "true" : "false");
    });
    renderDetail(folder);
  });

  const boundaryEl = document.querySelector("#structure [data-boundary]");
  if (boundaryEl) boundaryEl.textContent = TV.BOUNDARY;

  renderDetail(TV.FOLDERS[0]);
}
initTree();

function initDemo() {
  const form = document.getElementById("demo-form"), code = document.getElementById("fm-code"),
        tbody = document.querySelector("#demo-board tbody"), btn = document.getElementById("demo-submit");
  if (!form || !code || !tbody || !btn) return;
  let state = "idle";
  const today = new Date();
  const iso = d => d.toISOString().slice(0, 10);
  // 힌트 placeholder: title/owner는 정적 힌트값, due는 "오늘 + DEMO_HINTS.days"를 계산해 노출
  form.title.placeholder = TV.DEMO_HINTS.title;
  form.owner.placeholder = TV.DEMO_HINTS.owner;
  form.due.placeholder = iso(new Date(today.getTime() + TV.DEMO_HINTS.days * 864e5));
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (state === "done") { state = "idle"; btn.textContent = "태스크 만들기"; return; } // "다시 해보기" 클릭 → 리셋만(폼 값은 유지)
    if (state !== "idle") return; state = "typing";
    const title = form.title.value.trim() || TV.DEMO_HINTS.title;
    const owner = form.owner.value.trim() || TV.DEMO_HINTS.owner;
    const due = form.due.value || iso(new Date(today.getTime() + TV.DEMO_HINTS.days * 864e5));
    const fm = `---\nschema: 1\ntype: task\ntitle: ${title}\nowner: ${owner}\nstatus: todo\ndue: ${due}\n---`;
    code.textContent = "";
    if (prefersReduced) { code.textContent = fm; } else {
      for (const ch of fm) { code.textContent += ch; await new Promise(r => setTimeout(r, 18)); }
    }
    state = "landing";
    const tr = document.createElement("tr");
    for (const val of [title, owner, due]) {               // 방문자 입력 → 반드시 textContent (innerHTML 금지)
      const td = document.createElement("td"); td.textContent = val; tr.appendChild(td);
    }
    const tdStatus = document.createElement("td"), chip = document.createElement("span");
    chip.className = "chip"; chip.textContent = "todo"; tdStatus.appendChild(chip); tr.appendChild(tdStatus);
    tr.classList.add("fly-in"); tbody.prepend(tr);          // CSS: fly-in = translateY(24px)+opacity 0 → none
    requestAnimationFrame(() => tr.classList.add("landed"));
    state = "done"; btn.textContent = "다시 해보기";
    form.addEventListener("input", () => { if (state === "done") { state = "idle"; btn.textContent = "태스크 만들기"; } }, { once: true });
  });
}
initDemo();

function initTabs() {
  const tablist = document.querySelector("#onboarding .onboarding-tablist");
  const panelsWrap = document.querySelector("#onboarding .onboarding-panels");
  const noteEl = document.querySelector("#onboarding [data-onboarding-note]");
  if (!tablist || !panelsWrap) return;

  const tabs = [];
  const panels = [];

  TV.ONBOARDING.forEach((step, i) => {
    const tabId = `onboarding-tab-${i}`;
    const panelId = `onboarding-panel-${i}`;

    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = "onboarding-tab";
    tab.id = tabId;
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", i === 0 ? "true" : "false");
    tab.setAttribute("aria-controls", panelId);
    tab.tabIndex = i === 0 ? 0 : -1;
    const levelEl = document.createElement("span");
    levelEl.className = "onboarding-tab-level";
    levelEl.textContent = step.level;
    const timeEl = document.createElement("span");
    timeEl.className = "onboarding-tab-time";
    timeEl.textContent = step.time;
    tab.append(levelEl, timeEl);
    tablist.appendChild(tab);
    tabs.push(tab);

    const panel = document.createElement("div");
    panel.className = "onboarding-panel";
    panel.id = panelId;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tabId);
    panel.tabIndex = 0;
    if (i !== 0) panel.hidden = true;
    const meta = document.createElement("p");
    meta.className = "onboarding-panel-meta";
    meta.textContent = `${step.who} · ${step.time}`;
    const what = document.createElement("p");
    what.className = "onboarding-panel-what";
    what.textContent = step.what;
    panel.append(meta, what);
    panelsWrap.appendChild(panel);
    panels.push(panel);
  });

  function selectTab(tab) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute("aria-selected", String(selected));
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(p => { p.hidden = p.id !== tab.getAttribute("aria-controls"); });
  }

  tablist.addEventListener("click", (e) => {
    const tab = e.target.closest(".onboarding-tab");
    if (!tab || !tablist.contains(tab)) return;
    selectTab(tab);
  });

  // 방향키(←→)로 탭 이동 + 포커스·선택 동시 갱신, Home/End는 처음/끝 탭 선택 (roving tabindex)
  tablist.addEventListener("keydown", (e) => {
    const activeIndex = tabs.indexOf(document.activeElement);
    let currentIndex = activeIndex !== -1 ? activeIndex : tabs.findIndex(t => t.getAttribute("aria-selected") === "true");
    if (currentIndex === -1) currentIndex = 0; // 방어: 활성 탭도 focus도 못 찾으면 첫 탭 기준
    let newIndex;
    switch (e.key) {
      case "ArrowRight": newIndex = (currentIndex + 1) % tabs.length; break;
      case "ArrowLeft": newIndex = (currentIndex - 1 + tabs.length) % tabs.length; break;
      case "Home": newIndex = 0; break;
      case "End": newIndex = tabs.length - 1; break;
      default: return;
    }
    e.preventDefault();
    selectTab(tabs[newIndex]);
    tabs[newIndex].focus();
  });

  if (noteEl) noteEl.textContent = TV.ONBOARDING_NOTE;
}
initTabs();

function renderProjects() {
  const grid = document.querySelector("#next .projects-grid");
  if (!grid) return;
  grid.textContent = "";
  TV.PROJECTS.forEach(project => {
    const isLive = project.status === "live";
    const card = document.createElement(isLive ? "a" : "div");
    card.className = `project-card project-card--${project.status}`;
    if (isLive) card.href = project.link;

    const name = document.createElement("h3");
    name.className = "project-name";
    name.textContent = project.name;
    const desc = document.createElement("p");
    desc.className = "project-desc";
    desc.textContent = project.desc;
    card.append(name, desc);

    if (!isLive) {
      const badge = document.createElement("span");
      badge.className = "project-badge";
      badge.textContent = "🚧 제작 중";
      card.appendChild(badge);
    }
    grid.appendChild(card);
  });
}

function initProjects() {
  renderProjects();
}
initProjects();

function initStart() {
  const leadEl = document.querySelector("#start [data-start-lead]");
  const stepsEl = document.querySelector("#start .start-steps");
  const ctaEl = document.querySelector("#start .start-cta");
  const repoEl = document.querySelector("#start .start-repo-link");
  if (!leadEl || !stepsEl || !ctaEl || !repoEl) return;
  leadEl.textContent = TV.START.lead;
  TV.START.steps.forEach(step => {
    const li = document.createElement("li");
    li.className = "start-step";
    const num = document.createElement("span");
    num.className = "start-step-num";
    num.textContent = step.num;
    const title = document.createElement("h3");
    title.className = "start-step-title";
    title.textContent = step.title;
    const desc = document.createElement("p");
    desc.className = "start-step-desc";
    desc.textContent = step.desc;
    li.append(num, title, desc);
    stepsEl.appendChild(li);
  });
  ctaEl.href = TV.START.cta.href;
  ctaEl.textContent = TV.START.cta.label;
  repoEl.href = TV.START.repo.href;
  repoEl.textContent = TV.START.repo.label;
}
initStart();

function initFooter() {
  const stackEl = document.querySelector("[data-footer-stack]");
  const principlesEl = document.querySelector(".footer-principles");
  const creditEl = document.querySelector("[data-footer-credit]");
  if (!stackEl || !principlesEl || !creditEl) return;
  stackEl.textContent = TV.FOOTER.stack;
  TV.FOOTER.principles.forEach(text => {
    const li = document.createElement("li");
    li.textContent = text;
    principlesEl.appendChild(li);
  });
  creditEl.textContent = TV.FOOTER.credit;
  const linksEl = document.querySelector(".footer-links");
  if (linksEl && TV.FOOTER.github) {
    const a = document.createElement("a");
    a.className = "footer-github";
    a.href = TV.FOOTER.github.href;
    a.rel = "noopener";
    a.textContent = TV.FOOTER.github.label;
    linksEl.appendChild(a);
  }
}
initFooter();
