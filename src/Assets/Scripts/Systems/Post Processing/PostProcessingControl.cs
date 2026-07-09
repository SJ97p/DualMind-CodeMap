using System.Collections;
using Unity.VisualScripting;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;
using static System.Runtime.CompilerServices.RuntimeHelpers;
using static UnityEngine.Rendering.DebugUI;


public class PostProcessingControl : Singleton<PostProcessingControl>
{
    private Volume volume;
    private Bloom bloom;
    private Vignette vignette;
    private ColorAdjustments colorAdj;

    private Coroutine currentCoroutine;

    void OnEnable()
    {
        InitializeVolume();
        PersonalityManager.OnPlayerSwitched += TryFade;  // 구독!
    }

    void OnDisable()
    {
        PersonalityManager.OnPlayerSwitched -= TryFade;  // 해지!
    }

    public void TryFade(bool direction, float transitionDuration)
    {
        currentCoroutine = StartCoroutine(FadeEffect(direction, transitionDuration));
    }

    private void InitializeVolume()
    {
        volume = GetComponent<Volume>();
        if (volume == null)
        {
            Debug.LogError("Volume 컴포넌트 없음!");
            return;
        }

        if (!volume.profile.TryGet<Bloom>(out bloom))
            Debug.LogWarning("Bloom 효과를 Volume Profile에서 못 찾음");

        if (!volume.profile.TryGet<Vignette>(out vignette))
            Debug.LogWarning("Vignette 효과를 Volume Profile에서 못 찾음");

        if (!volume.profile.TryGet<ColorAdjustments>(out colorAdj))
            Debug.LogWarning("Vignette 효과를 Volume Profile에서 못 찾음");
    }

    public void SetScreenBlack() 
    {
        SetVignetteIntensity(1f);
        SetColorAdj(-20f);
    }

    public void SetBloomIntensity(float value)
    {
        if (bloom != null)
            bloom.intensity.value = value;  // Threshold, scatter 등도 동일
    }

    // Vignette 강도 조절 (0~1 범위)
    public void SetVignetteIntensity(float value)
    {
        if (vignette == null) return;
            
        vignette.intensity.value = value;  // Center, Smoothness 등도 동일
    }

    public void SetColorAdj(float value)
    {
        if (colorAdj == null) return;

        colorAdj.postExposure.value = value;
    }
    public IEnumerator FadeEffect(bool direction, float duration = 1f)
    {
        // postExposure 값 (어두움 ↔ 밝음)
        float postStart = direction ? -20f : 0f;
        float postEnd = direction ? 0f : -20f;

        float vigStart = direction ? 1f : 0f;
        float vigEnd = direction ? 0f : 1f;

        float elapsed = 0f;

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;

            // null 체크 안전장치
            if (colorAdj != null)
                colorAdj.postExposure.value = Mathf.Lerp(postStart, postEnd, t);
            if (vignette != null)
                vignette.intensity.value = Mathf.Lerp(vigStart, vigEnd, t);
            yield return null;
        }

        // 정확히 목표값 도달
        if (colorAdj != null)
            colorAdj.postExposure.value = postEnd;
        if (vignette != null)
            vignette.intensity.value = vigEnd;
    }
    public void StopCurrentFade()
    {
        if (currentCoroutine != null)
            StopCoroutine(currentCoroutine);
    }

    // Update is called once per frame
    void Update()
    {
        if (Input.GetKeyDown(KeyCode.UpArrow))
            StartCoroutine(FadeEffect(true));  // 어두움 → 밝음

        if (Input.GetKeyDown(KeyCode.DownArrow))
            StartCoroutine(FadeEffect(false));  // 밝음 → 어두움
    }
}
