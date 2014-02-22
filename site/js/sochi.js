
YUI().use("node", "event-resize",'scrollview-base','scrollview-paginator', function (Y) {

    var data = SOCHIDATA, /*{
            "GB": {
                "medals": 1,
                "hdi_rank": 1
            },
            "RUS": {
                "medals": 25,
                "hdi_rank": 20
            }
        },*/

        maxValues = {
            hdi_rank: 101,
            cpi_rank: 150,
            medals: 30
        },

        comparison = "cpi_rank",// "hdi_rank",
        template = '<span class="flag">.</span>',
        graphNode = Y.one('#graph'),

        graphWidth,
        graphHeight,

        notchHeight,
        notchWidth,

        calculateDimensions = function () {

            var ht = Y.one("#atthebottom").getY(),
                tp = graphNode.getY();

            graphNode.setStyle('height', (ht - tp - 30) + "px");

            graphWidth = parseInt(graphNode.getComputedStyle("width"), 10);
            graphHeight = parseInt(graphNode.getComputedStyle("height"), 10);

            notchHeight = graphHeight / maxValues[comparison];
            notchWidth = graphWidth / maxValues.medals;

        },


        /**
         * Finds the top co-ord
         * @param flagData
         * @param key
         */
         calculateTop = function (flagData, key) {
            return parseInt(graphHeight - ((flagData[key]) * notchHeight), 10);

         },


        /**
         * Calculates left
         * @param flagData
         */
         calculateLeft = function (flagData) {
            return parseInt((flagData.medals.medals_rank - 1) * notchWidth, 10);
         },


        /**
         * Renders the flags
         */
         render = function () {

            var i,
                title = '',
                flagNode;

            for (i in data) {
                if (data.hasOwnProperty(i) && data[i].medals !== undefined) {

                    flagNode = Y.one('#graph .' + i);

                    if (!flagNode) {

                        flagNode = Y.Node.create(template);
                        flagNode.addClass(i);
                        title = data[i].country_name;
                        flagNode.setContent('<img src="img/' + data[i].image_name + '.png" title = "' + title + '" alt="' + i + '"/>');
                        graphNode.append(flagNode);

                    }

                    flagNode.setStyle("top", calculateTop(data[i], comparison) + "px");
                    flagNode.setStyle("left", calculateLeft(data[i]) + "px");
                }
            }
        },


        renderQuadrants = function () {
            var qTempl = '<span class="quadrant"></span>',
                i = 0,
                quadNode,
                ht = parseInt(graphHeight / 2, 10) + "px",
                wd = parseInt(graphWidth/ 2, 10) + "px",
                pos = {
                    0: {top: 0, left:0, width: wd, height: ht, title: "Mud wrestling on ice!"},
                    1: {top: ht, left: 0, width: wd, height: ht, title: "Soap bobsled"},
                    2: {top: ht, left: wd, width: wd, height: ht, title: "Curling"},
                    3: {top: 0, left: wd, width: wd, height: ht, title: "Corrupt and rubbish"}
                };

            for (;i < 4; i++) {
                quadNode = Y.one(".q" + i);
                if (!quadNode) {
                    quadNode = Y.Node.create(qTempl);
                    quadNode.addClass("q" + i);
                    quadNode.setAttribute("title", pos[i].title);

                    graphNode.append(quadNode);
                }
                quadNode.setStyles(pos[i]);
            }



        },



        // The main render for the graph
        init = function () {
            calculateDimensions();
            renderQuadrants();
            render();
        };

    Y.on('windowresize', init);

    // Lets render something
    init();








    ////////////////////////////////////
    // Scrollview
    var scroller = new Y.ScrollView({
        id: "scrollview",
        srcNode: "#dataselector",
        //height: 30,
        width: "50%",
        flick: {
            minDistance: 10,
            minVelocity: 0.3,
            axis: "x"
        }

    });

    scroller.plug(Y.Plugin.ScrollViewPaginator, {
        selector: 'li'
    });
    scroller.render();

    // change indicator
    Y.one("#dataselector").delegate("click", function (ev) {
        comparison = ev.target.getData("key");
        init();
        Y.all("#dataselector li").removeClass("selected");
        ev.target.addClass("selected");

    }, "li");

});