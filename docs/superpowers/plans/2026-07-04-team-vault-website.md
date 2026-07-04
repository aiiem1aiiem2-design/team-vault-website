# team-vault 소개 웹사이트 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 스펙(`docs/superpowers/specs/2026-07-04-team-vault-website-design.md`)대로 team-vault 소개 상호작용 원페이지를 만들어 Vercel에 공개 배포하고, Brain Trinity에 기록 노트를 남긴다.

**Architecture:** 의존성 0 정적 사이트 4파일(index.html / styles.css / data.js / main.js). 콘텐츠는 전부 data.js 배열, 인터랙션은 vanilla JS(IntersectionObserver + canvas), 애니메이션은 CSS transform/opacity만.

**Tech Stack:** HTML/CSS/vanilla JS, canvas 2D, Vercel 정적 배포, gh CLI. 개발 검증용만 `python -m http.server`(로컬)·npx lighthouse(배포 후).

## Global Constraints (스펙에서 발췌 — 모든 태스크에 적용)

- 저장소: `<프로젝트 폴더>`, 작업 브랜치 **feat/site-v1** (master 직접 금지 — 하네스 규칙)
- **push·배포는 사용자 승인 후에만** (하네스 규칙 — T8에서 승인 게이트)
- 외부 의존성 0 (CDN·npm 패키지·외부 폰트·외부 이미지 금지). 폰트=시스템 스택
- 성능 예산: **JS < 80KB, CSS < 25KB** (개정: 실측 반영 상향) (gzip 전 원본 기준으로도 지향)
- 애니메이션: `transform`/`opacity`만. 스크롤 핸들러 금지 → IntersectionObserver
- 접근성: 모든 인터랙션 키보드 가능, 포커스 스타일 명시, `prefers-reduced-motion` 시 canvas·전환 애니메이션 정지
- 공개 안전: team-vault private repo URL·팀원 실명(성민혁 제외)·고객 정보 금지. 데모 데이터는 가짜
- 카피는 전부 한국어. 시스템 호칭 "team-vault"는 `data.js`의 `SITE.name` 상수만 사용(하드코딩 금지)
- 커밋: Conventional Commits, 귀속 표시 없음, 로컬 커밋만(push는 T8 승인 후)
- ⚠️ 디자인 품질: anti-template — 균일 카드 그리드·중앙정렬 히어로+블롭 금지. 시각 폴리시는 토큰 체계 안에서 구현자 재량이되 아래 코드 계약(구조·동작)은 준수

## File Structure

```
team-vault-website/
├── index.html        # 7섹션 시맨틱 뼈대 (T1) → 섹션 내용 (T2~T6)
├── styles.css        # 디자인 토큰 + 섹션 스타일 (T1~T7)
├── data.js           # 전체 콘텐츠 데이터 (T1에서 완성 — 이후 태스크는 읽기만)
├── main.js           # 인터랙션 6종 (T2~T6)
├── vercel.json       # (T8) cleanUrls
└── docs/superpowers/ # 스펙·계획 (기존)
```

**컨트롤러 시각 게이트**: T2 후(히어로), T5 후(데모), T7 후(전체 반응형) — 컨트롤러가 브라우저 스크린샷으로 직접 검수. 구현자는 구조·콘솔에러 0·예산만 자체 검증.

---

### Task 1: 뼈대 4파일 + 디자인 토큰 + data.js 전체 콘텐츠

**Files:**
- Create: `index.html`, `styles.css`, `data.js`, `main.js`

**Interfaces:**
- Produces: `window.TV = { SITE, FOLDERS, BOUNDARY, ONBOARDING, DEMO_HINTS, PROJECTS, FOOTER }` (data.js — 이후 모든 태스크가 소비), 섹션 id 7종(`#hero #problem #structure #demo #onboarding #next #footer`), CSS 토큰(아래 값 그대로)

