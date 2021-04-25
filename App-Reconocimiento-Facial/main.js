// Código para agregar la camara portatil a la web
const video = document.getElementById("video");

function starVideo(){
    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

        navigator.getUserMedia(
            {  video: {} },
            stream  => video.scrObject = stream ,
            err => console.log(err)




        )


}

starVideo();

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/src/tinyFaceDetector'),
    faceapi.nets.faceLandmarkNet.loadFromUri('/src/faceLandmarkNet'),
    faceapi.nets.faceRecognitionNet.loadFromUri('/src/faceRecognitionNet'),
    faceapi.nets.faceExpressionNet.loadFromUri('/src/faceExpressionNet'),
    faceapi.nets.ageGenderNet.loadFromUri('/src/ageGenderNet')

]).then(starVideo)

//Ahora utilizaremos un metodo que nos permite capturar eventos

video.addEventListener('play', () => {
    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);
    const displaySize = { width: video.width, height: video.height};
    faceapi.matchDimensions(canvas, displaySize);
    setInterval(async() => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.tinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        //Agregamos el cuadrito que estara en nuestro rostro, pero primero eliminaremos el canvas, que este hace que se reptan los  cuadritos en nuestra cara
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        //Dibujamos los puntitos en la cara
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        //Marcamos el estado de animo
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    }, 100);
})
