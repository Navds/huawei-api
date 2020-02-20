// JavaScript Document
/****************************************************profilesmgr
 * (start)************************************/
var PROFILE_MAX_NUM = 100;
var PRO_AUTHMODE_AUTO = '0';
var PRO_AUTHMODE_PAP = '1';
var PRO_AUTHMODE_CHAP = '2';
var PRO_DEFAULT_IP_ADDRESS = '0.0.0.0';
var PRO_DEFAULT_APN_NAME = '';
var g_promag_name ='';
var g_currentProfileAuthMode = '0';

var g_promag_info = [];
var g_promag_index = 0;
var g_promag_default_index = 0;
var g_promag_array_index = 0;
var g_promag_currentProfileName = '';
var g_promag_operation_btnID = null;
//Indicates one of  buttons ["new_profile", "edit_profile", "delete_profile"]
var g_clear_dialog = false;
var g_promag_autoAPN = false;
var g_dialupFeature = null;
//Content of popup window
var g_promag_dialogContent = "<table width='570' border='0' cellpadding='0' cellspacing='0' class='new_profile'>";
g_promag_dialogContent += "<tr id='popup_name'>";
g_promag_dialogContent += "<td width='200' height='32'>" + dialup_label_profile_name + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' id='pro_name' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_dialup_number'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_dialup_number + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' class='Arabic_dialupNumber' id='pro_number'  maxlength='16' disabled='disabled'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_username'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_user_name + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='text' value='' id='pro_username' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_password'>";
g_promag_dialogContent += "<td height='32'>" + common_password + common_colon + '</td>';
g_promag_dialogContent += "<td><input type='password' value='' id='pro_password' maxlength='32'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr id='popup_authen'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_authentication + common_colon + '</td>';
g_promag_dialogContent += "<td colspan='2' class='radio'>";
g_promag_dialogContent += "<select name='authentication_mode' id='pop_authmode'>";
g_promag_dialogContent += "<option value='0'>" + common_auto + '</option>';
g_promag_dialogContent += "<option value='1'>" + dialup_label_pap + '</option>';
g_promag_dialogContent += "<option value='2'>" + dialup_label_chap + '</option>';
g_promag_dialogContent += '</select>';
g_promag_dialogContent += '</td>';
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr class = 'popup_apn'>";
g_promag_dialogContent += "<td height='32'>" + dialup_label_apn + common_colon + '</td>';
g_promag_dialogContent += "<td height='32'><div class='radio'>";
g_promag_dialogContent += "<input type='radio' name='popup_apn_radio'' value='0' class='profile_input' onclick=enableAPNInput('pro_apn',false) checked='true'>";
g_promag_dialogContent += "<span>" + dialup_label_dynamic + '</span>';
g_promag_dialogContent += "<input type='radio' name='popup_apn_radio' value='1' class='profile_input' onclick=enableAPNInput('pro_apn',true)>";
g_promag_dialogContent += "<span>" + dialup_label_static + '</span> </div></td>';
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += "<tr class ='popup_apn'>";
g_promag_dialogContent += "<td ></td>";
g_promag_dialogContent += "<td ><input type='text' value='' id='pro_apn' maxlength='32' disabled='true'></td>";
g_promag_dialogContent += '</tr>';
g_promag_dialogContent += '</table>';
function initSelectedprofile(index) {
    g_promag_name = g_promag_info[index].Name;
    $('#input_dialup_number').val(g_promag_info[index].DialupNum);
    $('#input_dialup_number').attr('disabled',true);
    $('#input_user_name').val(g_promag_info[index].Username);
    if ('' != g_promag_info[index].Password && ' ' != g_promag_info[index].Password && null != g_promag_info[index].Password) {
        $('#input_password').val(g_promag_info[index].Password);
    } else {
        $('#input_password').val('');
    }
    if (PRO_AUTHMODE_PAP == g_promag_info[g_promag_array_index].AuthMode) {
        $('#authentication').val(PRO_AUTHMODE_PAP);
    } else if (PRO_AUTHMODE_CHAP == g_promag_info[g_promag_array_index].AuthMode) {
        $('#authentication').val(PRO_AUTHMODE_CHAP);
    } else {
        $('#authentication').val(PRO_AUTHMODE_AUTO);
    }
    $('#apn').val(g_promag_info[index].ApnName);

    $("input[name='wlan_apn'][value=" + g_promag_info[index].ApnIsStatic + ']').attr('checked', true);
    if (g_promag_info[index].ApnIsStatic == '0') {
        enableAPNInput('apn',false);
    } else {
        enableAPNInput('apn',true);
    }
    if (g_promag_info[index].ReadOnly == '0' && !g_promag_autoAPN) {
        enableEdit(1);
    } else {
        enableEdit(0);
    }
}

