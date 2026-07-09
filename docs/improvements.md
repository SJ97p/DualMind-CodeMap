# Improvement Notes

DualMind는 2026.03.03 ~ 2026.03.23 동안 진행한 3주 1인 프로젝트입니다. 짧은 기간 안에 완결 흐름을 만드는 데 집중했기 때문에, 구현 이후 돌아보면 개선할 지점도 명확합니다.

이 문서는 단점을 숨기기 위한 문서가 아니라, **구현 당시의 선택과 이후 개선 방향을 설명하기 위한 문서**입니다.

## 1. Stage 시퀀스 데이터화

### Current

`Stage1`은 내레이션, 미로 생성, 화면 전환, Trigger 대기 흐름이 코드에 직접 작성되어 있습니다.

### Risk

- 시퀀스가 길어질수록 가독성이 떨어집니다.
- 감정 테마, 제한 시간, 내레이션 Clip이 늘어나면 코드 수정 범위가 커집니다.

### Improvement

- `SequenceStepSO`를 활용해 내레이션, 입력 잠금, 화면 전환, 퍼즐 시작을 데이터로 정의합니다.
- Stage는 Step 목록을 순서대로 실행하는 Runner 역할로 단순화합니다.

## 2. 미완성 실험 코드 정리

### Current

`BrainConnect`, `PulseLever` 등 일부 스크립트에는 실험 후 비어 있는 메서드나 최소 구현만 남아 있습니다.

### Risk

- 포트폴리오에서 실제 핵심 구조와 실험 흔적이 섞여 보일 수 있습니다.
- 유지보수 시 사용 여부를 판단하기 어렵습니다.

### Improvement

- 사용하지 않는 실험 스크립트는 `deprecated` 문서로 분리하거나 제거합니다.
- 실제 사용되는 클래스만 Core 문서에 노출합니다.

## 3. 하드코딩 값 분리

### Current

미로 제한 시간, 전환 시간, Stage3 입력 목표 수 등 일부 값이 코드에 직접 들어 있습니다.

### Risk

- 난이도 조정과 밸런싱이 코드 수정에 의존합니다.
- 스테이지별 설정 비교가 어렵습니다.

### Improvement

- StageConfig 또는 ScriptableObject 기반 설정 데이터로 분리합니다.
- 난이도, 내레이션, 목표 조건을 Inspector에서 조정할 수 있게 만듭니다.

## 4. Runtime Destroy와 Pooling 개선

### Current

`MazeGenerator.ClearMaze()`는 생성된 오브젝트를 제거하고 다시 생성합니다.

### Risk

- 미로 재생성이 잦아지면 Instantiate/Destroy 비용이 커질 수 있습니다.
- 런타임 환경에서는 `DestroyImmediate` 사용을 피하는 것이 좋습니다.

### Improvement

- 미로 타일과 목표 오브젝트를 Pooling합니다.
- 타일 재사용 구조로 GC와 생성 비용을 줄입니다.

## 5. 이벤트 흐름 정리

### Current

`InputSystem`, `PersonalityManager`, `PulseWave`, `PostProcessingControl`이 이벤트로 연결되어 있습니다.

### Risk

- 이벤트 구독/해제가 늘어나면 흐름 추적이 어려워질 수 있습니다.
- Stage 상태에 따른 입력 가능 여부가 분산될 수 있습니다.

### Improvement

- InputGate 또는 GameState 기반 입력 허용 정책을 명확히 둡니다.
- 시스템별 이벤트 목록을 문서화하고, 구독 위치를 일관되게 관리합니다.

## 6. Portfolio Presentation Direction

이 프로젝트를 포트폴리오에서 보여줄 때는 다음 순서가 가장 설득력 있습니다.

1. 내레이션 기반 진행이라는 문제 제시
2. Stage Sequence로 흐름을 통합한 설계 설명
3. Brain Maze에서 DFS/BFS를 사용한 이유 설명
4. Personality Switching에서 상태 동기화 문제 설명
5. Pulse Scan에서 탐지와 반응을 분리한 구조 설명
6. 구현 당시 한계와 개선 방향 제시

## Summary

DualMind는 짧은 기간 안에 완결된 플레이 흐름을 만들기 위한 프로젝트였습니다. 따라서 현재 코드의 가장 큰 가치는 완벽한 구조라기보다, **플레이 경험을 성립시키기 위해 어떤 책임을 나누고 어떤 흐름으로 연결했는지**에 있습니다.
