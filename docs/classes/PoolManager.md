# PoolManager

Source: [`PoolManager.cs`](../../src/Assets/Scripts/Core/Managers/PoolManager.cs)

## Role

Narration, BGM, SFX용 `AudioSource` 풀을 생성하고 재사용합니다.

## Problem

오디오 재생마다 AudioSource를 새로 만들면 관리가 어려워지고, 반복 재생 상황에서 불필요한 생성 비용이 발생할 수 있습니다.

## Solution

시작 시 용도별 AudioSource 풀을 만들고, 재생 가능한 Source를 찾아 Clip과 MixerGroup을 설정한 뒤 재생합니다.

## Key Methods

- `InitializePool()`
- `PlaySFX()`
- `PlayBGM()`
- `PlayNarration()`
- `StopBGM()`
