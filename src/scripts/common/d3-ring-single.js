/**
 * This is a pure D3.js ring-single inspired by the http://bl.ocks.org/clayzermk1/9142407, http://bl.ocks.org/mbostock/4063269 and http://bl.ocks.org/mbostock/45943c4af772e38b4f4e .
 */
var d3 = require('d3');
exports = module.exports = function () {
  'use strict';
  // Public variables with default settings
  // 画布相关属性
  var width = 720;
  var height = 720;
  var backgroundColor = '#fff';
  // 数据
  var value;
  // 轨道相关属性
  var isClockwise = true;
  var orbitColor = [];
  var orbitWidth = 1;
  // 小圆球相关属性
  var ballNum = 12;
  var ballSize = [12, 24];
  var isEquant = true;
  var ballTextOutSize = 12;
  // 小圆球文字相关属性
  var firstQuadrantDominantBaseline = 'text-before-edge';
  var firstQuadrantTextAnchor = 'end';
  var secondQuadrantDominantBaseline = 'text-after-edge';
  var secondQuadrantTextAnchor = 'end';
  var thirdQuadrantDominantBaseline = 'text-after-edge';
  var thirdQuadrantTextAnchor = 'start';
  var fourthQuadrantDominantBaseline = 'text-before-edge';
  var fourthQuadrantTextAnchor = 'start';
  // 轨道弧线文字相关属性
  var textPathArc = [2 * Math.PI * .75, 2 * Math.PI];
  var textAfterEdge = '';
  var textAfterEdgeColor = '#000';
  var textAfterEdgeSize = 24;
  var textAfterEdgeStartOffset = '0';
  var textAfterTextAnchor = 'start';
  var textAfterEdgeDominantBaseline = 'text-after-edge';
  var textBeforeEdge = '';
  var textBeforeEdgeColor = '#000';
  var textBeforeEdgeSize = 18;
  var textBeforeEdgeStartOffset = '0'
  var textBeforeTextAnchor = 'start';
  var textBeforeEdgeDominantBaseline = 'text-before-edge';

  // Private variables
  // 弧度常量
  var PI = Math.PI;
  var twoPI = 2 * PI;
  var n = 500;
  // 轨道默认颜色是否使用彩虹色
  var orbitRainbow = true;
  //
  var a;
  var b;
  var c;
  var cosc;
  var hudu = 0;
  var X;
  var Y;
  var x;
  var y;

  function chart(selection) {
    selection.each(function () {
      // 轨道颜色比例尺
      var orbitColorScale = d3.scaleLinear()
        .domain([0, ballNum])
        .range([orbitColor[0], orbitColor[1]]);
      // 小圆球大小比例尺
      var ballSizeScale = d3.scaleLinear()
        .domain([0, ballNum])
        .rangeRound([ballSize[1], ballSize[0]]);
      // 画布中一些宽度常量
      var radius = Math.min(width, height);
      var radii = {
        'sun': radius / 8,
        'earthOrbit': radius / 3,
        'rectArea': Math.sqrt(Math.pow(radius * .8, 2) / 2)
      };
      var tooltip = selection.append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0.0);
      // Current position of Text in its orbit
      var textOrbitPosition = d3.arc()
        .outerRadius(radii.earthOrbit + 1)
        .innerRadius(radii.earthOrbit - 1)
        .startAngle(textPathArc[0])
        .endAngle(textPathArc[1]);

      // svg区域
      var svg = d3.select(this).append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('background-color', backgroundColor)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
      // 中心区域
      createCenterArea(svg);
      // 轨道
      createOrbit(svg);
      // 创建圆
      createCircle(svg);
      // 创建文字
      createText(svg);

      // 创建文字
      function createText(dom) {
        var circleText = dom.append('g')
          .attr('class', 'circleText');

        circleText.append('path')
          .attr('id', 'curve_' + Math.random())
          .attr('d', textOrbitPosition)
          .style('fill', 'none');
        circleText.append('text')
          .attr('id', 'curve-text-after')
          .style('font-size', textAfterEdgeSize)
          .attr('fill', textAfterEdgeColor)
          .append('textPath')
          .attr('xlink:href', '#' + circleText.select('path').attr('id'))
          .attr('text-anchor', textAfterTextAnchor)
          .attr('startOffset', textAfterEdgeStartOffset)
          .attr('dominant-baseline', textAfterEdgeDominantBaseline)
          .text(textAfterEdge);
        circleText.append('text')
          .attr('id', 'curve-text-before')
          .style('font-size', textBeforeEdgeSize)
          .style('fill', textBeforeEdgeColor)
          .append('textPath')
          .attr('xlink:href', '#' + circleText.select('path').attr('id'))
          .attr('text-anchor', textBeforeTextAnchor)
          .attr('startOffset', textBeforeEdgeStartOffset)
          .attr('dominant-baseline', textBeforeEdgeDominantBaseline)
          .text(textBeforeEdge);
      }
      /**
       * 创建圆
       *
       * @param {any} dom 操作区域
       */
      function createCircle(dom) {
        dom.selectAll('g.node')
          .data(value)
          .enter()
          .append('g')
          .attr('class', 'node');

        dom.selectAll('g.node')
          .data(value)
          .exit()
          .remove();

        var nodeData = dom.selectAll('g.node')
          .data(value);
        nodeData.append('circle')
          .attr('class', 'node-circle')
          .attr('id', function (d) { return d.id; })
          .attr('r', function (d, i) { return ballSizeScale(i); })
          .style('fill', function (d, i) { return orbitColorScale(i); });
        nodeData.append('clipPath')
          .attr('class', 'node-clipPath')
          .attr('id', function (d) { return 'clip-' + d.id; })
          .append('use')
          .attr('xlink:href', function (d) { return '#' + d.id; });
        nodeData.append('text')
          .attr('class', 'node-text-in')
          .attr('clip-path', function (d) { return 'url(#clip-' + d.id + ')'; })
          .append('tspan')
          .attr('x', function (d, i) { return i < 9 ? (-ballSizeScale(i) * .25) : (-ballSizeScale(i) * .5) })
          .attr('y', function (d, i) { return ballSizeScale(i) * .25 })
          .style('fill', 'white')
          .style('font-size', function (d, i) { return ballSizeScale(i) * .8; })
          .text(function (d, i) { return i + 1; });
        nodeData.append('title')
          .attr('class', 'node-text-in-title')
          .text(function (d, i) { return i + 1; });
        nodeData.append('text')
          .attr('class', 'node-text-out')
          .attr('x', 0)
          .attr('y', 0)
          .style('fill', 'block')
          .style('font-size', function (d, i) { return ballTextOutSize; })
          .text(function (d) { return d.name; });
        nodeData.each(function (d, i) {
          if (isEquant) {
            hudu = (i + 0) * (2 * Math.PI / ballNum);
          } else {
            if (i == 0) {
              d3.select(this).attr('transform', 'translate(' + 0 + ',' + -(radii.earthOrbit + ballSizeScale(i)) + ')');
            } else {
              a = radii.earthOrbit + ballSizeScale(i);
              b = radii.earthOrbit + ballSizeScale(i + 1);
              c = ballSizeScale(i) + ballSizeScale(i + 1);
              cosc = (Math.pow(a, 2) + Math.pow(b, 2) - Math.pow(c, 2)) / (2 * a * b);
              hudu += Math.acos(cosc);
            }
          }
          X = Math.sin(isClockwise ? hudu : (2 * Math.PI - hudu)) * (radii.earthOrbit + ballSizeScale(i));
          Y = Math.cos(isClockwise ? hudu : (2 * Math.PI - hudu)) * (radii.earthOrbit + ballSizeScale(i));
          d3.select(this).attr('transform', 'translate(' + X + ',' + -Y + ')');
          x = Math.sin(isClockwise ? (2 * Math.PI - hudu) : hudu) * ballSizeScale(i);
          y = Math.cos(isClockwise ? (2 * Math.PI - hudu) : hudu) * ballSizeScale(i);
          var nodeTextOut = d3.select(this).select('text.node-text-out')
            .attr('transform', 'translate(' + x + ',' + y + ')');
          // setTextOfcircle(nodeTextOut, acos);
          setTextOfcircle(nodeTextOut, isClockwise ? hudu : (2 * Math.PI - hudu));

          d3.select(this).on('mouseover', function (d) {
            tooltip.html(d.name + '<br />' +
              '排名' + d.ranking + '<br />')
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY + 20) + 'px')
              .style('opacity', 1.0);
          }).on('mousemove', function (d) {
            tooltip.style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY + 20) + 'px');
          }).on('mouseout', function (d) {
            tooltip.style('opacity', 0.0);
          })
        });

        // 小圆文字布局
        function setTextOfcircle(dom, hudu) {
          // 四象限设置
          if (hudu > 0 && hudu < Math.PI * .5) {
            execTextOfcircleLayout(dom, firstQuadrantDominantBaseline, firstQuadrantTextAnchor);
          } else if (hudu < Math.PI * 1) {
            execTextOfcircleLayout(dom, secondQuadrantDominantBaseline, secondQuadrantTextAnchor);
          } else if (hudu < Math.PI * 1.5) {
            execTextOfcircleLayout(dom, thirdQuadrantDominantBaseline, thirdQuadrantTextAnchor);
          } else {
            execTextOfcircleLayout(dom, fourthQuadrantDominantBaseline, fourthQuadrantTextAnchor);
          }
          // 对特殊角度进行单独设置
          if (hudu == 0 || hudu == 2 * Math.PI) {
            execTextOfcircleLayout(dom, 'text-before-edge', 'middle');
          } else if (hudu == Math.PI * .5) {
            execTextOfcircleLayout(dom, 'central', 'end');
          } else if (hudu == Math.PI * 1) {
            execTextOfcircleLayout(dom, 'text-after-edge', 'middle');
          } else if (hudu == Math.PI * 1.5) {
            execTextOfcircleLayout(dom, 'central', 'start');
          }
        }
        // 小圆文字布局
        function execTextOfcircleLayout(dom, baseline, textAnchor) {
          dom.attr('dominant-baseline', baseline)
            .attr('text-anchor', textAnchor);
        }
      }
      /**
       * 创建轨道
       *
       * @param {any} dom 操作区域
       */
      function createOrbit(dom) {
        var orbit = dom.selectAll('path')
          .data(d3.range(0, twoPI, twoPI / n))
          .enter()
          .append('path')
          .attr('class', 'earthOrbitPosition')
          .attr('d', d3.arc()
            .outerRadius(radii.earthOrbit + orbitWidth / 2)
            .innerRadius(radii.earthOrbit - orbitWidth / 2)
            .startAngle(function (d) { return d; })
            .endAngle(function (d) { return d + twoPI / n * 1.1; })); // 1.1可以避免出现块裂痕
        if (orbitRainbow) {
          orbit.style('fill', function (d) { return d3.hsl(d * 360 / twoPI, 1, .5); });
        } else {
          orbit.style("fill", function (d, i) { return orbitColorScale(i); });
        }
      }
      // 创建中心区域图
      function createCenterArea(dom) {
        dom.append("circle")
          .attr("class", "sun")
          .attr("r", radii.sun)
          .style("fill", "none");
      }
    });
  }

  // Getter/setter function
  chart.width = function (_) {
    if (!arguments.length) {
      return width;
    }
    width = _;
    return chart;
  };
  chart.height = function (_) {
    if (!arguments.length) {
      return height;
    }
    height = _;
    return chart;
  };
  chart.backgroundColor = function (_) {
    if (!arguments.length) {
      return backgroundColor;
    }
    backgroundColor = _;
    return chart;
  };
  chart.value = function (_) {
    if (!arguments.length) {
      return value;
    }
    value = _;
    return chart;
  };
  chart.isClockwise = function (_) {
    if (!arguments.length) {
      return isClockwise;
    }
    isClockwise = _;
    return chart;
  };
  chart.orbitColor = function (_) {
    if (!arguments.length) {
      return orbitColor;
    }
    orbitColor = _;
    orbitRainbow = false;
    return chart;
  };
  chart.orbitWidth = function (_) {
    if (!arguments.length) {
      return orbitWidth;
    }
    orbitWidth = _;
    return chart;
  };
  chart.ballNum = function (_) {
    if (!arguments.length) {
      return ballNum;
    }
    ballNum = _;
    return chart;
  };
  chart.ballSize = function (_) {
    if (!arguments.length) {
      return ballSize;
    }
    ballSize = _;
    return chart;
  };
  chart.isEquant = function (_) {
    if (!arguments.length) {
      return isEquant;
    }
    isEquant = _;
    return chart;
  };
  chart.ballTextOutSize = function (_) {
    if (!arguments.length) {
      return ballTextOutSize;
    }
    ballTextOutSize = _;
    return chart;
  };
  chart.firstQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return firstQuadrantDominantBaseline;
    }
    firstQuadrantDominantBaseline = _;
    return chart;
  }
  chart.firstQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return firstQuadrantTextAnchor;
    }
    firstQuadrantTextAnchor = _;
    return chart;
  }
  chart.secondQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return secondQuadrantDominantBaseline;
    }
    secondQuadrantDominantBaseline = _;
    return chart;
  }
  chart.secondQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return secondQuadrantTextAnchor;
    }
    secondQuadrantTextAnchor = _;
    return chart;
  }
  chart.thirdQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return thirdQuadrantDominantBaseline;
    }
    thirdQuadrantDominantBaseline = _;
    return chart;
  }
  chart.thirdQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return thirdQuadrantTextAnchor;
    }
    thirdQuadrantTextAnchor = _;
    return chart;
  }
  chart.fourthQuadrantDominantBaseline = function (_) {
    if (!arguments.length) {
      return fourthQuadrantDominantBaseline;
    }
    fourthQuadrantDominantBaseline = _;
    return chart;
  }
  chart.fourthQuadrantTextAnchor = function (_) {
    if (!arguments.length) {
      return fourthQuadrantTextAnchor;
    }
    fourthQuadrantTextAnchor = _;
    return chart;
  }
  chart.textPathArc = function (_) {
    if (!arguments.length) {
      return textPathArc;
    }
    textPathArc = _;
    return chart;
  };
  chart.textAfterEdge = function (_) {
    if (!arguments.length) {
      return textAfterEdge;
    }
    textAfterEdge = _;
    return chart;
  };
  chart.textAfterEdgeColor = function (_) {
    if (!arguments.length) {
      return textAfterEdgeColor;
    }
    textAfterEdgeColor = _;
    return chart;
  };
  chart.textAfterEdgeSize = function (_) {
    if (!arguments.length) {
      return textAfterEdgeSize;
    }
    textAfterEdgeSize = _;
    return chart;
  };
  chart.textAfterEdgeStartOffset = function (_) {
    if (!arguments.length) {
      return textAfterEdgeStartOffset;
    }
    textAfterEdgeStartOffset = _;
    return chart;
  };
  chart.textAfterTextAnchor = function (_) {
    if (!arguments.length) {
      return textAfterTextAnchor;
    }
    textAfterTextAnchor = _;
    return chart;
  };
  chart.textAfterEdgeDominantBaseline = function (_) {
    if (!arguments.length) {
      return textAfterEdgeDominantBaseline;
    }
    textAfterEdgeDominantBaseline = _;
    return chart;
  };
  chart.textBeforeEdge = function (_) {
    if (!arguments.length) {
      return textBeforeEdge;
    }
    textBeforeEdge = _;
    return chart;
  };
  chart.textBeforeEdgeColor = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeColor;
    }
    textBeforeEdgeColor = _;
    return chart;
  };
  chart.textBeforeEdgeSize = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeSize;
    }
    textBeforeEdgeSize = _;
    return chart;
  };
  chart.textBeforeEdgeStartOffset = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeStartOffset;
    }
    textBeforeEdgeStartOffset = _;
    return chart;
  };
  chart.textBeforeTextAnchor = function (_) {
    if (!arguments.length) {
      return textBeforeTextAnchor;
    }
    textBeforeTextAnchor = _;
    return chart;
  };
  chart.textBeforeEdgeDominantBaseline = function (_) {
    if (!arguments.length) {
      return textBeforeEdgeDominantBaseline;
    }
    textBeforeEdgeDominantBaseline = _;
    return chart;
  };

  return chart;
};