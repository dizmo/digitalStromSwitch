# digitalStromSwitch

This simple dizmo shows you how to connect to a DigitalStrom Server (DSS) and execute commands against it. It can switch on and off any scenes defined on the DSS.

## Configuration

Configuration needs to be done once to receive an application token for the dizmo from the DSS. Uncomment the following lines in src/application.js:

	// get application token (one-time)
	jQuery.ajax({
  		url: "https://"+dss_ip+":"+dss_port+"/json/system/requestApplicationToken?applicationName=dizmo_new",
  		cache: false,
  		dataType: 'json',
  		success: function(data){
    		console.log(data);
  		}
	});
	
	// replace with token received from above call
	var apptoken="xxxxxx";

Then, replace "xxxxxx" with the token received in the variable data and uncomment the function call again. Also, using the DSS Web Interface and your Administrator password, activate above application token.

## Usage

Now, you can turn the digitalStromSwitch dizmo to its back and choose a Room and a Scene. From the front side, you can simply switch on the selected scene in the selected Room.