function enableAPNInput(id,enable) {
    if(enable) {
        $('#'+id).removeAttr('disabled');
    } else {
        $('#'+id).val('');
        $('#'+id).attr('disabled', true);
    }
}

function promag_deleteProfile(event) {
    var delIndex = $('#profilelist').val();
    var minIndex = 0;

    //Reset default profile to a minimum valid one, only if the deleting profile
    // is defualt
    if (delIndex == g_promag_default_index) {
        if (g_promag_info.length>1) {
            minIndex = g_promag_info[0].Index;
            if (delIndex == minIndex) {
                minIndex = g_promag_info[1].Index;
            }
        }
    }
    var request = {
        'Delete' : delIndex,
        'SetDefault' : minIndex,
        'Modify' : 0
    };

    var delProfile = object2xml('request', request);

    saveAjaxData('api/dialup/profiles', delProfile, function($xml) {
        var delRet = xml2object($xml);
        if (isAjaxReturnOK(delRet)) {
            log.debug('Delete profile' + delIndex + 'successful!');
            showInfoDialog(common_success);
            setTimeout( function() {
                refresh();
                return false;
            }, g_feature.dialogdisapear);
        } else {
            log.error('Delete profile failed');
            showInfoDialog(common_failed);
        }
    });
}

function promag_cancelDelete() {
    $('#div_wrapper').remove();
    $('.dialog').remove();
}

function promag_setTrDisplay() {
    g_dialupFeature.dialup_number_enabled ? $('#tr_dialup_number').show() : $('#tr_dialup_number').hide();
    g_dialupFeature.authentication_info_enabled ? $('#authentication_info').show() : $('#authentication_info').hide();
}

function Profilesmgr_getCurrentProfileArrayIndex(profileArray, index) {
    var ArrayLength = profileArray.length;
    var i = 0;
    for (; i < profileArray.length; i++) {
        if (profileArray[i].Index == index) {
            return i;
        }
    }
    return 0;
}

function promag_ifDiffrentProfileName(currentProfileName) {
    var flag = true;
    if ($.isArray(g_promag_info)) {
        $.each(g_promag_info, function(i) {
            if (g_promag_info[i].Name == currentProfileName) {
                flag = false;
                return false;
            } else {
                flag = true;
            }
        });
    } else if (typeof (g_promag_info) != 'undefined') {
        //if there is no profile
        if (g_promag_info == null) {
            flag = true;
            return true;
        }

        //if there is only one profile
        if (g_promag_info.Name == currentProfileName) {
            flag = false;
            return false;
        } else {
            flag = true;
        }
    } else {
        flag = true;
    }
    return flag;
}

function enableEdit(editable) {
    if(editable) {
        $('#input_user_name').removeAttr('disabled');
        $('#input_password').removeAttr('disabled');
        $('input[name=wlan_apn]').eq(0).removeAttr('disabled');
        $('input[name=wlan_apn]').eq(1).removeAttr('disabled');
        $('#authentication').removeAttr('disabled');
        if($('input[name=wlan_apn]').eq(1).checked) {
            $('#apn').removeAttr('disabled');
        }
        $('#apn').removeAttr('title');
        $('#input_user_name').removeAttr('title');
        button_enable('delete_profile', '1');
    } else {
        $('#input_user_name').attr('disabled', true);
        $('#input_user_name').attr('title', $('#input_user_name').val());
        $('#input_password').attr('disabled', true);
        $('#authentication').attr('disabled', true);
        $('input[name=wlan_apn]').eq(0).attr('disabled', true);
        $('input[name=wlan_apn]').eq(1).attr('disabled', true);
        $('#apn').attr('disabled', true);
        $('#apn').attr('title', $('#apn').val());
        button_enable('delete_profile', '0');
    }
}

