package groupid;

import java.util.Random;

/**
 * A self-contained Minesweeper board that exposes exactly the surface the
 * {@link Ai} solver needs. Reconstructed for this repo — the original paste
 * only referenced this type without providing it.
 *
 * Board convention used by the AI (via {@link #userBoard()}):
 *   '0'..'8' = a revealed number tile
 *   'f'      = a flagged tile
 *   'c'      = a closed (unrevealed, unflagged) tile
 *
 * satir = row, sutun = column (Turkish, matching the original naming).
 */
public class GameInterface {

    private final int satirSize;   // rows
    private final int sutunSize;   // cols
    private final int mineCount;
    private final Random rng;

    private boolean[][] mine;
    private final boolean[][] revealed;
    private final boolean[][] flagged;
    private int[][] counts;        // adjacent mine counts

    private boolean minesPlaced = false;
    private boolean gameOver = false;

    public GameInterface(int satirSize, int sutunSize, int mineCount, long seed) {
        this.satirSize = satirSize;
        this.sutunSize = sutunSize;
        this.mineCount = Math.min(mineCount, satirSize * sutunSize - 9);
        this.rng = new Random(seed);
        this.mine = new boolean[satirSize][sutunSize];
        this.revealed = new boolean[satirSize][sutunSize];
        this.flagged = new boolean[satirSize][sutunSize];
        this.counts = new int[satirSize][sutunSize];
    }

    // ---- Surface used by Ai -------------------------------------------------

    public int getSatirSize() { return satirSize; }
    public int getSutunSize() { return sutunSize; }

    /** Snapshot of the board as the player (and the AI) see it. */
    public char[][] userBoard() {
        char[][] b = new char[satirSize][sutunSize];
        for (int x = 0; x < satirSize; x++) {
            for (int y = 0; y < sutunSize; y++) {
                if (revealed[x][y]) b[x][y] = (char) ('0' + counts[x][y]);
                else if (flagged[x][y]) b[x][y] = 'f';
                else b[x][y] = 'c';
            }
        }
        return b;
    }

    public void openTile(int x, int y) {
        if (gameOver || !inBounds(x, y) || flagged[x][y]) return;
        if (!minesPlaced) placeMines(x, y);   // first click is always safe
        if (revealed[x][y]) return;

        if (mine[x][y]) {                      // stepped on a mine
            revealed[x][y] = true;
            gameOver = true;
            return;
        }
        floodReveal(x, y);
    }

    public void flagTile(int x, int y) {
        if (gameOver || !inBounds(x, y) || revealed[x][y]) return;
        flagged[x][y] = true;
    }

    public boolean isGameOver() { return gameOver; }

    /** Won = every non-mine tile is revealed and no mine was triggered. */
    public boolean isGameWon() {
        if (gameOver) return false;
        for (int x = 0; x < satirSize; x++)
            for (int y = 0; y < sutunSize; y++)
                if (!mine[x][y] && !revealed[x][y]) return false;
        return true;
    }

    // Thread hooks referenced by the AI — no-ops in this headless reconstruction.
    public void startThreadClock() {}
    public void startThreadDice() {}
    public void ThreadClockRestart() {}
    public void ThreadDiceSetMode(String mode) {}

    // ---- Internals ----------------------------------------------------------

    private boolean inBounds(int x, int y) {
        return x >= 0 && y >= 0 && x < satirSize && y < sutunSize;
    }

    private void placeMines(int safeX, int safeY) {
        int placed = 0;
        while (placed < mineCount) {
            int x = rng.nextInt(satirSize);
            int y = rng.nextInt(sutunSize);
            if (mine[x][y]) continue;
            if (Math.abs(x - safeX) <= 1 && Math.abs(y - safeY) <= 1) continue; // keep first click open
            mine[x][y] = true;
            placed++;
        }
        for (int x = 0; x < satirSize; x++)
            for (int y = 0; y < sutunSize; y++)
                counts[x][y] = neighborMines(x, y);
        minesPlaced = true;
    }

    private int neighborMines(int x, int y) {
        int c = 0;
        for (int dx = -1; dx <= 1; dx++)
            for (int dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                int nx = x + dx, ny = y + dy;
                if (inBounds(nx, ny) && mine[nx][ny]) c++;
            }
        return c;
    }

    private void floodReveal(int x, int y) {
        if (!inBounds(x, y) || revealed[x][y] || flagged[x][y] || mine[x][y]) return;
        revealed[x][y] = true;
        if (counts[x][y] != 0) return;
        for (int dx = -1; dx <= 1; dx++)
            for (int dy = -1; dy <= 1; dy++) {
                if (dx == 0 && dy == 0) continue;
                floodReveal(x + dx, y + dy);
            }
    }

    // ---- Debug helper -------------------------------------------------------

    public String render() {
        char[][] b = userBoard();
        StringBuilder sb = new StringBuilder();
        for (int x = 0; x < satirSize; x++) {
            for (int y = 0; y < sutunSize; y++) {
                char ch = b[x][y];
                sb.append(ch == '0' ? '.' : ch).append(' ');
            }
            sb.append('\n');
        }
        return sb.toString();
    }
}
