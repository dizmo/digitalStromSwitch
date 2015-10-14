// If your dizmo has a back side, include this function. Otherwise you
// can delete it!
function showBack() {
    dizmo.showBack();
}

// As soon as the dom is loaded, and the dizmo is ready, instantiate the main class
window.document.addEventListener('dizmoready', function() {
    // Your code should be in here so that it is secured that the dizmo is fully loaded

    // back side handler
	dizmo.onShowBack(function() {
    	DizmoElements('#room').dselectbox('update');
	});

    // done button handler
    document.getElementById('doneBtn').onclick = function() {

        var _ip=document.getElementById('ip').value;
        if (_ip!=='') {
          dizmo.privateStorage.setProperty("config/ip",_ip);
        }
        var _port=document.getElementById('port').value;
        if (_port!=='') {
          dizmo.privateStorage.setProperty("config/port",_port);
        } 

        dizmo.showFront();
    };

    // dss default configuration
	var dss_ip="localhost";
	var dss_port=8080;

  // read ip and port from storage
  var _ip=dizmo.privateStorage.getProperty("config/ip");
  if (_ip) dss_ip=_ip;

  var _port=dizmo.privateStorage.getProperty("config/port");
  if (_port) dss_port=_port;

  document.getElementById('ip').value=dss_ip;
  document.getElementById('port').value=dss_port;

  console.log("config:"+dss_ip+" "+dss_port);

	// get application token (one-time)
	/*
	jQuery.ajax({
  		url: "https://"+dss_ip+":"+dss_port+"/json/system/requestApplicationToken?applicationName=dizmo_new",
  		cache: false,
  		dataType: 'json',
  		success: function(data){
    		console.log(data);
  		}
	});
	*/

	// replace with token received from above call
	var apptoken="xxxxxx";

	var sesstoken="";
	var apartment="";
	var selected_zone="";
	var selected_scene="";
	var current_scene=0;

	// login to digitalstrom server
	jQuery.ajax({
  		url: "https://"+dss_ip+":"+dss_port+"/json/system/loginApplication?loginToken="+apptoken,
  		cache: false,
  		dataType: 'json',
  		success: function(data){
    		sesstoken=data.result.token;
    		getZones();
  		}
	});


	// get zones/rooms and update room selectbox
	var getZones=function() {
	jQuery.ajax({
  		url: "https://"+dss_ip+":"+dss_port+"/json/apartment/getStructure?token="+sesstoken,
  		cache: false,
  		dataType: 'json',
  		success: function(data){
    		apartment=data.result.apartment;
    		console.log(apartment);

    		$.each(apartment.zones, function(index,element) {

    			var selectbox=$('#room');
    			if (element.name!=='') {
      				$('<option />', {
                    	'text': element.name,
                    	'value': element.id
                	}).appendTo(selectbox);
      			}
      			DizmoElements('#room').dselectbox('update');

      			// handler that is called when the room selectbox is changed
			    DizmoElements('#room').on('change', function(e) {
                	var id = jQuery(this).val();
                	console.log("selected:"+id);
                	selected_zone=id;

                	// get scenes and update scene selectbox
                	jQuery.ajax({
                  		url: "https://"+dss_ip+":"+dss_port+"/json/zone/getReachableScenes?id="+id+"&token="+sesstoken,
                  		cache: false,
                  		dataType: 'json',
                  		success: function(data){
                  			console.log("reachablescenes");
                    		console.log(data);

                    		$('#scene').empty();
                    		$.each(data.result.reachableScenes, function(index,element) {
                      
                        		var selectbox=$('#scene');
                        		var sname=element;
                        		if (element===0) { sname="Off"; }
                        		if (element===5) { sname="On"; }
                        		if (element===17) { sname="Preset 2"; }
                        		if (element===18) { sname="Preset 3"; }
                        		if (element===19) { sname="Preset 4"; }
                        		$('<option />', {
                          			'text': sname,
                          			'value': element
                        		}).appendTo(selectbox);
                        		DizmoElements('#scene').dselectbox('update');

                    		});
                  		}
                	});

      			});
				
				// handler for scene selectbox
      			DizmoElements('#scene').on('change', function(e) {
        			var id = jQuery(this).val();
        			console.log("selected->"+id);
        			selected_scene=id;
     			});

    		});

  		}

	});

	};

	// handler for front side button
	DizmoElements('#my-button').on('click', function(e) {
  		console.log("clicked"+selected_zone+" "+selected_scene);
  		if (current_scene===0) { current_scene=selected_scene; } else { current_scene=0; }
  		console.log("https://"+dss_ip+":"+dss_port+"/json/zone/callScene?id="+selected_zone+"&sceneNumber="+current_scene+"&token="+sesstoken);
  		// toggle selected scene 
  		jQuery.ajax({
    		url: "https://"+dss_ip+":"+dss_port+"/json/zone/callScene?id="+selected_zone+"&sceneNumber="+current_scene+"&token="+sesstoken,
    		cache: false,
    		dataType: 'json',
    		success: function(data){
      			console.log(data);
    		}
  		});
	});

});