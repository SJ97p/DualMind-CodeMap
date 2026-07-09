using System.Collections;
using UnityEngine;

public abstract class Puzzle : MonoBehaviour
{
    protected bool _isTrigger = false;

    protected PuzzleManager puzzleManager;  // 참조!
    protected SoundManager soundManager;
    protected SoundLibrary soundLibrary;

    protected virtual void Awake()
    {
        puzzleManager = PuzzleManager.Instance;
        soundManager = SoundManager.Instance;
        if (soundManager != null)
            soundLibrary = soundManager.soundLibrary;
        else
            Debug.LogError("SoundManager null in " + name);
    }

    public void StartPuzzle()
    {
        StartCoroutine(StartPuzzleCoroutine());
    }
    protected IEnumerator WaitForTrigger()
    {
        yield return new WaitUntil(() => _isTrigger);  // True 될 때까지 대기
        
        _isTrigger = false;  // 리셋! 다음 대기를 위해
    }

    protected abstract IEnumerator StartPuzzleCoroutine();
    public bool GetPuzzleIndex()
    {
        return true;
    }

    protected IEnumerator DoNarration(AudioClip clip)
    {
        if (clip == null) yield break;

        soundManager.PlayNarration(clip);
        yield return new WaitForSeconds(clip.length + 0.1f);
    }
    public IEnumerator SetEyes(bool b_Open)
    {
        PostProcessingControl.Instance.TryFade(b_Open, 1f);
        InputSystem.Instance.SetCanInput(b_Open);
        yield return null;
    }
}
