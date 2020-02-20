var g_quicksetup_currentProfileIndex;
var g_quicksetup_profileData;
var g_profile_list = [];
var g_quicksetup_currentProfileData;
var g_quicksetup_wifiSecurityData;
var g_quicksetup_wifiBasicData;
var quick_ethernet_conn_mode;
var quick_ethernet_dial_mode;
var g_AuFeature = null;
var g_WifiFeature = null;
var g_quicksetup_saveDataOK = false;
var QUICKSETUP_WIFIAUTHMODE_AUTO = 'AUTO';
var QUICKSETUP_WIFIAUTHMODE_OPEN = 'OPEN';
var QUICKSETUP_WIFIAUTHMODE_SHARE = 'SHARE';
var QUICKSETUP_WIFIAUTHMODE_WPA_PSK = 'WPA-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA2_PSK = 'WPA2-PSK';
var QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK = 'WPA/WPA2-PSK';
var QUICKSETUP_WIFIADVENCRYPMODE_AES = 'AES';
var QUICKSETUP_WIFIADVENCRYPMODE_TKIP = 'TKIP';
var QUICKSETUP_WIFIADVENCRYPMODE_MIX = 'MIX';
var QUICKSETUP_WIFIBASICENCRYPMODE_NONE = 'NONE';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP = 'WEP';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP64 = 'WEP64';
var QUICKSETUP_WIFIBASICENCRYPMODE_WEP128 = 'WEP128';

var WANSETTING_AUTO = '0';
var WANSETTING_PPPOE_DYNAMICIP = '1';
var WANSETTING_PPPOE = '2';
var WANSETTING_DYNAMICIP = '3';
var WANSETTING_STATICIP = '4';
var WANSETTING_LAN = '5';
var CONNECTIONMODE = {
    0: common_auto,
    1: IDS_ethernet_pppoe_plus_dynamic,
    2: IDS_wan_setting_pppoe,
    3: IDS_wan_setting_dynamicip,
    4: IDS_ethernet_setting_staticip,
    5: IDS_ethernet_settings_mode_lan
};

var DIALING_AUTO = 0;
var DIALING_ONDEMAND = 1;

var DIALINGMODE = {
    0: common_auto,
    1: IDS_ethernet_dialing_ondemand
};

var g_quicksetting_connMode = null;

var g_setting_connectionModeList = [[0, CONNECTIONMODE[0]], [1, CONNECTIONMODE[1]], [2, CONNECTIONMODE[2]], [3, CONNECTIONMODE[3]],[4, CONNECTIONMODE[4]],[5, CONNECTIONMODE[5]] ];

var g_setting_dialModeList = [[0,DIALINGMODE[0]],[1,DIALINGMODE[1]]];

var MIN_SIZE_RANGE = 576;
var MAX_PPPOE_SIZE = 1492;
var DEFAULT_PPPOE_MTU = 1480;
var MAX_DYNAMIC_STATIC_SIZE = 1500;

var MIN_CONN_TIME = 30;
var MAX_CONN_TIME = 7200;

var QUICK_SETUP_STEP1 = 1;
var QUICK_SETUP_STEP2 = 2;
var QUICK_SETUP_STEP3 = 3;
var QUICK_SETUP_STEP4 = 4;
var QUICK_SETUP_STEP5 = 5;

var dhcp_data = null;
var dhcp_ipaddress = null;
var dhcp_netmask = null;

var g_ssid2_OffloadStatus = null;
var g_wlan_multiSsidStatus = null;

var setup_need_valid = false;
var SETUP_STEP1_FIRST = 1;
var SETUP_STEP2_PROFILE = 2;
var SETUP_STEP3_CRADLE = 3;
var SETUP_STEP4_WLAN = 4;
var SETUP_STEP5_LAST = 5;

function quicksetup_disableIpInput() {
    $('#ipAddress').attr('disabled', 'disabled');
}

function quicksetup_enableIpInput() {
    $('#ipAddress').removeAttr('disabled');
}

function quicksetup_disableAPNInput() {
    $('#apn').attr('disabled', 'disabled');
}

function quicksetup_enableAPNInput() {
    $('#apn').removeAttr('disabled');
}

function quicksetup_disableProfileInput() {
    $('#profile_void_caution').html('');
    quicksetup_disableIpInput();
    quicksetup_disableAPNInput();

    $('#profileName').attr('disabled', 'disabled');
    $('#dialupNumber').attr('disabled', 'disabled');
    $('#userName').attr('disabled', 'disabled');
    $('#commonPassword').attr('disabled', 'disabled');
    $('#authentication').attr('disabled', 'disabled');

    $.each($('input[name=wlan_apn]'), function() {
        $(this).attr('disabled', 'disabled');
    });
    $.each($('input[name=wlan_ipAddress]'), function() {
        $(this).attr('disabled', 'disabled');
    });
}

function quicksetup_enableProfileInput() {
    $('#profile_void_caution').html('');
    quicksetup_disableIpInput();
    quicksetup_disableAPNInput();

    $('#profileName').removeAttr('disabled');
    $('#dialupNumber').removeAttr('disabled');
    $('#userName').removeAttr('disabled');
    $('#commonPassword').removeAttr('disabled');
    $('#authentication').removeAttr('disabled');

    $.each($('input[name=wlan_apn]'), function() {
        $(this).removeAttr('disabled');
    });
    $.each($('input[name=wlan_ipAddress]'), function() {
        $(this).removeAttr('disabled');
    });
}

function quicksetup_networkKey(key, ssid) {
    var idx = ssid.charAt(ssid.length - 1) - 1;
    var keyData = g_quicksetup_wifiSecurityData;

    if (g_module.multi_ssid_enabled) {
        keyData = g_quicksetup_wifiBasicData[idx];
    }

    if (key == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) {
        $('#' + ssid + '_network_key').hide();
    } else if (key == QUICKSETUP_WIFIBASICENCRYPMODE_WEP) {
        $('#' + ssid + '_network_key').show();
        $('#' + ssid + '_neworkKey1').val(keyData.WifiWepKey1);
    } else {
        log.error('Connection successed');
    }

    $('#' + ssid + '_encryption_mode_basic').val(key);

}

function quicksetup_initPage_profile() {
    getAjaxData('api/dialup/profiles', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            //bind item for profile
            g_quicksetup_currentProfileIndex = ret.response.CurrentProfile;
            g_quicksetup_profileData = ret.response.Profiles.Profile;

            if (g_quicksetup_profileData) {
                if ($.isArray(g_quicksetup_profileData)) {
                    g_profile_list = g_quicksetup_profileData;
                } else {
                    g_profile_list.push(g_quicksetup_profileData);
                }
            }

            $(g_profile_list).each( function(k, v) {
                var defaultName = $.trim(v.Name) ;
                while (defaultName.indexOf(' ') >= 0) {
                    defaultName = defaultName.replace(' ', '&nbsp;');
                }
                $('#profileName').append('<option value=' + v.Index + '>' + defaultName + '</option>');
            });
            function initCurrentProfile(index) {

                $.each(g_profile_list, function(ind, current_profile) {
                    if (current_profile.Index == index) {
                        g_quicksetup_currentProfileData = current_profile;
                        return;
                    }
                });
                $('#profileName').val(g_quicksetup_currentProfileData.Index);
                $("#profileName option[text='g_quicksetup_currentProfileData.Name']").attr('selected', true);
                $('#dialupNumber').val(g_quicksetup_currentProfileData.DialupNum);
                $('#userName').val(g_quicksetup_currentProfileData.Username);
                $('#commonPassword').val(g_quicksetup_currentProfileData.Password);
                $("input[name='wlan_apn'][value=" + g_quicksetup_currentProfileData.ApnIsStatic + ']').attr('checked', true);
                $('#apn').val(g_quicksetup_currentProfileData.ApnName);
                $("input[name='wlan_ipAddress'][value=" + g_quicksetup_currentProfileData.IpIsStatic + ']').attr('checked', true);
                $('#authentication').val(g_quicksetup_currentProfileData.AuthMode);

                if (g_quicksetup_currentProfileData.ReadOnly == 0) {
                    $('.profile_input').removeAttr('disabled');
                    $('#dialupNumber').attr('disabled', 'disabled');

                    // cannot modify APN while apn is dynamic
                    if (g_quicksetup_currentProfileData.ApnIsStatic == 0) {
                        $('#apn').attr('disabled', 'disabled');
                    }
                    // cannot modify IP Address whil ip address is dynamic
                    if (g_quicksetup_currentProfileData.IpIsStatic == 0) {
                        $('#ipAddress').attr('disabled', 'disabled');
                    }

                    if (g_quicksetup_currentProfileData.IpAddress != 0) {
                        $('#ipAddress').val(g_quicksetup_currentProfileData.IpAddress);
                    } else {
                        $('#ipAddress').val('');
                    }

                } else {
                    if (g_quicksetup_currentProfileData.IpAddress != 0) {
                        $('#ipAddress').val(g_quicksetup_currentProfileData.IpAddress);
                    } else {
                        $('#ipAddress').val('');
                    }

                    $('.profile_input').attr('disabled', 'disabled');
                }

                quicksetup_disableProfileInput();

                $('#profileName').removeAttr('disabled');
            }

            if (g_profile_list.length > 0 && g_quicksetup_currentProfileIndex >= 0) {
                initCurrentProfile(g_quicksetup_currentProfileIndex);
                $('#profileName').change( function() {
                    initCurrentProfile(this.value);
                });
            } else {
                quicksetup_disableProfileInput();
                $('#profile_void_caution').html("<a href='profilesmgr.html'>" + dialup_label_profile_management + '</a>');

            }

        }
        button_enable('step2_back', '1');
        button_enable('step2_next', '1');
    });
}

