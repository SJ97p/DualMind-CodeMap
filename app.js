const repoBase = "https://github.com/sj97p/DualMind-CodeMap/blob/main/";

const evidence = {
  stageSequence: {
    src: "assets/evidence/stage-sequence-flow.gif",
    caption:
      "나레이션이 진행되는 동안 입력을 제한하고, 나레이션 종료 이후 다음 퍼즐/문 개방이 이어지도록 Stage 코루틴 흐름으로 순차 처리했습니다.",
  },
  brainMaze: {
    src: "assets/evidence/brain-maze-entry.gif",
    caption:
      "DFS 백트래킹으로 생성한 미로에 진입한 뒤, 플레이어가 지나간 바닥을 시각적으로 남겨 탐색 피로도를 줄였습니다.",
  },
  pulseScan: {
    src: "assets/evidence/pulse-scan.gif",
    caption:
      "중심에서 퍼져나가는 파장 연출과 OverlapSphere 기반 판정을 맞추어, 보이지 않는 오브젝트가 능력 사용에 반응하는 경험을 만들었습니다.",
  },
  personalitySwitching: {
    src: "assets/evidence/personality-switching.gif",
    caption:
      "인격 전환 시 화면 페이드를 통해 상태 전환을 숨기고, 카메라/입력/오디오 상태를 함께 갱신했습니다.",
  },
};

const nodes = {
  overview: {
    kind: "Overview",
    title: "전체 시스템 구조",
    summary:
      "DualMind는 내레이션 중심 진행, 절차적 미로, 두 인격 전환, Pulse Scan을 Stage 시퀀스로 연결한 1인칭 퍼즐 게임입니다.",
    problem:
      "각 기능이 따로 동작하면 내레이션, 입력 가능 상태, 화면 전환, 퍼즐 Trigger, 씬 전환이 서로 어긋날 수 있습니다.",
    solution:
      "Stage Sequence를 중심 흐름으로 두고, Maze, Personality, Pulse, Audio 시스템을 독립 모듈로 나눠 연결했습니다.",
    classes: ["Stage", "StageManager", "MazeGenerator", "PersonalityManager", "PulseWave"],
    graph: `flowchart TD
      stage["Stage Sequence"]
      maze["Brain Maze"]
      personality["Personality Switching"]
      pulse["Pulse Scan"]
      audio["Audio / Narration"]
      interaction["Interaction"]
      ending["Multi Ending"]

      stage --> maze
      stage --> personality
      stage --> pulse
      stage --> audio
      stage --> ending
      personality --> interaction
      pulse --> maze

      click stage call selectNode("stage-sequence")
      click maze call selectNode("brain-maze")
      click personality call selectNode("personality-switching")
      click pulse call selectNode("pulse-scan")
      click audio call selectNode("audio-narration")
      click interaction call selectNode("interaction")
      click ending call selectNode("multi-ending")`,
  },
  "stage-sequence": {
    kind: "System",
    title: "Stage Sequence System",
    summary:
      "내레이션, 화면 암전/개안, 입력 잠금, 퍼즐 Trigger, 씬 전환을 코루틴 순서로 제어하는 진행 시스템입니다.",
    problem:
      "내레이션 종료, 입력 허용, 화면 페이드, 퍼즐 완료 대기가 흩어지면 스토리 진행 순서가 꼬일 수 있었습니다.",
    solution:
      "Stage 추상 클래스에 공통 기능을 두고, 각 스테이지가 SequenceRoutine 코루틴으로 자신의 진행 순서를 작성하게 했습니다.",
    doc: "docs/systems/stage-sequence.md",
    classes: ["Stage", "Stage1", "StageManager", "GameManager", "PostProcessingControl", "SoundManager"],
    graph: `flowchart TD
      scene["Scene Loaded"]
      manager["StageManager"]
      stage["Stage"]
      routine["SequenceRoutine"]
      narration["DoNarration"]
      eyes["SetEyes / Input"]
      wait["WaitForTrigger"]
      next["Next Step"]
      game["GameManager"]

      scene --> manager --> stage --> routine
      routine --> narration
      routine --> eyes
      routine --> wait --> next
      next --> game

      click manager call selectNode("StageManager")
      click stage call selectNode("Stage")
      click routine call selectNode("Stage1")
      click eyes call selectNode("PostProcessingControl")
      click game call selectNode("GameManager")
      click narration call selectNode("SoundManager")`,
  },
  "brain-maze": {
    kind: "System",
    title: "Brain Maze System",
    summary:
      "감정 테마별 미로를 생성하고, 시작점에서 가장 먼 목표를 배치하는 절차적 퍼즐 시스템입니다.",
    problem:
      "고정 미로는 반복성과 단계별 변화를 보여주기 어렵고, 목표가 가까우면 탐색 경험이 약해집니다.",
    solution:
      "DFS 백트래킹으로 미로를 생성하고, BFS로 가장 먼 도달 가능 셀을 목표 지점으로 선택했습니다.",
    doc: "docs/systems/brain-maze.md",
    classes: ["MazeGenerator", "BrainNerve", "ShaderColorTransition", "Stage1"],
    graph: `flowchart TD
      create["CreateMaze(ColorType)"]
      clear["ClearMaze"]
      generate["GenerateMaze"]
      dfs["DFS Backtracking"]
      extra["CreateExtraPaths"]
      goal["SetStartAndGoal"]
      bfs["BFS Farthest Cell"]
      build["BuildMaze"]
      nerve["SetPlayerAndNerve"]

      create --> clear
      create --> generate --> dfs --> extra
      create --> goal --> bfs
      create --> build
      create --> nerve

      click create call selectNode("MazeGenerator")
      click nerve call selectNode("BrainNerve")
      click build call selectNode("MazeGenerator")
      click goal call selectNode("MazeGenerator")`,
  },
  "personality-switching": {
    kind: "System",
    title: "Personality Switching System",
    summary:
      "두 인격 전환 시 PlayerController, Camera, AudioListener, Interaction 기준을 함께 바꾸는 시스템입니다.",
    problem:
      "플레이어 오브젝트만 바꾸면 입력 대상, 카메라, 오디오 리스너, Raycast 기준이 서로 어긋날 수 있었습니다.",
    solution:
      "PersonalityManager가 현재 인격 인덱스를 관리하고, 전환 이벤트로 화면 페이드와 이동 가능 상태를 함께 제어했습니다.",
    doc: "docs/systems/personality-switching.md",
    classes: ["PersonalityManager", "PlayerController", "InteractionManager", "PostProcessingControl", "InputSystem"],
    graph: `flowchart LR
      input["InputSystem.OnSwitchPressed"]
      manager["PersonalityManager"]
      player["PlayerController"]
      camera["Camera"]
      listener["AudioListener"]
      interaction["InteractionManager.SetCam"]
      fade["PostProcessingControl.TryFade"]

      input --> manager
      manager --> player
      manager --> camera
      manager --> listener
      manager --> interaction
      manager --> fade

      click input call selectNode("InputSystem")
      click manager call selectNode("PersonalityManager")
      click player call selectNode("PlayerController")
      click interaction call selectNode("InteractionManager")
      click fade call selectNode("PostProcessingControl")`,
  },
  "pulse-scan": {
    kind: "System",
    title: "Pulse Scan System",
    summary:
      "스캔 입력을 받아 구형 범위를 확장하고, 감지된 퍼즐 오브젝트가 인터페이스로 반응하게 만드는 시스템입니다.",
    problem:
      "Pulse가 특정 퍼즐 클래스를 직접 알면 새 반응 오브젝트를 추가할 때마다 Pulse 코드를 수정해야 했습니다.",
    solution:
      "PulseWave는 탐지만 담당하고, BrainNerve나 BridgePulseReceiver 같은 오브젝트는 IPulseReactive로 반응하게 분리했습니다.",
    doc: "docs/systems/pulse-scan.md",
    classes: ["PulseWave", "BrainNerve", "BridgePulseReceiver", "IPulseReactive", "PulseVisualizer"],
    graph: `flowchart TD
      scan["InputSystem.OnScanPressed"]
      wave["PulseWave.EmitPulse"]
      expand["ExpandPulse"]
      visual["PulseVisualizer"]
      overlap["Physics.OverlapSphere"]
      dedupe["HashSet Deduplicate"]
      reactive["IPulseReactive"]
      nerve["BrainNerve"]
      bridge["BridgePulseReceiver"]

      scan --> wave --> expand
      expand --> visual
      expand --> overlap --> dedupe --> reactive
      reactive --> nerve
      reactive --> bridge

      click wave call selectNode("PulseWave")
      click visual call selectNode("PulseVisualizer")
      click reactive call selectNode("IPulseReactive")
      click nerve call selectNode("BrainNerve")
      click bridge call selectNode("BridgePulseReceiver")`,
  },
  "audio-narration": {
    kind: "System",
    title: "Audio / Narration Flow",
    summary:
      "내레이션 중심 진행을 Stage 시퀀스와 연결하고, BGM/SFX/Narration 재생을 분리한 오디오 흐름입니다.",
    problem:
      "내레이션 재생과 Stage 진행이 따로 움직이면 플레이어가 듣는 정보와 실제 입력 가능 상태가 어긋납니다.",
    solution:
      "Stage가 SoundManager.PlayNarration을 호출하고, PoolManager가 용도별 AudioSource 풀을 재사용하도록 구성했습니다.",
    doc: "docs/systems/audio-narration.md",
    classes: ["Stage", "SoundManager", "PoolManager", "PostProcessingControl"],
    graph: `flowchart LR
      stage["Stage.DoNarration"]
      sound["SoundManager"]
      pool["PoolManager"]
      source["AudioSource Pool"]
      mixer["AudioMixer Snapshot"]
      fade["PostProcessingControl"]

      stage --> sound --> pool --> source
      sound --> mixer
      stage --> fade

      click stage call selectNode("Stage")
      click sound call selectNode("SoundManager")
      click pool call selectNode("PoolManager")
      click fade call selectNode("PostProcessingControl")`,
  },
  interaction: {
    kind: "System",
    title: "Interaction System",
    summary:
      "현재 카메라 기준 화면 중앙 Raycast로 상호작용 대상을 찾고, IPlayerInteractable 구현체를 호출합니다.",
    problem:
      "두 인격 구조에서는 활성 카메라가 바뀌므로 상호작용 Raycast 기준도 함께 바뀌어야 했습니다.",
    solution:
      "PersonalityManager가 활성 카메라를 바꿀 때 InteractionManager.SetCam을 호출하도록 연결했습니다.",
    classes: ["InteractionManager", "IPlayerInteractable", "Door", "BrainNerve", "PersonalityManager"],
    graph: `flowchart LR
      camera["Active Camera"]
      ray["Center Raycast"]
      target["Current Target"]
      contract["IPlayerInteractable"]
      interact["Interact()"]

      camera --> ray --> target --> contract --> interact

      click ray call selectNode("InteractionManager")
      click contract call selectNode("IPlayerInteractable")
      click interact call selectNode("BrainNerve")`,
  },
  "multi-ending": {
    kind: "System",
    title: "Multi Ending Flow",
    summary:
      "퀘스트 완료 수를 기준으로 Stage3 이후 Bad, Normal, Happy Ending으로 분기합니다.",
    problem:
      "각 퍼즐 결과가 최종 엔딩에 영향을 주려면 스테이지 사이에서 유지되는 진행 상태가 필요했습니다.",
    solution:
      "GameManager가 QuestComplete 카운트를 관리하고, Stage3가 완료 수를 기준으로 엔딩 StageID를 선택합니다.",
    classes: ["GameManager", "Stage3", "BadEnding", "NormalEnding", "HappyEnding"],
    graph: `flowchart TD
      stage1["Stage1 QuestComplete"]
      stage2["Stage2 QuestComplete"]
      manager["GameManager Count"]
      stage3["Stage3 Fight Result"]
      bad["BadEnding"]
      normal["NormalEnding"]
      happy["HappyEnding"]

      stage1 --> manager
      stage2 --> manager
      manager --> stage3
      stage3 --> bad
      stage3 --> normal
      stage3 --> happy

      click manager call selectNode("GameManager")
      click stage3 call selectNode("Stage3")`,
  },
};

