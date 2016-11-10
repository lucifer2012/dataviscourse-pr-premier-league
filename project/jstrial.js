/**
 * Created by Chen on 10/11/16.
 */
var ob = {};
ob.key1 = "what";
ob.key2 = 2;
ob.key3 = "this";
for (name in ob) {
    if (name != "key2") {
        console.log(name);
    }
}
delete ob.key2;
for(name in ob){
    console.log(ob[name]);
}

var add = function (a,b) {
    return a+b;
}

var myObject = {
    value:0,
    increment:function (inc) {
        if(typeof inc == "number"){
            this.value += inc;
        }
        else{
            this.value++;
        }
    }
    }
myObject.increment();
myObject.increment(2);
console.log(myObject.value);

// var try_it = function () { try {
//     add("seven");
// } catch (e) {
//     document.writeln(e.name + ': ' + e.message);
// }
// }
// try_it();

console.log(Math.floor(4.3));

var myobject1 = function () {
    var value = 0;

    return {
        increment: function (inc) {
            value += typeof inc == "number" ? inc:1;
        },
        getValue: function () {
            return value;
        }
    };
}();
myobject1.increment(3);
console.log(myobject1.getValue());
console.log(32*"*")
var fib = function (n) {
    return n < 2 ? n:fib(n-1) + fib(n-2);
}

console.log(fib(10));

Array.prototype.reduce = function (f,value) {
    var i;
    for (i = 0;i<this.length;i++){
        value = f(this[i],value);
    }
    return value;
};

var multi = function (a,b) {
    return a * b;
};

var darray = [1,2,3,4];

console.log(darray.reduce(multi,1));