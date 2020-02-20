
var g_wlan_basicData = null;    //xml list of basic settings
var g_wlan_securityData = null; // xml list of security settings

var WIFIAUTHMODE_AUTO = 'AUTO';
var WIFIAUTHMODE_OPEN = 'OPEN';
var WIFIAUTHMODE_SHARE = 'SHARE';
var WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var WIFIADVENCRYPMODE_AES = 'AES';
var WIFIADVENCRYPMODE_TKIP = 'TKIP';
var WIFIADVENCRYPMODE_MIX = 'MIX';
var WIFIBASICENCRYPMODE_NONE = 'NONE';
var WIFIBASICENCRYPMODE_WEP = 'WEP';
var WIFIBASICENCRYPMODE_WEP64 = 'WEP64';
var WIFIBASICENCRYPMODE_WEP128 = 'WEP128';
var g_WifiFeature = null;
var g_psk_config = '';
var g_ssid2_wifiOffload = null;
var g_wlan_multiSsidStatus = null;
var g_wlan_show_password = null;
var g_wlan_Ssidpassword_config = '';

function wlanbasicsettings_networkKey(key, ssid) {
    var keyData = g_wlan_securityData;
    var anotherSSID = null;
    if (g_module.multi_ssid_enabled)
    {
        var idx = ssid.charAt(ssid.length - 1) - 1;
        keyData = g_wlan_basicData[idx];
        anotherSSID = (ssid == 'ssid1') ? 'ssid2' : 'ssid1';
    }

    $('#' + ssid + '_neworkKey1').val(keyData.WifiWepKey1);
    $('#' + ssid + '_neworkKey2').val(keyData.WifiWepKey2);
    $('#' + ssid + '_neworkKey3').val(keyData.WifiWepKey3);
    $('#' + ssid + '_neworkKey4').val(keyData.WifiWepKey4);

    if (key == WIFIBASICENCRYPMODE_NONE)
    {

        $('#' + ssid + '_network_key').hide();
    }
    else if (key == WIFIBASICENCRYPMODE_WEP)
    {
        $('#' + ssid + '_network_key').show();

        $('#' + ssid + '_current_network_key').val(keyData.WifiWepKeyIndex);
    }
    else
    {
        log.debug("key is error");
    }
}

function wlanbasicsettings_initPage() {
   if (checkLeftMenu(g_PageUrlTree.settings.wlan.wps)){
        if (g_psk_config == 1) {
            $('#wpsbasic_p').html(setting_IDS_wlan_message_encryption_catuion_wpa);
        } else {
            $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion);
        }
    } else {
        $('#wpsbasic_p').html(setting_IDS_wlan_message_encryption_catuion_nowps);
    }

    if (1 == g_wlan_Ssidpassword_config){
        wlanbasicsettings_getSSIDPassword_DisplayEnable();
    } else {
        $('#wlan_device_password_enable').hide();
    }
    
   getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_basicData = ret.response;
        $('#ssid1_wifiName').val(g_wlan_basicData.WifiSsid);
        $("input[name='mode'][value=" + g_wlan_basicData.WifiEnable + ']').attr('checked', true);
        $("input[name='ssid1_wifiBroadcast']").get(g_wlan_basicData.WifiHide).checked = true;
    });

    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_securityData = ret.response;
        var authMode = g_wlan_securityData.WifiAuthmode;

        setTimeout(function() {
            $('#ssid1_authentication').val(authMode);
        }, 1);
        
        $('#ssid1_encryption_mode_wpa').val(g_wlan_securityData.WifiWpaencryptionmodes);
        $('#ssid1_current_network_key').val(g_wlan_securityData.WifiWepKeyIndex);
        $('#ssid1_wpa_key').val(g_wlan_securityData.WifiWpapsk);

    if (WIFIAUTHMODE_AUTO == authMode ||
        WIFIAUTHMODE_OPEN == authMode ||
        WIFIAUTHMODE_SHARE == authMode)
    {
            $('#div_ssid1_encrypt_way1').show();
            $('#div_ssid1_encrypt_way2').hide();

            if (WIFIAUTHMODE_SHARE == authMode ||
            WIFIAUTHMODE_AUTO == authMode)
            {
                $("#ssid1_encryption_mode_basic option[value='NONE']").remove();
            }
            else
            {
                if ($("#ssid1_encryption_mode_basic option[value='NONE']").length == 0)
                {
                    $('#ssid1_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                    $('#ssid1_encryption_mode_basic').val(g_wlan_securityData.WifiBasicencryptionmodes);
                }
            }

            $('#ssid1_encryption_mode_basic').val(g_wlan_securityData.WifiBasicencryptionmodes);
            wlanbasicsettings_networkKey($('#ssid1_encryption_mode_basic').val(), 'ssid1');
            $('#ssid1_caution').show();
        }
        else
        {
            $('#div_ssid1_encrypt_way2').show();
            $('#div_ssid1_encrypt_way1').hide();
        }
    });

}

