var load_ui = [];
var threed_src = '';
var base_url = 'http://pearlroyale.com/pearlroyale_admin/index.php/api_new/';
var image_path = 'http://pearlroyale.com/pearlroyale_admin/assets/uploads/';

var numbers_validator = /^[0-9]+$/;  

var category_id = 0;
var auction_id = 0;
var item_id = 0;
var filter_state = 0;
var startIntervalFunctions = '';

var myApp = new Framework7({
    pushState: false,
    swipeBackPage: false,
    preloadPreviousPage: false,
    uniqueHistory: true,
    uniqueHistoryIgnoreGetParameters: true,
    modalTitle: 'Pearlroyale',
    imagesLazyLoadPlaceholder: 'img/lazyload.jpg',
    imagesLazyLoadThreshold: 50,

});

var $$ = Dom7;

var token_data = Lockr.get('userdata');

$$(document).on('pageInit', function(e) {
    var page = e.detail.page;
    $$('.open-left-panel').on('click', function (e) {
        myApp.openPanel('left');
    });

    $$('.panel-close').on('click', function (e) {
        myApp.closePanel();
    });
})

var mainView = myApp.addView('.view-main', {
    // dynamicNavbar: true
});

$$(document).on('deviceready', function() {
    if(token_data == undefined){ 
        goto_page('index.html');
    } else {
        goto_page('categories.html');
    }
    $(".pearlroyale_preloader").hide();
    var startIntervalFunctions = setInterval(function(){ check_bid_status(); check_bid_list(); }, 1500);
    mainView.hideNavbar();
});

myApp.onPageInit('index', function(page) {
    myApp.closePanel();
    item_id = 0;
});

