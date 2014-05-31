// Generated by LiveScript 1.2.0
(function(){
  var color, dateFormat, replace$ = ''.replace;
  color = function(maxTouch){
    return d3.scale.linear().domain([0, maxTouch]).range(['white', 'red']);
  };
  window.render = function(xselect, yselect){
    var modules, modules2, groups, maxTouch, maxComp, datas, xs, ys, sizefx, sizefy, axisx, axisy, layout, svg, x$, y$;
    modules = new RegExp(xselect);
    modules2 = new RegExp(yselect);
    groups = _(origindata).chain().groupBy(function(it){
      var ref$;
      return [
        ((ref$ = modules.exec(it.path)) != null
          ? ref$
          : ['p', '(null)'])[1], ((ref$ = modules2.exec(it.path)) != null
          ? ref$
          : ['p', '(null)'])[1]
      ];
    }).map(function(v, k){
      var ref$, nx, ny, children;
      ref$ = k.split(','), nx = ref$[0], ny = ref$[1];
      children = _(v).map(function(it){
        return {
          name: it.path,
          comp: it.complexity,
          touch: it.touch,
          logs: it.logs
        };
      });
      return {
        nx: nx,
        ny: ny,
        children: children
      };
    }).value();
    maxTouch = _(origindata).max(function(it){
      return it.touch;
    }).touch;
    maxComp = _(groups).chain().map(function(it){
      return _(it.children).reduce(function(){
        return arguments[0] + arguments[1].comp;
      }, 0);
    }).max().value();
    datas = groups;
    xs = d3.scale.ordinal().domain(_(groups).chain().pluck('nx').sortBy(_.identity).value()).rangeBands([0, 1120], 0.2, 0.2);
    ys = d3.scale.ordinal().domain(_(groups).chain().pluck('ny').sortBy(_.identity).value()).rangeBands([0, 800], 0.2, 0.2);
    sizefx = d3.scale.linear().domain([0, Math.pow(maxComp, 0.5)]).range([0, xs.rangeBand()]);
    sizefy = d3.scale.linear().domain([0, Math.pow(maxComp, 0.5)]).range([0, ys.rangeBand()]);
    axisx = d3.svg.axis().scale(xs).orient('bottom');
    axisy = d3.svg.axis().scale(ys).orient('right');
    layout = function(sizex, sizey){
      return d3.layout.treemap().children(function(it){
        return it.children;
      }).value(function(it){
        return it.comp;
      }).size([sizex, sizey]);
    };
    svg = d3.select('.drawing').append('svg').attr('width', '1140px').attr('height', '900px');
    svg.append("g").attr("transform", "translate(10,800)").call(axisx).attr('fill', 'steelblue');
    svg.append('g').attr("transform", "translate(10,10)").call(axisy).attr('fill', 'steelblue');
    x$ = svg.append('g').attr("transform", "translate(10,10)").selectAll('.package').data(datas).enter().append('g').attr('class', 'package').attr('transform', "translate(600 400)");
    x$.transition().duration(400).attr('transform', function(it){
      return "translate(" + xs(it.nx) + " " + ys(it.ny) + ")";
    });
    y$ = x$.attr('stroke', 'black').selectAll('rect').data(function(n){
      var total, total1;
      total = _(n.children).map(function(it){
        return it.comp;
      }).reduce(curry$(function(x$, y$){
        return x$ + y$;
      }), 0);
      total1 = Math.pow(total, 0.5);
      layout(sizefx(total1), sizefy(total1))(n);
      return n.children;
    }).enter().append('rect').attr('x', function(){
      return 0;
    }).attr('y', function(){
      return 0;
    }).attr('width', function(it){
      return it.dx;
    }).attr('height', function(it){
      return it.dy;
    }).attr('attr-name', function(it){
      return replace$.call(it.name, /\\/g, '').replace(/\./g, '');
    }).attr('attr-path', function(it){
      return it.name;
    }).attr('class', 'file').attr('fill', 'lightgray');
    y$.transition().delay(400).duration(400).attr('x', function(it){
      return it.x;
    }).attr('y', function(it){
      return it.y;
    });
    y$.append('svg:title').text(function(it){
      return it.name + " -\n C:" + it.comp + ",\n T:" + it.touch;
    });
    return x$;
  };

  window.timeFilter = function(arg$){
    var timeFi, weight, dateFormat, touch, linear, pow, weightedTouch, touchs, maxTouch;
    timeFi = arg$.timeFi, weight = arg$.weight;
    dateFormat = d3.time.format('%Y-%m-%d');
    touch = function(it){
      var logs;
      logs = timeFi == null
        ? it.logs
        : _(it.logs).filter(function(it){
          return dateFormat.parse(it.date) >= timeFi;
        });
      return logs.length;
    };
    linear = function(minDate){
      return d3.time.scale().domain([minDate, new Date()]).range([0, 1]);
    };
    pow = function(minDate){
      var months, ref$, x1, x2;
      months = (ref$ = d3.time.month.range(minDate, new Date()).length) > 1 ? ref$ : 1;
      x1 = d3.time.scale().domain([minDate, new Date()]).range([0, months]);
      x2 = d3.scale.pow().domain([0, months]).range([0, 1]).exponent(2);
      return function(){
        return x2(x1.apply(this, arguments));
      };
    };
    weightedTouch = function(it){
      var w, logs;
      w = (function(){
        switch (weight) {
        case 'linear':
          return linear(timeFi != null ? timeFi : minDate);
        case 'pow':
          return pow(timeFi != null ? timeFi : minDate);
        default:
          return function(){
            return 1;
          };
        }
      }());
      logs = timeFi == null
        ? it.logs
        : _(it.logs).filter(function(it){
          return dateFormat.parse(it.date) >= timeFi;
        });
      return _(logs).reduce(function(){
        var wd;
        wd = w(dateFormat.parse(arguments[1].date));
        return arguments[0] + wd;
      }, 0);
    };
    touchs = _(origindata).map(function(it){
      return weightedTouch(it);
    });
    maxTouch = _(touchs).max();
    return d3.selectAll('.file').transition().duration(400).attr('fill', function(it){
      return color(maxTouch)(weightedTouch(it));
    }).select('title').text(function(it){
      return it.name + " -\n C:" + it.comp + ",\n T:" + it.touch + " - filtered:" + touch(it) + " - weighted:" + weightedTouch(it);
    });
  };
  function curry$(f, bound){
    var context,
    _curry = function(args) {
      return f.length > 1 ? function(){
        var params = args ? args.concat() : [];
        context = bound ? context || this : this;
        return params.push.apply(params, arguments) <
            f.length && arguments.length ?
          _curry.call(context, params) : f.apply(context, params);
      } : f;
    };
    return _curry();
  }
}).call(this);