function wlanbasicsettings_getSSIDPassword_DisplayEnable() {
    getAjaxData('api/wlan/oled-showpassword', function($xml) {
        var ret = xml2object($xml);
        if ('response' == ret.type)
        {
            g_wlan_show_password = ret.response;
            if ("1" == g_wlan_show_password.oledshowpassword) {
                $('#wlan_wps_password_disply_input').attr('checked', 'checked');
            } else {
                $('#wlan_wps_password_disply_input').removeAttr('checked');
            }             
        }
        else if (ret.error.code == ERROR_SYSTEM_BUSY) {
            showInfoDialog(common_system_busy);
        } else {
            showInfoDialog(common_fail);
        }     
    });
}

function wlanbasicsettings_multiSSID_initPage() {
    if (typeof(g_PageUrlTree.settings.wlan.wps) != 'undefined'){
        $('#wpsbasic_p').html( IDS_wlan_message_encryption_catuion );                
    } else {
        $('#wpsbasic_p').html(IDS_wlan_message_encryption_catuion_nowps);
    }

    if (1 == g_wlan_Ssidpassword_config){
        wlanbasicsettings_getSSIDPassword_DisplayEnable();
    } else {
        $('#wlan_device_password_enable').hide();
    }
    
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_securityData = ret.response;
        $("input[name='mode'][value=" + g_wlan_securityData.WifiEnable + ']').attr('checked', true);
    });

    var ssids = ['ssid1', 'ssid2'];

    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_basicData = ret.response.Ssids.Ssid;

        //SSID1,2 Initialization
        var i = 0;
        var multi_ssidAuthMode = [];
        for (i = 0; i < ssids.length; i++)
        {
            var wbs = 'input[name=' + ssids[i] + '_wifiBroadcast]';
            $('input[name=' + ssids[i] + '_wifiBroadcast][value=' + g_wlan_basicData[i].WifiBroadcast + ']').attr('checked', true);
            $('#' + ssids[i] + '_wifiIsolate').val(g_wlan_basicData[i].WifiIsolate);
            multi_ssidAuthMode.push(g_wlan_basicData[i].WifiAuthmode);

            $('#' + ssids[i] + '_wifiName').val(g_wlan_basicData[i].WifiSsid);
            $('#' + ssids[i] + '_encryption_mode_wpa').val(g_wlan_basicData[i].WifiWpaencryptionmodes);
            $('#' + ssids[i] + '_current_network_key').val(g_wlan_basicData[i].WifiWepKeyIndex);
            $('#' + ssids[i] + '_wpa_key').val(g_wlan_basicData[i].WifiWpapsk);

        if (WIFIAUTHMODE_AUTO == multi_ssidAuthMode[i] ||
            WIFIAUTHMODE_OPEN == multi_ssidAuthMode[i] ||
            WIFIAUTHMODE_SHARE == multi_ssidAuthMode[i])
            {
                $('#div_' + ssids[i] + '_encrypt_way1').show();
                $('#div_' + ssids[i] + '_encrypt_way2').hide();

                if (WIFIAUTHMODE_SHARE == multi_ssidAuthMode[i] ||
                WIFIAUTHMODE_AUTO == multi_ssidAuthMode[i])
                {
                    $('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").remove();
                }
                else
                {
                    if ($('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").length == 0)
                    {
                        $('#' + ssids[i] + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                        $('#' + ssids[i] + '_encryption_mode_basic').val(g_wlan_basicData[i].WifiBasicencryptionmodes);
                    }
                }

                $('#' + ssids[i] + '_encryption_mode_basic').val(g_wlan_basicData[i].WifiBasicencryptionmodes);

                wlanbasicsettings_networkKey($('#' + ssids[i] + '_encryption_mode_basic').val(), ssids[i]);
                $('#' + ssids[i] + '_caution').show();
            }
            else
            {
                $('#div_' + ssids[i] + '_encrypt_way2').show();
                $('#div_' + ssids[i] + '_encrypt_way1').hide();
            }
        }
        setTimeout(function() {
            $('#' + ssids[0] + '_authentication').val(multi_ssidAuthMode[0]);
        }, 1);
        setTimeout(function() {
            $('#' + ssids[1] + '_authentication').val(multi_ssidAuthMode[1]);
        }, 1);
    });
    multiSsidOnOffStatus();
}

function wlanbasicsettings_authentication(lable, ssid) {
    if (lable == WIFIAUTHMODE_AUTO || lable == WIFIAUTHMODE_OPEN || lable == WIFIAUTHMODE_SHARE)
    {
        $('#div_' + ssid + '_encrypt_way1').show();
        $('#div_' + ssid + '_encrypt_way2').hide();

        if (WIFIAUTHMODE_SHARE == lable || WIFIAUTHMODE_AUTO == lable)
        {
            $('#' + ssid + "_encryption_mode_basic option[value='NONE']").remove();
        }
        else
        {
            if ($('#' + ssid + "_encryption_mode_basic option[value='NONE']").length == 0)
            {
                $('#' + ssid + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
            }

            $('#' + ssid + '_encryption_mode_basic').val(WIFIBASICENCRYPMODE_WEP);
        }

        wlanbasicsettings_networkKey($('#' + ssid + '_encryption_mode_basic').val(), ssid);

        if ('ssid1' == ssid)
        {
            $('#ssid1_caution').show();
        }
        else
        {
            $('#ssid2_caution').show();
        }
    }
    else if (lable == WIFIAUTHMODE_WPA_PSK ||
    lable == WIFIAUTHMODE_WPA2_PSK ||
    lable == WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        //
        if ('ssid1' == ssid)
        {
            $('#ssid1_caution').hide();
        }
        else
        {
            $('#ssid2_caution').hide();
        }
        $('#' + ssid + '_encryption_mode_wpa').val(WIFIADVENCRYPMODE_MIX);
    }
    else
    {
        log.debug("lable is error");
    }
}

function wlanbasicsettings_multiSSID_postData()
{
    var postData = {};
    var ssids = ['ssid1', 'ssid2'];
    var i = 0;

    for (i = 0; i < ssids.length; i++)
    {
        g_wlan_basicData[i].WifiSsid = $('#' + ssids[i] + '_wifiName').val();

        g_wlan_basicData[i].WifiBroadcast = $('[name=' + ssids[i] + '_wifiBroadcast]:checked').val();
        g_wlan_basicData[i].WifiIsolate = (1 == $('#' + ssids[i] + '_wifiIsolate').val()) ? 1 : 0;

        var wifiAuthMode = $('#' + ssids[i] + '_authentication').val();
        g_wlan_basicData[i].WifiAuthmode = wifiAuthMode;

        if (wifiAuthMode == WIFIAUTHMODE_WPA_PSK ||
            wifiAuthMode == WIFIAUTHMODE_WPA2_PSK ||
            wifiAuthMode == WIFIAUTHMODE_WPA_WPA2_PSK)
        {

            g_wlan_basicData[i].WifiWpaencryptionmodes = $('#' + ssids[i] + '_encryption_mode_wpa').val();
            g_wlan_basicData[i].WifiWpapsk = $('#' + ssids[i] + '_wpa_key').val();
        }
        else if (wifiAuthMode == WIFIAUTHMODE_AUTO ||
            wifiAuthMode == WIFIAUTHMODE_OPEN ||
            wifiAuthMode == WIFIAUTHMODE_SHARE)
        {
            var bem = $('#' + ssids[i] + '_encryption_mode_basic').val();

            if (WIFIBASICENCRYPMODE_WEP == bem)
            {
                g_wlan_basicData[i].WifiWepKey1 = $('#' + ssids[i] + '_neworkKey1').val();
                g_wlan_basicData[i].WifiWepKey2 = $('#' + ssids[i] + '_neworkKey2').val();
                g_wlan_basicData[i].WifiWepKey3 = $('#' + ssids[i] + '_neworkKey3').val();
                g_wlan_basicData[i].WifiWepKey4 = $('#' + ssids[i] + '_neworkKey4').val();
            }

            g_wlan_basicData[i].WifiWepKeyIndex = $('#' + ssids[i] + '_current_network_key').val();
            g_wlan_basicData[i].WifiBasicencryptionmodes = bem;

        }
        else
        {
            log.debug("wifiAuthMode of multi-ssid post is error");
        }
    }

    $(':input').attr('disabled', 'disabled');
    postData = {
        Ssids: {
            Ssid: g_wlan_basicData
        },
        WifiRestart: 0
    };

    var xmlStr = object2xml('request', postData);
    button_enable('apply_button', '0');
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        $(':input').removeAttr('disabled');
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret))
        {
            multiSsidOnOffStatus();
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
            setTimeout(multiSecurity_set, 500);
        }
        else
        {
            wlanbasicsettings_multiSSID_initPage();
            if(ret.error.code==ERROR_SYSTEM_BUSY){
                showInfoDialog(common_system_busy);
            }
            else{
                showInfoDialog(common_fail);
            }
        }
    });
}

