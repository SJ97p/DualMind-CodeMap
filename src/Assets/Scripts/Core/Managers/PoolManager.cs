using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.Audio;

public class PoolManager : Singleton<PoolManager>
{
    [SerializeField, Range(0, 32)] int narrationCount = 2;
    [SerializeField, Range(0, 8)] int bgmCount = 1;
    [SerializeField, Range(0, 32)] int sfxCount = 16;

    public List<AudioSource> narrationPool = new List<AudioSource>();
    public List<AudioSource> bgmPool = new List<AudioSource>();
    public List<AudioSource> sfxPool = new List<AudioSource>();

    protected override void Awake()
    {
        base.Awake();
        narrationPool.AddRange(InitializePool("Narration", narrationCount));
        bgmPool.AddRange(InitializePool("BGM", bgmCount));
        sfxPool.AddRange(InitializePool("SFX", sfxCount));
    }
    

    List<AudioSource> InitializePool(string name, int count)
    {  // List 반환
        List<AudioSource> pool = new List<AudioSource>(count);
        if (count == 0) return pool;

        GameObject poolParent = new GameObject(name + "Pool");
        poolParent.transform.SetParent(transform);  // 부모 설정 추가!

        for (int i = 0; i < count; i++)
        {  // count 사용
            GameObject child = new GameObject($"{name}_{i}");
            child.transform.SetParent(poolParent.transform);
            AudioSource source = child.AddComponent<AudioSource>();
            source.playOnAwake = false;
            pool.Add(source);  // pool에 추가 (sfxPool[i] 버그 수정!)
        }
        return pool;
    }

    public void PlaySFX(AudioClip clip, float volume = 1f, AudioMixerGroup group = null)
    {
        AudioSource source = sfxPool.FirstOrDefault(s => !s.isPlaying);
        if (source == null && sfxPool.Count > 0) source = sfxPool[0];
        if (source != null)
        {
            source.clip = clip;
            source.volume = volume;
            source.outputAudioMixerGroup = group;  // SFX 그룹 연결!
            source.Play();
        }
    }
    public void PlayBGM(AudioClip clip, float volume = 1f, AudioMixerGroup group = null)
    {
        Debug.Log($"PlayBGM called: clip={clip?.name}, bgmPool.Count={bgmPool.Count}");

        AudioSource source = bgmPool.FirstOrDefault(s => !s.isPlaying);
        Debug.Log($"Available source: {(source != null ? source.name : "null")}");

        if (source == null && bgmPool.Count > 0)
        {
            source = bgmPool[0];
            source.Stop();  // 기존 BGM 강제 중지!
            Debug.Log("Forced stop previous BGM");
        }
        if (source != null)
        {
            source.clip = clip;
            source.volume = volume;
            source.loop = true;  // BGM은 루프!
            source.outputAudioMixerGroup = group;
            source.Play();
            Debug.Log("BGM Play success");
        }
        else
        {
            Debug.LogError("No BGM source available!");
        }
    }

    public void StopBGM()
    {
        foreach (AudioSource source in bgmPool)
        {
            if (source.isPlaying)
            {
                source.Stop();
                Debug.Log("Stopped BGM: " + source.clip?.name);
            }
        }
    }
    public void PlayNarration(AudioClip clip, float volume = 1f, AudioMixerGroup group = null)
    {
        AudioSource source = narrationPool.FirstOrDefault(s => !s.isPlaying);
        if (source == null && narrationPool.Count > 0) source = narrationPool[0];
        if (source != null)
        {
            source.clip = clip;
            source.volume = volume;
            source.outputAudioMixerGroup = group;  // SFX 그룹 연결!
            source.Play();
        }
    }
}
