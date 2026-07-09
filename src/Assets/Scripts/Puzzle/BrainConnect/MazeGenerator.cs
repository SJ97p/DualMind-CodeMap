using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Unity.VisualScripting;
using UnityEngine;

public class MazeGenerator : MonoBehaviour
{
    [SerializeField] private int width = 21;
    [SerializeField] private int height = 21;
    [SerializeField] float extraPathChance = 0.05f;

    [SerializeField] GameObject wallPrefab;
    [SerializeField] GameObject floorPrefab;
    [SerializeField] float tileSize = 4f;

    [SerializeField] GameObject player;
    [SerializeField] GameObject nervePrefab;

    public GameObject goalNerve;

    public Transform startPoint { get; private set; }
    public Transform goalPoint { get; private set; }

    [Header("Pathfinding")]
    [SerializeField] private bool autoFindFarthestGoal = true;

    int[,] maze;

    Stack<Vector2Int> stack = new Stack<Vector2Int>();

    readonly Vector2Int[] directions =
{
        new Vector2Int(0,2),
        new Vector2Int(0,-2),
        new Vector2Int(2,0),
        new Vector2Int(-2,0)
    };

    void Start()
    {
        
    }

    public void CreateMaze(ColorType type)
    {
        Debug.Log(width);
        ClearMaze();
        GenerateMaze();
        SetStartAndGoal();  // ★ 추가: 시작/목표 설정
        BuildMaze();
        SetPlayerAndNerve(type);
        width = Mathf.Clamp(width + 2, 1, 21);
        height = Mathf.Clamp(height + 2, 1, 21);
    }

