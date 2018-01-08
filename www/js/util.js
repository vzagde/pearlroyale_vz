var patient_record_count = 0;
var records = new Array();
var technician_start_time_camp = '';
var start_camp_id = '';
var image = new Array();
var time_check_both_slot = 0;

function j2s(json) {
    return JSON.stringify(json);
}

function goto_page(page) {
    mainView.router.load({
        url: page,
        ignoreCache: false,
    });
}

function dashboard(){
    window.open('http://kreaserv-tech.com/abbott-content/fibroscan/index.php/login', '_blank', 'location=yes');
}

// $(".clock-item-inner-start").click(function(){
//     $("#start-time-input").change();
// })

//app login
function login(){
	var email = $('#login-email').val();
    var password = $('#login-password').val();
    if (email == '') {
        myApp.alert('Email Id should be provided.');
        return false;
    } else if (!email.match(email_regex)) {
        myApp.alert('Valid Email Id should be provided.');
        return false;
    }

    if (password == '') {
        myApp.alert('Password should not be blank.');
        return false;
    }

    myApp.showIndicator();
    $.ajax({
        url: base_url + '/login',
        type: 'POST',
        crossDomain: true,
        data: {
            "email": email,
            "password": password,
        },
    })
    .done(function(res) {
        // console.log('done: ' + j2s(res));
        myApp.hideIndicator();
        if (res.status == 'SUCCESS') {
        	Lockr.set('token', res.data);
            token = Lockr.get('token');
            $("#menu_name").text(res.data.first_name);
            if ( res.data.group_name == 'Technician' ) {
                $(".menu_camps_display").hide();
                $(".camp_book_form").hide();
                $(".camp_approved").hide();
                $(".leader_board_screen").hide();
                $(".dashboard").hide();
                mainView.router.load({
                    url: 'technician_view.html',
                    ignoreCache: false,
                 });
            }else {
                if (res.data.group_name == "FAM") {
                    $(".leader_board_screen").show();
                    $(".camp_approved").show();
                    $(".dashboard").show();
                } else {
                    $(".leader_board_screen").hide();
                    $(".camp_approved").hide();
                    $(".dashboard").hide();

                }
                $(".menu_camps_display").show();
                $(".camp_book_form").show();

                // if (res.data.group_name == "FAM") {
                //     $(".leader_board_screen").show();
                // } else {
                //     $(".leader_board_screen").hide();
                // }
                
                mainView.router.load({
                    url: 'calendar.html',
                    ignoreCache: false,
                 });
            }
        } else {
            myApp.alert(res.message);
        }
    })
    .fail(function(err) {
        myApp.hideIndicator();
        myApp.alert('Some error occurred on connecting.');
        // console.log('fail: ' + j2s(err));
    })
    .always(function() {});
}

function logout() {
    Lockr.flush();
    token = false;
    mainView.router.load({
        url: 'index.html',
        ignoreCache: false,
        reload:true
    });
    active_counter = 0;
}

//dial number
function dial_number(phone) {
    window.open('tel:'+phone, '_system');
}

