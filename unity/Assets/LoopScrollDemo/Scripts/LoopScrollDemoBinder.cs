using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace LoopScrollDemo
{
    /// <summary>
    /// Drop this on the same GameObject as a LoopVerticalScrollRect or
    /// LoopHorizontalScrollRect. On Start it builds the pooled prefab source and the
    /// data source, assigns them, sets totalCount, and fills the view — a clearer,
    /// split-responsibility replacement for the upstream sample's InitOnStart.
    ///
    /// Scene setup (see README):
    ///   1. Add LoopVerticalScrollRect (or Horizontal) to a ScrollView's Viewport/Content.
    ///   2. Give Content the matching layout group + ContentSizeFitter as usual.
    ///   3. Build a cell prefab with a LayoutElement (preferred width/height) and a ScrollCell.
    ///   4. Assign cellPrefab here. Press play.
    /// </summary>
    [RequireComponent(typeof(LoopScrollRect))]
    [DisallowMultipleComponent]
    public class LoopScrollDemoBinder : MonoBehaviour
    {
        [Tooltip("Cell prefab. Needs a LayoutElement (preferred width/height) and a ScrollCell component.")]
        public GameObject cellPrefab;

        [Tooltip("How many rows to show. Use -1 for an effectively infinite list.")]
        public int totalCount = 10000;

        [Tooltip("Optional: parent that recycled (inactive) cells are parked under. Defaults to this transform.")]
        public Transform poolRoot;

        LoopScrollRect scroll;

        void Start()
        {
            if (cellPrefab == null)
            {
                Debug.LogError("[LoopScrollDemoBinder] cellPrefab is not assigned.", this);
                return;
            }

            scroll = GetComponent<LoopScrollRect>();
            scroll.prefabSource = new CachePoolPrefabSource(cellPrefab, poolRoot != null ? poolRoot : transform);

            // Finite list -> list-backed data source. Infinite -> a lazy value function.
            if (totalCount < 0)
                scroll.dataSource = new ListDataSource(idx => "Row #" + idx);
            else
                scroll.dataSource = new ListDataSource(BuildRows(totalCount));

            scroll.totalCount = totalCount;

            // Fill from the start. Use RefillCellsFromEnd() to start scrolled to the bottom.
            scroll.RefillCells();
        }

        static List<string> BuildRows(int count)
        {
            var rows = new List<string>(count);
            for (int i = 0; i < count; i++)
                rows.Add("Row #" + i);
            return rows;
        }
    }
}