function quicksetup_initPage_wifi() {
    getAjaxData('api/wlan/security-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup_wifiSecurityData = ret.response;
            $('#ssid1_authentication').val(g_quicksetup_wifiSecurityData.WifiAuthmode);
            var wifiAuthmode = g_quicksetup_wifiSecurityData.WifiAuthmode;

            $('#ssid1_neworkKey1').val(g_quicksetup_wifiSecurityData.WifiWepKey1);
            $('#ssid1_encryption_mode_basic').val(g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes);

            $('#ssid1_wpa_key').val(g_quicksetup_wifiSecurityData.WifiWpapsk);
            $('#ssid1_encryption_mode_wpa').val(g_quicksetup_wifiSecurityData.WifiWpaencryptionmodes);

            if (wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_AUTO ||
            wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_OPEN ||
            wifiAuthmode == QUICKSETUP_WIFIAUTHMODE_SHARE) {
                $('#div_ssid1_encrypt_way1').show();
                $('#div_ssid1_encrypt_way2').hide();

                if (QUICKSETUP_WIFIAUTHMODE_SHARE == wifiAuthmode ||
                QUICKSETUP_WIFIAUTHMODE_AUTO == wifiAuthmode) {
                    $("#ssid1_encryption_mode_basic option[value='NONE']").remove();
                } else {
                    if ($("#ssid1_encryption_mode_basic option[value='NONE']").length == 0) {
                        $('#ssid1_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                    }
                }

                quicksetup_networkKey(g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes, 'ssid1');
            } else {
                $('#div_ssid1_encrypt_way2').show();
                $('#div_ssid1_encrypt_way1').hide();
            }
        }
    });
    getAjaxData('api/wlan/basic-settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup_wifiBasicData = ret.response;
            $('#ssid1_wifiName').val(g_quicksetup_wifiBasicData.WifiSsid);
            $('#ssid1_broadcast_select').val(g_quicksetup_wifiBasicData.WifiHide);
        }
    });
}

