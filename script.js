document.addEventListener('DOMContentLoaded', function() {
    let scanCount = 0;
    const scanCountDisplay = document.getElementById('scan-count');
    const voucherDisplay = document.getElementById('voucher');

    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner-video'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment" // Use back camera if available
            }
        },
        decoder: {
            readers: ["qrcode_reader"]
        },
        locator: {
            halfSample: true,
            patchSize: "medium"
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
    });

    Quagga.onDetected(function(result) {
        const code = result.codeResult.code;
        console.log("Detected QR code:", code);

        scanCount++;
        scanCountDisplay.textContent = `Scans: ${scanCount}`;

        if (scanCount >= 6) {
            voucherDisplay.style.display = 'block';
            Quagga.stop();
        }
    });

    Quagga.onProcessed(function(result) {
        var drawingCtx = Quagga.canvas.ctx.overlay;
        var drawingCanvas = Quagga.canvas.dom.overlay;

        if (result) {
            if (result.boxes) {
                drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
                result.boxes.filter(function (box) {
                    return box !== result.box;
                }).forEach(function (box) {
                    Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "blue", lineWidth: 2 });
                });
            }

            if (result.box) {
                Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
            }

            if (result.codeResult && result.codeResult.code) {
                Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
            }
        }
    });
});
