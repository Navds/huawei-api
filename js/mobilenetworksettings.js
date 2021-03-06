var SETTING_DIALUP_MACRO_INVALID_SIM_CARD = '0';
//var NETWORK_REGISTERMODE_DEFAULT = "1";
var SETTING_DIALUP_AUTO_SEARCH_NET = 0;
var SETTING_DIALUP_MANUAL_SEARCH_NET = 1;
var SETTING_DIALUP_RAT_2G = 0;
var SETTING_DIALUP_RAT_3G = 2;
var SETTING_DIALUP_RAT_4G = 7;
var SETTING_DIALUP_PLMN = null;
var DEFAULT_DEVICE_NAME = 'default';
var AUTO_MODE = '0';
var NW_NULL_STRING = '';
var OLDINTERFACE = 0;
var NEWINTERFACE = 1;
var PLMN_USABLE = '1';
var PLMN_REGISTERED = '2';
var PLMN_FORBIDDEN = '3';
var networkband_enable = true;
var networksearch_enable = true;
var g_netsearchresponse = true;
var networksearch_hide = false;
var g_setting_netWork = {
    NetworkMode: null,
    NetworkBand: null
};
var g_networkband = {
    NetworkBands: null
};
var g_setting_register = {
    Mode: null,
    Plmn: null,
    Rat: null
};
var AUTO = [0, common_auto];
var GSM_ONLY = [1, dialup_label_2g_only];
var WCDMA_ONLY = [2, dialup_label_3g_only];
var GSM_PRE = [3, dialup_label_2g_preferred];
var WCDMA_PRE = [4, dialup_label_3g_preferred];
var LTE_only = [5, dialup_label_4g_only];
var LTE_PRE = [6, dialup_label_4g_preferred];
var NETWORKMODES = {
    0: common_auto,
    1: dialup_label_2g_only, //GSM only
    2: dialup_label_3g_only,//WCDMA only
    3: dialup_label_2g_preferred,//GSM Pre
    4: dialup_label_3g_preferred,//WCDMA Pre
    5: dialup_label_4g_only   //GSM only
};
var g_networknodes = {
    0: common_auto,          //auto
    1: plmn_label_2g, //gsm
    2: plmn_label_3g, //wcdma
    3: plmn_label_4g, //lte
    4: plmn_label_2g, //cdma 1x
    5: plmn_label_3g, //td-scdma
    6: plmn_label_3g, //wimax
    7: plmn_label_3g //cdma evdo
};
var g_NetworkNodesFlag = {
    0: common_auto,          //auto
    1: plmn_label_2g, //gsm
    2: plmn_label_3g, //wcdma
    3: plmn_label_4g, //lte
    4: plmn_label_2g, //cdma 1x
    5: plmn_label_3g, //td-scdma
    6: plmn_label_3g, //wimax
    7: plmn_label_3g //cdma evdo
};
var g_compoundnetworknodes = {
    1: 'GSM', //gsm
    2: 'WCDMA', //wcdma
    3: 'LTE', //lte
    4: 'CDMA 1X', //cdma 1x
    5: 'TD-SCDMA', //td-scdma
    6: 'Wimax', //wimax
    7: 'EVDO' //cdma evdo
};
var g_net_mode_enable = OLDINTERFACE;
var g_network_list_empty = 1;
var g_setting_netWorkModeListIndex = [];
var g_setting_netWorkModeList = [[0, NETWORKMODES[0]],[1, NETWORKMODES[1]], [2, NETWORKMODES[2]]]; //default mode

var G850G1900 = 0x280000;
var GSM1900 = 0x200000;
var GSM1800 = 0x80;
var GSM900 = 0x300;
var GSM850 = 0x80000;
var W850W1900 = 0x4800000;
var W2100 = 0x400000;
var W1900 = 0x800000;
var W850 = 0x4000000;
var W900 = 0x2000000000000;

