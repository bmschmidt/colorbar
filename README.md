Colorbar
========

Drop in color axis for use with d3.js with two notable features:

1. It takes a scale with a numeric domain and color range and automatically generates a legend
chart for it.

2. By binding mouseover events to its "pointTo" method, hovering on a chart element will
update a pointer on the legend.

See example at http://benschmidt.org/colorbar.

It supports transitions, repositioning, and a variety of different types of scales: at least log, linear, square root, and quantile.

## Creation

Thanks to some nice contributions by user [enucatl](https://github.com/Enucatl), this now behaves more like a good d3 component: you can call it on a selection, usually a "g" element.

Build a colorbar by calling the colorbar function on a D3 selection. 

For example:

```
<script src="http://benschmidt.org/colorbar/colorbar.js"></script>

<script>
myScale = d3.scale.linear().range(["red","white","blue"]).domain([0,4,25])

colorbar = Colorbar()
	.origin([15,60])
	.scale(myScale)
	.orient("vertical")

placeholder = "#colorbar-here"

colorbarObject = d3.select(placeholder)
    .call(colorbar)
	
</script>
```

(I'd download the javascript, though, rather than use my hosted copy: no promises that url will permanently contain the latest version of the script, or that the API won't change.)

## Update

The colorbar call returns a selection with an additional method that can be used to change the pointer location using a "pointTo" method.

```
colorbarObject.pointTo(26)
```

The pointer will drop to the appropriate place, and then fade away after five seconds.

In practice, you'll almost always want to bind this pointer a mouseover event: some fake code would look like this:
```
var elements = d3.selectAll("circle").data(whatever)

//this is how you'd be defining the color of the element:
elements.style("fill",function(d) {return myScale(d.colorDatum)})

//The sort of mouseover event you want:
elements.on("mouseover",function(d) {mycolorbar.pointTo(d.colorDatum)})

```

## General methods:

### selection.call(colorbar)

Draws or redraws the scale (if necessary) based on the current title, scale, etc. in the context of the given selection.

### selection.call(colobar).pointTo()

Sets the pointer as described above. Note that this is called on the returned selection, rather than on the component creation function as all the others are. 

## Accessors

### colorbar.scale()

Sets (or returns) a D3 scale associated with the colorbar object.

### colorbar.thickness()

Sets (or fetches) the width of the scale (or the height, in landscape mode).

### colorbar.barlength()

Sets (or fetches) the height of the scale (or the width, in landscape mode).

### colorbar.title()

Sets or changes the title of the chart. (Not currently supported)

### colorbar.orient()

Sets (or fetches) the orientation: must be "horizontal" or "vertical."

### colorbar.margins()

Sets (or fetches) the margins of the SVG bounding box.

By default, `margin = {top: 5, right: 30, bottom: 25, left: 0}`: these parameters can be changed if you have clipping problems.

The SVG box is there to begin with so that axis transitions don't take up the whole screen. Ideally, it would be set by some `getbbox()` method, I think.

### colorbar.origin()

Sets (or returns) the offset of the colorbar as an object with an x and y attributes.

Usually, you will be better off changing the location of the parent selection than calling this method: it will probably be retired at some point.
