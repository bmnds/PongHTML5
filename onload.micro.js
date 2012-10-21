if (!window.addOnLoad)
	window.addOnLoad = function(f) {
		var onload = window.onload
		if (typeof onload === 'function') 
			window.onload = function() { onload.call(); f() }
		else
			window.onload = f
	}