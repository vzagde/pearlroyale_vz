var base_url = 'http://kreaserv-tech.com/abbott-content/fibroscan/index.php/api';
var image_url = 'http://kreaserv-tech.com/abbott-content/fibroscan/assets/uploads/';
var token = {};
var selected_date = '';
var email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
var phone_regex = /^\d{10}$/;
var machine_name_global = '';
var current_date = '';
var clinic_more_date = new Array();
var records = new Array();
var technician_start_time_camp = '';
var vz_dayevent = '';
var vz_monthevent = '';
var vz_yearevent = '';
var active_count = 0;

var myApp = new Framework7({
    pushState: false,
    // swipePanel: 'right',
    swipeBackPage:false,
    preloadPreviousPage: false,
    uniqueHistory: true,
    uniqueHistoryIgnoreGetParameters: true,
    modalTitle: 'Fibro Scan',
    imagesLazyLoadPlaceholder: 'img/lazyload.jpg',
    imagesLazyLoadThreshold: 50,

});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
	// dynamicNavbar: true
});

mainView.hideNavbar();


var token = Lockr.get('token');

var active_counter = 0;
var interval = setInterval(function() {
    active_counter++;
    // console.log(active_counter);
    if (active_counter == 1800) {
        Lockr.flush();
        token = false;
        mainView.router.load({
            url: 'index.html',
            ignoreCache: false,
            reload:true
        });
        $("#index-display").fadeIn();
        active_counter = 0;
    }
}, 1000);



if(token != undefined){
    $("#index-display").css('display','block')
    // return false;
    // console.log('Group Name'+token.group_name);
    // $("#menu_name").text(token.first_name);
    // if (token.group_name == "Technician") {
    //     $(".menu_camps_display").hide();
    //     $(".camp_book_form").hide();
    //     $(".camp_approved").hide();
    //     $(".leader_board_screen").hide();
    //     $(".dashboard").hide();
    //     $("#index-display").show();
    //     $("#preloader").fadeOut();
    //     mainView.router.load({
    //         url: 'technician_view.html',
    //         ignoreCache: false,
    //     });
    // } else {
    //     if (token.group_name == "FAM") {
    //         $(".leader_board_screen").show();
    //         $(".camp_approved").show();
    //         $(".dashboard").show();
    //     } else {
    //         $(".leader_board_screen").hide();
    //         $(".camp_approved").hide();
    //         $(".dashboard").hide();
    //     }
    //     $(".menu_camps_display").show();
    //     $(".camp_book_form").show();
    //     $("#index-display").show();
    //     $("#preloader").fadeOut();
    //     mainView.router.load({
    //         url: 'calendar.html',
    //         ignoreCache: false,
    //     });
    // }
    // $.each(token, function(index, val) {
    //     // console.log(index+" : "+val);
    // });
} else {
    $("#index-display").show();
    $("#preloader").fadeOut();
}

myApp.allowPanelOpen = false;




myApp.onPageInit('*', function (page) {

  console.log(page.name + ' initialized'); 

});
 




myApp.onPageInit('index', function(page) {

    console.log('index called');

    $("#index-display").css('display','block');
    myApp.allowPanelOpen = false;
    // if(token != undefined){
    //     // console.log('Group Name'+token.group_name);
    //     $("#menu_name").text(token.first_name);
    //     if (token.group_name == "Technician") {
    //         $(".menu_camps_display").hide();
    //         $(".camp_book_form").hide();
    //         $(".camp_approved").hide();
    //         $(".leader_board_screen").hide();
    //         $("#index-display").show();
    //         $("#preloader").fadeOut();
    //         mainView.router.load({
    //             url: 'technician_view.html',
    //             ignoreCache: false,
    //         });
    //     } else {
    //         if (token.group_name == "FAM") {
    //             $(".leader_board_screen").show();
    //         } else {
    //             $(".leader_board_screen").hide();
    //         }
    //         $(".menu_camps_display").show();
    //         $(".camp_book_form").show();
    //         $(".camp_approved").show();
    //         $("#index-display").show();
    //         $("#preloader").fadeOut();
    //         mainView.router.load({
    //             url: 'calendar.html',
    //             ignoreCache: false,
    //         });
    //     }
    //     $.each(token, function(index, val) {
    //         // console.log(index+" : "+val);
    //     });
    // } else {
    //     $("#index-display").show();
    //     $("#preloader").fadeOut();
    // }
});

