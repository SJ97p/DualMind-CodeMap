using UnityEngine;

public class PulseVisualizer : MonoBehaviour
{

    [Header("시각 효과")]
    [SerializeField] private Transform pulseRing;  // 링 메쉬 자식
    [SerializeField] private bool isOn= false;

    private Vector3 maxScale = new Vector3();

    private void Start()
    {
        if (pulseRing.TryGetComponent<MeshRenderer>(out var mesh))
        {
            if (!mesh.enabled)
            {
                mesh.enabled = true;
            }
        }
        maxScale = pulseRing.localScale;
        ResetVisual();
    }

    public void EmitPulse()
    {
        if (pulseRing != null)
            pulseRing.localScale = Vector3.zero;
    }
    public void OnPulseUpdate(float progress)
    {
        pulseRing.localScale = maxScale * progress;
    }
    public void ResetVisual()
    {
        pulseRing.localScale = Vector3.zero;
    }

    // Update is called once per frame
    void Update()
    {

    }

    public void SetVisualize(float scanProgress)
    {
        //    파장 확산 애니
        if (pulseRing != null)
            pulseRing.localScale = maxScale * scanProgress;
    }
}
