using System;
using Unity.VisualScripting;
using UnityEngine;
public interface IStage
{
    public bool IsTrigger { get; set; }
    public void StartSequence();
}
