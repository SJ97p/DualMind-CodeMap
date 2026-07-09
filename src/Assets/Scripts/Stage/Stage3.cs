using UnityEngine;
using System.Collections;

public class Stage3 : Stage
{
    [SerializeField] CameraRectSystem rectSystem;
    [SerializeField] Transform player1;
    [SerializeField] Camera _cam;


    private Vector3 initialPosition = new Vector3(0,0,-10);
    private Quaternion initialRotation = Quaternion.identity;

    private Vector3 cameraInitialLocalPos = new Vector3 (0.06919336f, 1.347656f, -3.421013f);
    private Quaternion cameraInitialLocalRot = Quaternion.Euler(0.619f, -0.275f, 0.004f);

    private StageID resultStage;

    protected override IEnumerator SequenceRoutine()
    {
        yield return new WaitForSeconds(0.3f);
        PostProcessingControl.Instance.SetScreenBlack();
        soundManager.StopBGM();
        //입장했을 때 순서
        rectSystem.ApplySplit();
        PersonalityManager.Instance.SetPlayerOff();
        InitializePlayerPositionAndRotation();
        PersonalityManager.Instance.SetCamerasOn();
        yield return SetEyes(true);
        InputSystem.Instance.SetCanInput(false);
        yield return DoNarration(soundLibrary.TugOfWar1);
        yield return DoNarration(soundLibrary.TugOfWar2);
        yield return DoNarration(soundLibrary.TugOfWar3);
        yield return DoNarration(soundLibrary.TugOfWar4);
        yield return DoNarration(soundLibrary.TugOfWar5);
        soundManager.PlayBGM(soundLibrary.Final);
        yield return DoNarrationNoDelay(soundLibrary.TugOfWar6);
        yield return StartFight(30f);

        PostProcessingControl.Instance.SetScreenBlack();
        yield return new WaitForSeconds(1f);

        soundManager.StopBGM();
        GameManager.Instance.LoadStage(resultStage);
    }
    private void InitializePlayerPositionAndRotation()
    {
        player1.SetPositionAndRotation(initialPosition, initialRotation);
        _cam.transform.localPosition = cameraInitialLocalPos;
        _cam.transform.localRotation = cameraInitialLocalRot;
    }
    private IEnumerator StartFight(float time)
    {
        int targetCount = 0;
        switch (GameManager.Instance.GetQuestCompletionRate())
        {
            case 0: targetCount = 300; break;
            case 1: targetCount = 250; break;
            case 2: targetCount = 200; break;
        }
        targetCount = 200;
        int count = 0;
        float endTime = Time.time + time;

        int firstThird = targetCount / 3;
        int secondThird = targetCount * 2 / 3;
        int narrationCount = 0; 

        while (Time.time < endTime)
        {
            if (Input.GetKeyDown(KeyCode.F))
            {
                count++;
                Debug.Log($"F 입력 횟수: {count}");
                rectSystem.CameraShake();
                // 여기에 원하는 펀치/어택 로직 넣기

                if (narrationCount < 2)
                {
                    if (count >= secondThird && narrationCount == 1)
                    {
                        narrationCount++;
                        yield return DoNarrationNoDelay(soundLibrary.TugOfWar7);
                    }
                    else if (count >= firstThird && narrationCount == 0)
                    {
                        narrationCount++;
                        yield return DoNarrationNoDelay(soundLibrary.TugOfWar8);
                    }
                }

                if (count >= targetCount)
                {
                    SetResultStage();
                    break;
                }
                else
                {
                    resultStage = StageID.BadEnding;
                }
            }

            yield return null; // 매 프레임 체크
        }


        Debug.Log($"Fight 시간 종료 {time}. F 입력 횟수: {count}");
        // 시간 종료 후 처리 (예: 결과 판정, 애니메이션 종료 등)
    }

    private void SetResultStage()
    {
        switch (GameManager.Instance.GetQuestCompletionRate())
        {
            case 1: resultStage = StageID.BadEnding; break;
            case 2: resultStage = StageID.NormalEnding; break;
            case 3: resultStage = StageID.HappyEnding; break;
            default: resultStage = StageID.BadEnding; break;
        }
    }
}
