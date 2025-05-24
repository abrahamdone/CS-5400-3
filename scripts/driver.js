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

    //------------------------------------------------------------------
    //
    // Rendering code goes here
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();
        let color = "rgb(255, 255, 255)";
        graphics.drawLine({x: 0, y: 0}, {x: 1, y: 1}, color);
        graphics.drawPixel({x: -0.5, y: -0.5}, color);
        let c = graphics.makeCircle({x: 0, y: 0},1);
        graphics.drawComplexLine(graphics.translateComplexLine(c,{x: -0.5, y: -1}), color);
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
