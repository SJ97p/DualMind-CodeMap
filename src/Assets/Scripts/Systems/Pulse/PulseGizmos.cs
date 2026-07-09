using UnityEngine;

public class PulseGizmos : MonoBehaviour
{
    [SerializeField] private bool isDebug = false;
    [SerializeField] private float maxRadius = 10f;

    // Scene 뷰에서 파장 범위 가시화
    void OnDrawGizmosSelected()
    {
        if (isDebug)
        {
            Gizmos.color = Color.cyan;
            Gizmos.DrawWireSphere(transform.position, maxRadius);
        }
    }
}
