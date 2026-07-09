using UnityEngine;
using UnityEngine.SceneManagement;

public class GameManager : Singleton<GameManager>
{
    private int questCompletionRate = 0; // 0~3
    public StageID currentStageID = StageID.Intro;

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    private void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }
    public void LoadNextStage()
    {
        bool condition = currentStageID == StageID.HappyEnding ||
                        currentStageID == StageID.BadEnding ||
                        currentStageID == StageID.NormalEnding;
        if (condition)
        {
            Debug.LogError("HERE IS LAST STAGE!!");
            return;
        }
        LoadStage(++currentStageID); // StageID 流立!
    }


    public void LoadStage(StageID stage)
    {
        SceneManager.LoadSceneAsync((int)stage); // StageID 流立!
    }

    private void Update()
    {
        /*
         * 叼滚彪侩
         */

        if (Input.GetKeyDown(KeyCode.Alpha2))
        {
            LoadNextStage();
        }
        if (Input.GetKeyDown(KeyCode.Alpha3))
        {
            SoundManager.Instance.SetMentalVoice();
            LoadStage(StageID.HappyEnding);
        }
        if (Input.GetKeyDown(KeyCode.Alpha4))
        {
            SoundManager.Instance.SetMentalVoice();
            LoadStage(StageID.NormalEnding);
        }
        if (Input.GetKeyDown(KeyCode.Alpha5))
        {
            SoundManager.Instance.SetMentalVoice();
            LoadStage(StageID.BadEnding);
        }
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {

    }

    public void QuestComplete()
    {
        questCompletionRate++;
        Debug.Log(questCompletionRate);
    }
    public int GetQuestCompletionRate()
    {
        return questCompletionRate;
    }
}
