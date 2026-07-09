const repoBase = "https://github.com/sj97p/DualMind-CodeMap/blob/main/";

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
};

let mermaidReady = false;

window.selectNode = (id) => {
  if (nodes[id] || classes[id]) {
    selectNode(id);
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initMermaid();
  buildTree();
  document.addEventListener("click", handleDocumentClick);
  document.getElementById("reset-view").addEventListener("click", () => selectNode("overview"));
  selectNode("overview");
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
    selectNode(treeButton.dataset.id);
    return;
  }

  const fallbackNode = event.target.closest("[data-node]");
  if (fallbackNode) {
    event.preventDefault();
    selectNode(fallbackNode.dataset.node);
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

async function selectNode(id) {
  state.selected = id;
  const item = nodes[id] || classes[id];
  if (!item) return;

  document.querySelectorAll("[data-id]").forEach((el) => {
    el.classList.toggle("active", el.dataset.id === id);
  });

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

  renderClassList(item.classes || (classes[id] ? [id] : []), id);
  renderGraph(item.graph || classGraph(id));
  await renderCode(item, id);
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
    chip.addEventListener("click", () => selectNode(classId));
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
  } catch (error) {
    renderFallbackGraph(graph, `Mermaid render failed: ${error.message}`);
  }
}

function renderFallbackGraph(graph, message = "") {
  const targets = graphTargets[state.selected] || [];
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
  const targets = graphTargets[state.selected] || [];
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
          selectNode(id);
        });
      });
  });
}

function classGraph(id) {
  const item = classes[id];
  const title = item?.title || id;
  return `classDiagram
    class ${sanitizeMermaidId(title)} {
      ${item?.summary ? "+role" : "+selected"}
    }`;
}

function sanitizeMermaidId(value) {
  return String(value).replace(/[^a-zA-Z0-9_]/g, "_");
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

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
