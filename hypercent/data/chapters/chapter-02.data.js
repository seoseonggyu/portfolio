/*
  Chapter 02 — A1  (뼈대 작성 중 — 세부 슬라이드는 스크린샷/영상 확보 후 보강)
  ============================================================
  Standalone-viewable: open chapter-02.html to see only this chapter.
  Included in the combined deck via index.html alongside the other
  chapter-*.data.js files. See PROMPT.md for the authoring rules and
  README.md for how chapters are wired together.

  주의: 이 프로젝트의 전체 아키텍처(GameFeature/Experience/ActorExtension
  구조)는 사용자가 직접 설계한 것이 아니므로, "직접 설계/제가 만든" 같은
  표현을 쓰지 않는다. 그 위에서 AI(Claude Code)와 함께 실제 시스템을
  구현했다는 것이 이 챕터의 핵심 주장이다.

  초기화 흐름(2·3번 슬라이드)의 함수명과 호출 순서는 D:\Project\A1 의
  플러그인 소스(CommonGameModeBase / ExperienceManagerComponent /
  ActorExtensionWorldSubsystem / ExtensionCondition_NetworkReady /
  ExtensionExecute_InitAbilitySystem / CommonAbilitySystemComponent /
  ModularCharacter / CommonUIPolicy)를 직접 읽어 검증했다. 코드가 바뀌면
  다시 읽고 맞춘다.

  5번 슬라이드(영역별 규칙)의 규칙 문구는 D:\Project\A1\.claude\skills 의
  실제 SKILL.md(a1-gas / a1-item-equipment / a1-replication / a1-coroutine /
  a1-gamefeature-extension / a1-ui-mvvm)를 축약한 것이다. 6번 슬라이드의 코드는
  실제 소스(InventoryComponent.cpp::TransferInventoryToInventoryServer,
  A1Ability_Skill_AOE.cpp::ConfirmTargetLocal)를 읽어 발췌·검증했다.
*/
window.DECK_CHAPTERS = window.DECK_CHAPTERS || [];

