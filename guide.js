"use strict";
const TVG = {
  INSTALL: [
    { title: "옵시디언 설치",
      body: "obsidian.md에서 내려받아 설치합니다. 무료이고 회원가입 없이 쓸 수 있습니다.",
      links: [{ label: "obsidian.md 열기", href: "https://obsidian.md" }] },
    { title: "템플릿 받기",
      body: "Git이 있으면 아래 명령 한 줄, 없으면 ZIP으로 받아 원하는 위치에 풉니다.",
      command: "git clone https://github.com/aiiem1aiiem2-design/team-vault-template.git my-team-vault",
      links: [{ label: "ZIP으로 내려받기", href: "https://github.com/aiiem1aiiem2-design/team-vault-template/archive/refs/heads/main.zip" }] },
    { title: "볼트로 열기",
      body: "옵시디언 실행 → \"폴더를 보관함으로 열기\" → 방금 받은 폴더를 선택합니다. 그 폴더가 팀의 볼트가 됩니다." },
    { title: "플러그인 신뢰",
      body: "\"커뮤니티 플러그인을 신뢰하시겠습니까?\"가 뜨면 신뢰를 선택합니다. 동봉된 obsidian-git이 켜집니다. 팀 동기화(GitHub 연결)는 저장소 README의 동기화 절을 따르세요." },
    { title: "첫 태스크 던지기",
      body: "05-Inbox/에 새 노트를 하나 만들어 아무렇게나 적어 보세요. 규칙은 \"아무렇게나\" 하나뿐 — 정리는 AI와 대시보드의 몫입니다." }
  ],
  USAGE: [
    { title: "인박스에 던지기",
      body: "무엇이든 05-Inbox/에 새 노트로 던집니다. 형식 자유 — 옵시디언이 없는 팀원은 메신저로 보내면 운영자·AI가 대신 넣습니다. 들어온 것은 AI가 라우팅 표에 따라 정규 노트로 바꿉니다." },
    { title: "태스크 = 노트 1개",
      body: "할 일 하나가 노트 하나입니다. 제목·담당·기한·상태는 노트 상단 속성(frontmatter)에 있고, 진실은 언제나 속성에 — 파일명은 사람이 읽는 라벨일 뿐입니다." },
    { title: "대시보드 읽기",
      body: "00-Dashboard/Home.md 하나만 열면 됩니다. 프로젝트 현황·마감 임박·태스크 보드가 자동 집계되어, 손으로 갱신할 표가 없습니다." },
    { title: "온보딩 L0~L3",
      body: "전원이 다 배울 필요 없습니다. L0는 주간 요약 수신(0분), L1은 인박스에 던지기(첫 주), L2는 내 태스크 상태 갱신(30분 페어 세션), L3는 속성 직접 편집(자율). 절반이 L1에 머물러도 시스템은 굴러갑니다." }
  ],
  PROMPTS: [
    { label: "인박스 정리", text: "05-Inbox에 쌓인 노트를 CLAUDE.md 라우팅 표에 따라 정규 노트로 정리해줘." },
    { label: "회의 후처리", text: "인박스의 회의 원문을 회의록으로 정리하고, 결정은 30-Decisions로 분리하고, 액션아이템은 태스크 노트로 만들어줘." },
    { label: "주간 점검", text: "이번 주에 만든 노트를 요약하고, 기한이 다가온 태스크와 owner가 비어 있는 노트를 알려줘." }
  ],
  SLACK: {
    lead: "슬랙과 볼트를 잇는 연동 4종은 설계 문서(런북)로 템플릿 저장소에 동봉되어 있습니다. 지금 구현된 코드가 아니라, 나중에 \"이 런북대로 적용해줘\" 한마디로 AI에게 위임하기 위한 문서입니다.",
    runbooks: [
      { order: "1/4", name: "slack-plan", tag: "전체 지도",
        desc: "슬랙 연동 전체의 계획서. 성숙한 기성 플러그인이 없다는 조사 결론 위에서, 서버 쪽 봇으로 세 연동을 순서대로 적용하는 지도입니다.",
        href: "https://github.com/aiiem1aiiem2-design/team-vault-template/blob/main/docs/integrations/slack-plan.md" },
      { order: "2/4", name: "slack-notify", tag: "볼트→슬랙 알림 · 1순위",
        desc: "볼트에 새 회의록·결정·태스크가 커밋되면 지정 채널에 자동 알림. 단방향이라 가장 쉽고, 나머지 두 연동의 전제라 항상 먼저 적용합니다.",
        href: "https://github.com/aiiem1aiiem2-design/team-vault-template/blob/main/docs/integrations/slack-notify.md" },
      { order: "3/4", name: "slack-capture", tag: "슬랙→볼트 캡처 · 2순위",
        desc: "중요한 슬랙 메시지에 📌 리액션을 달면 그 메시지가 05-Inbox 노트로 들어옵니다. 전체 대화가 아니라 지정한 메시지만 넘어옵니다.",
        href: "https://github.com/aiiem1aiiem2-design/team-vault-template/blob/main/docs/integrations/slack-capture.md" },
      { order: "4/4", name: "slack-query-bot", tag: "질의봇 · 3순위",
        desc: "슬랙에서 봇에게 물으면 볼트를 읽어 답합니다. 봇이 실행 권한을 갖는 만큼, 화이트리스트·권한 최소화 때문에 가장 신중하게·가장 늦게 적용합니다.",
        href: "https://github.com/aiiem1aiiem2-design/team-vault-template/blob/main/docs/integrations/slack-query-bot.md" }
    ],
    canonical: { label: "정본 문서 전체 보기 — docs/integrations",
      href: "https://github.com/aiiem1aiiem2-design/team-vault-template/tree/main/docs/integrations" }
  },
  STARTER: {
    lead: "team-vault가 팀의 기억을 위한 볼트라면, Vault Starter는 개인의 기록을 위한 시작 키트입니다. 옵시디언도 AI도 잘 몰라도 됩니다 — 던진다, 쌓인다, 문서가 되어 나온다. 이 3박자가 전부입니다.",
    notice: "Vault Starter는 무료지만 Claude Code 유료 구독(Pro 이상)이 필요합니다. 정리를 실행하면 볼트에 넣은 내용이 외부 LLM 서비스(Anthropic, 해외 서버)로 전송·처리됩니다 — 회사 기밀·타인의 개인정보는 넣기 전에 소속 조직의 승인을 확인하세요.",
    downloads: [
      { os: "Windows", label: "Windows용 zip 내려받기",
        href: "https://github.com/aiiem1aiiem2-design/vault-starter-kit/releases/download/v0.3/vault-starter-v0.3-windows.zip" },
      { os: "Mac", label: "Mac용 zip 내려받기",
        href: "https://github.com/aiiem1aiiem2-design/vault-starter-kit/releases/download/v0.3/vault-starter-v0.3-mac.zip" }
    ],
    steps: [
      { title: "내 OS에 맞는 zip 받기", body: "위 버튼에서 Windows판 또는 Mac판을 내려받습니다." },
      { title: "압축 풀기", body: "원하는 위치(예: 문서\\내볼트)에 풉니다. 푼 폴더를 열었을 때 !시작하세요.md가 바로 보이면 정상입니다." },
      { title: "옵시디언으로 열기", body: "옵시디언 실행 → \"폴더를 보관함으로 열기\" → 방금 푼 폴더 선택. 신뢰를 물으면 신뢰를 선택합니다." },
      { title: "시작 마법사 실행", body: "!시작하세요.md를 열고 안내를 따른 뒤, Claude Code에서 첫 명령 /시작하기 를 입력하면 볼트가 내 상황에 맞게 구성됩니다." }
    ]
  }
};

