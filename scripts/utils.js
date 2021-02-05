const getElmById = document.getElementById.bind(document);


const CSupport = {
    isEmpty: function (val) {
        if (typeof (val) == "object" && val != null) return false;

        if (typeof (val) == "object" && val == undefined) return true;

        if (val == "" || val == undefined || val == null) return true;

        return false;
    },

    /**
    * @param  {DOMElement} oElm
    * @param  {String} displayStyle - (optional) flex, inline
    */
    showElm: function (oElm, displayStyle) {
        oElm.style.display = displayStyle ? displayStyle : "block";
    },


    hideElm: function (oElm) {
        oElm.style.display = "none";
    }
};


/*
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }

    sayHi() {
        return `👋 ${this.name}!`;
    }
}*/