var g_arrNetworkBand = [];
g_arrNetworkBand.push([0x80, Label_CM_BAND_PREF_GSM_DCS_1800]);
g_arrNetworkBand.push([0x300, Label_CM_BAND_PREF_GSM_900]);
g_arrNetworkBand.push([0x200000, Label_CM_BAND_PREF_GSM_PCS_1900]);
g_arrNetworkBand.push([0x400000, Label_CM_BAND_PREF_WCDMA_I_IMT_2000]);
g_arrNetworkBand.push([0x800000, Label_CM_BAND_PREF_WCDMA_1900]);
g_arrNetworkBand.push([0x4000000, Label_CM_BAND_PREF_WCDMA_850]);
g_arrNetworkBand.push([0x40000000, Label_CM_BAND_PREF_NO_CHANGE]);
g_arrNetworkBand.push([0x4000000000000, Label_CM_BAND_PREF_WCDMA_IX_1700]);
g_arrNetworkBand.push([0x2000000000000, Label_CM_BAND_PREF_WCDMA_900]);
g_arrNetworkBand.push([0x80000, Label_CM_BAND_PREF_GSM_850]);
g_arrNetworkBand.push([0x00000001, Label_CM_BAND_PREF_BC0_A]);
g_arrNetworkBand.push([0x00000002, Label_CM_BAND_PREF_BC0_B]);
g_arrNetworkBand.push([0x00000004, Label_CM_BAND_PREF_BC1]);
g_arrNetworkBand.push([0x00000008, Label_CM_BAND_PREF_BC2]);
g_arrNetworkBand.push([0x00000010, Label_CM_BAND_PREF_BC3]);
g_arrNetworkBand.push([0x00000020, Label_CM_BAND_PREF_BC4]);
g_arrNetworkBand.push([0x00000040, Label_CM_BAND_PREF_BC5]);
g_arrNetworkBand.push([0x00000400, Label_CM_BAND_PREF_BC6]);
g_arrNetworkBand.push([0x00000800, Label_CM_BAND_PREF_BC7]);
g_arrNetworkBand.push([0x00001000, Label_CM_BAND_PREF_BC8]);
g_arrNetworkBand.push([0x00002000, Label_CM_BAND_PREF_BC9]);
g_arrNetworkBand.push([0x00004000, Label_CM_BAND_PREF_BC10]);
g_arrNetworkBand.push([0x00008000, Label_CM_BAND_PREF_BC11]);
g_arrNetworkBand.push([0x10000000, Label_CM_BAND_PREF_BC12]);
g_arrNetworkBand.push([0x20000000, Label_CM_BAND_PREF_BC14]);
g_arrNetworkBand.push([0x80000000, Label_CM_BAND_PREF_BC15]);
function transactionEnd() {
    button_enable('mobilensetting_apply', '1');
    g_netsearchresponse  = true;
}

function IsCDMAorAUTO(netmode) {
    if(false == networksearch_enable) {
        return;
    }
    if(MACRO_NET_SINGLE_MODE == g_net_mode_type) {
        return;
    }
    networksearch_hide = false;
    if(OLDINTERFACE == g_net_mode_enable) {
        if(AUTO_MODE == netmode) {
            networksearch_hide = true;
        }
    } else if(NEWINTERFACE == g_net_mode_enable) {
        if(null != netmode.match(/4|7/) || AUTO_MODE == netmode) {
            networksearch_hide = true;
        }
    } else {
        log.debug('Inteface Error');
    }
    if(true == networksearch_hide) {
        $('#networksearch').hide();
    } else {
        $('#networksearch').show();
    }
}

