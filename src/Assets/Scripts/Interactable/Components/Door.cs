using System.Collections;
using UnityEngine;
using UnityEngine.SceneManagement;

public class Door : MonoBehaviour, IPlayerInteractable
{
    [SerializeField] private int doorNum = 0;
    [SerializeField] Transform target;
    [SerializeField] public bool canOpen = false;

    //[SerializeField] private InteractableConfig data;
    [SerializeField] private float rotationSpeed = 2f;  // 속도 조절
    [SerializeField] private float rotationAmount = 90f;
    [SerializeField] private bool isOpen = false;

    private Quaternion closedRot;  // 닫힌 목표
    private Quaternion openRot;    // 열린 목표

    private Coroutine doorCoroutine;

    //public InteractableConfig Data => data;
    public string GetPrompt() => "F - 문 당기기";
    private void OnEnable()
    {
        InitalizeRotation();
        StageManager.OnSetDoor += SetDoor;
    }

    private void OnDisable()
    {
        StageManager.OnSetDoor -= SetDoor;
        if (doorCoroutine != null) StopCoroutine(doorCoroutine);
    }

    private void SetDoor(int doorNum, bool isOpen)
    {
        if (this.doorNum == doorNum)
        {
            this.isOpen = isOpen;
            StartCoroutine(DoorMove());
        }
    }

    public void Interact()
    {
        if (!canOpen) return;
        ToggleDoor();
    }

    private void ToggleDoor()
    {
        isOpen = !isOpen;
        AnimateDoor();
    }

    private void AnimateDoor()
    {
        if (doorCoroutine != null) StopCoroutine(doorCoroutine);
        doorCoroutine = StartCoroutine(DoorMove());
    }

    public void Highlight(bool active)
    {
        GetComponent<InteractionVisualizer>()?.Highlight(active);
    }
    private void InitalizeRotation()
    {
        if (target == null) return;
        closedRot = target.localRotation;  // 현재를 닫힌 상태로 (local 사용 추천)
        openRot = closedRot * Quaternion.Euler(0f, rotationAmount, 0f);

        // 초기 상태에 맞게 즉시 애니메이션
        if (isOpen) target.localRotation = openRot;
    }

    IEnumerator DoorMove()
    {
        Quaternion startRot = target.localRotation;
        Quaternion endRot = isOpen ? openRot : closedRot;  // isOpen 따라 자동 선택!

        float elapsed = 0f;
        float duration = 1f / rotationSpeed;  // 속도 = 1/duration

        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            float t = elapsed / duration;
            target.localRotation = Quaternion.Slerp(startRot, endRot, t);
            yield return null;
        }

        target.localRotation = endRot;  // 정확히 끝나게
    }
}