const portfolioCopy = {
  overview: {
    title: "전체 시스템 구조",
    summary:
      "DualMind는 나레이션 중심 진행, 감정 미로, 두 인격 전환, Pulse Scan을 Stage 시퀀스로 연결한 1인칭 퍼즐 게임입니다.",
    problem:
      "스토리 게임의 흐름을 유지하면서도 퍼즐, 입력, 화면 전환, 오디오, 엔딩 분기를 하나의 플레이 경험으로 연결하는 것이 목표였습니다.",
    solution:
      "각 기능을 독립적으로 만들면 상태가 흩어질 수 있어, Stage Sequence를 중심 흐름으로 두고 미로, 인격 전환, Pulse, 오디오를 연결했습니다.",
    final:
      "Stage가 순차 진행을 담당하고, MazeGenerator, PersonalityManager, PulseWave, SoundManager가 각각의 기능을 모듈로 수행합니다. 전체 구조는 시스템 노드에서 시작해 하위 클래스와 실제 코드로 내려가며 탐색할 수 있게 구성했습니다.",
    next:
      "초기 개인 프로젝트라 일부 시스템은 Stage에 절차가 집중되어 있습니다. 이후에는 기믹 단위 시퀀스 컴포넌트와 ScriptableObject 기반 데이터 흐름으로 더 분리할 수 있습니다.",
    evidence: [evidence.stageSequence, evidence.brainMaze, evidence.pulseScan, evidence.personalitySwitching],
  },
  "stage-sequence": {
    summary:
      "나레이션, 화면 전환, 입력 제한, 퍼즐 Trigger 대기를 코루틴 순서로 제어하는 진행 시스템입니다.",
    problem:
      "처음에는 스테이지 진행을 비동기식으로 처리하려 했지만, 나레이션이 끝난 뒤 문을 열거나 퍼즐을 활성화하는 순차 처리가 필요했습니다. 나레이션 중 플레이어가 움직이거나 상호작용하면 몰입감과 상태 일관성이 깨질 수 있어, 진행 순서를 책임지는 객체가 필요하다고 판단했습니다.",
    solution:
      "공통 기능은 Stage 추상 클래스에 두고, 각 스테이지별 차이는 SequenceRoutine에서 구현했습니다. WaitForTrigger, DoNarration, SetEyes, 입력 제한을 한 흐름 안에 묶어 나레이션-대기-퍼즐-다음 진행이 끊기지 않게 구성했습니다.",
    final:
      "StageManager가 씬 로드 후 현재 Stage를 찾고 StartStage를 호출합니다. Stage는 SequenceRoutine 코루틴에서 나레이션, 화면 페이드, 입력 가능 상태, Trigger 대기를 순서대로 실행하며, GameManager와 연결되어 다음 Stage나 엔딩 흐름으로 넘어갑니다.",
    next:
      "지금 구조는 Stage가 많은 절차를 직접 들고 있어 기믹별 책임 분리가 부족합니다. 이후에는 기믹 단위 시퀀스 컴포넌트나 ScriptableObject 기반 단계 데이터로 분리해, 비동기 흐름 안에서도 절차적 진행을 더 유연하게 구성할 수 있습니다.",
    evidence: [evidence.stageSequence],
  },
  "brain-maze": {
    summary:
      "감정 테마의 미로를 자동 생성하고, 시작점에서 가장 먼 목표를 배치하는 뇌신경 퍼즐 시스템입니다.",
    problem:
      "플레이어가 감정을 찾아 헤매는 경험을 주기 위해 처음부터 자동 생성 미로를 생각했습니다. 다만 목표가 너무 가까우면 탐색 경험이 약해지고, 반대로 길 찾기가 불쾌해지면 퍼즐보다 피로감이 커질 수 있었습니다.",
    solution:
      "DFS 백트래킹으로 모든 구역이 연결되면서도 단일 경로성이 강한 미로를 만들고, BFS로 시작점에서 가장 먼 도달 가능 지점을 목표로 선택했습니다. 테스트 중 탐색 피로를 줄이기 위해 밟은 바닥이 빛나도록 처리했습니다.",
    final:
      "MazeGenerator가 CreateMaze에서 ClearMaze, GenerateMaze, SetStartAndGoal, BuildMaze, SetPlayerAndNerve를 순차 실행합니다. DFS는 미로 연결성을 보장하고, BFS는 목표 지점 배치 기준을 제공하며, BrainNerve는 최종 상호작용 목표로 배치됩니다.",
    next:
      "개발 기간상 BrainNerve의 역할 분리와 미로 패턴 다양화까지 깊게 다듬지는 못했습니다. 이후에는 감정별 미로 규칙, 난이도 곡선, 목표 유도 장치, 디버그 시각화를 더 강화할 수 있습니다.",
    evidence: [evidence.brainMaze],
  },
  "personality-switching": {
    summary:
      "스토리의 두 인격 구조를 플레이어, 카메라, AudioListener, 입력 상태 전환으로 구현한 시스템입니다.",
    problem:
      "초기에는 오브젝트 활성/비활성만으로 전환했지만, 실제로는 이동 가능 상태, 카메라 기준, AudioListener, 상호작용 기준이 함께 바뀌어야 했습니다.",
    solution:
      "PersonalityManager가 현재 인격 인덱스를 관리하고, 이벤트로 PlayerController의 이동 가능 상태를 제어합니다. 전환 중에는 눈을 감고 뜨는 페이드 연출을 통해 상태 변경을 숨기고 몰입감을 유지했습니다.",
    final:
      "InputSystem의 전환 입력이 PersonalityManager로 전달되고, PersonalityManager는 활성 플레이어, 카메라, AudioListener, InteractionManager의 카메라 기준, PostProcessingControl 페이드를 함께 갱신합니다.",
    next:
      "캐릭터별 능력 차이와 성장 요소를 더 강화하지 못했습니다. 이후에는 애니메이션, 카메라 블렌딩, 전환 쿨타임, 능력별 상태머신을 추가해 더 섬세한 전환 경험을 만들 수 있습니다.",
    evidence: [evidence.personalitySwitching],
  },
  "pulse-scan": {
    summary:
      "중심에서 퍼져나가는 파장을 통해 보이지 않는 오브젝트가 반응하도록 만든 탐지 시스템입니다.",
    problem:
      "정신세계에서 파장을 쏘아 눈에 보이지 않는 것을 드러내는 경험을 만들고 싶었습니다. 감지 대상이 늘어날 때 Pulse 코드가 특정 오브젝트에 직접 종속되면 확장성이 떨어질 수 있었습니다.",
    solution:
      "PulseWave는 OverlapSphere 기반 감지와 중복 제거만 담당하고, 실제 반응은 IPulseReactive 구현체에 맡겼습니다. 시각화와 판정을 맞추기 위해 PulseVisualizer를 분리해 연출 크기와 판정 반경을 조율했습니다.",
    final:
      "InputSystem.OnScanPressed가 PulseWave.EmitPulse를 호출하고, ExpandPulse가 반경을 키우며 Physics.OverlapSphere로 대상을 감지합니다. 감지된 대상 중 IPulseReactive를 구현한 BrainNerve, BridgePulseReceiver만 OnPulseHit로 반응합니다.",
    next:
      "BrainNerve와 BridgePulseReceiver의 반응 방식을 더 데이터 기반으로 묶을 수 있었습니다. 이후에는 반응 우선순위, 레이어 디버그 시각화, 판정 범위 튜닝 도구를 추가할 수 있습니다.",
    evidence: [evidence.pulseScan],
  },
  interaction: {
    summary:
      "상호작용 가능한 대상을 인터페이스로 통일하고, 화면 중앙 Raycast로 플레이어 시선 기반 상호작용을 구현한 시스템입니다.",
    problem:
      "문, 레버, 신경 등 서로 다른 오브젝트를 같은 방식으로 호출해야 했고, 나레이션이나 연출 중에는 상호작용을 막아야 했습니다.",
    solution:
      "IPlayerInteractable로 Interact, Highlight, GetPrompt 계약을 맞추고, InteractionManager가 현재 카메라 기준 중앙 Raycast로 대상을 찾아 호출합니다.",
    final:
      "InputSystem.OnInteractPressed가 InteractionManager.TryInteract로 연결되고, 현재 대상이 IPlayerInteractable이면 Interact를 호출합니다. Highlight는 현재 상호작용 대상을 시각적으로 알려주는 공통 피드백으로 사용됩니다.",
    next:
      "IPlayerInteractable보다 IInteractable이 더 일반적인 이름일 수 있었습니다. 이후에는 프롬프트 UI, 다중 대상 우선순위, 거리/레이어 판정을 더 정교화할 수 있습니다.",
    evidence: [],
  },
  "audio-narration": {
    summary:
      "나레이션을 게임 진행의 트리거로 사용해 스토리 전달과 플레이 흐름을 연결한 오디오 시스템입니다.",
    problem:
      "나레이션이 끝난 뒤 플레이어 이동, 문 개방, 퍼즐 활성화가 이어져야 했고, 나레이션 중 입력이 가능하면 몰입감이 떨어질 수 있었습니다.",
    solution:
      "Stage.DoNarration에서 SoundManager를 호출하고 클립 길이만큼 기다린 뒤 다음 단계로 넘어가게 했습니다. AudioSource는 PoolManager에서 재사용해 반복 생성 비용을 줄였습니다.",
    final:
      "SoundManager는 BGM, SFX, Narration을 분리된 API와 MixerGroup으로 제공하고, PoolManager가 용도별 AudioSource 풀에서 실제 재생을 담당합니다.",
    next:
      "자막, Timeline, 나레이션 타입 데이터화가 있었다면 더 안정적으로 연출할 수 있었습니다. 기다려야 하는 나레이션과 배경처럼 재생되는 나레이션을 명확히 타입화할 여지가 있습니다.",
    evidence: [evidence.stageSequence],
  },
  "multi-ending": {
    summary:
      "플레이어의 이전 퍼즐 수행 결과가 최종 인격 융합률과 엔딩 분기에 반영되도록 만든 최종 분기 흐름입니다.",
    problem:
      "스토리 게임의 묘미를 살리기 위해 플레이 결과가 마지막 엔딩에 반영되어야 했습니다.",
    solution:
      "GameManager의 questCompletionRate로 이전 퍼즐 결과를 누적하고, Stage3에서 해당 값을 기준으로 마지막에 이동할 엔딩 씬을 선택했습니다.",
    final:
      "Stage1/Stage2의 QuestComplete 결과가 GameManager에 누적되고, Stage3의 최종 결과와 함께 Bad, Normal, Happy Ending으로 분기합니다.",
    next:
      "엔딩 조건과 마지막 인격과의 싸움 연출을 더 잘 보여주지 못한 점이 아쉽습니다. 이후에는 엔딩 조건 가시화, 분기 로그, 선택 결과 피드백을 강화할 수 있습니다.",
    evidence: [],
  },
};

