$(function () {
	// CONSTANTS
	// var API = 'data.json';
	//API = 'data2.json';
	// API = 'http://thepostersapi.herokuapp.com/theposters/socialmedia/%23derekjeter,%23olgarichwedding?callback=testcallback';
	// var API = '//white-harbor-rails-77074.use1.nitrousbox.com:8080/theposters/socialmedia/%23nyc,%23sanfancisco?callback=?';
	var API = '//theposters-socialgridapi.herokuapp.com/theposters/socialmedia/%23graffiti,%23panda?callback=?'
	
	// Grab container
	var $el = $('.socialGrid_container');
	
	// Grab data
	var data = $.getJSON(API);

	
	// Process data
	data.done(buildGrid);
	
	// Grid function
	function buildGrid(data) {
		// Business Rules:
		// - Alternate 2x stacked 1x1s and 2x2s
		// - Initialize to 1 (large size)
		var lastGridSize = 1; // (i.e., 1 item per grid)
		var sequentials = 0;
		var $last1x2Grid;
		var globalIndex;
		
		// Bind events
		$el.on('click', '.grid_container', function (e) {
			window.location = $(this).data('gen-url');
		});
		
		/**
		 * Returns which element to append the grid content to (i.e., a new 
		 * element or the previous one (in the case of 1x2s))
		 * @param  {String} size 'large' or 'small'
		 * @return {Object} DOM element (div)
		 */
		function createGridContainer(size) {
			// Create a fresh new grid
			var $newGrid = $(document.createElement('div'));
			
			$newGrid.attr('class', 'grid-' + size);
			
			// 2x1 grid
			if (size === 2) {
				if (typeof $last1x2Grid === 'undefined') {
					// Element hasn't been set up yet
					$last1x2Grid = $newGrid;
					
				} else {
					if ($last1x2Grid.find('.grid_container').length < 2) {
						// Previous grid $element isn't full yet or hasn't been reset
						// Return it so the next grid can be added
						$newGrid = $last1x2Grid;
						
					} else {
						// Stick with the new grid we created above
						// Previous grid element is full, reset it
						$last1x2Grid = $newGrid;
					}
				}
			} else {
				// Reset container if it's a new container
				// Prevent reset if previous 1x2 isn't full yet
				if (typeof $last1x2Grid !== 'undefined' && $last1x2Grid.find('.grid_container').length < 2) {
					$newGrid = $last1x2Grid;
				} else {
					$last1x2Grid = undefined;
				}
			}
			
			return $newGrid;
		}
		
		var lastSize;
		var sequence = 0;
		var container = 0;
		
		/**
		 * Determines which size the next grid column will be: 1x2 (small) or 2x2 (large)
		 * @return {String} 'large' or 'small' 
		 */
		function getGridSize() {
			var sizes = ['large', 'small'];
			var result = 0;
			var randomWholeNumber = Math.floor(Math.random() * 2);
			
			// Prevent two adjacent 1x1s
			if (lastSize === 0 && randomWholeNumber === 0) {
				randomWholeNumber = 1;
			}
			
			// Prevent too many 2x1s in sequence
			// - check if we're adding another 2x1
			if (lastSize === 1) {
				// if this is also a 2x1
				if (randomWholeNumber === 1) {
					sequence++;
					container++;
				}
				
				// Prevent half-empty containers
				if (container < 2) {
					// Reset sequence
					sequence = 0;
				} else {
					// Override this container
					randomWholeNumber = 1;
					container = 0;
				}
			}
			
			// Remember last size
			lastSize = randomWholeNumber;
			
			// 'large' or 'small'
			return sizes[randomWholeNumber];
		}
		
		/**
		 * TODO: Finish this description
		 * @param  {[type]} size [description]
		 * @return {[type]}      [description]
		 */
		function nextGridColumn(size) {
			var min = 1;
			var max = 1;
			var multiple = 1;
			
			// Toggle CSS class value
			switch (lastGridSize) {
				case 1:
					// If 2x2 make sure the next one is always 1x2
					lastGridSize = 2;
					
					// Reset sequentials since they don't happen with 2x2s
					sequentials = 0;
					
					if (globalIndex === (data.length - 1)) {
						// If we're at the last item and there would only be one item to populate
						// a 2x1 grid, force a 2x2
						lastGridSize = 1;
					}
					
					return createGridContainer(lastGridSize);
					
				case 2:
					// - no more than 3 1x2s in a row
					// var rand = (Math.floor(Math.random() * (max - min)) + min) * 2;
					// var rand = Math.ceil(Math.floor(Math.random() * 10) / 2 % 1);
					var rand = Math.floor(Math.random() * 3) * 2;
					
					// Count how many times we're producing a 1x2 grid
					sequentials++;
					
					if (sequentials > max || rand < 2) {
						// Reset once we've hit the limit or decidedly quit
						lastGridSize = 1;
					} else {
						lastGridSize = 2;
					}
					
					if (globalIndex === (data.length - 1)) {
						// If we're at the last item and there would only be one item to populate
						// a 2x1 grid, force a 2x2
						lastGridSize = 1;
					}
					
					return createGridContainer(lastGridSize);
			}
			
			if (globalIndex === (data.length - 1)) {
				// If we're at the last item and there would only be one item to populate
				// a 2x1 grid, force a 2x2
				lastGridSize = 1;
			}
			
			return createGridContainer(lastGridSize);
		}
		
		// Create a fragment placeholder while building
		var $elFrag = $(document.createDocumentFragment());
		
		// Get template
		var template = Hogan.compile($('#grid_container_template').html());
		
		// Loop over data set
		$.each(data, function (index, value) {
			// Save index to global
			globalIndex = index;
			
			// Render each grid
			var $output = $(template.render($.extend(value, {
				parseDate: function () {
					return function (text) {
						var newDate = Hogan.compile(text).render(this);
						return moment(newDate).format('h:mma MM/DD/YYYY');
					};
				}
			})));
			
			// Get user's avatar
			// $.ajax({
			// 	// https://instagram.com/oauth/authorize/?client_id=1e0c7dca723548099053710634e9824e&redirect_uri=http://socialgrid.theposters.dev/socialGrid/&response_type=token
			// 	url: 'https://api.instagram.com/v1/users/' + data[index].user_id + '?access_token=1519685802.1e0c7dc.381a5e0a246d480698f801e39523093e',
			// 	dataType: 'jsonp',
			// 	success: function (newData) {
			// 		if (typeof newData.data !== 'undefined') {
			// 			$('.' + data[index].user_id).attr('src', newData.data.profile_picture);
			// 		}
			// 	}
			// });
			
			// Get post's likes
			// $.ajax({
			// 	// https://instagram.com/oauth/authorize/?client_id=1e0c7dca723548099053710634e9824e&redirect_uri=http://socialgrid.theposters.dev/socialGrid/&response_type=token
			// 	url: 'https://api.instagram.com/v1/media/10643908_1556624487894431_56452619/likes/?access_token=1519685802.1e0c7dc.381a5e0a246d480698f801e39523093e',
			// 	dataType: 'jsonp',
			// 	success: function (newData) {
			// 		if (typeof newData.data !== 'undefined') {
			// 			$('.media-' + data[index].id).attr('text', newData.data.profile_picture);
			// 		}
			// 	},
			// 	error: function (w, t, f) {
			// 		console.log('error - w: t: f: ', w, t, f);
			// 	}
			// });
			
			// Append to new grid item
			var newGridItem = nextGridColumn(getGridSize()).append($output);
			
			// Append new grid item to fragment
			$elFrag.append(newGridItem);
		});
		
		// Append grid to page
		$el.append($elFrag);
	}
});