function setting_dialup_getNetworkBand(device_name) {
    var band_list = '';
    var default_band_list = '';
    var networkBandList = [];
    var networkband_conf_file = 'config/network/networkband_' + device_name + '.xml';
    getConfigData(networkband_conf_file, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            g_networkband.NetworkBands = ret.config.NetworkBands.Band;
            jQuery.each(g_networkband.NetworkBands, function(index, value) {
                var str = getBandString(parseInt(value, 10));
                networkBandList[index] = [];
                networkBandList[index].push(value);
                networkBandList[index].push(str);
                log.debug('Band string = ' + str);
                if (str.length > 0) {
                    if (g_setting_netWork.NetworkBand == value) {
                        $('#band_select').val(str);
                        log.debug('current band = ' + str);
                    }
                }
            });
            $.each(networkBandList, function(n, value) {
                band_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
                $('#band_select').append(band_list);
            });
            /*
             $('#band_select').change(function() {
             button_enable('mobilensetting_apply', '1');
             });
             */
        }
    }, {
        sync: true
    });
}

function setNetWork() {
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_setting_netWork.NetworkMode = parseInt(ret.response.NetworkMode, 10);
            IsCDMAorAUTO(NW_NULL_STRING + g_setting_netWork.NetworkMode);
            g_setting_netWork.NetworkBand = ret.response.NetworkBand;
            g_setting_netWork.LTEBand = ret.response.LTEBand;

            var i=0;
            var modeValidFlag = false;
            for(i=0; i < g_setting_netWorkModeList.length; i++) {
                if (g_setting_netWork.NetworkMode == g_setting_netWorkModeList[i][0]) {
                    $('#preferred_mode_select').val(g_setting_netWork.NetworkMode);
                    modeValidFlag = true;
                    break;
                }
            }
            if(false == modeValidFlag) {
                $('#preferred_mode_select').val(g_setting_netWorkModeList[0][0]);
            }
        } else {
            log.error('MOBILENETWORKSETTING: get api/net/net-mode data error');
        }
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode file failed');
        }
    });
}

//a method includ 3 function
function setting_dialup_initVar() {
    this.getNetwork = function() {
        if(NEWINTERFACE == g_net_mode_enable) {
            setNetWork();
        } else {
            getAjaxData('api/net/network', function($xml) {
                var ret = xml2object($xml);
                if (ret.type == 'response') {
                    g_setting_netWork.NetworkMode = ret.response.NetworkMode;
                    g_setting_netWork.NetworkBand = ret.response.NetworkBand;
                    var flag = 0;
                    $.each(g_setting_netWorkModeList, function(n, value) {
                        if(value[0] == g_setting_netWork.NetworkMode) {
                            flag = 1;
                            return;
                        }
                    });
                    if(1 == flag) {
                        $('#preferred_mode_select').val(g_setting_netWork.NetworkMode);
                    } else {
                        $('#preferred_mode_select').val(g_setting_netWorkModeList[0][0]);
                    }
                    IsCDMAorAUTO(NW_NULL_STRING + parseInt($('#preferred_mode_select').val() ,10));
                } else {
                    log.error('MOBILENETWORKSETTING: get api/net/network data error');
                }
            }, {
                errorCB: function() {
                    log.error('MOBILENETWORKSETTING:get api/net/network file failed');
                }
            });
        }
    } ;//function 1 end
    this.getInfomation = function() {
        if(networkband_enable) {
            getAjaxData('api/device/information', function($xml) {
                var device_ret = xml2object($xml);
                var device_name = null;
                if (device_ret.type == 'response') {
                    device_name = getDeviceType(device_ret.response.DeviceName);
                    setting_dialup_getNetworkBand(device_name);
                } else {
                    log.error('MOBILENETWORKSETTING:get api/device/infomation data error');
                }
            }, {
                errorCB: function() {
                    log.error('MOBILENETWORKSETTING: get api/device/infomation file failed');
                }
            });
        }
    };
    this.getRegister = function() {
        getAjaxData('api/net/register', function($xml) {
            var ret = xml2object($xml);
            if (ret.type == 'response') {
                g_setting_register.Mode = parseInt(ret.response.Mode, 10);
                g_setting_register.Plmn = ret.response.Plmn;
                g_setting_register.Rat = ret.response.Rat;
                if(document.getElementById('network_select')) {
                    $('#network_select').val(g_setting_register.Mode);
                }
            } else {
                log.error('MOBILENETWORKSETTING:get api/net/register data error');
            }
        }, {
            errorCB: function() {
                log.error('MOBILENETWORKSETTING:get api/net/register file failed');
            }
        });
    };
}

