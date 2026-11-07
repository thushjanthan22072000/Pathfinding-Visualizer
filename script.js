/* =========================================================
   PATHFINDING VISUALIZER
   JAVASCRIPT
========================================================= */


/* =========================================================
   GRID CLASS
========================================================= */

class Grid {

    constructor(rows = 15, cols = 30) {

        this.rows = rows;

        this.cols = cols;

        this.gridContainer =
            document.getElementById("grid");

        this.nodes = [];

        this.startPos = {
            row: 7,
            col: 5
        };

        this.endPos = {
            row: 7,
            col: 24
        };

        this.isMouseDown = false;

        this.dragType = null;

        this.wallMode = null;

        this.init();
    }


    /* =====================================================
       CREATE GRID
    ===================================================== */

    init() {

        this.gridContainer.innerHTML = "";

        this.nodes = [];

        this.gridContainer.style.gridTemplateColumns =
            `repeat(${this.cols}, 1fr)`;


        for (let row = 0; row < this.rows; row++) {

            const rowArray = [];


            for (let col = 0; col < this.cols; col++) {

                const element =
                    document.createElement("div");

                element.className = "cell";


                const node = {

                    row: row,

                    col: col,

                    isStart:
                        row === this.startPos.row &&
                        col === this.startPos.col,

                    isEnd:
                        row === this.endPos.row &&
                        col === this.endPos.col,

                    isWall: false,

                    isVisited: false,

                    distance: Infinity,

                    totalDistance: Infinity,

                    previousNode: null,

                    element: element
                };


                if (node.isStart) {

                    element.classList.add("start");
                }


                if (node.isEnd) {

                    element.classList.add("end");
                }


                this.addEventListeners(
                    element,
                    node
                );


                this.gridContainer.appendChild(
                    element
                );


                rowArray.push(node);
            }


            this.nodes.push(rowArray);
        }
    }


    /* =====================================================
       CELL EVENTS
    ===================================================== */

    addEventListeners(element, node) {

        element.addEventListener(
            "mousedown",
            (event) => {

                event.preventDefault();

                if (node.isStart) {

                    this.isMouseDown = true;

                    this.dragType = "start";

                    return;
                }


                if (node.isEnd) {

                    this.isMouseDown = true;

                    this.dragType = "end";

                    return;
                }


                if (!node.isWall) {

                    this.wallMode = "add";

                } else {

                    this.wallMode = "remove";
                }


                this.isMouseDown = true;

                this.dragType = "wall";

                this.toggleWall(node);
            }
        );


        element.addEventListener(
            "mouseenter",
            () => {

                if (!this.isMouseDown) {
                    return;
                }


                if (
                    this.dragType === "start" &&
                    !node.isEnd &&
                    !node.isWall
                ) {

                    this.moveStart(node);

                    return;
                }


                if (
                    this.dragType === "end" &&
                    !node.isStart &&
                    !node.isWall
                ) {

                    this.moveEnd(node);

                    return;
                }


                if (
                    this.dragType === "wall" &&
                    !node.isStart &&
                    !node.isEnd
                ) {

                    if (this.wallMode === "add") {

                        if (!node.isWall) {

                            this.toggleWall(node);
                        }

                    } else {

                        if (node.isWall) {

                            this.toggleWall(node);
                        }
                    }
                }
            }
        );
    }


    /* =====================================================
       STOP MOUSE DRAG
    ===================================================== */

    stopMouse() {

        this.isMouseDown = false;

        this.dragType = null;

        this.wallMode = null;
    }


    /* =====================================================
       WALL
    ===================================================== */

    toggleWall(node) {

        if (node.isStart || node.isEnd) {
            return;
        }

        node.isWall = !node.isWall;

        node.element.classList.toggle(
            "wall",
            node.isWall
        );
    }


    /* =====================================================
       MOVE START
    ===================================================== */

    moveStart(node) {

        if (node.isEnd || node.isWall) {
            return;
        }


        const oldStart =
            this.nodes[
                this.startPos.row
            ][
                this.startPos.col
            ];


        oldStart.isStart = false;

        oldStart.element.classList.remove(
            "start"
        );


        this.startPos = {

            row: node.row,

            col: node.col
        };


        node.isStart = true;

        node.element.classList.add(
            "start"
        );
    }


