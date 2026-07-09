# PostProcessingControl

Source: [`PostProcessingControl.cs`](../../src/Assets/Scripts/Systems/Post%20Processing/PostProcessingControl.cs)

## Role

화면 암전과 개안 연출을 담당합니다. `Vignette`와 `ColorAdjustments` 값을 보간해 시야 전환을 만듭니다.

## Problem

인격 전환이나 스테이지 전환 시 입력 가능 상태와 화면 상태가 따로 움직이면 플레이어 경험이 어색해질 수 있습니다.

## Solution

`Stage.SetEyes()`와 `PersonalityManager.OnPlayerSwitched` 이벤트에서 `TryFade()`를 호출해 입력 제어와 화면 전환을 연결합니다.

## Key Methods

- `SetScreenBlack()`: 화면을 즉시 어둡게 설정
- `TryFade(bool direction, float transitionDuration)`: 페이드 시작
- `FadeEffect()`: Post Exposure와 Vignette 값을 시간에 따라 보간