function quicksetup_initPage_wifiMultiSSID() {
    getAjaxData('api/wlan/multi-security-settings', function($xml) {
        var ret = xml2object($xml);
        g_quicksetup_wifiSecurityData = ret.response;
    });
    var ssids = ['ssid1', 'ssid2'];

    getAjaxData('api/wlan/multi-basic-settings', function($xml) {
        var ret = xml2object($xml);
        g_quicksetup_wifiBasicData = ret.response.Ssids.Ssid;

        //SSID1,2 Initialization
        var i = 0;
        for (i = 0; i < ssids.length; i++) {
            $('#' + ssids[i] + '_wifiName').val(g_quicksetup_wifiBasicData[i].WifiSsid);
            $('#' + ssids[i] + '_broadcast_select').val(g_quicksetup_wifiBasicData[i].WifiBroadcast);

            var authMode = g_quicksetup_wifiBasicData[i].WifiAuthmode;

            $('#' + ssids[i] + '_authentication').val(authMode);

            $('#' + ssids[i] + '_neworkKey1').val(g_quicksetup_wifiBasicData[i].WifiWepKey1);
            $('#' + ssids[i] + '_encryption_mode_wpa').val(g_quicksetup_wifiBasicData[i].WifiWpaencryptionmodes);
            $('#' + ssids[i] + '_wpa_key').val(g_quicksetup_wifiBasicData[i].WifiWpapsk);

            if (QUICKSETUP_WIFIAUTHMODE_AUTO == authMode ||
            QUICKSETUP_WIFIAUTHMODE_OPEN == authMode ||
            QUICKSETUP_WIFIAUTHMODE_SHARE == authMode) {
                $('#div_' + ssids[i] + '_encrypt_way1').show();
                $('#div_' + ssids[i] + '_encrypt_way2').hide();

                if (QUICKSETUP_WIFIAUTHMODE_AUTO == authMode ||
                QUICKSETUP_WIFIAUTHMODE_SHARE == authMode) {
                    $('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").remove();
                } else {
                    if ($('#' + ssids[i] + "_encryption_mode_basic option[value='NONE']").length == 0) {
                        $('#' + ssids[i] + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
                        $('#' + ssids[i] + '_encryption_mode_basic').val(g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes);
                    }
                }
                $('#' + ssids[i] + '_encryption_mode_basic').val(g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes);

                quicksetup_networkKey($('#' + ssids[i] + '_encryption_mode_basic').val(), ssids[i]);
            } else {
                $('#div_' + ssids[i] + '_encrypt_way2').show();
                $('#div_' + ssids[i] + '_encrypt_way1').hide();
            }
        }
    });
}

function multiSsidOnOffControl() {
    if (!g_module.dataswitch_enabled) {
        getAjaxData("api/wlan/handover-setting", function($xml) {
            var ret = xml2object($xml);
            g_ssid2_OffloadStatus = ret.response;
            if(g_ssid2_OffloadStatus.Handover == '2') {
                $('#SSID2').hide();
                $('#ssid2_settings_base').hide();
                $("#ssid2_turn_on").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("checked","checked");
                $("#wifiOffloadMessage").show();
                setTimeout(multiSsidOnOffControl, 3000);
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
            g_ssid2_OffloadStatus = ret.response;
            if(ret.type == 'response' && ret.response.wifidataswitch == '1') {
                $('#SSID2').hide();
                $('#ssid2_settings_base').hide();
                $("#ssid2_turn_on").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("disabled","disabled");
                $("#ssid2_turn_off").attr("checked","checked");
                $("#wifiOffloadMessage").show();
                setTimeout(multiSsidOnOffControl, 3000);
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
        if(g_ssid2_OffloadStatus.Handover == '0' || g_ssid2_OffloadStatus.wifidataswitch == '0') {
            if(g_wlan_multiSsidStatus.multissidstatus == 1) {
                $("#ssid2_turn_on").attr("checked","checked");
                $("#ssid2_turn_off").removeAttr("checked");
                $('#SSID2').show();
                $('#ssid2_settings_base').show();
            } else {
                $("#ssid2_turn_on").removeAttr("checked");
                $("#ssid2_turn_off").attr("checked","checked");
                $('#SSID2').hide();
                $('#ssid2_settings_base').hide();
            }
        }
    });
}

function quicksetup_initPageData() {
    quicksetup_initPage_profile();

    if (!g_module.multi_ssid_enabled) {
        $('#SSID2').hide();
        $('#ssid2_settings_base').hide();
        $("#ssid2_settings_base_title").hide();
        $('#id_ssid1_label_name').hide();
        $('#id_ssid1_h3_name').hide();
        $('#id_ssid1_tr_name').hide();
        quicksetup_initPage_wifi();
    } else {
        quicksetup_initPage_wifiMultiSSID();
        multiSsidOnOffControl();

        $("#ssid2_turn_on").click( function() {
            $("#ssid2_turn_off").removeAttr("checked");
            $('#SSID2').show();
            $('#ssid2_settings_base').show();
            g_wlan_multiSsidStatus.multissidstatus = $("[name='ssid2Control']:checked").val();
            var xmlStr = object2xml('request', g_wlan_multiSsidStatus);
            saveAjaxData('api/wlan/multi-switch-settings', xmlStr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    showInfoDialog(sd_hint_wait_a_few_moments,true);
                } else {
                    multiSsidOnOffControl();
                    if(ret.error.code==ERROR_SYSTEM_BUSY) {
                        showInfoDialog(common_system_busy);
                    } else {
                        showInfoDialog(common_fail);
                    }
                }
            });
        });
        $("#ssid2_turn_off").click( function() {
            $("#ssid2_turn_on").removeAttr("checked");
            $('#SSID2').hide();
            $('#ssid2_settings_base').hide();
            g_wlan_multiSsidStatus.multissidstatus = $("[name='ssid2Control']:checked").val();
            var xmlStr = object2xml('request', g_wlan_multiSsidStatus);
            saveAjaxData('api/wlan/multi-switch-settings', xmlStr, function($xml) {
                var ret = xml2object($xml);
                if (isAjaxReturnOK(ret)) {
                    showInfoDialog(sd_hint_wait_a_few_moments,true);
                } else {
                    multiSsidOnOffControl();
                    if(ret.error.code==ERROR_SYSTEM_BUSY) {
                        showInfoDialog(common_system_busy);
                    } else {
                        showInfoDialog(common_fail);
                    }
                }
            });
        });
    }

    var quick_setup_step = IDS_wizard_quick_setup_step;
    var step1 = quick_setup_step.replace("%d",QUICK_SETUP_STEP1).replace("%e",QUICK_SETUP_STEP4);
    var step2 = quick_setup_step.replace("%d",QUICK_SETUP_STEP2).replace("%e",QUICK_SETUP_STEP4);
    var step4 = quick_setup_step.replace("%d",QUICK_SETUP_STEP3).replace("%e",QUICK_SETUP_STEP4);
    var step5 = quick_setup_step.replace("%d",QUICK_SETUP_STEP4).replace("%e",QUICK_SETUP_STEP4);
    $('#step_1').text(step1);
    $('#step_2').text(step2);
    $('#step_4').text(step4);
    $('#step_5').text(step5);
    if (g_module.cradle_enabled) {
        step1 = quick_setup_step.replace("%d",QUICK_SETUP_STEP1).replace("%e",QUICK_SETUP_STEP5);
        step2 = quick_setup_step.replace("%d",QUICK_SETUP_STEP2).replace("%e",QUICK_SETUP_STEP5);
        var step3 = quick_setup_step.replace("%d",QUICK_SETUP_STEP3).replace("%e",QUICK_SETUP_STEP5);
        step4 = quick_setup_step.replace("%d",QUICK_SETUP_STEP4).replace("%e",QUICK_SETUP_STEP5);
        step5 = quick_setup_step.replace("%d",QUICK_SETUP_STEP5).replace("%e",QUICK_SETUP_STEP5);
        $('#step_1').text(step1);
        $('#step_2').text(step2);
        $('#step_3').text(step3);
        $('#step_4').text(step4);
        $('#step_5').text(step5);
        getDhcpData();
        quicksetup_initPage_ethernet();
    }
}

// initPage ethernet data
function quicksetup_initPage_ethernet() {
    getAjaxData('api/cradle/basic-info', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_quicksetup_ethernetData = ret.response;
            quicksetup_init_ethernet_value();
            quicksetup_ethernet_select_mode();
        } else {
            showInfoDialog(common_failed);
            log.error("CradleInit:api/cradle/basic-info file failed");
        }
    }, {
        sync: true
    });
}

function quicksetup_init_ethernet_value() {
    $('#ethernet_connection_mode').val(g_quicksetup_ethernetData.connectionmode);
    g_quicksetting_connMode = $('#ethernet_connection_mode').val();
    quicksetup_init_select_value();
}

function quicksetup_init_select_value() {
    $('#select_wan_dialing_mode').val(g_quicksetup_ethernetData.dialmode);
    $('#input_ethernet_username').val(g_quicksetup_ethernetData.pppoeuser).removeAttr('disabled');
    $('#input_ethernet_password').val(g_quicksetup_ethernetData.pppoepwd).removeAttr('disabled');
    $('#input_disconn_time').val(g_quicksetup_ethernetData.maxidletime).removeAttr('disabled');
    $('#input_ip_address').val(g_quicksetup_ethernetData.ipaddress).removeAttr('disabled');
    $('#input_subnet_mask').val(g_quicksetup_ethernetData.netmask).removeAttr('disabled');
    $('#input_gate_way').val(g_quicksetup_ethernetData.gateway).removeAttr('disabled');
    $('#input_dns_server').val(g_quicksetup_ethernetData.primarydns).removeAttr('disabled');
    $('#input_spare_server').val(g_quicksetup_ethernetData.secondarydns).removeAttr('disabled');
    $('#input_mtu_size').val(g_quicksetup_ethernetData.pppoemtu).removeAttr('disabled');
    if (g_quicksetup_ethernetData.dynamicsetdnsmanual == '1') {
        $('#quick_dynamic_manual').attr('checked',true);
        $('#quick_dynamic_dns_server').removeAttr('disabled');
        $('#quick_dynamic_spare_server').removeAttr('disabled');
    } else {
        $('#quick_dynamic_manual').attr('checked',false);
        $('#quick_dynamic_dns_server').attr('disabled',true);
        $('#quick_dynamic_spare_server').attr('disabled',true);
    }
    $('#quick_dynamic_dns_server').val(g_quicksetup_ethernetData.dynamicprimarydns);
    $('#quick_dynamic_spare_server').val(g_quicksetup_ethernetData.dynamicsecondarydns);
    $('#static_mtu_size').val(g_quicksetup_ethernetData.staticipmtu).removeAttr('disabled');
    $('#dynamic_mtu_size').val(g_quicksetup_ethernetData.dynamicipmtu).removeAttr('disabled');
    $('#ondemand_mtuinfo').show();
    $('#dynamic_mtuinfo').show();
    $('#static_mtuinfo').show();
}

function quicksetup_ethernet_select_mode() {
    clearAllErrorLabel();
    $('#quick_pppoe_cut_line').hide();
    $('#quick_user_table').hide();
    $('#quick_static_table').hide();
    $('#quick_dynamic_mtu_line').hide();
    $('#quick_dynamic_mtu_table').hide();
    $('.quick_set_dns_manual').hide();

    var pppoe_mtu_info = IDS_ethernet_default_mtu.replace("%d",DEFAULT_PPPOE_MTU);
    $('#default_pppoe_mtu').text(pppoe_mtu_info);
    var dynamic_static_mtu = IDS_ethernet_default_mtu.replace("%d",MAX_DYNAMIC_STATIC_SIZE);
    $('#default_dynamic_mtu').text(dynamic_static_mtu);
    $('#default_static_mtu').text(dynamic_static_mtu);
    if (WANSETTING_AUTO == g_quicksetting_connMode) {
        $('#quick_pppoe_cut_line').show();
        $('#quick_user_table').show();
        $('#option_change_showinfo').html(IDS_ethernet_auto_clew_msg);
        $('#quick_dynamic_mtu_line').show();
        $('#quick_dynamic_mtu_table').show();
        $('.quick_set_dns_manual').show();
    } else if (WANSETTING_PPPOE_DYNAMICIP == g_quicksetting_connMode) {
        $('#quick_pppoe_cut_line').show();
        $('#quick_user_table').show();
        $('#option_change_showinfo').html(IDS_ethernet_pppoe_dynamic_clew_msg);
        $('#quick_dynamic_mtu_line').show();
        $('#quick_dynamic_mtu_table').show();
        $('.quick_set_dns_manual').show();
    } else if (WANSETTING_PPPOE == g_quicksetting_connMode) {
        $('#option_change_showinfo').html(IDS_ethernet_pppoe_clew_msg);
        $('#quick_user_table').show();
    } else if (WANSETTING_DYNAMICIP == g_quicksetting_connMode) {
        $('#option_change_showinfo').html(IDS_ethernet_dynamic_clew_msg);
        $('#quick_dynamic_mtu_table').show();
        $('.quick_set_dns_manual').show();
    } else if (WANSETTING_STATICIP == g_quicksetting_connMode) {
        $('#option_change_showinfo').html(IDS_ethernet_static_clew_msg);
        $('#quick_static_table').show();
    } else if (WANSETTING_LAN == g_quicksetting_connMode) {
        $('#option_change_showinfo').html(IDS_ethernet_lan_clew_msg);
    }
    quicksetup_wanSetting_dialMode(g_quicksetup_ethernetData.dialmode);
}

function quicksetup_authentication(lable, ssid) {
    if (lable == QUICKSETUP_WIFIAUTHMODE_AUTO ||
    lable == QUICKSETUP_WIFIAUTHMODE_OPEN ||
    lable == QUICKSETUP_WIFIAUTHMODE_SHARE) {
        $('#div_' + ssid + '_encrypt_way1').show();
        $('#div_' + ssid + '_encrypt_way2').hide();

        if (QUICKSETUP_WIFIAUTHMODE_AUTO == lable ||
        QUICKSETUP_WIFIAUTHMODE_SHARE == lable) {
            $('#' + ssid + "_encryption_mode_basic option[value='NONE']").remove();
            $('#' + ssid + '_encryption_mode_basic').val(QUICKSETUP_WIFIBASICENCRYPMODE_WEP);
        } else {
            if ($('#' + ssid + "_encryption_mode_basic option[value='NONE']").length == 0) {
                $('#' + ssid + '_encryption_mode_basic').prepend("<option value='NONE'>" + wlan_label_none + '</option>');
            }
        }

        quicksetup_networkKey($('#' + ssid + '_encryption_mode_basic').val(), ssid);
    } else if (lable == QUICKSETUP_WIFIAUTHMODE_WPA_PSK ||
    lable == QUICKSETUP_WIFIAUTHMODE_WPA2_PSK ||
    lable == QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK) {
        $('#checkbox_password').show();
        $('#div_' + ssid + '_encrypt_way2').show();
        $('#div_' + ssid + '_encrypt_way1').hide();
        $('#' + ssid + '_encryption_mode_wpa').val(QUICKSETUP_WIFIADVENCRYPMODE_MIX);
    } else {
        log.info("Exception case!");
    }
}

function quicksetup_validateSsid(ssid) {
    var name = $.trim($('#' + ssid + '_wifiName').val());
    var errMsg = validateSsid(name);
    if (common_ok != errMsg) {
        showErrorUnderTr(ssid + '_wifiName_error_msg',errMsg);
        $('#' + ssid + '_wifiName').focus();
        $('#' + ssid + '_wifiName').select();
        return false;
    } else {
        return true;
    }
}

function quicksetup_validateProfile() {
    if (g_profile_list.length == 0) {
        $('#profile_void_caution').html("<a href='profilesmgr.html'>" + dialup_label_profile_management + '</a>');
        return false;
    }

    if (g_quicksetup_currentProfileData.ReadOnly == 1) {
        // readonly profile, not able to modify, no need to validate
        return true;
    }

    var profileName = $('#profileName').find("option:selected").text();
    var dialupNumber = $('#dialupNumber').val();
    var username = $('#userName').val();
    var password = $('#commonPassword').val();
    var apn = $.trim($('#apn').val());
    var ipaddress = $('#ipAddress').val();
    var isApnStatic = $("input[name='wlan_apn']:checked").val();
    var isIpStatic = $("input[name='wlan_ipAddress']:checked").val();

    // check profile name
    if (profileName.length > 32 || profileName.length < 1) {
        showErrorUnderTextbox('profileName', dialup_hilink_hint_profile_name_invalidate);
        $('#profileName').focus();
        $('#profile_input').select();
        return false;
    }
    if (!checkInputChar(profileName)) {
        showErrorUnderTextbox('profileName', dialup_hilink_hint_profile_name_invalidate);
        $('#profileName').focus();
        $('#profileName').select();
        return false;
    }

    // check username
    if (username != '' && false == checkInputChar(username)) {
        if (username.length > 32 || username.length < 1) {
            showErrorUnderTextbox('userName', dialup_hilink_hint_username_invalidate);
            $('#userName').focus();
            $('#userName').select();
            return false;
        }
        if (!checkInputChar(username)) {
            showErrorUnderTextbox('userName', dialup_hilink_hint_username_invalidate);
            $('#userName').focus();
            $('#userName').select();
            return false;
        }
    }
    // check password
    if (password != '' && false == checkInputChar(password)) {
        if (password.length > 32 || password.length < 1) {
            showErrorUnderTextbox('commonPassword', dialup_hilink_hint_password_invalidate);
            $('#commonPassword').focus();
            $('#commonPassword').select();
            return false;
        }

        if (!checkInputChar(password)) {
            showErrorUnderTextbox('commonPassword', dialup_hilink_hint_password_invalidate);
            $('#commonPassword').focus();
            $('#commonPassword').select();
            return false;
        }
    }
    // check apn
    if (isApnStatic == '1') {

        if (apn.length > 32 || apn.length < 1 || -1 < apn.indexOf(" ") || ( ! checkInputChar(apn) ) ) {
            showErrorUnderTextbox('apn', dialup_hilink_hint_apn_name_invalidate);
            $('#apn').focus();
            $('#apn').select();
            return false;
        }
    }

    // check ip address
    if (isIpStatic == '1') {
        if (!isValidIpAddress(ipaddress)) {
            showErrorUnderTextbox('ipAddress', dialup_hint_ip_address_empty);
            $('#ipAddress').focus();
            $('#ipAddress').select();
            return false;
        }
    }

    return true;
}

function quicksetup_validateNeworkKeyPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length) {
        errMsg = dialup_hint_password_empty;
    } else if (hasSpaceOrTabAtHead(pwdVal)) {
        errMsg = input_cannot_begin_with_space;
    } else if (10 == pwdVal.length || 26 == pwdVal.length) {
        if (!isHexString(pwdVal)) {
            errMsg = wlan_hint_64_or_128_bit_key;
        } else {
            ret = true;
        }
    } else if (5 == pwdVal.length || 13 == pwdVal.length) {
        if (!checkInputChar(pwdVal)) {
            errMsg = wlan_hint_wep_key_valid_type;
        } else {
            ret = true;
        }
    } else {
        errMsg = wlan_hint_64_or_128_bit_key;
    }

    if (!ret) {
        showErrorUnderTr(password + '_error',errMsg);
        //showErrorUnderTextbox(password, errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function quicksetup_validateWepPwd(password) {
    var pwdVal = $('#' + password).val();
    var errMsg = null;
    var ret = false;

    if (0 == pwdVal.length) {
        errMsg = dialup_hint_password_empty;
    } else if (hasSpaceOrTabAtHead(pwdVal)) {
        errMsg = input_cannot_begin_with_space;
    } else if (64 == pwdVal.length) {
        if (!isHexString(pwdVal)) {
            errMsg = wlan_hint_wps_psk_valid_type;
        } else {
            ret = true;
        }
    } else if (pwdVal.length >= 8 && pwdVal.length <= 63) {
        if (!checkInputChar(pwdVal)) {
            errMsg = wlan_hint_wps_psk_valid_char;
        } else {
            ret = true;
        }
    } else {
        errMsg = wlan_hint_wps_psk_valid_type;
    }

    if (!ret) {
        showErrorUnderTr(password + '_error',errMsg);
        $('#' + password).focus();
        $('#' + password).select();
    }

    return ret;
}