function multiSecurity_set(){
    g_wlan_securityData.WifiEnable = $("[name='mode']:checked").val();
    g_wlan_securityData.WifiRestart = 1;
    xmlStr = object2xml('request', g_wlan_securityData);
    saveAjaxData('api/wlan/multi-security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        if (isAjaxReturnOK(ret))
        {
            multiSsidOnOffStatus();
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_multiSSID_initPage();
            if(ret.error.code==ERROR_SYSTEM_BUSY){
                showInfoDialog(common_system_busy);
            }
            else{
                showInfoDialog(common_fail);
            }
        }
    });
}

function wlanbasicsettings_postData()
{
    g_wlan_basicData.WifiSsid = $.trim($('#ssid1_wifiName').val());
    g_wlan_basicData.WifiEnable = $("[name='mode']:checked").val();
    g_wlan_basicData.WifiHide = $("[name='ssid1_wifiBroadcast']:checked").val();
    g_wlan_basicData.WifiRestart = 0;

    var xmlStr = object2xml('request', g_wlan_basicData);
    button_enable('apply_button', '0');
    $(':input').attr('disabled', 'disabled');
    saveAjaxData('api/wlan/basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
            setTimeout(security_set, 500);
             
        }
        else
        {
            wlanbasicsettings_initPage();
            if(ret.error.code==ERROR_SYSTEM_BUSY){
                showInfoDialog(common_system_busy);
            }
            else{
                showInfoDialog(common_fail);
            }
        }
    }, {
        sync: true
    });


}
function security_set()
{
    // save authentication and encryption
    g_wlan_securityData.WifiAuthmode = $('#ssid1_authentication').val();
    g_wlan_securityData.WifiRestart = 1;
    var wifiAuthmode = g_wlan_securityData.WifiAuthmode;
    if (wifiAuthmode == WIFIAUTHMODE_WPA_PSK ||
    wifiAuthmode == WIFIAUTHMODE_WPA2_PSK ||
    wifiAuthmode == WIFIAUTHMODE_WPA_WPA2_PSK)
    {

        g_wlan_securityData.WifiWpaencryptionmodes = $('#ssid1_encryption_mode_wpa').val();
        g_wlan_securityData.WifiWpapsk = $('#ssid1_wpa_key').val();
    }
    else if (wifiAuthmode == WIFIAUTHMODE_AUTO ||
    wifiAuthmode == WIFIAUTHMODE_OPEN ||
    wifiAuthmode == WIFIAUTHMODE_SHARE)
    {
        g_wlan_securityData.WifiWepKey1 = $('#ssid1_neworkKey1').val();
        g_wlan_securityData.WifiWepKey2 = $('#ssid1_neworkKey2').val();
        g_wlan_securityData.WifiWepKey3 = $('#ssid1_neworkKey3').val();
        g_wlan_securityData.WifiWepKey4 = $('#ssid1_neworkKey4').val();
        g_wlan_securityData.WifiWepKeyIndex = $('#ssid1_current_network_key').val();
        g_wlan_securityData.WifiBasicencryptionmodes = $('#ssid1_encryption_mode_basic').val();
    }
    else
    {
        log.debug("wifiAuthmode is error");
    }

    button_enable('apply_button', '0');

    xmlStr = object2xml('request', g_wlan_securityData);
    saveAjaxData('api/wlan/security-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        $(':input').removeAttr('disabled');
        if (isAjaxReturnOK(ret))
        {
            button_enable('apply_button', '0');
            showInfoDialog(common_success);
        }
        else
        {
            wlanbasicsettings_initPage();
            if(ret.error.code==ERROR_SYSTEM_BUSY){
                showInfoDialog(common_system_busy);
            }
            else{
                showInfoDialog(common_fail);
            }
        }
    });
}

