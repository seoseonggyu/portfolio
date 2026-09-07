/*
  Chapter 01 — 졸업작품 (TPS + IOCP 서버)
  ============================================================
  Standalone-viewable: open chapter-01.html to see only this chapter.
  See PROMPT.md for authoring rules, README.md for how chapters wire together.

  출처: 사용자 제공 PDF(서버-포트폴리오.pdf)와 실제 소스(Perforce 워크스페이스
  ASSEMBER/GameServer · ASSEMBER/GradGame)를 직접 읽어 재구성. 2인 팀, 서버·클라이언트
  전 영역을 본인이 구현. 저장소는 용량 문제로 서버(seoseonggyu/GameServer)와
  클라이언트(seoseonggyu/GradGame)를 분리해 올렸고, 클라이언트는 Content(약 4.6GB,
  마켓플레이스 에셋 포함)를 제외한 C++ 소스만 담았다.
  기능 나열이 아니라 "왜 이렇게 설계했는가 / 어떤 문제를 어떻게 풀었는가" 중심(PROMPT.md §3).
  세 가지 핵심 문제(락 경합·교착·이동 오차)를 각각 「도식(schematic) + 실제 코드」
  2장으로 풀어, 처음 보는 사람도 "이 문제 때문에 이렇게 만들었구나"를 알 수 있게 구성.
  코드/함수명은 실제 소스(JobQueue.cpp, Lock.cpp, DeadLockProfiler.cpp, Room.cpp,
  클라 이동 처리)를 읽어 검증(PROMPT.md §9). Lyra 클론 파트는 제외(사용자 지시).
*/
window.DECK_CHAPTERS = window.DECK_CHAPTERS || [];

