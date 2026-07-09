# DualMind Code Map

Unity 기반 1인칭 내러티브 퍼즐 게임 **DualMind**의 코드 구조를 정리한 포트폴리오용 레포지토리입니다.

이 문서는 단순 코드 나열이 아니라, 프로젝트의 핵심 시스템이 어떤 문제를 해결하기 위해 설계되었고 각 클래스가 어떤 책임을 가지는지 보여주는 것을 목표로 합니다.

## Project Overview

- 개발 기간: 2026.03.03 ~ 2026.03.23
- 개발 인원: 1인 개발
- Engine: Unity
- Language: C#
- 주요 키워드: Narrative Sequence, Procedural Maze, Personality Switching, Pulse Scan, Multi Ending

## Core Systems

| System | Description | Docs |
|---|---|---|
| Stage Sequence | 내레이션, 입력 잠금, 화면 전환, 퍼즐 트리거, 씬 전환을 순차 제어 | [Architecture](docs/architecture.md#1-stage-sequence-system) |
| Brain Maze | DFS 기반 미로 생성과 BFS 기반 최장 목표 탐색 | [MazeGenerator](docs/classes/MazeGenerator.md) |
| Personality Switching | 두 인격의 Player, Camera, AudioListener, 입력 상태 전환 | [PersonalityManager](docs/classes/PersonalityManager.md) |
| Pulse Scan | 구형 범위 탐지와 인터페이스 기반 퍼즐 반응 | [PulseWave](docs/classes/PulseWave.md) |
| Interaction | 카메라 Raycast 기반 상호작용 대상 탐지 | [InteractionManager](docs/classes/InteractionManager.md) |

## Start Here

1. [Documentation Index](docs/index.md)
2. [Architecture Overview](docs/architecture.md)
3. [Class Diagram](docs/class-diagram.md)
4. [Class Details](docs/classes/)

## Source Code

핵심 스크립트는 [`src/Assets/Scripts`](src/Assets/Scripts)에 정리되어 있습니다.

## Diagram Note

GitHub의 Mermaid 렌더러는 환경에 따라 `click` 링크가 제한될 수 있습니다. 그래서 각 다이어그램 아래에 동일한 클래스 링크 목록을 함께 제공합니다.
