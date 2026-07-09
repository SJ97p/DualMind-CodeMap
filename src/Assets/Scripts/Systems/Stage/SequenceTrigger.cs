using UnityEngine;
using UnityEngine.Rendering;

public class SequenceTrigger : MonoBehaviour
{
    [Header("Sequence")]
    [SerializeField] public int sequenceNumber = 0;
    [SerializeField] private bool isTrigger = false;
    private void OnTriggerEnter(Collider other)  // Collision ¡æ Collider
    {
        if (!isTrigger)
        {
            if (other.CompareTag("MainPersonality"))
            {
                Debug.Log("Player join");
                StageManager.Instance.ActivateStageTrigger();
                isTrigger = true;
            }
        }
    }
}
