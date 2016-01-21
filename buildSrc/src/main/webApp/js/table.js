function fullTable(){
    initTree()
}

function initTree() {
      if (window.goSamples) goSamples();  // init for these samples -- you don't need to call this
      var $ = go.GraphObject.make;  // for conciseness in defining templates

      treeDiagram =
        $(go.Diagram, "treeDiagram",
          {
            allowMove: false,
            allowCopy: false,
            allowDelete: false,
            allowHorizontalScroll: false,
            layout:
              $(go.TreeLayout,
                {
                  alignment: go.TreeLayout.AlignmentStart,
                  angle: 0,
                  compaction: go.TreeLayout.CompactionNone,
                  layerSpacing: 16,
                  layerSpacingParentOverlap: 1,
                  nodeIndent: 2,
                  nodeIndentPastParent: 0.88,
                  nodeSpacing: 0,
                  setsPortSpot: false,
                  setsChildPortSpot: false
                })
        });

      treeDiagram.nodeTemplate =
        $(go.Node,
          // no Adornment: instead change panel background color by binding to Node.isSelected
          { selectionAdorned: false },
          $("TreeExpanderButton",
            {
              width: 14,
              "ButtonBorder.fill": "whitesmoke",
              "ButtonBorder.stroke": null,
              "_buttonFillOver": "rgba(0,128,255,0.25)",
              "_buttonStrokeOver": null
            }),
          $(go.Panel, "Horizontal",
            { position: new go.Point(16, 0) },
            new go.Binding("background", "isSelected", function (s) { return (s ? "lightblue" : "white"); }).ofObject(),

            $(go.TextBlock,
              new go.Binding("text", "key", function(s) { return  s; }))
          )  // end Horizontal Panel
        );  // end Node

      // without lines
      treeDiagram.linkTemplate = $(go.Link);

//      // with lines
//      treeDiagram.linkTemplate =
//        $(go.Link,
//          { selectable: false,
//            routing: go.Link.Orthogonal,
//            fromEndSegmentLength: 4,
//            toEndSegmentLength: 4,
//            fromSpot: new go.Spot(0.001, 1, 7, 0),
//            toSpot: go.Spot.Left },
//          $(go.Shape,
//            { stroke: "lightgray" }));

        var packageNodedata = _(packages()).map(packageData)
        var entityNodedata = _(entities()).map(entityData)

        var nodeDataArray = _(entityNodedata).union(packageNodedata)
      treeDiagram.model = new go.TreeModel(nodeDataArray);
    }


