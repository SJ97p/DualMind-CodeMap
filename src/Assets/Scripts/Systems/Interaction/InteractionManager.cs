using Unity.Cinemachine;
using UnityEngine;

public class InteractionManager : Singleton<InteractionManager>
{
    [SerializeField] private float _maxDistance = 10f;
    [SerializeField] private LayerMask _interactLayer = 1 << 8;

    private Camera _cam;
    private GameObject _currentTarget;
    private GameObject _previousTarget;  // 이전 타겟 저장

    public bool canInteract = true;

    void OnEnable()
    {
        _cam = Camera.main;
        InputSystem.OnInteractPressed += TryInteract;  // 구독!
    }

    void OnDisable()
    {
        InputSystem.OnInteractPressed -= TryInteract;  // 해지!
    }

    void Update()
    {
        UpdateInteractable();  // Raycast는 그대로
    }

    void TryInteract()
    {
        if (!canInteract) return;
        Debug.Log("intecract()");
        if (_currentTarget == null) return;
        if (_currentTarget.TryGetComponent<IPlayerInteractable>(out var target))
        {
            target.Interact();
        }
        else
        {
            Debug.Log("Interact 실패!");
        }
    }
    public void SetCam(Camera camera)
    {
        _cam = camera;
    }

    void UpdateInteractable()
    {
        if (_cam == null)
        {
            Debug.Log("cam is null");
            return;
        }
        Ray ray = _cam.ScreenPointToRay(new Vector3(Screen.width * 0.5f, Screen.height * 0.5f));

        GameObject newTarget = null;

        if (Physics.Raycast(ray, out RaycastHit hit, _maxDistance, _interactLayer))
        {
            newTarget = hit.collider.gameObject;
        }

        // 변경 체크 → 딱 한 번만!
        if (newTarget != _previousTarget)
        {
            if (_previousTarget != null && !_previousTarget.Equals(null))
            {
                InteractionVisualizer visualizer = _previousTarget.GetComponent<InteractionVisualizer>();
                if (visualizer != null)
                    visualizer.Highlight(false);
            }

            _currentTarget = newTarget;

            // 새 타겟 ON
            if (_currentTarget != null)
            {
                _currentTarget.GetComponent<InteractionVisualizer>()?.Highlight(true);
            }
            else
            {
                //Debug.Log("nO");
            }

            _previousTarget = newTarget;
        }
    }
}
