using UnityEngine;

public class BridgeCollider : MonoBehaviour
{
    [SerializeField] public bool isCorrect = false;
    private Collider playerCollider;
    public bool canTrigger = true;  // 플래그만!
    // Start is called once before the first execution of Update after the MonoBehaviour is create

    private void OnTriggerEnter(Collider other)  // Collision → Collider
    {
        if (!canTrigger) return;
        if (other.CompareTag("MainPersonality"))
        {
            playerCollider = other;
            canTrigger = false;
            StageManager.Instance.GetCurrentStage().Trigger();
            if (isCorrect)
            {
                StageManager.Instance.GetCurrentStage().Count++;
                Debug.Log(StageManager.Instance.GetCurrentStage().Count);            }
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (playerCollider == other)
        {

        }
    }
}