    /* =====================================================
       MOVE END
    ===================================================== */

    moveEnd(node) {

        if (node.isStart || node.isWall) {
            return;
        }


        const oldEnd =
            this.nodes[
                this.endPos.row
            ][
                this.endPos.col
            ];


        oldEnd.isEnd = false;

        oldEnd.element.classList.remove(
            "end"
        );


        this.endPos = {

            row: node.row,

            col: node.col
        };


        node.isEnd = true;

        node.element.classList.add(
            "end"
        );
    }


    /* =====================================================
       CLEAR PATH
    ===================================================== */

    clearPath() {

        for (
            let row = 0;
            row < this.rows;
            row++
        ) {

            for (
                let col = 0;
                col < this.cols;
                col++
            ) {

                const node =
                    this.nodes[row][col];


                node.isVisited = false;

                node.distance = Infinity;

                node.totalDistance = Infinity;

                node.previousNode = null;


                node.element.classList.remove(
                    "visited",
                    "path"
                );
            }
        }
    }


    /* =====================================================
       CLEAR BOARD
    ===================================================== */

    clearBoard() {

        for (
            let row = 0;
            row < this.rows;
            row++
        ) {

            for (
                let col = 0;
                col < this.cols;
                col++
            ) {

                const node =
                    this.nodes[row][col];


                node.isWall = false;

                node.element.classList.remove(
                    "wall"
                );
            }
        }


        this.clearPath();
    }


    /* =====================================================
       GET NEIGHBORS
    ===================================================== */

    getNeighbors(node) {

        const neighbors = [];


        const directions = [

            [-1, 0],

            [1, 0],

            [0, -1],

            [0, 1]

        ];


        for (const [dr, dc] of directions) {

            const row =
                node.row + dr;

            const col =
                node.col + dc;


            if (

                row >= 0 &&
                row < this.rows &&
                col >= 0 &&
                col < this.cols

            ) {

                neighbors.push(
                    this.nodes[row][col]
                );
            }
        }


        return neighbors;
    }
}


/* =========================================================
   1. BFS
========================================================= */

function runBFS(grid) {

    const visitedInOrder = [];

    const queue = [];


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    const visitedSet = new Set();


    const startKey =
        `${startNode.row},${startNode.col}`;


    queue.push(startNode);

    visitedSet.add(startKey);


    while (queue.length > 0) {

        const current =
            queue.shift();


        if (current.isWall) {
            continue;
        }


        current.isVisited = true;

        visitedInOrder.push(current);


        if (current.isEnd) {
            break;
        }


        const neighbors =
            grid.getNeighbors(current);


        for (const neighbor of neighbors) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (

                !visitedSet.has(key) &&
                !neighbor.isWall

            ) {

                visitedSet.add(key);

                neighbor.previousNode =
                    current;

                queue.push(neighbor);
            }
        }
    }


    return visitedInOrder;
}


/* =========================================================
   2. DFS
========================================================= */

function runDFS(grid) {

    const visitedInOrder = [];

    const stack = [];

    const visitedSet = new Set();


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    stack.push(startNode);


    while (stack.length > 0) {

        const current =
            stack.pop();


        const key =
            `${current.row},${current.col}`;


        if (
            visitedSet.has(key) ||
            current.isWall
        ) {

            continue;
        }


        visitedSet.add(key);


        current.isVisited = true;

        visitedInOrder.push(current);


        if (current.isEnd) {
            break;
        }


        const neighbors =
            grid.getNeighbors(current);


        for (
            let i = neighbors.length - 1;
            i >= 0;
            i--
        ) {

            const neighbor =
                neighbors[i];


            const neighborKey =
                `${neighbor.row},${neighbor.col}`;


            if (

                !visitedSet.has(neighborKey) &&
                !neighbor.isWall

            ) {

                if (!neighbor.previousNode) {

                    neighbor.previousNode =
                        current;
                }


                stack.push(neighbor);
            }
        }
    }


    return visitedInOrder;
}