- [ ] **Step 1: `index.html` 뼈대** — 시맨틱 구조, 각 섹션은 셸만(내용은 T2~T6):

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>team-vault — 팀의 기억을 하나의 볼트로</title>
  <meta name="description" content="흩어진 팀의 기록을 옵시디언 볼트 하나로 모으는 팀 운영 시스템, team-vault를 소개합니다.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header id="hero" aria-labelledby="hero-heading">
    <canvas id="graph-canvas" aria-hidden="true"></canvas>
    <div class="hero-inner"><!-- T2 --></div>
  </header>
  <main>
    <section id="problem" aria-labelledby="problem-heading"><!-- T3 --></section>
    <section id="structure" aria-labelledby="structure-heading"><!-- T4 --></section>
    <section id="demo" aria-labelledby="demo-heading"><!-- T5 --></section>
    <section id="onboarding" aria-labelledby="onboarding-heading"><!-- T6 --></section>
    <section id="next" aria-labelledby="next-heading"><!-- T6 --></section>
  </main>
  <footer id="footer"><!-- T6 --></footer>
  <script src="data.js"></script>
  <script src="main.js"></script>
</body>
</html>
```

- [ ] **Step 2: `styles.css` 디자인 토큰** (파일 최상단 — 이 값 그대로):

```css
:root {
  /* 잉크 & 표면 */
  --bg: #0b0a12;
  --bg-elev: #14121f;
  --bg-card: #1a1726;
  --line: #2c2740;
  /* 텍스트 */
  --text: #ece9f8;
  --text-dim: #9b93b8;
  /* 오로라 팔레트 (그라데이션 소재) */
  --violet: #a78bfa;
  --purple: #7c3aed;
  --indigo: #4f46e5;
  --cyan: #22d3ee;
  --grad-aurora: linear-gradient(115deg, var(--purple), var(--indigo) 45%, var(--cyan));
  --grad-text: linear-gradient(90deg, var(--violet), var(--cyan));
  /* 타이포 스케일 (위계 대비 크게) */
  --text-hero: clamp(2.6rem, 1.2rem + 6vw, 6rem);
  --text-h2: clamp(1.6rem, 1rem + 2.5vw, 2.6rem);
  --text-base: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  /* 리듬 */
  --space-section: clamp(5rem, 3rem + 8vw, 11rem);
  --radius: 14px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --dur: 500ms;
}
html { scroll-behavior: smooth; }
* { box-sizing: border-box; }
body { margin: 0; background: var(--bg); color: var(--text);
  font-family: "Pretendard Variable", "Apple SD Gothic Neo", "Segoe UI", "Malgun Gothic", system-ui, sans-serif;
  font-size: var(--text-base); line-height: 1.7; overflow-x: hidden; }
