using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class PulseLever : MonoBehaviour
{
    public int wrong = 0;
    public int correct = 0;
    public IEnumerator StartPuzzleCoroutine()
    {
        yield return null;
    }
}
