using UnityEngine;

public class EnergyOrb : MonoBehaviour, IPulseReactive
{
    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void OnPulseHit(Collider hit, float radius, float progress)
    {
        Debug.Log(hit.name);
    }
}
