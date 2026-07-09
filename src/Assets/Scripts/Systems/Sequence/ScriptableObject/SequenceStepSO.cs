// SequenceStepSO.cs
using UnityEngine;
using System.Collections;

[CreateAssetMenu(menuName = "DualMind/Sequence Step")]
public class SequenceStepSO : ScriptableObject
{
    [Header("Step")]
    public string stepName = "New Step";
    public float duration = 1f;

    [Header("Actions")]
    public bool changeMaterial;
    public UnityEngine.Material targetMaterial;
    public bool screenBlack;
    public bool lockInputSwitch;

    [Header("Data")]
    public AudioClip clip;

}