// BrainConnectPuzzleSO.cs
using UnityEngine;

[CreateAssetMenu(menuName = "DualMind/BrainConnect Puzzle")]
public class BrainConnectPuzzleSO : ScriptableObject
{
    public SequenceStepSO[] steps;
    public string puzzleName = "BrainConnect Test";
}