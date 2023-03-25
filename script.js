let tree = {};
const headerHeight = 65;

function setup() {
    createCanvas(windowWidth, windowHeight - headerHeight);

    tree = {
        x: 0,
        y: 0,
        width: windowWidth,
        height: windowHeight - headerHeight,
        color: 220,
        children: [],
    }
}

function draw() {
    // draw the root rectangle
    fill(tree.color);
    rect(tree.x, tree.y, tree.width, tree.height);

    // draw all child rectangles recursively
    drawRectangles(tree.children);

    cursor(ARROW);
    if (keyIsPressed && (key === 'Meta' || key === 'Control')) {
        cursor('pointer'); // set cursor type to 'pointer'
    } else if (keyIsPressed && keyCode === SHIFT) {
        stroke(30);
        line(0, mouseY, width, mouseY);
        strokeWeight(1);
        stroke(10, 10, 10, 25);
        line(mouseX, 0, mouseX, height);
    } else {
        stroke(30);
        line(mouseX, 0, mouseX, height);
        strokeWeight(1);
        stroke(10, 10, 10, 25);
        line(0, mouseY, width, mouseY);
    }
}

function drawRectangles(children) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let fillColor;

        if (child.newColor) {
            const curColor = typeof child.color === 'number' ? color(child.color) : child.color;
            fillColor = lerpColor(curColor, child.newColor, 0.1);
            child.color = fillColor;
        } else {
            fillColor = child.color;
        }

        fill(fillColor);


        rect(child.x, child.y, child.width, child.height);
        if (child.children) {
            drawRectangles(child.children);
        }
    }
}

function mouseClicked() {
    if (keyIsPressed && key === 'Meta') {
        let node = findRect(tree);
        if (node) { // check if meta key is pressed
            node.newColor = color(random(255), random(255), random(255)); // change color to random one
        }
    } else {
        let splitNode = findRect(tree);
        splitRect(splitNode);
    }
    redraw();
}

function findRect(tree) {
    if (tree.children) {
        for (let child of tree.children) {
            let rect = findRect(child);
            if (rect) return rect;
        }
    }
    if (mouseX > tree.x && mouseX < tree.x + tree.width && mouseY > tree.y && mouseY < tree.y + tree.height) {
        return tree;
    }
    return null;
}

function splitRect(rect) {
    if (mouseX > rect.x && mouseX < rect.x + rect.width && mouseY > rect.y && mouseY < rect.y + rect.height) {
        let child1, child2;
        if (keyIsPressed && keyCode === SHIFT) {
            // split horizontally if shift key is pressed
            let splitY = mouseY - rect.y;
            child1 = {
                x: rect.x,
                y: rect.y,
                width: rect.width,
                height: splitY,
            };
            child2 = {
                x: rect.x,
                y: rect.y + splitY,
                width: rect.width,
                height: rect.height - splitY,
            };
        } else {
            // split vertically if shift key is not pressed
            let splitX = mouseX - rect.x;
            child1 = {
                x: rect.x,
                y: rect.y,
                width: splitX,
                height: rect.height,
            };
            child2 = {
                x: rect.x + splitX,
                y: rect.y,
                width: rect.width - splitX,
                height: rect.height,
            };
        }

        // Determine which child is smaller by area
        let area1 = child1.width * child1.height;
        let area2 = child2.width * child2.height;
        let smallerChild, largerChild;
        if (area1 < area2) {
            smallerChild = child1;
            largerChild = child2;
        } else {
            smallerChild = child2;
            largerChild = child1;
        }

        // Set the colors of the child rectangles
        largerChild.color = rect.color;
        smallerChild.newColor = newColor();
        smallerChild.color = rect.color;

        // Replace the original rectangle with the two new child rectangles
        let index = tree.children.indexOf(rect);
        if (index > -1) {
            tree.children.splice(index, 1, smallerChild, largerChild);
        } else {
            rect.children = [smallerChild, largerChild];
        }
    }
}

function newColor() {
    return color(random(255), random(255), random(255));
}
