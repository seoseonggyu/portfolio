/*
  Chapter 00 — 표지 · 목차 · 소개
  ============================================================
  프로젝트 챕터가 아니라 덱 전체의 도입부(3장)입니다. index.html에서
  가장 먼저 로드되어야 합니다. toc.items의 href는 "합본 덱" 기준 슬라이드
  번호(1-based, #N)이므로 챕터 순서/장수가 바뀌면 다시 계산해야 합니다.
  현재: 1=표지, 2=목차, 3=소개, 4=Ch1 표지(10장), 14=Ch2 표지(6장),
  20=Ch3 표지(8장), 28=Ch4 표지(3장).
*/
window.DECK_CHAPTERS = window.DECK_CHAPTERS || [];

window.DECK_CHAPTERS.push([
  {
    layout: 'title',
    accent: 'blue',
    titleText: 'Portfolio',
    name: '서성규'
  },

  {
    layout: 'toc',
    accent: 'neutral',
    title: 'CONTENTS',
    items: [
      { label: '소개', href: '#3' },
      { label: 'LTSAgent — 에이전트 직접 구현', href: '#4' },
      { label: 'A1 — UE5 서바이벌', href: '#14' },
      { label: '졸업작품 — 네트워크 게임 서버', href: '#20' },
      { label: '기타 프로젝트', href: '#28' }
    ]
  },

  {
    layout: 'profile',
    accent: 'rose',
    title: '소개',
    photo: { src: 'assets/img/profile.jpg', alt: '서성규 프로필 사진' },
    profile: [
      { label: '이름', value: '서성규 Seo Seong Gyu' },
      { label: '생년월일', value: '1996.04.04' },
      { label: '학력정보', value: '한국공학대학교 · 2026.02 졸업' }
    ],
    contacts: [
      { label: '전화번호', value: '010-9430-7590' },
      { label: '이메일', value: 'mafia7590@gmail.com' }
    ],
    skills: [
      { label: '언어', value: 'C, C++, C#, Python' },
      { label: '서버', value: 'IOCP, 멀티스레드' },
      { label: '클라이언트', value: 'Unreal, Windows API, OpenGL' },
      { label: 'Etc', value: 'Github, Perforce' }
    ]
  }
]);