/* =========================================================
   3. DIJKSTRA
========================================================= */

function runDijkstra(grid) {

    const visitedInOrder = [];

    const unvisited = [];


    for (
        let row = 0;
        row < grid.rows;
        row++
    ) {

        for (
            let col = 0;
            col < grid.cols;
            col++
        ) {

            const node =
                grid.nodes[row][col];


            node.distance = Infinity;

            node.isVisited = false;

            node.previousNode = null;


            if (!node.isWall) {

                unvisited.push(node);
            }
        }
    }


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    startNode.distance = 0;


    while (unvisited.length > 0) {

        unvisited.sort(
            (a, b) =>
                a.distance - b.distance
        );


        const current =
            unvisited.shift();


        if (
            current.distance === Infinity
        ) {

            break;
        }


        current.isVisited = true;

        visitedInOrder.push(current);


        if (current.isEnd) {
            break;
        }


        const neighbors =
            grid.getNeighbors(current);


        for (const neighbor of neighbors) {

            if (
                neighbor.isWall ||
                neighbor.isVisited
            ) {

                continue;
            }


            const newDistance =
                current.distance + 1;


            if (
                newDistance <
                neighbor.distance
            ) {

                neighbor.distance =
                    newDistance;

                neighbor.previousNode =
                    current;
            }
        }
    }


    return visitedInOrder;
}


/* =========================================================
   4. A*
========================================================= */

function runAStar(grid) {

    const visitedInOrder = [];

    const openSet = [];


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    const endNode =
        grid.nodes[
            grid.endPos.row
        ][
            grid.endPos.col
        ];


    function heuristic(a, b) {

        return Math.abs(
            a.row - b.row
        ) +

        Math.abs(
            a.col - b.col
        );
    }


    for (
        let row = 0;
        row < grid.rows;
        row++
    ) {

        for (
            let col = 0;
            col < grid.cols;
            col++
        ) {

            const node =
                grid.nodes[row][col];


            node.distance = Infinity;

            node.totalDistance = Infinity;

            node.isVisited = false;

            node.previousNode = null;
        }
    }


    startNode.distance = 0;

    startNode.totalDistance =
        heuristic(
            startNode,
            endNode
        );


    openSet.push(startNode);


    while (openSet.length > 0) {

        openSet.sort(
            (a, b) =>
                a.totalDistance -
                b.totalDistance
        );


        const current =
            openSet.shift();


        if (
            current.isWall ||
            current.isVisited
        ) {

            continue;
        }


        current.isVisited = true;

        visitedInOrder.push(current);


        if (current.isEnd) {
            break;
        }


        const neighbors =
            grid.getNeighbors(current);


        for (const neighbor of neighbors) {

            if (
                neighbor.isWall ||
                neighbor.isVisited
            ) {

                continue;
            }


            const gScore =
                current.distance + 1;


            if (
                gScore <
                neighbor.distance
            ) {

                neighbor.distance =
                    gScore;


                neighbor.totalDistance =
                    gScore +
                    heuristic(
                        neighbor,
                        endNode
                    );


                neighbor.previousNode =
                    current;


                if (
                    !openSet.includes(neighbor)
                ) {

                    openSet.push(
                        neighbor
                    );
                }
            }
        }
    }


    return visitedInOrder;
}


/* =========================================================
   5. GREEDY BEST-FIRST SEARCH
========================================================= */

function runGreedyBestFirst(grid) {

    const visitedInOrder = [];

    const openSet = [];

    const visitedSet = new Set();


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    const endNode =
        grid.nodes[
            grid.endPos.row
        ][
            grid.endPos.col
        ];


    function heuristic(a, b) {

        return Math.abs(
            a.row - b.row
        ) +

        Math.abs(
            a.col - b.col
        );
    }


    openSet.push(startNode);


    visitedSet.add(
        `${startNode.row},${startNode.col}`
    );


    while (openSet.length > 0) {

        openSet.sort(
            (a, b) =>
                heuristic(a, endNode) -
                heuristic(b, endNode)
        );


        const current =
            openSet.shift();


        if (current.isWall) {
            continue;
        }


        current.isVisited = true;

        visitedInOrder.push(current);


        if (current.isEnd) {
            break;
        }


        const neighbors =
            grid.getNeighbors(current);


        for (const neighbor of neighbors) {

            const key =
                `${neighbor.row},${neighbor.col}`;


            if (

                !visitedSet.has(key) &&
                !neighbor.isWall

            ) {

                visitedSet.add(key);

                neighbor.previousNode =
                    current;

                openSet.push(neighbor);
            }
        }
    }


    return visitedInOrder;
}


