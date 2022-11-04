const container = document.querySelector("#pixelContainer")
var eventQueue = new Map()


// Main events
createPixels(30, 30) // pixel grid


function createPixels(x, y) {
    // Set grid layout size
    container.style.gridTemplateColumns = `repeat(${x}, 1fr)`
    container.style.gridTemplateRows = `repeat(${y}, 1fr)`

    // Create each pixel
    for (let i = 0; i < y; i++) {
        for (let j = 0; j < x; j++) {
            const div = document.createElement("div")
            div.classList.add("pixel")
    
            div.id = j + "" + i
            div.dataset.col = j
            div.dataset.row = i
            div.dataset.alive = "false"
    
            div.addEventListener('mouseup', () => {
                if (div.style.backgroundColor == "gray") {
                    div.style.backgroundColor = "whitesmoke"
                    div.dataset.alive = "false"
                }
                else {
                    div.style.backgroundColor = "gray"
                    div.dataset.alive = "true"
                }
            })
    
            container.appendChild(div)
        }
    }
}

function startGame() {
    pixels = document.getElementsByClassName("pixel")
    eventQueue = new Map()


    for (let i = 0; i < pixels.length; i++) {
        var neighbourList = [] 
        const pixel = pixels[i]
        const x = parseInt(pixel.dataset.col)
        const y = parseInt(pixel.dataset.row)

        getNeighbouringPixels(x, y, neighbourList)

        checkRules(pixel, neighbourList.length)

        // console.log(neighbourList)
    }

    console.log(eventQueue)

    for (let [key, value] of eventQueue) {
        value(key)
    }
}

function getNeighbouringPixels(x, y, neighbourList) {
    // Top Left     1
    pixelOffset(neighbourList, `${x-1}${y-1}`)
    // Top          2
    pixelOffset(neighbourList, `${x}${y-1}`)
    // Top Right    3
    pixelOffset(neighbourList, `${x+1}${y-1}`)
    // Right        4
    pixelOffset(neighbourList, `${x+1}${y}`)
    // Bottom Right 6
    pixelOffset(neighbourList, `${x+1}${y+1}`)
    // Bottom       7
    pixelOffset(neighbourList, `${x}${y+1}`)
    // Bottom Left  8
    pixelOffset(neighbourList, `${x-1}${y+1}`)
    // Left         9
    pixelOffset(neighbourList, `${x-1}${y}`)
}

function pixelOffset(neighbourList, offset) {
    let pixel = document.getElementById(offset)

    if (typeof pixel != "undefined" && pixel != null && pixel.dataset.alive == "true") {
        neighbourList.push(pixel)
    }
}

function checkRules(pixel, neighbourAmount) {
    if (pixel.dataset.alive == "true") {
        // underpopulation -> (alive cell with LESS than two neighbours die,  < 2)
        // overpopulation -> (alive cell with MORE than three neighbours die, > 3)
        if (neighbourAmount < 2 || neighbourAmount > 3) {
            // killPixel(pixel)
            eventQueue.set(pixel, killPixel)
        }
        else {
            // unchanged -> (alive cell with two or three neighbours remain unchanged, == 2 || == 3)
        }
    }
    else if (pixel.dataset.alive == "false") {
        // life -> (dead cell with exactly three neighbours come to life)
        if (neighbourAmount == 3) {
            // revivePixel(pixel)
            eventQueue.set(pixel, revivePixel)
        }
    }
}

function killPixel(pixel) {
    pixel.style.backgroundColor = "whitesmoke"
    pixel.dataset.alive = "false"
}

function revivePixel(pixel) {
    pixel.style.backgroundColor = "gray"
    pixel.dataset.alive = "true"
}
