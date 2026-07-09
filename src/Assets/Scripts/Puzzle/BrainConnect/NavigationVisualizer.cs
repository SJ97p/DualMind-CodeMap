using UnityEngine;

public class NavigationVisualizer : MonoBehaviour
{
    private Collider playerCollider;
    private bool isCancelled = false;

    private MeshRenderer _renderer;
    private Color _originalColor;

    private void Awake()
    {
        _renderer = GetComponent<MeshRenderer>();          // 바닥에 붙은 MeshRenderer
        if (_renderer != null)
            _originalColor = _renderer.material.color;     // 원래 색 저장
    }

    private void OnTriggerEnter(Collider other)
    {
        if (isCancelled) return;
        if (other.CompareTag("MainPersonality"))
        {
            playerCollider = other;

            // 연한 초록색으로 변경 (R,G,B는 0~1)
            if (_renderer != null)
                _renderer.material.color = new Color(0.5f, 1f, 0.5f);
        }
    }

    private void OnTriggerExit(Collider other)
    {
        if (playerCollider == other)
        {
            isCancelled = true;
        }
    }
}
