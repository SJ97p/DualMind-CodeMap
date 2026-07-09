using UnityEngine;
using UnityEngine.InputSystem;

public class InputSystem : Singleton<InputSystem>
{
    [Header("Key Bindings")]
    [SerializeField] private KeyCode switchKey = KeyCode.Tab;
    [SerializeField] private KeyCode interactKey = KeyCode.F;
    [SerializeField] private KeyCode scanKey = KeyCode.LeftShift;

    public static System.Action OnInteractPressed;
    public static System.Action OnSwitchPressed;
    public static System.Action OnScanPressed;
    public bool CanInput { get; private set; } = false;
    public bool CanSwitch { get; private set; } = false;
    public bool CanScan { get; private set; } = true;

    public Vector2 Move { get; private set; }
    public Vector2 Look { get; private set; }

    public bool Fire { get; private set; }
    public bool AltAction { get; private set; }

    protected override void Awake()
    {
        base.Awake();
    }

    void Update()
    {
        if (CanInput)
        {
            Move = new Vector2(Input.GetAxisRaw("Horizontal"), Input.GetAxisRaw("Vertical"));
            Look = new Vector2(Input.GetAxisRaw("Mouse X"), Input.GetAxisRaw("Mouse Y"));
            Fire = Input.GetAxis("Fire1") > 0f;
            AltAction = Input.GetKeyDown(KeyCode.Mouse1);
            if (Input.GetKeyDown(interactKey))
            {
                OnInteractPressed?.Invoke();  // 이벤트 발사!
            }
            if (CanSwitch && Input.GetKeyDown(switchKey))
            {
                OnSwitchPressed?.Invoke();  // 이벤트 발사!
            }
            if (CanScan && Input.GetKeyDown(scanKey))
            {
                OnScanPressed?.Invoke();  // 이벤트 발사!
            }
        }
    }

    public void SetCanInput(bool isOn)
    {
        CanInput = isOn;
    }

    public void SetCanSwitch(bool isOn)
    {
        CanSwitch = isOn;
    }
    public void SetCanScan(bool isOn)
    {
        CanScan = isOn;
    }
}
