package groupid;

/**
 * Headless runner: plays N Minesweeper boards with the Ai solver and reports the
 * win rate. Usage:  java -cp out groupid.Main [rows cols mines games]
 */
public class Main {
    public static void main(String[] args) {
        int rows  = args.length > 0 ? Integer.parseInt(args[0]) : 16;
        int cols  = args.length > 1 ? Integer.parseInt(args[1]) : 16;
        int mines = args.length > 2 ? Integer.parseInt(args[2]) : 40;
        int games = args.length > 3 ? Integer.parseInt(args[3]) : 100;

        int wins = 0;
        for (int g = 0; g < games; g++) {
            GameInterface game = new GameInterface(rows, cols, mines, 1000L + g);
            Ai ai = new Ai(game);
            ai.solve();
            if (game.isGameWon()) wins++;
        }

        System.out.printf("Board %dx%d, %d mines — %d games: %d wins (%.1f%%)%n",
                rows, cols, mines, games, wins, 100.0 * wins / games);

        // Show one finished board for a sanity check.
        GameInterface demo = new GameInterface(rows, cols, mines, 42L);
        Ai demoAi = new Ai(demo);
        demoAi.solve();
        System.out.println("\nExample final board (" + (demo.isGameWon() ? "WON" : "LOST") + "):");
        System.out.print(demo.render());
    }
}
