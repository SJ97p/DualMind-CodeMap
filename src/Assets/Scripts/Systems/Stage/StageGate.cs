using System.Collections;
using UnityEngine;

public class StageGate : MonoBehaviour
{
    private Collider playerCollider;
    private bool isCancelled = false;  // 플래그만!
    // Start is called once before the first execution of Update after the MonoBehaviour is create

    private void OnTriggerEnter(Collider other)  // Collision → Collider
    {
        if (other.CompareTag("MainPersonality"))
        {
            Debug.Log("Go to NextStage after 3 seconds");
            playerCollider = other;
            StartCoroutine(MoveStageWithDelay());
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (playerCollider == other)
        {
            isCancelled = true;
        }
    }

    private IEnumerator MoveStageWithDelay()
    {
        isCancelled = false;

        float timer = 3f;
        while (timer > 0f)
        {
            if (isCancelled)
            {
                Debug.Log("Stopped move stage");
                yield break;
            }

            timer -= Time.deltaTime;
            yield return null;
        }

        GameManager.Instance?.LoadNextStage();
    }
}
