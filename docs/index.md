# Documentation Index

DualMind의 코드 구조를 빠르게 읽기 위한 문서 인덱스입니다.

## Recommended Reading Order

1. [Architecture Overview](architecture.md)
2. [Class Diagram](class-diagram.md)
3. [Stage](classes/Stage.md)
4. [MazeGenerator](classes/MazeGenerator.md)
5. [PersonalityManager](classes/PersonalityManager.md)
6. [PulseWave](classes/PulseWave.md)
7. [InteractionManager](classes/InteractionManager.md)

## Core Class Pages

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
