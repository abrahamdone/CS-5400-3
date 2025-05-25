MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();
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
    // tire1.center = {x: 0.0, y: 0.0};
    let spokes1 = graphics.makePinwheel({x: -0.4, y: 0.5}, 5, 0.06);
    // spokes1.center = {x: 0.0, y: 0.0};
    let tire2 = graphics.makeCircle({x: 0.4, y: 0.5}, 0.08);
    // tire2.center = {x: 0.0, y: 0.0};
    let spokes2 = graphics.makePinwheel({x: 0.4, y: 0.5}, 5, 0.06);
    // spokes2.center = {x: 0.0, y: 0.0};
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

    let gettingBigger = false;
    let maxAngle = 0.4;
    let angle = 0;
    let maxHeight = 0.2;
    let height = 0;
    let maxScale = 1.2;
    let minScale = 0.8;
    let currentScale = 1;
    let scale = 1;

    let upStep = 3;
    let bigStep = 5;
    let step = 0;


    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        if (tireRotation <= 0) {
            tireRotation = 2 * Math.PI;
        }
        tireRotation -= 0.05;

        let randomScale = 0.01 * (Math.floor(Math.random() * 3) - 1);
        currentScale += randomScale;
        currentScale = Math.max(Math.min(currentScale, maxScale), minScale);
        if (currentScale !== currentScale + randomScale) {
            scale = 1 + randomScale;
        }


    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        let carColor = "rgb(50, 168, 82)";
        let tireColor = "rgb(80, 80, 80)";
        let spokeColor = "rgb(255, 255, 255)";
        let windowColor = "rgb(50, 143, 168)";

        graphics.drawComplexLine(graphics.scaleComplexLine(tire1, {x: scale, y: scale}, car.center), tireColor);
        graphics.drawComplexLine(graphics.scaleComplexLine(graphics.rotateComplexLine(spokes1, tireRotation), {x: scale, y: scale}, car.center), spokeColor);
        graphics.drawComplexLine(graphics.scaleComplexLine(tire2, {x: scale, y: scale}, car.center), tireColor);
        graphics.drawComplexLine(graphics.scaleComplexLine(graphics.rotateComplexLine(spokes2, tireRotation), {x: scale, y: scale}, car.center), spokeColor);
        graphics.drawPrimitive(graphics.scalePrimitive(window1, {x: scale, y: scale}), windowColor);
        graphics.drawPrimitive(graphics.scalePrimitive(window2, {x: scale, y: scale}), windowColor);
        graphics.drawComplexLine(graphics.scaleComplexLine(car, {x: scale, y: scale}), carColor);
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