function quicksetup_ValidateWifiSecurity(ssid) {
    var ifw = $('#' + ssid + '_authentication').val();
    if (ifw == QUICKSETUP_WIFIAUTHMODE_WPA_PSK ||
    ifw == QUICKSETUP_WIFIAUTHMODE_WPA2_PSK ||
    ifw == QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK) {
        if (!quicksetup_validateWepPwd(ssid + '_wpa_key')) {
            return false;
        }
    } else if (ifw == QUICKSETUP_WIFIAUTHMODE_AUTO ||
    ifw == QUICKSETUP_WIFIAUTHMODE_OPEN ||
    ifw == QUICKSETUP_WIFIAUTHMODE_SHARE) {
        if ($('#' + ssid + '_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) {
            return true;
        } else {
            if (!quicksetup_validateNeworkKeyPwd(ssid + '_neworkKey1')) {
                return false;
            }
        }
    }

    return true;
}

function quicksetup_showStepLast() {
    var i = 0;
    var ssids = ['ssid1'];

    if (g_module.multi_ssid_enabled) {
        ssids.push('ssid2');
        if($("[name='ssid2Control']:checked").val() == 1) {
            $('#ssid2_settings_final').show();
        } else {
            $('#ssid2_settings_final').hide();
        }
    } else {
        $('#ssid2_settings_final').hide();
    }

    for (i = 0; i < ssids.length; ++i) {
        var wifiName = '';
        var authMode = $('#' + ssids[i] + '_authentication option:selected').text();
        var authVal = $('#' + ssids[i] + '_authentication').val();
        wifiName = $.trim($('#' + ssids[i] + '_wifiName').val() );
        $('#' + ssids[i] + '_label_name').html('<pre>' + wifiName + '</pre>');
        $('#' + ssids[i] + '_label_authentication').html(authMode);

        if (QUICKSETUP_WIFIAUTHMODE_WPA_PSK == authVal ||
        QUICKSETUP_WIFIAUTHMODE_WPA2_PSK == authVal ||
        QUICKSETUP_WIFIAUTHMODE_WPA_WPA2_PSK == authVal) {
            $('#' + ssids[i] + '_label_encryption_mode').html($('#' + ssids[i] + '_encryption_mode_wpa  option:selected').text());
        } else {
            $('#' + ssids[i] + '_label_encryption_mode').html($('#' + ssids[i] + '_encryption_mode_basic  option:selected').text());
        }

        $('#' + ssids[i] + '_label_ssid_broadcast').html($('#' + ssids[i] + '_broadcast_select option:selected').text());
    }

    if (g_module.cradle_enabled) {
        $('#quick_ethernet').show();
        $('#ethernet_mode_label').show();
        var g_cradleconnStatus = $('#ethernet_connection_mode').val();
        $.each(g_setting_connectionModeList, function(n, value) {
            if (value[0] == g_cradleconnStatus) {
                $('#label_connection').text(value[1]);
            }
        });
    }

    $('#label_authentication').html($('#authentication option:selected').text());
    if('' == $('#apn').val()) {
        $('#label_apn').html(dialup_label_dynamic_numeric);
    } else {
        $('#label_apn').html($('#apn').val());
    }
    $('#label_profile_name').html($('#profileName option:selected').text());
    $('#label_dialup_number').html($('#dialupNumber').val());
    $('#label_user_name').html('<pre>' + $('#userName').val() + '</pre>');
    $('#label_ip_address').html($('#ipAddress').val());
    showSetupStep(SETUP_STEP5_LAST);
}

function quick_validateUsernameAndPassword() {
    clearAllErrorLabel();
    var username = $.trim($('#input_ethernet_username').val());
    var password = $.trim($('#input_ethernet_password').val());

    if ('' == username || null == username ) {
        showErrorUnderTr('ondemand_username', settings_hint_user_name_empty);
        $('#input_ethernet_username').focus();
        $('#input_ethernet_username').val('');
        return false;
    } else if (checkInputPPPoEChar(username) == false) {
        showErrorUnderTr('ondemand_username', IDS_ethernet_pppoe_username);
        $('#input_ethernet_username').focus();
        $('#input_ethernet_username').val('');
        return false;
    } else if ('' == password || null == password ) {
        showErrorUnderTr('ondemand_password', dialup_hint_password_empty);
        $('#input_ethernet_password').focus();
        $('#input_ethernet_password').val('');
        return false;
    } else if (checkInputPPPoEChar(password) == false) {
        showErrorUnderTr('ondemand_password', IDS_ethernet_pppoe_password);
        $('#input_ethernet_password').focus();
        $('#input_ethernet_password').val('');
        return false;
    } else {
        return true;
    }
}

function getDhcpData() {
    getAjaxData('api/dhcp/settings', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            dhcp_data = ret.response;
            dhcp_netmask = dhcp_data.DhcpLanNetmask;
            dhcp_ipaddress = dhcp_data.DhcpIPAddress;
        }
    });
}

