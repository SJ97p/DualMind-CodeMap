using System;
using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using Unity.Cinemachine;
using UnityEngine;
using UnityEngine.SceneManagement;


public class PersonalityManager : Singleton<PersonalityManager>
{
    [Header("Player Tags")]
    public string player1Tag = "MainPersonality";
    public string player2Tag = "SubPersonality";

    [SerializeField] private float transitionDuration = 1f;
    private int _currentPlayerIndex = 0;

    public static Action<bool, float> OnPlayerSwitched;
    public static Action<PlayerController, bool> OnPlayerActivated;

    [SerializeField] private List<Player> players = new List<Player>();

    void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
        InputSystem.OnSwitchPressed += TrySwitch;  // 구독!
    }

    void OnDisable()
    {
        InputSystem.OnSwitchPressed -= TrySwitch;  // 해지!
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    void TrySwitch()
    {
        SwitchPersonality();
    }
    void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        players.Clear();
        FindPersonalities();
        SetPlayerActivate(players[1 - _currentPlayerIndex], false);
        SetPlayerActivate(players[_currentPlayerIndex], true);
    }

    private void FindPersonalities()
    {
        GameObject mainPersonality = GameObject.FindWithTag(player1Tag);
        GameObject subPersonality = GameObject.FindWithTag(player2Tag);

        AddPlayerToList(mainPersonality);
        AddPlayerToList(subPersonality);
    }

    private void AddPlayerToList(GameObject player)
    {
        if (player != null)
        {
            players.Add(new Player(player.GetComponent<PlayerController>(), player.GetComponentInChildren<Camera>()));
        }
        else
        {
            Debug.LogError(GetType().Name + " : Main Personality Tag is not exist!");
        }
    }

    void SwitchPersonality()
    {
        _currentPlayerIndex = 1 - _currentPlayerIndex;  // 0↔1 토글
        StartCoroutine(SwitchToPlayer(_currentPlayerIndex));
    }

    public IEnumerator SwitchToPlayer(int index)
    {
        var prevPlayer = players[1 - _currentPlayerIndex];
        var newPlayer = players[index];

        OnPlayerSwitched?.Invoke(false ,transitionDuration);
        yield return new WaitForSeconds(transitionDuration);

        SetPlayerActivate(prevPlayer, false);
        _currentPlayerIndex = index;

        SetPlayerActivate(newPlayer, true);
        OnPlayerSwitched?.Invoke(true, transitionDuration);

        yield return new WaitForSeconds(transitionDuration);
    }

    private void SetPlayerActivate(Player newPlayer, bool isOn)
    {
        newPlayer.player.enabled = isOn;
        newPlayer.cam.enabled = isOn;
        var listener = newPlayer.cam.GetComponent<AudioListener>();
        if (listener) listener.enabled = isOn;
        if (isOn)
        {
            InteractionManager.Instance.SetCam(newPlayer.cam);
        }
        OnPlayerActivated?.Invoke(newPlayer.player, isOn);
    }

    public bool IsCurrentPlayer(PlayerController player)
    {
        return players[_currentPlayerIndex].player == player;
    }

    public bool IsMainPersonality()
    {
        return _currentPlayerIndex == 0;
    }

    public void SetCamerasOn()
    {
        foreach (var player in players)
        {
            player.cam.enabled = true;
        }
    }

    public void SetPlayerOff()
    {
        foreach (var player in players)
        {
            OnPlayerActivated?.Invoke(player.player, false);
        }
    }
}