const classes = {
  Stage: {
    kind: "Class",
    title: "Stage",
    summary: "스테이지 진행 공통 기반 클래스입니다.",
    problem: "스테이지마다 내레이션, 입력 제어, Trigger 대기를 반복 구현하면 흐름이 분산됩니다.",
    solution: "추상 SequenceRoutine과 공통 코루틴 헬퍼로 각 Stage의 진행 흐름을 통일했습니다.",
    code: "src/Assets/Scripts/Core/Stage/Stage.cs",
    doc: "docs/classes/Stage.md",
  },
  Stage1: {
    kind: "Class",
    title: "Stage1",
    summary: "Brain Maze와 Pulse Lever 흐름을 진행하는 Stage입니다.",
    problem: "감정 테마별 미로 생성과 내레이션, Trigger 대기를 순서대로 연결해야 했습니다.",
    solution: "StartBrainConnect 코루틴에서 내레이션, CreateMaze, SetEyes, WaitForTrigger를 순차 실행했습니다.",
    code: "src/Assets/Scripts/Stage/Stage1.cs",
    doc: "docs/classes/Stage1.md",
  },
  StageManager: {
    kind: "Class",
    title: "StageManager",
    summary: "씬 로드 후 현재 Stage를 찾아 시작하는 관리자입니다.",
    problem: "씬마다 Stage 시작 지점을 일관되게 호출할 필요가 있었습니다.",
    solution: "SceneManager.sceneLoaded 이벤트에서 FindFirstObjectByType<Stage>() 후 StartStage를 호출합니다.",
    code: "src/Assets/Scripts/Core/Managers/StageManager.cs",
    doc: "docs/classes/StageManager.md",
  },
  GameManager: {
    kind: "Class",
    title: "GameManager",
    summary: "씬 전환과 퀘스트 완료 수를 관리합니다.",
    problem: "스테이지 사이에서 퀘스트 완료 수를 유지해 엔딩 분기에 사용해야 했습니다.",
    solution: "QuestComplete 카운트를 누적하고 Stage3에서 GetQuestCompletionRate로 엔딩을 선택합니다.",
    code: "src/Assets/Scripts/Core/Managers/GameManager.cs",
    doc: "docs/classes/GameManager.md",
  },
  MazeGenerator: {
    kind: "Class",
    title: "MazeGenerator",
    summary: "DFS/BFS 기반 절차적 미로 생성 클래스입니다.",
    problem: "반복 가능한 미로와 충분히 먼 목표 지점이 필요했습니다.",
    solution: "DFS 백트래킹으로 미로를 만들고 BFS로 최장 도달 가능 셀을 목표로 선택했습니다.",
    code: "src/Assets/Scripts/Puzzle/BrainConnect/MazeGenerator.cs",
    doc: "docs/classes/MazeGenerator.md",
  },
  BrainNerve: {
    kind: "Class",
    title: "BrainNerve",
    summary: "미로 목표이자 Pulse에 반응하는 퍼즐 오브젝트입니다.",
    problem: "목표 오브젝트가 직접 상호작용과 Pulse 반응을 모두 처리해야 했습니다.",
    solution: "IPlayerInteractable과 IPulseReactive를 구현해 직접 상호작용과 스캔 반응을 분리했습니다.",
    code: "src/Assets/Scripts/Puzzle/BrainConnect/BrainNerve.cs",
    doc: "docs/classes/BrainNerve.md",
  },
  ShaderColorTransition: {
    kind: "Class",
    title: "ShaderColorTransition",
    summary: "ColorType에 따라 목표 오브젝트 Material을 변경합니다.",
    problem: "감정 테마별 목표 색상을 간단히 바꿀 필요가 있었습니다.",
    solution: "ColorType enum index를 Material 배열과 매핑해 SwapMaterial을 실행합니다.",
    code: "src/Assets/Scripts/Puzzle/ShaderColorTransition.cs",
  },
  PersonalityManager: {
    kind: "Class",
    title: "PersonalityManager",
    summary: "두 인격의 활성 상태를 전환합니다.",
    problem: "Player, Camera, AudioListener, Interaction 기준이 함께 바뀌어야 했습니다.",
    solution: "전환 코루틴에서 이전 인격을 끄고 새 인격을 켜며 관련 이벤트를 발행합니다.",
    code: "src/Assets/Scripts/Systems/Player/Personality/PersonalityManager.cs",
    doc: "docs/classes/PersonalityManager.md",
  },
  PlayerController: {
    kind: "Class",
    title: "PlayerController",
    summary: "현재 활성 인격의 이동과 시점 회전을 처리합니다.",
    problem: "비활성 인격이 입력을 받으면 두 플레이어 상태가 꼬일 수 있습니다.",
    solution: "PersonalityManager 이벤트로 이동 가능 상태를 제어합니다.",
    code: "src/Assets/Scripts/Systems/Player/Controllers/PlayerController.cs",
  },
  InputSystem: {
    kind: "Class",
    title: "InputSystem",
    summary: "이동, 시점, 상호작용, 전환, 스캔 입력을 이벤트로 제공합니다.",
    problem: "Stage 상태에 따라 입력 가능 여부를 제어해야 했습니다.",
    solution: "CanInput, CanSwitch, CanScan 플래그와 static Action 이벤트로 입력 흐름을 분리했습니다.",
    code: "src/Assets/Scripts/Core/Input/InputSystem.cs",
  },
  InteractionManager: {
    kind: "Class",
    title: "InteractionManager",
    summary: "현재 카메라 기준 Raycast로 상호작용 대상을 찾습니다.",
    problem: "인격 전환 시 상호작용 기준 카메라도 바뀌어야 했습니다.",
    solution: "SetCam으로 현재 카메라를 갱신하고, IPlayerInteractable 대상에 Interact를 호출합니다.",
    code: "src/Assets/Scripts/Systems/Interaction/InteractionManager.cs",
    doc: "docs/classes/InteractionManager.md",
  },
  IPlayerInteractable: {
    kind: "Interface",
    title: "IPlayerInteractable",
    summary: "플레이어 상호작용 대상의 공통 계약입니다.",
    problem: "Door, BrainNerve 등 서로 다른 오브젝트를 같은 방식으로 호출할 필요가 있었습니다.",
    solution: "Interact, Highlight, GetPrompt를 공통 인터페이스로 정의했습니다.",
    code: "src/Assets/Scripts/Interactable/Interfaces/IPlayerInteractable.cs",
  },
  PulseWave: {
    kind: "Class",
    title: "PulseWave",
    summary: "Pulse Scan 탐지 범위를 확장하고 감지 이벤트를 발행합니다.",
    problem: "스캔 탐지와 퍼즐 반응이 강하게 결합되면 확장이 어렵습니다.",
    solution: "OverlapSphere 탐지와 HashSet 중복 방지 후 IPulseReactive 반응으로 연결했습니다.",
    code: "src/Assets/Scripts/Systems/Pulse/PulseWave.cs",
    doc: "docs/classes/PulseWave.md",
  },
  PulseVisualizer: {
    kind: "Class",
    title: "PulseVisualizer",
    summary: "Pulse Scan 진행률을 시각적으로 표현합니다.",
    problem: "플레이어가 스캔 범위와 진행 상태를 눈으로 이해해야 했습니다.",
    solution: "PulseWave의 scanProgress를 받아 시각화 값을 갱신합니다.",
    code: "src/Assets/Scripts/Systems/Pulse/PulseVisualizer.cs",
  },
  IPulseReactive: {
    kind: "Interface",
    title: "IPulseReactive",
    summary: "Pulse Scan에 반응하는 오브젝트의 공통 계약입니다.",
    problem: "Pulse 시스템이 특정 퍼즐 클래스를 직접 참조하면 확장이 어렵습니다.",
    solution: "OnPulseHit 계약만 두고 실제 반응은 구현체에 위임합니다.",
    code: "src/Assets/Scripts/Interactable/Interfaces/IPulseReactive.cs",
  },
  BridgePulseReceiver: {
    kind: "Class",
    title: "BridgePulseReceiver",
    summary: "Pulse에 반응해 Invisible Bridge 퍼즐 오브젝트를 움직입니다.",
    problem: "스캔 결과가 환경 변화로 이어지는 퍼즐 반응이 필요했습니다.",
    solution: "IPulseReactive 구현체에서 DOTween으로 Bridge 위치를 변경합니다.",
    code: "src/Assets/Scripts/Puzzle/InvisibleBridge/BridgePulseReceiver.cs",
  },
  PostProcessingControl: {
    kind: "Class",
    title: "PostProcessingControl",
    summary: "Vignette와 Exposure를 조절해 암전/개안 연출을 만듭니다.",
    problem: "Stage 진행과 인격 전환에 화면 전환 연출이 함께 필요했습니다.",
    solution: "TryFade와 FadeEffect로 Post Processing 값을 보간합니다.",
    code: "src/Assets/Scripts/Systems/Post Processing/PostProcessingControl.cs",
    doc: "docs/classes/PostProcessingControl.md",
  },
  SoundManager: {
    kind: "Class",
    title: "SoundManager",
    summary: "BGM, SFX, Narration 재생의 진입점입니다.",
    problem: "오디오 타입별 재생 흐름과 MixerGroup을 분리해야 했습니다.",
    solution: "PlayBGM, PlaySFX, PlayNarration을 제공하고 PoolManager에 실제 재생을 위임합니다.",
    code: "src/Assets/Scripts/Core/Managers/SoundManager.cs",
    doc: "docs/classes/SoundManager.md",
  },
  PoolManager: {
    kind: "Class",
    title: "PoolManager",
    summary: "Narration, BGM, SFX용 AudioSource 풀을 관리합니다.",
    problem: "오디오 재생마다 Source를 만들면 반복 재생 관리가 불편합니다.",
    solution: "용도별 AudioSource 풀을 초기화하고 사용 가능한 Source를 재사용합니다.",
    code: "src/Assets/Scripts/Core/Managers/PoolManager.cs",
    doc: "docs/classes/PoolManager.md",
  },
  Stage3: {
    kind: "Class",
    title: "Stage3",
    summary: "최종 Tug of War 진행과 엔딩 분기를 담당합니다.",
    problem: "이전 퀘스트 완료 상태를 바탕으로 최종 엔딩을 선택해야 했습니다.",
    solution: "GameManager의 완료 수와 최종 입력 결과를 바탕으로 StageID를 선택합니다.",
    code: "src/Assets/Scripts/Stage/Stage3.cs",
  },
  BadEnding: {
    kind: "Class",
    title: "BadEnding",
    summary: "Bad Ending 내레이션을 재생하는 Stage입니다.",
    problem: "엔딩별 진행 흐름을 분리할 필요가 있었습니다.",
    solution: "Stage를 상속해 엔딩별 SequenceRoutine을 구현했습니다.",
    code: "src/Assets/Scripts/Stage/BadEnding.cs",
  },
  NormalEnding: {
    kind: "Class",
    title: "NormalEnding",
    summary: "Normal Ending 내레이션을 재생하는 Stage입니다.",
    problem: "엔딩별 진행 흐름을 분리할 필요가 있었습니다.",
    solution: "Stage를 상속해 엔딩별 SequenceRoutine을 구현했습니다.",
    code: "src/Assets/Scripts/Stage/NormalEnding.cs",
  },
  HappyEnding: {
    kind: "Class",
    title: "HappyEnding",
    summary: "Happy Ending 내레이션을 재생하는 Stage입니다.",
    problem: "엔딩별 진행 흐름을 분리할 필요가 있었습니다.",
    solution: "Stage를 상속해 엔딩별 SequenceRoutine을 구현했습니다.",
    code: "src/Assets/Scripts/Stage/HappyEnding.cs",
  },
  Door: {
    kind: "Class",
    title: "Door",
    summary: "상호작용 또는 StageManager 이벤트로 열리고 닫히는 문입니다.",
    problem: "스토리 진행에 따라 문 상태를 제어해야 했습니다.",
    solution: "IPlayerInteractable 구현과 StageManager.OnSetDoor 이벤트 구독을 함께 사용합니다.",
    code: "src/Assets/Scripts/Interactable/Components/Door.cs",
  },
};

