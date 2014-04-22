

function update(graph) {
    $(".svg svg").remove()
    var width = 800,
        height = 800;

    var force = d3.layout.force()
        .size([width-30, height-30])
        .charge(-1000)
        .on("tick", tick);

    var drag = force.drag()
        .on("dragstart", dragstart);

    var svg = d3.select(".svg").append("svg")
        .attr("viewBox", "0 0 "+width+" "+height )
        .attr("width", "100%")
        .attr("height", "750px");

    svg.append('marker')
        .attr('id', 'arrow')
        .attr('viewBox', '0 0 10 10')
        .attr('refX', 10)
        .attr('refY', 5)
        .attr('markerWidth', 10)
        .attr('markerHeight', 10)
        .attr('orient', 'auto')
      .append('path')
        .attr('d', 'M 0 10 L 10 5 L 0 0')
        .attr('style','stroke-dasharray: 100')


        svg.append('marker')
                .attr('id', 'triangle')
                .attr('viewBox', '0 0 10 10')
                .attr('refX', 0)
                .attr('refY', 5)
                .attr('markerWidth', 10)
                .attr('markerHeight', 10)
                .attr('orient', 'auto')
              .append('path')
                .attr('d', 'M 9 0 L 0 5 L 9 10 L 9 0');

         svg.append('marker')
                         .attr('id', 'include')
                         .attr('viewBox', '0 0 10 10')
                         .attr('refX', 0)
                         .attr('refY', 5)
                         .attr('markerWidth', 10)
                         .attr('markerHeight', 10)
                         .attr('orient', 'auto')
                       .append('text').text("include")

    var distance={use:120,include:120,extend:120,g:50}

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

        force
              .nodes(graph.nodes)
              .links(graph.links)
              .linkDistance(function(l){
              return distance[l.type]
              })
              .start();

          link = link.data(graph.links)
            .enter().append("path")
              .attr("class", function(l){return "link "+l.type})
               .attr('marker-start',  function(l){return l.type=='g'?'url(#triangle)':'' })
               .attr('marker-end',function(l){return l.type!='g'?'url(#arrow)':'' })

          node = node.data(graph.nodes)
            .enter().append("g")
              .attr("class", "node")
              .attr("data-name",function(n){
                return n.name}
              )
              .on("dblclick", dblclick)
              .call(drag)
          node.append(
            function(n){
                return (n.type=="function")?document.createElementNS("http://www.w3.org/2000/svg","ellipse"):document.createElementNS("http://www.w3.org/2000/svg","circle")
            }
          ).attr("ry", 12).attr("rx",20).attr("r",12)
          node.append("text")
                .attr("dx", 22)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });
    function tick() {
        link.attr('d', function(d) {
            var deltaX = d.target.x - d.source.x,
                deltaY = d.target.y - d.source.y,
                dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                normX = deltaX / dist,
                normY = deltaY / dist,
                sourcePadding = 20,
                targetPadding = 20,
                sourceX = d.source.x + (sourcePadding * normX),
                sourceY = d.source.y + (sourcePadding * normY),
                targetX = d.target.x - (targetPadding * normX),
                targetY = d.target.y - (targetPadding * normY);
            return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;})

      node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    function dblclick(d) {
      d3.select(this).classed("fixed", d.fixed = false);
    }

    function dragstart(d) {
      d3.select(this).classed("fixed", d.fixed = true);
    }
}

function filter(domain,filterFun) {
    var graph = {}
    graph.nodes=[]
    graph.links=[]
    _(domain.functions).each(
        function(f){
            graph.nodes.push( {
                name:f.name,
                type:"function"
            })
        }
    )
    _(domain.entities).each(
        function(e){
            graph.nodes.push( {
                name:e.name,
                type:"entity"
            })
        }
    )
    _(domain.refs).each(
        function(r){
            graph.links.push( {
                source:_(graph.nodes).find(function(n){
                    return n.name == r.from.name
                }),
                target:_(graph.nodes).find(function(n){
                                return n.name == r.to.name
                            }),
                type:r.typ
            })
        }
    )
    var filtered=filterFun?filterFun(graph):graph
    return update(filtered)
}





