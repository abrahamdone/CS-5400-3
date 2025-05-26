MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();
    let carColor = "rgb(50, 168, 82)";
    let tireColor = "rgb(80, 80, 80)";
    let spokeColor = "rgb(255, 255, 255)";
    let windowColor = "rgb(50, 143, 168)";
    let car = {
        segments: [
            {
                start: {x: 0.6, y: 0.5},
                end: {x: 0.5, y: 0.5},
                segments: 1
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: 0.5, y: 0.5},
                end: {x: 0.4, y: 0.4},
                controlOne: {x: 0.5, y: 0.5 - 0.05522847},
                controlTwo: {x: 0.4 + 0.05522847, y: 0.4},
                segments: 10
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: 0.4, y: 0.4},
                end: {x: 0.3, y: 0.5},
                controlOne: {x: 0.4 - 0.05522847, y: 0.4},
                controlTwo: {x: 0.3, y: 0.5 - 0.05522847},
                segments: 10
            },
            {
                start: {x: 0.3, y: 0.5},
                end: {x: -0.3, y: 0.5},
                segments: 1
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: -0.3, y: 0.5},
                end: {x: -0.4, y: 0.4},
                controlOne: {x: -0.3, y: 0.5 - 0.05522847},
                controlTwo: {x: -0.4 + 0.05522847, y: 0.4},
                segments: 10
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: -0.4, y: 0.4},
                end: {x: -0.5, y: 0.5},
                controlOne: {x: -0.4 - 0.1 * 0.5522847, y: 0.4},
                controlTwo: {x: -0.5, y: 0.5 - 0.1 * 0.5522847},
                segments: 10
            },
            {
                start: {x: -0.5, y: 0.5},
                end: {x: -0.6, y: 0.5},
                segments: 1
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: -0.6, y: 0.5},
                end: {x: -0.2, y: 0.25},
                controlOne: {x: -0.6, y: 0.30},
                controlTwo: {x: -0.4, y: 0.25},
                segments: 10
            },
            {
                start: {x: -0.2, y: 0.25},
                end: {x: 0.0, y: 0.05},
                segments: 1
            },
            {
                curve: graphics.Curve.Bezier,
                start: {x: 0.0, y: 0.05},
                end: {x: 0.6, y: 0.5},
                controlOne: {x: 0.7, y: 0.0},
                controlTwo: {x: 0.6, y: 0.3},
                segments: 10
            }
        ], center: {x: 0, y: 0}
    }
    let tire1 = graphics.makeCircle({x: -0.4, y: 0.5}, 0.08);
    let spokes1 = graphics.makePinwheel({x: -0.4, y: 0.5}, 5, 0.06);
    let tire2 = graphics.makeCircle({x: 0.4, y: 0.5}, 0.08);
    let spokes2 = graphics.makePinwheel({x: 0.4, y: 0.5}, 5, 0.06);
    let window1 = {
        points: [
            {x: -0.15, y: 0.25},
            {x: 0.0, y: 0.25},
            {x: 0.0, y: 0.08}
        ], center: {x: 0, y: 0}
    }
    let window2 = {
        points: [
            {x: 0.03, y: 0.25},
            {x: 0.03, y: 0.08},
            {x: 0.23, y: 0.08},
            {x: 0.23, y: 0.25}
        ], center: {x: 0, y: 0}
    }
    let tireRotation = 0.0;

    let scale = 1;
    let scaleDirection = 1;

    let speedStep = 0;
    let scaleStep = 0;
    let speed = 1;

    let speedTranslate = {x: 0, y: 0};


    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        if (speedStep === 0) {
            speed = (Math.floor(Math.random() * 3) - 1);
            speedStep = 1;
        } else if (speedStep === 500) {
            speedStep = 0;
            speedTranslate = {x: 0, y: 0};
        } else {
            speedStep += 1;
            if (speedStep < 100) {
                switch (speed) {
                    case -1:
                        speedTranslate.x += 0.001;
                        break;
                    case 1:
                        speedTranslate.x -= 0.001;
                        break;
                }
            } else if (speedStep > 400) {
                switch (speed) {
                    case -1:
                        speedTranslate.x -= 0.001;
                        break;
                    case 1:
                        speedTranslate.x += 0.001;
                        break;
                }
            }
        }

        if (tireRotation <= 0) {
            tireRotation = 2 * Math.PI;
        }
        switch (speed) {
            case -1:
                tireRotation -= 0.03;
                break;
            case 0:
                tireRotation -= 0.05;
                break;
            case 1:
                tireRotation -= 0.07;
                break;
        }

        if (scaleStep === 0) {
            scaleStep = 1;
            scaleDirection = (Math.floor(Math.random() * 3) - 1);
        } else if (scaleStep === 200) {
            scaleStep = 0;
            scale = 1;
        } else {
            scaleStep += 1;
            if (scaleStep < 20) {
                switch (scaleDirection) {
                    case -1:
                        scale -= 0.001;
                        break;
                    case 1:
                        scale += 0.001;
                        break;
                }
            } else if (scaleStep > 180) {
                switch (scaleDirection) {
                    case -1:
                        scale += 0.001;
                        break;
                    case 1:
                        scale -= 0.001;
                        break;
                }
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        let transformedCar = car;
        transformedCar = graphics.translateComplexLine(transformedCar, speedTranslate);
        transformedCar = graphics.scaleComplexLine(transformedCar, {x: scale, y: scale});
        graphics.drawComplexLine(transformedCar, carColor);
        let transformedTire1 = tire1;
        transformedTire1 = graphics.translateComplexLine(transformedTire1, speedTranslate);
        transformedTire1 = graphics.scaleComplexLine(transformedTire1, {x: scale, y: scale}, transformedCar.center);
        graphics.drawComplexLine(transformedTire1, tireColor);
        let transformedTire2 = tire2;
        transformedTire2 = graphics.translateComplexLine(transformedTire2, speedTranslate);
        transformedTire2 = graphics.scaleComplexLine(transformedTire2, {x: scale, y: scale}, transformedCar.center);
        graphics.drawComplexLine(transformedTire2, tireColor);
        let transformedSpoke1 = spokes1;
        transformedSpoke1 = graphics.translateComplexLine(transformedSpoke1, speedTranslate);
        transformedSpoke1 = graphics.rotateComplexLine(transformedSpoke1, tireRotation);
        transformedSpoke1 = graphics.scaleComplexLine(transformedSpoke1, {x: scale, y: scale}, transformedCar.center);
        graphics.drawComplexLine(transformedSpoke1, spokeColor);
        let transformedSpoke2 = spokes2;
        transformedSpoke2 = graphics.translateComplexLine(transformedSpoke2, speedTranslate);
        transformedSpoke2 = graphics.rotateComplexLine(transformedSpoke2, tireRotation);
        transformedSpoke2 = graphics.scaleComplexLine(transformedSpoke2, {x: scale, y: scale}, transformedCar.center);
        graphics.drawComplexLine(transformedSpoke2, spokeColor);
        let transformedWindow1 = window1;
        transformedWindow1 = graphics.translatePrimitive(transformedWindow1, speedTranslate);
        transformedWindow1 = graphics.scalePrimitive(transformedWindow1, {x: scale, y: scale}, transformedCar.center);
        graphics.drawPrimitive(transformedWindow1, windowColor);
        let transformedWindow2 = window2;
        transformedWindow2 = graphics.translatePrimitive(transformedWindow2, speedTranslate);
        transformedWindow2 = graphics.scalePrimitive(transformedWindow2, {x: scale, y: scale}, transformedCar.center);
        graphics.drawPrimitive(transformedWindow2, windowColor);
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
