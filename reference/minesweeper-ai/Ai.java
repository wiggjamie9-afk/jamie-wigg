package groupid;
import java.util.*;
import javax.swing.SwingWorker;


public class Ai extends SwingWorker<Void, String>{

    //!===============================================================
    //!  KAC DENEMEDE EXPERT'DE BASARILI OLDU AI TESTLER:
    //!  6, 2, 10, 5, 4, 2, 8, 4, 2, 1, 2, 6, 4, 9, 7
    //!  expertte ortalamada 7 elde 1 basarili oluyor genelde  ...
    //!===============================================================

    //?  userBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8, f, c] // f = flag // c = closed

    public GameInterface gameInterface;
    public boolean isOff = false;
    public boolean isAiFirstMove = true;
    public int endGameLimit = 9;
    public boolean isEndGame = false;
    public ArrayList<boolean[]> backtrackingAlgoSolutions;

    public Ai(GameInterface gameInterface){

        this.gameInterface = gameInterface;
        this.gameInterface.startThreadClock();
        this.gameInterface.startThreadDice();

        this.execute();
    }

    @Override
    protected Void doInBackground() throws Exception {

        while(!isCancelled() && !isOff){

            if(gameInterface.isGameOver() || gameInterface.isGameWon()){

                break;//? OYUN BITTI ZATEN BU AI THREADININ ISI BITTI ARTIK
            }

            this.play();    //?     Tum AI hareketleri burada donecek

            Thread.sleep(10);
        }

        return null;
    }

    public void play(){

        if(this.isAiFirstMove){

            gameInterface.ThreadClockRestart();
            gameInterface.ThreadDiceSetMode("dice");
            System.out.println();
            System.out.println();
            System.out.println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ FIRST_MOVE");
            gameInterface.openTile((gameInterface.getSatirSize() - 1) / 2, (gameInterface.getSutunSize() - 1) / 2);
            this.isAiFirstMove = false;
        }

        aiFlag();
        aiOpen();
    }

    public void aiFlag(){

        //?  Note that we only flag a mine if we are certain that it is a mine
        //? that's why aiFlag() method only consists of the brainFlagAlgo() method

        arrowFlagAlgo();
    }

    public void aiOpen(){

        //? BrainOpenAlgo() kesin olanlari acan algo.
        boolean isArrowOpenAlgoWorked = arrowOpenAlgo();

        if(!isArrowOpenAlgoWorked){ //? Basic algo calismadi ise o zaman backtracking'e gec

            brainDiceAlgo();
        }
    }

//?=======================================================================================================================================================
//?                     ALGORITHMIC AUXILARY METHODS ...
//?=======================================================================================================================================================

    public int countFlagTilesAround(int x, int y){

        char[][] userBoard = gameInterface.userBoard();
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        int count = 0;
        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;

        if(x == 0) upEdge = true;
        if(y == 0) leftEdge = true;
        if(x == satirSize-1) downEdge = true;
        if(y == sutunSize-1) rightEdge = true;

        if(!upEdge && userBoard[x-1][y] == 'f') count++;
        if(!leftEdge && userBoard[x][y-1] == 'f') count++;
        if(!downEdge && userBoard[x+1][y] == 'f') count++;
        if(!rightEdge && userBoard[x][y+1] == 'f') count++;
        if(!upEdge && !leftEdge && userBoard[x-1][y-1] == 'f') count++;
        if(!upEdge && !rightEdge && userBoard[x-1][y+1] == 'f') count++;
        if(!downEdge && !leftEdge && userBoard[x+1][y-1] == 'f') count++;
        if(!downEdge && !rightEdge && userBoard[x+1][y+1]  == 'f') count++;

        return count;
    }

    public int countClosedTilesAround(int x, int y){

        char[][] userBoard = gameInterface.userBoard();
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        int count = 0;
        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;

        if(x == 0) upEdge = true;
        if(y == 0) leftEdge = true;
        if(x == satirSize-1) downEdge = true;
        if(y == sutunSize-1) rightEdge = true;

        if(!upEdge && userBoard[x-1][y] == 'c') count++;
        if(!leftEdge && userBoard[x][y-1] == 'c') count++;
        if(!downEdge && userBoard[x+1][y] == 'c') count++;
        if(!rightEdge && userBoard[x][y+1] == 'c') count++;
        if(!upEdge && !leftEdge && userBoard[x-1][y-1] == 'c') count++;
        if(!upEdge && !rightEdge && userBoard[x-1][y+1] == 'c') count++;
        if(!downEdge && !leftEdge && userBoard[x+1][y-1] == 'c') count++;
        if(!downEdge && !rightEdge && userBoard[x+1][y+1]  == 'c') count++;

        return count;
    }

