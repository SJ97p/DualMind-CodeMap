# SoundManager

Source: [`SoundManager.cs`](../../src/Assets/Scripts/Core/Managers/SoundManager.cs)

## Role

BGM, SFX, Narration 재생의 진입점입니다. 실제 AudioSource 관리는 `PoolManager`에 위임합니다.

## Key Methods

- `PlaySFX()`
- `PlayBGM()`
- `StopBGM()`
- `PlayNarration()`
- `SetDoctorVoice()`
- `SetMentalVoice()`

## Portfolio Point

내레이션 중심 게임이기 때문에 `Stage`의 시퀀스와 `SoundManager`의 Narration 재생이 강하게 연결됩니다.
