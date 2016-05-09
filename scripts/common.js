/*
(function ServiceWorkerRegistration() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
                 .register('/cloudGatewayServiceWorker.js',
                 {scope: '/'})
                 .then(function (success, failure) {
                     console.log('Service Worker Registered');
                 });
    }
})();
*/

(function AjaxLoaderAnimation() {
    AjaxLoaderAnimation.templateModel = '<div class="modal fade" data-backdrop="static"    \
             data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true">    \
            <div class="modal-dialog">    \
                <div class="modal-content loadingModal">    \
                    <div class="modal-body">    \
                        <h4><span class="loadingText"></span>...</h4>    \
                        <div class="progress progress-striped active">    \
                            <div class="progress-bar" role="progressbar"    \
                                 aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">    \
                                <span class="sr-only">Please wait...</span>    \
                            </div>    \
                        </div>    \
                    </div>    \
                </div>    \
            </div>    \
        </div>';

    jQuery.fn.initiateAjaxLoader = function (loadingText) {
        var ajaxLoaderDom,
            modalStore = {},
            selfElement = this,
            loadingText = loadingText;

        return this.each(function () {
            ajaxLoaderDom = $(AjaxLoaderAnimation.templateModel);
            if (loadingText !== undefined) {
                ajaxLoaderDom.find(".loadingText").text(loadingText);
            }
            $(this).append(ajaxLoaderDom);
            $(this).addClass("ajaxLoaderApplied");
        });
    };

    jQuery.fn.showAjaxLoader = function (loadingText, clear, appendLoading) {
        return this.each(function () {
            if (!$(this).hasClass("ajaxLoaderApplied")) {
                $(this).empty();
                $(this).initiateAjaxLoader(loadingText);
            }
            else if (loadingText !== undefined) {
                var currLoadingText = $(this).find(".loadingText").text();
                if (clear) {
                    $(this).find(".loadingText").text("");
                    currLoadingText = "";
                }
                if (currLoadingText.indexOf(loadingText) == -1) {
                    if (currLoadingText.trim() !== "") {
                        if (!clear) {
                            loadingText = [currLoadingText, loadingText].join(", ");
                        }
                    }
                    if (appendLoading) {
                        loadingText = "Loading " + loadingText;
                    }
                    $(this).find(".loadingText").text(loadingText);
                }
            }
            $(this).find(".modal").modal();
        });
    };
    jQuery.fn.hideAjaxLoader = function () {
        return this.each(function () {
            if ($(this).hasClass("ajaxLoaderApplied")) {
                $(this).find(".modal").modal('hide');
            }
        });
    };
})();

(function StringAugmentation() {
    String.prototype.replaceAll = function (originalSubstring, replacementSubstring) {
        var substringRegex = new RegExp(escape(originalSubstring), "g");
        return unescape(escape(this).replace(substringRegex, replacementSubstring));
    };
})();

(function CustomizeAccessorModifier() {
    jQuery.fn.getValue = function (value) {
        var element = $(this),
            elementTagName = $(this).prop('tagName'),
            selectOptionTag = '<option></option>',
            SELECT_TAG = "SELECT",
            CHECKBOX_TYPE = 'checkbox';

        returnVal = element.val();

        if (element.attr("type") == CHECKBOX_TYPE) {
            returnVal = element.prop('checked');
        }

        if (typeof returnVal === "string") {
            returnVal = Common.util.getCharacterIfUnicode(returnVal);
        }
        return returnVal;
    };

    jQuery.fn.setValue = function (value) {
        var element = $(this),
            elementTagName,
            selectOptionTag = '<option></option>',
            SELECT_TAG = "SELECT",
            CHECKBOX_TYPE = 'checkbox';

        element.val(value);

        if (element.parent().parent().children(SELECT_TAG).length > 0) {
            element.hide();
            element = element.parent().parent().children(SELECT_TAG);
            element.show();
        }

        elementTagName = element.prop('tagName');

        if (element.val() != value &&
            elementTagName == SELECT_TAG) {
            newOption = $(selectOptionTag).clone();
            newOption.attr('val', value);
            newOption.html(value);
            var otherElem = element.find('[value="Other"]');
            if (otherElem.length == 0) {
                element.append(newOption);
            }
            else {
                otherElem.before(newOption)
            }
            element.val(value);
        }
        else if (element.attr("type") == CHECKBOX_TYPE) {
            if (typeof value === "string") {
                value = (value === "true");
            }
            element.prop('checked', value);
        }

    };
})();

