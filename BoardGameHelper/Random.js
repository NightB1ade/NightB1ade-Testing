function getRandomIntArray(min,max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	var array = [];

	for (i = min ; i <= max ; i += 1) {
		array.push(i);
	}

	array = ShuffleArray(array);

	return array
}




function getRandomInteger(min,max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min
}




function ShuffleArray(array) {
	var i = 0
	var j = 0
	var temp = null

	for (
		i = array.length - 1
		; i > 0
		; i -= 1
	) {
		j = Math.floor(Math.random() * (i + 1))
		temp = array[i]
		array[i] = array[j]
		array[j] = temp
	}

	return array
}
