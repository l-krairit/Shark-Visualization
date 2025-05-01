const width = 600,
      height = 270;

const zoom = d3
    .zoom()
    .scaleExtent([1, 8])  
    .translateExtent([[0, 0], [width, height]])
    .on('zoom', zoomed);

const svg = d3
    .select("#map")
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox","0 0  300 300")
    .attr("preserveAspectRatio","xMinYMin")
    .call(zoom);

const projection = d3
    .geoRobinson()
    .scale(80)
    .center([0, 0])
    .translate([width/2.2, height/2]);

const path_line = d3
    .geoPath()
    .projection(projection);

const poly = svg.append("g");
const line = svg.append("g");
const bubble = svg.append("g");

const dataset = "latlong.csv";
const dataset2 = "detailed.csv";
const polygonsURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_polygons_simplified.json";
const polylinesURL = "https://raw.githubusercontent.com/GDS-ODSSS/unhcr-dataviz-platform/master/data/geospatial/world_lines_simplified.json";

d3.csv(dataset).then(function(population) {
    
    const tooltip = d3
        .select("body")
        .append("div")
        .attr("class", "tooltip");

    var allContinent = d3.map(population, function(d){return(d.continent)}).keys()
    const color = d3.scaleOrdinal()
        .domain(allContinent)
        .range(d3.schemeSet2); 

    const mouseover = function(d) {
        tooltip
            .style("opacity", 1)
        d3.select(this)
            .style("fill", "black")
            .style("stroke", "black")
            .style("opacity", 1)
    };
    const mousemove = function(event,d) {
        f = d3
            .format(",")
        tooltip
            .html("<div style='color: white'><b>" + d.location + "</b></div><div style='color: #9ec5de'>Number of Shark Incidents: " + `${f(d.num)}`+"</div>")
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px")
    };

    const mouseleave = function(d) {
        tooltip
            .style("opacity", 0)
        d3.select(this)
            //.style("fill", d => color(d.continent))
            .style("fill", "#d15454")
            .style("stroke", "#822b32")
            .style("opacity", 1)
    };

    const bubbleScale = d3.extent(population, d => +d.num);

    const size = d3
        .scaleSqrt()
        .domain(bubbleScale)
        .range([1, 15]);

    bubble
        .selectAll("circle")
        .data(population)
        .enter()
        .append("circle")
        .join("circle")
        .attr("cx", d => projection([+d.lon, +d.lat])[0])
        .attr("cy", d => projection([+d.lon, +d.lat])[1])
        .attr("r", d => size(+d.num))  
        //.style("fill", d => color(d.continent))
        .style("fill", "#d15454")
        //508fa6
        .attr("stroke", "#822b32")
        .attr("stroke-width", 0.5)
        .attr("fill-opacity", .3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);

    const legendLabel = [1,4,30];
    const xCircle = 30;
    const xLabel = 65;
      
    svg
        .selectAll("legend")
        .data(legendLabel)
        .join("circle")
        .attr("cx", xCircle)
        .attr("cy", d => height - size(d))
        .attr("r", d => size(d))
        .style("fill", "none")
        .attr("stroke", "#666666")
        .attr("stroke-width", 0.75);
    svg
        .selectAll("legend")
        .data(legendLabel)
        .join("line")
        .attr('x1', xCircle)
        .attr('x2', xLabel)
        .attr('y1', d => height - size(d)*2)
        .attr('y2', d => height - size(d)*2)
        .attr('stroke', '#666666')
        .attr("stroke-width", 0.75);
      
    svg
        .selectAll("legend")
        .data(legendLabel)
        .join("text")
        .attr('x', xLabel)
        .attr('y', d => height - size(d)*2)
        .text(d => d3.format(",")(d))
        .style("font-size", "6px")
        .style("fill", "#666666")
        .attr('alignment-baseline', 'middle')

    //const continentOrder = ["North America", "South America", "Europe", "Africa", "Asia", "Australia"];

    /* continent info */
    const continentData = [
        { continent: 'Europe', cases: 7 },
        { continent: 'South America', cases: 11 },
        { continent: 'Asia', cases: 17 },
        { continent: 'Africa', cases: 54 },
        { continent: 'Australia', cases: 168 },
        { continent: 'North America', cases: 311 },
    ];

    const circleWidth = 1000,
    circleHeight = 300;
    const circle_svg = d3
        .select('#circles-container')
        .append('svg')
        .attr('width', circleWidth)
        .attr('height', circleHeight);
    
    const maxSize = 80; 
    const scale = d3
        .scaleSqrt()
        .domain([0, d3.max(continentData, d => d.cases)])
                    .range([10, maxSize]);

    circle_svg
        .selectAll('circle')
        .data(continentData)
        .enter()
        .append('circle')
        //.attr('cx', calculateCx)
        .attr('cx', (d, i) => 100 + i * (100 + 50)) 
        .attr('cy', circleHeight / 2)
        .attr('r', d => scale(d.cases))
        .attr('fill', '#e0a399')
        .attr('opacity', 0.6);

    circle_svg.selectAll('text')
        .data(continentData)
        .enter()
        .append('text')
        .attr('x', (d, i) => 100 + i * (100 + 50)) 
        .attr('y', (circleHeight / 2) + maxSize + 20) 
        .attr('text-anchor', 'middle')
        .attr('fill', '#f0e1e1') 
        .text(d => d.continent);

    circle_svg.selectAll(null)
        .data(continentData)
        .enter()
        .append('text')
        .attr('x', (d, i) => 100 + i * (100 + 50))
        .attr('y', circleHeight / 2 + 4) 
        .attr('text-anchor', 'middle')
        .attr('fill', '#822b32') 
        .text(d => d.cases);
    
});




