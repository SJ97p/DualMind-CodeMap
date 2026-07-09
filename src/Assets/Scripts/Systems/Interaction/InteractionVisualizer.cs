using UnityEngine;

public class InteractionVisualizer : MonoBehaviour
{
    [SerializeField] private int outlineMaterialIndex = 1;
    [SerializeField] private string outlineThicknessProperty = "_Outline_Thickness";
    [SerializeField] private float outlineThicknessOn = 0.01f;
    [SerializeField] private float outlineThicknessOff = 0f;

    private MeshRenderer _renderer;
    private Material[] _originalMaterials;
    private bool _isHighlighted = false;

    void Awake()
    {
        _renderer = GetComponent<MeshRenderer>();
        _originalMaterials = _renderer.materials;
    }
    public void Highlight(bool active)
    {
        if (_isHighlighted == active) return;  // 중복 방지

        _isHighlighted = active;
        Material[] mats = _renderer.materials;
        mats[outlineMaterialIndex].SetFloat(outlineThicknessProperty,
            active ? outlineThicknessOn : outlineThicknessOff);
        _renderer.materials = mats;
    }

    // Update is called once per frame
    void Update()
    {
        
    }
}
