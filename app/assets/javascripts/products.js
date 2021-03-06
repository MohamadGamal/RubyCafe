// Place all the behaviors and hooks related to the matching controller here.
// All this logic will automatically be available in application.js.
jQuery(document).ready(function () {
    $('.message .close')
        .on('click', function () {
            $(this).closest('.message').transition('fade');
        });
    $('.menu a.item, .menu .link.item').on('click', function () {

        $(this)
            .addClass('active')
            .closest('.ui.menu')
            .find('.item')
            .not($(this))
            .removeClass('active');
    });
});
products_table = null;
jQuery(document).on("turbolinks:before-cache", function () {
    if (products_table !== null) {
        products_table.fnDestroy();
        products_table = null;
    }
});

jQuery(document).on("turbolinks:load", function () {
    if ($(".orders.new").length > 0){
        App.Channels.Products.subscribe()
    }
    if (!$(".products.index").length > 0) {
        return
    }
    products_table = $('#products-table').dataTable({
        "processing": true,
        "serverSide": true,
        "bDestroy": true,
        "ajax": $('#products-table').data('source'),
        "pagingType": "full_numbers",
        // optional, if you want full pagination controls.
        // Check dataTables documentation to learn more about
        // available options.
    });
    products_table.on('draw.dt', function (e) {
        $('.ui.checkbox').checkbox();
    });


});
function toggle_available(toggle) {
    var productId = toggle.dataset.id;
    var state = (!JSON.parse(toggle.dataset.state)) & 1;

    $.ajax({
        url: '/products/' + productId + '.json',
        method: 'put',
        data: {product: {available: state}},
        success: function () {
            toggle.dataset.state = state;
        },
        error: function () {
            console.log("error")
        }
    });

}
