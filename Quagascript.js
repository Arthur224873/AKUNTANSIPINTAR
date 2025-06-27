Quagga.init({
    inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#interactive')
    },
    decoder: {
        readers: ["ean_reader", "code_128_reader"],
        // Anda menambahkan bagian 'locator' di sini
        locator: {
            halfSample: false,
            patchSize: "large"
        }
    }
}, function(err) {
    if (err) {
        console.error(err); // Lebih baik menggunakan console.error untuk kesalahan
        return;
    }
    console.log("Initialized. Ready to start");
    Quagga.start();
});

Quagga.onDetected(function(result) {
    console.log("Barcode detected and read: " + result.codeResult.code);
    // Anda bisa menambahkan logika lain di sini, misalnya menampilkan hasil ke UI
});
