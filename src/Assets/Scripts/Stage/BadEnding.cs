using UnityEngine;
using System.Collections;

public class BadEnding : Stage
{
    protected override IEnumerator SequenceRoutine()
    {
        PostProcessingControl.Instance.SetScreenBlack();
        yield return DoNarration(soundLibrary.Bad6);
    }
}
