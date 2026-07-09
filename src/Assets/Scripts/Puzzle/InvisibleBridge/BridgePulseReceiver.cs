using System.Collections;
using System.Runtime.CompilerServices;
using UnityEngine;
using DG.Tweening;

public class BridgePulseReceiver : MonoBehaviour, IPulseReactive
{
    [SerializeField] GameObject[] bridges;
    [SerializeField] private bool isLeft;
    [SerializeField] private float time;
    
    public void OnPulseHit(Collider hit, float radius, float progress)
    {
        GameObject bridge = isLeft ? bridges[1] : bridges[0];
        Vector3 originalPos = bridge.transform.position;

        // 내려갔다 올라오기 (1줄!)
        bridge.transform.DOMoveY(originalPos.y - 20f, time * 0.5f)
                        .SetEase(Ease.InOutQuad);
                        //.OnComplete(() => bridge.transform
                        //.DOMove(originalPos, time * 0.5f)
                        //.SetEase(Ease.InOutQuad));  
    }
}