function setNetWorkModeList(list) {
    g_setting_netWorkModeList = [];
    $.each(list, function(n, value) {
        var string = "";
        var index = parseInt(value, 10);
        var i=0;
        if(value.length > 2) {
            var j = 0;
            for(j = 0; (j+1)*2 <= value.length; j++) {
                var subValue = value.substr( j * 2,  2);
                subValue = parseInt(subValue, 10);
                if(j > 0) {
                    string = string + '->';
                }
                if(g_networknodes[subValue] == g_NetworkNodesFlag[subValue]) {
                    string += g_compoundnetworknodes[subValue];
                } else {
                    string += g_networknodes[subValue];
                }
            }
        } else if(value.length == 2) {
            if(AUTO[0] == index) {
                string = g_networknodes[index];
            } else {
                string = IDS_dialup_label_only.replace('%s', g_networknodes[index]);
            }
        }
        g_setting_netWorkModeList.push([index, string]);
    });
}

var g_myInitVar = new setting_dialup_initVar();  //new  a method

function getNetWorkList() {
    getAjaxData('api/net/net-mode-list', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_network_list_empty = 0;
            //var accesslist = ret.response.AccessList.Access;
            g_setting_netWorkModeListIndex = ret.response.AccessList.Access;
            var bandList = ret.response.BandList.Band;
            var LTEBandList = ret.response.LTEBandList.LTEBand;
            setNetWorkModeList(g_setting_netWorkModeListIndex);
        } else {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode data error');
        }
    }, {
        sync: true
    });
}

function getNetMode() {
    getAjaxData('api/net/net-mode', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_net_mode_enable = 1;
            g_setting_netWork = {
                NetworkMode: null,
                NetworkBand: null,
                LTEBand: null
            };
        } else {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode data error');
        }
    }, {
        sync: true
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/net-mode file failed');
        }
    });

}

function getNetworkConfig() {
    if(1 == g_net_mode_enable) {
        getNetWorkList();
    }
    getConfigData('config/network/networkmode.xml', function($xml) {
        var tempMode = [];
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            if (ret.config.networkband_enable == '0') {
                networkband_enable = false;
                $('#band_option').remove();
            }
            if(ret.config.networksearch == '0') {
                $('#networksearch').hide();
                networksearch_enable = false;
                networksearch_hide = true;
            }
            if(1 == g_network_list_empty) {
                if (ret.config.NetworkModes.Mode) {
                    ret = ret.config.NetworkModes.Mode;
                    if ($.isArray(ret)) {
                        tempMode = ret;
                    } else {
                        tempMode.push(ret);
                    }
                    g_setting_netWorkModeList = [];
                    $.each(tempMode, function(n, value) {
                        value = parseInt(value, 10);
                        if (value >= 0 && value <= 5) {
                            g_setting_netWorkModeList.push([value, NETWORKMODES[value]]);
                        }
                    });
                }
            }
        }
    }, {
        sync: true
    });
}

//    save user selected network (include mode and band)
function setting_dialup_saveVar() {
    if (!setting_dialup_gsmWcdmaNotMatch()) {
        return;
    }

    var api_post = '';
    if(1 == g_net_mode_enable) {
        g_setting_netWork.NetworkMode = parseInt(g_setting_netWork.NetworkMode, 10);
        g_setting_netWork.NetworkMode = "0" + g_setting_netWork.NetworkMode;
        api_post = 'api/net/net-mode';
    } else {
        api_post = 'api/net/network';
    }
    var xmlstr = object2xml('request', g_setting_netWork);
    button_enable('mobilensetting_apply', '0');
    g_netsearchresponse = false;//start  transaction
    saveAjaxData(api_post, xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (isAjaxReturnOK(ret)) {
            //showInfoDialog(common_success);
            //if cdma, no need network search
            if(false == networksearch_hide) {
                setting_dialup_registerNetMode(g_setting_register.Mode);
            } else {
                showInfoDialog(common_success);
                transactionEnd();
            }
        } else {
            showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:post api/net/network data error');
            transactionEnd();
        }
    }, {
        errorCB: function() {
            showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:post api/net/network filet filed');
            transactionEnd();
        }
    });
}

