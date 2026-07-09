using System;
using UnityEngine;
using UnityEngine.SceneManagement;

public class StageManager : Singleton<StageManager>
{
    private Stage currentStage;
    public static event Action<int, bool> OnSetDoor;

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    private void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }
    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        currentStage = FindFirstObjectByType<Stage>();

        if (currentStage != null)
        {
            currentStage.StartStage();
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Alpha1))
        {
            ActivateStageTrigger();
        }
    }

    public void ActivateStageTrigger()
    {
        currentStage.Trigger();
    }

    public void SetDoor(int index, bool isOpen)
    {
        OnSetDoor?.Invoke(index, isOpen);
    }

    public Stage GetCurrentStage() => currentStage;
}