myApp.onPageInit('categories', function (page) {
    mainView.showNavbar();
    // console.log(token_data);
    // console.log(token_data.id);
    $(".navbar_title").html('');
    myApp.closePanel();
    myApp.showIndicator();
    filter_state = 0;
    item_id = 0;

    $.ajax({
        url: base_url+'get_categories',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
        },
    }).done(function(res) {
        if (res.status == 'Failed') {
            alert(res.msg);
            return false;
        } else {
            $("#bidded_items_html").empty();
            $("#category_list").empty();
            var category_html = '';

            $.each(res.categories, function(index, value){
                category_html += '<div class="col-33 category_blocks" onclick="goto_auctions('+value.id+');">'+
                        '<img src="'+image_path+value.image+'" class="category_image">'+
                        '<p class="category_name">'+value.category_name+'</p>'+
                        '</div>';
            })

            if (res.bidded_products) {
                var bidded_items_html = '<div class="col-100">'+
                                        '<div class="content-block-title">Bidded Items</div>'+
                                        '</div>';

                $.each(res.bidded_products, function(index, value) {
                    if (value.bid == 2) {
                        bidded_items_html += '<div class="col-100 bgred change_clr_cls_'+value.id+'">';
                    } else {
                        bidded_items_html += '<div class="col-100 bggreen change_clr_cls_'+value.id+'">';
                    }
                    bidded_items_html += '<div class="card">'+
                                         '<div class="card-header">'+value.item_name+'</div>'+
                                         '<div class="card-header">Current Bidded Price: <span class="update_bid_amounts_dynamic_'+value.id+'">'+value.bid_amount+'</span> '+value.currency_type+'</div>'+
                                         '</div>'+
                                         '</div>';
                })

                $("#bidded_items_html").html(bidded_items_html);
            }
            $("#category_list").html(category_html);
            myApp.hideIndicator();
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('auctions', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Auctions');
    myApp.closePanel();
    myApp.showIndicator();
    filter_state = 0;
    item_id = 0;

    $.ajax({
        url: base_url+'get_auctions',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
        },
    }).done(function(res) {
        $("#auctions_listing").empty();
        var auctions_listing = '';
        if (res.status == 'Failed') {
            auctions_listing = '<center>'+res.msg+'</center>';
        } else {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth()+1;
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var ii = today.getMinutes()+1;
            var ss = today.getSeconds();

            if (dd<10) {
                dd='0'+dd
            }

            if (mm<10) {
                mm='0'+mm;
            } 

            var curr_date = yyyy+'-'+('0' + mm).slice(-2)+'-'+('0' + dd).slice(-2)+' '+('0' + hh).slice(-2)+':'+('0' + ii).slice(-2)+':'+('0' + ss).slice(-2);

            $.each(res.auctions_data, function(index, value) {
                var start = value.auction_start_date+' '+value.auction_start_time;
                var end = value.auction_end_date+' '+value.auction_end_time;
                var archive = value.auction_archive_date+' '+value.auction_archive_time;

                // console.log(start);
                // console.log(end);
                // console.log(archive);
                // console.log(curr_date);

                auctions_listing += '<div class="col-100" onclick="goto_itmes_page('+value.auction+');">';

                if (curr_date > start && curr_date < end) {
                    auctions_listing += '<div class="card bggreen">';
                }

                if (curr_date < start) {
                    auctions_listing += '<div class="card bgblue">';
                }

                if (curr_date > end) {
                    auctions_listing += '<div class="card bgred">';
                }

                auctions_listing += '<div class="card-header">'+value.auction_name+'</div>'+
                                    '<div class="card-content">'+
                                    '<div class="card-content-inner">Location: '+value.address+', '+value.city+', '+value.country+'</div>'+
                                    '</div>'+
                                    '</div>'+
                                    '</div>';
            })
        }
        $("#auctions_listing").html(auctions_listing);
        myApp.hideIndicator();
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('items', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Items');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();
    item_id = 0;

    $(".open-popup").click(function() {
        myApp.popup('.popup-about');
    })

    $(".submit").click(function() {
        $(".close-popup").click();
    })

    $("#items_listing").empty();

    $.ajax({
        url: base_url+'get_items',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            filter_state: filter_state,
        },
    }).done(function(res) {
        if (res.status == 'Success') {
            var html = '';
            $.each(res.productdata, function(index, value) {
                html += '<div class="card" onclick="goto_items_inner_page('+value.id+');">'+
                        '<div class="card-header">'+
                        '<div class="col-50">'+
                        '<img src="'+image_path+value.image+'" class="items_img lazy">'+
                        '</div>'+
                        '<div class="col-50">'+
                        '<p>'+value.item_name+'</p>'+
                        '<p>'+value.item_id+'</p>'+
                        '<p style="font-size: 14px;">Num of Image: '+value.num_images+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="card-header pad0">'+
                        '<div class="col-50 items_amount_container bggreen">'+
                        '<p>Floor Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.floor_amount+'</p>'+
                        '</div>';
                if (value.bid == 2) {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bgred">';
                } else {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bggreen">';
                }
                html += '<p>Bidded Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> <span class="update_bid_amounts_dynamic_'+value.id+'">'+value.bid_amount+'</span></p>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
            })

            $("#items_listing").html(html);
            myApp.hideIndicator();
        } else {
            alert("Some error occured while fetching the data, Please try again later.");
            myApp.hideIndicator();
            return false;
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })

    $("#item_filter").on('change', function(){
        filter_state = $(this).val();
        console.log(filter_state);

        myApp.showIndicator();
        $.ajax({
            url: base_url+'get_items',
            type: 'POST',
            crossDomain: true,
            data: {
                user_id: token_data.id,
                category_id: category_id,
                auction_id: auction_id,
                filter_state: filter_state,
            },
        }).done(function(res) {
            if (res.status == 'Success') {
                var html = '';
                $.each(res.productdata, function(index, value) {
                    html += '<div class="card" onclick="goto_items_inner_page('+value.id+');">'+
                            '<div class="card-header">'+
                            '<div class="col-50">'+
                            '<img src="'+image_path+value.image+'" class="items_img lazy">'+
                            '</div>'+
                            '<div class="col-50">'+
                            '<p>'+value.item_name+'</p>'+
                            '<p>'+value.item_id+'</p>'+
                            '<p style="font-size: 14px;">Num of Image: '+value.num_images+'</p>'+
                            '</div>'+
                            '</div>'+
                            '<div class="card-header pad0">'+
                            '<div class="col-50 items_amount_container bggreen">'+
                            '<p>Floor Amount</p>'+
                            '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.floor_amount+'</p>'+
                            '</div>';
                    if (value.bid == 2) {
                        html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bgred">';
                    } else {
                        html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bggreen">';
                    }
                    html += '<p>Bidded Amount</p>'+
                            '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> <span class="update_bid_amounts_dynamic_'+value.id+'">'+value.bid_amount+'</span></p>'+
                            '</div>'+
                            '</div>'+
                            '</div>';
                })

                $("#items_listing").html(html);
                myApp.hideIndicator();
            } else {
                alert("Some error occured while fetching the data, Please try again later.");
                myApp.hideIndicator();
                return false;
            }
        }).error(function(res) {
            alert("Some Error Occured, Please check your network connectivity.");
            myApp.hideIndicator();
            return false;
        })

    })
})

myApp.onPageInit('items_inner', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Items Details');
    myApp.closePanel();
    myApp.showIndicator();

    $.ajax({
        url: base_url+'get_items_inner',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            item_id: item_id,
        }
    }).done(function(res) {
        $("#items_inner_container").empty();
        var html = '<div class="card">'+
                   '<div class="card-header">'+
                   '<div class="col-50">'+
                   '<img src="'+image_path+res.items_data.image+'" class="items_img">'+
                   '</div>'+
                   '<div class="col-50">'+
                   '<p>'+res.items_data.item_name+'</p>'+
                   '<p>'+res.items_data.item_id+'</p>'+
                   '<p style="font-size: 14px;">Num of Image: '+res.num_items_images+'</p>'+
                   '</div>'+
                   '</div>'+
                   '<div class="card-header pad0">'+
                   '<div class="col-50 items_amount_container bggreen">'+
                   '<p>Floor Amount</p>'+
                   '<p><i class="'+res.items_data.currency_type+'" aria-hidden="true"></i> '+res.items_data.floor_amount+'</p>'+
                   '</div>';

        if (res.items_data.bid == 2) {
            $(".bid_button_auto_change").removeClass('bggreen');
            $(".bid_button_auto_change").addClass('bgred');
            html += '<div class="col-50 items_amount_container items_amount_container_change_color bgred">';
        } else {
            $(".bid_button_auto_change").removeClass('bgred');
            $(".bid_button_auto_change").addClass('bggreen');
            html += '<div class="col-50 items_amount_container items_amount_container_change_color bggreen">';
        }

        html += '<p>Bidded Amount</p>'+
               '<p><i class="'+res.items_data.currency_type+'" aria-hidden="true"></i> <span class="update_bid_amounts_dynamic_'+item_id+'">'+res.items_data.bid_amount+'</span></p>'+
               '</div>'+
               '</div>'+
               '</div>';

        var update_timer = res.items_data.auction_end_date.replace('-', '/')+' '+res.items_data.auction_end_time;

        $('#clock').countdown(update_timer, function(event) {
            $(this).html(event.strftime('%D:%H:%M:%S'));
        });

        if ($('#clock').html() == '00:00:00:00' || res.items_data.bid == 2) {
            $(".bid_button_auto_change").removeClass('bggreen');
            $(".bid_button_auto_change").addClass('bgred');
        }

        // console.log($('#clock').html());
        // console.log(res.items_data.bid);

        $(".itmes_slider").empty();
        $("#item_filters_dynamic").empty();
        var images_data = '';
        var filter_html = '';
        $.each(res.items_images, function(index, value) {
            images_data += '<div>'+
                            '<a href="'+image_path+value.url+'" data-fancybox="images" data-caption="'+res.items_data.item_name+'">'+
                            '<img src="'+image_path+value.url+'" alt="" />'+
                            '</a>'+
                           '</div>';
        })
        $(".itmes_slider").html(images_data);
        $.each(res.filters_data, function(index, value) {
            filter_html += '<li class="item-content">'+
                          '<div class="item-inner">'+
                          '<div class="item-title"><b>'+value.filter_name+':</b> '+value.filter_value+'</div>'+
                          '</div>'+
                          '</li>';
        })
        $("#item_filters_dynamic").html(filter_html);

        $('.itmes_slider').slick({
            dot: true,
            nextArrow: '<i class="fa fa-arrow-right slick-arrow-right"></i>',
            prevArrow: '<i class="fa fa-arrow-left slick-arrow-left"></i>',
        });

        $("[data-fancybox]").fancybox();

       $("#items_inner_container").html(html);
       myApp.hideIndicator();
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })

})

myApp.onPageInit('bid_items', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Bid Item');
    myApp.closePanel();
    myApp.showIndicator();

    $.ajax({
        url: base_url+'get_items_inner',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            item_id: item_id,
        }
    }).done(function(res) {
        $("#biditems_inner_container").empty();
        var html = '<div class="card">'+
                   '<div class="card-header">'+
                   '<div class="col-50">'+
                   '<img src="'+image_path+res.items_data.image+'" class="items_img">'+
                   '</div>'+
                   '<div class="col-50">'+
                   '<p>'+res.items_data.item_name+'</p>'+
                   '<p>'+res.items_data.item_id+'</p>'+
                   '<p style="font-size: 14px;">Num of Image: '+res.num_items_images+'</p>'+
                   '</div>'+
                   '</div>'+
                   '<div class="card-header pad0">'+
                   '<div class="col-50 items_amount_container bggreen">'+
                   '<p>Floor Amount</p>'+
                   '<p><i class="'+res.items_data.currency_type+'" aria-hidden="true"></i> '+res.items_data.floor_amount+'</p>'+
                   '</div>';

        if (res.items_data.bid == 2) {
            $(".bid_button_auto_change").removeClass('bggreen');
            $(".bid_button_auto_change").addClass('bgred disabled');
            html += '<div class="col-50 items_amount_container items_amount_container_change_color bgred">';
        } else {
            $(".bid_button_auto_change").removeClass('bgred disabled');
            $(".bid_button_auto_change").addClass('bggreen');
            html += '<div class="col-50 items_amount_container items_amount_container_change_color bggreen">';
        }

        html += '<p>Bidded Amount</p>'+
               '<p><i class="'+res.items_data.currency_type+'" aria-hidden="true"></i> <span class="update_bid_amounts_dynamic_'+item_id+'">'+res.items_data.bid_amount+'</span></p>'+
               '</div>'+
               '</div>'+
               '</div>';

       $("#biditems_inner_container").html(html);

       $("#item_bid_amount").attr("placeholder", Number(res.items_data.bid_amount)+1);

       myApp.hideIndicator();
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
    // myApp.showIndicator();
    // myApp.hideIndicator();

    $(".submit_your_bid").click(function(e){
        e.preventDefault();
        if (item_id == 0) {
            alert("Not able to Bid on selected Item, Please try after some time.");
            return false;
        } else {
            if ($("#item_bid_amount").val()) {
                if ($("#item_bid_amount").val().match(numbers_validator)) {
                    $.ajax({
                        url: base_url+'bid_execute',
                        type: 'POST',
                        crossDomain: true,
                        data: {
                            item_id: item_id,
                            user_id: token_data.id,
                            price: $("#item_bid_amount").val(),
                        }
                    }).done(function(res) {
                        // console.log(res);
                        if (res.status == 'Success') {
                            $(".bid_button_auto_change").removeClass("bggreen");
                            $(".bid_button_auto_change").addClass("bgred");
                        }
                        alert(res.msg);
                    }).error(function(res) {
                        alert("Some Error Occured, Please check your network connectivity.");
                        return false;
                    })
                } else {
                    alert("Please enter valid Bid Amount");
                    return false;
                }
            } else {
                alert("Please enter the Bid Amount");
                return false;
            }
        }
    })
})

myApp.onPageInit('register', function (page) {
    $(".navbar_title").html('Register');
    myApp.closePanel();
    myApp.showIndicator();
    item_id = 0;
})

myApp.onPageInit('about', function (page) {
    $(".navbar_title").html('About');
    myApp.closePanel();
    myApp.showIndicator();
    myApp.hideIndicator();
    $.ajax({
        url: base_url+'get_about',
        type: 'POST',
        crossDomain: true,
    }).done(function(res) {
        if (res.status == 'Success') {
            $("#about_us_dynamic_content").empty();
            var html = '';
            $.each(res.data, function(index, value) {
                html += value.content;
            })
            $("#about_us_dynamic_content").html(html);
        } else {
            alert("Some Error Occured, Please check your network connectivity.");
            myApp.hideIndicator();
            return false;
        }

    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})


myApp.onPageInit('favorite_items', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Favorite Items');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();

    $(".open-popup").click(function() {
        myApp.popup('.popup-about');
    })

    $(".submit").click(function() {
        $(".close-popup").click();
    })

    $("#items_listing").empty();

    $.ajax({
        url: base_url+'get_favorite_items',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            filter_state: filter_state,
        },
    }).done(function(res) {
        if (res.status == 'Success') {
            var html = '';
            $.each(res.productdata, function(index, value) {
                html += '<div class="card" onclick="goto_items_inner_page('+value.id+');">'+
                        '<div class="card-header">'+
                        '<div class="col-50">'+
                        '<img src="'+image_path+value.image+'" class="items_img lazy">'+
                        '</div>'+
                        '<div class="col-50">'+
                        '<p>'+value.item_name+'</p>'+
                        '<p>'+value.item_id+'</p>'+
                        '<p style="font-size: 14px;">Num of Image: '+value.num_images+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="card-header pad0">'+
                        '<div class="col-50 items_amount_container bggreen">'+
                        '<p>Floor Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.floor_amount+'</p>'+
                        '</div>';
                if (value.bid == 2) {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bgred">';
                } else {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bggreen">';
                }
                html += '<p>Bidded Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.bid_amount+'</p>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
            })

            $("#items_listing").html(html);
            myApp.hideIndicator();
        } else {
            alert("Some error occured while fetching the data, Please try again later.");
            myApp.hideIndicator();
            return false;
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('bidded_items', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Bidded Items');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();
    filter_state = 0;

    $(".open-popup").click(function() {
        myApp.popup('.popup-about');
    })

    $(".submit").click(function() {
        $(".close-popup").click();
    })

    $("#items_listing").empty();

    $.ajax({
        url: base_url+'get_bidded_items',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            filter_state: filter_state,
        },
    }).done(function(res) {
        if (res.status == 'Success') {
            var html = '';
            $.each(res.productdata, function(index, value) {
                html += '<div class="card" onclick="goto_items_inner_page('+value.id+');">'+
                        '<div class="card-header">'+
                        '<div class="col-50">'+
                        '<img src="'+image_path+value.image+'" class="items_img lazy">'+
                        '</div>'+
                        '<div class="col-50">'+
                        '<p>'+value.item_name+'</p>'+
                        '<p>'+value.item_id+'</p>'+
                        '<p style="font-size: 14px;">Num of Image: '+value.num_images+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="card-header pad0">'+
                        '<div class="col-50 items_amount_container bggreen">'+
                        '<p>Floor Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.floor_amount+'</p>'+
                        '</div>';
                if (value.bid == 2) {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bgred">';
                } else {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bggreen">';
                }
                html += '<p>Bidded Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.bid_amount+'</p>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
            })

            $("#items_listing").html(html);
            myApp.hideIndicator();
        } else {
            alert("Some error occured while fetching the data, Please try again later.");
            myApp.hideIndicator();
            return false;
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('viewed_items', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Viewed Items');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();
    filter_state = 0;

    $(".open-popup").click(function() {
        myApp.popup('.popup-about');
    })

    $(".submit").click(function() {
        $(".close-popup").click();
    })

    $("#items_listing").empty();

    $.ajax({
        url: base_url+'get_viewed_items',
        type: 'POST',
        crossDomain: true,
        data: {
            user_id: token_data.id,
            category_id: category_id,
            auction_id: auction_id,
            filter_state: filter_state,
        },
    }).done(function(res) {
        if (res.status == 'Success') {
            var html = '';
            $.each(res.productdata, function(index, value) {
                html += '<div class="card" onclick="goto_items_inner_page('+value.id+');">'+
                        '<div class="card-header">'+
                        '<div class="col-50">'+
                        '<img src="'+image_path+value.image+'" class="items_img lazy">'+
                        '</div>'+
                        '<div class="col-50">'+
                        '<p>'+value.item_name+'</p>'+
                        '<p>'+value.item_id+'</p>'+
                        '<p style="font-size: 14px;">Num of Image: '+value.num_images+'</p>'+
                        '</div>'+
                        '</div>'+
                        '<div class="card-header pad0">'+
                        '<div class="col-50 items_amount_container bggreen">'+
                        '<p>Floor Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.floor_amount+'</p>'+
                        '</div>';
                if (value.bid == 2) {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bgred">';
                } else {
                    html += '<div class="col-50 items_amount_container change_clr_cls_'+value.id+' bggreen">';
                }
                html += '<p>Bidded Amount</p>'+
                        '<p><i class="'+value.currency_type+'" aria-hidden="true"></i> '+value.bid_amount+'</p>'+
                        '</div>'+
                        '</div>'+
                        '</div>';
            })

            $("#items_listing").html(html);
            myApp.hideIndicator();
        } else {
            alert("Some error occured while fetching the data, Please try again later.");
            myApp.hideIndicator();
            return false;
        }
    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('profile', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Profile');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();
    item_id = 0;

    $.ajax({
        url: base_url+'profile_details',
        type: 'POST',
        crossDomain: true,
        data: {user_id: token_data.id,},
    }).done(function(res) {
        console.log(res);
        $("#disp_name").val(res.name);
        $("#disp_username").val(res.username);
        $("#disp_email").val(res.email_id);
        $("#disp_contact").val(res.contact);
        $("#disp_city").val(res.city);
        $("#disp_country").val(res.country);

        $("#profile_amount_listing").empty();

        if (res.amount_flag == 1) {
            var html = '';
            $.each(res.amount, function(index, value) {
                html+= '<li>'+
                        '<div class="item-content">'+
                        '<div class="item-inner">'+
                        '<div class="item-input">'+
                        '<label style="font-size: smaller;">Amount in Account ('+index+')</label>'+
                        '<input type="text" id="disp_amount" placeholder="Amount in '+index+'" value="'+value+'" disabled>'+
                        '</div>'+
                        '</div>'+
                        '</div>'+
                        '</li>';
            })

            $("#profile_amount_listing").html(html);
        }
        myApp.hideIndicator();

    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })
})

myApp.onPageInit('notification', function (page) {
    mainView.showNavbar();
    $(".navbar_title").html('Notifications');
    mainView.showNavbar();
    myApp.closePanel();
    myApp.showIndicator();
    item_id = 0;

    $.ajax({
        url: base_url+'notifications',
        type: 'POST',
        crossDomain: true,
        data: {user_id: token_data.id,},
    }).done(function(res) {
        console.log(res);
        $("#notification_container").empty();

        var html =  '<div class="card">'+
                    '<div class="card-header">Notifications</div>';
        $.each(res.data, function(index, value) {
            html += '<div class="card-content card-content-padding" style="padding: 4%">'+value.text+'</div>';
        })
            html += '</div>';

        $("#notification_container").html(html);

    }).error(function(res) {
        alert("Some Error Occured, Please check your network connectivity.");
        myApp.hideIndicator();
        return false;
    })

    myApp.hideIndicator();
})

myApp.onPageInit('mall_facts', function (page) {

})
