using UnityEngine;
using System.Collections;

public abstract class Stage : MonoBehaviour
{
    [SerializeField] private Puzzle[] puzzles;
    [SerializeField] protected GameObject[] players;

    protected StageManager stageManager;  // 참조!
    protected SoundManager soundManager;
    protected SoundLibrary soundLibrary;
    public int Count = 0;

    protected bool _isTrigger = false;

    public virtual void Enter() { }
    public virtual void Tick() { }
    public virtual void Exit() { }

    protected virtual void Awake()
    {
        stageManager = StageManager.Instance;
        soundManager = SoundManager.Instance;
        if (soundManager != null)
            soundLibrary = soundManager.soundLibrary;
        else
            Debug.LogError("SoundManager null in " + name);
    }

    public void StartStage()
    {
        StartCoroutine(SequenceRoutine());
    }
    protected abstract IEnumerator SequenceRoutine();

    protected IEnumerator WaitForTrigger()
    {
        yield return new WaitUntil(() => _isTrigger);  // True 될 때까지 대기

        _isTrigger = false;  // 리셋! 다음 대기를 위해
    }
    public virtual void Trigger()
    {
        _isTrigger = true;
    }
    protected IEnumerator DoNarration(AudioClip clip)
    {
        if (clip == null) yield break;

        soundManager.PlayNarration(clip);
        yield return new WaitForSeconds(clip.length + 0.1f);
    }
    protected IEnumerator DoNarrationNoDelay(AudioClip clip)
    {
        if (clip == null) yield break;

        soundManager.PlayNarration(clip);
        yield return new WaitForSeconds(1f);
    }
    protected IEnumerator PlayBGM(AudioClip clip)
    {
        if (clip == null) yield break;

        soundManager.PlayBGM(clip);
        yield return new WaitForSeconds(1f);
    }
    public IEnumerator SetEyes(bool b_Open)
    {
        PostProcessingControl.Instance.TryFade(b_Open, 1f);
        InputSystem.Instance.SetCanInput(b_Open);
        yield return null;
    }

    public void SetPlayerSwitchable(bool isOn)
    {
        InputSystem.Instance.SetCanSwitch(isOn);
    }
    public void SetPlayerScanable(bool isOn)
    {
        InputSystem.Instance.SetCanScan(isOn);
    }

    public Puzzle[] GetPuzzles()
    {
        return puzzles;
    }
    public void SetPlayerPosition(GameObject player, Transform point)
    {
        if (player != null)
            player.transform.position = point.position;
    }
}
