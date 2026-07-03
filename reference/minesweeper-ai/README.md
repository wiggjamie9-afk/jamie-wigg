# Minesweeper solver AI

A Java Minesweeper auto-solver. `Ai` plays a board exposed through
`GameInterface`, using two certain-move deductions plus a probability guess when
no certain move exists.

Board encoding: `userBoard()[x][y] ∈ {'0'…'8', 'f' (flag), 'c' (closed)}`.

## ✅ Status: COMPILES & RUNS

The original paste was truncated mid-method and omitted the solver methods and the
`GameInterface`/`Pair` types. This directory is a **complete, compilable
reconstruction**:

| File | Role |
|---|---|
| `Ai.java` | Solver: `arrowFlagAlgo` (certain mines → flag), `arrowOpenAlgo` (certain safe → open), `brainDiceAlgo` (lowest-probability guess), plus the original auxiliary methods and the completed `getAdjacentClosedTiles`. |
| `GameInterface.java` | A real headless Minesweeper board (safe first click, flood-reveal, win/lose). |
| `Pair.java` | `(x, y)` coordinate. |
| `Main.java` | Headless runner: plays N games, reports win rate. |

### Build & run

```bash
cd reference/minesweeper-ai
javac -d out *.java
java -Djava.awt.headless=true -cp out groupid.Main            # 16x16, 40 mines, 100 games
java -Djava.awt.headless=true -cp out groupid.Main 16 16 40 200
```

Sample result: **~66% win rate** on 16×16 / 40 mines over 200 games — expected for
a single-point-deduction solver with a probability fallback (losses come from
forced guesses).

### Algorithm

1. **First move** — open the board centre.
2. **`arrowFlagAlgo`** — for a number `N` where `adjacentClosed == N − adjacentFlags`, all closed neighbours are mines → flag them.
3. **`arrowOpenAlgo`** — for a number `N` where `adjacentFlags == N`, all remaining closed neighbours are safe → open them.
4. **`brainDiceAlgo`** — when neither fires, estimate each closed tile's mine probability from its numbered neighbours and open the lowest-risk one.

### Notes / differences from the original

- The constructor **no longer calls `this.execute()`** automatically (it made
  headless testing race). Use `solve()` for a synchronous run, or `execute()` to
  run it as a `SwingWorker`.
- `brainDiceAlgo` uses a naive per-tile probability rather than a full CSP /
  backtracking enumeration. That's enough to play well; a full constraint solver
  would push the win rate higher on dense boards. Ask if you want that upgrade.
