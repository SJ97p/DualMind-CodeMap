using UnityEngine;
using UnityEngine.UIElements;

public class Lever : MonoBehaviour, IPlayerInteractable
{
    public string GetPrompt() => "F - 레버 당기기";

    public void Interact()
    {
        Debug.Log("레버 작동! 문 열림");
        // 문 애니메이션 등
    }
    public void Highlight(bool active)
    {
        
    }
}