window.DECK_CHAPTERS.push([
  {
    layout: 'cover',
    accent: 'gold',
    chapterNumber: '02',
    chapterTitle: '뼈대 위에서, AI와 함께 완성해 가는 서바이벌 게임',
    meta: [
      { label: '게임 장르', value: '탑다운 서바이벌 (멀티플레이)' },
      { label: '역할', value: '1인 개발 · 콘텐츠 구현 (기여도 100%)' },
      { label: '기술 스택', value: 'Unreal Engine 5 · C++ · GAS · Iris(네트워크 복제)' },
      { label: '작업 기간', value: '2026.05 – 진행 중' },
      { label: 'Repo', value: 'seoseonggyu/A1', url: 'https://github.com/seoseonggyu/A1' }
    ],
    summary: '플러그인 구조와 코딩 규칙 위에서, 콘텐츠 개발은 AI를 개발 파트너로 삼아 진행하고 있습니다.',
    chapterSubtitle: 'Unreal Engine 기반 Iris 서버 구조의 탑다운 서바이벌 게임을 1인으로 개발하고 있습니다.'
  },

  {
    accent: 'blue',
    eyebrow: '초기화 흐름 (1/2) · 로드',
    title: [
      { text: '맵이 열리면 — ' },
      { text: '「Experience를 로드하고 콘텐츠를 켭니다」', emphasis: true }
    ],
    caption: [
      { text: 'Unreal의 표준 시작 흐름 위에서 — ' },
      { text: '준비가 끝날 때까지 스폰을 미뤘다가, 로드가 완료되면 캐릭터를 생성하도록 구현했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'sequence',
      props: {
        participants: [
          { id: 'world', label: 'World' },
          { id: 'gm', label: 'GameMode' },
          { id: 'exp', label: 'Experience' },
          { id: 'gf', label: 'GameFeature' },
          { id: 'char', label: 'Character' }
        ],
        calls: [
          { from: 'world', to: 'gm', fn: 'InitGame()', label: '맵이 열리면 서버가 게임모드를 초기화합니다', native: true },
          { from: 'gm', to: 'exp', fn: 'SetCurrentExperienceAuth()', label: 'WorldSettings의 Experience를 서버 권한으로 확정하고 클라이언트에 복제합니다' },
          { from: 'exp', to: 'gf', fn: 'LoadExperienceCoroutine()', label: 'Experience 에셋을 로드하고 콘텐츠 플러그인을 비동기로 활성화합니다' },
          { from: 'gf', to: 'exp', fn: 'RegisterExtensionForClass()', label: '플러그인이 Actor에 붙일 확장(능력·입력·UI) 규칙을 등록합니다' },
          { from: 'exp', to: 'gm', fn: 'OnExperienceLoaded_High.Broadcast()', label: '로드가 끝나면 대기 중이던 게임모드에 통지합니다' },
          { from: 'gm', to: 'char', fn: 'SpawnDefaultPawnAtTransform()', label: '그때까지 보류했던 플레이어 캐릭터를 스폰합니다', native: true }
        ]
      }
    }
  },

  {
    accent: 'blue',
    eyebrow: '초기화 흐름 (2/2) · 활성화',
    title: [
      { text: '캐릭터가 스폰되면 — ' },
      { text: '「능력치·네트워크·화면까지 이어집니다」', emphasis: true }
    ],
    caption: [
      { text: '매 틱 네트워크 준비 상태를 확인해 조건이 맞을 때 능력치 시스템을 켜고 — ' },
      { text: '복제된 상태가 입력과 화면까지 반영되도록 구현했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'sequence',
      props: {
        participants: [
          { id: 'char', label: 'Character' },
          { id: 'ext', label: 'ActorExtension' },
          { id: 'ps', label: 'PlayerState' },
          { id: 'ui', label: 'UI' }
        ],
        calls: [
          { from: 'char', to: 'ext', fn: 'SendExtensionEvent(GameActorReady)', label: 'BeginPlay 시점에 준비 완료를 알려 확장 대기열에 올립니다' },
          { from: 'ext', to: 'ps', fn: 'NetworkReady::IsSatisfied()', label: '매 틱, Controller·PlayerState·ASC 복제가 끝났는지 검사합니다' },
          { from: 'ext', to: 'ps', fn: 'InitAbilityActorInfo()', label: '조건이 충족되면 능력치 시스템(ASC)을 활성화합니다' },
          { from: 'ext', to: 'char', fn: 'BindInput_TopDown()', label: '이동·스킬 입력을 EnhancedInput으로 캐릭터에 바인딩합니다' },
          { from: 'ps', to: 'ui', fn: 'OnRep_ActivateAbilities()', label: '복제로 도착한 능력을 클라이언트에서 활성화합니다', native: true },
          { from: 'char', to: 'ui', fn: 'AddLayoutToViewport()', label: '로컬 플레이어의 UI 레이아웃을 화면에 올립니다' }
        ]
      }
    }
  },

  {
    accent: 'green',
    eyebrow: 'AI 활용 방식',
    title: [
      { text: "'해줘'가 아니라 — " },
      { text: '「문제를 정의하고, 규칙과 함께 전달하고, 결과를 검수합니다」', emphasis: true }
    ],
    caption: [
      { text: 'Chapter 1에서 에이전트를 직접 구현하며 얻은 이해를 바탕으로 — ' },
      { text: 'AI가 작성한 코드를 도메인 지식으로 읽고 검수하며 콘텐츠를 개발합니다.', emphasis: true }
    ],
    illustration: {
      type: 'schematic',
      props: {
        lanes: [
          {
            label: '문제', accent: 'rose', tag: '"해줘"만 던지면 — 규칙 없는 코드가 조용히 쌓인다',
            stages: [
              { kind: 'box', accent: 'neutral', icon: 'cursor', label: '"그냥 해줘"', sub: '맥락 없는 지시',
                connector: '규칙 부재', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', emphasis: true, icon: 'wrench', label: 'AI가 임의로 작성', sub: '도메인 규칙 모름',
                connector: '검증 없이 병합', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', label: '조용히 깨지는 코드', sub: '복제 누락 · 권한 오류' }
            ]
          },
          {
            label: '해결', accent: 'blue', tag: '정의 → 규칙과 함께 전달 → 검수 → 개선',
            stages: [
              { kind: 'box', accent: 'blue', icon: 'text', label: '문제 정의', sub: '무엇을 · 왜',
                connector: '도메인 규칙과 함께', connectorAccent: 'blue' },
              { kind: 'box', accent: 'blue', icon: 'cursor', label: '의도 전달', sub: '규칙을 명시해 지시',
                connector: 'AI 생성', connectorAccent: 'blue' },
              { kind: 'box', accent: 'violet', emphasis: true, icon: 'check', label: '이해 · 검수', sub: '의도와 맞는지 코드 검증',
                connector: '어긋나면', connectorAccent: 'gold' },
              { kind: 'box', accent: 'green', icon: 'spark', label: '반영 · 개선', sub: '잡아내 다시 요청' }
            ]
          }
        ]
      }
    }
  },

  {
    accent: 'blue',
    eyebrow: '영역별 규칙 · Skill',
    title: [
      { text: '영역마다 설계 규칙을 문서로 정리해서 — ' },
      { text: '「AI가 매번 같은 규칙 위에서 작성하게 했습니다」', emphasis: true }
    ],
    caption: [
      { text: '전투·아이템·네트워크·UI까지 각 영역의 규칙을 Skill 문서로 만들어 — ' },
      { text: 'AI가 프로젝트 컨벤션을 지키며 일관된 코드를 내도록 유도했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'iconGrid',
      props: {
        columns: 3,
        items: [
          { icon: 'spark', label: '전투 · 능력치 (GAS)', desc: '상태 변경은 서버에서, 어빌리티 종료 경로는 반드시 보장' },
          { icon: 'shield', label: '아이템 · 장비', desc: '상속 대신 Fragment 조합으로, 배열 인덱스는 16개 제한' },
          { icon: 'plug', label: '네트워크 복제 (Iris)', desc: '상태는 서버에서 시작하고, 클라 인자는 반드시 재검증' },
          { icon: 'cube', label: '비동기 · 코루틴', desc: '타이머·AbilityTask 대신 C++20 코루틴을 기본 수단으로' },
          { icon: 'hexagon', label: '게임 피처 · 확장', desc: '복제는 Component, 행위 주입은 Extension, 핸들은 반드시 해제' },
          { icon: 'panel', label: '화면 · UI (MVVM)', desc: '값 갱신은 SET_PROPERTY_VALUE로, 델리게이트는 전부 해제' }
        ]
      }
    }
  },

  /* ── AI로 구현한 콘텐츠 — 규칙 위에서 검수한 실제 코드 ───────── */
  {
    accent: 'green',
    eyebrow: 'AI로 구현한 콘텐츠',
    title: [
      { text: '정리한 규칙 위에서 — ' },
      { text: '「AI와 함께 실제 콘텐츠를 구현했습니다」', emphasis: true }
    ],
    caption: [
      { text: '인벤토리 그리드부터 범위 스킬까지 30여 개의 기능을 단계적으로 쌓으며 — ' },
      { text: '서버 권한·네트워크 예측처럼 놓치기 쉬운 지점을 직접 검수해 채웠습니다.', emphasis: true }
    ],
    illustration: {
      type: 'codePanels',
      props: {
        columns: 2,
        panels: [
          {
            file: 'InventoryComponent.cpp', tag: '시체 루팅 · 서버 재검증', accent: 'blue',
            code:
'void TransferInventoryToInventoryServer_Implementation(\n' +
'    UInventoryComponent* SourceInv, int32 ItemId,\n' +
'    UInventoryComponent* DestInv, FIntPoint Anchor)\n' +
'{\n' +
'    if (!GetOwner()->HasAuthority()) return;\n' +
'    if (!SourceInv || !DestInv || SourceInv == DestInv) return;\n' +
'    // 보안: 호출한 클라가 실제 거래 당사자여야 한다 (인자 불신)\n' +
'    if (this != SourceInv && this != DestInv) return;\n' +
'    UItemInstance* Item = SourceInv->FindItemById(ItemId);\n' +
'    const FInventoryEntry* Entry = SourceInv->FindEntry(Item);\n' +
'    if (!Item || !Entry || Entry->bEquipment) return;\n' +
'    // 대상 그리드에 놓을 자리가 있는지 서버가 다시 확인\n' +
'    const FIntPoint Size = GetSizeFromDefinition(Entry->Definition);\n' +
'    if (!DestInv->CanPlaceAt(Anchor, Size)) return;\n' +
'    SourceInv->MoveEntryToOtherAuth(Item, DestInv, Anchor, false);\n' +
'}'
          },
          {
            file: 'A1Ability_Skill_AOE.cpp', tag: '범위 스킬 · 확정 시에만 커밋', accent: 'green',
            code:
'void UA1Ability_Skill_AOE::ConfirmTargetLocal()\n' +
'{\n' +
'    if (bTargetConfirmed) return;\n' +
'    bTargetConfirmed = true;\n' +
'\n' +
'    // 조준 태스크·인디케이터 즉시 정지 — 낸 뒤엔 취소 불가\n' +
'    StopAimTickLocal();\n' +
'    HideTargetingPromptLocal();\n' +
'    // 확정하는 순간에만 비용·쿨다운 커밋 (취소 시 무소비)\n' +
'    if (!K2_CommitAbilityCost()) { EndAbility(/*...*/); return; }\n' +
'    K2_CommitAbilityCooldown(false, true);\n' +
'\n' +
'    // 서버 권한에서 장판(AOE Zone) 스폰을 요청\n' +
'    ConfirmAOEServer(CachedTargetLocation);\n' +
'    PlaySkillMontage();\n' +
'}'
          }
        ]
      }
    }
  }

  // TODO: 실전 적용 슬라이드 — 게임플레이 스크린샷(photo)과 데모 영상 링크가 오면 추가
]);
