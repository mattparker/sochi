
YUI().use("node", "event-resize", function (Y) {

    var data = {
            "GB": {
                "medals": 1,
                "hdi_rank": 1
            },
            "RUS": {
                "medals": 25,
                "hdi_rank": 20
            }
        },

        maxValues = {
            hdi_rank: 20,
            medals: 25
        },

        comparison = "hdi_rank",
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
            return parseInt((flagData.medals - 1) * notchWidth, 10);
         },


        /**
         * Renders the flags
         */
         render = function () {

            var i,
                flagNode;

            for (i in data) {
                if (data.hasOwnProperty(i)) {

                    flagNode = Y.one('#graph .' + i);

                    if (!flagNode) {

                        flagNode = Y.Node.create(template);
                        flagNode.addClass(i);
                        flagNode.setContent('<img src="img/' + i.toLowerCase().substr(0, 2) + '.png" alt="' + i + '"/>');
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
                    0: {top: 0, left:0, width: wd, height: ht},
                    1: {top: ht, left: 0, width: wd, height: ht},
                    2: {top: ht, left: wd, width: wd, height: ht},
                    3: {top: 0, left: wd, width: wd, height: ht}
                };

            for (;i < 4; i++) {
                quadNode = Y.one(".q" + i);
                if (!quadNode) {
                    quadNode = Y.Node.create(qTempl);
                    quadNode.addClass("q" + i);

                    graphNode.append(quadNode);
                }
                quadNode.setStyles(pos[i]);
            }



        },




        init = function () {
            calculateDimensions();
            renderQuadrants();
            render();
        };

    Y.one('#render').on('click', init);

    Y.on('windowresize', init);



});