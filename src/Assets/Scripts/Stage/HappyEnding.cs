using UnityEngine;
using System.Collections;

public class HappyEnding : Stage
{
    protected override IEnumerator SequenceRoutine()
    {
        PostProcessingControl.Instance.SetScreenBlack();
        yield return new WaitForSeconds(1f);
        soundManager.StopBGM();
        yield return DoNarration(soundLibrary.Happy1);
        yield return DoNarration(soundLibrary.Happy2);
        yield return DoNarration(soundLibrary.Happy3);
        yield return DoNarration(soundLibrary.Happy4);
        yield return new WaitForSeconds(2f);
        yield return DoNarration(soundLibrary.Happy5);
    }
}
