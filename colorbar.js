function Colorbar() {
    var scale, // the input scale this represents;
    margin = {top: 0, right: 30, bottom: 30, left: 0}
    orient = "vertical",

    origin = {
        x: 0,
        y: 0
    }, // where on the parent to put it
    barlength = 100, // how long is the bar
    thickness = 50, // how thick is the bar
    title = "", // title for the colorbar
    scaleType = "linear";

    function chart(selection) {
        var fillLegend,
        fillLegendScale;

        selection.pointTo = function(inputNumbers) {
            var pointer = fillLegend.selectAll(".pointer");
            var pointerWidth = Math.round(thickness*3/4);


            //Also creates a pointer if it doesn't exist yet.
            pointers = fillLegend
                .selectAll('.pointer')
                .data([inputNumbers]);

            pointers
                .enter()
                .append('path')
                .attr('transform',"translate(0," + (
                    fillLegendScale(inputNumbers) - pointerWidth)+ ')'
                     )
                .classed("pointer",true)
                .classed("axis",true)
                .attr('d', function(d) {
                    var y = 0, x = thickness-pointerWidth;
                    return 'M ' + x +' '+ y + ' l ' + pointerWidth + ' ' + pointerWidth + ' l -' + pointerWidth + ' ' + pointerWidth + ' z';
                })
                .attr("fill","grey")
                .attr("opacity","0");

            //whether it's new or not, it updates it.
            pointers
                .transition()
                .duration(1000)
                .attr('opacity',1)
                .attr('transform',"translate(0," + (fillLegendScale(inputNumbers) -14)+ ')')
            //and then it fades the pointer out over 5 seconds.
                .transition()
                .delay(2000)
                .duration(3000)
                .attr('opacity',0)
                .remove();
        }

        selection.each(function(data) {

            function checkScaleType() {
                // AFAIK, d3 scale types aren't easily accessible from the scale itself.
                // But we need to know the scale type for formatting axes properly
                cop = scale.copy();
                cop.range([0, 1]);
                cop.domain([1, 10]);


		if (typeof(cop.invertExtent)!="undefined") {
		    return "quantile"
		}
                if (Math.abs((cop(10) - cop(1)) / Math.log(10) - (cop(10) - cop(2)) / Math.log(5)) < 1e-6) {
                    return "log"
                }
                else if (Math.abs((cop(10) - cop(1)) / 9 - (cop(10) - cop(2)) / 8) < 1e-6) {
                    return "linear"
                }
                else if (Math.abs((cop(10) - cop(1)) / (Math.sqrt(10) - 1) - (cop(10) - cop(2)) / (Math.sqrt(10) - Math.sqrt(2))) < 1e-6) {
                    return "sqrt"
                }
                else {
                    return "unknown"
                }
            }

            var scaleType = checkScaleType();
	    console.log(scaleType)

            var thickness_attr;
            var length_attr;
            var axis_orient;
            var position_variable;
            var axis_transform;
            if (orient === "horizontal") {
		var tmp = [margin.left, margin.right, margin.top, margin.bottom]
		margin.top = tmp[0]
		margin.bottom = tmp[1]
		margin.left = tmp[2]
		margin.right = tmp[3]
                thickness_attr = "height"
                length_attr = "width"
                axis_orient = "bottom"
                position_variable = "x"
                axis_transform = "translate (0," + thickness + ")"
            }
            else {
                thickness_attr = "width"
                length_attr = "height"
                axis_orient = "right"
                position_variable = "y"
                axis_transform = "translate (" + thickness + "," + 0 + ")"
            }

            // select the svg if it exists
            var svg = d3.select(this)
                .selectAll("g.colorbar")
                .data([origin]);

            // otherwise create the skeletal chart
            var svg_enter = svg.enter()
                .append("g")
                .classed("colorbar", true)
		.attr("transform",function(d) {return "translate(" + d[0] + "," + d[1] + ")"})

	    var g_enter = svg_enter
                .append("g")
                .classed("colorbar", true);

            g_enter.append("g")
                .classed("legend", true)
                .classed("rect", true);
            g_enter.append("g")
                .classed("axis", true)
                .classed("color", true);

            svg
                .attr(thickness_attr, thickness + margin.left + margin.right)
                .attr(length_attr, barlength + margin.top + margin.bottom)
                .style("margin-top", origin.y - margin.top + "px")
                .style("margin-left", origin.x - margin.left + "px")


            var transitionDuration = 1000;

            // This either creates, or updates, a fill legend, and drops it
            // on the screen. A fill legend includes a pointer chart can be
            // updated in response to mouseovers, because chart's way cool.

            fillLegend = svg.select("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            fillLegendScale = scale.copy();

	    console.log(fillLegendScale.quantiles())

	    if (typeof(fillLegendScale.invert)=="undefined") {
		fillLegendScale = d3.scale.linear().domain(d3.extent(fillLegendScale.domain()))
	    }

            var legendRange = d3.range(
                0, barlength,
                by=barlength / (fillLegendScale.domain().length - 1));
	    
            legendRange.push(barlength);

            fillLegendScale.range(legendRange.reverse());

            colorScaleRects = fillLegend
                .select(".legend.rect")
                .selectAll('rect')
                .data(d3.range(0, barlength));

            colorScaleRects
                .enter()
                .append("rect")
                .classed("legend", true)
                .style("opacity", 0)
                .style("stroke-thickness", 0)
                .style("fill", function(d) {
                    return scale(fillLegendScale.invert(d));
                })

	    colorScaleRects
                .transition()
                .duration(transitionDuration)
                .style("opacity", 1)
                .attr(thickness_attr, thickness)
                .attr(length_attr, 2) // single pixel thickness produces ghosting
                .attr(position_variable, function(d) {return d;})
                .style("fill", function(d) {
                    return scale(fillLegendScale.invert(d));
                })

            colorScaleRects
                .exit()
                .remove();

            colorAxisFunction = d3.svg.axis()
                .scale(fillLegendScale)
                .orient(axis_orient);

            //Now make an axis
            fillLegend.selectAll(".color.axis")
                .attr("transform", axis_transform)
                .transition()
                .duration(transitionDuration)
                .call(colorAxisFunction);

            //make a title
            titles = fillLegend.selectAll(".axis.title")
                .data([{label: title}])
                .attr("id", "#colorSelector")
                .attr('transform', 'translate (0, -10)')
                .style("text-anchor", "middle")
                .text(function(d) {return d.label});

            titles
                .exit()
                .remove();

            return this;
        });
    }

    function prettyName(number) {

        var comparisontype = comparisontype || function() {return ""}

        if (comparisontype()!='comparison') {
            suffix = ''
            switch(true) {
            case number>=1000000000:
                number = number/1000000000
                suffix = 'B'
                break;
            case number>=1000000:
                number = number/1000000
                suffix = 'M'
                break;
            case number>=1000:
                number = number/1000
                suffix = 'K'
                break;
            }
            if (number < .1) {
                return(Math.round(number*100)/100+suffix)
            }
            return(Math.round(number*10)/10+suffix)
        }
        if (comparisontype()=='comparison') {
            if (number >= 1) {return(Math.round(number)) + ":1"}
            if (number < 1) {return("1:" + Math.round(1/number))}
        }
    }


    //getter-setters
    chart.origin = function(value) {
        if (!arguments.length) return origin;
        origin = value;
        return chart;
    }

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    }

    chart.thickness = function(value) {
        if (!arguments.length) return thickness;
        thickness = value;
        return chart;
    }

    chart.barlength = function(value) {
        if (!arguments.length) return barlength;
        barlength = value;
        return chart;
    }

    chart.title = function(value) {
        if (!arguments.length) return title;
        title = value;
        return chart;
    }

    chart.scale = function(value) {
        if (!arguments.length) return scale;
        scale = value;
        return chart;
    }

    chart.orient = function(value) {
        if (!arguments.length) return orient;
        if (value === "vertical" || value === "horizontal")
            orient = value;
        else
            console.warn("orient can be only vertical or horizontal, not", value);
        orient = value;
        return chart;
    }

    return chart;
}
