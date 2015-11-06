/*
 * Hello Brandley, tonight I've tried to figure out how to do proper
 * JSON POSTs using "Content-type: application/json" and serialized JSON
 * data in the content portion (body) of my HTTP requests. This is
 * specified in the Twitter API for status updates and Identica JSON
 * webservices (found via Mark Pilgrim).
 * After some tests, I had to recognize that jQuery does not support JSON
 * encoding in the core distribution and aside of $.getJSON(), there
 * is no $.postJSON().
 * Below is an proposed update. As it relies on your json plugin, I'd ask
 * you to add it to your code base so that other jQuery users can benefit
 * of it.
 */

$.postJSON = function(url, data, callback, fail) {
    return jQuery.ajax({
        'type': 'POST',
        'url': url,
        'contentType': 'application/json',
        'data': $.toJSON(data),
        'dataType': 'json',
        success: callback,
        error: fail
    });
};

/**
 * This tiny script just helps us demonstrate
 * what the various example callbacks are doing
 * http://bootboxjs.com/
 */
var Tooltip = (function() {
    "use strict";

    var elem,
        hideHandler,
        that = {};

    that.init = function(options) {
        elem = $(options.selector);
    };

    that.show = function(text) {
        clearTimeout(hideHandler);

        elem.find("span").html(text);
        elem.delay(200).fadeIn().delay(4000).fadeOut();
    };

    return that;
}());

$(document).ready(function() {
    
    Tooltip.init({
        "selector": ".bb-alert"
    });
    
    function regExpTest(el) {
        var myReg = /(^100([.]0{1,2})?)$|(^\d{1,2}([.]\d{1,2})?)$/;
        var x = el.currentTarget.value;
        if (myReg.test(x)) {
            el.currentTarget.parentElement.style.outlineColor = "";
            el.currentTarget.parentElement.style.border = "";
            el.currentTarget.parentElement.setAttribute('data-send', true);
        } else {
            el.currentTarget.parentElement.style.outlineColor = "#ff0000";
            el.currentTarget.parentElement.style.border = "1px solid rgba(255, 0, 0, 0.5)";
            el.currentTarget.parentElement.setAttribute('data-send', false);
        }
    }
    
    
    function failPrompt() {
        $.getJSON('/javascripts/random_msgs.json').done(function(data) {
            var obj_key = Object.keys(data.fail);
            var entry = obj_key[Math.floor(Math.random()*obj_key.length)];
            bootbox.alert({
                message: data.fail[entry],
                title: "Oops!",
                locale: "pt",
                size: "small",
                buttons: {
                    ok: {
                        label: "Então tá",
                        className: "btn-danger"
                    }
                }
                
            });
        });
    }
    
    function sucessPrompt() {
        $.getJSON('/javascripts/random_msgs.json').done(function(data) {
            var obj_key = Object.keys(data.success);
            var entry = obj_key[Math.floor(Math.random()*obj_key.length)];
            bootbox.alert({
                message: data.success[entry],
                title: "Yay!",
                locale: "pt",
                size: "small",
                buttons: {
                    ok: {
                        label: "Farewell",
                        className: "btn-success"
                    }
                }
                
            });
        });
    }
    
    $('.objectivo').on('change', function(e) {
        regExpTest(e);
    });
    $('.objectivo').on('blur', function(e) {
        regExpTest(e);
    });
    $('#sender').on('keyup', function(el) {
       $(this).attr('value', $(this).val());
    });
    
    $('.send-json').on('click', function() {
        var inputs = $('.objectivo').toArray();
        var error_free = true;
        for (var inputIndex in inputs){
            var el = $(inputs[inputIndex]);
            var inputForTest = el.attr('data-send');
            if(inputForTest === "true") {
                error_free = true;
            } else {
                error_free = false;
                return;
            }
        }
        
        var user = {};
        
        bootbox.prompt("Qual o seu primeiro e último nome?", function(result) {
            if(result === null) {
                Tooltip.show("Never forget KPI, never.");
            } else {
                var name = $('.bootbox-input-text').val();
                user = {"user": name}
                bootbox.confirm({
                    message: "Tem certeza " + user.user + " que deseja enviar?",
                    callback: function(result) {
                        if(result === false ) {
                            Tooltip.show("Never forget KPI, never.");
                        } else {
                            var table = $('#kpi').tableToJSON();
                            table.push(user);
                            $.postJSON('/kpi.json', table, sucessPrompt, failPrompt);
                        }
                    }
                })
            }
        });
    });
    
    $(".gw_component__slider").noUiSlider({
        start: 0,
        connect: "lower",
        step: 1,
        range: {
            'min': [0],
            'max': [100]
        },
        format: wNumb({
            decimals: 0
        })
    });
    
    // Write the CSS 'left' value to a span.
    function leftValue ( value, handle, slider ) {
        $(this).text( handle.parent()[0].style.left );
    }

    $(".gw_component__slider").each(function() {
        var self = $(this);
        self.Link('lower').to(function(value) {
            self.parent().parent().next().children().text(value).leftValue;
        });
    });
    
    
});