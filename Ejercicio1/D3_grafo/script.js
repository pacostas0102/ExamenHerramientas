console.log ("Inicializando Script")

url = "https://raw.githubusercontent.com/pacostas0102/ExamenHerramientas/refs/heads/main/Ejercicio1/Data/DataGrafoD3.js"

d3.json(url).then(function(data){

    // Creamos escala de color
    let escalaColor = d3.scaleOrdinal(d3.schemeCategory10)

    // Creamos el LAYOUT general
    let layout = d3.forceSimulation()
            .force("link", d3.forceLink().id(d=>d.id))
            .force("charge", d3.forceManyBody())
            .force("center", d3.forceCenter(350,350))

    // Creamos el LAYOUT de los nodos y links
    layout
            .nodes(data.nodes)
            // función para actualizar posición
            .on("tick", onTick) 

    layout  
            .force("link")
            .links(data.links)

    // Crear espacio svg
    let svg = d3.select("body")
            .append("svg")
            .attr("width", 900)
            .attr("height", 900)

    // Crear el espacio para las líneas
    let links = svg
            .append ("g")
            .attr("class", "links")
            .selectAll("line")
            .data(data.links)
            .join("line")
            .style ("stroke-width", d=>d.value55)
            //.style("stroke", "#aaa")
            .style ("stroke", d => {
                if (d.source.group == d.target.group)
                    return (escalaColor(d.source.group))
                else
                    return ("#aaa")       
            })
    
    // Crear el espacio para los nodos
    let nodes = svg
            .append("g")
            .attr("class", "nodes")
            .selectAll("g")
            .data(data.nodes)
            .join("g")
            .attr("r", 5)
            .attr("fill", d => escalaColor(d.group))
    
    circles = nodes.append("circle")
            .attr("r",5)
            .attr("fill", d => escalaColor(d.group))
            // Preparar el movimiento interactivo de los nodos
            .call(d3.drag()
                .on("start", (event, d) => dragstarted(event, d))
                .on("drag", (event, d) => dragged(event, d))
                .on("end", (event, d) => dragended (event, d))
        )

    let labels = nodes.append("text")
        .text(function(d) { return d.id; })
        .attr('x', 6)
        .attr('y', 3);

    nodes.append("title")
        .text(function(d) { return d.id; });

    // Definimos función onTick
    function onTick(){
            nodes.attr("transform", function(d) {
                  return "translate(" + d.x + "," + d.y + ")";
                })
            links
            .attr("x1", d => d.source.x)
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
         }
         
         // Añadimos las funciones de movimiento
         function dragstarted(event, d) {
            if (!event.active) layout.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) layout.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }
});