window.DECK_CHAPTERS.push([
  {
    layout: 'cover',
    accent: 'violet',
    chapterNumber: '01',
    chapterTitle: '동시성 문제를 직접 풀어 만든 IOCP 게임 서버',
    meta: [
      { label: '게임 장르', value: '멀티플레이 협동 TPS' },
      { label: '역할', value: '2인 팀 · 서버 전체(100%) + 클라이언트 통신·플레이 구조' },
      { label: '기술 스택', value: 'Unreal Engine 5 · C++ · IOCP · Winsock · Protobuf · 멀티스레드' },
      { label: '작업 기간', value: '2024.08 – 2025.03' },
      { label: '서버 Repo', value: 'seoseonggyu/GameServer', url: 'https://github.com/seoseonggyu/GameServer' },
      { label: '클라 Repo', value: 'seoseonggyu/GradGame', url: 'https://github.com/seoseonggyu/GradGame' },
      { label: '저장소', value: '용량 문제로 서버 · 클라이언트를 나눠 올렸습니다. 클라이언트는 에셋을 뺀 C++ 소스만 담았습니다.' }
    ],
    summary: '락 경합·교착 상태·이동 동기화 오차를 직접 진단하고 설계로 풀어 IOCP 서버를 완성했습니다.',
    chapterSubtitle: '세 가지 동시성 문제를 각각 「문제 도식 → 실제 코드」로 풀어, 왜 이렇게 만들었는지를 보여드립니다.'
  },

  /* ── 1. JobQueue — 도식 (문제 → 해결) ───────────────────────── */
  {
    accent: 'blue',
    eyebrow: '서버 설계 · 동시성 ①',
    title: [
      { text: '패킷마다 락을 거는 대신 — ' },
      { text: '「Room을 Job Queue로 설계했습니다」', emphasis: true }
    ],
    caption: [
      { text: '동접이 늘수록 하나의 공유 자원에 락이 몰려 대기가 길어졌습니다 — ' },
      { text: 'Room이 자체 Job Queue를 갖게 해, 같은 Room의 일은 한 스레드가 순차 처리하도록 바꿨습니다.', emphasis: true }
    ],
    illustration: {
      type: 'schematic',
      props: {
        lanes: [
          {
            label: '문제', accent: 'rose', tag: '동접 ↑ → 락 경합 · 대기 시간 ↑',
            stages: [
              { kind: 'group', accent: 'rose', groupLabel: 'IO 스레드 (다수)',
                items: [{ label: '수신 스레드' }, { label: '수신 스레드' }, { label: '수신 스레드' }],
                connector: '동시 접근', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', emphasis: true, icon: 'wrench', label: '공유 자원', sub: '단일 Lock',
                connector: '경합 → 직렬 대기', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', label: '처리량 저하', sub: '스레드가 서로 기다림' }
            ]
          },
          {
            label: '해결', accent: 'blue', tag: '락 없이 싱글 스레드처럼 안전하게 처리',
            stages: [
              { kind: 'group', accent: 'blue', groupLabel: 'IO 스레드 (다수)',
                items: [{ label: '수신 스레드' }, { label: '수신 스레드' }, { label: '수신 스레드' }],
                connector: '패킷 → Job 변환', connectorAccent: 'blue' },
              { kind: 'box', accent: 'blue', emphasis: true, icon: 'cube', label: 'Room = JobQueue', sub: 'Room마다 큐 보유',
                connector: '한 스레드가 순차 실행', connectorAccent: 'blue' },
              { kind: 'box', accent: 'green', icon: 'check', label: '순차 처리', sub: 'Lock 불필요',
                connector: '여유 없으면 위임', connectorAccent: 'gold' },
              { kind: 'box', accent: 'gold', label: 'GlobalQueue', sub: '다른 스레드가 이어받음' }
            ]
          }
        ]
      }
    }
  },

  /* ── 2. JobQueue — 실제 코드 ────────────────────────────────── */
  {
    accent: 'blue',
    eyebrow: '서버 설계 · 동시성 ①',
    title: [
      { text: '첫 Job을 넣은 스레드가 실행을 맡고 — ' },
      { text: '「바쁜 스레드는 GlobalQueue로 넘겨 양보합니다」', emphasis: true }
    ],
    caption: [
      { text: '큐가 비면 스스로 실행을 끝내고, 한 큐를 너무 오래 잡지 않도록 시간 제한을 둬 — ' },
      { text: '한 스레드가 한 Room을 독점하지 않고 서로 일을 나눠 갖게 했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'codePanels',
      props: {
        columns: 2,
        panels: [
          {
            file: 'JobQueue.cpp', tag: 'Push', accent: 'blue',
            code:
'void JobQueue::Push(JobRef job, bool pushOnly)\n' +
'{\n' +
'    const int32 prevCount = _jobCount.fetch_add(1);\n' +
'    _jobs.Push(job);\n' +
'\n' +
'    // 첫 Job을 넣은 스레드가 실행을 담당\n' +
'    if (prevCount == 0)\n' +
'    {\n' +
'        // 실행 중인 큐가 없으면 직접 처리\n' +
'        if (LCurrentJobQueue == nullptr && pushOnly == false)\n' +
'            Execute();\n' +
'        else\n' +
'            // 여유 있는 스레드에 위임\n' +
'            GGlobalQueue->Push(shared_from_this());\n' +
'    }\n' +
'}'
          },
          {
            file: 'JobQueue.cpp', tag: 'Execute', accent: 'blue',
            code:
'void JobQueue::Execute()\n' +
'{\n' +
'    LCurrentJobQueue = this;\n' +
'    while (true)\n' +
'    {\n' +
'        Vector<JobRef> jobs;\n' +
'        _jobs.PopAll(OUT jobs);\n' +
'        const int32 jobCount = (int32)jobs.size();\n' +
'        for (int32 i = 0; i < jobCount; i++)\n' +
'            jobs[i]->Execute();   // 같은 큐 → 순차 실행\n' +
'\n' +
'        // 남은 일이 없으면 종료\n' +
'        if (_jobCount.fetch_sub(jobCount) == jobCount)\n' +
'            { LCurrentJobQueue = nullptr; return; }\n' +
'        // 오래 잡지 않도록 GlobalQueue로 양보\n' +
'        if (::GetTickCount64() >= LEndTickCount)\n' +
'            { LCurrentJobQueue = nullptr;\n' +
'              GGlobalQueue->Push(shared_from_this()); break; }\n' +
'    }\n' +
'}'
          }
        ]
      }
    }
  },

  /* ── 3. DeadLockProfiler — 도식 (문제 → 해결) ───────────────── */
  {
    accent: 'rose',
    eyebrow: '서버 설계 · 안정성 ②',
    title: [
      { text: '교착 상태는 재현이 어려워 — ' },
      { text: '「락 순서를 그래프로 추적하는 탐지 도구를 만들었습니다」', emphasis: true }
    ],
    caption: [
      { text: '스레드마다 락 잡는 순서가 엇갈리면 서로의 락을 기다리며 서버가 멈췄습니다 — ' },
      { text: '락 획득 순서를 방향 그래프로 기록하고 DFS로 순환을 찾아, 실행 전에 미리 잡아냅니다.', emphasis: true }
    ],
    illustration: {
      type: 'schematic',
      props: {
        lanes: [
          {
            label: '문제', accent: 'rose', tag: '락 획득 순서 엇갈림 → 순환 대기(교착)',
            stages: [
              { kind: 'cycle', accent: 'rose',
                items: [{ label: '스레드 A' }, { label: '스레드 B' }], sub: '서로의 락 대기',
                connector: '재현·특정 어려움', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', emphasis: true, icon: 'wrench', label: '간헐적 멈춤', sub: '로그만으론 원인 특정 난항' }
            ]
          },
          {
            label: '해결', accent: 'blue', tag: '디버깅 단계에서 데드락 가능성을 사전 차단',
            stages: [
              { kind: 'box', accent: 'blue', icon: 'shield', label: '락 획득 시점', sub: '순서를 기록',
                connector: '방향 그래프', connectorAccent: 'blue' },
              { kind: 'box', accent: 'blue', label: 'Lock 순서 그래프', sub: 'A → B 간선 저장',
                connector: 'DFS 탐색', connectorAccent: 'blue' },
              { kind: 'box', accent: 'violet', label: '순환 참조 탐지', sub: 'back-edge 발견',
                connector: '실행 전', connectorAccent: 'green' },
              { kind: 'box', accent: 'green', icon: 'check', label: '사전 경고', sub: '충돌 지점 출력' }
            ]
          }
        ]
      }
    }
  },

  /* ── 4. DeadLockProfiler — 실제 코드 ───────────────────────── */
  {
    accent: 'rose',
    eyebrow: '서버 설계 · 안정성 ②',
    title: [
      { text: '자체 Reader-Writer Lock에 순서를 기록하고 — ' },
      { text: '「DFS로 순환(back-edge)을 찾아 데드락을 탐지합니다」', emphasis: true }
    ],
    caption: [
      { text: '표준 mutex의 한계(재귀 불가·읽기 병렬성)를 보완한 자체 락에 프로파일러를 얹어 — ' },
      { text: '락 그래프에서 순환이 보이면 실행 전에 그 지점을 그대로 출력합니다.', emphasis: true }
    ],
    illustration: {
      type: 'codePanels',
      props: {
        columns: 2,
        panels: [
          {
            file: 'Lock.cpp', tag: 'WriteLock', accent: 'rose',
            code:
'void Lock::WriteLock(const char* name)\n' +
'{\n' +
'#if _DEBUG\n' +
'    GDeadLockProfiler->PushLock(name);  // 락 획득 순서 기록\n' +
'#endif\n' +
'    // 같은 스레드면 재귀 획득 허용\n' +
'    if (((_lockFlag.load() & WRITE_MASK) >> 16) == LThreadId)\n' +
'        { ++_writeCount; return; }\n' +
'    const uint32 desired = (LThreadId << 16) & WRITE_MASK;\n' +
'    const int64 begin = ::GetTickCount64();\n' +
'    while (true)\n' +
'    {\n' +
'        uint32 expected = EMPTY_FLAG;\n' +
'        if (_lockFlag.compare_exchange_strong(expected, desired))\n' +
'            { ++_writeCount; return; }       // CAS 성공\n' +
'        if (::GetTickCount64() - begin >= TIMEOUT)\n' +
'            CRASH("LOCK_TIMEOUT");           // 임계 초과 시 크래시\n' +
'        this_thread::yield();\n' +
'    }\n' +
'}'
          },
          {
            file: 'DeadLockProfiler.cpp', tag: 'Dfs (순환 탐지)', accent: 'violet',
            code:
'void DeadLockProfiler::Dfs(int32 here)\n' +
'{\n' +
'    if (_discoveredOrder[here] != -1) return;\n' +
'    _discoveredOrder[here] = _discoveredCount++;\n' +
'    auto findIt = _lockHistory.find(here);\n' +
'    if (findIt == _lockHistory.end())\n' +
'        { _finished[here] = true; return; }\n' +
'\n' +
'    for (int32 there : findIt->second)\n' +
'    {\n' +
'        // 미방문 → 트리 간선, 계속 탐색\n' +
'        if (_discoveredOrder[there] == -1)\n' +
'            { _parent[there] = here; Dfs(there); continue; }\n' +
'        // back-edge 발견 → 순환(데드락 가능성)\n' +
'        if (_discoveredOrder[here] < _discoveredOrder[there]) continue;\n' +
'        if (_finished[there] == false)\n' +
'            printf("%s -> %s\\n", _idToName[here], _idToName[there]);\n' +
'    }\n' +
'    _finished[here] = true;\n' +
'}'
          }
        ]
      }
    }
  },

  /* ── 5. 이동 동기화 — 도식 (문제 → 해결) ───────────────────── */
  {
    accent: 'green',
    eyebrow: '이동 동기화 ③',
    title: [
      { text: '좌표로 보정하지 않고 — ' },
      { text: '「이동 방향 벡터로 보정했습니다」', emphasis: true }
    ],
    caption: [
      { text: 'FPS는 반응이 생명이라 서버 승인을 기다리지 않고 클라가 먼저 움직입니다 — ' },
      { text: '좌표 대신 이동 벡터로 다른 유저를 보정하고, 오차가 임계값을 넘을 때만 좌표로 스냅합니다.', emphasis: true }
    ],
    illustration: {
      type: 'schematic',
      props: {
        lanes: [
          {
            label: '문제', accent: 'rose', tag: '좌표 기반 보정 — 급격한 방향 전환에 반응 지연',
            stages: [
              { kind: 'box', accent: 'neutral', icon: 'cursor', label: '내 클라', sub: '즉시 선이동',
                connector: '이동 패킷', connectorAccent: 'rose' },
              { kind: 'box', accent: 'neutral', icon: 'plug', label: '서버', sub: 'Room::HandleMove → 브로드캐스트',
                connector: '좌표 전달', connectorAccent: 'rose' },
              { kind: 'box', accent: 'rose', emphasis: true, label: '타 클라 보정', sub: '받은 좌표로 이동 → 지연' }
            ]
          },
          {
            label: '해결', accent: 'green', tag: '벡터 기반 보정 — 즉각 반응 + 위치 정확성 유지',
            stages: [
              { kind: 'box', accent: 'neutral', icon: 'cursor', label: '내 클라', sub: '선이동 + 방향 벡터 전송',
                connector: '벡터 + 상태', connectorAccent: 'green' },
              { kind: 'box', accent: 'neutral', icon: 'plug', label: '서버', sub: '브로드캐스트',
                connector: '방향 벡터 전달', connectorAccent: 'green' },
              { kind: 'box', accent: 'green', emphasis: true, icon: 'spark', label: '타 클라 보정', sub: '벡터로 즉시 이동',
                connector: '오차 ≥ 임계값', connectorAccent: 'gold' },
              { kind: 'box', accent: 'gold', label: '좌표 스냅', sub: '서버 좌표로 보정' }
            ]
          }
        ]
      }
    }
  },

  /* ── 6. 이동 동기화 — 실제 코드 ────────────────────────────── */
  {
    accent: 'green',
    eyebrow: '이동 동기화 ③',
    title: [
      { text: '클라가 방향 벡터를 실어 보내고 — ' },
      { text: '「받는 쪽은 벡터로 선반영, 오차가 크면 좌표로 스냅합니다」', emphasis: true }
    ],
    caption: [
      { text: '보내는 쪽은 좌표뿐 아니라 이동 방향까지 전송하고 — ' },
      { text: '받는 쪽은 그 방향으로 먼저 움직이되, 서버 좌표와 150 이상 벌어지면 즉시 보정합니다.', emphasis: true }
    ],
    illustration: {
      type: 'codePanels',
      props: {
        columns: 2,
        panels: [
          {
            file: 'GradPlayerController.cpp', tag: '보내는 쪽 (선이동)', accent: 'green',
            code:
'void AGradPlayerController::PlayerTick(float DeltaTime)\n' +
'{\n' +
'    Super::PlayerTick(DeltaTime);\n' +
'\n' +
'    // 서버 승인을 기다리지 않고 먼저 이동(선이동)\n' +
'    if (DesiredInput != FVector2D::ZeroVector)\n' +
'        NetComponent->SetMoveState(Protocol::MOVE_STATE_RUN);\n' +
'\n' +
'    Protocol::C_MOVE movePkt;\n' +
'    Protocol::PosInfo* info = movePkt.mutable_info();\n' +
'    info->set_move_state(NetComponent->GetMoveState());\n' +
'\n' +
'    // 좌표뿐 아니라 이동 방향 벡터도 함께 전송\n' +
'    info->set_d_x(DesiredMoveDirection.X);\n' +
'    info->set_d_y(DesiredMoveDirection.Y);\n' +
'    info->set_d_z(DesiredMoveDirection.Z);\n' +
'    SendPacket(movePkt);\n' +
'}'
          },
          {
            file: 'GradNetCharacter.cpp', tag: '받는 쪽 (보정)', accent: 'green',
            code:
'void AGradNetCharacter::MoveDirectionTick(float DeltaTime)\n' +
'{\n' +
'    const FVector Target(Pos->x(), Pos->y(), Pos->z());\n' +
'\n' +
'    if (Pos->move_state() == Protocol::MOVE_STATE_RUN)\n' +
'    {\n' +
'        // 좌표가 아니라 이동 방향 벡터로 선반영\n' +
'        // → 빠른 방향 전환에도 즉각 반응\n' +
'        const FVector Dir(Pos->d_x(), Pos->d_y(), Pos->d_z());\n' +
'        AddMovementInput(Dir);\n' +
'    }\n' +
'\n' +
'    // 서버 좌표와 오차가 임계값을 넘을 때만 스냅 보정\n' +
'    if (FVector::Dist(GetActorLocation(), Target) >= 150.f)\n' +
'        SetActorLocation(Target);\n' +
'\n' +
'    HandlePitch(Pos->pitch(), Pos->yaw());\n' +
'}'
          }
        ]
      }
    }
  },

  /* ── 7. 결과 · 검증 (스트레스 테스트 스크린샷) ─────────────── */
  {
    accent: 'gold',
    eyebrow: '결과 · 검증',
    title: [
      { text: '더미 클라이언트로 직접 부하를 걸어 — ' },
      { text: '「동접 500명까지 안정 동작을 확인했습니다」', emphasis: true }
    ],
    links: [
      { label: '데모 영상 보기 (YouTube)', icon: 'play', url: 'https://www.youtube.com/watch?v=TY1KEuHsWEE' }
    ],
    caption: [
      { text: '설계가 실제로 버티는지 숫자로 확인해야 한다고 봤습니다 — ' },
      { text: 'JobQueue 하나에 8명을 기준으로 스트레스 테스트를 반복해 병목 없음을 검증했습니다.', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'check',
            label: 'JobQueue 8인 기준 · 동접 500명 안정',
            desc: '수백 개의 더미 클라이언트를 동시에 접속시켜 서버에 직접 부하를 걸었습니다. Room 하나(JobQueue 1개)에 8명을 배치한 상태에서 동접 500명까지, 큐가 밀리거나 멈추는 현상 없이 안정적으로 동작하는 것을 확인했습니다.',
            shot: 'assets/img/ch3-stresstest.png',
            shotFit: 'contain',
            shotAlt: '더미 클라이언트를 동시 접속시켜 서버 스트레스 테스트를 진행하는 인게임 화면'
          }
        ]
      }
    }
  }
]);
