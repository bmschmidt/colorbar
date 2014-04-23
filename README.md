Colorbar
========

Drop in color axis for use with d3.js with two notable features:

1. It takes a scale with a numeric domain and color range and automatically generates a legend
chart for it.

2. By binding mouseover events to its "pointTo" method, hovering on a chart element will
update a pointer on the legend.

See example at http://benschmidt.org/colorbar

## Creation

Build a colorbar by calling the colorbar function.

For example:

```
<script src="http://benschmidt.org/colorbar/colorbar.js"></script>

<script>
myScale = d3.scale.linear().range(["red","white","blue"]).domain([0,4,25])

colorbar = Colorbar()
	.origin([15,60])
	.scale(myScale)

placeholder = "#colorbar-here"
d3.select(placeholder)
    .call(colorbar)
</script>
```

(I'd download the javascript, though: no promises that url will permanently contain the latest version of the script).

## Update

A temporary pointer can be adjusted on the colorbar using a colorbar object's pointTo method.

```
colorbar.pointTo(26)
```

The pointer will drop to the appropriate place, and then fade away after five seconds.

In practice, you'll almost always want to bind this to a mouseover event: some fake code would look like this:
```
var elements = d3.selectAll("circle").data(whatever)

//this is how you'd be defining the color of the element:
elements.style("fill",function(d) {return myScale(d.colorDatum)})

//The sort of mouseover event you want:
elements.on("mouseover",function(d) {colorbar.pointTo(d.colorDatum)})

```

## General methods:

### colorbar.update()

Draws or redraws the scale (if necessary) based on the current title, scale, etc.

### colorbar.pointTo()

Sets the pointer as described above.

## Accessors

### colorbar.origin()

Sets (or returns) the offset of the colorbar as an object with an x and y
attributes.

### colorbar.scale()

Sets (or returns) a D3 scale associated with the colorbar object.

### colorbar.origin()

Sets (or returns) the x,y location within the svg holding the colorbar. Specified in pixels.

### colorbar.height()

Sets (or fetches) the height of the scale.

### colorbar.width()

Sets (or fetches) the width of the bars in the scale (or the height, in landscape view). Specified in pixels.

### colorbar.title()

Sets or changes the title of the chart.

### colorbar.orientation()

Sets (or fetches) the orientation: must be "horizontaL" or "vertical." (Not implemented.) 