function quickverifyIpInput() {
    clearAllErrorLabel();
    var ipaddress = $('#input_ip_address').val();
    var subnetMask = $('#input_subnet_mask').val();
    var defaultGateway = $('#input_gate_way').val();
    var primaryDnsServer = $('#input_dns_server').val();
    var secondaryDnsServer = $('#input_spare_server').val();

    var plusMask = ipPlusip(subnetMask,dhcp_netmask);
    var plusIp = ipPlusip(ipaddress,plusMask);
    var plusDhcp = ipPlusip(dhcp_ipaddress,plusMask);
    var plusGateway = ipPlusip(defaultGateway,plusMask);
    var plusDnsserver = ipPlusip(primaryDnsServer,plusMask);
    var plusSparedns = ipPlusip(secondaryDnsServer,plusMask);
    if (!validStaticIp(ipaddress)) {
        showErrorUnderTr('ip_address', dialup_hint_ip_address_empty);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }

    if (!isValidSubnetMask(subnetMask)) {
        showErrorUnderTr('subnet_mask', IDS_ethernet_subnet_mask_error);
        $('#input_subnet_mask').focus();
        $('#input_subnet_mask').val('');
        return false;
    }
    if (plusIp == plusDhcp) {
        showErrorUnderTr('ip_address', IDS_ethernet_vefify_ipdhcpip);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }
    if (!obverseMask(ipaddress,subnetMask)) {
        showErrorUnderTr('ip_address', dialup_hint_ip_address_empty);
        $('#input_ip_address').focus();
        $('#input_ip_address').val('');
        return false;
    }
    if ('' != defaultGateway && '0.0.0.0' != defaultGateway ) {
        if (!validStaticIp(defaultGateway)) {
            showErrorUnderTr('gate_way', IDS_ethernet_default_gateway);
            $('#input_gate_way').focus();
            $('#input_gate_way').val('');
            return false;
        }
        if (plusGateway == plusDhcp) {
            showErrorUnderTr('gate_way',IDS_ethernet_vefify_gatewaydhcpip );
            $('#input_gate_way').focus();
            $('#input_gate_way').val('');
            return false;
        }
        if (!obverseMask(defaultGateway,subnetMask)) {
            showErrorUnderTr('gate_way', IDS_ethernet_default_gateway);
            $('#input_gate_way').focus();
            $('#input_gate_way').val('');
            return false;
        }
        if (!isSameSubnetAddrs(ipaddress,defaultGateway,subnetMask)) {
            showErrorUnderTr('gate_way', IDS_ethernet_verify_ipgateway);
            $('#input_gate_way').focus();
            $('#input_gate_way').val('');
            return false;
        }
    }
    if ('' != primaryDnsServer && '0.0.0.0' != primaryDnsServer) {
        if (!validStaticIp(primaryDnsServer)) {
            showErrorUnderTr('dns_server', IDS_ethernet_primary_dns);
            $('#input_dns_server').focus();
            $('#input_dns_server').val('');
            return false;
        }
        if (plusDnsserver == plusDhcp) {
            showErrorUnderTr('dns_server', IDS_ethernet_vefify_dnsdhcip);
            $('#input_dns_server').focus();
            $('#input_dns_server').val('');
            return false;
        }
    }
    if ('' != secondaryDnsServer && '0.0.0.0' != secondaryDnsServer) {
        if (!validStaticIp(secondaryDnsServer)) {
            showErrorUnderTr('spare_dns_server', IDS_ethernet_secondary_dns);
            $('#input_spare_server').focus();
            $('#input_spare_server').val('');
            return false;
        }
        if (plusSparedns == plusDhcp) {
            showErrorUnderTr('spare_dns_server', IDS_ethernet_vefify_sparednsdhcip);
            $('#input_spare_server').focus();
            $('#input_spare_server').val('');
            return false;
        }
    }
    return true;
}

function ipPlusip(part1,part2) {
    var result = '';
    var partOne = part1.split('.');
    var partTwo = part2.split('.');
    for (i = 0; i < 4; i++) {
        result += Number(partOne[i]) & Number(partTwo[i]);
        result = result+".";
    }
    result = result.substring(0,result.length-1);
    return result;
}

function validDynamicDns() {
    clearAllErrorLabel();
    var dynamicDns = $.trim($('#quick_dynamic_dns_server').val());
    var dynamicSpareDns = $.trim($('#quick_dynamic_spare_server').val());
    if (WANSETTING_AUTO == quick_ethernet_conn_mode || WANSETTING_PPPOE_DYNAMICIP == quick_ethernet_conn_mode || WANSETTING_DYNAMICIP == quick_ethernet_conn_mode) {
        if ($('#quick_dynamic_manual').attr('checked')) {
            if (!validStaticIp(dynamicDns)) {
                showErrorUnderTr('quick_set_primary_dns', IDS_ethernet_primary_dns);
                $('#quick_dynamic_dns_server').focus();
                $('#quick_dynamic_dns_server').val('');
                return false;
            }
            if ('' != dynamicSpareDns && '0.0.0.0' != dynamicSpareDns) {
                if (!validStaticIp(dynamicSpareDns)) {
                    showErrorUnderTr('quick_set_spare_dns', IDS_ethernet_secondary_dns);
                    $('#quick_dynamic_spare_server').focus();
                    $('#quick_dynamic_spare_server').val('');
                    return false;
                }
            }
        } else {
            return true;
        }
    }
    return true;
}

