# Pathfinding Visualizer

An interactive browser-based tool for exploring pathfinding algorithms on a grid. Create obstacles, move the start and end nodes, choose an algorithm, and watch the search process and resulting path.

## Features

- Six pathfinding algorithms:
  - Breadth-First Search (BFS)
  - Depth-First Search (DFS)
  - Dijkstra's Algorithm
  - A* Search
  - Greedy Best-First Search
  - Bidirectional BFS
- Interactive grid with draggable start and end nodes
- Click and drag to add or remove walls
- Fast, normal, and slow animation speeds
- Clear Path and Clear Board controls
- Statistics for visited nodes, path length, and execution time
- Responsive layout

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript

## Run locally

No installation or build process is required.

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a modern web browser.

You can also use the VS Code Live Server extension to serve the folder locally.

## How to use

1. Select an algorithm from the **Algorithm** dropdown.
2. Select an animation speed.
3. Click and drag on empty grid cells to create walls. Drag across existing walls to remove them.
4. Drag the green start node or red end node to reposition it.
5. Click **Visualize** to run the selected algorithm.
6. Use **Clear Path** to remove the search visualization, or **Clear Board** to remove walls and the search visualization.

## Grid legend

- Green: Start node
- Red: End node
- Dark: Wall
- Blue: Visited node
- Yellow: Path

## Project structure

```text
Pathfinding-Visualizer/
├── index.html
├── style.css
├── script.js
├── README.md
└── .gitignore
```

## Notes

This is an educational visualization project. The grid uses four-directional movement (up, down, left, and right).