(function CustomMonkeyPatchers() {
    (function WindowsErrorHandler() {
        window.onerror = function () {
            var argIndx,
                errorMsg,
                defaultMsg = "Invalid data format";
            for (argIndx = 0; argIndx < arguments.length; argIndx += 1) {
                if (typeof arguments[argIndx] === "string") {
                    errorMsg = arguments[argIndx];
                    break;
                }
            }
            if (errorMsg !== undefined && errorMsg.indexOf("DataTable") >= 0) {
                Common.CustomMessaging.ShowWarningMessage(defaultMsg, -1, deferMessage = true);
                console.error("Error:", errorMsg);
            }
        }
    })();

    (function DataTableErrorHandler() {
        //Apply custom error message for Datatable failures
        //$.fn.DataTable.ext.sErrMode = "console"
    })();
})();

(function DefineProtegrityWebModule() {
    //Initializing pty module
    /*define("ptyweb", function (ptyweb) {
        return ptyweb;
    });*/
})();

var CustomMessaging = {
    MessageType: {
        ERROR: "ShowErrorMessage",
        WARNING: "ShowWarningMessage",
        SUCCESS: "ShowSuccessMessage"
    },
    messagingActive: false,

    deferredMessage: undefined,

    deferQueue: [],

    deferMessage: function (messageType, message, timeoutAfterSecs) {
        if (this.deferredMessage === undefined) {
            this.deferredMessage = $.Deferred();
        }

        if (this.messagingActive) {
            var deferredClose = $.Deferred();
            if ($(".noty_message").length == 0) {
                setTimeout(function () {
                    Common.CustomMessaging.deferredMessage.resolve();
                }, 3000);
            }
            else {
                this.deferredMessage.resolve();
            }
        }
        else {
            this.deferredMessage.resolve();
        }

        this.deferredMessage.done(function () {
            Common.CustomMessaging.CloseAllAlerts();
            Common.CustomMessaging.showMessage(messageType, message, timeoutAfterSecs);

            Common.CustomMessaging.deferredMessage = undefined;
        });
    },

    showMessage: function (messageType, message, timeoutAfterSecs) {
        if (window.ptyweb !== undefined) {
            if (timeoutAfterSecs === undefined) {
                timeoutAfterSecs = -1;//never timeout
            }
            ptyweb[messageType](message, timeoutAfterSecs);
        }
        else {
            alert(message);
        }
        this.messagingActive = true;
    },

    ShowErrorMessage: function (message, timeoutAfterSecs) {
        this.showMessage(this.MessageType.ERROR, message, timeoutAfterSecs);
    },

    ShowWarningMessage: function (message, timeoutAfterSecs, deferMessage) {
        this.deferMessage(this.MessageType.WARNING, message, timeoutAfterSecs, deferMessage);
    },

    ShowSuccessMessage: function (message, timeoutAfterSecs) {
        if (timeoutAfterSecs === undefined) {
            timeoutAfterSecs = 2000;//timeout success after 2s
        }
        this.showMessage(this.MessageType.SUCCESS, message, timeoutAfterSecs);
    },

    ShowAnyNodeErrors: function (responseArguments, messageString) {
        if (responseArguments !== undefined &&
            responseArguments.errorNodes !== undefined &&
            responseArguments.errorNodes.length > 0) {
            Common.CustomMessaging.ShowWarningMessage([
                messageString,
                responseArguments.errorNodes.length,
                " node(s) ",
                responseArguments.errorNodes
            ]);
        }
    },

    CloseAllAlerts: function () {
        if (window.ptyweb !== undefined) {
            ptyweb.CloseAllAlerts();
        }
    }
};