const classDiagramData = {
  Stage: {
    fields: ["-Puzzle[] puzzles", "#GameObject[] players", "#StageManager stageManager", "#SoundManager soundManager", "+int Count", "#bool _isTrigger"],
    methods: ["+StartStage()", "#SequenceRoutine() IEnumerator", "#WaitForTrigger() IEnumerator", "+Trigger()", "#DoNarration(AudioClip) IEnumerator", "+SetEyes(bool) IEnumerator", "+SetPlayerSwitchable(bool)", "+SetPlayerScanable(bool)", "+SetPlayerPosition(GameObject, Transform)"],
    relations: [
      { to: "Stage1", type: "<|--", label: "inherits" },
      { to: "Stage3", type: "<|--", label: "inherits" },
      { to: "BadEnding", type: "<|--", label: "inherits" },
      { to: "NormalEnding", type: "<|--", label: "inherits" },
      { to: "HappyEnding", type: "<|--", label: "inherits" },
      { to: "StageManager", type: "-->", label: "uses" },
      { to: "SoundManager", type: "-->", label: "plays audio" },
      { to: "InputSystem", type: "-->", label: "input gates" },
      { to: "PostProcessingControl", type: "-->", label: "fade" },
    ],
  },
  Stage1: {
    fields: ["-MazeGenerator m_Generator", "-PulseLever pulseLever", "-GameObject positionOfPulsePuzzle", "-float timer", "-bool isTimerOn", "-bool timerSwitch"],
    methods: ["#SequenceRoutine() IEnumerator", "-maze() IEnumerator", "-StartBrainConnect() IEnumerator", "-StartPulseLever() IEnumerator", "+SetMazeTimer()", "-MazeTimerCoroutine() IEnumerator", "+Trigger()"],
    relations: [
      { to: "Stage", type: "-->", label: "extends" },
      { to: "MazeGenerator", type: "-->", label: "creates maze" },
      { to: "BrainNerve", type: "-->", label: "goal trigger" },
      { to: "InteractionManager", type: "-->", label: "locks interact" },
      { to: "GameManager", type: "-->", label: "quest complete" },
    ],
  },
  StageManager: {
    fields: ["-Stage currentStage", "+static event OnSetDoor"],
    methods: ["-OnSceneLoaded(Scene, LoadSceneMode)", "-Update()", "+ActivateStageTrigger()", "+SetDoor(int, bool)", "+GetCurrentStage() Stage"],
    relations: [
      { to: "Stage", type: "-->", label: "starts/ticks" },
      { to: "Door", type: "-->", label: "OnSetDoor" },
    ],
  },
  GameManager: {
    fields: ["-int questCompletionRate", "+StageID currentStageID"],
    methods: ["+LoadNextStage()", "+LoadStage(StageID)", "-OnSceneLoaded(Scene, LoadSceneMode)", "+QuestComplete()", "+GetQuestCompletionRate() int"],
    relations: [
      { to: "StageManager", type: "-->", label: "scene stage" },
      { to: "Stage3", type: "-->", label: "ending data" },
    ],
  },
  MazeGenerator: {
    fields: ["-int width", "-int height", "-float extraPathChance", "-GameObject wallPrefab", "-GameObject floorPrefab", "-GameObject player", "-GameObject nervePrefab", "+GameObject goalNerve", "+Transform startPoint", "+Transform goalPoint"],
    methods: ["+CreateMaze(ColorType)", "+GenerateMaze()", "+ClearMaze()", "-GetUnvisitedNeighbors(Vector2Int) List", "-RemoveWall(Vector2Int, Vector2Int)", "-BuildMaze()", "-SetStartAndGoal()", "+SetPlayerAndNerve(ColorType)", "-FindFarthestReachableCell(Vector2Int) Vector2Int", "-CreateExtraPaths()"],
    relations: [
      { to: "Stage1", type: "<--", label: "called by" },
      { to: "BrainNerve", type: "-->", label: "places goal" },
      { to: "ShaderColorTransition", type: "-->", label: "sets color" },
    ],
  },
  BrainNerve: {
    fields: ["-bool isOn", "-ShaderColorTransition sct"],
    methods: ["+GetPrompt() string", "+Interact()", "+Highlight(bool)", "-SetVisuable(bool) IEnumerator", "+OnPulseHit(Collider, float, float)", "-ReactPulse() IEnumerator"],
    relations: [
      { to: "IPlayerInteractable", type: "..|>", label: "implements" },
      { to: "IPulseReactive", type: "..|>", label: "implements" },
      { to: "ShaderColorTransition", type: "-->", label: "color swap" },
      { to: "GameManager", type: "-->", label: "QuestComplete" },
    ],
  },
  ShaderColorTransition: {
    fields: ["+ColorType targetType", "+float duration", "+Material[] materials", "-MeshRenderer _renderer", "-Dictionary colorMap"],
    methods: ["+ChangeColor()", "+ChangeColorByType(ColorType)", "+SwapMaterial(ColorType) IEnumerator"],
    relations: [
      { to: "BrainNerve", type: "<--", label: "used by" },
      { to: "MazeGenerator", type: "<--", label: "configured by" },
    ],
  },
  PersonalityManager: {
    fields: ["+string player1Tag", "+string player2Tag", "-float transitionDuration", "-int _currentPlayerIndex", "+static Action OnPlayerSwitched", "+static Action OnPlayerActivated", "-List<Player> players"],
    methods: ["-TrySwitch()", "-FindPersonalities()", "-AddPlayerToList(GameObject)", "-SwitchPersonality()", "+SwitchToPlayer(int) IEnumerator", "-SetPlayerActivate(Player, bool)", "+IsCurrentPlayer(PlayerController) bool", "+IsMainPersonality() bool", "+SetCamerasOn()", "+SetPlayerOff()"],
    relations: [
      { to: "InputSystem", type: "-->", label: "OnSwitchPressed" },
      { to: "PlayerController", type: "-->", label: "activates" },
      { to: "InteractionManager", type: "-->", label: "SetCam" },
      { to: "PostProcessingControl", type: "-->", label: "fade" },
    ],
  },
  PlayerController: {
    fields: ["-Transform cameraTransform", "-InputSystem _input", "-Animator _anim", "-float _moveSpeed", "-float _turnSpeed", "-bool isMovementEnabled", "-PersonalityManager _personalityManager"],
    methods: ["-InitializeInstance()", "-SetEnabled(bool, float)", "-SetMovementEnabled(bool, float) IEnumerator", "-OnActivated(PlayerController, bool)", "-HandleLook()", "-HandleMovement()", "-HandleAnimation()"],
    relations: [
      { to: "PersonalityManager", type: "<-->", label: "activation event" },
      { to: "InputSystem", type: "-->", label: "Move/Look" },
    ],
  },
  InputSystem: {
    fields: ["-KeyCode switchKey", "-KeyCode interactKey", "-KeyCode scanKey", "+static Action OnInteractPressed", "+static Action OnSwitchPressed", "+static Action OnScanPressed", "+bool CanInput", "+bool CanSwitch", "+bool CanScan", "+Vector2 Move", "+Vector2 Look"],
    methods: ["#Awake()", "-Update()", "+SetCanInput(bool)", "+SetCanSwitch(bool)", "+SetCanScan(bool)"],
    relations: [
      { to: "PersonalityManager", type: "-->", label: "switch event" },
      { to: "InteractionManager", type: "-->", label: "interact event" },
      { to: "PulseWave", type: "-->", label: "scan event" },
      { to: "Stage", type: "<--", label: "gated by" },
    ],
  },
  InteractionManager: {
    fields: ["-float _maxDistance", "-LayerMask _interactLayer", "-Camera _cam", "-GameObject _currentTarget", "-GameObject _previousTarget", "+bool canInteract"],
    methods: ["-TryInteract()", "+SetCam(Camera)", "-UpdateInteractable()"],
    relations: [
      { to: "InputSystem", type: "<--", label: "OnInteractPressed" },
      { to: "IPlayerInteractable", type: "-->", label: "calls Interact" },
      { to: "PersonalityManager", type: "<--", label: "camera changes" },
      { to: "Door", type: "-->", label: "target" },
      { to: "BrainNerve", type: "-->", label: "target" },
    ],
  },
  IPlayerInteractable: {
    fields: [],
    methods: ["+Interact()", "+Highlight(bool)", "+GetPrompt() string"],
    relations: [
      { to: "BrainNerve", type: "<|..", label: "implemented by" },
      { to: "Door", type: "<|..", label: "implemented by" },
      { to: "InteractionManager", type: "<--", label: "queried by" },
    ],
  },
  PulseWave: {
    fields: ["-float maxRadius", "-float expandSpeed", "-LayerMask targetLayer", "+Action<Collider> OnPulseHits", "-HashSet<int> activatedIds"],
    methods: ["+EmitPulse()", "-ExpandPulse() IEnumerator"],
    relations: [
      { to: "InputSystem", type: "<--", label: "OnScanPressed" },
      { to: "PulseVisualizer", type: "-->", label: "progress visual" },
      { to: "IPulseReactive", type: "-->", label: "OnPulseHit" },
      { to: "BrainNerve", type: "-->", label: "reactive target" },
      { to: "BridgePulseReceiver", type: "-->", label: "reactive target" },
    ],
  },
  PulseVisualizer: {
    fields: ["-Transform pulseRing", "-bool isOn", "-Vector3 maxScale"],
    methods: ["+EmitPulse()", "+OnPulseUpdate(float)", "+ResetVisual()", "+SetVisualize(float)"],
    relations: [
      { to: "PulseWave", type: "<--", label: "driven by" },
    ],
  },
  IPulseReactive: {
    fields: [],
    methods: ["+OnPulseHit(Collider, float, float)"],
    relations: [
      { to: "BrainNerve", type: "<|..", label: "implemented by" },
      { to: "BridgePulseReceiver", type: "<|..", label: "implemented by" },
      { to: "PulseWave", type: "<--", label: "called by" },
    ],
  },
  BridgePulseReceiver: {
    fields: ["-GameObject[] bridges", "-bool isLeft", "-float time"],
    methods: ["+OnPulseHit(Collider, float, float)"],
    relations: [
      { to: "IPulseReactive", type: "..|>", label: "implements" },
      { to: "PulseWave", type: "<--", label: "pulse target" },
    ],
  },
  PostProcessingControl: {
    fields: ["-Volume volume", "-Bloom bloom", "-Vignette vignette", "-ColorAdjustments colorAdj", "-Coroutine currentCoroutine"],
    methods: ["+TryFade(bool, float)", "-InitializeVolume()", "+SetScreenBlack()", "+SetBloomIntensity(float)", "+SetVignetteIntensity(float)", "+SetColorAdj(float)", "+FadeEffect(bool, float) IEnumerator", "+StopCurrentFade()"],
    relations: [
      { to: "Stage", type: "<--", label: "SetEyes" },
      { to: "PersonalityManager", type: "<--", label: "switch fade" },
    ],
  },
  SoundManager: {
    fields: ["+SoundLibrary soundLibrary", "+AudioMixerSnapshot doctorSnapshot", "+AudioMixerSnapshot mentalSnapshot", "+AudioMixer audioMixer", "+AudioMixerGroup NarrationGroup", "+AudioMixerGroup bgmGroup", "+AudioMixerGroup sfxGroup"],
    methods: ["+PlaySFX(AudioClip, float)", "+PlayBGM(AudioClip, float)", "+StopBGM()", "+PlayNarration(AudioClip, float)", "+SetBGMVolume(float)", "+SetSFXVolume(float)", "+SetDoctorVoice()", "+SetMentalVoice()"],
    relations: [
      { to: "Stage", type: "<--", label: "narration/BGM" },
      { to: "PoolManager", type: "-->", label: "delegates playback" },
    ],
  },
  PoolManager: {
    fields: ["-int narrationCount", "-int bgmCount", "-int sfxCount", "+List<AudioSource> narrationPool", "+List<AudioSource> bgmPool", "+List<AudioSource> sfxPool"],
    methods: ["#Awake()", "-InitializePool(string, int) List", "+PlaySFX(AudioClip, float, AudioMixerGroup)", "+PlayBGM(AudioClip, float, AudioMixerGroup)", "+StopBGM()", "+PlayNarration(AudioClip, float, AudioMixerGroup)"],
    relations: [
      { to: "SoundManager", type: "<--", label: "used by" },
    ],
  },
  Stage3: {
    fields: ["-CameraRectSystem rectSystem", "-Transform player1", "-Camera _cam", "-StageID resultStage"],
    methods: ["#SequenceRoutine() IEnumerator", "-InitializePlayerPositionAndRotation()", "-StartFight(float) IEnumerator", "-SetResultStage()"],
    relations: [
      { to: "Stage", type: "-->", label: "extends" },
      { to: "GameManager", type: "-->", label: "completion rate" },
      { to: "PersonalityManager", type: "-->", label: "camera setup" },
    ],
  },
  BadEnding: {
    fields: [],
    methods: ["#SequenceRoutine() IEnumerator"],
    relations: [{ to: "Stage", type: "-->", label: "extends" }],
  },
  NormalEnding: {
    fields: [],
    methods: ["#SequenceRoutine() IEnumerator"],
    relations: [{ to: "Stage", type: "-->", label: "extends" }],
  },
  HappyEnding: {
    fields: [],
    methods: ["#SequenceRoutine() IEnumerator"],
    relations: [{ to: "Stage", type: "-->", label: "extends" }],
  },
  Door: {
    fields: ["-int doorNum", "-Transform target", "+bool canOpen", "-float rotationSpeed", "-float rotationAmount", "-bool isOpen", "-Quaternion closedRot", "-Quaternion openRot", "-Coroutine doorCoroutine"],
    methods: ["+GetPrompt() string", "-SetDoor(int, bool)", "+Interact()", "-ToggleDoor()", "-AnimateDoor()", "+Highlight(bool)", "-InitalizeRotation()", "-DoorMove() IEnumerator"],
    relations: [
      { to: "IPlayerInteractable", type: "..|>", label: "implements" },
      { to: "StageManager", type: "<--", label: "OnSetDoor" },
      { to: "InteractionManager", type: "<--", label: "interacted by" },
    ],
  },
};

