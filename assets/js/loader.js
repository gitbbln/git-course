var today = new Date(), razm = {'x':0,'y':0,'cls':''}, reload = fly = fly_id = evntFly = false,	urlParam = parseUrlParam(document.location.search);
var isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)|(Linux)/i) != null;
window.onresize = function(e){
	var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight;
	if(!g.className){
		g.className = '';
	}
	if(x<841){
		c='mobile';
		g.className=g.className.replace(new RegExp('\\s*full','g'),'');
	}else{
		if(840<x)c='full';
		g.className=g.className.replace(new RegExp('\\s*mobile','g'),'');
	}
	var r = new RegExp("\\s*"+c,'g'), cln=g.className;
	if(!r.test(cln))g.className=g.className.replace(new RegExp('\\s*'+cln,'g'),'')+((cln.length==0)?'':cln+' ')+c;
	razm = {'x':x,'y':y,'cls':c};
};
document.onreadystatechange = function(){
	window.onresize.call();
}
function loadScript(href,async){
	var s = document.createElement('script'), r = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0];
	s.type = 'text/javascript';
	s.async = async?true:false;
	if (href.indexOf('http') == 0){
		s.src = href;
	}else{
		s.src = host + href;
	}
	r.appendChild(s);
}

function made_ancor(t,is_blank){
	$(t).replaceWith('<a href="' + $(t).attr("title") + '" class="' + $(t).attr("class").replace('link','') + '" title="' + $(t).text().replace('"','&quot;') + '"' + ((is_blank)?' target="_blank"':'') + '>' +$(t).html() + "</a>");
}

Array.prototype.has = function(v){
	for (i=0; i < this.length; i++){
		if(this[i] == v)return i;
	}
	return -1;
}
var aFlash = document.getElementsByTagName('object');
$(document).ready(function(){
	if(isMobile){
		for(var i=aFlash.length-1;i>=0;i--){
			aFlash[i].parentElement.removeChild(aFlash[i]);
		}
	}
	//
	$(document).ajaxError(function( event, request, settings ) {
		alert('Ошибка ajax!');
	});
	$(document).on('click','.confirm',function(e){
		var t = $(this).attr('title');
		if(!t)t='выполнить действие';
		if(!confirm('вы действительно хотите '+t+'?')){
			e.preventDefault();
			e.stopImmediatePropagation();
		}
	});
	$('.editor[id]').each(function(){
		CKEDITOR.replace($(this).attr('id'));
	});
	// догрузка скриптов
	$("b[title].script").each(function(){
		loadScript($(this).attr('title'),$(this).hasClass('async'));
		$(this).remove();
	});
	//
	$(document).on('click','.form .submit',function(e){
		var frm = $(this).parents('.form');
		var s = {};
		var flErr = false, strErr = '';
		frm.find('*[name]').each(function(i){
			var go = isVal(this), nm = $(this).attr('name');
			if(go){
				var v = $(this).val();
				if($(this).hasClass('required')&&!v){
					strErr+="поле &laquo;"+($(this).attr('title')?$(this).attr('title'):nm) + "&raquo; обязательно к заполнению!\n";
					$(this).css({'border':'1px solid red'});
					flErr = true;
				}else{
					$(this).css({'border':'1px solid #ccc'});
					if(nm=='mail'){
						if(!flErr)flErr = !validateEmail(v);
					}
					if(nm=='phone'){
						v = v.replace(/\D+/gi,'');
						$(this).val(v);
						if(v.length!=11){
							strErr+="Не верно указан телефон!\nУказывайте телефон в федеральном формате.";
							flErr = true;
						}
					}
					if(!flErr){
						if(nm.substr(-2)=='[]'){
							if(s[nm]==undefined)s[nm]=[];
							s[nm].push(v);
						}else{
							s[nm] = v;
						}
					}
				}
			}
		});
		if(strErr.length>0)addMsg(strErr);
		if(flErr||s.length==0) return false;
		execAjax(s,$(this));
	});
	$('.form').keyup(function(event){
		/*if (event.keyCode == 13) {
			$(this).find('button.submit').trigger('click');
		}*/
	});
	$(document).on('click','.destroy',function(){
		$(this).parent().hide('slow').remove();
		loadPage(reload);
	});
	$(document).on('click','.btajax[value]',function(){
		var v = $(this).val()||$(this).attr('value');
		if(v.length==0) return false;
		execAjax(v,this,handler);
	});
	$(document).on('click','.clone-prev',function(){
		$(this).prev().after($(this).prev().clone());
	});
	$(document).on('click','.destroy',function(){
		$(this).parent().hide('slow').remove();
		loadPage(reload);
	});
	$(document).on('click','.on-change',function(){
		$(this).prev('select').trigger('change');
	});
	$(document).on('click','.show-next',function(e){
		var t = $(this);
		var n = t.next();
		if(n.hasClass('display0')){
			n.stop().slideDown(200).removeClass('display0');
			t.removeClass('off');
		}else{
			n.stop().slideUp(200).addClass('display0');
			t.addClass('off');
		}
	});
	$(document).on('click','.show-prev-bt',function(){
		var blc = $(this).prev();
		if (blc.hasClass('on')){
			blc.hide('slow').removeClass('on');
		}else{
			blc.show('slow').addClass('on');
		}
		return false;
	});
	$(document).on('click','button.close',function(){
		var v = $(this).val(), t = $(v);
		if (t.hasClass('on')){
			t.slideDown('slow').removeClass('on');
		}else{
			t.slideUp('slow').addClass('on');
		}
		return false;
	});
});

