using UnityEngine;

public class BridgePlayer1Controller : MonoBehaviour
{
    [SerializeField] GameObject[] Gates;

    private int index = 0;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void OpenNextGate()
    {
        if (index >= Gates.Length) return;

        Gates[index++].gameObject.SetActive(false);
    }
}