function hideEdit() {
    $('#profilelist').attr('disabled', true);
    $('#input_dialup_number').hide();
    $('#input_user_name').hide();
    $('#input_password').hide();
    $('input[name=wlan_apn]').hide();
    $('#authentication').hide();
    $('#apn').hide();
    $('.radio').hide();
}

function promag_getProfileInfo() {
    promag_setTrDisplay();
    getAjaxData('api/dialup/profiles', function($xml) {
        var profile_ret = xml2object($xml);
        if (profile_ret.type == 'response') {
            var profiles = profile_ret.response.Profiles.Profile;
            g_promag_index = parseInt(profile_ret.response.CurrentProfile, 10);
            if (1 > g_promag_index) {
                g_promag_index = 1;
            }
            if ($.isArray(profiles)) {
                g_promag_info = profiles;
            } else if( 'undefined' != typeof profiles) {
                g_promag_info.push(profiles);
            } else {
                hideEdit();
                return;
            }
            if ($.isArray(g_promag_info)) {
                g_promag_default_index = g_promag_index;
                g_promag_array_index = Profilesmgr_getCurrentProfileArrayIndex(g_promag_info, g_promag_index);
                initSelectedprofile(g_promag_array_index);
                var promag_names = [];
                $.each(g_promag_info, function(n, value) {
                    g_promag_info[n].Name = $.trim(g_promag_info[n].Name);
                    var defaultName = g_promag_info[n].Name;
                    while (defaultName.indexOf(' ') >= 0) {
                        defaultName = defaultName.replace(' ', '&nbsp;');
                    }
                    defaultName = defaultName + (g_promag_info[n].Index == g_promag_default_index ? common_default : '');
                    promag_names.push([g_promag_info[n].Index, defaultName]);
                    var varItem = '<option value = ' + g_promag_info[n].Index + '\>' + defaultName + '</option>';
                    $('#profilelist').append(varItem);
                });
                setTimeout( function() {
                    $('#profilelist').val(g_promag_index);
                }, 1);
            }
        } else {
            log.error('Load profiles data failed');
            hideEdit();
        }
        if (g_clear_dialog) {
            setTimeout( function() {
                clearDialog();
            }, 1700);
            g_clear_dialog = false;
        }
    });
}

function promag_saveRequest(obj) {
    var profile_xml = object2xml('request', obj);
    button_enable('select_apply', '0');
    saveAjaxData('api/dialup/profiles', profile_xml, function($xml) {
        var return_ret = xml2object($xml);
        if (return_ret.response == 'OK') {
            log.debug('save data success!');
        } else {
            log.error('Save data failed');
            showInfoDialog(common_failed);
            g_clear_dialog = true;
        }
        window.location.reload();
        promag_getProfileInfo();
    });
}

