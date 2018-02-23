// main vuejs app component
var app = new Vue({
    el: '#app',
    data: {
        textInput: null,
        validMessage: 'you have entered some text!',
        invalidMessage: 'Please enter some text.'
    },
    computed: {
        //Used to calculate a true or false on showing valid or invalid classes
        "IsValid": function () {
            return (this.textInput != null && this.textInput != '');
        },
        "IsInvalid": function () {
            return (this.textInput == '');
        },
    }
})