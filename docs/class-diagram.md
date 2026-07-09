# Class Diagram

아래 다이어그램은 DualMind의 핵심 클래스 관계를 요약합니다.

```mermaid
classDiagram
    class Singleton~T~
    class GameManager {
        +StageID currentStageID
        +LoadNextStage()
        +LoadStage(StageID stage)
        +QuestComplete()
        +GetQuestCompletionRate() int
    }
    class StageManager {
        -Stage currentStage
        +ActivateStageTrigger()
        +SetDoor(int index, bool isOpen)
        +GetCurrentStage() Stage
    }
    class Stage {
        <<abstract>>
        +int Count
        +StartStage()
        +Trigger()
        #SequenceRoutine() IEnumerator
        #WaitForTrigger() IEnumerator
        #DoNarration(AudioClip clip) IEnumerator
        #SetEyes(bool open) IEnumerator
    }
    class Intro
    class Stage1
    class Stage2
    class Stage3
    class MazeGenerator {
        +CreateMaze(ColorType type)
        +GenerateMaze()
        +ClearMaze()
        +GetStartPosition() Vector3
        +GetGoalPosition() Vector3
        +IsGoalReached(Vector3 playerPos) bool
        -FindFarthestReachableCell(Vector2Int start) Vector2Int
    }
    class PersonalityManager {
        +SwitchToPlayer(int index) IEnumerator
        +IsMainPersonality() bool
        +SetCamerasOn()
        +SetPlayerOff()
    }
    class PlayerController
    class InputSystem {
        +Move Vector2
        +Look Vector2
        +SetCanInput(bool isOn)
        +SetCanSwitch(bool isOn)
        +SetCanScan(bool isOn)
    }
    class PostProcessingControl {
        +TryFade(bool direction, float duration)
        +SetScreenBlack()
        +FadeEffect(bool direction, float duration) IEnumerator
    }
    class InteractionManager {
        +SetCam(Camera camera)
        -UpdateInteractable()
        -TryInteract()
    }
    class IPlayerInteractable {
        <<interface>>
        +Interact()
        +Highlight(bool active)
        +GetPrompt() string
    }
    class IPulseReactive {
        <<interface>>
        +OnPulseHit(Collider hit, float radius, float progress)
    }
    class PulseWave {
        +EmitPulse()
        -ExpandPulse() IEnumerator
    }
    class BrainNerve {
        +Interact()
        +OnPulseHit(Collider hit, float radius, float progress)
    }
    class BridgePulseReceiver {
        +OnPulseHit(Collider hit, float radius, float progress)
    }
    class SoundManager {
        +PlaySFX(AudioClip clip, float volume)
        +PlayBGM(AudioClip clip, float volume)
        +PlayNarration(AudioClip clip, float volume)
        +SetDoctorVoice()
        +SetMentalVoice()
    }
    class PoolManager {
        +PlaySFX(AudioClip clip, float volume, AudioMixerGroup group)
        +PlayBGM(AudioClip clip, float volume, AudioMixerGroup group)
        +PlayNarration(AudioClip clip, float volume, AudioMixerGroup group)
        +StopBGM()
    }

    Singleton~T~ <|-- GameManager
    Singleton~T~ <|-- StageManager
    Singleton~T~ <|-- PersonalityManager
    Singleton~T~ <|-- InputSystem
    Singleton~T~ <|-- InteractionManager
    Singleton~T~ <|-- PostProcessingControl
    Singleton~T~ <|-- SoundManager
    Singleton~T~ <|-- PoolManager

    Stage <|-- Intro
    Stage <|-- Stage1
    Stage <|-- Stage2
    Stage <|-- Stage3

    StageManager --> Stage
    Stage --> SoundManager
    Stage --> PostProcessingControl
    Stage --> InputSystem
    Stage1 --> MazeGenerator
    Stage1 --> PersonalityManager
    GameManager --> StageManager
    SoundManager --> PoolManager
    PersonalityManager --> PlayerController
    PersonalityManager --> InteractionManager
    InputSystem --> PersonalityManager
    InputSystem --> PulseWave
    PulseWave --> IPulseReactive
    BrainNerve ..|> IPlayerInteractable
    BrainNerve ..|> IPulseReactive
    BridgePulseReceiver ..|> IPulseReactive
    InteractionManager --> IPlayerInteractable

    click Stage "classes/Stage.md"
    click Stage1 "classes/Stage1.md"
    click StageManager "classes/StageManager.md"
    click GameManager "classes/GameManager.md"
    click MazeGenerator "classes/MazeGenerator.md"
    click PersonalityManager "classes/PersonalityManager.md"
    click PulseWave "classes/PulseWave.md"
    click BrainNerve "classes/BrainNerve.md"
    click InteractionManager "classes/InteractionManager.md"
    click PostProcessingControl "classes/PostProcessingControl.md"
    click SoundManager "classes/SoundManager.md"
    click PoolManager "classes/PoolManager.md"
```

## Direct Links

- [Stage](classes/Stage.md)
- [Stage1](classes/Stage1.md)
- [StageManager](classes/StageManager.md)
- [GameManager](classes/GameManager.md)
- [MazeGenerator](classes/MazeGenerator.md)
- [PersonalityManager](classes/PersonalityManager.md)
- [PulseWave](classes/PulseWave.md)
- [BrainNerve](classes/BrainNerve.md)
- [InteractionManager](classes/InteractionManager.md)
- [PostProcessingControl](classes/PostProcessingControl.md)
- [SoundManager](classes/SoundManager.md)
- [PoolManager](classes/PoolManager.md)
