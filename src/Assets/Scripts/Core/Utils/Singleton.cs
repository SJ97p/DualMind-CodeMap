using UnityEngine;
using System.Collections;

public class Singleton<T> : MonoBehaviour where T : MonoBehaviour
{
    private bool _isTrigger = false;
    private static T _instance;

    public static T Instance
    {
        get
        {
            if (_instance == null)
            {
                _instance = FindAnyObjectByType<T>(FindObjectsInactive.Include);
                if (_instance == null)
                {
                    Debug.LogError($"Singleton<T> : {typeof(T).Name} 인스턴스 없음");
                }
            }
            return _instance;
        }
    }

    protected virtual void Awake()
    {
        if (_instance != null && _instance != this)
        {
            Destroy(gameObject);
            return;
        } 
        _instance = this as T;
        DontDestroyOnLoad(gameObject);
    }

    IEnumerator WaitForTrigger()
    {
        yield return new WaitUntil(() => _isTrigger);  // True 될 때까지 대기
        Debug.Log("트리거 발동!");

        _isTrigger = false;  // 리셋! 다음 대기를 위해
    }
}