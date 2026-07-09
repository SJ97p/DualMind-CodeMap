using System.Collections;
using System.Collections.Generic;
using UnityEngine;
public enum ColorType { BASIC, HAPPINESS, LOVE, MELANCHOLY, RAGE, FEAR }

public class ShaderColorTransition : MonoBehaviour
{
    public ColorType targetType;
    public float duration = 1f;
    [SerializeField] public Material[] materials;

    private MeshRenderer _renderer;

    private Dictionary<ColorType, Material> colorMap = new ();


    private void Start()
    {
        _renderer = GetComponent<MeshRenderer>();
    }
    public void ChangeColor()
    {
        StartCoroutine(SwapMaterial(targetType));
    }

    public void ChangeColorByType(ColorType targetType)
    {
        StartCoroutine(SwapMaterial(targetType));
    }

    public IEnumerator SwapMaterial(ColorType targetType)
    {
        if (_renderer == null) yield break;

        _renderer.material = materials[(int)targetType];  // 그냥 즉시 교체[web:97]
        yield return null;
    }


}