function setting_dialup_initSelectOption() {
    var mode_list = '';
    $.each(g_setting_netWorkModeList, function(n, value) {
        mode_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
        $('#preferred_mode_select').append(mode_list);
    });
    $('#preferred_mode_select').change( function() {
        g_setting_netWork.NetworkMode = $('#preferred_mode_select').val();
        g_setting_register.Mode = $('#network_select').val();
        if(true == networksearch_enable && MACRO_NET_DUAL_MODE == g_net_mode_type  ) {
            IsCDMAorAUTO(NW_NULL_STRING + parseInt($('#preferred_mode_select').val() ,10));
        }
    });
    var netWork_list = '';
    var searchNetWorkModeList = [[SETTING_DIALUP_AUTO_SEARCH_NET, common_auto],[SETTING_DIALUP_MANUAL_SEARCH_NET, common_manual]];
    if(document.getElementById('network_select')) {
        $.each(searchNetWorkModeList, function(n, value) {
            netWork_list = '<option value = ' + value[0] + '>' + value[1] + '</option>';
            $('#network_select').append(netWork_list);
        });
        $('#network_select').change( function() {
            match_plmn_name();
            setting_dialup_menuNetMode(parseInt(this.value, 10));
        });
    }

}

//
function BitwiseAndLarge(val1, val2) {
    var shift = 0, result = 0;
    var mask = ~ ((~ 0) << 30); // Gives us a bit mask like 01111..1 (30 ones)
    var divisor = 1 << 30; // To work with the bit mask, we need to clear bits at a time
    while ((val1 != 0) && (val2 != 0)) {
        var rs = (mask & val1) & (mask & val2);
        val1 = Math.floor(val1 / divisor); // val1 >>> 30
        val2 = Math.floor(val2 / divisor); // val2 >>> 30
        var i = shift++;
        for (i; i--;) {
            rs *= divisor; // rs << 30
        }
        result += rs;
    }
    return result;
}

function getBandString(band) {
    var bandstr = '';
    // band is any
    if (band == 0x3FFFFFFF) {
        bandstr = Label_CM_BAND_PREF_ANY;
    }
    // band is automatic
    else if (band == 0x680380) {
        bandstr = common_auto;
    } else {
        jQuery.each(g_arrNetworkBand, function(i, n) {
            if (BitwiseAndLarge(n[0], band) > 0) {
                if (bandstr.length > 0) {
                    bandstr += '/';
                }
                bandstr += n[1];
            }
        });
    }
    return bandstr;
}

function setting_dialup_registerNetMode(mode) {
    if (SETTING_DIALUP_AUTO_SEARCH_NET == mode) {
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        var xmlstr = object2xml('request', g_setting_register);
        saveAjaxData('api/net/register', xmlstr, function($xml) {
            var ret = xml2object($xml);
            if (isAjaxReturnOK(ret)) {
                showInfoDialog(common_settings_successfull);
            } else {
                showInfoDialog(common_failed);
            }
            transactionEnd();
            g_myInitVar.getRegister();
        });
        return;
    }

    showWaitingDialog(common_waiting, IDS_dialup_label_searching_network);
    getAjaxData('api/net/plmn-list', function($xml) {
        var ret = xml2object($xml);
        var plmn_list = [];
        if (ret.type == 'response') {
            if (ret.response.Networks.Network) {
                if ($.isArray(ret.response.Networks.Network)) {
                    plmn_list = ret.response.Networks.Network;
                } else {
                    plmn_list.push(ret.response.Networks.Network);
                }
            }
            setting_dialup_showPlmnList(plmn_list);
        } else {
            startLogoutTimer();
            closeWaitingDialog();
            showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list data error');
            transactionEnd();
        }
    }, {
        timeout: 120000,
        errorCB: function(XMLHttpRequest, textStatus) {
            startLogoutTimer();
            closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            showInfoDialog(errorInfo);
            log.error('MOBILENETWORKSETTING:get api/net/plmn-list file failed');
            transactionEnd();
        }
    });
}

