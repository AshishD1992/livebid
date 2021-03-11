export function getTpType(matchBfId) {
    let tpGame = {
        gameName: "",
        gameType: null
    }
    matchBfId = +matchBfId;

    switch (matchBfId) {
        //#region lotubook365.com || bullsexch9.com
        case 11002291:
            tpGame.gameName = "t20";
            tpGame.gameType = 1;
            break;
        case 11002292:
            tpGame.gameName = "oneday";
            tpGame.gameType = 2;
            break;
        case 11002293:
            tpGame.gameName = "lucky7";
            tpGame.gameType = 5;
            break;
        case 11002294:
            tpGame.gameName = "3cardj";
            tpGame.gameType = 6;
            break;
        case 11002295:
            tpGame.gameName = "ab20";
            tpGame.gameType = 7;
            break;
        //#endregion lotubook365.com || bullsexch9.com
    }
    return tpGame;
}