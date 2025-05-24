// ------------------------------------------------------------------
// 
// This is the graphics object.  It provides a pseudo pixel rendering
// space for use in demonstrating some basic rendering techniques.
//
// ------------------------------------------------------------------
MySample.graphics = function(pixelsX, pixelsY, showPixels) {
    'use strict';

    const canvas = document.getElementById('canvas-main');
    const context = canvas.getContext('2d', { alpha: false });

    const deltaX = canvas.width / pixelsX;
    const deltaY = canvas.height / pixelsY;

    // Saved precomputed matrices for future calculation
    let hermiteUMs = new Map();
    let cardinalUMs = new Map();
    let bezierUMs = new Map();

    function translatePoint(point, distance) {
        return {x: point.x + distance.x, y: point.y + distance.y};
    }

    function scalePoint(point, center, scale) {

    }

    function rotatePoint(point, center, angle) {

    }

    function drawPrimitive(primitive, color) {
        let previousPoint = primitive.points.pop();
        let nextPoint = previousPoint;
        primitive.points.forEach(segment => {
            drawLine(nextPoint, segment.x, segment.y, color);
            nextPoint = segment;
        })
        drawLine(nextPoint, previousPoint, color);
    }

    function translatePrimitive(primitive, translate) {
        let distance = {x: primitive.center.x - translate.x, y: primitive.center.y - translate.y};
        let newPrimitive = primitive;
        newPrimitive.points = primitive.points.map(point => {
            return translatePoint(point, distance);
        })
        newPrimitive.center = translatePoint(primitive.center, distance);
        return newPrimitive;
    }

    function scalePrimitive(primitive, scale) {

    }

    function rotatePrimitive(primitive, angle) {

    }

    function makeCircle(center, radius) {
        let x = center.x;
        let y = center.y;
        let tangent = 0.5522847 * radius;
        return {
            segments: [
                {
                    curve: api.Curve.Bezier,
                    start: {x: x + radius, y: y},
                    end: {x: x, y: y + radius},
                    controlOne: {x: x + radius, y: y + tangent},
                    controlTwo: {x: x + tangent, y: y + radius},
                    tension: 0,
                    segments: 100
                },
                {
                    curve: api.Curve.Bezier,
                    start: {x: x, y: y + radius},
                    end: {x: x - radius, y: y},
                    controlOne: {x: x - tangent, y: y + radius},
                    controlTwo: {x: x - radius, y: y + tangent},
                    tension: 0,
                    segments: 100
                },
                {
                    curve: api.Curve.Bezier,
                    start: {x: x - radius, y: y},
                    end: {x: x, y: y - radius},
                    controlOne: {x: x - radius, y: y - tangent},
                    controlTwo: {x: x - tangent, y: y - radius},
                    tension: 0,
                    segments: 100
                },
                {
                    curve: api.Curve.Bezier,
                    start: {x: x, y: y - radius},
                    end: {x: x + radius, y: y},
                    controlOne: {x: x + tangent, y: y - radius},
                    controlTwo: {x: x + radius, y: y - tangent},
                    tension: 0,
                    segments: 100
                },
            ],
            center: center,
        }
    }

    function drawComplexLine(line, color) {
        line.segments.forEach(segment => {
            if (segment.segments <= 2 || segment.controlOne === undefined && segment.controlTwo === undefined) {
                drawLine(segment.start, segment.end, color);
            } else {
                drawCurve(segment, color, false, true, false);
            }
        });
        drawPoint(line.center, color);
    }

    function translateComplexLine(line, translate) {
        let distance = {x: line.center.x - translate.x, y: line.center.y - translate.y};
        let newLine = line;
        newLine.segments = line.segments.map(segment => {
            return translateCurve(segment, distance);
        })
        newLine.center = translatePoint(line.center, distance);
        return newLine;
    }

    function scaleComplexLine(line, scale) {

    }

    function rotateComplexLine(line, angle) {

    }

    function translateCurve(curve, distance) {
        let newCurve = curve;
        newCurve.start = translatePoint(newCurve.start, distance);
        newCurve.end = translatePoint(newCurve.end, distance);
        newCurve.controlOne = translatePoint(newCurve.controlOne, distance);
        newCurve.controlTwo = translatePoint(newCurve.controlTwo, distance);
        return newCurve;
    }

    function scaleCurve(curve, center, scale) {

    }

    function rotateCurve(curve, center, angle) {

    }

    function makePinwheel(center, spokes, radius) {
        let arc = 2 * Math.PI / spokes;
        let nextArc = 0;
        let segments = [];
        for (let i = 0; i < spokes; i++) {
            segments.push(
                {
                    start: {x: center.x, y: center.y},
                    end: {x: center.x + radius * Math.cos(nextArc), y: center.y + radius * Math.sin(nextArc)},
                    segments: 1
                }
            )
            nextArc += arc;
        }
        return {segments: segments, center: center};
    }

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();

        //
        // Draw a very light background to show the "pixels" for the framebuffer.
        if (showPixels) {
            context.save();
            context.lineWidth = .1;
            context.strokeStyle = 'rgb(150, 150, 150)';
            context.beginPath();
            for (let y = 0; y <= pixelsY; y++) {
                context.moveTo(1, y * deltaY);
                context.lineTo(canvas.width, y * deltaY);
            }
            for (let x = 0; x <= pixelsX; x++) {
                context.moveTo(x * deltaX, 1);
                context.lineTo(x * deltaX, canvas.width);
            }
            context.stroke();
            context.restore();
        }
    }

    //------------------------------------------------------------------
    //
    // Public function that renders a "pixel" on the framebuffer.
    //
    //------------------------------------------------------------------
    function drawDevicePixel(point, color) {
        let x = Math.trunc(point.x);
        let y = Math.trunc(point.y);

        context.fillStyle = color;
        context.fillRect(x * deltaX, y * deltaY, deltaX, deltaY);
    }

    function drawPixel(point, color) {
        drawDevicePixel(convertPointWorldToDevice(point), color);
    }

    function convertPointWorldToDevice(point) {
        return {
            x: Math.floor(pixelsX / 2 + point.x * pixelsX / 2),
            y: Math.floor(pixelsY / 2 + point.y * pixelsY / 2)
        };
    }

    //------------------------------------------------------------------
    //
    // Helper function used to draw an X centered at a point.
    //
    //------------------------------------------------------------------
    function drawPoint(point, ptColor) {
        let x = Math.trunc(point.x);
        let y = Math.trunc(point.y);

        drawPixel({x: x - 1, y: y - 1}, ptColor);
        drawPixel({x: x + 1, y: y - 1}, ptColor);
        drawPixel({x: x, y: y}, ptColor);
        drawPixel({x: x + 1, y: y + 1}, ptColor);
        drawPixel({x: x - 1, y: y + 1}, ptColor);
    }

    //------------------------------------------------------------------
    //
    // Bresenham line drawing algorithm.
    //
    //------------------------------------------------------------------
    function drawLine(p1, p2, color) {
        let devicePoint1 = convertPointWorldToDevice(p1);
        let devicePoint2 = convertPointWorldToDevice(p2);
        let x1 = devicePoint1.x;
        let y1 = devicePoint1.y;
        let x2 = devicePoint2.x;
        let y2 = devicePoint2.y;
        // vertical line would divide by 0 so special case
        if (x1 === x2) {
            let y = Math.min(y1, y2);
            let d = Math.abs(y2 - y1);
            for (let i = 0; i < d; i++) {
                drawDevicePixel({x: x1, y: y + i}, color);
            }
            return;
        }

        let o = octant(p1, p2);
        // adjust for octant
        // octant 5-7 are mirrored over x-axis so swap start and end points
        if (o >= 4) {
            [x1, x2] = [x2, x1];
            [y1, y2] = [y2, y1];
            o = o - 4;
        }
        switch (o) {
            case 0:
                // mirror over x = y
                [x1, y1, x2, y2] = [y1, x1, y2, x2];
                break;
            case 1:
                // no change
                break;
            case 2:
                // mirror over y-axis
                [y1, y2] = [-y1, -y2];
                break;
            case 3:
                // mirror over x = y and y-axis
                [x1, y1, x2, y2] = [-y1, x1, -y2, x2];
                break;
        }

        let dx = x2 - x1;
        let dy = y2 - y1;
        let pk = 2 * dy - dx;

        // start from origin
        let x = 0;
        let y = 0;

        while (x <= Math.abs(x2 - x1)) {
            // draw pixel adjusted for octant
            // move back from origin (add x1 and y1)
            // also reverse mirror operations for specific octant
            switch (o) {
                case 0:
                    drawDevicePixel({x: y + y1, y: x + x1}, color);
                    break;
                case 1:
                    drawDevicePixel({x: x + x1, y: y + y1}, color);
                    break;
                case 2:
                    drawDevicePixel({x: x + x1, y: -y - y1}, color);
                    break;
                case 3:
                    drawDevicePixel( {x: y + y1, y: -x - x1}, color);
                    break;
            }
            // calculate p_(k + 1)
            if (pk >= 0) {
                y = y + 1;
                pk = pk + 2 * dy - 2 * dx;
            } else {
                pk = pk + 2 * dy;
            }
            x = x + 1;
        }
    }

    //------------------------------------------------------------------
    //
    // Find the quadrant the slope lies in.
    //
    //------------------------------------------------------------------
    function octant(p1, p2) {
        let m = (p2.y - p1.y) / (p2.x - p1.x);
        let o = p2.x > p1.x ? 0 : 4;

        if (m >= 0) {
            if (m >= 1) {
                return o;
            } else {
                return o + 1;
            }
        } else {
            if (m >= -1) {
                return o + 2;
            } else {
                return o + 3;
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Renders an Hermite curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveHermite(controls, segments, color, showPoints, showLine, showControl) {
        if (segments === 0) {
            return;
        }

        // Precompute for optimization
        let UMs = getBlendingFunctions(hermiteUMs, segments);
        if (UMs.size !== segments) {
            let M = math.matrix([
                [ 2, -2,  1,  1],
                [-3,  3, -2, -1],
                [ 0,  0,  1,  0],
                [ 1,  0,  0,  0]
            ]);
            hermiteUMs = calculateBlendingFunctions(M, segments);
            UMs = getBlendingFunctions(hermiteUMs, segments);
        }

        let pp0 = {x: controls.controlOne.x - controls.start.x, y: controls.controlOne.y - controls.start.y};
        let pp1 = {x: controls.end.x - controls.controlTwo.x, y: controls.end.y - controls.controlTwo.y};
        let Px = math.matrix([[controls.start.x], [controls.end.x], [pp0.x], [pp1.x]]);
        let Py = math.matrix([[controls.start.y], [controls.end.y], [pp0.y], [pp1.y]]);

        // Use the precomputed matrices
        let segmentPoints = calculateSegments(UMs, Px, Py, segments);

        segmentPoints.push(controls.end);

        drawSegments(controls, segmentPoints, segments, color, showPoints, showLine, showControl);
    }

    //------------------------------------------------------------------
    //
    // Renders a Cardinal curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveCardinal(controls, segments, color, showPoints, showLine, showControl) {
        if (segments === 0) {
            return;
        }

        // Precompute for optimization
        let UMs = getBlendingFunctionsWithTension(cardinalUMs, segments, controls.tension);
        if (UMs.size !== segments) {
            let s = (1 - controls.tension) / 2;
            let M = math.matrix([
                [   -s, 2 - s,     s - 2,  s],
                [2 * s, s - 3, 3 - 2 * s, -s],
                [   -s,     0,         s,  0],
                [    0,     1,         0,  0]
            ]);
            cardinalUMs = calculateBlendingFunctionsWithTension(M, segments, controls.tension);
            UMs = getBlendingFunctionsWithTension(cardinalUMs, segments, controls.tension);
        }

        let Px = math.matrix([[controls.controlOne.x], [controls.start.x], [controls.end.x], [controls.controlTwo.x]]);
        let Py = math.matrix([[controls.controlOne.y], [controls.start.y], [controls.end.y], [controls.controlTwo.y]]);

        // Use the precomputed matrices
        let segmentPoints = calculateSegments(UMs, Px, Py, segments);

        segmentPoints.push(controls.end);

        drawSegments(controls, segmentPoints, segments, color, showPoints, showLine, showControl);
    }

    //------------------------------------------------------------------
    //
    // Renders a Bezier curve based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawCurveBezier(controls, segments, color, showPoints, showLine, showControl) {
        if (segments === 0) {
            return;
        }

        // Precompute for optimization
        let UMs = getBlendingFunctions(bezierUMs, segments);
        if (UMs.size !== segments) {
            let M = math.matrix([
                [1, -3,  3, -1],
                [0,  3, -6,  3],
                [0,  0,  3, -3],
                [0,  0,  0,  1]
            ]);
            bezierUMs = calculateBlendingFunctions(M, segments);
            UMs = getBlendingFunctions(bezierUMs, segments);
        }

        let Px = math.matrix([[controls.start.x], [controls.controlOne.x], [controls.controlTwo.x], [controls.end.x]]);
        let Py = math.matrix([[controls.start.y], [controls.controlOne.y], [controls.controlTwo.y], [controls.end.y]]);

        // Use the precomputed matrices
        let segmentPoints = calculateSegments(UMs, Px, Py, segments);

        segmentPoints.push(controls.start);

        drawSegments(controls, segmentPoints, segments, color, showPoints, showLine, showControl);
    }

    //------------------------------------------------------------------
    //
    // Precomputes U*M based on the number of segments.
    //
    //------------------------------------------------------------------
    function calculateBlendingFunctions(M, size) {
        let UMs = new Map();
        let u = 0.0;
        let du = 1 / size;
        for (let i = 1; i <= size; i++) {
            let U = math.matrix([[u ** 3, u ** 2, u, 1]]);
            let UM = math.multiply(U, M);
            UMs.set(u, UM);
            u += du;
        }
        return UMs;
    }

    //------------------------------------------------------------------
    //
    // Gets a set of precomputed matrices for the U*M calculation
    // based off the number of segments.
    //
    //------------------------------------------------------------------
    function getBlendingFunctions(precomputeUMs, size) {
        let UMs = new Map();
        let u = 0.0;
        let du = 1 / size;
        for (let i = 1; i <= size; i++) {
            let UM = precomputeUMs.get(u);
            if (UM !== undefined) {
                UMs.set(u, UM);
            } else {
                break;
            }
            u += du;
        }
        return UMs;
    }

    //------------------------------------------------------------------
    //
    // Precomputes U*M based on the number of segments
    // using the tension value as well.
    //
    //------------------------------------------------------------------
    function calculateBlendingFunctionsWithTension(M, size, tension) {
        let s = (1 - tension) / 2;
        let UMs = new Map();
        let u = 0.0;
        let du = 1 / size;
        for (let i = 1; i <= size; i++) {
            let U = math.matrix([[u ** 3, u ** 2, u, 1]]);
            let UM = math.multiply(U, M);
            UMs.set(`{s: ${s}, u: ${u}}`, UM);
            u += du;
        }
        return UMs;
    }

    //------------------------------------------------------------------
    //
    // Gets a set of precomputed matrices for the U*M calculation
    // based off the number of segments and the tension value.
    //
    //------------------------------------------------------------------
    function getBlendingFunctionsWithTension(precomputedUMs, size, tension) {
        let s = (1 - tension) / 2;
        let UMs = new Map();
        let u = 0.0;
        let du = 1 / size;
        for (let i = 1; i <= size; i++) {
            let UM = precomputedUMs.get(`{s: ${s}, u: ${u}}`);
            if (UM !== undefined) {
                UMs.set(u, UM);
            } else {
                break;
            }
            u += du;
        }
        return UMs;
    }

    //------------------------------------------------------------------
    //
    // Calculates a set of line segments based on the matrices
    // and number of segments.
    //
    //------------------------------------------------------------------
    function calculateSegments(UMs, Px, Py, segments) {
        let u = 0.0;
        let du = 1 / segments;
        let segmentPoints = [];

        for (let i = 0; i < segments; i++) {
            let UM = UMs.get(u);
            let x = math.multiply(UM, Px);
            let y = math.multiply(UM, Py);

            segmentPoints.push({x: x.get([0,0]), y: y.get([0,0])});
            u += du;
        }

        return segmentPoints;
    }

    //------------------------------------------------------------------
    //
    // Renders a set of line segments based on the input parameters.
    //
    //------------------------------------------------------------------
    function drawSegments(controls, segmentPoints, segments, color, showPoints, showLine, showControl) {
        if (showControl) {
            let controlColor = 'rgb(180, 180, 180)';
            drawPoint(controls.controlOne, controlColor);
            drawPoint(controls.controlTwo, controlColor);
        }
        if (showPoints) {
            for (let i = 0; i < segmentPoints.length; i++) {
                drawPoint(segmentPoints[i], 'rgb(255, 255, 255)');
            }
        }
        if (showLine) {
            for (let i = 0; i < segments; i++) {
                drawLine(segmentPoints[i], segmentPoints[i + 1], color);
            }
        }
    }

    //------------------------------------------------------------------
    //
    // Entry point for rendering the different types of curves.
    // I know a different (functional) JavaScript pattern could be used
    // here.  My goal was to keep it looking Java or C++'ish to keep it familiar
    // to those not experts in JavaScript.
    //
    //------------------------------------------------------------------
    function drawCurve(controls, color, showPoints, showLine, showControl) {
        switch (controls.curve) {
            case api.Curve.Hermite:
                drawCurveHermite(controls, controls.segments, color, showPoints, showLine, showControl);
                break;
            case api.Curve.Cardinal:
                drawCurveCardinal(controls, controls.segments, color, showPoints, showLine, showControl);
                break;
            case api.Curve.Bezier:
                drawCurveBezier(controls, controls.segments, color, showPoints, showLine, showControl);
                break;
        }
    }

    //
    // This is what we'll export as the rendering API
    const api = {
        clear: clear,
        drawPixel: drawPixel,
        drawLine: drawLine,
        drawCurve: drawCurve,
        makeCircle: makeCircle,
        makePinwheel: makePinwheel,
        drawComplexLine: drawComplexLine,
        drawPrimitive: drawPrimitive,
        translatePrimitive: translatePrimitive,
        scalePrimitive: scalePrimitive,
        rotatePrimitive: rotatePrimitive,
        translateCurve: translateCurve,
        scaleCurve: scaleCurve,
        rotateCurve: rotateCurve,
        translateComplexLine: translateComplexLine,
        scaleComplexLine: scaleComplexLine,
        rotateComplexLine: rotateComplexLine,
    };

    Object.defineProperty(api, 'sizeX', {
        value: pixelsX,
        writable: false
    });
    Object.defineProperty(api, 'sizeY', {
        value: pixelsY,
        writable: false
    });
    Object.defineProperty(api, 'Curve', {
        value: Object.freeze({
            Hermite: 0,
            Cardinal: 1,
            Bezier: 2
        }),
        writable: false
    });

    return api;
}(500, 500, true);
