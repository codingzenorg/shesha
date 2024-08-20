/*
here keep logic thats:
- initialize game
- initialize game model
- translate screen i/o into moves/feedback
*/


//gets relation between screensize and cellsize
const canvasMapBuilder = (cellSize) => {
    cellSize = cellSize || 20
    return {
        cellSize,
        limit: (x, y) => {
            return {
                h: Math.floor(x / cellSize),
                v: Math.floor(y / cellSize)
            }
        },
        f: (v) => v * cellSize
    }
}

const createCanvas = (document) => {

    //configure body
    document.body.style.margin = "0px"
    document.body.style.borderColor = "gray"
    document.body.style.borderStyle = "solid"
    document.body.style.borderWidth = "5px"

    //adj canvas for fullscreen
    const canvas = document.createElement('canvas')
    canvas.width = window.innerWidth - 10
    canvas.height = window.innerHeight - 15
    document.body.appendChild(canvas)

    return canvas
}

//input - logic to translate keyboard input into game actions
const bindInput = (document, game) => {
    document.addEventListener("keydown", key => {
        game.actions({
            'ArrowLeft': game.moves.leftArrow,
            'ArrowUp': game.moves.upArrow,
            'ArrowRight': game.moves.rightArrow,
            'ArrowDown': game.moves.downArrow
        }[key.key])
    })
}

export default binder = (document, game) => {

    bindInput(document, game)

    const canvas = createCanvas(document)

    const canvasMap = canvasMapBuilder()

    const gameLoop = game.gameCreator(sceneRendererBuilder(canvas, canvasMap, {
        boardBackColor: 'black',
        snakeColor: 'blue',
        appleColor: 'red'
    }),
        canvasMap.limit(canvas.width, canvas.height)
    )

    //const gameRhythm = 1000 / 15 //1s/15
    const gameRhythm = 1000 / 1

    setInterval(gameLoop, gameRhythm)

}


//presentation logic
const sceneRendererBuilder = (canvas, { f, cellSize }, { boardBackColor, appleColor, snakeColor }) => {
    console.log('canvas on sceneRendererBuilder', canvas)
    const ctx = canvas.getContext("2d")
    const squareSize = cellSize - 2
    let count = 0
    return ({ snake, apple }) => {
        count++

        //clear-------------------------------
        ctx.fillStyle = boardBackColor

        //margin
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        //snake-------------------------------
        ctx.fillStyle = snakeColor
        snake.trail.forEach(t => ctx.fillRect(f(t.x), f(t.y), squareSize, squareSize))

        //apple-------------------------------
        ctx.fillStyle = appleColor
        ctx.fillRect(f(apple.x), f(apple.y), squareSize, squareSize)

        //legend-------------------------------
        ctx.fillStyle = "blue"
        ctx.font = "bold 16px Arial"
        ctx.fillText(`cell size : ${cellSize}`, (canvas.width) - 150, 50)
        ctx.fillText(`snake size: ${snake.trail.length}`, (canvas.width) - 150, 70)
        ctx.fillText(`apple (${apple.x},${apple.y})`, (canvas.width) - 150, 90)
        ctx.fillText(`snake (${snake.x},${snake.y})`, (canvas.width) - 150, 110)
        ctx.fillText(`calls (${count})`, (canvas.width) - 150, 130)
    }
}
