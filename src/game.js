/*
here keep only game logic:
- board size, limits
- snake position, trail
- apple position
- colisions
*/

//board logic ---------------------------------------------------
//knows how to create a board object given size boundaries
const boardCreator = (limits) => {
    const infiniteOnX = applyInfiniteMovementBuilder(limits.h)
    const infiniteOnY = applyInfiniteMovementBuilder(limits.v)

    //TODO: board should know its elements but not exactly
    return {
        apple: appleCreator(limits),
        snake: snakeCreator(limits),
        h: limits.h,
        v: limits.v,
        checkColision() {
            return (this.apple.x == this.snake.x && this.apple.y == this.snake.y)
        },
        moveOnBoard({ x, y }) {
            return { x: infiniteOnX(x), y: infiniteOnY(y) }
        }
    }
}

//adjust horizontal coordinate simulating infinite space
const applyInfiniteMovementBuilder = (axisLimit) => (axisValue) => {
    if (axisValue < 0) return axisLimit - 1
    if (axisValue > axisLimit) return 0
    return axisValue
}

//snake logic----------------------------------------------

//knows how to create a snake object given board boundaries
const snakeCreator = ({ h, v }) => {
    return {
        x: Math.floor(Math.random() * h),
        y: Math.floor(Math.random() * v),
        trail: [],
        tail: 5,
        moveTail() {

            this.trail.push({
                x: this.x,
                y: this.y
            })

            while (this.trail.length > this.tail) {
                this.trail.shift()
            }
        },
        increaseTail() {
            this.tail++
        },
        move([dx, dy]) {
            this.x += dx
            this.y += dy
        },
        getPosition() {
            return { x: this.x, y: this.y }
        },
        updatePosition({ x, y }) {
            this.x = x
            this.y = y
        }
    }
}

//apple logic----------------------------------------------

//knows how to create a apple object given board boundaries
const appleCreator = ({ h, v }) => {
    return {
        x: Math.floor(Math.random() * h),
        y: Math.floor(Math.random() * v)
    }
}

//knows how to create a new game
export const gameCreator = (sceneRenderer, limits) => {

    const board = boardCreator(limits)

    //global
    //todo: inside board
    let dpos = [0, 0]

    //game loop
    const gameLoop = () => {

        //find a snake
        const snake = board.snake
        //getCurrentPos(snake)
        let [nx, ny] = dpos
        snake.x += nx
        snake.y += ny

        //board logic
        snake.updatePosition(board.moveOnBoard(snake.getPosition()))

        //draw snake
        snake.moveTail()

        //check colision
        if (board.checkColision()) {
            snake.increaseTail()
            //new apple
            board.apple = appleCreator(board)
        }

        sceneRenderer(board)
    }

    //todo: export actions
    const dispatcher = e => { dpos = e || dpos }

    const leftArrow = [-1, 0]
    const rightArrow = [1, 0]
    const upArrow = [0, -1]
    const downArrow = [0, 1]

    const actions = { leftArrow, rightArrow, upArrow, downArrow }

    return {
        gameLoop,
        dispatcher,
        actions
    }
}