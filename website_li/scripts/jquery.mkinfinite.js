/*
MKInfinite v1.0.0
Copyright (c) 2015 Mikhail Kelner
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
*/
(function($){
    jQuery.fn.mkinfinite = function(options){
        var options = $.extend({
			maxZoom:           1.25,
			imagesRatio:       1.5,
			animationTime:     5000,
			animationInterval: 5,
			isFixedBG:         false,
			zoomIn:            true,
			imagesList: new Array(),
        }, options);
        var timeout=null;
		var currentImage  = 1;
		var currentZoom   = 1;
		var animationStep = 0.1;
		var $object;
		var make = function(){
			currentZoom = options.zoomIn ? options.maxZoom : 1;
			animationStep = (options.maxZoom - 1) / ( options.animationTime / options.animationInterval );
			if (!options.zoomIn){
				animationStep = -1 * animationStep;
			}
			$object = $(this);
			$object.css({
				'background-position': '50% 50%',
				'background-repeat': 'no-repeat'
			});
			$object.addClass('mkinfinite');
			if (options.imagesList.length > 1){
				calculateZoom(currentImage);
			}
			animateBG();
		};
		var calculateZoom = function(setImageNumber){
			var nBGw = ( options.isFixedBG ? $(window).width() : $object.width() ) * currentZoom;
			var nBGh = $object.height() * currentZoom;
			if ( (nBGw / nBGh) > options.imagesRatio ){
				nBGw = Math.round(nBGw);
				nBGh = Math.round(nBGw / options.imagesRatio);
			} else {
				nBGw = Math.round(nBGh * options.imagesRatio);
				nBGh = Math.round(nBGh);
			}
			if (setImageNumber && (setImageNumber > 0)){
				$object.css({
					'background-size': nBGw + 'px ' + nBGh + 'px',
					'background-image': 'url(' + options.imagesList[setImageNumber - 1] + ')'
				});
				var imgLoader = new Image();
				imgLoader.src = options.imagesList[setImageNumber % options.imagesList.length];
			} else {
				$object.css('background-size', nBGw + 'px ' + nBGh + 'px');
			}
		}
		var animateBG = function(){
			if ( options.zoomIn && (currentZoom >= 1) || !options.zoomIn && (currentZoom <= options.maxZoom) ){
				timeout=setTimeout(function(){
					calculateZoom();
					currentZoom = currentZoom - animationStep;
					animateBG();
				}, options.animationInterval);
			} 
		}

		$('.banner_ctr ul.ctr li').click(function(){
		    clearTimeout(timeout);
		});

		  document.addEventListener('visibilitychange', function() {
		  var isHidden = document.hidden;
		  if (isHidden) {
		     clearTimeout(timeout);
		     timeout=null;
		  } 
		});

		return this.each(make);

	};
})(jQuery);