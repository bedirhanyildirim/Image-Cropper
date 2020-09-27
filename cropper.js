class Cropper {

    // Constructor
    constructor (el, imageSrc) {
        this.imageSrc = imageSrc
        this.el = el
        this.canvas = null
        this.prevCanvas = null
        window.isResizing = false
        window.isMoving = false
        window.resizingDirection = null
        window.imageSrc = imageSrc
        this.corners = {
            el : null,
            neCorner : null,
            seCorner : null,
            swCorner : null,
            nwCorner : null,
        }

        this.createCanvas()
        this.drawImage()
        this.createCorners()
        this.addDragEvents()
        this.saveTo()
    }

    // Create canvas element
    createCanvas () {
        // Set elements from top to bottom
        this.el.style.display = 'flex'
        this.el.style.flexDirection = 'column'
        // Create canvas
        this.canvas = document.createElement('canvas')
        // Set id to canvas
        this.canvas.id = 'cropperCanvas'
        // Set class to canas
        this.canvas.classList.add('cropperCanvas')
        // Append to DOM
        this.el.appendChild(this.canvas)
    }

    // Draw image to canvas
    drawImage () {
        // Create image object
        var image = new Image()
        // Set image source
        image.src = this.imageSrc
        // Set canvas context as 2d
        var ctx = this.canvas.getContext('2d')
        // Set smooth content = true & hight
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        // Calculate new width and height, new width = 500px
        var newImgW = 500
        var newImgH = image.height / (image.width/500)
        // Set the new width and height and set to canvas
        this.canvas.width = newImgW
        this.canvas.height = newImgH
        // Draw image to canvas
        ctx.drawImage(image, 0, 0, newImgW, newImgH)
    }

    // Create cropper corners elements
    createCorners () {
        // Create cropper square div, set id and class
        this.corners.el = document.createElement('div')
        this.corners.el.id = 'corners'
        this.corners.el.classList.add('corners')
        // Create north east corner point of square, set id and classes, append to square
        this.corners.neCorner = document.createElement('div')
        this.corners.neCorner.classList.add('corner')
        this.corners.neCorner.classList.add('ne')
        this.corners.el.appendChild(this.corners.neCorner)
        // Create south east corner point of square, set id and classes, append to square
        this.corners.seCorner = document.createElement('div')
        this.corners.seCorner.classList.add('corner')
        this.corners.seCorner.classList.add('se')
        this.corners.el.appendChild(this.corners.seCorner)
        // Create south west corner point of square, set id and classes, append to square
        this.corners.swCorner = document.createElement('div')
        this.corners.swCorner.classList.add('corner')
        this.corners.swCorner.classList.add('sw')
        this.corners.el.appendChild(this.corners.swCorner)
        // Create north west corner point of square, set id and classes, append to square
        this.corners.nwCorner = document.createElement('div')
        this.corners.nwCorner.classList.add('corner')
        this.corners.nwCorner.classList.add('nw')
        this.corners.el.appendChild(this.corners.nwCorner)
        // Create center point of square, set class, append to square
        var center = document.createElement('div')
        center.classList.add('center')
        this.corners.el.appendChild(center)
        // Append cropper square to DOM
        this.el.appendChild(this.corners.el)
        // Set parent element's position as relative
        this.el.style.position = 'relative'
    }

    // Add events to cropper square
    addDragEvents () {
        // Keep old and new coordinates of mouse
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0

        // Find cropper square inside DOM
        var elmnt = document.getElementById(this.corners.el.id)
        // Add event to cropper square
        elmnt.onmousedown = dragMouseDown
        
        // Find corner points of cropper square
        var cornersDom = document.querySelectorAll('.corner')
        // Add events to corner points of cropper square
        for (let corner of cornersDom) {
            corner.onmousedown = dragMouseDown
        }

        // Mouse down event
        function dragMouseDown(e) {
            e = e || window.event
            e.preventDefault()

            // Find where to click
            if (e.target.classList.contains('corner')) {
                // Set as resizing
                window.isResizing = true
                window.resizingDirection = e.target.classList[1]
            } else if (e.target.id == 'corners') {
                // Set as move
                window.isMoving = true
            }
            
            // Set old coordinates of mouse
            pos3 = e.clientX
            pos4 = e.clientY

            // Set when mouse up event
            document.onmouseup = closeDragElement

            // Set when mouse move event
            document.onmousemove = elementDrag
        }
    
        // Mouse move event
        function elementDrag(e) {
            e = e || window.event
            e.preventDefault()

            // Calculate the new cursor coordinates
            pos1 = pos3 - e.clientX
            pos2 = pos4 - e.clientY
            // Set old coordinates of mouse
            pos3 = e.clientX
            pos4 = e.clientY

            // When mouse move for cropper square
            if (window.isMoving && !window.isResizing) {
                // Keep cropper square inside canvas (top & bottom control)
                if (elmnt.offsetTop - pos2 >= 0 && elmnt.offsetTop - pos2 <= (elmnt.previousSibling.offsetHeight - elmnt.offsetHeight)) {
                    // Move cropper square up or down
                    elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
                }
                // Keep cropper square inside canvas (left & right control)
                if (elmnt.offsetLeft - pos1 >= 0 && elmnt.offsetLeft - pos1 <= (elmnt.previousSibling.width - elmnt.offsetWidth)) {
                    // Move cropper square left or right
                    elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
                }
            }
            // When mouse move for corners
            if (window.isResizing && !window.isMoving) {
                // If drag the south east corner
                if (window.resizingDirection == 'se') {
                    // Keep corner inside canvas (top & bottom control)
                    if (elmnt.offsetTop - pos2 <= (elmnt.previousSibling.offsetHeight - elmnt.offsetHeight)) {
                        // Move corner up or down
                        elmnt.style.height = (elmnt.offsetHeight - pos2) + 'px'
                    }
                    // Keep corner inside canvas (left & right control)
                    if (elmnt.offsetLeft - pos1 <= (elmnt.previousSibling.width - elmnt.offsetWidth)) {
                        // Move corner left or right
                        elmnt.style.width = (elmnt.offsetWidth - pos1) + 'px'
                    }
                } // If drag the south west corner
                else if (window.resizingDirection == 'sw') {
                    // Keep corner inside canvas (top & bottom control)
                    if (elmnt.offsetTop - pos2 <= (elmnt.previousSibling.offsetHeight - elmnt.offsetHeight)) {
                        // Move corner up or down
                        elmnt.style.height = (elmnt.offsetHeight - pos2) + 'px'
                    }
                    // Keep corner inside canvas (left & right control)
                    if (elmnt.offsetLeft - pos1 >= 0) {
                        // Move corner left or right
                        elmnt.style.width = (elmnt.offsetWidth + pos1) + 'px'
                        if (elmnt.offsetWidth > 30) {
                            elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'
                        }
                    }
                } // If drag the north west corner
                else if (window.resizingDirection == 'nw') {
                    // Keep corner inside canvas (top & bottom control)
                    if (elmnt.offsetTop - pos2 >= 0) {
                        // Move corner up or down
                        elmnt.style.height = (elmnt.offsetHeight + pos2) + 'px'
                        if (elmnt.offsetHeight > 30) {
                            elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
                        }
                    }
                    // Keep corner inside canvas (left & right control)
                    if (elmnt.offsetLeft - pos1 >= 0) {
                        // Move corner left or right
                        elmnt.style.width = (elmnt.offsetWidth + pos1) + 'px'
                        if (elmnt.offsetWidth > 30) {
                            elmnt.style.left = (elmnt.offsetLeft - pos1) + 'px'}
                        }
                } // If drag the north east corner
                else if (window.resizingDirection == 'ne') {
                    // Keep corner inside canvas (top & bottom control)
                    if (elmnt.offsetTop - pos2 >= 0) {
                        // Move corner up or down
                        elmnt.style.height = (elmnt.offsetHeight + pos2) + 'px'
                        if (elmnt.offsetHeight > 30) {
                            elmnt.style.top = (elmnt.offsetTop - pos2) + 'px'
                        }
                    }
                    // Keep corner inside canvas (left & right control)
                    if (elmnt.offsetLeft - pos1 <= (elmnt.previousSibling.width - elmnt.offsetWidth)) {
                        // Move corner left or right
                        elmnt.style.width = (elmnt.offsetWidth - pos1) + 'px'
                    }
                }
            }
        }

        // Mouse up event
        function closeDragElement() {
            // Stop moving when mouse button is released
            window.isMoving = false
            window.isResizing = false
            window.resizingDirection = ''
            // Set actions as null
            document.onmouseup = null
            document.onmousemove = null
        }
    }

    // Set save environment
    saveTo () {
        // Create second canvas element
        this.prevCanvas = document.createElement('canvas')
        // Set id to second canvas
        this.prevCanvas.id = 'prevCanvas'
        // Set class to second canvas
        this.prevCanvas.classList.add('prevCanvas')
        // Append second canvas to DOM
        this.el.appendChild(this.prevCanvas)

        // Create save button element
        var button = document.createElement('a')
        // Set id to save button
        button.id = 'save'
        // Set class to save button
        button.classList.add('save')
        // Set label to save button
        button.innerText = 'Save'
        // Add click action to save button
        button.addEventListener('click', dowload)
        // Append save button to DOM
        this.el.appendChild(button)
        // Generate file name from date
        var date = new Date()
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDay()
        var hour = date.getHours()
        var minute = date.getMinutes()
        var mm = date.getMilliseconds()
        var fileName = year + '.' + month + '.' + day + ' ' + hour + ':' + minute + ':' + mm + ' | cropper.js by bedcodes.png'
        // Set file name for download
        button.setAttribute('download', fileName);
        

        function dowload () {
            // Calculate coordinates of cropper square            
            var top = (document.getElementById('corners').getBoundingClientRect().top - document.getElementById('canvasArea').getBoundingClientRect().top)
            var left = (document.getElementById('corners').getBoundingClientRect().left - document.getElementById('canvasArea').getBoundingClientRect().left)
            var bottom = (document.getElementById('corners').getBoundingClientRect().top - document.getElementById('canvasArea').getBoundingClientRect().top + document.getElementById('corners').getBoundingClientRect().height)
            var right = (document.getElementById('corners').getBoundingClientRect().left - document.getElementById('canvasArea').getBoundingClientRect().left + document.getElementById('corners').getBoundingClientRect().width)
            // Calculate new width and height of cropper square
            var width = document.getElementById('corners').getBoundingClientRect().width
            var height = document.getElementById('corners').getBoundingClientRect().height
            // Print them to the console
            //console.log("Top: " + top)
            //console.log("Bottom: " + bottom)
            //console.log("Left: " + left)
            //console.log("Right: " + right)
            //console.log("Width: " + width)
            //console.log("Height : " + height)

            // Create new image
            var image = new Image()
            // Set image source
            image.src = window.imageSrc
            // Find second canvas in DOM
            var prevCanvas = document.getElementById('prevCanvas')
            // Set canvas content as 2d
            var ctx = prevCanvas.getContext('2d')
            // Set smooth content = true & hight
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = "high"

            // Calculate proportioned values for crop from original image
            var rLeft = image.width / document.getElementById('cropperCanvas').width * left
            var rTop = image.height / document.getElementById('cropperCanvas').height * top
            var rWidth = image.width / document.getElementById('cropperCanvas').width * width
            var rHeight = image.height / document.getElementById('cropperCanvas').height * height
            // Set sizes of second canvas
            prevCanvas.width = rWidth
            prevCanvas.height = rHeight
            // Print them to the console
            //console.log('Image Width: ' + image.width)
            //console.log('Image Height: ' + image.height)
    
            // Draw cropped image to the second canvas
            ctx.drawImage(image,
                rLeft, rTop,
                rWidth, rHeight,
                0, 0,
                rWidth, rHeight)
            
            // Set the cropped image source to the save button
            this.setAttribute('href', prevCanvas.toDataURL("image/png").replace("image/png", "image/octet-stream"))
        }
    }

    toString () {
        return "this is cropper.js by Bedirhan YILDIRIM"
    }
}