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
