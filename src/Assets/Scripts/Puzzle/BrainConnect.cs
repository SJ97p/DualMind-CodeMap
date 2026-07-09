using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class BrainConnect : MonoBehaviour
{
    [SerializeField] private int puzzleIndex = 0;
    [SerializeField] private Material[] mats;
    private bool sequenceStarted = false;  // ÇÃ·¡±×!
    public bool isCleared = false;



    public void OnSequenceStart()
    {
        sequenceStarted = true;
    }
    public int GetPuzzleIndex()
    {
        return puzzleIndex;
    }

    public void StartPuzzleCoroutine()
    {
        Debug.Log("StartPuzzleCoroutine");
        StartCoroutine(StartSequence());
    }

    private IEnumerator StartSequence()
    {
        yield break;
    }
    private IEnumerator HandleSequence(int sequence)
    {
        yield break;
    }

    public int GetRandomIntOfRange(int range)
    {
        return UnityEngine.Random.Range(0, range); 
    }
}