function setting_dialup_setNetMode(numeric, rat) {
    g_setting_register.Plmn = numeric;
    g_setting_register.Rat = rat;
}

function setting_dialup_menuNetMode(mode) {
    switch (mode) {
        case SETTING_DIALUP_AUTO_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        case SETTING_DIALUP_MANUAL_SEARCH_NET:
            g_setting_register.Mode = mode;
            $('#network_select').val(mode);
            break;
        default:
            break;
    }
}

//
function setting_dialup_searchAndRegister(mode) {
    if (mode == SETTING_DIALUP_MANUAL_SEARCH_NET) {
        cancelLogoutTimer();
        g_setting_register.Plmn = '';
        g_setting_register.Rat = '';
        showWaitingDialog(common_waiting, common_searching);
    }

    if (mode == null) {
        showWaitingDialog(common_waiting, setting_label_registering_network);
    }

    xmlstr = object2xml('request', g_setting_register);
    saveAjaxData('api/net/register', xmlstr, function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {//setting success
            if (isAjaxReturnOK(ret)) {
                switch (mode) {
                    case SETTING_DIALUP_MANUAL_SEARCH_NET:
                        setting_dialup_registerNetMode();
                        break;
                    case SETTING_DIALUP_AUTO_SEARCH_NET:
                        showInfoDialog(common_success);
                        break;
                    default:
                        startLogoutTimer();
                        closeWaitingDialog();
                        showInfoDialog(common_success);
                        //myInitVar.getRegister();
                        setting_dialup_getCurrPlmn();
                        break;
                }
                transactionEnd();
            }//return ok
            else // setting falid
            {
                startLogoutTimer();
                closeWaitingDialog();
                showInfoDialog(common_failed);
                g_myInitVar.getRegister();
                transactionEnd();
                log.error('MOBILENETWORKSETTING:post api/net/register not return OK');
            }
        } else  //seetting error
        {
            startLogoutTimer();
            closeWaitingDialog();
            showInfoDialog(common_failed);
            g_myInitVar.getRegister();
            transactionEnd();
            log.error('MOBILENETWORKSETTING:post api/net/register data error');
        }
    }, {
        timeout: 120000,  // 2 minutes
        //sync:true,
        errorCB: function(XMLHttpRequest, textStatus) {
            startLogoutTimer();
            closeWaitingDialog();
            var errorInfo = ('timeout' == textStatus) ? common_timeout : common_failed;
            showInfoDialog(errorInfo);
            g_myInitVar.getRegister();
            transactionEnd();
            log.error('MOBILENETWORKSETTING:post api/net/register file failed');
        }
    });//saveAjaxData end
}

function setting_dialup_getCurrPlmn() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            //$("#current_plmn").html(ret.response.ShortName).show().delay(15000).fadeOut();
            $('#current_plmn').css({
                display: 'none'
            });
        } else {
            //showInfoDialog(common_failed);
            log.error('MOBILENETWORKSETTING:get api/net/current-plmn data error');
        }
    }, {
        errorCB: function() {
            log.error('MOBILENETWORKSETTING:get api/net/current-plmn file failed');
        }
    });
}

