using UnityEngine;

public class BridgePlayer2Controller : MonoBehaviour
{
    [SerializeField] Transform[] tpPositions;
    [SerializeField] GameObject player;

    private int index = 0;
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void TeleportPlayerToNextPosition()
    {
        if (index >= tpPositions.Length) return;

        Vector3 targetPos = tpPositions[index++].position;
        targetPos.y += 8.3f;  // Y값 50 올리기
        player.transform.position = targetPos;
    }

}
