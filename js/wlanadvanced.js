// JavaScript Document
/****************************************************wlanadvanced (start)************************************/
var WLAN_CHANNEL_AUTO = '0';
var g_wlan_basicSetting = ''; //Data of WiFi Basic Setting
var g_WifiFeature = null;

function wlanadvanced_initChannel(channel_max,channel_min) {
	$('#select_WifiChannel').unbind('click');
	$('#select_WifiChannel').empty();
	$('#select_WifiChannel').append("<option value='0'>" + common_auto + '</option>');
	if(!channel_min) {
		var i = 0;
		for (i = 1; i <= channel_max; i++) {
			$('#select_WifiChannel').append('<option value=' + i + '>' + i + '</option>');
		}
	} else {
		var m = parseInt(channel_min,10);
		var n = parseInt(channel_max,10);
		var j = 0;
		for (j=m; j <= n; j++) {
			$('#select_WifiChannel').append('<option value=' + j + '>' + j + '</option>');
		}
	}

}

function wifiCountry_channel(country) {
	$.each(countryArray, function(n, value) {
		if (value[0] == country) {
            if(String(value[1]).index("-")<0){
                wlanadvanced_initChannel(value[1]);
            }
			else{
                var contryChannel = String(value[1]).split("-");
                wlanadvanced_initChannel(contryChannel[1],contryChannel[0]);
            }
			if ($('#select_WifiChannel').val() > value[1]) {
				$('#select_WifiChannel').val(WLAN_CHANNEL_AUTO);
			}
			return;
		}
	});
}

function wlanadvanced_initCountry() {
    $('#select_WifiChannel').unbind('click');
    $('#select_WifiCountry').empty();
    var i = 0;
    for (i = 0; i < countryArray.length; i++)
    {
        $('#select_WifiCountry').append('<option value=' + countryArray[i][0] + '>' + countryArray[i][2] + '</option>');
    }
}

function wlanadvanced_initCountry_for_Idevice() {
    var $countryList = $('#select_WifiCountry_for_Idevice')[0].options;
    $.each(countryArray, function(n, value)
    {
        $countryList.add(new Option(value[2], value[0]));
    });
}

function wlanadvanced_ifWifioffenable(enable) {
	if(enable=='0'){
		$('#select_WifiAutooffTime').attr('disabled', 'disabled');
	}
	else{
		$('#select_WifiAutooffTime').removeAttr('disabled');
	}
}

function setDataToComponentIE6()
{
	// set wifi channel
	setTimeout(function() {
		$('#select_WifiChannel').val( g_wlan_basicSetting.WifiChannel );
	}, 1);

	// set wifi Mode
	setTimeout(function() {
		$('#select_WifiMode').val( g_wlan_basicSetting.WifiMode );
	}, 1);

	// set wifi Isolate        
	if( g_module.multi_ssid_enabled )
	{
		setTimeout(function() {
			$('#select_WifiIsolate_between').val( g_wlan_basicSetting.WifiIsolationBetween );
		}, 1);
	}
	else
	{
		setTimeout(function() {
			$('#select_WifiIsolate_between').val( g_wlan_basicSetting.WifiIsolate );
		}, 1);
	}

	//set wifi wifioffenable
	setTimeout(function() {
		$('#select_WifiAutooffStatus').val( g_wlan_basicSetting.Wifioffenable );
	}, 1);
	setTimeout(function() {
		$('#select_WifiAutooffTime').val( g_wlan_basicSetting.Wifiofftime );
	}, 1);
	setTimeout(function() {
	$('#select_wifiBandWidth').val(g_wlan_basicSetting.wifibandwidth);
	}, 1);
	setTimeout(function() {
	    wlanadvanced_ifWifioffenable(g_wlan_basicSetting.Wifioffenable);
	}, 1);
}