myApp.onPageInit('machine_list', function(page) {
    myApp.allowPanelOpen = true;
    var group_name = page.query.group_name;
    var contact_number = page.query.contact_number;
    // console.log(group_name);
    if (group_name == 'TBM') {
        $('#dial_number').show();
        $("#dial_number").click(function(){
            dial_number(contact_number);
        })

    }
    var html = '';
    var color_mrng = '';
    var color_evng = '';
    var machineNAME = page.query.machine_name;
    var machine_prev_details = page.query.prev_details;
    var machine_current_details = page.query.current_details;
    var machine_next_details = page.query.next_details;
    // // console.log(machine_current_details);
    // // console.log("machine_next_details"+machine_next_details);
    // machine_name_global = page.query.machine_name;
    $("#machine-listing").empty();

    for (i = 0; i < page.query.num_records; i++) {
        var color_mrng = '#92C384';
        var color_evng = '#92C384';
        var make_disable = '';

        if (machine_current_details[i].count == 2 || machine_current_details[i].slot_type == 'Both Slot') {
            color_mrng = '#EB7159';
            color_evng = '#EB7159';
            make_disable = 'disabled';
        } else if (machine_current_details[i].count == 1 && machine_current_details[i].slot_type == 'First Slot') {
            color_mrng = '#EB7159';
            color_evng = '#92C384';
            make_disable = '';
        } else if (machine_current_details[i].count == 1 && machine_current_details[i].slot_type == 'Second Slot') {
            color_mrng = '#92C384';
            color_evng = '#EB7159';
            make_disable = '';
        }

        html += '<div class="machine machine_'+i+'">'+
                    '<div class="row" style="padding: 0 5%">'+
                        '<div class="col-40">'+
                            '<h1 class="wpa" id="machineName">'+machineNAME[i].machine_name+'</h1>'+
                        '</div>'+
                        '<div class="col-60 ">'+
                            '<p style="border: 2px solid #05c10b;;height:35px;width:35px;-webkit-border-radius:75px;-moz-border-radius:75px;float: right;margin-right: 6%;">'+
                            '<input style="float: right; width: 30px; height: 30px" type="radio" name="machine_name" '+make_disable+' value="'+machineNAME[i].machine_name+'"></p>'+
                        '</div>'+
                    '</div>';
        if (machine_prev_details[i].date) {
            html += '<div class="row machine_pl" style="border-top: 1px solid gray;border-bottom: 1px solid gray">'+
                        '<div class="col-15">'+
                            '<p><img class="" src="img/calender_icon_off.png" alt=""></p>'+
                        '</div>'+
                        '<div class="col-85">'+
                            '<p class="prev_abhishek" style="margin-bottom:0%;">'+machine_prev_details[i].date+' '+machine_prev_details[i].name+'</p>'+
                            '<p class="prev_abhishek" style="margin:0%;font-size: 12px;">'+tConvert(machine_prev_details[i].start_time)+'-'+tConvert(machine_prev_details[i].end_time)+'</p>'+
                            '<p class="prev_abhishek" style="margin: 0% 0% 4% 0%;font-size: 12px;">'+machine_prev_details[i].address+'</p>'+
                        '</div>'+
                    '</div>  ';
        } else {
            html += '<div class="row machine_pl" style="border-top: 1px solid gray;border-bottom: 1px solid gray">'+
                        '<div class="col-15">'+
                            '<p><img class="" src="img/calender_icon_off.png" alt=""></p>'+
                        '</div>'+
                        '<div class="col-85">'+
                            '<p class="prev_abhishek">No Previous Camps</p>'+
                            '<p style="margin:0%;font-size: 12px;"></p>'+
                            '<p style="margin: 0% 0% 8% 0%;font-size: 12px;"></p>'+
                        '</div>'+
                    '</div>  ';
        }

            html += '<div class="row machine_pl" style="border-bottom: 1px solid gray">'+
                        '<div class="col-15">'+
                            '<p><img class="" src="img/calender_icon_on.png" alt=""></p>'+
                        '</div>';

            if (machine_current_details[i].date) {
                html += '<div class="col-45">'+
                            '<p class="prev_abhishek" style="margin:10% 0% 0%;"><b>'+date_to_date_string(machine_current_details[i].date)+'</b></p>'+
                            '<p class="prev_abhishek" style="margin:0%;font-size: 12px;">'+tConvert(machine_current_details[i].start_time)+'-'+tConvert(machine_current_details[i].end_time)+'</p>'+
                            '<p class="prev_abhishek" style="margin: 0% 0% 4% 0%;font-size: 12px;">'+machine_current_details[i].address+'</p>'+
                        '</div>'+
                        '<div class="col-40 ">'+
                            '<p class="prev_abhishek" style="margin-bottom:0%;color:'+color_mrng+';font-size: 12px;">Morning-8am-2pm</p>'+
                            '<p class="prev_abhishek" style="margin:0%;color:'+color_evng+';font-size: 12px;">Eveing-2pm-8pm</p>'+
                        '</div>'+
                    '</div>';
            } else {
                html += '<div class="col-45">'+
                            '<p class="prev_abhishek" style="margin: 10% 0"><b>'+date_to_date_string(selected_date)+'</b></p>'+
                            '<p class="prev_abhishek"></p>'+
                            '<p class="prev_abhishek"></p>'+
                        '</div>'+
                        '<div class="col-40">'+
                            '<p class="prev_abhishek" style="color:#92C384;font-size: 12px; margin-bottom: 0">Morning-8am-2pm</p>'+
                            '<p class="prev_abhishek" style="color:#92C384;font-size: 12px; margin: 0">Eveing-2pm-8pm</p>'+
                        '</div>'+
                    '</div>';
            }

        if (machine_next_details[i].date) {
            html += '<div class="row machine_pl"  style="border-bottom: 1px solid gray">'+
                        '<div class="col-15">'+
                            '<p><img class="" src="img/calender_icon_off.png" alt=""></p>'+
                        '</div>'+
                        '<div class="col-85">'+
                            '<p class="prev_abhishek" style="margin-bottom:0%;">'+machine_next_details[i].date+' '+machine_next_details[i].name+'</p>'+
                            '<p class="prev_abhishek" style="margin:0%;font-size: 12px;">'+tConvert(machine_next_details[i].start_time)+'-'+tConvert(machine_next_details[i].end_time)+'</p>'+
                            '<p class="prev_abhishek" style="margin: 0% 0% 4% 0%;font-size: 12px;">'+machine_next_details[i].address+'</p>'+
                        '</div>'+
                    '</div>';
        } else {
            html += '<div class="row machine_pl"  style="border-bottom: 1px solid gray">'+
                        '<div class="col-15">'+
                            '<p><img class="" src="img/calender_icon_off.png" alt=""></p>'+
                        '</div>'+
                        '<div class="col-85">'+
                            '<p class="prev_abhishek">No Next Camps</p>'+
                            '<p class="prev_abhishek" style="margin:0%;font-size: 12px;"></p>'+
                            '<p class="prev_abhishek" style="margin: 0% 0% 4% 0%;font-size: 12px;"></p>'+
                        '</div>'+
                    '</div>';
        }

        html += '</div>';
    }

    $("#machine-listing").append(html);
});

