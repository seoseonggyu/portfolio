/*
  Chapter 01 — LTSAgent
  ============================================================
  Standalone-viewable: open chapter-01.html to see only this chapter.
  Included in the combined deck via index.html alongside the other
  chapter-*.data.js files. See PROMPT.md for the authoring rules and
  README.md for how chapters are wired together.
*/
window.DECK_CHAPTERS = window.DECK_CHAPTERS || [];

window.DECK_CHAPTERS.push([
  {
    layout: 'cover',
    accent: 'blue',
    chapterNumber: '01',
    chapterTitle: 'Claude Code를 직접 구현하며 이해한 에이전트',
    meta: [
      { label: '역할', value: '1인 개발 · 설계부터 구현까지' },
      { label: '기술 스택', value: 'C# · .NET · Blazor · MCP' },
      { label: '작업 기간', value: '2026.06 – 2026.07' },
      { label: 'Repo', value: 'seoseonggyu/LTSAgent', url: 'https://github.com/seoseonggyu/LTSAgent' }
    ],
    summary: '많은 사람이 사용하는 Claude Code를 더 깊이 이해하기 위해, 그 핵심 동작을 직접 구현했습니다.',
    chapterSubtitle: 'Tool 호출 · MCP · 권한 승인을 밑바닥부터 만들고, 어떤 도메인에도 붙일 수 있는 에이전트로 확장했습니다.'
  },

  {
    accent: 'blue',
    eyebrow: '직접 구현',
    title: [
      { text: '필요한 도구는 ' },
      { text: '「스스로 판단해 고릅니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'wrench',
            label: 'Tool 호출 · MCP 연동',
            desc: '"사용할 수 있는 Tool이 뭐야?"라고 물으면 — web_search 같은 자체 도구부터 mcp__RevitMCP__execute_csharp처럼 MCP로 연결한 Revit 제어 도구까지 스스로 나열해 답합니다. 무엇을 쓸지는 남이 정해주지 않고, 에이전트가 상황에 맞게 직접 판단합니다.',
            shot: 'assets/img/tool-mcp.png',
            shotAlt: '에이전트가 사용 가능한 도구 목록을 답하는 화면'
          }
        ]
      }
    }
  },

  {
    accent: 'blue',
    eyebrow: '직접 구현',
    title: [
      { text: '실행은 마음대로 하지 않고 — ' },
      { text: '「사용자 승인을 거칩니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'shield',
            label: '권한 승인',
            desc: 'mcp__RevitMCP__execute_csharp 같은 도구를 실행하기 직전, 무엇을 하려는지 먼저 화면에 띄웁니다. 허용 · 항상 허용 · 거부 중 하나는 언제나 사용자가 직접 고르고, 에이전트가 임의로 실행을 진행하지 않습니다.',
            shot: 'assets/img/permission.png',
            shotAlt: '도구 실행 전 허용·항상 허용·거부를 묻는 권한 승인 화면'
          }
        ]
      }
    }
  },

  {
    accent: 'gold',
    eyebrow: '확장 구조',
    title: [
      { text: '상속이 아니라 등록 방식으로 — ' },
      { text: '「도구와 모델을 설계했습니다」', emphasis: true }
    ],
    caption: [
      { text: '새 도구나 새 모델을 추가할 때마다 — ' },
      { text: '구조를 바꾸지 않고도 바로 인식되도록 만들었습니다.', emphasis: true }
    ],
    illustration: {
      type: 'codePanels',
      props: {
        panels: [
          {
            file: 'WebSearch.cs',
            tag: '새 도구',
            accent: 'blue',
            code: [
              '[AgentTool("web_search", "웹을 검색합니다")]',
              'public class WebSearch : AgentTool<WebSearch.Input>',
              '{',
              '    public sealed record Input(',
              '        [property: Description("검색어")]',
              '        string Query);',
              '',
              '    // 어트리뷰트만 붙이면 레지스트리가 스캔해 자동 등록',
              '    protected override Task<ToolResult> ExecuteAsync(...)',
              '}'
            ].join('\n')
          },
          {
            file: 'Opus48.cs',
            tag: '새 모델',
            accent: 'gold',
            code: [
              '[AgentModel(Order = 1)]',
              'public class Opus48 : IModel',
              '{',
              '    public string Id => "claude-opus-4-8";',
              '    public string DisplayName => "Opus 4.8";',
              '    public int ContextWindow => 1_000_000;',
              '',
              '    // 같은 방식 — 모델도 클래스 하나 추가로 등록 끝',
              '}'
            ].join('\n')
          }
        ]
      }
    }
  },

  {
    accent: 'violet',
    eyebrow: '컨텍스트 관리',
    title: [
      { text: '얼마나 쓰고 있는지 — ' },
      { text: '「전부 숫자로 보여줍니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'panel',
            label: '항목별 사용량 집계',
            desc: 'System · REVITAGENT.md · Skills · Tools · Messages — 항목을 나눠 각각 몇 토큰을 썼는지, Available로 얼마나 남았는지까지 숫자로 보여줍니다. 시스템 프롬프트부터 프로젝트 지침, 기능, 도구까지 컨텍스트 사용량을 투명하게 공개합니다.',
            shot: 'assets/img/context-usage.png',
            shotAlt: '항목별 토큰 사용량과 잔여량을 숫자로 보여주는 컨텍스트 관리 화면'
          }
        ]
      }
    }
  },

  {
    accent: 'neutral',
    eyebrow: '생산성 도구',
    title: [
      { text: '반복되는 동작은 ' },
      { text: '「명령 하나로 줄였습니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'wrench',
            label: '슬래시 커맨드',
            desc: 'clear · compact처럼 기본 제공되는 커맨드부터 place-element처럼 직접 등록한 프로젝트 전용 커맨드까지, 같은 목록에서 바로 호출합니다. 반복되는 동작을 매번 새로 설명할 필요 없이 명령 하나로 줄였습니다.',
            shot: 'assets/img/slash-commands.png',
            shotAlt: '슬래시 커맨드 목록 화면'
          }
        ]
      }
    }
  },

  {
    accent: 'neutral',
    eyebrow: '생산성 도구',
    title: [
      { text: '새 커맨드는 ' },
      { text: '「어트리뷰트 하나로 등록됩니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'card',
            label: '등록형 기능',
            desc: '앞서 본 목록의 clear가 바로 이렇게 등록됩니다 — 어트리뷰트만 붙이면 새 커맨드가 목록에 자동으로 올라갑니다. 반복되는 지시와 절차는 이렇게 기능으로 등록해 두고, 필요할 때 바로 불러 씁니다.',
            codeFile: 'ClearCommand.cs',
            codeAccent: 'neutral',
            code: [
              '[AgentCommand("/clear", "대화 내역을 초기화합니다")]',
              'public class ClearCommand : IAgentCommand',
              '{',
              '    // 붙이기만 하면 슬래시 커맨드로 자동 등록',
              '    public IAsyncEnumerable<ChatEvent> ExecuteAsync(...)',
              '        => Session.Conversation.Clear();',
              '}'
            ].join('\n')
          }
        ]
      }
    }
  },

  {
    accent: 'neutral',
    eyebrow: '생산성 도구',
    title: [
      { text: '대화 중 원하는 대상은 ' },
      { text: '「멘션으로 바로 지정합니다」', emphasis: true }
    ],
    illustration: {
      type: 'featureShots',
      props: {
        items: [
          {
            icon: 'cursor',
            label: '멘션으로 맥락 지정',
            desc: '@를 입력하면 Chef.ACad · Chef.Toolkit처럼 실제 프로젝트 폴더 목록이 그대로 떠, 대화 중 원하는 대상을 바로 골라 전달합니다.',
            shot: 'assets/img/mention.png',
            shotAlt: '멘션으로 맥락을 지정하는 화면'
          }
        ]
      }
    }
  },

  {
    accent: 'rose',
    eyebrow: '범용성',
    title: [
      { text: '특정 앱에 묶이지 않고 — ' },
      { text: '「어떤 도메인이든」', emphasis: true }
    ],
    caption: [
      { text: '에이전트를 직접 설계해서 — ' },
      { text: '원하는 프로그램 어디에나 붙일 수 있습니다.', emphasis: true }
    ],
    illustration: {
      type: 'radialFan',
      props: {
        figureAccent: 'rose',
        panelLabels: ['Revit', 'Unreal', 'Unity', 'AutoCAD', 'Blender', 'Navisworks', 'Rhino', 'Photoshop'],
        ratioLabel: 'ONE CORE / ANY DOMAIN'
      }
    }
  },

  {
    accent: 'green',
    eyebrow: '실전 적용',
    title: [
      { text: '코드를 짜는 게 아니라 — ' },
      { text: '「실제 Revit 앱이 움직입니다」', emphasis: true }
    ],
    links: [
      { label: '데모 영상 보기 (YouTube)', url: 'https://youtu.be/zHcHvZvd-LM', icon: 'play' }
    ],
    caption: [
      { text: '"2층 가정집을 만들어줘" 한 마디면 — ' },
      { text: 'Revit이 직접 집을 지어 올립니다.', emphasis: true }
    ],
    illustration: {
      type: 'photo',
      props: {
        src: 'assets/img/ltsagent-chat-ui.png',
        alt: 'Revit에 붙는 LTSAgent 실행 화면',
        caption: 'Revit 화면 안에서 실제로 뜨는 LTSAgent 패널 — 클릭하면 데모 영상으로 이동합니다.',
        fit: 'contain',
        link: 'https://youtu.be/zHcHvZvd-LM'
      }
    }
  }
]);
