# Documentation Index

DualMind는 “두 인격이 단서를 찾고 해결하는 퍼즐 경험”에서 출발한 프로젝트입니다. 먼저 게임의 흐름을 보고, 그 흐름을 만든 시스템과 한계를 차례로 확인할 수 있게 구성했습니다.

## Recommended Reading Order

1. [README](../README.md) — 게임의 의도, 실제 플레이 흐름, 구현 범위
2. [Stage Sequence](systems/stage-sequence.md) — 스토리 진행을 `Stage`와 코루틴으로 묶은 방식
3. [Personality Switching](systems/personality-switching.md) / [Pulse Scan](systems/pulse-scan.md) — 인격 전환과 단서 탐색이 퍼즐로 연결되는 방식
4. [Brain Maze](systems/brain-maze.md) — 첫 스테이지의 미로 생성과 목표 배치
5. [Improvement Notes](improvements.md) — 당시 선택의 한계와 다음 설계
6. [Architecture Overview](architecture.md) / [Class Diagram](class-diagram.md) — 전체 관계와 클래스 상세

## System Design Notes

| 시스템 | 이 문서에서 볼 내용 |
|---|---|
| [Stage Sequence](systems/stage-sequence.md) | 내레이션 중심 진행, 입력 잠금, 화면 전환, 퍼즐 Trigger를 한 흐름으로 연결 |
| [Brain Maze](systems/brain-maze.md) | DFS/BFS를 사용해 반복 가능한 미로와 충분한 목표 동선을 생성 |
| [Personality Switching](systems/personality-switching.md) | 두 인격 전환 시 Player, Camera, AudioListener, Interaction 기준을 동기화 |
| [Pulse Scan](systems/pulse-scan.md) | 스캔 탐지와 퍼즐 반응을 인터페이스로 분리 |
| [Audio Narration](systems/audio-narration.md) | 내레이션 중심 게임에서 오디오 재생과 Stage 진행을 연결 |

## Class Detail Pages

| Class | Role | Code |
|---|---|---|
| [Stage](classes/Stage.md) | 스테이지 진행 공통 기반 | [Stage.cs](../src/Assets/Scripts/Core/Stage/Stage.cs) |
| [Stage1](classes/Stage1.md) | Brain Maze와 Pulse Lever 진행 | [Stage1.cs](../src/Assets/Scripts/Stage/Stage1.cs) |
| [StageManager](classes/StageManager.md) | 씬 로드 후 현재 Stage 시작 | [StageManager.cs](../src/Assets/Scripts/Core/Managers/StageManager.cs) |
| [GameManager](classes/GameManager.md) | 씬 전환과 엔딩 분기용 Quest 카운트 | [GameManager.cs](../src/Assets/Scripts/Core/Managers/GameManager.cs) |
| [MazeGenerator](classes/MazeGenerator.md) | 절차적 미로 생성과 목표 배치 | [MazeGenerator.cs](../src/Assets/Scripts/Puzzle/BrainConnect/MazeGenerator.cs) |
| [PersonalityManager](classes/PersonalityManager.md) | 두 인격 전환 | [PersonalityManager.cs](../src/Assets/Scripts/Systems/Player/Personality/PersonalityManager.cs) |
| [PulseWave](classes/PulseWave.md) | Pulse Scan 범위 탐지 | [PulseWave.cs](../src/Assets/Scripts/Systems/Pulse/PulseWave.cs) |
| [BrainNerve](classes/BrainNerve.md) | 미로 목표/펄스 반응 오브젝트 | [BrainNerve.cs](../src/Assets/Scripts/Puzzle/BrainConnect/BrainNerve.cs) |
| [InteractionManager](classes/InteractionManager.md) | Raycast 기반 상호작용 | [InteractionManager.cs](../src/Assets/Scripts/Systems/Interaction/InteractionManager.cs) |
| [PostProcessingControl](classes/PostProcessingControl.md) | 화면 암전/개안 연출 | [PostProcessingControl.cs](../src/Assets/Scripts/Systems/Post%20Processing/PostProcessingControl.cs) |
| [SoundManager](classes/SoundManager.md) | BGM/SFX/Narration 재생 진입점 | [SoundManager.cs](../src/Assets/Scripts/Core/Managers/SoundManager.cs) |
| [PoolManager](classes/PoolManager.md) | AudioSource 풀링 | [PoolManager.cs](../src/Assets/Scripts/Core/Managers/PoolManager.cs) |
