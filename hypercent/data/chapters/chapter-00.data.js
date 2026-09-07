/*
  Chapter 00 — 표지 · 목차 · 소개
  ============================================================
  프로젝트 챕터가 아니라 덱 전체의 도입부(3장)입니다. index.html에서
  가장 먼저 로드되어야 합니다. toc.items의 href는 "합본 덱" 기준 슬라이드
  번호(1-based, #N)이므로 챕터 순서/장수가 바뀌면 다시 계산해야 합니다.
  현재: 1=표지, 2=목차, 3=소개, 4=Ch1 졸업작품(8장), 12=Ch2 A1(6장),
  18=Ch3 LTSAgent(10장), 28=Ch4 기타(4장).
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
      { label: '졸업작품 — 멀티플레이 TPS · IOCP 서버', href: '#4' },
      { label: 'A1 — UE5 서바이벌', href: '#12' },
      { label: 'LTSAgent — 개발 자동화 툴 직접 구현', href: '#18' },
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
      { label: '학력정보', value: '한국공학대학교 게임공학과 · 2026.02 졸업' }
    ],
    contacts: [
      { label: '전화번호', value: '010-9430-7590' },
      { label: '이메일', value: 'mafia7590@gmail.com' },
      { label: '포트폴리오', value: 'seoseonggyu.github.io/portfolio/hypercent', url: 'https://seoseonggyu.github.io/portfolio/hypercent/' },
      { label: 'GitHub', value: 'github.com/seoseonggyu', url: 'https://github.com/seoseonggyu' }
    ],
    skills: [
      { label: '언어', value: 'C, C++, C#, Python' },
      { label: '서버 · 네트워크', value: 'IOCP, Winsock, 멀티스레드, Protobuf' },
      { label: '클라이언트', value: 'Unreal Engine 5, Windows API, OpenGL' },
      { label: 'Etc', value: 'Github, Perforce' }
    ]
  }
]);
