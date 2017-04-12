var Grid = (function () {
    function Grid(numCols, numRows, data) {
        this._nodes = [];
        this._numCols = numCols;
        this._numRows = numRows;
        this._nodes = new Array();
        for (var i = 0; i < this._numCols; i++) {
            this._nodes[i] = new Array();
            for (var j = 0; j < this._numRows; j++) {
                this._nodes[i][j] = new TileNode(i, j);
                this._nodes[i][j].walkable = data[i + this._numCols * j].walkable;
            }
        }
    }
    Grid.prototype.setStartNode = function (x, y) {
        this._startNode = this._nodes[x][y];
    };
    Grid.prototype.setEndNode = function (x, y) {
        this._endNode = this._nodes[x][y];
    };
    return Grid;
}());
