/**
* jCS4 - jQuery CSS Slide Show
*
* @version: 0.2.0
* @author Edir Pedro
* @website http://hub.edirpedro.com.br/jCS4
* @copyright 2015
* @license MIT - http://opensource.org/licenses/MIT
* @preserve
*/

;(function($) {
	'use strict';

	var defaults = {
	
		// General
		debug: false,
		autoPlay: true,
		pauseOnHover: true,
		animationClass: 'animated',
		cssSuports: 'transform animation',
		
		// Touch
		touchEnabled: true,
		swipeThreshold: 100,
		swipeInvert: false,
		
		// Slide
		slide: '.jcs4-slide',
		slideDuration: 5000,
		slideToStart: 0,
		slideWidth: 0,
		slideHeight: 0,
		slidePreload: 1,
		
		// Controls
		autoPages: true,
		controlPrevious: '.jcs4-prev',
		controlNext: '.jcs4-next',
		controlPages: '.jcs4-pages',
		
		// Callbacks
		onPrevious: function(front, back) {},
		onNext: function(front, back) {},
		onChange: function(front, back) {},
		onLoad: function() {}
		
	}
	
	$.fn.jCS4 = function(options) {
	
		if(this.length === 0) return this;

		// Support mutltiple elements
		if(this.length > 1){
			this.each(function(){
				$(this).jCS4(options);
			});
			return this;
		}

		// Set a reference to our slider element
		var slider = this;
		
	
		/* Private Functions
		==================================================*/
		
		var init = function() {
			slider.settings = $.extend({}, defaults, options);
			
			// Preparing to Fallback
			if (!hasCSS(slider.settings.cssSuports.split(' ')))
				slider.addClass('jcs4-fallback');
						
			// Clone Slides to future usage
			slider.original = slider.find(slider.settings.slide).clone();
			slider.find(slider.settings.slide).each(function(index) {
				$(this).attr('data-index', index);
			});
			slider.slides = slider.find(slider.settings.slide).clone();

			// Preparing Viewport
			slider.viewport = slider.find('.jcs4-viewport');
			slider.viewport.html('');
			
			if (slider.settings.slideWidth > 0 && slider.settings.slideHeight > 0) {
				var style = '<style>.jcs4-viewport { max-height: $height$px; } .jcs4-viewport:before { display: block; content: ""; width: 100%; padding-top: $ratio$%; }</style>';
				style = style.replace('$height$', slider.settings.slideHeight);
				style = style.replace('$ratio$', (slider.settings.slideHeight / slider.settings.slideWidth) * 100);
				$('head').append(style);
			}

			// Setting animations
			if (hasCSS('animation')) {
				var animationStart = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart';
				
				slider.slides.find('[data-effect]').each(function() {
					var obj = $(this);
					obj.addClass(slider.settings.animationClass + ' animationHidden ' + obj.attr('data-effect'));
					
					var style = [];
					
					var delay = obj.attr('data-delay');
					if (typeof delay == 'string')
						style.push(cssPrefixed('animation-delay', delay));
											
					var direction = obj.attr('data-direction');
					if (typeof direction == 'string')
						style.push(cssPrefixed('animation-direction', direction));
					
					var duration = obj.attr('data-duration');
					if (typeof duration == 'string')
						style.push(cssPrefixed('animation-duration', duration));
						
					var iteration = obj.attr('data-iteration-count');
					if (typeof iteration == 'string')
						style.push(cssPrefixed('animation-iteration-count', iteration));
						
					var timing = obj.attr('data-timing-function');
					if (typeof timing == 'string')
						style.push(cssPrefixed('animation-timing-function', timing));
						
					obj.attr('style', style.join(' '));
									
					obj.one(animationStart, function() {
						$(this).removeClass('animationHidden');
					});
				});
			} else {
				// Fallback animation
				slider.slides.addClass('justFadeIn');
			}
			
			// Building pagination
			if (slider.settings.autoPages) {
				var pages = slider.find(slider.settings.controlPages);
				$.each(slider.slides, function(index) {
					pages.append('<a>' + (index + 1) + '</a>');
				});
			}
						
			// Setting controls
			slider.find(slider.settings.controlPrevious).on('click', clickPrevious);
			slider.find(slider.settings.controlNext).on('click', clickNext);
			slider.find(slider.settings.controlPages).find('a').each(function(index) {
				$(this).attr('data-index', index).on('click', clickPages);
			});
			slider.find('.jcs4-controls').hide();

			// Setting Queue
			slider.queue = {
				front: slider.settings.slideToStart,
				back: slider.settings.slideToStart
			}
			
			// Timer
			slider.timer = new Timer(slider, controlNext, slider.settings.slideDuration);
			slider.hover = false;
			if (slider.settings.pauseOnHover) {
				$(slider).hover(function() {
					slider.hover = true;
					slider.timer.pause();
				}, function() {
					slider.hover = false;
					slider.timer.start();
				});
			}

			_log('Initialized', slider);
			slider.settings.onLoad();
			
			// Preload
			slider.viewport.append('<div class="jcs4-slide jcs4-loading">');
			preloadSlides(slider.slides.filter(':lt(' + slider.settings.slidePreload + ')'), function() {
				_log('Preloaded', slider.settings.slidePreload);
				if (slider.settings.touchEnabled) initTouch(); // Touch events
				slider.find('.jcs4-controls').show();
				goToSlide(slider.settings.slideToStart);
			});

		}
		
		/*
		* Previous action
		*/ 
		var clickPrevious = function(e) {
			e.preventDefault();
			controlPrevious();
		}
		
		var controlPrevious = function() {			
			var index = slider.slides.length - 1;
			if (slider.queue.front > 0)
				index = parseInt(slider.queue.front) - 1;
			
			_log('Function controlPrevious', index, slider.queue.front);
			goToSlide(index);
			slider.settings.onPrevious(slider.queue.front, slider.queue.back);
		}
		
		/*
		* Next action
		*/ 		
		var clickNext = function(e) {
			e.preventDefault();
			controlNext();
		}
		
		var controlNext = function() {
			var index = 0;
			if (slider.queue.front < (slider.slides.length - 1))
				index = parseInt(slider.queue.front) + 1;
			
			_log('Function controlNext', index, slider.queue.front);
			goToSlide(index);
			slider.settings.onNext(slider.queue.front, slider.queue.back);
		}
		
		/*
		* Pagination action
		*/ 
		var clickPages = function(e) {
			e.preventDefault();
			var index = $(e.target).attr('data-index');
			
			if (index == slider.queue.front)
				return;

			_log('Function clickPages', index);			
			goToSlide(index);
		}
		
		var adjustPages = function() {
			slider.find(slider.settings.controlPages)
				.find('a')
				.removeClass('active')
				.filter('[data-index=' + slider.queue.front + ']')
				.addClass('active');
		}
		
		/*
		* Go to slide
		*/ 
		var goToSlide = function(index) {
		
			slider.timer.stop();
			
			var current = slider.viewport.find(slider.settings.slide);
			if (current.length == 2)
				$(current).eq(0).remove();
		
			var slide = $(slider.slides[index]).clone(true);
			slider.viewport.append(slide);
			
			slider.viewport.find('.justFadeIn:last').hide().fadeIn(); // just a fallback animation
			
			slider.queue.back = slider.queue.front;
			slider.queue.front = index;
			
			_log('Function goToSlide', index);
			slider.settings.onChange(slider.queue.front, slider.queue.back);

			adjustPages();
			slider.timer.start();
			
		}
		
		/*
		* Timer object
		*/
		var Timer = function(slider, callback, delay) {
			var timer, started, remaining = delay;
			
			this.start = function() {
				if (slider.settings.autoPlay === false || slider.hover) return;
				started = new Date();
				timer = setTimeout(callback, remaining);
				_log('Timer Start', remaining);
			}

			this.pause = function() {
				clearTimeout(timer);
				remaining -= new Date() - started;
				_log('Timer Pause', remaining);
			}
			
			this.stop = function() {
				clearTimeout(timer);
				remaining = delay;
				_log('Timer Stop', delay);
			}
		}
		
		/*
		* Touch event
		*/ 
		var initTouch = function() {
			slider.touch = {};
			
			slider.on('touchstart', function(e) {			
				slider.touch.startX = e.originalEvent.touches[0].pageX;
			
			}).on('touchmove', function(e) {
				slider.touch.endX = e.originalEvent.touches[0].pageX;
			
			}).on('touchend', function(e) {
				var start = slider.touch.startX;
				var end = slider.touch.endX;
				var distance = Math.abs(start - end);
				if (distance >= slider.settings.swipeThreshold) {
					if (slider.settings.swipeInvert)
						start > end ? controlPrevious() : controlNext();
					else
						start > end ? controlNext() : controlPrevious();
				}
			});
		}
		
		/*
		* Prefixing CSS
		* Prevent jQuery 1.11.3 to turns "animation-delay: 2s" into "animation: 2s" on Safari
		*/ 
		var cssPrefixed = function(attr, value) {
			var e = document.createElement('div').style;
			var prefixes = ['-ms-','-o-','-moz-','-webkit-'];
			
			if (e[attr] == '')
				return attr + ': ' + value + ';';
			for (var i in prefixes) {
				var prop = prefixes[i] + attr;
				if (e[prop] == '')
					return prop + ': ' + value + ';';
			}
		}
		
		/*
		* Checking CSS suport
		*/ 
		var hasCSS = function(name) {
			
			// Checking an array
			if (typeof name == 'object') {
				for (var n in name) {
					if (hasCSS(name[n]) === false)
						return false;
				}
				return true;
			}
			
			// Checking a single name
			var e = document.createElement('div').style;
			var prefixes = ['-ms-','-o-','-moz-','-webkit-'];
			
			if (e[name] == '') return true;
			for (var i in prefixes) {
				var prop = prefixes[i] + name;
				if (e[prop] == '')
					return true;
			}
			return false;
		}
		
		/*
		* Preload slide images
		*/ 
		var preloadSlides = function(selector, callback) {
			var total = selector.find('img').length;
			if (total == 0) {
				callback();
				return;
			}
			var count = 0;
			selector.find('img').each(function(){
				$(this).one('load', function() {
					if (++count == total) callback();
				}).each(function() {
					if (this.complete) $(this).load();
				});
			});
		}

		/*
		* Logging
		*/ 
		var _log = function() {
			if (slider.settings.debug) {
				console.log(Array.prototype.slice.call(arguments));
			}
		}
	
	
		/* Public Methods
		==================================================*/
	
		slider.goToPrevious = function() {
			_log('Public goToPrevious', index);
			controlPrevious();
		}
		
		slider.goToNext = function() {
			_log('Public goToNext');
			controlNext();
		}
		
		slider.goToSlide = function(index) {
			_log('Public goToSlide', index);
			goToSlide(index);
		}
		
		slider.getCurrentSlide = function() {
			return slider.queue.front;
		}
		
		slider.getBackSlide = function() {
			return slider.queue.back;
		}
		
		slider.getSlideCount = function() {
			return slider.slides.length;
		}
	
		slider.destroy = function() {
			_log('Public destroy');
			
			slider.off('touchstart touchmove touchend');
			slider.viewport.html(slider.original);
			slider.find(slider.settings.controlPrevious).off('click');
			slider.find(slider.settings.controlNext).off('click');
			
			if (slider.settings.autoPages)
				slider.find(slider.settings.controlPages).html('');

			slider.queue = {};
		}
		
		slider.reload = function(settings) {
			_log('Public reload');
			if (settings != undefined) options = settings;
			slider.destroy();
			init();	
		}
	
		// Initializing
		init();
	
		return this;
	}

})(jQuery);
