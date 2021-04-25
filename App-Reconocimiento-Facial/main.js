// Código para agregar la camara portatil a la web
const video = document.getElementById('video');

function startvideo(){
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        navigator.getUserMedia(
            {  video: {} },
            stream  => video.srcObject = stream,
            err => console.log(err)

        )
}

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceExpressionNet.loadFromUri('/models'),
    faceapi.nets.ageGenderNet.loadFromUri('/models')
]).then(startvideo);

//Ahora utilizaremos un metodo que nos permite capturar eventos

video.addEventListener('play', async () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.tinyFaceDetectorOptions().withFaceLandmarks().withFaceExpressions());
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        //Agregamos el cuadrito que estara en nuestro rostro, pero primero eliminaremos el canvas, que este hace que se reptan los  cuadritos en nuestra cara
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        //Dibujamos los puntitos en la cara
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        //Marcamos el estado de animo
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
        console.log(detections);
    }, 100);
})