function quick_validMtusize() {
    var pppoeMtuSize = $.trim($('#input_mtu_size').val());
    var dynamciMtuSize = $.trim($('#dynamic_mtu_size').val());
    var staticMtuSize = $.trim($('#static_mtu_size').val());
    var pppoeMtuMsg = IDS_ethernet_mtu_size_range.replace("%d",MIN_SIZE_RANGE).replace("%e",MAX_PPPOE_SIZE);
    var dynamicMtuMsg = IDS_ethernet_mtu_size_range.replace("%d",MIN_SIZE_RANGE).replace("%e",MAX_DYNAMIC_STATIC_SIZE);

    if (quick_ethernet_conn_mode == WANSETTING_AUTO || quick_ethernet_conn_mode == WANSETTING_PPPOE_DYNAMICIP || quick_ethernet_conn_mode == WANSETTING_PPPOE) {
        if (!IsDigital(pppoeMtuSize) ||pppoeMtuSize < MIN_SIZE_RANGE || pppoeMtuSize > MAX_PPPOE_SIZE) {
            $('#ondemand_mtuinfo').hide();
            showErrorUnderTr('ondemand_mtusize', pppoeMtuMsg);
            $('#input_mtu_size').focus();
            $('#input_mtu_size').val('');
            return false;
        }
    }
    if (quick_ethernet_conn_mode == WANSETTING_AUTO || quick_ethernet_conn_mode == WANSETTING_PPPOE_DYNAMICIP || quick_ethernet_conn_mode == WANSETTING_DYNAMICIP) {
        if (!IsDigital(dynamciMtuSize) || dynamciMtuSize < MIN_SIZE_RANGE || dynamciMtuSize > MAX_DYNAMIC_STATIC_SIZE) {
            $('#dynamic_mtuinfo').hide();
            showErrorUnderTr('dynamic_mtusize', dynamicMtuMsg);
            $('#dynamic_mtu_size').focus();
            $('#dynamic_mtu_size').val('');
            return false;
        }
    }
    if (quick_ethernet_conn_mode == WANSETTING_STATICIP) {
        if (!IsDigital(staticMtuSize) ||staticMtuSize < MIN_SIZE_RANGE || staticMtuSize > MAX_DYNAMIC_STATIC_SIZE) {
            $('#static_mtuinfo').hide();
            showErrorUnderTr('static_mtusize', dynamicMtuMsg);
            $('#static_mtu_size').focus();
            $('#static_mtu_size').val('');
            return false;
        }
    }
    return true;
}

function quick_validateTime() {
    clearAllErrorLabel();
    var time = $.trim($('#input_disconn_time').val());
    var timeErrorMsg = IDS_ethernet_idle_time.replace("%d",MIN_CONN_TIME).replace("%e",MAX_CONN_TIME);

    if (!IsDigital(time) ||time < MIN_CONN_TIME || time > MAX_CONN_TIME) {
        showErrorUnderTr('auto_disconnect', timeErrorMsg);
        $('#input_disconn_time').focus();
        $('#input_disconn_time').val('');
        return false;
    }
    return true;
}

function quick_validate_ethernet() {
    clearAllErrorLabel();
    quick_ethernet_conn_mode = $('#ethernet_connection_mode').val();
    quick_ethernet_dial_mode = $('#select_wan_dialing_mode').val();
    var quick_mtuValid;
    var quick_timeValid;
    var quick_bValid;
    var optionValid;
    if (quick_ethernet_conn_mode == WANSETTING_AUTO || quick_ethernet_conn_mode == WANSETTING_PPPOE_DYNAMICIP || quick_ethernet_conn_mode == WANSETTING_PPPOE) {
        quick_bValid = quick_validateUsernameAndPassword();
        if(!quick_bValid) {
            return false;
        }
        if (quick_ethernet_dial_mode == DIALING_ONDEMAND) {
            quick_timeValid = quick_validateTime();
            if (!quick_timeValid) {
                return false;
            }
        }
        quick_mtuValid = quick_validMtusize();
        if (!quick_mtuValid) {
            return false;
        }
        if (WANSETTING_PPPOE != quick_ethernet_conn_mode) {
            optionValid = validDynamicDns();
            if (!optionValid) {
                return false;
            }
        }
        return true;
    } else if (quick_ethernet_conn_mode == WANSETTING_DYNAMICIP) {
        quick_mtuValid = quick_validMtusize();
        if (!quick_mtuValid) {
            return false;
        }
        optionValid = validDynamicDns();
        if (!optionValid) {
            return false;
        }
        return true;
    } else if (quick_ethernet_conn_mode == WANSETTING_STATICIP) {
        var quickipValid = quickverifyIpInput();
        if (!quickipValid) {
            return false;
        }
        quick_mtuValid = quick_validMtusize();
        if (!quick_mtuValid) {
            return false;
        }
        return true;
    } else if (quick_ethernet_conn_mode == WANSETTING_LAN) {
        return true;
    }
}

function quicksetup_settings(step) {
    startLogoutTimer();
    clearAllErrorLabel();
    if (!setup_need_valid) {
        showSetupStep(step);
        if($('#profileName').text() == '' || $('#profileName').val() == null) {
            button_enable('step2_next', '0');
        }
        return;
    }
    var i = 0;
    var ssids = ['ssid1'];
    if (step == SETUP_STEP1_FIRST) {
        log.info("First step:show user some info");
    } else if (step == SETUP_STEP2_PROFILE) {
        log.info("Second step:no need to valid");
    } else if (step == SETUP_STEP3_CRADLE) {
        log.info("Profile:no need to valid");

    } else if (step == SETUP_STEP4_WLAN) {
        if (g_module.cradle_enabled) {
            if (!quick_validate_ethernet()) {
                return;
            }
        } else {
            log.info("Profile:no need to valid");
        }
    } else if (step == SETUP_STEP5_LAST) {
        ssids = ['ssid1'];
        if (g_module.multi_ssid_enabled && $("[name='ssid2Control']:checked").val() == 1) {
            ssids.push('ssid2');
        }
        for (i = 0; i < ssids.length; ++i) {
            if (!quicksetup_validateSsid(ssids[i])) {
                return;
            }
            if (!quicksetup_ValidateWifiSecurity(ssids[i])) {
                return;
            }
        }
        if (!g_module.multi_ssid_enabled) {
            var auth = $('#ssid1_authentication').val();
            if(QUICKSETUP_WIFIAUTHMODE_OPEN == auth && $('#ssid1_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) {
                showConfirmDialog(wlan_hint_use_encryption, quicksetup_showStepLast);
                return;
            } else {
                quicksetup_showStepLast();
            }
        } else {
            var auth1 = $('#ssid1_authentication').val();
            var auth2 = $('#ssid2_authentication').val();

            if($("[name='ssid2Control']:checked").val() == 1) {
                if($.trim($('#ssid1_wifiName').val()) == $.trim($('#ssid2_wifiName').val())) {
                    showInfoDialog(multi_ssid_same_message);
                    return;
                }
                if((QUICKSETUP_WIFIAUTHMODE_OPEN == auth1 && $('#ssid1_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) ||
                    (QUICKSETUP_WIFIAUTHMODE_OPEN == auth2 && $('#ssid2_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE)){
                    showConfirmDialog(wlan_hint_use_encryption, quicksetup_showStepLast);
                    return;
                }
            } else {
                if (QUICKSETUP_WIFIAUTHMODE_OPEN == auth1 && $('#ssid1_encryption_mode_basic').val() == QUICKSETUP_WIFIBASICENCRYPMODE_NONE) {
                    showConfirmDialog(wlan_hint_use_encryption, quicksetup_showStepLast);
                    return;
                }
            }
            quicksetup_showStepLast();
        }
    }
    showSetupStep(step);
}

function showSetupStep(step) {
    var i;
    for (i = 1; i <= 5; i++) {
        $('#quicksetup' + i).css('display', 'none');
    }
    $('#quicksetup' + step).css('display', 'block');
}

function quicksetup_postData_wifi() {
    g_quicksetup_wifiBasicData.WifiSsid = $.trim($('#ssid1_wifiName').val());
    g_quicksetup_wifiBasicData.WifiHide = $('#ssid1_broadcast_select').val();
    g_quicksetup_wifiBasicData.WifiRestart = 0;

    // wifi authentication
    g_quicksetup_wifiSecurityData.WifiAuthmode = $('#ssid1_authentication').val();
    g_quicksetup_wifiSecurityData.WifiWpaencryptionmodes = $('#ssid1_encryption_mode_wpa').val();
    g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes = $('#ssid1_encryption_mode_basic').val();
    g_quicksetup_wifiSecurityData.WifiRestart = 1;
    if(("AUTO" == g_quicksetup_wifiSecurityData.WifiAuthmode
    || "OPEN" == g_quicksetup_wifiSecurityData.WifiAuthmode
    || "SHARE" == g_quicksetup_wifiSecurityData.WifiAuthmode)
    && ("WEP" == g_quicksetup_wifiSecurityData.WifiBasicencryptionmodes)) {
        g_quicksetup_wifiSecurityData.WifiWepKey1 = $("#ssid1_neworkKey1").val();
        g_quicksetup_wifiSecurityData.WifiWepKeyIndex = "1";
    } else {
        g_quicksetup_wifiSecurityData.WifiWpapsk = $("#ssid1_wpa_key").val();
    }

    var xmlstr_settings = object2xml('request', g_quicksetup_wifiBasicData);
    saveAjaxData('api/wlan/basic-settings', xmlstr_settings, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
        }
        var xmlstr_security = object2xml('request', g_quicksetup_wifiSecurityData);
        saveAjaxData('api/wlan/security-settings', xmlstr_security, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret)) {
                g_quicksetup_saveDataOK = false;
            }
        });
    });
}