const graphTargets = {
  overview: ["stage-sequence", "brain-maze", "personality-switching", "pulse-scan", "audio-narration", "interaction", "multi-ending"],
  "stage-sequence": ["StageManager", "Stage", "Stage1", "PostProcessingControl", "GameManager", "SoundManager"],
  "brain-maze": ["MazeGenerator", "BrainNerve", "ShaderColorTransition", "Stage1"],
  "personality-switching": ["InputSystem", "PersonalityManager", "PlayerController", "InteractionManager", "PostProcessingControl"],
  "pulse-scan": ["PulseWave", "PulseVisualizer", "IPulseReactive", "BrainNerve", "BridgePulseReceiver"],
  "audio-narration": ["Stage", "SoundManager", "PoolManager", "PostProcessingControl"],
  interaction: ["InteractionManager", "IPlayerInteractable", "Door", "BrainNerve"],
  "multi-ending": ["GameManager", "Stage3", "BadEnding", "NormalEnding", "HappyEnding"],
};

const state = {
  selected: "overview",
  activeClass: null,
  history: [],
};

let mermaidReady = false;

window.selectNode = (id) => {
  if (nodes[id] || classes[id]) {
    activateNode(id);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMermaid();
  buildTree();
  document.addEventListener("click", handleDocumentClick);
  document.getElementById("reset-view").addEventListener("click", () => activateNode("overview"));
  document.getElementById("graph-back").addEventListener("click", goBack);
  document.getElementById("modal-close").addEventListener("click", closeMediaModal);
  document.getElementById("media-modal").addEventListener("click", (event) => {
    if (event.target.id === "media-modal") closeMediaModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMediaModal();
  });
  initResizableLayout();
  activateNode("overview");
});

