let model;
$( document ).ready(async function () {
	$('.loading-text').show();
    $('.result').hide();
    $('#custom-btn').hide();
    console.log( "Loading model..." );
    model = await tf.loadLayersModel('model/model.json');
    console.log( "Model loaded." );
	$('.result').show();
    $('.loading-text').hide();
    $('#custom-btn').show();

    $('')
});

$(".image-selector").change(function () {
	let reader = new FileReader();
	reader.onload = function () {
		let dataURL = reader.result;
		$("#chosen-image").attr("src", dataURL);
		// $("#prediction-list").empty();
	}
	
	let file = $(".image-selector").prop('files')[0];

	reader.readAsDataURL(file);
});

$("#predict-button").click(async function () {
    //Start the prediction process
    let image = $('#chosen-image').get(0);
	// Pre-process the image
	let tensor = tf.browser.fromPixels(image)
		.resizeNearestNeighbor([150,150]) // change the image size here
		.toFloat()
		.div(tf.scalar(255.0))
		.expandDims();
    

	let predictions = await model.predict(tensor).data();

    console.log(predictions);
    let result;
    if(predictions[0] > 0.5){
        result = "Negative";
    }else{
        result = "Positive";
    }

    $('.result-text').text(result);
	// let top5 = Array.from(predictions)
	// 	.map(function (p, i) { // this is Array.map
	// 		return {
	// 			probability: p,
	// 			className: TARGET_CLASSES[i] // we are selecting the value from the obj
	// 		};
	// 	}).sort(function (a, b) {
	// 		return b.probability - a.probability;
	// 	}).slice(0, 2);

	// $("#prediction-list").empty();
	// console.log(top5[0].className);
	// top5.forEach(function (p) {
	// 	$("#prediction-list").append(`<li>${p.className}: ${p.probability.toFixed(6)}</li>`);
	// 	});
});