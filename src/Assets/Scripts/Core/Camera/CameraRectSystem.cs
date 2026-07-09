using UnityEngine;

public class CameraRectSystem : MonoBehaviour
{
    [Header("Cameras")]
    [SerializeField] private Camera leftCamera;   // 왼쪽 (0 ~ 0.5)
    [SerializeField] private Camera rightCamera;  // 오른쪽 (0.5 ~ 1)

    [Header("Split Settings")]
    [SerializeField] private bool isVerticalSplit = true;  // true: 좌우, false: 상하

    private void Start()
    {
        ApplySplit();
    }

    public void ApplySplit()
    {
        if (leftCamera == null || rightCamera == null)
        {
            Debug.LogError("CameraRectSystem: 카메라가 할당되지 않았습니다!");
            return;
        }

        if (isVerticalSplit)
        {
            // 좌우 분할
            leftCamera.rect = new Rect(0f, 0f, 0.5f, 1f);
            rightCamera.rect = new Rect(0.5f, 0f, 0.5f, 1f);
        }
        else
        {
            // 상하 분할
            leftCamera.rect = new Rect(0f, 0.5f, 1f, 0.5f);
            rightCamera.rect = new Rect(0f, 0f, 1f, 0.5f);
        }
    }
    public void CameraShake()
    {
        leftCamera.TryGetComponent<CameraShake>(out var leftShaker);
        rightCamera.TryGetComponent<CameraShake>(out var rightShaker);
        leftShaker.ShakeCamera(0.2f, 1f);
        rightShaker.ShakeCamera(0.4f, 1f);
    }


    public void ResetToFullScreen()
    {
        if (leftCamera) leftCamera.rect = new Rect(0f, 0f, 1f, 1f);
        if (rightCamera) rightCamera.rect = new Rect(0f, 0f, 1f, 1f);
    }

    // 런타임 비율 조정 (0~1)
    public void SetSplitRatio(float ratio)
    {
        ratio = Mathf.Clamp01(ratio);

        if (isVerticalSplit)
        {
            leftCamera.rect = new Rect(0f, 0f, ratio, 1f);
            rightCamera.rect = new Rect(ratio, 0f, 1f - ratio, 1f);
        }
        else
        {
            leftCamera.rect = new Rect(0f, ratio, 1f, 1f - ratio);
            rightCamera.rect = new Rect(0f, 0f, 1f, ratio);
        }
    }
}