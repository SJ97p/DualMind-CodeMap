# DualMind Code Map

> **구분:** 1인 개발 · **기간:** 2026.03.03 – 2026.03.23 · **엔진 / 언어:** Unity / C#

DualMind는 제가 기획하고 구현한 스토리 진행형 1인칭 퍼즐 게임입니다. 플레이어는 주인격과 부인격을 전환하며 퍼즐을 풀고, 각 구간의 해결 결과와 마지막 대결 결과에 따라 Good / Normal / Bad Ending을 보게 됩니다. 다른 결말을 보기 위해 다시 플레이하는 흐름을 목표로 했습니다.

![DualMind 인격 전환과 Pulse 퍼즐](assets/evidence/personality-switching.gif)

> 주인격은 직접 퍼즐을 해결하고, 부인격은 `Tab` 전환 뒤 `Shift` Pulse로 숨겨진 단서를 감지합니다.

[![포트폴리오 영상 바로가기](assets/navigation/portfolio-video-link.svg)](https://youtu.be/uV3aHac0BLE)

## 프로젝트 개요

| 항목 | 포트폴리오 표기 |
|---|---|
| 프로젝트명 | DualMind |
| 장르 | 1인칭 내러티브 퍼즐 어드벤처 |
| 기간 | 2026.03.03 ~ 2026.03.23 |
| 인원 | 개인 프로젝트 |
| 역할 | 게임 기획 / 전체 플레이 흐름 설계 / Unity 클라이언트 시스템 및 퍼즐 구현 |
| 엔진·언어 | Unity 6.3 / C# / ComfyUI |
| 핵심 기술 | ScriptableObject, Coroutine, Physics.OverlapSphere, AudioMixer, Post Processing, URP, Qwen3-TTS |
| 핵심 설계 | Stage 추상화 기반 시퀀스, 이벤트 기반 인격 전환, 인터페이스 기반 퍼즐 반응, DFS·BFS 탐색 |
| 직접 구현·재구성 | 나레이션·입력·화면 전환·퍼즐 트리거 통합, 절차적 미로 생성 및 최장거리 목표 탐색, 두 인격 전환, Pulse Scan 탐지, 멀티 엔딩 흐름 |
| 프로젝트 목표 | 서로 다른 능력을 지닌 두 인격을 전환하며 숨겨진 정보를 탐색하고, 나레이션과 퍼즐이 연결되는 심리적 플레이 경험 구현 |

## 어떤 게임을 만들고 싶었는가

이 게임에서 가장 중요하게 생각한 경험은 **같은 공간을 두 인격의 시선으로 다시 해석하는 일**이었습니다. 주인격은 단서를 실제 행동으로 옮기는 역할이고, 부인격은 Pulse로 평소에는 보이지 않는 정보를 찾아 힌트를 주는 역할입니다. 단순히 캐릭터만 바뀌는 기능이 아니라, “한 인격이 알아낸 정보를 다른 인격이 해결에 사용한다”는 퍼즐 흐름을 만들고 싶었습니다.

플레이는 미로를 풀며 부인격과 연결한 뒤, Pulse로 반응하는 구를 찾아 주인격이 점등하고, 이어서 가짜 다리를 판별해 안전한 길을 건너는 순서로 진행됩니다. 마지막 인격 대결까지 성공해야 좋은 결말로 갈 수 있고, 앞선 퍼즐의 성공률에 따라 Good / Normal / Bad Ending이 결정됩니다.

![DualMind 스테이지 진행 흐름](assets/evidence/stage-sequence-flow.gif)

구현 범위는 미로, Pulse 구 점등, 보이지 않는 다리, 마지막 인격 대결까지의 4개 스테이지와 세 가지 엔딩입니다. 엔딩은 짧은 검은 화면과 내레이션으로 표현했지만, 게임의 선택과 결과가 끝까지 이어지는 흐름은 실제 시연 가능하도록 완성했습니다.

[![인터랙티브 코드맵](assets/navigation/code-map-link.svg)](https://sj97p.github.io/DualMind-CodeMap/)

> 위 버튼을 누르면 전체 시스템의 다이어그램과 공개 가능한 코드 전문을 정리한 인터랙티브 코드맵으로 이동합니다.

## 스토리 진행을 어떻게 구현했는가

스토리 게임에서는 퍼즐 하나를 구현하는 것만큼, **언제 내레이션을 재생하고 언제 조작을 허용하며 어떤 조건에서 다음 장면으로 넘어갈지**를 일관되게 다루는 일이 중요했습니다. 당시에는 `Stage`를 공통 기반 클래스로 두고 `Stage1`, `Stage2`, `Stage3`가 `SequenceRoutine()`을 각각 구현하는 상속 구조를 선택했습니다.

공통 클래스는 내레이션 재생, Trigger 대기, 인격 전환·Pulse 허용, 화면 전환을 제공하고, 각 스테이지는 자신의 퍼즐 순서를 코루틴으로 작성했습니다. 빠른 기간 안에 “미로 → 인격 연결 → Pulse 퍼즐 → 다리 → 대결 → 엔딩”이라는 절차적 흐름을 실제로 완성할 수 있었던 이유입니다.

다만 이 방식은 스테이지가 길어질수록 `WaitForSeconds`, `WaitForTrigger`, 입력 차단 호출이 코루틴 안에 쌓이는 한계도 남겼습니다. 특히 조작을 막는 일을 각 시퀀스에서 직접 호출한 점이 아쉬웠습니다. 다시 만든다면 메인 컨트롤러가 게임 상태와 이벤트만 발행하고, 플레이어 입력과 화면 제어는 현재 상태를 구독해 전환하도록 분리할 것입니다. 문을 열거나 퍼즐을 해결한 같은 플레이어 행동이 이벤트가 되고, 그 이벤트가 다음 시퀀스로 연결되는 구조가 더 읽기 쉽고 확장에도 유리하다고 판단합니다.

<details>
<summary>진행 구조와 코드 보기</summary>

- [Stage Sequence 설계 문서](docs/systems/stage-sequence.md)
- [`Stage`](src/Assets/Scripts/Core/Stage/Stage.cs): 공통 내레이션, Trigger, 입력 전환
- [`Stage1`](src/Assets/Scripts/Stage/Stage1.cs): 미로와 Pulse 구 점등 시퀀스
- [`Stage2`](src/Assets/Scripts/Stage/Stage2.cs): 보이지 않는 다리 시퀀스
- [`Stage3`](src/Assets/Scripts/Stage/Stage3.cs): 마지막 대결과 엔딩 분기

</details>

## 인격 전환이 퍼즐에 연결되는 방식

두 인격을 바꿀 때는 캐릭터만 보이거나 숨기는 것으로 끝내지 않았습니다. `PersonalityManager`가 현재 인격의 PlayerController, Camera, AudioListener, 상호작용 기준을 함께 전환하도록 만들었습니다. 이렇게 해야 인격 전환 뒤에도 플레이어가 어느 카메라로 보고 어느 대상과 상호작용하는지가 흔들리지 않습니다.

Pulse는 부인격에서만 발사할 수 있습니다. 파동이 확장되면서 감지한 Collider를 수집하고, 반응이 필요한 오브젝트는 `IPulseReactive`로 자신의 반응을 구현하게 했습니다. 그래서 구 점등 퍼즐과 보이지 않는 다리처럼 다른 퍼즐도 Pulse 자체를 고치지 않고 반응 객체를 추가하는 방식으로 연결할 수 있었습니다.

![Pulse로 단서를 탐색하는 장면](assets/evidence/pulse-scan.gif)

<details>
<summary>인격 전환과 Pulse 코드 보기</summary>

- [Personality Switching 설계 문서](docs/systems/personality-switching.md)
- [Pulse Scan 설계 문서](docs/systems/pulse-scan.md)
- [`PersonalityManager`](src/Assets/Scripts/Systems/Player/Personality/PersonalityManager.cs)
- [`PulseWave`](src/Assets/Scripts/Systems/Pulse/PulseWave.cs)
- [`IPulseReactive`](src/Assets/Scripts/Interactable/Interfaces/IPulseReactive.cs)
- [`EnergyOrb`](src/Assets/Scripts/Interactable/Components/EnergyOrb.cs)
- [`BridgePulseReceiver`](src/Assets/Scripts/Puzzle/InvisibleBridge/BridgePulseReceiver.cs)

</details>

## 퍼즐 결과를 결말까지 이어간 방식

각 스테이지는 퍼즐 완료 여부를 기록하고, 마지막 대결의 성공 여부와 누적 결과를 함께 확인해 엔딩을 결정합니다. 마지막 대결을 성공해야 Good Ending 가능성이 열리고, 이전 퍼즐의 성공률이 높을수록 더 좋은 결말로 연결되는 구조입니다. 플레이어가 단순히 다음 방으로 이동하는 것이 아니라, 앞선 해결 과정이 마지막 결과에 남도록 만들고 싶었습니다.

![절차 생성 미로 진입 장면](assets/evidence/brain-maze-entry.gif)

<details>
<summary>미로·엔딩 분기 코드 보기</summary>

- [Brain Maze 설계 문서](docs/systems/brain-maze.md)
- [`MazeGenerator`](src/Assets/Scripts/Puzzle/BrainConnect/MazeGenerator.cs)
- [`GameManager`](src/Assets/Scripts/Core/Managers/GameManager.cs)
- [`Stage3`](src/Assets/Scripts/Stage/Stage3.cs)

</details>

## 한계와 다음 설계

- 3주라는 기간 안에 플레이 가능한 4개 스테이지와 3개 엔딩을 완성하는 데 우선순위를 두었기 때문에, 엔딩 연출은 검은 화면과 내레이션 중심의 작은 범위로 마무리했습니다.
- 스테이지 상속과 코루틴은 빠르게 순서를 구현하는 데 도움이 됐지만, 상태·입력·연출 제어가 시퀀스 안에 직접 섞였습니다.
- 다시 설계한다면 `GameState`와 이벤트를 중심에 두고, 스테이지는 필요한 이벤트를 등록하며 플레이어·UI·연출은 상태 변화에 반응하게 분리할 것입니다.

DualMind는 완벽하게 일반화된 프레임워크를 만들었다는 프로젝트가 아닙니다. 스토리형 퍼즐 게임을 혼자 설계하고 완성하면서, **플레이어의 행동으로 진행되는 이야기와 이를 제어하는 시스템 구조는 함께 설계해야 한다**는 점을 배운 기록입니다.
