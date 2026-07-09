using UnityEngine;

public class BridgeController : MonoBehaviour
{
    [SerializeField] GameObject[] bridgeColliders;
    private bool isDone = false;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if (isDone) return;
        if (bridgeColliders == null) return;

        if (!bridgeColliders[0].TryGetComponent<BridgeCollider>(out var first))
        {
            Debug.Log("Can't Get BridgeCollider");
        }
        if (!bridgeColliders[1].TryGetComponent<BridgeCollider>(out var second))
        {
            Debug.Log("Can't Get BridgeCollider");
        }
        if (!first.canTrigger || !second.canTrigger)
        {
            bridgeColliders[0].SetActive(false);
            bridgeColliders[1].SetActive(false);
            isDone = true;
        }
    }
}
