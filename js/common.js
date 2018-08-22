"use strict";

$(document).ready(function () {
	//Chrome Smooth Scroll
	try {
		$.smoothScroll();
	} catch(err) {

	};
	if (Modernizr.touch) {

		// run the forEach on each figure element
		[].slice.call(document.querySelectorAll("a, button")).forEach(function(el,i){

			// check if the user moves a finger
			var fingerMove = false;
			el.addEventListener("touchmove",function(e){
				e.stopPropagation();
				fingerMove = true;
			});

			// always reset fingerMove to false on touch start
			el.addEventListener("touchstart",function(e){
				e.stopPropagation();
				fingerMove = false;
			});

		});

	}

	// price filtering logic
	if($("#filter-price").hasClass("no-tooltip"))
	{
		$("#filter-price").slider({
			tooltip: 'hide',
			step: 50,
		});
		$("#filter-price").on("slide", function(slideEvt) {
			var arr = slideEvt.value.toString();
			var minmax = arr.split(',');
			$("#min-slider-value").val(minmax[0]);
			$("#max-slider-value").val(minmax[1]);
		});
		$('#min-slider-value, #max-slider-value').keyup('input',function(){
			var minCurrentValue = parseFloat($('#min-slider-value').val());
			var maxCurrentValue = parseFloat($('#max-slider-value').val());
			var arr = [minCurrentValue, maxCurrentValue];
			$('#filter-price').slider('setAttribute', 'value', arr);
			$('#filter-price').slider('refresh');
		});
	}
	else
	{
		$("#filter-price").slider({
			tooltip: 'always',
			tooltip_split: true,
			step: 50,
		});
	}

	// properties grid
	var $grid = $('#properties-grid').imagesLoaded().always(function() {

		$grid.masonry({
			itemSelector: '.property-details',
			singleMode: false,
			isResizable: true,
			isAnimated: true,
			columnWidth: '.properties-grid-sizer',
			percentPosition: true
	});
	});

	// blog posts grid
	var $blogGrid = $('#blog-posts-masonry').imagesLoaded().always(function() {

		$blogGrid.masonry({
			itemSelector: '.blog-post',
			singleMode: false,
			isResizable: true,
			isAnimated: true,
			columnWidth: '.blog-posts-grid-sizer',
			percentPosition: true,
	});
	});

	// counters animations
	$('.counter').counterUp({
		time: 2000
	});

	// ADD SLIDEDOWN ANIMATION TO DROPDOWN //
	$('.dropdown').on('show.bs.dropdown', function (e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideDown(300);
	});

	// ADD SLIDEUP ANIMATION TO DROPDOWN //
	$('.dropdown').on('hide.bs.dropdown', function (e) {
		$(this).find('.dropdown-menu').first().stop(true, true).slideUp(300, function(){
			$(this).parent().removeClass('open');
		});
		e.preventDefault();
	});

	// properties magnific popup
	$('#properties-magnific-popup-gallery').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom mfp-img-mobile',
		image: {
			verticalFit: true,
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		},
		gallery: {
			enabled: true
		},
		zoom: {
			enabled: true,
			duration: 300, // don't foget to change the duration also in CSS
			opener: function(element) {
				return element.find('img');
			}
		}
	});

	// images in blog post magnific popup
	$('.blog-post-images-list').magnificPopup({
		delegate: 'a',
		type: 'image',
		closeOnContentClick: false,
		closeBtnInside: false,
		mainClass: 'mfp-with-zoom mfp-img-mobile',
		image: {
			verticalFit: true,
			titleSrc: function(item) {
				return item.el.attr('title');
			}
		},
		gallery: {
			enabled: true
		},
	});

 
});