function initMermaid() {
  if (!window.mermaid) {
    mermaidReady = false;
    return;
  }

  window.mermaid.initialize({
    startOnLoad: false,
    securityLevel: "loose",
    theme: "base",
    themeVariables: {
      primaryColor: "#e8f1ff",
      primaryTextColor: "#17202e",
      primaryBorderColor: "#2166c2",
      lineColor: "#667085",
      secondaryColor: "#e8f7f4",
      tertiaryColor: "#fff7ed",
      fontFamily: "Segoe UI, Noto Sans KR, Arial",
    },
  });
  mermaidReady = true;
}

function handleDocumentClick(event) {
  const treeButton = event.target.closest("[data-id]");
  if (treeButton) {
    event.preventDefault();
    activateNode(treeButton.dataset.id);
    return;
  }

  const fallbackNode = event.target.closest("[data-node]");
  if (fallbackNode) {
    event.preventDefault();
    activateNode(fallbackNode.dataset.node);
  }
}

function buildTree() {
  const tree = document.getElementById("tree");
  tree.innerHTML = "";

  const groups = [
    {
      title: "Systems",
      ids: [
        "overview",
        "stage-sequence",
        "brain-maze",
        "personality-switching",
        "pulse-scan",
        "audio-narration",
        "interaction",
        "multi-ending",
      ],
    },
    {
      title: "Core Classes",
      ids: [
        "Stage",
        "Stage1",
        "MazeGenerator",
        "PersonalityManager",
        "PulseWave",
        "BrainNerve",
        "InteractionManager",
        "PostProcessingControl",
        "SoundManager",
        "PoolManager",
      ],
    },
  ];

  groups.forEach((group) => {
    const wrap = document.createElement("div");
    wrap.className = "tree-group";
    const title = document.createElement("div");
    title.className = "tree-title";
    title.textContent = group.title;
    wrap.appendChild(title);

    group.ids.forEach((id) => {
      const item = nodes[id] || classes[id];
      const button = document.createElement("button");
      button.type = "button";
      button.className = `tree-item ${classes[id] ? "child" : ""}`;
      button.dataset.id = id;
      button.textContent = item.title;
      wrap.appendChild(button);
    });

    tree.appendChild(wrap);
  });
}

