using UnityEngine;
using UnityEngine.UI;

namespace LoopScrollDemo
{
    /// <summary>
    /// Attach to the cell prefab. LoopScrollRect recycles cells, so the same
    /// GameObject is re-bound to many different data indices over its lifetime.
    ///
    /// Two ways data reaches this cell:
    ///   • <see cref="Bind"/> — typed, called directly by <see cref="ListDataSource"/> (preferred).
    ///   • <c>ScrollCellIndex(int)</c> — the package's default convention, invoked via
    ///     SendMessage("ScrollCellIndex", idx) from a stock LoopScrollDataSource.
    /// Keeping both means the prefab works with this demo and with the upstream sample.
    /// </summary>
    [DisallowMultipleComponent]
    public class ScrollCell : MonoBehaviour
    {
        [Tooltip("Optional label updated with the row's value.")]
        public Text label;

        [Tooltip("Optional background tinted per index so recycling is visible while scrolling.")]
        public Image background;

        /// <summary>Data index this cell currently shows, or -1 while pooled.</summary>
        public int Index { get; private set; } = -1;

        /// <summary>Preferred entry point: bind a concrete value to this cell.</summary>
        public void Bind(int idx, string value)
        {
            Index = idx;
            if (label != null) label.text = value;
            if (background != null) background.color = Tint(idx);
            gameObject.name = "Cell " + idx;
        }

        // Compatibility with the package default: ProvideData -> SendMessage("ScrollCellIndex", idx).
        void ScrollCellIndex(int idx) => Bind(idx, "Cell " + idx);

        // Called by the prefab source when this cell is recycled back into the pool.
        void ScrollCellReturn() => Index = -1;

        static Color Tint(int idx)
        {
            float h = Mathf.Repeat(idx * 0.1217f, 1f);
            return Color.HSVToRGB(h, 0.55f, 0.95f);
        }
    }
}
