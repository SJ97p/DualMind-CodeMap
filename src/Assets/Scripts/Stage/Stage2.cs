using UnityEngine;
using System.Collections;

public class Stage2 : Stage
{
    [SerializeField] private GameObject[] Gates;
    [SerializeField] private BridgePlayer1Controller p1controller;
    [SerializeField] private BridgePlayer2Controller p2controller;
    protected override IEnumerator SequenceRoutine()
    {
        yield return StartInvisibleBridge();
        //yield return StartPulseLever();
    }

    private IEnumerator StartInvisibleBridge()
    {
        Count = 0;
        //로딩 후 문의 1번 선택지 대기
        yield return SetEyes(true);
        yield return DoNarration(soundLibrary.InvisibleBridge1);
        yield return DoNarration(soundLibrary.InvisibleBridge2);
        yield return DoNarration(soundLibrary.InvisibleBridge3);
        SetPlayerSwitchable(true);
        SetPlayerScanable(true);
        p1controller.OpenNextGate();
        yield return WaitForTrigger();


        p1controller.OpenNextGate();
        p2controller.TeleportPlayerToNextPosition();
        //1번 통과 후 2번 대기
        yield return WaitForTrigger();


        p1controller.OpenNextGate();
        p2controller.TeleportPlayerToNextPosition();
        yield return WaitForTrigger();


        p1controller.OpenNextGate();
        p2controller.TeleportPlayerToNextPosition();
        yield return WaitForTrigger();


        p1controller.OpenNextGate();
        p2controller.TeleportPlayerToNextPosition();
        yield return WaitForTrigger();

        p2controller.TeleportPlayerToNextPosition();
        yield return DoNarration(soundLibrary.InvisibleBridge4);
        yield return DoNarration(soundLibrary.InvisibleBridge5);

        if (Count < 2)
        {
            Debug.Log("Invisible Bridge 실패!");
        }
        else
        {
            GameManager.Instance.QuestComplete();
        }

        yield return SetEyes(false);
        yield return new WaitForSeconds(2f);
        GameManager.Instance.LoadNextStage();
    }
}
