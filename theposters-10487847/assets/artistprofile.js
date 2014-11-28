$(function () {
	var originalHeight = $('.artist-header').height();
	
	function resizeArtistHeaderHeight() {
		// Resize .artist-header based on window width
		var windowWidth = $(window).width();
		var heightOffset = 0;
		var newHeight = originalHeight + heightOffset;
		
		// Trigger at min threshold
		if (windowWidth > 1250) {
			heightOffset = windowWidth - 1250;
		}
		
		// Enforce max height increase
		if (heightOffset > 200) {
			heightOffset = 200;
		}
		
		// Apply offset if it has changed
		if (heightOffset > 0) {
			newHeight = originalHeight + heightOffset;
			
			$('.artist-header').css({
				'height': newHeight
			});
		}
	}
	
	// Run once on load
	resizeArtistHeaderHeight();
	
	// Run on window resize
	$(window).resize(resizeArtistHeaderHeight);
});
