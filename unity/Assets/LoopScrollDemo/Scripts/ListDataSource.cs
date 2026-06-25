using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace LoopScrollDemo
{
    /// <summary>
    /// Feeds row values to cells. LoopScrollRect calls <see cref="ProvideData"/> whenever
    /// a cell needs to display a given index. We resolve the value and hand it to the
    /// cell's typed <see cref="ScrollCell.Bind"/> (cleaner and faster than SendMessage).
    ///
    /// Two constructors:
    ///   • from an <see cref="IList{T}"/> — the common finite-list case.
    ///   • from a <see cref="Func{Int32, String}"/> — works for an infinite list
    ///     (totalCount = -1), where there is no materialized backing collection.
    /// </summary>
    public class ListDataSource : LoopScrollDataSource
    {
        readonly Func<int, string> valueFor;

        public ListDataSource(Func<int, string> valueFor)
        {
            this.valueFor = valueFor ?? throw new ArgumentNullException(nameof(valueFor));
        }

        public ListDataSource(IList<string> rows)
            : this(idx => (idx >= 0 && idx < rows.Count) ? rows[idx] : string.Empty)
        {
        }

        public void ProvideData(Transform transform, int idx)
        {
            var cell = transform.GetComponent<ScrollCell>();
            if (cell != null)
                cell.Bind(idx, valueFor(idx));
            else
                // Fall back to the package convention if the prefab has no ScrollCell.
                transform.SendMessage("ScrollCellIndex", idx, SendMessageOptions.DontRequireReceiver);
        }
    }
}
