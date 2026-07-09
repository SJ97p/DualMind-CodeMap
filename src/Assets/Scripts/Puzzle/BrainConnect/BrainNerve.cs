using System.Collections;
using Unity.VisualScripting;
using UnityEngine;

public class BrainNerve : MonoBehaviour, IPlayerInteractable, IPulseReactive
{
    private bool isOn=false;
    private ShaderColorTransition sct;
    public string GetPrompt() => "BrainNerve";
    private void Start()
    {
        sct = GetComponent<ShaderColorTransition>();
    }

    public void Interact()
    {
        if (isOn) return;

        sct = GetComponent<ShaderColorTransition>();
        StageManager.Instance.GetCurrentStage().Trigger();
        sct.ChangeColorByType(sct.targetType);
        StageManager.Instance.GetCurrentStage().Count++;
        Debug.Log(StageManager.Instance.GetCurrentStage().Count);
        isOn = true;
    }
    public void Highlight(bool active)
    {
        StartCoroutine(SetVisuable(active));
    }

    private IEnumerator SetVisuable(bool active)
    {

        if (!gameObject.TryGetComponent<MeshRenderer>(out var renderer))
        {
            Debug.Log($"{gameObject.name} : No Exist Renderer!");
        }

        float time = 0;
        while (time < 1f)
        {
            time += Time.deltaTime;

        }
        yield return null;
    }

    public void OnPulseHit(Collider hit, float radius, float progress)
    {
        StartCoroutine(ReactPulse());
    }
    private IEnumerator ReactPulse()
    {
        yield return sct.SwapMaterial(sct.targetType);
        yield return new WaitForSeconds(15f);
        yield return sct.SwapMaterial(ColorType.BASIC);
    }
}
