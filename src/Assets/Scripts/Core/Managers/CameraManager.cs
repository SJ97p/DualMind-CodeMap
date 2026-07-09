using UnityEngine;

public class CameraManager : Singleton<CameraManager>
{
    Camera _cam = null;
    void Start()
    {
        _cam = GetComponent<Camera>();
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
