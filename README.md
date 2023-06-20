# Simple Frogger Game using RxJS

The Frogger game is created using Functional Reactive Programming (FRP) techniques and implemented in TypeScript. I have used RxJS Observable streams to handle animation and user interaction.

## Features
* Ground Section: Filled with moving cars (in grey), trucks (in pink) and flies (in red). Eat a fly to receive 50 bonus points. The flies will only appear at the first 10 seconds of each level. Watch out for cars and trucks that can end your journey! As the level increases, the speed of the cars and trucks increases, making it more challenging to avoid them.
* Safe Zone: This area is free of obstacles. Take a rest before continuing your journey!
* Water Section: Leap onto moving logs (in orange) and turtles (in purple) to avoid drowning. Be aware of some turtles (in violet) can teleport the frog back to the starting point. The speed of the logs and turtles also increase with each level, making it harder to navigate this section. 

## How to Control
1. Use arrow keys (up, down, left, right) to move the frog across the screen.
2. Avoid colliding with cars and trucks or falling into the river to stay alive.
3. Press the "r" key to restart the game if you want to start over or have reach a game over state.

## How to Play
1. Launch the game by clicking [here](https://li9406.github.io/simple-frogger-game/dist/index.html).
2. Guide the frog across the road by avoiding oncoming cars and trucks. Be quick to avoid getting hit!
3. Use logs and turtles to cross the river but be cautious of the teleporting turtles that teleport the frog back to the starting point.
4. Your goal is to reach the 5 target areas on the top of the screen.
5. Each time you successfully reach a target area, you will score 100 points.
6. Have fun and enjoy the challenge!