var Common = {
    util: {
        initiateCustomPopover : function () {
            var popoverTimeout;
            $(document).delegate('[data-toggle="popover"]', 'mouseenter', function (event) {
                $('[data-toggle="popover"]').not(this).popover("hide");
                var popoverElement = $(this);
                if (popoverTimeout !== undefined) {
                    clearTimeout(popoverTimeout);
                }
                setTimeout(function () {
                    popoverElement.popover("show");
                }, 100);
            });

            $(document).delegate('[data-toggle="popover"]', 'mouseleave', function () {
                var popoverElement = $(this);
                popoverTimeout = setTimeout(function () {
                    if (!$(".popover:hover").length) {
                        popoverElement.popover("hide");
                    }
                }, 100);
            });

            $(document).delegate('.popover.in[role="tooltip"]', "mouseleave", function () {
                $('[data-toggle="popover"][aria-describedby]').popover("hide");
            });
        },
        cloneItem: function (originalElement, posOfClonedElement) {
            var clonedItem = $(originalElement).clone();
            if (posOfClonedElement === undefined) {
                originalElement.after(clonedItem);
            }
            else {
                $(posOfClonedElement).after(clonedItem);
            }
            return clonedItem[0];
        },
        getCharacterIfUnicode : function (returnVal) {
            var indx,
                unicodeRegexes,
                charRepresentation;

            unicodeRegexes = returnVal.match(/\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8}/g);
            if (unicodeRegexes === null) {
                return returnVal;
            }
            else {
                for (indx = 0; indx < unicodeRegexes.length; indx++) {
                    charRepresentation = String.fromCharCode(parseInt(unicodeRegexes[indx].substring(2), 16));
                    returnVal = returnVal.replace(unicodeRegexes[indx], charRepresentation);
                }
            }
            return returnVal;
        }
    },
    CustomMessaging: CustomMessaging,
};