    public boolean isTileNumber(int x, int y){

        //? Checks whether the given tile has [0-8] or else on top of it
        char[][] userBoard = gameInterface.userBoard();

        if(userBoard[x][y] == '0' || userBoard[x][y] == '1' || userBoard[x][y] == '2' || userBoard[x][y] == '3' ||
        userBoard[x][y] == '4' || userBoard[x][y] == '5' || userBoard[x][y] == '6' || userBoard[x][y] == '7' || userBoard[x][y] == '8') {

            return true;
        } else {

            return false;
        }
    }

    public boolean isTileNumberUserBoardSnapshot(char[][] userBoardSnapShot, int x, int y){

        //? Checks whether the given tile has [0-8] or else on top of it
        char[][] userBoard = userBoardSnapShot;

        if(userBoard[x][y] == '0' || userBoard[x][y] == '1' || userBoard[x][y] == '2' || userBoard[x][y] == '3' ||
        userBoard[x][y] == '4' || userBoard[x][y] == '5' || userBoard[x][y] == '6' || userBoard[x][y] == '7' || userBoard[x][y] == '8') {

            return true;
        } else {

            return false;
        }
    }

    public boolean isEdgeTile(int x, int y){

        //?   eger kapali bir cell'in etrafinda birtane bile [0-8] square varsa o boundry dir
        char[][] userBoard = gameInterface.userBoard();
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        if(userBoard[x][y] != 'c'){

            return false; // kapali olmali
        }

        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;

        if(x == 0) upEdge = true;
        if(y == 0) leftEdge = true;
        if(x == satirSize-1) downEdge = true;
        if(y == sutunSize-1) rightEdge = true;
        boolean isBoundry = false;

        if(!upEdge && isTileNumber(x-1, y)) isBoundry = true;
        if(!leftEdge && isTileNumber(x, y-1)) isBoundry = true;
        if(!downEdge && isTileNumber(x+1, y)) isBoundry = true;
        if(!rightEdge && isTileNumber(x, y+1)) isBoundry = true;
        if(!upEdge && !leftEdge && isTileNumber(x-1, y-1)) isBoundry = true;
        if(!upEdge && !rightEdge && isTileNumber(x-1, y+1)) isBoundry = true;
        if(!downEdge && !leftEdge && isTileNumber(x+1, y-1)) isBoundry = true;
        if(!downEdge && !rightEdge && isTileNumber(x+1, y+1)) isBoundry = true;

        return isBoundry;
    }

    public ArrayList<Pair> getAllAdjacentTiles(int x, int y){

        ArrayList<Pair> returnList = new ArrayList<>(8);
        int satirSize = gameInterface.getSatirSize();
        int sutunSize = gameInterface.getSutunSize();

        boolean upEdge = false, downEdge = false, leftEdge = false, rightEdge = false;

        if(x == 0) upEdge = true;
        if(y == 0) leftEdge = true;
        if(x == satirSize-1) downEdge = true;
        if(y == sutunSize-1) rightEdge = true;

        if(!upEdge) returnList.add(new Pair(x-1, y));
        if(!leftEdge ) returnList.add(new Pair(x, y-1));
        if(!downEdge ) returnList.add(new Pair(x+1, y));
        if(!rightEdge ) returnList.add(new Pair(x, y+1));
        if(!upEdge ) returnList.add(new Pair(x-1, y-1));
        if(!upEdge ) returnList.add(new Pair(x-1, y+1));
        if(!downEdge ) returnList.add(new Pair(x+1, y-1));
        if(!downEdge ) returnList.add(new Pair(x+1, y+1));

        return returnList;
    }

    public ArrayList<Pair> getAdjacentClosedTiles(int x, int y){

        ArrayList<Pair> returnList = new ArrayList<>(8);
        char[][] us
        // ============================================================================
        // [TRUNCATED] The provided paste ended here, mid-statement.
        // The rest of getAdjacentClosedTiles(...) and the methods it references
        // (arrowFlagAlgo, arrowOpenAlgo, brainDiceAlgo, the backtracking solver, etc.)
        // were NOT included. This file does NOT compile as-is. See README.md.
        // ============================================================================
    }
}
