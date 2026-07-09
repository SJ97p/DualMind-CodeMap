using System.Collections;
using UnityEngine;

public class CameraShake : MonoBehaviour
{
    private Vector3 originalPos;
    private float currentShakeAmount = 0f;

    void Awake()
    {
        originalPos = transform.localPosition;
    }

    void Update()
    {
        if (currentShakeAmount > 0)
        {
            // Perlin Noise로 자연스러운 흔들림
            float x = Mathf.PerlinNoise(0, Time.time * 5f) - 0.5f;
            float y = Mathf.PerlinNoise(Time.time * 5f, 0) - 0.5f;
            float z = Mathf.PerlinNoise(Time.time * 3f, Time.time * 2f) - 0.5f;

            transform.localPosition = originalPos +
                new Vector3(x, y, z) * currentShakeAmount;
        }
        else
        {
            transform.localPosition = originalPos;  // 원위치 복귀
        }
    }

    // 외부에서 호출: ShakeCamera(강도, 지속시간)
    public void ShakeCamera(float intensity = 0.1f, float duration = 0.5f)
    {
        currentShakeAmount = intensity;
        StartCoroutine(StopShake(duration));
    }

    IEnumerator StopShake(float time)
    {
        yield return new WaitForSeconds(time);
        currentShakeAmount = 0f;
    }
}