myApp.onPageInit('machine_booking', function(page) {
    myApp.allowPanelOpen = true;
    $(".pac-container").hide();
    $(".pac-container").remove();
    initialize();

    $("#vz_available_at_camp_id").click(function(){
        $("#available_at_camp").click();
    })

    $("#vz_block_machine_id").click(function(){
        $("#block_machine").click();
    })

    var doctors_data = page.query.doctors_data;
    var html = '<option value="0">Select Doctor</option>';

    $("#doctor-list").empty();

    for (var i = 0; i < doctors_data.length; i++) {
        html += '<option value="'+doctors_data[i].id+'">'+doctors_data[i].name+'</option>';
    }
    
    $("#doctor-list").append(html);

    $("#doctor-list").change(function () {
        myApp.showIndicator();
        var doctors_id = this.value;
        // console.log(doctors_id);
        if (!doctors_id == 0) {
            $.ajax({
                url: base_url + '/doctor_data',
                type: 'POST',
                crossDomain: true,
                data: {
                    "doctor_id" : doctors_id,
                },
            })
            .done(function(res) {
                // console.log('done: ' + j2s(res));
                if (res.status == 'SUCCESS') {
                    // console.log(res.doctors_data);
                    $.each( res.doctors_data, function( key, value ) {
                        $("#doctor_speciality").val(value.specialities);
                        if (value.gov_non_gov == 'No') {
                            $("#doctor_type").val('Non Government');  
                        } else {
                            $("#doctor_type").val('Government'); 
                        }
                    });
                    if (!res.address == '') {
                        $("#doctor_address").val(res.address);
                    } 
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
    });

    // $("#start-time").click(function(){
    //     $("#start-time").click();
    // });

    $("#clinic_camp").change(function () {
        var  clinic_camp_data = this.value;
        if (clinic_camp_data == 'clinic') {
            $("#add-dates-display").show();
        } else {
            $("#add-dates-display").hide();
        }
    })
    
    // var calendarDateFormat = myApp.calendar({
    //     input: '#calendar1-date-format',
    //     dateFormat: 'DD, MM dd, yyyy'
    // });
});

myApp.onPageInit('technician_view', function(page) {
    // console.log(token);
    myApp.allowPanelOpen = true;
    myApp.showIndicator();
    $.ajax({
        url: base_url + '/technician_dashboard',
        type: 'POST',
        crossDomain: true,
        data: {
            "user_data" : token,
        },
    })
    .done(function(res) {
        $("#techni").empty();
        var html = '';
        if (res.status == 'SUCCESS') {
            $("#tech_dashboard_num_camps").html(res.dashboard_data.num_of_camps);
            $("#tech_dashboard_num_patients").html(res.dashboard_data.num_of_patients);
            $("#tech_dashboard_camps_record").html(res.dashboard_data.completed_reports);
            $("#tech_dashboard_camp_pending").html(res.dashboard_data.num_of_camps_to_be_executed);
            $.each( res.data, function( key, value ) {
                if (value.status == 'Start') {
                    html += '<div class="camp_Id">'+
                                '<h3><b>Camp Id :</b>'+value.id+'</h3>'+
                                '<p><b>Doctor Name</b>: '+value.name+'</p>'+
                                '<p><b>Booked Date</b>: '+date_to_date_string1(value.date)+'</p>'+
                                '<p><b>Time</b>:'+tConvert(value.start_time)+'-'+tConvert(value.end_time)+'</p>'+
                                '<p><b>Location :</b>:'+value.address+'</p>'+
                                '<button id="myBtn" class="start_camp_button start_camp_button_tech" data-id="'+value.id+'" style="background-color:#009A17; color: #fff;">Start Camp</button>'+
                                '<div id="modal_container_tech_dash'+value.id+'" style="display: none"></div>'+
                            '</div>'+
                            '<hr>';

                    $("#start_time_technician").click(function(){
                        if ($("#start_time_camp").val()) {
                            start_camp_id = id;
                            technician_start_time_camp = tConvert($("#start_time_camp").val());
                            goto_page('record.html');  
                        } else {
                            $("#select_time_error_tech").html('Select Date Before Proceeding');
                            return false;
                        }
                    })
                } else {
                    var btn_lock = '';
                    if (value.status == 'Request In Process') {
                        btn_lock ='<button class="lock_button" type="" style="background-color:#FFD100; color: #fff;">In Process</button>';
                    } else {
                        btn_lock ='<button class="lock_button" type="" style="background-color:#E56A54; color: #fff;">Locked</button>';
                    }
                    html += '<div class="camp_Id" >'+
                            '<h3><b>Camp Id :</b>'+value.id+'</h3>'+
                            '<p><b>Doctor Name</b>: '+value.name+'</p>'+
                            '<p><b>Booked Date</b>: '+date_to_date_string1(value.date)+'</p>'+
                            '<p><b>Time</b>:'+tConvert(value.start_time)+'-'+tConvert(value.end_time)+'</p>'+
                            '<p><b>Location : </b>'+value.address+'</p>'+
                            btn_lock+
                        '</div>'+
                        '<hr>';
                }
                $("#techni").append(html);
            })

            $('.start_camp_button_tech').click(function(){
                var html =  '<div class="modal modal-in" style="display: block; position: fixed; margin-top: -76px;">'+
                                '<div class="modal-inner">'+
                                    '<div class="modal-title" style="padding: 30px 0;">'+
                                        '<p style="position: absolute; width: 50%; margin: 0 20% !important; text-align: left;" id="start_time_update_dash">Start Time</p>'+
                                        '<i class="material-icons" style="float: right; margin: -3% 20%; font-size: 35px">av_timer</i>'+
                                        '<input type="time" style="border:none; border-bottom: 1px solid gray; border-bottom: none; position: absolute; width: 50%; left: 4%; color: transparent; background: transparent; margin: 0 20%;" id="start_time_camp" onchange="getStartTime_Dash();">'+
                                    '</div>'+
                                    '<div class="modal-text">'+
                                        '<p id="select_time_error_tech"></p>'+
                                    '</div>'+
                                '</div>'+
                                '<div class="modal-buttons modal-buttons-1">'+
                                    '<span class="modal-button modal-button-bold" id="start_time_technician" onclick="get_start_time('+$(this).data("id")+')">OK</span>'+
                                    '<span class="modal-button modal-button-bold" id="cancel_technician">Cancel</span>'+
                                '</div>'+
                            '</div>';

                // var html = '<div id="myModal" class="modalA"  style="display: block">'+
                //                 '<div class="modalA-content">'+
                //                     ' <div class="modalA-header">'+
                //                         '<span class="close" style="margin-top: -10px;margin-right: 0px;background-color: transparent;color: #000;text-align: right;">×</span>'+
                //                     '</div>'+
                //                     '<div class="modalA-body">'+
                //                         '<input type="time" style="border:none;border-bottom: 1px solid gray;" id="start_time_camp">'+
                //                         '<p id="select_time_error_tech"></p>'+
                //                     '</div>'+
                //                     '<div class="modalA-footer" id="start_time_technician" onclick="get_start_time('+$(this).data("id")+')">'+
                //                         '<h3>Start Camp</h3>'+
                //                     '</div>'+
                //                 '</div>'+
                //             '</div>';

                var modal_id = "#modal_container_tech_dash"+$(this).data("id");

                $(modal_id).show();

                $(modal_id).html(html);

                $("#cancel_technician").click(function(){
                    $(modal_id).hide();
                    $(modal_id).empty();
                })

                var modal = document.getElementById('myModal');
                var span = document.getElementsByClassName("close")[0];
                // $("#myBtn").click(function() {
                //     console.log($("#start_time_camp").val());
                //     $(modal_id).show();
                // })
                // $(".close").click(function(){
                //     $(modal_id).hide();
                //     $(modal_id).empty();
                // })
                // span.onclick = function() {
                //     $(modal_id).hide();
                //     $(modal_id).empty();
                // }
                // window.onclick = function(event) {
                //     if (event.target == modal) {
                //         $(modal_id).hide();
                //         $(modal_id).empty();
                //     }
                // }
            })
        } else if (res.status == 'failed') {
            myApp.hideIndicator();
            $("#techni").empty();
            $("#tech_dashboard_num_camps").html(0);
            $("#tech_dashboard_num_patients").html(0);
            $("#tech_dashboard_camps_record").html(0);
            $("#tech_dashboard_camp_pending").html(0);
            $("#techni").append(res.message);
            $("#techni").css({"text-align-last": "center", "margin-top": "25%"});
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
});

myApp.onPageInit('calendar', function(page) {
    // var select_date = '';
    myApp.allowPanelOpen = true;
    // myApp.showPreloader();
    // setTimeout(function () {
    //     myApp.hidePreloader();
    // }, 2000);

    var calendar = {
        init: function(ajax) {
            calendar.startCalendar();
        },

        startCalendar: function() {
            var mon = 'Mon';
            var tue = 'Tue';
            var wed = 'Wed';
            var thur = 'Thur';
            var fri = 'Fri';
            var sat = 'Sat';
            var sund = 'Sun';

            var mnthtopass = '';
            var yeartopass = '';

            /* Get current date */
            var d = new Date();
            var strDate = yearNumber + "/" + (d.getMonth() + 1) + "/" + d.getDate();
            var yearNumber = (new Date).getFullYear();
            /* Get current month and set as '.current-month' in title */
            var monthNumber = d.getMonth() + 1;

            function GetMonthName(monthNumber) {
                var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                return months[monthNumber - 1];
            }

            setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund);

            function setMonth(monthNumber, mon, tue, wed, thur, fri, sat, sund) {
                $('.month').text(GetMonthName(monthNumber) + ' ' + yearNumber);
                $('.month').attr('data-month', monthNumber);
                printDateNumber(monthNumber, mon, tue, wed, thur, fri, sat, sund);
            }

            $('.btn-next').on('click', function(e) {
                var monthNumber = $('.month').attr('data-month');
                if (monthNumber > 11) {
                    $('.month').attr('data-month', '0');
                    var monthNumber = $('.month').attr('data-month');
                    yearNumber = yearNumber + 1;
                    mnthtopass = parseInt(monthNumber)+1;
                    yeartopass = yearNumber;
                    setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
                } else {
                    mnthtopass = parseInt(monthNumber)+1;
                    yeartopass = yearNumber;
                    setMonth(parseInt(monthNumber) + 1, mon, tue, wed, thur, fri, sat, sund);
                };
            });

            $('.btn-prev').on('click', function(e) {
                var monthNumber = $('.month').attr('data-month');
                if (monthNumber < 2) {
                    $('.month').attr('data-month', '13');
                    var monthNumber = $('.month').attr('data-month');
                    yearNumber = yearNumber - 1;
                    mnthtopass = parseInt(monthNumber)-1;
                    yeartopass = yearNumber;
                    setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
                } else {
                    mnthtopass = parseInt(monthNumber)-1;
                    yeartopass = yearNumber;
                    setMonth(parseInt(monthNumber) - 1, mon, tue, wed, thur, fri, sat, sund);
                };
            });

            /* Get all dates for current month */
            function printDateNumber(monthNumber, mon, tue, wed, thur, fri, sat, sund) {
                $($('tbody.event-calendar tr')).each(function(index) {
                    $(this).empty();
                });

                $($('thead.event-days tr')).each(function(index) {
                    $(this).empty();
                });

                function getDaysInMonth(month, year) {
                    var date = new Date(year, month, 1);
                    var days = [];
                    while (date.getMonth() === month) {
                        days.push(new Date(date));
                        date.setDate(date.getDate() + 1);
                    }
                    return days;
                }

                i = 0;

                setDaysInOrder(mon, tue, wed, thur, fri, sat, sund);

                function setDaysInOrder(mon, tue, wed, thur, fri, sat, sund) {
                    var monthDay = getDaysInMonth(monthNumber - 1, yearNumber)[0].toString().substring(0, 3);
                    if (monthDay === 'Mon') {
                        $('thead.event-days tr').append('<td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td>');
                    } else if (monthDay === 'Tue') {
                        $('thead.event-days tr').append('<td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td>');
                    } else if (monthDay === 'Wed') {
                        $('thead.event-days tr').append('<td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td>');
                    } else if (monthDay === 'Thu') {
                        $('thead.event-days tr').append('<td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td>');
                    } else if (monthDay === 'Fri') {
                        $('thead.event-days tr').append('<td>' + fri + '</td><td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td>');
                    } else if (monthDay === 'Sat') {
                        $('thead.event-days tr').append('<td>' + sat + '</td><td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td>');
                    } else if (monthDay === 'Sun') {
                        $('thead.event-days tr').append('<td>' + sund + '</td><td>' + mon + '</td><td>' + tue + '</td><td>' + wed + '</td><td>' + thur + '</td><td>' + fri + '</td><td>' + sat + '</td>');
                    }
                };

                $(getDaysInMonth(monthNumber - 1, yearNumber)).each(function(index) {
                    var index = index + 1;
                    if (index < 8) {
                        $('tbody.event-calendar tr.1').append('<td class="afgreen bfgreen" date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
                    } else if (index < 15) {
                        $('tbody.event-calendar tr.2').append('<td class="afgreen bfgreen" date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
                    } else if (index < 22) {
                        $('tbody.event-calendar tr.3').append('<td class="afgreen bfgreen" date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
                    } else if (index < 29) {
                        $('tbody.event-calendar tr.4').append('<td class="afgreen bfgreen" date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
                    } else if (index < 32) {
                        $('tbody.event-calendar tr.5').append('<td class="afgreen bfgreen" date-month="' + monthNumber + '" date-day="' + index + '" date-year="' + yearNumber + '">' + index + '</td>');
                    }
                    i++;
                });

                var date = new Date();
                var month = date.getMonth() + 1;
                var thisyear = new Date().getFullYear();

                setCurrentDay(month, thisyear);
                // setEvent();
                displayEvent();
            }

            /* Get current day and set as '.current-day' */
            function setCurrentDay(month, year) {
                var viewMonth = $('.month').attr('data-month');
                var eventYear = $('.event-days').attr('date-year');
                if (parseInt(year) === yearNumber) {
                    if (parseInt(month) === parseInt(viewMonth)) {
                        $('tbody.event-calendar td[date-day="' + d.getDate() + '"]').addClass('current-day');
                        current_date = new Date(yearNumber, viewMonth,$(".current-day").text());
                        // console.log(current_date);
                        // console.log("current date :"+$(".current-day").text()+"/"+viewMonth+"/"+yearNumber);
                    }
                }
            };

            /* Add class '.active' on calendar date */
            $('tbody td').on('click', function(e) {
                if ($(this).hasClass('event')) {
                    $('tbody.event-calendar td').removeClass('active');
                    $(this).addClass('active');
                } else {
                    $('tbody.event-calendar td').removeClass('active');
                };
            });

            /* Get current day on click in calendar and find day-event to display */
            function displayEvent() {
                myApp.showIndicator();
                $.ajax({
                    url: 'http://kreaserv-tech.com/abbott-content/fibroscan/index.php/api/pull_calendar_data',
                    type: 'POST',
                    crossDomain: true,
                    data: {
                        "mnthtopass": mnthtopass, 
                        "yeartopass": yeartopass, 
                        "user_data": token,
                    },
                })
                .done(function(data) {
                    myApp.hideIndicator();
                    var events = data.data;
                    console.log('done: ' + j2s(data));
                    $("#no_patients").text(data.dashboard_data.num_of_patients_per_camps);
                    $("#no_patients_high_risk").text(data.dashboard_data.high_risk);
                    $("#planned_camp").text(data.dashboard_data.num_of_proposed_camps);
                    $("#executed").text(data.dashboard_data.num_of_completed_camps);
                    $("#percentage_camps_executed").text(data.dashboard_data.machine_utilization);
                    if (token.group_name == "FAM") {
                        $("#camp_comp").text('Machine utilization');
                    }
                    console.log(data.dashboard_data.machine_utilization);
                    if (data.status == 'GOTDATA') {
                        $("#no_patients").text(data.dashboard_data.num_of_patients_per_camps);
                        $("#no_patients_high_risk").text(data.dashboard_data.high_risk);
                        $("#planned_camp").text(data.dashboard_data.num_of_proposed_camps);
                        $("#executed").text(data.dashboard_data.num_of_completed_camps);
                        $("#percentage_camps_executed").text(data.dashboard_data.machine_utilization);
                        for (var i = 0; i < events.length; i++) {
                            var af_color = events[i].first_color;
                            var bf_color = events[i].second_color;
                            var str = events[i].date;
                            var eventDay = str.split('-')[2];
                            var eventMonth = str.split('-')[1];
                            var classNames = '';

                            console.log(af_color);
                            console.log(bf_color);

                            if (af_color == 'green') {
                                classNames += ' afgreen';
                            } else {
                                classNames += ' afred';
                            }

                            if (bf_color == 'green') {
                                classNames += ' bfgreen';
                            } else {
                                classNames += ' bfred';
                            }

                            $('tbody.event-calendar tr td[date-month="'+Number(eventMonth)+'"][date-day="'+Number(eventDay)+'"]').removeClass('afgreen bfgreen afred bfred');
                            $('tbody.event-calendar tr td[date-month="'+Number(eventMonth)+'"][date-day="'+Number(eventDay)+'"]').addClass(classNames);
                        }
                    }

                })
                .fail(function(data) {
                    console.log(data);
                });
                eventClass = 'event1 event';
                $('tbody.event-calendar tr td').addClass(eventClass);
                $('tbody.event-calendar td').on('click', function(e) {
                    $('.day-event').slideUp('fast');
                    var monthEvent = $(this).attr('date-month');
                    var dayEvent = $(this).text();
                    var yearEvent = $(this).attr('date-year');
                    var select_date = new Date(yearEvent, monthEvent, dayEvent);

                    if ($(this).hasClass('afred bfred')) {
                        $("#vz_notifyme_box").empty();
                        var html = 
                                '<div id="vz_notify_me" class="modal modal-in" style=" margin-top: -84px;">'+
                                    '<div class="modal-inner">'+
                                        '<div class="modal-title">No Slots are available!</div>'+
                                        '<div class="modal-text">Kindly Select a slot</div>'+
                                        '<div class="input-field">'+
                                            '<input type="checkbox" class="notify_check" value="Morning" id="morning"> Morning <br> '+
                                            '<input type="checkbox"  class="notify_check" value="Evening" id="evening" style="margin-left: -4px; !important;"> Evening'+
                                        '</div>'+
                                        '<p id="validation_text" style="color:red"></p>'+
                                    '</div>'+
                                    '<div class="modal-buttons modal-buttons-2 ">'+
                                        '<span class="modal-button modalclose">Cancel</span>'+
                                        '<span class="modal-button" id="notify_me">Notify Me</span>'+
                                    '</div>'+
                                '</div>';
                        $("#vz_notifyme_box").append(html);
                        $("#notify_me").click(function(){

                            var val = [];
                            $(':checkbox:checked').each(function(i){
                                val[i] = $(this).val();
                            });
                            if ($(".notify_check").is(":checked")) {
                                $.ajax({
                                    url: base_url + '/create_notification',
                                    type: 'POST',
                                    crossDomain: true,
                                    data: {
                                        "user_data" : token,
                                        "slot_type" : val.toString(),
                                        "date" : date_to_date_string3(select_date),
                                    },
                                })
                                .done(function(res) {
                                    // console.log('done: ' + j2s(res));
                                    if (res.status == 'SUCCESS') {
                                        myApp.alert("hi");
                                        console.log('done: ' + j2s(res));
                                    } 
                                })
                                .fail(function(err) {
                                    myApp.hideIndicator();
                                    myApp.alert('Some error occurred on connecting.');
                                    // console.log('fail: ' + j2s(err));
                                })
                                .always(function() {
                                    $('#vz_notify_me').hide();
                                    $("#vz_notifyme_box").empty();
                                });
                            } else {
                                //$('#vz_notify_me').hide();
                                $('#validation_text').text("Select Slot");
                                //myApp.alert("Select Slot");
                            }
               
                        })
                        $('#vz_notify_me').show();

                        $(".modalclose").click(function(){
                            $('#vz_notify_me').hide();
                            $("#vz_notifyme_box").empty();
                        });
                        return false;
                    }

                    // console.log(select_date);
                    // console.log(dayEvent+"/"+monthEvent+"/"+yearEvent);
                    $('.day-event[date-month="' + monthEvent + '"][date-day="' + dayEvent + '"]').slideDown('fast');
                    if (select_date < current_date) {
                        // console.log("hi");
                        myApp.alert("You can not select this date for camp / clinic booking.");
                    }else{
                        myApp.showIndicator();
                        vz_dayevent = dayEvent;
                        vz_monthevent = monthEvent;
                        vz_yearevent = yearEvent;
                        load_machine_listing_details(dayEvent, monthEvent, yearEvent, token);
                    }
                });
            };
        },
    };
    calendar.init('ajax');
});

myApp.onPageInit('camp_list', function(page) {
    myApp.allowPanelOpen = true;
    $('#camp_planned').empty();
    $('#camp_executed').empty();
    myApp.showIndicator();
    $.ajax({
        url: base_url + '/camp_listing_details',
        type: 'POST',
        crossDomain: true,
        data: {
            "user_data" : token,
        },
    })
    .done(function(res) {
        // console.log('done: ' + j2s(res));
        if (res.status == 'SUCCESS') {
            var html = '';
            $.each( res.in_complete_camps, function( key, value ) {
                var name = value.name.replace('DR ', '').split(' ');
                var border_color = '';
                if (value.camp_status == 'complete') {
                    border_color = '#FFD91C';     
                } else {
                    border_color = '#FB7D22';
                }
                html +=
                    '<li class="item-content" style="border-left: '+border_color+' 8px solid" id="row_executed_camps_'+value.id+'">'+
                      '<div class="item-inner">'+
                          '<div class="item-title" style="min-width: 100% !important; white-space: normal;">'+
                            '<p style="margin: 1px"><b>'+name[0]+date_to_date_string2(value.date)+value.id+'</b></p>'+
                            '<p id="click_delete_'+value.id+'" style="margin: 0px !important; float: right">'+
                                '<a onclick="delete_executed_camp('+value.id+')"><i class="fa fa-trash-o" style="color:red;margin-top: 22px !important;font-size: 30px !important;" aria-hidden="true"></i><a/>'+
                            '</p>'+
                            '<p style="margin: 1px">'+tConvert(value.start_time)+'-'+tConvert(value.end_time)+'</p>'+
                            '<p style="margin: 1px">'+date_to_date_string2(value.date)+'</p>'+
                            '<p style="margin: 1px">'+value.name+'</p>'+
                            '<p style="margin: 1px">'+value.address+'</p>'+
                          '</div><br>'+
                      '</div>'+
                    '</li>';
            });
            $('#camp_planned').append(html);
            var html = '';
            $.each( res.executed_camps, function( key, value ) {
                var name = value.name.replace('DR ', '').split(' ');
                html +=
                    '<li class="item-content" style="border-left: #83BD71 8px solid" id="row_executed_camps_'+value.id+'">'+
                      '<div class="item-inner" onclick="go_to_camps_detail('+value.id+')">'+
                          '<div class="item-title" style="min-width: 100% !important; white-space: normal;">'+
                            '<p style="margin: 1px"><b>'+name[0]+date_to_date_string2(value.date)+value.id+'</b></p>'+
                            '<p style="margin: 1px">'+tConvert(value.start_time)+'-'+tConvert(value.end_time)+'</p>'+
                            '<p style="margin: 1px">'+date_to_date_string2(value.date)+'</p>'+
                            '<p style="margin: 1px">'+value.name+'</p>'+
                            '<p style="margin: 1px">'+value.address+'</p>'+
                          '</div><br>'+
                      '</div>'+
                    '</li>';
            });
            $('#camp_executed').append(html); 
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
});

myApp.onPageInit('camp_list1', function(page) {
    myApp.allowPanelOpen = true;
});

myApp.onPageInit('camp_approved', function(page) {
    myApp.allowPanelOpen = true;
    myApp.showIndicator();
    $.ajax({
        url: base_url + '/fam_approval_list',
        type: 'POST',
        crossDomain: true,
        data: {
            "user_data" : token,
        },
    })
    .done(function(res) {
        // console.log('done: ' + j2s(res));
        $("#camp_approved_list").empty();
        if (res.status == 'SUCCESS') {
            var html = '';
            if (res.pending_approvals) {
                $.each( res.pending_approvals, function( key, value ) {
                    delete_camp_status += 1;
                    html += 
                        '<div class="row" style="background-color: #F3F3F3;" id="row_'+value.id+'">'+
                            '<div class="row" style="width: 100%">'+
                                '<div class="col-80">'+
                                '<p style="margin: 20px 0px 0px 8px!important;">'+value.fam_name+','+value.machine_name+'</p>'+
                                '</div>'+
                                '<div class="col-20" id="approved_section_'+value.id+'">'+
                                  '<a onclick="camp_approved_click('+value.id+')"><img style="width: 55%;margin-top: 22px;float: right; padding-right: 9%;" src="img/tick_mark.png" alt=""></a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-100">'+
                              '<p style="margin:0px 0px 0px 8px!important;">'+date_to_date_string1(value.date)+' '+tConvert(value.start_time)+'-'+tConvert(value.end_time)+'</p>'+
                            '</div>'+
                            '<div class="row" style="width: 100%;">'+
                                '<div class="col-80">'+
                                  '<p style="margin:0px 0px 0px 8px!important;">'+value.doctor_name+'</p>'+
                                '</div>'+
                                '<div class="col-20" id="delete_section_'+value.id+'">'+
                                  '<a onclick="camp_delete_click('+value.id+')" ><i class="fa fa-trash-o" style="color:red;float: right; padding-right:21%;font-size:30px;" aria-hidden="true" data-id="'+value.id+'"></i></a>'+
                                '</div>'+
                            '</div>'+
                            '<div class="col-100">'+
                              '<p style="margin:0px 0px 20px 8px!important;">'+value.address+'</p>'+
                            '</div>'+
                        '</div>'+
                        '<hr style="margin: 0%">';
                })
                $("#camp_approved_list").append(html);
            } else {
                delete_camp_status = 0;
                html += '<h2 style="text-align: center; padding: 2%; line-height: 30px;">There are no camps pending for Approval</h2>';
                $("#camp_approved_list").append(html);
            }
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
});

myApp.onPageInit('camp_record', function(page) {
    myApp.allowPanelOpen = true;
});

myApp.onPageInit('record', function(page) {
    myApp.allowPanelOpen = true;
    load_disease_data('#indication');
    var edit = page.query.edit;
    if(edit == 'edit'){
        $("#add_record_btn").hide();
        $("#update_record_btn").show();
        // // console.log(page.query.array_index);
        $("#patient_record_edit_id").val(page.query.array_index);
        $('input[value="'+records[page.query.array_index][0]+'"]').attr('checked',true);
        $('#indication').val(records[page.query.array_index][2]);
        $('#kpa').val(records[page.query.array_index][3]);
        $('ul.tabrow li[data-value="'+records[page.query.array_index][1]+'"]').addClass('selected');
    }
    $("li").click(function(e) {
      e.preventDefault();
      $("li").removeClass("selected");
      $(this).addClass("selected");
    });
});

myApp.onPageInit('entries', function(page) {

    myApp.allowPanelOpen = true;
    image_from_device = '';
    $("#record_listing").empty();
    var time_start = page.query.start_time;
    var data = page.query.records;
    var count = page.query.number_count;
    var start_camp_id = page.query.camp_id;
    // console.log(CryptoJS.AES.encrypt(JSON.stringify(page.query.records), 'l0c@Lh0st'));
    $("#number_of_entry").text('No.of Entries : '+count);
    var html = '';
    for (var i = 0; i < data.length; i++) {
        var list = i+1;
        // console(CryptoJS.AES.decrypt(toString(data[i][0]), 'l0c@lh0st').toString(CryptoJS.enc.Utf8));
        html +=
            '<div class="row">'+
                '<a href="" onclick="edit_add_record('+i+')" ><img class="pencil" src="img/pencil_new.png" alt=""></a>'+
            '</div>'+
            '<div class="row entryA ">'+
                '<div class="col-20 entries_no" style="text-align: center">'+
                    '<p>'+list+'</p>'+
                '</div>'+
                '<div class="col-80" style="font-size: 19px">'+
                    '<p><b>Age</b>: '+data[i][0]+'</p>'+
                    '<p><b>Gender</b>: '+data[i][1]+'</p>'+
                    '<p><b>FibroScan Value</b>: '+data[i][2]+'</p>'+
                    '<p><b>Indication</b>: '+data[i][3]+'</p>'+
                '</div>'+
            '</div>'+
            '<hr>';
    }
    $("#record_listing").append(html);

    
    // $("#image_upload").click(function() {
    //     open_dialog_for_image();
    // })

    var modal = document.getElementById('myModal1');
    var btn = $("#myBtn1");
    var span = document.getElementsByClassName("close")[0];
    $(btn).click(function() {
        modal.style.display = "block";
    })

    $("#cancel_end_technician").click(function(){
        $("#myModal1").hide();
    })

    // span.onclick = function() {
    //     modal.style.display = "none";
    // }

    // window.onclick = function(event) {
    //     if (event.target == modal) {
    //         modal.style.display = "none";
    //     }
    // }
    
    // $( "#edit_add_record" ).click(function() {
    //     mainView.router.load({
    //         url: 'record.html',
    //         ignoreCache: false,
    //         query: {
    //                  edit: 'edit',
    //         },
    //     });
    // });

    $( "#complete_camp" ).click(function() {
        var encrypt_data = [];
        var image_enc = [];
        console.log(tConvert($("#end_camp_time").val()));
        console.log(time_start);
        console.log(data);
        console.log(count);
        console.log("image"+image);
        if($("#end_camp_time").val() == "") {
            $("#time_error_tech").html("Please Select Time");
            return false; 
        // }else if (image.length == 0) {
        //     $("#time_error_tech").html("Please Upload image");
        //     return false;
        }

        for (var i = 0; i < records.length; i++) {
            encrypt_data.push(CryptoJS.AES.encrypt(JSON.stringify(records[i]), 'l0c@lh0st', {format: CryptoJSAesJson}).toString());
        }

         for (var i = 0; i < image.length; i++) {
            image_enc.push(CryptoJS.AES.encrypt(JSON.stringify(image[i]), 'l0c@lh0st', {format: CryptoJSAesJson}).toString());
        }

        var time_start_enc = CryptoJS.AES.encrypt(JSON.stringify(time_start), 'l0c@lh0st', {format: CryptoJSAesJson}).toString();
        var start_camp_id_enc = CryptoJS.AES.encrypt(JSON.stringify(start_camp_id), 'l0c@lh0st', {format: CryptoJSAesJson}).toString();
        var end_camp_time_enc = CryptoJS.AES.encrypt(JSON.stringify($("#end_camp_time").val()), 'l0c@lh0st', {format: CryptoJSAesJson}).toString();
        // bookmark
        console.log(image);
        
        myApp.showIndicator();
        try {
            $.ajax({
                url: base_url + '/patients_record_submit',
                type: 'POST',
                dataType: 'JSON',
                crossDomain: true,
                data: {
                    patients_records : encrypt_data,
                    start_time : time_start_enc,
                    camp_id : start_camp_id_enc,
                    end_time : end_camp_time_enc,
                    image : image_enc,
                },
            })
            .done(function(res) {
                console.log('done: ' + j2s(res));
                if (res.status == 'SUCCESS') {
                    myApp.alert(res.message);
                    image.length = 0;
                    encrypt_data.length = 0;
                    image_enc.length = 0;
                    technician_start_time_camp = '';
                    records.length = 0;
                    start_camp_id = '';
                    patient_record_count = '';
                    start_camp_id_enc = '';
                    end_camp_time_enc = '';
                    time_start_enc = '';
                    goto_page('technician_view.html');
                }

            })
            .fail(function(err) {
                myApp.hideIndicator();
                myApp.alert('Some error occurred on connecting.');
                console.log('fail: ' + j2s(err));
            })
            .always(function() {
                myApp.hideIndicator();
            });
        } catch(err) {
            console.log('err:', err.message);
        }
        // $.ajax({
        //     url: base_url + '/patients_record_submit',
        //     type: 'POST',
        //     dataType: 'JSON',
        //     crossDomain: true,
        //     data: {
        //         patients_records : encrypt_data,
        //         start_time : time_start,
        //         camp_id : start_camp_id,
        //         end_time : $("#end_camp_time").val(),
        //         image : image,
        //     },
        // })
        // .done(function(res) {
        //     console.log('done: ' + j2s(res));
        //     if (res.status == 'SUCCESS') {
        //         myApp.alert(res.message);
        //         image.length = 0;
        //         technician_start_time_camp = '';
        //         records.length = 0;
        //         start_camp_id = '';
        //         patient_record_count = '';
        //         goto_page('technician_view.html');
        //     }

        // })
        // .fail(function(err) {
        //     myApp.hideIndicator();
        //     myApp.alert('Some error occurred on connecting.');
        //     console.log('fail: ' + j2s(err));
        // })
        // .always(function() {
        //     myApp.hideIndicator();
        // });
    });
});

myApp.onPageInit('leader_board_screen', function(page) {
    // console.log("Screenload");
    myApp.allowPanelOpen = true;
    myApp.showIndicator();
    $.ajax({
            url: base_url + '/leaderboard',
            type: 'POST',
            crossDomain: true,
            data: {
                "user_data" : token,
            },
        })
        .done(function(res) {
            // console.log('done: ' + j2s(res));
            $("#all, #single, #two").empty();
            if (res.status == 'SUCCESS') {
                var html = '';
                var html1 = '';
                var html2 = '';
                for (var i = 0; i < res.leaderboard_data.length; i++) {
                    html += '<div class="row" style="background-color: #F3F3F3">'+
                                '<div class="row leader_board" style="padding: 3% 5%;">'+
                                    '<div class="col-100">'+
                                        '<p style="font-weight: bold;font-size:20px;color:#000;">'+res.leaderboard_data[i]['fam_name']+'</p>'+
                                    '</div>'+
                                    '<div class="col-80">'+
                                        '<p class="leader_txt">No.of proposed camps</p>'+
                                    '</div>'+
                                    '<div class="col-20">'+
                                        '<p class="leader_no"  style="color:#D07268;">'+res.leaderboard_data[i]['num_of_proposed_camps']+'</p>'+
                                    '</div>'+
                                    '<div class="col-80">'+
                                        '<p class="leader_txt">No.of compeleted camps</p>'+
                                    '</div>'+
                                    '<div class="col-20">'+
                                        '<p class="leader_no"  style="color:#402943;">'+res.leaderboard_data[i]['num_of_completed_camps']+'</p>'+
                                    '</div>'+
                                    '<div class="col-80">'+
                                        '<p class="leader_txt">Average no. of patients/camps</p>'+
                                    '</div>'+
                                    '<div class="col-20">'+
                                        '<p class="leader_no"  style="color:#DBB555">'+res.leaderboard_data[i]['num_of_patients_per_camps']+'</p>'+
                                    '</div>'+
                                    '<div class="col-80">'+
                                        '<p class="leader_txt">High Risk</p>'+
                                    '</div>'+
                                    '<div class="col-20">'+
                                        '<p class="leader_no"  style="color:#A7C8BD" >'+res.leaderboard_data[i]['high_risk']+'</p>'+
                                    '</div>'+
                                '</div>'+
                            '</div>'+
                            '<hr style="margin: 0%">';
                }

                for (var i = 0; i < res.leaderboard_data.length; i++) {
                    if (res.leaderboard_data[i]['num_of_machine'] == 1) {
                        html1 += '<div class="row" style="background-color: #F3F3F3">'+
                                    '<div class="row leader_board" style="padding: 3% 5%;">'+
                                        '<div class="col-100">'+
                                            '<p style="font-weight: bold;font-size:20px;color:#000;">'+res.leaderboard_data[i]['fam_name']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">No.of proposed camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#D07268;">'+res.leaderboard_data[i]['num_of_proposed_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">No.of compeleted camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#402943;">'+res.leaderboard_data[i]['num_of_completed_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">Average no. of patients/camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#DBB555">'+res.leaderboard_data[i]['num_of_patients_per_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">High Risk</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#A7C8BD" >'+res.leaderboard_data[i]['high_risk']+'</p>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<hr style="margin: 0%">';
                    } else if (res.leaderboard_data[i]['num_of_machine'] == 2) {
                        html2 += '<div class="row" style="background-color: #F3F3F3">'+
                                    '<div class="row leader_board" style="padding: 3% 5%;">'+
                                        '<div class="col-100">'+
                                            '<p style="font-weight: bold;font-size:20px;color:#000;">'+res.leaderboard_data[i]['fam_name']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">No.of proposed camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#D07268;">'+res.leaderboard_data[i]['num_of_proposed_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">No.of compeleted camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#402943;">'+res.leaderboard_data[i]['num_of_completed_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">Average no. of patients/camps</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#DBB555">'+res.leaderboard_data[i]['num_of_patients_per_camps']+'</p>'+
                                        '</div>'+
                                        '<div class="col-80">'+
                                            '<p class="leader_txt">High Risk</p>'+
                                        '</div>'+
                                        '<div class="col-20">'+
                                            '<p class="leader_no"  style="color:#A7C8BD" >'+res.leaderboard_data[i]['high_risk']+'</p>'+
                                        '</div>'+
                                    '</div>'+
                                '</div>'+
                                '<hr style="margin: 0%">';
                    }
                }

                $("#all").html(html);
                $("#single").html(html1);
                $("#two").html(html2);

                // $(".leader_board_tab").click(function(){
                //     $(".list_type").hide();
                //     var leader_show_id = '.'+$(this).data('id');
                //     $(leader_show_id).show();
                // })
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
});

myApp.onPageInit('camp_details', function(page) {
    myApp.allowPanelOpen = true;
    var camp_details_data = page.query.camp_details_data;
    $("#camp_details_image").empty();
    var html = '';
    $("#camp_details_name").text(camp_details_data.doctor_name);
    $("#camp_details_associat_name").text(camp_details_data.fam_name);
    $("#camp_details_location").text(camp_details_data.location);
    $("#camp_details_date").text(date_to_date_string1(camp_details_data.camp_date));
    $("#high_risk_patient_count_detail").text(camp_details_data.high_risk);
    $("#positive_patient_count_detail").text(camp_details_data.positive);
    $("#camp_details_actual_reg").text(camp_details_data.actual_registrations);
    $("#camp_details_planned_reg ").text(camp_details_data.total_patients);
    $("#male_patient_count_detail ").text(camp_details_data.male_percentage+"%");
     $.each(camp_details_data.camp_images, function(index, val) {
        $("#camp_details_images_txt").empty();
        if (index == 0 && !val.image) {
            $("#camp_details_images_txt").empty();
        } else {
            $("#camp_details_images_txt").text('Images');
        }
        // console.log("Images "+index+" : "+val.image);
        if (val.image) {
            html +=
                 '<div  class="image_container_details">'+
                    '<img style="width: 90%" src="'+image_url+val.image+'"" alt="">'+
                '</div>';
        }
        });
        $("#camp_details_image").append(html);

    console.log("camp_details_data"+camp_details_data);
});

myApp.onPageInit('privacy_policy', function(page) {
    myApp.allowPanelOpen = true;
});
function load_machine_listing_details(dayEvent, monthEvent, yearEvent, token){
    $.ajax({
        url: base_url + '/machine_listing',
        type: 'POST',
        crossDomain: true,
        data: {
            "user_data" : token,
            "day" : dayEvent,
            "month" : monthEvent,
            "year" : yearEvent,
        },
    })
    .done(function(res) {
        // console.log(j2s(res));
        if (res.status == 'SUCCESS') {
            selected_date =  yearEvent+"-"+monthEvent+"-"+dayEvent;
            mainView.router.load({
                url: 'machine_list.html',
                ignoreCache: false,
                query: {
                    machine_name: res.machine_name,
                    contact_number : res.contact_number,
                    prev_details : res.prev_details,
                    current_details :res.current_details,
                    group_name : token.group_name,
                    num_records : res.num_machine,
                    next_details : res.next_details,
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