import { fromEvent, interval, merge, zip } from "rxjs";
import { map, filter, scan } from "rxjs/operators";
import "./style.css";

function main() {
  
  // This is the view for the game to add and update the game elements
  const svg = document.querySelector("#svgCanvas") as SVGElement & HTMLElement;

  // This is the view for the ground section in the game
  const ground = document.createElementNS(svg.namespaceURI, "rect");
  ground.setAttribute("width", "600");
  ground.setAttribute("height", "360");
  ground.setAttribute("x", "0")
  ground.setAttribute("y", "360")
  ground.setAttribute(
    "style",
    "fill: orange; stroke: brown; stroke-width: 1px; opacity: 0.5"
  );
  svg.appendChild(ground)

  // This is the view for the safe zone section in the game
  const safeZone = document.createElementNS(svg.namespaceURI, "rect");
  safeZone.setAttribute("width", "600");
  safeZone.setAttribute("height", "60");
  safeZone.setAttribute("x", "0")
  safeZone.setAttribute("y", "300")
  safeZone.setAttribute(
    "style",
    "fill: pink; stroke: pink; stroke-width: 1px; opacity: 0.5"
  );
  svg.appendChild(safeZone)

  // This is the view for the water section in the game
  const water = document.createElementNS(svg.namespaceURI, "rect");
  water.setAttribute("width", "600");
  water.setAttribute("height", "140");
  water.setAttribute("x", "0");
  water.setAttribute("y", "160");
  water.setAttribute(
    "style",
    "fill: blue; stroke: blue; stroke-width: 1px; opacity: 0.5"
  );
  svg.appendChild(water)

  // This is the view for the score display section in the game
  const score = document.createElementNS(svg.namespaceURI, 'rect');
  score.setAttribute("width", "600");
  score.setAttribute("height", "40");
  score.setAttribute("x", "0");
  score.setAttribute("y", "0");
  score.setAttribute(
    "style",
    "fill: white; stroke: black; stroke-width: 1px; opacity: 0.5"
  )
  svg.appendChild(score)

  // This is the view for displaying the highest score of the game
  const displayHighestScore = document.createElementNS(svg.namespaceURI, 'text')!;
  displayHighestScore.setAttribute("id", "displayHighestScore")
  displayHighestScore.setAttribute("x", "0");
  displayHighestScore.setAttribute("y", "30");
  displayHighestScore.setAttribute("font-size", "20px");
  displayHighestScore.setAttribute("fill", "white")
  displayHighestScore.textContent = "Highest Score: ";
  svg.appendChild(displayHighestScore);

  // This is the view for displaying the current score of the game
  const displayCurrentScore = document.createElementNS(svg.namespaceURI, 'text')!;
  displayCurrentScore.setAttribute("id", "displayCurrentScore");
  displayCurrentScore.setAttribute("x", "250");
  displayCurrentScore.setAttribute("y", "30");
  displayCurrentScore.setAttribute("font-size", "20px");
  displayCurrentScore.setAttribute("fill", "white")
  displayCurrentScore.textContent = "Current Score: ";
  svg.appendChild(displayCurrentScore);

  // This is the view for displaying the current difficulty level of the game
  const displayDifficulty = document.createElementNS(svg.namespaceURI, 'text')!;
  displayDifficulty.setAttribute("id", "displayDifficulty");
  displayDifficulty.setAttribute("x", "500");
  displayDifficulty.setAttribute("y", "30");
  displayDifficulty.setAttribute("font-size", "20px");
  displayDifficulty.setAttribute("fill", "white")
  displayDifficulty.textContent = "Lv ";
  svg.appendChild(displayDifficulty);
  
  // This is the view for the frog in the game
  const frog = document.createElementNS(svg.namespaceURI, "circle");
  frog.setAttribute("id", "frog")
  frog.setAttribute("r", "20");
  frog.setAttribute("cx", "300");
  frog.setAttribute("cy", "580");
  frog.setAttribute(
    "style",
    "fill: green; stroke: black; stroke-width: 1px;"
  );
  svg.appendChild(frog);

  // Constants that are used in the game
  // The variable names are self explanatory
  const 
  Constants = {
    CanvasSize: 600,
    LowerBoundX: 20,  // the lower bound of the x-axis of the svg canvas
    UpperBoundX: 580, // the upper bound of the x-axis of the svg canvas
    LowerBoundY: 60,  // the lower bound of the y-axis of the svg canvas
    UpperBoundY: 580, // the upper bound of the y-axis of the svg canvas

    ObjectStroke: "black",  // the stroke for all movable objects
    ObjectStrokeWidth: "1px",
    ObjectOpacity: 1,

    CarWidth: 40, 
    CarHeight: 25,  
    CarNumber: 4, 
    CarMinVelocity: 0.1,
    CarGap: 1000,
    CarColor: "grey",

    TruckWidth: 60,
    TruckHeight: 30,
    TruckNumber: 6,
    TruckMinVelocity: 0.2,
    TruckGap: 200,
    TruckColor: "pink",

    LogWidth: 200,
    LogHeight: 25,
    LogNumber: 3,
    LogMinVelocity: 0.3,
    LogGap: 300,
    LogColor: "orange",

    TurtleWidth: 100,
    TurtleHeight: 25,
    TurtleNumber: 2,
    TurtleMinVelocity: 0.5,
    TurtleGap: 300,
    TurtleColor: "purple",
    TeleporterTurtleColor: "violet",

    FlyWidth: 20, 
    FlyHeight: 15,
    FlyYPos: 450,
    FlyNumber: 2,
    FlyMinVelocity: 2,
    FlyColor: "red",
    FlyGap: 5000, 

    FrogStartXPos: 600/2, 
    // frog is at the bottom middle of the canvas at the start of the game
    FrogStartYPos: 600-20,  // minus 20 because the radius of the frog is 20
    FrogColor: "green",
    FrogDiameter: 40,

    SectionOpacity: 0.5,  // the opacity for all sections
    SectionPosX: 0, 
    SectionWidth: 600,
    SectionStrokeWidth: "1px",

    GroundYPos: 360,
    GroundHeight: 360,
    GroundColor: 'orange',

    SafeZoneYPos: 300,
    SafeZoneHeight: 60,
    SafeZoneColor: "pink",

    WaterYPos: 160,
    WaterHeight: 140,
    WaterColor: "blue",

    TargetAreaWidth: 85,
    TargetAreaHeight: 100,
    TargetAreaNumber: 5,
    TargetAreaStartXPos: 10,
    TargetAreaStartYPos: 50,
    TargetAreaGap: 125,
    TargetAreaColor: "black",
    TargetAreaStroke: "yellow",
    TargetAreaStrokeWidth: "5px",

    GameOverTextXPos: 40,
    GameOverTextYPos: 350,
    GameOverTextSize: "30px",
    GameOverTextColor: "red",
    
    AppearTime: 0 // the create time of a view
  } as const

  // Only one KeyBoardEvents are used in the game
  type Event = 'keydown' 

  // Only five keys can be used as controls of the game  
  type Key = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown' | 'r'

  /**
   * A reusable function that create an observable stream 
   * Similar to the keyObservable function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * @param eventName a type of the KeyBoardEvents
   * @param k a specified key
   * @param result an expression that transforms the key event to 
   *               an object of the classes defined below 
   *               (Tick or Move or Restart)
   * @returns an observable stream of object of the clasess defined below 
   *          (Tick or Move or Restart)
   */
  const observeKey = <T>(eventName:Event, k:Key, result:()=>T)=>
    fromEvent<KeyboardEvent>(document,eventName)
      .pipe(
        filter(({key})=>key === k),
        filter(({repeat})=>!repeat),
        map(result))

  /**
   * Each of the following classes represents the type of an action that can 
   * be performed in the game.
   * These classes will be used for pattern matching inside the reduceState 
   * function
  */

  /**
   * A class that acts like a game clock tracking the time within the game
   * Similar to the Tick class in the FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   */
  class Tick { 
    /**
     * A constructor that creates a Tick object
     * @param elapsed time within the game
     */
    constructor(public readonly elapsed:number) {} 
  }

  /**
   * A class that determines which direction the frog should move
   * Similar to the Rotate class in the FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   */
  class Move { 
    /**
     * A constructor that creates a Move object
     * @param distance the distance each time a frog moves 
     * @param horizontal true if the frog move left or right, otherwise false
     */
    constructor(public readonly distance:number, 
                public readonly horizontal: boolean) {} 
  }
  
  /**
   * A class that triggers when the user decided to restart the game
   */
  class Restart { 
    /**
     * A empty constructor that creates a Restart object
     */
    constructor() {} 
  }
  /**
   * A class that stores an array of randomly generated number from RNG class
   */
  class RandomNumber {
    /**
     * A constructor
     * @param random 
     */
    constructor(public readonly random: number[]) {}
  }

  // Input Streams
  const 
    startMoveLeft = observeKey('keydown','ArrowLeft', ()=>new Move(-50, true)),
    startMoveRight = observeKey('keydown','ArrowRight', ()=>new Move(50, true)),
    startMoveUp = observeKey('keydown','ArrowUp', ()=>new Move(-50, false)),
    startMoveDown = observeKey('keydown', 'ArrowDown', ()=>new Move(50, false)),
    restartGame = observeKey('keydown', 'r', ()=>new Restart())

  /**
  * A simple, seedable Random Number Generator
  * Taken from PiApproximation Video on YouTube by Tim Dwyer 
  */
   class RNG {
    readonly m = 0x80000000// 2**31
    readonly a = 1103515245
    readonly c = 12345
    constructor(readonly state: number) { }
    int() {
      return (this.a * this.state + this.c) % this.m;
    }
    float() {
      return this.int() / (this.m - 1);
    }
    next() {
      return new RNG(this.int())
    }
  }

  /**
   * A function that creates a seedable Observable stream
   * @param seed a random number for seeding
   * @returns a seedable Observable stream
   */
  const randomNumberStream = (seed: number) =>
    interval(1000).pipe(
      scan((r,_)=>r.next(), new RNG(seed)), 
      map(r=>r.float())
    )
  
  /**
   * There are 2 randomNumberStream, one for x position and another for y 
   * position
   */
  const randomObservable = zip(randomNumberStream(1), 
                               randomNumberStream(2))
                           .pipe(map(x=>new RandomNumber(x)))

  /**
   * A class similar to the Vec class in the FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   */
   class Vec {
    /**
     * A constructor that creates a Vec object
     * @param x the x-coordinate
     * @param y the y-coordinate
     */
    constructor(public readonly x: number = 0, 
                public readonly y: number = 0) {}
    /**
     * Add two vector
     * @param a a vector to be added
     * @returns a new vector
     */
    add = (a: Vec): Vec => new Vec(this.x + a.x, this.y + a.y)
    /**
     * Find the length of a vector
     * @returns a length 
     */
    distance = () => Math.sqrt(this.x*this.x + this.y*this.y)
    
    // A vector with x = 0 and y = 0
    static Zero = new Vec();
  }

  /**
   * Objects in the game can be generalized since they are just rectangular 
   * bodies with constant velocity
   * Similar to the createCircle function in the FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * The objects are generalized in @Body 
   * The type of an object is corresponded to the @ObjectType 
   */

  // These are the types of the objects in the games
  type ObjectType = 'frog' | 'car' | 'fast car' | 'truck' | 'fast truck' |
                    'log' | 'fast log' | 'water' | 'ground' | 'safe zone' | 
                    'target area' | 'turtle' | 'fly' | 'teleporter turtle'

  // Each object has an unique id and its appear time
  type ObjectId = Readonly<{id: string, appearTime: number}>
  
  /**
   * Each object has a position, height, width, fill, stroke, stroke width and
   * opacity
  */
   type Rectangle = Readonly<{position: Vec, height: number, width: number, 
                             fill: string, stroke: string, strokeWidth: string,
                             opacity: number}>
  
  /**
   * Interface for objects in the game 
   * The objects have the properties below in general
   */
  interface ObjectBody extends Rectangle, ObjectId {
    objectType: ObjectType,
    velocity: Vec
  }

  /**
   * Wrap the @ObjectBody in a Readonly type so that we cannot modify any
   * properties inside (prevent impure)
   */
  type Body = Readonly<ObjectBody>

  // State of the game
  type State = Readonly<{
    time: number, // discrete timestep
    frog: Body,
    water: Body,
    ground: Body,
    safeZone: Body,
    // collection of target areas that are not filled
    targetAreas: ReadonlyArray<Body>, 
    // collection of target areas that are not filled
    filledTargetAreas: ReadonlyArray<Body>, 
    cars: ReadonlyArray<Body>,
    fastCars: ReadonlyArray<Body>,
    trucks: ReadonlyArray<Body>,
    fastTrucks: ReadonlyArray<Body>,
    logs: ReadonlyArray<Body>,
    fastLogs: ReadonlyArray<Body>,
    turtles: ReadonlyArray<Body>,
    teleporterTurtles: ReadonlyArray<Body>,
    flies: ReadonlyArray<Body>,
    // collection of the objects to be removed from the game
    remove: ReadonlyArray<Body>,  
    objectCount: number,  
    // indicates the highest score over previous records
    highestScore: number, 
    // increases when the frog reach a target area
    currentScore: number, 
    // indicates the dificulty of the game
    difficultyLevel: number,  
    // get bonus points if the frog eat a fly and reach a target area
    bonusPoint: number, 
    gameOver: boolean 
  }>

  /**
   * A function that creates a frog
   * There is only one frog in the game
   * @returns an object indicating the frog
   */
  function createFrog(): Body {
    return {
      id: 'frog',
      objectType: 'frog',
      position: new Vec(Constants.FrogStartXPos, Constants.FrogStartYPos),
      velocity: Vec.Zero,
      height: Constants.FrogDiameter,
      width: Constants.FrogDiameter,
      fill: Constants.FrogColor,
      stroke: Constants.ObjectStroke,
      strokeWidth: Constants.ObjectStrokeWidth,
      opacity: Constants.ObjectOpacity,
      appearTime: Constants.AppearTime
    }
  }

  /**
   * A function that creates a ground section
   * There is only one ground section in the game
   * @returns an object indicating the ground section
   */
  function createGround(): Body {
    return {
      id: 'ground',
      objectType: 'ground',
      position: new Vec(Constants.SectionPosX, Constants.GroundYPos),
      velocity: Vec.Zero,
      height: Constants.GroundHeight, 
      width: Constants.SectionWidth, 
      fill: Constants.GroundColor,
      stroke: Constants.GroundColor,
      strokeWidth: Constants.SectionStrokeWidth,
      opacity: Constants.SectionOpacity,
      appearTime: Constants.AppearTime
    }
  }

  /**
   * A function that creates a safe zone section
   * There is only one safe zone section in the game
   * @returns an object indicating the safe zone section
   */
  function createSafeZone(): Body {
    return {
      id: 'safe zone',
      objectType: 'safe zone',
      position: new Vec(Constants.SectionPosX, Constants.GroundYPos),
      velocity: Vec.Zero,
      height: Constants.SafeZoneHeight, 
      width: Constants.SectionWidth, 
      fill: Constants.SafeZoneColor,
      stroke: Constants.SafeZoneColor,
      strokeWidth: Constants.SectionStrokeWidth,
      opacity: Constants.SectionOpacity,
      appearTime: Constants.AppearTime
    }
  }

  /**
   * A function that creates a water section
   * There is only one water section in the game
   * @returns an object indicating the water section
   */
  function createWater(): Body {
    return {
      id: 'water',
      objectType: 'water',
      position: new Vec(Constants.SectionPosX, Constants.WaterYPos),
      velocity: Vec.Zero,
      height: Constants.WaterHeight, 
      width: Constants.SectionWidth, 
      fill: Constants.WaterColor,
      stroke: Constants.WaterColor,
      strokeWidth: Constants.SectionStrokeWidth,
      opacity: Constants.SectionOpacity,
      appearTime: Constants.AppearTime
    }
  }

  /**
   * Cars, Trucks, Logs and Target Areas are just rectangles with constant 
   * velocity
   * We can generialize them as there are multiple cars, trucks, logs and 
   * target areas
   * Similar to the createCircle function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   */
  const createRectangle = (objectType: ObjectType) => (objectId: ObjectId) => (rect: Rectangle) => (velocity: Vec) =>
    <Body>{
      ...objectId,
      ...rect,
      velocity: velocity,
      id: objectType + objectId.id,
      objectType: objectType
    },
    createCar = createRectangle('car'),
    createFastCar = createRectangle('fast car'),
    createTruck = createRectangle('truck'),
    createFastTruck = createRectangle('fast truck'),
    createLog = createRectangle('log'),
    createFastLog = createRectangle('fast log'),
    createTargetArea = createRectangle('target area'),
    createTurtle = createRectangle('turtle'),
    createTeleporterTurtle = createRectangle('teleporter turtle'),
    createFlies = createRectangle('fly')

  /**
   * Create rows of cars, trucks, logs and target areas in the canvas
   * Similar to the startRocks in FRP Asteroid 
   * from https://tgdwyer.github.io/asteroids/
   * However, I prefer not to use random generator to generate the velocity 
   * of the objects because all the cars, trucks and logs move with constant 
   * speed and direction
   */
  const 
    // Create one row of cars in the ground section
    startCars = [...Array(Constants.CarNumber)]
      .map((_,i) => 
        createCar({id:String(i), 
                   appearTime: Constants.AppearTime})
                 ({position:new Vec(i*Constants.CarGap,520), 
                   height: Constants.CarHeight, 
                   width: Constants.CarWidth, 
                   fill: Constants.CarColor, 
                   stroke: Constants.ObjectStroke, 
                   strokeWidth: Constants.ObjectStrokeWidth, 
                   opacity: Constants.ObjectOpacity})
                 (new Vec(-Constants.CarMinVelocity,0))),
    // Create one row of cars moving with higher speed in the ground section
    startFasterCars = [...Array(Constants.CarNumber)]
      .map((_,i) => 
        createFastCar({id:String(i), 
                       appearTime: Constants.AppearTime})
                     ({position:new Vec(i*Constants.CarGap,470), 
                       height: Constants.CarHeight, 
                       width: Constants.CarWidth, 
                       fill: Constants.CarColor, 
                       stroke: Constants.ObjectStroke, 
                       strokeWidth: Constants.ObjectStrokeWidth, 
                       opacity: Constants.ObjectOpacity})
                     (new Vec(Constants.CarMinVelocity*2,0))),
    // Create one row of trucks in the ground section
    startTrucks = [...Array(Constants.TruckNumber)]
      .map((_,i) => 
        createTruck({id:String(i), 
                     appearTime: Constants.AppearTime})
                   ({position:new Vec(i*Constants.TruckGap,415), 
                     height: Constants.TruckHeight, 
                     width: Constants.TruckWidth, 
                     fill: Constants.TruckColor, 
                     stroke: Constants.ObjectStroke, 
                     strokeWidth: Constants.ObjectStrokeWidth, 
                     opacity: Constants.ObjectOpacity})
                   (new Vec(-Constants.TruckMinVelocity,0))),
    // Create one row of trucks moving with higher speed in the ground section
    startFasterTrucks = [...Array(Constants.TruckNumber)]
      .map((_,i) => 
        createFastTruck({id:String(i), 
                         appearTime: Constants.AppearTime})
                       ({position:new Vec(i*Constants.TruckGap,365), 
                         height: Constants.TruckHeight, 
                         width: Constants.TruckWidth, 
                         fill: Constants.TruckColor, 
                         stroke: Constants.ObjectStroke, 
                         strokeWidth: Constants.ObjectStrokeWidth, 
                         opacity: Constants.ObjectOpacity})
                       (new Vec(Constants.TruckMinVelocity*2,0))),
    // Create one row of logs in the water section
    startLogs = [...Array(Constants.LogNumber)]
      .map((_,i) => 
        createLog({id:String(i), 
                   appearTime: Constants.AppearTime})
                 ({position:new Vec(i*Constants.LogGap,220), 
                   height: Constants.LogHeight, 
                   width: Constants.LogWidth, 
                   fill: Constants.LogColor, 
                   stroke: Constants.ObjectStroke, 
                   strokeWidth: Constants.ObjectStrokeWidth, 
                   opacity: Constants.ObjectOpacity})
                 (new Vec(Constants.LogMinVelocity,0))),
    // Create one row of logs moving with higher speed in the watere section 
    startFasterLogs = [...Array(Constants.LogNumber)]
      .map((_,i) => 
        createFastLog({id:String(i), 
                       appearTime: Constants.AppearTime})
                     ({position:new Vec(i*Constants.LogGap,170), 
                       height: Constants.LogHeight, 
                       width: Constants.LogWidth, 
                       fill: Constants.LogColor, 
                       stroke: Constants.ObjectStroke, 
                       strokeWidth: Constants.ObjectStrokeWidth,
                      opacity: Constants.ObjectOpacity})
                     (new Vec(Constants.LogMinVelocity*2,0))),
    /**
     * Create one row of target areas in between the score section and the
     * water section
     */
    setUpTargetAreas = [...Array(Constants.TargetAreaNumber)]
      .map((_,i) => 
        createTargetArea({id:String(i), 
                          appearTime: Constants.AppearTime})
                        ({position: new Vec(
                            i*Constants.TargetAreaGap+
                              Constants.TargetAreaStartXPos, 
                            Constants.TargetAreaStartYPos), 
                          height: Constants.TargetAreaHeight, 
                          width: Constants.TargetAreaWidth, 
                          fill: Constants.TargetAreaColor, 
                          stroke: Constants.TargetAreaStroke, 
                          strokeWidth: Constants.TargetAreaStrokeWidth, 
                          opacity: Constants.SectionOpacity})
                        (Vec.Zero)),
    // Create one row of turtles in the water section
    startTurtles = [...Array(Constants.TurtleNumber)]
      .map((_,i) => 
        createTurtle({id:String(i), 
                      appearTime: Constants.AppearTime})
                    ({position:new Vec(i*Constants.TurtleGap, 270), 
                      height: Constants.TurtleHeight, 
                      width: Constants.TurtleWidth, 
                      fill: Constants.TurtleColor, 
                      stroke: Constants.ObjectStroke, 
                      strokeWidth: Constants.ObjectStrokeWidth, 
                      opacity: Constants.ObjectOpacity})
                    (new Vec(-Constants.TurtleMinVelocity, 0))),
    /**
     * Create one row of turtles in the water section that can teleport the 
     * frog back to its starting point
     */
    startTeleporterTurtles = [...Array(Constants.TurtleNumber)]
      .map((_,i) => 
        createTeleporterTurtle({id:String(i), 
                                appearTime: Constants.AppearTime})
                              ({position:new Vec(
                                  i*Constants.TurtleGap-150 + 
                                    Constants.TurtleGap, 
                                  270), 
                                height: Constants.TurtleHeight, 
                                width: Constants.TurtleWidth, 
                                fill: Constants.TeleporterTurtleColor, 
                                stroke: Constants.ObjectStroke, 
                                strokeWidth: Constants.ObjectStrokeWidth, 
                                opacity: Constants.ObjectOpacity})
                              (new Vec(-Constants.TurtleMinVelocity, 0))),
    // Create one row of flies in the ground section
    startFlies = [...Array(Constants.FlyNumber)]
      .map((_,i)=>
        createFlies({id:String(i), 
                     appearTime: Constants.AppearTime})
                   ({position: new Vec(i*Constants.FlyGap, Constants.FlyYPos), 
                     height: Constants.FlyHeight, 
                     width: Constants.FlyWidth, 
                     fill: Constants.FlyColor, 
                     stroke: Constants.ObjectStroke, 
                     strokeWidth: Constants.ObjectStrokeWidth, 
                     opacity: Constants.ObjectOpacity})
                   (new Vec(-Constants.FlyMinVelocity, 0)))

  // Initial State of the game
  const initialState: State = {
    time: 0,
    frog: createFrog(),
    ground: createGround(),
    safeZone: createSafeZone(),
    water: createWater(),
    targetAreas: setUpTargetAreas,
    // none of the target areas are filled at the start
    filledTargetAreas: [],  
    cars: startCars,
    fastCars: startFasterCars,
    trucks: startTrucks,
    fastTrucks: startFasterTrucks,
    logs: startLogs,
    fastLogs: startFasterLogs,
    turtles: startTurtles,
    teleporterTurtles: startTeleporterTurtles,
    flies: startFlies,
    remove: [],
    objectCount: 0,
    highestScore: 0,
    currentScore: 0,
    bonusPoint: 0,
    difficultyLevel: 1, // level of difficulty always start at 1
    gameOver: false
  }  

  /**
   * A function that teleports any object that goes out of bound to the 
   * opposite side
   * Similar to the torusWrap function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * For example, it teleports a car to the left side of the canvas if the 
   * car goes out of the right side bound
   * 
   * @param param0 a Vec object that consist the x and y coordinates of an 
   *               object
   * @returns a new Vec object specifying the new position of the object
   */
   const wrapped = ({x, y}: Vec): Vec => {
    const wrapping = (n: number) =>
      n < 0 ? n + Constants.CanvasSize 
            : n > Constants.CanvasSize ? n - Constants.CanvasSize : n;
    return new Vec(wrapping(x), wrapping(y)) 
  };

  /**
   * A function that restricts any object from going out of bound
   * Similar to the wrapped function above but now we do not want the object 
   * to teleport to the opposite side
   * For example, a frog, that is at the edge of the left side, cannot move 
   * left furthermore
   * 
   * @param param0 a Vec object that consist the x and y coordinates of an 
   *               object
   * @returns a new Vec object specifying the new position of the object
   */
  const setBoundary = ({x,y}: Vec): Vec => {
    const 
      boundedX = (n: number) => 
        n < Constants.LowerBoundX ? Constants.LowerBoundX 
            : n > Constants.UpperBoundX ? Constants.UpperBoundX : n,
      boundedY = (n: number) =>
        n < Constants.LowerBoundY ? Constants.LowerBoundY 
            : n > Constants.UpperBoundY ? Constants.UpperBoundY : n
    return new Vec(boundedX(x), boundedY(y))
  }

  /**
   * A function that moves any object
   * Similar to the moveObject function in the FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * @param object an object to be moved
   * @returns a new Body with the new position of the object 
   */
  const moveObject = (object: Body): Body => <Body> {
    ...object,
    position: wrapped(object.position.add(object.velocity))
  }

  /**
   * A function that handles the collisions between the frog and other objects
   * Similar to the handleCollisions function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * @param state A game state for checking the collisions
   * @returns A new State after handling all the collisions
   */
  const checkCollisions = (state:State): State => {
    /**
     * A function that checks whether the frog (circle) collides with another 
     * object (rectangle)
     * I have referred to the Collision Dectection from 
     * https://www.jeffreythompson.org/collision-detection/circle-rect.php
     * I have used ternary operators instead of if else to improve the 
     * readability of the code
     * 
     * @param param0 an array that consist of two objects
     * @returns true if the two objects collided, otherwise false
     */
    const collided = ([a,b]:[Body,Body]) => {
      const 
        // the radius of the frog
        rad = a.height/2,
        // the x-coordinate of the frog
        cx = a.position.x,
        // the y-coordinate of the frog
        cy = a.position.y,
        // the x-coordinate of the object
        rx = b.position.x,
        // the y-coordinate of the object
        ry = b.position.y,
        // the height of the object
        rh = b.height,
        // the width of the object
        rw = b.width,
        /**
         * Determine whether the frog is nearer to or at the left or right 
         * edge of the object
         */
        testX = cx < rx ? rx : cx > rx+rw ? rx+rw : cx,
        /**
         * Determine whether the frog is nearer to or at the top or bottom 
         * edge of the object
         */
        testY = cy < ry ? ry : cy > ry+rh ? ry+rh : cy,
        /**
         * Calculate the horizontal distance of the frog and the nearest 
         * edge of the object (left or right)
         */
        distX = cx-testX,
        /**
         * Calculate the vertical distance of the frog and the nearest edge 
         * of the object (top or bottom)
         */
        distY = cy-testY,
        /**
         * Calculate the distance from closest edges
         */
        distance = Math.sqrt(distX*distX + distY*distY)

      /**
       * Check if the distance is less than or equal to the radius of the frog
       * If true, collision happens
       */
      return distance <= rad
    }

    /**
     * Check whether the frog collides with other objects using @collided
     */
    const
      /**
       * Check whether the frog collides with a car or a truck
       * True if collision happens
       */
      collidedVehicles = 
        state.cars.filter(r=>collided([state.frog,r])).length > 0 
        || state.fastCars.filter(r=>collided([state.frog,r])).length > 0 
        || state.trucks.filter(r=>collided([state.frog,r])).length > 0
        || state.fastTrucks.filter(r=>collided([state.frog,r])).length > 0,
      /**
       * Check whether the frog collides with a log
       * True if collision happens
       */
      collidedLogs = 
        state.logs.filter(r=>collided([state.frog,r])).length > 0,
      /**
       * Check whether the frog collides with a log with faster speed
       * True if collision happens
       */
      collidedFastLogs = 
        state.fastLogs.filter(r=>collided([state.frog,r])).length > 0,
      /**
       * Chech whether the frog collides with a turtle
       * True if collision happens
       */
      collidedTurtles = 
        state.turtles.filter(r=>collided([state.frog,r])).length > 0,
      /**
       * Check whether the frog collides with a teleporter turtle
       * True if collision happens
       */
      collidedTeleporterTurtle = 
        state.teleporterTurtles.filter(r=>collided([state.frog,r])).length > 0,
      /**
       * Check whether the frog is currrently at the water section
       * True if the frog is currently at the water section 
       */
      inWaterSection = collided([state.frog, state.water]),
      /**
       * Check whether the frog reaches a target area that is not filled
       * True if the frog is at a target area that is not filled
       */
      collidedTargetAreas = 
        state.targetAreas.filter(r=>collided([state.frog, r])).length > 0,
      // Extract the target areas that has not been filled
      targetAreasNotCollided = 
        state.targetAreas.filter(r=>!collided([state.frog, r])),
      // Extract the target areas that has been filled
      targetAreasCollided = 
        state.targetAreas.filter(r=>collided([state.frog, r])),
      /**
       * Check whether the frog collides with a fly
       * True if the frog collides with a fly
       */
      collidedFly = 
        state.flies.filter(r=>collided([state.frog,r])).length > 0,
      // Extract the flies that has not collided with the frog
      remainingFly = 
        state.flies.filter(r=>!collided([state.frog,r])),
      /**
       * Extract the flies that collided with the frog because we want to 
       * remove them 
       */
      removeCollidedFly = 
        state.flies.filter(r=>collided([state.frog,r]))

    return <State> {
      ...state,
      frog: {...state.frog, 
        velocity: 
          /**
           * If the frog collides with a log, it means that the frog will 
           * stand on the log
           * Hence, the velocity of the frog becomes the same as the log 
           * it is standing on 
           * I have used ternary operators for better readability
           */
          collidedLogs 
            ? new Vec(Constants.LogMinVelocity*(state.difficultyLevel), 0) 
            : collidedFastLogs 
              ? new Vec(Constants.LogMinVelocity*2*(state.difficultyLevel), 0) 
              : collidedTurtles 
                ? new Vec(-Constants.TurtleMinVelocity, 0) 
                : Vec.Zero, 
        position: 
          /**
           * If the frog reaches a target area that is not filled, the frog 
           * will fill the target area and start from the starting point
           * If the frog stand on a teleporter turtle, the frog will be 
           * teleport back to the starting point
           * Otherwise, the position of the frog changes according to the log 
           * it is standing on
           */
          collidedTargetAreas || collidedTeleporterTurtle 
            ? new Vec(Constants.FrogStartXPos, Constants.FrogStartYPos) 
            : setBoundary(state.frog.position.add(state.frog.velocity))},
      /**
       * If the frog reach a target area that is not filled, change the 
       * collection of target areas that are not filled accordingly
       * This can be done by extracting the target areas that are not filled 
       * using filter function
       */
      targetAreas: targetAreasNotCollided,
      /**
       * If the frog reach a target area that is not filled, change the 
       * collection of target areas that are filled accordingly
       * This can be done by extracting the target areas that are filled using 
       * filter function
      */
      filledTargetAreas: state.filledTargetAreas.concat(targetAreasCollided),
      /**
       * When the frog reach a target area that is not filled, the score
       * increases by 100
       */
      currentScore: 
        collidedTargetAreas ? state.currentScore + 100 + state.bonusPoint 
          : state.currentScore,
      /**
       * When the frog eat a fly (collide with a fly), the frog will receive 
       * 50 bonus points when it reaches a target area 
       */
      bonusPoint: 
        collidedFly ? state.bonusPoint + 50 
          : collidedTargetAreas ? 0 : state.bonusPoint,
      // When the frog collided with a fly, the fly will be removed
      remove: state.remove.concat(removeCollidedFly),
      // Indicates the remaining flies that has not collided with the frog 
      flies: remainingFly,
      /**
       * If the frog collides with a car or truck, the frog dies and the game 
       * is over
       * If the frog is at the water section and it does not stand on a log or
       * a turtle, the frog dies and the game is over
       */
      gameOver: 
        collidedVehicles || (inWaterSection && !collidedLogs && 
        !collidedFastLogs && !collidedTurtles && ! collidedTeleporterTurtle)
    }
  }

  /**
   * A function that returns a corresponding state based on the input states
   * Similar to the Tick function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * @param s a game state 
   * @param elapsed time within the game
   * @returns a state
   */
  const tick = (s: State, elapsed: number): State => {
    /**
     * Check whether the flies expires
     * The flies will only appear in the first 10 seconds in each level.
     */
    const 
      expired = (b: Body) => (elapsed - b.appearTime) > 1000,
      expiredFlies: Body[] = s.flies.filter(expired)
    

    // Returns a corresponding state based on the input states
    const returnState = 
      /**
       * When all the target areas are filled,
       * 1. make all the target areas to be unfilled so that the user can fill 
       *    the areas again
       * 2. remove all the big circles in the target areas
       * 3. give bonus 50 points
       * 4. increase the difficulty level of the game by 1
       */
      s.filledTargetAreas.length == Constants.TargetAreaNumber ? <State> {
        ...s,
        /**
         * When the difficulty level of the game increases, the speed of some 
         * objects increases
         */
        cars: s.cars.map((car)=>({...car, 
          velocity: new Vec(
            -Constants.CarMinVelocity*(s.difficultyLevel+1),
            0)})),
        fastCars: s.fastCars.map((car)=>({...car, 
          velocity: new Vec(
            Constants.CarMinVelocity*2*(s.difficultyLevel+1),
            0)})),
        trucks: s.trucks.map((truck)=>({...truck, 
          velocity: new Vec(
            -Constants.TruckMinVelocity*(s.difficultyLevel+1),
            0)})),
        fastTrucks: s.fastTrucks.map((truck)=>({...truck, 
          velocity: new Vec(
            Constants.TruckMinVelocity*2*(s.difficultyLevel+1),
            0)})),
        logs: s.logs.map((log)=>({...log, 
          velocity: new Vec(
            Constants.LogMinVelocity*(s.difficultyLevel+1),
            0)})),
        fastLogs: s.fastLogs.map((log)=>({...log, 
          velocity: new Vec(
            Constants.LogMinVelocity*2*(s.difficultyLevel+1),
            0)})),
        // flies appear again 
        flies: startFlies.map((fly)=>({...fly, 
          appearTime: s.time})),
        // make all the target areas to be unfilled
        targetAreas: setUpTargetAreas, 
        // remove all the filled target areas
        filledTargetAreas: [],
        // remove all big green circles in the target areas
        remove: s.filledTargetAreas,
        // give 50 bonus point to the Player
        currentScore: s.currentScore + 50,
        // increase the difficulty level by 1
        difficultyLevel: s.difficultyLevel + 1
      } :
      /**
       * When the current score is higher than the highest score, the highest
       * score is replaced with the current score
       */
      s.currentScore > s.highestScore ? <State> {
        ...s,
        highestScore: s.currentScore
      } :
      /**
       * If the game is over, remove all the big circles in target areas
       * I decided to remove them here instead when restart game is triggered 
       * because it will cause bugs if I put s.filledTargetAreas as the initial 
       * remove state
       */
      s.gameOver ? <State> {
        ...s,
        remove: s.filledTargetAreas
      } :
      // Check whether there is collision between objects
      checkCollisions({
        ...s,
        cars: s.cars.map(moveObject),
        fastCars: s.fastCars.map(moveObject),
        trucks: s.trucks.map(moveObject),
        fastTrucks: s.fastTrucks.map(moveObject),
        logs: s.logs.map(moveObject),
        fastLogs: s.fastLogs.map(moveObject),
        turtles: s.turtles.map(moveObject),
        teleporterTurtles: s.teleporterTurtles.map(moveObject),
        flies: s.flies.map(moveObject),
        remove: expiredFlies,
        time: elapsed
    })

    return returnState
  }

  /**
   * A function that returns a state depending on what type of action being triggered
   * Similar to the reduceState in the FRP Asteroids from https://tgdwyer.github.io/asteroids/
   * 
   * @param s a previous game state
   * @param e an object of the action classes
   * @returns a state
   */
  const reduceState = (s: State, e: Move|Restart|Tick|RandomNumber): State =>
    /**
     * If restart action being triggered, change the properties back to their 
     * initial value by taking the properties in the initialState
     * To keep track of the highest score from the previous rounds, take the 
     * highest value from the previous state
     */
    e instanceof Restart ? <State> {
      ...initialState,
      highestScore: s.highestScore,
      time: 0
    } :
    // If move action being triggered, change the position of the frog
    e instanceof Move ? <State> {
      ...s,
      frog: {
        ...s.frog, 
        velocity: 
          e.horizontal ? new Vec(e.distance, 0) : new Vec(0, e.distance), 
        position: 
          setBoundary(s.frog.position.add(s.frog.velocity))},
    } :
    /**
     * I would like to make the flies to appear on a random position in the 
     * ground section,
     * and a row of Turtle in the water section. When the frog collides with 
     * a Turtle, there is 10% chances for the frog to teleport back to the 
     * starting point.
     * Unfortunately, I am not able to figure it out within the time
     */
    e instanceof RandomNumber ? <State> {
      ...s,
    } :
    tick(s, e.elapsed)

  /**
   * Main game stream of observables
   * Similar to the subscription in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   */
  const subscription = 
    merge(
      interval(10).pipe(map(elapsed=>new Tick(elapsed))),
      startMoveLeft, startMoveRight, startMoveUp, startMoveDown, restartGame, randomObservable
    )
    .pipe(
        scan(reduceState, initialState)
    )
    .subscribe(updateView);

  /**
   * A function that changes how the canvas looks like based on the game state
   * Similar to the updateView function in FRP Asteroids 
   * from https://tgdwyer.github.io/asteroids/
   * 
   * @param s a game state
   */
  function updateView(s: State): void {
    // The svg canvas
    const svg = document.getElementById('svgCanvas')!;
    
    // The view for displaying the current score
    const displayCurrentScore = 
      document.getElementById('displayCurrentScore')!;
    // Change the content of the view corresponding to the currentScore state
    displayCurrentScore.textContent = 
      "Current Score: " + String(s.currentScore);
    // The view for displaying the highest score
    const displayHighestScore = 
      document.getElementById('displayHighestScore')!;
    /**
     * Change the content of the view corresponding the highestScore state
     * If the current score is greater than the highest score, the highest 
     * score will increase corresponding to the current score
     * I decided to change it here instead after the game is over because it 
     * is easier for the user to know when the current score is greater than 
     * the highest score
     */
    displayHighestScore.textContent = 
      "Highest Score: " + String(s.highestScore);
    // The view for displaying the current difficulty
    const displayDifficulty = document.getElementById('displayDifficulty')!;
    // Change the content of the view corresponding to the currentScore state
    displayDifficulty.textContent = "Lv " + String(s.difficultyLevel);

    /**
     * An inner function that creates or updates a view on the canvas based on
     * the properties of a given object
     * Similar to the updateBodyView function in the FRP Asteroids 
     * from https://tgdwyer.github.io/asteroids/
     * 
     * @param c an object
     */
    const updateObjectView = (c: Body) => {
      /**
       * Create a view based on the properties of c
       * Similar to the createBodyView function in the FRP Asteroids
       * from https://tgdwyer.github.io/asteroids/
       * @returns a view
       */
      function createObjectViews() {
        const v = document.createElementNS(svg.namespaceURI, "rect")!;
        v.setAttribute("id", c.id);
        v.setAttribute("height", String(c.height))
        v.setAttribute("width", String(c.width))
        v.setAttribute("fill", c.fill)
        v.setAttribute("stroke", c.stroke)
        v.setAttribute("stroke-width", c.strokeWidth)
        v.setAttribute("opacity", String(c.opacity))
        svg.appendChild(v)
        return v;
      }
      /**
       * Create the view if the view does not exist, or update the position of 
       * the view if the view already exist
      */
      const v = document.getElementById(c.id) || createObjectViews();
      v.setAttribute("x", String(c.position.x))
      v.setAttribute("y", String(c.position.y))
    };

    // Update the visuals for each object
    s.cars.forEach(updateObjectView);
    s.fastCars.forEach(updateObjectView);
    s.trucks.forEach(updateObjectView);
    s.fastTrucks.forEach(updateObjectView);
    s.logs.forEach(updateObjectView);
    s.fastLogs.forEach(updateObjectView);
    s.turtles.forEach(updateObjectView);
    s.teleporterTurtles.forEach(updateObjectView);
    s.flies.forEach(updateObjectView);
    s.targetAreas.forEach(updateObjectView);
    /**
     * When the frog reach a target area that is not filled, put a big green 
     * circle in the target area indicating that the target area is filled
     * 
     * Similar to @createObjectViews function above but now we create a new 
     * view with different id from the target area becase we cannot use the 
     * same id for the target area and the circle.
     */
    s.filledTargetAreas.forEach(c => {
      const createFilledTargetAreaViews = () => {
        const v = document.createElementNS(svg.namespaceURI, "circle")!;
        v.setAttribute("id", `circle${c.id}`);
        v.setAttribute("r", "30")
        v.setAttribute("fill", "green")
        v.setAttribute("stroke", "black")
        v.setAttribute("stroke-width", "1px")
        v.setAttribute("opacity", "1")
        svg.appendChild(v)
        return v;
      }
      const v = document.getElementById(`circle${c.id}`) || createFilledTargetAreaViews();
      v.setAttribute("cx", String(c.position.x+c.width/2))
      v.setAttribute("cy", String(c.position.y+c.height/2))
    });

    /**
     * Remove objects using their id
     * 
     * We need to have a condition to check whether the object we want to 
     * remove is the big green circle since we created the id of the big green
     * circles manually above. 
     */
    s.remove.forEach(o=>{
      const c = document.getElementById(`circle${o.id}`)
      if(c) {
        svg.removeChild(c)
      } 
      else {
        const v = document.getElementById(o.id)
        if(v) svg.removeChild(v)
      }
    })

    // Update the position of the frog
    const frog = document.getElementById('frog')!
    frog.setAttribute('cx',  `${s.frog.position.x}`)
    frog.setAttribute('cy',  `${s.frog.position.y}`)

    // If the game is over, place a game over text on the canvas
    if(s.gameOver){
      const message = document.createElementNS(svg.namespaceURI, 'text')!;
      message.setAttribute("id", "game over")
      message.setAttribute("x", String(Constants.GameOverTextXPos));
      message.setAttribute("y", String(Constants.GameOverTextYPos));
      message.setAttribute("font-size", Constants.GameOverTextSize);
      message.setAttribute("fill", Constants.GameOverTextColor)
      message.textContent = "Game Over! Press r to restart the game!";
      svg.appendChild(message);
    }
    /**
     * If the game is not over and there is a game over text on the canvas, 
     * remove it
     * This is required when the user restarts the game
     */
    else {
      const v = document.getElementById("game over")
      if (v) svg.removeChild(v)
    }
  }
}

// The following simply runs your main function on window load.  Make sure to leave it in place.
if (typeof window !== "undefined") {
  window.onload = () => {
    main();
  };
}