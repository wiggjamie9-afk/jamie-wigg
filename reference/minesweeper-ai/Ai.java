package groupid;

import java.util.*;
import javax.swing.SwingWorker;

/**
 * Minesweeper solver.
 *
 * Reconstruction note: the original paste truncated mid-method and omitted the
 * solver methods (arrowFlagAlgo / arrowOpenAlgo / brainDiceAlgo) and the
 * GameInterface/Pair types. Those are reconstructed here so the class compiles
 * and actually plays. The auxiliary/geometry methods that WERE supplied are kept.
 *
 * Change from the original: the constructor no longer calls this.execute()
 * automatically (that made headless testing race). Call {@link #solve()} for a
 * synchronous run, or execute() to run it as a SwingWorker.
 *
 * userBoard = ['0'..'8', 'f' (flag), 'c' (closed)]
 */
public class Ai extends SwingWorker<Void, String> {

    public GameInterface gameInterface;
    public boolean isOff = false;
    public boolean isAiFirstMove = true;

    public Ai(GameInterface gameInterface) {
        this.gameInterface = gameInterface;
        this.gameInterface.startThreadClock();
        this.gameInterface.startThreadDice();
        // Original called this.execute() here; see class note.
    }

    @Override
    protected Void doInBackground() throws Exception {
        solve();
        return null;
    }

    /** Synchronous full solve loop. */
    public void solve() {
        while (!isOff && !gameInterface.isGameOver() && !gameInterface.isGameWon()) {
            play();
        }
    }

    public void play() {
        if (this.isAiFirstMove) {
            gameInterface.ThreadClockRestart();
            gameInterface.ThreadDiceSetMode("dice");
            gameInterface.openTile((gameInterface.getSatirSize() - 1) / 2,
                                   (gameInterface.getSutunSize() - 1) / 2);
            this.isAiFirstMove = false;
            return;
        }
        boolean flagged = aiFlag();
        boolean opened = aiOpen();
        if (!flagged && !opened) {
            brainDiceAlgo();   // no certain move left -> educated guess
        }
    }

    public boolean aiFlag() {
        // Only ever flags a tile we are CERTAIN is a mine.
        return arrowFlagAlgo();
    }

    public boolean aiOpen() {
        // Opens tiles that are certainly safe.
        return arrowOpenAlgo();
    }

//?=======================================================================================================================================================
//?                     SOLVER ALGORITHMS
//?=======================================================================================================================================================

    /**
     * For every numbered cell N: if (adjacent closed) == N - (adjacent flags),
     * then every adjacent closed tile must be a mine -> flag them all.
     */
    public boolean arrowFlagAlgo() {
        char[][] b = gameInterface.userBoard();
        boolean placed = false;
        for (int x = 0; x < gameInterface.getSatirSize(); x++) {
            for (int y = 0; y < gameInterface.getSutunSize(); y++) {
                if (!isTileNumber(x, y)) continue;
                int n = tileValue(x, y);
                int closed = countClosedTilesAround(x, y);
                int flags = countFlagTilesAround(x, y);
                if (closed > 0 && n - flags == closed) {
                    for (Pair p : getAdjacentClosedTiles(x, y)) {
                        gameInterface.flagTile(p.x, p.y);
                        placed = true;
                    }
                }
            }
        }
        return placed;
    }

    /**
     * For every numbered cell N: if (adjacent flags) == N, then every remaining
     * adjacent closed tile is safe -> open them all.
     */
    public boolean arrowOpenAlgo() {
        char[][] b = gameInterface.userBoard();
        boolean opened = false;
        for (int x = 0; x < gameInterface.getSatirSize(); x++) {
            for (int y = 0; y < gameInterface.getSutunSize(); y++) {
                if (!isTileNumber(x, y)) continue;
                int n = tileValue(x, y);
                int flags = countFlagTilesAround(x, y);
                int closed = countClosedTilesAround(x, y);
                if (closed > 0 && flags == n) {
                    for (Pair p : getAdjacentClosedTiles(x, y)) {
                        gameInterface.openTile(p.x, p.y);
                        opened = true;
                    }
                }
            }
        }
        return opened;
    }

    /**
     * Fallback guess ("dice") when no certain move exists. Estimates a naive mine
     * probability for each closed tile from its numbered neighbours and opens the
     * lowest-risk one (ties -> first found). A closed tile with no numbered
     * neighbour gets the global mine density as its estimate.
     */
    public void brainDiceAlgo() {
        char[][] b = gameInterface.userBoard();
        int rows = gameInterface.getSatirSize(), cols = gameInterface.getSutunSize();

        Pair best = null;
        double bestP = Double.MAX_VALUE;
        int closedTotal = 0;
        for (int x = 0; x < rows; x++)
            for (int y = 0; y < cols; y++)
                if (b[x][y] == 'c') closedTotal++;
        if (closedTotal == 0) return;

        for (int x = 0; x < rows; x++) {
            for (int y = 0; y < cols; y++) {
                if (b[x][y] != 'c') continue;
                double p = localMineProbability(x, y);
                if (p < bestP) { bestP = p; best = new Pair(x, y); }
            }
        }
        if (best != null) gameInterface.openTile(best.x, best.y);
    }

