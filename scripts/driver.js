
MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();
    let start = {x: -0.8, y: 0.0};
    let end = {x: 0.8, y: 0.0};
    let controlOne = {x: 0.2, y: -0.5};
    let controlTwo = {x: -0.2, y: 0.5};
    let segments = 100;
    let nextHue = 0;
    let colors = [];
    let curve = graphics.Curve.Hermite;
    let display = 0.0;
    let displayMultiplier = 5000.0;

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        if (display <= 0) {
            colors.length = 0;
            for (let i = 0; i < segments; i += 1) {
                colors.push(`rgb(255, 255, 255)`);
            }
        }

        // Display each curve for a period of time
        if (display < displayMultiplier) {
            curve = graphics.Curve.Hermite;
            display += elapsedTime;
        } else if (display < 2 * displayMultiplier) {
            curve = graphics.Curve.Cardinal;
            display += elapsedTime;
        } else if (display < 3 * displayMultiplier) {
            curve = graphics.Curve.Bezier;
            display += elapsedTime;
        } else if (display < 4 * displayMultiplier) {
            // Animate Hue
            nextHue += 1;
            if (nextHue > 360) {
                nextHue = 0;
            }
            colors.shift();
            colors.push(`hsl(${nextHue}, 80%, 50%)`)

            // move the control point by a small amount in a random direction
            let randomOneX = (Math.floor(Math.random() * 3) - 1) * 0.005;
            let randomOneY = (Math.floor(Math.random() * 3) - 1) * 0.005;
            let randomTwoX = (Math.floor(Math.random() * 3) - 1) * 0.005;
            let randomTwoY = (Math.floor(Math.random() * 3) - 1) * 0.005;
            controlOne = {
                x: Math.max(-1, Math.min(1, controlOne.x + randomOneX)),
                y: Math.max(-1, Math.min(1, controlOne.y + randomOneY))
            };
            controlTwo = {
                x: Math.max(-1, Math.min(1, controlTwo.x + randomTwoX)),
                y: Math.max(-1, Math.min(1, controlTwo.y + randomTwoY))
            };
        }
    }

    function convertWorldToDevice(point) {
        return {
            x: math.floor(graphics.sizeX / 2 + point.x * graphics.sizeX / 2),
            y: math.floor(graphics.sizeY / 2 + point.y * graphics.sizeY / 2)
        };
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawCurve(
            curve,
            {
                start: convertWorldToDevice(start),
                end: convertWorldToDevice(end),
                controlOne: convertWorldToDevice(controlOne),
                controlTwo: convertWorldToDevice(controlTwo),
                tension: 0
            },
            colors,
            false,
            true,
            true
        );
    }

    //------------------------------------------------------------------
    //
    // This is the animation loop.
    //
    //------------------------------------------------------------------
    function animationLoop(time) {

        const elapsedTime = time - previousTime;
        previousTime = time;
        update(elapsedTime);
        render();

        requestAnimationFrame(animationLoop);
    }

    console.log('initializing...');
    requestAnimationFrame(animationLoop);

}(MySample.graphics));
