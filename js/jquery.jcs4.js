/**
* jCS4 - jQuery CSS Slide Show
*
* @version: 0.3.2
* @author Edir Pedro
* @website http://hub.edirpedro.com.br/jcs4
* @git https://github.com/edirpedro/jcs4
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
		imgOnDemand: false,
		
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
		slideOutWait: 0,
		
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

	/*
	* Function jcs4Find() will search for the first element found in the objects array passed
	* $.jcs4Find('selector', [element, document]);
	*/
	$.extend({
		jcs4Find: function(selector, objs) {
			for (var i in objs) {
				var elem = jQuery(selector, objs[i]);
				if (elem.length)
					return elem;
			}
			return jQuery();
		}
	});
	
	/*
	* jCS4 plugin
	*/
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
			slider.addClass('loading');
			slider.preloadAll = false;
			
			// Test supports
			slider.supports = {
				animation: hasCSS('animation')
			}
						
			// Clone Slides to future usage
			slider.original = slider.find(slider.settings.slide).clone();
			slider.find(slider.settings.slide).each(function(index) {
				$(this).attr('data-index', index);
			});
			slider.slides = slider.find(slider.settings.slide).clone();

			// Preparing Viewport
			slider.viewport = slider.find('.jcs4-viewport');
			slider.viewport.html('<div class="jcs4-loading" style="display:none;"></div>');
						
			if (slider.settings.slideWidth > 0 && slider.settings.slideHeight > 0) {
				var style = '<style>.jcs4-viewport { max-height: $height$px; } .jcs4-viewport:before { display: block; content: ""; padding-top: $ratio$%; } .jcs4-viewport::before { display: block; content: ""; padding-top: $ratio$%; }</style>';
				style = style.replace('$height$', slider.settings.slideHeight);
				style = style.replace('$ratio$', (slider.settings.slideHeight / slider.settings.slideWidth) * 100);
				$('head').append(style);
			}
			
			// Building pagination
			if (slider.settings.autoPages) {
				var pages = $.jcs4Find(slider.settings.controlPages, [slider, document]);
				$.each(slider.slides, function(index) {
					pages.append('<a>' + (index + 1) + '</a>');
				});
			}
						
			// Setting controls			
			$.jcs4Find(slider.settings.controlPrevious, [slider, document]).on('click', clickPrevious);
			$.jcs4Find(slider.settings.controlNext, [slider, document]).on('click', clickNext);
			$.jcs4Find(slider.settings.controlPages, [slider, document]).find('a').each(function(index) {
				$(this).attr('data-index', index).on('click', clickPages);
			});

			// Setting Queue
			slider.queue = {
				front: slider.settings.slideToStart,
				back: slider.settings.slideToStart
			}
			
			// Timer
			slider.slideIn = null;
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

			// Loaded
			_log('Initialized', slider);
			slider.settings.onLoad();
			
			goToSlide(slider.settings.slideToStart, function() {
				initTouchEvents(); 
				slider.removeClass('loading');
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
			var index = $(e.currentTarget).attr('data-index');
			
			if (index == slider.queue.front)
				return;

			_log('Function clickPages', e, index);			
			goToSlide(index);
		}
		
		var adjustPages = function() {
			$.jcs4Find(slider.settings.controlPages, [slider, document])
				.find('a')
				.removeClass('active')
				.filter('[data-index=' + slider.queue.front + ']')
				.addClass('active');
		}
		
		/*
		* Go to slide
		*/ 
		var goToSlide = function(index, callback) {
		
			slider.timer.stop();
			clearTimeout(slider.slideIn);
			
			preloadSlide(slider.slides.filter('[data-index=' + index + ']'), function(index) {

				// Remove old slide, just front and back on the viewport
				var current = slider.viewport.find(slider.settings.slide);
				if (current.length == 2)
					$(current).eq(0).remove();
	
				// Out animation
				var slideOut = slider.viewport.find(slider.settings.slide).filter(':first');
				slideOut = addAnimation(slideOut, 'out');
	
				// In animation
				var slideIn = $(slider.slides[index]).clone();
				slideIn = addAnimation(slideIn, 'in');
				
				// Wait slide out
				if (slideOut) {
					slider.slideIn = setTimeout(function() {
						slider.viewport.append(slideIn);
					}, slider.settings.slideOutWait);
				} else {
					slider.viewport.append(slideIn);
				}
				
				slider.queue.back = slider.queue.front;
				slider.queue.front = index;
				
				_log('Function goToSlide', index);
				slider.settings.onChange(slider.queue.front, slider.queue.back);
								
				adjustPages();
				slider.timer.start();
				
				// Preload the rest of slides
				if (slider.settings.imgOnDemand === false && slider.preloadAll === false)
					preloadAll(0);
				
				if (callback)
					callback();

			}, index, true);
			
		}
		
		/*
		* Add animation to slide
		*/ 
		var addAnimation = function(slide, sequence) {
		
			if(!slider.supports.animation)
				return slide;
				
			var animationStart = 'webkitAnimationStart mozAnimationStart MSAnimationStart oanimationstart animationstart';

			var data = {
				'in': {
					'data-delay': 'animation-delay',
					'data-delay-in': 'animation-delay',
					'data-direction': 'animation-direction',
					'data-direction-in': 'animation-direction',
					'data-duration': 'animation-duration',
					'data-duration-in': 'animation-duration',
					'data-iteration-count': 'animation-iteration-count',
					'data-iteration-count-in': 'animation-iteration-count',
					'data-timing-function': 'animation-timing-function',
					'data-timing-function-in': 'animation-timing-function',
				},
				'out': {
					'data-delay-out': 'animation-delay',
					'data-direction-out': 'animation-direction',
					'data-duration-out': 'animation-duration',
					'data-iteration-count-out': 'animation-iteration-count',
					'data-timing-function-out': 'animation-timing-function',
				}
			}
			
			var animated = false;
			var selector = sequence == 'out' ? '[data-effect-out]' : '[data-effect], [data-effect-in]';
			
			slide.find(selector).each(function() {
				var obj = $(this);
				animated = true;
				
				var effect = '';
				if (sequence == 'out') {
					effect = obj.attr('data-effect-out');
				} else {
					effect = obj.attr('data-effect');
					if (effect == undefined)
						 effect = obj.attr('data-effect-in');
				}
				
				var classes = effect;
				if (sequence == 'in')
					classes += ' animationHidden';
				obj.removeClass(obj.data('classes'))
					.addClass(classes)
					.data('classes', classes);
				
				var style = [];
				
				for (var key in data[sequence]) {
					var value = obj.attr(key);
					if (typeof value == 'string')
						style.push(cssPrefixed(data[sequence][key], value));
				}
											
				obj.attr('style', style.join(' '));
								
				obj.one(animationStart, function() {
					$(this).removeClass('animationHidden');
				});
			});
			
			return animated ? slide : null;
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
		* Touch events
		*/ 
		var initTouchEvents = function() {
			if (!slider.settings.touchEnabled)
				return;
				
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
			
			_log('Touch events initiated');
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
		var preloadSlide = function(selector, callback, index, loading) {
			var total = selector.find('[data-src]').length;
			if (total == 0) {
				callback(index);
				return;
			}
			if (loading)
				slider.find('.jcs4-loading').show();
			var count = 0;
			selector.find('[data-src]').each(function() {
				$(this)
					.attr('src', $(this).attr('data-src'))
					.one('load', function() {
						$(this).removeAttr('data-src');
						if (++count == total) {
							slider.find('.jcs4-loading').hide();
							callback(index);
						}
					}).each(function() {
						if (this.complete) $(this).load();
					});
			});
		}
		
		/*
		* Prealod All images into slides on sequence
		*/ 
		var preloadAll = function(index) {
			slider.preloadAll = true;
			if (index < slider.slides.length) {	
				_log('Function preloadAll', index);
				var slide = slider.slides.filter('[data-index=' + index + ']');
				preloadSlide(slide, function() {
					preloadAll(index + 1);
				}, index, false);
			}
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
			$.jcs4Find(slider.settings.controlPrevious, [slider, document]).off('click');
			$.jcs4Find(slider.settings.controlNext, [slider, document]).off('click');
			
			if (slider.settings.autoPages)
				$.jcs4Find(slider.settings.controlPages, [slider, document]).html('');
			else
				$.jcs4Find(slider.settings.controlPages, [slider, document]).find('a').off('click');

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