:focus-visible { outline: 2px solid var(--cyan); outline-offset: 3px; border-radius: 4px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 3: `data.js` 전체 콘텐츠** (이 내용 그대로 — 카피 확정본):

```js
window.TV = {
  SITE: {
    name: "team-vault",
    tagline: "흩어진 팀의 기억을, 하나의 볼트로",
    sub: "카톡·머릿속·회의 스크롤에 흩어지던 팀의 기록을 옵시디언 볼트 하나에 모으는 팀 운영 시스템",
    author: "성민혁"
  },
  SCATTER: ["회의 때 정한 마감이 카톡 스크롤 속으로", "\"그 파일 어디 있어?\"", "담당자가 누구였는지 아무도 모름",
    "지난달 결정을 다시 토론", "아이디어가 머릿속에서 증발", "새 팀원에게 설명할 문서가 없음"],
  FOLDERS: [
    { name: "00-Dashboard", desc: "홈 대시보드 — 프로젝트 현황·마감·태스크 보드가 자동 집계된다" },
    { name: "05-Inbox", desc: "규칙 없는 던지기 구역. 아무렇게나 넣으면 AI가 정규 노트로 변환한다" },
    { name: "10-Projects", desc: "프로젝트별 폴더. 태스크 1개 = 노트 1개" },
    { name: "15-People", desc: "팀원 명부 — 담당자 표기의 단일 기준" },
    { name: "20-Meetings", desc: "회의록. 회의 후 24시간 내 등재가 규칙" },
    { name: "30-Decisions", desc: "팀·사업 결정 로그 — \"왜 그렇게 했는지\"가 남는다" },
    { name: "40-Knowledge", desc: "팀이 재사용할 도메인 지식" },
    { name: "50-Directory", desc: "외부 파트너·기관 연락처 (최소 수집 원칙)" },
    { name: "90-Archive", desc: "끝난 것들의 무덤 — 대시보드에서는 자동 제외" }
  ],
  BOUNDARY: "개인 기록은 개인 볼트에, 코드 결정은 코드 저장소에, 팀의 기억만 여기에.",
  DEMO_HINTS: { title: "제주 확장 리서치", owner: "민혁", days: 7 },
  ONBOARDING: [
    { level: "L0", time: "0분", who: "전원", what: "주간 요약을 메신저로 받아보기만 해도 된다" },
    { level: "L1", time: "첫 주", who: "전원", what: "인박스에 던지기만 — 규칙은 \"아무렇게나\" 하나뿐" },
    { level: "L2", time: "필요한 사람", who: "태스크 담당자", what: "옵시디언 설치, 내 태스크 상태 바꾸기 (30분 페어 세션)" },
    { level: "L3", time: "자율", who: "파워유저", what: "속성 직접 편집, 대시보드 필터 활용" }
  ],
  ONBOARDING_NOTE: "전원이 L2까지 갈 필요 없다 — 절반이 L1에 머물러도 시스템은 굴러간다.",
  PROJECTS: [
    { status: "wip", name: "Vault Starter", desc: "내 상황에 맞는 옵시디언 볼트를 처음부터 구성해주는 개인 맞춤 시작 키트", link: null }
    /* 완성 시: { status: "live", name, desc, link } 추가 → 카드 자동 생성 */
  ],
  FOOTER: {
    stack: "Obsidian(코어 Bases) · obsidian-git · GitHub · 순수 HTML/CSS/JS (의존성 0)",
    principles: ["진실은 frontmatter에", "마찰은 AI가 흡수한다", "볼트에 없으면 일어나지 않은 일"],
    credit: "설계·구축 — 성민혁, 2026"
  }
};
```

- [ ] **Step 4: `main.js` 스캐폴드**:

```js
"use strict";
const TV = window.TV;
const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const onEnter = (el, cb, opt = { threshold: 0.25 }) => {
  const io = new IntersectionObserver((es) => es.forEach(e => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } }), opt);
  io.observe(el);
};
// T2: initGraph()  T3: initScatter()  T4: initTree()  T5: initDemo()  T6: initTabs(), initProjects(), initFooter()
```

- [ ] **Step 5: 검증** — 로컬 서버로 열어 빈 섹션 7개·콘솔 에러 0 확인:

```bash
cd "<프로젝트 폴더>" && python -m http.server 8931 &
sleep 1 && curl -s http://localhost:8931/ | grep -c "<section\|<header\|<footer"   # Expected: 7
```

- [ ] **Step 6: Commit** — `git add index.html styles.css data.js main.js && git commit -m "feat: 뼈대 4파일 + 디자인 토큰 + 콘텐츠 데이터"`

---

### Task 2: Hero — 오로라 그라데이션 + 마우스 반응 그래프 canvas

**Files:**
- Modify: `index.html`(hero-inner), `styles.css`(hero), `main.js`(initGraph)

**Interfaces:**
- Consumes: `TV.SITE`, `#graph-canvas`, 토큰 `--grad-aurora`/`--grad-text`
- Produces: `initGraph()` — reduced-motion·문서 숨김 시 정지

- [ ] **Step 1: hero-inner 마크업** — 좌측 정렬(중앙정렬 템플릿 금지):

```html
<div class="hero-inner">
  <p class="hero-kicker">TEAM OPERATING SYSTEM ON OBSIDIAN</p>
  <h1 id="hero-heading"><span class="grad-text" data-site-name></span></h1>
  <p class="hero-tagline" data-site-tagline></p>
  <p class="hero-sub" data-site-sub></p>
  <a class="hero-cta" href="#demo">어떻게 굴러가는지 직접 해보기 ↓</a>
</div>
```
(main.js에서 `data-site-*` 속성에 TV.SITE 값 주입 — 하드코딩 금지 계약)

- [ ] **Step 2: hero CSS** — 오로라는 배경 고정 레이어 2장(blur된 radial-gradient, `transform`으로 느리게 drift하는 keyframes 60s/90s), `.grad-text { background: var(--grad-text); -webkit-background-clip: text; color: transparent; }`. 캔버스는 hero 전면 absolute, hero-inner가 위 레이어.

- [ ] **Step 3: `initGraph()` 구현** (이 코드 기반 — 동작 계약):

```js
function initGraph() {
  const cv = document.getElementById("graph-canvas"), ctx = cv.getContext("2d");
  let W, H, raf = null; const N = 28, LINK_D = 150, MOUSE_D = 180;
  const nodes = Array.from({ length: N }, () => ({
    x: Math.random(), y: Math.random(),
    vx: (Math.random() - .5) * .0005, vy: (Math.random() - .5) * .0005, r: 1.5 + Math.random() * 2 }));
  const mouse = { x: -1, y: -1 };
  function resize() { W = cv.width = cv.offsetWidth * devicePixelRatio; H = cv.height = cv.offsetHeight * devicePixelRatio; }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const n of nodes) {
      n.x = (n.x + n.vx + 1) % 1; n.y = (n.y + n.vy + 1) % 1;
      const px = n.x * W, py = n.y * H;
      const md = Math.hypot(px - mouse.x, py - mouse.y);
      const near = md < MOUSE_D * devicePixelRatio;
      for (const m of nodes) {
        const qx = m.x * W, qy = m.y * H, d = Math.hypot(px - qx, py - qy);
        if (d < LINK_D * devicePixelRatio && d > 0) {
          ctx.strokeStyle = near ? "rgba(167,139,250,.35)" : "rgba(167,139,250,.10)";
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(qx, qy); ctx.stroke();
        }
      }
      ctx.fillStyle = near ? "#22d3ee" : "#7c6cc4";
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
```

- [ ] **Step 4: 자체 검증** — 콘솔 에러 0, JS 파일 크기 확인(`wc -c main.js` < 80000)
- [ ] **Step 5: Commit** — `git commit -m "feat: Hero 오로라 그라데이션 + 마우스 반응 그래프"`
- [ ] **Step 6: 컨트롤러 시각 게이트 ①** — 컨트롤러가 브라우저 스크린샷으로 히어로 품질 검수 (템플릿 냄새·그라데이션·그래프 반응)

---

### Task 3: 섹션② 문제 — 흩어진 메모가 정렬되는 스크롤 연출

**Files:**
- Modify: `index.html`(#problem), `styles.css`, `main.js`(initScatter)

**Interfaces:**
- Consumes: `TV.SCATTER`(6개 문자열), `onEnter()`
- Produces: `.scatter-note` 요소들 — 초기엔 각자 랜덤 rotate/translate(CSS 커스텀 속성 `--rx --ry --rr`), `#problem`이 뷰포트 진입 시 `.settled` 클래스 → transform 0으로 수렴(transition `--dur var(--ease)`, 노트별 `transition-delay` 60ms 계단)

- [ ] **Step 1: 마크업+JS** — `TV.SCATTER`를 `.scatter-note` 카드로 렌더(내용은 손글씨 메모 느낌), 마지막에 정렬 후 나타나는 캡션 `<p class="settle-caption">team-vault는 이걸 전부 한 곳에, 같은 형식으로 받는다</p>`
- [ ] **Step 2: CSS** — 초기 상태 `transform: translate(var(--rx), var(--ry)) rotate(var(--rr)); opacity:.85`, `.settled`에서 `transform:none; opacity:1`. reduced-motion이면 처음부터 정렬 상태
- [ ] **Step 3: 검증** — 로컬 서버에서 스크롤 시 1회만 발동(IntersectionObserver unobserve), 콘솔 0
- [ ] **Step 4: Commit** — `git commit -m "feat: 문제 섹션 — 메모 정렬 스크롤 연출"`

---

### Task 4: 섹션③ 구조 — 클릭형 폴더 트리 + 경계 한 줄

**Files:**
- Modify: `index.html`(#structure), `styles.css`, `main.js`(initTree)

**Interfaces:**
- Consumes: `TV.FOLDERS`(9항목), `TV.BOUNDARY`
- Produces: 좌 트리(버튼 목록) / 우 설명 카드 2열 레이아웃(모바일 1열 — 트리 아래 카드)

- [ ] **Step 1: 마크업 계약** — 트리는 `<ul role="list">` 안 `<button class="tree-item" aria-expanded>` (li당 1버튼), 설명 카드는 `<div id="tree-detail" role="region" aria-live="polite">`. 클릭·Enter 시 해당 desc 표시 + 버튼 active 스타일. 첫 항목 기본 선택
- [ ] **Step 2: JS** — 이벤트 위임 1개, `renderDetail(folder)` 함수. 카드 전환은 opacity/translateY 마이크로 트랜지션
- [ ] **Step 3: CSS** — 트리 항목 호버 시 그라데이션 보더(`border-image` 대신 background 2겹 트릭: `background: linear-gradient(var(--bg-card),var(--bg-card)) padding-box, var(--grad-aurora) border-box; border:1px solid transparent`)
- [ ] **Step 4: 검증** — Tab→Enter만으로 9개 폴더 전부 열람 가능, aria-live로 내용 갱신
- [ ] **Step 5: Commit** — `git commit -m "feat: 구조 섹션 — 키보드 가능 폴더 트리"`

---

### Task 5: 섹션④ 라이브 데모 ★ — 입력→frontmatter 타이핑→대시보드 착지

**Files:**
- Modify: `index.html`(#demo), `styles.css`, `main.js`(initDemo)

**Interfaces:**
- Consumes: `TV.DEMO_HINTS`, 토큰
- Produces: 3단 흐름 UI — [폼] → [코드 패널] → [대시보드 표]. 상태기계 `idle → typing → landing → done`(done에서 "다시 해보기" 리셋)

- [ ] **Step 1: 마크업** — 폼(제목 text·담당 text·마감 date, 값 비면 DEMO_HINTS로 대체), `<pre id="fm-code" aria-live="polite">`, `<table id="demo-board">`(빈 tbody + 헤더 제목/담당/마감/상태). 폼 아래 힌트: "아무 값이나 — 전부 브라우저 안 시뮬레이션입니다"
- [ ] **Step 2: `initDemo()` 핵심 로직** (이 코드 기반):

```js
function initDemo() {
  const form = document.getElementById("demo-form"), code = document.getElementById("fm-code"),
        tbody = document.querySelector("#demo-board tbody"), btn = document.getElementById("demo-submit");
  let state = "idle";
  const today = new Date();
  const iso = d => d.toISOString().slice(0, 10);
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); if (state !== "idle") return; state = "typing";
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
```
⚠️ **XSS 계약**: 방문자 입력(title/owner/due)이 DOM에 들어가는 유일한 지점 — `textContent`로만 삽입한다. 이 사이트 전체에서 **innerHTML에 사용자 유래 값 사용 금지** (data.js 정적 콘텐츠 렌더는 허용).

- [ ] **Step 3: CSS** — 3단은 데스크톱 가로 흐름(화살표 연결), 모바일 세로. 코드 패널은 모노스페이스+보라 키워드 하이라이트(정적 span 아님 — textContent라 색은 패널 전체 톤으로)
- [ ] **Step 4: 검증** — ①빈 폼 제출=힌트값 작동 ②`<img src=x onerror=alert(1)>` 입력 시 문자 그대로 표에 표시(alert 안 뜸) ③키보드만으로 완주 ④reduced-motion=타이핑 생략 즉시 표시
- [ ] **Step 5: Commit** — `git commit -m "feat: 라이브 데모 — frontmatter 타이핑→대시보드 착지"`
- [ ] **Step 6: 컨트롤러 시각 게이트 ②** — 데모 흐름 스크린샷 검수

---

### Task 6: 섹션⑤⑥⑦ — 온보딩 탭 + 확장 슬롯 카드 + 각주

**Files:**
- Modify: `index.html`, `styles.css`, `main.js`(initTabs/initProjects/initFooter)

**Interfaces:**
- Consumes: `TV.ONBOARDING`(4), `TV.ONBOARDING_NOTE`, `TV.PROJECTS`(1 wip), `TV.FOOTER`
- Produces: WAI-ARIA 탭 패턴(`role="tablist/tab/tabpanel"`, 방향키 이동), projects 렌더 함수 `renderProjects()`(배열→카드, `status:"wip"`→"🚧 제작 중" 배지·링크 없음, `status:"live"`→링크 카드)

- [ ] **Step 1: 온보딩 탭** — tablist 가로(모바일 2×2), 패널에 who/time/what + NOTE는 섹션 하단 고정 문장. 방향키(←→)로 탭 이동, `aria-selected` 관리
- [ ] **Step 2: 확장 슬롯** — `renderProjects()`: PROJECTS.map → 카드. wip 카드는 은은한 대각 스트라이프 배경 + "🚧 제작 중" 배지. **검증 계약**: 배열에 `{status:"live",name:"테스트",desc:"x",link:"#"}` 임시 추가→카드 2장 확인→제거 (성공 기준 5)
- [ ] **Step 3: 각주** — stack 한 줄, principles 3개(호버 시 보라 하이라이트), credit. `<a>` 없음(외부 링크 없음)
- [ ] **Step 4: 검증** — 탭 키보드 완주, 임시 live 카드 테스트, 콘솔 0
- [ ] **Step 5: Commit** — `git commit -m "feat: 온보딩 탭 + 확장 슬롯(projects 배열 렌더) + 각주"`

---

### Task 7: 반응형·접근성·reduced-motion 패스

**Files:**
- Modify: `styles.css`(미디어쿼리 정비), 필요 시 `index.html`(aria 보강)

- [ ] **Step 1: 브레이크포인트 정비** — 320/375/768/1024/1440/1920 기준: 히어로 타이포 clamp 확인, 구조 2열→1열(<900px), 데모 가로→세로(<900px), 탭 2×2(<600px). **모든 폭에서 가로 스크롤 0** (`html,body{overflow-x:hidden}`은 응급처치 — 원인 요소를 고칠 것, canvas·pre가 주범 후보)
- [ ] **Step 2: 접근성 패스** — 헤딩 계층(h1 1개→h2 섹션별), 대비 스팟체크(--text-dim vs --bg-card 4.5:1 이상 — 미달 시 #a89fc6로 상향), 포커스 순서 = 시각 순서, `aria-hidden` canvas
- [ ] **Step 3: reduced-motion 전수** — OS 설정 켜고: 그래프 정지(1프레임), 정렬 즉시완료, 타이핑 생략, 탭 전환 즉시. 콘텐츠 누락 0
- [ ] **Step 4: 예산 확인** — `wc -c styles.css main.js data.js index.html` → CSS<25KB (개정: 실측 반영 상향), JS 합<80KB
- [ ] **Step 5: Commit** — `git commit -m "fix: 반응형·접근성·reduced-motion 패스"`
- [ ] **Step 6: 컨트롤러 시각 게이트 ③** — 320/768/1440 스크린샷 전수 검수

---

### Task 8: GitHub public repo + Vercel 배포 (⚠️ 사용자 승인 게이트)

**Files:**
- Create: `vercel.json`, `README.md`

- [ ] **Step 1: `vercel.json`** — `{ "cleanUrls": true }`
- [ ] **Step 2: `README.md`** — 프로젝트 한 줄 소개 + "의존성 0 정적 사이트" + 로컬 실행법 2줄 (public repo이므로 내부 경로·private 정보 없음 재확인)
- [ ] **Step 3: 공개 안전 최종 grep** — 배포 대상 파일(index.html styles.css data.js main.js README.md)에서 개인 식별 정보(로컬 사용자명·로컬 절대경로 패턴·busan-chemi.vercel·team-vault.git) 노출 0건 확인 (author "성민혁"은 허용)
- [ ] **Step 4: 로컬 커밋** — `git add vercel.json README.md && git commit -m "chore: 배포 설정 + README"`
- [ ] **Step 5: ⚠️사용자 승인 요청** — "public repo 생성 + push + Vercel 배포 진행?" 승인 후에만:

```bash
gh repo create team-vault-website --public --source=. --remote=origin
git push -u origin feat/site-v1
git checkout master 2>/dev/null || git checkout -b master && git merge feat/site-v1 && git push -u origin master
npx vercel --prod --yes   # 또는 Vercel 대시보드 GitHub 연동 (사용자 선택)
```
- [ ] **Step 6: 배포 검증** — 공개 URL curl 200 + 원격 `git log origin/master` 확인 (로컬≠원격 규칙)

---

### Task 9: 배포 후 실측 검증

- [ ] **Step 1: Lighthouse** — `npx lighthouse <배포URL> --only-categories=performance,accessibility --quiet --chrome-flags="--headless"` → 성능·접근성 90+ (미달 항목은 수정 커밋)
- [ ] **Step 2: 컨트롤러 최종 검수** — 배포 URL을 실브라우저로 열어 상호작용 6종 + 성공 기준 1~5 대조
- [ ] **Step 3: 결과 기록** — 점수·URL을 커밋 메시지 또는 README 배지로

---

### Task 10: Brain Trinity 기록 노트

**Files:**
- Create: Brain Trinity 볼트 내 노트 (정확한 위치는 볼트 규칙 확인 후)

- [ ] **Step 1: 볼트 규칙 읽기** — `<개인 지식 볼트>\CLAUDE.md`·`AGENTS.md` 읽고 노트 위치(0_raw 인제스트 vs 1_지식 직접)·frontmatter 스키마 결정
- [ ] **Step 2: 노트 작성** — 내용: team-vault가 뭔지(3문단), 왜 이렇게 설계했는지(Bases 채택·3-시스템 경계·인박스 철학), 사용법 요약(온보딩 L0~L3), **웹사이트 URL**, team-vault 볼트 위치. 볼트 스키마 준수
- [ ] **Step 3: 린트/검증** — 볼트에 wiki-lint 동작이 있으면 실행, 없으면 frontmatter 스키마 육안 대조
- [ ] **Step 4: 커밋** — Brain Trinity 볼트의 git 규칙 확인 후 커밋(자동 push 설정 여부 확인)

---

## Self-Review 결과

- **스펙 커버리지**: §1 산출물2종=T1~9/T10, §3 디자인방향=T1토큰·T2오로라, §4 7섹션=T2~T6, 확장슬롯=T6(+검증 계약), §5 기술=T1~T7(예산 T7), §6 공개안전=T8 Step3 grep, §7 저장·배포=T8, §8 성공기준 1·4=T7, 2=T5, 3=T9, 5=T6·T9, 6=T10 ✓
- **플레이스홀더**: 없음 (시각 폴리시 재량은 명시적 계약 — 코드 계약과 분리)
- **타입 일관성**: `TV.*` 키가 T1 정의와 T2~T6 소비 일치, 섹션 id 7종 일치, `initGraph/initScatter/initTree/initDemo/initTabs/initProjects/initFooter` 명명 일관 ✓