function numberFormat(num){
	// форматирование сумм
	var separator = "'";
	newnum = num.toString();
	return newnum.replace(/(\d{1,3}(?=(\d{3})+(?:\.\d|\b)))/g,"\$1"+separator);
}

function checkStr(a,b,c){
	if (b.indexOf(a)==-1)
	{
		alert(c)
		return false
	}
	return true
}

function validateEmail(adr){ 
	var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
	if (emailPattern.test(adr)){return true;}
	else{alert('Пожалуйста, введите корректно e-mail!'); return false;}
}

function loadPage(h){
	if(h)document.location.href = h;
}

function addMsg(m,h){
	if(m){
		$('.ajax-msg').remove();
		$('body').append('<div class="ajax-msg"><button class="destroy frt">X</button>' + m.replace(/\n/g,"<br/>") + '</div>');
		var tM = $('.ajax-msg');
		tM.css({marginLeft:(($(window).width() - tM.width())/2) + 'px'});
		$('.ajax-msg .destroy').click(function(){loadPage(h);});
	}else{
		loadPage(h);
	}
}

function execAjax(s,bt,f){
	if(bt)bt.disabled = true;
	if(typeof s == 'string')s=parseUrlParam(s);
	$.post(host + 'call-back/',s,'json').done(function(data){
		if(typeof data == 'string'){
			data = jQuery.parseJSON(data);
		}
		if(data.status == 'ok'){
			if(typeof f == 'function'){
				f(data,bt,s);
			}else{
				if(data.action){
					handler(data,bt,s);
				}else{
					addMsg(((data.result)?data.result:'')+((data.error)?data.error:''),data.href);
				}
			}
		}else{
			addMsg(data.error||data.result,data.href);
		}
	}).fail(function(data){
		addMsg('не удалось выполнить запрос!');
	}).always(function(data) {
		if(bt)bt.disabled = false;
	});
}

function isFile(u){
	var fl = false;
	$.ajax({url:u,type:'HEAD',
	error:function(){},
	success:function(){fl = true;}
	});
	return fl;
}

function isVal(t){
	if(typeof t != 'object') return false;
	return (t.tagName&&t.tagName=='INPUT')?(t.type!='checkbox'&&t.type!='radio')||((t.type=='checkbox'||t.type=='radio')&&t.checked==true):(t.name)?true:false;
}

function parseUrlParam(s){
	var str = s.split('?');
	str=(str.length>1)?str[1]:str[0];
	str = str.split('#')[0];
	return str.trim().split('&').reduce(function (ret, param) {
			var parts = param.split('=');
			ret[parts[0]] = parts[1] === undefined ? null : decodeURIComponent(parts[1]);
			return ret;
	}, {});	
}

function objToStr(s,addS){
	if(typeof s == 'string') return s;
	var k = Object.keys(s);
	var as = [];
	for(j=0;j<k.length;j++){
		i = k[j];
		var v = (s[i].search('=')==-1)?i+'='+s[i]:s[i];
		as.push(v);
		if(v==addS)addS = false;
	}
	if(addS)as.push(addS);
	return as.join('&');
}

function handler(data,bt,s){
	if(data.action){
		switch(data.action){
			case 'admin':
				if(typeof admin_handler == 'function')admin_handler(data,bt,s);
			break;
			case 'del-parent':
				if(data.name&&bt){
					$(bt).parents(data.name).remove();
				}else{
					$(bt).parent().remove();
				}
			break
			case 'append':
				if(data.target&&data.elem){
					$(data.elem).remove();
					$(data.target).append(data.result);
				}
			break;
			case 'append-once':
				if(data.target&&data.elem){
					$('#'+data.elem).remove();
					$('#'+data.target).append(data.result);
					fly = $('#adv_fly');
					if($('#adv_fly').length > 0){
						if(evntFly){
							var ofs = $(evntFly).offset();
							var frm = $('#adv_search').offset();
							fly.css('top',ofs.top - frm.top - fly.height());
						}
						fly_id = setTimeout(function(){fly.remove();},3000);
						fly.hover(function(){
							if(fly_id)clearTimeout(fly_id);
						},function(){
							fly_id = setTimeout(function(){fly.remove();},3000);
						});
					}
				}
			break;
			case 'replace':
				$(bt).before(data.result).remove();
			break;
			case 'load':
				if(data.target){
					$('#'+data.target).html(data.result);
				}
				if(s.action&&s.action=='adv-show-search')$('#adv_fly').remove();
			break;
			case 'clear-form':
				if(data.status=='ok'){
					$(bt).parents('.form').find('input[name]').filter('[type=text]').val('');
					$(bt).parents('.form').find('textarea').attr('value','');
				}
			case 'msg':
				addMsg(((data.result)?data.result:'')+((data.error)?data.error:''),data.href);
			break;
			case 'upload':
				if(data.advert){
					execAjax({'action':'get-advgalery','advert':data.advert},bt,function(data2){
						if(data2.status=='ok'){
							$('#gelery').replaceWith(data2.result);
						}
					});
				}else{
					addMsg(data.result);
				}
			break;
		}
	}
}