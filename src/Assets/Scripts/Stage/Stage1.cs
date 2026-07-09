using System.Collections;
using UnityEngine;
using static ShaderColorTransition;

public class Stage1 : Stage
{
    [SerializeField] MazeGenerator m_Generator;
    [SerializeField] PulseLever pulseLever;
    [SerializeField] GameObject positionOfPulsePuzzle;
    private float timer = 0f;
    private bool isTimerOn = false;
    private bool timerSwitch = true;
    protected override IEnumerator SequenceRoutine()
    {
        //yield return maze();
        yield return StartBrainConnect();
        yield return StartPulseLever();
    }

    private IEnumerator maze()
    {
        m_Generator.CreateMaze(ColorType.HAPPINESS);
        yield return new WaitForSeconds(1.1f);
        m_Generator.CreateMaze(ColorType.LOVE);
        yield return new WaitForSeconds(1.1f);
        m_Generator.CreateMaze(ColorType.MELANCHOLY);
        yield return new WaitForSeconds(1.1f);
        m_Generator.CreateMaze(ColorType.RAGE);
        yield return new WaitForSeconds(1.1f);
        m_Generator.CreateMaze(ColorType.FEAR);
        yield return new WaitForSeconds(1.1f);
    }

    private IEnumerator StartBrainConnect() 
    {
        Count = 0;
        //입장했을 때 순서
        //1번 퍼즐 풀고
        PostProcessingControl.Instance.SetScreenBlack();
        yield return DoNarrationNoDelay(soundLibrary.Maze1);
        m_Generator.CreateMaze(ColorType.HAPPINESS);
        yield return SetEyes(true);
        SetMazeTimer();
        yield return WaitForTrigger();

        //1번 퍼즐 풀고
        yield return SetEyes(false);
        yield return DoNarrationNoDelay(soundLibrary.Maze2);
        m_Generator.CreateMaze(ColorType.LOVE);
        yield return SetEyes(true);
        SetMazeTimer();
        yield return WaitForTrigger();

        //1번 퍼즐 풀고
        yield return SetEyes(false);
        yield return DoNarrationNoDelay(soundLibrary.Maze3);
        m_Generator.CreateMaze(ColorType.MELANCHOLY);
        yield return SetEyes(true);
        SetMazeTimer();
        yield return WaitForTrigger();

        //1번 퍼즐 풀고
        //yield return SetEyes(false);
        yield return DoNarrationNoDelay(soundLibrary.Maze4);
        m_Generator.CreateMaze(ColorType.RAGE);
        //yield return SetEyes(true);
        SetMazeTimer();
        yield return WaitForTrigger();

        //1번 퍼즐 풀고
        yield return SetEyes(false);
        yield return DoNarrationNoDelay(soundLibrary.Maze5);
        m_Generator.CreateMaze(ColorType.FEAR);
        yield return SetEyes(true);
        SetMazeTimer();
        yield return WaitForTrigger();

        timerSwitch = false;

        yield return SetEyes(false);
        m_Generator.ClearMaze();
        SetPlayerPosition(players[0], positionOfPulsePuzzle.transform);
        InteractionManager.Instance.canInteract = false;
        yield return SetEyes(true);
        if (Count < 2)
        {
            yield return DoNarration(soundLibrary.MazeFailure);
            Debug.Log("BrainConnect 실패");
        }
        else
        {
            yield return DoNarration(soundLibrary.MazeFailure);
            GameManager.Instance.QuestComplete();

        }
    }
    private IEnumerator StartPulseLever()
    {
        Count = 0;
        yield return DoNarration(soundLibrary.LastDoctorNarration);
        soundManager.SetMentalVoice();
        yield return DoNarration(soundLibrary.PulseLever1);
        yield return DoNarration(soundLibrary.PulseLever2);
        SetPlayerSwitchable(true);
        SetPlayerScanable(true);
        yield return DoNarration(soundLibrary.PulseLever3);
        yield return DoNarration(soundLibrary.PulseLever4);
        yield return DoNarrationNoDelay(soundLibrary.PulseLever5);
        InteractionManager.Instance.canInteract = true;
        for (int i = 0; i < 16; i++)
        {
            yield return WaitForTrigger();
            Debug.Log($"Trigger {i + 1}/16 완료!");
        }

        if (Count < 12)
        {
            Debug.Log("실패");
        }
        else
        {
            GameManager.Instance.QuestComplete();
        }
        yield return DoNarration(soundLibrary.PulseLever6);
        StartCoroutine(PersonalityManager.Instance.SwitchToPlayer(0));
        PostProcessingControl.Instance.SetScreenBlack();
        yield return new WaitForSeconds(2f);
        GameManager.Instance.LoadNextStage();
    }

    public void SetMazeTimer()
    {
        if (isTimerOn == false)
        {
            StartCoroutine(MazeTimerCoroutine());
        }
    }
    private IEnumerator MazeTimerCoroutine()
    {
        isTimerOn = true;
        float timeLimit = 180f; 

        while (timer < timeLimit)
        {
            if (!timerSwitch) yield break;
            //Debug.Log(timer);
            timer += Time.deltaTime;
            yield return null;  // 다음 프레임 대기
        }

        // 3분 초과 시 트리거 발동
        Trigger();
        isTimerOn = false;
    }
    public override void Trigger()
    {
        base.Trigger();
        timer = 0;
    }
}
