var JSONUIBuilderDefaults = function () {
    this.propLabelTmplt = "<label />";
    this.wrapper = {
        label: "<div class='col-sm-4 labelElem'></div>",
        input: "<div class='col-sm-8 inputElem'></div>",
        labelInObject: "<div class='labelElem'></div>",
        inputInObject: "<div class='inputElem'></div>",
        labelInArray: "<div class='labelElem'></div>",
        inputInArray: "<div class='inputElem'></div>",
        arrayGroupWrapper: "<ul class='list-group listgroup arrayElements'>",
        objectGroupWrapper: "<ul class='list-group listgroup objectElements'>",
        arrayObjectWrapper: "<li class='listgroupitem'></li>",
        arrayRemovalWrapper: "<img class='icons removeArrayElement'/>",
        inputWrapper: "<div class='input-group inputGroupElement'>  \
                        </div>",
        otherSelector: "",
        requiredField: "<span class='text-danger requiredField asterisk'>*</span>"
    };
    this.leafWrapper = "<span class='filterName'></span>";
    this.inputDescriptor = {
        tmplt: "<a class='descTooltip' data-toggle='popover' role='button' data-placement='left' data-trigger='click' >   \
                    <span class='glyphicon glyphicon-info-sign'></span>   \
                </a>   ",
        titleTmplt: "title",
        descTmplt: "data-content"
    };

    this.arrayAppender = '<a class="pull-right text-info addArrayItem">  \
                            <i class="glyphicons glyphicons-circle-plus btn-sm arrayCntrlrIcon"></i> \
                         </a>';

    this.objectToggler = '<a class="pull-right text-info showHideObjectItem">  \
                            <i class="glyphicons glyphicons-expand btn-xs objectCntrlrIcon"></i> \
                         </a>';

    this.inputTypes = {
        string: "<input type='text' class='form-control input-sm inputElement'/>",
        integer: "<input type='number' class='form-control input-sm inputElement' />",
        boolean: "<input type='checkbox' class='input-sm inputElement checkboxElement'  />",
        objectElement: "<div class='form-inline objectElement'>   \
               </div>",
        array: "<div class='form-inline arrayElement'>   \
               </div>",
        select: "<select class='combobox form-control input-sm inputElement' />",
        multiType: "<select class='stringSelector form-control input-sm inputElement'>  \
                        <option value=''></option>  \
                        <option value='null'>null</option>  \
                    </select>",
        textarea: "<textarea class='form-control input-sm inputElement' rows='3' style='resize:vertical' />",
        sourceCodeEditor: "<textarea class='form-control input-sm inputElement sourceCodeEditor-python' rows='15' style='resize:vertical' />"
    };

    this.inputWarningLabel = "<label class='warn text-warning'></label>";

    this.attribMap = {
        string: "type"
    };

    this.childGroupElems = {
        select: "<optgroup />"
    };

    this.childElems = {
        object: "<option />",
        select: "<option />"
    };

    this.childInnerHtml = {
        object: "<li class='dropdown-header'>Dropdown header 1</li>",
        select: "<li class='dropdown-header'>Dropdown header 1</li>"
    };

    this.propertyGroup = "<div class='propertyGroup'></div>";
};