/* =========================================================
   6. BIDIRECTIONAL BFS
========================================================= */

function runBidirectionalBFS(grid) {

    const visitedInOrder = [];


    const startNode =
        grid.nodes[
            grid.startPos.row
        ][
            grid.startPos.col
        ];


    const endNode =
        grid.nodes[
            grid.endPos.row
        ][
            grid.endPos.col
        ];


    const queueStart = [startNode];

    const queueEnd = [endNode];


    const visitedStart = new Set();

    const visitedEnd = new Set();


    const parentStart = new Map();

    const parentEnd = new Map();


    const startKey =
        `${startNode.row},${startNode.col}`;


    const endKey =
        `${endNode.row},${endNode.col}`;


    visitedStart.add(startKey);

    visitedEnd.add(endKey);


    let meetingKey = null;


    while (

        queueStart.length > 0 &&
        queueEnd.length > 0

    ) {


        /* -----------------------------------------
           START SIDE
        ----------------------------------------- */

        const currentStart =
            queueStart.shift();


        if (!currentStart.isWall) {

            currentStart.isVisited = true;

            visitedInOrder.push(
                currentStart
            );


            const currentKey =
                `${currentStart.row},${currentStart.col}`;


            if (
                visitedEnd.has(currentKey)
            ) {

                meetingKey =
                    currentKey;

                break;
            }


            const neighbors =
                grid.getNeighbors(
                    currentStart
                );


            for (const neighbor of neighbors) {

                if (neighbor.isWall) {
                    continue;
                }


                const key =
                    `${neighbor.row},${neighbor.col}`;


                if (
                    !visitedStart.has(key)
                ) {

                    visitedStart.add(key);

                    parentStart.set(
                        key,
                        currentStart
                    );


                    queueStart.push(
                        neighbor
                    );


                    if (
                        visitedEnd.has(key)
                    ) {

                        meetingKey = key;

                        break;
                    }
                }
            }


            if (meetingKey) {
                break;
            }
        }


        /* -----------------------------------------
           END SIDE
        ----------------------------------------- */

        const currentEnd =
            queueEnd.shift();


        if (!currentEnd.isWall) {

            currentEnd.isVisited = true;

            visitedInOrder.push(
                currentEnd
            );


            const currentKey =
                `${currentEnd.row},${currentEnd.col}`;


            if (
                visitedStart.has(currentKey)
            ) {

                meetingKey =
                    currentKey;

                break;
            }


            const neighbors =
                grid.getNeighbors(
                    currentEnd
                );


            for (const neighbor of neighbors) {

                if (neighbor.isWall) {
                    continue;
                }


                const key =
                    `${neighbor.row},${neighbor.col}`;


                if (
                    !visitedEnd.has(key)
                ) {

                    visitedEnd.add(key);

                    parentEnd.set(
                        key,
                        currentEnd
                    );


                    queueEnd.push(
                        neighbor
                    );


                    if (
                        visitedStart.has(key)
                    ) {

                        meetingKey = key;

                        break;
                    }
                }
            }


            if (meetingKey) {
                break;
            }
        }
    }


    /* =====================================================
       BUILD COMPLETE PATH
    ===================================================== */

    if (meetingKey) {

        const startPart = [];

        let current =
            grid.nodes[
                Number(meetingKey.split(",")[0])
            ][
                Number(meetingKey.split(",")[1])
            ];


        while (current !== startNode) {

            startPart.unshift(current);


            const key =
                `${current.row},${current.col}`;


            current =
                parentStart.get(key);


            if (!current) {
                break;
            }
        }


        const endPart = [];

        current =
            grid.nodes[
                Number(meetingKey.split(",")[0])
            ][
                Number(meetingKey.split(",")[1])
            ];


        while (current !== endNode) {

            const key =
                `${current.row},${current.col}`;


            current =
                parentEnd.get(key);


            if (!current) {
                break;
            }


            endPart.push(current);
        }


        const completePath = [

            ...startPart,

            ...endPart
        ];


        let previous =
            startNode;


        for (const node of completePath) {

            node.previousNode =
                previous;

            previous = node;
        }
    }


    return visitedInOrder;
}


