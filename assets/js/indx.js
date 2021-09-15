var aBanners = [], timeout_banner = 10;


$(document).ready(function(e){
	// кнопка наверх
      console.log("!");
      $("li").mousemove(function (eventObject) {
      
          $data_tooltip = $(this).attr("data-tooltip");
          if ($data_tooltip.length>0){
          $("#tooltip").html($data_tooltip)
              .css({ 
                "top" : eventObject.pageY + 5,
                "left" : eventObject.pageX + 5
              })
              .show();
          }}).mouseout(function () {
            $("#tooltip").hide()
              .html("")
              .css({
                  "top" : 0,
                  "left" : 0
              });
      
      });

	$('body').append('<div id="toTop" class="button">наверх</div>');
	$(function(){
		$.fn.GoToTop = function(){
			var block=$(this);
			block.click(function(){
				$("html, body").animate({scrollTop:0},"slow")
			});
			if($(window).scrollTop() > "100"){
				$(block).addClass('on');
			}
			$(window).scroll(function(){
				if($(window).scrollTop() < "100"){
					block.removeClass('on');
				}else{
					block.addClass('on');
				}
			});
		};
		$("#toTop").GoToTop();
	});
	$('.atom-elem svg').each(function(i){
		var w = parseInt($(this).attr('width')), maxW = $(this).parent().addClass('on').width();
		$(this).find('circle').each(function(){
			this.param = [this.cx,this.cy,this.r];
			this.cx.baseVal.value = parseInt(maxW * parseInt(this.cx.baseVal.value)/w);
			this.cy.baseVal.value = parseInt(maxW * parseInt(this.cy.baseVal.value)/w);
			this.r.baseVal.value = parseInt(maxW * parseInt(this.r.baseVal.value)/w);
		});
		$(this).attr('width',maxW).attr('height',maxW);
	});
	$(document).on('click','.atom-elem',function(e){
		if($(this).hasClass('on')){
			$(this).removeClass('on')
		}else{
			$(this).addClass('on');
		}
	});
	$(document).on('click','.atom-elem .close',function(e){
		$(this).parent().removeClass('on');
		e.stopPropagation();
	});
	if($('#index').length>0){
		$('#show_atom').after('<button class="view">на весь экран</button>');
		$(document).on('click','button.view',function(){
			var b = $('body');
			if(b.hasClass('toscreen')){
				b.removeClass('toscreen');
				$(this).text('на весь экран');
				$('#mainSlider').show();
			}else{
				b.addClass('toscreen');
				$(this).text('в обычный режим');
				$('#mainSlider').hide();
			}
		});
	}
	if($('#show_atom').length>0){
		// прелоадер картинок
		aBanners = [{'src':host + 'upload/3-VSEROD_TABL_RU_1024x768_WEB.jpg',},{'src':host + 'upload/3-VSEROD_TABL_EN_1024x768_WEB.jpg'}];
		$('#show_atom').before('<div id="mainSlider"></div><div class="switch-wrap"></div>');
		loadScript('js/slider.js',true);
	}
});