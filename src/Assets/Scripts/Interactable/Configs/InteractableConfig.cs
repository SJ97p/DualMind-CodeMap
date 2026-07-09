using UnityEngine;

[CreateAssetMenu(menuName = "Interactable")]
public class InteractableConfig : ScriptableObject
{
    public string displayName;     //
    public string prefabPath;      // "Prefabs/Lever.prefab"
    //public Sprite icon;
    public AudioClip sound;
    public float interactionRange = 2f;
    public bool isOneTimeUse = true;
}