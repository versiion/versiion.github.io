
var page = null;
var txt_login = "Login";
var txt_login_ok = "Login successfully";
var txt_login_fail = "Login failed! Check your username & password!";
var txt_id = "Router azoto";
var msg = txt_login + ' ' + txt_id;

function E(e) {
	return (typeof(e) == 'string') ? document.getElementById(e) : e;
}

function W(s)
{
	document.write(s);
}

function checkEvent(evt) {
	if (typeof(evt) == 'undefined') {
		// IE
		evt = event;
		evt.target = evt.srcElement;
		evt.relatedTarget = evt.toElement;
	}
	return evt;
}

function loadPage() {
	if( page == null ) {
		document.location.reload(1);
	}else{
		window.location.replace(page);
	}
}

function resetMsg() {
	E('login_msg').innerHTML = msg;
}

function onSuccess(txt) {
	var v = txt.split(',');
	if( v[0] == "OK" ){
		//document.cookie = 'web_session=' + v[1] + '; expires=' +
		//	(new Date(new Date().getTime() + (1 * 86400000))).toUTCString() + '; path=/' + '; SameSite=Strict';
		E('login_msg').innerHTML=txt_login_ok;
		page = "index.jsp";

		setTimeout(loadPage, 1000);
	}else{
		E('login_msg').innerHTML=txt_login_fail;
		page = null;
		E('passwd').value = "";
		E('passwd').focus();
		setTimeout(resetMsg, 5*1000);
	}
}

function onFailure(x) {
	E('login_msg').innerHTML=txt_login_fail;
	setTimeout(resetMsg, 5*1000);
}

var Try = {
  these: function() {
    var returnValue;

    for (var i = 0, length = arguments.length; i < length; i++) {
      var lambda = arguments[i];
      try {
        returnValue = lambda();
        break;
      } catch (e) {}
    }

    return returnValue;
  }
}

function callback()
{
	if(AR.readyState==4) {
		if(AR.status==200) {
			onSuccess(AR.responseText);
		}else{
			onFailure(AR.responseText);
		}
	}
} 

///////////////////////////////////////////////////////////////////
var AR = null;
function creatAjaxReq(url)
{
	if (AR) delete AR;
	
	AR = Try.these(
    function() {return new XMLHttpRequest()},
    function() {return new ActiveXObject('Msxml2.XMLHTTP')},
    function() {return new ActiveXObject('Microsoft.XMLHTTP')}
  );

	if(AR)
	{
		AR.open("Get",url,true);
		AR.onreadystatechange = callback;
		AR.send(null);
	}
}

function onOk()
{
	creatAjaxReq("check_auth.jsp?_ajax=1&_username=" + escape(E('username').value) + "&_passwd=" + escape(E('passwd').value));
}

function init()
{
	var s;

	E('username').focus();
	
	E('username').onkeypress = function(ev) {
			if (checkEvent(ev).keyCode == 13) E('passwd').focus();
		};
		
	E('passwd').onkeypress = function(ev) { 
			if (checkEvent(ev).keyCode == 13) onOk();
		};
}
function mykeydown()
{
	if(typeof(window.event)=='undefined') return true;
	
	if(window.event.keyCode==13){
		if(E('passwd').value=='') E('passwd').focus();
		else onOk();
		return false;
	}
	
	return true;
}

