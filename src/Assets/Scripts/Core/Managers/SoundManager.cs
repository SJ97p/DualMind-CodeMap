using UnityEngine;
using UnityEngine.Audio;

public class SoundManager : Singleton<SoundManager>
{
    [SerializeField] public SoundLibrary soundLibrary;
    public AudioMixerSnapshot doctorSnapshot;
    public AudioMixerSnapshot mentalSnapshot;

    public AudioMixer audioMixer;
    public AudioMixerGroup NarrationGroup;
    public AudioMixerGroup bgmGroup;
    public AudioMixerGroup sfxGroup;

    private void Start()
    {
        PlayBGM(soundLibrary.Main);
    }
    public void PlaySFX(AudioClip clip, float volume = 1f)
    {
        PoolManager.Instance.PlaySFX(clip, volume, sfxGroup);
    }

    public void PlayBGM(AudioClip clip, float volume = 1f)
    {
        PoolManager.Instance.PlayBGM(clip, volume, bgmGroup);
    }

    public void StopBGM()
    {
        PoolManager.Instance.StopBGM();
    }
    public void PlayNarration(AudioClip clip, float volume = 1f)
    {
        PoolManager.Instance.PlayNarration(clip, volume, NarrationGroup);
    }

    public void SetBGMVolume(float volume)
    {
        audioMixer.SetFloat("BGMVolume", Mathf.Log10(volume) * 20);
    }

    public void SetSFXVolume(float volume)
    {
        audioMixer.SetFloat("SFXVolume", Mathf.Log10(volume) * 20);
    }

    public void SetDoctorVoice()
    {
        doctorSnapshot.TransitionTo(0.5f);  // 단일 Snapshot: TransitionTo(시간)
    }

    public void SetMentalVoice()
    {
        mentalSnapshot.TransitionTo(0.5f);  // 페이드 0.5초
    }

}