    public void GenerateMaze()
    {
        stack.Clear();

        width = width % 2 == 0 ? width + 1 : width;
        height = height % 2 == 0 ? height + 1 : height;

        maze = new int[width, height];

        // 전부 벽으로 초기화
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                maze[x, y] = 1;
            }
        }

        Vector2Int start = new Vector2Int(1, 1);
        maze[start.x, start.y] = 0;
        stack.Push(start);

        while (stack.Count > 0)
        {
            Vector2Int current = stack.Peek();
            List<Vector2Int> neighbors = GetUnvisitedNeighbors(current);

            if (neighbors.Count > 0)
            {
                Vector2Int next = neighbors[Random.Range(0, neighbors.Count)];
                RemoveWall(current, next);
                maze[next.x, next.y] = 0;
                stack.Push(next);
            }
            else
            {
                stack.Pop();
            }
        }

        CreateExtraPaths();
    }

    public void ClearMaze()
    {
        // 자식 오브젝트 모두 삭제 (생성된 벽/바닥)
        for (int i = transform.childCount - 1; i >= 0; i--)
        {
            DestroyImmediate(transform.GetChild(i).gameObject);
        }

        // 시작점/목표점 기존 오브젝트 삭제 (SetStartAndGoal에서 새로 생성)
        if (startPoint != null)
            DestroyImmediate(startPoint.gameObject);
        if (goalPoint != null)
            DestroyImmediate(goalPoint.gameObject);

        startPoint = null;
        goalPoint = null;
        Destroy(goalNerve);
        goalNerve = null;
    }

    List<Vector2Int> GetUnvisitedNeighbors(Vector2Int pos)
    {
        List<Vector2Int> neighbors = new List<Vector2Int>();

        foreach (var dir in directions)
        {
            Vector2Int next = pos + dir;

            if (next.x > 0 && next.x < width - 1 &&
                next.y > 0 && next.y < height - 1)
            {
                if (maze[next.x, next.y] == 1)
                {
                    neighbors.Add(next);
                }
            }
        }

        return neighbors;
    }
    void RemoveWall(Vector2Int a, Vector2Int b)
    {
        Vector2Int wall = (a + b) / 2;
        maze[wall.x, wall.y] = 0;
    }
    public void PrintMaze()
    {
        string output = "";

        for (int y = height - 1; y >= 0; y--)
        {
            for (int x = 0; x < width; x++)
            {
                output += maze[x, y] == 1 ? "█" : " ";
            }

            output += "\n";
        }

        Debug.Log(output);
    }
    void BuildMaze()
    {
        for (int x = 0; x < width; x++)
        {
            for (int y = 0; y < height; y++)
            {
                Vector3 pos = new Vector3(x * tileSize, 0, y * tileSize);

                if (maze[x, y] == 1)
                {
                    Instantiate(wallPrefab, pos, Quaternion.identity, transform);
                }
                else
                {
                    Instantiate(floorPrefab, pos, Quaternion.identity, transform);
                }
            }
        }
    }
    void SetStartAndGoal()
    {
        Vector2Int mazeStart = new Vector2Int(1, 1);  // 보장된 시작점

        Vector2Int mazeGoal;
        if (autoFindFarthestGoal)
        {
            mazeGoal = FindFarthestReachableCell(mazeStart);
            Debug.Log($"가장 먼 목표점: {mazeGoal}");
        }
        else
        {
            mazeGoal = new Vector2Int(width - 2, height - 2);
        }

        // Transform 자동 생성
        Vector3 startWorldPos = new Vector3(mazeStart.x * tileSize, 0.5f, mazeStart.y * tileSize);
        Vector3 goalWorldPos = new Vector3(mazeGoal.x * tileSize, 0.5f, mazeGoal.y * tileSize);

        // 시작점
        GameObject startObj = new GameObject("MazeStart");
        startPoint = startObj.transform;
        startPoint.position = startWorldPos;
        startPoint.parent = transform;

        // 목표점
        GameObject goalObj = new GameObject("MazeGoal");
        goalPoint = goalObj.transform;
        goalPoint.position = goalWorldPos;
        goalPoint.parent = transform;

        Debug.Log($"시작: {startWorldPos}, 목표: {goalWorldPos}");
    }
    public void SetPlayerAndNerve(ColorType type)
    {
        if (player != null)
            player.transform.position = startPoint.position;
        goalNerve = Instantiate(nervePrefab);
        goalNerve.transform.position = goalPoint.position + Vector3.up;
        goalNerve.transform.localScale = Vector3.one;
        StartCoroutine(SetNerveColorAfterFrame(goalNerve, type));
    }
    private IEnumerator SetNerveColorAfterFrame(GameObject nerve, ColorType type)
    {
        yield return null;  // 다음 프레임 대기!

        var shaderTransition = nerve.GetComponent<ShaderColorTransition>();
        if (shaderTransition != null)
        {
            shaderTransition.ChangeColorByType(type);
        }
        else
        {
            Debug.LogError($"No ShaderColorTransition on {nerve.name}!");
        }
    }
    Vector2Int FindFarthestReachableCell(Vector2Int start)
    {
        var distances = new Dictionary<Vector2Int, int>();
        var queue = new Queue<Vector2Int>();

        queue.Enqueue(start);
        distances[start] = 0;

        Vector2Int[] dirs = { new Vector2Int(0, 1), new Vector2Int(0, -1), new Vector2Int(1, 0), new Vector2Int(-1, 0) };

        while (queue.Count > 0)
        {
            Vector2Int current = queue.Dequeue();
            int dist = distances[current];

            foreach (var dir in dirs)
            {
                Vector2Int next = current + dir;
                if (IsValidCell(next) && maze[next.x, next.y] == 0 && !distances.ContainsKey(next))
                {
                    distances[next] = dist + 1;
                    queue.Enqueue(next);
                }
            }
        }

        return distances.OrderByDescending(kvp => kvp.Value).First().Key;
    }
    bool IsValidCell(Vector2Int pos)
    {
        return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
    }
    public Vector3 GetStartPosition() => startPoint.position;
    public Vector3 GetGoalPosition() => goalPoint.position;
    public bool IsGoalReached(Vector3 playerPos) => Vector3.Distance(playerPos, goalPoint.position) < tileSize * 0.5f;
    void CreateExtraPaths()
    {
        for (int x = 1; x < width - 1; x++)
        {
            for (int y = 1; y < height - 1; y++)
            {
                if (maze[x, y] == 1 && Random.value < extraPathChance)
                {
                    maze[x, y] = 0;
                }
            }
        }
    }
}
