using System.Collections;
using UnityEngine;
using UnityEngine.InputSystem;

public class PlayerController : MonoBehaviour
{
    [Header("Components")]
    [SerializeField] private Transform cameraTransform; // 카메라 Transform (자식으로!)
    private InputSystem _input;
    private Animator _anim;

    [Header("Movement")]
    [SerializeField] private float _moveSpeed = 5f;
    [SerializeField] private float _turnSpeed = 120f; // Y축 회전 빠르게

    [Header("Camera")]
    [SerializeField] private float _cameraXSensitivity = 2f;
    [SerializeField] private float _cameraYSensitivity = 4f;
    private float _cameraXRotation = 0f;

    private bool isMovementEnabled = false;
    private PersonalityManager _personalityManager;
    void Start()
    {
        InitializeInstance();
    }
    void OnEnable()
    {
        InitializeInstance();

        _personalityManager = PersonalityManager.Instance;
        PersonalityManager.OnPlayerActivated += OnActivated;
        PersonalityManager.OnPlayerSwitched += SetEnabled;
    }

    void InitializeInstance()
    {
        _personalityManager = PersonalityManager.Instance;
        _input = InputSystem.Instance;
        //_anim = GetComponent<Animator>();
        Cursor.lockState = CursorLockMode.Locked;

    }

    void OnDisable()
    {
        PersonalityManager.OnPlayerActivated -= OnActivated;
        PersonalityManager.OnPlayerSwitched -= SetEnabled;
    }
    void SetEnabled(bool canMove, float transitionDuration)
    {
        StartCoroutine(SetMovementEnabled(canMove, transitionDuration));
    }

    private IEnumerator SetMovementEnabled(bool canMove, float transitionDuration)
    {
        if (!canMove)
        {
            isMovementEnabled = canMove;
        }
        else
        {
            yield return new WaitForSeconds(transitionDuration);
            isMovementEnabled = canMove;
        }

            yield break;
    }

    void OnActivated(PlayerController activePlayer, bool isOn)
    {
        isMovementEnabled = (activePlayer == this); // 나면 활성화
        isMovementEnabled = isOn;
    }

    void Update()
    {
        if (!isMovementEnabled) return;

        HandleLook();
        HandleMovement();
        //HandleAnimation();
    }

    void HandleLook()
    {
        // 1. 플레이어 Y축 회전 (좌우 마우스)
        float mouseX = _input.Look.x * _turnSpeed * Time.deltaTime;
        transform.Rotate(Vector3.up * mouseX);

        // 2. 카메라 X축 회전만 (상하 마우스, -90~90 제한)
        _cameraXRotation -= _input.Look.y * _cameraXSensitivity;
        _cameraXRotation = Mathf.Clamp(_cameraXRotation, -90f, 90f);
        cameraTransform.localRotation = Quaternion.Euler(_cameraXRotation, 0f, 0f);
    }

    void HandleMovement()
    {
        Vector3 move = new Vector3(_input.Move.x, 0, _input.Move.y).normalized;

        int layerMask = 1 << LayerMask.NameToLayer("Wall");

        // Raycast로 앞 충돌 확인 (낑김 방지)
        if (Physics.Raycast(transform.position + Vector3.up * 0.5f,
                           transform.TransformDirection(move), out RaycastHit hit, 0.6f, layerMask))
        {
            if (hit.distance < 0.3f)  // 30cm 이내 → 이동 안 함
                return;
        }

        // 안전 이동
        transform.Translate(move * _moveSpeed * Time.deltaTime, Space.Self);
    }

    void HandleAnimation()
    {
        _anim.SetFloat("Forward", _input.Move.y);
        _anim.SetFloat("Side", _input.Move.x);
    }
}