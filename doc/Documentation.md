# Documentation

* * * 

> Here you can read some informations about how this plugin works and the definitions of some elements and ideas. You can follow this project on [Github](https://github.com/edirpedro/jcs4), open an issue if you found some error, a discussion about a new features, ideas or make a fork. I would appreciate if you corrected the documentation files, my English is not so good and probably there are some grammatical errors. Sorry about that!

## Required files
				
```html
<!-- jQuery Library -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<!-- jCS4 Javascript file -->
<script src="/jcs4/js/jquery.jcs4.min.js"></script>
<!-- jCS4 CSS files -->
<link href="/jcs4/css/jcs4.css" rel="stylesheet">
<link href="/jcs4/css/animations.min.css" rel="stylesheet">
```

jQuery Library must be included first. Download the **jCS4** package and upload the files to a `/jCS4` folder in your server and then, change the paths to the corresponded place in the tags above. If you are using a custom package -- see instructions above -- change the `animations.min.css` to your custom package file like `animations.pack.min.css`.

		
## The HTML markup
		
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

<p style="text-align:center"><img class="alignnone" src="https://raw.githubusercontent.com/edirpedro/jcs4/master/img/jcs4-layers.png"></p>

## The Controls

The controls elements are placed directly on HTML to make it possible to easy customize these elements. The only requirement is that the tag `<a>` needs to be used to provide the click action.

```html
<div class="jcs4">
	<div class="jcs4-controls">
		<a class="jcs4-prev"></a>
		<a class="jcs4-next"></a>
		<div class="jcs4-pages"></div>
	</div>
</div>
```

### Customizing the pages

You can customize the pages to be represented as a thumbnail, you just need to write the HTML and CSS code to get the layout you want for it, then set the option `autoPages: false` to disable the pages generation and use yours instead. The plugin will look at the tags `<a>` and make a connection to the slides in the viewport, so don't forget to use the same number of pages and slides.

```html
<div class="jcs4">
	<div class="jcs4-controls">
		<a class="jcs4-prev"></a>
		<a class="jcs4-next"></a>
		<div class="jcs4-pages">
			<a><img src="img/image-1-thumb.jpg"></a>
			<a><img src="img/image-2-thumb.jpg"></a>
			<a><img src="img/image-3-thumb.jpg"></a>
		</div>
	</div>
	[...]
</div>

<script>
$(document).ready(function() {
	$('.jcs4').jCS4({
		autoPages: false // Disable the automatic pages
	});
});
</script>
```

## The Viewport

### Setting the size

Setting the size of the viewport will cause to write some inline style to your page, to guarantee that the viewport will be responsive and the images inside it will maintain the aspect ratio.

```javascript
$('.jcs4').jCS4({
	slideWidth: 1200,
	slideHeight: 550
});
```

This will result in these inline styles on your page. The Height size and the Ratio, calculated by this expression `(Height / Width) * 100`. This will result in an element with an aspect ratio accordingly to the With size of the viewport.

```css
.jcs4-viewport {
	max-height: HEIGHTpx;
}
.jcs4-viewport::before {
	display: block; 
	content: ""; 
	width: 100%; 
	padding-top: RATIO%; 
}
```

### Customizing the viewport

If you don't provide a Width and Height size for the viewport, it will use your own CSS layout, this let you build a custom element, accordingly to your layout needs.

```javascript
$('.jcs4').jCS4();
```

## Creating slides

The slide element has to be inside a tag `<div class="jcs4-slide">` and can contain any HTML tag to represent your needs, then you code the CSS styles as a normal layout. Even the slide element can use a different tag, like you will see above.

### A basic slide

On this example we have the slide inside a link tag `<a>` to make it all clicked.

```html
<a class="jcs4-slide" href="/">
	<img data-effect-in="fadeIn" data-effect-out="fadeOut" src="img/name.jpg">
</a>
```

### More complex slide

Now we have the slide with a link inside the presented text instead of click in any part of the slide.

```html
<div class="jcs4-slide">
	<img data-effect-in="fadeIn" data-effect-out="fadeOut" src="img/name.jpg">
	<div class="caption" data-effect-in="fadeIn" data-effect-out="fadeOut">
		<h2>Title</h2>
		<p>Lorem ipsum doler sit amet.</p>
		<a class="button" href="/">Read more</a>
	</div>
</div>
```

### Writing a full width size slide

On this example we used a special class `.jcs4-image-crop`, this makes the image inside the element being cropped to maintain the viewport aspect ratio in multiple screen sizes. If you use a large width image width 2000px for example, it will crop the borders of this image until it gets the viewport width limits.

```html
<a class="jcs4-slide" href="/">
	<div class="jcs4-image-crop" data-effect-in="fadeIn" data-effect-out="fadeOut"><img src="img/name.jpg"></div>
	<div class="caption" data-effect-in="fadeIn" data-effect-out="fadeOut">
		<h2>Title</h2>
		<p>Lorem ipsum doler sit amet.</p>
	</div>
</div>
```

## Using effects

```html
<img data-effect-in="fadeIn" data-effect-out="fadeOut" src="img/name.jpg">
```

To use an effect in an element, write the attribute and value in the HTML tag, the image in this case, but could be any other tag. 

* `data-effect`: A shortcode to `data-effect-in`
* `data-effect-in`: Set the effect when the element _enter_ the viewport
* `data-effect-out`: Set the effect when the element _leave_ the viewport

When using `data-effect-out` you can probably want to get a little time to animate the leave effect before start the next slide. Use the option `slideOutWait: 500` when instantiate the plugin, to indicate the time in milliseconds you need to the end animations.

### Customizing a built-in animation

You can build you own animation -- see instructions above --, but eventually you will need to change just a delay or another property from the effect to get what you want. These are the options you can use to customize the effect on page. These attributes can be used like `data-xxx` or `data-xxx-in` for **IN** effects and `data-xxx-out` for **OUT** effects. It responds with values exactly like used for CSS.

* `data-delay`: Specifies a delay for the start of an animation
* `data-direction`: Specifies whether an animation should play in reverse direction or alternate cycles
* `data-duration`: Specifies how many seconds or milliseconds an animation takes to complete one cycle
* `data-iteration-count`: Specifies the number of times an animation should be played
* `data-timing-function`: Specifies the speed curve of the animation

Read more about these properties at [Using CSS Animations](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations).		

## Animations

These are all the animations inside this package. You can see the list in `animations.json` too.

%ANIMATIONS_LIST%

### Build your own effect

You can build your own effect writing a CSS Animation, take a look at the `css/animations/` folder to view the examples. After built it, just request it on your project and set the effect name in your slide to use it.

### Customizing a package

You can build a small package for your project, eliminating unnecessary effects and reducing the size of the animations file. There are two ways for this:

1. You can copy the CSS animation styles from `css/animations.css` and put it into the `css/animations.pack.css` manually, then request this package in your project.

2. You can automate using Grunt JS, just copy the list `animations.json` to `animations.pack.json` and then remove the effects you are not using. To complete, run the task `grunt animations` on Terminal to build your customized project package.

## Preloading images

The plugin has a preloader that can handle all the images inside a slide to load it before shows on the viewport. To use that feature you need to write the marckup replacing the `src` property to the `data-src` of an `<img>` tag, to prevent the browser requesting the image before it really needs to. This function is usefull if you are building a photo gallery with many images to load. Note that this function doesn't preload images in the background elements.

```html
<div class="jcs4-slide">
	<img src="jcs4/img/blank.gif" data-src="img/name.jpg">
</div>
```

After the first slide shows on the viewport, the preloader will automatically start preloading the next slides. If you want to only load images on demand, when the user click on the next button for example, set the option `imgOnDemand: true` when instantiate the plugin to stop this.

```javascript
$('.jcs4').jCS4({
	imgOnDemand: true // Stop preloading automatically
});
```

## Theming the slide show

Probably the slideshow has a layout that do not correspond to your designer's layout. No problem, open the file `css/jcs4.css`, read the instructions and change anything you want. Or you can build a new one from scratch!

