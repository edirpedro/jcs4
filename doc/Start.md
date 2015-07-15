# jQuery CSS Slide Show

<small class="document-version">Version 0.3.1 &mdash; Size %JCS4_SIZE% + %ANIMATIONS_SIZE%</small>
		
***

## Features
		
* Fully Responsive
* Uses CSS3 Animations (get native hardware acceleration!)
* Plugin size %JCS4_SIZE% (reduce more enabling gzip on your server)
* Animations size %ANIMATIONS_SIZE% (reduce to only the ones you are using)
* Touch swipe events supported
* Callback API and public methods
* Animations Support: IE 10+, Firefox 38+, Chrome 36+, Safari 8+, Opera 30+, iOS 8.3+, Android 4.1+
* Browser Support: IE 8+, Firefox, Chrome, Safari, iOS, Android
* Built with Developers in mind ;-)

## How to install

### 1. Link required files
		
jQuery Library must be included first. Download the **jCS4** package and upload the files to a `/jCS4` folder in your server and then, change the paths to the corresponded place in the tags above.
		
```html
<!-- jQuery Library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<!-- jCS4 Javascript file -->
<script src="/jcs4/js/jquery.jcs4.min.js"></script>
<!-- jCS4 CSS files -->
<link href="/jcs4/css/jcs4.css" rel="stylesheet">
<link href="/jcs4/css/animations.min.css" rel="stylesheet">
```
		
### 2. Create HTML markup
		
Create an element `<div class="jcs4">` and the slides can be many types of HTML tags inside an element `<div class="jcs4-slide">` to wrap them. Take a look at the [examples](examples.php). The Controls elements can be removed if you don't want all of the controls. All the slide styles you can write using CSS like a normal layout.
		
```html
<div class="jcs4">

	<!-- Controls -->
	<div class="jcs4-controls">
		<a class="jcs4-prev"></a>
		<a class="jcs4-next"></a>
		<div class="jcs4-pages"></div>
	</div>
	
	<!-- Slides -->
	<div class="jcs4-viewport">
		<div class="jcs4-slide">
			<img data-effect-in="fadeIn" data-effect-out="fadeOut" src="img/name.jpg">
		</div>
	</div>
	
</div>
```

### 3. Choose the effect

At the element you want to animate, insert the attribute `data-effect` and the effect name you want to use, like `fadeIn`. View all the effects going to [Demo](http://hub.edirpedro.com.br/jcs4/examples/demo.php) example. you can use In and Out effects.
```html
<img data-effect-in="fadeIn" data-effect-out="fadeOut" src="img/name.jpg">
```
		
### 4. Call the jCS4
		
Call the `.jCS4()` on the element. Note that the call must be made inside of a `$(document).ready()` call, or the plugin will not work!
		
```javascript
$(document).ready(function () {
	
	$('.jcs4').jCS4({
		slideWidth: 1200,
		slideHeight: 550
	});

});
```
		
## How to customize
		
There are some options you can use to customize the plugin in your website and create great experiences. Read the [options](http://hub.edirpedro.com.br/jcs4/options.php) page to know all of them. And take a look at some [examples](http://hub.edirpedro.com.br/jcs4/examples.php) you can build with this plugin.
		