function quicksetup_postData_wifiMultiSSID() {
    var postData = {};
    var ssids = ['ssid1', 'ssid2'];
    var i = 0;
    for (i = 0; i < ssids.length; i++) {
        g_quicksetup_wifiBasicData[i].WifiSsid = $.trim($('#' + ssids[i] + '_wifiName').val());
        g_quicksetup_wifiBasicData[i].WifiBroadcast = $('#' + ssids[i] + '_broadcast_select').val();
        g_quicksetup_wifiBasicData[i].WifiAuthmode = $('#' + ssids[i] + '_authentication').val();
        g_quicksetup_wifiBasicData[i].WifiWpaencryptionmodes = $('#' + ssids[i] + '_encryption_mode_wpa').val();
        g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes = $('#' + ssids[i] + '_encryption_mode_basic').val();

        if(("AUTO" == g_quicksetup_wifiBasicData[i].WifiAuthmode
        || "OPEN" == g_quicksetup_wifiBasicData[i].WifiAuthmode
        || "SHARE" == g_quicksetup_wifiBasicData[i].WifiAuthmode)
        && (wlan_label_wep == g_quicksetup_wifiBasicData[i].WifiBasicencryptionmodes)) {
            g_quicksetup_wifiBasicData[i].WifiWepKey1 = $("#"+ssids[i]+"_neworkKey1").val();
            g_quicksetup_wifiBasicData[i].WifiWepKeyIndex = "1";
        } else {
            g_quicksetup_wifiBasicData[i].WifiWpapsk = $("#"+ssids[i]+"_wpa_key").val();
        }
    }

    button_enable('apply_button', '0');

    postData = {
        Ssids: {
            Ssid: g_quicksetup_wifiBasicData
        },
        WifiRestart: 0
    };

    g_quicksetup_wifiSecurityData.WifiEnable = $("[name='mode']:checked").val();
    g_quicksetup_wifiSecurityData.WifiRestart = 1;

    var xmlStr = object2xml('request', postData);
    saveAjaxData('api/wlan/multi-basic-settings', xmlStr, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
        }
        xmlStr = object2xml('request', g_quicksetup_wifiSecurityData);
        saveAjaxData('api/wlan/multi-security-settings', xmlStr, function($xml) {
            var ret = xml2object($xml);
            if (!isAjaxReturnOK(ret)) {
                g_quicksetup_saveDataOK = false;
            }
        });
    });
}

// post data ethernet
function quicksetup_postData_ethernet() {
    var quick_set_ethernet_mode = $('#ethernet_connection_mode').val();
    var usernameBefore = $.trim($('#input_ethernet_username').val());
    var userName = wifiSsidResolveCannotParseChar(usernameBefore);
    var pwdBefore = $.trim($('#input_ethernet_password').val());
    var pwd = wifiSsidResolveCannotParseChar(pwdBefore);
    var dialMode = $('#select_wan_dialing_mode').val();
    var idleTime = $.trim($('#input_disconn_time').val());
    var pppoeMtu = $.trim($('#input_mtu_size').val());
    var ipAddress = $.trim($('#input_ip_address').val());
    var subnetMask = $.trim($('#input_subnet_mask').val());
    var gateWay = $.trim($('#input_gate_way').val());
    if (gateWay == '' || gateWay == '0.0.0.0') {
        gateWay = '0.0.0.0';
    }
    var dnsServer = $.trim($('#input_dns_server').val());
    if (dnsServer == '' || dnsServer == '0.0.0.0') {
        dnsServer = '0.0.0.0';
    }
    var spareDns = $.trim($('#input_spare_server').val());
    if (spareDns == '' || spareDns == '0.0.0.0') {
        spareDns = '0.0.0.0';
    }
    var staticMtu = $.trim($('#static_mtu_size').val());
    var dynamicMtu = $.trim($('#dynamic_mtu_size').val());
    var primaryDns = $.trim($('#quick_dynamic_dns_server').val());
    var secondaryDns = $.trim($('#quick_dynamic_spare_server').val());
    if ($('#quick_dynamic_manual').attr('checked')) {
        setDynamicDns = '1';
        if ('' == secondaryDns) {
            secondaryDns = '0.0.0.0';
        }
    } else {
        setDynamicDns = '0';
        primaryDns = '0.0.0.0';
        secondaryDns = '0.0.0.0';
    }
    var request;
    request = {
        connectionmode:quick_set_ethernet_mode,
        pppoeuser: userName,
        pppoepwd: pwd,
        dialmode: dialMode,
        maxidletime: idleTime,
        pppoemtu: pppoeMtu,
        dynamicipmtu: dynamicMtu,
        staticipmtu: staticMtu,
        ipaddress: ipAddress,
        netmask: subnetMask,
        gateway: gateWay,
        primarydns: dnsServer,
        secondarydns: spareDns,
        dynamicsetdnsmanual: setDynamicDns,
        dynamicprimarydns: primaryDns,
        dynamicsecondarydns: secondaryDns
    };
    var xmlethernetData = object2xml('request', request);
    saveAjaxData('api/cradle/basic-info', xmlethernetData, function($xml) {
        var ret = xml2object($xml);
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
            log.error("CradleSettings:api/cradle/basic-info file failed");
        }
    });
}

function quicksetup_postData() {
    var newXmlString = '';
    g_quicksetup_saveDataOK = true;
    // profile

    var request_profile = {
        Delete: 0,
        SetDefault: $('#profileName').val(),
        Modify: 0
    };

    var xmlstr_profiles = object2xml('request', request_profile);
    saveAjaxData('api/dialup/profiles', xmlstr_profiles, function($xml) {
        var ret = xml2object($xml);

        var saveState = ret.response;
        if (!isAjaxReturnOK(ret)) {
            g_quicksetup_saveDataOK = false;
        }
    });
    // wifi beginning
    if (!g_module.multi_ssid_enabled) {
        quicksetup_postData_wifi();
    } else {
        quicksetup_postData_wifiMultiSSID();
    }
    // wifi ending

    if (g_module.cradle_enabled) {
        quicksetup_postData_ethernet();
    }

    showWaitingDialog(common_waiting, sd_hint_wait_a_few_moments, function() {
        setTimeout( function() {
            userOut();
        }, g_feature.dialogdisapear);
    });
}

function quicksetup_finish() {
    //showConfirmDialog( wlan_hint_disconnect_wlan, quicksetup_postData );
    quicksetup_postData();
}

