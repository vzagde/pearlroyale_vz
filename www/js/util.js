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
        console.log(res);
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

function filter_data() {
    filter_state = 1;
    console.log('Filtered Data');
}