async function activateNode(id, pushHistory = true) {
  if (pushHistory && state.selected && state.selected !== id) {
    state.history.push(state.selected);
  }
  state.selected = id;
  const baseItem = nodes[id] || classes[id];
  if (!baseItem) return;
  const item = { ...baseItem, ...(portfolioCopy[id] || {}) };

  document.querySelectorAll("[data-id]").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === id);
  });
  document.getElementById("graph-back").disabled = state.history.length === 0;

  document.getElementById("scope-label").textContent = item.kind || "Node";
  document.getElementById("graph-title").textContent = item.title;
  document.getElementById("breadcrumbs").textContent = classes[id]
    ? `Class / ${item.title}`
    : id === "overview"
      ? "Overview"
      : `System / ${item.title}`;

  document.getElementById("detail-kind").textContent = item.kind || "Node";
  document.getElementById("detail-title").textContent = item.title;
  document.getElementById("detail-summary").textContent = item.summary || "";
  document.getElementById("detail-problem").textContent = item.problem || "선택한 노드의 문제 정의가 없습니다.";
  document.getElementById("detail-solution").textContent = item.solution || "선택한 노드의 해결 설명이 없습니다.";

  document.getElementById("detail-problem").textContent =
    item.problem || "선택한 노드의 설계 의도가 아직 정리되지 않았습니다.";
  document.getElementById("detail-solution").textContent =
    item.solution || "진행 중 고민이나 초기 구조의 한계가 아직 정리되지 않았습니다.";
  document.getElementById("detail-final").textContent =
    item.final || "최종 구조 설명은 상위 시스템 문서에서 함께 확인할 수 있습니다.";
  document.getElementById("detail-next").textContent =
    item.next || "추가 개선 방향은 상위 시스템 문서에서 함께 확인할 수 있습니다.";

  renderClassList(item.classes || (classes[id] ? [id] : []), id);
  renderEvidence(item.evidence || []);
  renderGraph(item.graph || classGraph(id));
  await renderCode(item, id);
}

function goBack() {
  const previous = state.history.pop();
  if (previous) activateNode(previous, false);
  document.getElementById("graph-back").disabled = state.history.length === 0;
}

function renderEvidence(items) {
  const list = document.getElementById("evidence-list");
  list.innerHTML = "";

  if (!items.length) {
    list.textContent = "이 노드는 상위 시스템의 Evidence에서 함께 확인할 수 있습니다.";
    return;
  }

  items.forEach((item) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "evidence-card";
    card.innerHTML = `<img src="${escapeHtml(item.src)}" alt=""><span>${escapeHtml(item.caption)}</span>`;
    card.addEventListener("click", () => openMediaModal(item));
    list.appendChild(card);
  });
}

