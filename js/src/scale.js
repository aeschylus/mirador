(function($) {

  $.WidgetScale = function(options) {
    jQuery.extend(true, this, {
      appendTo:           'body',
      element:            null,
      parent:             null,
      height:             $.DEFAULT_SETTINGS.scale.height,
      width:              $.DEFAULT_SETTINGS.scale.maxWidth,
      physicalScaleWidth: null,
      showScale:          false,
      scaleCls:           'mirador-image-scale',
      visualisation:      {}
    }, options);

    jQuery(this.parent.element).find("." + this.scaleCls).remove();

    this.element = this.element || jQuery('<svg/>');
    this.create();
  };

  $.WidgetScale.prototype = {

    create: function() {

      scaleDimensions = this.calculateScaleDimensions();
      visPadding = 10;

      var w = this.width + visPadding*3;
      var h = this.height;

      var scale = this.visualisation.scale = d3.select(this.parent.element[0])
      .append('svg')
      .attr('class', this.scaleCls)
      .attr('height', h)
      .attr('width', w);

      var xScale = this.visualisation.xScaleFunction = d3.scale.linear()
      .domain([0, d3.max(scaleDimensions)])
      .range([visPadding, w - (visPadding*2)]);

      var axis = this.visualisation.axis = d3.svg.axis()
      .scale(xScale)
      .orient('bottom')
      .ticks(4);

      scale.append('g')
      .attr('class', 'axis x')
      .attr('transform', 'translate(' + visPadding + ',' + ( h - visPadding * 4.5 ) + ')')
      .call(axis);

      scale.append('text')
      .attr('class', 'scale-units')
      .text(_this.parent.unitsLong)
      .attr('transform', 'translate(' + visPadding + ',' + ( h - visPadding ) + ')');

      this.hide();
      if (this.showScale) this.show();
    },

    append: function(item) {
      this.element.append(item);
    },

    render: (function() {

      return $.debounce( function(width) {
        var scale = this.visualisation.scale,
        axis = this.visualisation.axis,
        xScaleFunction = this.visualisation.xScaleFunction,
        newWidth = this.calculateScaleDimensions();

        xScaleFunction.domain([0, d3.max(newWidth)]);

        scale.select('.x.axis')
        .transition()
        .duration(850)
        .call(axis);
      }, 50);

    })(),

    calculateScaleDimensions: function() {
      _this = this;
      var scaleSize = null;

      // get width of viewport in pixels.
      // getBounds() returns an openseadragon Rect object.
      var viewportPixelWidth = _this.parent.parent.element.width();
      var scalePixelWidth = _this.width;

      // divide by width of scale in pixels to get the scale ratio.
      var scaleRatio = scalePixelWidth/viewportPixelWidth;

      // get width of viewport as a multiple of the image width.
      var viewportPercentWidth = _this.parent.osd.viewport.getBounds().width;

      // get width in absolute dimensions.
      // divide to get the phsyical width of current viewport.
      physicalViewportWidth = _this.parent.width*viewportPercentWidth;

      // multiply by scale ratio to get width of scale.
      scaleSize = physicalViewportWidth*scaleRatio;
      return [scaleSize];
    },

    show: function() {
      this.element.fadeIn();
    },

    hide: function() {
      this.element.fadeOut();
    }


  };

}(Mirador));