function makeCopyRow(text) {
  const row = document.createElement("div");
  row.className = "copy-row";
  const code = document.createElement("code");
  code.className = "copy-text";
  code.textContent = text;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "copy-btn";
  btn.textContent = "복사";
  const status = document.createElement("span");
  status.className = "copy-status";
  status.setAttribute("role", "status");
  row.append(code, btn, status);
  return row;
}

function injectSiteName() {
  document.querySelectorAll("[data-site-name]").forEach(el => { el.textContent = window.TV.SITE.name; });
}

function renderInstall() {
  const list = document.querySelector("#install .stepper");
  if (!list) return;
  TVG.INSTALL.forEach((step, i) => {
    const li = document.createElement("li");
    li.className = "step";
    const check = document.createElement("button");
    check.type = "button";
    check.className = "step-check";
    check.setAttribute("aria-pressed", "false");
    check.setAttribute("aria-label", `${i + 1}단계 완료 표시: ${step.title}`);
    const num = document.createElement("span");
    num.className = "step-num";
    num.textContent = String(i + 1);
    check.appendChild(num);
    const body = document.createElement("div");
    body.className = "step-body";
    const h3 = document.createElement("h3");
    h3.className = "step-title";
    h3.textContent = step.title;
    const p = document.createElement("p");
    p.className = "step-desc";
    p.textContent = step.body;
    body.append(h3, p);
    if (step.command) body.appendChild(makeCopyRow(step.command));
    (step.links || []).forEach(link => {
      const a = document.createElement("a");
      a.className = "step-link";
      a.href = link.href;
      a.rel = "noopener";
      a.textContent = link.label;
      body.appendChild(a);
    });
    li.append(check, body);
    list.appendChild(li);
  });
}

