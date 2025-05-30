// noinspection JSVoidFunctionReturnValueUsed

MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();
    let carColor = "rgb(50, 168, 82)";
    let tireColor = "rgb(80, 80, 80)";
    let spokeColor = "rgb(255, 255, 255)";
    let windowColor = "rgb(50, 143, 168)";
    let bumperColor = "rgb(70, 70, 70)";
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
    let bumper1 = {
        points: [
            {x: 0.6, y: 0.5},
            {x: 0.65, y: 0.5},
            {x: 0.65, y: 0.4},
            {x: 0.6, y: 0.4}
        ], center: {x: 0, y: 0}
    }
    let bumper2 = {
        points: [
            {x: -0.6, y: 0.5},
            {x: -0.65, y: 0.5},
            {x: -0.65, y: 0.45},
            {x: -0.6, y: 0.45}
        ], center: {x: 0, y: 0}
    }

    let scaleStep = 0;
    let scaleDirection = 1;
    let scaleFactor = 1;

    let speedStep = 0;
    let speed = 1;
    let speedTranslate = {x: 0, y: 0};
    let tireRotation = 0.0;


    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        if (speedStep === 0) {
            let random = (Math.floor(Math.random() * 3) - 1);
            if (speed !== random) {
                speed = random;
            }
            speedStep = 1;
        } else if (speedStep === 700) {
            speedStep = 0;
            speed = 0;
            speedTranslate = {x: 0, y: 0};
        } else {
            speedStep += 1;
            if (speedStep < 100) {
                speedTranslate.x -= speed * 0.001;
            } else if (speedStep > 600) {
                speedTranslate.x += speed * 0.001;
            }
        }

        if (tireRotation <= 0) {
            tireRotation = 2 * Math.PI;
        }
        tireRotation -= 0.05 + speed * 0.02;

        if (scaleStep === 0) {
            let random = (Math.floor(Math.random() * 3) - 1);
            if (scaleDirection !== random) {
                scaleDirection = random;
            }
            scaleStep = 1;
        } else if (scaleStep === 500) {
            scaleStep = 0;
            scaleFactor = 1;
        } else {
            scaleStep += 1;
            if (scaleStep < 30) {
                scaleFactor += scaleDirection * 0.001;
            } else if (scaleStep > 470) {
                scaleFactor -= scaleDirection * 0.001;
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

        let scale = {x: scaleFactor, y: scaleFactor};

        let transformedCar = graphics.translateComplexLine(car, speedTranslate);
        transformedCar = graphics.scaleComplexLine(transformedCar, scale);
        let transformedTire1 = graphics.translateComplexLine(tire1, speedTranslate);
        transformedTire1 = graphics.scaleComplexLine(transformedTire1, scale, transformedCar.center);
        let transformedTire2 = graphics.translateComplexLine(tire2, speedTranslate);
        transformedTire2 = graphics.scaleComplexLine(transformedTire2, scale, transformedCar.center);
        let transformedSpoke1 = graphics.translateComplexLine(spokes1, speedTranslate);
        transformedSpoke1 = graphics.rotateComplexLine(transformedSpoke1, tireRotation);
        transformedSpoke1 = graphics.scaleComplexLine(transformedSpoke1, scale, transformedCar.center);
        let transformedSpoke2 = graphics.translateComplexLine(spokes2, speedTranslate);
        transformedSpoke2 = graphics.rotateComplexLine(transformedSpoke2, tireRotation);
        transformedSpoke2 = graphics.scaleComplexLine(transformedSpoke2, scale, transformedCar.center);
        let transformedWindow1 = graphics.translatePrimitive(window1, speedTranslate);
        transformedWindow1 = graphics.scalePrimitive(transformedWindow1, scale, transformedCar.center);
        let transformedWindow2 = graphics.translatePrimitive(window2, speedTranslate);
        transformedWindow2 = graphics.scalePrimitive(transformedWindow2, scale, transformedCar.center);
        let transformedBumper1 = graphics.translatePrimitive(bumper1, speedTranslate);
        transformedBumper1 = graphics.scalePrimitive(transformedBumper1, scale, transformedCar.center);
        let transformedBumper2 = graphics.translatePrimitive(bumper2, speedTranslate);
        transformedBumper2 = graphics.scalePrimitive(transformedBumper2, scale, transformedCar.center);

        graphics.drawPrimitive(transformedBumper2, bumperColor);
        graphics.drawPrimitive(transformedBumper1, bumperColor);
        graphics.drawComplexLine(transformedCar, carColor);
        graphics.drawComplexLine(transformedTire1, tireColor);
        graphics.drawComplexLine(transformedTire2, tireColor);
        graphics.drawComplexLine(transformedSpoke1, spokeColor);
        graphics.drawComplexLine(transformedSpoke2, spokeColor);
        graphics.drawPrimitive(transformedWindow1, windowColor);
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