function quicksetup_bindButtonClick() {
    $('#step1').click( function() {
        setup_need_valid = false;
        quicksetup_settings(SETUP_STEP2_PROFILE);
    });
    $('#step2_back').click( function() {
        if (isButtonEnable('step2_back')) {
            setup_need_valid = false;
            quicksetup_settings(SETUP_STEP1_FIRST);
        }
    });
    if (g_module.cradle_enabled) {
        $('#step2_next').click( function() {
            if (isButtonEnable('step2_next')) {
                setup_need_valid = true;
                quicksetup_settings(SETUP_STEP3_CRADLE);
            }
        });
        $('#step3_back').click( function() {
            setup_need_valid = false;
            quicksetup_settings(SETUP_STEP2_PROFILE);
        });
        $('#step3_next').click( function() {
            setup_need_valid = true;
            quicksetup_settings(SETUP_STEP4_WLAN);
        });
        $('#step4_back').click( function() {
            setup_need_valid = false;
            quicksetup_settings(SETUP_STEP3_CRADLE);
        });
    } else {
        $('#step2_next').click( function() {
            if (!isButtonEnable('step2_next')) {
                return;
            }
            setup_need_valid = true;
            quicksetup_settings(SETUP_STEP4_WLAN);
        });
        $('#step4_back').click( function() {
            setup_need_valid = false;
            quicksetup_settings(SETUP_STEP2_PROFILE);
        });
    }
    $('#step4_next').click( function() {
        setup_need_valid = true;
        quicksetup_settings(SETUP_STEP5_LAST);
    });
    $('#step5_back').click( function() {
        setup_need_valid = false;
        quicksetup_settings(SETUP_STEP4_WLAN);
    });
    $('#step_finish').click( function() {
        quicksetup_finish();
    });
}

function configDataDisplay() {
    if(g_AuFeature.authentication_info_enabled =='1') {
        $('.tr_authentication').show();
    } else {
        $('.tr_authentication').hide();
    }
    if(g_AuFeature.dialup_number_enabled =='1') {
        $('#dialup_number').show();
        $('#last_dialup_number').show();
    } else {
        $('#dialup_number').hide();
        $('#last_dialup_number').hide();
    }

    getMonitoringStatus();
    if ('0' == g_AuFeature.apn_enabled) {
        $('.menu_apn').hide();
    } else {
        if( MACRO_NET_DUAL_MODE == g_net_mode_type &&  MACRO_NET_MODE_C== g_net_mode_status) {
            $('.menu_apn').hide();
        } else {
            $('.menu_apn').show();
        }
    }
}

function quicksetup_wanSetting_dialMode(mode) {
    clearAllErrorLabel();
    if (mode == DIALING_ONDEMAND) {
        $('#auto_disconnect').show();
        $('#input_disconn_time').val(g_quicksetup_ethernetData.maxidletime);
    } else if (mode == DIALING_AUTO) {
        $('#auto_disconnect').hide();
    }
}

function initDnsSetup() {
    clearAllErrorLabel();
    if ($('#quick_dynamic_manual').attr('checked')) {
        $('#quick_dynamic_dns_server').removeAttr('disabled');
        $('#quick_dynamic_spare_server').removeAttr('disabled');
        $('#quick_dynamic_dns_server').val(g_quicksetup_ethernetData.dynamicprimarydns);
        $('#quick_dynamic_spare_server').val(g_quicksetup_ethernetData.dynamicsecondarydns);
    } else {
        $('#quick_dynamic_dns_server').attr('disabled',true);
        $('#quick_dynamic_spare_server').attr('disabled',true);
        $('#quick_dynamic_dns_server').val('0.0.0.0');
        $('#quick_dynamic_spare_server').val('0.0.0.0');
    }
}

function main_executeBeforeDocumentReady() {
    getConfigData('config/wifi/configure.xml', function($xml) {
        g_WifiFeature = _xml2feature($xml);
    }, {
        sync: true
    });
}

main_executeBeforeDocumentReady();
function modeChangeHandle() {
    if(MACRO_NET_MODE_CHANGE  == g_net_mode_change) {

        if(MACRO_NET_MODE_C == g_net_mode_status) {
            $('.menu_apn').hide();
        } else {
            $('.menu_apn').show();
        }
        resetNetModeChange();

    }
}
$(document).ready( function() {
    getConfigData('config/dialup/config.xml', function($xml) {
        g_AuFeature = _xml2feature($xml);
    }, {
        sync: true
    });
    configDataDisplay();

    // init cradle page
    if (g_module.cradle_enabled) {
        $('#quick_ethernet').show();
        $('#ethernet_mode_label').show();
        var mode_list = '';
        $.each(g_setting_connectionModeList, function(n, value) {
            mode_list = '<option style="vertical-align:middle;" value = ' + value[0] + '>' + value[1] + '</option>';
            $('#ethernet_connection_mode').append(mode_list);
        });
        var dialMode_list = '';
        $.each(g_setting_dialModeList, function(n, value) {
            dialMode_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
            $('#select_wan_dialing_mode').append(dialMode_list);
        });
        $('#ethernet_connection_mode').change( function() {
            g_quicksetting_connMode = $('#ethernet_connection_mode').val();
            quicksetup_init_select_value();
            quicksetup_ethernet_select_mode();
        });
        $('#select_wan_dialing_mode').change( function() {
            quicksetup_wanSetting_dialMode(this.value);
        });
        $('#quick_dynamic_manual').bind('click',initDnsSetup);
    } else {
        $('#quicksetup3').remove();
        $('#quick_ethernet').hide();
        $('#ethernet_mode_label').hide();
    }

    $('#ssid1_authentication, #ssid2_authentication').change( function() {
        clearAllErrorLabel();
        var ssid = 'ssid1';
        if ('ssid2_authentication' == this.id) {
            ssid = 'ssid2';
        }
        quicksetup_authentication(this.value, ssid);
    });
    $('#ssid1_encryption_mode_basic, #ssid2_encryption_mode_basic').change( function() {
        clearAllErrorLabel();
        var ssid = 'ssid1';
        if ('ssid2_encryption_mode_basic' == this.id) {
            ssid = 'ssid2';
        }
        quicksetup_networkKey(this.value, ssid);
    });
    $('#authentication').append("<option value='0'>" + common_auto + '</option>');
    $('#authentication').append("<option value='1'>" + dialup_label_pap + '</option>');
    $('#authentication').append("<option value='2'>" + dialup_label_chap + '</option>');

    $('#ssid1_broadcast_select').append("<option value='0'>" + common_enable + '</option>');
    $('#ssid1_broadcast_select').append("<option value='1'>" + common_disable + '</option>');

    $('#ssid2_broadcast_select').append("<option value='0'>" + common_enable + '</option>');
    $('#ssid2_broadcast_select').append("<option value='1'>" + common_disable + '</option>');

    $("#ssid1_authentication option[value='AUTO']").text(common_auto);
    $("#ssid1_authentication option[value='OPEN']").text(wlan_label_open);
    $("#ssid1_authentication option[value='SHARE']").text(wlan_label_share);
    $("#ssid1_authentication option[value='WPA-PSK']").text(wlan_label_wpa_psk);
    $("#ssid1_authentication option[value='WPA2-PSK']").text(wlan_label_wpa2_psk);
    $("#ssid1_authentication option[value='WPA/WPA2-PSK']").text(wlan_label_wpa_wpa2_psk);

    $('#ssid2_authentication').append("<option value='AUTO'>" + common_auto + '</option>');
    $('#ssid2_authentication').append("<option value='OPEN'>" + wlan_label_open + '</option>');
    $('#ssid2_authentication').append("<option value='SHARE'>" + wlan_label_share + '</option>');

    var varItem_aes = "<option value='AES'>" + wlan_label_aes + '</option>';
    var varItem_tkip = "<option value='TKIP'>" + wlan_label_tkip + '</option>';
    var varItem_mix =  "<option value='MIX'>" + wlan_label_aes_tkip + '</option>';
    $('#ssid1_encryption_mode_wpa').append(varItem_aes);
    $('#ssid1_encryption_mode_wpa').append(varItem_tkip);
    $('#ssid2_encryption_mode_wpa').append(varItem_aes);
    $('#ssid2_encryption_mode_wpa').append(varItem_tkip);
    if(g_WifiFeature.wifiencryption_mix_enable !='0') {
        $('#ssid1_encryption_mode_wpa').append(varItem_mix);
        $('#ssid2_encryption_mode_wpa').append(varItem_mix);
    }
    $('#ssid1_encryption_mode_basic').append("<option value='WEP'>" + wlan_label_wep + '</option>');
    $('#ssid2_encryption_mode_basic').append("<option value='WEP'>" + wlan_label_wep + '</option>');
    if('1' == g_AuFeature.apn_enabled && MACRO_NET_DUAL_MODE == g_net_mode_type) {
        addStatusListener('modeChangeHandle()');
    }
    // init page data
    quicksetup_initPageData();
    //bind button click
    quicksetup_bindButtonClick();
});