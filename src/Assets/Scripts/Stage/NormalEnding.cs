using UnityEngine;
using System.Collections;

public class NormalEnding : Stage
{
    protected override IEnumerator SequenceRoutine()
    {
        PostProcessingControl.Instance.SetScreenBlack();
        yield return DoNarration(soundLibrary.Normal1);
        yield return DoNarration(soundLibrary.Normal2);
        yield return DoNarration(soundLibrary.Normal3);
        yield return DoNarration(soundLibrary.Normal4);
        yield return new WaitForSeconds(2f);
        yield return DoNarration(soundLibrary.Normal5);
        yield return DoNarration(soundLibrary.Normal6);
    }
}
