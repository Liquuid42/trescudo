/**
 * Forms Module
 * Handles AJAX contact form validation and submission
 */

export const forms = {
    /**
     * Initialize contact form
     */
    initContactForm() {
        const form = ".ajax-contact";
        const invalidCls = "is-invalid";
        const $email = '[name="email"]';
        const $validation = '[name="name"],[name="email"],[name="subject"],[name="number"],[name="message"]';
        const formMessages = $(".form-messages");

        function sendContact() {
            const formData = $(form).serialize();
            let valid;
            valid = validateContact();
            if (valid) {
                jQuery.ajax({
                    url: $(form).attr("action"),
                    data: formData,
                    type: "POST",
                })
                .done(function (response) {
                    formMessages.removeClass("error");
                    formMessages.addClass("success");
                    formMessages.text(response);
                    // Clear the form
                    $(form + ' input:not([type="submit"]),' + form + " textarea").val("");
                })
                .fail(function (data) {
                    formMessages.removeClass("success");
                    formMessages.addClass("error");
                    if (data.responseText !== "") {
                        formMessages.html(data.responseText);
                    } else {
                        formMessages.html("Oops! An error occured and your message could not be sent.");
                    }
                });
            }
        }

        function validateContact() {
            let valid = true;
            let formInput;

            function unvalid($validation) {
                $validation = $validation.split(",");
                for (let i = 0; i < $validation.length; i++) {
                    formInput = form + " " + $validation[i];
                    if (!$(formInput).val()) {
                        $(formInput).addClass(invalidCls);
                        valid = false;
                    } else {
                        $(formInput).removeClass(invalidCls);
                        valid = true;
                    }
                }
            }
            unvalid($validation);

            if (!$($email).val() || !$($email).val().match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
                $($email).addClass(invalidCls);
                valid = false;
            } else {
                $($email).removeClass(invalidCls);
                valid = true;
            }
            return valid;
        }

        $(form).on("submit", function (element) {
            element.preventDefault();
            sendContact();
        });
    },

    /**
     * Check if page has contact form
     * @returns {boolean}
     */
    hasContactForm() {
        return $(".ajax-contact").length > 0;
    }
};
