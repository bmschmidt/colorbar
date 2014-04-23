function Colorbar() {
    var scale, //the input scale this represents
        fillLegendScale, //a linear scale chart maps the scale onto a bar to be shown here.
        fillLegend,//a d3 selection chart contains all the elements used here;
        origin = {
            x: 125,
            y: 65
        },//where on the parent to put it
        barHeight = d3.min(
            [
            window.innerHeight - 3 * origin.y,
            window.innerHeight * .75]),//how tall the scale should be
        barWidth = 20,//how wide the scale should be.
        title = "",//Dropped on top of the thing.
        scaleType = "linear"; //what--if any--title to put at the top of it.

    var checkScaleType = function() {
        // AFAIK, d3 scale types aren't easily accessible from the scale itself.
        // But we need to know the scale type for formatting axes properly
        cop = scale.copy();
        cop.range([0, 1]);
        cop.domain([1, 10]);
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

    chart = function(selection) {
        selection.each(function(origin) {
            var drag = d3.behavior.drag()
                .on("drag", function(d,i) {
                    d.x += d3.event.dx
                    d.y += d3.event.dy
                    d3.select(this).attr("transform", function(d,i){
                        return "translate(" + d.x + ',' + d.y  + ")"
                    })
                });

            //select svg if it exists
            var svg = d3.select(this)
                .selectAll("svg")
                .data([origin]);

            //otherwise create the skeletal chart
            var g_enter = svg.enter()
                .append("svg")
                .append("g");
                .append('g')
                .attr('id', 'fill-legend')
                .classed("legend", true)
                .classed("color", true);

            g_enter.selectAll(".fill.legend.rect")
                .data(function(d) {return d;})
                .enter()
                .append("g")
                .classed("fill", "true")
                .classed("legend", "true")
                .classed("rect", "true")

            g_enter.selectAll(".color.axis")
                .data(function(d) {return d;})
                .enter()
                .append("g")
                .classed("axis",true)
                .classed("color",true)

            g_enter.selectAll(".axis.title")
                .data(function(d) {return d;})
                .enter()
                .append("text")
                .classed("axis", true)
                .classed("title", true)

            var transitionDuration = 1000;

            //This either creates, or updates, a fill legend, and drops it on the screen.
            //A fill legend includes a pointer chart can be updated in response to mouseovers, because chart's way cool.

            // define some defaults
            //Create a fill legend entry, if it doesn't exist
            var fillLegend = svg.select("g").selectAll("g.legend.color");
            fillLegend
                .data(function(d) {return d;})
                .attr("transform", function(d, i){
                    return "translate(" + d.x + ',' + d.y  + ")";
                })
                .call(drag);

            console.log("fillLegend data", fillLegend.data());

            fillLegendScale = scale.copy();

            legendRange = d3.range(
                0, barHeight,
                by=barHeight / (fillLegendScale.domain().length - 1));
            legendRange.push(barHeight);

            fillLegendScale.range(legendRange.reverse());

            fillRects = fillLegend.select(".fill.legend.rect")

            colorScaleRects = fillRects
                .selectAll('rect')
                .data(d3.range(0, barHeight))

            colorScaleRects
                .enter()
                .append("rect")
                .classed("rect", true)
                .classed("legend", true)
                .style("opacity", 0)
                .style("stroke-width", 0)
                .transition()
                .duration(transitionDuration)
                .attr({
                    width: barWidth,
                    height: 2, //single pixel widths produce ghosting, so 
                    //I just let them overlap;
                    y: function(d) {
                        return d
                    },
                    stroke: function(d) {
                        //the color should be 
                        return scale(fillLegendScale.invert(d));
                    }
                })
                .style({
                    fill: function(d) {
                        //the color should be 
                        return scale(fillLegendScale.invert(d));
                }})

            //If the scale has changed size, some rects are extraneous
            colorScaleRects
                .exit()
                .remove() 

            //'formatter' pretties the name, and drops certain ticks for
            // a log scale. It's overwritten if it's _not_ a log scale.

            function formatter(d) {
                if (scaleType=="log") {
                    var x = Math.log(d) / Math.log(10) + 1e-6;
                    return Math.abs(x - Math.floor(x)) < .7 ? prettyName(d) : "";
                }
                return prettyName(d)
            }

            colorAxisFunction = d3.svg.axis()
                .scale(fillLegendScale)
                .orient("right")
                .tickFormat(formatter)

            //Now to make an axis
            fillLegend.selectAll(".color.axis")
                .attr("transform", "translate (" + barWidth + ", 0)")
                .transition()
                .duration(transitionDuration)
                .call(colorAxisFunction)

            //make a title
            titles = fillLegend.selectAll(".axis.title")
                .data([{label: title}])
                .attr("id","#colorSelector")
                .attr('transform','translate (0, -10)')
                .style("text-anchor","middle")
                .text(function(d) {return d.label})

            titles
                .exit()
                .remove()

            return this;
        });
    };

    prettyName = function(number) {

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

    chart.pointTo = function(inputNumbers) {
        var pointer = fillLegend.selectAll(".pointer")
            var pointerWidth = Math.round(barWidth*3/4);


        //Also creates a pointer if it doesn't exist yet.
        pointers = fillLegend
            .selectAll('.pointer')
            .data([inputNumbers])

        pointers
            .enter()
            .append('path')
            .attr('transform',"translate(0," + (
                fillLegendScale(inputNumbers) - pointerWidth)+ ')'
                )
            .classed("pointer",true)
            .classed("axis",true)
            .attr('d', function(d) {
                var y = 0, x = barWidth-pointerWidth;
                return 'M ' + x +' '+ y + ' l ' + pointerWidth + ' ' + pointerWidth + ' l -' + pointerWidth + ' ' + pointerWidth + ' z';
            })
            .attr("fill","grey")
            .attr("opacity","0")

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
                .remove()
    }

    //getter-setters
    chart.origin = function(x) {
        if (!arguments.length) return origin;
        origin = x
            return chart
    }

    chart.barWidth = function(x) {
        if (!arguments.length) return barWidth;
        barWidth= x
            return chart
    }

    chart.barHeight = function(x) {
        if (!arguments.length) return barHeight;
        barHeight= x
            return chart
    }

    chart.orientation = function(x) { 
        if (!arguments.length) return orientation; 
        orientation= x;
        return chart;
    } 

    chart.title = function(x) {
        if (!arguments.length) return title;
        title=x
            fillLegend
            .selectAll(".axis.title")
            .text(x)
            return chart
    }


    chart.scale = function(value) {
        if (!arguments.length) return scale;
        scale=value
            scaleType = checkScaleType()
            return chart
    }

    return chart;
}