function wlanadvanced_initPage() {
    if ($.browser.ipad)
    {
        $('#select_WifiCountry_for_Idevice').show();
        wlanadvanced_initCountry_for_Idevice();
    }
    else
    {
        $('#select_WifiCountry').show();
        wlanadvanced_initCountry();
    }
    var strUrl = 'api/wlan/basic-settings';

    if (g_module.multi_ssid_enabled)
    {
        strUrl = 'api/wlan/multi-security-settings';
    }

    getAjaxData(strUrl, function($xml) {
        var ret = xml2object($xml);
        if (ret.type != 'response')
        {
            return;
        }
        g_wlan_basicSetting = ret.response;

      //setting bandwith
        $("#select_wifiBandWidth option[value='40']").remove();
      if(g_wlan_basicSetting.WifiMode=="b/g/n")
        {
            $('#select_wifiBandWidth').append('<option value="40">40M</option>');
        }
	$('#select_wifiBandWidth').append('<option value="20/40">20M/40M</option>');
	  
        // set country
        if ($.browser.ipad)
        {
                setTimeout(function() {
					$('#select_WifiCountry_for_Idevice').val(g_wlan_basicSetting.WifiCountry);
				}, 1);
                var country = g_wlan_basicSetting.WifiCountry;

                wifiCountry_channel(country);

			$('#select_WifiCountry_for_Idevice').bind('change', function() {
				country = $('#select_WifiCountry_for_Idevice').val();
				wifiCountry_channel(country);
				button_enable('apply_button', '1');
			});
		} else {
			var i = 0;
			setTimeout( function() {
				$('#select_WifiCountry').val(g_wlan_basicSetting.WifiCountry);
			}, 1);
			for (i = 0; i < countryArray.length; i++) {
				if (countryArray[i][0] == g_wlan_basicSetting.WifiCountry) {
					$('#select_WifiChannel').show();
					if(String(countryArray[i][1]).indexOf("-")<0) {
						wlanadvanced_initChannel(countryArray[i][1]);

					} else {
						var contryChannel = String(countryArray[i][1]).split("-");
						wlanadvanced_initChannel(contryChannel[1],contryChannel[0]);
					}
					break;
				}
			}
		}
		if(($.browser.msie) && ($.browser.version == 6.0)) {
			setDataToComponentIE6();
		}
		else
		{	
			// set wifi channel
			$('#select_WifiChannel').val(g_wlan_basicSetting.WifiChannel);

			// set wifi Mode
			$('#select_WifiMode').val(g_wlan_basicSetting.WifiMode);

			// set wifi Isolate
			if (g_module.multi_ssid_enabled)
			{
				$('#select_WifiIsolate_between').val(g_wlan_basicSetting.WifiIsolationBetween);
			}
			else
			{
				$('#select_WifiIsolate_between').val(g_wlan_basicSetting.WifiIsolate);
			}

			//set wifi wifioffenable
			$('#select_WifiAutooffStatus').val(g_wlan_basicSetting.Wifioffenable);
			$('#select_WifiAutooffTime').val(g_wlan_basicSetting.Wifiofftime);
			$('#select_wifiBandWidth').val(g_wlan_basicSetting.wifibandwidth);
			
			wlanadvanced_ifWifioffenable(g_wlan_basicSetting.Wifioffenable);
		}
    });
}

function wlanadvanced_changeChannel() {
	var i = 0;
	var wifiCountry = $.trim($('#select_WifiCountry').val());
	var channelIndex = 0;
	var channelEnd = 0;
	for (i = 0; i < countryArray.length; i++) {
		log.debug('country:' + countryArray[i][2]);
		if (countryArray[i][0] == wifiCountry) {
			if(String(countryArray[i][1]).indexOf("-")<0) {
				channelIndex = countryArray[i][1];
			} else {
				var contryChannel = String(countryArray[i][1]).split("-");
				channelIndex = contryChannel[0];
				channelEnd = contryChannel[1];
			}
			break;
		}
	}

    if ($('#select_WifiChannel').val() > channelIndex)
    {
        $('#select_WifiChannel').val(WLAN_CHANNEL_AUTO);
    }

	if(channelEnd == 0) {
		wlanadvanced_initChannel(channelIndex);
	} else {
		wlanadvanced_initChannel(channelEnd,channelIndex);
	}

}

