using UnityEngine;

public class PulseInteraction : MonoBehaviour
{
    private PulseWave pulseWave;

    private void HandlePulseHits(Collider hit)
    {
        //Debug.Log("Received OnPulseHit");
        if (!hit.TryGetComponent<IPulseReactive>(out var reactive))
        {
            Debug.Log(hit.name + " IPulseReactive is not exist");
        }
        reactive?.OnPulseHit(hit, 0f, 0f);
    }
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    private void OnEnable()
    {
        pulseWave = GetComponent<PulseWave>();  // 같은 오브젝트에서 찾기
        pulseWave.OnPulseHits += HandlePulseHits;  //  += 구독!
    }
    private void OnDisable()
    {
        pulseWave.OnPulseHits -= HandlePulseHits;
    }
}
