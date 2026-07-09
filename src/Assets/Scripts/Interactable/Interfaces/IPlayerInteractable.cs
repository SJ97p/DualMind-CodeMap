using UnityEngine;

public interface IPlayerInteractable
{
    string GetPrompt();
    void Interact();
    void Highlight(bool active);
}