function ifWifioffenable_apply() {
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    // set wifi country
    if ($.browser.ipad)
    {
        g_wlan_basicSetting.WifiCountry = $('#select_WifiCountry_for_Idevice').val();
    }
    else
    {
        g_wlan_basicSetting.WifiCountry = $('#select_WifiCountry').val();
    }

    g_wlan_basicSetting.WifiChannel = $('#select_WifiChannel').val();

    // set wifi mode
    g_wlan_basicSetting.WifiMode = $('#select_WifiMode').val();

    // set wifi auto off enable status
    g_wlan_basicSetting.Wifioffenable = $('#select_WifiAutooffStatus').val();

    // set WiFi AP isolate
    if (g_module.multi_ssid_enabled)
    {
        g_wlan_basicSetting.WifiIsolationBetween = $('#select_WifiIsolate_between').val();
    }
    else
    {
        g_wlan_basicSetting.WifiIsolate = $('#select_WifiIsolate_between').val();
    }

    // set wifi auto off time
    g_wlan_basicSetting.Wifiofftime = $('#select_WifiAutooffTime').val();

    g_wlan_basicSetting.wifibandwidth = $('#select_wifiBandWidth').val();

    // post data
    var strUrl = 'api/wlan/basic-settings';

    if (g_module.multi_ssid_enabled)
    {
        strUrl = 'api/wlan/multi-security-settings';
    }
    g_wlan_basicSetting.WifiRestart = 1;
    var xmlstr = object2xml('request', g_wlan_basicSetting);
    button_enable('apply_button', '0');
    saveAjaxData(strUrl, xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanadvanced_initPage();
            button_enable('apply_button', '0');
            if(ret.error.code==ERROR_SYSTEM_BUSY){
                showInfoDialog(common_system_busy);
			}
			else{
                showInfoDialog(common_fail);
			}
		
        }
    });
}
function setDisplay () {
  
        if (g_feature.battery_enabled) {
            $('#wifiAutooffStatus').show();
            $('#wifiAutooffTime').show();
        }
        else {
            $('#wifiAutooffStatus').hide();
            $('#wifiAutooffTime').hide();
        }
}
function getStatus(){
    if(G_MonitoringStatus.type=='response')
	{
        if(G_MonitoringStatus.response.WifiConnectionStatus == '901')
        {
            $('#select_WifiCountry').attr('disabled', 'disabled');
            $('#select_WifiChannel').attr('disabled', 'disabled');
			$('#select_WifiMode').removeAttr('disabled');
			$('#select_WifiIsolate_between').removeAttr('disabled');
			$('#select_WifiAutooffStatus').removeAttr('disabled');
        }
		else
		{
		   $('#select_WifiCountry').removeAttr('disabled'); 
		   $('#select_WifiChannel').removeAttr('disabled');
		   $('#select_WifiMode').removeAttr('disabled');
		   $('#select_WifiIsolate_between').removeAttr('disabled');
		   $('#select_WifiAutooffStatus').removeAttr('disabled');
		}
    }
}

function main_executeBeforeDocumentReady(){
	getConfigData('config/wifi/configure.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
    }, {
        sync: true
    });
}
main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready(function() {
    if(g_WifiFeature.wifiBandWidthenable == 1){
        $("#wifiBandWidth").show();
    }
    else
    {
        $("#wifiBandWidth").hide();
    }
    wlanadvanced_initPage();
	if(g_module.wifioffload_enable==true)
	{
		addStatusListener('getStatus()');
	}
    button_enable('apply_button', '0');
    $('input').bind('change input paste cut keydown', function(e) {
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply_button', '1');
        }
        
    });

    $('#select_WifiCountry').change(function() {
        button_enable('apply_button', '1');
        wlanadvanced_changeChannel();
    });

    $('#select_WifiChannel, #select_WifiMode, #select_WifiIsolate_between, #select_WifiAutooffTime, #select_WifiRate,#select_wifiBandWidth').live('change', function() {
        button_enable('apply_button', '1');
    });

    $('#select_WifiAutooffStatus').change(function() {
        button_enable('apply_button', '1');
        wlanadvanced_ifWifioffenable(this.value);
    });

	$('#select_WifiMode').change(function() {
        if($('#select_WifiMode').val()=="b/g/n")
        {
            if($("#select_wifiBandWidth option[value='40']").length==0)
            {
                $('#select_wifiBandWidth').append("<option value='40'>40M</option>");
            }
        }
		else
		{
		   $('#select_wifiBandWidth').val('20');
		   $("#select_wifiBandWidth option[value='40']").remove();
		}
    });
    
    setDisplay();
    
    if(g_module.multi_ssid_enabled){
        $("#wifi_APIsolate").hide();
    }
});