//machine list page
function machine_booking_form(){
    if (!$('input[name = machine_name]:checked').val() ) {     
        myApp.alert('select machine');     
    } else {
        machine_name_global = $("input[name='machine_name']:checked").val();
        myApp.showIndicator();
        $.ajax({
            url: base_url + '/load_form_data',
            type: 'POST',
            crossDomain: true,
            data: {
                "user_data" : token,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            if (res.status == 'SUCCESS') {
                // console.log(res.doctors_data);
                mainView.router.load({
                    url: 'machine_booking.html',
                    ignoreCache: false,
                    query: {
                             doctors_data: res.doctors_data
                    },
                });
            } 
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('Some error occurred on connecting.');
            // console.log('fail: ' + j2s(err));
        })
        .always(function() {
            myApp.hideIndicator();
        });
    }
}

function forgatpassword(){
    // $$('.prompt-title-ok').on('click', function () {
        myApp.prompt('Enter Your Email Id', 'Forgat Password ?', function (value) {
            // myApp.alert('Your name is "' + value + '". You clicked Ok button');
            if ( !value == '') {
                myApp.showIndicator();
                $.ajax({
                    url: base_url + '/forgot_password',
                    type: 'POST',
                    crossDomain: true,
                    data: {
                        "email_id" : value,
                    },
                })
                .done(function(res) {
                    // console.log('done: ' + j2s(res));
                    if (res.status == 'SUCCESS') {
                        myApp.alert(res.message);
                        // // console.log(res.doctors_data);
                    }else{
                        myApp.alert(res.message);  
                    } 
                })
                .fail(function(err) {
                    myApp.hideIndicator();
                    myApp.alert('Some error occurred on connecting.');
                    // console.log('fail: ' + j2s(err));
                })
                .always(function() {
                    myApp.hideIndicator();
                });
            } else {
                 myApp.alert('Enter the registered Email id');
            }
        });
    // });
}

//submit machine form
function submit_machine_booking(){
    var doctor_name = $("#doctor-list").val();
    var doctor_address = $("#doctor_address").val();
    var clinic_camp = $("#clinic_camp").val();
    var expected_number_of_registration = $("#expected_number_of_registration").val();
    var block_machine = $('#block_machine').val();
    var available_at_camp = $("#available_at_camp").val();
    var start_time = $("#start-time-input").val();
    var end_time = $("#end-time-input").val();
    var doctor_speciality = $("#doctor_speciality").val();
    var doctor_type = $("#doctor_type").val();
    // console.log("doctor_name :"+doctor_name+' doctor_address :'+doctor_address+" clinic_camp :"+clinic_camp+
        // " expected_number_of_registration :"+expected_number_of_registration+" block_machine :"+block_machine+
        // " start-time-input :"+start_time+" end-time-input :"+end_time+ " selected_date "+selected_date+" machine_name_global :"+machine_name_global);
    if (!available_at_camp == 'yes') {
        available_at_camp = 'no';
    } 
    // console.log(selected_date);
    // return false;
    if (doctor_name == 0) {
        myApp.alert('Select Doctor');
        return false;
    }else if (doctor_speciality == 0) {
        myApp.alert('Select Doctor Speciality');
        return false;
    }else if(doctor_address == ''){
         myApp.alert('Enter Address of clinic or hospital');
         return false;
    }else if (doctor_type == 0) {
        myApp.alert('Select Doctor type');
        return false;
    }else if (clinic_camp == 0) {
        myApp.alert('Select Camp or Clinic');
        return false;
    }else if (expected_number_of_registration == '') {
        myApp.alert('Enter Expected No. of Registration');
        return false;
    }else if (!$("#block_machine").is(":checked")) {
        myApp.alert('Block Machine is not checked ');
        return false;
    }else if (start_time == '') {
        myApp.alert('Select start Time');
        return false;
    }else if (end_time == '') {
        myApp.alert('Select end Time');
        return false;
    }

    if (time_check_both_slot == 0) {
        if (start_time < "14:00" && end_time > "14:00") {
            myApp.alert('You are trying to book Both the slots');
                time_check_both_slot == 1;
            return false;
        }
    }

    if (clinic_camp == 'camp') {
        myApp.showIndicator();
        $.ajax({
            url: base_url + '/camp_clinic_form_submit',
            type: 'POST',
            crossDomain: true,
            data: {
                "doctor_id" : doctor_name,
                "doctor_speciality" : doctor_speciality,
                "doctor_type" : doctor_type,
                "camp_clinic" : clinic_camp,
                "start_time" : start_time,
                "end_time" : end_time,
                "block_machine" : block_machine,
                "available_at_camp" : available_at_camp,
                "user_data" : token,
                "address" : doctor_address,
                "expected_registrations" : expected_number_of_registration,
                "date" : selected_date,
                "machine_name" : machine_name_global,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            if (res.status == 'SUCCESS') {
                time_check_both_slot == 0;
                myApp.alert(res.message);
                // console.log(res.insert_data);
                machine_name_global = '';
                selected_date = '';
                $("#doctor-list,#clinic_camp,#doctor_speciality,#doctor_type").val(0);
                $("#doctor_address,#expected_number_of_registration,#start-time-input,#end-time-input").val('');
                $("#block_machine,#available_at_camp").attr('checked', false);
                mainView.router.load({
                    url: 'calendar.html',
                    ignoreCache: false,
                });
            }else{
                myApp.alert(res.message);  
            } 
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('Some error occurred on connecting.');
            // console.log('fail: ' + j2s(err));
        })
        .always(function() {
            myApp.hideIndicator();
        });
    } else {
        // var date_clinic_set = $("#date-clinic-set").val();
        myApp.showIndicator();
        $.ajax({
            url: base_url + '/camp_clinic_form_submit',
            type: 'POST',
            crossDomain: true,
            data: {
                "doctor_id" : doctor_name,
                "doctor_speciality" : doctor_speciality,
                "doctor_type" : doctor_type,
                "camp_clinic" : clinic_camp,
                "start_time" : start_time,
                "end_time" : end_time,
                "block_machine" : block_machine,
                "available_at_camp" : available_at_camp,
                "user_data" : token,
                "address" : doctor_address,
                "expected_registrations" : expected_number_of_registration,
                "date" : selected_date,
                "machine_name" : machine_name_global,
                "clinic_more_date" : clinic_more_date,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            if (res.status == 'SUCCESS') {
                time_check_both_slot == 0;
                myApp.alert(res.message);
                // console.log(res.insert_data);
                machine_name_global = '';
                selected_date = '';
                clinic_more_date = [];
                $("#doctor-list,#clinic_camp,#doctor_speciality,#doctor_type").val(0);
                $("#doctor_address,#expected_number_of_registration,#start-time-input,#end-time-input").val('');
                $("#block_machine,#available_at_camp").attr('checked', false);
                mainView.router.load({
                    url: 'calendar.html',
                    ignoreCache: false,
                });
            }else{
                myApp.alert(res.message);  
            } 
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('Some error occurred on connecting.');
            // console.log('fail: ' + j2s(err));
        })
        .always(function() {
            myApp.hideIndicator();
        });
    }
}

//camp approved on click
function camp_approved_click(id){
    // if ( !id == '') {
    //     var row_delet = '#approved_section_'+id;
    //     $(row_delet).click(function(){
    //         $('#row_'+id).remove();
    //         // console.log('removed'+'#row_'+id);
    //     })
    //     return false;
    //     myApp.showIndicator();
    //     $.ajax({
    //         url: base_url + '/approve_camp',
    //         type: 'POST',
    //         crossDomain: true,
    //         data: {
    //             "camp_id" : id,
    //         },
    //     })
    //     .done(function(res) {
    //         // console.log('done: ' + j2s(res));
    //         if (res.status == 'SUCCESS') {
    //             myApp.alert(res.message);
    //             // // console.log(res.doctors_data);
    //         }else{
    //             myApp.alert(res.message);  
    //         } 
    //     })
    //     .fail(function(err) {
    //         myApp.hideIndicator();
    //         myApp.alert('Some error occurred on connecting.');
    //         // console.log('fail: ' + j2s(err));
    //     })
    //     .always(function() {
    //         myApp.hideIndicator();
    //     });
    // }
    myApp.confirm('Are you sure?', 'Approved Camps', 
      function () {
        if ( !id == '') {
        var row_delet = '#approved_section_'+id;
        $(row_delet).click(function(){
            $('#row_'+id).remove();
            // console.log('removed'+'#row_'+id);
        })
        // return false;
        myApp.showIndicator();
        $.ajax({
            url: base_url + '/approve_camp',
            type: 'POST',
            crossDomain: true,
            data: {
                "camp_id" : id,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            if (res.status == 'SUCCESS') {
                myApp.alert(res.message);
                // // console.log(res.doctors_data);
            }else{
                myApp.alert(res.message);  
            } 
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('Some error occurred on connecting.');
            // console.log('fail: ' + j2s(err));
        })
        .always(function() {
            myApp.hideIndicator();
        });
    }
      },
    ); 
}

//delete camp approved
function camp_delete_click(id){ 
    myApp.confirm('Are you sure?', 'Delete Camps', 
      function () {
         if ( !id == '') {
            var row_delet = '#delete_section_'+id;
            $(row_delet).click(function(){
                $('#row_'+id).remove();
            })
            // return false;
            myApp.showIndicator();
            $.ajax({
                url: base_url + '/delete_camp',
                type: 'POST',
                crossDomain: true,
                data: {
                    "camp_id" : id,
                },
            })
            .done(function(res) {
                if (res.status == 'SUCCESS') {
                    delete_camp_status -= 1;
                    console.log("Delete camp status"+delete_camp_status);
                    myApp.alert(res.message);
                    if (delete_camp_status == 0) {
                        mainView.router.load({
                            url: 'calendar.html',
                            ignoreCache: false,
                         });
                    }
                }else{
                    myApp.alert(res.message);
                } 
            })
            .fail(function(err) {
                myApp.hideIndicator();
                myApp.alert('Some error occurred on connecting.');
            })
            .always(function() {
                myApp.hideIndicator();
            });
        }
      },
    );
}

//delete camp executed
function delete_executed_camp(id){
     myApp.confirm('Are you sure?', 'Delete Camps', 
      function () {
        if ( !id == '') {
            var row_delet = '#click_delete_'+id;
            $(row_delet).click(function(){
                $('#row_executed_camps_'+id).remove();
            })
            // return false;
            $.ajax({
                url: base_url + '/delete_camp',
                type: 'POST',
                crossDomain: true,
                data: {
                    "camp_id" : id,
                },
            })
            .done(function(res) {
                if (res.status == 'SUCCESS') {
                    myApp.alert(res.message);
                }else{
                    myApp.alert(res.message);  
                } 
            })
            .fail(function(err) {
                myApp.hideIndicator();
                myApp.alert('Some error occurred on connecting.');
                // console.log('fail: ' + j2s(err));
            })
            // .always(function() {});
        } 
      },
    );

}

function go_to_camps_detail(id){
     if ( !id == '') {
        console.log(id);
        $.ajax({
            url: base_url + '/get_camp_details',
            type: 'POST',
            crossDomain: true,
            data: {
                "camp_id" : id,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            if (res.status == 'SUCCESS') {
                // console.log(res.leaderboard_data.doctor_name);
                // goto_page("camp_details.html");
                mainView.router.load({
                    url: 'camp_details.html',
                    ignoreCache: false,
                    query: {
                         camp_details_data: res.leaderboard_data
                    },
                });
            }
        })
        .fail(function(err) {
            myApp.hideIndicator();
            myApp.alert('No data is available for this camp');
            // console.log('fail: ' + j2s(err));
        })
        .always(function() {});
    }
}
function add_record(){
    var temp = new Array();
    var i =0;
    if (!$('input[name=gender]:checked').val() ) { 
        myApp.alert(" Select Gender");
        return false;
    } else if (!$('ul.tabrow li').hasClass('selected')) {    
        myApp.alert(" Select Age"); 
        return false;        
    } else if ($('#indication').val() == 0) {
        myApp.alert("Select Disease");
        return false;
    } else if ($('#kpa').val() == '') {    
        myApp.alert("Enter FIbroscan Value (KPA)");
         return false;
    } else if ($('#kpa').val() >= 75 ){
        myApp.alert("KPA value should be less then 75");
        return false;
    } else if ($('#kpa').val() <= 0 ){
        myApp.alert("KPA value should be greater then 0");
         return false;
    }
    console.log($('input[name="gender"]:checked').val());
    // var ciphertext = CryptoJS.AES.encrypt(element, 'l0c@lh0st');
    var temp = [$('input[name="gender"]:checked').val(), $('.selected').data('value'), $('#indication').val(), $('#kpa').val()];
    // console.log(temp);
    records.push(temp);
    $('#indication').val(0);
    // $('.selected').attr('value',"");
    $('ul.tabrow li').removeClass('selected');
    $('input[name="gender"]').attr('checked', false);
    $('#kpa').val('');
    patient_record_count += 1;
    i++;
    temp =[];
    console.log(records);
    // console.log("temp"+temp);
}

function update_record(){
    // $('#patient_record_edit_id').val()
    if (!$('input[name=gender]:checked').val() ) { 
        myApp.alert(" Select Gender");
        return false;
    } else if (!$('ul.tabrow li').hasClass('selected')) {    
        myApp.alert(" Select Age"); 
        return false;        
    } else if ($('#indication').val() == 0) {
        myApp.alert("Select Disease");
        return false;
    } else if ($('#kpa').val() == '') {    
        myApp.alert("Enter FIbroscan Value (KPA)");
         return false;
    } else if ($('#kpa').val() >= 75 ){
        myApp.alert("KPA value should be less then 75");
        return false;
    } else if ($('#kpa').val() <= 0 ){
        myApp.alert("KPA value should be greater then 0");
         return false;
    }

    records[$('#patient_record_edit_id').val()][0] = $('input[name="gender"]:checked').val();
    records[$('#patient_record_edit_id').val()][1] = $('.selected').data('value');
    records[$('#patient_record_edit_id').val()][2] = $('#indication').val();
    records[$('#patient_record_edit_id').val()][3] = $('#kpa').val();
    myApp.alert('Data Updated Successfully');
    mainView.router.load({
        url: 'entries.html',
        ignoreCache: false,
        query: {
            start_time: technician_start_time_camp,
            records: records,
            number_count :patient_record_count,
            camp_id :start_camp_id,
        },
    });
}

function get_start_time(id){
    start_camp_id = id;
    technician_start_time_camp = $("#start_time_camp").val();
    if ($("#start_time_camp").val()) {
        goto_page('record.html');
    } else {
        $("#select_time_error_tech").html("Please Select Time");
    }
}

function records_listing(){
    mainView.router.load({
        url: 'entries.html',
        ignoreCache: false,
        query: {
            start_time: technician_start_time_camp,
            records: records,
            number_count :patient_record_count,
            camp_id :start_camp_id,
        },
    });
}
function edit_add_record(data){
    // console.log(data);
    mainView.router.load({
        url: 'record.html',
        ignoreCache: false,
        query: {
            edit: 'edit',
            array_index : data,

        },
    });
}
//load load_disease_data
function load_disease_data(){
    myApp.showIndicator();
    $.ajax({
        url: base_url + '/disease_data',
        type: 'POST',
        crossDomain: true,
        async: false,
        data: {},
    })
    .done(function(res) {
        // console.log('res: ' + j2s(res));
        myApp.hideIndicator();
        if (res.status == 'SUCCESS') {
            var html = '<option value="0">Select indication</option>';
            $.each(res.disease, function(index, val) {
                html += '<option value="' + val.name + '" >' + val.name + '</option>';
            });
            $('#indication').append(html)
        }
    }).fail(function(err) {
        myApp.hideIndicator();
        myApp.alert('some error');
        // console.log('error: ' + err);
    }).always();
}
//back button
document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    Lockr.flush();
    console.log('device is ready');
    document.addEventListener("backbutton", function(e) {
        e.preventDefault();
        var page = myApp.getCurrentView().activePage;
        myApp.hideIndicator();
         myApp.closePanel();
        image_from_device = '';
        if (page.name == "calendar" || page.name == "technician_view" || page.name == "index" ) {
            // lockFile = dataDir.getFile("file:///lockfile.txt", {create: true, exclusive: true});
            // console.log("Created File"+lockFile);
            myApp.confirm('would you like to exit app.', function() {
                navigator.app.clearHistory();
                gaPlugin.exit(nativePluginResultHandler, nativePluginErrorHandler);
                navigator.app.exitApp();
            });
        } else if (page.name == "machine_booking") {
            load_machine_listing_details(vz_dayevent, vz_monthevent, vz_yearevent, token);
        } else {
            mainView.router.back({});
        }
    }, false);

    // mainView.router.load('index.html');
}

function nativePluginResultHandler(result) {
    // console.log('GA result: '+result);
    // alert('GA result: '+result);
}

function nativePluginErrorHandler(error) {
    // console.log('GA error: '+error);
    // alert('GA error: '+error);
}

function getStartTime_Dash(){
    technician_start_time_camp = $("#start_time_camp").val();
    $("#start_time_update_dash").html(tConvert(technician_start_time_camp));
}

function getEndTime_Dash(){
    technician_start_time_camp = $("#end_camp_time").val();
    $("#end_time_update_dash").html(tConvert(technician_start_time_camp));
}

function getStartTime(){
    var time_converted = tConvert($("#start-time-input").val());
    $("#start-time-clock").text(time_converted);
}

function getEndTime(){
    var time_converted = tConvert($("#end-time-input").val());
    $("#end-time-clock").text(time_converted);
}

function addDatesClinic(){
    myApp.showIndicator();
    $.ajax({
        url: base_url + '/validate_camp_clinic',
        type: 'POST',
        crossDomain: true,
        data: {
            "date" : $("#date-clinic-set").val(),
            "start_time" : $("#start-time-input").val(),
            "end_time" : $("#end-time-input").val(),
            "machine_name" : machine_name_global,
        },
    })
    .done(function(res) {
        // console.log('done: ' + j2s(res));
        if (res.status == 'SUCCESS') {
            myApp.alert(res.message);
            clinic_more_date.push($("#date-clinic-set").val());
            // console.log(clinic_more_date);

            var html = '<li>'+
                          '<div class="item-content" id="date-'+$("#date-clinic-set").val()+'" style="/* margin: 15px 0 0; */background: #e6e6e6;">'+
                             '<div class="item-inner" style="padding: 0">'+
                             '<p>'+$("#date-clinic-set").val()+'</p>'+
                             '<i class="material-icons delete-section-date" data-date="'+$("#date-clinic-set").val()+'" style="margin-right: 20px;">clear</i>'+
                             '</div>'+
                          '</div>'+
                       '</li>';

            $("#add-dates-display").append(html);

            var crt_did = '.delete-section-date-'+$("#date-clinic-set").val();
            $(".delete-section-date").click(function(){
                var crt_id = '#date-'+$(this).data('date');
                $(crt_id).remove();
                if (clinic_more_date.indexOf($(this).data('date')) > -1) {
                    clinic_more_date.splice(clinic_more_date.indexOf($(this).data('date')), 1);
                }
                // console.log(clinic_more_date);
            })
        }else{
            myApp.alert(res.message);  
        } 
    })
    .fail(function(err) {
        myApp.hideIndicator();
        myApp.alert('Some error occurred on connecting.');
        // console.log('fail: ' + j2s(err));
    })
    .always(function() {
        myApp.hideIndicator();
    });
}

function tConvert(time) {
  time = time.toString().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        time = time.slice (1);
        time[5] = +time[0] < 12 ? 'AM' : 'PM';
        time[0] = +time[0] % 12 || 12;
    }
    return time.join(' ');
}

function date_to_date_string(date){
    var m_names = new Array("Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var newdate = m_names[ month] + "-" + day + "- " + year;
    return newdate;
}

function date_to_date_string1(date){
    var m_names = new Array("Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var newdate =  day+ "-" + m_names[ month] + "- " + year;
    return newdate;
}

function date_to_date_string2(date){
    var m_names = new Array("Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    var d = new Date(date);
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    var newdate =  day+ "-" + m_names[ month];
    return newdate;
}

function date_to_date_string3(date){
    return date.getFullYear()+'-' + (date.getMonth()+1) + '-'+date.getDate();

    // var m_names = new Array("Jan", "Feb", "Mar","Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec");

    // var d = new Date(date);
    // var day = d.getDate();
    // var month = d.getMonth();
    // var year = d.getFullYear();
    // var newdate = year + "-" + m_names[ month] + "- " + day;
    return newdate;
}

function get_current_date(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    }
    today = mm+'/'+dd+'/'+yyyy;
    // console.log(today);
    return {
        mm:mm,
        dd:dd,
        yyyy:yyyy
    };
}

function open_dialog_for_image() {
    $("#time_error_tech").html("");
    var buttons1 = [{
        text: 'choose source',
        label: true
    }, {
        text: 'Camera',
        bold: true,
        onClick: image_camera,
    }, {
        text: 'Gallery',
        bold: true,
        onClick: image_gallery,
    }];
    var buttons2 = [{
        text: 'Cancel',
        color: 'red'
    }];
    var groups = [buttons1, buttons2];
    myApp.actions(groups);
}

function image_gallery() {
    navigator.camera.getPicture(image_onSuccess, image_onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        targetWidth: 720,
        targetHeight: 640,
        correctOrientation: true,
        allowEdit: true,
    });
}

function image_camera() {
    navigator.camera.getPicture(image_onSuccess, image_onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 720,
        targetHeight: 640,
        correctOrientation: true,
        allowEdit: true,
    });
}

function image_onSuccess(fileURL) {
    var uri = encodeURI(base_url + "/upload_user");
    var options = new FileUploadOptions();
    options.fileKey = "file";
    options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
    options.mimeType = "image/jpeg";
    var headers = {
        'headerParam': 'headerValue'
    };
    options.headers = headers;
    new FileTransfer().upload(fileURL, uri, image_upload_onSuccess_file, image_upload_onError_file, options);
}

function image_upload_onSuccess_file(res) {
    if (res.responseCode == 200) {
        uploaded_image = res.response.replace(/\"/g, "");
        image_from_device = uploaded_image;
        image.push(uploaded_image);
        var html = '';
        html +=
        '<div class="col-33">'+
            '<img class="upload_img" src="'+image_url+uploaded_image+'" alt="" >'+
        '</div>';
        $('#image_append').append(html);
        myApp.alert("Image Uploaded Successfully");
    } else {
        myApp.alert('Some error occurred on uploading');
    }
}

function image_upload_onError_file(error) {
    myApp.alert("Some Error Occured While image upload please try again");
}

function image_onFail(message) {
    // console.log('Failed because: ' + message);
}

function getlocationFromMap(){
    $(".pac-item").click(function(){
        // console.log();
        $("#doctor_address").val($(this).last().text());
    });
}

 function initialize() {

    var acInputs = document.getElementsByClassName("autocomplete");

    for (var i = 0; i < acInputs.length; i++) {
        var autocomplete = new google.maps.places.Autocomplete(acInputs[i]);
        autocomplete.inputId = acInputs[i].id;
        console.log(acInputs[i].id);
        // google.maps.event.addListener(autocomplete, 'place_changed', function () {
        //     document.getElementById("log").innerHTML = 'You used input with id ' + this.inputId;
        // });
    }
    $(".pac-container").show();
}

function vz_block_machine() {
    $("#available_at_camp").click();
}

function body_click(){
    $('body').click(function() {
         active_counter = 0;
    })
}

function change_password(){
    var email = $("#email").val();
    var current_password = $("#current_password").val();
    var new_password = $("#new_password").val();
    var confirm_new_password = $("#confirm_new_password").val();

    if (current_password == '') {
        myApp.alert('Current Password is empty');
        return false;
    } else if (new_password == '') {
        myApp.alert('New Password is empty');
        return false;
    } else if (confirm_new_password == '') {
        myApp.alert('Confirm New Password is empty');
        return false;
    } else if (!confirm_new_password.match(new_password)) {
        myApp.alert('Confirm New Password is not match with New password');
        return false;
    }

    myApp.showIndicator();
    $.ajax({
        url: base_url + '/change_password',
        type: 'POST',
        crossDomain: true,
        data: {
            "email" : email,
            "current_password" : current_password,
            "new_password" : new_password,
        },
    })
    .done(function(res) {
        // console.log('done: ' + j2s(res));
        if (res.status == 'SUCCESS') {
            myApp.alert(res.message);
            logout();
            // // console.log(res.doctors_data);
        }else{
            myApp.alert(res.message);  
        } 
    })
    .fail(function(err) {
        myApp.hideIndicator();
        myApp.alert('Some error occurred on connecting.');
        // console.log('fail: ' + j2s(err));
    })
    .always(function() {
        myApp.hideIndicator();
    });
}

