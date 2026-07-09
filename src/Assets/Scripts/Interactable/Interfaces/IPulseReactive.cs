using UnityEngine;

public interface IPulseReactive
{
    void OnPulseHit(Collider hit, float radius, float progress);
}