function setting_dialup_showPlmnList(plmnList) {
    closeWaitingDialog();
    call_dialog(setting_label_listing_network, "<table id='plmn_list' class='plmn_list'></table>", common_ok, 'pop_OK', common_cancel, 'pop_Cancel');
    var plmn_li_list =[];

    if (plmnList.length > 0) {
        button_enable('pop_OK', '0');
        var ifChecked = '';
        $.each(plmnList, function(n, value) {
            var plmnState = null;
            switch (value.State) {
                case PLMN_USABLE:
                    plmnState = plmn_label_usable;
                    break;

                case PLMN_REGISTERED:
                    plmnState = plmn_label_registered;
                    break;

                case PLMN_FORBIDDEN:
                    plmnState = plmn_label_forbidden;
                    break;

                default:
                    plmnState = common_unknown;
                    break;
            }
            if (plmnState == plmn_label_registered) {
                ifChecked = 'checked';
                button_enable('pop_OK', '1');
            } else {
                ifChecked = '';
            }
            var net_mode;
            switch(parseInt(value.Rat,10)) {
                case SETTING_DIALUP_RAT_2G:
                    net_mode = plmn_label_2g;
                    break;
                case SETTING_DIALUP_RAT_3G:
                    net_mode = plmn_label_3g;
                    break;
                case SETTING_DIALUP_RAT_4G:
                    net_mode = plmn_label_4g;
                    break;
                default:
                    break;
            }
            plmn_li_list += "<tr height = '35'><td ><input type = 'radio' name='netMode' value = '" + n + "' " + ifChecked + " id='netMode_" + n + "'></td>" +
            "<td ><label for = 'netMode_" + n + "' >" +
            value.ShortName + ' ' +
            net_mode + '</label><span>' + '&nbsp;' +
            ' (' + plmnState + ')' +
            '</span></td></tr>';
        });
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            var index = $('#plmn_list :checked').val();
            setting_dialup_setNetMode(plmnList[index].Numeric, plmnList[index].Rat);
            setting_dialup_searchAndRegister(null);
        });
    } else {
        plmn_li_list = '<tr><td>' + setting_label_no_network + '</td></tr>';
        $('#pop_Cancel').hide();
        $('#pop_OK').bind('click', function() {
            if (!isButtonEnable('pop_OK')) {
                return;
            }
            $('#div_wrapper,.dialog').hide();
            startLogoutTimer();
            g_myInitVar.getRegister();
        });
        transactionEnd();
    }
    $('#plmn_list').append(plmn_li_list);
    $('#pop_Cancel,.dialog_close_btn').bind('click', function() {
        $('#div_wrapper,.dialog').hide();
        transactionEnd();
        startLogoutTimer();
    });
    $(":radio").bind('click', function() {
        button_enable('pop_OK', '1');
    });
    reputPosition($('#sms_dialog'), $('#div_wrapper'));
}

function setting_dialup_connectionStatus() {
    if (false == g_netsearchresponse) {
        return;
    }
    var dialupStatus = G_MonitoringStatus.response.ConnectionStatus;
    var connectionIsUnFree = (
        MACRO_CONNECTION_CONNECTING == dialupStatus ||
        MACRO_CONNECTION_CONNECTED == dialupStatus ||
        MACRO_CONNECTION_DISCONNECTING == dialupStatus
    );
    if (connectionIsUnFree) {
        $(':input').attr('disabled', true);
        $('#pop_OK').addClass('disable_btn');
        $('#lang').attr('disabled', false);
        button_enable('mobilensetting_apply', '0');
    } else {
        $(':input').attr('disabled', false);
        $('#pop_OK').removeClass('disable_btn');
        button_enable('mobilensetting_apply', '1');
    }
}