function promag_saveProfile() {

    //getModifyInfo
    var request = '';
    var profile_index = g_promag_index;
    var isvalid;
    var dnsstatus;
    var primary_dns;
    var seconde_dns;
    var ipaddress_status;
    var ipaddress;
    var profile_name = g_promag_name;
    var dialup_number = $('#input_dialup_number').val();
    var username = $.trim($('#input_user_name').val());
    var password = $.trim($('#input_password').val());
    var authen = PRO_AUTHMODE_AUTO;
    var apn_status = $("input[name='wlan_apn']:checked").val();
    var apn_name = $.trim($('#apn').val());
    var isNew = false;
    if ('new_profile' == g_promag_operation_btnID) {
        profile_name = $.trim($('#pro_name').val());
        dialup_number = $('#pro_number').val();
        username = $.trim($('#pro_username').val());
        password = $.trim($('#pro_password').val());
        authen = PRO_AUTHMODE_AUTO;
        apn_status = $("input[name='popup_apn_radio']:checked").val();
        apn_name = $.trim($('#pro_apn').val());
        isNew = true;
    }
    var validElement = {
        'profile_name' : profile_name,
        'username' : username,
        'password' : password,
        'apn_name' : apn_name,
        'apn_status':apn_status,
        'isNew':isNew
    };

    var be_valid = promag_validInput(validElement);

    if (be_valid) {
        //Get the method which currently used
        var function_name = $('.dialog_header_left').html();

        if (null == g_promag_operation_btnID) {
            return;
        } else if ('new_profile' == g_promag_operation_btnID) {
            if (!g_dialupFeature.authentication_info_enabled) {
                authen = PRO_AUTHMODE_AUTO;
            } else {
                authen = $('#pop_authmode').val();
            }
            //New object for create new profile
            request = {
                'Delete' : 0,
                'SetDefault' : (('undefined' == typeof (g_promag_info)) ? 1 : 0),
                'Modify' : 1,
                'Profile' : {
                    'Index' : '',  //original is new_index
                    'IsValid' : 1,
                    'Name' : profile_name,
                    'ApnIsStatic' : apn_status,
                    'ApnName' : apn_name,
                    'DialupNum' : dialup_number,
                    'Username' : username,
                    'Password' : password,
                    'AuthMode' : authen,
                    'IpIsStatic' : '',
                    'IpAddress' : '',
                    'DnsIsStatic' : '',
                    'PrimaryDns' : '',
                    'SecondaryDns' : '',
                    'ReadOnly' : '0'
                }
            };
        } else if ('edit_profile' == g_promag_operation_btnID) {
            var readonly = '1';
            if ($.isArray(g_promag_info)) {
                isvalid = g_promag_info[g_promag_array_index].IsValid;
                dnsstatus = g_promag_info[g_promag_array_index].DnsIsStatic;
                primary_dns = g_promag_info[g_promag_array_index].PrimaryDns;
                seconde_dns = g_promag_info[g_promag_array_index].SecondaryDns;
                ipaddress_status = g_promag_info[g_promag_array_index].IpIsStatic;
                ipaddress = g_promag_info[g_promag_array_index].IpAddress;
                readonly = g_promag_info[g_promag_array_index].ReadOnly;
            } else if (typeof g_promag_info != 'undefined' && null != g_promag_info) {
                isvalid = g_promag_info.IsValid;
                dnsstatus = g_promag_info.DnsIsStatic;
                primary_dns = g_promag_info.PrimaryDns;
                seconde_dns = g_promag_info.SecondaryDns;
                ipaddress_status = g_promag_info.IpIsStatic;
                ipaddress = g_promag_info.IpAddress;
                readonly = g_promag_info.ReadOnly;
            } else {
                isvalid = 1;
                dnsstatus = '';
                primary_dns = '';
                seconde_dns = '';
                ipaddress_status = '';
                ipaddress = '';
            }

            if (!g_dialupFeature.authentication_info_enabled) {
                authen = g_currentProfileAuthMode;
            } else {
                authen = $('#authentication').val();
            }
            if(readonly == '0') {
                //Create an object for modify profile
                request = {
                    'Delete' : 0,
                    'SetDefault' : profile_index,
                    'Modify' : 2,
                    'Profile' : {
                        'Index' : profile_index,
                        'IsValid' : isvalid,
                        'Name' : profile_name,
                        'ApnIsStatic' : apn_status,
                        'ApnName' : apn_name,
                        'DialupNum' : dialup_number,
                        'Username' : username,
                        'Password' : password,
                        'AuthMode' : authen,
                        'IpIsStatic' : ipaddress_status,
                        'IpAddress' : ipaddress,
                        'DnsIsStatic' : dnsstatus,
                        'PrimaryDns' : primary_dns,
                        'SecondaryDns' : seconde_dns,
                        'ReadOnly' : '0'
                    }
                };
            } else {
                request = {
                    'Delete' : 0,
                    'SetDefault' : profile_index,
                    'Modify' : 0
                };
            }
        }
        promag_saveRequest(request);
    } else {
        log.error('Some of input box invalid');
    }
}

function promag_setPopupTrDisplay() {
    g_dialupFeature.dialup_number_enabled ? $('#popup_dialup_number').show() : $('#popup_dialup_number').hide();

    g_dialupFeature.authentication_info_enabled ? $('#popup_authen').show() : $('#popup_authen').hide();
    getMonitoringStatus();
    if('0' == g_dialupFeature.apn_enabled ||(MACRO_NET_DUAL_MODE == g_net_mode_type && MACRO_NET_MODE_C == g_net_mode_status) ) {
        $('.popup_apn').hide();
    } else {
        $('.popup_apn').show();
    }
    reputPosition($('.dialog'), $('#div_wrapper'));
}