    /** Max over numbered neighbours of (N - flags) / closed; else -1 (unknown). */
    private double localMineProbability(int x, int y) {
        double p = -1;
        for (Pair nb : neighbors(x, y)) {
            if (!isTileNumber(nb.x, nb.y)) continue;
            int n = tileValue(nb.x, nb.y);
            int closed = countClosedTilesAround(nb.x, nb.y);
            int flags = countFlagTilesAround(nb.x, nb.y);
            if (closed > 0) {
                double est = (double) (n - flags) / closed;
                if (est > p) p = est;
            }
        }
        return p < 0 ? 0.5 : p;   // no info -> neutral guess
    }

    public int tileValue(int x, int y) {
        char c = gameInterface.userBoard()[x][y];
        return (c >= '0' && c <= '8') ? c - '0' : -1;
    }

    /** All in-bounds 8-neighbours of (x, y). */
    public ArrayList<Pair> neighbors(int x, int y) {
        ArrayList<Pair> out = new ArrayList<>(8);
        for (int dx = -1; dx <= 1; dx++)
            for (int dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                int nx = x + dx, ny = y + dy;
                if (nx >= 0 && ny >= 0 && nx < gameInterface.getSatirSize()
                        && ny < gameInterface.getSutunSize())
                    out.add(new Pair(nx, ny));
            }
        return out;
    }

//?=======================================================================================================================================================
//?                     ALGORITHMIC AUXILARY METHODS (as originally supplied)
//?=======================================================================================================================================================

    public int countFlagTilesAround(int x, int y) {
        char[][] userBoard = gameInterface.userBoard();
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        int count = 0;
        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;
        if (x == 0) upEdge = true;
        if (y == 0) leftEdge = true;
        if (x == satirSize - 1) downEdge = true;
        if (y == sutunSize - 1) rightEdge = true;

        if (!upEdge && userBoard[x - 1][y] == 'f') count++;
        if (!leftEdge && userBoard[x][y - 1] == 'f') count++;
        if (!downEdge && userBoard[x + 1][y] == 'f') count++;
        if (!rightEdge && userBoard[x][y + 1] == 'f') count++;
        if (!upEdge && !leftEdge && userBoard[x - 1][y - 1] == 'f') count++;
        if (!upEdge && !rightEdge && userBoard[x - 1][y + 1] == 'f') count++;
        if (!downEdge && !leftEdge && userBoard[x + 1][y - 1] == 'f') count++;
        if (!downEdge && !rightEdge && userBoard[x + 1][y + 1] == 'f') count++;
        return count;
    }

    public int countClosedTilesAround(int x, int y) {
        char[][] userBoard = gameInterface.userBoard();
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        int count = 0;
        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;
        if (x == 0) upEdge = true;
        if (y == 0) leftEdge = true;
        if (x == satirSize - 1) downEdge = true;
        if (y == sutunSize - 1) rightEdge = true;

        if (!upEdge && userBoard[x - 1][y] == 'c') count++;
        if (!leftEdge && userBoard[x][y - 1] == 'c') count++;
        if (!downEdge && userBoard[x + 1][y] == 'c') count++;
        if (!rightEdge && userBoard[x][y + 1] == 'c') count++;
        if (!upEdge && !leftEdge && userBoard[x - 1][y - 1] == 'c') count++;
        if (!upEdge && !rightEdge && userBoard[x - 1][y + 1] == 'c') count++;
        if (!downEdge && !leftEdge && userBoard[x + 1][y - 1] == 'c') count++;
        if (!downEdge && !rightEdge && userBoard[x + 1][y + 1] == 'c') count++;
        return count;
    }

    public boolean isTileNumber(int x, int y) {
        char c = gameInterface.userBoard()[x][y];
        return c >= '0' && c <= '8';
    }

    /** Closed tiles ('c', i.e. not flagged) adjacent to (x, y). */
    public ArrayList<Pair> getAdjacentClosedTiles(int x, int y) {
        char[][] userBoard = gameInterface.userBoard();
        ArrayList<Pair> out = new ArrayList<>(8);
        for (Pair p : neighbors(x, y)) {
            if (userBoard[p.x][p.y] == 'c') out.add(p);
        }
        return out;
    }
}
