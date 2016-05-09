var InputCustomizers = function () {
    
    this.showInputDescriptions = function () {
        $("a.descTooltip").popover({
            container: 'body',
            placement: 'right',
            html: true
        });
    };

    this.showInputSuggestions = function () {
        $("select.suggestionBox").customCombobox({
            allowAdditionalItems: true
        });
    };

    this.showSourceCodeEditors = function (root) {
        if (root !== undefined) {
            root.find('.sourceCodeEditor-python:visible').sourceCodeEditor("python", 2);
        }
        else {
            $('.sourceCodeEditor-python:visible').sourceCodeEditor("python", 2);
        }
    };

    return this;
};
