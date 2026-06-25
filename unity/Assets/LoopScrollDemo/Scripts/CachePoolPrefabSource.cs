using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace LoopScrollDemo
{
    /// <summary>
    /// A reusable <see cref="LoopScrollPrefabSource"/> backed by a simple Stack pool.
    /// LoopScrollRect calls <see cref="GetObject"/> when a cell scrolls into view and
    /// <see cref="ReturnObject"/> when it scrolls out — so a fixed handful of cells are
    /// recycled instead of instantiating/destroying one per row. This is what makes a
    /// list of 10,000 (or infinite) rows cheap in draw calls and memory.
    /// </summary>
    public class CachePoolPrefabSource : LoopScrollPrefabSource
    {
        readonly GameObject prefab;
        readonly Transform poolRoot;
        readonly Stack<Transform> pool = new Stack<Transform>();

        /// <param name="prefab">Cell prefab (needs a LayoutElement + a ScrollCell).</param>
        /// <param name="poolRoot">Where inactive, recycled cells are parked.</param>
        public CachePoolPrefabSource(GameObject prefab, Transform poolRoot)
        {
            this.prefab = prefab;
            this.poolRoot = poolRoot;
        }

        public GameObject GetObject(int index)
        {
            if (pool.Count == 0)
                return Object.Instantiate(prefab);

            Transform candidate = pool.Pop();
            candidate.gameObject.SetActive(true);
            return candidate.gameObject;
        }

        public void ReturnObject(Transform trans)
        {
            // Let the cell reset itself, then deactivate and park it for reuse.
            trans.SendMessage("ScrollCellReturn", SendMessageOptions.DontRequireReceiver);
            trans.gameObject.SetActive(false);
            trans.SetParent(poolRoot, false);
            pool.Push(trans);
        }
    }
}