(function CustomSelectionDropdowns() {
    jQuery.fn.multiSelector = function (itemList, callback, doNotallowMultipleSelection) {
        /*
            Usage: itemList is an array of items.
            Each containing a json object of the following format:
            {
                image: "", (optional)
                text: ""
            }
        */
        var inputHtml = '    \
                            <div class="input-group">    \
                              <span class="input-group-addon input-lg" id="serviceLbl">Services</span>    \
                              <span type="text" class="serviceList form-control input-lg" aria-label="..."></span>    \
                              <div class="input-group-btn">    \
                                <button type="button" class="btn btn-lg btn-default dropdown-toggle serviceListDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">     \
                                <span class="caret"></span></button>    \
                                <ul class="dropdown-menu multiSelector dropdown-menu-left">    \
                                </ul>    \
                              </div>    \
                            </div>',
            multipleSelector = '<a href="#"><label ><input class="selectAllCheckbox" type="checkbox" value="selectAllCheckbox"><span>Select All</span></label></a>',
            selectorListParent = "ul",
            serviceDisplay = "span.serviceList",
            selectorItem = '<li>    \
                                        <a href="#">    \
                                        <label >    \
                                            <input class="listItem" type="checkbox" value="$itemText$">    \
                                            <img class="icon" src="$itemImage$" /> \
                                            <span>$itemText$</span>     \
                                        </label>    \
                                        </a>    \
                                    </li>',
            addEventHandlers,
            selectorListDOM,
            selectorDOM,
            serviceDisplayDOM,
            itemIndx;

        addEventHandlers = function (selectorListDOM, serviceDisplayDOM) {
            $(selectorListDOM).delegate('a', 'click', function (event) {
                if (this === event.target) {
                    $(this).find("[type='checkbox']").click();
                }
            });
            $(selectorListDOM).delegate("a .selectAllCheckbox", 'click', function (event) {
                if ($(this).prop('checked')) {
                    $(selectorListDOM).find("a [type='checkbox']").prop('checked', true);
                }
                else {
                    $(selectorListDOM).find("a [type='checkbox']").prop('checked', false);
                }
            });

            $(selectorListDOM).delegate("a [type='checkbox']", 'click', function (event) {
                var imageContent = $('<span>'),
                    services = [];
                $(selectorListDOM).find("a .listItem").each(function () {
                    if ($(this).prop('checked')) {
                        imageContent.append($(this).next().clone().get(0));
                        imageContent.append("&nbsp;&nbsp;&nbsp;");
                        services.push($(this).next().next().html());
                    }
                });
                $('.serviceList').html(imageContent);
                callback(services);
                setTimeout(function () { $('.serviceListDropdown').trigger('click'); }, 0.00001);
            });

            $(serviceDisplayDOM).on('click', function () { setTimeout(function () { $('.serviceListDropdown').trigger('click'); }, 0.00001); });
        };

        return this.each(function () {
            selectorDOM = $(inputHtml),
            serviceDisplayDOM = selectorDOM.find(serviceDisplay);
            selectorListDOM = selectorDOM.find(selectorListParent);
            if (doNotallowMultipleSelection === undefined || doNotallowMultipleSelection == false) {
                selectorListDOM.append($(multipleSelector));
            }
            for (itemIndx = 0; itemIndx < itemList.length; itemIndx += 1) {
                selectorListDOM.append(
                    $(selectorItem
                        .replaceAll("$itemText$", itemList[itemIndx].text)
                        .replaceAll("$itemImage$", itemList[itemIndx].image)
                    )
                );
            }
            addEventHandlers(selectorListDOM, serviceDisplayDOM);
            $(this).append(selectorDOM);
        });
    };

    //Installing combobox other selector
    jQuery.fn.otherSelector = function (action, otherOptionVal) {
        var inputHtml = '    \
                        <div class="input-group specify stayHidden" style="width:100%">    \
                           <input type="text" autocomplete="off" placeholder="" class="other" />    \
                           <span class="input-group-addon cancelOther">    \
                              <span class="glyphicon glyphicon-remove" />    \
                           </span>    \
                        </div>';
        if (otherOptionVal === undefined) {
            otherOptionVal = "Other";
        }
        otherOption = ['<option value="', otherOptionVal, '">', otherOptionVal, '</option>'].join('');
        if (action == "reset") {
            return this.each(function () {
                var inputOther = $(this).siblings('div.specify'),
                    inputBox = inputOther.find('input'),
                    selectBox = $(this);

                inputOther.hide();
                selectBox.val("");
                inputBox.val("");
                selectBox.show();
                selectBox.after(inputOther);
            });
        }
        return this.each(function () {
            var other = $(otherOption).clone(),
                inputOther = $(inputHtml).clone(),
                inputBox = inputOther.find('input'),
                selectBox = $(this),
                attributes = selectBox[0].attributes,
                i;
            selectBox.append(other);
            inputOther.hide();

            for (i = 0; i < attributes.length; i += 1) {
                inputBox.attr(attributes[i].name, attributes[i].value);
            }

            selectBox.after(inputOther);
            selectBox.change(function () {
                if ($(this).val() == other.attr('value')) {
                    inputBox.val("");
                    inputOther.show();
                    selectBox.hide();
                    inputOther.after(selectBox);
                }
            });
            inputOther.find('.cancelOther').click(function () {
                inputOther.hide();
                selectBox.val("");
                inputBox.val("");
                selectBox.show();
                selectBox.after(inputOther);
            });
        });
    };
})();

var customTypeAheadCombobox = function () {

    //Patching combobox to add functionality to set values other than
    // ones available in select option
    $.fn.combobox.Constructor.prototype.blur = function (e) {
        var that = this;
        this.focused = false;
        var val = this.$element.val();
        if (!this.options.allowAdditionalItems && !this.selected && val !== '') {
            this.$element.val('');
            this.$source.val('').trigger('change');
            this.$target.val('').trigger('change');
        }
        if (!this.mousedover && this.shown) { setTimeout(function () { that.hide(); }, 200); }
    };

    //Customizing combobox initiator to NOT
    //  initiate combobox once again if already
    //  initiated. 
    //Also ensure that the value of the combobox
    //  is properly set back to the initiated combobox
    var defaultComboboxInitiator = $.fn.combobox;

    $.fn.customCombobox = function (options) {
        return this.each(function () {
            if (!$(this).data("combobox")) {
                var comboboxContainer = $(this).parent().children(".combobox-container"),
                    value = comboboxContainer.find("input[type=text]").getValue();
                $(this).show();
                $(this).removeClass("stayHidden");
                comboboxContainer.remove();
                defaultComboboxInitiator.apply($(this), [options, arguments]);
                $(this).parent().children(".combobox-container").find("input[type=text]").setValue(value);
            }
        });
    }


}
//customTypeAheadCombobox();

