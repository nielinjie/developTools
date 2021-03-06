//hand coded :-(

(function(){
  window.begin=function(){
    var times, status, value, timeF;
    $('.help').popover({
      content: $('#help').html(),
      html: true,
      placement: 'auto',
      title: '帮助'
    });
    $('.help-split').popover({
      content: $('#help-split').html(),
      html: true,
      placement: 'auto',
      title: '帮助'
    }).on('shown.bs.popover', function(){
      var v;
      return v = $(this).next('.popover').find('i.send').click(function(){
        if ($('.x').val() === '') {
          return $('.x').val($(this).data('code'));
        } else {
          return $('.y').val($(this).data('code'));
        }
      });
    });
    times = [['最早', void 8], ['三年', d3.time.year.offset(new Date, -3)], ['两年', d3.time.year.offset(new Date, -2)], ['一年', d3.time.year.offset(new Date, -1)], ['半年', d3.time.month.offset(new Date, -6)], ['三个月', d3.time.month.offset(new Date, -3)], ['一个月', d3.time.month.offset(new Date, -1)], ['现在', new Date]];
    $('#slider').slider({
      max: 7,
      min: 0,
      value: 0,
      formater: function(it){
        return times[it].join('-');
      }
    }).on('slideStop', function(it){
      timeFilter(status());
      return $('.timeFilter').text(times[it.value][0]);
    });
    status = function(weight){
      var time, timeFi;
      time = $('#slider').slider('getValue');
      timeFi = times[time][1];
      weight == null && (weight = $('.wight .btn.active input').data('kind'));
      return {
        timeFi: timeFi,
        weight: weight
      };
    };
    $('.right').click(function(){
      var value;
      value = $('#slider').slider('getValue');
      if (value <= 6) {
        value = value + 1;
        $('#slider').slider('setValue', value);
        $('.timeFilter').text(times[value][0]);
        return timeFilter(status());
      }
    });
    $('.left').click(function(){
      var value;
      value = $('#slider').slider('getValue');
      if (value >= 1) {
        value = value - 1;
        $('#slider').slider('setValue', value);
        $('.timeFilter').text(times[value][0]);
        return timeFilter(status());
      }
    });
    $('.wight .btn').click(function(){
      return timeFilter(status($(this).data('kind')));
    });
    $('.drawing').popover({
      selector: 'rect.file',
      placement: 'right',
      container: 'body',
      html: true,
      content: function(){
        var copy;
        copy = $('#file-pop').clone().removeAttr('id').removeClass('hide');
        copy.find('.desc').html($(this).find('title').text().replace(/\n/g, '<br/>') + "");
        return copy.find('.file-track').attr('attr-name', $(this).attr('attr-name')).end()[0].outerHTML;
      }
    }).on('shown.bs.popover', function(it){
      var path;
      path = $(it.target).attr('attr-name');
      return window.track(path);
    });
    $('.redraw').click(function(){
      var value, timeF;
      value = $('#slider').slider('getValue');
      timeF = times[value][1];
      $('svg').remove();
      render($('.control .x').val(), $('.control .y').val());
      return setTimeout(function(){
        return timeFilter(status());
      }, 800);
    });
    if ((typeof origindata == 'undefined' || origindata === null) || origindata.length === 0) {
      $('.data-warning').removeClass('hide');
      return $('.redraw').addClass('disabled');
    } else {
      value = $('#slider').slider('getValue');
      timeF = times[value][1];
      $('svg').remove();
      render($('.control .x').val(), $('.control .y').val());
      return setTimeout(function(){
        return timeFilter(status());
      }, 800);
    }
  }
}).call(this);
