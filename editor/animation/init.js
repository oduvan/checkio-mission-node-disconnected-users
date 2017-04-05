//Dont change it
//Dont change it
requirejs(['ext_editor_io', 'jquery_190', 'raphael_210'],
    function (extIO, $) {
        
        function disconnectedUsersCanvas(dom, dataInp, dataExp) {

            // func: difference(): ary1 - ary2
            var difference = function(a1, a2) {
                var rs = [];
                for (var i=0; i < a1.length; i += 1) {
                    if (a2.indexOf(a1[i]) === -1)
                        rs.push(a1[i]);
                }
                return rs;
            };

            // func: intersection(): ary1 & ary2
            var intersection = function(a1, a2) {
                var rs = [];
                for (var i=0; i < a1.length; i += 1) {
                    for (var j=0; j < a2.length; j += 1) {
                        if (a1[i] == a2[j] && rs.indexOf(a1[i]) === -1)
                            rs.push(a1[i]);
                    }
                }
                return rs;
            };   

            // func: union(): ary1 | ary2
            var union = function(a1, a2) {
                var rs = [];
                for (var i=0; i < a2.length; i += 1) {
                    if (a1.indexOf(a2[i]) === -1)
                        rs.push(a2[i]);
                }
                return a1.concat(rs);
            };

            // solution
            function disconnectedUsers(net, users, source, crushes) {

                var net_dic = {};
                var all_nodes = [];
                net.forEach(nodes=>{
                    all_nodes = union(all_nodes, nodes);
                    if (intersection(nodes, crushes).length == 0) {
                        const [n1, n2] = nodes;
                        net_dic[n1] = union(net_dic[n1] || [], [n2]);
                        net_dic[n2] = union(net_dic[n2] || [], [n1]);
                    }
                });
                var next_nodes = net_dic[source] || [];
                var live_nodes = union(next_nodes, [source]);
                while (next_nodes.length) {
                    const search_nodes = next_nodes.slice();
                    next_nodes = [];
                    search_nodes.forEach(sn=>{
                        next_nodes = union(next_nodes, net_dic[sn]);
                    });
                    live_nodes = union(live_nodes, next_nodes);
                    next_nodes = difference(next_nodes, live_nodes);
                };
                return difference(all_nodes, live_nodes);
            }

            //
            // draw start
            //
            var color = {
                blue: "#65A1CF",
                base: "#294270",
                orange: "#FAAB00",
                erase: "#DFE8F7",
                white: "#FFFFFF",
            };
            var delay = 200;
            var ord = 0;
            var [net, users, source, crush] = dataInp,
                nodes = {};
            console.log(net, users, source, crush);

            for (var i=0; i < net.length; i += 1) {
                for (var j=0; j < 2; j+=1) {
                    var [n1, n2] = [net[i][j], net[i][1-j]];
                    if (! nodes[n1]) {
                        nodes[n1] = {
                            net: [n2], 
                            co: dataExp[1].indexOf(n1),
                            num: ord
                        };
                        ord += 1;
                    } else {
                        nodes[n1].net.push(n2);
                    }
                }
            }

            function createCirclesCanvas(paper, circlesSet) {
                var radius = 15;
                var attrCircle = {
                    "stroke": color.base,
                    "stroke-width": 3, 
                    "fill": color.white
                };
                for (var n in nodes) {
                    var [x, y] = [nodes[n].co % 5,
                        Math.floor(nodes[n].co / 5)];
                    circlesSet.push(
                        paper.circle(
                            x * 63 + 20, 
                            y * 63 + 22, 
                            radius
                        ).attr(attrCircle));
                    circlesSet[circlesSet.length-1].nod = n;
                    circlesSet[circlesSet.length-1].usr = users[n];
                }
                return paper;
            }

            function createLinePath(x1, y1, x2, y2) {
                return "M" + x1 + "," + y1 + "L" + x2 + "," + y2;
            }

            //
            // M A I N
            //
            var canvas = Raphael(dom, 300, 300, 0, 0);
            var circleSet = canvas.set();

            // drow circles of nodes
            createCirclesCanvas(canvas, circleSet);

            // text set
            var numbers = canvas.set();
            var attrText = {"stroke": color.base, "font-size": 14};
            for (var i = 0; i < circleSet.length; i+=1) {
                numbers.push(canvas.text(
                    circleSet[i].attr().cx,
                    circleSet[i].attr().cy,
                    circleSet[i].nod
                ).attr(attrText));
            }

            // draw blue line (and prepare animate line)
            var lineDict = canvas.set();
            var attrLine = {"stroke-width": 4, "stroke": color.blue};
            var attrLine_orange
                = {"stroke-width": 4, "stroke": color.orange};
            net.forEach((edge)=>{
                var start = nodes[edge[0]].num;
                var end = nodes[edge[1]].num;
                var x1 = circleSet[start].attr().cx;
                var y1 = circleSet[start].attr().cy;
                var x2 = circleSet[end].attr().cx;
                var y2 = circleSet[end].attr().cy;
                canvas.path(createLinePath(x1, y1, x2, y2)).attr(attrLine);
                var an_line1 = canvas.path(createLinePath(x1, y1, x1, y1));
                var an_line2 = canvas.path(createLinePath(x2, y2, x2, y2));
                lineDict[edge[0] + edge[1]] = an_line1;
                lineDict[edge[1] + edge[0]] = an_line2;
            });

            lineDict.toFront();
            circleSet.toFront();
            numbers.toFront();

            // crush !
            crush.forEach(c=>{
                for (var i=0; i < nodes[c].net.length; i += 1) {
                    const   n = nodes[c].net[i],
                            c_crush = circleSet[nodes[c].num],
                            c_next = circleSet[nodes[n].num];
                    lineDict[n+c].attr(
                        {"stroke-width": 5, "stroke": color.erase});
                    lineDict[n+c].animate({
                        "path": createLinePath(
                            c_crush.attr().cx, c_crush.attr().cy, 
                            c_next.attr().cx, c_next.attr().cy ),
                    }, delay * 3);
                }
            });

            // solution execute
            const dead_nodes = disconnectedUsers(net, users, source, crush);

            // prepare Source Node
            circleSet[nodes[source].num].attr({'fill': color.orange});
            var src_nodes = [source];

            // start send mail
            var phase = 1;
            var delivered_nodes = [source];
            while (src_nodes.length) {
                var next_nodes = [];
                for (var i=0; i < src_nodes.length; i+=1) {
                    const src_node = src_nodes[i];
                    const rcv_nodes
                        = difference(nodes[src_node].net, dead_nodes);
                    for (var j=0; j < rcv_nodes.length; j+=1) {
                        var rcv_node = rcv_nodes[j];
                        setTimeout(function () {
                            var src_n = src_nodes;
                            var rcv_n = rcv_nodes;
                            var ii = i;
                            var jj = j;
                            return function(){
                                var src = src_n[ii];
                                var rcv = rcv_n[jj];
                                var c_src = circleSet[nodes[src].num];
                                var c_rcv = circleSet[nodes[rcv].num];
                                lineDict[src+rcv].attr(
                                    {'stroke-width': 4, 
                                        'stroke':color.orange});
                                lineDict[src+rcv].animate({
                                    "path": createLinePath(
                                        c_src.attr().cx, c_src.attr().cy, 
                                        c_rcv.attr().cx, c_rcv.attr().cy 
                                )}, delay * 2);
                            };
                        }(), delay * 2 * phase);
                        setTimeout(function () {
                            var src_n = src_nodes;
                            var rcv_n = rcv_nodes;
                            var ii = i;
                            var jj = j;
                            return function(){
                                var src = src_n[ii];
                                var rcv = rcv_n[jj];
                                circleSet[nodes[rcv].num].animate({
                                    'fill': color.orange}, delay * 2 * 1.5);
                            };
                        }(), delay * 2 * (phase+1));

                        next_nodes.push(rcv_node);
                    }
                }
                next_nodes
                    = difference(next_nodes, delivered_nodes);
                delivered_nodes
                    = union(delivered_nodes, next_nodes);
                src_nodes = next_nodes.slice();
                phase += 2;
            }
            for (var k=0; k < dead_nodes.length; k += 1) {
                setTimeout(function () {
                    var dead_n = dead_nodes;
                    var kk = k;
                    return function(){
                        numbers[nodes[dead_n[kk]].num].animate(
                            {'stroke': 'white', 'stroke-width': 5},
                            delay * 3);
                    };
                }(), delay * 2 * (phase+1));
            }
            phase += 1;
            for (var k=0; k < dead_nodes.length; k += 1) {
                phase += 1;
                setTimeout(function () {
                    var dead_n = dead_nodes;
                    var kk = k;
                    return function(){
                        numbers[nodes[dead_n[kk]].num].animate(
                            {'stroke': color.base, 'stroke-width': 1},
                            delay * 3);
                        numbers[nodes[dead_n[kk]].num].attr(
                            'text', users[dead_n[kk]]);

                    };
                }(), delay * 2 * (phase+1));
            }
        }
        var $tryit;

        var io = new extIO({
            multipleArguments: true,
            functions: {
                js: 'disconnectedUsers',
                python: 'disconnected_users'
            },
            animation: function($expl, data){
                if (!data.ext || !data.ext.explanation) {
                    return;
                }
                var expl = data.ext.explanation;
                //$expl.addClass('error').addClass('output').html(expl[0]);
                $expl.addClass('output').html(expl[0]);
                disconnectedUsersCanvas(
                    $expl[0],
                    data.in,
                    data.ext.explanation ? data.ext.explanation : {});
            }

        });
        io.start();
    }
);
