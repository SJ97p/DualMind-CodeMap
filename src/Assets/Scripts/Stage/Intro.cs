using System.Collections;
using UnityEngine;

public class Intro : Stage
{
    [SerializeField] ShaderColorTransition[] nerves;
    protected override IEnumerator SequenceRoutine()
    {
        //입장했을 때 순서
        PostProcessingControl.Instance.SetScreenBlack();
        yield return DoNarration(soundLibrary.Intro1);
        yield return OpenEyes();
        //soundManager.SetMentalVoice();
        yield return DoNarration(soundLibrary.Intro2);
        yield return DoNarration(soundLibrary.Intro3);
        yield return DoNarration(soundLibrary.Intro4);
        yield return DoNarration(soundLibrary.Intro5);
        yield return WaitForTrigger();

        //문을 지났을 시
        SetDoor(0, false);
        yield return DoNarration(soundLibrary.Intro6);
        yield return DoNarration(soundLibrary.Intro7);
        ChangeNerversColor();
        yield return DoNarration(soundLibrary.Intro8);
        yield return DoNarration(soundLibrary.Intro9);
        yield return DoNarration(soundLibrary.Intro10);
        yield return DoNarration(soundLibrary.Intro11);
        SetDoor(1,true);
        yield return WaitForTrigger();
    }

    public IEnumerator OpenEyes()
    {
        PostProcessingControl.Instance.TryFade(true, 1f);
        InputSystem.Instance.SetCanInput(true);
        yield return null;
    }
    public void SetDoor(int index, bool isOpen)
    {
        StageManager.Instance.SetDoor(index, isOpen);
    }

    public void ChangeNerversColor()
    {
        foreach (var a in nerves)
        {
            a.ChangeColor();
        }
    }
}
