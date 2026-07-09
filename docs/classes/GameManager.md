# GameManager

Source: [`GameManager.cs`](../../src/Assets/Scripts/Core/Managers/GameManager.cs)

## Role

씬 전환과 퀘스트 완료 수를 관리합니다. 퀘스트 완료 수는 최종 엔딩 분기에서 사용됩니다.

## Key Methods

- `LoadNextStage()`: 현재 StageID 기준 다음 씬 로드
- `LoadStage(StageID stage)`: 특정 씬 로드
- `QuestComplete()`: 퀘스트 완료 수 증가
- `GetQuestCompletionRate()`: 완료 수 반환

## Used By

- `Stage1`, `Stage2`: 퍼즐 성공 시 QuestComplete 호출
- `Stage3`: 완료 수에 따라 Bad/Normal/Happy Ending 분기