function promag_validInput(obj) {
    var flag = true;
    clearAllErrorLabel();
    if(obj.isNew) {
        $.each($('input'), function() {
            $(this).blur();
        });
        //Valid profile name
        if (obj.profile_name == null || '' == $.trim(obj.profile_name)) {
            flag = false;
            showErrorUnderTextbox('pro_name',IDS_dialup_hint_profile_name_null);
        } else if (!checkInputChar(obj.profile_name)) {
            flag = false;
            showErrorUnderTextbox('pro_name',dialup_hilink_hint_profile_name_invalidate);
        } else {
            if (!promag_ifDiffrentProfileName(obj.profile_name)) {
                flag = false;
                showErrorUnderTextbox('pro_name',dialup_hint_profile_name_has_exist);
            }
        }
        //Valid Username
        if ('' != obj.username && false == checkInputChar(obj.username)) {
            flag = false;
            showErrorUnderTextbox('pro_username',dialup_hilink_hint_username_invalidate);
        }
        //Vaild user password
        if ('' != obj.password && false == checkInputChar(obj.password)) {
            flag = false;
            showErrorUnderTextbox('pro_password',dialup_hilink_hint_password_invalidate);
        }
        if (1==obj.apn_status) {
            //Valid apn name
            if ('' == obj.apn_name) {
                flag = false;
                showErrorUnderTextbox('pro_apn',dialup_hint_profile_apn_null);
            } else if (false == checkInputChar(obj.apn_name) || -1 < obj.apn_name.indexOf(" ")) {
                flag = false;
                showErrorUnderTextbox('pro_apn',dialup_hilink_hint_apn_name_invalidate);
            }
        }
    } else {

        //Valid Username
        if ('' != obj.username && false == checkInputChar(obj.username)) {
            flag = false;
            showErrorUnderTextbox('input_user_name',dialup_hilink_hint_username_invalidate);
        }
        //Vaild user password
        if ('' != obj.password && false == checkInputChar(obj.password)) {
            flag = false;
            showErrorUnderTextbox('input_password',dialup_hilink_hint_password_invalidate);
        }
        if (1==obj.apn_status) {
            //Valid apn name
            if ('' == obj.apn_name) {
                flag = false;
                showErrorUnderTextbox('apn',dialup_hint_profile_apn_null);
            } else if (false == checkInputChar(obj.apn_name) || -1 < obj.apn_name.indexOf(" ")) {
                flag = false;
                showErrorUnderTextbox('apn', dialup_hilink_hint_apn_name_invalidate);
            }
        }
    }
    if(flag) {
        $('#pro_password_wrong').html('');
    }
    return flag;
}

function promag_getNewIndex() {
    var index_array = [];
    var new_index = '';

    //Get all indexs.
    if ('undefined' == typeof (g_promag_info)) {
        index_array.push(0);
    } else {
        $('.list').each( function(k) {
            index_array.push(parseInt($(this).attr('id'), 10));
        });
    }

    //Make an new g_promag_index according to currently g_promag_index
    var i = 0;
    for (i; i < index_array.length; i++) {
        if (index_array[i + 1] - index_array[i] == 1) {
            new_index = parseInt(index_array[i + 1], 10) + 1;
        } else {
            new_index = parseInt(index_array[i], 10) + 1;
            break;
        }
    }
    return new_index;
}

function promag_getAutoAPN() {
    getAjaxData('api/dialup/auto-apn', function($xml) {
        var ret = xml2object($xml);
        if (ret.type == 'response') {
            g_promag_autoAPN = parseInt(ret.response.AutoAPN, 10) == 1;
        }
        if (g_promag_autoAPN) {
            $('input[name=redio_autoapn]').eq(0).attr('checked', 'checked');
            button_enable('select_apply', '0');
            button_enable('delete_profile', '0');
            button_enable('new_profile', '1');
            $('#profilelist').attr('disabled', 'disabled');
            $('#profiles_info tr:gt(0) td').css({
                color: '#BFBFBF'
            });
        } else {
            $('input[name=redio_autoapn]').eq(1).attr('checked', 'checked');
            button_enable('new_profile', '1');
            $('#profilelist').removeAttr('disabled');
            $('#profiles_info tr:gt(0) td').css({
                color: 'black'
            });
            var aProfile = null;
            if (g_promag_info) {
                if ($.isArray(g_promag_info)) {
                    aProfile = g_promag_info[g_promag_array_index];
                } else {
                    aProfile = g_promag_info;
                }
                if (aProfile.ReadOnly == '0') {
                    button_enable('select_apply', '1');
                    button_enable('delete_profile', '1');
                } else {
                    button_enable('select_apply', '0');
                    button_enable('delete_profile', '0');
                }
            } else {
                button_enable('select_apply', '0');
                button_enable('delete_profile', '0');
            }
        }
    });
}

