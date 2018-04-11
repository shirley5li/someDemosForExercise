$(document).ready(function() {
    init();

    function init() {
        var firstHash = window.location.hash.substring(1) || 'Application';
        hashChange(firstHash);

        $('.pro_item').click(function(event) {
            var hash = this.dataset.hash;
            window.location.hash = hash;
            hashChange(hash);
        });

        // hash改变时触发
        window.onhashchange = function() {
            window.location.reload();
        };
    }

    function hashChange(hash) {
        $('.pro_item').removeClass('pro_active');
        $('.pro_item[data-hash = ' + hash + ']').addClass('pro_active');
        $('.product_txt').css('display', 'none');
        $('.product_txt[data-hash = ' + hash + ']').css('display', 'block');
    }
});