function removeNode(index){
    node_imgSVG[0][index].remove();
    var node = node_imgSVG[0];
    node_textSVG[0][index].remove();

    var edgesStr = node[index].attributes[0].value;
    var edges = edgesStr.split(",");
    for (var i=0;i<edges.length;i++){
        var edgeIndex = edges[i];
        if (edgeIndex!=""){
            edges_lineSVG[0][edgeIndex].remove();
            edges_textSVG[0][edgeIndex].remove();
        }
    }
}

function addNode(nodeArrays, linkArrays) {
    var lenNodes = nodeArrays.length;
    var lenLinks = linkArrays.length;
    if (lenNodes > 0) {
        for (var i = 0; i < lenNodes; i = i + 5000) {
            jsonContext.nodes.push.apply(jsonContext.nodes, nodeArrays.slice(i, Math.max(i + 5000, lenNodes)));
        }
    }
    if (lenLinks > 0) {
        for (var i = 0; i < lenLinks; i = i + 5000) {
            jsonContext.edges.push.apply(jsonContext.edges, linkArrays.slice(i, Math.max(i + 5000, lenNodes)));
        }
    }
    updateGraphJSON(jsonContext);
}