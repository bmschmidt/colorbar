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
myScale = d3.scale.linear()

colorbar = Colorbar()
	.origin([15,60])
	.scale(myScale)
	.update()
```

## Update

A temporary pointer can be adjusted on the colorbar using a colorbar object's pointTo method.

```
colorbar.pointTo(26)
```

The pointer will drop to the appropriate place, and then fade away after five seconds.

## Accessors

### colorbar.scale()

Sets (or returns) a D3 scale associated with the colorbar object.

### colorbar.origin()

Sets (or returns) the x,y location within the svg holding the colorbar. Specified in pixels.

### colorbar.barHeight()

Sets (or fetches) the height of the scale.

### colorbar.barWidth()

Sets (or fetches) the width of the bars in the scale (or the height, in landscape view). Specified in pixels.

### colorbar.title()

Sets or changes the title of the chart.

### colorbar.orientation()

Sets (or fetches) the orientation: must be "horizontaL" or "vertical." (Not implemented.) 