function setting_dialup_gsmWcdmaNotMatch() {
    var cnnectType = g_setting_netWork.NetworkMode;
    var bandValue = g_setting_netWork.NetworkBand;
    if ((cnnectType == WCDMA_ONLY[0]) && (
    (bandValue == G850G1900) ||
    (bandValue == GSM1900) ||
    (bandValue == GSM1800) ||
    (bandValue == GSM900) ||
    (bandValue == GSM850))) {
        showInfoDialog(dialup_hint_wcdma_only_gsm_band);
        return false;
    } else if ((cnnectType == GSM_ONLY[0]) &&
    ((bandValue == W850W1900) ||
    (bandValue == W2100) ||
    (bandValue == W1900) ||
    (bandValue == W850) ||
    (bandValue == W900))) {
        showInfoDialog(dialup_hint_gsm_only_wcdma_band);
        return false;
    } else {
        return true;
    }
}

function getDeviceType(deviceName) {
    var szTmp = deviceName.split('-');
    var deviceType = null;
    deviceType = deviceName.match(/[a-zA-Z]+\d+/);
    if (2 == szTmp.length) {
        deviceType = deviceType + '-' + szTmp[1];
    }
    return deviceType;
}

function match_plmn_name() {
    getAjaxData('api/net/current-plmn', function($xml) {
        var currently_plmn = null;
        var current_plmn_ret = xml2object($xml);
        if (current_plmn_ret.type == 'response') {
            currently_plmn = current_plmn_ret;
        }
    }, {
        sync: true
    });
}

function getNetModeConfig() {
    function isValidType(inputType,defaultType) {
        if(typeof(inputType) == 'undefined' || '' == $.trim(inputType)) {
            return defaultType;
        } else {
            return inputType;
        }
    }

    var i = 0;
    getConfigData('config/network/net-mode.xml', function($xml) {
        var ret =  xml2object($xml);
        var net_work = ret.config.net_works.net_work;
        var net_mode = ret.config.net_modes.net_mode;
        if ($.isArray(net_work)) {
            for(i=0;i<net_work.length;i++) {
                NETWORKMODES[parseInt(net_work[i].index,10)] = isValidType(net_work[i].networktype, NETWORKMODES[parseInt(net_work[i].index,10)]);
            }
        }
        if ($.isArray(net_mode)) {
            for(i=0;i<net_mode.length;i++) {
                g_networknodes[parseInt(net_mode[i].index,10)] =  isValidType(net_mode[i].networktype, g_networknodes[parseInt(net_mode[i].index,10)]);
            }
        }
    }, {
        sync: true
    });
}

redirectOnCondition(null, 'mobilenetworksettings');
function main_executeBeforeDocumentReady() {
    getConfigData('config/network/networkmode.xml', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'config') {
            if('1' != ret.config.networksearchwhenconnected) {
                addStatusListener('setting_dialup_connectionStatus()');
            }
        }
    }, {
        sync: true
    });
}

main_executeBeforeDocumentReady();
function dualModeCheck() {
    if(true == networksearch_enable && MACRO_NET_DUAL_MODE == g_net_mode_type && MACRO_NET_MODE_CHANGE == g_net_mode_change) {//config display and support double mode and mode change
        setNetWork();
        resetNetModeChange();
    }
}

$(document).ready( function() {
    if(MACRO_NET_DUAL_MODE == g_net_mode_type) {
        addStatusListener('dualModeCheck()');
    }
    getNetModeConfig();
    getNetMode();
    getNetworkConfig();
    g_myInitVar.getNetwork();
    g_myInitVar.getInfomation();
    g_myInitVar.getRegister();
    setting_dialup_initSelectOption();
    $('#mobilensetting_apply').bind('click', function() {
        if (!isButtonEnable('mobilensetting_apply')) {
            return;
        }
        getAjaxData("api/monitoring/status", function($xml) {
            var gstatus_ret = xml2object($xml);
            if(gstatus_ret.type == "response") {
                G_MonitoringStatus = gstatus_ret;
            }
        }, {
            sync: true
        });
        var dialupStatus = G_MonitoringStatus.response.ConnectionStatus;
        if(MACRO_CONNECTION_CONNECTED == dialupStatus) {
            showConfirmDialog(IDS_networksettings_search_hint, setting_dialup_saveVar, function() {
            });
        } else {
            setting_dialup_saveVar();
        }
    });
});