function promag_onChangeAutoAPN() {
    g_promag_autoAPN = $(this).get(0).value == '0';
    var request = {
        AutoAPN: g_promag_autoAPN ? 1 : 0
    };
    var xmlstr = object2xml('request', request);
    saveAjaxData('api/dialup/auto-apn', xmlstr, function($xml) {
        promag_getAutoAPN();
    });
}

redirectOnCondition(null, 'profilesmgr');
function initAPNDisplay() {
    if('0' == g_dialupFeature.apn_enabled ) {
        $('.apn_name').hide();
        return ;
    }
    getMonitoringStatus();
    if(MACRO_NET_DUAL_MODE == g_net_mode_type && MACRO_NET_MODE_C == g_net_mode_status) {
        $('.apn_name').hide();
        return;
    }
    $('.apn_name').show();
}

function modeChangeHandle() {
    if(MACRO_NET_MODE_CHANGE == g_net_mode_change) {
        if(MACRO_NET_MODE_C == g_net_mode_status) {
            $('.apn_name').hide();
        } else {
            $('.apn_name').show();
        }
        resetNetModeChange();
    }
}

$(document).ready( function() {
    var list = '';
    var wlan_td_content = '';

    getConfigData('config/dialup/config.xml', function($xml) {
        g_dialupFeature = _xml2feature($xml);
    }, {
        sync: true
    });

    if (g_module.autoapn_enabled) {
        promag_getAutoAPN();
        $('#tr_profile_autoapn').show();
    }

    // add tooltips
    promag_getProfileInfo();

    $('#new_profile').click( function(event) {
        if (!isButtonEnable('new_profile')) {
            return;
        }
        if (($.isArray(g_promag_info)) && (g_promag_info.length >= PROFILE_MAX_NUM)) {
            showInfoDialog(dialup_hint_max_profile_number.replace('%d', PROFILE_MAX_NUM));
            return;
        }
        g_promag_operation_btnID = event.currentTarget.id;
        disableTabKey();
        //Load popup window
        call_dialog(dialup_button_newprofile, g_promag_dialogContent, common_save, 'pop_Save', common_cancel, 'pop_Cancel');
        promag_setPopupTrDisplay();
        $('#pro_name').val('');
        $('#pro_number').val('*99#');
        $('#pro_username').val('');
        $('#pro_password').val('');
        $('#pro_authentication').val('');
        $('#pro_apn').val('');
        $('#pro_name').focus();
    });
    $('#pop_Save').live('click', function() {
        promag_saveProfile();
    });
    $('#delete_profile').click( function(event) {
        if (!isButtonEnable('delete_profile')) {
            return;
        }
        showConfirmDialog(dialup_hilink_confirm_delete, promag_deleteProfile, promag_cancelDelete);
    });
    button_enable('select_apply', '0');
    $('input[name=redio_autoapn]').bind('click', promag_onChangeAutoAPN);
    $('#profilelist').change( function() {
        g_promag_index = $('#profilelist').val();
        g_promag_array_index = Profilesmgr_getCurrentProfileArrayIndex(g_promag_info, g_promag_index);
        button_enable('select_apply', '1');
        //g_promag_index-1;
        initSelectedprofile(g_promag_array_index);
    });
    $('#input_password,#input_user_name,#apn,.profile_input').bind('keydown click', function(e) {
        if(MACRO_KEYCODE != e.keyCode) {
            button_enable('select_apply', '1');
        }
    });
    $('#authentication').change( function() {
        button_enable('select_apply', '1');
    });
    $('#select_apply').click( function() {
        if(!isButtonEnable('select_apply')) {
            return;
        } else {
            g_promag_operation_btnID = 'edit_profile';
            promag_saveProfile();
        }
    });
    initAPNDisplay();
    if('1' == g_dialupFeature.apn_enabled && MACRO_NET_DUAL_MODE == g_net_mode_type) {//config and ProductFamily
        addStatusListener('modeChangeHandle()');
    }
});
/****************************************************profilesmgr
 * (end)************************************/