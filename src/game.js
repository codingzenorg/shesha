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
    return {
        apple: appleCreator(limits),
        snake: snakeCreator(limits),
        h: limits.h,
        v: limits.v,
        checkColision() {
            return (this.apple.x == this.snake.x && this.apple.y == this.snake.y)
        }
    }
}

//adjust horizontal coordinate simulating infinite space
const correctHorizAxisBuilder = ({ h }) => (x) => {
    if (x < 0) return h - 1
    if (x > h - 1) return 0
    return x
}

//adjust vertical coordinate simulating infinite space
const correctVerticalAxisBuilder = ({ v }) => (y) => {
    if (y < 0) return v - 1
    if (y > v - 1) return 0
    return y
}
//todo: reuse correctHorizAxis instead correctHorizAxis and correctVerticalAxis, and give it a meaningful name







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
        move([dx,dy]){
            //let [nx, ny] = dpos
            this.x += dx
            this.y += dy
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
    const hCorrection = correctHorizAxisBuilder(board)
    const vCorrection = correctVerticalAxisBuilder(board)

    //game loop
    return () => {

        //find a snake
        let snake = board.snake
        getCurrentPos(snake)

        //board logic
        snake.x = hCorrection(snake.x)
        snake.y = vCorrection(snake.y)

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
}



const getCurrentPos = (snake) => {
    let [nx, ny] = dpos
    snake.x += nx
    snake.y += ny
}


const leftArrow = [-1, 0]
const rightArrow = [1, 0]
const upArrow = [0, -1]
const downArrow = [0, 1]

//export { leftArrow, rightArrow, upArrow, downArrow }

export const actions = e => { dpos = e || dpos }
//state

//global
let dpos = [0, 0]



export default {
    actions,
    moves: { leftArrow, rightArrow, upArrow, downArrow },
    gameCreator,
    boardCreator
}