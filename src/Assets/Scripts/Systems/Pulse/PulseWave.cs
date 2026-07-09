using System.Collections.Generic;
using UnityEngine;
using System.Collections;
public class PulseWave : MonoBehaviour
{
    [Header("파장 설정")]
    [SerializeField] private float maxRadius = 10f;
    [SerializeField] private float expandSpeed = 1f;
    [SerializeField] private LayerMask targetLayer = -1;  // 활성화할 아이템 레이어

    public System.Action<Collider> OnPulseHits;  // 탐지 결과 이벤트

    private HashSet<int> activatedIds = new HashSet<int>();

    private void OnEnable()
    {
        InputSystem.OnScanPressed += EmitPulse;  // 구독!
    }
    private void OnDisable()
    {
        InputSystem.OnScanPressed -= EmitPulse;  // 해지!
    }

    public void EmitPulse()
    {
        if (PersonalityManager.Instance.IsMainPersonality()) return;
        activatedIds.Clear();  // 리셋
        StartCoroutine(ExpandPulse());
        Debug.Log("Pulse");
    }

    private IEnumerator ExpandPulse()
    {
        Vector3 center = transform.position;
        float scanProgress = 0f;
        PulseVisualizer visualizer = GetComponent<PulseVisualizer>();

        while (scanProgress < 1f)
        {
            center = transform.position;
            scanProgress += Time.deltaTime * expandSpeed;  // 진행률 증가
            scanProgress = Mathf.Clamp01(scanProgress);
            float currentRadius = scanProgress * maxRadius;
            visualizer.SetVisualize(scanProgress);

            // 3D 원형 영역 체크 (OverlapSphereAll)
            Collider[] hits = Physics.OverlapSphere(center, currentRadius, targetLayer);
            List<Collider> newHits = new List<Collider>();

            foreach (var hit in hits)
            {
                int itemId = hit.gameObject.GetInstanceID();
                if (!activatedIds.Contains(itemId))
                {
                    activatedIds.Add(itemId);
                    newHits.Add(hit);
                    OnPulseHits?.Invoke(hit);  // 이벤트 발사
                }
            }
            yield return null;
        }

        visualizer.ResetVisual();
    }
}