d3.csv(dataset2).then(function(csvData) {
    const data = d3.range(2015, 2021).map(year => {
        const yearData = csvData.filter(d => +d.Year === year);
        return {
            year: year.toString(),
            attacks: yearData.length,
            fatal: yearData.filter(d => d['Fatal (Y/N)'] === 'Y').length
        };
    });

    /* bar chart */

    const barMargin = { top: 140, right: 0, bottom: 40, left: 30 };
    const barWidth = 600 - barMargin.left - barMargin.right;
    const barHeight = 600 - barMargin.top - barMargin.bottom;

    const maxAttacks = d3.max(data, d => d.attacks);
    const maxFatal = d3.max(data, d => d.fatal);
    const maxYScale = Math.max(maxAttacks, maxFatal);

    const xScale = d3
        .scaleBand()
        .domain(data.map(d => d.year))
        .rangeRound([0, barWidth])
        .padding(0.1);

    const yScale = d3 
        .scaleLinear()
        .domain([0, maxYScale])
        .range([barHeight, 0]);

    const yAxis = d3.axisLeft(yScale);

    var bar_svg = d3
        .select(".left-item")
        .append("svg")
        .attr("width", barWidth + barMargin.left + barMargin.right)
        .attr("height", barHeight + barMargin.top + barMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + barMargin.left + "," + barMargin.top + ")");

    bar_svg
        .append("text")
        .attr("x", barWidth/2)
        .attr("y", -40)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Shark Attacks have decreased over the years");

    bar_svg
        .selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.year))
        .attr("width", xScale.bandwidth())
        .attr("y", d => yScale(d.attacks))
        .attr("height", d => barHeight - yScale(d.attacks));
        

    const lineGenerator = d3.line()
        .x(d => xScale(d.year) + xScale.bandwidth() / 2)
        .y(d => yScale(d.fatal));

    bar_svg
        .append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#822b32")
        .attr("stroke-width", 2);

    bar_svg
        .selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.fatal))
        .attr("r", 5)
        .attr("fill", "#822b32");

    bar_svg
        .append("g")
        .attr("transform", "translate(0," + barHeight + ")")
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .style("fill", "black");

    bar_svg
        .append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .selectAll("text")
        .style("fill", "black");

    const legend_colors = {
        "Total Attacks": "#f0e1e1", 
        "Fatal Incidents": "#822b32"
    };

    const legend = bar_svg
        .append("g")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(Object.entries(legend_colors))
        .enter().append("g")
        .attr("transform", (d, i) => `translate(0,${i * 30})`);
      
      
    legend.each(function(d, i) {
        const g = d3.select(this);
        if (d[0] === "Total Attacks") {
            g.append("rect")
                .attr("x", barWidth - 19)
                .attr("width", 19)
                .attr("height", 19)
                .attr("fill", d[1]);
        } else {
            g.append("circle")
                .attr("cx", barWidth - 10) 
                .attr("cy", 9.5) 
                .attr("r", 5) 
                .attr("fill", d[1]);
            }
    });
      
    legend.append("text")
        .attr("x", barWidth - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d[0]);

    const barTooltip = d3
        .select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    bar_svg
        .selectAll(".point")
        .data(data) 
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.year) + xScale.bandwidth() / 2)
        .attr("cy", d => yScale(d.fatal))
        .attr("r", 5)
        .attr("fill", "#822b32")
        .on("mouseover", function(event, d) {
            barTooltip.transition()
                .duration(0.8)
                .style("opacity", .9);
            barTooltip.html(`Fatal Incidents: ${d.fatal}`)
                .style("left", (event.pageX) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            barTooltip.transition()
                .duration(0.5)
                .style("opacity", 0);
        });

    /* side bar chart */

    const sideMargin = { top: 120, right: 10, bottom: 40, left: 120},
    sideBarWidth = 400;
    sideBarHeight = 250;

    const typeCounts = {
        "Provoked": 0, 
        "Unprovoked": 0,
        "Boating": 0,
    };

    const typeColor = {
        "Provoked": "#b3685b",
        "Unprovoked": "#e0a399",
        "Boating": "#ffe3de",
    }

    csvData.forEach(d => {
        if (typeCounts.hasOwnProperty(d.Type)) {
            typeCounts[d.Type] += 1;
        }
    });

    const totalAttacks = d3.sum(Object.values(typeCounts));
    const typeData = Object.keys(typeCounts).map(type => {
        return { type: type, count: typeCounts[type], percentage: (typeCounts[type] / totalAttacks) * 100 };
    });

    const yScaleSidebar = d3
        .scaleBand()
        .domain(typeData.map(function(d) { return d.type;}))
        .range([0, sideBarHeight])
        .padding(0.1);

    const xScaleSidebar = d3
        .scaleLinear()
        .domain([0, 100]) 
        .range([0, sideBarWidth]);

    
    const sidebar_svg = d3
        .select(".bottom-right-item")
        .append("svg")
        .attr("width", sideBarWidth + sideMargin.left + sideMargin.right)
        .attr("height", sideBarHeight + sideMargin.top + sideMargin.bottom)
        .append("g")
        .attr("transform", "translate(" + sideMargin.left + "," + sideMargin.top + ")");

    sidebar_svg
        .append("text")
        .attr("x", 150)
        .attr("y", -45)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("The types of recorded shark attacks");

    sidebar_svg
        .selectAll(".sidebar")
        .data(typeData)
        .enter()
        .append("rect")
        .attr("x", xScaleSidebar(0) )
        .attr("y", function(d) { return yScaleSidebar(d.type); })
        .attr("width", function(d) { return xScaleSidebar(d.percentage); })
        .attr("height", yScaleSidebar.bandwidth())
        .attr("fill", d => typeColor[d.type]);


    sidebar_svg
        .append("g")
        .call(d3.axisLeft(yScaleSidebar))
        .selectAll("text")
        .style("fill", "black");

    sidebar_svg
        .append("g")
        .attr("transform", "translate(0," + sideBarHeight + ")")
        .call(d3.axisBottom(xScaleSidebar))
        .selectAll("text")
        .style("fill", "black");

    sidebar_svg
        .append("text")
        .attr("transform", `translate(${sideBarWidth / 2}, ${sideBarHeight + sideMargin.bottom})`)
        .style("text-anchor", "middle")
        .text("Percentage of Total Attacks");

    sidebar_svg
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - sideMargin.left)
        .attr("x",0 - (sideBarHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Types")
    
    /* word cloud */

    const text = csvData.map(d => d.Species);
    const wordCounts = {};

    if (text) {
        text.forEach(word => {
            if (word) { 
                word = word.trim().toLowerCase(); 
                if (wordCounts.hasOwnProperty(word)) {
                    wordCounts[word]++;
                } else {
                    wordCounts[word] = 1;
                }
            }
        });
    }

    const myWords = Object.keys(wordCounts).map(key => {
        return { word: key, size: wordCounts[key] }; 
    });

    var cloudWidth = 320,
    cloudHeight = 400;

    const cloudMargin = {top: 150, right: 10, bottom: 10, left: 240};
    var cloud_svg = d3
        .select(".cloud")
        .append("svg")
        .attr("width", cloudWidth)
        .attr("height", cloudHeight)
        .attr("y", 4000)
        .append("g")
        .attr("transform", "translate(" + cloudMargin.left + "," + cloudMargin.top + ")");
    
    var layout = d3.layout
        .cloud()
        .size([cloudWidth, cloudHeight])
        .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(40)       
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })  
        .on("end", draw);
    layout.start();

    function draw(words) { 
        cloud_svg
        .append("g")
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", function(d) { return (d.size + 3) + "px"; })
        .style("fill", "#e0a399")
        .attr("text-anchor", "middle")
        .style("font-family", "TypeWriter", "Lucida Console")
        .attr("transform", function(d) { return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")"; })
        .text(function(d) { return d.text; })
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("pointer-events", "none")
        .attr("text-shadow", "1px 1px 2px #000000")
    }

    cloud_svg
        .append("text")
        .attr("x", -60)
        .attr("y", 220)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Frequency of species occurance");
});

d3.json(polygonsURL).then(function(topology) {
    poly
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.world_polygons_simplified).features)
        .join("path")
        .attr("fill", "#f0e1e1")
        .attr("d", path_line);
});

d3.json(polylinesURL).then(function(topology) {
    line
        .selectAll("path")
        .data(topojson.feature(topology, topology.objects.world_lines_simplified).features)
        .join("path")
        .style("fill","none")
        .style("stroke", "#cccccc")
        .style("stroke-width", 0.2)
        .attr("d", path_line)
        .attr("class", d => d.properties.type)
});

function zoomed(event) {
    const transform = event.transform;
    poly.attr('transform', transform);
    line.attr('transform', transform);
    bubble.attr('transform', transform);
}

function calculateCx(d, i) {
    if (i === 0) return scale(d.cases); 

    let totalWidth = 0;
    for (let j = 0; j < i; j++) {
        totalWidth += 2 * scale(continentData[j].cases) + fixedSpacing;
    }
    return totalWidth + scale(d.cases);
}