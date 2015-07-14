# Options
		
***
		
> These are the options you can set and callbacks and methods to use in your project. If you have any suggestion or an issue, go to the project on [Github](https://github.com/edirpedro/jcs4/) and open a discussion.
		
## Settings

**debug**
Show log informations on the browser console.
```javascript
Default: false
```
			
**autoPlay**
Define if the slideshow will automatically change the slides or make it manually.
```javascript
Default: true
```
			
**pauseOnHover**
Pause the slide show when mouse enter on the viewport.
```javascript
Default: true
```

**imgOnDemand**
This will load the images when it is requested by the user. When `false`, after first slide images load ends, the rest of the images will be loaded on sequence automatically. This is useful to build photo galleries with many images.
```javascript
Default: false
```
				
**touchEnabled**
Enable or disable the touch events on the slideshow.
```javascript
Default: true
```
			
**swipeThreshold**
Set a minimum size of a swipe movement to start an action.
```javascript
Default: 100
```
			
**swipeInvert**
Invert the swipe movement direction.
```javascript
Default: false
```
			
**slide**
Set the selector to find the slides.
```javascript
Default: '.jcs4-slide'
```
			
**slideDuration**
Set the time to wait before next slide goes on, the value is in milliseconds.
```javascript
Default: 5000
```
			
**slideToStart**
Set the slide position to start when loaded.
```javascript
Default: 0
```
			
**slideWidth**
Set the with size of the slide, when zero it will use your CSS format instead.
```javascript
Default: 0
```
			
**slideHeight**
Set the height size of the slides, when zero it will use your CSS format instead.
```javascript
Default: 0
```

**slideOutWait**
The waiting time necessary for the Out animations before starting next slide, values in milliseconds like `500`. Only used when the slide has an Out effect.
```javascript
Default: 0
```
			
**autoPages**
Set if the pages needs to be written or you are providing your own model, like pages using thumbnails.
```javascript
Default: true
```
			
**controlPrevious**
Set the selector  where the previous button is found.
```javascript
Default: '.jcs4-prev'
```

**controlNext**
Set the selector  where the next button is found.
```javascript
Default: '.jcs4-next'
```
			
**controlPages**
Set the selector where the pages are found or will be written. Every page works on a tag `<a>`. You can build your on pages with thumbnails just writing on the slideshow HTML.
```javascript
Default: '.jcs4-pages'
```
		
## Methods
		
**goToPrevious**
Performs a "Previous" action on the slideshow.
```javascript
Slideshow = $('.jcs4').jCS4();
Slideshow.goToPrevious();
```

**goToNext**
Performs a "Next" action on the slideshow.
```javascript
Slideshow = $('.jcs4').jCS4();
Slideshow.goToNext();
```
	
**goToSlide**
Change the slide to the index value passed, slides start with 0.
```javascript
Slideshow = $('.jcs4').jCS4();
Slideshow.goToSlide(2);
```
		
**getCurrentSlide**
Return the index from the front slide on viewport.
```javascript
Slideshow = $('.jcs4').jCS4();
var current = Slideshow.getCurrentSlide();
```

**getBackSlide**
Return the index from the back slide on viewport.
```javascript
Slideshow = $('.jcs4').jCS4();
var back = Slideshow.getBackSlide();
```

**getSlideCount**
Return the total of slides on the viewport.
```javascript
Slideshow = $('.jcs4').jCS4();
var count = Slideshow.getSlideCount();
```

**destroy**
Destroy the slideshow return it to the original html and values.
```javascript
Slideshow = $('.jcs4').jCS4();
Slideshow.destroy();
```

**reload**
Reload the slideshow, you can pass new settings to the function.
```javascript
Slideshow = $('.jcs4').jCS4();
Slideshow.reload();
```

## Callbacks
		
**onPrevious**
Executes after the previous slide change, the arguments pass the index value from slides in front and back in the viewport.
```javascript
$('.jcs4').jCS4({
	onPrevious: function(front, back) {
		// Actions here
	}
});
```
			
**onNext**
Executes after the next slide change, the arguments pass the index value from slides in front and back in the viewport.
```javascript
$('.jcs4').jCS4({
	onNext: function(front, back) {
		// Actions here
	}
});
```
			
**onChange**
Executes after a slide change, the arguments pass the index value from slides in front and back in the viewport.
```javascript
$('.jcs4').jCS4({
	onChange: function(front, back) {
		// Actions here
	}
});
```
			
**onLoad**
Executes when the slideshow is fully loaded.
```javascript
$('.jcs4').jCS4({
	onLoad: function() {
		// Actions here
	}
});
```