function renderUsage() {
  const grid = document.querySelector("#usage .usage-grid");
  const prompts = document.querySelector("#usage .prompts-list");
  if (!grid || !prompts) return;
  TVG.USAGE.forEach(item => {
    const card = document.createElement("div");
    card.className = "guide-card";
    const h3 = document.createElement("h3");
    h3.textContent = item.title;
    const p = document.createElement("p");
    p.textContent = item.body;
    card.append(h3, p);
    grid.appendChild(card);
  });
  TVG.PROMPTS.forEach(prompt => {
    const wrap = document.createElement("div");
    wrap.className = "prompt-item";
    const label = document.createElement("p");
    label.className = "prompt-label";
    label.textContent = prompt.label;
    wrap.append(label, makeCopyRow(prompt.text));
    prompts.appendChild(wrap);
  });
}

function renderSlack() {
  const leadEl = document.querySelector("#slack [data-slack-lead]");
  const grid = document.querySelector("#slack .slack-grid");
  const canonical = document.querySelector("#slack .slack-canonical");
  if (!leadEl || !grid || !canonical) return;
  leadEl.textContent = TVG.SLACK.lead;
  TVG.SLACK.runbooks.forEach(rb => {
    const card = document.createElement("a");
    card.className = "guide-card slack-card";
    card.href = rb.href;
    card.rel = "noopener";
    const order = document.createElement("p");
    order.className = "slack-order";
    order.textContent = `${rb.order} · ${rb.tag}`;
    const name = document.createElement("h3");
    name.textContent = rb.name;
    const desc = document.createElement("p");
    desc.textContent = rb.desc;
    card.append(order, name, desc);
    grid.appendChild(card);
  });
  const a = document.createElement("a");
  a.href = TVG.SLACK.canonical.href;
  a.rel = "noopener";
  a.textContent = TVG.SLACK.canonical.label;
  canonical.appendChild(a);
}

function renderStarter() {
  const leadEl = document.querySelector("#vault-starter [data-starter-lead]");
  const noticeEl = document.querySelector("#vault-starter [data-starter-notice]");
  const downloads = document.querySelector("#vault-starter .starter-downloads");
  const steps = document.querySelector("#vault-starter .starter-steps");
  if (!leadEl || !noticeEl || !downloads || !steps) return;
  leadEl.textContent = TVG.STARTER.lead;
  noticeEl.textContent = TVG.STARTER.notice;
  TVG.STARTER.downloads.forEach(dl => {
    const a = document.createElement("a");
    a.className = "starter-download";
    a.href = dl.href;
    a.rel = "noopener";
    a.textContent = dl.label;
    downloads.appendChild(a);
  });
  TVG.STARTER.steps.forEach(step => {
    const li = document.createElement("li");
    li.className = "starter-step";
    const h3 = document.createElement("h3");
    h3.textContent = step.title;
    const p = document.createElement("p");
    p.textContent = step.body;
    li.append(h3, p);
    steps.appendChild(li);
  });
}

function initStepper() {
  const list = document.querySelector("#install .stepper");
  const progress = document.querySelector("#install .stepper-progress");
  if (!list || !progress) return;
  function update() {
    const total = list.querySelectorAll(".step-check").length;
    const done = list.querySelectorAll('.step-check[aria-pressed="true"]').length;
    progress.textContent = total > 0 && done === total
      ? `${total}단계 모두 완료 — 팀 볼트가 열렸습니다 🎉`
      : `${total}단계 중 ${done}단계 완료`;
  }
  list.addEventListener("click", (e) => {
    const check = e.target.closest(".step-check");
    if (!check || !list.contains(check)) return;
    const pressed = check.getAttribute("aria-pressed") === "true";
    check.setAttribute("aria-pressed", String(!pressed));
    check.closest(".step").classList.toggle("step--done", !pressed);
    update();
  });
  update();
}

function initCopyButtons() {
  document.addEventListener("click", async (e) => {
    const btn = e.target.closest(".copy-btn");
    if (!btn) return;
    const row = btn.closest(".copy-row");
    const codeEl = row && row.querySelector(".copy-text");
    const status = row && row.querySelector(".copy-status");
    if (!codeEl || !status) return;
    try {
      await navigator.clipboard.writeText(codeEl.textContent);
      status.textContent = "복사됨 ✓";
    } catch (err) {
      const range = document.createRange();
      range.selectNodeContents(codeEl);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      status.textContent = "복사가 차단되어 텍스트를 선택했습니다 — Ctrl+C(⌘C)를 누르세요";
    }
    clearTimeout(Number(btn.dataset.statusTimer));
    btn.dataset.statusTimer = String(setTimeout(() => { status.textContent = ""; }, 2400));
  });
}

injectSiteName();
renderInstall();
renderUsage();
renderSlack();
renderStarter();
initStepper();
initCopyButtons();
