var JsonValidator = function () {
    this.isValidDataElement = function (data, domNode, defaultValue) {
        var minNumber,
            maxNumber;

        if (!domNode.hasClass('sourceCode') &&
                domNode.is(":hidden")) {
            return false;
        }

        if (typeof data === "object") {
            if ($.isEmptyObject(data)) {
                return false;
            }
        }

        else if (data === undefined ||
                data === '') {
            labelElem = $(domNode).parent().parent(".inputElem").prev(".labelElem");
            if (labelElem.find(".requiredField").length > 0) {
                $(".requiredField").parent().parent('.labelElem').next(".inputElem").find(".inputElement").each(function () {
                    if ($(this).getValue() === "") {
                        $(this).addClass("requiredInputMissing");
                    }
                });
                Common.CustomMessaging.ShowErrorMessage("Required fields missing");
                throw "Required fields missing";
            }
            return false;
        }

        else if (Number.isNaN(data)) {
            $(domNode).addClass("requiredInputMissing");
            Common.CustomMessaging.ShowErrorMessage("This is not a number");
            throw "This is not a number";
        }

        else if (Number.isFinite(data)) {
            minNumber = Number.parseFloat($(domNode).attr("min"));
            maxNumber = Number.parseFloat($(domNode).attr("max"));
            if (Number.isFinite(minNumber) &&
                    data < minNumber) {

                $(domNode).addClass("requiredInputMissing");
                Common.CustomMessaging.ShowErrorMessage("Value less than allowed minimum : " + minNumber);
                throw "Value less than allowed minimum";
            }
            if (Number.isFinite(maxNumber) &&
                    maxNumber > maxNumber) {

                $(domNode).addClass("requiredInputMissing");
                Common.CustomMessaging.ShowErrorMessage("Value more than allowed maximum : " + maxNumber);
                throw "Value more than allowed minimum";
            }
        }

        return true;
    };
    return this;
}