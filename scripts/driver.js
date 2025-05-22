MySample.main = (function(graphics) {
    'use strict';

    let previousTime = performance.now();

    //------------------------------------------------------------------
    //
    // Scene updates go here.
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {

    }

    function convertPointWorldToDevice(point) {
        return {
            x: math.floor(graphics.sizeX / 2 + point.x * graphics.sizeX / 2),
            y: math.floor(graphics.sizeY / 2 + point.y * graphics.sizeY / 2)
        };
    }

    function convertDistanceWorldToDevice(length) {
        return math.min(graphics.sizeX, graphics.sizeY) / 2 * length;
    }

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        graphics.drawComplexLine(
            {
                segments: [
                    {
                        curve: graphics.Curve.Bezier,
                        start: convertPointWorldToDevice({x: 0, y: 0}),
                        end: convertPointWorldToDevice({x: 0.5, y: 0.5}),
                        controlOne: undefined,
                        controlTwo: undefined,
                        tension: 0,
                        segments: 100
                    },
                    {
                        curve: graphics.Curve.Bezier,
                        start: convertPointWorldToDevice({x: 0.5, y: 0.5}),
                        end: convertPointWorldToDevice({x: 1, y: 1}),
                        controlOne: convertPointWorldToDevice({x: -0.75, y: 0.5}),
                        controlTwo: convertPointWorldToDevice({x: -0.75, y: 0.5}),
                        tension: 0,
                        segments: 100
                    }
                ],
                center: {x: 0, y: 0}
            },
            "rgb(255,255,255)"
            );
    // graphics.drawPrimitive(
    //     {
    //         points: [
    //             convertPointWorldToDevice({x: 0.5, y: 0.5}),
    //             convertPointWorldToDevice({x: -0.5, y: 0.5}),
    //             convertPointWorldToDevice({x: -0.5, y: -0.5}),
    //             convertPointWorldToDevice({x: 0.5, y: -0.5}),
    //         ],
    //         center: convertPointWorldToDevice({x: 0, y: 0})
    //     }, "rgb(255,255,255)"
    // );
        let p = graphics.makePinwheel(
            convertPointWorldToDevice({x: 0, y: 0}),
        3,
            convertDistanceWorldToDevice(0.5),
        );
        graphics.drawComplexLine(p, "rgb(255,255,255)");
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
