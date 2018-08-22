jQuery(function ($) {  // use $ for jQuery
    "use strict";

    /* Calculator Email Field Display */
    $(document).on('click', '.checkflip', function () {
        if ($(this).is(':checked')) {
            $(this).closest('.charfor-form').find('.charfor-email').slideDown('fast');
        } else {
            $(this).closest('.charfor-form').find('.charfor-email').slideUp('fast');
        }
    });

    /* Process calculator results */
    $(document).on('click', '.submit-charfor', function () {
        var mprogresso;
        var currentForm = $(this).closest('.charfor-sc').attr('class').split(' ')[2]; // get the current form
        $('.submit-charfor').prop('disabled', true);

        /*  Progress bar */
        mprogresso = new Mprogress({
            //start: true,  // start it now
            parent: '.' + currentForm + ' .progresso',
            template: 3
        });
        mprogresso.start();

        var mailaddress = 'noone@nowhere.com';
        if ($(this).closest('.charfor-form').find('.send-email').is(':checked')) {
            var sendemail = 'true';
            mailaddress = $(this).closest('.charfor-form').find('.charfor-email-input').val();
        } else {
            var sendemail = 'false';
        }
        var termcycle = 'years';
        if ($(this).closest('.charfor-form').find('.term-months').is(':checked')) {
            termcycle = 'months';
        }
        var amount = $(this).closest('.charfor-form').find('.mort-amount').val();
        var interest = $(this).closest('.charfor-form').find('.interest').val();
        var downpay = $(this).closest('.charfor-form').find('.downpay').val();
        var term = $(this).closest('.charfor-form').find('.term').val();

        // Overrides
        var override = {};
        override.enableinsurance = $(this).closest('.charfor-form').data('enableinsurance');
        override.insuranceamountpercent = $(this).closest('.charfor-form').data('insuranceamountpercent');
        override.monthlyinsurance = $(this).closest('.charfor-form').data('monthlyinsurance');
        override.enablepmi = $(this).closest('.charfor-form').data('enablepmi');
        override.monthlypmi = $(this).closest('.charfor-form').data('monthlypmi');
        override.enabletaxes = $(this).closest('.charfor-form').data('enabletaxes');
        override.taxesperthou = $(this).closest('.charfor-form').data('taxesperthou');
        override.disclaimer = $(this).closest('.charfor-form').data('disclaimer');
        override.currencysymbol = $(this).closest('.charfor-form').data('currencysymbol');
        override.currencyside = $(this).closest('.charfor-form').data('currencyside');
        override.currencyformat = $(this).closest('.charfor-form').data('currencyformat');
        override.downpaytype = $(this).closest('.charfor-form').data('downpaytype');
        override.bccemail = $(this).closest('.charfor-form').data('bccemail');
        override.fromemail = $(this).closest('.charfor-form').data('fromemail');
        override.emailsubject = $(this).closest('.charfor-form').data('emailsubject');
        override.emailcontent = $(this).closest('.charfor-form').data('emailcontent');
        override.pdfcolor = $(this).closest('.charfor-form').data('pdfcolor');
        override.pdflogo = $(this).closest('.charfor-form').data('pdflogo');
        override.pdfheader = $(this).closest('.charfor-form').data('pdfheader');

        $.post(charfor_Ajax.ajaxurl, {
            action: 'ajax-charforfrontend',
            // vars
            process: 'true',
            nextNonce: charfor_Ajax.nextNonce,
            sendemail: sendemail,
            mailaddress: mailaddress,
            amount: amount,
            interest: interest,
            downpay: downpay,
            termcycle: termcycle,
            term: term,
            override: override
        }, function (response) {
            mprogresso.end();
            $('.submit-charfor').prop('disabled', false);
            if (response.error == '1') {      // Handle Errors
                if (response.error_field == 'amount') {
                    $('.' + currentForm).find('.mort-amount').addClass('error-field');
                    $('.' + currentForm).find('.mort-amount').closest('.char-form-group').find('.err-msg').text(response.message);
                } else if (response.error_field == 'interest') {
                    $('.' + currentForm).find('.interest').addClass('error-field');
                    $('.' + currentForm).find('.interest').closest('.char-form-group').find('.err-msg').text(response.message);
                } else if (response.error_field == 'down') {
                    $('.' + currentForm).find('.downpay').addClass('error-field');
                    $('.' + currentForm).find('.downpay').closest('.char-form-group').find('.err-msg').text(response.message);
                } else if (response.error_field == 'term') {
                    $('.' + currentForm).find('.term').addClass('error-field');
                    $('.' + currentForm).find('.term').closest('.char-form-group').find('.err-msg').text(response.message);
                } else if (response.error_field == 'email') {
                    $('.' + currentForm).find('.charfor-email-input').addClass('error-field');
                    $('.' + currentForm).find('.charfor-email-input').closest('.char-form-group').find('.err-msg')
						.text(response.message);
                }



            } else {
                activateModal(response.payment, response.headers, response.vals, response.details, currentForm);
            }
        });
        return false;
    });

    /* Remove error messages and styling on focus */
    $(document).on('focus', '.charfor-form input', function () {
        $(this).removeClass('error-field');
        $(this).closest('.char-form-group').find('.err-msg').text('');
    });

    /* Hide email field if open on reset along with clearing fields */
    $(document).on('click', '.charfor-reset', function () {
        $(this).closest('.charfor-form').find('.charfor-email').slideUp('fast');
        $(this).closest('.charfor-form').find('.term-years').prop('checked', true);
        $(this).closest('.charfor-form').find('.term-months').prop('checked', false);
        $(this).closest('.charfor-form').find('input').each(function () {
            $(this).removeClass('error-field');
            $(this).closest('.char-form-group').find('.err-msg').text('');
        });
    });

    /* Term selection Years & Months */
    $(document).ready(function () {
        $('.term-years').prop('checked', true);
        $('.term-months').prop('checked', false);
    });

    $(".term-group").each(function () {
        $(this).change(function () {
            $(this).closest('.charfor-form').find(".term-group").prop('checked', false);
            $(this).prop('checked', true);
        });
    });

    /* Don't respond to clicks on tooltips */
    $(document).on('click', '.charfor-tip', function () {
        return false;
    });

    /* Results Modal function */
    function activateModal(payment, headers, vals, details, currentForm) {
        // initialize modal element
        // Details
        var detailsTable = '<h3 class="charfor-header">' + headers.loan_text + '</h3>'
					+ '<table class="char-table detail-table" data-char-borders="true">'
                    + '<tr><td>' + details.original + ': <br /><strong>' + vals.price2 + '</strong></td>'
                    + '<td>' + details.down_payment + ': <br /><strong>' + vals.down + ' %</strong></td>'
                    + '<td>' + details.interest + ': <br /><strong>' + vals.interest + ' %</strong></td>'
                    + '<td>' + details.term + ': <br /><strong>' + vals.term + ' ' + vals.cycle_text + '</strong></td>'
                    + '</tr>'
                    + '<tr><td>' + details.loan_after_down + ': <br /><strong>' + vals.mortgage2
                    + '</strong></td>'
                    + '<td>' + details.down_payment_amount + ': <br /><strong>' + vals.moneydown2
                    + '</strong></td>'
                    + '<td>' + details.monthly_payment + ': <br /><strong>' + vals.monthly_payment2
                    + '</strong></td>'
                    + '<td>' + details.total_payments + ': <br /><strong>' + vals.total_payments
                    + '</strong></td>'
                    + '</tr></table>';


        // Taxes Insurance & PMI (TIP)
        var tip = '';
        if (vals.enable_insurance == 'yes'
			|| vals.enable_pmi == 'yes'
			|| vals.enable_taxes == 'yes'
		) {
            tip += '<p>' + vals.otherfactors + '</p>'
                + '<ul class="charfor-ul">';
            // check for pmi enabled
            if (vals.enable_pmi == 'yes') {
                tip += '<li><img src="' + vals.charfor_root + '/assets/img/info.png" /> ' + vals.pmi_text + '</li>';
            }
            // check for taxes enabled
            if (vals.enable_taxes == 'yes') {
                tip += '<li><img src="' + vals.charfor_root + '/assets/img/info.png" /> ' + vals.tax_text + '</li>';
            }
            // check for insurance enabled
            if (vals.enable_insurance == 'yes') {
                tip += '<li><img src="' + vals.charfor_root + '/assets/img/info.png" /> ' + vals.insurance_text + '</li>';
            }
            tip += '</ul>'
                 + '<p class="border-p">' + vals.total_monthlies + '</p>'
                 + '<p></p>';
        } else {
            tip += '<p></p>';
        }

        // Schedule
        var schedule = '<h3 class="charfor-header">' + headers.schedule_text + '</h3>'
					 + '<table class="char-table schedule-table" data-char-borders="true">'
					 + '<thead>'
		             + '<tr class="schedule-head"><th>' + headers.payment + '</th><th>' + headers.payment_amount
					 + '</th><th>' + headers.principal
			         + '</th><th>' + headers.interest + '</th><th>' + headers.total_interest + '</th><th>'
				     + headers.balance + '</th><th></tr></thead><tbody>';

        $.each(payment, function (k, v) {
            schedule += '<tr><td data-th="' + headers.payment + '">' + v.value
				     + '</td><td data-th="' + headers.payment_amount + '">' + vals.monthly_payment2
					 + '</td><td data-th="' + headers.principal + '">' + v.principal
			         + '</td><td data-th="' + headers.interest + '">' + v.interest
					 + '</td><td data-th="' + headers.total_interest + '">' + v.total_interest
					 + '</td><td data-th="' + headers.balance + '"><strong>' + v.newMortgage + '</strong></td></tr>';
        });
        schedule += '</tbody></table>';

        // Disclaimer
        var disclaimerDiv = '<div class="disclaimer">' + details.disclaimer + '</div>';

        var modalE1 = document.createElement('div');
        $(detailsTable).appendTo(modalE1);
        $(tip).appendTo(modalE1);
        $(schedule).appendTo(modalE1);
        $(disclaimerDiv).appendTo(modalE1);
        $(modalE1).css('padding', '20px').css('width', '75%').css('height', '75%').css('margin', '100px auto');
        $(modalE1).css('overflow', 'hidden').addClass('charfor-div').addClass('divfrom-' + currentForm);

        // show modal
        char.overlay('on', modalE1);
    }

    /* load scrollbar on modal div */
    $('.charfor-div').mCustomScrollbar({
        live: "on",
        theme: 'minimal-dark',
        callbacks: {
            onInit: function () {
                $('.charfor-div').css('overflow', 'auto'); // set overflow auto after init to avoid normal scroll from appearing
                var firstRow = $('.schedule-table tr').eq(1).clone();
                var lastRow = $('.schedule-table tr:last').clone();
                $('<div class="schedule-head-fixed"><table class="char-table schedule-table"></table></div>')
					.appendTo('.charfor-div').hide();
                $('.schedule-head').clone().appendTo('.schedule-head-fixed .schedule-table');
                $('.schedule-head-fixed .schedule-table').append(firstRow).append(lastRow);
            },
            whileScrolling: function () {
                var $window = $(window);
                var windowsize = $window.width();
                if (windowsize > 768 && $('.schedule-head').length) {
                    var schedulePos = $('.schedule-head').offset().top - $('.charfor-div').offset().top;
                    if (schedulePos < 0) {
                        $('.schedule-head-fixed').show();
                    } else {
                        $('.schedule-head-fixed').hide();
                    }
                } else {
                    $('.schedule-head-fixed').hide();
                }
            }
        }
    });

    /* Number & Char limiting for field inputs */
    $('.charfor-form .mort-amount').autoNumeric('init');
    $('.charfor-form .interest').autoNumeric('init');
    $('.charfor-form .downpay').autoNumeric('init');
    $('.charfor-form .term').autoNumeric('init');

    /* Random String Generation */
    function randomString() {
        var result = (Math.random() * 1e32).toString(36);
        return result;
    }

});