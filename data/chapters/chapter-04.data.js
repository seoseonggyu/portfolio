/*
  Chapter 04 — 기타 프로젝트
  ============================================================
  Standalone-viewable: open chapter-04.html. See PROMPT.md / README.md.

  출처: 사용자 제공 서버 포트폴리오 PDF의 "기타 프로젝트" 구성.
  - The Last One은 PDF처럼 별도로 2장(개요 + 구현) 다룬다. 스크린샷 사용.
  - 나머지 미니 프로젝트는 카드 그리드(projectCards)로 타이틀 중심 압축.
  - L1은 제외(사용자 지시).
*/
window.DECK_CHAPTERS = window.DECK_CHAPTERS || [];

window.DECK_CHAPTERS.push([
  {
    layout: 'cover',
    accent: 'neutral',
    chapterNumber: '04',
    chapterTitle: '기타 프로젝트',
    meta: [
      { label: '구성', value: 'The Last One · 미니 프로젝트 4종' },
      { label: '엔진 · 언어', value: 'Unreal Engine 5 · WinAPI · OpenGL · C++' }
    ],
    summary: '전용 서버 없이 도는 배틀로얄부터 네트워크 레이스·물리 시뮬레이션까지, 그때그때 필요한 기술을 익혀 완성한 프로젝트들입니다.',
    chapterSubtitle: 'The Last One은 따로 다루고, 나머지는 카드로 정리했습니다.'
  },

  {
    accent: 'green',
    eyebrow: '기타 프로젝트 · The Last One',
    title: [
      { text: '전용 서버 없이 — ' },
      { text: '「리슨 서버로 배틀로얄을 완성했습니다」', emphasis: true }
    ],
    links: [
      { label: 'GitHub', icon: 'github', url: 'https://github.com/seoseonggyu/TheLastOne' }
    ],
    illustration: {
      type: 'photo',
      props: {
        src: 'assets/img/thelastone-title.png',
        alt: 'The Last One 타이틀 화면',
        fit: 'contain',
        caption: 'Battle Royale · Unreal Engine 5 · OnlineSubsystem · 리슨 서버 · 1인 · 2025.10 – 2025.11'
      }
    }
  },

  {
    accent: 'green',
    eyebrow: '기타 프로젝트 · The Last One',
    title: [
      { text: '세션부터 인게임까지 — ' },
      { text: '「멀티플레이 한 판을 직접 붙였습니다」', emphasis: true }
    ],
    caption: [
      { text: '전용 서버가 없어도 — ' },
      { text: '호스트의 리슨 서버 위에서 매치메이킹과 전투가 동작합니다.', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'plug',
            label: '전용 서버 없이 세션 매치메이킹',
            desc: 'OnlineSubsystem으로 세션을 생성·검색·참가해, 별도 서버를 두지 않고 호스트의 리슨 서버로 방을 열고 다른 플레이어가 붙도록 만들었습니다.',
            shot: 'assets/img/thelastone-create-session.png',
            shotAlt: '세션 생성 및 리슨 서버 생성 블루프린트'
          },
          {
            icon: 'spark',
            label: '리슨 서버 위 인게임 콘텐츠',
            desc: '호스트 권한으로 플레이어 추방을 처리하고, NPC를 스폰해 무작위 위치로 이동시키는 AI까지 붙여 배틀로얄 한 판이 끝까지 돌아가게 했습니다.',
            shot: 'assets/img/thelastone-npc-spawn.png',
            shotAlt: 'NPC 스폰 및 이동 블루프린트'
          }
        ]
      }
    }
  },

  {
    accent: 'gold',
    eyebrow: '기타 프로젝트 · 미니 프로젝트',
    title: [
      { text: '엔진·언어를 가리지 않고 — ' },
      { text: '「필요한 기술을 익혀 끝까지 완성했습니다」', emphasis: true }
    ],
    caption: [
      { text: '네트워크 레이스부터 물리 시뮬레이션까지 — ' },
      { text: '각 프로젝트에서 필요한 기술을 직접 익혀 적용했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'projectCards',
      props: {
        projects: [
          {
            title: 'JUMP JUMP',
            genre: '1:1 네트워크 레이스',
            tech: 'WinAPI · TCP 소켓 · 멀티스레드',
            period: '2023.11 – 2023.12',
            team: '3인',
            accent: 'blue',
            thumb: 'assets/img/jumpjump-title.png',
            link: { label: 'GitHub', icon: 'github', url: 'https://github.com/seoseonggyu/Jump_Network' }
          },
          {
            title: 'Top-Down Shooter',
            genre: '탑다운 슈터 생존',
            tech: 'Unreal5 · Blueprint',
            period: '2024.06.07 – 2024.06.14',
            team: '1인',
            accent: 'gold',
            thumb: 'assets/img/topdown-title.png',
            link: { label: '영상', icon: 'play', url: 'https://www.youtube.com/watch?v=encf3Zpe5bk' }
          },
          {
            title: '이중 슬릿 시뮬레이션',
            genre: '과학 시뮬레이션',
            tech: 'Unreal5 · Material Shader',
            period: '2024.05 – 2024.06',
            team: '3인',
            accent: 'violet',
            thumb: 'assets/img/doubleslit-title.png',
            link: { label: '영상', icon: 'play', url: 'https://www.youtube.com/watch?v=is4dlqXOmmo' }
          },
          {
            title: '1인칭 탈출 게임',
            genre: '3D 탈출',
            tech: 'OpenGL · C++',
            period: '2023.11 – 2023.12',
            team: '2인',
            accent: 'rose',
            thumb: 'assets/img/escape-title.png',
            link: { label: '영상', icon: 'play', url: 'https://www.youtube.com/watch?v=UERVEDvj-gc' }
          }
        ]
      }
    }
  }
]);
