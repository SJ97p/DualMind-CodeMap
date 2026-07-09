# DualMind Code Map

Unity 기반 1인칭 내러티브 퍼즐 게임 **DualMind**의 코드 구조를 설명하는 포트폴리오용 레포지토리입니다.

이 레포지토리는 전체 Unity 프로젝트를 그대로 보여주기보다, **3주 1인 개발 과정에서 직접 설계한 핵심 시스템**을 중심으로 코드 구조와 문제 해결 방식을 정리합니다.

## Project Summary

| Item | Description |
|---|---|
| Project | DualMind |
| Genre | 1인칭 내러티브 퍼즐 게임 |
| Period | 2026.03.03 ~ 2026.03.23 |
| Team | 1인 개발 |
| Engine / Language | Unity / C# |
| Focus | Narrative Sequence, Procedural Maze, Personality Switching, Pulse Scan, Multi Ending |

## What I Wanted To Show

DualMind에서 가장 중요하게 본 것은 “퍼즐 기능을 많이 만드는 것”보다, **스토리 진행과 플레이 상태를 하나의 흐름으로 제어하는 구조**였습니다.

- 내레이션이 끝나는 시점에 맞춰 입력과 화면을 제어
- 퍼즐 완료 Trigger를 받아 다음 시퀀스로 진행
- 감정 테마별 미로를 절차 생성하고 목표를 배치
- 두 인격 전환 시 Player, Camera, AudioListener, Interaction 기준을 함께 전환
- Pulse Scan을 통해 숨겨진 정보를 탐지하고 퍼즐 오브젝트가 반응하도록 분리

## Core Systems

| System | Problem | Solution | Docs |
|---|---|---|---|
| Stage Sequence | 내레이션, 입력, 화면 전환, 퍼즐 완료 타이밍이 흩어질 수 있음 | Stage 기반 코루틴 시퀀스로 진행 흐름 통합 | [Stage Sequence](docs/systems/stage-sequence.md) |
| Brain Maze | 고정 미로는 반복성과 단계별 변화를 보여주기 어려움 | DFS 미로 생성 + BFS 최장 목표 탐색 | [Brain Maze](docs/systems/brain-maze.md) |
| Personality Switching | 인격 전환 시 카메라/입력/오디오 상태가 어긋날 수 있음 | PersonalityManager에서 Player, Camera, AudioListener, Interaction 기준 동시 제어 | [Personality Switching](docs/systems/personality-switching.md) |
| Pulse Scan | 스캔 기능이 특정 퍼즐에 직접 의존하면 확장성이 낮아짐 | PulseWave는 탐지만 담당하고 IPulseReactive가 반응 처리 | [Pulse Scan](docs/systems/pulse-scan.md) |
| Audio / Narration | 내레이션 중심 진행에서 오디오 재생과 시퀀스가 분리되면 흐름이 깨짐 | SoundManager/PoolManager와 Stage 시퀀스 연결 | [Audio Narration](docs/systems/audio-narration.md) |

## Architecture Map

- [Architecture Overview](docs/architecture.md)
- [Class Diagram](docs/class-diagram.md)
- [Documentation Index](docs/index.md)
- [Improvement Notes](docs/improvements.md)

## Key Class Pages

- [Stage](docs/classes/Stage.md)
- [Stage1](docs/classes/Stage1.md)
- [MazeGenerator](docs/classes/MazeGenerator.md)
- [PersonalityManager](docs/classes/PersonalityManager.md)
- [PulseWave](docs/classes/PulseWave.md)
- [BrainNerve](docs/classes/BrainNerve.md)
- [InteractionManager](docs/classes/InteractionManager.md)
- [PostProcessingControl](docs/classes/PostProcessingControl.md)

## Source Code

핵심 스크립트는 [`src/Assets/Scripts`](src/Assets/Scripts)에 정리되어 있습니다.

## Reading Guide

1. 빠르게 프로젝트 의도를 보고 싶다면 [Core Systems](#core-systems)를 먼저 읽습니다.
2. 전체 클래스 관계는 [Class Diagram](docs/class-diagram.md)에서 확인합니다.
3. 면접용 문제 해결 흐름은 [docs/systems](docs/systems) 문서를 읽습니다.
4. 구현 당시 한계와 개선 방향은 [Improvement Notes](docs/improvements.md)에 정리했습니다.

## Diagram Note

GitHub의 Mermaid 렌더러는 환경에 따라 `click` 링크가 제한될 수 있습니다. 그래서 각 다이어그램 아래에 동일한 클래스 링크 목록을 함께 제공합니다.
