# Minesweeper solver AI (reference only)

`Ai.java` is a Java Swing `SwingWorker` that plays Minesweeper automatically. It
runs a background loop that, each tick:

1. makes a first move (board centre),
2. flags certain mines (`arrowFlagAlgo`),
3. opens certain-safe tiles (`arrowOpenAlgo`),
4. falls back to a backtracking / probability guess (`brainDiceAlgo`) when the
   basic deductions are exhausted.

Board encoding: `userBoard[x][y] ∈ {'0'…'8', 'f' (flag), 'c' (closed)}`.

## ⚠️ Status: INCOMPLETE / TRUNCATED

The provided paste was **cut off mid-method** inside `getAdjacentClosedTiles(...)`.
As a result:

- This file **does not compile** — a truncation marker shows where the paste ended.
- The core solver methods it calls were **not included**:
  `arrowFlagAlgo()`, `arrowOpenAlgo()`, `brainDiceAlgo()`, and the backtracking
  solution generator (`backtrackingAlgoSolutions`).
- It also depends on external types that were **not provided**:
  `GameInterface` (with `userBoard()`, `getSatirSize()`, `getSutunSize()`,
  `openTile()`, `isGameOver()`, `isGameWon()`, `startThreadClock()`, …) and `Pair`.

Kept here verbatim as a **reference snapshot** of the auxiliary/geometry methods
that *were* supplied. To turn it into a working solver you'd need the missing
solver methods, the `GameInterface` implementation, the `Pair` class, and the
rest of the Swing game. Ask if you want me to reconstruct a compilable version.
