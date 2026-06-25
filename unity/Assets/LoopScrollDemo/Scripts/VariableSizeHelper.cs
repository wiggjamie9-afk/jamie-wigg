using System;
using UnityEngine.UI;

namespace LoopScrollDemo
{
    /// <summary>
    /// Optional. Implement <see cref="LoopScrollSizeHelper"/> only when cells have
    /// different sizes — it lets LoopScrollRect compute scroll offset and scrollbar
    /// size precisely instead of estimating. <see cref="GetItemsSize"/> must return the
    /// summed size (height for vertical, width for horizontal) of the half-open range
    /// [itemStart, itemEnd). For uniform cells you don't need this at all.
    /// </summary>
    public class VariableSizeHelper : LoopScrollSizeHelper
    {
        readonly Func<int, float> sizeFor;

        public VariableSizeHelper(Func<int, float> sizeFor)
        {
            this.sizeFor = sizeFor ?? throw new ArgumentNullException(nameof(sizeFor));
        }

        public float GetItemsSize(int itemStart, int itemEnd)
        {
            if (itemEnd <= itemStart) return 0f;
            float sum = 0f;
            for (int i = itemStart; i < itemEnd; i++)
                sum += sizeFor(i);
            return sum;
        }
    }
}
