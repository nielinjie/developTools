(function(){
  var _, endsWith, contains, output, replace$ = ''.replace;
  _ = require('underscore');
  endsWith = function(str, suffix){
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };
  contains = function(str, part){
    var re;
    return re = str.indexOf(part) !== -1;
  };
  output = console.log;
  module.exports.summary = function(total, used){
    output("total recorders - " + total);
    return output("developing recorders - " + used);
  };
  module.exports.javaTouchTop = function(datas, rowNum){
    var x$;
    output("JAVA TOUCHED TOP " + rowNum);
    return (x$ = _(datas).chain().filter(function(it){
      return endsWith(it.path, '.java');
    }).countBy(function(it){
      return replace$.call(it.path, '"', '');
    }).pairs().sortBy(function(it){
      return -it[1];
    }).head(rowNum), x$.each(function(it){
      return output(it[0] + " - " + it[1]);
    }), x$).value();
  };
  module.exports.fileTouchTop = function(datas, rowNum){
    output("FILE TOUCHED TOP 100");
    return _(datas).chain().countBy(function(it){
      return replace$.call(it.path, '"', '');
    }).pairs().sortBy(function(it){
      return -it[1];
    }).head(rowNum).each(function(it){
      return output(it[0] + " - " + it[1]);
    });
  };
  module.exports.byAuthor = function(datas){
    output("CODER BY TOUCHED");
    return _(datas).chain().countBy(function(it){
      return replace$.call(it.author.toUpperCase(), "'", '');
    }).pairs().sortBy(function(it){
      return -it[1];
    }).each(function(it){
      return output(it[0] + " - " + it[1]);
    });
  };
  module.exports.touchAndComplex = function(jTop, complexTop, datas){
    var j200, complex, com, touch, matched, both, noTouch, noCom;
    j200 = _(jTop);
    complex = complexTop;
    com = _.chain(complex).map(function(it){
      var short, matched;
      short = it[0];
      matched = j200.filter(function(it){
        return contains(it[0], "\\" + short + ".java");
      });
      return import$({
        name: short,
        complexity: +it[1]
      }, (function(){
        switch (matched.length) {
        case 0:
          return {
            stat: 'no-touch'
          };
        case 1:
          return {
            stat: 'match',
            touch: matched[0][1],
            path: matched[0][0]
          };
        default:
          return {
            stat: 'duplicated',
            matched: matched
          };
        }
      }()));
    });
    touch = _.chain(j200).map(function(it){
      var path, logs, matched;
      path = it[0];
      logs = _(datas).chain().filter(function(it){
        return it.path === path;
      }).map(function(it){
        return _(it).omit(['path']);
      }).value();
      matched = complex.filter(function(it){
        return contains(path, "\\" + it[0] + ".java");
      });
      return import$({
        path: path,
        logs: logs,
        touch: +it[1]
      }, (function(){
        switch (matched.length) {
        case 0:
          return {
            stat: 'no-complex'
          };
        case 1:
          return {
            stat: 'match',
            complexity: +matched[0][1]
          };
        default:
          return {
            stat: 'duplicated',
            matched: matched
          };
        }
      }()));
    });
    matched = _.chain(touch).filter(function(it){
      return it.stat === 'match';
    }).map(function(it){
      return it.CT = it.touch * it.complexity, it;
    }).value();
    both = _(matched).chain().sortBy(function(it){
      return -it.CT;
    });
    output("Touch And complex - " + both.size().value());
    both.each(function(it){
      return output(it.path + " - " + it.CT + "ct = " + it.touch + "t*" + it.complexity + "c");
    });
    noTouch = _.chain(com).filter(function(it){
      return it.stat === 'no-touch';
    }).sortBy(function(it){
      return -it.complexity;
    });
    output("Complex no touch - " + noTouch.size().value());
    noTouch.each(function(it){
      return output(it.name + " - " + it.complexity + "c");
    });
    noCom = _.chain(touch).filter(function(it){
      return it.stat === 'no-complex';
    }).sortBy(function(it){
      return -it.touch;
    });
    output("Touch no complex - " + noCom.size().value());
    noCom.each(function(it){
      return output(it.path + " - " + it.touch + "t");
    });
    return {
      both: both.value(),
      noTouch: noTouch.value(),
      noComplex: noCom.value()
    };
  };
  module.exports.touchAndComplexByAuthor = function(datas, tAndC){
    return _(tAndC).each(function(it){
      var path, logs, authors;
      path = it.path;
      logs = datas.filter(function(it){
        return it.path === path;
      });
      authors = _(logs).chain().countBy(function(it){
        return it.author.toUpperCase();
      }).pairs().sortBy(function(it){
        return -it[1];
      }).map(function(it){
        return it.join(': ');
      }).value();
      output(it.path + " - " + it.CT + "ct = " + it.touch + "t*" + it.complexity + "c");
      return output(_(authors).join('  '));
    });
  };
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
