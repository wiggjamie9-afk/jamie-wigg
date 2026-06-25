# LoopScrollRect — Unity subproject

Self-contained Unity project that adds [**LoopScrollRect**](https://github.com/qiankanglai/LoopScrollRect)
(`me.qiankanglai.loopscrollrect`) and a working starter integration. LoopScrollRect makes
a `ScrollRect` *reusable*: it only builds the cells currently on screen and recycles them as
you scroll, so a list of 10,000 — or an infinite list — stays cheap on draw calls, memory,
and load time while scrolling smoothly.

> ⚠️ This `unity/` folder is a **standalone Unity project**, deliberately isolated from the
> rest of this repo (the marketing site + Studio web app). It does not affect the GitHub
> Pages or Cloudflare builds. If you have a real game repo, you can move `unity/Assets/LoopScrollDemo`
> and the manifest entry into it verbatim — nothing here is repo-specific.

Requires **Unity 2019.4+** (project is pinned to 2022.3 LTS in `ProjectSettings/ProjectVersion.txt`;
change that line to match your editor). On first open, Unity resolves the package from OpenUPM
and regenerates `Library/`, the rest of `ProjectSettings/`, and `Packages/packages-lock.json`.

---

## 1. The package — three ways to add it

The project is already wired for **Option A** (the `Packages/manifest.json` here contains the
scoped registry + dependency). The other two are for adding it to *your* project.

### A. Scoped registry in `manifest.json` (what this project uses)
```jsonc
{
  "scopedRegistries": [
    {
      "name": "package.openupm.com",
      "url": "https://package.openupm.com",
      "scopes": [ "me.qiankanglai.loopscrollrect" ]
    }
  ],
  "dependencies": {
    "me.qiankanglai.loopscrollrect": "1.1.5"
  }
}
```

### B. OpenUPM CLI (does the above for you)
```bash
openupm add me.qiankanglai.loopscrollrect
```

### C. Git URL (Package Manager → *Add package from git URL…*)
```
https://github.com/qiankanglai/LoopScrollRect.git
```

To pull in the upstream demo scenes/prefabs too: Package Manager → LoopScrollRect →
**Samples** → *Import* "Demo".

---

## 2. The starter integration (`Assets/LoopScrollDemo/Scripts`)

Plain C#, namespace `LoopScrollDemo`. LoopScrollRect's interfaces live in `UnityEngine.UI`.

| File | Role |
|---|---|
| `CachePoolPrefabSource.cs` | `LoopScrollPrefabSource` backed by a `Stack` pool. `GetObject` reuses a parked cell or instantiates; `ReturnObject` resets, deactivates, and pools it. **This is the part that makes it reusable.** |
| `ListDataSource.cs` | `LoopScrollDataSource`. `ProvideData(transform, idx)` resolves the row value and binds it to the cell. Two constructors: from an `IList<string>` (finite) or a `Func<int,string>` (infinite). |
| `ScrollCell.cs` | Cell component. Exposes typed `Bind(idx, value)` **and** the package-standard `ScrollCellIndex(int)` receiver, plus `ScrollCellReturn()` for recycle cleanup. |
| `VariableSizeHelper.cs` | Optional `LoopScrollSizeHelper` — only needed when cells have **different** sizes. Returns the summed size of `[itemStart, itemEnd)`. |
| `LoopScrollDemoBinder.cs` | `MonoBehaviour` that ties it together on `Start`: assigns `prefabSource` + `dataSource`, sets `totalCount`, calls `RefillCells()`. A cleaner split of the upstream `InitOnStart` sample. |

---

## 3. Scene setup (one-time, in the editor)

LoopScrollRect components and the cell prefab are authored in the Unity editor — they can't be
committed as text. Steps:

1. **Scroll View**: GameObject → UI → Scroll View. On the root, **replace** the stock
   `Scroll Rect` with **`LoopVerticalScrollRect`** (or `LoopHorizontalScrollRect`).
   - Set its **Content** to the Content transform.
2. **Content layout**: on Content add a **Vertical Layout Group** (or Horizontal/Grid to match)
   and a **Content Size Fitter**, exactly as a normal scroll list.
3. **Cell prefab**: make a UI GameObject (e.g. an Image with a child Text) and add:
   - a **Layout Element** with **Preferred Width / Preferred Height** set (LoopScrollRect uses
     these to lay out cells), and
   - the **`ScrollCell`** component (wire its `label` / `background` fields).
   Save it as a prefab.
4. **Binder**: add **`LoopScrollDemoBinder`** to the same GameObject as the LoopScrollRect.
   Assign **Cell Prefab**; set **Total Count** (use **-1** for infinite).
5. Press **Play**.

> Prefer the inspector-only route? You can instead use the package's `InitOnStart` sample and
> just set Total Count / Refill in the LoopScrollRect inspector — but the scripts here give you
> a clean, typed data path to grow from.

---

## 4. Runtime API cheat-sheet (LoopScrollRect inspector + code)

- **Total Count** — number of cells; **negative = infinite**.
- **Reverse Direction** — scroll bottom→top / right→left (also flip Content pivot & anchor).
- `RefillCells()` / `RefillCellsFromEnd()` — clear and rebuild layout from start / end.
- `RefreshCells()` — re-bind visible cells' data without touching layout (cheap).
- `ClearCells()` — empty the list, set total count to 0.
- `GetFirstItem(out offset)` / `GetLastItem(out offset)` — current visible index + offset.
- `ScrollToCell(index, speed)` / `ScrollToCellWithinTime(index, time)` — programmatic scroll.

Set `totalCount` then call `RefillCells()` after your data changes; call `RefreshCells()` when
only the *contents* changed, not the count — that path only updates data, for performance.