/* =========================================================
   APPLICATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {


        /* ================================================
           CREATE GRID
        ================================================ */

        const grid =
            new Grid(15, 30);


        let isRunning = false;


        /* ================================================
           ELEMENTS
        ================================================ */

        const algorithmSelect =
            document.getElementById(
                "algorithm"
            );


        const speedSelect =
            document.getElementById(
                "speed"
            );


        const visualizeBtn =
            document.getElementById(
                "visualizeBtn"
            );


        const clearPathBtn =
            document.getElementById(
                "clearPathBtn"
            );


        const clearBoardBtn =
            document.getElementById(
                "clearBoardBtn"
            );


        const messageEl =
            document.getElementById(
                "message"
            );


        const statAlgorithm =
            document.getElementById(
                "statAlgorithm"
            );


        const visitedCountEl =
            document.getElementById(
                "visitedCount"
            );


        const pathLengthEl =
            document.getElementById(
                "pathLength"
            );


        const executionTimeEl =
            document.getElementById(
                "executionTime"
            );


        /* ================================================
           SPEED
        ================================================ */

        const speeds = {

            fast: 5,

            normal: 25,

            slow: 70
        };


        /* ================================================
           ALGORITHM NAMES
        ================================================ */

        const algorithmNames = {

            bfs: "BFS",

            dfs: "DFS",

            dijkstra: "Dijkstra",

            astar: "A*",

            greedy: "Greedy",

            bidirectional:
                "Bidirectional BFS"
        };


        /* ================================================
           MOUSE RELEASE
        ================================================ */

        window.addEventListener(
            "mouseup",
            () => {

                grid.stopMouse();
            }
        );


        /* ================================================
           VISUALIZE
        ================================================ */

        visualizeBtn.addEventListener(
            "click",
            async () => {

                if (isRunning) {
                    return;
                }


                grid.clearPath();


                isRunning = true;


                visualizeBtn.disabled = true;

                clearPathBtn.disabled = true;

                clearBoardBtn.disabled = true;


                const selectedAlgo =
                    algorithmSelect.value;


                statAlgorithm.textContent =
                    algorithmNames[
                        selectedAlgo
                    ];


                messageEl.textContent =
                    "Searching...";


                visitedCountEl.textContent =
                    "0";


                pathLengthEl.textContent =
                    "0";


                executionTimeEl.textContent =
                    "Calculating...";


                const startTime =
                    performance.now();


                let visitedInOrder = [];


                /* =========================================
                   SELECT ALGORITHM
                ========================================= */

                if (selectedAlgo === "bfs") {

                    visitedInOrder =
                        runBFS(grid);

                }

                else if (
                    selectedAlgo === "dfs"
                ) {

                    visitedInOrder =
                        runDFS(grid);

                }

                else if (
                    selectedAlgo === "dijkstra"
                ) {

                    visitedInOrder =
                        runDijkstra(grid);

                }

                else if (
                    selectedAlgo === "astar"
                ) {

                    visitedInOrder =
                        runAStar(grid);

                }

                else if (
                    selectedAlgo === "greedy"
                ) {

                    visitedInOrder =
                        runGreedyBestFirst(
                            grid
                        );

                }

                else if (
                    selectedAlgo === "bidirectional"
                ) {

                    visitedInOrder =
                        runBidirectionalBFS(
                            grid
                        );
                }


                const endTime =
                    performance.now();


                const duration =
                    (
                        endTime -
                        startTime
                    ).toFixed(2);


                const delay =
                    speeds[
                        speedSelect.value
                    ];


                /* =========================================
                   ANIMATE SEARCH
                ========================================= */

                await animateSearch(
                    visitedInOrder,
                    delay
                );


                /* =========================================
                   GET PATH
                ========================================= */

                const endNode =
                    grid.nodes[
                        grid.endPos.row
                    ][
                        grid.endPos.col
                    ];


                const path =
                    getPath(endNode);


                const reachedEnd =
                    visitedInOrder.some(
                        node => node.isEnd
                    );


                /* =========================================
                   ANIMATE PATH
                ========================================= */

                if (
                    reachedEnd &&
                    path.length > 0
                ) {

                    await animatePath(
                        path,
                        delay * 2
                    );


                    messageEl.textContent =
                        "Target Reached!";
                }

                else {

                    messageEl.textContent =
                        "No Path Found!";
                }


                /* =========================================
                   STATISTICS
                ========================================= */

                visitedCountEl.textContent =
                    visitedInOrder.length;


                pathLengthEl.textContent =
                    Math.max(
                        0,
                        path.length - 1
                    );


                executionTimeEl.textContent =
                    `${duration} ms`;


                isRunning = false;


                visualizeBtn.disabled = false;

                clearPathBtn.disabled = false;

                clearBoardBtn.disabled = false;
            }
        );


        /* ================================================
           CLEAR PATH
        ================================================ */

        clearPathBtn.addEventListener(
            "click",
            () => {

                if (isRunning) {
                    return;
                }


                grid.clearPath();

                resetStats();

                messageEl.textContent =
                    "Ready";
            }
        );


        /* ================================================
           CLEAR BOARD
        ================================================ */

        clearBoardBtn.addEventListener(
            "click",
            () => {

                if (isRunning) {
                    return;
                }


                grid.clearBoard();

                resetStats();

                messageEl.textContent =
                    "Ready";
            }
        );


        /* ================================================
           RESET STATISTICS
        ================================================ */

        function resetStats() {

            visitedCountEl.textContent =
                "0";


            pathLengthEl.textContent =
                "0";


            executionTimeEl.textContent =
                "0 ms";


            statAlgorithm.textContent =
                algorithmNames[
                    algorithmSelect.value
                ];
        }


        /* ================================================
           SEARCH ANIMATION
        ================================================ */

        function animateSearch(
            visitedNodes,
            delay
        ) {

            return new Promise(
                (resolve) => {

                    if (
                        visitedNodes.length === 0
                    ) {

                        resolve();

                        return;
                    }


                    let completed = 0;


                    visitedNodes.forEach(
                        (node, index) => {

                            setTimeout(
                                () => {

                                    if (
                                        !node.isStart &&
                                        !node.isEnd
                                    ) {

                                        node.element.classList.add(
                                            "visited"
                                        );
                                    }


                                    completed++;


                                    if (
                                        completed ===
                                        visitedNodes.length
                                    ) {

                                        resolve();
                                    }

                                },

                                index * delay
                            );
                        }
                    );
                }
            );
        }


        /* ================================================
           PATH ANIMATION
        ================================================ */

        function animatePath(
            path,
            delay
        ) {

            return new Promise(
                (resolve) => {

                    if (
                        path.length === 0
                    ) {

                        resolve();

                        return;
                    }


                    let completed = 0;


                    path.forEach(
                        (node, index) => {

                            setTimeout(
                                () => {

                                    if (
                                        !node.isStart &&
                                        !node.isEnd
                                    ) {

                                        node.element.classList.remove(
                                            "visited"
                                        );


                                        node.element.classList.add(
                                            "path"
                                        );
                                    }


                                    completed++;


                                    if (
                                        completed ===
                                        path.length
                                    ) {

                                        resolve();
                                    }

                                },

                                index * delay
                            );
                        }
                    );
                }
            );
        }


        /* ================================================
           GET PATH
        ================================================ */

        function getPath(endNode) {

            const path = [];

            let current =
                endNode;


            if (
                !current.isStart &&
                !current.previousNode
            ) {

                return [];
            }


            while (current) {

                path.unshift(current);


                if (current.isStart) {

                    break;
                }


                current =
                    current.previousNode;
            }


            if (
                path.length === 0 ||
                !path[0].isStart
            ) {

                return [];
            }


            return path;
        }

    }
);