var base_url = 'http://pearlroyale.com/pearlroyale_admin/index.php/api_new/';
var mall_id = 0;
var event_id = 0;
var store_category_id = 0;
var start_date_test = '';
var end_date_test = '';

function j2s(json) {
    return JSON.stringify(json);
}

function goto_page(page) {
    mainView.router.load({
        url: page,
        ignoreCache: false,
    });
}

function logout() {
    category_id = 0;
    auction_id = 0;
    item_id = 0;
    filter_state = 0;

    mainView.hideNavbar();
    $(".navbar_title").html('');
    myApp.closePanel();

    Lockr.flush();
    clearInterval(startIntervalFunctions);
    token_data = Lockr.get('userdata');

    if(token_data == undefined) { 
        goto_page('index.html');
    } else {
        goto_page('categories.html');
    }
}

function signin() {
    if (!$("#email_id").val()) {
        alert("Please enter email id");
        return false;
    } else if (!$("#email_id").val()) {
        alert("Please enter valid email id");
        return false;
    } else if (!$("#password").val()) {
        alert("Please enter password id");
        return false;
    }

    $.ajax({
        url: base_url+'signin',
        type: 'POST',
        crossDomain: true,
        data: {
            email: $("#email_id").val(),
            password: $("#password").val(),
        },
    }).done(function(res) {
        // console.log(res);
        if (res.status == 'Failed') {
            alert(res.msg);
            return false;
        } else {
            Lockr.set('userdata', res.data);
            token_data = res.data;
            goto_page('categories.html');
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        return false;
    })
}

function goto_auctions(id) {
    category_id = id;
    goto_page('auctions.html');
}

function goto_itmes_page(id) {
    auction_id = id;
    goto_page('items.html');
}

function goto_items_inner_page(id) {
    item_id = id;
    goto_page('items_inner.html');
}

// function make_bid(e) {
    // e.preventDefault();
    // if (item_id == 0) {
    //     alert("Not able to Bid on selected Item, Please try after some time.");
    //     return false;
    // } else {
    //     $.ajax({
    //         url: base_url+'bid_execute',
    //         type: 'POST',
    //         crossDomain: true,
    //         data: {
    //             item_id: item_id,
    //             user_id: token_data.id,
    //             price: $(".item_bid_amount").val(),
    //         }
    //     }).done(function(res) {
    //         if (res.status == 'Success') {
    //             $(".bid_button_auto_change").removeClass("bggreen");
    //             $(".bid_button_auto_change").addClass("bgred");
    //         }
    //         alert(res.msg);
    //     }).error(function(res) {
    //         alert("Some Error Occured, Please check your network connectivity.");
    //         return false;
    //     })
    // }
// }

function check_bid_status() {
    if(token_data == undefined) {
    } else {
        if (item_id == 0) {
            // No need to run the script
            return false;
        } else {
            $.ajax({
                url: base_url+'get_bid_status',
                type: 'POST',
                crossDomain: true,
                data: {
                    item_id: item_id,
                    user_id: token_data.id,
                }
            }).done(function(res){
                // console.log(res);
                if (res.flag == 2) {
                    $(".submit_your_bid, .bid_button_auto_change, .items_amount_container_change_color").removeClass('bggreen');
                    $(".items_amount_container_change_color").addClass('bgred');
                    $(".submit_your_bid").addClass('bgred disabled');
                    $(".bid_button_auto_change").addClass('bgred');
                } else {
                    $(".submit_your_bid").removeClass('bgred disabled');
                    $(".items_amount_container_change_color, .bid_button_auto_change").removeClass('bgred');
                    $(".items_amount_container_change_color").addClass('bggreen');
                }
            }).error(function(res) {
                // alert("Some Error Occured, Please check your network connectivity.");
                myApp.hideIndicator();
                return false;
            })
        }
    }
}

function check_bid_list() {
    if(token_data == undefined) {
    } else {
        $.ajax({
            url: base_url+'get_bid_list_status',
            type: 'POST',
            crossDomain: true,
            data: {
                user_id: token_data.id,
            }
        }).done(function(res){
            // console.log(res);
            if (res.status == 'Success') {
                $.each(res.flag_data, function(index, value) {
                    $(".update_bid_amounts_dynamic_"+value.id).text(value.bid_amount);
                    if (value.bid == 2) {
                        $(".change_clr_cls_"+value.id).removeClass("bggreen");
                        $(".change_clr_cls_"+value.id).addClass("bgred");
                    } else {
                        $(".change_clr_cls_"+value.id).removeClass("bgred");
                        $(".change_clr_cls_"+value.id).addClass("bggreen");
                    }
                })
            } else {
                // No Need to anything you ASSHOLE
            }
        }).error(function(res) {
            // alert("Some Error Occured, Please check your network connectivity.");
            myApp.hideIndicator();
            return false;
        })
    }
}


