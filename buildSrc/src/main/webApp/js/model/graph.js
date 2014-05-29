(function(){
    var hideTimeout=null
    var graphZoom=0.7
    var panZoomTiger = null

    $(document).on('click','.btn-node-focus',function(e){
        var name=$(this).attr("data-node-name")
        tip.hide()
        addFocus(name)
        applySearches()

    })
    .on("mouseover",'.btn-node-focus',function(e){
        clearTimeout(hideTimeout)
    }).on("mouseleave",'.btn-node-focus',function(e){
        hideTimeout=
                 setTimeout(function(){tip.hide()},300)
    })
    var tip=d3.tip()
            .attr('class','d3-tip')
            .offset([-5,0])
            .html(function (n){
                        return toolbar(n)
                    })
    function toolbar(n){
            var button=$("<button/>").text('Focus. ').attr('type','button')
                .addClass('btn btn-node-focus btn-default').attr('data-node-name',n.name)

            button.append($("<i/>").addClass("fa fa-crosshairs"))
            var group=$("<div/>").addClass('btn-group btn-group-xs')
            group.append(button)
            return group[0].outerHTML
        }

    var force=null;
    var fwidth = 1600,fheight = 1600;







    window.initGraph=function (){
        var distance={use:120,include:120,extend:120,g:50}
        var svg = d3.select(".svg").append("svg")
        force = d3.layout.force()
                .size([fwidth-30, fheight-30])
                .charge(-1000)
                .on("tick", tick)
                .linkDistance(function(l){
                    return distance[l.type]
                })

        function tick() {

            var link = svg.select(".viewport").selectAll(".link"),
            node = svg.select(".viewport").selectAll(".node");
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
                return 'M' + sourceX + ',' + sourceY + 'L' + targetX + ',' + targetY;
            })
          node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
        }
        svg.append("g").attr("class","viewport")
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

         panZoomTiger = svgPanZoom('.svg svg',{minZoom: 0.2,onZoom: function(e){
                     d3.selectAll('text').style('visibility',e<0.8?'hidden':'visible')
                     graphZoom=e
                 }})
    }


    window.update=function(graph) {
        var svg = d3.select(".svg").select("svg")
        tip.hide()
        var drag = force.drag()
            .on("dragstart", dragstart);

        var link = svg.select(".viewport").selectAll(".link"),
            node = svg.select(".viewport").selectAll(".node");
            //TODo don't reset force nodes/links, use add/remove
         force
                    .nodes(graph.nodes)
                    .links(graph.links).start();

          link = link.data(graph.links,function(l){return ""+l.source.name+l.target.name+l.type})

          link.enter().append("path")
              .attr("class", function(l){return "link "+l.type})
               .attr('marker-start',  function(l){return l.type=='g'?'url(#triangle)':'' })
               .attr('marker-end',function(l){return l.type!='g'?'url(#arrow)':'' })
          link.exit().remove()

          node=node.data(graph.nodes,function(n){return n.name})
          var nodeE =node.enter()
          node.exit().remove()

          var nodeG=nodeE.append("g")
              .attr("class", "node")
              .attr("data-name",function(n){
                return n.name}
              )
              .on("dblclick", dblclick)
              .call(drag)

          nodeG.append(
            function(n){
                return (n.type=="function")?document.createElementNS("http://www.w3.org/2000/svg","ellipse"):document.createElementNS("http://www.w3.org/2000/svg","circle")
            }
          ).attr("ry", 12).attr("rx",20).attr("r",12)

          nodeG.append("text")
                .attr("dx", 22)
                .attr("dy", ".35em")
                .text(function(d) { return d.name });

          node.selectAll("g.markers").remove()
          node.append("g").attr("class","markers")

          node.call(tip)
          .on('mouseover',function(n){
              clearTimeout(hideTimeout)
              tip.hide()
              tip.show(n)
          })
          .on('mouseout',function(n){
            hideTimeout=
             setTimeout(function(){tip.hide()},300)
          })




        //300 =~= svg.width(750) /2
        panZoomTiger.pan({x:-fwidth/2+300, y:-fheight/2+300})
        panZoomTiger.zoom(graphZoom)
        //FIXME panzoom overrode node mouse event. drag/dbclick etc.
    //    graphZoom=panZoomTiger.getZoom()



        function dblclick(d) {
          d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
          d3.select(this).classed("fixed", d.fixed = true);
        }
    }



    window.filter=function(domain,filterFun) {
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

    })()