var customSourceCodeEditor = function () {
    $.fn.sourceCodeEditor = function (sourceCodeLang, version) {
        var textEditor,
            codeMirrorEditor;
        return this.each(function () {
            textEditor = $(this);
            if (textEditor.next('.CodeMirror').length == 0) {
                textEditor.addClass('stayHidden');
                codeMirrorEditor = CodeMirror.fromTextArea(this, {
                    mode: {
                        name: sourceCodeLang,
                        version: version,
                        singleLineStringErrors: false
                    },
                    lineNumbers: true,
                    indentUnit: 4,
                    matchBrackets: true
                });
                codeMirrorEditor.on('changes', function (codeMirrorInstance) {
                    //Save the content to linked textarea
                    codeMirrorInstance.save();
                })
            }
            else {
                var codeMirrorEditor = textEditor.next('.CodeMirror')[0].CodeMirror;
                codeMirrorEditor.setValue(textEditor.getValue());
            }

            //Set current value of textarea to code mirror editor and
            //Call refresh method after an interval to deal with lazy value settlement
            //Reference: https://codemirror.net/doc/manual.html#refresh
            setTimeout(function () {
                codeMirrorEditor.refresh();
            }, 200);
        });
    };

    $.fn.sourceCodeEditorOption = function (option, value) {
        var textEditor,
            codeMirrorDom,
            codeMirrorEditor;
        return this.each(function () {
            textEditor = $(this);
            codeMirrorDom = textEditor.next('.CodeMirror');
            if (codeMirrorDom.length > 0) {
                codeMirrorEditor = codeMirrorDom.get(0).CodeMirror;
                codeMirrorEditor.setOption(option, value);
                if (typeof value === "boolean") {
                    if (value) {
                        codeMirrorDom.addClass(option);
                    }
                    else {
                        codeMirrorDom.removeClass(option);
                    }
                }
            }
        });
    };
};
//customSourceCodeEditor();

var customDiffViewer = function () {
    $.fn.diffViewer = function (leftText, rightText) {
        var diffWrapper,
            diffViewer,
            leftView,
            rightView,
            defaultWrapping = true;

        return this.each(function () {
            diffWrapper = $(this);
            if (diffWrapper.html().trim() === "") {

                if(window.localStorage !== undefined &&
                    localStorage.getItem("defaultDiffViewerLineWrapping") !== null) {
                    defaultWrapping =
                        localStorage.getItem("defaultDiffViewerLineWrapping") === "true";
                }

                diffViewer = CodeMirror.MergeView(this, {
                    value: leftText,
                    origLeft: null,
                    orig: rightText,
                    lineNumbers: true,
                    highlightDifferences: true,
                    connect: null,
                    lineWrapping: defaultWrapping,
                    readOnly: true,
                    mode: "text",
                    collapseIdentical: false
                });
            }
            leftView = $(this).find(
                    ".CodeMirror-merge-pane:not('.CodeMirror-merge-pane-rightmost') .CodeMirror"
                    )[0].CodeMirror;
            rightView = $(this).find(
                    ".CodeMirror-merge-pane.CodeMirror-merge-pane-rightmost .CodeMirror"
                    )[0].CodeMirror;
            if (diffWrapper.html().trim() != "") {
                leftView.setValue(leftText);
                rightView.setValue(rightText);
            }

            setTimeout(function () {
                leftView.refresh();
                rightView.refresh();
            }, 200);
        });
    };
};
//customDiffViewer();

var CSVDownloadHandler = function () {
    var convertArrayOfObjectsToCSV = function (args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);
        keys.shift();
        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function (item) {
            ctr = 0;
            keys.forEach(function (key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    };

    CSVDownloadHandler.downloadCSV = function(downloadLink, args) {
        var data, filename, link;
        var csv = convertArrayOfObjectsToCSV({
            data: args.data
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';
        
        if (navigator.msSaveOrOpenBlob === undefined) {
            if (!csv.match(/^data:text\/csv/i)) {
                csv = 'data:text/csv;charset=utf-8,' + csv;
            }
            data = encodeURI(csv);
            downloadLink.attr('href', data);
            downloadLink.attr('download', filename);
        }
        else {
            var jsonBlob = new Blob([csv], { type: 'application/json' });
            navigator.msSaveOrOpenBlob(jsonBlob, filename);
        }
    };
};
CSVDownloadHandler();