function wlanbasicsettings_checkName(ssid) {
    var name = $.trim($('#' + ssid + '_wifiName').val());
    
    var errMsg = validateSsid(name);

    if (common_ok != errMsg)
    {
        showErrorUnderTextbox(ssid + '_wifiName', errMsg);
        $('#' + ssid + '_wifiName').focus();
        $('#' + ssid + '_wifiName').select();
        return false;
    }
    else
    {
        return true;
    }
}

function wlanbasicsettings_checkNetworkKeyPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (10 == pwdVal.length || 26 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_64_or_128_bit_key;
        }
        else
        {
            ret = true;
        }
    }
    else if (5 == pwdVal.length || 13 == pwdVal.length)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wep_key_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_64_or_128_bit_key;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function wlanbasicsettings_checkWapPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length)
    {
        errMsg = dialup_hint_password_empty;
    }
    else if (hasSpaceOrTabAtHead(pwdVal))
    {
        errMsg = input_cannot_begin_with_space;
    }
    else if (64 == pwdVal.length)
    {
        if (!isHexString(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_type;
        }
        else
        {
            ret = true;
        }
    }
    else if (pwdVal.length >= 8 && pwdVal.length <= 63)
    {
        if (!checkInputChar(pwdVal))
        {
            errMsg = wlan_hint_wps_psk_valid_char;
        }
        else
        {
            ret = true;
        }
    }
    else
    {
        errMsg = wlan_hint_wps_psk_valid_type;
    }

    if (!ret)
    {
        showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function wlanbasicsettings_checkWifiSecurity(ssid) {
    var strNetworkKey = $('#' + ssid + '_current_network_key').val();
    var authMethod = $('#' + ssid + '_authentication').val();
    var bscEncptMode = $('#' + ssid + '_encryption_mode_basic').val();

    if (authMethod == WIFIAUTHMODE_WPA_PSK ||
    authMethod == WIFIAUTHMODE_WPA2_PSK ||
    authMethod == WIFIAUTHMODE_WPA_WPA2_PSK)
    {
        return wlanbasicsettings_checkWapPwd(ssid + '_wpa_key');
    }
    else
    {
        if (WIFIBASICENCRYPMODE_NONE != bscEncptMode)
        {
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey1'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey2'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey3'))
            {
                return false;
            }
            if (!wlanbasicsettings_checkNetworkKeyPwd(ssid + '_neworkKey4'))
            {
                return false;
            }
        }
    }

    return true;
}

function wlanbasicsettings_showPassword(str) {
    var cbValue = $(str).attr('checked');
    var strType = cbValue ? 'text' : 'password';
    if(cbValue){
        $('#check_wpa_psk_02').get(0).checked = true;
        $('#check_wpa_psk').get(0).checked = true;
    }
    else{
        $('#check_wpa_psk').get(0).checked = false;
        $('#check_wpa_psk_02').get(0).checked = false;
    }
    $.each($('input[name=ssid_key_name]'), function(i) {
        $("<input id='" + $(this).attr('id') + "' name='ssid_key_name' type='" + strType + "' class='input_style' maxlength='"+$(this).attr('maxlength')+"' value='" + $(this).val() + "' />")
            .replaceAll($('#' + $(this).attr('id')));

    });
}

function wlanbasicsettings_showPassword_ssid2(str) {
    var cbValue = $(str).attr('checked');
    var strType = cbValue ? 'text' : 'password';
    if(cbValue){
        $('#check_wpa_psk_ssid2').get(0).checked = true;
        $('#check_wpa_psk_ssid2_02').get(0).checked = true;
    }
    else{
        $('#check_wpa_psk_ssid2').get(0).checked = false;
        $('#check_wpa_psk_ssid2_02').get(0).checked = false;
    }
    $.each($('input[name=ssid_key_name_ssid2]'), function(i) {
        $("<input id='" + $(this).attr('id') + "' name='ssid_key_name_ssid2' type='" + strType + "' class='input_style' maxlength='"+$(this).attr('maxlength')+"' value='" + $(this).val() + "' />")
            .replaceAll($('#' + $(this).attr('id')));

    });
}

function wlanbasicsettings_apply() {
    clearAllErrorLabel();
    if (!isButtonEnable('apply_button'))
    {
        return;
    }

    if (!g_module.multi_ssid_enabled)
    {
        var auth = $('#ssid1_authentication').val();

        if (wlanbasicsettings_checkName('ssid1') && wlanbasicsettings_checkWifiSecurity('ssid1'))
        {
            if (WIFIAUTHMODE_OPEN == auth && $('#ssid1_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE){
                showConfirmDialog(wlan_hint_use_encryption, wlanbasicsettings_postData);
                $('#ssid1_wifiName').val($.trim($('#ssid1_wifiName').val()));
                return;
            }

            wlanbasicsettings_postData();
            $('#ssid1_wifiName').val($.trim($('#ssid1_wifiName').val()));
        }
    }
    else
    {
        var auth1 = $('#ssid1_authentication').val();
        var auth2 = $('#ssid2_authentication').val();
        if($("[name='ssid2Control']:checked").val() == 1){
            if (wlanbasicsettings_checkName('ssid1') && wlanbasicsettings_checkWifiSecurity('ssid1') &&
                wlanbasicsettings_checkName('ssid2') && wlanbasicsettings_checkWifiSecurity('ssid2')){
                    if($.trim($('#ssid1_wifiName').val()) == $.trim($('#ssid2_wifiName').val())){
                        showInfoDialog(multi_ssid_same_message);
                        return;
                    }
                    if ((WIFIAUTHMODE_OPEN == auth1 && $('#ssid1_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE) ||
                        (WIFIAUTHMODE_OPEN == auth2 && $('#ssid2_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE)){
                        showConfirmDialog(wlan_hint_use_encryption, wlanbasicsettings_multiSSID_postData);
                        $('#ssid2_wifiName').val($.trim($('#ssid2_wifiName').val()));
                        return;
                    }
                    wlanbasicsettings_multiSSID_postData();
                    $('#ssid2_wifiName').val($.trim($('#ssid2_wifiName').val()));
                }
        }else{
            if (wlanbasicsettings_checkName('ssid1') && wlanbasicsettings_checkWifiSecurity('ssid1')){
                if(WIFIAUTHMODE_OPEN == auth1 && $('#ssid1_encryption_mode_basic').val() == WIFIBASICENCRYPMODE_NONE){
                    showConfirmDialog(wlan_hint_use_encryption, wlanbasicsettings_multiSSID_postData);
                    $('#ssid1_wifiName').val($.trim($('#ssid1_wifiName').val()));
                    return;
                }
                wlanbasicsettings_multiSSID_postData();
                $('#ssid2_wifiName').val($.trim($('#ssid2_wifiName').val()));
            }
        }
    }

}

function wifiConfigDataDisplay(){
    if(g_WifiFeature.wifidisplayenable =='1')
    {
        $('#wlan_module').show();
    }
    else
    {
        $('#wlan_module').hide();
    }
    
     var varItem_aes = '<option value= ' + WIFIADVENCRYPMODE_AES + '\>' + wlan_label_aes + '</option>';
     var varItem_tkip = '<option value= ' + WIFIADVENCRYPMODE_TKIP + '\>' + wlan_label_tkip + '</option>';
     var varItem_mix = '<option value= ' + WIFIADVENCRYPMODE_MIX + '\>' + wlan_label_aes_tkip + '</option>';
     
     $('#ssid1_encryption_mode_wpa').append(varItem_aes);
     $('#ssid1_encryption_mode_wpa').append(varItem_tkip);
        
     $('#ssid2_encryption_mode_wpa').append(varItem_aes);
     $('#ssid2_encryption_mode_wpa').append(varItem_tkip);
        
    if(g_WifiFeature.wifiencryption_mix_enable !='0')
    {
         $('#ssid1_encryption_mode_wpa').append(varItem_mix);
         $('#ssid2_encryption_mode_wpa').append(varItem_mix);
    }
}

function multiSsidOnOffStatus() {
    if (!g_module.dataswitch_enabled) {
        getAjaxData("api/wlan/handover-setting", function($xml) {
            var ret = xml2object($xml);
            g_ssid2_wifiOffload = ret.response;
            if(g_ssid2_wifiOffload.Handover == 2) {
                $('#SSID2').hide();
                $("#ssid2_turn_on").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("checked","checked");
                $("#wifiOffloadMessage").show();
                setTimeout(multiSsidOnOffStatus, 3000);
            } else {
                $("#ssid2_turn_on").removeAttr("disabled");
                $("#ssid2_turn_off").removeAttr("disabled");
            }
        }, {
            sync:true
        });
    } else {
        getAjaxData("api/wlan/wifi-dataswitch", function($xml) {
            var ret = xml2object($xml);
            g_ssid2_wifiOffload = ret.response;
            if(ret.type == 'response' && ret.response.wifidataswitch == '1') {
                $('#SSID2').hide();
                $("#ssid2_turn_on").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("checked","checked");
                $("#wifiOffloadMessage").show();
                setTimeout(multiSsidOnOffStatus, 3000);
            } else {
                $("#ssid2_turn_on").removeAttr("disabled");
                $("#ssid2_turn_off").removeAttr("disabled");
            }
        }, {
            sync:true
        });
    }

    getAjaxData('api/wlan/multi-switch-settings', function($xml) {
        var ret = xml2object($xml);
        g_wlan_multiSsidStatus = ret.response;
        if(g_ssid2_wifiOffload.Handover == "0" || g_ssid2_wifiOffload.wifidataswitch == "0") {
            if(g_wlan_multiSsidStatus.multissidstatus == 1) {
                $("#ssid2_turn_on").attr("checked","checked");
                $("#ssid2_turn_off").removeAttr("checked");
                $('#SSID2').show();
            } else {
                $("#ssid2_turn_on").removeAttr("checked");
                $("#ssid2_turn_off").attr("checked","checked");
                $('#SSID2').hide();
            }
        }
    });
}
function main_executeBeforeDocumentReady(){
    getConfigData('config/wifi/configure.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
        g_psk_config = g_WifiFeature.wifiwps.wpspinpsk;
        
        if ('1' == g_WifiFeature.ssidpasswordenable) {
            g_wlan_Ssidpassword_config = g_WifiFeature.ssidpasswordenable;
        } else {           
            g_wlan_Ssidpassword_config = '0';
        }
        
    }, {
        sync: true
    });
}
main_executeBeforeDocumentReady();
/**********************************After loaded (common)************/
$(document).ready(function() {
    wifiConfigDataDisplay();
    $('input[type=checkbox]').removeAttr("checked");
    $('#tooltips_ico_help').qtip({
        content: '<b>' + wlan_label_encryption_mode + '</b>:' + wlan_label_aes + ',' + wlan_label_tkip + ',' + wlan_label_aes_tkip,
        position: {
            corner: {
                tooltip: 'rightMiddle',
                target: 'leftMiddle'
            }
        }
    });

    button_enable('apply_button', '0');
   $('input[type=text]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply_button', '1');
        }
       
    });
    
    $('input[type=radio]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply_button', '1');
         }
    });
    
    $('input[type=password]').live('keydown click', function(e) {//change input paste cut
        if(MACRO_KEYCODE != e.keyCode){
            button_enable('apply_button', '1');
        }
    });

    $('#check_wpa_psk').click(function() {
        wlanbasicsettings_showPassword('#check_wpa_psk');
    });
    
    $('#check_wpa_psk_02').click(function() {
        wlanbasicsettings_showPassword('#check_wpa_psk_02');
    });
    
    $('#check_wpa_psk_ssid2').click(function() {
        wlanbasicsettings_showPassword_ssid2('#check_wpa_psk_ssid2');
    });
    
    $('#check_wpa_psk_ssid2_02').click(function() {
        wlanbasicsettings_showPassword_ssid2('#check_wpa_psk_ssid2_02');
    });

    $('#ssid1_current_network_key, #ssid2_current_network_key').change(function() {
        button_enable('apply_button', '1');
    });

    $('#ssid1_authentication').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_authentication(this.value, 'ssid1');
    });

    $('#ssid1_encryption_mode_basic').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_networkKey(this.value, 'ssid1');
    });

    $('#ssid2_authentication').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_authentication(this.value, 'ssid2');
    });

    $('#ssid2_encryption_mode_basic').change(function() {
        button_enable('apply_button', '1');
        wlanbasicsettings_networkKey(this.value, 'ssid2');
    });

    $('#ssid1_encryption_mode_wpa, #ssid2_encryption_mode_wpa, #ssid1_wifiIsolate, #ssid2_wifiIsolate').change(function() {
        button_enable('apply_button', '1');
    });
    
    $('#wlan_wps_password_disply_input').live('click', function() {
        g_wlan_show_password.oledshowpassword = ($("#wlan_wps_password_disply_input:checked").val())?1:0;
        var xmlStr = object2xml('request', g_wlan_show_password);
        saveAjaxData('api/wlan/oled-showpassword', xmlStr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(sd_hint_wait_a_few_moments,true);
            } else {
                wlanbasicsettings_getSSIDPassword_DisplayEnable();
            }
        });
    });
    if (!g_module.multi_ssid_enabled) {
        $('#SSID2').hide();
        $('#id_ssid1_h2_name').hide();
        $('#id_tr_ssid1_wifiIsolate').hide();
        $("#ssid2_control").hide();
        wlanbasicsettings_initPage();
    }
    else
    {
        wlanbasicsettings_multiSSID_initPage();

        $("#ssid2_turn_on").click(function(){
            $("#ssid2_turn_off").removeAttr("checked");
            $('#SSID2').show();
            g_wlan_multiSsidStatus.multissidstatus = $("[name='ssid2Control']:checked").val();
            var xmlStr = object2xml('request', g_wlan_multiSsidStatus);
            saveAjaxData('api/wlan/multi-switch-settings', xmlStr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret))
                {
                    showInfoDialog(sd_hint_wait_a_few_moments,true);
                }
                else
                {
                    multiSsidOnOffStatus();
                    if(ret.error.code==ERROR_SYSTEM_BUSY){
                        showInfoDialog(common_system_busy);
                    }
                    else{
                        showInfoDialog(common_fail);
                    }
                }
            });
        });
        $("#ssid2_turn_off").click(function(){
            $("#ssid2_turn_on").removeAttr("checked");
            $('#SSID2').hide();
            g_wlan_multiSsidStatus.multissidstatus = $("[name='ssid2Control']:checked").val();
            var xmlStr = object2xml('request', g_wlan_multiSsidStatus);
            saveAjaxData('api/wlan/multi-switch-settings', xmlStr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret))
                {
                    showInfoDialog(sd_hint_wait_a_few_moments,true);
                }
                else
                {
                    multiSsidOnOffStatus();
                    if(ret.error.code==ERROR_SYSTEM_BUSY){
                        showInfoDialog(common_system_busy);
                    }
                    else{
                        showInfoDialog(common_fail);
                    }
                }
            });
        });
    }

});