function openMediaModal(item) {
  const modal = document.getElementById("media-modal");
  const image = document.getElementById("modal-image");
  const caption = document.getElementById("modal-caption");
  image.src = item.src;
  image.alt = item.caption;
  caption.textContent = item.caption;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeMediaModal() {
  const modal = document.getElementById("media-modal");
  const image = document.getElementById("modal-image");
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  image.removeAttribute("src");
}

function renderClassList(classIds, activeId) {
  const list = document.getElementById("class-list");
  list.innerHTML = "";

  if (!classIds.length) {
    list.textContent = "연결된 핵심 클래스가 없습니다.";
    return;
  }

  classIds.forEach((classId) => {
    const item = classes[classId];
    if (!item) return;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip ${activeId === classId ? "active" : ""}`;
    chip.textContent = classId;
    chip.addEventListener("click", () => activateNode(classId));
    list.appendChild(chip);
  });
}

async function renderGraph(source) {
  const graph = document.getElementById("graph");
  graph.removeAttribute("data-processed");

  if (!mermaidReady) {
    renderFallbackGraph(graph);
    return;
  }

  graph.textContent = source;
  graph.className = "mermaid";
  try {
    await window.mermaid.run({ nodes: [graph] });
    bindRenderedGraphClicks();
    attachGraphMethodClicks();
  } catch (error) {
    renderFallbackGraph(graph, `Mermaid render failed: ${error.message}`);
  }
}

function renderFallbackGraph(graph, message = "") {
  const targets = getGraphTargets(state.selected);
  graph.className = "fallback-graph";
  graph.innerHTML = "";

  if (message) {
    const note = document.createElement("div");
    note.className = "fallback-node";
    note.innerHTML = `<strong>Graph fallback</strong><span>${escapeHtml(message)}</span>`;
    graph.appendChild(note);
  }

  targets.forEach((id) => {
    const item = nodes[id] || classes[id];
    if (!item) return;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "fallback-node";
    card.dataset.node = id;
    card.innerHTML = `<strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.summary || item.kind || "")}</span>`;
    graph.appendChild(card);
  });
}

function bindRenderedGraphClicks() {
  const targets = getGraphTargets(state.selected);
  const svg = document.querySelector("#graph svg");
  if (!svg) return;

  targets.forEach((id) => {
    const item = nodes[id] || classes[id];
    if (!item) return;
    const firstWord = item.title.split(" ")[0];
    const labels = Array.from(svg.querySelectorAll(".nodeLabel, .label, text, foreignObject"));
    labels
      .filter((label) => (label.textContent || "").trim().includes(firstWord))
      .forEach((label) => {
        const clickable = label.closest(".node") || label;
        clickable.style.cursor = "pointer";
        clickable.addEventListener("click", (event) => {
          event.preventDefault();
          activateNode(id);
        });
      });
  });
}

function attachGraphMethodClicks() {
  const methods = getClassMethods(state.selected);
  if (!methods.length) return;

  const svg = document.querySelector("#graph svg");
  if (!svg) return;

  const labels = Array.from(svg.querySelectorAll("text, .nodeLabel, .label, foreignObject"));
  methods.forEach((methodName) => {
    labels
      .filter((label) => (label.textContent || "").includes(methodName))
      .forEach((label) => {
        label.classList.add("graph-method-clickable");
        label.addEventListener("click", (event) => {
          event.preventDefault();
          event.stopPropagation();
          jumpToMethod(methodName);
        });
      });
  });
}

function classGraph(id) {
  const item = classes[id];
  const diagram = classDiagramData[id];
  const classId = sanitizeMermaidId(id);
  const lines = ["classDiagram"];
  const members = [...(diagram?.fields || []), ...(diagram?.methods || [])];

  lines.push(`  class ${classId} {`);
  if (members.length) {
    members.forEach((member) => lines.push(`    ${escapeMermaidMember(member)}`));
  } else {
    lines.push(`    +${escapeMermaidMember(item?.kind || "selected")}`);
  }
  lines.push("  }");

  (diagram?.relations || []).forEach((relation) => {
    const targetId = sanitizeMermaidId(relation.to);
    const label = relation.label ? ` : ${relation.label}` : "";
    lines.push(`  ${classId} ${relation.type} ${targetId}${label}`);
  });

  getGraphTargets(id).forEach((targetId) => {
    if (classes[targetId] || nodes[targetId]) {
      lines.push(`  click ${sanitizeMermaidId(targetId)} call selectNode("${targetId}")`);
    }
  });

  return lines.join("\n");
}

function sanitizeMermaidId(value) {
  return String(value).replace(/[^a-zA-Z0-9_]/g, "_");
}

function escapeMermaidMember(value) {
  return String(value).replace(/[{}<>]/g, "");
}

function getGraphTargets(id) {
  if (graphTargets[id]) return graphTargets[id];
  return [...new Set((classDiagramData[id]?.relations || []).map((relation) => relation.to))].filter(
    (targetId) => classes[targetId] || nodes[targetId],
  );
}

async function renderCode(item, id) {
  const code = document.getElementById("code-preview");
  const link = document.getElementById("code-link");
  const file = item.code || firstCodeForNode(item);

  if (!file) {
    code.textContent = "관련 코드 파일이 없습니다. 왼쪽 트리에서 클래스를 선택해 주세요.";
    link.href = item.doc || "./docs/index.md";
    link.textContent = item.doc ? "Open docs" : "Open docs index";
    return;
  }

  const encoded = encodePath(file);
  link.href = `${repoBase}${encoded}`;
  link.textContent = "Open file";

  try {
    const response = await fetch(encoded);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const text = await response.text();
    code.textContent = trimCode(text);
  } catch (error) {
    code.textContent = `코드를 불러오지 못했습니다.\n${file}\n\n${error.message}`;
  }
}

function firstCodeForNode(item) {
  const classId = item.classes?.find((id) => classes[id]?.code);
  return classId ? classes[classId].code : null;
}

function encodePath(path) {
  return path
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function trimCode(text) {
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  if (lines.length <= 140) return text;
  return `${lines.slice(0, 140).join("\n")}\n\n// ... ${lines.length - 140} more lines. Open file for full source.`;
}

async function renderCode(item, id) {
  const code = document.getElementById("code-preview");
  const link = document.getElementById("code-link");
  const file = item.code || firstCodeForNode(item);
  document.getElementById("code-methods").innerHTML = "";

  if (!file) {
    code.textContent = "관련 코드 파일이 없습니다. 왼쪽 트리에서 클래스를 선택해 주세요.";
    link.href = item.doc || "./docs/index.md";
    link.textContent = item.doc ? "Open docs" : "Open docs index";
    return;
  }

  const encoded = encodePath(file);
  link.href = `${repoBase}${encoded}`;
  link.textContent = "Open file";

  try {
    const response = await fetch(encoded);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const text = await response.text();
    renderMethodChips(getClassMethods(id));
    renderCodePreview(text);
  } catch (error) {
    code.textContent = `코드를 불러오지 못했습니다.\n${file}\n\n${error.message}`;
  }
}

function renderMethodChips(methods) {
  const container = document.getElementById("code-methods");
  container.innerHTML = "";

  methods.forEach((methodName) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "method-chip";
    button.textContent = methodName;
    button.addEventListener("click", () => jumpToMethod(methodName));
    container.appendChild(button);
  });
}

function renderCodePreview(text) {
  const preview = document.getElementById("code-preview");
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  preview.innerHTML = lines
    .map((line, index) => {
      const lineNumber = index + 1;
      return `<span class="code-line" data-line="${lineNumber}"><span class="line-number">${lineNumber}</span><span class="line-code">${highlightCSharp(line) || " "}</span></span>`;
    })
    .join("");
}

function jumpToMethod(methodName) {
  const preview = document.getElementById("code-preview");
  const line = findMethodLine(methodName);
  if (!line) return;

  preview.querySelectorAll(".active-line").forEach((item) => item.classList.remove("active-line"));
  const target = preview.querySelector(`[data-line="${line}"]`);
  if (!target) return;

  target.classList.add("active-line");
  target.scrollIntoView({ block: "center", behavior: "smooth" });

  window.setTimeout(() => {
    target.classList.remove("active-line");
  }, 1800);
}

function findMethodLine(methodName) {
  const rows = [...document.querySelectorAll("#code-preview .code-line")];
  const declarationPattern = new RegExp(
    `\\b(public|private|protected|internal|static|virtual|override|async|void|bool|int|float|string|IEnumerator|Vector2|Vector3|GameObject|Transform|Coroutine)\\b.*\\b${escapeRegExp(methodName)}\\s*(?:<[^>]+>)?\\s*\\(`,
  );
  const fallbackPattern = new RegExp(`\\b${escapeRegExp(methodName)}\\s*(?:<[^>]+>)?\\s*\\(`);

  for (const row of rows) {
    const code = row.querySelector(".line-code")?.textContent || "";
    if (declarationPattern.test(code)) return Number(row.dataset.line);
  }

  for (const row of rows) {
    const code = row.querySelector(".line-code")?.textContent || "";
    if (fallbackPattern.test(code)) return Number(row.dataset.line);
  }

  return null;
}

function getClassMethods(id) {
  return [...new Set((classDiagramData[id]?.methods || []).map(extractMethodName).filter(Boolean))];
}

function extractMethodName(signature) {
  const match = String(signature).match(/([A-Za-z_]\w*)\s*\(/);
  return match ? match[1] : "";
}

function highlightCSharp(line) {
  const tokenPattern = /(\/\/.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\b\d+(?:\.\d+)?f?\b|\b[A-Za-z_]\w*\b)/g;
  const keywordPattern =
    /\b(abstract|as|base|bool|break|case|catch|class|const|continue|default|delegate|do|else|enum|event|false|finally|float|for|foreach|get|if|in|int|interface|internal|is|namespace|new|null|object|out|override|private|protected|public|readonly|return|set|static|string|struct|switch|this|throw|true|try|typeof|using|var|virtual|void|while)\b/;

  let cursor = 0;
  let html = "";
  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0];
    html += escapeHtml(line.slice(cursor, match.index));
    html += wrapCodeToken(token, keywordPattern);
    cursor = match.index + token.length;
  }
  html += escapeHtml(line.slice(cursor));
  return html;
}

function wrapCodeToken(token, keywordPattern) {
  const escaped = escapeHtml(token);
  if (token.startsWith("//")) return `<span class="tok-comment">${escaped}</span>`;
  if (token.startsWith('"') || token.startsWith("'")) return `<span class="tok-string">${escaped}</span>`;
  if (/^\d/.test(token)) return `<span class="tok-number">${escaped}</span>`;
  if (keywordPattern.test(token)) return `<span class="tok-keyword">${escaped}</span>`;
  return escaped;
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function initResizableLayout() {
  const shell = document.getElementById("app-shell");
  if (!shell) return;

  const splitters = [...document.querySelectorAll("[data-resizer]")];
  splitters.forEach((splitter) => {
    splitter.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      const mode = splitter.dataset.resizer;
      const canvas = document.querySelector(".canvas-panel");
      const detail = document.querySelector(".detail-panel");
      const code = document.querySelector(".code-panel");
      const startX = event.clientX;
      const start = {
        graph: canvas.getBoundingClientRect().width,
        detail: detail.getBoundingClientRect().width,
        code: code.getBoundingClientRect().width,
      };

      splitter.setPointerCapture(event.pointerId);

      const move = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        if (mode === "graph-detail") {
          applyLayout({
            graph: clamp(start.graph + delta, 260, 760),
            detail: clamp(start.detail - delta, 300, 760),
            code: start.code,
          });
        } else {
          applyLayout({
            graph: start.graph,
            detail: clamp(start.detail + delta, 300, 760),
            code: clamp(start.code - delta, 320, 860),
          });
        }
      };

      const up = () => {
        splitter.removeEventListener("pointermove", move);
        splitter.removeEventListener("pointerup", up);
      };

      splitter.addEventListener("pointermove", move);
      splitter.addEventListener("pointerup", up);
    });
  });
}

function applyLayout({ graph, detail, code }) {
  const shell = document.getElementById("app-shell");
  shell.style.setProperty("--graph-col", `${Math.round(graph)}px`);
  shell.style.setProperty("--detail-col", `${Math.round(detail)}px`);
  shell.style.setProperty("--code-col", `${Math.round(code)}px`);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
