using Unity.Cinemachine;
using UnityEngine;

[System.Serializable]
public struct Player
{
    public Player(PlayerController player, Camera cam)
    {
        this.player = player;
        this.cam = cam;
    }
    public PlayerController player;
    public Camera cam;
}