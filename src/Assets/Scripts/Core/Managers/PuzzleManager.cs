using UnityEngine;
using System.Collections.Generic;
using UnityEngine.SceneManagement;
using System.Linq;

public class PuzzleManager : Singleton<PuzzleManager>
{
    private Puzzle[] puzzles;

    private Puzzle currentPuzzle;
    private int currentPuzzleIndex = 0;

    private void OnEnable()
    {
        SceneManager.sceneLoaded += OnSceneLoaded;
    }

    private void OnDisable()
    {
        SceneManager.sceneLoaded -= OnSceneLoaded;
    }

    private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
    {
        puzzles = StageManager.Instance.GetCurrentStage().GetPuzzles();
        if (puzzles == null)
        {
            Debug.Log("Can't Load Puzzles from StageManager");
        }

        currentPuzzle = puzzles[currentPuzzleIndex];
    }

    public void StartPuzzle()
    {
        currentPuzzle.StartPuzzle();
    }

    public Puzzle GetCurrentStage() => currentPuzzle;
}
