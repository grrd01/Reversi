var gameLogic = function() {
    var board, columns= 8, rows= 8,
        init = function(){
            gameLogic.initEmptyBoard();
            gameLogic.setStartGame();

            //gameLogic.changeObjectState(0,7,2,false,false);
            //gameLogic.changeObjectState(7,7,0,false,false);
            //gameLogic.changeObjectState(7,0,0,false,false);
            //
            //gameLogic.changeObjectState(5,0,2,false,false);
            //gameLogic.changeObjectState(6,0,0,false,false);

        },

        initEmptyBoard = function() {
            board = getNewGame(columns,rows,0);
        },

        showBoard = function() {
            //for(var i=0; i<columns; i++){
            //    for(var j=0; j<rows; j++){
            //        console.log(board[i][j])
            //    }
            //}

            console.log(board);
            console.log("");
        },

        getNewGame = function(cols, rows, defaultValue){

            var arr = [];

            // Creates all lines:
            for(var i=0; i < rows; i++){

                // Creates an empty line
                arr.push([]);

                // Adds cols to the empty line:
                arr[i].push( new Array(cols));

                for(var j=0; j < cols; j++){
                    // Initializes:
                    arr[i][j] = defaultValue;
                }
            }

            return arr;
        },

        changeObjectState = function(col, row, state, isWithUpdate, isWithAutoPlayer) {
            if (board[col][row] == 0){
                console.log('set ' + col + " " + row +" to state " + state);
            } else if ((board[col][row] == 1 && state == 2) || (board[col][row] == 2 && state == 1)) {
                console.log('update ' + col + " " + row + " from " + board[col][row] + " to state " + state);
            } else {
                console.log('error? ' + col + " " + row +" from " + board[col][row] + " to state " + state);
            }

            board[col][row] = state;

            if (isWithUpdate) {
                updateStates(state, col, row);
            }
            if (isWithAutoPlayer) {
                if (state == 1) {
                    moveFromComputerPlayer(2);
                } else{
                    moveFromComputerPlayer(1);
                }
            }
        },

        setStartGame = function(){
            changeObjectState(3, 3, 1, false);
            changeObjectState(4, 4, 1, false);
            changeObjectState(4, 3, 2, false);
            changeObjectState(3, 4, 2, false);
        },

        getPossibleMoves = function(state){
            var possibleMoves = [];
            for (var i = 0; i < columns; i++) {
                for (var j = 0; j < rows; j++) {
                    if (board[i][j] == 0 && isPossibleMove(state,i,j)) {
                        possibleMoves.push([i, j]);
                    }
                }
            }
            // uje console.log("possibleMoves: " + state);
            // uje console.log(possibleMoves);
            return possibleMoves;
        },

        isPossibleMove = function(state, indexX, indexY){

            if (isPossibleLeftTop(state, indexX, indexY, true) ||
                isPossibleTop(state, indexX, indexY, true) ||
                isPossibleRightTop(state, indexX, indexY, true) ||
                isPossibleLeft(state, indexX, indexY, true) ||
                isPossibleRight(state, indexX, indexY, true) ||
                isPossibleLeftBottom(state, indexX, indexY, true) ||
                isPossibleBottom(state, indexX, indexY, true) ||
                isPossibleRightBottom(state, indexX, indexY, true)) {
                //console.log("isPossible: yes " + indexX + " " + indexY);
                return true;
            }
            else {
                //console.log("isPossible: no " + indexX + " " + indexY);
                return false;
            }
        },

        updateStates = function (state, indexX, indexY, isVirtualChangeState) {
            var updateFigures = [];
            updateStateLeftTop(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateTop(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateRightTop(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateLeft(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateRight(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateLeftBottom(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateBottom(state, indexX, indexY, updateFigures, isVirtualChangeState);
            updateStateRightBottom(state, indexX, indexY, updateFigures, isVirtualChangeState);
            // uje console.log("updateFigures: " + updateFigures);
            return updateFigures;
        },

        updateStateLeftTop = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleLeftTop(state, indexX, indexY, true)) {
                if (board[indexX - 1][indexY - 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX - 1, indexY - 1]);
                    if (!isVirtualChangeState) {
                        // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                        changeObjectState(indexX - 1, indexY - 1, state);
                    }
                    updateStateLeftTop(state, indexX - 1, indexY - 1, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateTop = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleTop(state, indexX, indexY, true)) {
                if (board[indexX][indexY - 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX, indexY - 1]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX, indexY - 1, state);
                    }
                    updateStateTop(state, indexX, indexY - 1, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateRightTop = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleRightTop(state, indexX, indexY, true)) {
                if (board[indexX + 1][indexY - 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX + 1, indexY - 1]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX + 1, indexY - 1, state);
                    }
                    updateStateRightTop(state, indexX + 1, indexY - 1, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateLeft = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleLeft(state, indexX, indexY, true)) {
                if (board[indexX - 1][indexY] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX - 1, indexY]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX - 1, indexY, state);
                    }
                    updateStateLeft(state, indexX - 1, indexY, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateRight = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleRight(state, indexX, indexY, true)) {
                if (board[indexX + 1][indexY] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX + 1, indexY]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX + 1, indexY, state);
                    }
                    updateStateRight(state, indexX + 1, indexY, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateLeftBottom = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleLeftBottom(state, indexX, indexY, true)) {
                if (board[indexX - 1][indexY + 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX - 1, indexY + 1]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX - 1, indexY + 1, state);
                    }
                    updateStateLeftBottom(state, indexX - 1, indexY + 1, updateFigures, isVirtualChangeState)
                }
            }
        },

        updateStateBottom = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleBottom(state, indexX, indexY, true)) {
                if (board[indexX][indexY + 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX, indexY + 1]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX, indexY + 1, state);
                    }
                    updateStateBottom(state, indexX, indexY + 1, updateFigures, isVirtualChangeState);
                }
            }
        },

        updateStateRightBottom = function (state, indexX, indexY, updateFigures, isVirtualChangeState) {
            if (isPossibleRightBottom(state, indexX, indexY, true)) {
                if (board[indexX + 1][indexY + 1] != state) {
                    // uje console.log("changeObjectState: X: " + indexX + " Y: " + indexY + " state: " + state);
                    updateFigures.push([indexX + 1, indexY + 1]);
                    if (!isVirtualChangeState){
                        changeObjectState(indexX + 1, indexY + 1, state);
                    }
                    updateStateRightBottom(state, indexX + 1, indexY + 1, updateFigures, isVirtualChangeState);
                }
            }
        },

        isPossibleLeftTop = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX - 1 < 0 || indexY - 1 < 0) return false;

            var boardState = board[indexX-1][indexY - 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleLeftTop(state, indexX - 1, indexY - 1,false);
            }
        },

        isPossibleTop = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexY - 1 < 0) return false;

            var boardState = board[indexX][indexY - 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleTop(state, indexX, indexY - 1, false);
            }
        },

        isPossibleRightTop = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX + 1 >= columns || indexY - 1 < 0) return false;

            var boardState = board[indexX+1][indexY - 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleRightTop(state, indexX + 1, indexY - 1, false);
            }
        },

        isPossibleLeft = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX - 1 < 0) return false;

            var boardState = board[indexX-1][indexY];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState== 0 || boardState == state) {
                return false;
            } else {
                return isPossibleLeft(state, indexX - 1, indexY ,false);
            }
        },

        isPossibleRight = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX + 1 >= columns) return false;

            var boardState = board[indexX+1][indexY];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleRight(state, indexX + 1, indexY, false);
            }
        },

        isPossibleLeftBottom = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX - 1 < 0 || indexY + 1 >= rows) return false;

            var boardState = board[indexX-1][indexY + 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleLeftBottom(state, indexX - 1, indexY + 1,false);
            }
        },

        isPossibleBottom = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexY + 1 >= rows) return false;

            var boardState = board[indexX][indexY + 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleBottom(state, indexX, indexY + 1, false);
            }
        },

        isPossibleRightBottom = function (state, indexX, indexY, isFirst) {
            //out range
            if (indexX + 1 >= columns || indexY + 1 >= rows) return false;

            var boardState = board[indexX+1][indexY + 1];
            if (!isFirst && boardState == state){
                return true;
            } else if (!isFirst && boardState == 0) {
                return false;
            }
            //no figure or same state
            if (boardState == 0 || boardState == state) {
                return false;
            } else {
                return isPossibleRightBottom(state, indexX + 1, indexY + 1, false);
            }
        },

        moveFromComputerPlayer = function(state) {
            var possibleMoves = getPossibleMoves(state);

            //console.log("isGameOver: " + isGameOver());

            if (possibleMoves.length > 0){
                console.log("moveFromComputerPlayer(state=" + state +")");
                console.log("possibleMoves.length: " + possibleMoves.length);
                console.log("possibleMoves: " + possibleMoves);

                var randomIndex = getMoveByComputer(possibleMoves, state);

                // uje console.log("randomIndex: " + randomIndex);
                // uje console.log("moveFromComputerPlayer: " + possibleMoves[randomIndex]);
                console.log("Computermove:");
                //console.log("randomIndex][0]: " + possibleMoves[randomIndex][0]);
                //console.log("randomIndex][1]: " + possibleMoves[randomIndex][1]);
                changeObjectState(possibleMoves[randomIndex][0], possibleMoves[randomIndex][1], state ,true, false);
                return true;
            }else{
                return false;
            }

        },

        getMoveByComputer = function(possibleMoves, state){
            if (typeof possibleMoves != 'undefined' &&  possibleMoves.length > 0){
                var randomIndex = 0;
                //var randomIndex = Math.floor(Math.random() * 10 % (possibleMoves.length));

                function IsInArray(value, array){
                    for(var k = 0; k < array.length; k++){
                        if(array[k][0] == value[0] && array[k][1] == value[1]){
                            return k;
                        }
                    }
                    return -1;
                };

                var tempArray = [];
                for (var i = 0, len = possibleMoves.length; i < len; i++) {
                    tempArray[i] = possibleMoves[i].slice();
                }

                var corners =[[0,0],[0,columns-1],[rows-1,0],[columns-1, rows-1]];
                tempArray.forEach(function(posMove, i) {
                    posMove[2] = updateStates(state, posMove[0], posMove[1],true).length;
                });

                tempArray.sort(function(a,b) {

                    if ((IsInArray([a[0],a[1]],corners) > -1 && IsInArray([b[0],b[1]],corners) > -1) ||
                        (IsInArray([a[0],a[1]],corners) == -1 && IsInArray([b[0],b[1]],corners) == -1)){
                        if (a[2] == b[2]){
                            return 0;
                        }else if (a[2] > b[2]) {
                            return -1;
                        } else {
                            return 1;
                        }
                    }else if(IsInArray([a[0],a[1]],corners) == -1 && IsInArray([b[0],b[1]],corners) > -1){
                        return 1;
                    }else if(IsInArray([a[0],a[1]],corners) > -1 && IsInArray([b[0],b[1]],corners) == -1){
                        return -1;
                    }else{
                        return 0;
                    }
                });

                randomIndex = IsInArray([tempArray[0][0],tempArray[0][1]], possibleMoves);

                return randomIndex;
            }else {
                return -1;
            }
        },

        isGameOver = function(){
            if (getPossibleMoves(1).length == 0 && getPossibleMoves(2).length == 0){
                return true;
            } else {
                return false;
            }
        },

        getFigures = function (state) {
            var filtered = [];
            for (var i = 0; i < columns; i++) {
                for (var j = 0; j < rows; j++) {
                    if (board[i][j] == state) {
                        //var temp = [i,j];
                        filtered.push([i, j]);
                    }
                }
            }

            // uje console.log("getFigures:" + state);
            // uje console.log(filtered);
            return filtered;
        }
        ;

    return {
        init: init,
        initEmptyBoard: initEmptyBoard,
        setStartGame: setStartGame,
        showBoard: showBoard,
        changeObjectState: changeObjectState,
        getFigures: getFigures,
        getPossibleMoves: getPossibleMoves,
        isPossibleMove: isPossibleMove,
        updateStates: updateStates,
        moveFromComputerPlayer: moveFromComputerPlayer,
        getMoveByComputer: getMoveByComputer,
        isGameOver: isGameOver,
        getBoard: function() { return board; }
    };
}();

gameLogic.init();