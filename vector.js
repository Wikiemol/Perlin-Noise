function Vector(array) {
    if (arguments.length === 1) {
        this.position = array;
    } else {
        this.position = Array.prototype.slice.call(arguments);
    }
}

Vector.prototype.clone = function() {
    var clone = new Vector();
    clone.set(this.position.slice(0));
    return clone;
}

Vector.prototype.resetLength = function(size) {
    this.position = [];
    for (var i = 0; i < size; i++) {
        this.position.push(0);
    }
}

Vector.prototype.toString = function() {
    return this.position.toString();
}

Vector.prototype.set = function(array) {
    if (arguments.length === 1) {
        this.position = array;
    } else {
        this.position = Array.prototype.slice.call(arguments);
    }
}

Vector.prototype.x = function() {
    return this.at(0);
}

Vector.prototype.y = function() {
    return this.at(1);
}

Vector.prototype.z = function() {
    return this.at(2);
}

Vector.prototype.w = function() {
    return this.at(3);
}

Vector.prototype.at = function(i) {
    if (i >= this.length()) {
        throw new E.IndexOutOfBoundsException();
    }
    return this.position[i];
}

Vector.prototype.dot = function(vector2) {
    if (vector2.length() != this.length()) {
        throw new E.IllegalArgumentException("Vectors cannot be of different length in dot product");
    }

    var sum = 0;
    for (var i = 0; i < this.length(); i++) {
        sum += this.at(i) * vector2.at(i);
    }

    return sum;
}

Vector.prototype.multiply = function(scalar) {
    var result = this.clone();
    for (var i = 0; i < this.length(); i++) {
        result.position[i] *= scalar;
    }
    return result;
}

Vector.prototype.magnitude = function() {
    return Math.sqrt(this.dot(this));
}

Vector.prototype.norm = function() {
    return this.multiply(1 / this.magnitude());
}

Vector.prototype.sum = function(vector2) {
    if (vector2.length() != this.length()) {
        throw new E.IllegalArgumentException("Vectors cannot be of different length in sum");
    }
    var sum = [];
    for (var i = 0; i < this.length(); i++) {
        sum.push(this.at(i) + vector2.at(i));
    }
    var result = new Vector();
    result.set(sum);
    return result;
}

Vector.prototype.minus = function(vector2) {
    return this.sum(vector2.multiply(-1));
}

Vector.prototype.length = function() {
    return this.position.length;
}
