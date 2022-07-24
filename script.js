const GameBoard = (() => {
    const __restartBtn = document.querySelector('.restart-button')
    let boardArray = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']

    const restart = () => {
        for (let i = 0; i < boardArray.length; i++) {
            boardArray[i] = ' '
        }
        SetUpController.display()
        Game.turn = 'X'
    }

    __restartBtn.addEventListener('click', restart)

    return { boardArray, restart }
})()

const SetUpController = (() => {
    const __board = document.querySelector('.board')

    const __handleMoves = (boardCell, index) => {
        if (GameBoard.boardArray[index] !== ' ') {
            return
        }

        boardCell.addEventListener('click', () => {
            if (Game.turn === 'X') {
                player1.move(index)
                Game.turn = 'O'
                Game.isOver()
            } else {
                player2.move(index)
                Game.turn = 'X'
                Game.isOver()
            }
        })
    }

    const display = () => {
        __board.innerHTML = ''

        for (let i = 0; i < GameBoard.boardArray.length; i++) {
            const boardCell = document.createElement('div')
            __board.append(boardCell)
            boardCell.textContent = GameBoard.boardArray[i]
            boardCell.classList.add('board-cell')
            __handleMoves(boardCell, i)
        }
    }

    display()

    return { display }
})()

const Game = (() => {
    const __modal = document.querySelector('.modal')
    const __h1 = document.createElement('h1')
    __modal.append(__h1)

    const __overlay = document.querySelector('.overlay')
    const __boardArray = GameBoard.boardArray

    let turn = 'X'

    let __showResults = result => {
        __modal.classList.add('active')
        __overlay.classList.add('active')

        if (result === 'X') {
            __h1.textContent = `${player1.name} wins!`  
        } else if (result === 'O') {
            __h1.textContent = `${player2.name} wins!` 
        } else if (result === 'tie') {
            __h1.textContent = `It's a tie!`
        }
    }

    __overlay.addEventListener('click', () => {
        __modal.classList.remove('active')
        __overlay.classList.remove('active')
        GameBoard.restart()
    })

    let isOver = () => {
        if (__boardArray[0] === __boardArray[1] && __boardArray[0] === __boardArray[2] && __boardArray[0] !== ' ') {
            __showResults(__boardArray[0])
        } // Checks for first row wins

        if (__boardArray[3] === __boardArray[4] && __boardArray[3] === __boardArray[5] && __boardArray[3] !== ' ') {
            __showResults(__boardArray[3])
        } // Checks for second row wins

        if (__boardArray[6] === __boardArray[7] && __boardArray[6] === __boardArray[8] && __boardArray[6] !== ' ') {
            __showResults(__boardArray[6])
        } // Checks for third row wins

        if ((__boardArray[0] === __boardArray[4] && __boardArray[0] === __boardArray[8] && __boardArray[0] !== ' ') ||
            (__boardArray[2] === __boardArray[4] && __boardArray[2] === __boardArray[6] && __boardArray[2] !== ' ')) {
            __showResults(__boardArray[4])
        } // Checks for diagonal wins

        for (let i = 0; i < 3; i++) {
            if (__boardArray[i] === __boardArray[i + 3] && __boardArray[i] === __boardArray[i + 6] && __boardArray[i] !== ' ') {
                __showResults(__boardArray[i])
            } // Checks for column wins
        }
        
        let emptyHouses = 0
        for (let i = 0; i < __boardArray.length; i++) {
            if (__boardArray[i] === ' ') {
                emptyHouses++
            }
        }
        if (emptyHouses === 0) {
            __showResults('tie')
        } // Checks for ties   
    }
    
    return { turn, isOver }
})()

const player = (symbol, name) => {
    if (name === undefined) {
        name = (symbol === 'X') ? 'Player 1' : (symbol === 'O') ? 'Player 2' : 'Something bad happened'
    }

    let move = spot => {
        GameBoard.boardArray[spot] = symbol
        SetUpController.display()
    }

    return { symbol, name, move }
}

const Label = (() => {
    const __usernameForms = document.querySelectorAll('form')
    const __label = document.querySelectorAll('label')

    const __changeLabel = (label, content) => {
        label.textContent = content
    }

    for (let i = 0; i < __usernameForms.length; i++) {
        __usernameForms[i].addEventListener('submit', e => {
            e.preventDefault()
            const formData = new FormData(e.target)
            const formProps = Object.fromEntries(formData)

            if (i === 0) {
                player1.name = formProps.username
                __changeLabel(__label[0], formProps.username)
            } else {
                player2.name = formProps.username
                __changeLabel(__label[1], formProps.username)
            }
            __usernameForms[i].reset()
        })
    }
})()

const player1 = player('X')

const player2 = player('O')
