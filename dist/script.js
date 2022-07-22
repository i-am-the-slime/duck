var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod3) => function __require() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
};
var __export = (target, all5) => {
  for (var name3 in all5)
    __defProp(target, name3, { get: all5[name3], enumerable: true });
};
var __copyProps = (to2, from3, except4, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to2, key) && key !== except4)
        __defProp(to2, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target, mod3));

// node_modules/big-integer/BigInteger.js
var require_BigInteger = __commonJS({
  "node_modules/big-integer/BigInteger.js"(exports, module2) {
    var bigInt2 = function(undefined2) {
      "use strict";
      var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
      var supportsNativeBigInt = typeof BigInt === "function";
      function Integer(v, radix, alphabet, caseSensitive) {
        if (typeof v === "undefined")
          return Integer[0];
        if (typeof radix !== "undefined")
          return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
        return parseValue(v);
      }
      function BigInteger(value2, sign2) {
        this.value = value2;
        this.sign = sign2;
        this.isSmall = false;
      }
      BigInteger.prototype = Object.create(Integer.prototype);
      function SmallInteger(value2) {
        this.value = value2;
        this.sign = value2 < 0;
        this.isSmall = true;
      }
      SmallInteger.prototype = Object.create(Integer.prototype);
      function NativeBigInt(value2) {
        this.value = value2;
      }
      NativeBigInt.prototype = Object.create(Integer.prototype);
      function isPrecise(n) {
        return -MAX_INT < n && n < MAX_INT;
      }
      function smallToArray(n) {
        if (n < 1e7)
          return [n];
        if (n < 1e14)
          return [n % 1e7, Math.floor(n / 1e7)];
        return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
      }
      function arrayToSmall(arr) {
        trim2(arr);
        var length4 = arr.length;
        if (length4 < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
          switch (length4) {
            case 0:
              return 0;
            case 1:
              return arr[0];
            case 2:
              return arr[0] + arr[1] * BASE;
            default:
              return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
          }
        }
        return arr;
      }
      function trim2(v) {
        var i3 = v.length;
        while (v[--i3] === 0)
          ;
        v.length = i3 + 1;
      }
      function createArray(length4) {
        var x2 = new Array(length4);
        var i3 = -1;
        while (++i3 < length4) {
          x2[i3] = 0;
        }
        return x2;
      }
      function truncate3(n) {
        if (n > 0)
          return Math.floor(n);
        return Math.ceil(n);
      }
      function add2(a, b) {
        var l_a = a.length, l_b = b.length, r2 = new Array(l_a), carry = 0, base = BASE, sum2, i3;
        for (i3 = 0; i3 < l_b; i3++) {
          sum2 = a[i3] + b[i3] + carry;
          carry = sum2 >= base ? 1 : 0;
          r2[i3] = sum2 - carry * base;
        }
        while (i3 < l_a) {
          sum2 = a[i3] + carry;
          carry = sum2 === base ? 1 : 0;
          r2[i3++] = sum2 - carry * base;
        }
        if (carry > 0)
          r2.push(carry);
        return r2;
      }
      function addAny(a, b) {
        if (a.length >= b.length)
          return add2(a, b);
        return add2(b, a);
      }
      function addSmall(a, carry) {
        var l = a.length, r2 = new Array(l), base = BASE, sum2, i3;
        for (i3 = 0; i3 < l; i3++) {
          sum2 = a[i3] - base + carry;
          carry = Math.floor(sum2 / base);
          r2[i3] = sum2 - carry * base;
          carry += 1;
        }
        while (carry > 0) {
          r2[i3++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r2;
      }
      BigInteger.prototype.add = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.subtract(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall) {
          return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
        }
        return new BigInteger(addAny(a, b), this.sign);
      };
      BigInteger.prototype.plus = BigInteger.prototype.add;
      SmallInteger.prototype.add = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.subtract(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          if (isPrecise(a + b))
            return new SmallInteger(a + b);
          b = smallToArray(Math.abs(b));
        }
        return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
      };
      SmallInteger.prototype.plus = SmallInteger.prototype.add;
      NativeBigInt.prototype.add = function(v) {
        return new NativeBigInt(this.value + parseValue(v).value);
      };
      NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
      function subtract(a, b) {
        var a_l = a.length, b_l = b.length, r2 = new Array(a_l), borrow = 0, base = BASE, i3, difference2;
        for (i3 = 0; i3 < b_l; i3++) {
          difference2 = a[i3] - borrow - b[i3];
          if (difference2 < 0) {
            difference2 += base;
            borrow = 1;
          } else
            borrow = 0;
          r2[i3] = difference2;
        }
        for (i3 = b_l; i3 < a_l; i3++) {
          difference2 = a[i3] - borrow;
          if (difference2 < 0)
            difference2 += base;
          else {
            r2[i3++] = difference2;
            break;
          }
          r2[i3] = difference2;
        }
        for (; i3 < a_l; i3++) {
          r2[i3] = a[i3];
        }
        trim2(r2);
        return r2;
      }
      function subtractAny(a, b, sign2) {
        var value2;
        if (compareAbs(a, b) >= 0) {
          value2 = subtract(a, b);
        } else {
          value2 = subtract(b, a);
          sign2 = !sign2;
        }
        value2 = arrayToSmall(value2);
        if (typeof value2 === "number") {
          if (sign2)
            value2 = -value2;
          return new SmallInteger(value2);
        }
        return new BigInteger(value2, sign2);
      }
      function subtractSmall(a, b, sign2) {
        var l = a.length, r2 = new Array(l), carry = -b, base = BASE, i3, difference2;
        for (i3 = 0; i3 < l; i3++) {
          difference2 = a[i3] + carry;
          carry = Math.floor(difference2 / base);
          difference2 %= base;
          r2[i3] = difference2 < 0 ? difference2 + base : difference2;
        }
        r2 = arrayToSmall(r2);
        if (typeof r2 === "number") {
          if (sign2)
            r2 = -r2;
          return new SmallInteger(r2);
        }
        return new BigInteger(r2, sign2);
      }
      BigInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        if (this.sign !== n.sign) {
          return this.add(n.negate());
        }
        var a = this.value, b = n.value;
        if (n.isSmall)
          return subtractSmall(a, Math.abs(b), this.sign);
        return subtractAny(a, b, this.sign);
      };
      BigInteger.prototype.minus = BigInteger.prototype.subtract;
      SmallInteger.prototype.subtract = function(v) {
        var n = parseValue(v);
        var a = this.value;
        if (a < 0 !== n.sign) {
          return this.add(n.negate());
        }
        var b = n.value;
        if (n.isSmall) {
          return new SmallInteger(a - b);
        }
        return subtractSmall(b, Math.abs(a), a >= 0);
      };
      SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
      NativeBigInt.prototype.subtract = function(v) {
        return new NativeBigInt(this.value - parseValue(v).value);
      };
      NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
      BigInteger.prototype.negate = function() {
        return new BigInteger(this.value, !this.sign);
      };
      SmallInteger.prototype.negate = function() {
        var sign2 = this.sign;
        var small = new SmallInteger(-this.value);
        small.sign = !sign2;
        return small;
      };
      NativeBigInt.prototype.negate = function() {
        return new NativeBigInt(-this.value);
      };
      BigInteger.prototype.abs = function() {
        return new BigInteger(this.value, false);
      };
      SmallInteger.prototype.abs = function() {
        return new SmallInteger(Math.abs(this.value));
      };
      NativeBigInt.prototype.abs = function() {
        return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
      };
      function multiplyLong(a, b) {
        var a_l = a.length, b_l = b.length, l = a_l + b_l, r2 = createArray(l), base = BASE, product2, carry, i3, a_i, b_j;
        for (i3 = 0; i3 < a_l; ++i3) {
          a_i = a[i3];
          for (var j = 0; j < b_l; ++j) {
            b_j = b[j];
            product2 = a_i * b_j + r2[i3 + j];
            carry = Math.floor(product2 / base);
            r2[i3 + j] = product2 - carry * base;
            r2[i3 + j + 1] += carry;
          }
        }
        trim2(r2);
        return r2;
      }
      function multiplySmall(a, b) {
        var l = a.length, r2 = new Array(l), base = BASE, carry = 0, product2, i3;
        for (i3 = 0; i3 < l; i3++) {
          product2 = a[i3] * b + carry;
          carry = Math.floor(product2 / base);
          r2[i3] = product2 - carry * base;
        }
        while (carry > 0) {
          r2[i3++] = carry % base;
          carry = Math.floor(carry / base);
        }
        return r2;
      }
      function shiftLeft(x2, n) {
        var r2 = [];
        while (n-- > 0)
          r2.push(0);
        return r2.concat(x2);
      }
      function multiplyKaratsuba(x2, y) {
        var n = Math.max(x2.length, y.length);
        if (n <= 30)
          return multiplyLong(x2, y);
        n = Math.ceil(n / 2);
        var b = x2.slice(n), a = x2.slice(0, n), d = y.slice(n), c = y.slice(0, n);
        var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
        var product2 = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
        trim2(product2);
        return product2;
      }
      function useKaratsuba(l1, l2) {
        return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
      }
      BigInteger.prototype.multiply = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, sign2 = this.sign !== n.sign, abs3;
        if (n.isSmall) {
          if (b === 0)
            return Integer[0];
          if (b === 1)
            return this;
          if (b === -1)
            return this.negate();
          abs3 = Math.abs(b);
          if (abs3 < BASE) {
            return new BigInteger(multiplySmall(a, abs3), sign2);
          }
          b = smallToArray(abs3);
        }
        if (useKaratsuba(a.length, b.length))
          return new BigInteger(multiplyKaratsuba(a, b), sign2);
        return new BigInteger(multiplyLong(a, b), sign2);
      };
      BigInteger.prototype.times = BigInteger.prototype.multiply;
      function multiplySmallAndArray(a, b, sign2) {
        if (a < BASE) {
          return new BigInteger(multiplySmall(b, a), sign2);
        }
        return new BigInteger(multiplyLong(b, smallToArray(a)), sign2);
      }
      SmallInteger.prototype._multiplyBySmall = function(a) {
        if (isPrecise(a.value * this.value)) {
          return new SmallInteger(a.value * this.value);
        }
        return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
      };
      BigInteger.prototype._multiplyBySmall = function(a) {
        if (a.value === 0)
          return Integer[0];
        if (a.value === 1)
          return this;
        if (a.value === -1)
          return this.negate();
        return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
      };
      SmallInteger.prototype.multiply = function(v) {
        return parseValue(v)._multiplyBySmall(this);
      };
      SmallInteger.prototype.times = SmallInteger.prototype.multiply;
      NativeBigInt.prototype.multiply = function(v) {
        return new NativeBigInt(this.value * parseValue(v).value);
      };
      NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
      function square(a) {
        var l = a.length, r2 = createArray(l + l), base = BASE, product2, carry, i3, a_i, a_j;
        for (i3 = 0; i3 < l; i3++) {
          a_i = a[i3];
          carry = 0 - a_i * a_i;
          for (var j = i3; j < l; j++) {
            a_j = a[j];
            product2 = 2 * (a_i * a_j) + r2[i3 + j] + carry;
            carry = Math.floor(product2 / base);
            r2[i3 + j] = product2 - carry * base;
          }
          r2[i3 + l] = carry;
        }
        trim2(r2);
        return r2;
      }
      BigInteger.prototype.square = function() {
        return new BigInteger(square(this.value), false);
      };
      SmallInteger.prototype.square = function() {
        var value2 = this.value * this.value;
        if (isPrecise(value2))
          return new SmallInteger(value2);
        return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
      };
      NativeBigInt.prototype.square = function(v) {
        return new NativeBigInt(this.value * this.value);
      };
      function divMod1(a, b) {
        var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder2 = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i3, l, q;
        if (remainder2.length <= a_l)
          remainder2.push(0);
        divisor.push(0);
        divisorMostSignificantDigit = divisor[b_l - 1];
        for (shift = a_l - b_l; shift >= 0; shift--) {
          quotientDigit = base - 1;
          if (remainder2[shift + b_l] !== divisorMostSignificantDigit) {
            quotientDigit = Math.floor((remainder2[shift + b_l] * base + remainder2[shift + b_l - 1]) / divisorMostSignificantDigit);
          }
          carry = 0;
          borrow = 0;
          l = divisor.length;
          for (i3 = 0; i3 < l; i3++) {
            carry += quotientDigit * divisor[i3];
            q = Math.floor(carry / base);
            borrow += remainder2[shift + i3] - (carry - q * base);
            carry = q;
            if (borrow < 0) {
              remainder2[shift + i3] = borrow + base;
              borrow = -1;
            } else {
              remainder2[shift + i3] = borrow;
              borrow = 0;
            }
          }
          while (borrow !== 0) {
            quotientDigit -= 1;
            carry = 0;
            for (i3 = 0; i3 < l; i3++) {
              carry += remainder2[shift + i3] - base + divisor[i3];
              if (carry < 0) {
                remainder2[shift + i3] = carry + base;
                carry = 0;
              } else {
                remainder2[shift + i3] = carry;
                carry = 1;
              }
            }
            borrow += carry;
          }
          result[shift] = quotientDigit;
        }
        remainder2 = divModSmall(remainder2, lambda)[0];
        return [arrayToSmall(result), arrayToSmall(remainder2)];
      }
      function divMod2(a, b) {
        var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
        while (a_l) {
          part.unshift(a[--a_l]);
          trim2(part);
          if (compareAbs(part, b) < 0) {
            result.push(0);
            continue;
          }
          xlen = part.length;
          highx = part[xlen - 1] * base + part[xlen - 2];
          highy = b[b_l - 1] * base + b[b_l - 2];
          if (xlen > b_l) {
            highx = (highx + 1) * base;
          }
          guess = Math.ceil(highx / highy);
          do {
            check = multiplySmall(b, guess);
            if (compareAbs(check, part) <= 0)
              break;
            guess--;
          } while (guess);
          result.push(guess);
          part = subtract(part, check);
        }
        result.reverse();
        return [arrayToSmall(result), arrayToSmall(part)];
      }
      function divModSmall(value2, lambda) {
        var length4 = value2.length, quotient = createArray(length4), base = BASE, i3, q, remainder2, divisor;
        remainder2 = 0;
        for (i3 = length4 - 1; i3 >= 0; --i3) {
          divisor = remainder2 * base + value2[i3];
          q = truncate3(divisor / lambda);
          remainder2 = divisor - q * lambda;
          quotient[i3] = q | 0;
        }
        return [quotient, remainder2 | 0];
      }
      function divModAny(self2, v) {
        var value2, n = parseValue(v);
        if (supportsNativeBigInt) {
          return [new NativeBigInt(self2.value / n.value), new NativeBigInt(self2.value % n.value)];
        }
        var a = self2.value, b = n.value;
        var quotient;
        if (b === 0)
          throw new Error("Cannot divide by zero");
        if (self2.isSmall) {
          if (n.isSmall) {
            return [new SmallInteger(truncate3(a / b)), new SmallInteger(a % b)];
          }
          return [Integer[0], self2];
        }
        if (n.isSmall) {
          if (b === 1)
            return [self2, Integer[0]];
          if (b == -1)
            return [self2.negate(), Integer[0]];
          var abs3 = Math.abs(b);
          if (abs3 < BASE) {
            value2 = divModSmall(a, abs3);
            quotient = arrayToSmall(value2[0]);
            var remainder2 = value2[1];
            if (self2.sign)
              remainder2 = -remainder2;
            if (typeof quotient === "number") {
              if (self2.sign !== n.sign)
                quotient = -quotient;
              return [new SmallInteger(quotient), new SmallInteger(remainder2)];
            }
            return [new BigInteger(quotient, self2.sign !== n.sign), new SmallInteger(remainder2)];
          }
          b = smallToArray(abs3);
        }
        var comparison = compareAbs(a, b);
        if (comparison === -1)
          return [Integer[0], self2];
        if (comparison === 0)
          return [Integer[self2.sign === n.sign ? 1 : -1], Integer[0]];
        if (a.length + b.length <= 200)
          value2 = divMod1(a, b);
        else
          value2 = divMod2(a, b);
        quotient = value2[0];
        var qSign = self2.sign !== n.sign, mod3 = value2[1], mSign = self2.sign;
        if (typeof quotient === "number") {
          if (qSign)
            quotient = -quotient;
          quotient = new SmallInteger(quotient);
        } else
          quotient = new BigInteger(quotient, qSign);
        if (typeof mod3 === "number") {
          if (mSign)
            mod3 = -mod3;
          mod3 = new SmallInteger(mod3);
        } else
          mod3 = new BigInteger(mod3, mSign);
        return [quotient, mod3];
      }
      BigInteger.prototype.divmod = function(v) {
        var result = divModAny(this, v);
        return {
          quotient: result[0],
          remainder: result[1]
        };
      };
      NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
      BigInteger.prototype.divide = function(v) {
        return divModAny(this, v)[0];
      };
      NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
        return new NativeBigInt(this.value / parseValue(v).value);
      };
      SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
      BigInteger.prototype.mod = function(v) {
        return divModAny(this, v)[1];
      };
      NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
        return new NativeBigInt(this.value % parseValue(v).value);
      };
      SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
      BigInteger.prototype.pow = function(v) {
        var n = parseValue(v), a = this.value, b = n.value, value2, x2, y;
        if (b === 0)
          return Integer[1];
        if (a === 0)
          return Integer[0];
        if (a === 1)
          return Integer[1];
        if (a === -1)
          return n.isEven() ? Integer[1] : Integer[-1];
        if (n.sign) {
          return Integer[0];
        }
        if (!n.isSmall)
          throw new Error("The exponent " + n.toString() + " is too large.");
        if (this.isSmall) {
          if (isPrecise(value2 = Math.pow(a, b)))
            return new SmallInteger(truncate3(value2));
        }
        x2 = this;
        y = Integer[1];
        while (true) {
          if (b & true) {
            y = y.times(x2);
            --b;
          }
          if (b === 0)
            break;
          b /= 2;
          x2 = x2.square();
        }
        return y;
      };
      SmallInteger.prototype.pow = BigInteger.prototype.pow;
      NativeBigInt.prototype.pow = function(v) {
        var n = parseValue(v);
        var a = this.value, b = n.value;
        var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
        if (b === _0)
          return Integer[1];
        if (a === _0)
          return Integer[0];
        if (a === _1)
          return Integer[1];
        if (a === BigInt(-1))
          return n.isEven() ? Integer[1] : Integer[-1];
        if (n.isNegative())
          return new NativeBigInt(_0);
        var x2 = this;
        var y = Integer[1];
        while (true) {
          if ((b & _1) === _1) {
            y = y.times(x2);
            --b;
          }
          if (b === _0)
            break;
          b /= _2;
          x2 = x2.square();
        }
        return y;
      };
      BigInteger.prototype.modPow = function(exp2, mod3) {
        exp2 = parseValue(exp2);
        mod3 = parseValue(mod3);
        if (mod3.isZero())
          throw new Error("Cannot take modPow with modulus 0");
        var r2 = Integer[1], base = this.mod(mod3);
        if (exp2.isNegative()) {
          exp2 = exp2.multiply(Integer[-1]);
          base = base.modInv(mod3);
        }
        while (exp2.isPositive()) {
          if (base.isZero())
            return Integer[0];
          if (exp2.isOdd())
            r2 = r2.multiply(base).mod(mod3);
          exp2 = exp2.divide(2);
          base = base.square().mod(mod3);
        }
        return r2;
      };
      NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
      function compareAbs(a, b) {
        if (a.length !== b.length) {
          return a.length > b.length ? 1 : -1;
        }
        for (var i3 = a.length - 1; i3 >= 0; i3--) {
          if (a[i3] !== b[i3])
            return a[i3] > b[i3] ? 1 : -1;
        }
        return 0;
      }
      BigInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall)
          return 1;
        return compareAbs(a, b);
      };
      SmallInteger.prototype.compareAbs = function(v) {
        var n = parseValue(v), a = Math.abs(this.value), b = n.value;
        if (n.isSmall) {
          b = Math.abs(b);
          return a === b ? 0 : a > b ? 1 : -1;
        }
        return -1;
      };
      NativeBigInt.prototype.compareAbs = function(v) {
        var a = this.value;
        var b = parseValue(v).value;
        a = a >= 0 ? a : -a;
        b = b >= 0 ? b : -b;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      BigInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (this.sign !== n.sign) {
          return n.sign ? 1 : -1;
        }
        if (n.isSmall) {
          return this.sign ? -1 : 1;
        }
        return compareAbs(a, b) * (this.sign ? -1 : 1);
      };
      BigInteger.prototype.compareTo = BigInteger.prototype.compare;
      SmallInteger.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var n = parseValue(v), a = this.value, b = n.value;
        if (n.isSmall) {
          return a == b ? 0 : a > b ? 1 : -1;
        }
        if (a < 0 !== n.sign) {
          return a < 0 ? -1 : 1;
        }
        return a < 0 ? 1 : -1;
      };
      SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
      NativeBigInt.prototype.compare = function(v) {
        if (v === Infinity) {
          return -1;
        }
        if (v === -Infinity) {
          return 1;
        }
        var a = this.value;
        var b = parseValue(v).value;
        return a === b ? 0 : a > b ? 1 : -1;
      };
      NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
      BigInteger.prototype.equals = function(v) {
        return this.compare(v) === 0;
      };
      NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
      BigInteger.prototype.notEquals = function(v) {
        return this.compare(v) !== 0;
      };
      NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
      BigInteger.prototype.greater = function(v) {
        return this.compare(v) > 0;
      };
      NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
      BigInteger.prototype.lesser = function(v) {
        return this.compare(v) < 0;
      };
      NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
      BigInteger.prototype.greaterOrEquals = function(v) {
        return this.compare(v) >= 0;
      };
      NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
      BigInteger.prototype.lesserOrEquals = function(v) {
        return this.compare(v) <= 0;
      };
      NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
      BigInteger.prototype.isEven = function() {
        return (this.value[0] & 1) === 0;
      };
      SmallInteger.prototype.isEven = function() {
        return (this.value & 1) === 0;
      };
      NativeBigInt.prototype.isEven = function() {
        return (this.value & BigInt(1)) === BigInt(0);
      };
      BigInteger.prototype.isOdd = function() {
        return (this.value[0] & 1) === 1;
      };
      SmallInteger.prototype.isOdd = function() {
        return (this.value & 1) === 1;
      };
      NativeBigInt.prototype.isOdd = function() {
        return (this.value & BigInt(1)) === BigInt(1);
      };
      BigInteger.prototype.isPositive = function() {
        return !this.sign;
      };
      SmallInteger.prototype.isPositive = function() {
        return this.value > 0;
      };
      NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
      BigInteger.prototype.isNegative = function() {
        return this.sign;
      };
      SmallInteger.prototype.isNegative = function() {
        return this.value < 0;
      };
      NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
      BigInteger.prototype.isUnit = function() {
        return false;
      };
      SmallInteger.prototype.isUnit = function() {
        return Math.abs(this.value) === 1;
      };
      NativeBigInt.prototype.isUnit = function() {
        return this.abs().value === BigInt(1);
      };
      BigInteger.prototype.isZero = function() {
        return false;
      };
      SmallInteger.prototype.isZero = function() {
        return this.value === 0;
      };
      NativeBigInt.prototype.isZero = function() {
        return this.value === BigInt(0);
      };
      BigInteger.prototype.isDivisibleBy = function(v) {
        var n = parseValue(v);
        if (n.isZero())
          return false;
        if (n.isUnit())
          return true;
        if (n.compareAbs(2) === 0)
          return this.isEven();
        return this.mod(n).isZero();
      };
      NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
      function isBasicPrime(v) {
        var n = v.abs();
        if (n.isUnit())
          return false;
        if (n.equals(2) || n.equals(3) || n.equals(5))
          return true;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
          return false;
        if (n.lesser(49))
          return true;
      }
      function millerRabinTest(n, a) {
        var nPrev = n.prev(), b = nPrev, r2 = 0, d, t2, i3, x2;
        while (b.isEven())
          b = b.divide(2), r2++;
        next:
          for (i3 = 0; i3 < a.length; i3++) {
            if (n.lesser(a[i3]))
              continue;
            x2 = bigInt2(a[i3]).modPow(b, n);
            if (x2.isUnit() || x2.equals(nPrev))
              continue;
            for (d = r2 - 1; d != 0; d--) {
              x2 = x2.square().mod(n);
              if (x2.isUnit())
                return false;
              if (x2.equals(nPrev))
                continue next;
            }
            return false;
          }
        return true;
      }
      BigInteger.prototype.isPrime = function(strict) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2)
          return isPrime;
        var n = this.abs();
        var bits = n.bitLength();
        if (bits <= 64)
          return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        var logN = Math.log(2) * bits.toJSNumber();
        var t2 = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
        for (var a = [], i3 = 0; i3 < t2; i3++) {
          a.push(bigInt2(i3 + 2));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
      BigInteger.prototype.isProbablePrime = function(iterations, rng) {
        var isPrime = isBasicPrime(this);
        if (isPrime !== undefined2)
          return isPrime;
        var n = this.abs();
        var t2 = iterations === undefined2 ? 5 : iterations;
        for (var a = [], i3 = 0; i3 < t2; i3++) {
          a.push(bigInt2.randBetween(2, n.minus(2), rng));
        }
        return millerRabinTest(n, a);
      };
      NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
      BigInteger.prototype.modInv = function(n) {
        var t2 = bigInt2.zero, newT = bigInt2.one, r2 = parseValue(n), newR = this.abs(), q, lastT, lastR;
        while (!newR.isZero()) {
          q = r2.divide(newR);
          lastT = t2;
          lastR = r2;
          t2 = newT;
          r2 = newR;
          newT = lastT.subtract(q.multiply(newT));
          newR = lastR.subtract(q.multiply(newR));
        }
        if (!r2.isUnit())
          throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
        if (t2.compare(0) === -1) {
          t2 = t2.add(n);
        }
        if (this.isNegative()) {
          return t2.negate();
        }
        return t2;
      };
      NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
      BigInteger.prototype.next = function() {
        var value2 = this.value;
        if (this.sign) {
          return subtractSmall(value2, 1, this.sign);
        }
        return new BigInteger(addSmall(value2, 1), this.sign);
      };
      SmallInteger.prototype.next = function() {
        var value2 = this.value;
        if (value2 + 1 < MAX_INT)
          return new SmallInteger(value2 + 1);
        return new BigInteger(MAX_INT_ARR, false);
      };
      NativeBigInt.prototype.next = function() {
        return new NativeBigInt(this.value + BigInt(1));
      };
      BigInteger.prototype.prev = function() {
        var value2 = this.value;
        if (this.sign) {
          return new BigInteger(addSmall(value2, 1), true);
        }
        return subtractSmall(value2, 1, this.sign);
      };
      SmallInteger.prototype.prev = function() {
        var value2 = this.value;
        if (value2 - 1 > -MAX_INT)
          return new SmallInteger(value2 - 1);
        return new BigInteger(MAX_INT_ARR, true);
      };
      NativeBigInt.prototype.prev = function() {
        return new NativeBigInt(this.value - BigInt(1));
      };
      var powersOfTwo = [1];
      while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
        powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
      var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
      function shift_isSmall(n) {
        return Math.abs(n) <= BASE;
      }
      BigInteger.prototype.shiftLeft = function(v) {
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0)
          return this.shiftRight(-n);
        var result = this;
        if (result.isZero())
          return result;
        while (n >= powers2Length) {
          result = result.multiply(highestPower2);
          n -= powers2Length - 1;
        }
        return result.multiply(powersOfTwo[n]);
      };
      NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
      BigInteger.prototype.shiftRight = function(v) {
        var remQuo;
        var n = parseValue(v).toJSNumber();
        if (!shift_isSmall(n)) {
          throw new Error(String(n) + " is too large for shifting.");
        }
        if (n < 0)
          return this.shiftLeft(-n);
        var result = this;
        while (n >= powers2Length) {
          if (result.isZero() || result.isNegative() && result.isUnit())
            return result;
          remQuo = divModAny(result, highestPower2);
          result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
          n -= powers2Length - 1;
        }
        remQuo = divModAny(result, powersOfTwo[n]);
        return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
      };
      NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
      function bitwise(x2, y, fn) {
        y = parseValue(y);
        var xSign = x2.isNegative(), ySign = y.isNegative();
        var xRem = xSign ? x2.not() : x2, yRem = ySign ? y.not() : y;
        var xDigit = 0, yDigit = 0;
        var xDivMod = null, yDivMod = null;
        var result = [];
        while (!xRem.isZero() || !yRem.isZero()) {
          xDivMod = divModAny(xRem, highestPower2);
          xDigit = xDivMod[1].toJSNumber();
          if (xSign) {
            xDigit = highestPower2 - 1 - xDigit;
          }
          yDivMod = divModAny(yRem, highestPower2);
          yDigit = yDivMod[1].toJSNumber();
          if (ySign) {
            yDigit = highestPower2 - 1 - yDigit;
          }
          xRem = xDivMod[0];
          yRem = yDivMod[0];
          result.push(fn(xDigit, yDigit));
        }
        var sum2 = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt2(-1) : bigInt2(0);
        for (var i3 = result.length - 1; i3 >= 0; i3 -= 1) {
          sum2 = sum2.multiply(highestPower2).add(bigInt2(result[i3]));
        }
        return sum2;
      }
      BigInteger.prototype.not = function() {
        return this.negate().prev();
      };
      NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
      BigInteger.prototype.and = function(n) {
        return bitwise(this, n, function(a, b) {
          return a & b;
        });
      };
      NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
      BigInteger.prototype.or = function(n) {
        return bitwise(this, n, function(a, b) {
          return a | b;
        });
      };
      NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
      BigInteger.prototype.xor = function(n) {
        return bitwise(this, n, function(a, b) {
          return a ^ b;
        });
      };
      NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
      var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
      function roughLOB(n) {
        var v = n.value, x2 = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
        return x2 & -x2;
      }
      function integerLogarithm(value2, base) {
        if (base.compareTo(value2) <= 0) {
          var tmp = integerLogarithm(value2, base.square(base));
          var p = tmp.p;
          var e2 = tmp.e;
          var t2 = p.multiply(base);
          return t2.compareTo(value2) <= 0 ? { p: t2, e: e2 * 2 + 1 } : { p, e: e2 * 2 };
        }
        return { p: bigInt2(1), e: 0 };
      }
      BigInteger.prototype.bitLength = function() {
        var n = this;
        if (n.compareTo(bigInt2(0)) < 0) {
          n = n.negate().subtract(bigInt2(1));
        }
        if (n.compareTo(bigInt2(0)) === 0) {
          return bigInt2(0);
        }
        return bigInt2(integerLogarithm(n, bigInt2(2)).e).add(bigInt2(1));
      };
      NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
      function max3(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.greater(b) ? a : b;
      }
      function min3(a, b) {
        a = parseValue(a);
        b = parseValue(b);
        return a.lesser(b) ? a : b;
      }
      function gcd(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        if (a.equals(b))
          return a;
        if (a.isZero())
          return b;
        if (b.isZero())
          return a;
        var c = Integer[1], d, t2;
        while (a.isEven() && b.isEven()) {
          d = min3(roughLOB(a), roughLOB(b));
          a = a.divide(d);
          b = b.divide(d);
          c = c.multiply(d);
        }
        while (a.isEven()) {
          a = a.divide(roughLOB(a));
        }
        do {
          while (b.isEven()) {
            b = b.divide(roughLOB(b));
          }
          if (a.greater(b)) {
            t2 = b;
            b = a;
            a = t2;
          }
          b = b.subtract(a);
        } while (!b.isZero());
        return c.isUnit() ? a : a.multiply(c);
      }
      function lcm(a, b) {
        a = parseValue(a).abs();
        b = parseValue(b).abs();
        return a.divide(gcd(a, b)).multiply(b);
      }
      function randBetween(a, b, rng) {
        a = parseValue(a);
        b = parseValue(b);
        var usedRNG = rng || Math.random;
        var low = min3(a, b), high = max3(a, b);
        var range3 = high.subtract(low).add(1);
        if (range3.isSmall)
          return low.add(Math.floor(usedRNG() * range3));
        var digits = toBase2(range3, BASE).value;
        var result = [], restricted = true;
        for (var i3 = 0; i3 < digits.length; i3++) {
          var top5 = restricted ? digits[i3] + (i3 + 1 < digits.length ? digits[i3 + 1] / BASE : 0) : BASE;
          var digit = truncate3(usedRNG() * top5);
          result.push(digit);
          if (digit < digits[i3])
            restricted = false;
        }
        return low.add(Integer.fromArray(result, BASE, false));
      }
      var parseBase = function(text2, base, alphabet, caseSensitive) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        text2 = String(text2);
        if (!caseSensitive) {
          text2 = text2.toLowerCase();
          alphabet = alphabet.toLowerCase();
        }
        var length4 = text2.length;
        var i3;
        var absBase = Math.abs(base);
        var alphabetValues = {};
        for (i3 = 0; i3 < alphabet.length; i3++) {
          alphabetValues[alphabet[i3]] = i3;
        }
        for (i3 = 0; i3 < length4; i3++) {
          var c = text2[i3];
          if (c === "-")
            continue;
          if (c in alphabetValues) {
            if (alphabetValues[c] >= absBase) {
              if (c === "1" && absBase === 1)
                continue;
              throw new Error(c + " is not a valid digit in base " + base + ".");
            }
          }
        }
        base = parseValue(base);
        var digits = [];
        var isNegative = text2[0] === "-";
        for (i3 = isNegative ? 1 : 0; i3 < text2.length; i3++) {
          var c = text2[i3];
          if (c in alphabetValues)
            digits.push(parseValue(alphabetValues[c]));
          else if (c === "<") {
            var start = i3;
            do {
              i3++;
            } while (text2[i3] !== ">" && i3 < text2.length);
            digits.push(parseValue(text2.slice(start + 1, i3)));
          } else
            throw new Error(c + " is not a valid character");
        }
        return parseBaseFromArray(digits, base, isNegative);
      };
      function parseBaseFromArray(digits, base, isNegative) {
        var val = Integer[0], pow4 = Integer[1], i3;
        for (i3 = digits.length - 1; i3 >= 0; i3--) {
          val = val.add(digits[i3].times(pow4));
          pow4 = pow4.times(base);
        }
        return isNegative ? val.negate() : val;
      }
      function stringify2(digit, alphabet) {
        alphabet = alphabet || DEFAULT_ALPHABET;
        if (digit < alphabet.length) {
          return alphabet[digit];
        }
        return "<" + digit + ">";
      }
      function toBase2(n, base) {
        base = bigInt2(base);
        if (base.isZero()) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          throw new Error("Cannot convert nonzero numbers to base 0.");
        }
        if (base.equals(-1)) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          if (n.isNegative())
            return {
              value: [].concat.apply([], Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])),
              isNegative: false
            };
          var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
          arr.unshift([1]);
          return {
            value: [].concat.apply([], arr),
            isNegative: false
          };
        }
        var neg = false;
        if (n.isNegative() && base.isPositive()) {
          neg = true;
          n = n.abs();
        }
        if (base.isUnit()) {
          if (n.isZero())
            return { value: [0], isNegative: false };
          return {
            value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
            isNegative: neg
          };
        }
        var out = [];
        var left = n, divmod;
        while (left.isNegative() || left.compareAbs(base) >= 0) {
          divmod = left.divmod(base);
          left = divmod.quotient;
          var digit = divmod.remainder;
          if (digit.isNegative()) {
            digit = base.minus(digit).abs();
            left = left.next();
          }
          out.push(digit.toJSNumber());
        }
        out.push(left.toJSNumber());
        return { value: out.reverse(), isNegative: neg };
      }
      function toBaseString(n, base, alphabet) {
        var arr = toBase2(n, base);
        return (arr.isNegative ? "-" : "") + arr.value.map(function(x2) {
          return stringify2(x2, alphabet);
        }).join("");
      }
      BigInteger.prototype.toArray = function(radix) {
        return toBase2(this, radix);
      };
      SmallInteger.prototype.toArray = function(radix) {
        return toBase2(this, radix);
      };
      NativeBigInt.prototype.toArray = function(radix) {
        return toBase2(this, radix);
      };
      BigInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2)
          radix = 10;
        if (radix !== 10)
          return toBaseString(this, radix, alphabet);
        var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
        while (--l >= 0) {
          digit = String(v[l]);
          str += zeros.slice(digit.length) + digit;
        }
        var sign2 = this.sign ? "-" : "";
        return sign2 + str;
      };
      SmallInteger.prototype.toString = function(radix, alphabet) {
        if (radix === undefined2)
          radix = 10;
        if (radix != 10)
          return toBaseString(this, radix, alphabet);
        return String(this.value);
      };
      NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
      NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
        return this.toString();
      };
      BigInteger.prototype.valueOf = function() {
        return parseInt(this.toString(), 10);
      };
      BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
      SmallInteger.prototype.valueOf = function() {
        return this.value;
      };
      SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
      NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
        return parseInt(this.toString(), 10);
      };
      function parseStringValue(v) {
        if (isPrecise(+v)) {
          var x2 = +v;
          if (x2 === truncate3(x2))
            return supportsNativeBigInt ? new NativeBigInt(BigInt(x2)) : new SmallInteger(x2);
          throw new Error("Invalid integer: " + v);
        }
        var sign2 = v[0] === "-";
        if (sign2)
          v = v.slice(1);
        var split3 = v.split(/e/i);
        if (split3.length > 2)
          throw new Error("Invalid integer: " + split3.join("e"));
        if (split3.length === 2) {
          var exp2 = split3[1];
          if (exp2[0] === "+")
            exp2 = exp2.slice(1);
          exp2 = +exp2;
          if (exp2 !== truncate3(exp2) || !isPrecise(exp2))
            throw new Error("Invalid integer: " + exp2 + " is not a valid exponent.");
          var text2 = split3[0];
          var decimalPlace = text2.indexOf(".");
          if (decimalPlace >= 0) {
            exp2 -= text2.length - decimalPlace - 1;
            text2 = text2.slice(0, decimalPlace) + text2.slice(decimalPlace + 1);
          }
          if (exp2 < 0)
            throw new Error("Cannot include negative exponent part for integers");
          text2 += new Array(exp2 + 1).join("0");
          v = text2;
        }
        var isValid2 = /^([0-9][0-9]*)$/.test(v);
        if (!isValid2)
          throw new Error("Invalid integer: " + v);
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(sign2 ? "-" + v : v));
        }
        var r2 = [], max4 = v.length, l = LOG_BASE, min4 = max4 - l;
        while (max4 > 0) {
          r2.push(+v.slice(min4, max4));
          min4 -= l;
          if (min4 < 0)
            min4 = 0;
          max4 -= l;
        }
        trim2(r2);
        return new BigInteger(r2, sign2);
      }
      function parseNumberValue(v) {
        if (supportsNativeBigInt) {
          return new NativeBigInt(BigInt(v));
        }
        if (isPrecise(v)) {
          if (v !== truncate3(v))
            throw new Error(v + " is not an integer.");
          return new SmallInteger(v);
        }
        return parseStringValue(v.toString());
      }
      function parseValue(v) {
        if (typeof v === "number") {
          return parseNumberValue(v);
        }
        if (typeof v === "string") {
          return parseStringValue(v);
        }
        if (typeof v === "bigint") {
          return new NativeBigInt(v);
        }
        return v;
      }
      for (var i2 = 0; i2 < 1e3; i2++) {
        Integer[i2] = parseValue(i2);
        if (i2 > 0)
          Integer[-i2] = parseValue(-i2);
      }
      Integer.one = Integer[1];
      Integer.zero = Integer[0];
      Integer.minusOne = Integer[-1];
      Integer.max = max3;
      Integer.min = min3;
      Integer.gcd = gcd;
      Integer.lcm = lcm;
      Integer.isInstance = function(x2) {
        return x2 instanceof BigInteger || x2 instanceof SmallInteger || x2 instanceof NativeBigInt;
      };
      Integer.randBetween = randBetween;
      Integer.fromArray = function(digits, base, isNegative) {
        return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
      };
      return Integer;
    }();
    if (typeof module2 !== "undefined" && module2.hasOwnProperty("exports")) {
      module2.exports = bigInt2;
    }
    if (typeof define === "function" && define.amd) {
      define(function() {
        return bigInt2;
      });
    }
  }
});

// node_modules/xhr2/lib/xhr2.js
var require_xhr2 = __commonJS({
  "node_modules/xhr2/lib/xhr2.js"(exports, module2) {
    (function() {
      var InvalidStateError, NetworkError, ProgressEvent, SecurityError, SyntaxError, XMLHttpRequest, XMLHttpRequestEventTarget, XMLHttpRequestUpload, http3, https2, os, url;
      XMLHttpRequestEventTarget = function() {
        class XMLHttpRequestEventTarget2 {
          constructor() {
            this.onloadstart = null;
            this.onprogress = null;
            this.onabort = null;
            this.onerror = null;
            this.onload = null;
            this.ontimeout = null;
            this.onloadend = null;
            this._listeners = {};
          }
          addEventListener(eventType, listener) {
            var base;
            eventType = eventType.toLowerCase();
            (base = this._listeners)[eventType] || (base[eventType] = []);
            this._listeners[eventType].push(listener);
            return void 0;
          }
          removeEventListener(eventType, listener) {
            var index3;
            eventType = eventType.toLowerCase();
            if (this._listeners[eventType]) {
              index3 = this._listeners[eventType].indexOf(listener);
              if (index3 !== -1) {
                this._listeners[eventType].splice(index3, 1);
              }
            }
            return void 0;
          }
          dispatchEvent(event) {
            var eventType, j, len, listener, listeners;
            event.currentTarget = event.target = this;
            eventType = event.type;
            if (listeners = this._listeners[eventType]) {
              for (j = 0, len = listeners.length; j < len; j++) {
                listener = listeners[j];
                listener.call(this, event);
              }
            }
            if (listener = this[`on${eventType}`]) {
              listener.call(this, event);
            }
            return void 0;
          }
        }
        ;
        XMLHttpRequestEventTarget2.prototype.onloadstart = null;
        XMLHttpRequestEventTarget2.prototype.onprogress = null;
        XMLHttpRequestEventTarget2.prototype.onabort = null;
        XMLHttpRequestEventTarget2.prototype.onerror = null;
        XMLHttpRequestEventTarget2.prototype.onload = null;
        XMLHttpRequestEventTarget2.prototype.ontimeout = null;
        XMLHttpRequestEventTarget2.prototype.onloadend = null;
        return XMLHttpRequestEventTarget2;
      }.call(this);
      http3 = require("http");
      https2 = require("https");
      os = require("os");
      url = require("url");
      XMLHttpRequest = function() {
        class XMLHttpRequest2 extends XMLHttpRequestEventTarget {
          constructor(options) {
            super();
            this.onreadystatechange = null;
            this._anonymous = options && options.anon;
            this.readyState = XMLHttpRequest2.UNSENT;
            this.response = null;
            this.responseText = "";
            this.responseType = "";
            this.responseURL = "";
            this.status = 0;
            this.statusText = "";
            this.timeout = 0;
            this.upload = new XMLHttpRequestUpload(this);
            this._method = null;
            this._url = null;
            this._sync = false;
            this._headers = null;
            this._loweredHeaders = null;
            this._mimeOverride = null;
            this._request = null;
            this._response = null;
            this._responseParts = null;
            this._responseHeaders = null;
            this._aborting = null;
            this._error = null;
            this._loadedBytes = 0;
            this._totalBytes = 0;
            this._lengthComputable = false;
          }
          open(method, url2, async, user, password) {
            var xhrUrl;
            method = method.toUpperCase();
            if (method in this._restrictedMethods) {
              throw new SecurityError(`HTTP method ${method} is not allowed in XHR`);
            }
            xhrUrl = this._parseUrl(url2);
            if (async === void 0) {
              async = true;
            }
            switch (this.readyState) {
              case XMLHttpRequest2.UNSENT:
              case XMLHttpRequest2.OPENED:
              case XMLHttpRequest2.DONE:
                null;
                break;
              case XMLHttpRequest2.HEADERS_RECEIVED:
              case XMLHttpRequest2.LOADING:
                null;
            }
            this._method = method;
            this._url = xhrUrl;
            this._sync = !async;
            this._headers = {};
            this._loweredHeaders = {};
            this._mimeOverride = null;
            this._setReadyState(XMLHttpRequest2.OPENED);
            this._request = null;
            this._response = null;
            this.status = 0;
            this.statusText = "";
            this._responseParts = [];
            this._responseHeaders = null;
            this._loadedBytes = 0;
            this._totalBytes = 0;
            this._lengthComputable = false;
            return void 0;
          }
          setRequestHeader(name3, value2) {
            var loweredName;
            if (this.readyState !== XMLHttpRequest2.OPENED) {
              throw new InvalidStateError("XHR readyState must be OPENED");
            }
            loweredName = name3.toLowerCase();
            if (this._restrictedHeaders[loweredName] || /^sec\-/.test(loweredName) || /^proxy-/.test(loweredName)) {
              console.warn(`Refused to set unsafe header "${name3}"`);
              return void 0;
            }
            value2 = value2.toString();
            if (loweredName in this._loweredHeaders) {
              name3 = this._loweredHeaders[loweredName];
              this._headers[name3] = this._headers[name3] + ", " + value2;
            } else {
              this._loweredHeaders[loweredName] = name3;
              this._headers[name3] = value2;
            }
            return void 0;
          }
          send(data) {
            if (this.readyState !== XMLHttpRequest2.OPENED) {
              throw new InvalidStateError("XHR readyState must be OPENED");
            }
            if (this._request) {
              throw new InvalidStateError("send() already called");
            }
            switch (this._url.protocol) {
              case "file:":
                this._sendFile(data);
                break;
              case "http:":
              case "https:":
                this._sendHttp(data);
                break;
              default:
                throw new NetworkError(`Unsupported protocol ${this._url.protocol}`);
            }
            return void 0;
          }
          abort() {
            if (!this._request) {
              return;
            }
            this._request.abort();
            this._setError();
            this._dispatchProgress("abort");
            this._dispatchProgress("loadend");
            return void 0;
          }
          getResponseHeader(name3) {
            var loweredName;
            if (!this._responseHeaders) {
              return null;
            }
            loweredName = name3.toLowerCase();
            if (loweredName in this._responseHeaders) {
              return this._responseHeaders[loweredName];
            } else {
              return null;
            }
          }
          getAllResponseHeaders() {
            var lines, name3, value2;
            if (!this._responseHeaders) {
              return "";
            }
            lines = function() {
              var ref, results;
              ref = this._responseHeaders;
              results = [];
              for (name3 in ref) {
                value2 = ref[name3];
                results.push(`${name3}: ${value2}`);
              }
              return results;
            }.call(this);
            return lines.join("\r\n");
          }
          overrideMimeType(newMimeType) {
            if (this.readyState === XMLHttpRequest2.LOADING || this.readyState === XMLHttpRequest2.DONE) {
              throw new InvalidStateError("overrideMimeType() not allowed in LOADING or DONE");
            }
            this._mimeOverride = newMimeType.toLowerCase();
            return void 0;
          }
          nodejsSet(options) {
            var baseUrl, parsedUrl;
            if ("httpAgent" in options) {
              this.nodejsHttpAgent = options.httpAgent;
            }
            if ("httpsAgent" in options) {
              this.nodejsHttpsAgent = options.httpsAgent;
            }
            if ("baseUrl" in options) {
              baseUrl = options.baseUrl;
              if (baseUrl !== null) {
                parsedUrl = url.parse(baseUrl, false, true);
                if (!parsedUrl.protocol) {
                  throw new SyntaxError("baseUrl must be an absolute URL");
                }
              }
              this.nodejsBaseUrl = baseUrl;
            }
            return void 0;
          }
          static nodejsSet(options) {
            XMLHttpRequest2.prototype.nodejsSet(options);
            return void 0;
          }
          _setReadyState(newReadyState) {
            var event;
            this.readyState = newReadyState;
            event = new ProgressEvent("readystatechange");
            this.dispatchEvent(event);
            return void 0;
          }
          _sendFile() {
            if (this._url.method !== "GET") {
              throw new NetworkError("The file protocol only supports GET");
            }
            throw new Error("Protocol file: not implemented");
          }
          _sendHttp(data) {
            if (this._sync) {
              throw new Error("Synchronous XHR processing not implemented");
            }
            if (data != null && (this._method === "GET" || this._method === "HEAD")) {
              console.warn(`Discarding entity body for ${this._method} requests`);
              data = null;
            } else {
              data || (data = "");
            }
            this.upload._setData(data);
            this._finalizeHeaders();
            this._sendHxxpRequest();
            return void 0;
          }
          _sendHxxpRequest() {
            var agent, hxxp, request3;
            if (this._url.protocol === "http:") {
              hxxp = http3;
              agent = this.nodejsHttpAgent;
            } else {
              hxxp = https2;
              agent = this.nodejsHttpsAgent;
            }
            request3 = hxxp.request({
              hostname: this._url.hostname,
              port: this._url.port,
              path: this._url.path,
              auth: this._url.auth,
              method: this._method,
              headers: this._headers,
              agent
            });
            this._request = request3;
            if (this.timeout) {
              request3.setTimeout(this.timeout, () => {
                return this._onHttpTimeout(request3);
              });
            }
            request3.on("response", (response) => {
              return this._onHttpResponse(request3, response);
            });
            request3.on("error", (error6) => {
              return this._onHttpRequestError(request3, error6);
            });
            this.upload._startUpload(request3);
            if (this._request === request3) {
              this._dispatchProgress("loadstart");
            }
            return void 0;
          }
          _finalizeHeaders() {
            var base;
            this._headers["Connection"] = "keep-alive";
            this._headers["Host"] = this._url.host;
            if (this._anonymous) {
              this._headers["Referer"] = "about:blank";
            }
            (base = this._headers)["User-Agent"] || (base["User-Agent"] = this._userAgent);
            this.upload._finalizeHeaders(this._headers, this._loweredHeaders);
            return void 0;
          }
          _onHttpResponse(request3, response) {
            var lengthString;
            if (this._request !== request3) {
              return;
            }
            switch (response.statusCode) {
              case 301:
              case 302:
              case 303:
              case 307:
              case 308:
                this._url = this._parseUrl(response.headers["location"]);
                this._method = "GET";
                if ("content-type" in this._loweredHeaders) {
                  delete this._headers[this._loweredHeaders["content-type"]];
                  delete this._loweredHeaders["content-type"];
                }
                if ("Content-Type" in this._headers) {
                  delete this._headers["Content-Type"];
                }
                delete this._headers["Content-Length"];
                this.upload._reset();
                this._finalizeHeaders();
                this._sendHxxpRequest();
                return;
            }
            this._response = response;
            this._response.on("data", (data) => {
              return this._onHttpResponseData(response, data);
            });
            this._response.on("end", () => {
              return this._onHttpResponseEnd(response);
            });
            this._response.on("close", () => {
              return this._onHttpResponseClose(response);
            });
            this.responseURL = this._url.href.split("#")[0];
            this.status = this._response.statusCode;
            this.statusText = http3.STATUS_CODES[this.status];
            this._parseResponseHeaders(response);
            if (lengthString = this._responseHeaders["content-length"]) {
              this._totalBytes = parseInt(lengthString);
              this._lengthComputable = true;
            } else {
              this._lengthComputable = false;
            }
            return this._setReadyState(XMLHttpRequest2.HEADERS_RECEIVED);
          }
          _onHttpResponseData(response, data) {
            if (this._response !== response) {
              return;
            }
            this._responseParts.push(data);
            this._loadedBytes += data.length;
            if (this.readyState !== XMLHttpRequest2.LOADING) {
              this._setReadyState(XMLHttpRequest2.LOADING);
            }
            return this._dispatchProgress("progress");
          }
          _onHttpResponseEnd(response) {
            if (this._response !== response) {
              return;
            }
            this._parseResponse();
            this._request = null;
            this._response = null;
            this._setReadyState(XMLHttpRequest2.DONE);
            this._dispatchProgress("load");
            return this._dispatchProgress("loadend");
          }
          _onHttpResponseClose(response) {
            var request3;
            if (this._response !== response) {
              return;
            }
            request3 = this._request;
            this._setError();
            request3.abort();
            this._setReadyState(XMLHttpRequest2.DONE);
            this._dispatchProgress("error");
            return this._dispatchProgress("loadend");
          }
          _onHttpTimeout(request3) {
            if (this._request !== request3) {
              return;
            }
            this._setError();
            request3.abort();
            this._setReadyState(XMLHttpRequest2.DONE);
            this._dispatchProgress("timeout");
            return this._dispatchProgress("loadend");
          }
          _onHttpRequestError(request3, error6) {
            if (this._request !== request3) {
              return;
            }
            this._setError();
            request3.abort();
            this._setReadyState(XMLHttpRequest2.DONE);
            this._dispatchProgress("error");
            return this._dispatchProgress("loadend");
          }
          _dispatchProgress(eventType) {
            var event;
            event = new ProgressEvent(eventType);
            event.lengthComputable = this._lengthComputable;
            event.loaded = this._loadedBytes;
            event.total = this._totalBytes;
            this.dispatchEvent(event);
            return void 0;
          }
          _setError() {
            this._request = null;
            this._response = null;
            this._responseHeaders = null;
            this._responseParts = null;
            return void 0;
          }
          _parseUrl(urlString) {
            var absoluteUrlString, index3, password, user, xhrUrl;
            if (this.nodejsBaseUrl === null) {
              absoluteUrlString = urlString;
            } else {
              absoluteUrlString = url.resolve(this.nodejsBaseUrl, urlString);
            }
            xhrUrl = url.parse(absoluteUrlString, false, true);
            xhrUrl.hash = null;
            if (xhrUrl.auth && (typeof user !== "undefined" && user !== null || typeof password !== "undefined" && password !== null)) {
              index3 = xhrUrl.auth.indexOf(":");
              if (index3 === -1) {
                if (!user) {
                  user = xhrUrl.auth;
                }
              } else {
                if (!user) {
                  user = xhrUrl.substring(0, index3);
                }
                if (!password) {
                  password = xhrUrl.substring(index3 + 1);
                }
              }
            }
            if (user || password) {
              xhrUrl.auth = `${user}:${password}`;
            }
            return xhrUrl;
          }
          _parseResponseHeaders(response) {
            var loweredName, name3, ref, value2;
            this._responseHeaders = {};
            ref = response.headers;
            for (name3 in ref) {
              value2 = ref[name3];
              loweredName = name3.toLowerCase();
              if (this._privateHeaders[loweredName]) {
                continue;
              }
              if (this._mimeOverride !== null && loweredName === "content-type") {
                value2 = this._mimeOverride;
              }
              this._responseHeaders[loweredName] = value2;
            }
            if (this._mimeOverride !== null && !("content-type" in this._responseHeaders)) {
              this._responseHeaders["content-type"] = this._mimeOverride;
            }
            return void 0;
          }
          _parseResponse() {
            var arrayBuffer, buffer, i2, j, jsonError, ref, view;
            if (Buffer.concat) {
              buffer = Buffer.concat(this._responseParts);
            } else {
              buffer = this._concatBuffers(this._responseParts);
            }
            this._responseParts = null;
            switch (this.responseType) {
              case "text":
                this._parseTextResponse(buffer);
                break;
              case "json":
                this.responseText = null;
                try {
                  this.response = JSON.parse(buffer.toString("utf-8"));
                } catch (error1) {
                  jsonError = error1;
                  this.response = null;
                }
                break;
              case "buffer":
                this.responseText = null;
                this.response = buffer;
                break;
              case "arraybuffer":
                this.responseText = null;
                arrayBuffer = new ArrayBuffer(buffer.length);
                view = new Uint8Array(arrayBuffer);
                for (i2 = j = 0, ref = buffer.length; 0 <= ref ? j < ref : j > ref; i2 = 0 <= ref ? ++j : --j) {
                  view[i2] = buffer[i2];
                }
                this.response = arrayBuffer;
                break;
              default:
                this._parseTextResponse(buffer);
            }
            return void 0;
          }
          _parseTextResponse(buffer) {
            var e2;
            try {
              this.responseText = buffer.toString(this._parseResponseEncoding());
            } catch (error1) {
              e2 = error1;
              this.responseText = buffer.toString("binary");
            }
            this.response = this.responseText;
            return void 0;
          }
          _parseResponseEncoding() {
            var contentType, encoding, match2;
            encoding = null;
            if (contentType = this._responseHeaders["content-type"]) {
              if (match2 = /\;\s*charset\=(.*)$/.exec(contentType)) {
                return match2[1];
              }
            }
            return "utf-8";
          }
          _concatBuffers(buffers) {
            var buffer, j, k, len, len1, length4, target;
            if (buffers.length === 0) {
              return Buffer.alloc(0);
            }
            if (buffers.length === 1) {
              return buffers[0];
            }
            length4 = 0;
            for (j = 0, len = buffers.length; j < len; j++) {
              buffer = buffers[j];
              length4 += buffer.length;
            }
            target = Buffer.alloc(length4);
            length4 = 0;
            for (k = 0, len1 = buffers.length; k < len1; k++) {
              buffer = buffers[k];
              buffer.copy(target, length4);
              length4 += buffer.length;
            }
            return target;
          }
        }
        ;
        XMLHttpRequest2.prototype.onreadystatechange = null;
        XMLHttpRequest2.prototype.readyState = null;
        XMLHttpRequest2.prototype.response = null;
        XMLHttpRequest2.prototype.responseText = null;
        XMLHttpRequest2.prototype.responseType = null;
        XMLHttpRequest2.prototype.status = null;
        XMLHttpRequest2.prototype.timeout = null;
        XMLHttpRequest2.prototype.upload = null;
        XMLHttpRequest2.prototype.UNSENT = 0;
        XMLHttpRequest2.UNSENT = 0;
        XMLHttpRequest2.prototype.OPENED = 1;
        XMLHttpRequest2.OPENED = 1;
        XMLHttpRequest2.prototype.HEADERS_RECEIVED = 2;
        XMLHttpRequest2.HEADERS_RECEIVED = 2;
        XMLHttpRequest2.prototype.LOADING = 3;
        XMLHttpRequest2.LOADING = 3;
        XMLHttpRequest2.prototype.DONE = 4;
        XMLHttpRequest2.DONE = 4;
        XMLHttpRequest2.prototype.nodejsHttpAgent = http3.globalAgent;
        XMLHttpRequest2.prototype.nodejsHttpsAgent = https2.globalAgent;
        XMLHttpRequest2.prototype.nodejsBaseUrl = null;
        XMLHttpRequest2.prototype._restrictedMethods = {
          CONNECT: true,
          TRACE: true,
          TRACK: true
        };
        XMLHttpRequest2.prototype._restrictedHeaders = {
          "accept-charset": true,
          "accept-encoding": true,
          "access-control-request-headers": true,
          "access-control-request-method": true,
          connection: true,
          "content-length": true,
          cookie: true,
          cookie2: true,
          date: true,
          dnt: true,
          expect: true,
          host: true,
          "keep-alive": true,
          origin: true,
          referer: true,
          te: true,
          trailer: true,
          "transfer-encoding": true,
          upgrade: true,
          via: true
        };
        XMLHttpRequest2.prototype._privateHeaders = {
          "set-cookie": true,
          "set-cookie2": true
        };
        XMLHttpRequest2.prototype._userAgent = `Mozilla/5.0 (${os.type()} ${os.arch()}) node.js/${process.versions.node} v8/${process.versions.v8}`;
        return XMLHttpRequest2;
      }.call(this);
      module2.exports = XMLHttpRequest;
      XMLHttpRequest.XMLHttpRequest = XMLHttpRequest;
      SecurityError = class SecurityError extends Error {
        constructor() {
          super();
        }
      };
      XMLHttpRequest.SecurityError = SecurityError;
      InvalidStateError = class InvalidStateError extends Error {
        constructor() {
          super();
        }
      };
      InvalidStateError = class InvalidStateError extends Error {
      };
      XMLHttpRequest.InvalidStateError = InvalidStateError;
      NetworkError = class NetworkError extends Error {
        constructor() {
          super();
        }
      };
      XMLHttpRequest.SyntaxError = SyntaxError;
      SyntaxError = class SyntaxError extends Error {
        constructor() {
          super();
        }
      };
      ProgressEvent = function() {
        class ProgressEvent2 {
          constructor(type) {
            this.type = type;
            this.target = null;
            this.currentTarget = null;
            this.lengthComputable = false;
            this.loaded = 0;
            this.total = 0;
          }
        }
        ;
        ProgressEvent2.prototype.bubbles = false;
        ProgressEvent2.prototype.cancelable = false;
        ProgressEvent2.prototype.target = null;
        ProgressEvent2.prototype.loaded = null;
        ProgressEvent2.prototype.lengthComputable = null;
        ProgressEvent2.prototype.total = null;
        return ProgressEvent2;
      }.call(this);
      XMLHttpRequest.ProgressEvent = ProgressEvent;
      XMLHttpRequestUpload = class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
        constructor(request3) {
          super();
          this._request = request3;
          this._reset();
        }
        _reset() {
          this._contentType = null;
          this._body = null;
          return void 0;
        }
        _setData(data) {
          var body, i2, j, k, offset, ref, ref1, view;
          if (typeof data === "undefined" || data === null) {
            return;
          }
          if (typeof data === "string") {
            if (data.length !== 0) {
              this._contentType = "text/plain;charset=UTF-8";
            }
            this._body = Buffer.from(data, "utf8");
          } else if (Buffer.isBuffer(data)) {
            this._body = data;
          } else if (data instanceof ArrayBuffer) {
            body = Buffer.alloc(data.byteLength);
            view = new Uint8Array(data);
            for (i2 = j = 0, ref = data.byteLength; 0 <= ref ? j < ref : j > ref; i2 = 0 <= ref ? ++j : --j) {
              body[i2] = view[i2];
            }
            this._body = body;
          } else if (data.buffer && data.buffer instanceof ArrayBuffer) {
            body = Buffer.alloc(data.byteLength);
            offset = data.byteOffset;
            view = new Uint8Array(data.buffer);
            for (i2 = k = 0, ref1 = data.byteLength; 0 <= ref1 ? k < ref1 : k > ref1; i2 = 0 <= ref1 ? ++k : --k) {
              body[i2] = view[i2 + offset];
            }
            this._body = body;
          } else {
            throw new Error(`Unsupported send() data ${data}`);
          }
          return void 0;
        }
        _finalizeHeaders(headers, loweredHeaders) {
          if (this._contentType) {
            if (!("content-type" in loweredHeaders)) {
              headers["Content-Type"] = this._contentType;
            }
          }
          if (this._body) {
            headers["Content-Length"] = this._body.length.toString();
          }
          return void 0;
        }
        _startUpload(request3) {
          if (this._body) {
            request3.write(this._body);
          }
          request3.end();
          return void 0;
        }
      };
      XMLHttpRequest.XMLHttpRequestUpload = XMLHttpRequestUpload;
    }).call(exports);
  }
});

// node_modules/web-streams-polyfill/dist/ponyfill.es2018.js
var require_ponyfill_es2018 = __commonJS({
  "node_modules/web-streams-polyfill/dist/ponyfill.es2018.js"(exports, module2) {
    (function(global3, factory) {
      typeof exports === "object" && typeof module2 !== "undefined" ? factory(exports) : typeof define === "function" && define.amd ? define(["exports"], factory) : (global3 = typeof globalThis !== "undefined" ? globalThis : global3 || self, factory(global3.WebStreamsPolyfill = {}));
    })(exports, function(exports2) {
      "use strict";
      const SymbolPolyfill = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol : (description) => `Symbol(${description})`;
      function noop2() {
        return void 0;
      }
      function getGlobals() {
        if (typeof self !== "undefined") {
          return self;
        } else if (typeof window !== "undefined") {
          return window;
        } else if (typeof global !== "undefined") {
          return global;
        }
        return void 0;
      }
      const globals = getGlobals();
      function typeIsObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      const rethrowAssertionErrorRejection = noop2;
      const originalPromise = Promise;
      const originalPromiseThen = Promise.prototype.then;
      const originalPromiseResolve = Promise.resolve.bind(originalPromise);
      const originalPromiseReject = Promise.reject.bind(originalPromise);
      function newPromise(executor) {
        return new originalPromise(executor);
      }
      function promiseResolvedWith(value2) {
        return originalPromiseResolve(value2);
      }
      function promiseRejectedWith(reason) {
        return originalPromiseReject(reason);
      }
      function PerformPromiseThen(promise2, onFulfilled, onRejected) {
        return originalPromiseThen.call(promise2, onFulfilled, onRejected);
      }
      function uponPromise(promise2, onFulfilled, onRejected) {
        PerformPromiseThen(PerformPromiseThen(promise2, onFulfilled, onRejected), void 0, rethrowAssertionErrorRejection);
      }
      function uponFulfillment(promise2, onFulfilled) {
        uponPromise(promise2, onFulfilled);
      }
      function uponRejection(promise2, onRejected) {
        uponPromise(promise2, void 0, onRejected);
      }
      function transformPromiseWith(promise2, fulfillmentHandler, rejectionHandler) {
        return PerformPromiseThen(promise2, fulfillmentHandler, rejectionHandler);
      }
      function setPromiseIsHandledToTrue(promise2) {
        PerformPromiseThen(promise2, void 0, rethrowAssertionErrorRejection);
      }
      const queueMicrotask = (() => {
        const globalQueueMicrotask = globals && globals.queueMicrotask;
        if (typeof globalQueueMicrotask === "function") {
          return globalQueueMicrotask;
        }
        const resolvedPromise = promiseResolvedWith(void 0);
        return (fn) => PerformPromiseThen(resolvedPromise, fn);
      })();
      function reflectCall(F2, V, args) {
        if (typeof F2 !== "function") {
          throw new TypeError("Argument is not a function");
        }
        return Function.prototype.apply.call(F2, V, args);
      }
      function promiseCall(F2, V, args) {
        try {
          return promiseResolvedWith(reflectCall(F2, V, args));
        } catch (value2) {
          return promiseRejectedWith(value2);
        }
      }
      const QUEUE_MAX_ARRAY_SIZE = 16384;
      class SimpleQueue {
        constructor() {
          this._cursor = 0;
          this._size = 0;
          this._front = {
            _elements: [],
            _next: void 0
          };
          this._back = this._front;
          this._cursor = 0;
          this._size = 0;
        }
        get length() {
          return this._size;
        }
        push(element) {
          const oldBack = this._back;
          let newBack = oldBack;
          if (oldBack._elements.length === QUEUE_MAX_ARRAY_SIZE - 1) {
            newBack = {
              _elements: [],
              _next: void 0
            };
          }
          oldBack._elements.push(element);
          if (newBack !== oldBack) {
            this._back = newBack;
            oldBack._next = newBack;
          }
          ++this._size;
        }
        shift() {
          const oldFront = this._front;
          let newFront = oldFront;
          const oldCursor = this._cursor;
          let newCursor = oldCursor + 1;
          const elements = oldFront._elements;
          const element = elements[oldCursor];
          if (newCursor === QUEUE_MAX_ARRAY_SIZE) {
            newFront = oldFront._next;
            newCursor = 0;
          }
          --this._size;
          this._cursor = newCursor;
          if (oldFront !== newFront) {
            this._front = newFront;
          }
          elements[oldCursor] = void 0;
          return element;
        }
        forEach(callback) {
          let i2 = this._cursor;
          let node = this._front;
          let elements = node._elements;
          while (i2 !== elements.length || node._next !== void 0) {
            if (i2 === elements.length) {
              node = node._next;
              elements = node._elements;
              i2 = 0;
              if (elements.length === 0) {
                break;
              }
            }
            callback(elements[i2]);
            ++i2;
          }
        }
        peek() {
          const front = this._front;
          const cursor = this._cursor;
          return front._elements[cursor];
        }
      }
      function ReadableStreamReaderGenericInitialize(reader, stream) {
        reader._ownerReadableStream = stream;
        stream._reader = reader;
        if (stream._state === "readable") {
          defaultReaderClosedPromiseInitialize(reader);
        } else if (stream._state === "closed") {
          defaultReaderClosedPromiseInitializeAsResolved(reader);
        } else {
          defaultReaderClosedPromiseInitializeAsRejected(reader, stream._storedError);
        }
      }
      function ReadableStreamReaderGenericCancel(reader, reason) {
        const stream = reader._ownerReadableStream;
        return ReadableStreamCancel(stream, reason);
      }
      function ReadableStreamReaderGenericRelease(reader) {
        if (reader._ownerReadableStream._state === "readable") {
          defaultReaderClosedPromiseReject(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        } else {
          defaultReaderClosedPromiseResetToRejected(reader, new TypeError(`Reader was released and can no longer be used to monitor the stream's closedness`));
        }
        reader._ownerReadableStream._reader = void 0;
        reader._ownerReadableStream = void 0;
      }
      function readerLockException(name3) {
        return new TypeError("Cannot " + name3 + " a stream using a released reader");
      }
      function defaultReaderClosedPromiseInitialize(reader) {
        reader._closedPromise = newPromise((resolve2, reject) => {
          reader._closedPromise_resolve = resolve2;
          reader._closedPromise_reject = reject;
        });
      }
      function defaultReaderClosedPromiseInitializeAsRejected(reader, reason) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseReject(reader, reason);
      }
      function defaultReaderClosedPromiseInitializeAsResolved(reader) {
        defaultReaderClosedPromiseInitialize(reader);
        defaultReaderClosedPromiseResolve(reader);
      }
      function defaultReaderClosedPromiseReject(reader, reason) {
        if (reader._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(reader._closedPromise);
        reader._closedPromise_reject(reason);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      function defaultReaderClosedPromiseResetToRejected(reader, reason) {
        defaultReaderClosedPromiseInitializeAsRejected(reader, reason);
      }
      function defaultReaderClosedPromiseResolve(reader) {
        if (reader._closedPromise_resolve === void 0) {
          return;
        }
        reader._closedPromise_resolve(void 0);
        reader._closedPromise_resolve = void 0;
        reader._closedPromise_reject = void 0;
      }
      const AbortSteps = SymbolPolyfill("[[AbortSteps]]");
      const ErrorSteps = SymbolPolyfill("[[ErrorSteps]]");
      const CancelSteps = SymbolPolyfill("[[CancelSteps]]");
      const PullSteps = SymbolPolyfill("[[PullSteps]]");
      const NumberIsFinite = Number.isFinite || function(x2) {
        return typeof x2 === "number" && isFinite(x2);
      };
      const MathTrunc = Math.trunc || function(v) {
        return v < 0 ? Math.ceil(v) : Math.floor(v);
      };
      function isDictionary(x2) {
        return typeof x2 === "object" || typeof x2 === "function";
      }
      function assertDictionary(obj, context) {
        if (obj !== void 0 && !isDictionary(obj)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertFunction(x2, context) {
        if (typeof x2 !== "function") {
          throw new TypeError(`${context} is not a function.`);
        }
      }
      function isObject(x2) {
        return typeof x2 === "object" && x2 !== null || typeof x2 === "function";
      }
      function assertObject(x2, context) {
        if (!isObject(x2)) {
          throw new TypeError(`${context} is not an object.`);
        }
      }
      function assertRequiredArgument(x2, position, context) {
        if (x2 === void 0) {
          throw new TypeError(`Parameter ${position} is required in '${context}'.`);
        }
      }
      function assertRequiredField(x2, field, context) {
        if (x2 === void 0) {
          throw new TypeError(`${field} is required in '${context}'.`);
        }
      }
      function convertUnrestrictedDouble(value2) {
        return Number(value2);
      }
      function censorNegativeZero(x2) {
        return x2 === 0 ? 0 : x2;
      }
      function integerPart(x2) {
        return censorNegativeZero(MathTrunc(x2));
      }
      function convertUnsignedLongLongWithEnforceRange(value2, context) {
        const lowerBound = 0;
        const upperBound = Number.MAX_SAFE_INTEGER;
        let x2 = Number(value2);
        x2 = censorNegativeZero(x2);
        if (!NumberIsFinite(x2)) {
          throw new TypeError(`${context} is not a finite number`);
        }
        x2 = integerPart(x2);
        if (x2 < lowerBound || x2 > upperBound) {
          throw new TypeError(`${context} is outside the accepted range of ${lowerBound} to ${upperBound}, inclusive`);
        }
        if (!NumberIsFinite(x2) || x2 === 0) {
          return 0;
        }
        return x2;
      }
      function assertReadableStream(x2, context) {
        if (!IsReadableStream(x2)) {
          throw new TypeError(`${context} is not a ReadableStream.`);
        }
      }
      function AcquireReadableStreamDefaultReader(stream) {
        return new ReadableStreamDefaultReader(stream);
      }
      function ReadableStreamAddReadRequest(stream, readRequest) {
        stream._reader._readRequests.push(readRequest);
      }
      function ReadableStreamFulfillReadRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readRequest = reader._readRequests.shift();
        if (done) {
          readRequest._closeSteps();
        } else {
          readRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadRequests(stream) {
        return stream._reader._readRequests.length;
      }
      function ReadableStreamHasDefaultReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamDefaultReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamDefaultReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamDefaultReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readRequests = new SimpleQueue();
        }
        get closed() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        cancel(reason = void 0) {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read() {
          if (!IsReadableStreamDefaultReader(this)) {
            return promiseRejectedWith(defaultReaderBrandCheckException("read"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise2 = newPromise((resolve2, reject) => {
            resolvePromise = resolve2;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: () => resolvePromise({ value: void 0, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamDefaultReaderRead(this, readRequest);
          return promise2;
        }
        releaseLock() {
          if (!IsReadableStreamDefaultReader(this)) {
            throw defaultReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          if (this._readRequests.length > 0) {
            throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
          }
          ReadableStreamReaderGenericRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamDefaultReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultReader.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamDefaultReader",
          configurable: true
        });
      }
      function IsReadableStreamDefaultReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultReader;
      }
      function ReadableStreamDefaultReaderRead(reader, readRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "closed") {
          readRequest._closeSteps();
        } else if (stream._state === "errored") {
          readRequest._errorSteps(stream._storedError);
        } else {
          stream._readableStreamController[PullSteps](readRequest);
        }
      }
      function defaultReaderBrandCheckException(name3) {
        return new TypeError(`ReadableStreamDefaultReader.prototype.${name3} can only be used on a ReadableStreamDefaultReader`);
      }
      const AsyncIteratorPrototype = Object.getPrototypeOf(Object.getPrototypeOf(async function* () {
      }).prototype);
      class ReadableStreamAsyncIteratorImpl {
        constructor(reader, preventCancel) {
          this._ongoingPromise = void 0;
          this._isFinished = false;
          this._reader = reader;
          this._preventCancel = preventCancel;
        }
        next() {
          const nextSteps = () => this._nextSteps();
          this._ongoingPromise = this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, nextSteps, nextSteps) : nextSteps();
          return this._ongoingPromise;
        }
        return(value2) {
          const returnSteps = () => this._returnSteps(value2);
          return this._ongoingPromise ? transformPromiseWith(this._ongoingPromise, returnSteps, returnSteps) : returnSteps();
        }
        _nextSteps() {
          if (this._isFinished) {
            return Promise.resolve({ value: void 0, done: true });
          }
          const reader = this._reader;
          if (reader._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("iterate"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise2 = newPromise((resolve2, reject) => {
            resolvePromise = resolve2;
            rejectPromise = reject;
          });
          const readRequest = {
            _chunkSteps: (chunk) => {
              this._ongoingPromise = void 0;
              queueMicrotask(() => resolvePromise({ value: chunk, done: false }));
            },
            _closeSteps: () => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              resolvePromise({ value: void 0, done: true });
            },
            _errorSteps: (reason) => {
              this._ongoingPromise = void 0;
              this._isFinished = true;
              ReadableStreamReaderGenericRelease(reader);
              rejectPromise(reason);
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promise2;
        }
        _returnSteps(value2) {
          if (this._isFinished) {
            return Promise.resolve({ value: value2, done: true });
          }
          this._isFinished = true;
          const reader = this._reader;
          if (reader._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("finish iterating"));
          }
          if (!this._preventCancel) {
            const result = ReadableStreamReaderGenericCancel(reader, value2);
            ReadableStreamReaderGenericRelease(reader);
            return transformPromiseWith(result, () => ({ value: value2, done: true }));
          }
          ReadableStreamReaderGenericRelease(reader);
          return promiseResolvedWith({ value: value2, done: true });
        }
      }
      const ReadableStreamAsyncIteratorPrototype = {
        next() {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("next"));
          }
          return this._asyncIteratorImpl.next();
        },
        return(value2) {
          if (!IsReadableStreamAsyncIterator(this)) {
            return promiseRejectedWith(streamAsyncIteratorBrandCheckException("return"));
          }
          return this._asyncIteratorImpl.return(value2);
        }
      };
      if (AsyncIteratorPrototype !== void 0) {
        Object.setPrototypeOf(ReadableStreamAsyncIteratorPrototype, AsyncIteratorPrototype);
      }
      function AcquireReadableStreamAsyncIterator(stream, preventCancel) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        const impl = new ReadableStreamAsyncIteratorImpl(reader, preventCancel);
        const iterator2 = Object.create(ReadableStreamAsyncIteratorPrototype);
        iterator2._asyncIteratorImpl = impl;
        return iterator2;
      }
      function IsReadableStreamAsyncIterator(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_asyncIteratorImpl")) {
          return false;
        }
        try {
          return x2._asyncIteratorImpl instanceof ReadableStreamAsyncIteratorImpl;
        } catch (_a) {
          return false;
        }
      }
      function streamAsyncIteratorBrandCheckException(name3) {
        return new TypeError(`ReadableStreamAsyncIterator.${name3} can only be used on a ReadableSteamAsyncIterator`);
      }
      const NumberIsNaN = Number.isNaN || function(x2) {
        return x2 !== x2;
      };
      function CreateArrayFromList(elements) {
        return elements.slice();
      }
      function CopyDataBlockBytes(dest, destOffset, src, srcOffset, n) {
        new Uint8Array(dest).set(new Uint8Array(src, srcOffset, n), destOffset);
      }
      function TransferArrayBuffer(O) {
        return O;
      }
      function IsDetachedBuffer(O) {
        return false;
      }
      function ArrayBufferSlice(buffer, begin, end2) {
        if (buffer.slice) {
          return buffer.slice(begin, end2);
        }
        const length4 = end2 - begin;
        const slice6 = new ArrayBuffer(length4);
        CopyDataBlockBytes(slice6, 0, buffer, begin, length4);
        return slice6;
      }
      function IsNonNegativeNumber(v) {
        if (typeof v !== "number") {
          return false;
        }
        if (NumberIsNaN(v)) {
          return false;
        }
        if (v < 0) {
          return false;
        }
        return true;
      }
      function CloneAsUint8Array(O) {
        const buffer = ArrayBufferSlice(O.buffer, O.byteOffset, O.byteOffset + O.byteLength);
        return new Uint8Array(buffer);
      }
      function DequeueValue(container) {
        const pair = container._queue.shift();
        container._queueTotalSize -= pair.size;
        if (container._queueTotalSize < 0) {
          container._queueTotalSize = 0;
        }
        return pair.value;
      }
      function EnqueueValueWithSize(container, value2, size5) {
        if (!IsNonNegativeNumber(size5) || size5 === Infinity) {
          throw new RangeError("Size must be a finite, non-NaN, non-negative number.");
        }
        container._queue.push({ value: value2, size: size5 });
        container._queueTotalSize += size5;
      }
      function PeekQueueValue(container) {
        const pair = container._queue.peek();
        return pair.value;
      }
      function ResetQueue(container) {
        container._queue = new SimpleQueue();
        container._queueTotalSize = 0;
      }
      class ReadableStreamBYOBRequest {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get view() {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("view");
          }
          return this._view;
        }
        respond(bytesWritten) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respond");
          }
          assertRequiredArgument(bytesWritten, 1, "respond");
          bytesWritten = convertUnsignedLongLongWithEnforceRange(bytesWritten, "First parameter");
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(this._view.buffer))
            ;
          ReadableByteStreamControllerRespond(this._associatedReadableByteStreamController, bytesWritten);
        }
        respondWithNewView(view) {
          if (!IsReadableStreamBYOBRequest(this)) {
            throw byobRequestBrandCheckException("respondWithNewView");
          }
          assertRequiredArgument(view, 1, "respondWithNewView");
          if (!ArrayBuffer.isView(view)) {
            throw new TypeError("You can only respond with array buffer views");
          }
          if (this._associatedReadableByteStreamController === void 0) {
            throw new TypeError("This BYOB request has been invalidated");
          }
          if (IsDetachedBuffer(view.buffer))
            ;
          ReadableByteStreamControllerRespondWithNewView(this._associatedReadableByteStreamController, view);
        }
      }
      Object.defineProperties(ReadableStreamBYOBRequest.prototype, {
        respond: { enumerable: true },
        respondWithNewView: { enumerable: true },
        view: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBRequest.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamBYOBRequest",
          configurable: true
        });
      }
      class ReadableByteStreamController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get byobRequest() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("byobRequest");
          }
          return ReadableByteStreamControllerGetBYOBRequest(this);
        }
        get desiredSize() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("desiredSize");
          }
          return ReadableByteStreamControllerGetDesiredSize(this);
        }
        close() {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("close");
          }
          if (this._closeRequested) {
            throw new TypeError("The stream has already been closed; do not close it again!");
          }
          const state2 = this._controlledReadableByteStream._state;
          if (state2 !== "readable") {
            throw new TypeError(`The stream (in ${state2} state) is not in the readable state and cannot be closed`);
          }
          ReadableByteStreamControllerClose(this);
        }
        enqueue(chunk) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("enqueue");
          }
          assertRequiredArgument(chunk, 1, "enqueue");
          if (!ArrayBuffer.isView(chunk)) {
            throw new TypeError("chunk must be an array buffer view");
          }
          if (chunk.byteLength === 0) {
            throw new TypeError("chunk must have non-zero byteLength");
          }
          if (chunk.buffer.byteLength === 0) {
            throw new TypeError(`chunk's buffer must have non-zero byteLength`);
          }
          if (this._closeRequested) {
            throw new TypeError("stream is closed or draining");
          }
          const state2 = this._controlledReadableByteStream._state;
          if (state2 !== "readable") {
            throw new TypeError(`The stream (in ${state2} state) is not in the readable state and cannot be enqueued to`);
          }
          ReadableByteStreamControllerEnqueue(this, chunk);
        }
        error(e2 = void 0) {
          if (!IsReadableByteStreamController(this)) {
            throw byteStreamControllerBrandCheckException("error");
          }
          ReadableByteStreamControllerError(this, e2);
        }
        [CancelSteps](reason) {
          ReadableByteStreamControllerClearPendingPullIntos(this);
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableByteStreamControllerClearAlgorithms(this);
          return result;
        }
        [PullSteps](readRequest) {
          const stream = this._controlledReadableByteStream;
          if (this._queueTotalSize > 0) {
            const entry = this._queue.shift();
            this._queueTotalSize -= entry.byteLength;
            ReadableByteStreamControllerHandleQueueDrain(this);
            const view = new Uint8Array(entry.buffer, entry.byteOffset, entry.byteLength);
            readRequest._chunkSteps(view);
            return;
          }
          const autoAllocateChunkSize = this._autoAllocateChunkSize;
          if (autoAllocateChunkSize !== void 0) {
            let buffer;
            try {
              buffer = new ArrayBuffer(autoAllocateChunkSize);
            } catch (bufferE) {
              readRequest._errorSteps(bufferE);
              return;
            }
            const pullIntoDescriptor = {
              buffer,
              bufferByteLength: autoAllocateChunkSize,
              byteOffset: 0,
              byteLength: autoAllocateChunkSize,
              bytesFilled: 0,
              elementSize: 1,
              viewConstructor: Uint8Array,
              readerType: "default"
            };
            this._pendingPullIntos.push(pullIntoDescriptor);
          }
          ReadableStreamAddReadRequest(stream, readRequest);
          ReadableByteStreamControllerCallPullIfNeeded(this);
        }
      }
      Object.defineProperties(ReadableByteStreamController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        byobRequest: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableByteStreamController.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableByteStreamController",
          configurable: true
        });
      }
      function IsReadableByteStreamController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableByteStream")) {
          return false;
        }
        return x2 instanceof ReadableByteStreamController;
      }
      function IsReadableStreamBYOBRequest(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_associatedReadableByteStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBRequest;
      }
      function ReadableByteStreamControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableByteStreamControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableByteStreamControllerCallPullIfNeeded(controller);
          }
        }, (e2) => {
          ReadableByteStreamControllerError(controller, e2);
        });
      }
      function ReadableByteStreamControllerClearPendingPullIntos(controller) {
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        controller._pendingPullIntos = new SimpleQueue();
      }
      function ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor) {
        let done = false;
        if (stream._state === "closed") {
          done = true;
        }
        const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
        if (pullIntoDescriptor.readerType === "default") {
          ReadableStreamFulfillReadRequest(stream, filledView, done);
        } else {
          ReadableStreamFulfillReadIntoRequest(stream, filledView, done);
        }
      }
      function ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor) {
        const bytesFilled = pullIntoDescriptor.bytesFilled;
        const elementSize = pullIntoDescriptor.elementSize;
        return new pullIntoDescriptor.viewConstructor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, bytesFilled / elementSize);
      }
      function ReadableByteStreamControllerEnqueueChunkToQueue(controller, buffer, byteOffset, byteLength) {
        controller._queue.push({ buffer, byteOffset, byteLength });
        controller._queueTotalSize += byteLength;
      }
      function ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor) {
        const elementSize = pullIntoDescriptor.elementSize;
        const currentAlignedBytes = pullIntoDescriptor.bytesFilled - pullIntoDescriptor.bytesFilled % elementSize;
        const maxBytesToCopy = Math.min(controller._queueTotalSize, pullIntoDescriptor.byteLength - pullIntoDescriptor.bytesFilled);
        const maxBytesFilled = pullIntoDescriptor.bytesFilled + maxBytesToCopy;
        const maxAlignedBytes = maxBytesFilled - maxBytesFilled % elementSize;
        let totalBytesToCopyRemaining = maxBytesToCopy;
        let ready = false;
        if (maxAlignedBytes > currentAlignedBytes) {
          totalBytesToCopyRemaining = maxAlignedBytes - pullIntoDescriptor.bytesFilled;
          ready = true;
        }
        const queue = controller._queue;
        while (totalBytesToCopyRemaining > 0) {
          const headOfQueue = queue.peek();
          const bytesToCopy = Math.min(totalBytesToCopyRemaining, headOfQueue.byteLength);
          const destStart = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          CopyDataBlockBytes(pullIntoDescriptor.buffer, destStart, headOfQueue.buffer, headOfQueue.byteOffset, bytesToCopy);
          if (headOfQueue.byteLength === bytesToCopy) {
            queue.shift();
          } else {
            headOfQueue.byteOffset += bytesToCopy;
            headOfQueue.byteLength -= bytesToCopy;
          }
          controller._queueTotalSize -= bytesToCopy;
          ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesToCopy, pullIntoDescriptor);
          totalBytesToCopyRemaining -= bytesToCopy;
        }
        return ready;
      }
      function ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, size5, pullIntoDescriptor) {
        pullIntoDescriptor.bytesFilled += size5;
      }
      function ReadableByteStreamControllerHandleQueueDrain(controller) {
        if (controller._queueTotalSize === 0 && controller._closeRequested) {
          ReadableByteStreamControllerClearAlgorithms(controller);
          ReadableStreamClose(controller._controlledReadableByteStream);
        } else {
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }
      }
      function ReadableByteStreamControllerInvalidateBYOBRequest(controller) {
        if (controller._byobRequest === null) {
          return;
        }
        controller._byobRequest._associatedReadableByteStreamController = void 0;
        controller._byobRequest._view = null;
        controller._byobRequest = null;
      }
      function ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller) {
        while (controller._pendingPullIntos.length > 0) {
          if (controller._queueTotalSize === 0) {
            return;
          }
          const pullIntoDescriptor = controller._pendingPullIntos.peek();
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerPullInto(controller, view, readIntoRequest) {
        const stream = controller._controlledReadableByteStream;
        let elementSize = 1;
        if (view.constructor !== DataView) {
          elementSize = view.constructor.BYTES_PER_ELEMENT;
        }
        const ctor = view.constructor;
        const buffer = TransferArrayBuffer(view.buffer);
        const pullIntoDescriptor = {
          buffer,
          bufferByteLength: buffer.byteLength,
          byteOffset: view.byteOffset,
          byteLength: view.byteLength,
          bytesFilled: 0,
          elementSize,
          viewConstructor: ctor,
          readerType: "byob"
        };
        if (controller._pendingPullIntos.length > 0) {
          controller._pendingPullIntos.push(pullIntoDescriptor);
          ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
          return;
        }
        if (stream._state === "closed") {
          const emptyView = new ctor(pullIntoDescriptor.buffer, pullIntoDescriptor.byteOffset, 0);
          readIntoRequest._closeSteps(emptyView);
          return;
        }
        if (controller._queueTotalSize > 0) {
          if (ReadableByteStreamControllerFillPullIntoDescriptorFromQueue(controller, pullIntoDescriptor)) {
            const filledView = ReadableByteStreamControllerConvertPullIntoDescriptor(pullIntoDescriptor);
            ReadableByteStreamControllerHandleQueueDrain(controller);
            readIntoRequest._chunkSteps(filledView);
            return;
          }
          if (controller._closeRequested) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            readIntoRequest._errorSteps(e2);
            return;
          }
        }
        controller._pendingPullIntos.push(pullIntoDescriptor);
        ReadableStreamAddReadIntoRequest(stream, readIntoRequest);
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerRespondInClosedState(controller, firstDescriptor) {
        const stream = controller._controlledReadableByteStream;
        if (ReadableStreamHasBYOBReader(stream)) {
          while (ReadableStreamGetNumReadIntoRequests(stream) > 0) {
            const pullIntoDescriptor = ReadableByteStreamControllerShiftPendingPullInto(controller);
            ReadableByteStreamControllerCommitPullIntoDescriptor(stream, pullIntoDescriptor);
          }
        }
      }
      function ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, pullIntoDescriptor) {
        ReadableByteStreamControllerFillHeadPullIntoDescriptor(controller, bytesWritten, pullIntoDescriptor);
        if (pullIntoDescriptor.bytesFilled < pullIntoDescriptor.elementSize) {
          return;
        }
        ReadableByteStreamControllerShiftPendingPullInto(controller);
        const remainderSize = pullIntoDescriptor.bytesFilled % pullIntoDescriptor.elementSize;
        if (remainderSize > 0) {
          const end2 = pullIntoDescriptor.byteOffset + pullIntoDescriptor.bytesFilled;
          const remainder2 = ArrayBufferSlice(pullIntoDescriptor.buffer, end2 - remainderSize, end2);
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, remainder2, 0, remainder2.byteLength);
        }
        pullIntoDescriptor.bytesFilled -= remainderSize;
        ReadableByteStreamControllerCommitPullIntoDescriptor(controller._controlledReadableByteStream, pullIntoDescriptor);
        ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
      }
      function ReadableByteStreamControllerRespondInternal(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        const state2 = controller._controlledReadableByteStream._state;
        if (state2 === "closed") {
          ReadableByteStreamControllerRespondInClosedState(controller);
        } else {
          ReadableByteStreamControllerRespondInReadableState(controller, bytesWritten, firstDescriptor);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerShiftPendingPullInto(controller) {
        const descriptor = controller._pendingPullIntos.shift();
        return descriptor;
      }
      function ReadableByteStreamControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return false;
        }
        if (controller._closeRequested) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (ReadableStreamHasDefaultReader(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        if (ReadableStreamHasBYOBReader(stream) && ReadableStreamGetNumReadIntoRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableByteStreamControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableByteStreamControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
      }
      function ReadableByteStreamControllerClose(controller) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        if (controller._queueTotalSize > 0) {
          controller._closeRequested = true;
          return;
        }
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (firstPendingPullInto.bytesFilled > 0) {
            const e2 = new TypeError("Insufficient bytes to fill elements in the given buffer");
            ReadableByteStreamControllerError(controller, e2);
            throw e2;
          }
        }
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamClose(stream);
      }
      function ReadableByteStreamControllerEnqueue(controller, chunk) {
        const stream = controller._controlledReadableByteStream;
        if (controller._closeRequested || stream._state !== "readable") {
          return;
        }
        const buffer = chunk.buffer;
        const byteOffset = chunk.byteOffset;
        const byteLength = chunk.byteLength;
        const transferredBuffer = TransferArrayBuffer(buffer);
        if (controller._pendingPullIntos.length > 0) {
          const firstPendingPullInto = controller._pendingPullIntos.peek();
          if (IsDetachedBuffer(firstPendingPullInto.buffer))
            ;
          firstPendingPullInto.buffer = TransferArrayBuffer(firstPendingPullInto.buffer);
        }
        ReadableByteStreamControllerInvalidateBYOBRequest(controller);
        if (ReadableStreamHasDefaultReader(stream)) {
          if (ReadableStreamGetNumReadRequests(stream) === 0) {
            ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          } else {
            if (controller._pendingPullIntos.length > 0) {
              ReadableByteStreamControllerShiftPendingPullInto(controller);
            }
            const transferredView = new Uint8Array(transferredBuffer, byteOffset, byteLength);
            ReadableStreamFulfillReadRequest(stream, transferredView, false);
          }
        } else if (ReadableStreamHasBYOBReader(stream)) {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
          ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue(controller);
        } else {
          ReadableByteStreamControllerEnqueueChunkToQueue(controller, transferredBuffer, byteOffset, byteLength);
        }
        ReadableByteStreamControllerCallPullIfNeeded(controller);
      }
      function ReadableByteStreamControllerError(controller, e2) {
        const stream = controller._controlledReadableByteStream;
        if (stream._state !== "readable") {
          return;
        }
        ReadableByteStreamControllerClearPendingPullIntos(controller);
        ResetQueue(controller);
        ReadableByteStreamControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableByteStreamControllerGetBYOBRequest(controller) {
        if (controller._byobRequest === null && controller._pendingPullIntos.length > 0) {
          const firstDescriptor = controller._pendingPullIntos.peek();
          const view = new Uint8Array(firstDescriptor.buffer, firstDescriptor.byteOffset + firstDescriptor.bytesFilled, firstDescriptor.byteLength - firstDescriptor.bytesFilled);
          const byobRequest = Object.create(ReadableStreamBYOBRequest.prototype);
          SetUpReadableStreamBYOBRequest(byobRequest, controller, view);
          controller._byobRequest = byobRequest;
        }
        return controller._byobRequest;
      }
      function ReadableByteStreamControllerGetDesiredSize(controller) {
        const state2 = controller._controlledReadableByteStream._state;
        if (state2 === "errored") {
          return null;
        }
        if (state2 === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableByteStreamControllerRespond(controller, bytesWritten) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state2 = controller._controlledReadableByteStream._state;
        if (state2 === "closed") {
          if (bytesWritten !== 0) {
            throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream");
          }
        } else {
          if (bytesWritten === 0) {
            throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");
          }
          if (firstDescriptor.bytesFilled + bytesWritten > firstDescriptor.byteLength) {
            throw new RangeError("bytesWritten out of range");
          }
        }
        firstDescriptor.buffer = TransferArrayBuffer(firstDescriptor.buffer);
        ReadableByteStreamControllerRespondInternal(controller, bytesWritten);
      }
      function ReadableByteStreamControllerRespondWithNewView(controller, view) {
        const firstDescriptor = controller._pendingPullIntos.peek();
        const state2 = controller._controlledReadableByteStream._state;
        if (state2 === "closed") {
          if (view.byteLength !== 0) {
            throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream");
          }
        } else {
          if (view.byteLength === 0) {
            throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");
          }
        }
        if (firstDescriptor.byteOffset + firstDescriptor.bytesFilled !== view.byteOffset) {
          throw new RangeError("The region specified by view does not match byobRequest");
        }
        if (firstDescriptor.bufferByteLength !== view.buffer.byteLength) {
          throw new RangeError("The buffer of view has different capacity than byobRequest");
        }
        if (firstDescriptor.bytesFilled + view.byteLength > firstDescriptor.byteLength) {
          throw new RangeError("The region specified by view is larger than byobRequest");
        }
        const viewByteLength = view.byteLength;
        firstDescriptor.buffer = TransferArrayBuffer(view.buffer);
        ReadableByteStreamControllerRespondInternal(controller, viewByteLength);
      }
      function SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize) {
        controller._controlledReadableByteStream = stream;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._byobRequest = null;
        controller._queue = controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._closeRequested = false;
        controller._started = false;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        controller._autoAllocateChunkSize = autoAllocateChunkSize;
        controller._pendingPullIntos = new SimpleQueue();
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableByteStreamControllerCallPullIfNeeded(controller);
        }, (r2) => {
          ReadableByteStreamControllerError(controller, r2);
        });
      }
      function SetUpReadableByteStreamControllerFromUnderlyingSource(stream, underlyingByteSource, highWaterMark) {
        const controller = Object.create(ReadableByteStreamController.prototype);
        let startAlgorithm = () => void 0;
        let pullAlgorithm = () => promiseResolvedWith(void 0);
        let cancelAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingByteSource.start !== void 0) {
          startAlgorithm = () => underlyingByteSource.start(controller);
        }
        if (underlyingByteSource.pull !== void 0) {
          pullAlgorithm = () => underlyingByteSource.pull(controller);
        }
        if (underlyingByteSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingByteSource.cancel(reason);
        }
        const autoAllocateChunkSize = underlyingByteSource.autoAllocateChunkSize;
        if (autoAllocateChunkSize === 0) {
          throw new TypeError("autoAllocateChunkSize must be greater than 0");
        }
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, autoAllocateChunkSize);
      }
      function SetUpReadableStreamBYOBRequest(request3, controller, view) {
        request3._associatedReadableByteStreamController = controller;
        request3._view = view;
      }
      function byobRequestBrandCheckException(name3) {
        return new TypeError(`ReadableStreamBYOBRequest.prototype.${name3} can only be used on a ReadableStreamBYOBRequest`);
      }
      function byteStreamControllerBrandCheckException(name3) {
        return new TypeError(`ReadableByteStreamController.prototype.${name3} can only be used on a ReadableByteStreamController`);
      }
      function AcquireReadableStreamBYOBReader(stream) {
        return new ReadableStreamBYOBReader(stream);
      }
      function ReadableStreamAddReadIntoRequest(stream, readIntoRequest) {
        stream._reader._readIntoRequests.push(readIntoRequest);
      }
      function ReadableStreamFulfillReadIntoRequest(stream, chunk, done) {
        const reader = stream._reader;
        const readIntoRequest = reader._readIntoRequests.shift();
        if (done) {
          readIntoRequest._closeSteps(chunk);
        } else {
          readIntoRequest._chunkSteps(chunk);
        }
      }
      function ReadableStreamGetNumReadIntoRequests(stream) {
        return stream._reader._readIntoRequests.length;
      }
      function ReadableStreamHasBYOBReader(stream) {
        const reader = stream._reader;
        if (reader === void 0) {
          return false;
        }
        if (!IsReadableStreamBYOBReader(reader)) {
          return false;
        }
        return true;
      }
      class ReadableStreamBYOBReader {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "ReadableStreamBYOBReader");
          assertReadableStream(stream, "First parameter");
          if (IsReadableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive reading by another reader");
          }
          if (!IsReadableByteStreamController(stream._readableStreamController)) {
            throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");
          }
          ReadableStreamReaderGenericInitialize(this, stream);
          this._readIntoRequests = new SimpleQueue();
        }
        get closed() {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        cancel(reason = void 0) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("cancel"));
          }
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("cancel"));
          }
          return ReadableStreamReaderGenericCancel(this, reason);
        }
        read(view) {
          if (!IsReadableStreamBYOBReader(this)) {
            return promiseRejectedWith(byobReaderBrandCheckException("read"));
          }
          if (!ArrayBuffer.isView(view)) {
            return promiseRejectedWith(new TypeError("view must be an array buffer view"));
          }
          if (view.byteLength === 0) {
            return promiseRejectedWith(new TypeError("view must have non-zero byteLength"));
          }
          if (view.buffer.byteLength === 0) {
            return promiseRejectedWith(new TypeError(`view's buffer must have non-zero byteLength`));
          }
          if (IsDetachedBuffer(view.buffer))
            ;
          if (this._ownerReadableStream === void 0) {
            return promiseRejectedWith(readerLockException("read from"));
          }
          let resolvePromise;
          let rejectPromise;
          const promise2 = newPromise((resolve2, reject) => {
            resolvePromise = resolve2;
            rejectPromise = reject;
          });
          const readIntoRequest = {
            _chunkSteps: (chunk) => resolvePromise({ value: chunk, done: false }),
            _closeSteps: (chunk) => resolvePromise({ value: chunk, done: true }),
            _errorSteps: (e2) => rejectPromise(e2)
          };
          ReadableStreamBYOBReaderRead(this, view, readIntoRequest);
          return promise2;
        }
        releaseLock() {
          if (!IsReadableStreamBYOBReader(this)) {
            throw byobReaderBrandCheckException("releaseLock");
          }
          if (this._ownerReadableStream === void 0) {
            return;
          }
          if (this._readIntoRequests.length > 0) {
            throw new TypeError("Tried to release a reader lock when that reader has pending read() calls un-settled");
          }
          ReadableStreamReaderGenericRelease(this);
        }
      }
      Object.defineProperties(ReadableStreamBYOBReader.prototype, {
        cancel: { enumerable: true },
        read: { enumerable: true },
        releaseLock: { enumerable: true },
        closed: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamBYOBReader.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamBYOBReader",
          configurable: true
        });
      }
      function IsReadableStreamBYOBReader(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readIntoRequests")) {
          return false;
        }
        return x2 instanceof ReadableStreamBYOBReader;
      }
      function ReadableStreamBYOBReaderRead(reader, view, readIntoRequest) {
        const stream = reader._ownerReadableStream;
        stream._disturbed = true;
        if (stream._state === "errored") {
          readIntoRequest._errorSteps(stream._storedError);
        } else {
          ReadableByteStreamControllerPullInto(stream._readableStreamController, view, readIntoRequest);
        }
      }
      function byobReaderBrandCheckException(name3) {
        return new TypeError(`ReadableStreamBYOBReader.prototype.${name3} can only be used on a ReadableStreamBYOBReader`);
      }
      function ExtractHighWaterMark(strategy, defaultHWM) {
        const { highWaterMark } = strategy;
        if (highWaterMark === void 0) {
          return defaultHWM;
        }
        if (NumberIsNaN(highWaterMark) || highWaterMark < 0) {
          throw new RangeError("Invalid highWaterMark");
        }
        return highWaterMark;
      }
      function ExtractSizeAlgorithm(strategy) {
        const { size: size5 } = strategy;
        if (!size5) {
          return () => 1;
        }
        return size5;
      }
      function convertQueuingStrategy(init3, context) {
        assertDictionary(init3, context);
        const highWaterMark = init3 === null || init3 === void 0 ? void 0 : init3.highWaterMark;
        const size5 = init3 === null || init3 === void 0 ? void 0 : init3.size;
        return {
          highWaterMark: highWaterMark === void 0 ? void 0 : convertUnrestrictedDouble(highWaterMark),
          size: size5 === void 0 ? void 0 : convertQueuingStrategySize(size5, `${context} has member 'size' that`)
        };
      }
      function convertQueuingStrategySize(fn, context) {
        assertFunction(fn, context);
        return (chunk) => convertUnrestrictedDouble(fn(chunk));
      }
      function convertUnderlyingSink(original, context) {
        assertDictionary(original, context);
        const abort = original === null || original === void 0 ? void 0 : original.abort;
        const close3 = original === null || original === void 0 ? void 0 : original.close;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        const write8 = original === null || original === void 0 ? void 0 : original.write;
        return {
          abort: abort === void 0 ? void 0 : convertUnderlyingSinkAbortCallback(abort, original, `${context} has member 'abort' that`),
          close: close3 === void 0 ? void 0 : convertUnderlyingSinkCloseCallback(close3, original, `${context} has member 'close' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSinkStartCallback(start, original, `${context} has member 'start' that`),
          write: write8 === void 0 ? void 0 : convertUnderlyingSinkWriteCallback(write8, original, `${context} has member 'write' that`),
          type
        };
      }
      function convertUnderlyingSinkAbortCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSinkCloseCallback(fn, original, context) {
        assertFunction(fn, context);
        return () => promiseCall(fn, original, []);
      }
      function convertUnderlyingSinkStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertUnderlyingSinkWriteCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      function assertWritableStream(x2, context) {
        if (!IsWritableStream(x2)) {
          throw new TypeError(`${context} is not a WritableStream.`);
        }
      }
      function isAbortSignal2(value2) {
        if (typeof value2 !== "object" || value2 === null) {
          return false;
        }
        try {
          return typeof value2.aborted === "boolean";
        } catch (_a) {
          return false;
        }
      }
      const supportsAbortController = typeof AbortController === "function";
      function createAbortController() {
        if (supportsAbortController) {
          return new AbortController();
        }
        return void 0;
      }
      class WritableStream {
        constructor(rawUnderlyingSink = {}, rawStrategy = {}) {
          if (rawUnderlyingSink === void 0) {
            rawUnderlyingSink = null;
          } else {
            assertObject(rawUnderlyingSink, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSink = convertUnderlyingSink(rawUnderlyingSink, "First parameter");
          InitializeWritableStream(this);
          const type = underlyingSink.type;
          if (type !== void 0) {
            throw new RangeError("Invalid type is specified");
          }
          const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
          const highWaterMark = ExtractHighWaterMark(strategy, 1);
          SetUpWritableStreamDefaultControllerFromUnderlyingSink(this, underlyingSink, highWaterMark, sizeAlgorithm);
        }
        get locked() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("locked");
          }
          return IsWritableStreamLocked(this);
        }
        abort(reason = void 0) {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("abort"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot abort a stream that already has a writer"));
          }
          return WritableStreamAbort(this, reason);
        }
        close() {
          if (!IsWritableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$2("close"));
          }
          if (IsWritableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot close a stream that already has a writer"));
          }
          if (WritableStreamCloseQueuedOrInFlight(this)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamClose(this);
        }
        getWriter() {
          if (!IsWritableStream(this)) {
            throw streamBrandCheckException$2("getWriter");
          }
          return AcquireWritableStreamDefaultWriter(this);
        }
      }
      Object.defineProperties(WritableStream.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        getWriter: { enumerable: true },
        locked: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStream.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStream",
          configurable: true
        });
      }
      function AcquireWritableStreamDefaultWriter(stream) {
        return new WritableStreamDefaultWriter(stream);
      }
      function CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(WritableStream.prototype);
        InitializeWritableStream(stream);
        const controller = Object.create(WritableStreamDefaultController.prototype);
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function InitializeWritableStream(stream) {
        stream._state = "writable";
        stream._storedError = void 0;
        stream._writer = void 0;
        stream._writableStreamController = void 0;
        stream._writeRequests = new SimpleQueue();
        stream._inFlightWriteRequest = void 0;
        stream._closeRequest = void 0;
        stream._inFlightCloseRequest = void 0;
        stream._pendingAbortRequest = void 0;
        stream._backpressure = false;
      }
      function IsWritableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_writableStreamController")) {
          return false;
        }
        return x2 instanceof WritableStream;
      }
      function IsWritableStreamLocked(stream) {
        if (stream._writer === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamAbort(stream, reason) {
        var _a;
        if (stream._state === "closed" || stream._state === "errored") {
          return promiseResolvedWith(void 0);
        }
        stream._writableStreamController._abortReason = reason;
        (_a = stream._writableStreamController._abortController) === null || _a === void 0 ? void 0 : _a.abort();
        const state2 = stream._state;
        if (state2 === "closed" || state2 === "errored") {
          return promiseResolvedWith(void 0);
        }
        if (stream._pendingAbortRequest !== void 0) {
          return stream._pendingAbortRequest._promise;
        }
        let wasAlreadyErroring = false;
        if (state2 === "erroring") {
          wasAlreadyErroring = true;
          reason = void 0;
        }
        const promise2 = newPromise((resolve2, reject) => {
          stream._pendingAbortRequest = {
            _promise: void 0,
            _resolve: resolve2,
            _reject: reject,
            _reason: reason,
            _wasAlreadyErroring: wasAlreadyErroring
          };
        });
        stream._pendingAbortRequest._promise = promise2;
        if (!wasAlreadyErroring) {
          WritableStreamStartErroring(stream, reason);
        }
        return promise2;
      }
      function WritableStreamClose(stream) {
        const state2 = stream._state;
        if (state2 === "closed" || state2 === "errored") {
          return promiseRejectedWith(new TypeError(`The stream (in ${state2} state) is not in the writable state and cannot be closed`));
        }
        const promise2 = newPromise((resolve2, reject) => {
          const closeRequest = {
            _resolve: resolve2,
            _reject: reject
          };
          stream._closeRequest = closeRequest;
        });
        const writer = stream._writer;
        if (writer !== void 0 && stream._backpressure && state2 === "writable") {
          defaultWriterReadyPromiseResolve(writer);
        }
        WritableStreamDefaultControllerClose(stream._writableStreamController);
        return promise2;
      }
      function WritableStreamAddWriteRequest(stream) {
        const promise2 = newPromise((resolve2, reject) => {
          const writeRequest = {
            _resolve: resolve2,
            _reject: reject
          };
          stream._writeRequests.push(writeRequest);
        });
        return promise2;
      }
      function WritableStreamDealWithRejection(stream, error6) {
        const state2 = stream._state;
        if (state2 === "writable") {
          WritableStreamStartErroring(stream, error6);
          return;
        }
        WritableStreamFinishErroring(stream);
      }
      function WritableStreamStartErroring(stream, reason) {
        const controller = stream._writableStreamController;
        stream._state = "erroring";
        stream._storedError = reason;
        const writer = stream._writer;
        if (writer !== void 0) {
          WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, reason);
        }
        if (!WritableStreamHasOperationMarkedInFlight(stream) && controller._started) {
          WritableStreamFinishErroring(stream);
        }
      }
      function WritableStreamFinishErroring(stream) {
        stream._state = "errored";
        stream._writableStreamController[ErrorSteps]();
        const storedError = stream._storedError;
        stream._writeRequests.forEach((writeRequest) => {
          writeRequest._reject(storedError);
        });
        stream._writeRequests = new SimpleQueue();
        if (stream._pendingAbortRequest === void 0) {
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const abortRequest = stream._pendingAbortRequest;
        stream._pendingAbortRequest = void 0;
        if (abortRequest._wasAlreadyErroring) {
          abortRequest._reject(storedError);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
          return;
        }
        const promise2 = stream._writableStreamController[AbortSteps](abortRequest._reason);
        uponPromise(promise2, () => {
          abortRequest._resolve();
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        }, (reason) => {
          abortRequest._reject(reason);
          WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream);
        });
      }
      function WritableStreamFinishInFlightWrite(stream) {
        stream._inFlightWriteRequest._resolve(void 0);
        stream._inFlightWriteRequest = void 0;
      }
      function WritableStreamFinishInFlightWriteWithError(stream, error6) {
        stream._inFlightWriteRequest._reject(error6);
        stream._inFlightWriteRequest = void 0;
        WritableStreamDealWithRejection(stream, error6);
      }
      function WritableStreamFinishInFlightClose(stream) {
        stream._inFlightCloseRequest._resolve(void 0);
        stream._inFlightCloseRequest = void 0;
        const state2 = stream._state;
        if (state2 === "erroring") {
          stream._storedError = void 0;
          if (stream._pendingAbortRequest !== void 0) {
            stream._pendingAbortRequest._resolve();
            stream._pendingAbortRequest = void 0;
          }
        }
        stream._state = "closed";
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseResolve(writer);
        }
      }
      function WritableStreamFinishInFlightCloseWithError(stream, error6) {
        stream._inFlightCloseRequest._reject(error6);
        stream._inFlightCloseRequest = void 0;
        if (stream._pendingAbortRequest !== void 0) {
          stream._pendingAbortRequest._reject(error6);
          stream._pendingAbortRequest = void 0;
        }
        WritableStreamDealWithRejection(stream, error6);
      }
      function WritableStreamCloseQueuedOrInFlight(stream) {
        if (stream._closeRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamHasOperationMarkedInFlight(stream) {
        if (stream._inFlightWriteRequest === void 0 && stream._inFlightCloseRequest === void 0) {
          return false;
        }
        return true;
      }
      function WritableStreamMarkCloseRequestInFlight(stream) {
        stream._inFlightCloseRequest = stream._closeRequest;
        stream._closeRequest = void 0;
      }
      function WritableStreamMarkFirstWriteRequestInFlight(stream) {
        stream._inFlightWriteRequest = stream._writeRequests.shift();
      }
      function WritableStreamRejectCloseAndClosedPromiseIfNeeded(stream) {
        if (stream._closeRequest !== void 0) {
          stream._closeRequest._reject(stream._storedError);
          stream._closeRequest = void 0;
        }
        const writer = stream._writer;
        if (writer !== void 0) {
          defaultWriterClosedPromiseReject(writer, stream._storedError);
        }
      }
      function WritableStreamUpdateBackpressure(stream, backpressure) {
        const writer = stream._writer;
        if (writer !== void 0 && backpressure !== stream._backpressure) {
          if (backpressure) {
            defaultWriterReadyPromiseReset(writer);
          } else {
            defaultWriterReadyPromiseResolve(writer);
          }
        }
        stream._backpressure = backpressure;
      }
      class WritableStreamDefaultWriter {
        constructor(stream) {
          assertRequiredArgument(stream, 1, "WritableStreamDefaultWriter");
          assertWritableStream(stream, "First parameter");
          if (IsWritableStreamLocked(stream)) {
            throw new TypeError("This stream has already been locked for exclusive writing by another writer");
          }
          this._ownerWritableStream = stream;
          stream._writer = this;
          const state2 = stream._state;
          if (state2 === "writable") {
            if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._backpressure) {
              defaultWriterReadyPromiseInitialize(this);
            } else {
              defaultWriterReadyPromiseInitializeAsResolved(this);
            }
            defaultWriterClosedPromiseInitialize(this);
          } else if (state2 === "erroring") {
            defaultWriterReadyPromiseInitializeAsRejected(this, stream._storedError);
            defaultWriterClosedPromiseInitialize(this);
          } else if (state2 === "closed") {
            defaultWriterReadyPromiseInitializeAsResolved(this);
            defaultWriterClosedPromiseInitializeAsResolved(this);
          } else {
            const storedError = stream._storedError;
            defaultWriterReadyPromiseInitializeAsRejected(this, storedError);
            defaultWriterClosedPromiseInitializeAsRejected(this, storedError);
          }
        }
        get closed() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("closed"));
          }
          return this._closedPromise;
        }
        get desiredSize() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("desiredSize");
          }
          if (this._ownerWritableStream === void 0) {
            throw defaultWriterLockException("desiredSize");
          }
          return WritableStreamDefaultWriterGetDesiredSize(this);
        }
        get ready() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("ready"));
          }
          return this._readyPromise;
        }
        abort(reason = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("abort"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("abort"));
          }
          return WritableStreamDefaultWriterAbort(this, reason);
        }
        close() {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("close"));
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("close"));
          }
          if (WritableStreamCloseQueuedOrInFlight(stream)) {
            return promiseRejectedWith(new TypeError("Cannot close an already-closing stream"));
          }
          return WritableStreamDefaultWriterClose(this);
        }
        releaseLock() {
          if (!IsWritableStreamDefaultWriter(this)) {
            throw defaultWriterBrandCheckException("releaseLock");
          }
          const stream = this._ownerWritableStream;
          if (stream === void 0) {
            return;
          }
          WritableStreamDefaultWriterRelease(this);
        }
        write(chunk = void 0) {
          if (!IsWritableStreamDefaultWriter(this)) {
            return promiseRejectedWith(defaultWriterBrandCheckException("write"));
          }
          if (this._ownerWritableStream === void 0) {
            return promiseRejectedWith(defaultWriterLockException("write to"));
          }
          return WritableStreamDefaultWriterWrite(this, chunk);
        }
      }
      Object.defineProperties(WritableStreamDefaultWriter.prototype, {
        abort: { enumerable: true },
        close: { enumerable: true },
        releaseLock: { enumerable: true },
        write: { enumerable: true },
        closed: { enumerable: true },
        desiredSize: { enumerable: true },
        ready: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultWriter.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStreamDefaultWriter",
          configurable: true
        });
      }
      function IsWritableStreamDefaultWriter(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_ownerWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultWriter;
      }
      function WritableStreamDefaultWriterAbort(writer, reason) {
        const stream = writer._ownerWritableStream;
        return WritableStreamAbort(stream, reason);
      }
      function WritableStreamDefaultWriterClose(writer) {
        const stream = writer._ownerWritableStream;
        return WritableStreamClose(stream);
      }
      function WritableStreamDefaultWriterCloseWithErrorPropagation(writer) {
        const stream = writer._ownerWritableStream;
        const state2 = stream._state;
        if (WritableStreamCloseQueuedOrInFlight(stream) || state2 === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (state2 === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        return WritableStreamDefaultWriterClose(writer);
      }
      function WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, error6) {
        if (writer._closedPromiseState === "pending") {
          defaultWriterClosedPromiseReject(writer, error6);
        } else {
          defaultWriterClosedPromiseResetToRejected(writer, error6);
        }
      }
      function WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, error6) {
        if (writer._readyPromiseState === "pending") {
          defaultWriterReadyPromiseReject(writer, error6);
        } else {
          defaultWriterReadyPromiseResetToRejected(writer, error6);
        }
      }
      function WritableStreamDefaultWriterGetDesiredSize(writer) {
        const stream = writer._ownerWritableStream;
        const state2 = stream._state;
        if (state2 === "errored" || state2 === "erroring") {
          return null;
        }
        if (state2 === "closed") {
          return 0;
        }
        return WritableStreamDefaultControllerGetDesiredSize(stream._writableStreamController);
      }
      function WritableStreamDefaultWriterRelease(writer) {
        const stream = writer._ownerWritableStream;
        const releasedError = new TypeError(`Writer was released and can no longer be used to monitor the stream's closedness`);
        WritableStreamDefaultWriterEnsureReadyPromiseRejected(writer, releasedError);
        WritableStreamDefaultWriterEnsureClosedPromiseRejected(writer, releasedError);
        stream._writer = void 0;
        writer._ownerWritableStream = void 0;
      }
      function WritableStreamDefaultWriterWrite(writer, chunk) {
        const stream = writer._ownerWritableStream;
        const controller = stream._writableStreamController;
        const chunkSize = WritableStreamDefaultControllerGetChunkSize(controller, chunk);
        if (stream !== writer._ownerWritableStream) {
          return promiseRejectedWith(defaultWriterLockException("write to"));
        }
        const state2 = stream._state;
        if (state2 === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        if (WritableStreamCloseQueuedOrInFlight(stream) || state2 === "closed") {
          return promiseRejectedWith(new TypeError("The stream is closing or closed and cannot be written to"));
        }
        if (state2 === "erroring") {
          return promiseRejectedWith(stream._storedError);
        }
        const promise2 = WritableStreamAddWriteRequest(stream);
        WritableStreamDefaultControllerWrite(controller, chunk, chunkSize);
        return promise2;
      }
      const closeSentinel = {};
      class WritableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get abortReason() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("abortReason");
          }
          return this._abortReason;
        }
        get signal() {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("signal");
          }
          if (this._abortController === void 0) {
            throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");
          }
          return this._abortController.signal;
        }
        error(e2 = void 0) {
          if (!IsWritableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$2("error");
          }
          const state2 = this._controlledWritableStream._state;
          if (state2 !== "writable") {
            return;
          }
          WritableStreamDefaultControllerError(this, e2);
        }
        [AbortSteps](reason) {
          const result = this._abortAlgorithm(reason);
          WritableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        [ErrorSteps]() {
          ResetQueue(this);
        }
      }
      Object.defineProperties(WritableStreamDefaultController.prototype, {
        abortReason: { enumerable: true },
        signal: { enumerable: true },
        error: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(WritableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "WritableStreamDefaultController",
          configurable: true
        });
      }
      function IsWritableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledWritableStream")) {
          return false;
        }
        return x2 instanceof WritableStreamDefaultController;
      }
      function SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledWritableStream = stream;
        stream._writableStreamController = controller;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._abortReason = void 0;
        controller._abortController = createAbortController();
        controller._started = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._writeAlgorithm = writeAlgorithm;
        controller._closeAlgorithm = closeAlgorithm;
        controller._abortAlgorithm = abortAlgorithm;
        const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
        WritableStreamUpdateBackpressure(stream, backpressure);
        const startResult = startAlgorithm();
        const startPromise = promiseResolvedWith(startResult);
        uponPromise(startPromise, () => {
          controller._started = true;
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, (r2) => {
          controller._started = true;
          WritableStreamDealWithRejection(stream, r2);
        });
      }
      function SetUpWritableStreamDefaultControllerFromUnderlyingSink(stream, underlyingSink, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(WritableStreamDefaultController.prototype);
        let startAlgorithm = () => void 0;
        let writeAlgorithm = () => promiseResolvedWith(void 0);
        let closeAlgorithm = () => promiseResolvedWith(void 0);
        let abortAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingSink.start !== void 0) {
          startAlgorithm = () => underlyingSink.start(controller);
        }
        if (underlyingSink.write !== void 0) {
          writeAlgorithm = (chunk) => underlyingSink.write(chunk, controller);
        }
        if (underlyingSink.close !== void 0) {
          closeAlgorithm = () => underlyingSink.close();
        }
        if (underlyingSink.abort !== void 0) {
          abortAlgorithm = (reason) => underlyingSink.abort(reason);
        }
        SetUpWritableStreamDefaultController(stream, controller, startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function WritableStreamDefaultControllerClearAlgorithms(controller) {
        controller._writeAlgorithm = void 0;
        controller._closeAlgorithm = void 0;
        controller._abortAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function WritableStreamDefaultControllerClose(controller) {
        EnqueueValueWithSize(controller, closeSentinel, 0);
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerGetChunkSize(controller, chunk) {
        try {
          return controller._strategySizeAlgorithm(chunk);
        } catch (chunkSizeE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, chunkSizeE);
          return 1;
        }
      }
      function WritableStreamDefaultControllerGetDesiredSize(controller) {
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function WritableStreamDefaultControllerWrite(controller, chunk, chunkSize) {
        try {
          EnqueueValueWithSize(controller, chunk, chunkSize);
        } catch (enqueueE) {
          WritableStreamDefaultControllerErrorIfNeeded(controller, enqueueE);
          return;
        }
        const stream = controller._controlledWritableStream;
        if (!WritableStreamCloseQueuedOrInFlight(stream) && stream._state === "writable") {
          const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
          WritableStreamUpdateBackpressure(stream, backpressure);
        }
        WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
      }
      function WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller) {
        const stream = controller._controlledWritableStream;
        if (!controller._started) {
          return;
        }
        if (stream._inFlightWriteRequest !== void 0) {
          return;
        }
        const state2 = stream._state;
        if (state2 === "erroring") {
          WritableStreamFinishErroring(stream);
          return;
        }
        if (controller._queue.length === 0) {
          return;
        }
        const value2 = PeekQueueValue(controller);
        if (value2 === closeSentinel) {
          WritableStreamDefaultControllerProcessClose(controller);
        } else {
          WritableStreamDefaultControllerProcessWrite(controller, value2);
        }
      }
      function WritableStreamDefaultControllerErrorIfNeeded(controller, error6) {
        if (controller._controlledWritableStream._state === "writable") {
          WritableStreamDefaultControllerError(controller, error6);
        }
      }
      function WritableStreamDefaultControllerProcessClose(controller) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkCloseRequestInFlight(stream);
        DequeueValue(controller);
        const sinkClosePromise = controller._closeAlgorithm();
        WritableStreamDefaultControllerClearAlgorithms(controller);
        uponPromise(sinkClosePromise, () => {
          WritableStreamFinishInFlightClose(stream);
        }, (reason) => {
          WritableStreamFinishInFlightCloseWithError(stream, reason);
        });
      }
      function WritableStreamDefaultControllerProcessWrite(controller, chunk) {
        const stream = controller._controlledWritableStream;
        WritableStreamMarkFirstWriteRequestInFlight(stream);
        const sinkWritePromise = controller._writeAlgorithm(chunk);
        uponPromise(sinkWritePromise, () => {
          WritableStreamFinishInFlightWrite(stream);
          const state2 = stream._state;
          DequeueValue(controller);
          if (!WritableStreamCloseQueuedOrInFlight(stream) && state2 === "writable") {
            const backpressure = WritableStreamDefaultControllerGetBackpressure(controller);
            WritableStreamUpdateBackpressure(stream, backpressure);
          }
          WritableStreamDefaultControllerAdvanceQueueIfNeeded(controller);
        }, (reason) => {
          if (stream._state === "writable") {
            WritableStreamDefaultControllerClearAlgorithms(controller);
          }
          WritableStreamFinishInFlightWriteWithError(stream, reason);
        });
      }
      function WritableStreamDefaultControllerGetBackpressure(controller) {
        const desiredSize = WritableStreamDefaultControllerGetDesiredSize(controller);
        return desiredSize <= 0;
      }
      function WritableStreamDefaultControllerError(controller, error6) {
        const stream = controller._controlledWritableStream;
        WritableStreamDefaultControllerClearAlgorithms(controller);
        WritableStreamStartErroring(stream, error6);
      }
      function streamBrandCheckException$2(name3) {
        return new TypeError(`WritableStream.prototype.${name3} can only be used on a WritableStream`);
      }
      function defaultControllerBrandCheckException$2(name3) {
        return new TypeError(`WritableStreamDefaultController.prototype.${name3} can only be used on a WritableStreamDefaultController`);
      }
      function defaultWriterBrandCheckException(name3) {
        return new TypeError(`WritableStreamDefaultWriter.prototype.${name3} can only be used on a WritableStreamDefaultWriter`);
      }
      function defaultWriterLockException(name3) {
        return new TypeError("Cannot " + name3 + " a stream using a released writer");
      }
      function defaultWriterClosedPromiseInitialize(writer) {
        writer._closedPromise = newPromise((resolve2, reject) => {
          writer._closedPromise_resolve = resolve2;
          writer._closedPromise_reject = reject;
          writer._closedPromiseState = "pending";
        });
      }
      function defaultWriterClosedPromiseInitializeAsRejected(writer, reason) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseReject(writer, reason);
      }
      function defaultWriterClosedPromiseInitializeAsResolved(writer) {
        defaultWriterClosedPromiseInitialize(writer);
        defaultWriterClosedPromiseResolve(writer);
      }
      function defaultWriterClosedPromiseReject(writer, reason) {
        if (writer._closedPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._closedPromise);
        writer._closedPromise_reject(reason);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "rejected";
      }
      function defaultWriterClosedPromiseResetToRejected(writer, reason) {
        defaultWriterClosedPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterClosedPromiseResolve(writer) {
        if (writer._closedPromise_resolve === void 0) {
          return;
        }
        writer._closedPromise_resolve(void 0);
        writer._closedPromise_resolve = void 0;
        writer._closedPromise_reject = void 0;
        writer._closedPromiseState = "resolved";
      }
      function defaultWriterReadyPromiseInitialize(writer) {
        writer._readyPromise = newPromise((resolve2, reject) => {
          writer._readyPromise_resolve = resolve2;
          writer._readyPromise_reject = reject;
        });
        writer._readyPromiseState = "pending";
      }
      function defaultWriterReadyPromiseInitializeAsRejected(writer, reason) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseReject(writer, reason);
      }
      function defaultWriterReadyPromiseInitializeAsResolved(writer) {
        defaultWriterReadyPromiseInitialize(writer);
        defaultWriterReadyPromiseResolve(writer);
      }
      function defaultWriterReadyPromiseReject(writer, reason) {
        if (writer._readyPromise_reject === void 0) {
          return;
        }
        setPromiseIsHandledToTrue(writer._readyPromise);
        writer._readyPromise_reject(reason);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "rejected";
      }
      function defaultWriterReadyPromiseReset(writer) {
        defaultWriterReadyPromiseInitialize(writer);
      }
      function defaultWriterReadyPromiseResetToRejected(writer, reason) {
        defaultWriterReadyPromiseInitializeAsRejected(writer, reason);
      }
      function defaultWriterReadyPromiseResolve(writer) {
        if (writer._readyPromise_resolve === void 0) {
          return;
        }
        writer._readyPromise_resolve(void 0);
        writer._readyPromise_resolve = void 0;
        writer._readyPromise_reject = void 0;
        writer._readyPromiseState = "fulfilled";
      }
      const NativeDOMException = typeof DOMException !== "undefined" ? DOMException : void 0;
      function isDOMExceptionConstructor(ctor) {
        if (!(typeof ctor === "function" || typeof ctor === "object")) {
          return false;
        }
        try {
          new ctor();
          return true;
        } catch (_a) {
          return false;
        }
      }
      function createDOMExceptionPolyfill() {
        const ctor = function DOMException3(message2, name3) {
          this.message = message2 || "";
          this.name = name3 || "Error";
          if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
          }
        };
        ctor.prototype = Object.create(Error.prototype);
        Object.defineProperty(ctor.prototype, "constructor", { value: ctor, writable: true, configurable: true });
        return ctor;
      }
      const DOMException$1 = isDOMExceptionConstructor(NativeDOMException) ? NativeDOMException : createDOMExceptionPolyfill();
      function ReadableStreamPipeTo(source2, dest, preventClose, preventAbort, preventCancel, signal) {
        const reader = AcquireReadableStreamDefaultReader(source2);
        const writer = AcquireWritableStreamDefaultWriter(dest);
        source2._disturbed = true;
        let shuttingDown = false;
        let currentWrite = promiseResolvedWith(void 0);
        return newPromise((resolve2, reject) => {
          let abortAlgorithm;
          if (signal !== void 0) {
            abortAlgorithm = () => {
              const error6 = new DOMException$1("Aborted", "AbortError");
              const actions = [];
              if (!preventAbort) {
                actions.push(() => {
                  if (dest._state === "writable") {
                    return WritableStreamAbort(dest, error6);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              if (!preventCancel) {
                actions.push(() => {
                  if (source2._state === "readable") {
                    return ReadableStreamCancel(source2, error6);
                  }
                  return promiseResolvedWith(void 0);
                });
              }
              shutdownWithAction(() => Promise.all(actions.map((action) => action())), true, error6);
            };
            if (signal.aborted) {
              abortAlgorithm();
              return;
            }
            signal.addEventListener("abort", abortAlgorithm);
          }
          function pipeLoop() {
            return newPromise((resolveLoop, rejectLoop) => {
              function next(done) {
                if (done) {
                  resolveLoop();
                } else {
                  PerformPromiseThen(pipeStep(), next, rejectLoop);
                }
              }
              next(false);
            });
          }
          function pipeStep() {
            if (shuttingDown) {
              return promiseResolvedWith(true);
            }
            return PerformPromiseThen(writer._readyPromise, () => {
              return newPromise((resolveRead, rejectRead) => {
                ReadableStreamDefaultReaderRead(reader, {
                  _chunkSteps: (chunk) => {
                    currentWrite = PerformPromiseThen(WritableStreamDefaultWriterWrite(writer, chunk), void 0, noop2);
                    resolveRead(false);
                  },
                  _closeSteps: () => resolveRead(true),
                  _errorSteps: rejectRead
                });
              });
            });
          }
          isOrBecomesErrored(source2, reader._closedPromise, (storedError) => {
            if (!preventAbort) {
              shutdownWithAction(() => WritableStreamAbort(dest, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
          });
          isOrBecomesErrored(dest, writer._closedPromise, (storedError) => {
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source2, storedError), true, storedError);
            } else {
              shutdown(true, storedError);
            }
          });
          isOrBecomesClosed(source2, reader._closedPromise, () => {
            if (!preventClose) {
              shutdownWithAction(() => WritableStreamDefaultWriterCloseWithErrorPropagation(writer));
            } else {
              shutdown();
            }
          });
          if (WritableStreamCloseQueuedOrInFlight(dest) || dest._state === "closed") {
            const destClosed = new TypeError("the destination writable stream closed before all data could be piped to it");
            if (!preventCancel) {
              shutdownWithAction(() => ReadableStreamCancel(source2, destClosed), true, destClosed);
            } else {
              shutdown(true, destClosed);
            }
          }
          setPromiseIsHandledToTrue(pipeLoop());
          function waitForWritesToFinish() {
            const oldCurrentWrite = currentWrite;
            return PerformPromiseThen(currentWrite, () => oldCurrentWrite !== currentWrite ? waitForWritesToFinish() : void 0);
          }
          function isOrBecomesErrored(stream, promise2, action) {
            if (stream._state === "errored") {
              action(stream._storedError);
            } else {
              uponRejection(promise2, action);
            }
          }
          function isOrBecomesClosed(stream, promise2, action) {
            if (stream._state === "closed") {
              action();
            } else {
              uponFulfillment(promise2, action);
            }
          }
          function shutdownWithAction(action, originalIsError, originalError) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), doTheRest);
            } else {
              doTheRest();
            }
            function doTheRest() {
              uponPromise(action(), () => finalize(originalIsError, originalError), (newError) => finalize(true, newError));
            }
          }
          function shutdown(isError, error6) {
            if (shuttingDown) {
              return;
            }
            shuttingDown = true;
            if (dest._state === "writable" && !WritableStreamCloseQueuedOrInFlight(dest)) {
              uponFulfillment(waitForWritesToFinish(), () => finalize(isError, error6));
            } else {
              finalize(isError, error6);
            }
          }
          function finalize(isError, error6) {
            WritableStreamDefaultWriterRelease(writer);
            ReadableStreamReaderGenericRelease(reader);
            if (signal !== void 0) {
              signal.removeEventListener("abort", abortAlgorithm);
            }
            if (isError) {
              reject(error6);
            } else {
              resolve2(void 0);
            }
          }
        });
      }
      class ReadableStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("desiredSize");
          }
          return ReadableStreamDefaultControllerGetDesiredSize(this);
        }
        close() {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("close");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits close");
          }
          ReadableStreamDefaultControllerClose(this);
        }
        enqueue(chunk = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("enqueue");
          }
          if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(this)) {
            throw new TypeError("The stream is not in a state that permits enqueue");
          }
          return ReadableStreamDefaultControllerEnqueue(this, chunk);
        }
        error(e2 = void 0) {
          if (!IsReadableStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException$1("error");
          }
          ReadableStreamDefaultControllerError(this, e2);
        }
        [CancelSteps](reason) {
          ResetQueue(this);
          const result = this._cancelAlgorithm(reason);
          ReadableStreamDefaultControllerClearAlgorithms(this);
          return result;
        }
        [PullSteps](readRequest) {
          const stream = this._controlledReadableStream;
          if (this._queue.length > 0) {
            const chunk = DequeueValue(this);
            if (this._closeRequested && this._queue.length === 0) {
              ReadableStreamDefaultControllerClearAlgorithms(this);
              ReadableStreamClose(stream);
            } else {
              ReadableStreamDefaultControllerCallPullIfNeeded(this);
            }
            readRequest._chunkSteps(chunk);
          } else {
            ReadableStreamAddReadRequest(stream, readRequest);
            ReadableStreamDefaultControllerCallPullIfNeeded(this);
          }
        }
      }
      Object.defineProperties(ReadableStreamDefaultController.prototype, {
        close: { enumerable: true },
        enqueue: { enumerable: true },
        error: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStreamDefaultController",
          configurable: true
        });
      }
      function IsReadableStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledReadableStream")) {
          return false;
        }
        return x2 instanceof ReadableStreamDefaultController;
      }
      function ReadableStreamDefaultControllerCallPullIfNeeded(controller) {
        const shouldPull = ReadableStreamDefaultControllerShouldCallPull(controller);
        if (!shouldPull) {
          return;
        }
        if (controller._pulling) {
          controller._pullAgain = true;
          return;
        }
        controller._pulling = true;
        const pullPromise = controller._pullAlgorithm();
        uponPromise(pullPromise, () => {
          controller._pulling = false;
          if (controller._pullAgain) {
            controller._pullAgain = false;
            ReadableStreamDefaultControllerCallPullIfNeeded(controller);
          }
        }, (e2) => {
          ReadableStreamDefaultControllerError(controller, e2);
        });
      }
      function ReadableStreamDefaultControllerShouldCallPull(controller) {
        const stream = controller._controlledReadableStream;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return false;
        }
        if (!controller._started) {
          return false;
        }
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          return true;
        }
        const desiredSize = ReadableStreamDefaultControllerGetDesiredSize(controller);
        if (desiredSize > 0) {
          return true;
        }
        return false;
      }
      function ReadableStreamDefaultControllerClearAlgorithms(controller) {
        controller._pullAlgorithm = void 0;
        controller._cancelAlgorithm = void 0;
        controller._strategySizeAlgorithm = void 0;
      }
      function ReadableStreamDefaultControllerClose(controller) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        controller._closeRequested = true;
        if (controller._queue.length === 0) {
          ReadableStreamDefaultControllerClearAlgorithms(controller);
          ReadableStreamClose(stream);
        }
      }
      function ReadableStreamDefaultControllerEnqueue(controller, chunk) {
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(controller)) {
          return;
        }
        const stream = controller._controlledReadableStream;
        if (IsReadableStreamLocked(stream) && ReadableStreamGetNumReadRequests(stream) > 0) {
          ReadableStreamFulfillReadRequest(stream, chunk, false);
        } else {
          let chunkSize;
          try {
            chunkSize = controller._strategySizeAlgorithm(chunk);
          } catch (chunkSizeE) {
            ReadableStreamDefaultControllerError(controller, chunkSizeE);
            throw chunkSizeE;
          }
          try {
            EnqueueValueWithSize(controller, chunk, chunkSize);
          } catch (enqueueE) {
            ReadableStreamDefaultControllerError(controller, enqueueE);
            throw enqueueE;
          }
        }
        ReadableStreamDefaultControllerCallPullIfNeeded(controller);
      }
      function ReadableStreamDefaultControllerError(controller, e2) {
        const stream = controller._controlledReadableStream;
        if (stream._state !== "readable") {
          return;
        }
        ResetQueue(controller);
        ReadableStreamDefaultControllerClearAlgorithms(controller);
        ReadableStreamError(stream, e2);
      }
      function ReadableStreamDefaultControllerGetDesiredSize(controller) {
        const state2 = controller._controlledReadableStream._state;
        if (state2 === "errored") {
          return null;
        }
        if (state2 === "closed") {
          return 0;
        }
        return controller._strategyHWM - controller._queueTotalSize;
      }
      function ReadableStreamDefaultControllerHasBackpressure(controller) {
        if (ReadableStreamDefaultControllerShouldCallPull(controller)) {
          return false;
        }
        return true;
      }
      function ReadableStreamDefaultControllerCanCloseOrEnqueue(controller) {
        const state2 = controller._controlledReadableStream._state;
        if (!controller._closeRequested && state2 === "readable") {
          return true;
        }
        return false;
      }
      function SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm) {
        controller._controlledReadableStream = stream;
        controller._queue = void 0;
        controller._queueTotalSize = void 0;
        ResetQueue(controller);
        controller._started = false;
        controller._closeRequested = false;
        controller._pullAgain = false;
        controller._pulling = false;
        controller._strategySizeAlgorithm = sizeAlgorithm;
        controller._strategyHWM = highWaterMark;
        controller._pullAlgorithm = pullAlgorithm;
        controller._cancelAlgorithm = cancelAlgorithm;
        stream._readableStreamController = controller;
        const startResult = startAlgorithm();
        uponPromise(promiseResolvedWith(startResult), () => {
          controller._started = true;
          ReadableStreamDefaultControllerCallPullIfNeeded(controller);
        }, (r2) => {
          ReadableStreamDefaultControllerError(controller, r2);
        });
      }
      function SetUpReadableStreamDefaultControllerFromUnderlyingSource(stream, underlyingSource, highWaterMark, sizeAlgorithm) {
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        let startAlgorithm = () => void 0;
        let pullAlgorithm = () => promiseResolvedWith(void 0);
        let cancelAlgorithm = () => promiseResolvedWith(void 0);
        if (underlyingSource.start !== void 0) {
          startAlgorithm = () => underlyingSource.start(controller);
        }
        if (underlyingSource.pull !== void 0) {
          pullAlgorithm = () => underlyingSource.pull(controller);
        }
        if (underlyingSource.cancel !== void 0) {
          cancelAlgorithm = (reason) => underlyingSource.cancel(reason);
        }
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
      }
      function defaultControllerBrandCheckException$1(name3) {
        return new TypeError(`ReadableStreamDefaultController.prototype.${name3} can only be used on a ReadableStreamDefaultController`);
      }
      function ReadableStreamTee(stream, cloneForBranch2) {
        if (IsReadableByteStreamController(stream._readableStreamController)) {
          return ReadableByteStreamTee(stream);
        }
        return ReadableStreamDefaultTee(stream);
      }
      function ReadableStreamDefaultTee(stream, cloneForBranch2) {
        const reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgain = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve2) => {
          resolveCancelPromise = resolve2;
        });
        function pullAlgorithm() {
          if (reading) {
            readAgain = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const readRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgain = false;
                const chunk1 = chunk;
                const chunk2 = chunk;
                if (!canceled1) {
                  ReadableStreamDefaultControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableStreamDefaultControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgain) {
                  pullAlgorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableStreamDefaultControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableStreamDefaultControllerClose(branch2._readableStreamController);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
        }
        branch1 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel1Algorithm);
        branch2 = CreateReadableStream(startAlgorithm, pullAlgorithm, cancel2Algorithm);
        uponRejection(reader._closedPromise, (r2) => {
          ReadableStreamDefaultControllerError(branch1._readableStreamController, r2);
          ReadableStreamDefaultControllerError(branch2._readableStreamController, r2);
          if (!canceled1 || !canceled2) {
            resolveCancelPromise(void 0);
          }
        });
        return [branch1, branch2];
      }
      function ReadableByteStreamTee(stream) {
        let reader = AcquireReadableStreamDefaultReader(stream);
        let reading = false;
        let readAgainForBranch1 = false;
        let readAgainForBranch2 = false;
        let canceled1 = false;
        let canceled2 = false;
        let reason1;
        let reason2;
        let branch1;
        let branch2;
        let resolveCancelPromise;
        const cancelPromise = newPromise((resolve2) => {
          resolveCancelPromise = resolve2;
        });
        function forwardReaderError(thisReader) {
          uponRejection(thisReader._closedPromise, (r2) => {
            if (thisReader !== reader) {
              return;
            }
            ReadableByteStreamControllerError(branch1._readableStreamController, r2);
            ReadableByteStreamControllerError(branch2._readableStreamController, r2);
            if (!canceled1 || !canceled2) {
              resolveCancelPromise(void 0);
            }
          });
        }
        function pullWithDefaultReader() {
          if (IsReadableStreamBYOBReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamDefaultReader(stream);
            forwardReaderError(reader);
          }
          const readRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const chunk1 = chunk;
                let chunk2 = chunk;
                if (!canceled1 && !canceled2) {
                  try {
                    chunk2 = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(branch1._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(branch2._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                }
                if (!canceled1) {
                  ReadableByteStreamControllerEnqueue(branch1._readableStreamController, chunk1);
                }
                if (!canceled2) {
                  ReadableByteStreamControllerEnqueue(branch2._readableStreamController, chunk2);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: () => {
              reading = false;
              if (!canceled1) {
                ReadableByteStreamControllerClose(branch1._readableStreamController);
              }
              if (!canceled2) {
                ReadableByteStreamControllerClose(branch2._readableStreamController);
              }
              if (branch1._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch1._readableStreamController, 0);
              }
              if (branch2._readableStreamController._pendingPullIntos.length > 0) {
                ReadableByteStreamControllerRespond(branch2._readableStreamController, 0);
              }
              if (!canceled1 || !canceled2) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamDefaultReaderRead(reader, readRequest);
        }
        function pullWithBYOBReader(view, forBranch2) {
          if (IsReadableStreamDefaultReader(reader)) {
            ReadableStreamReaderGenericRelease(reader);
            reader = AcquireReadableStreamBYOBReader(stream);
            forwardReaderError(reader);
          }
          const byobBranch = forBranch2 ? branch2 : branch1;
          const otherBranch = forBranch2 ? branch1 : branch2;
          const readIntoRequest = {
            _chunkSteps: (chunk) => {
              queueMicrotask(() => {
                readAgainForBranch1 = false;
                readAgainForBranch2 = false;
                const byobCanceled = forBranch2 ? canceled2 : canceled1;
                const otherCanceled = forBranch2 ? canceled1 : canceled2;
                if (!otherCanceled) {
                  let clonedChunk;
                  try {
                    clonedChunk = CloneAsUint8Array(chunk);
                  } catch (cloneE) {
                    ReadableByteStreamControllerError(byobBranch._readableStreamController, cloneE);
                    ReadableByteStreamControllerError(otherBranch._readableStreamController, cloneE);
                    resolveCancelPromise(ReadableStreamCancel(stream, cloneE));
                    return;
                  }
                  if (!byobCanceled) {
                    ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                  }
                  ReadableByteStreamControllerEnqueue(otherBranch._readableStreamController, clonedChunk);
                } else if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                reading = false;
                if (readAgainForBranch1) {
                  pull1Algorithm();
                } else if (readAgainForBranch2) {
                  pull2Algorithm();
                }
              });
            },
            _closeSteps: (chunk) => {
              reading = false;
              const byobCanceled = forBranch2 ? canceled2 : canceled1;
              const otherCanceled = forBranch2 ? canceled1 : canceled2;
              if (!byobCanceled) {
                ReadableByteStreamControllerClose(byobBranch._readableStreamController);
              }
              if (!otherCanceled) {
                ReadableByteStreamControllerClose(otherBranch._readableStreamController);
              }
              if (chunk !== void 0) {
                if (!byobCanceled) {
                  ReadableByteStreamControllerRespondWithNewView(byobBranch._readableStreamController, chunk);
                }
                if (!otherCanceled && otherBranch._readableStreamController._pendingPullIntos.length > 0) {
                  ReadableByteStreamControllerRespond(otherBranch._readableStreamController, 0);
                }
              }
              if (!byobCanceled || !otherCanceled) {
                resolveCancelPromise(void 0);
              }
            },
            _errorSteps: () => {
              reading = false;
            }
          };
          ReadableStreamBYOBReaderRead(reader, view, readIntoRequest);
        }
        function pull1Algorithm() {
          if (reading) {
            readAgainForBranch1 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch1._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, false);
          }
          return promiseResolvedWith(void 0);
        }
        function pull2Algorithm() {
          if (reading) {
            readAgainForBranch2 = true;
            return promiseResolvedWith(void 0);
          }
          reading = true;
          const byobRequest = ReadableByteStreamControllerGetBYOBRequest(branch2._readableStreamController);
          if (byobRequest === null) {
            pullWithDefaultReader();
          } else {
            pullWithBYOBReader(byobRequest._view, true);
          }
          return promiseResolvedWith(void 0);
        }
        function cancel1Algorithm(reason) {
          canceled1 = true;
          reason1 = reason;
          if (canceled2) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function cancel2Algorithm(reason) {
          canceled2 = true;
          reason2 = reason;
          if (canceled1) {
            const compositeReason = CreateArrayFromList([reason1, reason2]);
            const cancelResult = ReadableStreamCancel(stream, compositeReason);
            resolveCancelPromise(cancelResult);
          }
          return cancelPromise;
        }
        function startAlgorithm() {
          return;
        }
        branch1 = CreateReadableByteStream(startAlgorithm, pull1Algorithm, cancel1Algorithm);
        branch2 = CreateReadableByteStream(startAlgorithm, pull2Algorithm, cancel2Algorithm);
        forwardReaderError(reader);
        return [branch1, branch2];
      }
      function convertUnderlyingDefaultOrByteSource(source2, context) {
        assertDictionary(source2, context);
        const original = source2;
        const autoAllocateChunkSize = original === null || original === void 0 ? void 0 : original.autoAllocateChunkSize;
        const cancel = original === null || original === void 0 ? void 0 : original.cancel;
        const pull = original === null || original === void 0 ? void 0 : original.pull;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const type = original === null || original === void 0 ? void 0 : original.type;
        return {
          autoAllocateChunkSize: autoAllocateChunkSize === void 0 ? void 0 : convertUnsignedLongLongWithEnforceRange(autoAllocateChunkSize, `${context} has member 'autoAllocateChunkSize' that`),
          cancel: cancel === void 0 ? void 0 : convertUnderlyingSourceCancelCallback(cancel, original, `${context} has member 'cancel' that`),
          pull: pull === void 0 ? void 0 : convertUnderlyingSourcePullCallback(pull, original, `${context} has member 'pull' that`),
          start: start === void 0 ? void 0 : convertUnderlyingSourceStartCallback(start, original, `${context} has member 'start' that`),
          type: type === void 0 ? void 0 : convertReadableStreamType(type, `${context} has member 'type' that`)
        };
      }
      function convertUnderlyingSourceCancelCallback(fn, original, context) {
        assertFunction(fn, context);
        return (reason) => promiseCall(fn, original, [reason]);
      }
      function convertUnderlyingSourcePullCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertUnderlyingSourceStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertReadableStreamType(type, context) {
        type = `${type}`;
        if (type !== "bytes") {
          throw new TypeError(`${context} '${type}' is not a valid enumeration value for ReadableStreamType`);
        }
        return type;
      }
      function convertReaderOptions(options, context) {
        assertDictionary(options, context);
        const mode = options === null || options === void 0 ? void 0 : options.mode;
        return {
          mode: mode === void 0 ? void 0 : convertReadableStreamReaderMode(mode, `${context} has member 'mode' that`)
        };
      }
      function convertReadableStreamReaderMode(mode, context) {
        mode = `${mode}`;
        if (mode !== "byob") {
          throw new TypeError(`${context} '${mode}' is not a valid enumeration value for ReadableStreamReaderMode`);
        }
        return mode;
      }
      function convertIteratorOptions(options, context) {
        assertDictionary(options, context);
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        return { preventCancel: Boolean(preventCancel) };
      }
      function convertPipeOptions(options, context) {
        assertDictionary(options, context);
        const preventAbort = options === null || options === void 0 ? void 0 : options.preventAbort;
        const preventCancel = options === null || options === void 0 ? void 0 : options.preventCancel;
        const preventClose = options === null || options === void 0 ? void 0 : options.preventClose;
        const signal = options === null || options === void 0 ? void 0 : options.signal;
        if (signal !== void 0) {
          assertAbortSignal(signal, `${context} has member 'signal' that`);
        }
        return {
          preventAbort: Boolean(preventAbort),
          preventCancel: Boolean(preventCancel),
          preventClose: Boolean(preventClose),
          signal
        };
      }
      function assertAbortSignal(signal, context) {
        if (!isAbortSignal2(signal)) {
          throw new TypeError(`${context} is not an AbortSignal.`);
        }
      }
      function convertReadableWritablePair(pair, context) {
        assertDictionary(pair, context);
        const readable = pair === null || pair === void 0 ? void 0 : pair.readable;
        assertRequiredField(readable, "readable", "ReadableWritablePair");
        assertReadableStream(readable, `${context} has member 'readable' that`);
        const writable = pair === null || pair === void 0 ? void 0 : pair.writable;
        assertRequiredField(writable, "writable", "ReadableWritablePair");
        assertWritableStream(writable, `${context} has member 'writable' that`);
        return { readable, writable };
      }
      class ReadableStream2 {
        constructor(rawUnderlyingSource = {}, rawStrategy = {}) {
          if (rawUnderlyingSource === void 0) {
            rawUnderlyingSource = null;
          } else {
            assertObject(rawUnderlyingSource, "First parameter");
          }
          const strategy = convertQueuingStrategy(rawStrategy, "Second parameter");
          const underlyingSource = convertUnderlyingDefaultOrByteSource(rawUnderlyingSource, "First parameter");
          InitializeReadableStream(this);
          if (underlyingSource.type === "bytes") {
            if (strategy.size !== void 0) {
              throw new RangeError("The strategy for a byte stream cannot have a size function");
            }
            const highWaterMark = ExtractHighWaterMark(strategy, 0);
            SetUpReadableByteStreamControllerFromUnderlyingSource(this, underlyingSource, highWaterMark);
          } else {
            const sizeAlgorithm = ExtractSizeAlgorithm(strategy);
            const highWaterMark = ExtractHighWaterMark(strategy, 1);
            SetUpReadableStreamDefaultControllerFromUnderlyingSource(this, underlyingSource, highWaterMark, sizeAlgorithm);
          }
        }
        get locked() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("locked");
          }
          return IsReadableStreamLocked(this);
        }
        cancel(reason = void 0) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("cancel"));
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("Cannot cancel a stream that already has a reader"));
          }
          return ReadableStreamCancel(this, reason);
        }
        getReader(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("getReader");
          }
          const options = convertReaderOptions(rawOptions, "First parameter");
          if (options.mode === void 0) {
            return AcquireReadableStreamDefaultReader(this);
          }
          return AcquireReadableStreamBYOBReader(this);
        }
        pipeThrough(rawTransform, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("pipeThrough");
          }
          assertRequiredArgument(rawTransform, 1, "pipeThrough");
          const transform = convertReadableWritablePair(rawTransform, "First parameter");
          const options = convertPipeOptions(rawOptions, "Second parameter");
          if (IsReadableStreamLocked(this)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");
          }
          if (IsWritableStreamLocked(transform.writable)) {
            throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");
          }
          const promise2 = ReadableStreamPipeTo(this, transform.writable, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
          setPromiseIsHandledToTrue(promise2);
          return transform.readable;
        }
        pipeTo(destination, rawOptions = {}) {
          if (!IsReadableStream(this)) {
            return promiseRejectedWith(streamBrandCheckException$1("pipeTo"));
          }
          if (destination === void 0) {
            return promiseRejectedWith(`Parameter 1 is required in 'pipeTo'.`);
          }
          if (!IsWritableStream(destination)) {
            return promiseRejectedWith(new TypeError(`ReadableStream.prototype.pipeTo's first argument must be a WritableStream`));
          }
          let options;
          try {
            options = convertPipeOptions(rawOptions, "Second parameter");
          } catch (e2) {
            return promiseRejectedWith(e2);
          }
          if (IsReadableStreamLocked(this)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream"));
          }
          if (IsWritableStreamLocked(destination)) {
            return promiseRejectedWith(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream"));
          }
          return ReadableStreamPipeTo(this, destination, options.preventClose, options.preventAbort, options.preventCancel, options.signal);
        }
        tee() {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("tee");
          }
          const branches = ReadableStreamTee(this);
          return CreateArrayFromList(branches);
        }
        values(rawOptions = void 0) {
          if (!IsReadableStream(this)) {
            throw streamBrandCheckException$1("values");
          }
          const options = convertIteratorOptions(rawOptions, "First parameter");
          return AcquireReadableStreamAsyncIterator(this, options.preventCancel);
        }
      }
      Object.defineProperties(ReadableStream2.prototype, {
        cancel: { enumerable: true },
        getReader: { enumerable: true },
        pipeThrough: { enumerable: true },
        pipeTo: { enumerable: true },
        tee: { enumerable: true },
        values: { enumerable: true },
        locked: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.toStringTag, {
          value: "ReadableStream",
          configurable: true
        });
      }
      if (typeof SymbolPolyfill.asyncIterator === "symbol") {
        Object.defineProperty(ReadableStream2.prototype, SymbolPolyfill.asyncIterator, {
          value: ReadableStream2.prototype.values,
          writable: true,
          configurable: true
        });
      }
      function CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark = 1, sizeAlgorithm = () => 1) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableStreamDefaultController.prototype);
        SetUpReadableStreamDefaultController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, highWaterMark, sizeAlgorithm);
        return stream;
      }
      function CreateReadableByteStream(startAlgorithm, pullAlgorithm, cancelAlgorithm) {
        const stream = Object.create(ReadableStream2.prototype);
        InitializeReadableStream(stream);
        const controller = Object.create(ReadableByteStreamController.prototype);
        SetUpReadableByteStreamController(stream, controller, startAlgorithm, pullAlgorithm, cancelAlgorithm, 0, void 0);
        return stream;
      }
      function InitializeReadableStream(stream) {
        stream._state = "readable";
        stream._reader = void 0;
        stream._storedError = void 0;
        stream._disturbed = false;
      }
      function IsReadableStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_readableStreamController")) {
          return false;
        }
        return x2 instanceof ReadableStream2;
      }
      function IsReadableStreamLocked(stream) {
        if (stream._reader === void 0) {
          return false;
        }
        return true;
      }
      function ReadableStreamCancel(stream, reason) {
        stream._disturbed = true;
        if (stream._state === "closed") {
          return promiseResolvedWith(void 0);
        }
        if (stream._state === "errored") {
          return promiseRejectedWith(stream._storedError);
        }
        ReadableStreamClose(stream);
        const reader = stream._reader;
        if (reader !== void 0 && IsReadableStreamBYOBReader(reader)) {
          reader._readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._closeSteps(void 0);
          });
          reader._readIntoRequests = new SimpleQueue();
        }
        const sourceCancelPromise = stream._readableStreamController[CancelSteps](reason);
        return transformPromiseWith(sourceCancelPromise, noop2);
      }
      function ReadableStreamClose(stream) {
        stream._state = "closed";
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseResolve(reader);
        if (IsReadableStreamDefaultReader(reader)) {
          reader._readRequests.forEach((readRequest) => {
            readRequest._closeSteps();
          });
          reader._readRequests = new SimpleQueue();
        }
      }
      function ReadableStreamError(stream, e2) {
        stream._state = "errored";
        stream._storedError = e2;
        const reader = stream._reader;
        if (reader === void 0) {
          return;
        }
        defaultReaderClosedPromiseReject(reader, e2);
        if (IsReadableStreamDefaultReader(reader)) {
          reader._readRequests.forEach((readRequest) => {
            readRequest._errorSteps(e2);
          });
          reader._readRequests = new SimpleQueue();
        } else {
          reader._readIntoRequests.forEach((readIntoRequest) => {
            readIntoRequest._errorSteps(e2);
          });
          reader._readIntoRequests = new SimpleQueue();
        }
      }
      function streamBrandCheckException$1(name3) {
        return new TypeError(`ReadableStream.prototype.${name3} can only be used on a ReadableStream`);
      }
      function convertQueuingStrategyInit(init3, context) {
        assertDictionary(init3, context);
        const highWaterMark = init3 === null || init3 === void 0 ? void 0 : init3.highWaterMark;
        assertRequiredField(highWaterMark, "highWaterMark", "QueuingStrategyInit");
        return {
          highWaterMark: convertUnrestrictedDouble(highWaterMark)
        };
      }
      const byteLengthSizeFunction = (chunk) => {
        return chunk.byteLength;
      };
      try {
        Object.defineProperty(byteLengthSizeFunction, "name", {
          value: "size",
          configurable: true
        });
      } catch (_a) {
      }
      class ByteLengthQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "ByteLengthQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._byteLengthQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        get highWaterMark() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("highWaterMark");
          }
          return this._byteLengthQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!IsByteLengthQueuingStrategy(this)) {
            throw byteLengthBrandCheckException("size");
          }
          return byteLengthSizeFunction;
        }
      }
      Object.defineProperties(ByteLengthQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(ByteLengthQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
          value: "ByteLengthQueuingStrategy",
          configurable: true
        });
      }
      function byteLengthBrandCheckException(name3) {
        return new TypeError(`ByteLengthQueuingStrategy.prototype.${name3} can only be used on a ByteLengthQueuingStrategy`);
      }
      function IsByteLengthQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_byteLengthQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof ByteLengthQueuingStrategy;
      }
      const countSizeFunction = () => {
        return 1;
      };
      try {
        Object.defineProperty(countSizeFunction, "name", {
          value: "size",
          configurable: true
        });
      } catch (_a) {
      }
      class CountQueuingStrategy {
        constructor(options) {
          assertRequiredArgument(options, 1, "CountQueuingStrategy");
          options = convertQueuingStrategyInit(options, "First parameter");
          this._countQueuingStrategyHighWaterMark = options.highWaterMark;
        }
        get highWaterMark() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("highWaterMark");
          }
          return this._countQueuingStrategyHighWaterMark;
        }
        get size() {
          if (!IsCountQueuingStrategy(this)) {
            throw countBrandCheckException("size");
          }
          return countSizeFunction;
        }
      }
      Object.defineProperties(CountQueuingStrategy.prototype, {
        highWaterMark: { enumerable: true },
        size: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(CountQueuingStrategy.prototype, SymbolPolyfill.toStringTag, {
          value: "CountQueuingStrategy",
          configurable: true
        });
      }
      function countBrandCheckException(name3) {
        return new TypeError(`CountQueuingStrategy.prototype.${name3} can only be used on a CountQueuingStrategy`);
      }
      function IsCountQueuingStrategy(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_countQueuingStrategyHighWaterMark")) {
          return false;
        }
        return x2 instanceof CountQueuingStrategy;
      }
      function convertTransformer(original, context) {
        assertDictionary(original, context);
        const flush = original === null || original === void 0 ? void 0 : original.flush;
        const readableType = original === null || original === void 0 ? void 0 : original.readableType;
        const start = original === null || original === void 0 ? void 0 : original.start;
        const transform = original === null || original === void 0 ? void 0 : original.transform;
        const writableType = original === null || original === void 0 ? void 0 : original.writableType;
        return {
          flush: flush === void 0 ? void 0 : convertTransformerFlushCallback(flush, original, `${context} has member 'flush' that`),
          readableType,
          start: start === void 0 ? void 0 : convertTransformerStartCallback(start, original, `${context} has member 'start' that`),
          transform: transform === void 0 ? void 0 : convertTransformerTransformCallback(transform, original, `${context} has member 'transform' that`),
          writableType
        };
      }
      function convertTransformerFlushCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => promiseCall(fn, original, [controller]);
      }
      function convertTransformerStartCallback(fn, original, context) {
        assertFunction(fn, context);
        return (controller) => reflectCall(fn, original, [controller]);
      }
      function convertTransformerTransformCallback(fn, original, context) {
        assertFunction(fn, context);
        return (chunk, controller) => promiseCall(fn, original, [chunk, controller]);
      }
      class TransformStream {
        constructor(rawTransformer = {}, rawWritableStrategy = {}, rawReadableStrategy = {}) {
          if (rawTransformer === void 0) {
            rawTransformer = null;
          }
          const writableStrategy = convertQueuingStrategy(rawWritableStrategy, "Second parameter");
          const readableStrategy = convertQueuingStrategy(rawReadableStrategy, "Third parameter");
          const transformer = convertTransformer(rawTransformer, "First parameter");
          if (transformer.readableType !== void 0) {
            throw new RangeError("Invalid readableType specified");
          }
          if (transformer.writableType !== void 0) {
            throw new RangeError("Invalid writableType specified");
          }
          const readableHighWaterMark = ExtractHighWaterMark(readableStrategy, 0);
          const readableSizeAlgorithm = ExtractSizeAlgorithm(readableStrategy);
          const writableHighWaterMark = ExtractHighWaterMark(writableStrategy, 1);
          const writableSizeAlgorithm = ExtractSizeAlgorithm(writableStrategy);
          let startPromise_resolve;
          const startPromise = newPromise((resolve2) => {
            startPromise_resolve = resolve2;
          });
          InitializeTransformStream(this, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
          SetUpTransformStreamDefaultControllerFromTransformer(this, transformer);
          if (transformer.start !== void 0) {
            startPromise_resolve(transformer.start(this._transformStreamController));
          } else {
            startPromise_resolve(void 0);
          }
        }
        get readable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("readable");
          }
          return this._readable;
        }
        get writable() {
          if (!IsTransformStream(this)) {
            throw streamBrandCheckException("writable");
          }
          return this._writable;
        }
      }
      Object.defineProperties(TransformStream.prototype, {
        readable: { enumerable: true },
        writable: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(TransformStream.prototype, SymbolPolyfill.toStringTag, {
          value: "TransformStream",
          configurable: true
        });
      }
      function InitializeTransformStream(stream, startPromise, writableHighWaterMark, writableSizeAlgorithm, readableHighWaterMark, readableSizeAlgorithm) {
        function startAlgorithm() {
          return startPromise;
        }
        function writeAlgorithm(chunk) {
          return TransformStreamDefaultSinkWriteAlgorithm(stream, chunk);
        }
        function abortAlgorithm(reason) {
          return TransformStreamDefaultSinkAbortAlgorithm(stream, reason);
        }
        function closeAlgorithm() {
          return TransformStreamDefaultSinkCloseAlgorithm(stream);
        }
        stream._writable = CreateWritableStream(startAlgorithm, writeAlgorithm, closeAlgorithm, abortAlgorithm, writableHighWaterMark, writableSizeAlgorithm);
        function pullAlgorithm() {
          return TransformStreamDefaultSourcePullAlgorithm(stream);
        }
        function cancelAlgorithm(reason) {
          TransformStreamErrorWritableAndUnblockWrite(stream, reason);
          return promiseResolvedWith(void 0);
        }
        stream._readable = CreateReadableStream(startAlgorithm, pullAlgorithm, cancelAlgorithm, readableHighWaterMark, readableSizeAlgorithm);
        stream._backpressure = void 0;
        stream._backpressureChangePromise = void 0;
        stream._backpressureChangePromise_resolve = void 0;
        TransformStreamSetBackpressure(stream, true);
        stream._transformStreamController = void 0;
      }
      function IsTransformStream(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_transformStreamController")) {
          return false;
        }
        return x2 instanceof TransformStream;
      }
      function TransformStreamError(stream, e2) {
        ReadableStreamDefaultControllerError(stream._readable._readableStreamController, e2);
        TransformStreamErrorWritableAndUnblockWrite(stream, e2);
      }
      function TransformStreamErrorWritableAndUnblockWrite(stream, e2) {
        TransformStreamDefaultControllerClearAlgorithms(stream._transformStreamController);
        WritableStreamDefaultControllerErrorIfNeeded(stream._writable._writableStreamController, e2);
        if (stream._backpressure) {
          TransformStreamSetBackpressure(stream, false);
        }
      }
      function TransformStreamSetBackpressure(stream, backpressure) {
        if (stream._backpressureChangePromise !== void 0) {
          stream._backpressureChangePromise_resolve();
        }
        stream._backpressureChangePromise = newPromise((resolve2) => {
          stream._backpressureChangePromise_resolve = resolve2;
        });
        stream._backpressure = backpressure;
      }
      class TransformStreamDefaultController {
        constructor() {
          throw new TypeError("Illegal constructor");
        }
        get desiredSize() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("desiredSize");
          }
          const readableController = this._controlledTransformStream._readable._readableStreamController;
          return ReadableStreamDefaultControllerGetDesiredSize(readableController);
        }
        enqueue(chunk = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("enqueue");
          }
          TransformStreamDefaultControllerEnqueue(this, chunk);
        }
        error(reason = void 0) {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("error");
          }
          TransformStreamDefaultControllerError(this, reason);
        }
        terminate() {
          if (!IsTransformStreamDefaultController(this)) {
            throw defaultControllerBrandCheckException("terminate");
          }
          TransformStreamDefaultControllerTerminate(this);
        }
      }
      Object.defineProperties(TransformStreamDefaultController.prototype, {
        enqueue: { enumerable: true },
        error: { enumerable: true },
        terminate: { enumerable: true },
        desiredSize: { enumerable: true }
      });
      if (typeof SymbolPolyfill.toStringTag === "symbol") {
        Object.defineProperty(TransformStreamDefaultController.prototype, SymbolPolyfill.toStringTag, {
          value: "TransformStreamDefaultController",
          configurable: true
        });
      }
      function IsTransformStreamDefaultController(x2) {
        if (!typeIsObject(x2)) {
          return false;
        }
        if (!Object.prototype.hasOwnProperty.call(x2, "_controlledTransformStream")) {
          return false;
        }
        return x2 instanceof TransformStreamDefaultController;
      }
      function SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm) {
        controller._controlledTransformStream = stream;
        stream._transformStreamController = controller;
        controller._transformAlgorithm = transformAlgorithm;
        controller._flushAlgorithm = flushAlgorithm;
      }
      function SetUpTransformStreamDefaultControllerFromTransformer(stream, transformer) {
        const controller = Object.create(TransformStreamDefaultController.prototype);
        let transformAlgorithm = (chunk) => {
          try {
            TransformStreamDefaultControllerEnqueue(controller, chunk);
            return promiseResolvedWith(void 0);
          } catch (transformResultE) {
            return promiseRejectedWith(transformResultE);
          }
        };
        let flushAlgorithm = () => promiseResolvedWith(void 0);
        if (transformer.transform !== void 0) {
          transformAlgorithm = (chunk) => transformer.transform(chunk, controller);
        }
        if (transformer.flush !== void 0) {
          flushAlgorithm = () => transformer.flush(controller);
        }
        SetUpTransformStreamDefaultController(stream, controller, transformAlgorithm, flushAlgorithm);
      }
      function TransformStreamDefaultControllerClearAlgorithms(controller) {
        controller._transformAlgorithm = void 0;
        controller._flushAlgorithm = void 0;
      }
      function TransformStreamDefaultControllerEnqueue(controller, chunk) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        if (!ReadableStreamDefaultControllerCanCloseOrEnqueue(readableController)) {
          throw new TypeError("Readable side is not in a state that permits enqueue");
        }
        try {
          ReadableStreamDefaultControllerEnqueue(readableController, chunk);
        } catch (e2) {
          TransformStreamErrorWritableAndUnblockWrite(stream, e2);
          throw stream._readable._storedError;
        }
        const backpressure = ReadableStreamDefaultControllerHasBackpressure(readableController);
        if (backpressure !== stream._backpressure) {
          TransformStreamSetBackpressure(stream, true);
        }
      }
      function TransformStreamDefaultControllerError(controller, e2) {
        TransformStreamError(controller._controlledTransformStream, e2);
      }
      function TransformStreamDefaultControllerPerformTransform(controller, chunk) {
        const transformPromise = controller._transformAlgorithm(chunk);
        return transformPromiseWith(transformPromise, void 0, (r2) => {
          TransformStreamError(controller._controlledTransformStream, r2);
          throw r2;
        });
      }
      function TransformStreamDefaultControllerTerminate(controller) {
        const stream = controller._controlledTransformStream;
        const readableController = stream._readable._readableStreamController;
        ReadableStreamDefaultControllerClose(readableController);
        const error6 = new TypeError("TransformStream terminated");
        TransformStreamErrorWritableAndUnblockWrite(stream, error6);
      }
      function TransformStreamDefaultSinkWriteAlgorithm(stream, chunk) {
        const controller = stream._transformStreamController;
        if (stream._backpressure) {
          const backpressureChangePromise = stream._backpressureChangePromise;
          return transformPromiseWith(backpressureChangePromise, () => {
            const writable = stream._writable;
            const state2 = writable._state;
            if (state2 === "erroring") {
              throw writable._storedError;
            }
            return TransformStreamDefaultControllerPerformTransform(controller, chunk);
          });
        }
        return TransformStreamDefaultControllerPerformTransform(controller, chunk);
      }
      function TransformStreamDefaultSinkAbortAlgorithm(stream, reason) {
        TransformStreamError(stream, reason);
        return promiseResolvedWith(void 0);
      }
      function TransformStreamDefaultSinkCloseAlgorithm(stream) {
        const readable = stream._readable;
        const controller = stream._transformStreamController;
        const flushPromise = controller._flushAlgorithm();
        TransformStreamDefaultControllerClearAlgorithms(controller);
        return transformPromiseWith(flushPromise, () => {
          if (readable._state === "errored") {
            throw readable._storedError;
          }
          ReadableStreamDefaultControllerClose(readable._readableStreamController);
        }, (r2) => {
          TransformStreamError(stream, r2);
          throw readable._storedError;
        });
      }
      function TransformStreamDefaultSourcePullAlgorithm(stream) {
        TransformStreamSetBackpressure(stream, false);
        return stream._backpressureChangePromise;
      }
      function defaultControllerBrandCheckException(name3) {
        return new TypeError(`TransformStreamDefaultController.prototype.${name3} can only be used on a TransformStreamDefaultController`);
      }
      function streamBrandCheckException(name3) {
        return new TypeError(`TransformStream.prototype.${name3} can only be used on a TransformStream`);
      }
      exports2.ByteLengthQueuingStrategy = ByteLengthQueuingStrategy;
      exports2.CountQueuingStrategy = CountQueuingStrategy;
      exports2.ReadableByteStreamController = ReadableByteStreamController;
      exports2.ReadableStream = ReadableStream2;
      exports2.ReadableStreamBYOBReader = ReadableStreamBYOBReader;
      exports2.ReadableStreamBYOBRequest = ReadableStreamBYOBRequest;
      exports2.ReadableStreamDefaultController = ReadableStreamDefaultController;
      exports2.ReadableStreamDefaultReader = ReadableStreamDefaultReader;
      exports2.TransformStream = TransformStream;
      exports2.TransformStreamDefaultController = TransformStreamDefaultController;
      exports2.WritableStream = WritableStream;
      exports2.WritableStreamDefaultController = WritableStreamDefaultController;
      exports2.WritableStreamDefaultWriter = WritableStreamDefaultWriter;
      Object.defineProperty(exports2, "__esModule", { value: true });
    });
  }
});

// node_modules/fetch-blob/streams.cjs
var require_streams = __commonJS({
  "node_modules/fetch-blob/streams.cjs"() {
    var POOL_SIZE2 = 65536;
    if (!globalThis.ReadableStream) {
      try {
        const process4 = require("node:process");
        const { emitWarning } = process4;
        try {
          process4.emitWarning = () => {
          };
          Object.assign(globalThis, require("node:stream/web"));
          process4.emitWarning = emitWarning;
        } catch (error6) {
          process4.emitWarning = emitWarning;
          throw error6;
        }
      } catch (error6) {
        Object.assign(globalThis, require_ponyfill_es2018());
      }
    }
    try {
      const { Blob: Blob5 } = require("buffer");
      if (Blob5 && !Blob5.prototype.stream) {
        Blob5.prototype.stream = function name3(params) {
          let position = 0;
          const blob = this;
          return new ReadableStream({
            type: "bytes",
            async pull(ctrl) {
              const chunk = blob.slice(position, Math.min(blob.size, position + POOL_SIZE2));
              const buffer = await chunk.arrayBuffer();
              position += buffer.byteLength;
              ctrl.enqueue(new Uint8Array(buffer));
              if (position === blob.size) {
                ctrl.close();
              }
            }
          });
        };
      }
    } catch (error6) {
    }
  }
});

// node_modules/fetch-blob/index.js
async function* toIterator(parts, clone2 = true) {
  for (const part of parts) {
    if ("stream" in part) {
      yield* part.stream();
    } else if (ArrayBuffer.isView(part)) {
      if (clone2) {
        let position = part.byteOffset;
        const end2 = part.byteOffset + part.byteLength;
        while (position !== end2) {
          const size5 = Math.min(end2 - position, POOL_SIZE);
          const chunk = part.buffer.slice(position, position + size5);
          position += chunk.byteLength;
          yield new Uint8Array(chunk);
        }
      } else {
        yield part;
      }
    } else {
      let position = 0, b = part;
      while (position !== b.size) {
        const chunk = b.slice(position, Math.min(b.size, position + POOL_SIZE));
        const buffer = await chunk.arrayBuffer();
        position += buffer.byteLength;
        yield new Uint8Array(buffer);
      }
    }
  }
}
var import_streams, POOL_SIZE, _Blob, Blob4, fetch_blob_default;
var init_fetch_blob = __esm({
  "node_modules/fetch-blob/index.js"() {
    import_streams = __toESM(require_streams(), 1);
    POOL_SIZE = 65536;
    _Blob = class Blob3 {
      #parts = [];
      #type = "";
      #size = 0;
      #endings = "transparent";
      constructor(blobParts = [], options = {}) {
        if (typeof blobParts !== "object" || blobParts === null) {
          throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");
        }
        if (typeof blobParts[Symbol.iterator] !== "function") {
          throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");
        }
        if (typeof options !== "object" && typeof options !== "function") {
          throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");
        }
        if (options === null)
          options = {};
        const encoder = new TextEncoder();
        for (const element of blobParts) {
          let part;
          if (ArrayBuffer.isView(element)) {
            part = new Uint8Array(element.buffer.slice(element.byteOffset, element.byteOffset + element.byteLength));
          } else if (element instanceof ArrayBuffer) {
            part = new Uint8Array(element.slice(0));
          } else if (element instanceof Blob3) {
            part = element;
          } else {
            part = encoder.encode(`${element}`);
          }
          this.#size += ArrayBuffer.isView(part) ? part.byteLength : part.size;
          this.#parts.push(part);
        }
        this.#endings = `${options.endings === void 0 ? "transparent" : options.endings}`;
        const type = options.type === void 0 ? "" : String(options.type);
        this.#type = /^[\x20-\x7E]*$/.test(type) ? type : "";
      }
      get size() {
        return this.#size;
      }
      get type() {
        return this.#type;
      }
      async text() {
        const decoder = new TextDecoder();
        let str = "";
        for await (const part of toIterator(this.#parts, false)) {
          str += decoder.decode(part, { stream: true });
        }
        str += decoder.decode();
        return str;
      }
      async arrayBuffer() {
        const data = new Uint8Array(this.size);
        let offset = 0;
        for await (const chunk of toIterator(this.#parts, false)) {
          data.set(chunk, offset);
          offset += chunk.length;
        }
        return data.buffer;
      }
      stream() {
        const it = toIterator(this.#parts, true);
        return new globalThis.ReadableStream({
          type: "bytes",
          async pull(ctrl) {
            const chunk = await it.next();
            chunk.done ? ctrl.close() : ctrl.enqueue(chunk.value);
          },
          async cancel() {
            await it.return();
          }
        });
      }
      slice(start = 0, end2 = this.size, type = "") {
        const { size: size5 } = this;
        let relativeStart = start < 0 ? Math.max(size5 + start, 0) : Math.min(start, size5);
        let relativeEnd = end2 < 0 ? Math.max(size5 + end2, 0) : Math.min(end2, size5);
        const span3 = Math.max(relativeEnd - relativeStart, 0);
        const parts = this.#parts;
        const blobParts = [];
        let added = 0;
        for (const part of parts) {
          if (added >= span3) {
            break;
          }
          const size6 = ArrayBuffer.isView(part) ? part.byteLength : part.size;
          if (relativeStart && size6 <= relativeStart) {
            relativeStart -= size6;
            relativeEnd -= size6;
          } else {
            let chunk;
            if (ArrayBuffer.isView(part)) {
              chunk = part.subarray(relativeStart, Math.min(size6, relativeEnd));
              added += chunk.byteLength;
            } else {
              chunk = part.slice(relativeStart, Math.min(size6, relativeEnd));
              added += chunk.size;
            }
            relativeEnd -= size6;
            blobParts.push(chunk);
            relativeStart = 0;
          }
        }
        const blob = new Blob3([], { type: String(type).toLowerCase() });
        blob.#size = span3;
        blob.#parts = blobParts;
        return blob;
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
      static [Symbol.hasInstance](object) {
        return object && typeof object === "object" && typeof object.constructor === "function" && (typeof object.stream === "function" || typeof object.arrayBuffer === "function") && /^(Blob|File)$/.test(object[Symbol.toStringTag]);
      }
    };
    Object.defineProperties(_Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Blob4 = _Blob;
    fetch_blob_default = Blob4;
  }
});

// node_modules/fetch-blob/file.js
var _File, File2, file_default;
var init_file = __esm({
  "node_modules/fetch-blob/file.js"() {
    init_fetch_blob();
    _File = class File extends fetch_blob_default {
      #lastModified = 0;
      #name = "";
      constructor(fileBits, fileName, options = {}) {
        if (arguments.length < 2) {
          throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);
        }
        super(fileBits, options);
        if (options === null)
          options = {};
        const lastModified = options.lastModified === void 0 ? Date.now() : Number(options.lastModified);
        if (!Number.isNaN(lastModified)) {
          this.#lastModified = lastModified;
        }
        this.#name = String(fileName);
      }
      get name() {
        return this.#name;
      }
      get lastModified() {
        return this.#lastModified;
      }
      get [Symbol.toStringTag]() {
        return "File";
      }
      static [Symbol.hasInstance](object) {
        return !!object && object instanceof fetch_blob_default && /^(File)$/.test(object[Symbol.toStringTag]);
      }
    };
    File2 = _File;
    file_default = File2;
  }
});

// node_modules/formdata-polyfill/esm.min.js
function formDataToBlob(F2, B = fetch_blob_default) {
  var b = `${r()}${r()}`.replace(/\./g, "").slice(-28).padStart(32, "-"), c = [], p = `--${b}\r
Content-Disposition: form-data; name="`;
  F2.forEach((v, n) => typeof v == "string" ? c.push(p + e(n) + `"\r
\r
${v.replace(/\r(?!\n)|(?<!\r)\n/g, "\r\n")}\r
`) : c.push(p + e(n) + `"; filename="${e(v.name, 1)}"\r
Content-Type: ${v.type || "application/octet-stream"}\r
\r
`, v, "\r\n"));
  c.push(`--${b}--`);
  return new B(c, { type: "multipart/form-data; boundary=" + b });
}
var t, i, h, r, m, f, e, x, FormData2;
var init_esm_min = __esm({
  "node_modules/formdata-polyfill/esm.min.js"() {
    init_fetch_blob();
    init_file();
    ({ toStringTag: t, iterator: i, hasInstance: h } = Symbol);
    r = Math.random;
    m = "append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(",");
    f = (a, b, c) => (a += "", /^(Blob|File)$/.test(b && b[t]) ? [(c = c !== void 0 ? c + "" : b[t] == "File" ? b.name : "blob", a), b.name !== c || b[t] == "blob" ? new file_default([b], c, b) : b] : [a, b + ""]);
    e = (c, f3) => (f3 ? c : c.replace(/\r?\n|\r/g, "\r\n")).replace(/\n/g, "%0A").replace(/\r/g, "%0D").replace(/"/g, "%22");
    x = (n, a, e2) => {
      if (a.length < e2) {
        throw new TypeError(`Failed to execute '${n}' on 'FormData': ${e2} arguments required, but only ${a.length} present.`);
      }
    };
    FormData2 = class FormData3 {
      #d = [];
      constructor(...a) {
        if (a.length)
          throw new TypeError(`Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.`);
      }
      get [t]() {
        return "FormData";
      }
      [i]() {
        return this.entries();
      }
      static [h](o) {
        return o && typeof o === "object" && o[t] === "FormData" && !m.some((m2) => typeof o[m2] != "function");
      }
      append(...a) {
        x("append", arguments, 2);
        this.#d.push(f(...a));
      }
      delete(a) {
        x("delete", arguments, 1);
        a += "";
        this.#d = this.#d.filter(([b]) => b !== a);
      }
      get(a) {
        x("get", arguments, 1);
        a += "";
        for (var b = this.#d, l = b.length, c = 0; c < l; c++)
          if (b[c][0] === a)
            return b[c][1];
        return null;
      }
      getAll(a, b) {
        x("getAll", arguments, 1);
        b = [];
        a += "";
        this.#d.forEach((c) => c[0] === a && b.push(c[1]));
        return b;
      }
      has(a) {
        x("has", arguments, 1);
        a += "";
        return this.#d.some((b) => b[0] === a);
      }
      forEach(a, b) {
        x("forEach", arguments, 1);
        for (var [c, d] of this)
          a.call(b, d, c, this);
      }
      set(...a) {
        x("set", arguments, 2);
        var b = [], c = true;
        a = f(...a);
        this.#d.forEach((d) => {
          d[0] === a[0] ? c && (c = !b.push(a)) : b.push(d);
        });
        c && b.push(a);
        this.#d = b;
      }
      *entries() {
        yield* this.#d;
      }
      *keys() {
        for (var [a] of this)
          yield a;
      }
      *values() {
        for (var [, a] of this)
          yield a;
      }
    };
  }
});

// node_modules/node-domexception/index.js
var require_node_domexception = __commonJS({
  "node_modules/node-domexception/index.js"(exports, module2) {
    if (!globalThis.DOMException) {
      try {
        const { MessageChannel } = require("worker_threads"), port = new MessageChannel().port1, ab = new ArrayBuffer();
        port.postMessage(ab, [ab, ab]);
      } catch (err) {
        err.constructor.name === "DOMException" && (globalThis.DOMException = err.constructor);
      }
    }
    module2.exports = globalThis.DOMException;
  }
});

// node_modules/fetch-blob/from.js
var import_node_fs, import_node_domexception, stat3, BlobDataItem;
var init_from = __esm({
  "node_modules/fetch-blob/from.js"() {
    import_node_fs = require("node:fs");
    import_node_domexception = __toESM(require_node_domexception(), 1);
    init_file();
    init_fetch_blob();
    ({ stat: stat3 } = import_node_fs.promises);
    BlobDataItem = class {
      #path;
      #start;
      constructor(options) {
        this.#path = options.path;
        this.#start = options.start;
        this.size = options.size;
        this.lastModified = options.lastModified;
      }
      slice(start, end2) {
        return new BlobDataItem({
          path: this.#path,
          lastModified: this.lastModified,
          size: end2 - start,
          start: this.#start + start
        });
      }
      async *stream() {
        const { mtimeMs } = await stat3(this.#path);
        if (mtimeMs > this.lastModified) {
          throw new import_node_domexception.default("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.", "NotReadableError");
        }
        yield* (0, import_node_fs.createReadStream)(this.#path, {
          start: this.#start,
          end: this.#start + this.size - 1
        });
      }
      get [Symbol.toStringTag]() {
        return "Blob";
      }
    };
  }
});

// node_modules/node-fetch/src/utils/multipart-parser.js
var multipart_parser_exports = {};
__export(multipart_parser_exports, {
  toFormData: () => toFormData
});
function _fileName(headerValue) {
  const m2 = headerValue.match(/\bfilename=("(.*?)"|([^()<>@,;:\\"/[\]?={}\s\t]+))($|;\s)/i);
  if (!m2) {
    return;
  }
  const match2 = m2[2] || m2[3] || "";
  let filename = match2.slice(match2.lastIndexOf("\\") + 1);
  filename = filename.replace(/%22/g, '"');
  filename = filename.replace(/&#(\d{4});/g, (m3, code) => {
    return String.fromCharCode(code);
  });
  return filename;
}
async function toFormData(Body2, ct) {
  if (!/multipart/i.test(ct)) {
    throw new TypeError("Failed to fetch");
  }
  const m2 = ct.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  if (!m2) {
    throw new TypeError("no or bad content-type header, no multipart boundary");
  }
  const parser = new MultipartParser(m2[1] || m2[2]);
  let headerField;
  let headerValue;
  let entryValue;
  let entryName;
  let contentType;
  let filename;
  const entryChunks = [];
  const formData = new FormData2();
  const onPartData = (ui8a) => {
    entryValue += decoder.decode(ui8a, { stream: true });
  };
  const appendToFile = (ui8a) => {
    entryChunks.push(ui8a);
  };
  const appendFileToFormData = () => {
    const file = new file_default(entryChunks, filename, { type: contentType });
    formData.append(entryName, file);
  };
  const appendEntryToFormData = () => {
    formData.append(entryName, entryValue);
  };
  const decoder = new TextDecoder("utf-8");
  decoder.decode();
  parser.onPartBegin = function() {
    parser.onPartData = onPartData;
    parser.onPartEnd = appendEntryToFormData;
    headerField = "";
    headerValue = "";
    entryValue = "";
    entryName = "";
    contentType = "";
    filename = null;
    entryChunks.length = 0;
  };
  parser.onHeaderField = function(ui8a) {
    headerField += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderValue = function(ui8a) {
    headerValue += decoder.decode(ui8a, { stream: true });
  };
  parser.onHeaderEnd = function() {
    headerValue += decoder.decode();
    headerField = headerField.toLowerCase();
    if (headerField === "content-disposition") {
      const m3 = headerValue.match(/\bname=("([^"]*)"|([^()<>@,;:\\"/[\]?={}\s\t]+))/i);
      if (m3) {
        entryName = m3[2] || m3[3] || "";
      }
      filename = _fileName(headerValue);
      if (filename) {
        parser.onPartData = appendToFile;
        parser.onPartEnd = appendFileToFormData;
      }
    } else if (headerField === "content-type") {
      contentType = headerValue;
    }
    headerValue = "";
    headerField = "";
  };
  for await (const chunk of Body2) {
    parser.write(chunk);
  }
  parser.end();
  return formData;
}
var s, S, f2, F, LF, CR, SPACE, HYPHEN, COLON, A, Z, lower2, noop, MultipartParser;
var init_multipart_parser = __esm({
  "node_modules/node-fetch/src/utils/multipart-parser.js"() {
    init_from();
    init_esm_min();
    s = 0;
    S = {
      START_BOUNDARY: s++,
      HEADER_FIELD_START: s++,
      HEADER_FIELD: s++,
      HEADER_VALUE_START: s++,
      HEADER_VALUE: s++,
      HEADER_VALUE_ALMOST_DONE: s++,
      HEADERS_ALMOST_DONE: s++,
      PART_DATA_START: s++,
      PART_DATA: s++,
      END: s++
    };
    f2 = 1;
    F = {
      PART_BOUNDARY: f2,
      LAST_BOUNDARY: f2 *= 2
    };
    LF = 10;
    CR = 13;
    SPACE = 32;
    HYPHEN = 45;
    COLON = 58;
    A = 97;
    Z = 122;
    lower2 = (c) => c | 32;
    noop = () => {
    };
    MultipartParser = class {
      constructor(boundary) {
        this.index = 0;
        this.flags = 0;
        this.onHeaderEnd = noop;
        this.onHeaderField = noop;
        this.onHeadersEnd = noop;
        this.onHeaderValue = noop;
        this.onPartBegin = noop;
        this.onPartData = noop;
        this.onPartEnd = noop;
        this.boundaryChars = {};
        boundary = "\r\n--" + boundary;
        const ui8a = new Uint8Array(boundary.length);
        for (let i2 = 0; i2 < boundary.length; i2++) {
          ui8a[i2] = boundary.charCodeAt(i2);
          this.boundaryChars[ui8a[i2]] = true;
        }
        this.boundary = ui8a;
        this.lookbehind = new Uint8Array(this.boundary.length + 8);
        this.state = S.START_BOUNDARY;
      }
      write(data) {
        let i2 = 0;
        const length_ = data.length;
        let previousIndex = this.index;
        let { lookbehind, boundary, boundaryChars, index: index3, state: state2, flags } = this;
        const boundaryLength = this.boundary.length;
        const boundaryEnd = boundaryLength - 1;
        const bufferLength = data.length;
        let c;
        let cl;
        const mark = (name3) => {
          this[name3 + "Mark"] = i2;
        };
        const clear2 = (name3) => {
          delete this[name3 + "Mark"];
        };
        const callback = (callbackSymbol, start, end2, ui8a) => {
          if (start === void 0 || start !== end2) {
            this[callbackSymbol](ui8a && ui8a.subarray(start, end2));
          }
        };
        const dataCallback = (name3, clear3) => {
          const markSymbol = name3 + "Mark";
          if (!(markSymbol in this)) {
            return;
          }
          if (clear3) {
            callback(name3, this[markSymbol], i2, data);
            delete this[markSymbol];
          } else {
            callback(name3, this[markSymbol], data.length, data);
            this[markSymbol] = 0;
          }
        };
        for (i2 = 0; i2 < length_; i2++) {
          c = data[i2];
          switch (state2) {
            case S.START_BOUNDARY:
              if (index3 === boundary.length - 2) {
                if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else if (c !== CR) {
                  return;
                }
                index3++;
                break;
              } else if (index3 - 1 === boundary.length - 2) {
                if (flags & F.LAST_BOUNDARY && c === HYPHEN) {
                  state2 = S.END;
                  flags = 0;
                } else if (!(flags & F.LAST_BOUNDARY) && c === LF) {
                  index3 = 0;
                  callback("onPartBegin");
                  state2 = S.HEADER_FIELD_START;
                } else {
                  return;
                }
                break;
              }
              if (c !== boundary[index3 + 2]) {
                index3 = -2;
              }
              if (c === boundary[index3 + 2]) {
                index3++;
              }
              break;
            case S.HEADER_FIELD_START:
              state2 = S.HEADER_FIELD;
              mark("onHeaderField");
              index3 = 0;
            case S.HEADER_FIELD:
              if (c === CR) {
                clear2("onHeaderField");
                state2 = S.HEADERS_ALMOST_DONE;
                break;
              }
              index3++;
              if (c === HYPHEN) {
                break;
              }
              if (c === COLON) {
                if (index3 === 1) {
                  return;
                }
                dataCallback("onHeaderField", true);
                state2 = S.HEADER_VALUE_START;
                break;
              }
              cl = lower2(c);
              if (cl < A || cl > Z) {
                return;
              }
              break;
            case S.HEADER_VALUE_START:
              if (c === SPACE) {
                break;
              }
              mark("onHeaderValue");
              state2 = S.HEADER_VALUE;
            case S.HEADER_VALUE:
              if (c === CR) {
                dataCallback("onHeaderValue", true);
                callback("onHeaderEnd");
                state2 = S.HEADER_VALUE_ALMOST_DONE;
              }
              break;
            case S.HEADER_VALUE_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              state2 = S.HEADER_FIELD_START;
              break;
            case S.HEADERS_ALMOST_DONE:
              if (c !== LF) {
                return;
              }
              callback("onHeadersEnd");
              state2 = S.PART_DATA_START;
              break;
            case S.PART_DATA_START:
              state2 = S.PART_DATA;
              mark("onPartData");
            case S.PART_DATA:
              previousIndex = index3;
              if (index3 === 0) {
                i2 += boundaryEnd;
                while (i2 < bufferLength && !(data[i2] in boundaryChars)) {
                  i2 += boundaryLength;
                }
                i2 -= boundaryEnd;
                c = data[i2];
              }
              if (index3 < boundary.length) {
                if (boundary[index3] === c) {
                  if (index3 === 0) {
                    dataCallback("onPartData", true);
                  }
                  index3++;
                } else {
                  index3 = 0;
                }
              } else if (index3 === boundary.length) {
                index3++;
                if (c === CR) {
                  flags |= F.PART_BOUNDARY;
                } else if (c === HYPHEN) {
                  flags |= F.LAST_BOUNDARY;
                } else {
                  index3 = 0;
                }
              } else if (index3 - 1 === boundary.length) {
                if (flags & F.PART_BOUNDARY) {
                  index3 = 0;
                  if (c === LF) {
                    flags &= ~F.PART_BOUNDARY;
                    callback("onPartEnd");
                    callback("onPartBegin");
                    state2 = S.HEADER_FIELD_START;
                    break;
                  }
                } else if (flags & F.LAST_BOUNDARY) {
                  if (c === HYPHEN) {
                    callback("onPartEnd");
                    state2 = S.END;
                    flags = 0;
                  } else {
                    index3 = 0;
                  }
                } else {
                  index3 = 0;
                }
              }
              if (index3 > 0) {
                lookbehind[index3 - 1] = c;
              } else if (previousIndex > 0) {
                const _lookbehind = new Uint8Array(lookbehind.buffer, lookbehind.byteOffset, lookbehind.byteLength);
                callback("onPartData", 0, previousIndex, _lookbehind);
                previousIndex = 0;
                mark("onPartData");
                i2--;
              }
              break;
            case S.END:
              break;
            default:
              throw new Error(`Unexpected state entered: ${state2}`);
          }
        }
        dataCallback("onHeaderField");
        dataCallback("onHeaderValue");
        dataCallback("onPartData");
        this.index = index3;
        this.state = state2;
        this.flags = flags;
      }
      end() {
        if (this.state === S.HEADER_FIELD_START && this.index === 0 || this.state === S.PART_DATA && this.index === this.boundary.length) {
          this.onPartEnd();
        } else if (this.state !== S.END) {
          throw new Error("MultipartParser.end(): stream ended unexpectedly");
        }
      }
    };
  }
});

// output/Main/foreign.js
var dirnameImpl = () => __dirname;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqCharImpl = refEq;
var eqStringImpl = refEq;

// output/Type.Proxy/index.js
var $$Proxy = /* @__PURE__ */ function() {
  function $$Proxy2() {
  }
  ;
  $$Proxy2.value = new $$Proxy2();
  return $$Proxy2;
}();

// output/Data.Symbol/index.js
var reflectSymbol = function(dict) {
  return dict.reflectSymbol;
};

// output/Record.Unsafe/foreign.js
var unsafeGet = function(label) {
  return function(rec) {
    return rec[label];
  };
};

// output/Data.Eq/index.js
var eqString = {
  eq: eqStringImpl
};
var eqInt = {
  eq: eqIntImpl
};
var eqChar = {
  eq: eqCharImpl
};
var eq = function(dict) {
  return dict.eq;
};

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x2) {
  return x2;
};

// output/Safe.Coerce/index.js
var coerce = function() {
  return unsafeCoerce2;
};

// output/Data.Newtype/index.js
var coerce2 = /* @__PURE__ */ coerce();
var unwrap = function() {
  return coerce2;
};
var unwrap1 = /* @__PURE__ */ unwrap();
var un = function() {
  return function(v) {
    return unwrap1;
  };
};
var alaF = function() {
  return function() {
    return function() {
      return function() {
        return function(v) {
          return coerce2;
        };
      };
    };
  };
};

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq4) {
    return function(gt) {
      return function(x2) {
        return function(y) {
          return x2 < y ? lt : x2 === y ? eq4 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordCharImpl = unsafeCompareImpl;

// output/Data.Ordering/index.js
var LT = /* @__PURE__ */ function() {
  function LT2() {
  }
  ;
  LT2.value = new LT2();
  return LT2;
}();
var GT = /* @__PURE__ */ function() {
  function GT2() {
  }
  ;
  GT2.value = new GT2();
  return GT2;
}();
var EQ = /* @__PURE__ */ function() {
  function EQ2() {
  }
  ;
  EQ2.value = new EQ2();
  return EQ2;
}();

// output/Data.Ring/foreign.js
var intSub = function(x2) {
  return function(y) {
    return x2 - y | 0;
  };
};

// output/Data.Semiring/foreign.js
var intAdd = function(x2) {
  return function(y) {
    return x2 + y | 0;
  };
};
var intMul = function(x2) {
  return function(y) {
    return x2 * y | 0;
  };
};

// output/Data.Unit/foreign.js
var unit = void 0;

// output/Data.Semiring/index.js
var semiringInt = {
  add: intAdd,
  zero: 0,
  mul: intMul,
  one: 1
};

// output/Data.Ring/index.js
var ringInt = {
  sub: intSub,
  Semiring0: function() {
    return semiringInt;
  }
};

// output/Data.Ord/index.js
var ordInt = /* @__PURE__ */ function() {
  return {
    compare: ordIntImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqInt;
    }
  };
}();
var ordChar = /* @__PURE__ */ function() {
  return {
    compare: ordCharImpl(LT.value)(EQ.value)(GT.value),
    Eq0: function() {
      return eqChar;
    }
  };
}();
var compare = function(dict) {
  return dict.compare;
};
var greaterThanOrEq = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(a1) {
    return function(a2) {
      var v = compare3(a1)(a2);
      if (v instanceof LT) {
        return false;
      }
      ;
      return true;
    };
  };
};
var lessThan = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(a1) {
    return function(a2) {
      var v = compare3(a1)(a2);
      if (v instanceof LT) {
        return true;
      }
      ;
      return false;
    };
  };
};
var lessThanOrEq = function(dictOrd) {
  var compare3 = compare(dictOrd);
  return function(a1) {
    return function(a2) {
      var v = compare3(a1)(a2);
      if (v instanceof GT) {
        return false;
      }
      ;
      return true;
    };
  };
};

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showStringImpl = function(s2) {
  var l = s2.length;
  return '"' + s2.replace(/[\0-\x1F\x7F"\\]/g, function(c, i2) {
    switch (c) {
      case '"':
      case "\\":
        return "\\" + c;
      case "\x07":
        return "\\a";
      case "\b":
        return "\\b";
      case "\f":
        return "\\f";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case "	":
        return "\\t";
      case "\v":
        return "\\v";
    }
    var k = i2 + 1;
    var empty4 = k < l && s2[k] >= "0" && s2[k] <= "9" ? "\\&" : "";
    return "\\" + c.charCodeAt(0).toString(10) + empty4;
  }) + '"';
};

// output/Data.Show/index.js
var showString = {
  show: showStringImpl
};
var showInt = {
  show: showIntImpl
};
var show = function(dict) {
  return dict.show;
};

// output/Data.String.Common/foreign.js
var trim = function(s2) {
  return s2.trim();
};
var joinWith = function(s2) {
  return function(xs) {
    return xs.join(s2);
  };
};

// output/Yoga.JSON/foreign.js
function reviver(key, value2) {
  if (key === "big") {
    return BigInt(value2);
  }
  return value2;
}
var _parseJSON = (payload) => JSON.parse(payload, reviver);
var _undefined = void 0;
function replacer(key, value2) {
  if (key === "big") {
    return value2.toString();
  }
  return value2;
}
var _unsafeStringify = (data) => JSON.stringify(data, replacer);

// output/Data.Functor/foreign.js
var arrayMap = function(f3) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i2 = 0; i2 < l; i2++) {
      result[i2] = f3(arr[i2]);
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f3) {
    return function(g) {
      return function(x2) {
        return f3(g(x2));
      };
    };
  }
};
var compose = function(dict) {
  return dict.compose;
};

// output/Control.Category/index.js
var identity = function(dict) {
  return dict.identity;
};
var categoryFn = {
  identity: function(x2) {
    return x2;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var on = function(f3) {
  return function(g) {
    return function(x2) {
      return function(y) {
        return f3(g(x2))(g(y));
      };
    };
  };
};
var flip = function(f3) {
  return function(b) {
    return function(a) {
      return f3(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var mapFlipped = function(dictFunctor) {
  var map113 = map(dictFunctor);
  return function(fa) {
    return function(f3) {
      return map113(f3)(fa);
    };
  };
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var voidLeft = function(dictFunctor) {
  var map113 = map(dictFunctor);
  return function(f3) {
    return function(x2) {
      return map113($$const(x2))(f3);
    };
  };
};
var voidRight = function(dictFunctor) {
  var map113 = map(dictFunctor);
  return function(x2) {
    return map113($$const(x2));
  };
};
var functorArray = {
  map: arrayMap
};

// output/Data.Semigroup/foreign.js
var concatString = function(s1) {
  return function(s2) {
    return s1 + s2;
  };
};
var concatArray = function(xs) {
  return function(ys) {
    if (xs.length === 0)
      return ys;
    if (ys.length === 0)
      return xs;
    return xs.concat(ys);
  };
};

// output/Data.Semigroup/index.js
var semigroupUnit = {
  append: function(v) {
    return function(v1) {
      return unit;
    };
  }
};
var semigroupString = {
  append: concatString
};
var semigroupArray = {
  append: concatArray
};
var append = function(dict) {
  return dict.append;
};
var semigroupFn = function(dictSemigroup) {
  var append12 = append(dictSemigroup);
  return {
    append: function(f3) {
      return function(g) {
        return function(x2) {
          return append12(f3(x2))(g(x2));
        };
      };
    }
  };
};

// output/Control.Alt/index.js
var alt = function(dict) {
  return dict.alt;
};

// output/Control.Apply/foreign.js
var arrayApply = function(fs2) {
  return function(xs) {
    var l = fs2.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i2 = 0; i2 < l; i2++) {
      var f3 = fs2[i2];
      for (var j = 0; j < k; j++) {
        result[n++] = f3(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Apply/index.js
var identity2 = /* @__PURE__ */ identity(categoryFn);
var applyArray = {
  apply: arrayApply,
  Functor0: function() {
    return functorArray;
  }
};
var apply = function(dict) {
  return dict.apply;
};
var applySecond = function(dictApply) {
  var apply1 = apply(dictApply);
  var map28 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map28($$const(identity2))(a))(b);
    };
  };
};
var lift2 = function(dictApply) {
  var apply1 = apply(dictApply);
  var map28 = map(dictApply.Functor0());
  return function(f3) {
    return function(a) {
      return function(b) {
        return apply1(map28(f3)(a))(b);
      };
    };
  };
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var unless = function(dictApplicative) {
  var pure17 = pure(dictApplicative);
  return function(v) {
    return function(v1) {
      if (!v) {
        return v1;
      }
      ;
      if (v) {
        return pure17(unit);
      }
      ;
      throw new Error("Failed pattern match at Control.Applicative (line 68, column 1 - line 68, column 65): " + [v.constructor.name, v1.constructor.name]);
    };
  };
};
var when = function(dictApplicative) {
  var pure17 = pure(dictApplicative);
  return function(v) {
    return function(v1) {
      if (v) {
        return v1;
      }
      ;
      if (!v) {
        return pure17(unit);
      }
      ;
      throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
    };
  };
};
var liftA1 = function(dictApplicative) {
  var apply4 = apply(dictApplicative.Apply0());
  var pure17 = pure(dictApplicative);
  return function(f3) {
    return function(a) {
      return apply4(pure17(f3))(a);
    };
  };
};
var applicativeArray = {
  pure: function(x2) {
    return [x2];
  },
  Apply0: function() {
    return applyArray;
  }
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f3) {
    var result = [];
    for (var i2 = 0, l = arr.length; i2 < l; i2++) {
      Array.prototype.push.apply(result, f3(arr[i2]));
    }
    return result;
  };
};

// output/Control.Bind/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
var discard = function(dict) {
  return dict.discard;
};
var bindArray = {
  bind: arrayBind,
  Apply0: function() {
    return applyArray;
  }
};
var bind = function(dict) {
  return dict.bind;
};
var bindFlipped = function(dictBind) {
  return flip(bind(dictBind));
};
var composeKleisliFlipped = function(dictBind) {
  var bindFlipped1 = bindFlipped(dictBind);
  return function(f3) {
    return function(g) {
      return function(a) {
        return bindFlipped1(f3)(g(a));
      };
    };
  };
};
var composeKleisli = function(dictBind) {
  var bind14 = bind(dictBind);
  return function(f3) {
    return function(g) {
      return function(a) {
        return bind14(f3(a))(g);
      };
    };
  };
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};
var join = function(dictBind) {
  var bind14 = bind(dictBind);
  return function(m2) {
    return bind14(m2)(identity3);
  };
};

// output/Data.Bounded/foreign.js
var topInt = 2147483647;
var bottomInt = -2147483648;
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Bounded/index.js
var top = function(dict) {
  return dict.top;
};
var boundedInt = {
  top: topInt,
  bottom: bottomInt,
  Ord0: function() {
    return ordInt;
  }
};
var boundedChar = {
  top: topChar,
  bottom: bottomChar,
  Ord0: function() {
    return ordChar;
  }
};
var bottom = function(dict) {
  return dict.bottom;
};

// output/Data.Generic.Rep/index.js
var Inl = /* @__PURE__ */ function() {
  function Inl2(value0) {
    this.value0 = value0;
  }
  ;
  Inl2.create = function(value0) {
    return new Inl2(value0);
  };
  return Inl2;
}();
var Inr = /* @__PURE__ */ function() {
  function Inr2(value0) {
    this.value0 = value0;
  }
  ;
  Inr2.create = function(value0) {
    return new Inr2(value0);
  };
  return Inr2;
}();
var NoArguments = /* @__PURE__ */ function() {
  function NoArguments2() {
  }
  ;
  NoArguments2.value = new NoArguments2();
  return NoArguments2;
}();
var Constructor = function(x2) {
  return x2;
};
var Argument = function(x2) {
  return x2;
};
var to = function(dict) {
  return dict.to;
};
var from = function(dict) {
  return dict.from;
};

// output/Data.Maybe/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var Nothing = /* @__PURE__ */ function() {
  function Nothing2() {
  }
  ;
  Nothing2.value = new Nothing2();
  return Nothing2;
}();
var Just = /* @__PURE__ */ function() {
  function Just2(value0) {
    this.value0 = value0;
  }
  ;
  Just2.create = function(value0) {
    return new Just2(value0);
  };
  return Just2;
}();
var maybe = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Nothing) {
        return v;
      }
      ;
      if (v2 instanceof Just) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 237, column 1 - line 237, column 51): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var isNothing = /* @__PURE__ */ maybe(true)(/* @__PURE__ */ $$const(false));
var isJust = /* @__PURE__ */ maybe(false)(/* @__PURE__ */ $$const(true));
var functorMaybe = {
  map: function(v) {
    return function(v1) {
      if (v1 instanceof Just) {
        return new Just(v(v1.value0));
      }
      ;
      return Nothing.value;
    };
  }
};
var map2 = /* @__PURE__ */ map(functorMaybe);
var fromMaybe = function(a) {
  return maybe(a)(identity4);
};
var fromJust = function() {
  return function(v) {
    if (v instanceof Just) {
      return v.value0;
    }
    ;
    throw new Error("Failed pattern match at Data.Maybe (line 288, column 1 - line 288, column 46): " + [v.constructor.name]);
  };
};
var applyMaybe = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return map2(v.value0)(v1);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 67, column 1 - line 69, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var bindMaybe = {
  bind: function(v) {
    return function(v1) {
      if (v instanceof Just) {
        return v1(v.value0);
      }
      ;
      if (v instanceof Nothing) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Maybe (line 125, column 1 - line 127, column 28): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Apply0: function() {
    return applyMaybe;
  }
};
var applicativeMaybe = /* @__PURE__ */ function() {
  return {
    pure: Just.create,
    Apply0: function() {
      return applyMaybe;
    }
  };
}();
var altMaybe = {
  alt: function(v) {
    return function(v1) {
      if (v instanceof Nothing) {
        return v1;
      }
      ;
      return v;
    };
  },
  Functor0: function() {
    return functorMaybe;
  }
};
var plusMaybe = /* @__PURE__ */ function() {
  return {
    empty: Nothing.value,
    Alt0: function() {
      return altMaybe;
    }
  };
}();
var alternativeMaybe = {
  Applicative0: function() {
    return applicativeMaybe;
  },
  Plus1: function() {
    return plusMaybe;
  }
};

// output/Data.Either/index.js
var Left = /* @__PURE__ */ function() {
  function Left2(value0) {
    this.value0 = value0;
  }
  ;
  Left2.create = function(value0) {
    return new Left2(value0);
  };
  return Left2;
}();
var Right = /* @__PURE__ */ function() {
  function Right2(value0) {
    this.value0 = value0;
  }
  ;
  Right2.create = function(value0) {
    return new Right2(value0);
  };
  return Right2;
}();
var note = function(a) {
  return maybe(new Left(a))(Right.create);
};
var functorEither = {
  map: function(f3) {
    return function(m2) {
      if (m2 instanceof Left) {
        return new Left(m2.value0);
      }
      ;
      if (m2 instanceof Right) {
        return new Right(f3(m2.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m2.constructor.name]);
    };
  }
};
var map3 = /* @__PURE__ */ map(functorEither);
var either = function(v) {
  return function(v1) {
    return function(v2) {
      if (v2 instanceof Left) {
        return v(v2.value0);
      }
      ;
      if (v2 instanceof Right) {
        return v1(v2.value0);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 208, column 1 - line 208, column 64): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
    };
  };
};
var hush = /* @__PURE__ */ function() {
  return either($$const(Nothing.value))(Just.create);
}();
var applyEither = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return new Left(v.value0);
      }
      ;
      if (v instanceof Right) {
        return map3(v.value0)(v1);
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 70, column 1 - line 72, column 30): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorEither;
  }
};
var bindEither = {
  bind: /* @__PURE__ */ either(function(e2) {
    return function(v) {
      return new Left(e2);
    };
  })(function(a) {
    return function(f3) {
      return f3(a);
    };
  }),
  Apply0: function() {
    return applyEither;
  }
};
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();
var altEither = {
  alt: function(v) {
    return function(v1) {
      if (v instanceof Left) {
        return v1;
      }
      ;
      return v;
    };
  },
  Functor0: function() {
    return functorEither;
  }
};

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f3) {
    return function() {
      return f3(a())();
    };
  };
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind14 = bind(dictMonad.Bind1());
  var pure17 = pure(dictMonad.Applicative0());
  return function(f3) {
    return function(a) {
      return bind14(f3)(function(f$prime) {
        return bind14(a)(function(a$prime) {
          return pure17(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Data.EuclideanRing/foreign.js
var intDegree = function(x2) {
  return Math.min(Math.abs(x2), 2147483647);
};
var intDiv = function(x2) {
  return function(y) {
    if (y === 0)
      return 0;
    return y > 0 ? Math.floor(x2 / y) : -Math.floor(x2 / -y);
  };
};
var intMod = function(x2) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x2 % yy + yy) % yy;
  };
};

// output/Data.CommutativeRing/index.js
var commutativeRingInt = {
  Ring0: function() {
    return ringInt;
  }
};

// output/Data.EuclideanRing/index.js
var mod = function(dict) {
  return dict.mod;
};
var euclideanRingInt = {
  degree: intDegree,
  div: intDiv,
  mod: intMod,
  CommutativeRing0: function() {
    return commutativeRingInt;
  }
};
var div = function(dict) {
  return dict.div;
};

// output/Data.Monoid/index.js
var monoidUnit = {
  mempty: unit,
  Semigroup0: function() {
    return semigroupUnit;
  }
};
var monoidString = {
  mempty: "",
  Semigroup0: function() {
    return semigroupString;
  }
};
var monoidArray = {
  mempty: [],
  Semigroup0: function() {
    return semigroupArray;
  }
};
var mempty = function(dict) {
  return dict.mempty;
};
var monoidFn = function(dictMonoid) {
  var mempty1 = mempty(dictMonoid);
  var semigroupFn2 = semigroupFn(dictMonoid.Semigroup0());
  return {
    mempty: function(v) {
      return mempty1;
    },
    Semigroup0: function() {
      return semigroupFn2;
    }
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name3, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name3 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var monadEffect = {
  Applicative0: function() {
    return applicativeEffect;
  },
  Bind1: function() {
    return bindEffect;
  }
};
var bindEffect = {
  bind: bindE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var applicativeEffect = {
  pure: pureE,
  Apply0: function() {
    return $lazy_applyEffect(0);
  }
};
var $lazy_functorEffect = /* @__PURE__ */ $runtime_lazy("functorEffect", "Effect", function() {
  return {
    map: liftA1(applicativeEffect)
  };
});
var $lazy_applyEffect = /* @__PURE__ */ $runtime_lazy("applyEffect", "Effect", function() {
  return {
    apply: ap(monadEffect),
    Functor0: function() {
      return $lazy_functorEffect(0);
    }
  };
});
var functorEffect = /* @__PURE__ */ $lazy_functorEffect(20);
var applyEffect = /* @__PURE__ */ $lazy_applyEffect(23);
var lift22 = /* @__PURE__ */ lift2(applyEffect);
var semigroupEffect = function(dictSemigroup) {
  return {
    append: lift22(append(dictSemigroup))
  };
};
var monoidEffect = function(dictMonoid) {
  var semigroupEffect1 = semigroupEffect(dictMonoid.Semigroup0());
  return {
    mempty: pureE(mempty(dictMonoid)),
    Semigroup0: function() {
      return semigroupEffect1;
    }
  };
};

// output/Effect.Exception/foreign.js
function showErrorImpl(err) {
  return err.stack || err.toString();
}
function error(msg) {
  return new Error(msg);
}
function message(e2) {
  return e2.message;
}
function throwException(e2) {
  return function() {
    throw e2;
  };
}
function catchException(c) {
  return function(t2) {
    return function() {
      try {
        return t2();
      } catch (e2) {
        if (e2 instanceof Error || Object.prototype.toString.call(e2) === "[object Error]") {
          return c(e2)();
        } else {
          return c(new Error(e2.toString()))();
        }
      }
    };
  };
}

// output/Effect.Exception/index.js
var pure2 = /* @__PURE__ */ pure(applicativeEffect);
var map4 = /* @__PURE__ */ map(functorEffect);
var $$try = function(action) {
  return catchException(function($3) {
    return pure2(Left.create($3));
  })(map4(Right.create)(action));
};
var $$throw = function($4) {
  return throwException(error($4));
};
var showError = {
  show: showErrorImpl
};

// output/Control.Monad.Error.Class/index.js
var throwError = function(dict) {
  return dict.throwError;
};
var catchError = function(dict) {
  return dict.catchError;
};
var $$try2 = function(dictMonadError) {
  var catchError1 = catchError(dictMonadError);
  var Monad0 = dictMonadError.MonadThrow0().Monad0();
  var map28 = map(Monad0.Bind1().Apply0().Functor0());
  var pure17 = pure(Monad0.Applicative0());
  return function(a) {
    return catchError1(map28(Right.create)(a))(function($52) {
      return pure17(Left.create($52));
    });
  };
};

// output/Data.Identity/index.js
var Identity = function(x2) {
  return x2;
};
var functorIdentity = {
  map: function(f3) {
    return function(m2) {
      return f3(m2);
    };
  }
};
var applyIdentity = {
  apply: function(v) {
    return function(v1) {
      return v(v1);
    };
  },
  Functor0: function() {
    return functorIdentity;
  }
};
var bindIdentity = {
  bind: function(v) {
    return function(f3) {
      return f3(v);
    };
  },
  Apply0: function() {
    return applyIdentity;
  }
};
var applicativeIdentity = {
  pure: Identity,
  Apply0: function() {
    return applyIdentity;
  }
};
var monadIdentity = {
  Applicative0: function() {
    return applicativeIdentity;
  },
  Bind1: function() {
    return bindIdentity;
  }
};

// output/Effect.Ref/foreign.js
var _new = function(val) {
  return function() {
    return { value: val };
  };
};
var read = function(ref) {
  return function() {
    return ref.value;
  };
};
var modifyImpl = function(f3) {
  return function(ref) {
    return function() {
      var t2 = f3(ref.value);
      ref.value = t2.state;
      return t2.value;
    };
  };
};

// output/Effect.Ref/index.js
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var $$new = _new;
var modify$prime = modifyImpl;
var modify = function(f3) {
  return modify$prime(function(s2) {
    var s$prime = f3(s2);
    return {
      state: s$prime,
      value: s$prime
    };
  });
};
var modify_ = function(f3) {
  return function(s2) {
    return $$void2(modify(f3)(s2));
  };
};

// output/Data.HeytingAlgebra/foreign.js
var boolConj = function(b1) {
  return function(b2) {
    return b1 && b2;
  };
};
var boolDisj = function(b1) {
  return function(b2) {
    return b1 || b2;
  };
};
var boolNot = function(b) {
  return !b;
};

// output/Data.HeytingAlgebra/index.js
var not = function(dict) {
  return dict.not;
};
var ff = function(dict) {
  return dict.ff;
};
var disj = function(dict) {
  return dict.disj;
};
var heytingAlgebraBoolean = {
  ff: false,
  tt: true,
  implies: function(a) {
    return function(b) {
      return disj(heytingAlgebraBoolean)(not(heytingAlgebraBoolean)(a))(b);
    };
  },
  conj: boolConj,
  disj: boolDisj,
  not: boolNot
};

// output/Data.Tuple/index.js
var Tuple = /* @__PURE__ */ function() {
  function Tuple2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Tuple2.create = function(value0) {
    return function(value1) {
      return new Tuple2(value0, value1);
    };
  };
  return Tuple2;
}();
var snd = function(v) {
  return v.value1;
};
var fst = function(v) {
  return v.value0;
};

// output/Effect.Class/index.js
var monadEffectEffect = {
  liftEffect: /* @__PURE__ */ identity(categoryFn),
  Monad0: function() {
    return monadEffect;
  }
};
var liftEffect = function(dict) {
  return dict.liftEffect;
};

// output/Control.Monad.Except.Trans/index.js
var map5 = /* @__PURE__ */ map(functorEither);
var ExceptT = function(x2) {
  return x2;
};
var withExceptT = function(dictFunctor) {
  var map113 = map(dictFunctor);
  return function(f3) {
    return function(v) {
      var mapLeft = function(v1) {
        return function(v2) {
          if (v2 instanceof Right) {
            return new Right(v2.value0);
          }
          ;
          if (v2 instanceof Left) {
            return new Left(v1(v2.value0));
          }
          ;
          throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 42, column 3 - line 42, column 32): " + [v1.constructor.name, v2.constructor.name]);
        };
      };
      return map113(mapLeft(f3))(v);
    };
  };
};
var runExceptT = function(v) {
  return v;
};
var mapExceptT = function(f3) {
  return function(v) {
    return f3(v);
  };
};
var functorExceptT = function(dictFunctor) {
  var map113 = map(dictFunctor);
  return {
    map: function(f3) {
      return mapExceptT(map113(map5(f3)));
    }
  };
};
var except = function(dictApplicative) {
  var $185 = pure(dictApplicative);
  return function($186) {
    return ExceptT($185($186));
  };
};
var monadExceptT = function(dictMonad) {
  return {
    Applicative0: function() {
      return applicativeExceptT(dictMonad);
    },
    Bind1: function() {
      return bindExceptT(dictMonad);
    }
  };
};
var bindExceptT = function(dictMonad) {
  var bind14 = bind(dictMonad.Bind1());
  var pure17 = pure(dictMonad.Applicative0());
  return {
    bind: function(v) {
      return function(k) {
        return bind14(v)(either(function($187) {
          return pure17(Left.create($187));
        })(function(a) {
          var v1 = k(a);
          return v1;
        }));
      };
    },
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var applyExceptT = function(dictMonad) {
  var functorExceptT1 = functorExceptT(dictMonad.Bind1().Apply0().Functor0());
  return {
    apply: ap(monadExceptT(dictMonad)),
    Functor0: function() {
      return functorExceptT1;
    }
  };
};
var applicativeExceptT = function(dictMonad) {
  return {
    pure: function() {
      var $188 = pure(dictMonad.Applicative0());
      return function($189) {
        return ExceptT($188(Right.create($189)));
      };
    }(),
    Apply0: function() {
      return applyExceptT(dictMonad);
    }
  };
};
var monadThrowExceptT = function(dictMonad) {
  var monadExceptT1 = monadExceptT(dictMonad);
  return {
    throwError: function() {
      var $198 = pure(dictMonad.Applicative0());
      return function($199) {
        return ExceptT($198(Left.create($199)));
      };
    }(),
    Monad0: function() {
      return monadExceptT1;
    }
  };
};
var altExceptT = function(dictSemigroup) {
  var append3 = append(dictSemigroup);
  return function(dictMonad) {
    var Bind1 = dictMonad.Bind1();
    var bind14 = bind(Bind1);
    var pure17 = pure(dictMonad.Applicative0());
    var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
    return {
      alt: function(v) {
        return function(v1) {
          return bind14(v)(function(rm) {
            if (rm instanceof Right) {
              return pure17(new Right(rm.value0));
            }
            ;
            if (rm instanceof Left) {
              return bind14(v1)(function(rn) {
                if (rn instanceof Right) {
                  return pure17(new Right(rn.value0));
                }
                ;
                if (rn instanceof Left) {
                  return pure17(new Left(append3(rm.value0)(rn.value0)));
                }
                ;
                throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 86, column 9 - line 88, column 49): " + [rn.constructor.name]);
              });
            }
            ;
            throw new Error("Failed pattern match at Control.Monad.Except.Trans (line 82, column 5 - line 88, column 49): " + [rm.constructor.name]);
          });
        };
      },
      Functor0: function() {
        return functorExceptT1;
      }
    };
  };
};

// output/Control.Monad.Except/index.js
var unwrap2 = /* @__PURE__ */ unwrap();
var withExcept = /* @__PURE__ */ withExceptT(functorIdentity);
var runExcept = function($3) {
  return unwrap2(runExceptT($3));
};

// output/Data.Array/foreign.js
var replicateFill = function(count) {
  return function(value2) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value2);
  };
};
var replicatePolyfill = function(count) {
  return function(value2) {
    var result = [];
    var n = 0;
    for (var i2 = 0; i2 < count; i2++) {
      result[n++] = value2;
    }
    return result;
  };
};
var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons3(head5, tail2) {
    this.head = head5;
    this.tail = tail2;
  }
  var emptyList = {};
  function curryCons(head5) {
    return function(tail2) {
      return new Cons3(head5, tail2);
    };
  }
  function listToArray(list) {
    var result = [];
    var count = 0;
    var xs = list;
    while (xs !== emptyList) {
      result[count++] = xs.head;
      xs = xs.tail;
    }
    return result;
  }
  return function(foldr3) {
    return function(xs) {
      return listToArray(foldr3(curryCons)(emptyList)(xs));
    };
  };
}();
var length = function(xs) {
  return xs.length;
};
var indexImpl = function(just) {
  return function(nothing) {
    return function(xs) {
      return function(i2) {
        return i2 < 0 || i2 >= xs.length ? nothing : just(xs[i2]);
      };
    };
  };
};
var findIndexImpl = function(just) {
  return function(nothing) {
    return function(f3) {
      return function(xs) {
        for (var i2 = 0, l = xs.length; i2 < l; i2++) {
          if (f3(xs[i2]))
            return just(i2);
        }
        return nothing;
      };
    };
  };
};
var sortByImpl = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
    var mid;
    var i2;
    var j;
    var k;
    var x2;
    var y;
    var c;
    mid = from3 + (to2 - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
    i2 = from3;
    j = mid;
    k = from3;
    while (i2 < mid && j < to2) {
      x2 = xs2[i2];
      y = xs2[j];
      c = fromOrdering(compare3(x2)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x2;
        ++i2;
      }
    }
    while (i2 < mid) {
      xs1[k++] = xs2[i2++];
    }
    while (j < to2) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare3) {
    return function(fromOrdering) {
      return function(xs) {
        var out;
        if (xs.length < 2)
          return xs;
        out = xs.slice(0);
        mergeFromTo(compare3, fromOrdering, out, xs.slice(0), 0, xs.length);
        return out;
      };
    };
  };
}();
var unsafeIndexImpl = function(xs) {
  return function(n) {
    return xs[n];
  };
};

// output/Control.Monad.ST.Internal/foreign.js
var map_ = function(f3) {
  return function(a) {
    return function() {
      return f3(a());
    };
  };
};
var pure_ = function(a) {
  return function() {
    return a;
  };
};
var bind_ = function(a) {
  return function(f3) {
    return function() {
      return f3(a())();
    };
  };
};
var foreach = function(as) {
  return function(f3) {
    return function() {
      for (var i2 = 0, l = as.length; i2 < l; i2++) {
        f3(as[i2])();
      }
    };
  };
};

// output/Control.Monad.ST.Internal/index.js
var $runtime_lazy2 = function(name3, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name3 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var functorST = {
  map: map_
};
var monadST = {
  Applicative0: function() {
    return applicativeST;
  },
  Bind1: function() {
    return bindST;
  }
};
var bindST = {
  bind: bind_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var applicativeST = {
  pure: pure_,
  Apply0: function() {
    return $lazy_applyST(0);
  }
};
var $lazy_applyST = /* @__PURE__ */ $runtime_lazy2("applyST", "Control.Monad.ST.Internal", function() {
  return {
    apply: ap(monadST),
    Functor0: function() {
      return functorST;
    }
  };
});

// output/Data.Array.ST/foreign.js
var pushAll = function(as) {
  return function(xs) {
    return function() {
      return xs.push.apply(xs, as);
    };
  };
};
var unsafeFreeze = function(xs) {
  return function() {
    return xs;
  };
};
function copyImpl(xs) {
  return function() {
    return xs.slice();
  };
}
var thaw = copyImpl;
var sortByImpl2 = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
    var mid;
    var i2;
    var j;
    var k;
    var x2;
    var y;
    var c;
    mid = from3 + (to2 - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
    i2 = from3;
    j = mid;
    k = from3;
    while (i2 < mid && j < to2) {
      x2 = xs2[i2];
      y = xs2[j];
      c = fromOrdering(compare3(x2)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x2;
        ++i2;
      }
    }
    while (i2 < mid) {
      xs1[k++] = xs2[i2++];
    }
    while (j < to2) {
      xs1[k++] = xs2[j++];
    }
  }
  return function(compare3) {
    return function(fromOrdering) {
      return function(xs) {
        return function() {
          if (xs.length < 2)
            return xs;
          mergeFromTo(compare3, fromOrdering, xs, xs.slice(0), 0, xs.length);
          return xs;
        };
      };
    };
  };
}();

// output/Data.Array.ST/index.js
var withArray = function(f3) {
  return function(xs) {
    return function __do2() {
      var result = thaw(xs)();
      f3(result)();
      return unsafeFreeze(result)();
    };
  };
};
var push = function(a) {
  return pushAll([a]);
};

// output/Data.Foldable/foreign.js
var foldrArray = function(f3) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i2 = len - 1; i2 >= 0; i2--) {
        acc = f3(xs[i2])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f3) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i2 = 0; i2 < len; i2++) {
        acc = f3(acc)(xs[i2]);
      }
      return acc;
    };
  };
};

// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
};

// output/Data.Bifunctor/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var lmap = function(dictBifunctor) {
  var bimap1 = bimap(dictBifunctor);
  return function(f3) {
    return bimap1(f3)(identity5);
  };
};
var bifunctorEither = {
  bimap: function(v) {
    return function(v1) {
      return function(v2) {
        if (v2 instanceof Left) {
          return new Left(v(v2.value0));
        }
        ;
        if (v2 instanceof Right) {
          return new Right(v1(v2.value0));
        }
        ;
        throw new Error("Failed pattern match at Data.Bifunctor (line 32, column 1 - line 34, column 36): " + [v.constructor.name, v1.constructor.name, v2.constructor.name]);
      };
    };
  }
};

// output/Data.Monoid.Disj/index.js
var Disj = function(x2) {
  return x2;
};
var semigroupDisj = function(dictHeytingAlgebra) {
  var disj2 = disj(dictHeytingAlgebra);
  return {
    append: function(v) {
      return function(v1) {
        return disj2(v)(v1);
      };
    }
  };
};
var monoidDisj = function(dictHeytingAlgebra) {
  var semigroupDisj1 = semigroupDisj(dictHeytingAlgebra);
  return {
    mempty: ff(dictHeytingAlgebra),
    Semigroup0: function() {
      return semigroupDisj1;
    }
  };
};

// output/Data.Foldable/index.js
var alaF2 = /* @__PURE__ */ alaF()()()();
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure17 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(f3) {
      return foldr22(function($449) {
        return applySecond2(f3($449));
      })(pure17(unit));
    };
  };
};
var foldl = function(dict) {
  return dict.foldl;
};
var intercalate2 = function(dictFoldable) {
  var foldl22 = foldl(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(sep2) {
      return function(xs) {
        var go = function(v) {
          return function(x2) {
            if (v.init) {
              return {
                init: false,
                acc: x2
              };
            }
            ;
            return {
              init: false,
              acc: append3(v.acc)(append3(sep2)(x2))
            };
          };
        };
        return foldl22(go)({
          init: true,
          acc: mempty4
        })(xs).acc;
      };
    };
  };
};
var foldableMaybe = {
  foldr: function(v) {
    return function(z) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return z;
        }
        ;
        if (v1 instanceof Just) {
          return v(v1.value0)(z);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, z.constructor.name, v1.constructor.name]);
      };
    };
  },
  foldl: function(v) {
    return function(z) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return z;
        }
        ;
        if (v1 instanceof Just) {
          return v(z)(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, z.constructor.name, v1.constructor.name]);
      };
    };
  },
  foldMap: function(dictMonoid) {
    var mempty4 = mempty(dictMonoid);
    return function(v) {
      return function(v1) {
        if (v1 instanceof Nothing) {
          return mempty4;
        }
        ;
        if (v1 instanceof Just) {
          return v(v1.value0);
        }
        ;
        throw new Error("Failed pattern match at Data.Foldable (line 138, column 1 - line 144, column 27): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  }
};
var foldMapDefaultR = function(dictFoldable) {
  var foldr22 = foldr(dictFoldable);
  return function(dictMonoid) {
    var append3 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f3) {
      return foldr22(function(x2) {
        return function(acc) {
          return append3(f3(x2))(acc);
        };
      })(mempty4);
    };
  };
};
var foldableArray = {
  foldr: foldrArray,
  foldl: foldlArray,
  foldMap: function(dictMonoid) {
    return foldMapDefaultR(foldableArray)(dictMonoid);
  }
};
var foldMap = function(dict) {
  return dict.foldMap;
};
var any = function(dictFoldable) {
  var foldMap23 = foldMap(dictFoldable);
  return function(dictHeytingAlgebra) {
    return alaF2(Disj)(foldMap23(monoidDisj(dictHeytingAlgebra)));
  };
};

// output/Data.Traversable/foreign.js
var traverseArrayImpl = function() {
  function array1(a) {
    return [a];
  }
  function array2(a) {
    return function(b) {
      return [a, b];
    };
  }
  function array3(a) {
    return function(b) {
      return function(c) {
        return [a, b, c];
      };
    };
  }
  function concat22(xs) {
    return function(ys) {
      return xs.concat(ys);
    };
  }
  return function(apply4) {
    return function(map28) {
      return function(pure17) {
        return function(f3) {
          return function(array) {
            function go(bot, top5) {
              switch (top5 - bot) {
                case 0:
                  return pure17([]);
                case 1:
                  return map28(array1)(f3(array[bot]));
                case 2:
                  return apply4(map28(array2)(f3(array[bot])))(f3(array[bot + 1]));
                case 3:
                  return apply4(apply4(map28(array3)(f3(array[bot])))(f3(array[bot + 1])))(f3(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top5 - bot) / 4) * 2;
                  return apply4(map28(concat22)(go(bot, pivot)))(go(pivot, top5));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Traversable/index.js
var identity6 = /* @__PURE__ */ identity(categoryFn);
var traverse = function(dict) {
  return dict.traverse;
};
var sequenceDefault = function(dictTraversable) {
  var traverse22 = traverse(dictTraversable);
  return function(dictApplicative) {
    return traverse22(dictApplicative)(identity6);
  };
};
var traversableArray = {
  traverse: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    return traverseArrayImpl(apply(Apply0))(map(Apply0.Functor0()))(pure(dictApplicative));
  },
  sequence: function(dictApplicative) {
    return sequenceDefault(traversableArray)(dictApplicative);
  },
  Functor0: function() {
    return functorArray;
  },
  Foldable1: function() {
    return foldableArray;
  }
};
var $$for = function(dictApplicative) {
  return function(dictTraversable) {
    var traverse22 = traverse(dictTraversable)(dictApplicative);
    return function(x2) {
      return function(f3) {
        return traverse22(f3)(x2);
      };
    };
  };
};

// output/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f3) {
          return function(b) {
            var result = [];
            var value2 = b;
            while (true) {
              var maybe2 = f3(value2);
              if (isNothing2(maybe2))
                return result;
              var tuple = fromJust5(maybe2);
              result.push(fst2(tuple));
              value2 = snd2(tuple);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f3) {
          return function(b) {
            var result = [];
            var value2 = b;
            while (true) {
              var tuple = f3(value2);
              result.push(fst2(tuple));
              var maybe2 = snd2(tuple);
              if (isNothing2(maybe2))
                return result;
              value2 = fromJust5(maybe2);
            }
          };
        };
      };
    };
  };
};

// output/Data.Unfoldable1/index.js
var fromJust2 = /* @__PURE__ */ fromJust();
var unfoldr1 = function(dict) {
  return dict.unfoldr1;
};
var unfoldable1Array = {
  unfoldr1: /* @__PURE__ */ unfoldr1ArrayImpl(isNothing)(fromJust2)(fst)(snd)
};
var replicate1 = function(dictUnfoldable1) {
  var unfoldr11 = unfoldr1(dictUnfoldable1);
  return function(n) {
    return function(v) {
      var step2 = function(i2) {
        if (i2 <= 0) {
          return new Tuple(v, Nothing.value);
        }
        ;
        if (otherwise) {
          return new Tuple(v, new Just(i2 - 1 | 0));
        }
        ;
        throw new Error("Failed pattern match at Data.Unfoldable1 (line 68, column 5 - line 68, column 39): " + [i2.constructor.name]);
      };
      return unfoldr11(step2)(n - 1 | 0);
    };
  };
};
var singleton = function(dictUnfoldable1) {
  return replicate1(dictUnfoldable1)(1);
};

// output/Data.Unfoldable/index.js
var fromJust3 = /* @__PURE__ */ fromJust();
var unfoldr = function(dict) {
  return dict.unfoldr;
};
var unfoldableArray = {
  unfoldr: /* @__PURE__ */ unfoldrArrayImpl(isNothing)(fromJust3)(fst)(snd),
  Unfoldable10: function() {
    return unfoldable1Array;
  }
};

// output/Data.Array/index.js
var intercalate1 = /* @__PURE__ */ intercalate2(foldableArray);
var map1 = /* @__PURE__ */ map(functorMaybe);
var unsafeIndex = function() {
  return unsafeIndexImpl;
};
var unsafeIndex1 = /* @__PURE__ */ unsafeIndex();
var toUnfoldable = function(dictUnfoldable) {
  var unfoldr3 = unfoldr(dictUnfoldable);
  return function(xs) {
    var len = length(xs);
    var f3 = function(i2) {
      if (i2 < len) {
        return new Just(new Tuple(unsafeIndex1(xs)(i2), i2 + 1 | 0));
      }
      ;
      if (otherwise) {
        return Nothing.value;
      }
      ;
      throw new Error("Failed pattern match at Data.Array (line 156, column 3 - line 158, column 26): " + [i2.constructor.name]);
    };
    return unfoldr3(f3)(0);
  };
};
var snoc = function(xs) {
  return function(x2) {
    return withArray(push(x2))(xs)();
  };
};
var singleton2 = function(a) {
  return [a];
};
var $$null = function(xs) {
  return length(xs) === 0;
};
var intercalate3 = function(dictMonoid) {
  return intercalate1(dictMonoid);
};
var index = /* @__PURE__ */ function() {
  return indexImpl(Just.create)(Nothing.value);
}();
var head = function(xs) {
  return index(xs)(0);
};
var fromFoldable = function(dictFoldable) {
  return fromFoldableImpl(foldr(dictFoldable));
};
var foldl2 = /* @__PURE__ */ foldl(foldableArray);
var findIndex = /* @__PURE__ */ function() {
  return findIndexImpl(Just.create)(Nothing.value);
}();
var find2 = function(f3) {
  return function(xs) {
    return map1(unsafeIndex1(xs))(findIndex(f3)(xs));
  };
};
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe = function(f3) {
  return concatMap(function() {
    var $185 = maybe([])(singleton2);
    return function($186) {
      return $185(f3($186));
    };
  }());
};
var catMaybes = /* @__PURE__ */ mapMaybe(/* @__PURE__ */ identity(categoryFn));

// output/Data.Array.NonEmpty.Internal/foreign.js
var traverse1Impl = function() {
  function Cont(fn) {
    this.fn = fn;
  }
  var emptyList = {};
  var ConsCell = function(head5, tail2) {
    this.head = head5;
    this.tail = tail2;
  };
  function finalCell(head5) {
    return new ConsCell(head5, emptyList);
  }
  function consList(x2) {
    return function(xs) {
      return new ConsCell(x2, xs);
    };
  }
  function listToArray(list) {
    var arr = [];
    var xs = list;
    while (xs !== emptyList) {
      arr.push(xs.head);
      xs = xs.tail;
    }
    return arr;
  }
  return function(apply4) {
    return function(map28) {
      return function(f3) {
        var buildFrom = function(x2, ys) {
          return apply4(map28(consList)(f3(x2)))(ys);
        };
        var go = function(acc, currentLen, xs) {
          if (currentLen === 0) {
            return acc;
          } else {
            var last3 = xs[currentLen - 1];
            return new Cont(function() {
              var built = go(buildFrom(last3, acc), currentLen - 1, xs);
              return built;
            });
          }
        };
        return function(array) {
          var acc = map28(finalCell)(f3(array[array.length - 1]));
          var result = go(acc, array.length - 1, array);
          while (result instanceof Cont) {
            result = result.fn();
          }
          return map28(listToArray)(result);
        };
      };
    };
  };
}();

// output/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f3) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i2 = 0; i2 < l; i2++) {
      result[i2] = f3(i2)(xs[i2]);
    }
    return result;
  };
};

// output/Data.FunctorWithIndex/index.js
var mapWithIndex = function(dict) {
  return dict.mapWithIndex;
};
var functorWithIndexArray = {
  mapWithIndex: mapWithIndexArray,
  Functor0: function() {
    return functorArray;
  }
};

// output/Data.Array.NonEmpty.Internal/index.js
var NonEmptyArray = function(x2) {
  return x2;
};

// output/Data.NonEmpty/index.js
var NonEmpty = /* @__PURE__ */ function() {
  function NonEmpty2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  NonEmpty2.create = function(value0) {
    return function(value1) {
      return new NonEmpty2(value0, value1);
    };
  };
  return NonEmpty2;
}();
var singleton3 = function(dictPlus) {
  var empty4 = empty(dictPlus);
  return function(a) {
    return new NonEmpty(a, empty4);
  };
};
var showNonEmpty = function(dictShow) {
  var show14 = show(dictShow);
  return function(dictShow1) {
    var show15 = show(dictShow1);
    return {
      show: function(v) {
        return "(NonEmpty " + (show14(v.value0) + (" " + (show15(v.value1) + ")")));
      }
    };
  };
};
var functorNonEmpty = function(dictFunctor) {
  var map28 = map(dictFunctor);
  return {
    map: function(f3) {
      return function(m2) {
        return new NonEmpty(f3(m2.value0), map28(f3)(m2.value1));
      };
    }
  };
};
var foldableNonEmpty = function(dictFoldable) {
  var foldMap3 = foldMap(dictFoldable);
  var foldl3 = foldl(dictFoldable);
  var foldr3 = foldr(dictFoldable);
  return {
    foldMap: function(dictMonoid) {
      var append12 = append(dictMonoid.Semigroup0());
      var foldMap12 = foldMap3(dictMonoid);
      return function(f3) {
        return function(v) {
          return append12(f3(v.value0))(foldMap12(f3)(v.value1));
        };
      };
    },
    foldl: function(f3) {
      return function(b) {
        return function(v) {
          return foldl3(f3)(f3(b)(v.value0))(v.value1);
        };
      };
    },
    foldr: function(f3) {
      return function(b) {
        return function(v) {
          return f3(v.value0)(foldr3(f3)(b)(v.value1));
        };
      };
    }
  };
};

// output/Data.Array.NonEmpty/index.js
var fromJust4 = /* @__PURE__ */ fromJust();
var unsafeFromArray = NonEmptyArray;
var toArray = function(v) {
  return v;
};
var fromArray = function(xs) {
  if (length(xs) > 0) {
    return new Just(unsafeFromArray(xs));
  }
  ;
  if (otherwise) {
    return Nothing.value;
  }
  ;
  throw new Error("Failed pattern match at Data.Array.NonEmpty (line 157, column 1 - line 157, column 58): " + [xs.constructor.name]);
};
var adaptMaybe = function(f3) {
  return function($123) {
    return fromJust4(f3(toArray($123)));
  };
};
var head2 = /* @__PURE__ */ adaptMaybe(head);
var adaptAny = function(f3) {
  return function($125) {
    return f3(toArray($125));
  };
};
var catMaybes2 = /* @__PURE__ */ adaptAny(catMaybes);

// output/Data.BigInt/foreign.js
var import_big_integer = __toESM(require_BigInteger(), 1);

// output/Data.Int/foreign.js
var fromNumberImpl = function(just) {
  return function(nothing) {
    return function(n) {
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};
var toNumber = function(n) {
  return n;
};

// output/Data.Number/foreign.js
var isFiniteImpl = isFinite;
var floor = Math.floor;

// output/Data.Int/index.js
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x2) {
  if (!isFiniteImpl(x2)) {
    return 0;
  }
  ;
  if (x2 >= toNumber(top2)) {
    return top2;
  }
  ;
  if (x2 <= toNumber(bottom2)) {
    return bottom2;
  }
  ;
  if (otherwise) {
    return fromMaybe(0)(fromNumber(x2));
  }
  ;
  throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x2.constructor.name]);
};
var floor2 = function($39) {
  return unsafeClamp(floor($39));
};

// output/Data.String.CodeUnits/foreign.js
var singleton4 = function(c) {
  return c;
};
var length2 = function(s2) {
  return s2.length;
};
var drop2 = function(n) {
  return function(s2) {
    return s2.substring(n);
  };
};

// output/Data.String.Unsafe/foreign.js
var charAt = function(i2) {
  return function(s2) {
    if (i2 >= 0 && i2 < s2.length)
      return s2.charAt(i2);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

// output/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

// output/Control.Alternative/index.js
var guard = function(dictAlternative) {
  var pure17 = pure(dictAlternative.Applicative0());
  var empty4 = empty(dictAlternative.Plus1());
  return function(v) {
    if (v) {
      return pure17(unit);
    }
    ;
    if (!v) {
      return empty4;
    }
    ;
    throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [v.constructor.name]);
  };
};

// output/Data.Enum/index.js
var top3 = /* @__PURE__ */ top(boundedInt);
var bottom3 = /* @__PURE__ */ bottom(boundedInt);
var bind2 = /* @__PURE__ */ bind(bindMaybe);
var voidLeft2 = /* @__PURE__ */ voidLeft(functorMaybe);
var guard2 = /* @__PURE__ */ guard(alternativeMaybe);
var toEnum = function(dict) {
  return dict.toEnum;
};
var succ = function(dict) {
  return dict.succ;
};
var pred = function(dict) {
  return dict.pred;
};
var fromEnum = function(dict) {
  return dict.fromEnum;
};
var toEnumWithDefaults = function(dictBoundedEnum) {
  var toEnum1 = toEnum(dictBoundedEnum);
  var fromEnum1 = fromEnum(dictBoundedEnum);
  var bottom1 = bottom(dictBoundedEnum.Bounded0());
  return function(low) {
    return function(high) {
      return function(x2) {
        var v = toEnum1(x2);
        if (v instanceof Just) {
          return v.value0;
        }
        ;
        if (v instanceof Nothing) {
          var $140 = x2 < fromEnum1(bottom1);
          if ($140) {
            return low;
          }
          ;
          return high;
        }
        ;
        throw new Error("Failed pattern match at Data.Enum (line 158, column 33 - line 160, column 62): " + [v.constructor.name]);
      };
    };
  };
};
var enumFromTo = function(dictEnum) {
  var Ord0 = dictEnum.Ord0();
  var eq12 = eq(Ord0.Eq0());
  var lessThan1 = lessThan(Ord0);
  var succ1 = succ(dictEnum);
  var lessThanOrEq1 = lessThanOrEq(Ord0);
  var pred1 = pred(dictEnum);
  var greaterThanOrEq1 = greaterThanOrEq(Ord0);
  return function(dictUnfoldable1) {
    var singleton7 = singleton(dictUnfoldable1);
    var unfoldr12 = unfoldr1(dictUnfoldable1);
    var go = function(step2) {
      return function(op) {
        return function(to2) {
          return function(a) {
            return new Tuple(a, bind2(step2(a))(function(a$prime) {
              return voidLeft2(guard2(op(a$prime)(to2)))(a$prime);
            }));
          };
        };
      };
    };
    return function(v) {
      return function(v1) {
        if (eq12(v)(v1)) {
          return singleton7(v);
        }
        ;
        if (lessThan1(v)(v1)) {
          return unfoldr12(go(succ1)(lessThanOrEq1)(v1))(v);
        }
        ;
        if (otherwise) {
          return unfoldr12(go(pred1)(greaterThanOrEq1)(v1))(v);
        }
        ;
        throw new Error("Failed pattern match at Data.Enum (line 186, column 14 - line 190, column 51): " + [v.constructor.name, v1.constructor.name]);
      };
    };
  };
};
var defaultSucc = function(toEnum$prime) {
  return function(fromEnum$prime) {
    return function(a) {
      return toEnum$prime(fromEnum$prime(a) + 1 | 0);
    };
  };
};
var defaultPred = function(toEnum$prime) {
  return function(fromEnum$prime) {
    return function(a) {
      return toEnum$prime(fromEnum$prime(a) - 1 | 0);
    };
  };
};
var charToEnum = function(v) {
  if (v >= bottom3 && v <= top3) {
    return new Just(fromCharCode(v));
  }
  ;
  return Nothing.value;
};
var enumChar = {
  succ: /* @__PURE__ */ defaultSucc(charToEnum)(toCharCode),
  pred: /* @__PURE__ */ defaultPred(charToEnum)(toCharCode),
  Ord0: function() {
    return ordChar;
  }
};
var boundedEnumChar = /* @__PURE__ */ function() {
  return {
    cardinality: toCharCode(top(boundedChar)) - toCharCode(bottom(boundedChar)) | 0,
    toEnum: charToEnum,
    fromEnum: toCharCode,
    Bounded0: function() {
      return boundedChar;
    },
    Enum1: function() {
      return enumChar;
    }
  };
}();

// output/Data.Time.Duration/index.js
var Seconds = function(x2) {
  return x2;
};

// output/Foreign/foreign.js
function typeOf(value2) {
  return typeof value2;
}
function tagOf(value2) {
  return Object.prototype.toString.call(value2).slice(8, -1);
}
function isNull(value2) {
  return value2 === null;
}
function isUndefined(value2) {
  return value2 === void 0;
}
var isArray = Array.isArray || function(value2) {
  return Object.prototype.toString.call(value2) === "[object Array]";
};

// output/Data.List.Types/index.js
var Nil = /* @__PURE__ */ function() {
  function Nil3() {
  }
  ;
  Nil3.value = new Nil3();
  return Nil3;
}();
var Cons = /* @__PURE__ */ function() {
  function Cons3(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  Cons3.create = function(value0) {
    return function(value1) {
      return new Cons3(value0, value1);
    };
  };
  return Cons3;
}();
var NonEmptyList = function(x2) {
  return x2;
};
var toList = function(v) {
  return new Cons(v.value0, v.value1);
};
var listMap = function(f3) {
  var chunkedRevMap = function($copy_chunksAcc) {
    return function($copy_v) {
      var $tco_var_chunksAcc = $copy_chunksAcc;
      var $tco_done = false;
      var $tco_result;
      function $tco_loop(chunksAcc, v) {
        if (v instanceof Cons && (v.value1 instanceof Cons && v.value1.value1 instanceof Cons)) {
          $tco_var_chunksAcc = new Cons(v, chunksAcc);
          $copy_v = v.value1.value1.value1;
          return;
        }
        ;
        var unrolledMap = function(v1) {
          if (v1 instanceof Cons && (v1.value1 instanceof Cons && v1.value1.value1 instanceof Nil)) {
            return new Cons(f3(v1.value0), new Cons(f3(v1.value1.value0), Nil.value));
          }
          ;
          if (v1 instanceof Cons && v1.value1 instanceof Nil) {
            return new Cons(f3(v1.value0), Nil.value);
          }
          ;
          return Nil.value;
        };
        var reverseUnrolledMap = function($copy_v1) {
          return function($copy_acc) {
            var $tco_var_v1 = $copy_v1;
            var $tco_done1 = false;
            var $tco_result2;
            function $tco_loop2(v1, acc) {
              if (v1 instanceof Cons && (v1.value0 instanceof Cons && (v1.value0.value1 instanceof Cons && v1.value0.value1.value1 instanceof Cons))) {
                $tco_var_v1 = v1.value1;
                $copy_acc = new Cons(f3(v1.value0.value0), new Cons(f3(v1.value0.value1.value0), new Cons(f3(v1.value0.value1.value1.value0), acc)));
                return;
              }
              ;
              $tco_done1 = true;
              return acc;
            }
            ;
            while (!$tco_done1) {
              $tco_result2 = $tco_loop2($tco_var_v1, $copy_acc);
            }
            ;
            return $tco_result2;
          };
        };
        $tco_done = true;
        return reverseUnrolledMap(chunksAcc)(unrolledMap(v));
      }
      ;
      while (!$tco_done) {
        $tco_result = $tco_loop($tco_var_chunksAcc, $copy_v);
      }
      ;
      return $tco_result;
    };
  };
  return chunkedRevMap(Nil.value);
};
var functorList = {
  map: listMap
};
var map6 = /* @__PURE__ */ map(functorList);
var functorNonEmptyList = /* @__PURE__ */ functorNonEmpty(functorList);
var foldableList = {
  foldr: function(f3) {
    return function(b) {
      var rev = function() {
        var go = function($copy_acc) {
          return function($copy_v) {
            var $tco_var_acc = $copy_acc;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(acc, v) {
              if (v instanceof Nil) {
                $tco_done = true;
                return acc;
              }
              ;
              if (v instanceof Cons) {
                $tco_var_acc = new Cons(v.value0, acc);
                $copy_v = v.value1;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.List.Types (line 107, column 7 - line 107, column 23): " + [acc.constructor.name, v.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_acc, $copy_v);
            }
            ;
            return $tco_result;
          };
        };
        return go(Nil.value);
      }();
      var $281 = foldl(foldableList)(flip(f3))(b);
      return function($282) {
        return $281(rev($282));
      };
    };
  },
  foldl: function(f3) {
    var go = function($copy_b) {
      return function($copy_v) {
        var $tco_var_b = $copy_b;
        var $tco_done1 = false;
        var $tco_result;
        function $tco_loop(b, v) {
          if (v instanceof Nil) {
            $tco_done1 = true;
            return b;
          }
          ;
          if (v instanceof Cons) {
            $tco_var_b = f3(b)(v.value0);
            $copy_v = v.value1;
            return;
          }
          ;
          throw new Error("Failed pattern match at Data.List.Types (line 111, column 12 - line 113, column 30): " + [v.constructor.name]);
        }
        ;
        while (!$tco_done1) {
          $tco_result = $tco_loop($tco_var_b, $copy_v);
        }
        ;
        return $tco_result;
      };
    };
    return go;
  },
  foldMap: function(dictMonoid) {
    var append22 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f3) {
      return foldl(foldableList)(function(acc) {
        var $283 = append22(acc);
        return function($284) {
          return $283(f3($284));
        };
      })(mempty4);
    };
  }
};
var foldr2 = /* @__PURE__ */ foldr(foldableList);
var intercalate5 = /* @__PURE__ */ intercalate2(foldableList)(monoidString);
var foldableNonEmptyList = /* @__PURE__ */ foldableNonEmpty(foldableList);
var semigroupList = {
  append: function(xs) {
    return function(ys) {
      return foldr2(Cons.create)(ys)(xs);
    };
  }
};
var append1 = /* @__PURE__ */ append(semigroupList);
var semigroupNonEmptyList = {
  append: function(v) {
    return function(as$prime) {
      return new NonEmpty(v.value0, append1(v.value1)(toList(as$prime)));
    };
  }
};
var showList = function(dictShow) {
  var show14 = show(dictShow);
  return {
    show: function(v) {
      if (v instanceof Nil) {
        return "Nil";
      }
      ;
      return "(" + (intercalate5(" : ")(map6(show14)(v)) + " : Nil)");
    }
  };
};
var showNonEmptyList = function(dictShow) {
  var show14 = show(showNonEmpty(dictShow)(showList(dictShow)));
  return {
    show: function(v) {
      return "(NonEmptyList " + (show14(v) + ")");
    }
  };
};
var applyList = {
  apply: function(v) {
    return function(v1) {
      if (v instanceof Nil) {
        return Nil.value;
      }
      ;
      if (v instanceof Cons) {
        return append1(map6(v.value0)(v1))(apply(applyList)(v.value1)(v1));
      }
      ;
      throw new Error("Failed pattern match at Data.List.Types (line 157, column 1 - line 159, column 48): " + [v.constructor.name, v1.constructor.name]);
    };
  },
  Functor0: function() {
    return functorList;
  }
};
var apply2 = /* @__PURE__ */ apply(applyList);
var applyNonEmptyList = {
  apply: function(v) {
    return function(v1) {
      return new NonEmpty(v.value0(v1.value0), append1(apply2(v.value1)(new Cons(v1.value0, Nil.value)))(apply2(new Cons(v.value0, v.value1))(v1.value1)));
    };
  },
  Functor0: function() {
    return functorNonEmptyList;
  }
};
var altList = {
  alt: append1,
  Functor0: function() {
    return functorList;
  }
};
var plusList = /* @__PURE__ */ function() {
  return {
    empty: Nil.value,
    Alt0: function() {
      return altList;
    }
  };
}();
var applicativeNonEmptyList = {
  pure: /* @__PURE__ */ function() {
    var $312 = singleton3(plusList);
    return function($313) {
      return NonEmptyList($312($313));
    };
  }(),
  Apply0: function() {
    return applyNonEmptyList;
  }
};

// output/Partial.Unsafe/foreign.js
var _unsafePartial = function(f3) {
  return f3();
};

// output/Partial/foreign.js
var _crashWith = function(msg) {
  throw new Error(msg);
};

// output/Partial/index.js
var crashWith = function() {
  return _crashWith;
};

// output/Partial.Unsafe/index.js
var crashWith2 = /* @__PURE__ */ crashWith();
var unsafePartial = _unsafePartial;
var unsafeCrashWith = function(msg) {
  return unsafePartial(function() {
    return crashWith2(msg);
  });
};

// output/Data.List.NonEmpty/index.js
var singleton5 = /* @__PURE__ */ function() {
  var $199 = singleton3(plusList);
  return function($200) {
    return NonEmptyList($199($200));
  };
}();
var head3 = function(v) {
  return v.value0;
};

// output/Foreign/index.js
var show2 = /* @__PURE__ */ show(showString);
var show1 = /* @__PURE__ */ show(showInt);
var ForeignError = /* @__PURE__ */ function() {
  function ForeignError2(value0) {
    this.value0 = value0;
  }
  ;
  ForeignError2.create = function(value0) {
    return new ForeignError2(value0);
  };
  return ForeignError2;
}();
var TypeMismatch = /* @__PURE__ */ function() {
  function TypeMismatch2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  TypeMismatch2.create = function(value0) {
    return function(value1) {
      return new TypeMismatch2(value0, value1);
    };
  };
  return TypeMismatch2;
}();
var ErrorAtIndex = /* @__PURE__ */ function() {
  function ErrorAtIndex2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  ErrorAtIndex2.create = function(value0) {
    return function(value1) {
      return new ErrorAtIndex2(value0, value1);
    };
  };
  return ErrorAtIndex2;
}();
var ErrorAtProperty = /* @__PURE__ */ function() {
  function ErrorAtProperty2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  ErrorAtProperty2.create = function(value0) {
    return function(value1) {
      return new ErrorAtProperty2(value0, value1);
    };
  };
  return ErrorAtProperty2;
}();
var unsafeToForeign = unsafeCoerce2;
var unsafeFromForeign = unsafeCoerce2;
var showForeignError = {
  show: function(v) {
    if (v instanceof ForeignError) {
      return "(ForeignError " + (show2(v.value0) + ")");
    }
    ;
    if (v instanceof ErrorAtIndex) {
      return "(ErrorAtIndex " + (show1(v.value0) + (" " + (show(showForeignError)(v.value1) + ")")));
    }
    ;
    if (v instanceof ErrorAtProperty) {
      return "(ErrorAtProperty " + (show2(v.value0) + (" " + (show(showForeignError)(v.value1) + ")")));
    }
    ;
    if (v instanceof TypeMismatch) {
      return "(TypeMismatch " + (show2(v.value0) + (" " + (show2(v.value1) + ")")));
    }
    ;
    throw new Error("Failed pattern match at Foreign (line 69, column 1 - line 73, column 89): " + [v.constructor.name]);
  }
};
var renderForeignError = function(v) {
  if (v instanceof ForeignError) {
    return v.value0;
  }
  ;
  if (v instanceof ErrorAtIndex) {
    return "Error at array index " + (show1(v.value0) + (": " + renderForeignError(v.value1)));
  }
  ;
  if (v instanceof ErrorAtProperty) {
    return "Error at property " + (show2(v.value0) + (": " + renderForeignError(v.value1)));
  }
  ;
  if (v instanceof TypeMismatch) {
    return "Type mismatch: expected " + (v.value0 + (", found " + v.value1));
  }
  ;
  throw new Error("Failed pattern match at Foreign (line 78, column 1 - line 78, column 45): " + [v.constructor.name]);
};
var fail = function(dictMonad) {
  var $153 = throwError(monadThrowExceptT(dictMonad));
  return function($154) {
    return $153(singleton5($154));
  };
};
var readArray = function(dictMonad) {
  var pure17 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(value2) {
    if (isArray(value2)) {
      return pure17(unsafeFromForeign(value2));
    }
    ;
    if (otherwise) {
      return fail1(new TypeMismatch("array", tagOf(value2)));
    }
    ;
    throw new Error("Failed pattern match at Foreign (line 164, column 1 - line 164, column 99): " + [value2.constructor.name]);
  };
};
var unsafeReadTagged = function(dictMonad) {
  var pure17 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(tag) {
    return function(value2) {
      if (tagOf(value2) === tag) {
        return pure17(unsafeFromForeign(value2));
      }
      ;
      if (otherwise) {
        return fail1(new TypeMismatch(tag, tagOf(value2)));
      }
      ;
      throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value2.constructor.name]);
    };
  };
};
var readBoolean = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("Boolean");
};
var readNumber = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("Number");
};
var readString = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("String");
};

// output/Data.Nullable/foreign.js
var nullImpl = null;
function nullable(a, r2, f3) {
  return a == null ? r2 : f3(a);
}
function notNull(x2) {
  return x2;
}

// output/Data.Nullable/index.js
var toNullable = /* @__PURE__ */ maybe(nullImpl)(notNull);
var toMaybe = function(n) {
  return nullable(n, Nothing.value, Just.create);
};

// output/Data.Variant/index.js
var on2 = function() {
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(p) {
      return function(f3) {
        return function(g) {
          return function(r2) {
            if (r2.type === reflectSymbol2(p)) {
              return f3(r2.value);
            }
            ;
            return g(r2);
          };
        };
      };
    };
  };
};
var inj = function() {
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return function(p) {
      return function(value2) {
        return {
          type: reflectSymbol2(p),
          value: value2
        };
      };
    };
  };
};

// output/Effect.Uncurried/foreign.js
var runEffectFn1 = function runEffectFn12(fn) {
  return function(a) {
    return function() {
      return fn(a);
    };
  };
};
var runEffectFn3 = function runEffectFn32(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function() {
          return fn(a, b, c);
        };
      };
    };
  };
};

// output/Effect.Unsafe/foreign.js
var unsafePerformEffect = function(f3) {
  return f3();
};

// output/Foreign.Index/foreign.js
function unsafeReadPropImpl(f3, s2, key, value2) {
  return value2 == null ? f3 : s2(value2[key]);
}

// output/Foreign.Index/index.js
var unsafeReadProp = function(dictMonad) {
  var fail6 = fail(dictMonad);
  var pure17 = pure(applicativeExceptT(dictMonad));
  return function(k) {
    return function(value2) {
      return unsafeReadPropImpl(fail6(new TypeMismatch("object", typeOf(value2))), pure17, k, value2);
    };
  };
};
var readProp = function(dictMonad) {
  return unsafeReadProp(dictMonad);
};

// output/Foreign.Object/foreign.js
function _copyST(m2) {
  return function() {
    var r2 = {};
    for (var k in m2) {
      if (hasOwnProperty.call(m2, k)) {
        r2[k] = m2[k];
      }
    }
    return r2;
  };
}
var empty2 = {};
function runST(f3) {
  return f3();
}
function _mapWithKey(m0, f3) {
  var m2 = {};
  for (var k in m0) {
    if (hasOwnProperty.call(m0, k)) {
      m2[k] = f3(k)(m0[k]);
    }
  }
  return m2;
}
function _lookup(no, yes, k, m2) {
  return k in m2 ? yes(m2[k]) : no;
}
function toArrayWithKey(f3) {
  return function(m2) {
    var r2 = [];
    for (var k in m2) {
      if (hasOwnProperty.call(m2, k)) {
        r2.push(f3(k)(m2[k]));
      }
    }
    return r2;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output/Data.Function.Uncurried/foreign.js
var runFn3 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return fn(a, b, c);
      };
    };
  };
};
var runFn4 = function(fn) {
  return function(a) {
    return function(b) {
      return function(c) {
        return function(d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

// output/Foreign.Object.ST/foreign.js
var newImpl = function() {
  return {};
};
function poke2(k) {
  return function(v) {
    return function(m2) {
      return function() {
        m2[k] = v;
        return m2;
      };
    };
  };
}

// output/Foreign.Object/index.js
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindST);
var $$void3 = /* @__PURE__ */ $$void(functorST);
var toUnfoldable2 = function(dictUnfoldable) {
  var $86 = toUnfoldable(dictUnfoldable);
  var $87 = toArrayWithKey(Tuple.create);
  return function($88) {
    return $86($87($88));
  };
};
var thawST = _copyST;
var singleton6 = function(k) {
  return function(v) {
    return runST(bindFlipped2(poke2(k)(v))(newImpl));
  };
};
var mutate = function(f3) {
  return function(m2) {
    return runST(function __do2() {
      var s2 = thawST(m2)();
      f3(s2)();
      return s2;
    });
  };
};
var mapWithKey = function(f3) {
  return function(m2) {
    return _mapWithKey(m2, f3);
  };
};
var lookup2 = /* @__PURE__ */ function() {
  return runFn4(_lookup)(Nothing.value)(Just.create);
}();
var insert2 = function(k) {
  return function(v) {
    return mutate(poke2(k)(v));
  };
};
var fromHomogeneous = function() {
  return unsafeCoerce2;
};
var fromFoldable3 = function(dictFoldable) {
  var fromFoldable1 = fromFoldable(dictFoldable);
  return function(l) {
    return runST(function __do2() {
      var s2 = newImpl();
      foreach(fromFoldable1(l))(function(v) {
        return $$void3(poke2(v.value0)(v.value1)(s2));
      })();
      return s2;
    });
  };
};

// output/Record/index.js
var get = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r2) {
        return unsafeGet(reflectSymbol2(l))(r2);
      };
    };
  };
};

// output/Record.Builder/foreign.js
function copyRecord(rec) {
  var copy3 = {};
  for (var key in rec) {
    if ({}.hasOwnProperty.call(rec, key)) {
      copy3[key] = rec[key];
    }
  }
  return copy3;
}
function unsafeInsert(l) {
  return function(a) {
    return function(rec) {
      rec[l] = a;
      return rec;
    };
  };
}

// output/Record.Builder/index.js
var semigroupoidBuilder = semigroupoidFn;
var insert3 = function() {
  return function() {
    return function(dictIsSymbol) {
      var reflectSymbol2 = reflectSymbol(dictIsSymbol);
      return function(l) {
        return function(a) {
          return function(r1) {
            return unsafeInsert(reflectSymbol2(l))(a)(r1);
          };
        };
      };
    };
  };
};
var categoryBuilder = categoryFn;
var build = function(v) {
  return function(r1) {
    return v(copyRecord(r1));
  };
};

// output/Yoga.JSON/index.js
var identity7 = /* @__PURE__ */ identity(categoryBuilder);
var fail2 = /* @__PURE__ */ fail(monadIdentity);
var readString2 = /* @__PURE__ */ readString(monadIdentity);
var readNumber2 = /* @__PURE__ */ readNumber(monadIdentity);
var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadIdentity);
var pure3 = /* @__PURE__ */ pure(applicativeExceptT2);
var map7 = /* @__PURE__ */ map(functorArray);
var compose1 = /* @__PURE__ */ compose(semigroupoidBuilder);
var insert5 = /* @__PURE__ */ insert3()();
var on3 = /* @__PURE__ */ on2();
var append2 = /* @__PURE__ */ append(semigroupNonEmptyList);
var except2 = /* @__PURE__ */ except(applicativeIdentity);
var functorExceptT2 = /* @__PURE__ */ functorExceptT(functorIdentity);
var map12 = /* @__PURE__ */ map(functorExceptT2);
var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
var pure1 = /* @__PURE__ */ pure(applicativeNonEmptyList);
var map22 = /* @__PURE__ */ map(functorNonEmptyList);
var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindExceptT2);
var lmap2 = /* @__PURE__ */ lmap(bifunctorEither);
var toUnfoldable3 = /* @__PURE__ */ toUnfoldable2(unfoldableArray);
var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindExceptT2);
var readProp2 = /* @__PURE__ */ readProp(monadIdentity);
var mapWithIndex3 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
var readArray2 = /* @__PURE__ */ readArray(monadIdentity);
var writeForeignVariantNilRow = {
  writeVariantImpl: function(v) {
    return function(v1) {
      return unsafeCrashWith("Attempted to write empty variant.");
    };
  }
};
var writeForeignString = {
  writeImpl: unsafeToForeign
};
var writeForeignNumber = {
  writeImpl: unsafeToForeign
};
var writeForeignForeign = {
  writeImpl: /* @__PURE__ */ identity(categoryFn)
};
var writeForeignFieldsNilRowR = {
  writeImplFields: function(v) {
    return function(v1) {
      return identity7;
    };
  }
};
var writeForeignBoolean = {
  writeImpl: unsafeToForeign
};
var readForeignString = {
  readImpl: readString2
};
var readForeignNumber = {
  readImpl: readNumber2
};
var readForeignForeign = {
  readImpl: pure3
};
var readForeignFieldsNilRowRo = {
  getFields: function(v) {
    return function(v1) {
      return pure3(identity7);
    };
  }
};
var readForeignBoolean = {
  readImpl: /* @__PURE__ */ readBoolean(monadIdentity)
};
var writeVariantImpl = function(dict) {
  return dict.writeVariantImpl;
};
var writeForeignVariant = function() {
  return function(dictWriteForeignVariant) {
    var writeVariantImpl1 = writeVariantImpl(dictWriteForeignVariant);
    return {
      writeImpl: function(variant) {
        return writeVariantImpl1($$Proxy.value)(variant);
      }
    };
  };
};
var writeImplFields = function(dict) {
  return dict.writeImplFields;
};
var writeForeignRecord = function() {
  return function(dictWriteForeignFields) {
    var writeImplFields1 = writeImplFields(dictWriteForeignFields);
    return {
      writeImpl: function(rec) {
        var steps = writeImplFields1($$Proxy.value)(rec);
        return unsafeToForeign(build(steps)({}));
      }
    };
  };
};
var writeImpl = function(dict) {
  return dict.writeImpl;
};
var writeJSON = function(dictWriteForeign) {
  var $390 = writeImpl(dictWriteForeign);
  return function($391) {
    return _unsafeStringify($390($391));
  };
};
var writeForeignArray = function(dictWriteForeign) {
  var writeImpl42 = writeImpl(dictWriteForeign);
  return {
    writeImpl: function(xs) {
      return unsafeToForeign(map7(writeImpl42)(xs));
    }
  };
};
var writeImpl1 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignArray(writeForeignForeign));
var writeForeignFieldsCons = function(dictIsSymbol) {
  var get3 = get(dictIsSymbol)();
  var insert32 = insert5(dictIsSymbol);
  return function(dictWriteForeign) {
    var writeImpl42 = writeImpl(dictWriteForeign);
    return function(dictWriteForeignFields) {
      var writeImplFields1 = writeImplFields(dictWriteForeignFields);
      return function() {
        return function() {
          return function() {
            return {
              writeImplFields: function(v) {
                return function(rec) {
                  var rest = writeImplFields1($$Proxy.value)(rec);
                  var value2 = writeImpl42(get3($$Proxy.value)(rec));
                  var result = compose1(insert32($$Proxy.value)(value2))(rest);
                  return result;
                };
              }
            };
          };
        };
      };
    };
  };
};
var writeForeignObject = function(dictWriteForeign) {
  return {
    writeImpl: function() {
      var $400 = mapWithKey($$const(writeImpl(dictWriteForeign)));
      return function($401) {
        return unsafeToForeign($400($401));
      };
    }()
  };
};
var writeImpl3 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignObject(writeForeignForeign));
var writeForeignTuple = function(dictWriteForeign) {
  var writeImpl42 = writeImpl(dictWriteForeign);
  return function(dictWriteForeign1) {
    var writeImpl52 = writeImpl(dictWriteForeign1);
    return {
      writeImpl: function(v) {
        return writeImpl1([writeImpl42(v.value0), writeImpl52(v.value1)]);
      }
    };
  };
};
var writeForeignVariantCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var on1 = on3(dictIsSymbol);
  return function(dictWriteForeign) {
    var writeImpl42 = writeImpl(dictWriteForeign);
    return function() {
      return function(dictWriteForeignVariant) {
        var writeVariantImpl1 = writeVariantImpl(dictWriteForeignVariant);
        return {
          writeVariantImpl: function(v) {
            return function(variant) {
              var name3 = reflectSymbol2($$Proxy.value);
              var writeVariant = function(value2) {
                return writeImpl3(singleton6(name3)(writeImpl42(value2)));
              };
              return on1($$Proxy.value)(writeVariant)(writeVariantImpl1($$Proxy.value))(variant);
            };
          }
        };
      };
    };
  };
};
var write3 = function(dictWriteForeign) {
  return writeImpl(dictWriteForeign);
};
var $$undefined = _undefined;
var writeForeignMaybe = function(dictWriteForeign) {
  return {
    writeImpl: maybe($$undefined)(writeImpl(dictWriteForeign))
  };
};
var sequenceCombining = function(dictMonoid) {
  var append22 = append(dictMonoid.Semigroup0());
  var mempty4 = mempty(dictMonoid);
  return function(dictFoldable) {
    var foldl3 = foldl(dictFoldable);
    return function(dictApplicative) {
      var pure23 = pure(dictApplicative);
      var fn = function(acc) {
        return function(elem3) {
          var v = runExcept(elem3);
          if (acc instanceof Left && v instanceof Left) {
            return new Left(append2(acc.value0)(v.value0));
          }
          ;
          if (acc instanceof Left && v instanceof Right) {
            return new Left(acc.value0);
          }
          ;
          if (acc instanceof Right && v instanceof Right) {
            return new Right(append22(acc.value0)(pure23(v.value0)));
          }
          ;
          if (acc instanceof Right && v instanceof Left) {
            return new Left(v.value0);
          }
          ;
          throw new Error("Failed pattern match at Yoga.JSON (line 582, column 5 - line 586, column 38): " + [acc.constructor.name, v.constructor.name]);
        };
      };
      var $411 = foldl3(fn)(new Right(mempty4));
      return function($412) {
        return except2($411($412));
      };
    };
  };
};
var sequenceCombining1 = /* @__PURE__ */ sequenceCombining(monoidArray)(foldableArray)(applicativeArray);
var readImpl = function(dict) {
  return dict.readImpl;
};
var readForeignMaybe = function(dictReadForeign) {
  return {
    readImpl: function() {
      var readNullOrUndefined = function(v) {
        return function(value2) {
          if (isNull(value2) || isUndefined(value2)) {
            return pure3(Nothing.value);
          }
          ;
          return map12(Just.create)(v(value2));
        };
      };
      return readNullOrUndefined(readImpl(dictReadForeign));
    }()
  };
};
var readForeignObject = function(dictReadForeign) {
  var readImpl32 = readImpl(dictReadForeign);
  return {
    readImpl: function() {
      var readProp1 = function(key) {
        return function(value2) {
          return except2(lmap2(map22(ErrorAtProperty.create(key)))(runExcept(readImpl32(value2))));
        };
      };
      var readObject$prime = function(value2) {
        if (tagOf(value2) === "Object") {
          return pure3(unsafeFromForeign(value2));
        }
        ;
        if (otherwise) {
          return fail2(new TypeMismatch("Object", tagOf(value2)));
        }
        ;
        throw new Error("Failed pattern match at Yoga.JSON (line 263, column 5 - line 263, column 47): " + [value2.constructor.name]);
      };
      var gatherErrors = function() {
        var fn = function(acc) {
          return function(v) {
            var v2 = runExcept(v.value1);
            if (acc instanceof Left && v2 instanceof Left) {
              return new Left(append2(acc.value0)(v2.value0));
            }
            ;
            if (acc instanceof Left && v2 instanceof Right) {
              return new Left(acc.value0);
            }
            ;
            if (acc instanceof Right && v2 instanceof Right) {
              return new Right(insert2(v.value0)(v2.value0)(acc.value0));
            }
            ;
            if (acc instanceof Right && v2 instanceof Left) {
              return new Left(v2.value0);
            }
            ;
            throw new Error("Failed pattern match at Yoga.JSON (line 254, column 9 - line 258, column 42): " + [acc.constructor.name, v2.constructor.name]);
          };
        };
        var $422 = foldl2(fn)(new Right(empty2));
        return function($423) {
          return except2($422(toUnfoldable3($423)));
        };
      }();
      return composeKleisliFlipped2(function() {
        var $424 = mapWithKey(readProp1);
        return function($425) {
          return gatherErrors($424($425));
        };
      }())(readObject$prime);
    }()
  };
};
var readAtIdx = function(dictReadForeign) {
  var readImpl32 = readImpl(dictReadForeign);
  return function(i2) {
    return function(f3) {
      return withExcept(map22(ErrorAtIndex.create(i2)))(readImpl32(f3));
    };
  };
};
var readForeignArray = function(dictReadForeign) {
  return {
    readImpl: composeKleisliFlipped2(function() {
      var $434 = mapWithIndex3(readAtIdx(dictReadForeign));
      return function($435) {
        return sequenceCombining1($434($435));
      };
    }())(readArray2)
  };
};
var read$prime = function(dictReadForeign) {
  return readImpl(dictReadForeign);
};
var read3 = function(dictReadForeign) {
  var $436 = readImpl(dictReadForeign);
  return function($437) {
    return runExcept($436($437));
  };
};
var parseJSON = /* @__PURE__ */ function() {
  var $440 = lmap2(function($443) {
    return pure1(ForeignError.create(message($443)));
  });
  var $441 = runEffectFn1(_parseJSON);
  return function($442) {
    return ExceptT(Identity($440(unsafePerformEffect($$try($441($442))))));
  };
}();
var readJSON = function(dictReadForeign) {
  var $444 = composeKleisliFlipped2(readImpl(dictReadForeign))(parseJSON);
  return function($445) {
    return runExcept($444($445));
  };
};
var readJSON_ = function(dictReadForeign) {
  var $446 = readJSON(dictReadForeign);
  return function($447) {
    return hush($446($447));
  };
};
var getFields = function(dict) {
  return dict.getFields;
};
var readForeignFieldsCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var insert32 = insert5(dictIsSymbol);
  return function(dictReadForeign) {
    var readImpl32 = readImpl(dictReadForeign);
    return function(dictReadForeignFields) {
      var getFields1 = getFields(dictReadForeignFields);
      return function() {
        return function() {
          return {
            getFields: function(v) {
              return function(obj) {
                var rest = getFields1($$Proxy.value)(obj);
                var name3 = reflectSymbol2($$Proxy.value);
                var enrichErrorWithPropName = withExcept(map22(ErrorAtProperty.create(name3)));
                var value2 = enrichErrorWithPropName(bindFlipped3(readImpl32)(readProp2(name3)(obj)));
                var first = map12(insert32($$Proxy.value))(value2);
                return except2(function() {
                  var v1 = runExcept(rest);
                  var v2 = runExcept(first);
                  if (v2 instanceof Right && v1 instanceof Right) {
                    return new Right(compose1(v2.value0)(v1.value0));
                  }
                  ;
                  if (v2 instanceof Left && v1 instanceof Left) {
                    return new Left(append2(v2.value0)(v1.value0));
                  }
                  ;
                  if (v2 instanceof Right && v1 instanceof Left) {
                    return new Left(v1.value0);
                  }
                  ;
                  if (v2 instanceof Left && v1 instanceof Right) {
                    return new Left(v2.value0);
                  }
                  ;
                  throw new Error("Failed pattern match at Yoga.JSON (line 338, column 5 - line 342, column 34): " + [v2.constructor.name, v1.constructor.name]);
                }());
              };
            }
          };
        };
      };
    };
  };
};
var readForeignRecord = function() {
  return function(dictReadForeignFields) {
    var getFields1 = getFields(dictReadForeignFields);
    return {
      readImpl: function(o) {
        return map12(flip(build)({}))(getFields1($$Proxy.value)(o));
      }
    };
  };
};

// output/Backend.Github.API.Types/index.js
var writeForeignGithubGraphQL = writeForeignString;
var readForeignGithubGraphQLQ = readForeignString;
var unGithubGraphQLQuery = function(v) {
  return v;
};

// output/Backend.Tool.Spago.Types/index.js
var SpagoGlobalCacheDir = function(x2) {
  return x2;
};
var writeForeignSpagoGlobalCa = writeForeignString;

// output/Biz.OAuth.Types/index.js
var TokenType = function(x2) {
  return x2;
};
var AccessToken = function(x2) {
  return x2;
};
var writeForeignTokenType = writeForeignString;
var writeForeignScopeList = writeForeignString;
var writeForeignClientID = writeForeignString;
var writeForeignAccessToken = writeForeignString;
var readForeignTokenType = readForeignString;
var readForeignScopeList = readForeignString;
var readForeignAccessToken = readForeignString;

// output/Biz.Github.Auth.Types/index.js
var writeForeignRecord2 = /* @__PURE__ */ writeForeignRecord();
var writeImpl2 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "client_id";
  }
})(writeForeignClientID)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "scope";
  }
})(writeForeignString)(writeForeignFieldsNilRowR)()()())()()()));
var intercalate6 = /* @__PURE__ */ intercalate3(monoidString);
var device_codeIsSymbol = {
  reflectSymbol: function() {
    return "device_code";
  }
};
var expires_inIsSymbol = {
  reflectSymbol: function() {
    return "expires_in";
  }
};
var intervalIsSymbol = {
  reflectSymbol: function() {
    return "interval";
  }
};
var user_codeIsSymbol = {
  reflectSymbol: function() {
    return "user_code";
  }
};
var verification_uriIsSymbol = {
  reflectSymbol: function() {
    return "verification_uri";
  }
};
var un2 = /* @__PURE__ */ un();
var map8 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var writeForeignVerificationU = writeForeignString;
var writeForeignUserCode = writeForeignString;
var writeForeignPersonalAcces = writeForeignString;
var writeForeignGrantType = writeForeignString;
var writeForeignDeviceCodeReq = {
  writeImpl: function(v) {
    return writeImpl2({
      scope: intercalate6(" ")(v.scope),
      client_id: v.client_id
    });
  }
};
var writeForeignDeviceCode = writeForeignString;
var writeImpl12 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(device_codeIsSymbol)(writeForeignDeviceCode)(/* @__PURE__ */ writeForeignFieldsCons(expires_inIsSymbol)(writeForeignNumber)(/* @__PURE__ */ writeForeignFieldsCons(intervalIsSymbol)(writeForeignNumber)(/* @__PURE__ */ writeForeignFieldsCons(user_codeIsSymbol)(writeForeignUserCode)(/* @__PURE__ */ writeForeignFieldsCons(verification_uriIsSymbol)(writeForeignVerificationU)(writeForeignFieldsNilRowR)()()())()()())()()())()()())()()()));
var writeForeignDeviceCodeRes = {
  writeImpl: function(v) {
    return writeImpl12({
      expires_in: un2(Seconds)(v.expires_in),
      interval: un2(Seconds)(v.interval),
      device_code: v.device_code,
      user_code: v.user_code,
      verification_uri: v.verification_uri
    });
  }
};
var readForeignVerificationUR = readForeignString;
var readForeignUserCode = readForeignString;
var readForeignPersonalAccess = readForeignString;
var readForeignDeviceCode = readForeignString;
var readImpl2 = /* @__PURE__ */ readImpl(/* @__PURE__ */ readForeignRecord()(/* @__PURE__ */ readForeignFieldsCons(device_codeIsSymbol)(readForeignDeviceCode)(/* @__PURE__ */ readForeignFieldsCons(expires_inIsSymbol)(readForeignNumber)(/* @__PURE__ */ readForeignFieldsCons(intervalIsSymbol)(readForeignNumber)(/* @__PURE__ */ readForeignFieldsCons(user_codeIsSymbol)(readForeignUserCode)(/* @__PURE__ */ readForeignFieldsCons(verification_uriIsSymbol)(readForeignVerificationUR)(readForeignFieldsNilRowRo)()())()())()())()())()()));
var readForeignDeviceCodeResp = {
  readImpl: function(fgn) {
    return map8(function(v) {
      return {
        device_code: v.device_code,
        expires_in: v.expires_in,
        interval: v.interval,
        user_code: v.user_code,
        verification_uri: v.verification_uri
      };
    })(readImpl2(fgn));
  }
};

// output/Biz.Github.Types/index.js
var writeForeignRepository = writeForeignString;
var readForeignRepository = readForeignString;

// output/Data.Bounded.Generic/index.js
var genericTopNoArguments = /* @__PURE__ */ function() {
  return {
    "genericTop'": NoArguments.value
  };
}();
var genericTop$prime = function(dict) {
  return dict["genericTop'"];
};
var genericTopConstructor = function(dictGenericTop) {
  return {
    "genericTop'": genericTop$prime(dictGenericTop)
  };
};
var genericTopSum = function(dictGenericTop) {
  return {
    "genericTop'": new Inr(genericTop$prime(dictGenericTop))
  };
};
var genericTop = function(dictGeneric) {
  var to2 = to(dictGeneric);
  return function(dictGenericTop) {
    return to2(genericTop$prime(dictGenericTop));
  };
};
var genericBottomNoArguments = /* @__PURE__ */ function() {
  return {
    "genericBottom'": NoArguments.value
  };
}();
var genericBottom$prime = function(dict) {
  return dict["genericBottom'"];
};
var genericBottomConstructor = function(dictGenericBottom) {
  return {
    "genericBottom'": genericBottom$prime(dictGenericBottom)
  };
};
var genericBottomSum = function(dictGenericBottom) {
  return {
    "genericBottom'": new Inl(genericBottom$prime(dictGenericBottom))
  };
};
var genericBottom = function(dictGeneric) {
  var to2 = to(dictGeneric);
  return function(dictGenericBottom) {
    return to2(genericBottom$prime(dictGenericBottom));
  };
};

// output/Data.Enum.Generic/index.js
var map9 = /* @__PURE__ */ map(functorMaybe);
var genericSucc$prime = function(dict) {
  return dict["genericSucc'"];
};
var genericSucc = function(dictGeneric) {
  var to2 = to(dictGeneric);
  var from3 = from(dictGeneric);
  return function(dictGenericEnum) {
    var $156 = map9(to2);
    var $157 = genericSucc$prime(dictGenericEnum);
    return function($158) {
      return $156($157(from3($158)));
    };
  };
};
var genericPred$prime = function(dict) {
  return dict["genericPred'"];
};
var genericPred = function(dictGeneric) {
  var to2 = to(dictGeneric);
  var from3 = from(dictGeneric);
  return function(dictGenericEnum) {
    var $159 = map9(to2);
    var $160 = genericPred$prime(dictGenericEnum);
    return function($161) {
      return $159($160(from3($161)));
    };
  };
};
var genericEnumSum = function(dictGenericEnum) {
  var genericPred$prime1 = genericPred$prime(dictGenericEnum);
  var genericSucc$prime1 = genericSucc$prime(dictGenericEnum);
  return function(dictGenericTop) {
    var genericTop$prime2 = genericTop$prime(dictGenericTop);
    return function(dictGenericEnum1) {
      var genericPred$prime2 = genericPred$prime(dictGenericEnum1);
      var genericSucc$prime2 = genericSucc$prime(dictGenericEnum1);
      return function(dictGenericBottom) {
        var genericBottom$prime2 = genericBottom$prime(dictGenericBottom);
        return {
          "genericPred'": function(v) {
            if (v instanceof Inl) {
              return map9(Inl.create)(genericPred$prime1(v.value0));
            }
            ;
            if (v instanceof Inr) {
              var v1 = genericPred$prime2(v.value0);
              if (v1 instanceof Nothing) {
                return new Just(new Inl(genericTop$prime2));
              }
              ;
              if (v1 instanceof Just) {
                return new Just(new Inr(v1.value0));
              }
              ;
              throw new Error("Failed pattern match at Data.Enum.Generic (line 30, column 14 - line 32, column 31): " + [v1.constructor.name]);
            }
            ;
            throw new Error("Failed pattern match at Data.Enum.Generic (line 28, column 18 - line 32, column 31): " + [v.constructor.name]);
          },
          "genericSucc'": function(v) {
            if (v instanceof Inl) {
              var v1 = genericSucc$prime1(v.value0);
              if (v1 instanceof Nothing) {
                return new Just(new Inr(genericBottom$prime2));
              }
              ;
              if (v1 instanceof Just) {
                return new Just(new Inl(v1.value0));
              }
              ;
              throw new Error("Failed pattern match at Data.Enum.Generic (line 34, column 14 - line 36, column 31): " + [v1.constructor.name]);
            }
            ;
            if (v instanceof Inr) {
              return map9(Inr.create)(genericSucc$prime2(v.value0));
            }
            ;
            throw new Error("Failed pattern match at Data.Enum.Generic (line 33, column 18 - line 37, column 36): " + [v.constructor.name]);
          }
        };
      };
    };
  };
};
var genericEnumNoArguments = {
  "genericPred'": function(v) {
    return Nothing.value;
  },
  "genericSucc'": function(v) {
    return Nothing.value;
  }
};
var genericEnumConstructor = function(dictGenericEnum) {
  var genericPred$prime1 = genericPred$prime(dictGenericEnum);
  var genericSucc$prime1 = genericSucc$prime(dictGenericEnum);
  return {
    "genericPred'": function(v) {
      return map9(Constructor)(genericPred$prime1(v));
    },
    "genericSucc'": function(v) {
      return map9(Constructor)(genericSucc$prime1(v));
    }
  };
};

// output/Data.CodePoint.Unicode.Internal/index.js
var unsafeIndex2 = /* @__PURE__ */ unsafeIndex();
var NUMCAT_LU = /* @__PURE__ */ function() {
  function NUMCAT_LU2() {
  }
  ;
  NUMCAT_LU2.value = new NUMCAT_LU2();
  return NUMCAT_LU2;
}();
var NUMCAT_LL = /* @__PURE__ */ function() {
  function NUMCAT_LL2() {
  }
  ;
  NUMCAT_LL2.value = new NUMCAT_LL2();
  return NUMCAT_LL2;
}();
var NUMCAT_LT = /* @__PURE__ */ function() {
  function NUMCAT_LT2() {
  }
  ;
  NUMCAT_LT2.value = new NUMCAT_LT2();
  return NUMCAT_LT2;
}();
var NUMCAT_MN = /* @__PURE__ */ function() {
  function NUMCAT_MN2() {
  }
  ;
  NUMCAT_MN2.value = new NUMCAT_MN2();
  return NUMCAT_MN2;
}();
var NUMCAT_NL = /* @__PURE__ */ function() {
  function NUMCAT_NL2() {
  }
  ;
  NUMCAT_NL2.value = new NUMCAT_NL2();
  return NUMCAT_NL2;
}();
var NUMCAT_SO = /* @__PURE__ */ function() {
  function NUMCAT_SO2() {
  }
  ;
  NUMCAT_SO2.value = new NUMCAT_SO2();
  return NUMCAT_SO2;
}();
var NUMCAT_CN = /* @__PURE__ */ function() {
  function NUMCAT_CN2() {
  }
  ;
  NUMCAT_CN2.value = new NUMCAT_CN2();
  return NUMCAT_CN2;
}();
var numConvBlocks = 1332;
var gencatSO = 8192;
var rule170 = /* @__PURE__ */ function() {
  return {
    category: gencatSO,
    unicodeCat: NUMCAT_SO.value,
    possible: 1,
    updist: 0,
    lowdist: 26,
    titledist: 0
  };
}();
var rule171 = /* @__PURE__ */ function() {
  return {
    category: gencatSO,
    unicodeCat: NUMCAT_SO.value,
    possible: 1,
    updist: -26 | 0,
    lowdist: 0,
    titledist: -26 | 0
  };
}();
var gencatNL = 16777216;
var rule168 = /* @__PURE__ */ function() {
  return {
    category: gencatNL,
    unicodeCat: NUMCAT_NL.value,
    possible: 1,
    updist: 0,
    lowdist: 16,
    titledist: 0
  };
}();
var rule169 = /* @__PURE__ */ function() {
  return {
    category: gencatNL,
    unicodeCat: NUMCAT_NL.value,
    possible: 1,
    updist: -16 | 0,
    lowdist: 0,
    titledist: -16 | 0
  };
}();
var gencatMN = 2097152;
var rule93 = /* @__PURE__ */ function() {
  return {
    category: gencatMN,
    unicodeCat: NUMCAT_MN.value,
    possible: 1,
    updist: 84,
    lowdist: 0,
    titledist: 84
  };
}();
var gencatLU = 512;
var nullrule = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_CN.value,
    possible: 0,
    updist: 0,
    lowdist: 0,
    titledist: 0
  };
}();
var rule104 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 8,
    titledist: 0
  };
}();
var rule115 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -60 | 0,
    titledist: 0
  };
}();
var rule117 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7 | 0,
    titledist: 0
  };
}();
var rule118 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 80,
    titledist: 0
  };
}();
var rule120 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 15,
    titledist: 0
  };
}();
var rule122 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 48,
    titledist: 0
  };
}();
var rule125 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 7264,
    titledist: 0
  };
}();
var rule127 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 38864,
    titledist: 0
  };
}();
var rule137 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -3008 | 0,
    titledist: 0
  };
}();
var rule142 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7615 | 0,
    titledist: 0
  };
}();
var rule144 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8 | 0,
    titledist: 0
  };
}();
var rule153 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -74 | 0,
    titledist: 0
  };
}();
var rule156 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -86 | 0,
    titledist: 0
  };
}();
var rule157 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -100 | 0,
    titledist: 0
  };
}();
var rule158 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -112 | 0,
    titledist: 0
  };
}();
var rule159 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -128 | 0,
    titledist: 0
  };
}();
var rule160 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -126 | 0,
    titledist: 0
  };
}();
var rule163 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -7517 | 0,
    titledist: 0
  };
}();
var rule164 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8383 | 0,
    titledist: 0
  };
}();
var rule165 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -8262 | 0,
    titledist: 0
  };
}();
var rule166 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 28,
    titledist: 0
  };
}();
var rule172 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10743 | 0,
    titledist: 0
  };
}();
var rule173 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -3814 | 0,
    titledist: 0
  };
}();
var rule174 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10727 | 0,
    titledist: 0
  };
}();
var rule177 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10780 | 0,
    titledist: 0
  };
}();
var rule178 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10749 | 0,
    titledist: 0
  };
}();
var rule179 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10783 | 0,
    titledist: 0
  };
}();
var rule180 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10782 | 0,
    titledist: 0
  };
}();
var rule181 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -10815 | 0,
    titledist: 0
  };
}();
var rule183 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -35332 | 0,
    titledist: 0
  };
}();
var rule184 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42280 | 0,
    titledist: 0
  };
}();
var rule186 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42308 | 0,
    titledist: 0
  };
}();
var rule187 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42319 | 0,
    titledist: 0
  };
}();
var rule188 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42315 | 0,
    titledist: 0
  };
}();
var rule189 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42305 | 0,
    titledist: 0
  };
}();
var rule190 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42258 | 0,
    titledist: 0
  };
}();
var rule191 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42282 | 0,
    titledist: 0
  };
}();
var rule192 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42261 | 0,
    titledist: 0
  };
}();
var rule193 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 928,
    titledist: 0
  };
}();
var rule194 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -48 | 0,
    titledist: 0
  };
}();
var rule195 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -42307 | 0,
    titledist: 0
  };
}();
var rule196 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -35384 | 0,
    titledist: 0
  };
}();
var rule201 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 40,
    titledist: 0
  };
}();
var rule203 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 34,
    titledist: 0
  };
}();
var rule22 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 1,
    titledist: 0
  };
}();
var rule24 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -199 | 0,
    titledist: 0
  };
}();
var rule26 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -121 | 0,
    titledist: 0
  };
}();
var rule29 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 210,
    titledist: 0
  };
}();
var rule30 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 206,
    titledist: 0
  };
}();
var rule31 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 205,
    titledist: 0
  };
}();
var rule32 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 79,
    titledist: 0
  };
}();
var rule33 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 202,
    titledist: 0
  };
}();
var rule34 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 203,
    titledist: 0
  };
}();
var rule35 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 207,
    titledist: 0
  };
}();
var rule37 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 211,
    titledist: 0
  };
}();
var rule38 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 209,
    titledist: 0
  };
}();
var rule40 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 213,
    titledist: 0
  };
}();
var rule42 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 214,
    titledist: 0
  };
}();
var rule43 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 218,
    titledist: 0
  };
}();
var rule44 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 217,
    titledist: 0
  };
}();
var rule45 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 219,
    titledist: 0
  };
}();
var rule47 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 2,
    titledist: 1
  };
}();
var rule51 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -97 | 0,
    titledist: 0
  };
}();
var rule52 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -56 | 0,
    titledist: 0
  };
}();
var rule53 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -130 | 0,
    titledist: 0
  };
}();
var rule54 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 10795,
    titledist: 0
  };
}();
var rule55 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -163 | 0,
    titledist: 0
  };
}();
var rule56 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 10792,
    titledist: 0
  };
}();
var rule58 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: -195 | 0,
    titledist: 0
  };
}();
var rule59 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 69,
    titledist: 0
  };
}();
var rule60 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 71,
    titledist: 0
  };
}();
var rule9 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 32,
    titledist: 0
  };
}();
var rule94 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 116,
    titledist: 0
  };
}();
var rule95 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 38,
    titledist: 0
  };
}();
var rule96 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 37,
    titledist: 0
  };
}();
var rule97 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 64,
    titledist: 0
  };
}();
var rule98 = /* @__PURE__ */ function() {
  return {
    category: gencatLU,
    unicodeCat: NUMCAT_LU.value,
    possible: 1,
    updist: 0,
    lowdist: 63,
    titledist: 0
  };
}();
var gencatLT = 524288;
var rule151 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: 0,
    lowdist: -8 | 0,
    titledist: 0
  };
}();
var rule154 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: 0,
    lowdist: -9 | 0,
    titledist: 0
  };
}();
var rule48 = /* @__PURE__ */ function() {
  return {
    category: gencatLT,
    unicodeCat: NUMCAT_LT.value,
    possible: 1,
    updist: -1 | 0,
    lowdist: 1,
    titledist: 0
  };
}();
var gencatLL = 4096;
var rule100 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -37 | 0,
    lowdist: 0,
    titledist: -37 | 0
  };
}();
var rule101 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -31 | 0,
    lowdist: 0,
    titledist: -31 | 0
  };
}();
var rule102 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -64 | 0,
    lowdist: 0,
    titledist: -64 | 0
  };
}();
var rule103 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -63 | 0,
    lowdist: 0,
    titledist: -63 | 0
  };
}();
var rule105 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -62 | 0,
    lowdist: 0,
    titledist: -62 | 0
  };
}();
var rule106 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -57 | 0,
    lowdist: 0,
    titledist: -57 | 0
  };
}();
var rule108 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -47 | 0,
    lowdist: 0,
    titledist: -47 | 0
  };
}();
var rule109 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -54 | 0,
    lowdist: 0,
    titledist: -54 | 0
  };
}();
var rule110 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -8 | 0,
    lowdist: 0,
    titledist: -8 | 0
  };
}();
var rule111 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -86 | 0,
    lowdist: 0,
    titledist: -86 | 0
  };
}();
var rule112 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -80 | 0,
    lowdist: 0,
    titledist: -80 | 0
  };
}();
var rule113 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 7,
    lowdist: 0,
    titledist: 7
  };
}();
var rule114 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -116 | 0,
    lowdist: 0,
    titledist: -116 | 0
  };
}();
var rule116 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -96 | 0,
    lowdist: 0,
    titledist: -96 | 0
  };
}();
var rule12 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -32 | 0,
    lowdist: 0,
    titledist: -32 | 0
  };
}();
var rule121 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -15 | 0,
    lowdist: 0,
    titledist: -15 | 0
  };
}();
var rule123 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -48 | 0,
    lowdist: 0,
    titledist: -48 | 0
  };
}();
var rule126 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 3008,
    lowdist: 0,
    titledist: 0
  };
}();
var rule129 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6254 | 0,
    lowdist: 0,
    titledist: -6254 | 0
  };
}();
var rule130 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6253 | 0,
    lowdist: 0,
    titledist: -6253 | 0
  };
}();
var rule131 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6244 | 0,
    lowdist: 0,
    titledist: -6244 | 0
  };
}();
var rule132 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6242 | 0,
    lowdist: 0,
    titledist: -6242 | 0
  };
}();
var rule133 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6243 | 0,
    lowdist: 0,
    titledist: -6243 | 0
  };
}();
var rule134 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6236 | 0,
    lowdist: 0,
    titledist: -6236 | 0
  };
}();
var rule135 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -6181 | 0,
    lowdist: 0,
    titledist: -6181 | 0
  };
}();
var rule136 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35266,
    lowdist: 0,
    titledist: 35266
  };
}();
var rule138 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35332,
    lowdist: 0,
    titledist: 35332
  };
}();
var rule139 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 3814,
    lowdist: 0,
    titledist: 3814
  };
}();
var rule140 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 35384,
    lowdist: 0,
    titledist: 35384
  };
}();
var rule141 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -59 | 0,
    lowdist: 0,
    titledist: -59 | 0
  };
}();
var rule143 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 8,
    lowdist: 0,
    titledist: 8
  };
}();
var rule145 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 74,
    lowdist: 0,
    titledist: 74
  };
}();
var rule146 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 86,
    lowdist: 0,
    titledist: 86
  };
}();
var rule147 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 100,
    lowdist: 0,
    titledist: 100
  };
}();
var rule148 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 128,
    lowdist: 0,
    titledist: 128
  };
}();
var rule149 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 112,
    lowdist: 0,
    titledist: 112
  };
}();
var rule150 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 126,
    lowdist: 0,
    titledist: 126
  };
}();
var rule152 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 9,
    lowdist: 0,
    titledist: 9
  };
}();
var rule155 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -7205 | 0,
    lowdist: 0,
    titledist: -7205 | 0
  };
}();
var rule167 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -28 | 0,
    lowdist: 0,
    titledist: -28 | 0
  };
}();
var rule175 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -10795 | 0,
    lowdist: 0,
    titledist: -10795 | 0
  };
}();
var rule176 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -10792 | 0,
    lowdist: 0,
    titledist: -10792 | 0
  };
}();
var rule18 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 743,
    lowdist: 0,
    titledist: 743
  };
}();
var rule182 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -7264 | 0,
    lowdist: 0,
    titledist: -7264 | 0
  };
}();
var rule185 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 48,
    lowdist: 0,
    titledist: 48
  };
}();
var rule197 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -928 | 0,
    lowdist: 0,
    titledist: -928 | 0
  };
}();
var rule198 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -38864 | 0,
    lowdist: 0,
    titledist: -38864 | 0
  };
}();
var rule202 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -40 | 0,
    lowdist: 0,
    titledist: -40 | 0
  };
}();
var rule204 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -34 | 0,
    lowdist: 0,
    titledist: -34 | 0
  };
}();
var rule21 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 121,
    lowdist: 0,
    titledist: 121
  };
}();
var rule23 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -1 | 0,
    lowdist: 0,
    titledist: -1 | 0
  };
}();
var rule25 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -232 | 0,
    lowdist: 0,
    titledist: -232 | 0
  };
}();
var rule27 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -300 | 0,
    lowdist: 0,
    titledist: -300 | 0
  };
}();
var rule28 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 195,
    lowdist: 0,
    titledist: 195
  };
}();
var rule36 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 97,
    lowdist: 0,
    titledist: 97
  };
}();
var rule39 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 163,
    lowdist: 0,
    titledist: 163
  };
}();
var rule41 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 130,
    lowdist: 0,
    titledist: 130
  };
}();
var rule46 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 56,
    lowdist: 0,
    titledist: 56
  };
}();
var rule49 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -2 | 0,
    lowdist: 0,
    titledist: -1 | 0
  };
}();
var rule50 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -79 | 0,
    lowdist: 0,
    titledist: -79 | 0
  };
}();
var rule57 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10815,
    lowdist: 0,
    titledist: 10815
  };
}();
var rule61 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10783,
    lowdist: 0,
    titledist: 10783
  };
}();
var rule62 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10780,
    lowdist: 0,
    titledist: 10780
  };
}();
var rule63 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10782,
    lowdist: 0,
    titledist: 10782
  };
}();
var rule64 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -210 | 0,
    lowdist: 0,
    titledist: -210 | 0
  };
}();
var rule65 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -206 | 0,
    lowdist: 0,
    titledist: -206 | 0
  };
}();
var rule66 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -205 | 0,
    lowdist: 0,
    titledist: -205 | 0
  };
}();
var rule67 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -202 | 0,
    lowdist: 0,
    titledist: -202 | 0
  };
}();
var rule68 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -203 | 0,
    lowdist: 0,
    titledist: -203 | 0
  };
}();
var rule69 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42319,
    lowdist: 0,
    titledist: 42319
  };
}();
var rule70 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42315,
    lowdist: 0,
    titledist: 42315
  };
}();
var rule71 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -207 | 0,
    lowdist: 0,
    titledist: -207 | 0
  };
}();
var rule72 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42280,
    lowdist: 0,
    titledist: 42280
  };
}();
var rule73 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42308,
    lowdist: 0,
    titledist: 42308
  };
}();
var rule74 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -209 | 0,
    lowdist: 0,
    titledist: -209 | 0
  };
}();
var rule75 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -211 | 0,
    lowdist: 0,
    titledist: -211 | 0
  };
}();
var rule76 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10743,
    lowdist: 0,
    titledist: 10743
  };
}();
var rule77 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42305,
    lowdist: 0,
    titledist: 42305
  };
}();
var rule78 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10749,
    lowdist: 0,
    titledist: 10749
  };
}();
var rule79 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -213 | 0,
    lowdist: 0,
    titledist: -213 | 0
  };
}();
var rule80 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -214 | 0,
    lowdist: 0,
    titledist: -214 | 0
  };
}();
var rule81 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 10727,
    lowdist: 0,
    titledist: 10727
  };
}();
var rule82 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -218 | 0,
    lowdist: 0,
    titledist: -218 | 0
  };
}();
var rule83 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42307,
    lowdist: 0,
    titledist: 42307
  };
}();
var rule84 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42282,
    lowdist: 0,
    titledist: 42282
  };
}();
var rule85 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -69 | 0,
    lowdist: 0,
    titledist: -69 | 0
  };
}();
var rule86 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -217 | 0,
    lowdist: 0,
    titledist: -217 | 0
  };
}();
var rule87 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -71 | 0,
    lowdist: 0,
    titledist: -71 | 0
  };
}();
var rule88 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -219 | 0,
    lowdist: 0,
    titledist: -219 | 0
  };
}();
var rule89 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42261,
    lowdist: 0,
    titledist: 42261
  };
}();
var rule90 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: 42258,
    lowdist: 0,
    titledist: 42258
  };
}();
var rule99 = /* @__PURE__ */ function() {
  return {
    category: gencatLL,
    unicodeCat: NUMCAT_LL.value,
    possible: 1,
    updist: -38 | 0,
    lowdist: 0,
    titledist: -38 | 0
  };
}();
var convchars = [{
  start: 65,
  length: 26,
  convRule: rule9
}, {
  start: 97,
  length: 26,
  convRule: rule12
}, {
  start: 181,
  length: 1,
  convRule: rule18
}, {
  start: 192,
  length: 23,
  convRule: rule9
}, {
  start: 216,
  length: 7,
  convRule: rule9
}, {
  start: 224,
  length: 23,
  convRule: rule12
}, {
  start: 248,
  length: 7,
  convRule: rule12
}, {
  start: 255,
  length: 1,
  convRule: rule21
}, {
  start: 256,
  length: 1,
  convRule: rule22
}, {
  start: 257,
  length: 1,
  convRule: rule23
}, {
  start: 258,
  length: 1,
  convRule: rule22
}, {
  start: 259,
  length: 1,
  convRule: rule23
}, {
  start: 260,
  length: 1,
  convRule: rule22
}, {
  start: 261,
  length: 1,
  convRule: rule23
}, {
  start: 262,
  length: 1,
  convRule: rule22
}, {
  start: 263,
  length: 1,
  convRule: rule23
}, {
  start: 264,
  length: 1,
  convRule: rule22
}, {
  start: 265,
  length: 1,
  convRule: rule23
}, {
  start: 266,
  length: 1,
  convRule: rule22
}, {
  start: 267,
  length: 1,
  convRule: rule23
}, {
  start: 268,
  length: 1,
  convRule: rule22
}, {
  start: 269,
  length: 1,
  convRule: rule23
}, {
  start: 270,
  length: 1,
  convRule: rule22
}, {
  start: 271,
  length: 1,
  convRule: rule23
}, {
  start: 272,
  length: 1,
  convRule: rule22
}, {
  start: 273,
  length: 1,
  convRule: rule23
}, {
  start: 274,
  length: 1,
  convRule: rule22
}, {
  start: 275,
  length: 1,
  convRule: rule23
}, {
  start: 276,
  length: 1,
  convRule: rule22
}, {
  start: 277,
  length: 1,
  convRule: rule23
}, {
  start: 278,
  length: 1,
  convRule: rule22
}, {
  start: 279,
  length: 1,
  convRule: rule23
}, {
  start: 280,
  length: 1,
  convRule: rule22
}, {
  start: 281,
  length: 1,
  convRule: rule23
}, {
  start: 282,
  length: 1,
  convRule: rule22
}, {
  start: 283,
  length: 1,
  convRule: rule23
}, {
  start: 284,
  length: 1,
  convRule: rule22
}, {
  start: 285,
  length: 1,
  convRule: rule23
}, {
  start: 286,
  length: 1,
  convRule: rule22
}, {
  start: 287,
  length: 1,
  convRule: rule23
}, {
  start: 288,
  length: 1,
  convRule: rule22
}, {
  start: 289,
  length: 1,
  convRule: rule23
}, {
  start: 290,
  length: 1,
  convRule: rule22
}, {
  start: 291,
  length: 1,
  convRule: rule23
}, {
  start: 292,
  length: 1,
  convRule: rule22
}, {
  start: 293,
  length: 1,
  convRule: rule23
}, {
  start: 294,
  length: 1,
  convRule: rule22
}, {
  start: 295,
  length: 1,
  convRule: rule23
}, {
  start: 296,
  length: 1,
  convRule: rule22
}, {
  start: 297,
  length: 1,
  convRule: rule23
}, {
  start: 298,
  length: 1,
  convRule: rule22
}, {
  start: 299,
  length: 1,
  convRule: rule23
}, {
  start: 300,
  length: 1,
  convRule: rule22
}, {
  start: 301,
  length: 1,
  convRule: rule23
}, {
  start: 302,
  length: 1,
  convRule: rule22
}, {
  start: 303,
  length: 1,
  convRule: rule23
}, {
  start: 304,
  length: 1,
  convRule: rule24
}, {
  start: 305,
  length: 1,
  convRule: rule25
}, {
  start: 306,
  length: 1,
  convRule: rule22
}, {
  start: 307,
  length: 1,
  convRule: rule23
}, {
  start: 308,
  length: 1,
  convRule: rule22
}, {
  start: 309,
  length: 1,
  convRule: rule23
}, {
  start: 310,
  length: 1,
  convRule: rule22
}, {
  start: 311,
  length: 1,
  convRule: rule23
}, {
  start: 313,
  length: 1,
  convRule: rule22
}, {
  start: 314,
  length: 1,
  convRule: rule23
}, {
  start: 315,
  length: 1,
  convRule: rule22
}, {
  start: 316,
  length: 1,
  convRule: rule23
}, {
  start: 317,
  length: 1,
  convRule: rule22
}, {
  start: 318,
  length: 1,
  convRule: rule23
}, {
  start: 319,
  length: 1,
  convRule: rule22
}, {
  start: 320,
  length: 1,
  convRule: rule23
}, {
  start: 321,
  length: 1,
  convRule: rule22
}, {
  start: 322,
  length: 1,
  convRule: rule23
}, {
  start: 323,
  length: 1,
  convRule: rule22
}, {
  start: 324,
  length: 1,
  convRule: rule23
}, {
  start: 325,
  length: 1,
  convRule: rule22
}, {
  start: 326,
  length: 1,
  convRule: rule23
}, {
  start: 327,
  length: 1,
  convRule: rule22
}, {
  start: 328,
  length: 1,
  convRule: rule23
}, {
  start: 330,
  length: 1,
  convRule: rule22
}, {
  start: 331,
  length: 1,
  convRule: rule23
}, {
  start: 332,
  length: 1,
  convRule: rule22
}, {
  start: 333,
  length: 1,
  convRule: rule23
}, {
  start: 334,
  length: 1,
  convRule: rule22
}, {
  start: 335,
  length: 1,
  convRule: rule23
}, {
  start: 336,
  length: 1,
  convRule: rule22
}, {
  start: 337,
  length: 1,
  convRule: rule23
}, {
  start: 338,
  length: 1,
  convRule: rule22
}, {
  start: 339,
  length: 1,
  convRule: rule23
}, {
  start: 340,
  length: 1,
  convRule: rule22
}, {
  start: 341,
  length: 1,
  convRule: rule23
}, {
  start: 342,
  length: 1,
  convRule: rule22
}, {
  start: 343,
  length: 1,
  convRule: rule23
}, {
  start: 344,
  length: 1,
  convRule: rule22
}, {
  start: 345,
  length: 1,
  convRule: rule23
}, {
  start: 346,
  length: 1,
  convRule: rule22
}, {
  start: 347,
  length: 1,
  convRule: rule23
}, {
  start: 348,
  length: 1,
  convRule: rule22
}, {
  start: 349,
  length: 1,
  convRule: rule23
}, {
  start: 350,
  length: 1,
  convRule: rule22
}, {
  start: 351,
  length: 1,
  convRule: rule23
}, {
  start: 352,
  length: 1,
  convRule: rule22
}, {
  start: 353,
  length: 1,
  convRule: rule23
}, {
  start: 354,
  length: 1,
  convRule: rule22
}, {
  start: 355,
  length: 1,
  convRule: rule23
}, {
  start: 356,
  length: 1,
  convRule: rule22
}, {
  start: 357,
  length: 1,
  convRule: rule23
}, {
  start: 358,
  length: 1,
  convRule: rule22
}, {
  start: 359,
  length: 1,
  convRule: rule23
}, {
  start: 360,
  length: 1,
  convRule: rule22
}, {
  start: 361,
  length: 1,
  convRule: rule23
}, {
  start: 362,
  length: 1,
  convRule: rule22
}, {
  start: 363,
  length: 1,
  convRule: rule23
}, {
  start: 364,
  length: 1,
  convRule: rule22
}, {
  start: 365,
  length: 1,
  convRule: rule23
}, {
  start: 366,
  length: 1,
  convRule: rule22
}, {
  start: 367,
  length: 1,
  convRule: rule23
}, {
  start: 368,
  length: 1,
  convRule: rule22
}, {
  start: 369,
  length: 1,
  convRule: rule23
}, {
  start: 370,
  length: 1,
  convRule: rule22
}, {
  start: 371,
  length: 1,
  convRule: rule23
}, {
  start: 372,
  length: 1,
  convRule: rule22
}, {
  start: 373,
  length: 1,
  convRule: rule23
}, {
  start: 374,
  length: 1,
  convRule: rule22
}, {
  start: 375,
  length: 1,
  convRule: rule23
}, {
  start: 376,
  length: 1,
  convRule: rule26
}, {
  start: 377,
  length: 1,
  convRule: rule22
}, {
  start: 378,
  length: 1,
  convRule: rule23
}, {
  start: 379,
  length: 1,
  convRule: rule22
}, {
  start: 380,
  length: 1,
  convRule: rule23
}, {
  start: 381,
  length: 1,
  convRule: rule22
}, {
  start: 382,
  length: 1,
  convRule: rule23
}, {
  start: 383,
  length: 1,
  convRule: rule27
}, {
  start: 384,
  length: 1,
  convRule: rule28
}, {
  start: 385,
  length: 1,
  convRule: rule29
}, {
  start: 386,
  length: 1,
  convRule: rule22
}, {
  start: 387,
  length: 1,
  convRule: rule23
}, {
  start: 388,
  length: 1,
  convRule: rule22
}, {
  start: 389,
  length: 1,
  convRule: rule23
}, {
  start: 390,
  length: 1,
  convRule: rule30
}, {
  start: 391,
  length: 1,
  convRule: rule22
}, {
  start: 392,
  length: 1,
  convRule: rule23
}, {
  start: 393,
  length: 2,
  convRule: rule31
}, {
  start: 395,
  length: 1,
  convRule: rule22
}, {
  start: 396,
  length: 1,
  convRule: rule23
}, {
  start: 398,
  length: 1,
  convRule: rule32
}, {
  start: 399,
  length: 1,
  convRule: rule33
}, {
  start: 400,
  length: 1,
  convRule: rule34
}, {
  start: 401,
  length: 1,
  convRule: rule22
}, {
  start: 402,
  length: 1,
  convRule: rule23
}, {
  start: 403,
  length: 1,
  convRule: rule31
}, {
  start: 404,
  length: 1,
  convRule: rule35
}, {
  start: 405,
  length: 1,
  convRule: rule36
}, {
  start: 406,
  length: 1,
  convRule: rule37
}, {
  start: 407,
  length: 1,
  convRule: rule38
}, {
  start: 408,
  length: 1,
  convRule: rule22
}, {
  start: 409,
  length: 1,
  convRule: rule23
}, {
  start: 410,
  length: 1,
  convRule: rule39
}, {
  start: 412,
  length: 1,
  convRule: rule37
}, {
  start: 413,
  length: 1,
  convRule: rule40
}, {
  start: 414,
  length: 1,
  convRule: rule41
}, {
  start: 415,
  length: 1,
  convRule: rule42
}, {
  start: 416,
  length: 1,
  convRule: rule22
}, {
  start: 417,
  length: 1,
  convRule: rule23
}, {
  start: 418,
  length: 1,
  convRule: rule22
}, {
  start: 419,
  length: 1,
  convRule: rule23
}, {
  start: 420,
  length: 1,
  convRule: rule22
}, {
  start: 421,
  length: 1,
  convRule: rule23
}, {
  start: 422,
  length: 1,
  convRule: rule43
}, {
  start: 423,
  length: 1,
  convRule: rule22
}, {
  start: 424,
  length: 1,
  convRule: rule23
}, {
  start: 425,
  length: 1,
  convRule: rule43
}, {
  start: 428,
  length: 1,
  convRule: rule22
}, {
  start: 429,
  length: 1,
  convRule: rule23
}, {
  start: 430,
  length: 1,
  convRule: rule43
}, {
  start: 431,
  length: 1,
  convRule: rule22
}, {
  start: 432,
  length: 1,
  convRule: rule23
}, {
  start: 433,
  length: 2,
  convRule: rule44
}, {
  start: 435,
  length: 1,
  convRule: rule22
}, {
  start: 436,
  length: 1,
  convRule: rule23
}, {
  start: 437,
  length: 1,
  convRule: rule22
}, {
  start: 438,
  length: 1,
  convRule: rule23
}, {
  start: 439,
  length: 1,
  convRule: rule45
}, {
  start: 440,
  length: 1,
  convRule: rule22
}, {
  start: 441,
  length: 1,
  convRule: rule23
}, {
  start: 444,
  length: 1,
  convRule: rule22
}, {
  start: 445,
  length: 1,
  convRule: rule23
}, {
  start: 447,
  length: 1,
  convRule: rule46
}, {
  start: 452,
  length: 1,
  convRule: rule47
}, {
  start: 453,
  length: 1,
  convRule: rule48
}, {
  start: 454,
  length: 1,
  convRule: rule49
}, {
  start: 455,
  length: 1,
  convRule: rule47
}, {
  start: 456,
  length: 1,
  convRule: rule48
}, {
  start: 457,
  length: 1,
  convRule: rule49
}, {
  start: 458,
  length: 1,
  convRule: rule47
}, {
  start: 459,
  length: 1,
  convRule: rule48
}, {
  start: 460,
  length: 1,
  convRule: rule49
}, {
  start: 461,
  length: 1,
  convRule: rule22
}, {
  start: 462,
  length: 1,
  convRule: rule23
}, {
  start: 463,
  length: 1,
  convRule: rule22
}, {
  start: 464,
  length: 1,
  convRule: rule23
}, {
  start: 465,
  length: 1,
  convRule: rule22
}, {
  start: 466,
  length: 1,
  convRule: rule23
}, {
  start: 467,
  length: 1,
  convRule: rule22
}, {
  start: 468,
  length: 1,
  convRule: rule23
}, {
  start: 469,
  length: 1,
  convRule: rule22
}, {
  start: 470,
  length: 1,
  convRule: rule23
}, {
  start: 471,
  length: 1,
  convRule: rule22
}, {
  start: 472,
  length: 1,
  convRule: rule23
}, {
  start: 473,
  length: 1,
  convRule: rule22
}, {
  start: 474,
  length: 1,
  convRule: rule23
}, {
  start: 475,
  length: 1,
  convRule: rule22
}, {
  start: 476,
  length: 1,
  convRule: rule23
}, {
  start: 477,
  length: 1,
  convRule: rule50
}, {
  start: 478,
  length: 1,
  convRule: rule22
}, {
  start: 479,
  length: 1,
  convRule: rule23
}, {
  start: 480,
  length: 1,
  convRule: rule22
}, {
  start: 481,
  length: 1,
  convRule: rule23
}, {
  start: 482,
  length: 1,
  convRule: rule22
}, {
  start: 483,
  length: 1,
  convRule: rule23
}, {
  start: 484,
  length: 1,
  convRule: rule22
}, {
  start: 485,
  length: 1,
  convRule: rule23
}, {
  start: 486,
  length: 1,
  convRule: rule22
}, {
  start: 487,
  length: 1,
  convRule: rule23
}, {
  start: 488,
  length: 1,
  convRule: rule22
}, {
  start: 489,
  length: 1,
  convRule: rule23
}, {
  start: 490,
  length: 1,
  convRule: rule22
}, {
  start: 491,
  length: 1,
  convRule: rule23
}, {
  start: 492,
  length: 1,
  convRule: rule22
}, {
  start: 493,
  length: 1,
  convRule: rule23
}, {
  start: 494,
  length: 1,
  convRule: rule22
}, {
  start: 495,
  length: 1,
  convRule: rule23
}, {
  start: 497,
  length: 1,
  convRule: rule47
}, {
  start: 498,
  length: 1,
  convRule: rule48
}, {
  start: 499,
  length: 1,
  convRule: rule49
}, {
  start: 500,
  length: 1,
  convRule: rule22
}, {
  start: 501,
  length: 1,
  convRule: rule23
}, {
  start: 502,
  length: 1,
  convRule: rule51
}, {
  start: 503,
  length: 1,
  convRule: rule52
}, {
  start: 504,
  length: 1,
  convRule: rule22
}, {
  start: 505,
  length: 1,
  convRule: rule23
}, {
  start: 506,
  length: 1,
  convRule: rule22
}, {
  start: 507,
  length: 1,
  convRule: rule23
}, {
  start: 508,
  length: 1,
  convRule: rule22
}, {
  start: 509,
  length: 1,
  convRule: rule23
}, {
  start: 510,
  length: 1,
  convRule: rule22
}, {
  start: 511,
  length: 1,
  convRule: rule23
}, {
  start: 512,
  length: 1,
  convRule: rule22
}, {
  start: 513,
  length: 1,
  convRule: rule23
}, {
  start: 514,
  length: 1,
  convRule: rule22
}, {
  start: 515,
  length: 1,
  convRule: rule23
}, {
  start: 516,
  length: 1,
  convRule: rule22
}, {
  start: 517,
  length: 1,
  convRule: rule23
}, {
  start: 518,
  length: 1,
  convRule: rule22
}, {
  start: 519,
  length: 1,
  convRule: rule23
}, {
  start: 520,
  length: 1,
  convRule: rule22
}, {
  start: 521,
  length: 1,
  convRule: rule23
}, {
  start: 522,
  length: 1,
  convRule: rule22
}, {
  start: 523,
  length: 1,
  convRule: rule23
}, {
  start: 524,
  length: 1,
  convRule: rule22
}, {
  start: 525,
  length: 1,
  convRule: rule23
}, {
  start: 526,
  length: 1,
  convRule: rule22
}, {
  start: 527,
  length: 1,
  convRule: rule23
}, {
  start: 528,
  length: 1,
  convRule: rule22
}, {
  start: 529,
  length: 1,
  convRule: rule23
}, {
  start: 530,
  length: 1,
  convRule: rule22
}, {
  start: 531,
  length: 1,
  convRule: rule23
}, {
  start: 532,
  length: 1,
  convRule: rule22
}, {
  start: 533,
  length: 1,
  convRule: rule23
}, {
  start: 534,
  length: 1,
  convRule: rule22
}, {
  start: 535,
  length: 1,
  convRule: rule23
}, {
  start: 536,
  length: 1,
  convRule: rule22
}, {
  start: 537,
  length: 1,
  convRule: rule23
}, {
  start: 538,
  length: 1,
  convRule: rule22
}, {
  start: 539,
  length: 1,
  convRule: rule23
}, {
  start: 540,
  length: 1,
  convRule: rule22
}, {
  start: 541,
  length: 1,
  convRule: rule23
}, {
  start: 542,
  length: 1,
  convRule: rule22
}, {
  start: 543,
  length: 1,
  convRule: rule23
}, {
  start: 544,
  length: 1,
  convRule: rule53
}, {
  start: 546,
  length: 1,
  convRule: rule22
}, {
  start: 547,
  length: 1,
  convRule: rule23
}, {
  start: 548,
  length: 1,
  convRule: rule22
}, {
  start: 549,
  length: 1,
  convRule: rule23
}, {
  start: 550,
  length: 1,
  convRule: rule22
}, {
  start: 551,
  length: 1,
  convRule: rule23
}, {
  start: 552,
  length: 1,
  convRule: rule22
}, {
  start: 553,
  length: 1,
  convRule: rule23
}, {
  start: 554,
  length: 1,
  convRule: rule22
}, {
  start: 555,
  length: 1,
  convRule: rule23
}, {
  start: 556,
  length: 1,
  convRule: rule22
}, {
  start: 557,
  length: 1,
  convRule: rule23
}, {
  start: 558,
  length: 1,
  convRule: rule22
}, {
  start: 559,
  length: 1,
  convRule: rule23
}, {
  start: 560,
  length: 1,
  convRule: rule22
}, {
  start: 561,
  length: 1,
  convRule: rule23
}, {
  start: 562,
  length: 1,
  convRule: rule22
}, {
  start: 563,
  length: 1,
  convRule: rule23
}, {
  start: 570,
  length: 1,
  convRule: rule54
}, {
  start: 571,
  length: 1,
  convRule: rule22
}, {
  start: 572,
  length: 1,
  convRule: rule23
}, {
  start: 573,
  length: 1,
  convRule: rule55
}, {
  start: 574,
  length: 1,
  convRule: rule56
}, {
  start: 575,
  length: 2,
  convRule: rule57
}, {
  start: 577,
  length: 1,
  convRule: rule22
}, {
  start: 578,
  length: 1,
  convRule: rule23
}, {
  start: 579,
  length: 1,
  convRule: rule58
}, {
  start: 580,
  length: 1,
  convRule: rule59
}, {
  start: 581,
  length: 1,
  convRule: rule60
}, {
  start: 582,
  length: 1,
  convRule: rule22
}, {
  start: 583,
  length: 1,
  convRule: rule23
}, {
  start: 584,
  length: 1,
  convRule: rule22
}, {
  start: 585,
  length: 1,
  convRule: rule23
}, {
  start: 586,
  length: 1,
  convRule: rule22
}, {
  start: 587,
  length: 1,
  convRule: rule23
}, {
  start: 588,
  length: 1,
  convRule: rule22
}, {
  start: 589,
  length: 1,
  convRule: rule23
}, {
  start: 590,
  length: 1,
  convRule: rule22
}, {
  start: 591,
  length: 1,
  convRule: rule23
}, {
  start: 592,
  length: 1,
  convRule: rule61
}, {
  start: 593,
  length: 1,
  convRule: rule62
}, {
  start: 594,
  length: 1,
  convRule: rule63
}, {
  start: 595,
  length: 1,
  convRule: rule64
}, {
  start: 596,
  length: 1,
  convRule: rule65
}, {
  start: 598,
  length: 2,
  convRule: rule66
}, {
  start: 601,
  length: 1,
  convRule: rule67
}, {
  start: 603,
  length: 1,
  convRule: rule68
}, {
  start: 604,
  length: 1,
  convRule: rule69
}, {
  start: 608,
  length: 1,
  convRule: rule66
}, {
  start: 609,
  length: 1,
  convRule: rule70
}, {
  start: 611,
  length: 1,
  convRule: rule71
}, {
  start: 613,
  length: 1,
  convRule: rule72
}, {
  start: 614,
  length: 1,
  convRule: rule73
}, {
  start: 616,
  length: 1,
  convRule: rule74
}, {
  start: 617,
  length: 1,
  convRule: rule75
}, {
  start: 618,
  length: 1,
  convRule: rule73
}, {
  start: 619,
  length: 1,
  convRule: rule76
}, {
  start: 620,
  length: 1,
  convRule: rule77
}, {
  start: 623,
  length: 1,
  convRule: rule75
}, {
  start: 625,
  length: 1,
  convRule: rule78
}, {
  start: 626,
  length: 1,
  convRule: rule79
}, {
  start: 629,
  length: 1,
  convRule: rule80
}, {
  start: 637,
  length: 1,
  convRule: rule81
}, {
  start: 640,
  length: 1,
  convRule: rule82
}, {
  start: 642,
  length: 1,
  convRule: rule83
}, {
  start: 643,
  length: 1,
  convRule: rule82
}, {
  start: 647,
  length: 1,
  convRule: rule84
}, {
  start: 648,
  length: 1,
  convRule: rule82
}, {
  start: 649,
  length: 1,
  convRule: rule85
}, {
  start: 650,
  length: 2,
  convRule: rule86
}, {
  start: 652,
  length: 1,
  convRule: rule87
}, {
  start: 658,
  length: 1,
  convRule: rule88
}, {
  start: 669,
  length: 1,
  convRule: rule89
}, {
  start: 670,
  length: 1,
  convRule: rule90
}, {
  start: 837,
  length: 1,
  convRule: rule93
}, {
  start: 880,
  length: 1,
  convRule: rule22
}, {
  start: 881,
  length: 1,
  convRule: rule23
}, {
  start: 882,
  length: 1,
  convRule: rule22
}, {
  start: 883,
  length: 1,
  convRule: rule23
}, {
  start: 886,
  length: 1,
  convRule: rule22
}, {
  start: 887,
  length: 1,
  convRule: rule23
}, {
  start: 891,
  length: 3,
  convRule: rule41
}, {
  start: 895,
  length: 1,
  convRule: rule94
}, {
  start: 902,
  length: 1,
  convRule: rule95
}, {
  start: 904,
  length: 3,
  convRule: rule96
}, {
  start: 908,
  length: 1,
  convRule: rule97
}, {
  start: 910,
  length: 2,
  convRule: rule98
}, {
  start: 913,
  length: 17,
  convRule: rule9
}, {
  start: 931,
  length: 9,
  convRule: rule9
}, {
  start: 940,
  length: 1,
  convRule: rule99
}, {
  start: 941,
  length: 3,
  convRule: rule100
}, {
  start: 945,
  length: 17,
  convRule: rule12
}, {
  start: 962,
  length: 1,
  convRule: rule101
}, {
  start: 963,
  length: 9,
  convRule: rule12
}, {
  start: 972,
  length: 1,
  convRule: rule102
}, {
  start: 973,
  length: 2,
  convRule: rule103
}, {
  start: 975,
  length: 1,
  convRule: rule104
}, {
  start: 976,
  length: 1,
  convRule: rule105
}, {
  start: 977,
  length: 1,
  convRule: rule106
}, {
  start: 981,
  length: 1,
  convRule: rule108
}, {
  start: 982,
  length: 1,
  convRule: rule109
}, {
  start: 983,
  length: 1,
  convRule: rule110
}, {
  start: 984,
  length: 1,
  convRule: rule22
}, {
  start: 985,
  length: 1,
  convRule: rule23
}, {
  start: 986,
  length: 1,
  convRule: rule22
}, {
  start: 987,
  length: 1,
  convRule: rule23
}, {
  start: 988,
  length: 1,
  convRule: rule22
}, {
  start: 989,
  length: 1,
  convRule: rule23
}, {
  start: 990,
  length: 1,
  convRule: rule22
}, {
  start: 991,
  length: 1,
  convRule: rule23
}, {
  start: 992,
  length: 1,
  convRule: rule22
}, {
  start: 993,
  length: 1,
  convRule: rule23
}, {
  start: 994,
  length: 1,
  convRule: rule22
}, {
  start: 995,
  length: 1,
  convRule: rule23
}, {
  start: 996,
  length: 1,
  convRule: rule22
}, {
  start: 997,
  length: 1,
  convRule: rule23
}, {
  start: 998,
  length: 1,
  convRule: rule22
}, {
  start: 999,
  length: 1,
  convRule: rule23
}, {
  start: 1e3,
  length: 1,
  convRule: rule22
}, {
  start: 1001,
  length: 1,
  convRule: rule23
}, {
  start: 1002,
  length: 1,
  convRule: rule22
}, {
  start: 1003,
  length: 1,
  convRule: rule23
}, {
  start: 1004,
  length: 1,
  convRule: rule22
}, {
  start: 1005,
  length: 1,
  convRule: rule23
}, {
  start: 1006,
  length: 1,
  convRule: rule22
}, {
  start: 1007,
  length: 1,
  convRule: rule23
}, {
  start: 1008,
  length: 1,
  convRule: rule111
}, {
  start: 1009,
  length: 1,
  convRule: rule112
}, {
  start: 1010,
  length: 1,
  convRule: rule113
}, {
  start: 1011,
  length: 1,
  convRule: rule114
}, {
  start: 1012,
  length: 1,
  convRule: rule115
}, {
  start: 1013,
  length: 1,
  convRule: rule116
}, {
  start: 1015,
  length: 1,
  convRule: rule22
}, {
  start: 1016,
  length: 1,
  convRule: rule23
}, {
  start: 1017,
  length: 1,
  convRule: rule117
}, {
  start: 1018,
  length: 1,
  convRule: rule22
}, {
  start: 1019,
  length: 1,
  convRule: rule23
}, {
  start: 1021,
  length: 3,
  convRule: rule53
}, {
  start: 1024,
  length: 16,
  convRule: rule118
}, {
  start: 1040,
  length: 32,
  convRule: rule9
}, {
  start: 1072,
  length: 32,
  convRule: rule12
}, {
  start: 1104,
  length: 16,
  convRule: rule112
}, {
  start: 1120,
  length: 1,
  convRule: rule22
}, {
  start: 1121,
  length: 1,
  convRule: rule23
}, {
  start: 1122,
  length: 1,
  convRule: rule22
}, {
  start: 1123,
  length: 1,
  convRule: rule23
}, {
  start: 1124,
  length: 1,
  convRule: rule22
}, {
  start: 1125,
  length: 1,
  convRule: rule23
}, {
  start: 1126,
  length: 1,
  convRule: rule22
}, {
  start: 1127,
  length: 1,
  convRule: rule23
}, {
  start: 1128,
  length: 1,
  convRule: rule22
}, {
  start: 1129,
  length: 1,
  convRule: rule23
}, {
  start: 1130,
  length: 1,
  convRule: rule22
}, {
  start: 1131,
  length: 1,
  convRule: rule23
}, {
  start: 1132,
  length: 1,
  convRule: rule22
}, {
  start: 1133,
  length: 1,
  convRule: rule23
}, {
  start: 1134,
  length: 1,
  convRule: rule22
}, {
  start: 1135,
  length: 1,
  convRule: rule23
}, {
  start: 1136,
  length: 1,
  convRule: rule22
}, {
  start: 1137,
  length: 1,
  convRule: rule23
}, {
  start: 1138,
  length: 1,
  convRule: rule22
}, {
  start: 1139,
  length: 1,
  convRule: rule23
}, {
  start: 1140,
  length: 1,
  convRule: rule22
}, {
  start: 1141,
  length: 1,
  convRule: rule23
}, {
  start: 1142,
  length: 1,
  convRule: rule22
}, {
  start: 1143,
  length: 1,
  convRule: rule23
}, {
  start: 1144,
  length: 1,
  convRule: rule22
}, {
  start: 1145,
  length: 1,
  convRule: rule23
}, {
  start: 1146,
  length: 1,
  convRule: rule22
}, {
  start: 1147,
  length: 1,
  convRule: rule23
}, {
  start: 1148,
  length: 1,
  convRule: rule22
}, {
  start: 1149,
  length: 1,
  convRule: rule23
}, {
  start: 1150,
  length: 1,
  convRule: rule22
}, {
  start: 1151,
  length: 1,
  convRule: rule23
}, {
  start: 1152,
  length: 1,
  convRule: rule22
}, {
  start: 1153,
  length: 1,
  convRule: rule23
}, {
  start: 1162,
  length: 1,
  convRule: rule22
}, {
  start: 1163,
  length: 1,
  convRule: rule23
}, {
  start: 1164,
  length: 1,
  convRule: rule22
}, {
  start: 1165,
  length: 1,
  convRule: rule23
}, {
  start: 1166,
  length: 1,
  convRule: rule22
}, {
  start: 1167,
  length: 1,
  convRule: rule23
}, {
  start: 1168,
  length: 1,
  convRule: rule22
}, {
  start: 1169,
  length: 1,
  convRule: rule23
}, {
  start: 1170,
  length: 1,
  convRule: rule22
}, {
  start: 1171,
  length: 1,
  convRule: rule23
}, {
  start: 1172,
  length: 1,
  convRule: rule22
}, {
  start: 1173,
  length: 1,
  convRule: rule23
}, {
  start: 1174,
  length: 1,
  convRule: rule22
}, {
  start: 1175,
  length: 1,
  convRule: rule23
}, {
  start: 1176,
  length: 1,
  convRule: rule22
}, {
  start: 1177,
  length: 1,
  convRule: rule23
}, {
  start: 1178,
  length: 1,
  convRule: rule22
}, {
  start: 1179,
  length: 1,
  convRule: rule23
}, {
  start: 1180,
  length: 1,
  convRule: rule22
}, {
  start: 1181,
  length: 1,
  convRule: rule23
}, {
  start: 1182,
  length: 1,
  convRule: rule22
}, {
  start: 1183,
  length: 1,
  convRule: rule23
}, {
  start: 1184,
  length: 1,
  convRule: rule22
}, {
  start: 1185,
  length: 1,
  convRule: rule23
}, {
  start: 1186,
  length: 1,
  convRule: rule22
}, {
  start: 1187,
  length: 1,
  convRule: rule23
}, {
  start: 1188,
  length: 1,
  convRule: rule22
}, {
  start: 1189,
  length: 1,
  convRule: rule23
}, {
  start: 1190,
  length: 1,
  convRule: rule22
}, {
  start: 1191,
  length: 1,
  convRule: rule23
}, {
  start: 1192,
  length: 1,
  convRule: rule22
}, {
  start: 1193,
  length: 1,
  convRule: rule23
}, {
  start: 1194,
  length: 1,
  convRule: rule22
}, {
  start: 1195,
  length: 1,
  convRule: rule23
}, {
  start: 1196,
  length: 1,
  convRule: rule22
}, {
  start: 1197,
  length: 1,
  convRule: rule23
}, {
  start: 1198,
  length: 1,
  convRule: rule22
}, {
  start: 1199,
  length: 1,
  convRule: rule23
}, {
  start: 1200,
  length: 1,
  convRule: rule22
}, {
  start: 1201,
  length: 1,
  convRule: rule23
}, {
  start: 1202,
  length: 1,
  convRule: rule22
}, {
  start: 1203,
  length: 1,
  convRule: rule23
}, {
  start: 1204,
  length: 1,
  convRule: rule22
}, {
  start: 1205,
  length: 1,
  convRule: rule23
}, {
  start: 1206,
  length: 1,
  convRule: rule22
}, {
  start: 1207,
  length: 1,
  convRule: rule23
}, {
  start: 1208,
  length: 1,
  convRule: rule22
}, {
  start: 1209,
  length: 1,
  convRule: rule23
}, {
  start: 1210,
  length: 1,
  convRule: rule22
}, {
  start: 1211,
  length: 1,
  convRule: rule23
}, {
  start: 1212,
  length: 1,
  convRule: rule22
}, {
  start: 1213,
  length: 1,
  convRule: rule23
}, {
  start: 1214,
  length: 1,
  convRule: rule22
}, {
  start: 1215,
  length: 1,
  convRule: rule23
}, {
  start: 1216,
  length: 1,
  convRule: rule120
}, {
  start: 1217,
  length: 1,
  convRule: rule22
}, {
  start: 1218,
  length: 1,
  convRule: rule23
}, {
  start: 1219,
  length: 1,
  convRule: rule22
}, {
  start: 1220,
  length: 1,
  convRule: rule23
}, {
  start: 1221,
  length: 1,
  convRule: rule22
}, {
  start: 1222,
  length: 1,
  convRule: rule23
}, {
  start: 1223,
  length: 1,
  convRule: rule22
}, {
  start: 1224,
  length: 1,
  convRule: rule23
}, {
  start: 1225,
  length: 1,
  convRule: rule22
}, {
  start: 1226,
  length: 1,
  convRule: rule23
}, {
  start: 1227,
  length: 1,
  convRule: rule22
}, {
  start: 1228,
  length: 1,
  convRule: rule23
}, {
  start: 1229,
  length: 1,
  convRule: rule22
}, {
  start: 1230,
  length: 1,
  convRule: rule23
}, {
  start: 1231,
  length: 1,
  convRule: rule121
}, {
  start: 1232,
  length: 1,
  convRule: rule22
}, {
  start: 1233,
  length: 1,
  convRule: rule23
}, {
  start: 1234,
  length: 1,
  convRule: rule22
}, {
  start: 1235,
  length: 1,
  convRule: rule23
}, {
  start: 1236,
  length: 1,
  convRule: rule22
}, {
  start: 1237,
  length: 1,
  convRule: rule23
}, {
  start: 1238,
  length: 1,
  convRule: rule22
}, {
  start: 1239,
  length: 1,
  convRule: rule23
}, {
  start: 1240,
  length: 1,
  convRule: rule22
}, {
  start: 1241,
  length: 1,
  convRule: rule23
}, {
  start: 1242,
  length: 1,
  convRule: rule22
}, {
  start: 1243,
  length: 1,
  convRule: rule23
}, {
  start: 1244,
  length: 1,
  convRule: rule22
}, {
  start: 1245,
  length: 1,
  convRule: rule23
}, {
  start: 1246,
  length: 1,
  convRule: rule22
}, {
  start: 1247,
  length: 1,
  convRule: rule23
}, {
  start: 1248,
  length: 1,
  convRule: rule22
}, {
  start: 1249,
  length: 1,
  convRule: rule23
}, {
  start: 1250,
  length: 1,
  convRule: rule22
}, {
  start: 1251,
  length: 1,
  convRule: rule23
}, {
  start: 1252,
  length: 1,
  convRule: rule22
}, {
  start: 1253,
  length: 1,
  convRule: rule23
}, {
  start: 1254,
  length: 1,
  convRule: rule22
}, {
  start: 1255,
  length: 1,
  convRule: rule23
}, {
  start: 1256,
  length: 1,
  convRule: rule22
}, {
  start: 1257,
  length: 1,
  convRule: rule23
}, {
  start: 1258,
  length: 1,
  convRule: rule22
}, {
  start: 1259,
  length: 1,
  convRule: rule23
}, {
  start: 1260,
  length: 1,
  convRule: rule22
}, {
  start: 1261,
  length: 1,
  convRule: rule23
}, {
  start: 1262,
  length: 1,
  convRule: rule22
}, {
  start: 1263,
  length: 1,
  convRule: rule23
}, {
  start: 1264,
  length: 1,
  convRule: rule22
}, {
  start: 1265,
  length: 1,
  convRule: rule23
}, {
  start: 1266,
  length: 1,
  convRule: rule22
}, {
  start: 1267,
  length: 1,
  convRule: rule23
}, {
  start: 1268,
  length: 1,
  convRule: rule22
}, {
  start: 1269,
  length: 1,
  convRule: rule23
}, {
  start: 1270,
  length: 1,
  convRule: rule22
}, {
  start: 1271,
  length: 1,
  convRule: rule23
}, {
  start: 1272,
  length: 1,
  convRule: rule22
}, {
  start: 1273,
  length: 1,
  convRule: rule23
}, {
  start: 1274,
  length: 1,
  convRule: rule22
}, {
  start: 1275,
  length: 1,
  convRule: rule23
}, {
  start: 1276,
  length: 1,
  convRule: rule22
}, {
  start: 1277,
  length: 1,
  convRule: rule23
}, {
  start: 1278,
  length: 1,
  convRule: rule22
}, {
  start: 1279,
  length: 1,
  convRule: rule23
}, {
  start: 1280,
  length: 1,
  convRule: rule22
}, {
  start: 1281,
  length: 1,
  convRule: rule23
}, {
  start: 1282,
  length: 1,
  convRule: rule22
}, {
  start: 1283,
  length: 1,
  convRule: rule23
}, {
  start: 1284,
  length: 1,
  convRule: rule22
}, {
  start: 1285,
  length: 1,
  convRule: rule23
}, {
  start: 1286,
  length: 1,
  convRule: rule22
}, {
  start: 1287,
  length: 1,
  convRule: rule23
}, {
  start: 1288,
  length: 1,
  convRule: rule22
}, {
  start: 1289,
  length: 1,
  convRule: rule23
}, {
  start: 1290,
  length: 1,
  convRule: rule22
}, {
  start: 1291,
  length: 1,
  convRule: rule23
}, {
  start: 1292,
  length: 1,
  convRule: rule22
}, {
  start: 1293,
  length: 1,
  convRule: rule23
}, {
  start: 1294,
  length: 1,
  convRule: rule22
}, {
  start: 1295,
  length: 1,
  convRule: rule23
}, {
  start: 1296,
  length: 1,
  convRule: rule22
}, {
  start: 1297,
  length: 1,
  convRule: rule23
}, {
  start: 1298,
  length: 1,
  convRule: rule22
}, {
  start: 1299,
  length: 1,
  convRule: rule23
}, {
  start: 1300,
  length: 1,
  convRule: rule22
}, {
  start: 1301,
  length: 1,
  convRule: rule23
}, {
  start: 1302,
  length: 1,
  convRule: rule22
}, {
  start: 1303,
  length: 1,
  convRule: rule23
}, {
  start: 1304,
  length: 1,
  convRule: rule22
}, {
  start: 1305,
  length: 1,
  convRule: rule23
}, {
  start: 1306,
  length: 1,
  convRule: rule22
}, {
  start: 1307,
  length: 1,
  convRule: rule23
}, {
  start: 1308,
  length: 1,
  convRule: rule22
}, {
  start: 1309,
  length: 1,
  convRule: rule23
}, {
  start: 1310,
  length: 1,
  convRule: rule22
}, {
  start: 1311,
  length: 1,
  convRule: rule23
}, {
  start: 1312,
  length: 1,
  convRule: rule22
}, {
  start: 1313,
  length: 1,
  convRule: rule23
}, {
  start: 1314,
  length: 1,
  convRule: rule22
}, {
  start: 1315,
  length: 1,
  convRule: rule23
}, {
  start: 1316,
  length: 1,
  convRule: rule22
}, {
  start: 1317,
  length: 1,
  convRule: rule23
}, {
  start: 1318,
  length: 1,
  convRule: rule22
}, {
  start: 1319,
  length: 1,
  convRule: rule23
}, {
  start: 1320,
  length: 1,
  convRule: rule22
}, {
  start: 1321,
  length: 1,
  convRule: rule23
}, {
  start: 1322,
  length: 1,
  convRule: rule22
}, {
  start: 1323,
  length: 1,
  convRule: rule23
}, {
  start: 1324,
  length: 1,
  convRule: rule22
}, {
  start: 1325,
  length: 1,
  convRule: rule23
}, {
  start: 1326,
  length: 1,
  convRule: rule22
}, {
  start: 1327,
  length: 1,
  convRule: rule23
}, {
  start: 1329,
  length: 38,
  convRule: rule122
}, {
  start: 1377,
  length: 38,
  convRule: rule123
}, {
  start: 4256,
  length: 38,
  convRule: rule125
}, {
  start: 4295,
  length: 1,
  convRule: rule125
}, {
  start: 4301,
  length: 1,
  convRule: rule125
}, {
  start: 4304,
  length: 43,
  convRule: rule126
}, {
  start: 4349,
  length: 3,
  convRule: rule126
}, {
  start: 5024,
  length: 80,
  convRule: rule127
}, {
  start: 5104,
  length: 6,
  convRule: rule104
}, {
  start: 5112,
  length: 6,
  convRule: rule110
}, {
  start: 7296,
  length: 1,
  convRule: rule129
}, {
  start: 7297,
  length: 1,
  convRule: rule130
}, {
  start: 7298,
  length: 1,
  convRule: rule131
}, {
  start: 7299,
  length: 2,
  convRule: rule132
}, {
  start: 7301,
  length: 1,
  convRule: rule133
}, {
  start: 7302,
  length: 1,
  convRule: rule134
}, {
  start: 7303,
  length: 1,
  convRule: rule135
}, {
  start: 7304,
  length: 1,
  convRule: rule136
}, {
  start: 7312,
  length: 43,
  convRule: rule137
}, {
  start: 7357,
  length: 3,
  convRule: rule137
}, {
  start: 7545,
  length: 1,
  convRule: rule138
}, {
  start: 7549,
  length: 1,
  convRule: rule139
}, {
  start: 7566,
  length: 1,
  convRule: rule140
}, {
  start: 7680,
  length: 1,
  convRule: rule22
}, {
  start: 7681,
  length: 1,
  convRule: rule23
}, {
  start: 7682,
  length: 1,
  convRule: rule22
}, {
  start: 7683,
  length: 1,
  convRule: rule23
}, {
  start: 7684,
  length: 1,
  convRule: rule22
}, {
  start: 7685,
  length: 1,
  convRule: rule23
}, {
  start: 7686,
  length: 1,
  convRule: rule22
}, {
  start: 7687,
  length: 1,
  convRule: rule23
}, {
  start: 7688,
  length: 1,
  convRule: rule22
}, {
  start: 7689,
  length: 1,
  convRule: rule23
}, {
  start: 7690,
  length: 1,
  convRule: rule22
}, {
  start: 7691,
  length: 1,
  convRule: rule23
}, {
  start: 7692,
  length: 1,
  convRule: rule22
}, {
  start: 7693,
  length: 1,
  convRule: rule23
}, {
  start: 7694,
  length: 1,
  convRule: rule22
}, {
  start: 7695,
  length: 1,
  convRule: rule23
}, {
  start: 7696,
  length: 1,
  convRule: rule22
}, {
  start: 7697,
  length: 1,
  convRule: rule23
}, {
  start: 7698,
  length: 1,
  convRule: rule22
}, {
  start: 7699,
  length: 1,
  convRule: rule23
}, {
  start: 7700,
  length: 1,
  convRule: rule22
}, {
  start: 7701,
  length: 1,
  convRule: rule23
}, {
  start: 7702,
  length: 1,
  convRule: rule22
}, {
  start: 7703,
  length: 1,
  convRule: rule23
}, {
  start: 7704,
  length: 1,
  convRule: rule22
}, {
  start: 7705,
  length: 1,
  convRule: rule23
}, {
  start: 7706,
  length: 1,
  convRule: rule22
}, {
  start: 7707,
  length: 1,
  convRule: rule23
}, {
  start: 7708,
  length: 1,
  convRule: rule22
}, {
  start: 7709,
  length: 1,
  convRule: rule23
}, {
  start: 7710,
  length: 1,
  convRule: rule22
}, {
  start: 7711,
  length: 1,
  convRule: rule23
}, {
  start: 7712,
  length: 1,
  convRule: rule22
}, {
  start: 7713,
  length: 1,
  convRule: rule23
}, {
  start: 7714,
  length: 1,
  convRule: rule22
}, {
  start: 7715,
  length: 1,
  convRule: rule23
}, {
  start: 7716,
  length: 1,
  convRule: rule22
}, {
  start: 7717,
  length: 1,
  convRule: rule23
}, {
  start: 7718,
  length: 1,
  convRule: rule22
}, {
  start: 7719,
  length: 1,
  convRule: rule23
}, {
  start: 7720,
  length: 1,
  convRule: rule22
}, {
  start: 7721,
  length: 1,
  convRule: rule23
}, {
  start: 7722,
  length: 1,
  convRule: rule22
}, {
  start: 7723,
  length: 1,
  convRule: rule23
}, {
  start: 7724,
  length: 1,
  convRule: rule22
}, {
  start: 7725,
  length: 1,
  convRule: rule23
}, {
  start: 7726,
  length: 1,
  convRule: rule22
}, {
  start: 7727,
  length: 1,
  convRule: rule23
}, {
  start: 7728,
  length: 1,
  convRule: rule22
}, {
  start: 7729,
  length: 1,
  convRule: rule23
}, {
  start: 7730,
  length: 1,
  convRule: rule22
}, {
  start: 7731,
  length: 1,
  convRule: rule23
}, {
  start: 7732,
  length: 1,
  convRule: rule22
}, {
  start: 7733,
  length: 1,
  convRule: rule23
}, {
  start: 7734,
  length: 1,
  convRule: rule22
}, {
  start: 7735,
  length: 1,
  convRule: rule23
}, {
  start: 7736,
  length: 1,
  convRule: rule22
}, {
  start: 7737,
  length: 1,
  convRule: rule23
}, {
  start: 7738,
  length: 1,
  convRule: rule22
}, {
  start: 7739,
  length: 1,
  convRule: rule23
}, {
  start: 7740,
  length: 1,
  convRule: rule22
}, {
  start: 7741,
  length: 1,
  convRule: rule23
}, {
  start: 7742,
  length: 1,
  convRule: rule22
}, {
  start: 7743,
  length: 1,
  convRule: rule23
}, {
  start: 7744,
  length: 1,
  convRule: rule22
}, {
  start: 7745,
  length: 1,
  convRule: rule23
}, {
  start: 7746,
  length: 1,
  convRule: rule22
}, {
  start: 7747,
  length: 1,
  convRule: rule23
}, {
  start: 7748,
  length: 1,
  convRule: rule22
}, {
  start: 7749,
  length: 1,
  convRule: rule23
}, {
  start: 7750,
  length: 1,
  convRule: rule22
}, {
  start: 7751,
  length: 1,
  convRule: rule23
}, {
  start: 7752,
  length: 1,
  convRule: rule22
}, {
  start: 7753,
  length: 1,
  convRule: rule23
}, {
  start: 7754,
  length: 1,
  convRule: rule22
}, {
  start: 7755,
  length: 1,
  convRule: rule23
}, {
  start: 7756,
  length: 1,
  convRule: rule22
}, {
  start: 7757,
  length: 1,
  convRule: rule23
}, {
  start: 7758,
  length: 1,
  convRule: rule22
}, {
  start: 7759,
  length: 1,
  convRule: rule23
}, {
  start: 7760,
  length: 1,
  convRule: rule22
}, {
  start: 7761,
  length: 1,
  convRule: rule23
}, {
  start: 7762,
  length: 1,
  convRule: rule22
}, {
  start: 7763,
  length: 1,
  convRule: rule23
}, {
  start: 7764,
  length: 1,
  convRule: rule22
}, {
  start: 7765,
  length: 1,
  convRule: rule23
}, {
  start: 7766,
  length: 1,
  convRule: rule22
}, {
  start: 7767,
  length: 1,
  convRule: rule23
}, {
  start: 7768,
  length: 1,
  convRule: rule22
}, {
  start: 7769,
  length: 1,
  convRule: rule23
}, {
  start: 7770,
  length: 1,
  convRule: rule22
}, {
  start: 7771,
  length: 1,
  convRule: rule23
}, {
  start: 7772,
  length: 1,
  convRule: rule22
}, {
  start: 7773,
  length: 1,
  convRule: rule23
}, {
  start: 7774,
  length: 1,
  convRule: rule22
}, {
  start: 7775,
  length: 1,
  convRule: rule23
}, {
  start: 7776,
  length: 1,
  convRule: rule22
}, {
  start: 7777,
  length: 1,
  convRule: rule23
}, {
  start: 7778,
  length: 1,
  convRule: rule22
}, {
  start: 7779,
  length: 1,
  convRule: rule23
}, {
  start: 7780,
  length: 1,
  convRule: rule22
}, {
  start: 7781,
  length: 1,
  convRule: rule23
}, {
  start: 7782,
  length: 1,
  convRule: rule22
}, {
  start: 7783,
  length: 1,
  convRule: rule23
}, {
  start: 7784,
  length: 1,
  convRule: rule22
}, {
  start: 7785,
  length: 1,
  convRule: rule23
}, {
  start: 7786,
  length: 1,
  convRule: rule22
}, {
  start: 7787,
  length: 1,
  convRule: rule23
}, {
  start: 7788,
  length: 1,
  convRule: rule22
}, {
  start: 7789,
  length: 1,
  convRule: rule23
}, {
  start: 7790,
  length: 1,
  convRule: rule22
}, {
  start: 7791,
  length: 1,
  convRule: rule23
}, {
  start: 7792,
  length: 1,
  convRule: rule22
}, {
  start: 7793,
  length: 1,
  convRule: rule23
}, {
  start: 7794,
  length: 1,
  convRule: rule22
}, {
  start: 7795,
  length: 1,
  convRule: rule23
}, {
  start: 7796,
  length: 1,
  convRule: rule22
}, {
  start: 7797,
  length: 1,
  convRule: rule23
}, {
  start: 7798,
  length: 1,
  convRule: rule22
}, {
  start: 7799,
  length: 1,
  convRule: rule23
}, {
  start: 7800,
  length: 1,
  convRule: rule22
}, {
  start: 7801,
  length: 1,
  convRule: rule23
}, {
  start: 7802,
  length: 1,
  convRule: rule22
}, {
  start: 7803,
  length: 1,
  convRule: rule23
}, {
  start: 7804,
  length: 1,
  convRule: rule22
}, {
  start: 7805,
  length: 1,
  convRule: rule23
}, {
  start: 7806,
  length: 1,
  convRule: rule22
}, {
  start: 7807,
  length: 1,
  convRule: rule23
}, {
  start: 7808,
  length: 1,
  convRule: rule22
}, {
  start: 7809,
  length: 1,
  convRule: rule23
}, {
  start: 7810,
  length: 1,
  convRule: rule22
}, {
  start: 7811,
  length: 1,
  convRule: rule23
}, {
  start: 7812,
  length: 1,
  convRule: rule22
}, {
  start: 7813,
  length: 1,
  convRule: rule23
}, {
  start: 7814,
  length: 1,
  convRule: rule22
}, {
  start: 7815,
  length: 1,
  convRule: rule23
}, {
  start: 7816,
  length: 1,
  convRule: rule22
}, {
  start: 7817,
  length: 1,
  convRule: rule23
}, {
  start: 7818,
  length: 1,
  convRule: rule22
}, {
  start: 7819,
  length: 1,
  convRule: rule23
}, {
  start: 7820,
  length: 1,
  convRule: rule22
}, {
  start: 7821,
  length: 1,
  convRule: rule23
}, {
  start: 7822,
  length: 1,
  convRule: rule22
}, {
  start: 7823,
  length: 1,
  convRule: rule23
}, {
  start: 7824,
  length: 1,
  convRule: rule22
}, {
  start: 7825,
  length: 1,
  convRule: rule23
}, {
  start: 7826,
  length: 1,
  convRule: rule22
}, {
  start: 7827,
  length: 1,
  convRule: rule23
}, {
  start: 7828,
  length: 1,
  convRule: rule22
}, {
  start: 7829,
  length: 1,
  convRule: rule23
}, {
  start: 7835,
  length: 1,
  convRule: rule141
}, {
  start: 7838,
  length: 1,
  convRule: rule142
}, {
  start: 7840,
  length: 1,
  convRule: rule22
}, {
  start: 7841,
  length: 1,
  convRule: rule23
}, {
  start: 7842,
  length: 1,
  convRule: rule22
}, {
  start: 7843,
  length: 1,
  convRule: rule23
}, {
  start: 7844,
  length: 1,
  convRule: rule22
}, {
  start: 7845,
  length: 1,
  convRule: rule23
}, {
  start: 7846,
  length: 1,
  convRule: rule22
}, {
  start: 7847,
  length: 1,
  convRule: rule23
}, {
  start: 7848,
  length: 1,
  convRule: rule22
}, {
  start: 7849,
  length: 1,
  convRule: rule23
}, {
  start: 7850,
  length: 1,
  convRule: rule22
}, {
  start: 7851,
  length: 1,
  convRule: rule23
}, {
  start: 7852,
  length: 1,
  convRule: rule22
}, {
  start: 7853,
  length: 1,
  convRule: rule23
}, {
  start: 7854,
  length: 1,
  convRule: rule22
}, {
  start: 7855,
  length: 1,
  convRule: rule23
}, {
  start: 7856,
  length: 1,
  convRule: rule22
}, {
  start: 7857,
  length: 1,
  convRule: rule23
}, {
  start: 7858,
  length: 1,
  convRule: rule22
}, {
  start: 7859,
  length: 1,
  convRule: rule23
}, {
  start: 7860,
  length: 1,
  convRule: rule22
}, {
  start: 7861,
  length: 1,
  convRule: rule23
}, {
  start: 7862,
  length: 1,
  convRule: rule22
}, {
  start: 7863,
  length: 1,
  convRule: rule23
}, {
  start: 7864,
  length: 1,
  convRule: rule22
}, {
  start: 7865,
  length: 1,
  convRule: rule23
}, {
  start: 7866,
  length: 1,
  convRule: rule22
}, {
  start: 7867,
  length: 1,
  convRule: rule23
}, {
  start: 7868,
  length: 1,
  convRule: rule22
}, {
  start: 7869,
  length: 1,
  convRule: rule23
}, {
  start: 7870,
  length: 1,
  convRule: rule22
}, {
  start: 7871,
  length: 1,
  convRule: rule23
}, {
  start: 7872,
  length: 1,
  convRule: rule22
}, {
  start: 7873,
  length: 1,
  convRule: rule23
}, {
  start: 7874,
  length: 1,
  convRule: rule22
}, {
  start: 7875,
  length: 1,
  convRule: rule23
}, {
  start: 7876,
  length: 1,
  convRule: rule22
}, {
  start: 7877,
  length: 1,
  convRule: rule23
}, {
  start: 7878,
  length: 1,
  convRule: rule22
}, {
  start: 7879,
  length: 1,
  convRule: rule23
}, {
  start: 7880,
  length: 1,
  convRule: rule22
}, {
  start: 7881,
  length: 1,
  convRule: rule23
}, {
  start: 7882,
  length: 1,
  convRule: rule22
}, {
  start: 7883,
  length: 1,
  convRule: rule23
}, {
  start: 7884,
  length: 1,
  convRule: rule22
}, {
  start: 7885,
  length: 1,
  convRule: rule23
}, {
  start: 7886,
  length: 1,
  convRule: rule22
}, {
  start: 7887,
  length: 1,
  convRule: rule23
}, {
  start: 7888,
  length: 1,
  convRule: rule22
}, {
  start: 7889,
  length: 1,
  convRule: rule23
}, {
  start: 7890,
  length: 1,
  convRule: rule22
}, {
  start: 7891,
  length: 1,
  convRule: rule23
}, {
  start: 7892,
  length: 1,
  convRule: rule22
}, {
  start: 7893,
  length: 1,
  convRule: rule23
}, {
  start: 7894,
  length: 1,
  convRule: rule22
}, {
  start: 7895,
  length: 1,
  convRule: rule23
}, {
  start: 7896,
  length: 1,
  convRule: rule22
}, {
  start: 7897,
  length: 1,
  convRule: rule23
}, {
  start: 7898,
  length: 1,
  convRule: rule22
}, {
  start: 7899,
  length: 1,
  convRule: rule23
}, {
  start: 7900,
  length: 1,
  convRule: rule22
}, {
  start: 7901,
  length: 1,
  convRule: rule23
}, {
  start: 7902,
  length: 1,
  convRule: rule22
}, {
  start: 7903,
  length: 1,
  convRule: rule23
}, {
  start: 7904,
  length: 1,
  convRule: rule22
}, {
  start: 7905,
  length: 1,
  convRule: rule23
}, {
  start: 7906,
  length: 1,
  convRule: rule22
}, {
  start: 7907,
  length: 1,
  convRule: rule23
}, {
  start: 7908,
  length: 1,
  convRule: rule22
}, {
  start: 7909,
  length: 1,
  convRule: rule23
}, {
  start: 7910,
  length: 1,
  convRule: rule22
}, {
  start: 7911,
  length: 1,
  convRule: rule23
}, {
  start: 7912,
  length: 1,
  convRule: rule22
}, {
  start: 7913,
  length: 1,
  convRule: rule23
}, {
  start: 7914,
  length: 1,
  convRule: rule22
}, {
  start: 7915,
  length: 1,
  convRule: rule23
}, {
  start: 7916,
  length: 1,
  convRule: rule22
}, {
  start: 7917,
  length: 1,
  convRule: rule23
}, {
  start: 7918,
  length: 1,
  convRule: rule22
}, {
  start: 7919,
  length: 1,
  convRule: rule23
}, {
  start: 7920,
  length: 1,
  convRule: rule22
}, {
  start: 7921,
  length: 1,
  convRule: rule23
}, {
  start: 7922,
  length: 1,
  convRule: rule22
}, {
  start: 7923,
  length: 1,
  convRule: rule23
}, {
  start: 7924,
  length: 1,
  convRule: rule22
}, {
  start: 7925,
  length: 1,
  convRule: rule23
}, {
  start: 7926,
  length: 1,
  convRule: rule22
}, {
  start: 7927,
  length: 1,
  convRule: rule23
}, {
  start: 7928,
  length: 1,
  convRule: rule22
}, {
  start: 7929,
  length: 1,
  convRule: rule23
}, {
  start: 7930,
  length: 1,
  convRule: rule22
}, {
  start: 7931,
  length: 1,
  convRule: rule23
}, {
  start: 7932,
  length: 1,
  convRule: rule22
}, {
  start: 7933,
  length: 1,
  convRule: rule23
}, {
  start: 7934,
  length: 1,
  convRule: rule22
}, {
  start: 7935,
  length: 1,
  convRule: rule23
}, {
  start: 7936,
  length: 8,
  convRule: rule143
}, {
  start: 7944,
  length: 8,
  convRule: rule144
}, {
  start: 7952,
  length: 6,
  convRule: rule143
}, {
  start: 7960,
  length: 6,
  convRule: rule144
}, {
  start: 7968,
  length: 8,
  convRule: rule143
}, {
  start: 7976,
  length: 8,
  convRule: rule144
}, {
  start: 7984,
  length: 8,
  convRule: rule143
}, {
  start: 7992,
  length: 8,
  convRule: rule144
}, {
  start: 8e3,
  length: 6,
  convRule: rule143
}, {
  start: 8008,
  length: 6,
  convRule: rule144
}, {
  start: 8017,
  length: 1,
  convRule: rule143
}, {
  start: 8019,
  length: 1,
  convRule: rule143
}, {
  start: 8021,
  length: 1,
  convRule: rule143
}, {
  start: 8023,
  length: 1,
  convRule: rule143
}, {
  start: 8025,
  length: 1,
  convRule: rule144
}, {
  start: 8027,
  length: 1,
  convRule: rule144
}, {
  start: 8029,
  length: 1,
  convRule: rule144
}, {
  start: 8031,
  length: 1,
  convRule: rule144
}, {
  start: 8032,
  length: 8,
  convRule: rule143
}, {
  start: 8040,
  length: 8,
  convRule: rule144
}, {
  start: 8048,
  length: 2,
  convRule: rule145
}, {
  start: 8050,
  length: 4,
  convRule: rule146
}, {
  start: 8054,
  length: 2,
  convRule: rule147
}, {
  start: 8056,
  length: 2,
  convRule: rule148
}, {
  start: 8058,
  length: 2,
  convRule: rule149
}, {
  start: 8060,
  length: 2,
  convRule: rule150
}, {
  start: 8064,
  length: 8,
  convRule: rule143
}, {
  start: 8072,
  length: 8,
  convRule: rule151
}, {
  start: 8080,
  length: 8,
  convRule: rule143
}, {
  start: 8088,
  length: 8,
  convRule: rule151
}, {
  start: 8096,
  length: 8,
  convRule: rule143
}, {
  start: 8104,
  length: 8,
  convRule: rule151
}, {
  start: 8112,
  length: 2,
  convRule: rule143
}, {
  start: 8115,
  length: 1,
  convRule: rule152
}, {
  start: 8120,
  length: 2,
  convRule: rule144
}, {
  start: 8122,
  length: 2,
  convRule: rule153
}, {
  start: 8124,
  length: 1,
  convRule: rule154
}, {
  start: 8126,
  length: 1,
  convRule: rule155
}, {
  start: 8131,
  length: 1,
  convRule: rule152
}, {
  start: 8136,
  length: 4,
  convRule: rule156
}, {
  start: 8140,
  length: 1,
  convRule: rule154
}, {
  start: 8144,
  length: 2,
  convRule: rule143
}, {
  start: 8152,
  length: 2,
  convRule: rule144
}, {
  start: 8154,
  length: 2,
  convRule: rule157
}, {
  start: 8160,
  length: 2,
  convRule: rule143
}, {
  start: 8165,
  length: 1,
  convRule: rule113
}, {
  start: 8168,
  length: 2,
  convRule: rule144
}, {
  start: 8170,
  length: 2,
  convRule: rule158
}, {
  start: 8172,
  length: 1,
  convRule: rule117
}, {
  start: 8179,
  length: 1,
  convRule: rule152
}, {
  start: 8184,
  length: 2,
  convRule: rule159
}, {
  start: 8186,
  length: 2,
  convRule: rule160
}, {
  start: 8188,
  length: 1,
  convRule: rule154
}, {
  start: 8486,
  length: 1,
  convRule: rule163
}, {
  start: 8490,
  length: 1,
  convRule: rule164
}, {
  start: 8491,
  length: 1,
  convRule: rule165
}, {
  start: 8498,
  length: 1,
  convRule: rule166
}, {
  start: 8526,
  length: 1,
  convRule: rule167
}, {
  start: 8544,
  length: 16,
  convRule: rule168
}, {
  start: 8560,
  length: 16,
  convRule: rule169
}, {
  start: 8579,
  length: 1,
  convRule: rule22
}, {
  start: 8580,
  length: 1,
  convRule: rule23
}, {
  start: 9398,
  length: 26,
  convRule: rule170
}, {
  start: 9424,
  length: 26,
  convRule: rule171
}, {
  start: 11264,
  length: 47,
  convRule: rule122
}, {
  start: 11312,
  length: 47,
  convRule: rule123
}, {
  start: 11360,
  length: 1,
  convRule: rule22
}, {
  start: 11361,
  length: 1,
  convRule: rule23
}, {
  start: 11362,
  length: 1,
  convRule: rule172
}, {
  start: 11363,
  length: 1,
  convRule: rule173
}, {
  start: 11364,
  length: 1,
  convRule: rule174
}, {
  start: 11365,
  length: 1,
  convRule: rule175
}, {
  start: 11366,
  length: 1,
  convRule: rule176
}, {
  start: 11367,
  length: 1,
  convRule: rule22
}, {
  start: 11368,
  length: 1,
  convRule: rule23
}, {
  start: 11369,
  length: 1,
  convRule: rule22
}, {
  start: 11370,
  length: 1,
  convRule: rule23
}, {
  start: 11371,
  length: 1,
  convRule: rule22
}, {
  start: 11372,
  length: 1,
  convRule: rule23
}, {
  start: 11373,
  length: 1,
  convRule: rule177
}, {
  start: 11374,
  length: 1,
  convRule: rule178
}, {
  start: 11375,
  length: 1,
  convRule: rule179
}, {
  start: 11376,
  length: 1,
  convRule: rule180
}, {
  start: 11378,
  length: 1,
  convRule: rule22
}, {
  start: 11379,
  length: 1,
  convRule: rule23
}, {
  start: 11381,
  length: 1,
  convRule: rule22
}, {
  start: 11382,
  length: 1,
  convRule: rule23
}, {
  start: 11390,
  length: 2,
  convRule: rule181
}, {
  start: 11392,
  length: 1,
  convRule: rule22
}, {
  start: 11393,
  length: 1,
  convRule: rule23
}, {
  start: 11394,
  length: 1,
  convRule: rule22
}, {
  start: 11395,
  length: 1,
  convRule: rule23
}, {
  start: 11396,
  length: 1,
  convRule: rule22
}, {
  start: 11397,
  length: 1,
  convRule: rule23
}, {
  start: 11398,
  length: 1,
  convRule: rule22
}, {
  start: 11399,
  length: 1,
  convRule: rule23
}, {
  start: 11400,
  length: 1,
  convRule: rule22
}, {
  start: 11401,
  length: 1,
  convRule: rule23
}, {
  start: 11402,
  length: 1,
  convRule: rule22
}, {
  start: 11403,
  length: 1,
  convRule: rule23
}, {
  start: 11404,
  length: 1,
  convRule: rule22
}, {
  start: 11405,
  length: 1,
  convRule: rule23
}, {
  start: 11406,
  length: 1,
  convRule: rule22
}, {
  start: 11407,
  length: 1,
  convRule: rule23
}, {
  start: 11408,
  length: 1,
  convRule: rule22
}, {
  start: 11409,
  length: 1,
  convRule: rule23
}, {
  start: 11410,
  length: 1,
  convRule: rule22
}, {
  start: 11411,
  length: 1,
  convRule: rule23
}, {
  start: 11412,
  length: 1,
  convRule: rule22
}, {
  start: 11413,
  length: 1,
  convRule: rule23
}, {
  start: 11414,
  length: 1,
  convRule: rule22
}, {
  start: 11415,
  length: 1,
  convRule: rule23
}, {
  start: 11416,
  length: 1,
  convRule: rule22
}, {
  start: 11417,
  length: 1,
  convRule: rule23
}, {
  start: 11418,
  length: 1,
  convRule: rule22
}, {
  start: 11419,
  length: 1,
  convRule: rule23
}, {
  start: 11420,
  length: 1,
  convRule: rule22
}, {
  start: 11421,
  length: 1,
  convRule: rule23
}, {
  start: 11422,
  length: 1,
  convRule: rule22
}, {
  start: 11423,
  length: 1,
  convRule: rule23
}, {
  start: 11424,
  length: 1,
  convRule: rule22
}, {
  start: 11425,
  length: 1,
  convRule: rule23
}, {
  start: 11426,
  length: 1,
  convRule: rule22
}, {
  start: 11427,
  length: 1,
  convRule: rule23
}, {
  start: 11428,
  length: 1,
  convRule: rule22
}, {
  start: 11429,
  length: 1,
  convRule: rule23
}, {
  start: 11430,
  length: 1,
  convRule: rule22
}, {
  start: 11431,
  length: 1,
  convRule: rule23
}, {
  start: 11432,
  length: 1,
  convRule: rule22
}, {
  start: 11433,
  length: 1,
  convRule: rule23
}, {
  start: 11434,
  length: 1,
  convRule: rule22
}, {
  start: 11435,
  length: 1,
  convRule: rule23
}, {
  start: 11436,
  length: 1,
  convRule: rule22
}, {
  start: 11437,
  length: 1,
  convRule: rule23
}, {
  start: 11438,
  length: 1,
  convRule: rule22
}, {
  start: 11439,
  length: 1,
  convRule: rule23
}, {
  start: 11440,
  length: 1,
  convRule: rule22
}, {
  start: 11441,
  length: 1,
  convRule: rule23
}, {
  start: 11442,
  length: 1,
  convRule: rule22
}, {
  start: 11443,
  length: 1,
  convRule: rule23
}, {
  start: 11444,
  length: 1,
  convRule: rule22
}, {
  start: 11445,
  length: 1,
  convRule: rule23
}, {
  start: 11446,
  length: 1,
  convRule: rule22
}, {
  start: 11447,
  length: 1,
  convRule: rule23
}, {
  start: 11448,
  length: 1,
  convRule: rule22
}, {
  start: 11449,
  length: 1,
  convRule: rule23
}, {
  start: 11450,
  length: 1,
  convRule: rule22
}, {
  start: 11451,
  length: 1,
  convRule: rule23
}, {
  start: 11452,
  length: 1,
  convRule: rule22
}, {
  start: 11453,
  length: 1,
  convRule: rule23
}, {
  start: 11454,
  length: 1,
  convRule: rule22
}, {
  start: 11455,
  length: 1,
  convRule: rule23
}, {
  start: 11456,
  length: 1,
  convRule: rule22
}, {
  start: 11457,
  length: 1,
  convRule: rule23
}, {
  start: 11458,
  length: 1,
  convRule: rule22
}, {
  start: 11459,
  length: 1,
  convRule: rule23
}, {
  start: 11460,
  length: 1,
  convRule: rule22
}, {
  start: 11461,
  length: 1,
  convRule: rule23
}, {
  start: 11462,
  length: 1,
  convRule: rule22
}, {
  start: 11463,
  length: 1,
  convRule: rule23
}, {
  start: 11464,
  length: 1,
  convRule: rule22
}, {
  start: 11465,
  length: 1,
  convRule: rule23
}, {
  start: 11466,
  length: 1,
  convRule: rule22
}, {
  start: 11467,
  length: 1,
  convRule: rule23
}, {
  start: 11468,
  length: 1,
  convRule: rule22
}, {
  start: 11469,
  length: 1,
  convRule: rule23
}, {
  start: 11470,
  length: 1,
  convRule: rule22
}, {
  start: 11471,
  length: 1,
  convRule: rule23
}, {
  start: 11472,
  length: 1,
  convRule: rule22
}, {
  start: 11473,
  length: 1,
  convRule: rule23
}, {
  start: 11474,
  length: 1,
  convRule: rule22
}, {
  start: 11475,
  length: 1,
  convRule: rule23
}, {
  start: 11476,
  length: 1,
  convRule: rule22
}, {
  start: 11477,
  length: 1,
  convRule: rule23
}, {
  start: 11478,
  length: 1,
  convRule: rule22
}, {
  start: 11479,
  length: 1,
  convRule: rule23
}, {
  start: 11480,
  length: 1,
  convRule: rule22
}, {
  start: 11481,
  length: 1,
  convRule: rule23
}, {
  start: 11482,
  length: 1,
  convRule: rule22
}, {
  start: 11483,
  length: 1,
  convRule: rule23
}, {
  start: 11484,
  length: 1,
  convRule: rule22
}, {
  start: 11485,
  length: 1,
  convRule: rule23
}, {
  start: 11486,
  length: 1,
  convRule: rule22
}, {
  start: 11487,
  length: 1,
  convRule: rule23
}, {
  start: 11488,
  length: 1,
  convRule: rule22
}, {
  start: 11489,
  length: 1,
  convRule: rule23
}, {
  start: 11490,
  length: 1,
  convRule: rule22
}, {
  start: 11491,
  length: 1,
  convRule: rule23
}, {
  start: 11499,
  length: 1,
  convRule: rule22
}, {
  start: 11500,
  length: 1,
  convRule: rule23
}, {
  start: 11501,
  length: 1,
  convRule: rule22
}, {
  start: 11502,
  length: 1,
  convRule: rule23
}, {
  start: 11506,
  length: 1,
  convRule: rule22
}, {
  start: 11507,
  length: 1,
  convRule: rule23
}, {
  start: 11520,
  length: 38,
  convRule: rule182
}, {
  start: 11559,
  length: 1,
  convRule: rule182
}, {
  start: 11565,
  length: 1,
  convRule: rule182
}, {
  start: 42560,
  length: 1,
  convRule: rule22
}, {
  start: 42561,
  length: 1,
  convRule: rule23
}, {
  start: 42562,
  length: 1,
  convRule: rule22
}, {
  start: 42563,
  length: 1,
  convRule: rule23
}, {
  start: 42564,
  length: 1,
  convRule: rule22
}, {
  start: 42565,
  length: 1,
  convRule: rule23
}, {
  start: 42566,
  length: 1,
  convRule: rule22
}, {
  start: 42567,
  length: 1,
  convRule: rule23
}, {
  start: 42568,
  length: 1,
  convRule: rule22
}, {
  start: 42569,
  length: 1,
  convRule: rule23
}, {
  start: 42570,
  length: 1,
  convRule: rule22
}, {
  start: 42571,
  length: 1,
  convRule: rule23
}, {
  start: 42572,
  length: 1,
  convRule: rule22
}, {
  start: 42573,
  length: 1,
  convRule: rule23
}, {
  start: 42574,
  length: 1,
  convRule: rule22
}, {
  start: 42575,
  length: 1,
  convRule: rule23
}, {
  start: 42576,
  length: 1,
  convRule: rule22
}, {
  start: 42577,
  length: 1,
  convRule: rule23
}, {
  start: 42578,
  length: 1,
  convRule: rule22
}, {
  start: 42579,
  length: 1,
  convRule: rule23
}, {
  start: 42580,
  length: 1,
  convRule: rule22
}, {
  start: 42581,
  length: 1,
  convRule: rule23
}, {
  start: 42582,
  length: 1,
  convRule: rule22
}, {
  start: 42583,
  length: 1,
  convRule: rule23
}, {
  start: 42584,
  length: 1,
  convRule: rule22
}, {
  start: 42585,
  length: 1,
  convRule: rule23
}, {
  start: 42586,
  length: 1,
  convRule: rule22
}, {
  start: 42587,
  length: 1,
  convRule: rule23
}, {
  start: 42588,
  length: 1,
  convRule: rule22
}, {
  start: 42589,
  length: 1,
  convRule: rule23
}, {
  start: 42590,
  length: 1,
  convRule: rule22
}, {
  start: 42591,
  length: 1,
  convRule: rule23
}, {
  start: 42592,
  length: 1,
  convRule: rule22
}, {
  start: 42593,
  length: 1,
  convRule: rule23
}, {
  start: 42594,
  length: 1,
  convRule: rule22
}, {
  start: 42595,
  length: 1,
  convRule: rule23
}, {
  start: 42596,
  length: 1,
  convRule: rule22
}, {
  start: 42597,
  length: 1,
  convRule: rule23
}, {
  start: 42598,
  length: 1,
  convRule: rule22
}, {
  start: 42599,
  length: 1,
  convRule: rule23
}, {
  start: 42600,
  length: 1,
  convRule: rule22
}, {
  start: 42601,
  length: 1,
  convRule: rule23
}, {
  start: 42602,
  length: 1,
  convRule: rule22
}, {
  start: 42603,
  length: 1,
  convRule: rule23
}, {
  start: 42604,
  length: 1,
  convRule: rule22
}, {
  start: 42605,
  length: 1,
  convRule: rule23
}, {
  start: 42624,
  length: 1,
  convRule: rule22
}, {
  start: 42625,
  length: 1,
  convRule: rule23
}, {
  start: 42626,
  length: 1,
  convRule: rule22
}, {
  start: 42627,
  length: 1,
  convRule: rule23
}, {
  start: 42628,
  length: 1,
  convRule: rule22
}, {
  start: 42629,
  length: 1,
  convRule: rule23
}, {
  start: 42630,
  length: 1,
  convRule: rule22
}, {
  start: 42631,
  length: 1,
  convRule: rule23
}, {
  start: 42632,
  length: 1,
  convRule: rule22
}, {
  start: 42633,
  length: 1,
  convRule: rule23
}, {
  start: 42634,
  length: 1,
  convRule: rule22
}, {
  start: 42635,
  length: 1,
  convRule: rule23
}, {
  start: 42636,
  length: 1,
  convRule: rule22
}, {
  start: 42637,
  length: 1,
  convRule: rule23
}, {
  start: 42638,
  length: 1,
  convRule: rule22
}, {
  start: 42639,
  length: 1,
  convRule: rule23
}, {
  start: 42640,
  length: 1,
  convRule: rule22
}, {
  start: 42641,
  length: 1,
  convRule: rule23
}, {
  start: 42642,
  length: 1,
  convRule: rule22
}, {
  start: 42643,
  length: 1,
  convRule: rule23
}, {
  start: 42644,
  length: 1,
  convRule: rule22
}, {
  start: 42645,
  length: 1,
  convRule: rule23
}, {
  start: 42646,
  length: 1,
  convRule: rule22
}, {
  start: 42647,
  length: 1,
  convRule: rule23
}, {
  start: 42648,
  length: 1,
  convRule: rule22
}, {
  start: 42649,
  length: 1,
  convRule: rule23
}, {
  start: 42650,
  length: 1,
  convRule: rule22
}, {
  start: 42651,
  length: 1,
  convRule: rule23
}, {
  start: 42786,
  length: 1,
  convRule: rule22
}, {
  start: 42787,
  length: 1,
  convRule: rule23
}, {
  start: 42788,
  length: 1,
  convRule: rule22
}, {
  start: 42789,
  length: 1,
  convRule: rule23
}, {
  start: 42790,
  length: 1,
  convRule: rule22
}, {
  start: 42791,
  length: 1,
  convRule: rule23
}, {
  start: 42792,
  length: 1,
  convRule: rule22
}, {
  start: 42793,
  length: 1,
  convRule: rule23
}, {
  start: 42794,
  length: 1,
  convRule: rule22
}, {
  start: 42795,
  length: 1,
  convRule: rule23
}, {
  start: 42796,
  length: 1,
  convRule: rule22
}, {
  start: 42797,
  length: 1,
  convRule: rule23
}, {
  start: 42798,
  length: 1,
  convRule: rule22
}, {
  start: 42799,
  length: 1,
  convRule: rule23
}, {
  start: 42802,
  length: 1,
  convRule: rule22
}, {
  start: 42803,
  length: 1,
  convRule: rule23
}, {
  start: 42804,
  length: 1,
  convRule: rule22
}, {
  start: 42805,
  length: 1,
  convRule: rule23
}, {
  start: 42806,
  length: 1,
  convRule: rule22
}, {
  start: 42807,
  length: 1,
  convRule: rule23
}, {
  start: 42808,
  length: 1,
  convRule: rule22
}, {
  start: 42809,
  length: 1,
  convRule: rule23
}, {
  start: 42810,
  length: 1,
  convRule: rule22
}, {
  start: 42811,
  length: 1,
  convRule: rule23
}, {
  start: 42812,
  length: 1,
  convRule: rule22
}, {
  start: 42813,
  length: 1,
  convRule: rule23
}, {
  start: 42814,
  length: 1,
  convRule: rule22
}, {
  start: 42815,
  length: 1,
  convRule: rule23
}, {
  start: 42816,
  length: 1,
  convRule: rule22
}, {
  start: 42817,
  length: 1,
  convRule: rule23
}, {
  start: 42818,
  length: 1,
  convRule: rule22
}, {
  start: 42819,
  length: 1,
  convRule: rule23
}, {
  start: 42820,
  length: 1,
  convRule: rule22
}, {
  start: 42821,
  length: 1,
  convRule: rule23
}, {
  start: 42822,
  length: 1,
  convRule: rule22
}, {
  start: 42823,
  length: 1,
  convRule: rule23
}, {
  start: 42824,
  length: 1,
  convRule: rule22
}, {
  start: 42825,
  length: 1,
  convRule: rule23
}, {
  start: 42826,
  length: 1,
  convRule: rule22
}, {
  start: 42827,
  length: 1,
  convRule: rule23
}, {
  start: 42828,
  length: 1,
  convRule: rule22
}, {
  start: 42829,
  length: 1,
  convRule: rule23
}, {
  start: 42830,
  length: 1,
  convRule: rule22
}, {
  start: 42831,
  length: 1,
  convRule: rule23
}, {
  start: 42832,
  length: 1,
  convRule: rule22
}, {
  start: 42833,
  length: 1,
  convRule: rule23
}, {
  start: 42834,
  length: 1,
  convRule: rule22
}, {
  start: 42835,
  length: 1,
  convRule: rule23
}, {
  start: 42836,
  length: 1,
  convRule: rule22
}, {
  start: 42837,
  length: 1,
  convRule: rule23
}, {
  start: 42838,
  length: 1,
  convRule: rule22
}, {
  start: 42839,
  length: 1,
  convRule: rule23
}, {
  start: 42840,
  length: 1,
  convRule: rule22
}, {
  start: 42841,
  length: 1,
  convRule: rule23
}, {
  start: 42842,
  length: 1,
  convRule: rule22
}, {
  start: 42843,
  length: 1,
  convRule: rule23
}, {
  start: 42844,
  length: 1,
  convRule: rule22
}, {
  start: 42845,
  length: 1,
  convRule: rule23
}, {
  start: 42846,
  length: 1,
  convRule: rule22
}, {
  start: 42847,
  length: 1,
  convRule: rule23
}, {
  start: 42848,
  length: 1,
  convRule: rule22
}, {
  start: 42849,
  length: 1,
  convRule: rule23
}, {
  start: 42850,
  length: 1,
  convRule: rule22
}, {
  start: 42851,
  length: 1,
  convRule: rule23
}, {
  start: 42852,
  length: 1,
  convRule: rule22
}, {
  start: 42853,
  length: 1,
  convRule: rule23
}, {
  start: 42854,
  length: 1,
  convRule: rule22
}, {
  start: 42855,
  length: 1,
  convRule: rule23
}, {
  start: 42856,
  length: 1,
  convRule: rule22
}, {
  start: 42857,
  length: 1,
  convRule: rule23
}, {
  start: 42858,
  length: 1,
  convRule: rule22
}, {
  start: 42859,
  length: 1,
  convRule: rule23
}, {
  start: 42860,
  length: 1,
  convRule: rule22
}, {
  start: 42861,
  length: 1,
  convRule: rule23
}, {
  start: 42862,
  length: 1,
  convRule: rule22
}, {
  start: 42863,
  length: 1,
  convRule: rule23
}, {
  start: 42873,
  length: 1,
  convRule: rule22
}, {
  start: 42874,
  length: 1,
  convRule: rule23
}, {
  start: 42875,
  length: 1,
  convRule: rule22
}, {
  start: 42876,
  length: 1,
  convRule: rule23
}, {
  start: 42877,
  length: 1,
  convRule: rule183
}, {
  start: 42878,
  length: 1,
  convRule: rule22
}, {
  start: 42879,
  length: 1,
  convRule: rule23
}, {
  start: 42880,
  length: 1,
  convRule: rule22
}, {
  start: 42881,
  length: 1,
  convRule: rule23
}, {
  start: 42882,
  length: 1,
  convRule: rule22
}, {
  start: 42883,
  length: 1,
  convRule: rule23
}, {
  start: 42884,
  length: 1,
  convRule: rule22
}, {
  start: 42885,
  length: 1,
  convRule: rule23
}, {
  start: 42886,
  length: 1,
  convRule: rule22
}, {
  start: 42887,
  length: 1,
  convRule: rule23
}, {
  start: 42891,
  length: 1,
  convRule: rule22
}, {
  start: 42892,
  length: 1,
  convRule: rule23
}, {
  start: 42893,
  length: 1,
  convRule: rule184
}, {
  start: 42896,
  length: 1,
  convRule: rule22
}, {
  start: 42897,
  length: 1,
  convRule: rule23
}, {
  start: 42898,
  length: 1,
  convRule: rule22
}, {
  start: 42899,
  length: 1,
  convRule: rule23
}, {
  start: 42900,
  length: 1,
  convRule: rule185
}, {
  start: 42902,
  length: 1,
  convRule: rule22
}, {
  start: 42903,
  length: 1,
  convRule: rule23
}, {
  start: 42904,
  length: 1,
  convRule: rule22
}, {
  start: 42905,
  length: 1,
  convRule: rule23
}, {
  start: 42906,
  length: 1,
  convRule: rule22
}, {
  start: 42907,
  length: 1,
  convRule: rule23
}, {
  start: 42908,
  length: 1,
  convRule: rule22
}, {
  start: 42909,
  length: 1,
  convRule: rule23
}, {
  start: 42910,
  length: 1,
  convRule: rule22
}, {
  start: 42911,
  length: 1,
  convRule: rule23
}, {
  start: 42912,
  length: 1,
  convRule: rule22
}, {
  start: 42913,
  length: 1,
  convRule: rule23
}, {
  start: 42914,
  length: 1,
  convRule: rule22
}, {
  start: 42915,
  length: 1,
  convRule: rule23
}, {
  start: 42916,
  length: 1,
  convRule: rule22
}, {
  start: 42917,
  length: 1,
  convRule: rule23
}, {
  start: 42918,
  length: 1,
  convRule: rule22
}, {
  start: 42919,
  length: 1,
  convRule: rule23
}, {
  start: 42920,
  length: 1,
  convRule: rule22
}, {
  start: 42921,
  length: 1,
  convRule: rule23
}, {
  start: 42922,
  length: 1,
  convRule: rule186
}, {
  start: 42923,
  length: 1,
  convRule: rule187
}, {
  start: 42924,
  length: 1,
  convRule: rule188
}, {
  start: 42925,
  length: 1,
  convRule: rule189
}, {
  start: 42926,
  length: 1,
  convRule: rule186
}, {
  start: 42928,
  length: 1,
  convRule: rule190
}, {
  start: 42929,
  length: 1,
  convRule: rule191
}, {
  start: 42930,
  length: 1,
  convRule: rule192
}, {
  start: 42931,
  length: 1,
  convRule: rule193
}, {
  start: 42932,
  length: 1,
  convRule: rule22
}, {
  start: 42933,
  length: 1,
  convRule: rule23
}, {
  start: 42934,
  length: 1,
  convRule: rule22
}, {
  start: 42935,
  length: 1,
  convRule: rule23
}, {
  start: 42936,
  length: 1,
  convRule: rule22
}, {
  start: 42937,
  length: 1,
  convRule: rule23
}, {
  start: 42938,
  length: 1,
  convRule: rule22
}, {
  start: 42939,
  length: 1,
  convRule: rule23
}, {
  start: 42940,
  length: 1,
  convRule: rule22
}, {
  start: 42941,
  length: 1,
  convRule: rule23
}, {
  start: 42942,
  length: 1,
  convRule: rule22
}, {
  start: 42943,
  length: 1,
  convRule: rule23
}, {
  start: 42946,
  length: 1,
  convRule: rule22
}, {
  start: 42947,
  length: 1,
  convRule: rule23
}, {
  start: 42948,
  length: 1,
  convRule: rule194
}, {
  start: 42949,
  length: 1,
  convRule: rule195
}, {
  start: 42950,
  length: 1,
  convRule: rule196
}, {
  start: 42951,
  length: 1,
  convRule: rule22
}, {
  start: 42952,
  length: 1,
  convRule: rule23
}, {
  start: 42953,
  length: 1,
  convRule: rule22
}, {
  start: 42954,
  length: 1,
  convRule: rule23
}, {
  start: 42997,
  length: 1,
  convRule: rule22
}, {
  start: 42998,
  length: 1,
  convRule: rule23
}, {
  start: 43859,
  length: 1,
  convRule: rule197
}, {
  start: 43888,
  length: 80,
  convRule: rule198
}, {
  start: 65313,
  length: 26,
  convRule: rule9
}, {
  start: 65345,
  length: 26,
  convRule: rule12
}, {
  start: 66560,
  length: 40,
  convRule: rule201
}, {
  start: 66600,
  length: 40,
  convRule: rule202
}, {
  start: 66736,
  length: 36,
  convRule: rule201
}, {
  start: 66776,
  length: 36,
  convRule: rule202
}, {
  start: 68736,
  length: 51,
  convRule: rule97
}, {
  start: 68800,
  length: 51,
  convRule: rule102
}, {
  start: 71840,
  length: 32,
  convRule: rule9
}, {
  start: 71872,
  length: 32,
  convRule: rule12
}, {
  start: 93760,
  length: 32,
  convRule: rule9
}, {
  start: 93792,
  length: 32,
  convRule: rule12
}, {
  start: 125184,
  length: 34,
  convRule: rule203
}, {
  start: 125218,
  length: 34,
  convRule: rule204
}];
var bsearch = function(a) {
  return function(array) {
    return function(size5) {
      return function(compare3) {
        var go = function($copy_i) {
          return function($copy_k) {
            var $tco_var_i = $copy_i;
            var $tco_done = false;
            var $tco_result;
            function $tco_loop(i2, k) {
              if (i2 > k || i2 >= length(array)) {
                $tco_done = true;
                return Nothing.value;
              }
              ;
              if (otherwise) {
                var j = floor2(toNumber(i2 + k | 0) / 2);
                var b = unsafeIndex2(array)(j);
                var v = compare3(a)(b);
                if (v instanceof EQ) {
                  $tco_done = true;
                  return new Just(b);
                }
                ;
                if (v instanceof GT) {
                  $tco_var_i = j + 1 | 0;
                  $copy_k = k;
                  return;
                }
                ;
                $tco_var_i = i2;
                $copy_k = j - 1 | 0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5622, column 3 - line 5632, column 30): " + [i2.constructor.name, k.constructor.name]);
            }
            ;
            while (!$tco_done) {
              $tco_result = $tco_loop($tco_var_i, $copy_k);
            }
            ;
            return $tco_result;
          };
        };
        return go(0)(size5);
      };
    };
  };
};
var blkCmp = function(v) {
  return function(v1) {
    if (v.start >= v1.start && v.start < (v1.start + v1.length | 0)) {
      return EQ.value;
    }
    ;
    if (v.start > v1.start) {
      return GT.value;
    }
    ;
    if (otherwise) {
      return LT.value;
    }
    ;
    throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5598, column 1 - line 5598, column 45): " + [v.constructor.name, v1.constructor.name]);
  };
};
var getRule = function(blocks) {
  return function(unichar) {
    return function(size5) {
      var key = {
        start: unichar,
        length: 1,
        convRule: nullrule
      };
      var maybeCharBlock = bsearch(key)(blocks)(size5)(blkCmp);
      if (maybeCharBlock instanceof Nothing) {
        return Nothing.value;
      }
      ;
      if (maybeCharBlock instanceof Just) {
        return new Just(maybeCharBlock.value0.convRule);
      }
      ;
      throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5612, column 5 - line 5614, column 60): " + [maybeCharBlock.constructor.name]);
    };
  };
};
var caseConv = function(f3) {
  return function($$char) {
    var maybeConversionRule = getRule(convchars)($$char)(numConvBlocks);
    if (maybeConversionRule instanceof Nothing) {
      return $$char;
    }
    ;
    if (maybeConversionRule instanceof Just) {
      return $$char + f3(maybeConversionRule.value0) | 0;
    }
    ;
    throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5727, column 5 - line 5729, column 53): " + [maybeConversionRule.constructor.name]);
  };
};
var uTowlower = /* @__PURE__ */ caseConv(function(v) {
  return v.lowdist;
});

// output/Data.CodePoint.Unicode.Internal.Casing/index.js
var compare2 = /* @__PURE__ */ compare(ordInt);
var zeroRec = function(code) {
  return {
    code,
    lower: [],
    title: [],
    upper: [],
    fold: 0,
    foldFull: []
  };
};
var rules = [{
  code: 65,
  lower: [],
  title: [],
  upper: [],
  fold: 97,
  foldFull: [97]
}, {
  code: 66,
  lower: [],
  title: [],
  upper: [],
  fold: 98,
  foldFull: [98]
}, {
  code: 67,
  lower: [],
  title: [],
  upper: [],
  fold: 99,
  foldFull: [99]
}, {
  code: 68,
  lower: [],
  title: [],
  upper: [],
  fold: 100,
  foldFull: [100]
}, {
  code: 69,
  lower: [],
  title: [],
  upper: [],
  fold: 101,
  foldFull: [101]
}, {
  code: 70,
  lower: [],
  title: [],
  upper: [],
  fold: 102,
  foldFull: [102]
}, {
  code: 71,
  lower: [],
  title: [],
  upper: [],
  fold: 103,
  foldFull: [103]
}, {
  code: 72,
  lower: [],
  title: [],
  upper: [],
  fold: 104,
  foldFull: [104]
}, {
  code: 73,
  lower: [],
  title: [],
  upper: [],
  fold: 105,
  foldFull: [105]
}, {
  code: 74,
  lower: [],
  title: [],
  upper: [],
  fold: 106,
  foldFull: [106]
}, {
  code: 75,
  lower: [],
  title: [],
  upper: [],
  fold: 107,
  foldFull: [107]
}, {
  code: 76,
  lower: [],
  title: [],
  upper: [],
  fold: 108,
  foldFull: [108]
}, {
  code: 77,
  lower: [],
  title: [],
  upper: [],
  fold: 109,
  foldFull: [109]
}, {
  code: 78,
  lower: [],
  title: [],
  upper: [],
  fold: 110,
  foldFull: [110]
}, {
  code: 79,
  lower: [],
  title: [],
  upper: [],
  fold: 111,
  foldFull: [111]
}, {
  code: 80,
  lower: [],
  title: [],
  upper: [],
  fold: 112,
  foldFull: [112]
}, {
  code: 81,
  lower: [],
  title: [],
  upper: [],
  fold: 113,
  foldFull: [113]
}, {
  code: 82,
  lower: [],
  title: [],
  upper: [],
  fold: 114,
  foldFull: [114]
}, {
  code: 83,
  lower: [],
  title: [],
  upper: [],
  fold: 115,
  foldFull: [115]
}, {
  code: 84,
  lower: [],
  title: [],
  upper: [],
  fold: 116,
  foldFull: [116]
}, {
  code: 85,
  lower: [],
  title: [],
  upper: [],
  fold: 117,
  foldFull: [117]
}, {
  code: 86,
  lower: [],
  title: [],
  upper: [],
  fold: 118,
  foldFull: [118]
}, {
  code: 87,
  lower: [],
  title: [],
  upper: [],
  fold: 119,
  foldFull: [119]
}, {
  code: 88,
  lower: [],
  title: [],
  upper: [],
  fold: 120,
  foldFull: [120]
}, {
  code: 89,
  lower: [],
  title: [],
  upper: [],
  fold: 121,
  foldFull: [121]
}, {
  code: 90,
  lower: [],
  title: [],
  upper: [],
  fold: 122,
  foldFull: [122]
}, {
  code: 181,
  lower: [],
  title: [],
  upper: [],
  fold: 956,
  foldFull: [956]
}, {
  code: 192,
  lower: [],
  title: [],
  upper: [],
  fold: 224,
  foldFull: [224]
}, {
  code: 193,
  lower: [],
  title: [],
  upper: [],
  fold: 225,
  foldFull: [225]
}, {
  code: 194,
  lower: [],
  title: [],
  upper: [],
  fold: 226,
  foldFull: [226]
}, {
  code: 195,
  lower: [],
  title: [],
  upper: [],
  fold: 227,
  foldFull: [227]
}, {
  code: 196,
  lower: [],
  title: [],
  upper: [],
  fold: 228,
  foldFull: [228]
}, {
  code: 197,
  lower: [],
  title: [],
  upper: [],
  fold: 229,
  foldFull: [229]
}, {
  code: 198,
  lower: [],
  title: [],
  upper: [],
  fold: 230,
  foldFull: [230]
}, {
  code: 199,
  lower: [],
  title: [],
  upper: [],
  fold: 231,
  foldFull: [231]
}, {
  code: 200,
  lower: [],
  title: [],
  upper: [],
  fold: 232,
  foldFull: [232]
}, {
  code: 201,
  lower: [],
  title: [],
  upper: [],
  fold: 233,
  foldFull: [233]
}, {
  code: 202,
  lower: [],
  title: [],
  upper: [],
  fold: 234,
  foldFull: [234]
}, {
  code: 203,
  lower: [],
  title: [],
  upper: [],
  fold: 235,
  foldFull: [235]
}, {
  code: 204,
  lower: [],
  title: [],
  upper: [],
  fold: 236,
  foldFull: [236]
}, {
  code: 205,
  lower: [],
  title: [],
  upper: [],
  fold: 237,
  foldFull: [237]
}, {
  code: 206,
  lower: [],
  title: [],
  upper: [],
  fold: 238,
  foldFull: [238]
}, {
  code: 207,
  lower: [],
  title: [],
  upper: [],
  fold: 239,
  foldFull: [239]
}, {
  code: 208,
  lower: [],
  title: [],
  upper: [],
  fold: 240,
  foldFull: [240]
}, {
  code: 209,
  lower: [],
  title: [],
  upper: [],
  fold: 241,
  foldFull: [241]
}, {
  code: 210,
  lower: [],
  title: [],
  upper: [],
  fold: 242,
  foldFull: [242]
}, {
  code: 211,
  lower: [],
  title: [],
  upper: [],
  fold: 243,
  foldFull: [243]
}, {
  code: 212,
  lower: [],
  title: [],
  upper: [],
  fold: 244,
  foldFull: [244]
}, {
  code: 213,
  lower: [],
  title: [],
  upper: [],
  fold: 245,
  foldFull: [245]
}, {
  code: 214,
  lower: [],
  title: [],
  upper: [],
  fold: 246,
  foldFull: [246]
}, {
  code: 216,
  lower: [],
  title: [],
  upper: [],
  fold: 248,
  foldFull: [248]
}, {
  code: 217,
  lower: [],
  title: [],
  upper: [],
  fold: 249,
  foldFull: [249]
}, {
  code: 218,
  lower: [],
  title: [],
  upper: [],
  fold: 250,
  foldFull: [250]
}, {
  code: 219,
  lower: [],
  title: [],
  upper: [],
  fold: 251,
  foldFull: [251]
}, {
  code: 220,
  lower: [],
  title: [],
  upper: [],
  fold: 252,
  foldFull: [252]
}, {
  code: 221,
  lower: [],
  title: [],
  upper: [],
  fold: 253,
  foldFull: [253]
}, {
  code: 222,
  lower: [],
  title: [],
  upper: [],
  fold: 254,
  foldFull: [254]
}, {
  code: 223,
  lower: [223],
  title: [83, 115],
  upper: [83, 83],
  fold: 0,
  foldFull: [115, 115]
}, {
  code: 223,
  lower: [223],
  title: [83, 115],
  upper: [83, 83],
  fold: 0,
  foldFull: [115, 115]
}, {
  code: 256,
  lower: [],
  title: [],
  upper: [],
  fold: 257,
  foldFull: [257]
}, {
  code: 258,
  lower: [],
  title: [],
  upper: [],
  fold: 259,
  foldFull: [259]
}, {
  code: 260,
  lower: [],
  title: [],
  upper: [],
  fold: 261,
  foldFull: [261]
}, {
  code: 262,
  lower: [],
  title: [],
  upper: [],
  fold: 263,
  foldFull: [263]
}, {
  code: 264,
  lower: [],
  title: [],
  upper: [],
  fold: 265,
  foldFull: [265]
}, {
  code: 266,
  lower: [],
  title: [],
  upper: [],
  fold: 267,
  foldFull: [267]
}, {
  code: 268,
  lower: [],
  title: [],
  upper: [],
  fold: 269,
  foldFull: [269]
}, {
  code: 270,
  lower: [],
  title: [],
  upper: [],
  fold: 271,
  foldFull: [271]
}, {
  code: 272,
  lower: [],
  title: [],
  upper: [],
  fold: 273,
  foldFull: [273]
}, {
  code: 274,
  lower: [],
  title: [],
  upper: [],
  fold: 275,
  foldFull: [275]
}, {
  code: 276,
  lower: [],
  title: [],
  upper: [],
  fold: 277,
  foldFull: [277]
}, {
  code: 278,
  lower: [],
  title: [],
  upper: [],
  fold: 279,
  foldFull: [279]
}, {
  code: 280,
  lower: [],
  title: [],
  upper: [],
  fold: 281,
  foldFull: [281]
}, {
  code: 282,
  lower: [],
  title: [],
  upper: [],
  fold: 283,
  foldFull: [283]
}, {
  code: 284,
  lower: [],
  title: [],
  upper: [],
  fold: 285,
  foldFull: [285]
}, {
  code: 286,
  lower: [],
  title: [],
  upper: [],
  fold: 287,
  foldFull: [287]
}, {
  code: 288,
  lower: [],
  title: [],
  upper: [],
  fold: 289,
  foldFull: [289]
}, {
  code: 290,
  lower: [],
  title: [],
  upper: [],
  fold: 291,
  foldFull: [291]
}, {
  code: 292,
  lower: [],
  title: [],
  upper: [],
  fold: 293,
  foldFull: [293]
}, {
  code: 294,
  lower: [],
  title: [],
  upper: [],
  fold: 295,
  foldFull: [295]
}, {
  code: 296,
  lower: [],
  title: [],
  upper: [],
  fold: 297,
  foldFull: [297]
}, {
  code: 298,
  lower: [],
  title: [],
  upper: [],
  fold: 299,
  foldFull: [299]
}, {
  code: 300,
  lower: [],
  title: [],
  upper: [],
  fold: 301,
  foldFull: [301]
}, {
  code: 302,
  lower: [],
  title: [],
  upper: [],
  fold: 303,
  foldFull: [303]
}, {
  code: 304,
  lower: [105, 775],
  title: [304],
  upper: [304],
  fold: 0,
  foldFull: [105, 775]
}, {
  code: 304,
  lower: [105, 775],
  title: [304],
  upper: [304],
  fold: 0,
  foldFull: [105, 775]
}, {
  code: 306,
  lower: [],
  title: [],
  upper: [],
  fold: 307,
  foldFull: [307]
}, {
  code: 308,
  lower: [],
  title: [],
  upper: [],
  fold: 309,
  foldFull: [309]
}, {
  code: 310,
  lower: [],
  title: [],
  upper: [],
  fold: 311,
  foldFull: [311]
}, {
  code: 313,
  lower: [],
  title: [],
  upper: [],
  fold: 314,
  foldFull: [314]
}, {
  code: 315,
  lower: [],
  title: [],
  upper: [],
  fold: 316,
  foldFull: [316]
}, {
  code: 317,
  lower: [],
  title: [],
  upper: [],
  fold: 318,
  foldFull: [318]
}, {
  code: 319,
  lower: [],
  title: [],
  upper: [],
  fold: 320,
  foldFull: [320]
}, {
  code: 321,
  lower: [],
  title: [],
  upper: [],
  fold: 322,
  foldFull: [322]
}, {
  code: 323,
  lower: [],
  title: [],
  upper: [],
  fold: 324,
  foldFull: [324]
}, {
  code: 325,
  lower: [],
  title: [],
  upper: [],
  fold: 326,
  foldFull: [326]
}, {
  code: 327,
  lower: [],
  title: [],
  upper: [],
  fold: 328,
  foldFull: [328]
}, {
  code: 329,
  lower: [329],
  title: [700, 78],
  upper: [700, 78],
  fold: 0,
  foldFull: [700, 110]
}, {
  code: 329,
  lower: [329],
  title: [700, 78],
  upper: [700, 78],
  fold: 0,
  foldFull: [700, 110]
}, {
  code: 330,
  lower: [],
  title: [],
  upper: [],
  fold: 331,
  foldFull: [331]
}, {
  code: 332,
  lower: [],
  title: [],
  upper: [],
  fold: 333,
  foldFull: [333]
}, {
  code: 334,
  lower: [],
  title: [],
  upper: [],
  fold: 335,
  foldFull: [335]
}, {
  code: 336,
  lower: [],
  title: [],
  upper: [],
  fold: 337,
  foldFull: [337]
}, {
  code: 338,
  lower: [],
  title: [],
  upper: [],
  fold: 339,
  foldFull: [339]
}, {
  code: 340,
  lower: [],
  title: [],
  upper: [],
  fold: 341,
  foldFull: [341]
}, {
  code: 342,
  lower: [],
  title: [],
  upper: [],
  fold: 343,
  foldFull: [343]
}, {
  code: 344,
  lower: [],
  title: [],
  upper: [],
  fold: 345,
  foldFull: [345]
}, {
  code: 346,
  lower: [],
  title: [],
  upper: [],
  fold: 347,
  foldFull: [347]
}, {
  code: 348,
  lower: [],
  title: [],
  upper: [],
  fold: 349,
  foldFull: [349]
}, {
  code: 350,
  lower: [],
  title: [],
  upper: [],
  fold: 351,
  foldFull: [351]
}, {
  code: 352,
  lower: [],
  title: [],
  upper: [],
  fold: 353,
  foldFull: [353]
}, {
  code: 354,
  lower: [],
  title: [],
  upper: [],
  fold: 355,
  foldFull: [355]
}, {
  code: 356,
  lower: [],
  title: [],
  upper: [],
  fold: 357,
  foldFull: [357]
}, {
  code: 358,
  lower: [],
  title: [],
  upper: [],
  fold: 359,
  foldFull: [359]
}, {
  code: 360,
  lower: [],
  title: [],
  upper: [],
  fold: 361,
  foldFull: [361]
}, {
  code: 362,
  lower: [],
  title: [],
  upper: [],
  fold: 363,
  foldFull: [363]
}, {
  code: 364,
  lower: [],
  title: [],
  upper: [],
  fold: 365,
  foldFull: [365]
}, {
  code: 366,
  lower: [],
  title: [],
  upper: [],
  fold: 367,
  foldFull: [367]
}, {
  code: 368,
  lower: [],
  title: [],
  upper: [],
  fold: 369,
  foldFull: [369]
}, {
  code: 370,
  lower: [],
  title: [],
  upper: [],
  fold: 371,
  foldFull: [371]
}, {
  code: 372,
  lower: [],
  title: [],
  upper: [],
  fold: 373,
  foldFull: [373]
}, {
  code: 374,
  lower: [],
  title: [],
  upper: [],
  fold: 375,
  foldFull: [375]
}, {
  code: 376,
  lower: [],
  title: [],
  upper: [],
  fold: 255,
  foldFull: [255]
}, {
  code: 377,
  lower: [],
  title: [],
  upper: [],
  fold: 378,
  foldFull: [378]
}, {
  code: 379,
  lower: [],
  title: [],
  upper: [],
  fold: 380,
  foldFull: [380]
}, {
  code: 381,
  lower: [],
  title: [],
  upper: [],
  fold: 382,
  foldFull: [382]
}, {
  code: 383,
  lower: [],
  title: [],
  upper: [],
  fold: 115,
  foldFull: [115]
}, {
  code: 385,
  lower: [],
  title: [],
  upper: [],
  fold: 595,
  foldFull: [595]
}, {
  code: 386,
  lower: [],
  title: [],
  upper: [],
  fold: 387,
  foldFull: [387]
}, {
  code: 388,
  lower: [],
  title: [],
  upper: [],
  fold: 389,
  foldFull: [389]
}, {
  code: 390,
  lower: [],
  title: [],
  upper: [],
  fold: 596,
  foldFull: [596]
}, {
  code: 391,
  lower: [],
  title: [],
  upper: [],
  fold: 392,
  foldFull: [392]
}, {
  code: 393,
  lower: [],
  title: [],
  upper: [],
  fold: 598,
  foldFull: [598]
}, {
  code: 394,
  lower: [],
  title: [],
  upper: [],
  fold: 599,
  foldFull: [599]
}, {
  code: 395,
  lower: [],
  title: [],
  upper: [],
  fold: 396,
  foldFull: [396]
}, {
  code: 398,
  lower: [],
  title: [],
  upper: [],
  fold: 477,
  foldFull: [477]
}, {
  code: 399,
  lower: [],
  title: [],
  upper: [],
  fold: 601,
  foldFull: [601]
}, {
  code: 400,
  lower: [],
  title: [],
  upper: [],
  fold: 603,
  foldFull: [603]
}, {
  code: 401,
  lower: [],
  title: [],
  upper: [],
  fold: 402,
  foldFull: [402]
}, {
  code: 403,
  lower: [],
  title: [],
  upper: [],
  fold: 608,
  foldFull: [608]
}, {
  code: 404,
  lower: [],
  title: [],
  upper: [],
  fold: 611,
  foldFull: [611]
}, {
  code: 406,
  lower: [],
  title: [],
  upper: [],
  fold: 617,
  foldFull: [617]
}, {
  code: 407,
  lower: [],
  title: [],
  upper: [],
  fold: 616,
  foldFull: [616]
}, {
  code: 408,
  lower: [],
  title: [],
  upper: [],
  fold: 409,
  foldFull: [409]
}, {
  code: 412,
  lower: [],
  title: [],
  upper: [],
  fold: 623,
  foldFull: [623]
}, {
  code: 413,
  lower: [],
  title: [],
  upper: [],
  fold: 626,
  foldFull: [626]
}, {
  code: 415,
  lower: [],
  title: [],
  upper: [],
  fold: 629,
  foldFull: [629]
}, {
  code: 416,
  lower: [],
  title: [],
  upper: [],
  fold: 417,
  foldFull: [417]
}, {
  code: 418,
  lower: [],
  title: [],
  upper: [],
  fold: 419,
  foldFull: [419]
}, {
  code: 420,
  lower: [],
  title: [],
  upper: [],
  fold: 421,
  foldFull: [421]
}, {
  code: 422,
  lower: [],
  title: [],
  upper: [],
  fold: 640,
  foldFull: [640]
}, {
  code: 423,
  lower: [],
  title: [],
  upper: [],
  fold: 424,
  foldFull: [424]
}, {
  code: 425,
  lower: [],
  title: [],
  upper: [],
  fold: 643,
  foldFull: [643]
}, {
  code: 428,
  lower: [],
  title: [],
  upper: [],
  fold: 429,
  foldFull: [429]
}, {
  code: 430,
  lower: [],
  title: [],
  upper: [],
  fold: 648,
  foldFull: [648]
}, {
  code: 431,
  lower: [],
  title: [],
  upper: [],
  fold: 432,
  foldFull: [432]
}, {
  code: 433,
  lower: [],
  title: [],
  upper: [],
  fold: 650,
  foldFull: [650]
}, {
  code: 434,
  lower: [],
  title: [],
  upper: [],
  fold: 651,
  foldFull: [651]
}, {
  code: 435,
  lower: [],
  title: [],
  upper: [],
  fold: 436,
  foldFull: [436]
}, {
  code: 437,
  lower: [],
  title: [],
  upper: [],
  fold: 438,
  foldFull: [438]
}, {
  code: 439,
  lower: [],
  title: [],
  upper: [],
  fold: 658,
  foldFull: [658]
}, {
  code: 440,
  lower: [],
  title: [],
  upper: [],
  fold: 441,
  foldFull: [441]
}, {
  code: 444,
  lower: [],
  title: [],
  upper: [],
  fold: 445,
  foldFull: [445]
}, {
  code: 452,
  lower: [],
  title: [],
  upper: [],
  fold: 454,
  foldFull: [454]
}, {
  code: 453,
  lower: [],
  title: [],
  upper: [],
  fold: 454,
  foldFull: [454]
}, {
  code: 455,
  lower: [],
  title: [],
  upper: [],
  fold: 457,
  foldFull: [457]
}, {
  code: 456,
  lower: [],
  title: [],
  upper: [],
  fold: 457,
  foldFull: [457]
}, {
  code: 458,
  lower: [],
  title: [],
  upper: [],
  fold: 460,
  foldFull: [460]
}, {
  code: 459,
  lower: [],
  title: [],
  upper: [],
  fold: 460,
  foldFull: [460]
}, {
  code: 461,
  lower: [],
  title: [],
  upper: [],
  fold: 462,
  foldFull: [462]
}, {
  code: 463,
  lower: [],
  title: [],
  upper: [],
  fold: 464,
  foldFull: [464]
}, {
  code: 465,
  lower: [],
  title: [],
  upper: [],
  fold: 466,
  foldFull: [466]
}, {
  code: 467,
  lower: [],
  title: [],
  upper: [],
  fold: 468,
  foldFull: [468]
}, {
  code: 469,
  lower: [],
  title: [],
  upper: [],
  fold: 470,
  foldFull: [470]
}, {
  code: 471,
  lower: [],
  title: [],
  upper: [],
  fold: 472,
  foldFull: [472]
}, {
  code: 473,
  lower: [],
  title: [],
  upper: [],
  fold: 474,
  foldFull: [474]
}, {
  code: 475,
  lower: [],
  title: [],
  upper: [],
  fold: 476,
  foldFull: [476]
}, {
  code: 478,
  lower: [],
  title: [],
  upper: [],
  fold: 479,
  foldFull: [479]
}, {
  code: 480,
  lower: [],
  title: [],
  upper: [],
  fold: 481,
  foldFull: [481]
}, {
  code: 482,
  lower: [],
  title: [],
  upper: [],
  fold: 483,
  foldFull: [483]
}, {
  code: 484,
  lower: [],
  title: [],
  upper: [],
  fold: 485,
  foldFull: [485]
}, {
  code: 486,
  lower: [],
  title: [],
  upper: [],
  fold: 487,
  foldFull: [487]
}, {
  code: 488,
  lower: [],
  title: [],
  upper: [],
  fold: 489,
  foldFull: [489]
}, {
  code: 490,
  lower: [],
  title: [],
  upper: [],
  fold: 491,
  foldFull: [491]
}, {
  code: 492,
  lower: [],
  title: [],
  upper: [],
  fold: 493,
  foldFull: [493]
}, {
  code: 494,
  lower: [],
  title: [],
  upper: [],
  fold: 495,
  foldFull: [495]
}, {
  code: 496,
  lower: [496],
  title: [74, 780],
  upper: [74, 780],
  fold: 0,
  foldFull: [106, 780]
}, {
  code: 496,
  lower: [496],
  title: [74, 780],
  upper: [74, 780],
  fold: 0,
  foldFull: [106, 780]
}, {
  code: 497,
  lower: [],
  title: [],
  upper: [],
  fold: 499,
  foldFull: [499]
}, {
  code: 498,
  lower: [],
  title: [],
  upper: [],
  fold: 499,
  foldFull: [499]
}, {
  code: 500,
  lower: [],
  title: [],
  upper: [],
  fold: 501,
  foldFull: [501]
}, {
  code: 502,
  lower: [],
  title: [],
  upper: [],
  fold: 405,
  foldFull: [405]
}, {
  code: 503,
  lower: [],
  title: [],
  upper: [],
  fold: 447,
  foldFull: [447]
}, {
  code: 504,
  lower: [],
  title: [],
  upper: [],
  fold: 505,
  foldFull: [505]
}, {
  code: 506,
  lower: [],
  title: [],
  upper: [],
  fold: 507,
  foldFull: [507]
}, {
  code: 508,
  lower: [],
  title: [],
  upper: [],
  fold: 509,
  foldFull: [509]
}, {
  code: 510,
  lower: [],
  title: [],
  upper: [],
  fold: 511,
  foldFull: [511]
}, {
  code: 512,
  lower: [],
  title: [],
  upper: [],
  fold: 513,
  foldFull: [513]
}, {
  code: 514,
  lower: [],
  title: [],
  upper: [],
  fold: 515,
  foldFull: [515]
}, {
  code: 516,
  lower: [],
  title: [],
  upper: [],
  fold: 517,
  foldFull: [517]
}, {
  code: 518,
  lower: [],
  title: [],
  upper: [],
  fold: 519,
  foldFull: [519]
}, {
  code: 520,
  lower: [],
  title: [],
  upper: [],
  fold: 521,
  foldFull: [521]
}, {
  code: 522,
  lower: [],
  title: [],
  upper: [],
  fold: 523,
  foldFull: [523]
}, {
  code: 524,
  lower: [],
  title: [],
  upper: [],
  fold: 525,
  foldFull: [525]
}, {
  code: 526,
  lower: [],
  title: [],
  upper: [],
  fold: 527,
  foldFull: [527]
}, {
  code: 528,
  lower: [],
  title: [],
  upper: [],
  fold: 529,
  foldFull: [529]
}, {
  code: 530,
  lower: [],
  title: [],
  upper: [],
  fold: 531,
  foldFull: [531]
}, {
  code: 532,
  lower: [],
  title: [],
  upper: [],
  fold: 533,
  foldFull: [533]
}, {
  code: 534,
  lower: [],
  title: [],
  upper: [],
  fold: 535,
  foldFull: [535]
}, {
  code: 536,
  lower: [],
  title: [],
  upper: [],
  fold: 537,
  foldFull: [537]
}, {
  code: 538,
  lower: [],
  title: [],
  upper: [],
  fold: 539,
  foldFull: [539]
}, {
  code: 540,
  lower: [],
  title: [],
  upper: [],
  fold: 541,
  foldFull: [541]
}, {
  code: 542,
  lower: [],
  title: [],
  upper: [],
  fold: 543,
  foldFull: [543]
}, {
  code: 544,
  lower: [],
  title: [],
  upper: [],
  fold: 414,
  foldFull: [414]
}, {
  code: 546,
  lower: [],
  title: [],
  upper: [],
  fold: 547,
  foldFull: [547]
}, {
  code: 548,
  lower: [],
  title: [],
  upper: [],
  fold: 549,
  foldFull: [549]
}, {
  code: 550,
  lower: [],
  title: [],
  upper: [],
  fold: 551,
  foldFull: [551]
}, {
  code: 552,
  lower: [],
  title: [],
  upper: [],
  fold: 553,
  foldFull: [553]
}, {
  code: 554,
  lower: [],
  title: [],
  upper: [],
  fold: 555,
  foldFull: [555]
}, {
  code: 556,
  lower: [],
  title: [],
  upper: [],
  fold: 557,
  foldFull: [557]
}, {
  code: 558,
  lower: [],
  title: [],
  upper: [],
  fold: 559,
  foldFull: [559]
}, {
  code: 560,
  lower: [],
  title: [],
  upper: [],
  fold: 561,
  foldFull: [561]
}, {
  code: 562,
  lower: [],
  title: [],
  upper: [],
  fold: 563,
  foldFull: [563]
}, {
  code: 570,
  lower: [],
  title: [],
  upper: [],
  fold: 11365,
  foldFull: [11365]
}, {
  code: 571,
  lower: [],
  title: [],
  upper: [],
  fold: 572,
  foldFull: [572]
}, {
  code: 573,
  lower: [],
  title: [],
  upper: [],
  fold: 410,
  foldFull: [410]
}, {
  code: 574,
  lower: [],
  title: [],
  upper: [],
  fold: 11366,
  foldFull: [11366]
}, {
  code: 577,
  lower: [],
  title: [],
  upper: [],
  fold: 578,
  foldFull: [578]
}, {
  code: 579,
  lower: [],
  title: [],
  upper: [],
  fold: 384,
  foldFull: [384]
}, {
  code: 580,
  lower: [],
  title: [],
  upper: [],
  fold: 649,
  foldFull: [649]
}, {
  code: 581,
  lower: [],
  title: [],
  upper: [],
  fold: 652,
  foldFull: [652]
}, {
  code: 582,
  lower: [],
  title: [],
  upper: [],
  fold: 583,
  foldFull: [583]
}, {
  code: 584,
  lower: [],
  title: [],
  upper: [],
  fold: 585,
  foldFull: [585]
}, {
  code: 586,
  lower: [],
  title: [],
  upper: [],
  fold: 587,
  foldFull: [587]
}, {
  code: 588,
  lower: [],
  title: [],
  upper: [],
  fold: 589,
  foldFull: [589]
}, {
  code: 590,
  lower: [],
  title: [],
  upper: [],
  fold: 591,
  foldFull: [591]
}, {
  code: 837,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 880,
  lower: [],
  title: [],
  upper: [],
  fold: 881,
  foldFull: [881]
}, {
  code: 882,
  lower: [],
  title: [],
  upper: [],
  fold: 883,
  foldFull: [883]
}, {
  code: 886,
  lower: [],
  title: [],
  upper: [],
  fold: 887,
  foldFull: [887]
}, {
  code: 895,
  lower: [],
  title: [],
  upper: [],
  fold: 1011,
  foldFull: [1011]
}, {
  code: 902,
  lower: [],
  title: [],
  upper: [],
  fold: 940,
  foldFull: [940]
}, {
  code: 904,
  lower: [],
  title: [],
  upper: [],
  fold: 941,
  foldFull: [941]
}, {
  code: 905,
  lower: [],
  title: [],
  upper: [],
  fold: 942,
  foldFull: [942]
}, {
  code: 906,
  lower: [],
  title: [],
  upper: [],
  fold: 943,
  foldFull: [943]
}, {
  code: 908,
  lower: [],
  title: [],
  upper: [],
  fold: 972,
  foldFull: [972]
}, {
  code: 910,
  lower: [],
  title: [],
  upper: [],
  fold: 973,
  foldFull: [973]
}, {
  code: 911,
  lower: [],
  title: [],
  upper: [],
  fold: 974,
  foldFull: [974]
}, {
  code: 912,
  lower: [912],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 912,
  lower: [912],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 913,
  lower: [],
  title: [],
  upper: [],
  fold: 945,
  foldFull: [945]
}, {
  code: 914,
  lower: [],
  title: [],
  upper: [],
  fold: 946,
  foldFull: [946]
}, {
  code: 915,
  lower: [],
  title: [],
  upper: [],
  fold: 947,
  foldFull: [947]
}, {
  code: 916,
  lower: [],
  title: [],
  upper: [],
  fold: 948,
  foldFull: [948]
}, {
  code: 917,
  lower: [],
  title: [],
  upper: [],
  fold: 949,
  foldFull: [949]
}, {
  code: 918,
  lower: [],
  title: [],
  upper: [],
  fold: 950,
  foldFull: [950]
}, {
  code: 919,
  lower: [],
  title: [],
  upper: [],
  fold: 951,
  foldFull: [951]
}, {
  code: 920,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 921,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 922,
  lower: [],
  title: [],
  upper: [],
  fold: 954,
  foldFull: [954]
}, {
  code: 923,
  lower: [],
  title: [],
  upper: [],
  fold: 955,
  foldFull: [955]
}, {
  code: 924,
  lower: [],
  title: [],
  upper: [],
  fold: 956,
  foldFull: [956]
}, {
  code: 925,
  lower: [],
  title: [],
  upper: [],
  fold: 957,
  foldFull: [957]
}, {
  code: 926,
  lower: [],
  title: [],
  upper: [],
  fold: 958,
  foldFull: [958]
}, {
  code: 927,
  lower: [],
  title: [],
  upper: [],
  fold: 959,
  foldFull: [959]
}, {
  code: 928,
  lower: [],
  title: [],
  upper: [],
  fold: 960,
  foldFull: [960]
}, {
  code: 929,
  lower: [],
  title: [],
  upper: [],
  fold: 961,
  foldFull: [961]
}, {
  code: 931,
  lower: [],
  title: [],
  upper: [],
  fold: 963,
  foldFull: [963]
}, {
  code: 932,
  lower: [],
  title: [],
  upper: [],
  fold: 964,
  foldFull: [964]
}, {
  code: 933,
  lower: [],
  title: [],
  upper: [],
  fold: 965,
  foldFull: [965]
}, {
  code: 934,
  lower: [],
  title: [],
  upper: [],
  fold: 966,
  foldFull: [966]
}, {
  code: 935,
  lower: [],
  title: [],
  upper: [],
  fold: 967,
  foldFull: [967]
}, {
  code: 936,
  lower: [],
  title: [],
  upper: [],
  fold: 968,
  foldFull: [968]
}, {
  code: 937,
  lower: [],
  title: [],
  upper: [],
  fold: 969,
  foldFull: [969]
}, {
  code: 938,
  lower: [],
  title: [],
  upper: [],
  fold: 970,
  foldFull: [970]
}, {
  code: 939,
  lower: [],
  title: [],
  upper: [],
  fold: 971,
  foldFull: [971]
}, {
  code: 944,
  lower: [944],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 944,
  lower: [944],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 962,
  lower: [],
  title: [],
  upper: [],
  fold: 963,
  foldFull: [963]
}, {
  code: 975,
  lower: [],
  title: [],
  upper: [],
  fold: 983,
  foldFull: [983]
}, {
  code: 976,
  lower: [],
  title: [],
  upper: [],
  fold: 946,
  foldFull: [946]
}, {
  code: 977,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 981,
  lower: [],
  title: [],
  upper: [],
  fold: 966,
  foldFull: [966]
}, {
  code: 982,
  lower: [],
  title: [],
  upper: [],
  fold: 960,
  foldFull: [960]
}, {
  code: 984,
  lower: [],
  title: [],
  upper: [],
  fold: 985,
  foldFull: [985]
}, {
  code: 986,
  lower: [],
  title: [],
  upper: [],
  fold: 987,
  foldFull: [987]
}, {
  code: 988,
  lower: [],
  title: [],
  upper: [],
  fold: 989,
  foldFull: [989]
}, {
  code: 990,
  lower: [],
  title: [],
  upper: [],
  fold: 991,
  foldFull: [991]
}, {
  code: 992,
  lower: [],
  title: [],
  upper: [],
  fold: 993,
  foldFull: [993]
}, {
  code: 994,
  lower: [],
  title: [],
  upper: [],
  fold: 995,
  foldFull: [995]
}, {
  code: 996,
  lower: [],
  title: [],
  upper: [],
  fold: 997,
  foldFull: [997]
}, {
  code: 998,
  lower: [],
  title: [],
  upper: [],
  fold: 999,
  foldFull: [999]
}, {
  code: 1e3,
  lower: [],
  title: [],
  upper: [],
  fold: 1001,
  foldFull: [1001]
}, {
  code: 1002,
  lower: [],
  title: [],
  upper: [],
  fold: 1003,
  foldFull: [1003]
}, {
  code: 1004,
  lower: [],
  title: [],
  upper: [],
  fold: 1005,
  foldFull: [1005]
}, {
  code: 1006,
  lower: [],
  title: [],
  upper: [],
  fold: 1007,
  foldFull: [1007]
}, {
  code: 1008,
  lower: [],
  title: [],
  upper: [],
  fold: 954,
  foldFull: [954]
}, {
  code: 1009,
  lower: [],
  title: [],
  upper: [],
  fold: 961,
  foldFull: [961]
}, {
  code: 1012,
  lower: [],
  title: [],
  upper: [],
  fold: 952,
  foldFull: [952]
}, {
  code: 1013,
  lower: [],
  title: [],
  upper: [],
  fold: 949,
  foldFull: [949]
}, {
  code: 1015,
  lower: [],
  title: [],
  upper: [],
  fold: 1016,
  foldFull: [1016]
}, {
  code: 1017,
  lower: [],
  title: [],
  upper: [],
  fold: 1010,
  foldFull: [1010]
}, {
  code: 1018,
  lower: [],
  title: [],
  upper: [],
  fold: 1019,
  foldFull: [1019]
}, {
  code: 1021,
  lower: [],
  title: [],
  upper: [],
  fold: 891,
  foldFull: [891]
}, {
  code: 1022,
  lower: [],
  title: [],
  upper: [],
  fold: 892,
  foldFull: [892]
}, {
  code: 1023,
  lower: [],
  title: [],
  upper: [],
  fold: 893,
  foldFull: [893]
}, {
  code: 1024,
  lower: [],
  title: [],
  upper: [],
  fold: 1104,
  foldFull: [1104]
}, {
  code: 1025,
  lower: [],
  title: [],
  upper: [],
  fold: 1105,
  foldFull: [1105]
}, {
  code: 1026,
  lower: [],
  title: [],
  upper: [],
  fold: 1106,
  foldFull: [1106]
}, {
  code: 1027,
  lower: [],
  title: [],
  upper: [],
  fold: 1107,
  foldFull: [1107]
}, {
  code: 1028,
  lower: [],
  title: [],
  upper: [],
  fold: 1108,
  foldFull: [1108]
}, {
  code: 1029,
  lower: [],
  title: [],
  upper: [],
  fold: 1109,
  foldFull: [1109]
}, {
  code: 1030,
  lower: [],
  title: [],
  upper: [],
  fold: 1110,
  foldFull: [1110]
}, {
  code: 1031,
  lower: [],
  title: [],
  upper: [],
  fold: 1111,
  foldFull: [1111]
}, {
  code: 1032,
  lower: [],
  title: [],
  upper: [],
  fold: 1112,
  foldFull: [1112]
}, {
  code: 1033,
  lower: [],
  title: [],
  upper: [],
  fold: 1113,
  foldFull: [1113]
}, {
  code: 1034,
  lower: [],
  title: [],
  upper: [],
  fold: 1114,
  foldFull: [1114]
}, {
  code: 1035,
  lower: [],
  title: [],
  upper: [],
  fold: 1115,
  foldFull: [1115]
}, {
  code: 1036,
  lower: [],
  title: [],
  upper: [],
  fold: 1116,
  foldFull: [1116]
}, {
  code: 1037,
  lower: [],
  title: [],
  upper: [],
  fold: 1117,
  foldFull: [1117]
}, {
  code: 1038,
  lower: [],
  title: [],
  upper: [],
  fold: 1118,
  foldFull: [1118]
}, {
  code: 1039,
  lower: [],
  title: [],
  upper: [],
  fold: 1119,
  foldFull: [1119]
}, {
  code: 1040,
  lower: [],
  title: [],
  upper: [],
  fold: 1072,
  foldFull: [1072]
}, {
  code: 1041,
  lower: [],
  title: [],
  upper: [],
  fold: 1073,
  foldFull: [1073]
}, {
  code: 1042,
  lower: [],
  title: [],
  upper: [],
  fold: 1074,
  foldFull: [1074]
}, {
  code: 1043,
  lower: [],
  title: [],
  upper: [],
  fold: 1075,
  foldFull: [1075]
}, {
  code: 1044,
  lower: [],
  title: [],
  upper: [],
  fold: 1076,
  foldFull: [1076]
}, {
  code: 1045,
  lower: [],
  title: [],
  upper: [],
  fold: 1077,
  foldFull: [1077]
}, {
  code: 1046,
  lower: [],
  title: [],
  upper: [],
  fold: 1078,
  foldFull: [1078]
}, {
  code: 1047,
  lower: [],
  title: [],
  upper: [],
  fold: 1079,
  foldFull: [1079]
}, {
  code: 1048,
  lower: [],
  title: [],
  upper: [],
  fold: 1080,
  foldFull: [1080]
}, {
  code: 1049,
  lower: [],
  title: [],
  upper: [],
  fold: 1081,
  foldFull: [1081]
}, {
  code: 1050,
  lower: [],
  title: [],
  upper: [],
  fold: 1082,
  foldFull: [1082]
}, {
  code: 1051,
  lower: [],
  title: [],
  upper: [],
  fold: 1083,
  foldFull: [1083]
}, {
  code: 1052,
  lower: [],
  title: [],
  upper: [],
  fold: 1084,
  foldFull: [1084]
}, {
  code: 1053,
  lower: [],
  title: [],
  upper: [],
  fold: 1085,
  foldFull: [1085]
}, {
  code: 1054,
  lower: [],
  title: [],
  upper: [],
  fold: 1086,
  foldFull: [1086]
}, {
  code: 1055,
  lower: [],
  title: [],
  upper: [],
  fold: 1087,
  foldFull: [1087]
}, {
  code: 1056,
  lower: [],
  title: [],
  upper: [],
  fold: 1088,
  foldFull: [1088]
}, {
  code: 1057,
  lower: [],
  title: [],
  upper: [],
  fold: 1089,
  foldFull: [1089]
}, {
  code: 1058,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 1059,
  lower: [],
  title: [],
  upper: [],
  fold: 1091,
  foldFull: [1091]
}, {
  code: 1060,
  lower: [],
  title: [],
  upper: [],
  fold: 1092,
  foldFull: [1092]
}, {
  code: 1061,
  lower: [],
  title: [],
  upper: [],
  fold: 1093,
  foldFull: [1093]
}, {
  code: 1062,
  lower: [],
  title: [],
  upper: [],
  fold: 1094,
  foldFull: [1094]
}, {
  code: 1063,
  lower: [],
  title: [],
  upper: [],
  fold: 1095,
  foldFull: [1095]
}, {
  code: 1064,
  lower: [],
  title: [],
  upper: [],
  fold: 1096,
  foldFull: [1096]
}, {
  code: 1065,
  lower: [],
  title: [],
  upper: [],
  fold: 1097,
  foldFull: [1097]
}, {
  code: 1066,
  lower: [],
  title: [],
  upper: [],
  fold: 1098,
  foldFull: [1098]
}, {
  code: 1067,
  lower: [],
  title: [],
  upper: [],
  fold: 1099,
  foldFull: [1099]
}, {
  code: 1068,
  lower: [],
  title: [],
  upper: [],
  fold: 1100,
  foldFull: [1100]
}, {
  code: 1069,
  lower: [],
  title: [],
  upper: [],
  fold: 1101,
  foldFull: [1101]
}, {
  code: 1070,
  lower: [],
  title: [],
  upper: [],
  fold: 1102,
  foldFull: [1102]
}, {
  code: 1071,
  lower: [],
  title: [],
  upper: [],
  fold: 1103,
  foldFull: [1103]
}, {
  code: 1120,
  lower: [],
  title: [],
  upper: [],
  fold: 1121,
  foldFull: [1121]
}, {
  code: 1122,
  lower: [],
  title: [],
  upper: [],
  fold: 1123,
  foldFull: [1123]
}, {
  code: 1124,
  lower: [],
  title: [],
  upper: [],
  fold: 1125,
  foldFull: [1125]
}, {
  code: 1126,
  lower: [],
  title: [],
  upper: [],
  fold: 1127,
  foldFull: [1127]
}, {
  code: 1128,
  lower: [],
  title: [],
  upper: [],
  fold: 1129,
  foldFull: [1129]
}, {
  code: 1130,
  lower: [],
  title: [],
  upper: [],
  fold: 1131,
  foldFull: [1131]
}, {
  code: 1132,
  lower: [],
  title: [],
  upper: [],
  fold: 1133,
  foldFull: [1133]
}, {
  code: 1134,
  lower: [],
  title: [],
  upper: [],
  fold: 1135,
  foldFull: [1135]
}, {
  code: 1136,
  lower: [],
  title: [],
  upper: [],
  fold: 1137,
  foldFull: [1137]
}, {
  code: 1138,
  lower: [],
  title: [],
  upper: [],
  fold: 1139,
  foldFull: [1139]
}, {
  code: 1140,
  lower: [],
  title: [],
  upper: [],
  fold: 1141,
  foldFull: [1141]
}, {
  code: 1142,
  lower: [],
  title: [],
  upper: [],
  fold: 1143,
  foldFull: [1143]
}, {
  code: 1144,
  lower: [],
  title: [],
  upper: [],
  fold: 1145,
  foldFull: [1145]
}, {
  code: 1146,
  lower: [],
  title: [],
  upper: [],
  fold: 1147,
  foldFull: [1147]
}, {
  code: 1148,
  lower: [],
  title: [],
  upper: [],
  fold: 1149,
  foldFull: [1149]
}, {
  code: 1150,
  lower: [],
  title: [],
  upper: [],
  fold: 1151,
  foldFull: [1151]
}, {
  code: 1152,
  lower: [],
  title: [],
  upper: [],
  fold: 1153,
  foldFull: [1153]
}, {
  code: 1162,
  lower: [],
  title: [],
  upper: [],
  fold: 1163,
  foldFull: [1163]
}, {
  code: 1164,
  lower: [],
  title: [],
  upper: [],
  fold: 1165,
  foldFull: [1165]
}, {
  code: 1166,
  lower: [],
  title: [],
  upper: [],
  fold: 1167,
  foldFull: [1167]
}, {
  code: 1168,
  lower: [],
  title: [],
  upper: [],
  fold: 1169,
  foldFull: [1169]
}, {
  code: 1170,
  lower: [],
  title: [],
  upper: [],
  fold: 1171,
  foldFull: [1171]
}, {
  code: 1172,
  lower: [],
  title: [],
  upper: [],
  fold: 1173,
  foldFull: [1173]
}, {
  code: 1174,
  lower: [],
  title: [],
  upper: [],
  fold: 1175,
  foldFull: [1175]
}, {
  code: 1176,
  lower: [],
  title: [],
  upper: [],
  fold: 1177,
  foldFull: [1177]
}, {
  code: 1178,
  lower: [],
  title: [],
  upper: [],
  fold: 1179,
  foldFull: [1179]
}, {
  code: 1180,
  lower: [],
  title: [],
  upper: [],
  fold: 1181,
  foldFull: [1181]
}, {
  code: 1182,
  lower: [],
  title: [],
  upper: [],
  fold: 1183,
  foldFull: [1183]
}, {
  code: 1184,
  lower: [],
  title: [],
  upper: [],
  fold: 1185,
  foldFull: [1185]
}, {
  code: 1186,
  lower: [],
  title: [],
  upper: [],
  fold: 1187,
  foldFull: [1187]
}, {
  code: 1188,
  lower: [],
  title: [],
  upper: [],
  fold: 1189,
  foldFull: [1189]
}, {
  code: 1190,
  lower: [],
  title: [],
  upper: [],
  fold: 1191,
  foldFull: [1191]
}, {
  code: 1192,
  lower: [],
  title: [],
  upper: [],
  fold: 1193,
  foldFull: [1193]
}, {
  code: 1194,
  lower: [],
  title: [],
  upper: [],
  fold: 1195,
  foldFull: [1195]
}, {
  code: 1196,
  lower: [],
  title: [],
  upper: [],
  fold: 1197,
  foldFull: [1197]
}, {
  code: 1198,
  lower: [],
  title: [],
  upper: [],
  fold: 1199,
  foldFull: [1199]
}, {
  code: 1200,
  lower: [],
  title: [],
  upper: [],
  fold: 1201,
  foldFull: [1201]
}, {
  code: 1202,
  lower: [],
  title: [],
  upper: [],
  fold: 1203,
  foldFull: [1203]
}, {
  code: 1204,
  lower: [],
  title: [],
  upper: [],
  fold: 1205,
  foldFull: [1205]
}, {
  code: 1206,
  lower: [],
  title: [],
  upper: [],
  fold: 1207,
  foldFull: [1207]
}, {
  code: 1208,
  lower: [],
  title: [],
  upper: [],
  fold: 1209,
  foldFull: [1209]
}, {
  code: 1210,
  lower: [],
  title: [],
  upper: [],
  fold: 1211,
  foldFull: [1211]
}, {
  code: 1212,
  lower: [],
  title: [],
  upper: [],
  fold: 1213,
  foldFull: [1213]
}, {
  code: 1214,
  lower: [],
  title: [],
  upper: [],
  fold: 1215,
  foldFull: [1215]
}, {
  code: 1216,
  lower: [],
  title: [],
  upper: [],
  fold: 1231,
  foldFull: [1231]
}, {
  code: 1217,
  lower: [],
  title: [],
  upper: [],
  fold: 1218,
  foldFull: [1218]
}, {
  code: 1219,
  lower: [],
  title: [],
  upper: [],
  fold: 1220,
  foldFull: [1220]
}, {
  code: 1221,
  lower: [],
  title: [],
  upper: [],
  fold: 1222,
  foldFull: [1222]
}, {
  code: 1223,
  lower: [],
  title: [],
  upper: [],
  fold: 1224,
  foldFull: [1224]
}, {
  code: 1225,
  lower: [],
  title: [],
  upper: [],
  fold: 1226,
  foldFull: [1226]
}, {
  code: 1227,
  lower: [],
  title: [],
  upper: [],
  fold: 1228,
  foldFull: [1228]
}, {
  code: 1229,
  lower: [],
  title: [],
  upper: [],
  fold: 1230,
  foldFull: [1230]
}, {
  code: 1232,
  lower: [],
  title: [],
  upper: [],
  fold: 1233,
  foldFull: [1233]
}, {
  code: 1234,
  lower: [],
  title: [],
  upper: [],
  fold: 1235,
  foldFull: [1235]
}, {
  code: 1236,
  lower: [],
  title: [],
  upper: [],
  fold: 1237,
  foldFull: [1237]
}, {
  code: 1238,
  lower: [],
  title: [],
  upper: [],
  fold: 1239,
  foldFull: [1239]
}, {
  code: 1240,
  lower: [],
  title: [],
  upper: [],
  fold: 1241,
  foldFull: [1241]
}, {
  code: 1242,
  lower: [],
  title: [],
  upper: [],
  fold: 1243,
  foldFull: [1243]
}, {
  code: 1244,
  lower: [],
  title: [],
  upper: [],
  fold: 1245,
  foldFull: [1245]
}, {
  code: 1246,
  lower: [],
  title: [],
  upper: [],
  fold: 1247,
  foldFull: [1247]
}, {
  code: 1248,
  lower: [],
  title: [],
  upper: [],
  fold: 1249,
  foldFull: [1249]
}, {
  code: 1250,
  lower: [],
  title: [],
  upper: [],
  fold: 1251,
  foldFull: [1251]
}, {
  code: 1252,
  lower: [],
  title: [],
  upper: [],
  fold: 1253,
  foldFull: [1253]
}, {
  code: 1254,
  lower: [],
  title: [],
  upper: [],
  fold: 1255,
  foldFull: [1255]
}, {
  code: 1256,
  lower: [],
  title: [],
  upper: [],
  fold: 1257,
  foldFull: [1257]
}, {
  code: 1258,
  lower: [],
  title: [],
  upper: [],
  fold: 1259,
  foldFull: [1259]
}, {
  code: 1260,
  lower: [],
  title: [],
  upper: [],
  fold: 1261,
  foldFull: [1261]
}, {
  code: 1262,
  lower: [],
  title: [],
  upper: [],
  fold: 1263,
  foldFull: [1263]
}, {
  code: 1264,
  lower: [],
  title: [],
  upper: [],
  fold: 1265,
  foldFull: [1265]
}, {
  code: 1266,
  lower: [],
  title: [],
  upper: [],
  fold: 1267,
  foldFull: [1267]
}, {
  code: 1268,
  lower: [],
  title: [],
  upper: [],
  fold: 1269,
  foldFull: [1269]
}, {
  code: 1270,
  lower: [],
  title: [],
  upper: [],
  fold: 1271,
  foldFull: [1271]
}, {
  code: 1272,
  lower: [],
  title: [],
  upper: [],
  fold: 1273,
  foldFull: [1273]
}, {
  code: 1274,
  lower: [],
  title: [],
  upper: [],
  fold: 1275,
  foldFull: [1275]
}, {
  code: 1276,
  lower: [],
  title: [],
  upper: [],
  fold: 1277,
  foldFull: [1277]
}, {
  code: 1278,
  lower: [],
  title: [],
  upper: [],
  fold: 1279,
  foldFull: [1279]
}, {
  code: 1280,
  lower: [],
  title: [],
  upper: [],
  fold: 1281,
  foldFull: [1281]
}, {
  code: 1282,
  lower: [],
  title: [],
  upper: [],
  fold: 1283,
  foldFull: [1283]
}, {
  code: 1284,
  lower: [],
  title: [],
  upper: [],
  fold: 1285,
  foldFull: [1285]
}, {
  code: 1286,
  lower: [],
  title: [],
  upper: [],
  fold: 1287,
  foldFull: [1287]
}, {
  code: 1288,
  lower: [],
  title: [],
  upper: [],
  fold: 1289,
  foldFull: [1289]
}, {
  code: 1290,
  lower: [],
  title: [],
  upper: [],
  fold: 1291,
  foldFull: [1291]
}, {
  code: 1292,
  lower: [],
  title: [],
  upper: [],
  fold: 1293,
  foldFull: [1293]
}, {
  code: 1294,
  lower: [],
  title: [],
  upper: [],
  fold: 1295,
  foldFull: [1295]
}, {
  code: 1296,
  lower: [],
  title: [],
  upper: [],
  fold: 1297,
  foldFull: [1297]
}, {
  code: 1298,
  lower: [],
  title: [],
  upper: [],
  fold: 1299,
  foldFull: [1299]
}, {
  code: 1300,
  lower: [],
  title: [],
  upper: [],
  fold: 1301,
  foldFull: [1301]
}, {
  code: 1302,
  lower: [],
  title: [],
  upper: [],
  fold: 1303,
  foldFull: [1303]
}, {
  code: 1304,
  lower: [],
  title: [],
  upper: [],
  fold: 1305,
  foldFull: [1305]
}, {
  code: 1306,
  lower: [],
  title: [],
  upper: [],
  fold: 1307,
  foldFull: [1307]
}, {
  code: 1308,
  lower: [],
  title: [],
  upper: [],
  fold: 1309,
  foldFull: [1309]
}, {
  code: 1310,
  lower: [],
  title: [],
  upper: [],
  fold: 1311,
  foldFull: [1311]
}, {
  code: 1312,
  lower: [],
  title: [],
  upper: [],
  fold: 1313,
  foldFull: [1313]
}, {
  code: 1314,
  lower: [],
  title: [],
  upper: [],
  fold: 1315,
  foldFull: [1315]
}, {
  code: 1316,
  lower: [],
  title: [],
  upper: [],
  fold: 1317,
  foldFull: [1317]
}, {
  code: 1318,
  lower: [],
  title: [],
  upper: [],
  fold: 1319,
  foldFull: [1319]
}, {
  code: 1320,
  lower: [],
  title: [],
  upper: [],
  fold: 1321,
  foldFull: [1321]
}, {
  code: 1322,
  lower: [],
  title: [],
  upper: [],
  fold: 1323,
  foldFull: [1323]
}, {
  code: 1324,
  lower: [],
  title: [],
  upper: [],
  fold: 1325,
  foldFull: [1325]
}, {
  code: 1326,
  lower: [],
  title: [],
  upper: [],
  fold: 1327,
  foldFull: [1327]
}, {
  code: 1329,
  lower: [],
  title: [],
  upper: [],
  fold: 1377,
  foldFull: [1377]
}, {
  code: 1330,
  lower: [],
  title: [],
  upper: [],
  fold: 1378,
  foldFull: [1378]
}, {
  code: 1331,
  lower: [],
  title: [],
  upper: [],
  fold: 1379,
  foldFull: [1379]
}, {
  code: 1332,
  lower: [],
  title: [],
  upper: [],
  fold: 1380,
  foldFull: [1380]
}, {
  code: 1333,
  lower: [],
  title: [],
  upper: [],
  fold: 1381,
  foldFull: [1381]
}, {
  code: 1334,
  lower: [],
  title: [],
  upper: [],
  fold: 1382,
  foldFull: [1382]
}, {
  code: 1335,
  lower: [],
  title: [],
  upper: [],
  fold: 1383,
  foldFull: [1383]
}, {
  code: 1336,
  lower: [],
  title: [],
  upper: [],
  fold: 1384,
  foldFull: [1384]
}, {
  code: 1337,
  lower: [],
  title: [],
  upper: [],
  fold: 1385,
  foldFull: [1385]
}, {
  code: 1338,
  lower: [],
  title: [],
  upper: [],
  fold: 1386,
  foldFull: [1386]
}, {
  code: 1339,
  lower: [],
  title: [],
  upper: [],
  fold: 1387,
  foldFull: [1387]
}, {
  code: 1340,
  lower: [],
  title: [],
  upper: [],
  fold: 1388,
  foldFull: [1388]
}, {
  code: 1341,
  lower: [],
  title: [],
  upper: [],
  fold: 1389,
  foldFull: [1389]
}, {
  code: 1342,
  lower: [],
  title: [],
  upper: [],
  fold: 1390,
  foldFull: [1390]
}, {
  code: 1343,
  lower: [],
  title: [],
  upper: [],
  fold: 1391,
  foldFull: [1391]
}, {
  code: 1344,
  lower: [],
  title: [],
  upper: [],
  fold: 1392,
  foldFull: [1392]
}, {
  code: 1345,
  lower: [],
  title: [],
  upper: [],
  fold: 1393,
  foldFull: [1393]
}, {
  code: 1346,
  lower: [],
  title: [],
  upper: [],
  fold: 1394,
  foldFull: [1394]
}, {
  code: 1347,
  lower: [],
  title: [],
  upper: [],
  fold: 1395,
  foldFull: [1395]
}, {
  code: 1348,
  lower: [],
  title: [],
  upper: [],
  fold: 1396,
  foldFull: [1396]
}, {
  code: 1349,
  lower: [],
  title: [],
  upper: [],
  fold: 1397,
  foldFull: [1397]
}, {
  code: 1350,
  lower: [],
  title: [],
  upper: [],
  fold: 1398,
  foldFull: [1398]
}, {
  code: 1351,
  lower: [],
  title: [],
  upper: [],
  fold: 1399,
  foldFull: [1399]
}, {
  code: 1352,
  lower: [],
  title: [],
  upper: [],
  fold: 1400,
  foldFull: [1400]
}, {
  code: 1353,
  lower: [],
  title: [],
  upper: [],
  fold: 1401,
  foldFull: [1401]
}, {
  code: 1354,
  lower: [],
  title: [],
  upper: [],
  fold: 1402,
  foldFull: [1402]
}, {
  code: 1355,
  lower: [],
  title: [],
  upper: [],
  fold: 1403,
  foldFull: [1403]
}, {
  code: 1356,
  lower: [],
  title: [],
  upper: [],
  fold: 1404,
  foldFull: [1404]
}, {
  code: 1357,
  lower: [],
  title: [],
  upper: [],
  fold: 1405,
  foldFull: [1405]
}, {
  code: 1358,
  lower: [],
  title: [],
  upper: [],
  fold: 1406,
  foldFull: [1406]
}, {
  code: 1359,
  lower: [],
  title: [],
  upper: [],
  fold: 1407,
  foldFull: [1407]
}, {
  code: 1360,
  lower: [],
  title: [],
  upper: [],
  fold: 1408,
  foldFull: [1408]
}, {
  code: 1361,
  lower: [],
  title: [],
  upper: [],
  fold: 1409,
  foldFull: [1409]
}, {
  code: 1362,
  lower: [],
  title: [],
  upper: [],
  fold: 1410,
  foldFull: [1410]
}, {
  code: 1363,
  lower: [],
  title: [],
  upper: [],
  fold: 1411,
  foldFull: [1411]
}, {
  code: 1364,
  lower: [],
  title: [],
  upper: [],
  fold: 1412,
  foldFull: [1412]
}, {
  code: 1365,
  lower: [],
  title: [],
  upper: [],
  fold: 1413,
  foldFull: [1413]
}, {
  code: 1366,
  lower: [],
  title: [],
  upper: [],
  fold: 1414,
  foldFull: [1414]
}, {
  code: 1415,
  lower: [1415],
  title: [1333, 1410],
  upper: [1333, 1362],
  fold: 0,
  foldFull: [1381, 1410]
}, {
  code: 1415,
  lower: [1415],
  title: [1333, 1410],
  upper: [1333, 1362],
  fold: 0,
  foldFull: [1381, 1410]
}, {
  code: 4256,
  lower: [],
  title: [],
  upper: [],
  fold: 11520,
  foldFull: [11520]
}, {
  code: 4257,
  lower: [],
  title: [],
  upper: [],
  fold: 11521,
  foldFull: [11521]
}, {
  code: 4258,
  lower: [],
  title: [],
  upper: [],
  fold: 11522,
  foldFull: [11522]
}, {
  code: 4259,
  lower: [],
  title: [],
  upper: [],
  fold: 11523,
  foldFull: [11523]
}, {
  code: 4260,
  lower: [],
  title: [],
  upper: [],
  fold: 11524,
  foldFull: [11524]
}, {
  code: 4261,
  lower: [],
  title: [],
  upper: [],
  fold: 11525,
  foldFull: [11525]
}, {
  code: 4262,
  lower: [],
  title: [],
  upper: [],
  fold: 11526,
  foldFull: [11526]
}, {
  code: 4263,
  lower: [],
  title: [],
  upper: [],
  fold: 11527,
  foldFull: [11527]
}, {
  code: 4264,
  lower: [],
  title: [],
  upper: [],
  fold: 11528,
  foldFull: [11528]
}, {
  code: 4265,
  lower: [],
  title: [],
  upper: [],
  fold: 11529,
  foldFull: [11529]
}, {
  code: 4266,
  lower: [],
  title: [],
  upper: [],
  fold: 11530,
  foldFull: [11530]
}, {
  code: 4267,
  lower: [],
  title: [],
  upper: [],
  fold: 11531,
  foldFull: [11531]
}, {
  code: 4268,
  lower: [],
  title: [],
  upper: [],
  fold: 11532,
  foldFull: [11532]
}, {
  code: 4269,
  lower: [],
  title: [],
  upper: [],
  fold: 11533,
  foldFull: [11533]
}, {
  code: 4270,
  lower: [],
  title: [],
  upper: [],
  fold: 11534,
  foldFull: [11534]
}, {
  code: 4271,
  lower: [],
  title: [],
  upper: [],
  fold: 11535,
  foldFull: [11535]
}, {
  code: 4272,
  lower: [],
  title: [],
  upper: [],
  fold: 11536,
  foldFull: [11536]
}, {
  code: 4273,
  lower: [],
  title: [],
  upper: [],
  fold: 11537,
  foldFull: [11537]
}, {
  code: 4274,
  lower: [],
  title: [],
  upper: [],
  fold: 11538,
  foldFull: [11538]
}, {
  code: 4275,
  lower: [],
  title: [],
  upper: [],
  fold: 11539,
  foldFull: [11539]
}, {
  code: 4276,
  lower: [],
  title: [],
  upper: [],
  fold: 11540,
  foldFull: [11540]
}, {
  code: 4277,
  lower: [],
  title: [],
  upper: [],
  fold: 11541,
  foldFull: [11541]
}, {
  code: 4278,
  lower: [],
  title: [],
  upper: [],
  fold: 11542,
  foldFull: [11542]
}, {
  code: 4279,
  lower: [],
  title: [],
  upper: [],
  fold: 11543,
  foldFull: [11543]
}, {
  code: 4280,
  lower: [],
  title: [],
  upper: [],
  fold: 11544,
  foldFull: [11544]
}, {
  code: 4281,
  lower: [],
  title: [],
  upper: [],
  fold: 11545,
  foldFull: [11545]
}, {
  code: 4282,
  lower: [],
  title: [],
  upper: [],
  fold: 11546,
  foldFull: [11546]
}, {
  code: 4283,
  lower: [],
  title: [],
  upper: [],
  fold: 11547,
  foldFull: [11547]
}, {
  code: 4284,
  lower: [],
  title: [],
  upper: [],
  fold: 11548,
  foldFull: [11548]
}, {
  code: 4285,
  lower: [],
  title: [],
  upper: [],
  fold: 11549,
  foldFull: [11549]
}, {
  code: 4286,
  lower: [],
  title: [],
  upper: [],
  fold: 11550,
  foldFull: [11550]
}, {
  code: 4287,
  lower: [],
  title: [],
  upper: [],
  fold: 11551,
  foldFull: [11551]
}, {
  code: 4288,
  lower: [],
  title: [],
  upper: [],
  fold: 11552,
  foldFull: [11552]
}, {
  code: 4289,
  lower: [],
  title: [],
  upper: [],
  fold: 11553,
  foldFull: [11553]
}, {
  code: 4290,
  lower: [],
  title: [],
  upper: [],
  fold: 11554,
  foldFull: [11554]
}, {
  code: 4291,
  lower: [],
  title: [],
  upper: [],
  fold: 11555,
  foldFull: [11555]
}, {
  code: 4292,
  lower: [],
  title: [],
  upper: [],
  fold: 11556,
  foldFull: [11556]
}, {
  code: 4293,
  lower: [],
  title: [],
  upper: [],
  fold: 11557,
  foldFull: [11557]
}, {
  code: 4295,
  lower: [],
  title: [],
  upper: [],
  fold: 11559,
  foldFull: [11559]
}, {
  code: 4301,
  lower: [],
  title: [],
  upper: [],
  fold: 11565,
  foldFull: [11565]
}, {
  code: 5112,
  lower: [],
  title: [],
  upper: [],
  fold: 5104,
  foldFull: [5104]
}, {
  code: 5113,
  lower: [],
  title: [],
  upper: [],
  fold: 5105,
  foldFull: [5105]
}, {
  code: 5114,
  lower: [],
  title: [],
  upper: [],
  fold: 5106,
  foldFull: [5106]
}, {
  code: 5115,
  lower: [],
  title: [],
  upper: [],
  fold: 5107,
  foldFull: [5107]
}, {
  code: 5116,
  lower: [],
  title: [],
  upper: [],
  fold: 5108,
  foldFull: [5108]
}, {
  code: 5117,
  lower: [],
  title: [],
  upper: [],
  fold: 5109,
  foldFull: [5109]
}, {
  code: 7296,
  lower: [],
  title: [],
  upper: [],
  fold: 1074,
  foldFull: [1074]
}, {
  code: 7297,
  lower: [],
  title: [],
  upper: [],
  fold: 1076,
  foldFull: [1076]
}, {
  code: 7298,
  lower: [],
  title: [],
  upper: [],
  fold: 1086,
  foldFull: [1086]
}, {
  code: 7299,
  lower: [],
  title: [],
  upper: [],
  fold: 1089,
  foldFull: [1089]
}, {
  code: 7300,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 7301,
  lower: [],
  title: [],
  upper: [],
  fold: 1090,
  foldFull: [1090]
}, {
  code: 7302,
  lower: [],
  title: [],
  upper: [],
  fold: 1098,
  foldFull: [1098]
}, {
  code: 7303,
  lower: [],
  title: [],
  upper: [],
  fold: 1123,
  foldFull: [1123]
}, {
  code: 7304,
  lower: [],
  title: [],
  upper: [],
  fold: 42571,
  foldFull: [42571]
}, {
  code: 7312,
  lower: [],
  title: [],
  upper: [],
  fold: 4304,
  foldFull: [4304]
}, {
  code: 7313,
  lower: [],
  title: [],
  upper: [],
  fold: 4305,
  foldFull: [4305]
}, {
  code: 7314,
  lower: [],
  title: [],
  upper: [],
  fold: 4306,
  foldFull: [4306]
}, {
  code: 7315,
  lower: [],
  title: [],
  upper: [],
  fold: 4307,
  foldFull: [4307]
}, {
  code: 7316,
  lower: [],
  title: [],
  upper: [],
  fold: 4308,
  foldFull: [4308]
}, {
  code: 7317,
  lower: [],
  title: [],
  upper: [],
  fold: 4309,
  foldFull: [4309]
}, {
  code: 7318,
  lower: [],
  title: [],
  upper: [],
  fold: 4310,
  foldFull: [4310]
}, {
  code: 7319,
  lower: [],
  title: [],
  upper: [],
  fold: 4311,
  foldFull: [4311]
}, {
  code: 7320,
  lower: [],
  title: [],
  upper: [],
  fold: 4312,
  foldFull: [4312]
}, {
  code: 7321,
  lower: [],
  title: [],
  upper: [],
  fold: 4313,
  foldFull: [4313]
}, {
  code: 7322,
  lower: [],
  title: [],
  upper: [],
  fold: 4314,
  foldFull: [4314]
}, {
  code: 7323,
  lower: [],
  title: [],
  upper: [],
  fold: 4315,
  foldFull: [4315]
}, {
  code: 7324,
  lower: [],
  title: [],
  upper: [],
  fold: 4316,
  foldFull: [4316]
}, {
  code: 7325,
  lower: [],
  title: [],
  upper: [],
  fold: 4317,
  foldFull: [4317]
}, {
  code: 7326,
  lower: [],
  title: [],
  upper: [],
  fold: 4318,
  foldFull: [4318]
}, {
  code: 7327,
  lower: [],
  title: [],
  upper: [],
  fold: 4319,
  foldFull: [4319]
}, {
  code: 7328,
  lower: [],
  title: [],
  upper: [],
  fold: 4320,
  foldFull: [4320]
}, {
  code: 7329,
  lower: [],
  title: [],
  upper: [],
  fold: 4321,
  foldFull: [4321]
}, {
  code: 7330,
  lower: [],
  title: [],
  upper: [],
  fold: 4322,
  foldFull: [4322]
}, {
  code: 7331,
  lower: [],
  title: [],
  upper: [],
  fold: 4323,
  foldFull: [4323]
}, {
  code: 7332,
  lower: [],
  title: [],
  upper: [],
  fold: 4324,
  foldFull: [4324]
}, {
  code: 7333,
  lower: [],
  title: [],
  upper: [],
  fold: 4325,
  foldFull: [4325]
}, {
  code: 7334,
  lower: [],
  title: [],
  upper: [],
  fold: 4326,
  foldFull: [4326]
}, {
  code: 7335,
  lower: [],
  title: [],
  upper: [],
  fold: 4327,
  foldFull: [4327]
}, {
  code: 7336,
  lower: [],
  title: [],
  upper: [],
  fold: 4328,
  foldFull: [4328]
}, {
  code: 7337,
  lower: [],
  title: [],
  upper: [],
  fold: 4329,
  foldFull: [4329]
}, {
  code: 7338,
  lower: [],
  title: [],
  upper: [],
  fold: 4330,
  foldFull: [4330]
}, {
  code: 7339,
  lower: [],
  title: [],
  upper: [],
  fold: 4331,
  foldFull: [4331]
}, {
  code: 7340,
  lower: [],
  title: [],
  upper: [],
  fold: 4332,
  foldFull: [4332]
}, {
  code: 7341,
  lower: [],
  title: [],
  upper: [],
  fold: 4333,
  foldFull: [4333]
}, {
  code: 7342,
  lower: [],
  title: [],
  upper: [],
  fold: 4334,
  foldFull: [4334]
}, {
  code: 7343,
  lower: [],
  title: [],
  upper: [],
  fold: 4335,
  foldFull: [4335]
}, {
  code: 7344,
  lower: [],
  title: [],
  upper: [],
  fold: 4336,
  foldFull: [4336]
}, {
  code: 7345,
  lower: [],
  title: [],
  upper: [],
  fold: 4337,
  foldFull: [4337]
}, {
  code: 7346,
  lower: [],
  title: [],
  upper: [],
  fold: 4338,
  foldFull: [4338]
}, {
  code: 7347,
  lower: [],
  title: [],
  upper: [],
  fold: 4339,
  foldFull: [4339]
}, {
  code: 7348,
  lower: [],
  title: [],
  upper: [],
  fold: 4340,
  foldFull: [4340]
}, {
  code: 7349,
  lower: [],
  title: [],
  upper: [],
  fold: 4341,
  foldFull: [4341]
}, {
  code: 7350,
  lower: [],
  title: [],
  upper: [],
  fold: 4342,
  foldFull: [4342]
}, {
  code: 7351,
  lower: [],
  title: [],
  upper: [],
  fold: 4343,
  foldFull: [4343]
}, {
  code: 7352,
  lower: [],
  title: [],
  upper: [],
  fold: 4344,
  foldFull: [4344]
}, {
  code: 7353,
  lower: [],
  title: [],
  upper: [],
  fold: 4345,
  foldFull: [4345]
}, {
  code: 7354,
  lower: [],
  title: [],
  upper: [],
  fold: 4346,
  foldFull: [4346]
}, {
  code: 7357,
  lower: [],
  title: [],
  upper: [],
  fold: 4349,
  foldFull: [4349]
}, {
  code: 7358,
  lower: [],
  title: [],
  upper: [],
  fold: 4350,
  foldFull: [4350]
}, {
  code: 7359,
  lower: [],
  title: [],
  upper: [],
  fold: 4351,
  foldFull: [4351]
}, {
  code: 7680,
  lower: [],
  title: [],
  upper: [],
  fold: 7681,
  foldFull: [7681]
}, {
  code: 7682,
  lower: [],
  title: [],
  upper: [],
  fold: 7683,
  foldFull: [7683]
}, {
  code: 7684,
  lower: [],
  title: [],
  upper: [],
  fold: 7685,
  foldFull: [7685]
}, {
  code: 7686,
  lower: [],
  title: [],
  upper: [],
  fold: 7687,
  foldFull: [7687]
}, {
  code: 7688,
  lower: [],
  title: [],
  upper: [],
  fold: 7689,
  foldFull: [7689]
}, {
  code: 7690,
  lower: [],
  title: [],
  upper: [],
  fold: 7691,
  foldFull: [7691]
}, {
  code: 7692,
  lower: [],
  title: [],
  upper: [],
  fold: 7693,
  foldFull: [7693]
}, {
  code: 7694,
  lower: [],
  title: [],
  upper: [],
  fold: 7695,
  foldFull: [7695]
}, {
  code: 7696,
  lower: [],
  title: [],
  upper: [],
  fold: 7697,
  foldFull: [7697]
}, {
  code: 7698,
  lower: [],
  title: [],
  upper: [],
  fold: 7699,
  foldFull: [7699]
}, {
  code: 7700,
  lower: [],
  title: [],
  upper: [],
  fold: 7701,
  foldFull: [7701]
}, {
  code: 7702,
  lower: [],
  title: [],
  upper: [],
  fold: 7703,
  foldFull: [7703]
}, {
  code: 7704,
  lower: [],
  title: [],
  upper: [],
  fold: 7705,
  foldFull: [7705]
}, {
  code: 7706,
  lower: [],
  title: [],
  upper: [],
  fold: 7707,
  foldFull: [7707]
}, {
  code: 7708,
  lower: [],
  title: [],
  upper: [],
  fold: 7709,
  foldFull: [7709]
}, {
  code: 7710,
  lower: [],
  title: [],
  upper: [],
  fold: 7711,
  foldFull: [7711]
}, {
  code: 7712,
  lower: [],
  title: [],
  upper: [],
  fold: 7713,
  foldFull: [7713]
}, {
  code: 7714,
  lower: [],
  title: [],
  upper: [],
  fold: 7715,
  foldFull: [7715]
}, {
  code: 7716,
  lower: [],
  title: [],
  upper: [],
  fold: 7717,
  foldFull: [7717]
}, {
  code: 7718,
  lower: [],
  title: [],
  upper: [],
  fold: 7719,
  foldFull: [7719]
}, {
  code: 7720,
  lower: [],
  title: [],
  upper: [],
  fold: 7721,
  foldFull: [7721]
}, {
  code: 7722,
  lower: [],
  title: [],
  upper: [],
  fold: 7723,
  foldFull: [7723]
}, {
  code: 7724,
  lower: [],
  title: [],
  upper: [],
  fold: 7725,
  foldFull: [7725]
}, {
  code: 7726,
  lower: [],
  title: [],
  upper: [],
  fold: 7727,
  foldFull: [7727]
}, {
  code: 7728,
  lower: [],
  title: [],
  upper: [],
  fold: 7729,
  foldFull: [7729]
}, {
  code: 7730,
  lower: [],
  title: [],
  upper: [],
  fold: 7731,
  foldFull: [7731]
}, {
  code: 7732,
  lower: [],
  title: [],
  upper: [],
  fold: 7733,
  foldFull: [7733]
}, {
  code: 7734,
  lower: [],
  title: [],
  upper: [],
  fold: 7735,
  foldFull: [7735]
}, {
  code: 7736,
  lower: [],
  title: [],
  upper: [],
  fold: 7737,
  foldFull: [7737]
}, {
  code: 7738,
  lower: [],
  title: [],
  upper: [],
  fold: 7739,
  foldFull: [7739]
}, {
  code: 7740,
  lower: [],
  title: [],
  upper: [],
  fold: 7741,
  foldFull: [7741]
}, {
  code: 7742,
  lower: [],
  title: [],
  upper: [],
  fold: 7743,
  foldFull: [7743]
}, {
  code: 7744,
  lower: [],
  title: [],
  upper: [],
  fold: 7745,
  foldFull: [7745]
}, {
  code: 7746,
  lower: [],
  title: [],
  upper: [],
  fold: 7747,
  foldFull: [7747]
}, {
  code: 7748,
  lower: [],
  title: [],
  upper: [],
  fold: 7749,
  foldFull: [7749]
}, {
  code: 7750,
  lower: [],
  title: [],
  upper: [],
  fold: 7751,
  foldFull: [7751]
}, {
  code: 7752,
  lower: [],
  title: [],
  upper: [],
  fold: 7753,
  foldFull: [7753]
}, {
  code: 7754,
  lower: [],
  title: [],
  upper: [],
  fold: 7755,
  foldFull: [7755]
}, {
  code: 7756,
  lower: [],
  title: [],
  upper: [],
  fold: 7757,
  foldFull: [7757]
}, {
  code: 7758,
  lower: [],
  title: [],
  upper: [],
  fold: 7759,
  foldFull: [7759]
}, {
  code: 7760,
  lower: [],
  title: [],
  upper: [],
  fold: 7761,
  foldFull: [7761]
}, {
  code: 7762,
  lower: [],
  title: [],
  upper: [],
  fold: 7763,
  foldFull: [7763]
}, {
  code: 7764,
  lower: [],
  title: [],
  upper: [],
  fold: 7765,
  foldFull: [7765]
}, {
  code: 7766,
  lower: [],
  title: [],
  upper: [],
  fold: 7767,
  foldFull: [7767]
}, {
  code: 7768,
  lower: [],
  title: [],
  upper: [],
  fold: 7769,
  foldFull: [7769]
}, {
  code: 7770,
  lower: [],
  title: [],
  upper: [],
  fold: 7771,
  foldFull: [7771]
}, {
  code: 7772,
  lower: [],
  title: [],
  upper: [],
  fold: 7773,
  foldFull: [7773]
}, {
  code: 7774,
  lower: [],
  title: [],
  upper: [],
  fold: 7775,
  foldFull: [7775]
}, {
  code: 7776,
  lower: [],
  title: [],
  upper: [],
  fold: 7777,
  foldFull: [7777]
}, {
  code: 7778,
  lower: [],
  title: [],
  upper: [],
  fold: 7779,
  foldFull: [7779]
}, {
  code: 7780,
  lower: [],
  title: [],
  upper: [],
  fold: 7781,
  foldFull: [7781]
}, {
  code: 7782,
  lower: [],
  title: [],
  upper: [],
  fold: 7783,
  foldFull: [7783]
}, {
  code: 7784,
  lower: [],
  title: [],
  upper: [],
  fold: 7785,
  foldFull: [7785]
}, {
  code: 7786,
  lower: [],
  title: [],
  upper: [],
  fold: 7787,
  foldFull: [7787]
}, {
  code: 7788,
  lower: [],
  title: [],
  upper: [],
  fold: 7789,
  foldFull: [7789]
}, {
  code: 7790,
  lower: [],
  title: [],
  upper: [],
  fold: 7791,
  foldFull: [7791]
}, {
  code: 7792,
  lower: [],
  title: [],
  upper: [],
  fold: 7793,
  foldFull: [7793]
}, {
  code: 7794,
  lower: [],
  title: [],
  upper: [],
  fold: 7795,
  foldFull: [7795]
}, {
  code: 7796,
  lower: [],
  title: [],
  upper: [],
  fold: 7797,
  foldFull: [7797]
}, {
  code: 7798,
  lower: [],
  title: [],
  upper: [],
  fold: 7799,
  foldFull: [7799]
}, {
  code: 7800,
  lower: [],
  title: [],
  upper: [],
  fold: 7801,
  foldFull: [7801]
}, {
  code: 7802,
  lower: [],
  title: [],
  upper: [],
  fold: 7803,
  foldFull: [7803]
}, {
  code: 7804,
  lower: [],
  title: [],
  upper: [],
  fold: 7805,
  foldFull: [7805]
}, {
  code: 7806,
  lower: [],
  title: [],
  upper: [],
  fold: 7807,
  foldFull: [7807]
}, {
  code: 7808,
  lower: [],
  title: [],
  upper: [],
  fold: 7809,
  foldFull: [7809]
}, {
  code: 7810,
  lower: [],
  title: [],
  upper: [],
  fold: 7811,
  foldFull: [7811]
}, {
  code: 7812,
  lower: [],
  title: [],
  upper: [],
  fold: 7813,
  foldFull: [7813]
}, {
  code: 7814,
  lower: [],
  title: [],
  upper: [],
  fold: 7815,
  foldFull: [7815]
}, {
  code: 7816,
  lower: [],
  title: [],
  upper: [],
  fold: 7817,
  foldFull: [7817]
}, {
  code: 7818,
  lower: [],
  title: [],
  upper: [],
  fold: 7819,
  foldFull: [7819]
}, {
  code: 7820,
  lower: [],
  title: [],
  upper: [],
  fold: 7821,
  foldFull: [7821]
}, {
  code: 7822,
  lower: [],
  title: [],
  upper: [],
  fold: 7823,
  foldFull: [7823]
}, {
  code: 7824,
  lower: [],
  title: [],
  upper: [],
  fold: 7825,
  foldFull: [7825]
}, {
  code: 7826,
  lower: [],
  title: [],
  upper: [],
  fold: 7827,
  foldFull: [7827]
}, {
  code: 7828,
  lower: [],
  title: [],
  upper: [],
  fold: 7829,
  foldFull: [7829]
}, {
  code: 7830,
  lower: [7830],
  title: [72, 817],
  upper: [72, 817],
  fold: 0,
  foldFull: [104, 817]
}, {
  code: 7830,
  lower: [7830],
  title: [72, 817],
  upper: [72, 817],
  fold: 0,
  foldFull: [104, 817]
}, {
  code: 7831,
  lower: [7831],
  title: [84, 776],
  upper: [84, 776],
  fold: 0,
  foldFull: [116, 776]
}, {
  code: 7831,
  lower: [7831],
  title: [84, 776],
  upper: [84, 776],
  fold: 0,
  foldFull: [116, 776]
}, {
  code: 7832,
  lower: [7832],
  title: [87, 778],
  upper: [87, 778],
  fold: 0,
  foldFull: [119, 778]
}, {
  code: 7832,
  lower: [7832],
  title: [87, 778],
  upper: [87, 778],
  fold: 0,
  foldFull: [119, 778]
}, {
  code: 7833,
  lower: [7833],
  title: [89, 778],
  upper: [89, 778],
  fold: 0,
  foldFull: [121, 778]
}, {
  code: 7833,
  lower: [7833],
  title: [89, 778],
  upper: [89, 778],
  fold: 0,
  foldFull: [121, 778]
}, {
  code: 7834,
  lower: [7834],
  title: [65, 702],
  upper: [65, 702],
  fold: 0,
  foldFull: [97, 702]
}, {
  code: 7834,
  lower: [7834],
  title: [65, 702],
  upper: [65, 702],
  fold: 0,
  foldFull: [97, 702]
}, {
  code: 7835,
  lower: [],
  title: [],
  upper: [],
  fold: 7777,
  foldFull: [7777]
}, {
  code: 7838,
  lower: [],
  title: [],
  upper: [],
  fold: 223,
  foldFull: [115, 115]
}, {
  code: 7840,
  lower: [],
  title: [],
  upper: [],
  fold: 7841,
  foldFull: [7841]
}, {
  code: 7842,
  lower: [],
  title: [],
  upper: [],
  fold: 7843,
  foldFull: [7843]
}, {
  code: 7844,
  lower: [],
  title: [],
  upper: [],
  fold: 7845,
  foldFull: [7845]
}, {
  code: 7846,
  lower: [],
  title: [],
  upper: [],
  fold: 7847,
  foldFull: [7847]
}, {
  code: 7848,
  lower: [],
  title: [],
  upper: [],
  fold: 7849,
  foldFull: [7849]
}, {
  code: 7850,
  lower: [],
  title: [],
  upper: [],
  fold: 7851,
  foldFull: [7851]
}, {
  code: 7852,
  lower: [],
  title: [],
  upper: [],
  fold: 7853,
  foldFull: [7853]
}, {
  code: 7854,
  lower: [],
  title: [],
  upper: [],
  fold: 7855,
  foldFull: [7855]
}, {
  code: 7856,
  lower: [],
  title: [],
  upper: [],
  fold: 7857,
  foldFull: [7857]
}, {
  code: 7858,
  lower: [],
  title: [],
  upper: [],
  fold: 7859,
  foldFull: [7859]
}, {
  code: 7860,
  lower: [],
  title: [],
  upper: [],
  fold: 7861,
  foldFull: [7861]
}, {
  code: 7862,
  lower: [],
  title: [],
  upper: [],
  fold: 7863,
  foldFull: [7863]
}, {
  code: 7864,
  lower: [],
  title: [],
  upper: [],
  fold: 7865,
  foldFull: [7865]
}, {
  code: 7866,
  lower: [],
  title: [],
  upper: [],
  fold: 7867,
  foldFull: [7867]
}, {
  code: 7868,
  lower: [],
  title: [],
  upper: [],
  fold: 7869,
  foldFull: [7869]
}, {
  code: 7870,
  lower: [],
  title: [],
  upper: [],
  fold: 7871,
  foldFull: [7871]
}, {
  code: 7872,
  lower: [],
  title: [],
  upper: [],
  fold: 7873,
  foldFull: [7873]
}, {
  code: 7874,
  lower: [],
  title: [],
  upper: [],
  fold: 7875,
  foldFull: [7875]
}, {
  code: 7876,
  lower: [],
  title: [],
  upper: [],
  fold: 7877,
  foldFull: [7877]
}, {
  code: 7878,
  lower: [],
  title: [],
  upper: [],
  fold: 7879,
  foldFull: [7879]
}, {
  code: 7880,
  lower: [],
  title: [],
  upper: [],
  fold: 7881,
  foldFull: [7881]
}, {
  code: 7882,
  lower: [],
  title: [],
  upper: [],
  fold: 7883,
  foldFull: [7883]
}, {
  code: 7884,
  lower: [],
  title: [],
  upper: [],
  fold: 7885,
  foldFull: [7885]
}, {
  code: 7886,
  lower: [],
  title: [],
  upper: [],
  fold: 7887,
  foldFull: [7887]
}, {
  code: 7888,
  lower: [],
  title: [],
  upper: [],
  fold: 7889,
  foldFull: [7889]
}, {
  code: 7890,
  lower: [],
  title: [],
  upper: [],
  fold: 7891,
  foldFull: [7891]
}, {
  code: 7892,
  lower: [],
  title: [],
  upper: [],
  fold: 7893,
  foldFull: [7893]
}, {
  code: 7894,
  lower: [],
  title: [],
  upper: [],
  fold: 7895,
  foldFull: [7895]
}, {
  code: 7896,
  lower: [],
  title: [],
  upper: [],
  fold: 7897,
  foldFull: [7897]
}, {
  code: 7898,
  lower: [],
  title: [],
  upper: [],
  fold: 7899,
  foldFull: [7899]
}, {
  code: 7900,
  lower: [],
  title: [],
  upper: [],
  fold: 7901,
  foldFull: [7901]
}, {
  code: 7902,
  lower: [],
  title: [],
  upper: [],
  fold: 7903,
  foldFull: [7903]
}, {
  code: 7904,
  lower: [],
  title: [],
  upper: [],
  fold: 7905,
  foldFull: [7905]
}, {
  code: 7906,
  lower: [],
  title: [],
  upper: [],
  fold: 7907,
  foldFull: [7907]
}, {
  code: 7908,
  lower: [],
  title: [],
  upper: [],
  fold: 7909,
  foldFull: [7909]
}, {
  code: 7910,
  lower: [],
  title: [],
  upper: [],
  fold: 7911,
  foldFull: [7911]
}, {
  code: 7912,
  lower: [],
  title: [],
  upper: [],
  fold: 7913,
  foldFull: [7913]
}, {
  code: 7914,
  lower: [],
  title: [],
  upper: [],
  fold: 7915,
  foldFull: [7915]
}, {
  code: 7916,
  lower: [],
  title: [],
  upper: [],
  fold: 7917,
  foldFull: [7917]
}, {
  code: 7918,
  lower: [],
  title: [],
  upper: [],
  fold: 7919,
  foldFull: [7919]
}, {
  code: 7920,
  lower: [],
  title: [],
  upper: [],
  fold: 7921,
  foldFull: [7921]
}, {
  code: 7922,
  lower: [],
  title: [],
  upper: [],
  fold: 7923,
  foldFull: [7923]
}, {
  code: 7924,
  lower: [],
  title: [],
  upper: [],
  fold: 7925,
  foldFull: [7925]
}, {
  code: 7926,
  lower: [],
  title: [],
  upper: [],
  fold: 7927,
  foldFull: [7927]
}, {
  code: 7928,
  lower: [],
  title: [],
  upper: [],
  fold: 7929,
  foldFull: [7929]
}, {
  code: 7930,
  lower: [],
  title: [],
  upper: [],
  fold: 7931,
  foldFull: [7931]
}, {
  code: 7932,
  lower: [],
  title: [],
  upper: [],
  fold: 7933,
  foldFull: [7933]
}, {
  code: 7934,
  lower: [],
  title: [],
  upper: [],
  fold: 7935,
  foldFull: [7935]
}, {
  code: 7944,
  lower: [],
  title: [],
  upper: [],
  fold: 7936,
  foldFull: [7936]
}, {
  code: 7945,
  lower: [],
  title: [],
  upper: [],
  fold: 7937,
  foldFull: [7937]
}, {
  code: 7946,
  lower: [],
  title: [],
  upper: [],
  fold: 7938,
  foldFull: [7938]
}, {
  code: 7947,
  lower: [],
  title: [],
  upper: [],
  fold: 7939,
  foldFull: [7939]
}, {
  code: 7948,
  lower: [],
  title: [],
  upper: [],
  fold: 7940,
  foldFull: [7940]
}, {
  code: 7949,
  lower: [],
  title: [],
  upper: [],
  fold: 7941,
  foldFull: [7941]
}, {
  code: 7950,
  lower: [],
  title: [],
  upper: [],
  fold: 7942,
  foldFull: [7942]
}, {
  code: 7951,
  lower: [],
  title: [],
  upper: [],
  fold: 7943,
  foldFull: [7943]
}, {
  code: 7960,
  lower: [],
  title: [],
  upper: [],
  fold: 7952,
  foldFull: [7952]
}, {
  code: 7961,
  lower: [],
  title: [],
  upper: [],
  fold: 7953,
  foldFull: [7953]
}, {
  code: 7962,
  lower: [],
  title: [],
  upper: [],
  fold: 7954,
  foldFull: [7954]
}, {
  code: 7963,
  lower: [],
  title: [],
  upper: [],
  fold: 7955,
  foldFull: [7955]
}, {
  code: 7964,
  lower: [],
  title: [],
  upper: [],
  fold: 7956,
  foldFull: [7956]
}, {
  code: 7965,
  lower: [],
  title: [],
  upper: [],
  fold: 7957,
  foldFull: [7957]
}, {
  code: 7976,
  lower: [],
  title: [],
  upper: [],
  fold: 7968,
  foldFull: [7968]
}, {
  code: 7977,
  lower: [],
  title: [],
  upper: [],
  fold: 7969,
  foldFull: [7969]
}, {
  code: 7978,
  lower: [],
  title: [],
  upper: [],
  fold: 7970,
  foldFull: [7970]
}, {
  code: 7979,
  lower: [],
  title: [],
  upper: [],
  fold: 7971,
  foldFull: [7971]
}, {
  code: 7980,
  lower: [],
  title: [],
  upper: [],
  fold: 7972,
  foldFull: [7972]
}, {
  code: 7981,
  lower: [],
  title: [],
  upper: [],
  fold: 7973,
  foldFull: [7973]
}, {
  code: 7982,
  lower: [],
  title: [],
  upper: [],
  fold: 7974,
  foldFull: [7974]
}, {
  code: 7983,
  lower: [],
  title: [],
  upper: [],
  fold: 7975,
  foldFull: [7975]
}, {
  code: 7992,
  lower: [],
  title: [],
  upper: [],
  fold: 7984,
  foldFull: [7984]
}, {
  code: 7993,
  lower: [],
  title: [],
  upper: [],
  fold: 7985,
  foldFull: [7985]
}, {
  code: 7994,
  lower: [],
  title: [],
  upper: [],
  fold: 7986,
  foldFull: [7986]
}, {
  code: 7995,
  lower: [],
  title: [],
  upper: [],
  fold: 7987,
  foldFull: [7987]
}, {
  code: 7996,
  lower: [],
  title: [],
  upper: [],
  fold: 7988,
  foldFull: [7988]
}, {
  code: 7997,
  lower: [],
  title: [],
  upper: [],
  fold: 7989,
  foldFull: [7989]
}, {
  code: 7998,
  lower: [],
  title: [],
  upper: [],
  fold: 7990,
  foldFull: [7990]
}, {
  code: 7999,
  lower: [],
  title: [],
  upper: [],
  fold: 7991,
  foldFull: [7991]
}, {
  code: 8008,
  lower: [],
  title: [],
  upper: [],
  fold: 8e3,
  foldFull: [8e3]
}, {
  code: 8009,
  lower: [],
  title: [],
  upper: [],
  fold: 8001,
  foldFull: [8001]
}, {
  code: 8010,
  lower: [],
  title: [],
  upper: [],
  fold: 8002,
  foldFull: [8002]
}, {
  code: 8011,
  lower: [],
  title: [],
  upper: [],
  fold: 8003,
  foldFull: [8003]
}, {
  code: 8012,
  lower: [],
  title: [],
  upper: [],
  fold: 8004,
  foldFull: [8004]
}, {
  code: 8013,
  lower: [],
  title: [],
  upper: [],
  fold: 8005,
  foldFull: [8005]
}, {
  code: 8016,
  lower: [8016],
  title: [933, 787],
  upper: [933, 787],
  fold: 0,
  foldFull: [965, 787]
}, {
  code: 8016,
  lower: [8016],
  title: [933, 787],
  upper: [933, 787],
  fold: 0,
  foldFull: [965, 787]
}, {
  code: 8018,
  lower: [8018],
  title: [933, 787, 768],
  upper: [933, 787, 768],
  fold: 0,
  foldFull: [965, 787, 768]
}, {
  code: 8018,
  lower: [8018],
  title: [933, 787, 768],
  upper: [933, 787, 768],
  fold: 0,
  foldFull: [965, 787, 768]
}, {
  code: 8020,
  lower: [8020],
  title: [933, 787, 769],
  upper: [933, 787, 769],
  fold: 0,
  foldFull: [965, 787, 769]
}, {
  code: 8020,
  lower: [8020],
  title: [933, 787, 769],
  upper: [933, 787, 769],
  fold: 0,
  foldFull: [965, 787, 769]
}, {
  code: 8022,
  lower: [8022],
  title: [933, 787, 834],
  upper: [933, 787, 834],
  fold: 0,
  foldFull: [965, 787, 834]
}, {
  code: 8022,
  lower: [8022],
  title: [933, 787, 834],
  upper: [933, 787, 834],
  fold: 0,
  foldFull: [965, 787, 834]
}, {
  code: 8025,
  lower: [],
  title: [],
  upper: [],
  fold: 8017,
  foldFull: [8017]
}, {
  code: 8027,
  lower: [],
  title: [],
  upper: [],
  fold: 8019,
  foldFull: [8019]
}, {
  code: 8029,
  lower: [],
  title: [],
  upper: [],
  fold: 8021,
  foldFull: [8021]
}, {
  code: 8031,
  lower: [],
  title: [],
  upper: [],
  fold: 8023,
  foldFull: [8023]
}, {
  code: 8040,
  lower: [],
  title: [],
  upper: [],
  fold: 8032,
  foldFull: [8032]
}, {
  code: 8041,
  lower: [],
  title: [],
  upper: [],
  fold: 8033,
  foldFull: [8033]
}, {
  code: 8042,
  lower: [],
  title: [],
  upper: [],
  fold: 8034,
  foldFull: [8034]
}, {
  code: 8043,
  lower: [],
  title: [],
  upper: [],
  fold: 8035,
  foldFull: [8035]
}, {
  code: 8044,
  lower: [],
  title: [],
  upper: [],
  fold: 8036,
  foldFull: [8036]
}, {
  code: 8045,
  lower: [],
  title: [],
  upper: [],
  fold: 8037,
  foldFull: [8037]
}, {
  code: 8046,
  lower: [],
  title: [],
  upper: [],
  fold: 8038,
  foldFull: [8038]
}, {
  code: 8047,
  lower: [],
  title: [],
  upper: [],
  fold: 8039,
  foldFull: [8039]
}, {
  code: 8064,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 0,
  foldFull: [7936, 953]
}, {
  code: 8064,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 0,
  foldFull: [7936, 953]
}, {
  code: 8065,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 0,
  foldFull: [7937, 953]
}, {
  code: 8065,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 0,
  foldFull: [7937, 953]
}, {
  code: 8066,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 0,
  foldFull: [7938, 953]
}, {
  code: 8066,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 0,
  foldFull: [7938, 953]
}, {
  code: 8067,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 0,
  foldFull: [7939, 953]
}, {
  code: 8067,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 0,
  foldFull: [7939, 953]
}, {
  code: 8068,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 0,
  foldFull: [7940, 953]
}, {
  code: 8068,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 0,
  foldFull: [7940, 953]
}, {
  code: 8069,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 0,
  foldFull: [7941, 953]
}, {
  code: 8069,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 0,
  foldFull: [7941, 953]
}, {
  code: 8070,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 0,
  foldFull: [7942, 953]
}, {
  code: 8070,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 0,
  foldFull: [7942, 953]
}, {
  code: 8071,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 0,
  foldFull: [7943, 953]
}, {
  code: 8071,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 0,
  foldFull: [7943, 953]
}, {
  code: 8072,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 8064,
  foldFull: [7936, 953]
}, {
  code: 8072,
  lower: [8064],
  title: [8072],
  upper: [7944, 921],
  fold: 8064,
  foldFull: [7936, 953]
}, {
  code: 8073,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 8065,
  foldFull: [7937, 953]
}, {
  code: 8073,
  lower: [8065],
  title: [8073],
  upper: [7945, 921],
  fold: 8065,
  foldFull: [7937, 953]
}, {
  code: 8074,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 8066,
  foldFull: [7938, 953]
}, {
  code: 8074,
  lower: [8066],
  title: [8074],
  upper: [7946, 921],
  fold: 8066,
  foldFull: [7938, 953]
}, {
  code: 8075,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 8067,
  foldFull: [7939, 953]
}, {
  code: 8075,
  lower: [8067],
  title: [8075],
  upper: [7947, 921],
  fold: 8067,
  foldFull: [7939, 953]
}, {
  code: 8076,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 8068,
  foldFull: [7940, 953]
}, {
  code: 8076,
  lower: [8068],
  title: [8076],
  upper: [7948, 921],
  fold: 8068,
  foldFull: [7940, 953]
}, {
  code: 8077,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 8069,
  foldFull: [7941, 953]
}, {
  code: 8077,
  lower: [8069],
  title: [8077],
  upper: [7949, 921],
  fold: 8069,
  foldFull: [7941, 953]
}, {
  code: 8078,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 8070,
  foldFull: [7942, 953]
}, {
  code: 8078,
  lower: [8070],
  title: [8078],
  upper: [7950, 921],
  fold: 8070,
  foldFull: [7942, 953]
}, {
  code: 8079,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 8071,
  foldFull: [7943, 953]
}, {
  code: 8079,
  lower: [8071],
  title: [8079],
  upper: [7951, 921],
  fold: 8071,
  foldFull: [7943, 953]
}, {
  code: 8080,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 0,
  foldFull: [7968, 953]
}, {
  code: 8080,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 0,
  foldFull: [7968, 953]
}, {
  code: 8081,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 0,
  foldFull: [7969, 953]
}, {
  code: 8081,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 0,
  foldFull: [7969, 953]
}, {
  code: 8082,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 0,
  foldFull: [7970, 953]
}, {
  code: 8082,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 0,
  foldFull: [7970, 953]
}, {
  code: 8083,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 0,
  foldFull: [7971, 953]
}, {
  code: 8083,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 0,
  foldFull: [7971, 953]
}, {
  code: 8084,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 0,
  foldFull: [7972, 953]
}, {
  code: 8084,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 0,
  foldFull: [7972, 953]
}, {
  code: 8085,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 0,
  foldFull: [7973, 953]
}, {
  code: 8085,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 0,
  foldFull: [7973, 953]
}, {
  code: 8086,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 0,
  foldFull: [7974, 953]
}, {
  code: 8086,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 0,
  foldFull: [7974, 953]
}, {
  code: 8087,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 0,
  foldFull: [7975, 953]
}, {
  code: 8087,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 0,
  foldFull: [7975, 953]
}, {
  code: 8088,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 8080,
  foldFull: [7968, 953]
}, {
  code: 8088,
  lower: [8080],
  title: [8088],
  upper: [7976, 921],
  fold: 8080,
  foldFull: [7968, 953]
}, {
  code: 8089,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 8081,
  foldFull: [7969, 953]
}, {
  code: 8089,
  lower: [8081],
  title: [8089],
  upper: [7977, 921],
  fold: 8081,
  foldFull: [7969, 953]
}, {
  code: 8090,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 8082,
  foldFull: [7970, 953]
}, {
  code: 8090,
  lower: [8082],
  title: [8090],
  upper: [7978, 921],
  fold: 8082,
  foldFull: [7970, 953]
}, {
  code: 8091,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 8083,
  foldFull: [7971, 953]
}, {
  code: 8091,
  lower: [8083],
  title: [8091],
  upper: [7979, 921],
  fold: 8083,
  foldFull: [7971, 953]
}, {
  code: 8092,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 8084,
  foldFull: [7972, 953]
}, {
  code: 8092,
  lower: [8084],
  title: [8092],
  upper: [7980, 921],
  fold: 8084,
  foldFull: [7972, 953]
}, {
  code: 8093,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 8085,
  foldFull: [7973, 953]
}, {
  code: 8093,
  lower: [8085],
  title: [8093],
  upper: [7981, 921],
  fold: 8085,
  foldFull: [7973, 953]
}, {
  code: 8094,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 8086,
  foldFull: [7974, 953]
}, {
  code: 8094,
  lower: [8086],
  title: [8094],
  upper: [7982, 921],
  fold: 8086,
  foldFull: [7974, 953]
}, {
  code: 8095,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 8087,
  foldFull: [7975, 953]
}, {
  code: 8095,
  lower: [8087],
  title: [8095],
  upper: [7983, 921],
  fold: 8087,
  foldFull: [7975, 953]
}, {
  code: 8096,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 0,
  foldFull: [8032, 953]
}, {
  code: 8096,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 0,
  foldFull: [8032, 953]
}, {
  code: 8097,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 0,
  foldFull: [8033, 953]
}, {
  code: 8097,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 0,
  foldFull: [8033, 953]
}, {
  code: 8098,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 0,
  foldFull: [8034, 953]
}, {
  code: 8098,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 0,
  foldFull: [8034, 953]
}, {
  code: 8099,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 0,
  foldFull: [8035, 953]
}, {
  code: 8099,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 0,
  foldFull: [8035, 953]
}, {
  code: 8100,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 0,
  foldFull: [8036, 953]
}, {
  code: 8100,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 0,
  foldFull: [8036, 953]
}, {
  code: 8101,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 0,
  foldFull: [8037, 953]
}, {
  code: 8101,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 0,
  foldFull: [8037, 953]
}, {
  code: 8102,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 0,
  foldFull: [8038, 953]
}, {
  code: 8102,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 0,
  foldFull: [8038, 953]
}, {
  code: 8103,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 0,
  foldFull: [8039, 953]
}, {
  code: 8103,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 0,
  foldFull: [8039, 953]
}, {
  code: 8104,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 8096,
  foldFull: [8032, 953]
}, {
  code: 8104,
  lower: [8096],
  title: [8104],
  upper: [8040, 921],
  fold: 8096,
  foldFull: [8032, 953]
}, {
  code: 8105,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 8097,
  foldFull: [8033, 953]
}, {
  code: 8105,
  lower: [8097],
  title: [8105],
  upper: [8041, 921],
  fold: 8097,
  foldFull: [8033, 953]
}, {
  code: 8106,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 8098,
  foldFull: [8034, 953]
}, {
  code: 8106,
  lower: [8098],
  title: [8106],
  upper: [8042, 921],
  fold: 8098,
  foldFull: [8034, 953]
}, {
  code: 8107,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 8099,
  foldFull: [8035, 953]
}, {
  code: 8107,
  lower: [8099],
  title: [8107],
  upper: [8043, 921],
  fold: 8099,
  foldFull: [8035, 953]
}, {
  code: 8108,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 8100,
  foldFull: [8036, 953]
}, {
  code: 8108,
  lower: [8100],
  title: [8108],
  upper: [8044, 921],
  fold: 8100,
  foldFull: [8036, 953]
}, {
  code: 8109,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 8101,
  foldFull: [8037, 953]
}, {
  code: 8109,
  lower: [8101],
  title: [8109],
  upper: [8045, 921],
  fold: 8101,
  foldFull: [8037, 953]
}, {
  code: 8110,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 8102,
  foldFull: [8038, 953]
}, {
  code: 8110,
  lower: [8102],
  title: [8110],
  upper: [8046, 921],
  fold: 8102,
  foldFull: [8038, 953]
}, {
  code: 8111,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 8103,
  foldFull: [8039, 953]
}, {
  code: 8111,
  lower: [8103],
  title: [8111],
  upper: [8047, 921],
  fold: 8103,
  foldFull: [8039, 953]
}, {
  code: 8114,
  lower: [8114],
  title: [8122, 837],
  upper: [8122, 921],
  fold: 0,
  foldFull: [8048, 953]
}, {
  code: 8114,
  lower: [8114],
  title: [8122, 837],
  upper: [8122, 921],
  fold: 0,
  foldFull: [8048, 953]
}, {
  code: 8115,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 0,
  foldFull: [945, 953]
}, {
  code: 8115,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 0,
  foldFull: [945, 953]
}, {
  code: 8116,
  lower: [8116],
  title: [902, 837],
  upper: [902, 921],
  fold: 0,
  foldFull: [940, 953]
}, {
  code: 8116,
  lower: [8116],
  title: [902, 837],
  upper: [902, 921],
  fold: 0,
  foldFull: [940, 953]
}, {
  code: 8118,
  lower: [8118],
  title: [913, 834],
  upper: [913, 834],
  fold: 0,
  foldFull: [945, 834]
}, {
  code: 8118,
  lower: [8118],
  title: [913, 834],
  upper: [913, 834],
  fold: 0,
  foldFull: [945, 834]
}, {
  code: 8119,
  lower: [8119],
  title: [913, 834, 837],
  upper: [913, 834, 921],
  fold: 0,
  foldFull: [945, 834, 953]
}, {
  code: 8119,
  lower: [8119],
  title: [913, 834, 837],
  upper: [913, 834, 921],
  fold: 0,
  foldFull: [945, 834, 953]
}, {
  code: 8120,
  lower: [],
  title: [],
  upper: [],
  fold: 8112,
  foldFull: [8112]
}, {
  code: 8121,
  lower: [],
  title: [],
  upper: [],
  fold: 8113,
  foldFull: [8113]
}, {
  code: 8122,
  lower: [],
  title: [],
  upper: [],
  fold: 8048,
  foldFull: [8048]
}, {
  code: 8123,
  lower: [],
  title: [],
  upper: [],
  fold: 8049,
  foldFull: [8049]
}, {
  code: 8124,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 8115,
  foldFull: [945, 953]
}, {
  code: 8124,
  lower: [8115],
  title: [8124],
  upper: [913, 921],
  fold: 8115,
  foldFull: [945, 953]
}, {
  code: 8126,
  lower: [],
  title: [],
  upper: [],
  fold: 953,
  foldFull: [953]
}, {
  code: 8130,
  lower: [8130],
  title: [8138, 837],
  upper: [8138, 921],
  fold: 0,
  foldFull: [8052, 953]
}, {
  code: 8130,
  lower: [8130],
  title: [8138, 837],
  upper: [8138, 921],
  fold: 0,
  foldFull: [8052, 953]
}, {
  code: 8131,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 0,
  foldFull: [951, 953]
}, {
  code: 8131,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 0,
  foldFull: [951, 953]
}, {
  code: 8132,
  lower: [8132],
  title: [905, 837],
  upper: [905, 921],
  fold: 0,
  foldFull: [942, 953]
}, {
  code: 8132,
  lower: [8132],
  title: [905, 837],
  upper: [905, 921],
  fold: 0,
  foldFull: [942, 953]
}, {
  code: 8134,
  lower: [8134],
  title: [919, 834],
  upper: [919, 834],
  fold: 0,
  foldFull: [951, 834]
}, {
  code: 8134,
  lower: [8134],
  title: [919, 834],
  upper: [919, 834],
  fold: 0,
  foldFull: [951, 834]
}, {
  code: 8135,
  lower: [8135],
  title: [919, 834, 837],
  upper: [919, 834, 921],
  fold: 0,
  foldFull: [951, 834, 953]
}, {
  code: 8135,
  lower: [8135],
  title: [919, 834, 837],
  upper: [919, 834, 921],
  fold: 0,
  foldFull: [951, 834, 953]
}, {
  code: 8136,
  lower: [],
  title: [],
  upper: [],
  fold: 8050,
  foldFull: [8050]
}, {
  code: 8137,
  lower: [],
  title: [],
  upper: [],
  fold: 8051,
  foldFull: [8051]
}, {
  code: 8138,
  lower: [],
  title: [],
  upper: [],
  fold: 8052,
  foldFull: [8052]
}, {
  code: 8139,
  lower: [],
  title: [],
  upper: [],
  fold: 8053,
  foldFull: [8053]
}, {
  code: 8140,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 8131,
  foldFull: [951, 953]
}, {
  code: 8140,
  lower: [8131],
  title: [8140],
  upper: [919, 921],
  fold: 8131,
  foldFull: [951, 953]
}, {
  code: 8146,
  lower: [8146],
  title: [921, 776, 768],
  upper: [921, 776, 768],
  fold: 0,
  foldFull: [953, 776, 768]
}, {
  code: 8146,
  lower: [8146],
  title: [921, 776, 768],
  upper: [921, 776, 768],
  fold: 0,
  foldFull: [953, 776, 768]
}, {
  code: 8147,
  lower: [8147],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 8147,
  lower: [8147],
  title: [921, 776, 769],
  upper: [921, 776, 769],
  fold: 0,
  foldFull: [953, 776, 769]
}, {
  code: 8150,
  lower: [8150],
  title: [921, 834],
  upper: [921, 834],
  fold: 0,
  foldFull: [953, 834]
}, {
  code: 8150,
  lower: [8150],
  title: [921, 834],
  upper: [921, 834],
  fold: 0,
  foldFull: [953, 834]
}, {
  code: 8151,
  lower: [8151],
  title: [921, 776, 834],
  upper: [921, 776, 834],
  fold: 0,
  foldFull: [953, 776, 834]
}, {
  code: 8151,
  lower: [8151],
  title: [921, 776, 834],
  upper: [921, 776, 834],
  fold: 0,
  foldFull: [953, 776, 834]
}, {
  code: 8152,
  lower: [],
  title: [],
  upper: [],
  fold: 8144,
  foldFull: [8144]
}, {
  code: 8153,
  lower: [],
  title: [],
  upper: [],
  fold: 8145,
  foldFull: [8145]
}, {
  code: 8154,
  lower: [],
  title: [],
  upper: [],
  fold: 8054,
  foldFull: [8054]
}, {
  code: 8155,
  lower: [],
  title: [],
  upper: [],
  fold: 8055,
  foldFull: [8055]
}, {
  code: 8162,
  lower: [8162],
  title: [933, 776, 768],
  upper: [933, 776, 768],
  fold: 0,
  foldFull: [965, 776, 768]
}, {
  code: 8162,
  lower: [8162],
  title: [933, 776, 768],
  upper: [933, 776, 768],
  fold: 0,
  foldFull: [965, 776, 768]
}, {
  code: 8163,
  lower: [8163],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 8163,
  lower: [8163],
  title: [933, 776, 769],
  upper: [933, 776, 769],
  fold: 0,
  foldFull: [965, 776, 769]
}, {
  code: 8164,
  lower: [8164],
  title: [929, 787],
  upper: [929, 787],
  fold: 0,
  foldFull: [961, 787]
}, {
  code: 8164,
  lower: [8164],
  title: [929, 787],
  upper: [929, 787],
  fold: 0,
  foldFull: [961, 787]
}, {
  code: 8166,
  lower: [8166],
  title: [933, 834],
  upper: [933, 834],
  fold: 0,
  foldFull: [965, 834]
}, {
  code: 8166,
  lower: [8166],
  title: [933, 834],
  upper: [933, 834],
  fold: 0,
  foldFull: [965, 834]
}, {
  code: 8167,
  lower: [8167],
  title: [933, 776, 834],
  upper: [933, 776, 834],
  fold: 0,
  foldFull: [965, 776, 834]
}, {
  code: 8167,
  lower: [8167],
  title: [933, 776, 834],
  upper: [933, 776, 834],
  fold: 0,
  foldFull: [965, 776, 834]
}, {
  code: 8168,
  lower: [],
  title: [],
  upper: [],
  fold: 8160,
  foldFull: [8160]
}, {
  code: 8169,
  lower: [],
  title: [],
  upper: [],
  fold: 8161,
  foldFull: [8161]
}, {
  code: 8170,
  lower: [],
  title: [],
  upper: [],
  fold: 8058,
  foldFull: [8058]
}, {
  code: 8171,
  lower: [],
  title: [],
  upper: [],
  fold: 8059,
  foldFull: [8059]
}, {
  code: 8172,
  lower: [],
  title: [],
  upper: [],
  fold: 8165,
  foldFull: [8165]
}, {
  code: 8178,
  lower: [8178],
  title: [8186, 837],
  upper: [8186, 921],
  fold: 0,
  foldFull: [8060, 953]
}, {
  code: 8178,
  lower: [8178],
  title: [8186, 837],
  upper: [8186, 921],
  fold: 0,
  foldFull: [8060, 953]
}, {
  code: 8179,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 0,
  foldFull: [969, 953]
}, {
  code: 8179,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 0,
  foldFull: [969, 953]
}, {
  code: 8180,
  lower: [8180],
  title: [911, 837],
  upper: [911, 921],
  fold: 0,
  foldFull: [974, 953]
}, {
  code: 8180,
  lower: [8180],
  title: [911, 837],
  upper: [911, 921],
  fold: 0,
  foldFull: [974, 953]
}, {
  code: 8182,
  lower: [8182],
  title: [937, 834],
  upper: [937, 834],
  fold: 0,
  foldFull: [969, 834]
}, {
  code: 8182,
  lower: [8182],
  title: [937, 834],
  upper: [937, 834],
  fold: 0,
  foldFull: [969, 834]
}, {
  code: 8183,
  lower: [8183],
  title: [937, 834, 837],
  upper: [937, 834, 921],
  fold: 0,
  foldFull: [969, 834, 953]
}, {
  code: 8183,
  lower: [8183],
  title: [937, 834, 837],
  upper: [937, 834, 921],
  fold: 0,
  foldFull: [969, 834, 953]
}, {
  code: 8184,
  lower: [],
  title: [],
  upper: [],
  fold: 8056,
  foldFull: [8056]
}, {
  code: 8185,
  lower: [],
  title: [],
  upper: [],
  fold: 8057,
  foldFull: [8057]
}, {
  code: 8186,
  lower: [],
  title: [],
  upper: [],
  fold: 8060,
  foldFull: [8060]
}, {
  code: 8187,
  lower: [],
  title: [],
  upper: [],
  fold: 8061,
  foldFull: [8061]
}, {
  code: 8188,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 8179,
  foldFull: [969, 953]
}, {
  code: 8188,
  lower: [8179],
  title: [8188],
  upper: [937, 921],
  fold: 8179,
  foldFull: [969, 953]
}, {
  code: 8486,
  lower: [],
  title: [],
  upper: [],
  fold: 969,
  foldFull: [969]
}, {
  code: 8490,
  lower: [],
  title: [],
  upper: [],
  fold: 107,
  foldFull: [107]
}, {
  code: 8491,
  lower: [],
  title: [],
  upper: [],
  fold: 229,
  foldFull: [229]
}, {
  code: 8498,
  lower: [],
  title: [],
  upper: [],
  fold: 8526,
  foldFull: [8526]
}, {
  code: 8544,
  lower: [],
  title: [],
  upper: [],
  fold: 8560,
  foldFull: [8560]
}, {
  code: 8545,
  lower: [],
  title: [],
  upper: [],
  fold: 8561,
  foldFull: [8561]
}, {
  code: 8546,
  lower: [],
  title: [],
  upper: [],
  fold: 8562,
  foldFull: [8562]
}, {
  code: 8547,
  lower: [],
  title: [],
  upper: [],
  fold: 8563,
  foldFull: [8563]
}, {
  code: 8548,
  lower: [],
  title: [],
  upper: [],
  fold: 8564,
  foldFull: [8564]
}, {
  code: 8549,
  lower: [],
  title: [],
  upper: [],
  fold: 8565,
  foldFull: [8565]
}, {
  code: 8550,
  lower: [],
  title: [],
  upper: [],
  fold: 8566,
  foldFull: [8566]
}, {
  code: 8551,
  lower: [],
  title: [],
  upper: [],
  fold: 8567,
  foldFull: [8567]
}, {
  code: 8552,
  lower: [],
  title: [],
  upper: [],
  fold: 8568,
  foldFull: [8568]
}, {
  code: 8553,
  lower: [],
  title: [],
  upper: [],
  fold: 8569,
  foldFull: [8569]
}, {
  code: 8554,
  lower: [],
  title: [],
  upper: [],
  fold: 8570,
  foldFull: [8570]
}, {
  code: 8555,
  lower: [],
  title: [],
  upper: [],
  fold: 8571,
  foldFull: [8571]
}, {
  code: 8556,
  lower: [],
  title: [],
  upper: [],
  fold: 8572,
  foldFull: [8572]
}, {
  code: 8557,
  lower: [],
  title: [],
  upper: [],
  fold: 8573,
  foldFull: [8573]
}, {
  code: 8558,
  lower: [],
  title: [],
  upper: [],
  fold: 8574,
  foldFull: [8574]
}, {
  code: 8559,
  lower: [],
  title: [],
  upper: [],
  fold: 8575,
  foldFull: [8575]
}, {
  code: 8579,
  lower: [],
  title: [],
  upper: [],
  fold: 8580,
  foldFull: [8580]
}, {
  code: 9398,
  lower: [],
  title: [],
  upper: [],
  fold: 9424,
  foldFull: [9424]
}, {
  code: 9399,
  lower: [],
  title: [],
  upper: [],
  fold: 9425,
  foldFull: [9425]
}, {
  code: 9400,
  lower: [],
  title: [],
  upper: [],
  fold: 9426,
  foldFull: [9426]
}, {
  code: 9401,
  lower: [],
  title: [],
  upper: [],
  fold: 9427,
  foldFull: [9427]
}, {
  code: 9402,
  lower: [],
  title: [],
  upper: [],
  fold: 9428,
  foldFull: [9428]
}, {
  code: 9403,
  lower: [],
  title: [],
  upper: [],
  fold: 9429,
  foldFull: [9429]
}, {
  code: 9404,
  lower: [],
  title: [],
  upper: [],
  fold: 9430,
  foldFull: [9430]
}, {
  code: 9405,
  lower: [],
  title: [],
  upper: [],
  fold: 9431,
  foldFull: [9431]
}, {
  code: 9406,
  lower: [],
  title: [],
  upper: [],
  fold: 9432,
  foldFull: [9432]
}, {
  code: 9407,
  lower: [],
  title: [],
  upper: [],
  fold: 9433,
  foldFull: [9433]
}, {
  code: 9408,
  lower: [],
  title: [],
  upper: [],
  fold: 9434,
  foldFull: [9434]
}, {
  code: 9409,
  lower: [],
  title: [],
  upper: [],
  fold: 9435,
  foldFull: [9435]
}, {
  code: 9410,
  lower: [],
  title: [],
  upper: [],
  fold: 9436,
  foldFull: [9436]
}, {
  code: 9411,
  lower: [],
  title: [],
  upper: [],
  fold: 9437,
  foldFull: [9437]
}, {
  code: 9412,
  lower: [],
  title: [],
  upper: [],
  fold: 9438,
  foldFull: [9438]
}, {
  code: 9413,
  lower: [],
  title: [],
  upper: [],
  fold: 9439,
  foldFull: [9439]
}, {
  code: 9414,
  lower: [],
  title: [],
  upper: [],
  fold: 9440,
  foldFull: [9440]
}, {
  code: 9415,
  lower: [],
  title: [],
  upper: [],
  fold: 9441,
  foldFull: [9441]
}, {
  code: 9416,
  lower: [],
  title: [],
  upper: [],
  fold: 9442,
  foldFull: [9442]
}, {
  code: 9417,
  lower: [],
  title: [],
  upper: [],
  fold: 9443,
  foldFull: [9443]
}, {
  code: 9418,
  lower: [],
  title: [],
  upper: [],
  fold: 9444,
  foldFull: [9444]
}, {
  code: 9419,
  lower: [],
  title: [],
  upper: [],
  fold: 9445,
  foldFull: [9445]
}, {
  code: 9420,
  lower: [],
  title: [],
  upper: [],
  fold: 9446,
  foldFull: [9446]
}, {
  code: 9421,
  lower: [],
  title: [],
  upper: [],
  fold: 9447,
  foldFull: [9447]
}, {
  code: 9422,
  lower: [],
  title: [],
  upper: [],
  fold: 9448,
  foldFull: [9448]
}, {
  code: 9423,
  lower: [],
  title: [],
  upper: [],
  fold: 9449,
  foldFull: [9449]
}, {
  code: 11264,
  lower: [],
  title: [],
  upper: [],
  fold: 11312,
  foldFull: [11312]
}, {
  code: 11265,
  lower: [],
  title: [],
  upper: [],
  fold: 11313,
  foldFull: [11313]
}, {
  code: 11266,
  lower: [],
  title: [],
  upper: [],
  fold: 11314,
  foldFull: [11314]
}, {
  code: 11267,
  lower: [],
  title: [],
  upper: [],
  fold: 11315,
  foldFull: [11315]
}, {
  code: 11268,
  lower: [],
  title: [],
  upper: [],
  fold: 11316,
  foldFull: [11316]
}, {
  code: 11269,
  lower: [],
  title: [],
  upper: [],
  fold: 11317,
  foldFull: [11317]
}, {
  code: 11270,
  lower: [],
  title: [],
  upper: [],
  fold: 11318,
  foldFull: [11318]
}, {
  code: 11271,
  lower: [],
  title: [],
  upper: [],
  fold: 11319,
  foldFull: [11319]
}, {
  code: 11272,
  lower: [],
  title: [],
  upper: [],
  fold: 11320,
  foldFull: [11320]
}, {
  code: 11273,
  lower: [],
  title: [],
  upper: [],
  fold: 11321,
  foldFull: [11321]
}, {
  code: 11274,
  lower: [],
  title: [],
  upper: [],
  fold: 11322,
  foldFull: [11322]
}, {
  code: 11275,
  lower: [],
  title: [],
  upper: [],
  fold: 11323,
  foldFull: [11323]
}, {
  code: 11276,
  lower: [],
  title: [],
  upper: [],
  fold: 11324,
  foldFull: [11324]
}, {
  code: 11277,
  lower: [],
  title: [],
  upper: [],
  fold: 11325,
  foldFull: [11325]
}, {
  code: 11278,
  lower: [],
  title: [],
  upper: [],
  fold: 11326,
  foldFull: [11326]
}, {
  code: 11279,
  lower: [],
  title: [],
  upper: [],
  fold: 11327,
  foldFull: [11327]
}, {
  code: 11280,
  lower: [],
  title: [],
  upper: [],
  fold: 11328,
  foldFull: [11328]
}, {
  code: 11281,
  lower: [],
  title: [],
  upper: [],
  fold: 11329,
  foldFull: [11329]
}, {
  code: 11282,
  lower: [],
  title: [],
  upper: [],
  fold: 11330,
  foldFull: [11330]
}, {
  code: 11283,
  lower: [],
  title: [],
  upper: [],
  fold: 11331,
  foldFull: [11331]
}, {
  code: 11284,
  lower: [],
  title: [],
  upper: [],
  fold: 11332,
  foldFull: [11332]
}, {
  code: 11285,
  lower: [],
  title: [],
  upper: [],
  fold: 11333,
  foldFull: [11333]
}, {
  code: 11286,
  lower: [],
  title: [],
  upper: [],
  fold: 11334,
  foldFull: [11334]
}, {
  code: 11287,
  lower: [],
  title: [],
  upper: [],
  fold: 11335,
  foldFull: [11335]
}, {
  code: 11288,
  lower: [],
  title: [],
  upper: [],
  fold: 11336,
  foldFull: [11336]
}, {
  code: 11289,
  lower: [],
  title: [],
  upper: [],
  fold: 11337,
  foldFull: [11337]
}, {
  code: 11290,
  lower: [],
  title: [],
  upper: [],
  fold: 11338,
  foldFull: [11338]
}, {
  code: 11291,
  lower: [],
  title: [],
  upper: [],
  fold: 11339,
  foldFull: [11339]
}, {
  code: 11292,
  lower: [],
  title: [],
  upper: [],
  fold: 11340,
  foldFull: [11340]
}, {
  code: 11293,
  lower: [],
  title: [],
  upper: [],
  fold: 11341,
  foldFull: [11341]
}, {
  code: 11294,
  lower: [],
  title: [],
  upper: [],
  fold: 11342,
  foldFull: [11342]
}, {
  code: 11295,
  lower: [],
  title: [],
  upper: [],
  fold: 11343,
  foldFull: [11343]
}, {
  code: 11296,
  lower: [],
  title: [],
  upper: [],
  fold: 11344,
  foldFull: [11344]
}, {
  code: 11297,
  lower: [],
  title: [],
  upper: [],
  fold: 11345,
  foldFull: [11345]
}, {
  code: 11298,
  lower: [],
  title: [],
  upper: [],
  fold: 11346,
  foldFull: [11346]
}, {
  code: 11299,
  lower: [],
  title: [],
  upper: [],
  fold: 11347,
  foldFull: [11347]
}, {
  code: 11300,
  lower: [],
  title: [],
  upper: [],
  fold: 11348,
  foldFull: [11348]
}, {
  code: 11301,
  lower: [],
  title: [],
  upper: [],
  fold: 11349,
  foldFull: [11349]
}, {
  code: 11302,
  lower: [],
  title: [],
  upper: [],
  fold: 11350,
  foldFull: [11350]
}, {
  code: 11303,
  lower: [],
  title: [],
  upper: [],
  fold: 11351,
  foldFull: [11351]
}, {
  code: 11304,
  lower: [],
  title: [],
  upper: [],
  fold: 11352,
  foldFull: [11352]
}, {
  code: 11305,
  lower: [],
  title: [],
  upper: [],
  fold: 11353,
  foldFull: [11353]
}, {
  code: 11306,
  lower: [],
  title: [],
  upper: [],
  fold: 11354,
  foldFull: [11354]
}, {
  code: 11307,
  lower: [],
  title: [],
  upper: [],
  fold: 11355,
  foldFull: [11355]
}, {
  code: 11308,
  lower: [],
  title: [],
  upper: [],
  fold: 11356,
  foldFull: [11356]
}, {
  code: 11309,
  lower: [],
  title: [],
  upper: [],
  fold: 11357,
  foldFull: [11357]
}, {
  code: 11310,
  lower: [],
  title: [],
  upper: [],
  fold: 11358,
  foldFull: [11358]
}, {
  code: 11360,
  lower: [],
  title: [],
  upper: [],
  fold: 11361,
  foldFull: [11361]
}, {
  code: 11362,
  lower: [],
  title: [],
  upper: [],
  fold: 619,
  foldFull: [619]
}, {
  code: 11363,
  lower: [],
  title: [],
  upper: [],
  fold: 7549,
  foldFull: [7549]
}, {
  code: 11364,
  lower: [],
  title: [],
  upper: [],
  fold: 637,
  foldFull: [637]
}, {
  code: 11367,
  lower: [],
  title: [],
  upper: [],
  fold: 11368,
  foldFull: [11368]
}, {
  code: 11369,
  lower: [],
  title: [],
  upper: [],
  fold: 11370,
  foldFull: [11370]
}, {
  code: 11371,
  lower: [],
  title: [],
  upper: [],
  fold: 11372,
  foldFull: [11372]
}, {
  code: 11373,
  lower: [],
  title: [],
  upper: [],
  fold: 593,
  foldFull: [593]
}, {
  code: 11374,
  lower: [],
  title: [],
  upper: [],
  fold: 625,
  foldFull: [625]
}, {
  code: 11375,
  lower: [],
  title: [],
  upper: [],
  fold: 592,
  foldFull: [592]
}, {
  code: 11376,
  lower: [],
  title: [],
  upper: [],
  fold: 594,
  foldFull: [594]
}, {
  code: 11378,
  lower: [],
  title: [],
  upper: [],
  fold: 11379,
  foldFull: [11379]
}, {
  code: 11381,
  lower: [],
  title: [],
  upper: [],
  fold: 11382,
  foldFull: [11382]
}, {
  code: 11390,
  lower: [],
  title: [],
  upper: [],
  fold: 575,
  foldFull: [575]
}, {
  code: 11391,
  lower: [],
  title: [],
  upper: [],
  fold: 576,
  foldFull: [576]
}, {
  code: 11392,
  lower: [],
  title: [],
  upper: [],
  fold: 11393,
  foldFull: [11393]
}, {
  code: 11394,
  lower: [],
  title: [],
  upper: [],
  fold: 11395,
  foldFull: [11395]
}, {
  code: 11396,
  lower: [],
  title: [],
  upper: [],
  fold: 11397,
  foldFull: [11397]
}, {
  code: 11398,
  lower: [],
  title: [],
  upper: [],
  fold: 11399,
  foldFull: [11399]
}, {
  code: 11400,
  lower: [],
  title: [],
  upper: [],
  fold: 11401,
  foldFull: [11401]
}, {
  code: 11402,
  lower: [],
  title: [],
  upper: [],
  fold: 11403,
  foldFull: [11403]
}, {
  code: 11404,
  lower: [],
  title: [],
  upper: [],
  fold: 11405,
  foldFull: [11405]
}, {
  code: 11406,
  lower: [],
  title: [],
  upper: [],
  fold: 11407,
  foldFull: [11407]
}, {
  code: 11408,
  lower: [],
  title: [],
  upper: [],
  fold: 11409,
  foldFull: [11409]
}, {
  code: 11410,
  lower: [],
  title: [],
  upper: [],
  fold: 11411,
  foldFull: [11411]
}, {
  code: 11412,
  lower: [],
  title: [],
  upper: [],
  fold: 11413,
  foldFull: [11413]
}, {
  code: 11414,
  lower: [],
  title: [],
  upper: [],
  fold: 11415,
  foldFull: [11415]
}, {
  code: 11416,
  lower: [],
  title: [],
  upper: [],
  fold: 11417,
  foldFull: [11417]
}, {
  code: 11418,
  lower: [],
  title: [],
  upper: [],
  fold: 11419,
  foldFull: [11419]
}, {
  code: 11420,
  lower: [],
  title: [],
  upper: [],
  fold: 11421,
  foldFull: [11421]
}, {
  code: 11422,
  lower: [],
  title: [],
  upper: [],
  fold: 11423,
  foldFull: [11423]
}, {
  code: 11424,
  lower: [],
  title: [],
  upper: [],
  fold: 11425,
  foldFull: [11425]
}, {
  code: 11426,
  lower: [],
  title: [],
  upper: [],
  fold: 11427,
  foldFull: [11427]
}, {
  code: 11428,
  lower: [],
  title: [],
  upper: [],
  fold: 11429,
  foldFull: [11429]
}, {
  code: 11430,
  lower: [],
  title: [],
  upper: [],
  fold: 11431,
  foldFull: [11431]
}, {
  code: 11432,
  lower: [],
  title: [],
  upper: [],
  fold: 11433,
  foldFull: [11433]
}, {
  code: 11434,
  lower: [],
  title: [],
  upper: [],
  fold: 11435,
  foldFull: [11435]
}, {
  code: 11436,
  lower: [],
  title: [],
  upper: [],
  fold: 11437,
  foldFull: [11437]
}, {
  code: 11438,
  lower: [],
  title: [],
  upper: [],
  fold: 11439,
  foldFull: [11439]
}, {
  code: 11440,
  lower: [],
  title: [],
  upper: [],
  fold: 11441,
  foldFull: [11441]
}, {
  code: 11442,
  lower: [],
  title: [],
  upper: [],
  fold: 11443,
  foldFull: [11443]
}, {
  code: 11444,
  lower: [],
  title: [],
  upper: [],
  fold: 11445,
  foldFull: [11445]
}, {
  code: 11446,
  lower: [],
  title: [],
  upper: [],
  fold: 11447,
  foldFull: [11447]
}, {
  code: 11448,
  lower: [],
  title: [],
  upper: [],
  fold: 11449,
  foldFull: [11449]
}, {
  code: 11450,
  lower: [],
  title: [],
  upper: [],
  fold: 11451,
  foldFull: [11451]
}, {
  code: 11452,
  lower: [],
  title: [],
  upper: [],
  fold: 11453,
  foldFull: [11453]
}, {
  code: 11454,
  lower: [],
  title: [],
  upper: [],
  fold: 11455,
  foldFull: [11455]
}, {
  code: 11456,
  lower: [],
  title: [],
  upper: [],
  fold: 11457,
  foldFull: [11457]
}, {
  code: 11458,
  lower: [],
  title: [],
  upper: [],
  fold: 11459,
  foldFull: [11459]
}, {
  code: 11460,
  lower: [],
  title: [],
  upper: [],
  fold: 11461,
  foldFull: [11461]
}, {
  code: 11462,
  lower: [],
  title: [],
  upper: [],
  fold: 11463,
  foldFull: [11463]
}, {
  code: 11464,
  lower: [],
  title: [],
  upper: [],
  fold: 11465,
  foldFull: [11465]
}, {
  code: 11466,
  lower: [],
  title: [],
  upper: [],
  fold: 11467,
  foldFull: [11467]
}, {
  code: 11468,
  lower: [],
  title: [],
  upper: [],
  fold: 11469,
  foldFull: [11469]
}, {
  code: 11470,
  lower: [],
  title: [],
  upper: [],
  fold: 11471,
  foldFull: [11471]
}, {
  code: 11472,
  lower: [],
  title: [],
  upper: [],
  fold: 11473,
  foldFull: [11473]
}, {
  code: 11474,
  lower: [],
  title: [],
  upper: [],
  fold: 11475,
  foldFull: [11475]
}, {
  code: 11476,
  lower: [],
  title: [],
  upper: [],
  fold: 11477,
  foldFull: [11477]
}, {
  code: 11478,
  lower: [],
  title: [],
  upper: [],
  fold: 11479,
  foldFull: [11479]
}, {
  code: 11480,
  lower: [],
  title: [],
  upper: [],
  fold: 11481,
  foldFull: [11481]
}, {
  code: 11482,
  lower: [],
  title: [],
  upper: [],
  fold: 11483,
  foldFull: [11483]
}, {
  code: 11484,
  lower: [],
  title: [],
  upper: [],
  fold: 11485,
  foldFull: [11485]
}, {
  code: 11486,
  lower: [],
  title: [],
  upper: [],
  fold: 11487,
  foldFull: [11487]
}, {
  code: 11488,
  lower: [],
  title: [],
  upper: [],
  fold: 11489,
  foldFull: [11489]
}, {
  code: 11490,
  lower: [],
  title: [],
  upper: [],
  fold: 11491,
  foldFull: [11491]
}, {
  code: 11499,
  lower: [],
  title: [],
  upper: [],
  fold: 11500,
  foldFull: [11500]
}, {
  code: 11501,
  lower: [],
  title: [],
  upper: [],
  fold: 11502,
  foldFull: [11502]
}, {
  code: 11506,
  lower: [],
  title: [],
  upper: [],
  fold: 11507,
  foldFull: [11507]
}, {
  code: 42560,
  lower: [],
  title: [],
  upper: [],
  fold: 42561,
  foldFull: [42561]
}, {
  code: 42562,
  lower: [],
  title: [],
  upper: [],
  fold: 42563,
  foldFull: [42563]
}, {
  code: 42564,
  lower: [],
  title: [],
  upper: [],
  fold: 42565,
  foldFull: [42565]
}, {
  code: 42566,
  lower: [],
  title: [],
  upper: [],
  fold: 42567,
  foldFull: [42567]
}, {
  code: 42568,
  lower: [],
  title: [],
  upper: [],
  fold: 42569,
  foldFull: [42569]
}, {
  code: 42570,
  lower: [],
  title: [],
  upper: [],
  fold: 42571,
  foldFull: [42571]
}, {
  code: 42572,
  lower: [],
  title: [],
  upper: [],
  fold: 42573,
  foldFull: [42573]
}, {
  code: 42574,
  lower: [],
  title: [],
  upper: [],
  fold: 42575,
  foldFull: [42575]
}, {
  code: 42576,
  lower: [],
  title: [],
  upper: [],
  fold: 42577,
  foldFull: [42577]
}, {
  code: 42578,
  lower: [],
  title: [],
  upper: [],
  fold: 42579,
  foldFull: [42579]
}, {
  code: 42580,
  lower: [],
  title: [],
  upper: [],
  fold: 42581,
  foldFull: [42581]
}, {
  code: 42582,
  lower: [],
  title: [],
  upper: [],
  fold: 42583,
  foldFull: [42583]
}, {
  code: 42584,
  lower: [],
  title: [],
  upper: [],
  fold: 42585,
  foldFull: [42585]
}, {
  code: 42586,
  lower: [],
  title: [],
  upper: [],
  fold: 42587,
  foldFull: [42587]
}, {
  code: 42588,
  lower: [],
  title: [],
  upper: [],
  fold: 42589,
  foldFull: [42589]
}, {
  code: 42590,
  lower: [],
  title: [],
  upper: [],
  fold: 42591,
  foldFull: [42591]
}, {
  code: 42592,
  lower: [],
  title: [],
  upper: [],
  fold: 42593,
  foldFull: [42593]
}, {
  code: 42594,
  lower: [],
  title: [],
  upper: [],
  fold: 42595,
  foldFull: [42595]
}, {
  code: 42596,
  lower: [],
  title: [],
  upper: [],
  fold: 42597,
  foldFull: [42597]
}, {
  code: 42598,
  lower: [],
  title: [],
  upper: [],
  fold: 42599,
  foldFull: [42599]
}, {
  code: 42600,
  lower: [],
  title: [],
  upper: [],
  fold: 42601,
  foldFull: [42601]
}, {
  code: 42602,
  lower: [],
  title: [],
  upper: [],
  fold: 42603,
  foldFull: [42603]
}, {
  code: 42604,
  lower: [],
  title: [],
  upper: [],
  fold: 42605,
  foldFull: [42605]
}, {
  code: 42624,
  lower: [],
  title: [],
  upper: [],
  fold: 42625,
  foldFull: [42625]
}, {
  code: 42626,
  lower: [],
  title: [],
  upper: [],
  fold: 42627,
  foldFull: [42627]
}, {
  code: 42628,
  lower: [],
  title: [],
  upper: [],
  fold: 42629,
  foldFull: [42629]
}, {
  code: 42630,
  lower: [],
  title: [],
  upper: [],
  fold: 42631,
  foldFull: [42631]
}, {
  code: 42632,
  lower: [],
  title: [],
  upper: [],
  fold: 42633,
  foldFull: [42633]
}, {
  code: 42634,
  lower: [],
  title: [],
  upper: [],
  fold: 42635,
  foldFull: [42635]
}, {
  code: 42636,
  lower: [],
  title: [],
  upper: [],
  fold: 42637,
  foldFull: [42637]
}, {
  code: 42638,
  lower: [],
  title: [],
  upper: [],
  fold: 42639,
  foldFull: [42639]
}, {
  code: 42640,
  lower: [],
  title: [],
  upper: [],
  fold: 42641,
  foldFull: [42641]
}, {
  code: 42642,
  lower: [],
  title: [],
  upper: [],
  fold: 42643,
  foldFull: [42643]
}, {
  code: 42644,
  lower: [],
  title: [],
  upper: [],
  fold: 42645,
  foldFull: [42645]
}, {
  code: 42646,
  lower: [],
  title: [],
  upper: [],
  fold: 42647,
  foldFull: [42647]
}, {
  code: 42648,
  lower: [],
  title: [],
  upper: [],
  fold: 42649,
  foldFull: [42649]
}, {
  code: 42650,
  lower: [],
  title: [],
  upper: [],
  fold: 42651,
  foldFull: [42651]
}, {
  code: 42786,
  lower: [],
  title: [],
  upper: [],
  fold: 42787,
  foldFull: [42787]
}, {
  code: 42788,
  lower: [],
  title: [],
  upper: [],
  fold: 42789,
  foldFull: [42789]
}, {
  code: 42790,
  lower: [],
  title: [],
  upper: [],
  fold: 42791,
  foldFull: [42791]
}, {
  code: 42792,
  lower: [],
  title: [],
  upper: [],
  fold: 42793,
  foldFull: [42793]
}, {
  code: 42794,
  lower: [],
  title: [],
  upper: [],
  fold: 42795,
  foldFull: [42795]
}, {
  code: 42796,
  lower: [],
  title: [],
  upper: [],
  fold: 42797,
  foldFull: [42797]
}, {
  code: 42798,
  lower: [],
  title: [],
  upper: [],
  fold: 42799,
  foldFull: [42799]
}, {
  code: 42802,
  lower: [],
  title: [],
  upper: [],
  fold: 42803,
  foldFull: [42803]
}, {
  code: 42804,
  lower: [],
  title: [],
  upper: [],
  fold: 42805,
  foldFull: [42805]
}, {
  code: 42806,
  lower: [],
  title: [],
  upper: [],
  fold: 42807,
  foldFull: [42807]
}, {
  code: 42808,
  lower: [],
  title: [],
  upper: [],
  fold: 42809,
  foldFull: [42809]
}, {
  code: 42810,
  lower: [],
  title: [],
  upper: [],
  fold: 42811,
  foldFull: [42811]
}, {
  code: 42812,
  lower: [],
  title: [],
  upper: [],
  fold: 42813,
  foldFull: [42813]
}, {
  code: 42814,
  lower: [],
  title: [],
  upper: [],
  fold: 42815,
  foldFull: [42815]
}, {
  code: 42816,
  lower: [],
  title: [],
  upper: [],
  fold: 42817,
  foldFull: [42817]
}, {
  code: 42818,
  lower: [],
  title: [],
  upper: [],
  fold: 42819,
  foldFull: [42819]
}, {
  code: 42820,
  lower: [],
  title: [],
  upper: [],
  fold: 42821,
  foldFull: [42821]
}, {
  code: 42822,
  lower: [],
  title: [],
  upper: [],
  fold: 42823,
  foldFull: [42823]
}, {
  code: 42824,
  lower: [],
  title: [],
  upper: [],
  fold: 42825,
  foldFull: [42825]
}, {
  code: 42826,
  lower: [],
  title: [],
  upper: [],
  fold: 42827,
  foldFull: [42827]
}, {
  code: 42828,
  lower: [],
  title: [],
  upper: [],
  fold: 42829,
  foldFull: [42829]
}, {
  code: 42830,
  lower: [],
  title: [],
  upper: [],
  fold: 42831,
  foldFull: [42831]
}, {
  code: 42832,
  lower: [],
  title: [],
  upper: [],
  fold: 42833,
  foldFull: [42833]
}, {
  code: 42834,
  lower: [],
  title: [],
  upper: [],
  fold: 42835,
  foldFull: [42835]
}, {
  code: 42836,
  lower: [],
  title: [],
  upper: [],
  fold: 42837,
  foldFull: [42837]
}, {
  code: 42838,
  lower: [],
  title: [],
  upper: [],
  fold: 42839,
  foldFull: [42839]
}, {
  code: 42840,
  lower: [],
  title: [],
  upper: [],
  fold: 42841,
  foldFull: [42841]
}, {
  code: 42842,
  lower: [],
  title: [],
  upper: [],
  fold: 42843,
  foldFull: [42843]
}, {
  code: 42844,
  lower: [],
  title: [],
  upper: [],
  fold: 42845,
  foldFull: [42845]
}, {
  code: 42846,
  lower: [],
  title: [],
  upper: [],
  fold: 42847,
  foldFull: [42847]
}, {
  code: 42848,
  lower: [],
  title: [],
  upper: [],
  fold: 42849,
  foldFull: [42849]
}, {
  code: 42850,
  lower: [],
  title: [],
  upper: [],
  fold: 42851,
  foldFull: [42851]
}, {
  code: 42852,
  lower: [],
  title: [],
  upper: [],
  fold: 42853,
  foldFull: [42853]
}, {
  code: 42854,
  lower: [],
  title: [],
  upper: [],
  fold: 42855,
  foldFull: [42855]
}, {
  code: 42856,
  lower: [],
  title: [],
  upper: [],
  fold: 42857,
  foldFull: [42857]
}, {
  code: 42858,
  lower: [],
  title: [],
  upper: [],
  fold: 42859,
  foldFull: [42859]
}, {
  code: 42860,
  lower: [],
  title: [],
  upper: [],
  fold: 42861,
  foldFull: [42861]
}, {
  code: 42862,
  lower: [],
  title: [],
  upper: [],
  fold: 42863,
  foldFull: [42863]
}, {
  code: 42873,
  lower: [],
  title: [],
  upper: [],
  fold: 42874,
  foldFull: [42874]
}, {
  code: 42875,
  lower: [],
  title: [],
  upper: [],
  fold: 42876,
  foldFull: [42876]
}, {
  code: 42877,
  lower: [],
  title: [],
  upper: [],
  fold: 7545,
  foldFull: [7545]
}, {
  code: 42878,
  lower: [],
  title: [],
  upper: [],
  fold: 42879,
  foldFull: [42879]
}, {
  code: 42880,
  lower: [],
  title: [],
  upper: [],
  fold: 42881,
  foldFull: [42881]
}, {
  code: 42882,
  lower: [],
  title: [],
  upper: [],
  fold: 42883,
  foldFull: [42883]
}, {
  code: 42884,
  lower: [],
  title: [],
  upper: [],
  fold: 42885,
  foldFull: [42885]
}, {
  code: 42886,
  lower: [],
  title: [],
  upper: [],
  fold: 42887,
  foldFull: [42887]
}, {
  code: 42891,
  lower: [],
  title: [],
  upper: [],
  fold: 42892,
  foldFull: [42892]
}, {
  code: 42893,
  lower: [],
  title: [],
  upper: [],
  fold: 613,
  foldFull: [613]
}, {
  code: 42896,
  lower: [],
  title: [],
  upper: [],
  fold: 42897,
  foldFull: [42897]
}, {
  code: 42898,
  lower: [],
  title: [],
  upper: [],
  fold: 42899,
  foldFull: [42899]
}, {
  code: 42902,
  lower: [],
  title: [],
  upper: [],
  fold: 42903,
  foldFull: [42903]
}, {
  code: 42904,
  lower: [],
  title: [],
  upper: [],
  fold: 42905,
  foldFull: [42905]
}, {
  code: 42906,
  lower: [],
  title: [],
  upper: [],
  fold: 42907,
  foldFull: [42907]
}, {
  code: 42908,
  lower: [],
  title: [],
  upper: [],
  fold: 42909,
  foldFull: [42909]
}, {
  code: 42910,
  lower: [],
  title: [],
  upper: [],
  fold: 42911,
  foldFull: [42911]
}, {
  code: 42912,
  lower: [],
  title: [],
  upper: [],
  fold: 42913,
  foldFull: [42913]
}, {
  code: 42914,
  lower: [],
  title: [],
  upper: [],
  fold: 42915,
  foldFull: [42915]
}, {
  code: 42916,
  lower: [],
  title: [],
  upper: [],
  fold: 42917,
  foldFull: [42917]
}, {
  code: 42918,
  lower: [],
  title: [],
  upper: [],
  fold: 42919,
  foldFull: [42919]
}, {
  code: 42920,
  lower: [],
  title: [],
  upper: [],
  fold: 42921,
  foldFull: [42921]
}, {
  code: 42922,
  lower: [],
  title: [],
  upper: [],
  fold: 614,
  foldFull: [614]
}, {
  code: 42923,
  lower: [],
  title: [],
  upper: [],
  fold: 604,
  foldFull: [604]
}, {
  code: 42924,
  lower: [],
  title: [],
  upper: [],
  fold: 609,
  foldFull: [609]
}, {
  code: 42925,
  lower: [],
  title: [],
  upper: [],
  fold: 620,
  foldFull: [620]
}, {
  code: 42926,
  lower: [],
  title: [],
  upper: [],
  fold: 618,
  foldFull: [618]
}, {
  code: 42928,
  lower: [],
  title: [],
  upper: [],
  fold: 670,
  foldFull: [670]
}, {
  code: 42929,
  lower: [],
  title: [],
  upper: [],
  fold: 647,
  foldFull: [647]
}, {
  code: 42930,
  lower: [],
  title: [],
  upper: [],
  fold: 669,
  foldFull: [669]
}, {
  code: 42931,
  lower: [],
  title: [],
  upper: [],
  fold: 43859,
  foldFull: [43859]
}, {
  code: 42932,
  lower: [],
  title: [],
  upper: [],
  fold: 42933,
  foldFull: [42933]
}, {
  code: 42934,
  lower: [],
  title: [],
  upper: [],
  fold: 42935,
  foldFull: [42935]
}, {
  code: 42936,
  lower: [],
  title: [],
  upper: [],
  fold: 42937,
  foldFull: [42937]
}, {
  code: 42938,
  lower: [],
  title: [],
  upper: [],
  fold: 42939,
  foldFull: [42939]
}, {
  code: 42940,
  lower: [],
  title: [],
  upper: [],
  fold: 42941,
  foldFull: [42941]
}, {
  code: 42942,
  lower: [],
  title: [],
  upper: [],
  fold: 42943,
  foldFull: [42943]
}, {
  code: 42946,
  lower: [],
  title: [],
  upper: [],
  fold: 42947,
  foldFull: [42947]
}, {
  code: 42948,
  lower: [],
  title: [],
  upper: [],
  fold: 42900,
  foldFull: [42900]
}, {
  code: 42949,
  lower: [],
  title: [],
  upper: [],
  fold: 642,
  foldFull: [642]
}, {
  code: 42950,
  lower: [],
  title: [],
  upper: [],
  fold: 7566,
  foldFull: [7566]
}, {
  code: 42951,
  lower: [],
  title: [],
  upper: [],
  fold: 42952,
  foldFull: [42952]
}, {
  code: 42953,
  lower: [],
  title: [],
  upper: [],
  fold: 42954,
  foldFull: [42954]
}, {
  code: 42997,
  lower: [],
  title: [],
  upper: [],
  fold: 42998,
  foldFull: [42998]
}, {
  code: 43888,
  lower: [],
  title: [],
  upper: [],
  fold: 5024,
  foldFull: [5024]
}, {
  code: 43889,
  lower: [],
  title: [],
  upper: [],
  fold: 5025,
  foldFull: [5025]
}, {
  code: 43890,
  lower: [],
  title: [],
  upper: [],
  fold: 5026,
  foldFull: [5026]
}, {
  code: 43891,
  lower: [],
  title: [],
  upper: [],
  fold: 5027,
  foldFull: [5027]
}, {
  code: 43892,
  lower: [],
  title: [],
  upper: [],
  fold: 5028,
  foldFull: [5028]
}, {
  code: 43893,
  lower: [],
  title: [],
  upper: [],
  fold: 5029,
  foldFull: [5029]
}, {
  code: 43894,
  lower: [],
  title: [],
  upper: [],
  fold: 5030,
  foldFull: [5030]
}, {
  code: 43895,
  lower: [],
  title: [],
  upper: [],
  fold: 5031,
  foldFull: [5031]
}, {
  code: 43896,
  lower: [],
  title: [],
  upper: [],
  fold: 5032,
  foldFull: [5032]
}, {
  code: 43897,
  lower: [],
  title: [],
  upper: [],
  fold: 5033,
  foldFull: [5033]
}, {
  code: 43898,
  lower: [],
  title: [],
  upper: [],
  fold: 5034,
  foldFull: [5034]
}, {
  code: 43899,
  lower: [],
  title: [],
  upper: [],
  fold: 5035,
  foldFull: [5035]
}, {
  code: 43900,
  lower: [],
  title: [],
  upper: [],
  fold: 5036,
  foldFull: [5036]
}, {
  code: 43901,
  lower: [],
  title: [],
  upper: [],
  fold: 5037,
  foldFull: [5037]
}, {
  code: 43902,
  lower: [],
  title: [],
  upper: [],
  fold: 5038,
  foldFull: [5038]
}, {
  code: 43903,
  lower: [],
  title: [],
  upper: [],
  fold: 5039,
  foldFull: [5039]
}, {
  code: 43904,
  lower: [],
  title: [],
  upper: [],
  fold: 5040,
  foldFull: [5040]
}, {
  code: 43905,
  lower: [],
  title: [],
  upper: [],
  fold: 5041,
  foldFull: [5041]
}, {
  code: 43906,
  lower: [],
  title: [],
  upper: [],
  fold: 5042,
  foldFull: [5042]
}, {
  code: 43907,
  lower: [],
  title: [],
  upper: [],
  fold: 5043,
  foldFull: [5043]
}, {
  code: 43908,
  lower: [],
  title: [],
  upper: [],
  fold: 5044,
  foldFull: [5044]
}, {
  code: 43909,
  lower: [],
  title: [],
  upper: [],
  fold: 5045,
  foldFull: [5045]
}, {
  code: 43910,
  lower: [],
  title: [],
  upper: [],
  fold: 5046,
  foldFull: [5046]
}, {
  code: 43911,
  lower: [],
  title: [],
  upper: [],
  fold: 5047,
  foldFull: [5047]
}, {
  code: 43912,
  lower: [],
  title: [],
  upper: [],
  fold: 5048,
  foldFull: [5048]
}, {
  code: 43913,
  lower: [],
  title: [],
  upper: [],
  fold: 5049,
  foldFull: [5049]
}, {
  code: 43914,
  lower: [],
  title: [],
  upper: [],
  fold: 5050,
  foldFull: [5050]
}, {
  code: 43915,
  lower: [],
  title: [],
  upper: [],
  fold: 5051,
  foldFull: [5051]
}, {
  code: 43916,
  lower: [],
  title: [],
  upper: [],
  fold: 5052,
  foldFull: [5052]
}, {
  code: 43917,
  lower: [],
  title: [],
  upper: [],
  fold: 5053,
  foldFull: [5053]
}, {
  code: 43918,
  lower: [],
  title: [],
  upper: [],
  fold: 5054,
  foldFull: [5054]
}, {
  code: 43919,
  lower: [],
  title: [],
  upper: [],
  fold: 5055,
  foldFull: [5055]
}, {
  code: 43920,
  lower: [],
  title: [],
  upper: [],
  fold: 5056,
  foldFull: [5056]
}, {
  code: 43921,
  lower: [],
  title: [],
  upper: [],
  fold: 5057,
  foldFull: [5057]
}, {
  code: 43922,
  lower: [],
  title: [],
  upper: [],
  fold: 5058,
  foldFull: [5058]
}, {
  code: 43923,
  lower: [],
  title: [],
  upper: [],
  fold: 5059,
  foldFull: [5059]
}, {
  code: 43924,
  lower: [],
  title: [],
  upper: [],
  fold: 5060,
  foldFull: [5060]
}, {
  code: 43925,
  lower: [],
  title: [],
  upper: [],
  fold: 5061,
  foldFull: [5061]
}, {
  code: 43926,
  lower: [],
  title: [],
  upper: [],
  fold: 5062,
  foldFull: [5062]
}, {
  code: 43927,
  lower: [],
  title: [],
  upper: [],
  fold: 5063,
  foldFull: [5063]
}, {
  code: 43928,
  lower: [],
  title: [],
  upper: [],
  fold: 5064,
  foldFull: [5064]
}, {
  code: 43929,
  lower: [],
  title: [],
  upper: [],
  fold: 5065,
  foldFull: [5065]
}, {
  code: 43930,
  lower: [],
  title: [],
  upper: [],
  fold: 5066,
  foldFull: [5066]
}, {
  code: 43931,
  lower: [],
  title: [],
  upper: [],
  fold: 5067,
  foldFull: [5067]
}, {
  code: 43932,
  lower: [],
  title: [],
  upper: [],
  fold: 5068,
  foldFull: [5068]
}, {
  code: 43933,
  lower: [],
  title: [],
  upper: [],
  fold: 5069,
  foldFull: [5069]
}, {
  code: 43934,
  lower: [],
  title: [],
  upper: [],
  fold: 5070,
  foldFull: [5070]
}, {
  code: 43935,
  lower: [],
  title: [],
  upper: [],
  fold: 5071,
  foldFull: [5071]
}, {
  code: 43936,
  lower: [],
  title: [],
  upper: [],
  fold: 5072,
  foldFull: [5072]
}, {
  code: 43937,
  lower: [],
  title: [],
  upper: [],
  fold: 5073,
  foldFull: [5073]
}, {
  code: 43938,
  lower: [],
  title: [],
  upper: [],
  fold: 5074,
  foldFull: [5074]
}, {
  code: 43939,
  lower: [],
  title: [],
  upper: [],
  fold: 5075,
  foldFull: [5075]
}, {
  code: 43940,
  lower: [],
  title: [],
  upper: [],
  fold: 5076,
  foldFull: [5076]
}, {
  code: 43941,
  lower: [],
  title: [],
  upper: [],
  fold: 5077,
  foldFull: [5077]
}, {
  code: 43942,
  lower: [],
  title: [],
  upper: [],
  fold: 5078,
  foldFull: [5078]
}, {
  code: 43943,
  lower: [],
  title: [],
  upper: [],
  fold: 5079,
  foldFull: [5079]
}, {
  code: 43944,
  lower: [],
  title: [],
  upper: [],
  fold: 5080,
  foldFull: [5080]
}, {
  code: 43945,
  lower: [],
  title: [],
  upper: [],
  fold: 5081,
  foldFull: [5081]
}, {
  code: 43946,
  lower: [],
  title: [],
  upper: [],
  fold: 5082,
  foldFull: [5082]
}, {
  code: 43947,
  lower: [],
  title: [],
  upper: [],
  fold: 5083,
  foldFull: [5083]
}, {
  code: 43948,
  lower: [],
  title: [],
  upper: [],
  fold: 5084,
  foldFull: [5084]
}, {
  code: 43949,
  lower: [],
  title: [],
  upper: [],
  fold: 5085,
  foldFull: [5085]
}, {
  code: 43950,
  lower: [],
  title: [],
  upper: [],
  fold: 5086,
  foldFull: [5086]
}, {
  code: 43951,
  lower: [],
  title: [],
  upper: [],
  fold: 5087,
  foldFull: [5087]
}, {
  code: 43952,
  lower: [],
  title: [],
  upper: [],
  fold: 5088,
  foldFull: [5088]
}, {
  code: 43953,
  lower: [],
  title: [],
  upper: [],
  fold: 5089,
  foldFull: [5089]
}, {
  code: 43954,
  lower: [],
  title: [],
  upper: [],
  fold: 5090,
  foldFull: [5090]
}, {
  code: 43955,
  lower: [],
  title: [],
  upper: [],
  fold: 5091,
  foldFull: [5091]
}, {
  code: 43956,
  lower: [],
  title: [],
  upper: [],
  fold: 5092,
  foldFull: [5092]
}, {
  code: 43957,
  lower: [],
  title: [],
  upper: [],
  fold: 5093,
  foldFull: [5093]
}, {
  code: 43958,
  lower: [],
  title: [],
  upper: [],
  fold: 5094,
  foldFull: [5094]
}, {
  code: 43959,
  lower: [],
  title: [],
  upper: [],
  fold: 5095,
  foldFull: [5095]
}, {
  code: 43960,
  lower: [],
  title: [],
  upper: [],
  fold: 5096,
  foldFull: [5096]
}, {
  code: 43961,
  lower: [],
  title: [],
  upper: [],
  fold: 5097,
  foldFull: [5097]
}, {
  code: 43962,
  lower: [],
  title: [],
  upper: [],
  fold: 5098,
  foldFull: [5098]
}, {
  code: 43963,
  lower: [],
  title: [],
  upper: [],
  fold: 5099,
  foldFull: [5099]
}, {
  code: 43964,
  lower: [],
  title: [],
  upper: [],
  fold: 5100,
  foldFull: [5100]
}, {
  code: 43965,
  lower: [],
  title: [],
  upper: [],
  fold: 5101,
  foldFull: [5101]
}, {
  code: 43966,
  lower: [],
  title: [],
  upper: [],
  fold: 5102,
  foldFull: [5102]
}, {
  code: 43967,
  lower: [],
  title: [],
  upper: [],
  fold: 5103,
  foldFull: [5103]
}, {
  code: 64256,
  lower: [64256],
  title: [70, 102],
  upper: [70, 70],
  fold: 0,
  foldFull: [102, 102]
}, {
  code: 64256,
  lower: [64256],
  title: [70, 102],
  upper: [70, 70],
  fold: 0,
  foldFull: [102, 102]
}, {
  code: 64257,
  lower: [64257],
  title: [70, 105],
  upper: [70, 73],
  fold: 0,
  foldFull: [102, 105]
}, {
  code: 64257,
  lower: [64257],
  title: [70, 105],
  upper: [70, 73],
  fold: 0,
  foldFull: [102, 105]
}, {
  code: 64258,
  lower: [64258],
  title: [70, 108],
  upper: [70, 76],
  fold: 0,
  foldFull: [102, 108]
}, {
  code: 64258,
  lower: [64258],
  title: [70, 108],
  upper: [70, 76],
  fold: 0,
  foldFull: [102, 108]
}, {
  code: 64259,
  lower: [64259],
  title: [70, 102, 105],
  upper: [70, 70, 73],
  fold: 0,
  foldFull: [102, 102, 105]
}, {
  code: 64259,
  lower: [64259],
  title: [70, 102, 105],
  upper: [70, 70, 73],
  fold: 0,
  foldFull: [102, 102, 105]
}, {
  code: 64260,
  lower: [64260],
  title: [70, 102, 108],
  upper: [70, 70, 76],
  fold: 0,
  foldFull: [102, 102, 108]
}, {
  code: 64260,
  lower: [64260],
  title: [70, 102, 108],
  upper: [70, 70, 76],
  fold: 0,
  foldFull: [102, 102, 108]
}, {
  code: 64261,
  lower: [64261],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64261,
  lower: [64261],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64262,
  lower: [64262],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64262,
  lower: [64262],
  title: [83, 116],
  upper: [83, 84],
  fold: 0,
  foldFull: [115, 116]
}, {
  code: 64275,
  lower: [64275],
  title: [1348, 1398],
  upper: [1348, 1350],
  fold: 0,
  foldFull: [1396, 1398]
}, {
  code: 64275,
  lower: [64275],
  title: [1348, 1398],
  upper: [1348, 1350],
  fold: 0,
  foldFull: [1396, 1398]
}, {
  code: 64276,
  lower: [64276],
  title: [1348, 1381],
  upper: [1348, 1333],
  fold: 0,
  foldFull: [1396, 1381]
}, {
  code: 64276,
  lower: [64276],
  title: [1348, 1381],
  upper: [1348, 1333],
  fold: 0,
  foldFull: [1396, 1381]
}, {
  code: 64277,
  lower: [64277],
  title: [1348, 1387],
  upper: [1348, 1339],
  fold: 0,
  foldFull: [1396, 1387]
}, {
  code: 64277,
  lower: [64277],
  title: [1348, 1387],
  upper: [1348, 1339],
  fold: 0,
  foldFull: [1396, 1387]
}, {
  code: 64278,
  lower: [64278],
  title: [1358, 1398],
  upper: [1358, 1350],
  fold: 0,
  foldFull: [1406, 1398]
}, {
  code: 64278,
  lower: [64278],
  title: [1358, 1398],
  upper: [1358, 1350],
  fold: 0,
  foldFull: [1406, 1398]
}, {
  code: 64279,
  lower: [64279],
  title: [1348, 1389],
  upper: [1348, 1341],
  fold: 0,
  foldFull: [1396, 1389]
}, {
  code: 64279,
  lower: [64279],
  title: [1348, 1389],
  upper: [1348, 1341],
  fold: 0,
  foldFull: [1396, 1389]
}, {
  code: 65313,
  lower: [],
  title: [],
  upper: [],
  fold: 65345,
  foldFull: [65345]
}, {
  code: 65314,
  lower: [],
  title: [],
  upper: [],
  fold: 65346,
  foldFull: [65346]
}, {
  code: 65315,
  lower: [],
  title: [],
  upper: [],
  fold: 65347,
  foldFull: [65347]
}, {
  code: 65316,
  lower: [],
  title: [],
  upper: [],
  fold: 65348,
  foldFull: [65348]
}, {
  code: 65317,
  lower: [],
  title: [],
  upper: [],
  fold: 65349,
  foldFull: [65349]
}, {
  code: 65318,
  lower: [],
  title: [],
  upper: [],
  fold: 65350,
  foldFull: [65350]
}, {
  code: 65319,
  lower: [],
  title: [],
  upper: [],
  fold: 65351,
  foldFull: [65351]
}, {
  code: 65320,
  lower: [],
  title: [],
  upper: [],
  fold: 65352,
  foldFull: [65352]
}, {
  code: 65321,
  lower: [],
  title: [],
  upper: [],
  fold: 65353,
  foldFull: [65353]
}, {
  code: 65322,
  lower: [],
  title: [],
  upper: [],
  fold: 65354,
  foldFull: [65354]
}, {
  code: 65323,
  lower: [],
  title: [],
  upper: [],
  fold: 65355,
  foldFull: [65355]
}, {
  code: 65324,
  lower: [],
  title: [],
  upper: [],
  fold: 65356,
  foldFull: [65356]
}, {
  code: 65325,
  lower: [],
  title: [],
  upper: [],
  fold: 65357,
  foldFull: [65357]
}, {
  code: 65326,
  lower: [],
  title: [],
  upper: [],
  fold: 65358,
  foldFull: [65358]
}, {
  code: 65327,
  lower: [],
  title: [],
  upper: [],
  fold: 65359,
  foldFull: [65359]
}, {
  code: 65328,
  lower: [],
  title: [],
  upper: [],
  fold: 65360,
  foldFull: [65360]
}, {
  code: 65329,
  lower: [],
  title: [],
  upper: [],
  fold: 65361,
  foldFull: [65361]
}, {
  code: 65330,
  lower: [],
  title: [],
  upper: [],
  fold: 65362,
  foldFull: [65362]
}, {
  code: 65331,
  lower: [],
  title: [],
  upper: [],
  fold: 65363,
  foldFull: [65363]
}, {
  code: 65332,
  lower: [],
  title: [],
  upper: [],
  fold: 65364,
  foldFull: [65364]
}, {
  code: 65333,
  lower: [],
  title: [],
  upper: [],
  fold: 65365,
  foldFull: [65365]
}, {
  code: 65334,
  lower: [],
  title: [],
  upper: [],
  fold: 65366,
  foldFull: [65366]
}, {
  code: 65335,
  lower: [],
  title: [],
  upper: [],
  fold: 65367,
  foldFull: [65367]
}, {
  code: 65336,
  lower: [],
  title: [],
  upper: [],
  fold: 65368,
  foldFull: [65368]
}, {
  code: 65337,
  lower: [],
  title: [],
  upper: [],
  fold: 65369,
  foldFull: [65369]
}, {
  code: 65338,
  lower: [],
  title: [],
  upper: [],
  fold: 65370,
  foldFull: [65370]
}, {
  code: 66560,
  lower: [],
  title: [],
  upper: [],
  fold: 66600,
  foldFull: [66600]
}, {
  code: 66561,
  lower: [],
  title: [],
  upper: [],
  fold: 66601,
  foldFull: [66601]
}, {
  code: 66562,
  lower: [],
  title: [],
  upper: [],
  fold: 66602,
  foldFull: [66602]
}, {
  code: 66563,
  lower: [],
  title: [],
  upper: [],
  fold: 66603,
  foldFull: [66603]
}, {
  code: 66564,
  lower: [],
  title: [],
  upper: [],
  fold: 66604,
  foldFull: [66604]
}, {
  code: 66565,
  lower: [],
  title: [],
  upper: [],
  fold: 66605,
  foldFull: [66605]
}, {
  code: 66566,
  lower: [],
  title: [],
  upper: [],
  fold: 66606,
  foldFull: [66606]
}, {
  code: 66567,
  lower: [],
  title: [],
  upper: [],
  fold: 66607,
  foldFull: [66607]
}, {
  code: 66568,
  lower: [],
  title: [],
  upper: [],
  fold: 66608,
  foldFull: [66608]
}, {
  code: 66569,
  lower: [],
  title: [],
  upper: [],
  fold: 66609,
  foldFull: [66609]
}, {
  code: 66570,
  lower: [],
  title: [],
  upper: [],
  fold: 66610,
  foldFull: [66610]
}, {
  code: 66571,
  lower: [],
  title: [],
  upper: [],
  fold: 66611,
  foldFull: [66611]
}, {
  code: 66572,
  lower: [],
  title: [],
  upper: [],
  fold: 66612,
  foldFull: [66612]
}, {
  code: 66573,
  lower: [],
  title: [],
  upper: [],
  fold: 66613,
  foldFull: [66613]
}, {
  code: 66574,
  lower: [],
  title: [],
  upper: [],
  fold: 66614,
  foldFull: [66614]
}, {
  code: 66575,
  lower: [],
  title: [],
  upper: [],
  fold: 66615,
  foldFull: [66615]
}, {
  code: 66576,
  lower: [],
  title: [],
  upper: [],
  fold: 66616,
  foldFull: [66616]
}, {
  code: 66577,
  lower: [],
  title: [],
  upper: [],
  fold: 66617,
  foldFull: [66617]
}, {
  code: 66578,
  lower: [],
  title: [],
  upper: [],
  fold: 66618,
  foldFull: [66618]
}, {
  code: 66579,
  lower: [],
  title: [],
  upper: [],
  fold: 66619,
  foldFull: [66619]
}, {
  code: 66580,
  lower: [],
  title: [],
  upper: [],
  fold: 66620,
  foldFull: [66620]
}, {
  code: 66581,
  lower: [],
  title: [],
  upper: [],
  fold: 66621,
  foldFull: [66621]
}, {
  code: 66582,
  lower: [],
  title: [],
  upper: [],
  fold: 66622,
  foldFull: [66622]
}, {
  code: 66583,
  lower: [],
  title: [],
  upper: [],
  fold: 66623,
  foldFull: [66623]
}, {
  code: 66584,
  lower: [],
  title: [],
  upper: [],
  fold: 66624,
  foldFull: [66624]
}, {
  code: 66585,
  lower: [],
  title: [],
  upper: [],
  fold: 66625,
  foldFull: [66625]
}, {
  code: 66586,
  lower: [],
  title: [],
  upper: [],
  fold: 66626,
  foldFull: [66626]
}, {
  code: 66587,
  lower: [],
  title: [],
  upper: [],
  fold: 66627,
  foldFull: [66627]
}, {
  code: 66588,
  lower: [],
  title: [],
  upper: [],
  fold: 66628,
  foldFull: [66628]
}, {
  code: 66589,
  lower: [],
  title: [],
  upper: [],
  fold: 66629,
  foldFull: [66629]
}, {
  code: 66590,
  lower: [],
  title: [],
  upper: [],
  fold: 66630,
  foldFull: [66630]
}, {
  code: 66591,
  lower: [],
  title: [],
  upper: [],
  fold: 66631,
  foldFull: [66631]
}, {
  code: 66592,
  lower: [],
  title: [],
  upper: [],
  fold: 66632,
  foldFull: [66632]
}, {
  code: 66593,
  lower: [],
  title: [],
  upper: [],
  fold: 66633,
  foldFull: [66633]
}, {
  code: 66594,
  lower: [],
  title: [],
  upper: [],
  fold: 66634,
  foldFull: [66634]
}, {
  code: 66595,
  lower: [],
  title: [],
  upper: [],
  fold: 66635,
  foldFull: [66635]
}, {
  code: 66596,
  lower: [],
  title: [],
  upper: [],
  fold: 66636,
  foldFull: [66636]
}, {
  code: 66597,
  lower: [],
  title: [],
  upper: [],
  fold: 66637,
  foldFull: [66637]
}, {
  code: 66598,
  lower: [],
  title: [],
  upper: [],
  fold: 66638,
  foldFull: [66638]
}, {
  code: 66599,
  lower: [],
  title: [],
  upper: [],
  fold: 66639,
  foldFull: [66639]
}, {
  code: 66736,
  lower: [],
  title: [],
  upper: [],
  fold: 66776,
  foldFull: [66776]
}, {
  code: 66737,
  lower: [],
  title: [],
  upper: [],
  fold: 66777,
  foldFull: [66777]
}, {
  code: 66738,
  lower: [],
  title: [],
  upper: [],
  fold: 66778,
  foldFull: [66778]
}, {
  code: 66739,
  lower: [],
  title: [],
  upper: [],
  fold: 66779,
  foldFull: [66779]
}, {
  code: 66740,
  lower: [],
  title: [],
  upper: [],
  fold: 66780,
  foldFull: [66780]
}, {
  code: 66741,
  lower: [],
  title: [],
  upper: [],
  fold: 66781,
  foldFull: [66781]
}, {
  code: 66742,
  lower: [],
  title: [],
  upper: [],
  fold: 66782,
  foldFull: [66782]
}, {
  code: 66743,
  lower: [],
  title: [],
  upper: [],
  fold: 66783,
  foldFull: [66783]
}, {
  code: 66744,
  lower: [],
  title: [],
  upper: [],
  fold: 66784,
  foldFull: [66784]
}, {
  code: 66745,
  lower: [],
  title: [],
  upper: [],
  fold: 66785,
  foldFull: [66785]
}, {
  code: 66746,
  lower: [],
  title: [],
  upper: [],
  fold: 66786,
  foldFull: [66786]
}, {
  code: 66747,
  lower: [],
  title: [],
  upper: [],
  fold: 66787,
  foldFull: [66787]
}, {
  code: 66748,
  lower: [],
  title: [],
  upper: [],
  fold: 66788,
  foldFull: [66788]
}, {
  code: 66749,
  lower: [],
  title: [],
  upper: [],
  fold: 66789,
  foldFull: [66789]
}, {
  code: 66750,
  lower: [],
  title: [],
  upper: [],
  fold: 66790,
  foldFull: [66790]
}, {
  code: 66751,
  lower: [],
  title: [],
  upper: [],
  fold: 66791,
  foldFull: [66791]
}, {
  code: 66752,
  lower: [],
  title: [],
  upper: [],
  fold: 66792,
  foldFull: [66792]
}, {
  code: 66753,
  lower: [],
  title: [],
  upper: [],
  fold: 66793,
  foldFull: [66793]
}, {
  code: 66754,
  lower: [],
  title: [],
  upper: [],
  fold: 66794,
  foldFull: [66794]
}, {
  code: 66755,
  lower: [],
  title: [],
  upper: [],
  fold: 66795,
  foldFull: [66795]
}, {
  code: 66756,
  lower: [],
  title: [],
  upper: [],
  fold: 66796,
  foldFull: [66796]
}, {
  code: 66757,
  lower: [],
  title: [],
  upper: [],
  fold: 66797,
  foldFull: [66797]
}, {
  code: 66758,
  lower: [],
  title: [],
  upper: [],
  fold: 66798,
  foldFull: [66798]
}, {
  code: 66759,
  lower: [],
  title: [],
  upper: [],
  fold: 66799,
  foldFull: [66799]
}, {
  code: 66760,
  lower: [],
  title: [],
  upper: [],
  fold: 66800,
  foldFull: [66800]
}, {
  code: 66761,
  lower: [],
  title: [],
  upper: [],
  fold: 66801,
  foldFull: [66801]
}, {
  code: 66762,
  lower: [],
  title: [],
  upper: [],
  fold: 66802,
  foldFull: [66802]
}, {
  code: 66763,
  lower: [],
  title: [],
  upper: [],
  fold: 66803,
  foldFull: [66803]
}, {
  code: 66764,
  lower: [],
  title: [],
  upper: [],
  fold: 66804,
  foldFull: [66804]
}, {
  code: 66765,
  lower: [],
  title: [],
  upper: [],
  fold: 66805,
  foldFull: [66805]
}, {
  code: 66766,
  lower: [],
  title: [],
  upper: [],
  fold: 66806,
  foldFull: [66806]
}, {
  code: 66767,
  lower: [],
  title: [],
  upper: [],
  fold: 66807,
  foldFull: [66807]
}, {
  code: 66768,
  lower: [],
  title: [],
  upper: [],
  fold: 66808,
  foldFull: [66808]
}, {
  code: 66769,
  lower: [],
  title: [],
  upper: [],
  fold: 66809,
  foldFull: [66809]
}, {
  code: 66770,
  lower: [],
  title: [],
  upper: [],
  fold: 66810,
  foldFull: [66810]
}, {
  code: 66771,
  lower: [],
  title: [],
  upper: [],
  fold: 66811,
  foldFull: [66811]
}, {
  code: 68736,
  lower: [],
  title: [],
  upper: [],
  fold: 68800,
  foldFull: [68800]
}, {
  code: 68737,
  lower: [],
  title: [],
  upper: [],
  fold: 68801,
  foldFull: [68801]
}, {
  code: 68738,
  lower: [],
  title: [],
  upper: [],
  fold: 68802,
  foldFull: [68802]
}, {
  code: 68739,
  lower: [],
  title: [],
  upper: [],
  fold: 68803,
  foldFull: [68803]
}, {
  code: 68740,
  lower: [],
  title: [],
  upper: [],
  fold: 68804,
  foldFull: [68804]
}, {
  code: 68741,
  lower: [],
  title: [],
  upper: [],
  fold: 68805,
  foldFull: [68805]
}, {
  code: 68742,
  lower: [],
  title: [],
  upper: [],
  fold: 68806,
  foldFull: [68806]
}, {
  code: 68743,
  lower: [],
  title: [],
  upper: [],
  fold: 68807,
  foldFull: [68807]
}, {
  code: 68744,
  lower: [],
  title: [],
  upper: [],
  fold: 68808,
  foldFull: [68808]
}, {
  code: 68745,
  lower: [],
  title: [],
  upper: [],
  fold: 68809,
  foldFull: [68809]
}, {
  code: 68746,
  lower: [],
  title: [],
  upper: [],
  fold: 68810,
  foldFull: [68810]
}, {
  code: 68747,
  lower: [],
  title: [],
  upper: [],
  fold: 68811,
  foldFull: [68811]
}, {
  code: 68748,
  lower: [],
  title: [],
  upper: [],
  fold: 68812,
  foldFull: [68812]
}, {
  code: 68749,
  lower: [],
  title: [],
  upper: [],
  fold: 68813,
  foldFull: [68813]
}, {
  code: 68750,
  lower: [],
  title: [],
  upper: [],
  fold: 68814,
  foldFull: [68814]
}, {
  code: 68751,
  lower: [],
  title: [],
  upper: [],
  fold: 68815,
  foldFull: [68815]
}, {
  code: 68752,
  lower: [],
  title: [],
  upper: [],
  fold: 68816,
  foldFull: [68816]
}, {
  code: 68753,
  lower: [],
  title: [],
  upper: [],
  fold: 68817,
  foldFull: [68817]
}, {
  code: 68754,
  lower: [],
  title: [],
  upper: [],
  fold: 68818,
  foldFull: [68818]
}, {
  code: 68755,
  lower: [],
  title: [],
  upper: [],
  fold: 68819,
  foldFull: [68819]
}, {
  code: 68756,
  lower: [],
  title: [],
  upper: [],
  fold: 68820,
  foldFull: [68820]
}, {
  code: 68757,
  lower: [],
  title: [],
  upper: [],
  fold: 68821,
  foldFull: [68821]
}, {
  code: 68758,
  lower: [],
  title: [],
  upper: [],
  fold: 68822,
  foldFull: [68822]
}, {
  code: 68759,
  lower: [],
  title: [],
  upper: [],
  fold: 68823,
  foldFull: [68823]
}, {
  code: 68760,
  lower: [],
  title: [],
  upper: [],
  fold: 68824,
  foldFull: [68824]
}, {
  code: 68761,
  lower: [],
  title: [],
  upper: [],
  fold: 68825,
  foldFull: [68825]
}, {
  code: 68762,
  lower: [],
  title: [],
  upper: [],
  fold: 68826,
  foldFull: [68826]
}, {
  code: 68763,
  lower: [],
  title: [],
  upper: [],
  fold: 68827,
  foldFull: [68827]
}, {
  code: 68764,
  lower: [],
  title: [],
  upper: [],
  fold: 68828,
  foldFull: [68828]
}, {
  code: 68765,
  lower: [],
  title: [],
  upper: [],
  fold: 68829,
  foldFull: [68829]
}, {
  code: 68766,
  lower: [],
  title: [],
  upper: [],
  fold: 68830,
  foldFull: [68830]
}, {
  code: 68767,
  lower: [],
  title: [],
  upper: [],
  fold: 68831,
  foldFull: [68831]
}, {
  code: 68768,
  lower: [],
  title: [],
  upper: [],
  fold: 68832,
  foldFull: [68832]
}, {
  code: 68769,
  lower: [],
  title: [],
  upper: [],
  fold: 68833,
  foldFull: [68833]
}, {
  code: 68770,
  lower: [],
  title: [],
  upper: [],
  fold: 68834,
  foldFull: [68834]
}, {
  code: 68771,
  lower: [],
  title: [],
  upper: [],
  fold: 68835,
  foldFull: [68835]
}, {
  code: 68772,
  lower: [],
  title: [],
  upper: [],
  fold: 68836,
  foldFull: [68836]
}, {
  code: 68773,
  lower: [],
  title: [],
  upper: [],
  fold: 68837,
  foldFull: [68837]
}, {
  code: 68774,
  lower: [],
  title: [],
  upper: [],
  fold: 68838,
  foldFull: [68838]
}, {
  code: 68775,
  lower: [],
  title: [],
  upper: [],
  fold: 68839,
  foldFull: [68839]
}, {
  code: 68776,
  lower: [],
  title: [],
  upper: [],
  fold: 68840,
  foldFull: [68840]
}, {
  code: 68777,
  lower: [],
  title: [],
  upper: [],
  fold: 68841,
  foldFull: [68841]
}, {
  code: 68778,
  lower: [],
  title: [],
  upper: [],
  fold: 68842,
  foldFull: [68842]
}, {
  code: 68779,
  lower: [],
  title: [],
  upper: [],
  fold: 68843,
  foldFull: [68843]
}, {
  code: 68780,
  lower: [],
  title: [],
  upper: [],
  fold: 68844,
  foldFull: [68844]
}, {
  code: 68781,
  lower: [],
  title: [],
  upper: [],
  fold: 68845,
  foldFull: [68845]
}, {
  code: 68782,
  lower: [],
  title: [],
  upper: [],
  fold: 68846,
  foldFull: [68846]
}, {
  code: 68783,
  lower: [],
  title: [],
  upper: [],
  fold: 68847,
  foldFull: [68847]
}, {
  code: 68784,
  lower: [],
  title: [],
  upper: [],
  fold: 68848,
  foldFull: [68848]
}, {
  code: 68785,
  lower: [],
  title: [],
  upper: [],
  fold: 68849,
  foldFull: [68849]
}, {
  code: 68786,
  lower: [],
  title: [],
  upper: [],
  fold: 68850,
  foldFull: [68850]
}, {
  code: 71840,
  lower: [],
  title: [],
  upper: [],
  fold: 71872,
  foldFull: [71872]
}, {
  code: 71841,
  lower: [],
  title: [],
  upper: [],
  fold: 71873,
  foldFull: [71873]
}, {
  code: 71842,
  lower: [],
  title: [],
  upper: [],
  fold: 71874,
  foldFull: [71874]
}, {
  code: 71843,
  lower: [],
  title: [],
  upper: [],
  fold: 71875,
  foldFull: [71875]
}, {
  code: 71844,
  lower: [],
  title: [],
  upper: [],
  fold: 71876,
  foldFull: [71876]
}, {
  code: 71845,
  lower: [],
  title: [],
  upper: [],
  fold: 71877,
  foldFull: [71877]
}, {
  code: 71846,
  lower: [],
  title: [],
  upper: [],
  fold: 71878,
  foldFull: [71878]
}, {
  code: 71847,
  lower: [],
  title: [],
  upper: [],
  fold: 71879,
  foldFull: [71879]
}, {
  code: 71848,
  lower: [],
  title: [],
  upper: [],
  fold: 71880,
  foldFull: [71880]
}, {
  code: 71849,
  lower: [],
  title: [],
  upper: [],
  fold: 71881,
  foldFull: [71881]
}, {
  code: 71850,
  lower: [],
  title: [],
  upper: [],
  fold: 71882,
  foldFull: [71882]
}, {
  code: 71851,
  lower: [],
  title: [],
  upper: [],
  fold: 71883,
  foldFull: [71883]
}, {
  code: 71852,
  lower: [],
  title: [],
  upper: [],
  fold: 71884,
  foldFull: [71884]
}, {
  code: 71853,
  lower: [],
  title: [],
  upper: [],
  fold: 71885,
  foldFull: [71885]
}, {
  code: 71854,
  lower: [],
  title: [],
  upper: [],
  fold: 71886,
  foldFull: [71886]
}, {
  code: 71855,
  lower: [],
  title: [],
  upper: [],
  fold: 71887,
  foldFull: [71887]
}, {
  code: 71856,
  lower: [],
  title: [],
  upper: [],
  fold: 71888,
  foldFull: [71888]
}, {
  code: 71857,
  lower: [],
  title: [],
  upper: [],
  fold: 71889,
  foldFull: [71889]
}, {
  code: 71858,
  lower: [],
  title: [],
  upper: [],
  fold: 71890,
  foldFull: [71890]
}, {
  code: 71859,
  lower: [],
  title: [],
  upper: [],
  fold: 71891,
  foldFull: [71891]
}, {
  code: 71860,
  lower: [],
  title: [],
  upper: [],
  fold: 71892,
  foldFull: [71892]
}, {
  code: 71861,
  lower: [],
  title: [],
  upper: [],
  fold: 71893,
  foldFull: [71893]
}, {
  code: 71862,
  lower: [],
  title: [],
  upper: [],
  fold: 71894,
  foldFull: [71894]
}, {
  code: 71863,
  lower: [],
  title: [],
  upper: [],
  fold: 71895,
  foldFull: [71895]
}, {
  code: 71864,
  lower: [],
  title: [],
  upper: [],
  fold: 71896,
  foldFull: [71896]
}, {
  code: 71865,
  lower: [],
  title: [],
  upper: [],
  fold: 71897,
  foldFull: [71897]
}, {
  code: 71866,
  lower: [],
  title: [],
  upper: [],
  fold: 71898,
  foldFull: [71898]
}, {
  code: 71867,
  lower: [],
  title: [],
  upper: [],
  fold: 71899,
  foldFull: [71899]
}, {
  code: 71868,
  lower: [],
  title: [],
  upper: [],
  fold: 71900,
  foldFull: [71900]
}, {
  code: 71869,
  lower: [],
  title: [],
  upper: [],
  fold: 71901,
  foldFull: [71901]
}, {
  code: 71870,
  lower: [],
  title: [],
  upper: [],
  fold: 71902,
  foldFull: [71902]
}, {
  code: 71871,
  lower: [],
  title: [],
  upper: [],
  fold: 71903,
  foldFull: [71903]
}, {
  code: 93760,
  lower: [],
  title: [],
  upper: [],
  fold: 93792,
  foldFull: [93792]
}, {
  code: 93761,
  lower: [],
  title: [],
  upper: [],
  fold: 93793,
  foldFull: [93793]
}, {
  code: 93762,
  lower: [],
  title: [],
  upper: [],
  fold: 93794,
  foldFull: [93794]
}, {
  code: 93763,
  lower: [],
  title: [],
  upper: [],
  fold: 93795,
  foldFull: [93795]
}, {
  code: 93764,
  lower: [],
  title: [],
  upper: [],
  fold: 93796,
  foldFull: [93796]
}, {
  code: 93765,
  lower: [],
  title: [],
  upper: [],
  fold: 93797,
  foldFull: [93797]
}, {
  code: 93766,
  lower: [],
  title: [],
  upper: [],
  fold: 93798,
  foldFull: [93798]
}, {
  code: 93767,
  lower: [],
  title: [],
  upper: [],
  fold: 93799,
  foldFull: [93799]
}, {
  code: 93768,
  lower: [],
  title: [],
  upper: [],
  fold: 93800,
  foldFull: [93800]
}, {
  code: 93769,
  lower: [],
  title: [],
  upper: [],
  fold: 93801,
  foldFull: [93801]
}, {
  code: 93770,
  lower: [],
  title: [],
  upper: [],
  fold: 93802,
  foldFull: [93802]
}, {
  code: 93771,
  lower: [],
  title: [],
  upper: [],
  fold: 93803,
  foldFull: [93803]
}, {
  code: 93772,
  lower: [],
  title: [],
  upper: [],
  fold: 93804,
  foldFull: [93804]
}, {
  code: 93773,
  lower: [],
  title: [],
  upper: [],
  fold: 93805,
  foldFull: [93805]
}, {
  code: 93774,
  lower: [],
  title: [],
  upper: [],
  fold: 93806,
  foldFull: [93806]
}, {
  code: 93775,
  lower: [],
  title: [],
  upper: [],
  fold: 93807,
  foldFull: [93807]
}, {
  code: 93776,
  lower: [],
  title: [],
  upper: [],
  fold: 93808,
  foldFull: [93808]
}, {
  code: 93777,
  lower: [],
  title: [],
  upper: [],
  fold: 93809,
  foldFull: [93809]
}, {
  code: 93778,
  lower: [],
  title: [],
  upper: [],
  fold: 93810,
  foldFull: [93810]
}, {
  code: 93779,
  lower: [],
  title: [],
  upper: [],
  fold: 93811,
  foldFull: [93811]
}, {
  code: 93780,
  lower: [],
  title: [],
  upper: [],
  fold: 93812,
  foldFull: [93812]
}, {
  code: 93781,
  lower: [],
  title: [],
  upper: [],
  fold: 93813,
  foldFull: [93813]
}, {
  code: 93782,
  lower: [],
  title: [],
  upper: [],
  fold: 93814,
  foldFull: [93814]
}, {
  code: 93783,
  lower: [],
  title: [],
  upper: [],
  fold: 93815,
  foldFull: [93815]
}, {
  code: 93784,
  lower: [],
  title: [],
  upper: [],
  fold: 93816,
  foldFull: [93816]
}, {
  code: 93785,
  lower: [],
  title: [],
  upper: [],
  fold: 93817,
  foldFull: [93817]
}, {
  code: 93786,
  lower: [],
  title: [],
  upper: [],
  fold: 93818,
  foldFull: [93818]
}, {
  code: 93787,
  lower: [],
  title: [],
  upper: [],
  fold: 93819,
  foldFull: [93819]
}, {
  code: 93788,
  lower: [],
  title: [],
  upper: [],
  fold: 93820,
  foldFull: [93820]
}, {
  code: 93789,
  lower: [],
  title: [],
  upper: [],
  fold: 93821,
  foldFull: [93821]
}, {
  code: 93790,
  lower: [],
  title: [],
  upper: [],
  fold: 93822,
  foldFull: [93822]
}, {
  code: 93791,
  lower: [],
  title: [],
  upper: [],
  fold: 93823,
  foldFull: [93823]
}, {
  code: 125184,
  lower: [],
  title: [],
  upper: [],
  fold: 125218,
  foldFull: [125218]
}, {
  code: 125185,
  lower: [],
  title: [],
  upper: [],
  fold: 125219,
  foldFull: [125219]
}, {
  code: 125186,
  lower: [],
  title: [],
  upper: [],
  fold: 125220,
  foldFull: [125220]
}, {
  code: 125187,
  lower: [],
  title: [],
  upper: [],
  fold: 125221,
  foldFull: [125221]
}, {
  code: 125188,
  lower: [],
  title: [],
  upper: [],
  fold: 125222,
  foldFull: [125222]
}, {
  code: 125189,
  lower: [],
  title: [],
  upper: [],
  fold: 125223,
  foldFull: [125223]
}, {
  code: 125190,
  lower: [],
  title: [],
  upper: [],
  fold: 125224,
  foldFull: [125224]
}, {
  code: 125191,
  lower: [],
  title: [],
  upper: [],
  fold: 125225,
  foldFull: [125225]
}, {
  code: 125192,
  lower: [],
  title: [],
  upper: [],
  fold: 125226,
  foldFull: [125226]
}, {
  code: 125193,
  lower: [],
  title: [],
  upper: [],
  fold: 125227,
  foldFull: [125227]
}, {
  code: 125194,
  lower: [],
  title: [],
  upper: [],
  fold: 125228,
  foldFull: [125228]
}, {
  code: 125195,
  lower: [],
  title: [],
  upper: [],
  fold: 125229,
  foldFull: [125229]
}, {
  code: 125196,
  lower: [],
  title: [],
  upper: [],
  fold: 125230,
  foldFull: [125230]
}, {
  code: 125197,
  lower: [],
  title: [],
  upper: [],
  fold: 125231,
  foldFull: [125231]
}, {
  code: 125198,
  lower: [],
  title: [],
  upper: [],
  fold: 125232,
  foldFull: [125232]
}, {
  code: 125199,
  lower: [],
  title: [],
  upper: [],
  fold: 125233,
  foldFull: [125233]
}, {
  code: 125200,
  lower: [],
  title: [],
  upper: [],
  fold: 125234,
  foldFull: [125234]
}, {
  code: 125201,
  lower: [],
  title: [],
  upper: [],
  fold: 125235,
  foldFull: [125235]
}, {
  code: 125202,
  lower: [],
  title: [],
  upper: [],
  fold: 125236,
  foldFull: [125236]
}, {
  code: 125203,
  lower: [],
  title: [],
  upper: [],
  fold: 125237,
  foldFull: [125237]
}, {
  code: 125204,
  lower: [],
  title: [],
  upper: [],
  fold: 125238,
  foldFull: [125238]
}, {
  code: 125205,
  lower: [],
  title: [],
  upper: [],
  fold: 125239,
  foldFull: [125239]
}, {
  code: 125206,
  lower: [],
  title: [],
  upper: [],
  fold: 125240,
  foldFull: [125240]
}, {
  code: 125207,
  lower: [],
  title: [],
  upper: [],
  fold: 125241,
  foldFull: [125241]
}, {
  code: 125208,
  lower: [],
  title: [],
  upper: [],
  fold: 125242,
  foldFull: [125242]
}, {
  code: 125209,
  lower: [],
  title: [],
  upper: [],
  fold: 125243,
  foldFull: [125243]
}, {
  code: 125210,
  lower: [],
  title: [],
  upper: [],
  fold: 125244,
  foldFull: [125244]
}, {
  code: 125211,
  lower: [],
  title: [],
  upper: [],
  fold: 125245,
  foldFull: [125245]
}, {
  code: 125212,
  lower: [],
  title: [],
  upper: [],
  fold: 125246,
  foldFull: [125246]
}, {
  code: 125213,
  lower: [],
  title: [],
  upper: [],
  fold: 125247,
  foldFull: [125247]
}, {
  code: 125214,
  lower: [],
  title: [],
  upper: [],
  fold: 125248,
  foldFull: [125248]
}, {
  code: 125215,
  lower: [],
  title: [],
  upper: [],
  fold: 125249,
  foldFull: [125249]
}, {
  code: 125216,
  lower: [],
  title: [],
  upper: [],
  fold: 125250,
  foldFull: [125250]
}, {
  code: 125217,
  lower: [],
  title: [],
  upper: [],
  fold: 125251,
  foldFull: [125251]
}];
var recCmp = function(v) {
  return function(v1) {
    return compare2(v.code)(v1.code);
  };
};
var findRule = function(code) {
  var v = bsearch(zeroRec(code))(rules)(length(rules))(recCmp);
  if (v instanceof Nothing) {
    return zeroRec(code);
  }
  ;
  if (v instanceof Just) {
    return v.value0;
  }
  ;
  throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal.Casing (line 1627, column 17 - line 1629, column 14): " + [v.constructor.name]);
};
var lower = function(code) {
  var lowered = findRule(code).lower;
  var $13 = $$null(lowered);
  if ($13) {
    return [uTowlower(code)];
  }
  ;
  return lowered;
};

// output/Data.String.CodePoints/foreign.js
var hasArrayFrom = typeof Array.from === "function";
var hasStringIterator = typeof Symbol !== "undefined" && Symbol != null && typeof Symbol.iterator !== "undefined" && typeof String.prototype[Symbol.iterator] === "function";
var hasFromCodePoint = typeof String.prototype.fromCodePoint === "function";
var hasCodePointAt = typeof String.prototype.codePointAt === "function";
var _unsafeCodePointAt0 = function(fallback) {
  return hasCodePointAt ? function(str) {
    return str.codePointAt(0);
  } : fallback;
};
var _fromCodePointArray = function(singleton7) {
  return hasFromCodePoint ? function(cps) {
    if (cps.length < 1e4) {
      return String.fromCodePoint.apply(String, cps);
    }
    return cps.map(singleton7).join("");
  } : function(cps) {
    return cps.map(singleton7).join("");
  };
};
var _toCodePointArray = function(fallback) {
  return function(unsafeCodePointAt02) {
    if (hasArrayFrom) {
      return function(str) {
        return Array.from(str, unsafeCodePointAt02);
      };
    }
    return fallback;
  };
};

// output/Data.String.CodePoints/index.js
var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
var map10 = /* @__PURE__ */ map(functorMaybe);
var unfoldr2 = /* @__PURE__ */ unfoldr(unfoldableArray);
var div2 = /* @__PURE__ */ div(euclideanRingInt);
var mod2 = /* @__PURE__ */ mod(euclideanRingInt);
var unsurrogate = function(lead) {
  return function(trail) {
    return (((lead - 55296 | 0) * 1024 | 0) + (trail - 56320 | 0) | 0) + 65536 | 0;
  };
};
var isTrail = function(cu) {
  return 56320 <= cu && cu <= 57343;
};
var isLead = function(cu) {
  return 55296 <= cu && cu <= 56319;
};
var uncons3 = function(s2) {
  var v = length2(s2);
  if (v === 0) {
    return Nothing.value;
  }
  ;
  if (v === 1) {
    return new Just({
      head: fromEnum2(charAt(0)(s2)),
      tail: ""
    });
  }
  ;
  var cu1 = fromEnum2(charAt(1)(s2));
  var cu0 = fromEnum2(charAt(0)(s2));
  var $42 = isLead(cu0) && isTrail(cu1);
  if ($42) {
    return new Just({
      head: unsurrogate(cu0)(cu1),
      tail: drop2(2)(s2)
    });
  }
  ;
  return new Just({
    head: cu0,
    tail: drop2(1)(s2)
  });
};
var unconsButWithTuple = function(s2) {
  return map10(function(v) {
    return new Tuple(v.head, v.tail);
  })(uncons3(s2));
};
var toCodePointArrayFallback = function(s2) {
  return unfoldr2(unconsButWithTuple)(s2);
};
var unsafeCodePointAt0Fallback = function(s2) {
  var cu0 = fromEnum2(charAt(0)(s2));
  var $46 = isLead(cu0) && length2(s2) > 1;
  if ($46) {
    var cu1 = fromEnum2(charAt(1)(s2));
    var $47 = isTrail(cu1);
    if ($47) {
      return unsurrogate(cu0)(cu1);
    }
    ;
    return cu0;
  }
  ;
  return cu0;
};
var unsafeCodePointAt0 = /* @__PURE__ */ _unsafeCodePointAt0(unsafeCodePointAt0Fallback);
var toCodePointArray = /* @__PURE__ */ _toCodePointArray(toCodePointArrayFallback)(unsafeCodePointAt0);
var fromCharCode2 = /* @__PURE__ */ function() {
  var $74 = toEnumWithDefaults(boundedEnumChar)(bottom(boundedChar))(top(boundedChar));
  return function($75) {
    return singleton4($74($75));
  };
}();
var singletonFallback = function(v) {
  if (v <= 65535) {
    return fromCharCode2(v);
  }
  ;
  var lead = div2(v - 65536 | 0)(1024) + 55296 | 0;
  var trail = mod2(v - 65536 | 0)(1024) + 56320 | 0;
  return fromCharCode2(lead) + fromCharCode2(trail);
};
var fromCodePointArray = /* @__PURE__ */ _fromCodePointArray(singletonFallback);

// output/Data.CodePoint.Unicode/index.js
var modifyFull = unsafeCoerce2;
var toLower2 = /* @__PURE__ */ modifyFull(lower);

// output/Data.String.Regex/foreign.js
var regexImpl = function(left) {
  return function(right) {
    return function(s1) {
      return function(s2) {
        try {
          return right(new RegExp(s1, s2));
        } catch (e2) {
          return left(e2.message);
        }
      };
    };
  };
};
var test = function(r2) {
  return function(s2) {
    var lastIndex = r2.lastIndex;
    var result = r2.test(s2);
    r2.lastIndex = lastIndex;
    return result;
  };
};
var _match = function(just) {
  return function(nothing) {
    return function(r2) {
      return function(s2) {
        var m2 = s2.match(r2);
        if (m2 == null || m2.length === 0) {
          return nothing;
        } else {
          for (var i2 = 0; i2 < m2.length; i2++) {
            m2[i2] = m2[i2] == null ? nothing : just(m2[i2]);
          }
          return just(m2);
        }
      };
    };
  };
};

// output/Data.String.Regex.Flags/index.js
var global2 = {
  global: true,
  ignoreCase: false,
  multiline: false,
  dotAll: false,
  sticky: false,
  unicode: false
};

// output/Data.String.Regex/index.js
var renderFlags = function(v) {
  return function() {
    if (v.global) {
      return "g";
    }
    ;
    return "";
  }() + (function() {
    if (v.ignoreCase) {
      return "i";
    }
    ;
    return "";
  }() + (function() {
    if (v.multiline) {
      return "m";
    }
    ;
    return "";
  }() + (function() {
    if (v.dotAll) {
      return "s";
    }
    ;
    return "";
  }() + (function() {
    if (v.sticky) {
      return "y";
    }
    ;
    return "";
  }() + function() {
    if (v.unicode) {
      return "u";
    }
    ;
    return "";
  }()))));
};
var regex = function(s2) {
  return function(f3) {
    return regexImpl(Left.create)(Right.create)(s2)(renderFlags(f3));
  };
};
var match = /* @__PURE__ */ function() {
  return _match(Just.create)(Nothing.value);
}();

// output/Data.String.Regex.Unsafe/index.js
var identity8 = /* @__PURE__ */ identity(categoryFn);
var unsafeRegex = function(s2) {
  return function(f3) {
    return either(unsafeCrashWith)(identity8)(regex(s2)(f3));
  };
};

// output/Data.String.Unicode/index.js
var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindArray);
var convertFull = function(f3) {
  var $4 = bindFlipped4(f3);
  return function($5) {
    return fromCodePointArray($4(toCodePointArray($5)));
  };
};
var toLower3 = /* @__PURE__ */ convertFull(toLower2);

// output/Data.String.Extra/index.js
var foldMap2 = /* @__PURE__ */ foldMap(foldableMaybe);
var foldMap22 = /* @__PURE__ */ foldMap2(monoidArray);
var map11 = /* @__PURE__ */ map(functorArray);
var regexGlobal = function(regexStr) {
  return unsafeRegex(regexStr)(global2);
};
var regexHasASCIIWords = /* @__PURE__ */ regexGlobal("[^\0-/:-@[-`{-\x7F]+");
var regexHasUnicodeWords = /* @__PURE__ */ regexGlobal("[a-z][A-Z]|[A-Z]{2,}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9]");
var regexUnicodeWords = /* @__PURE__ */ function() {
  var rsUpper = "[A-Z\\xc0-\\xd6\\xd8-\\xde]";
  var rsOptVar = "[\\ufe0e\\ufe0f]?";
  var rsLower = "[a-z\\xdf-\\xf6\\xf8-\\xff]";
  var rsDingbat = "[\\u2700-\\u27bf]";
  var rsBreakRange = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
  var rsBreak = "[" + (rsBreakRange + "]");
  var rsMisc = "[^" + ("\\ud800-\\udfff" + (rsBreakRange + "\\d\\u2700-\\u27bfa-z\\xdf-\\xf6\\xf8-\\xffA-Z\\xc0-\\xd6\\xd8-\\xde]"));
  var rsMiscLower = "(?:" + (rsLower + ("|" + (rsMisc + ")")));
  var rsMiscUpper = "(?:" + (rsUpper + ("|" + (rsMisc + ")")));
  var rsNonAstral = "[^\\ud800-\\udfff]";
  var rsOptContrLower = "(?:['\\u2019](?:d|ll|m|re|s|t|ve))?";
  var rsOptContrUpper = "(?:['\\u2019](?:D|LL|M|RE|S|T|VE))?";
  var rsComboRange = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\u1ab0-\\u1aff\\u1dc0-\\u1dff";
  var rsCombo = "[" + (rsComboRange + "]");
  var rsModifier = "(?:" + (rsCombo + "|\\ud83c[\\udffb-\\udfff])");
  var reOptMod = rsModifier + "?";
  var rsOptJoin = "(?:" + ("\\u200d" + ("(?:" + (rsNonAstral + ("|" + ("(?:\\ud83c[\\udde6-\\uddff]){2}" + ("|" + ("[\\ud800-\\udbff][\\udc00-\\udfff]" + (")" + (rsOptVar + (reOptMod + ")*"))))))))));
  var rsSeq = rsOptVar + (reOptMod + rsOptJoin);
  var rsEmoji = "(?:" + (rsDingbat + ("|" + ("(?:\\ud83c[\\udde6-\\uddff]){2}" + ("|" + ("[\\ud800-\\udbff][\\udc00-\\udfff]" + (")" + rsSeq))))));
  return regexGlobal(joinWith("|")([rsUpper + ("?" + (rsLower + ("+" + (rsOptContrLower + ("(?=" + (rsBreak + ("|" + (rsUpper + "|$)")))))))), rsMiscUpper + ("+" + (rsOptContrUpper + ("(?=" + (rsBreak + ("|" + (rsUpper + (rsMiscLower + "|$)"))))))), rsUpper + ("?" + (rsMiscLower + ("+" + rsOptContrLower))), rsUpper + ("+" + rsOptContrUpper), "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", "\\d+", rsEmoji]));
}();
var unicodeWords = /* @__PURE__ */ function() {
  var $19 = foldMap22(catMaybes2);
  var $20 = match(regexUnicodeWords);
  return function($21) {
    return $19($20($21));
  };
}();
var hasUnicodeWords = /* @__PURE__ */ test(regexHasUnicodeWords);
var asciiWords = /* @__PURE__ */ function() {
  var $22 = foldMap22(catMaybes2);
  var $23 = match(regexHasASCIIWords);
  return function($24) {
    return $22($23($24));
  };
}();
var words = function(string3) {
  var $13 = hasUnicodeWords(string3);
  if ($13) {
    return unicodeWords(string3);
  }
  ;
  return asciiWords(string3);
};
var kebabCase = /* @__PURE__ */ function() {
  var $25 = joinWith("-");
  var $26 = map11(toLower3);
  return function($27) {
    return $25($26(words($27)));
  };
}();
var snakeCase = /* @__PURE__ */ function() {
  var $32 = joinWith("_");
  var $33 = map11(toLower3);
  return function($34) {
    return $32($33(words($34)));
  };
}();

// output/Yoga.JSON.Generics.EnumSumRep/index.js
var bind3 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadIdentity));
var readImpl3 = /* @__PURE__ */ readImpl(readForeignString);
var pure4 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
var fail3 = /* @__PURE__ */ fail(monadIdentity);
var writeImpl4 = /* @__PURE__ */ writeImpl(writeForeignString);
var map13 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var alt2 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var genericEnumSumRepConstruc = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return {
    genericEnumReadForeign: function(options) {
      return function(f3) {
        var name3 = reflectSymbol2($$Proxy.value);
        return bind3(readImpl3(f3))(function(s2) {
          var $36 = s2 === options.toConstructorName(name3);
          if ($36) {
            return pure4(NoArguments.value);
          }
          ;
          return fail3(ForeignError.create("Enum string " + (s2 + (" did not match expected string " + name3))));
        });
      };
    },
    genericEnumWriteForeign: function(options) {
      return function(v) {
        return writeImpl4(options.toConstructorName(reflectSymbol2($$Proxy.value)));
      };
    }
  };
};
var genericEnumWriteForeign = function(dict) {
  return dict.genericEnumWriteForeign;
};
var genericWriteForeignEnum = function(dictGeneric) {
  var from3 = from(dictGeneric);
  return function(dictGenericEnumSumRep) {
    var genericEnumWriteForeign1 = genericEnumWriteForeign(dictGenericEnumSumRep);
    return function(options) {
      return function(a) {
        return genericEnumWriteForeign1(options)(from3(a));
      };
    };
  };
};
var genericEnumReadForeign = function(dict) {
  return dict.genericEnumReadForeign;
};
var genericReadForeignEnum = function(dictGeneric) {
  var to2 = to(dictGeneric);
  return function(dictGenericEnumSumRep) {
    var genericEnumReadForeign1 = genericEnumReadForeign(dictGenericEnumSumRep);
    return function(options) {
      return function(f3) {
        return map13(to2)(genericEnumReadForeign1(options)(f3));
      };
    };
  };
};
var genericEnumSumRepSum = function(dictGenericEnumSumRep) {
  var genericEnumReadForeign1 = genericEnumReadForeign(dictGenericEnumSumRep);
  var genericEnumWriteForeign1 = genericEnumWriteForeign(dictGenericEnumSumRep);
  return function(dictGenericEnumSumRep1) {
    var genericEnumReadForeign2 = genericEnumReadForeign(dictGenericEnumSumRep1);
    var genericEnumWriteForeign2 = genericEnumWriteForeign(dictGenericEnumSumRep1);
    return {
      genericEnumReadForeign: function(options) {
        return function(f3) {
          return alt2(map13(Inl.create)(genericEnumReadForeign1(options)(f3)))(map13(Inr.create)(genericEnumReadForeign2(options)(f3)));
        };
      },
      genericEnumWriteForeign: function(options) {
        return function(v) {
          if (v instanceof Inl) {
            return genericEnumWriteForeign1(options)(v.value0);
          }
          ;
          if (v instanceof Inr) {
            return genericEnumWriteForeign2(options)(v.value0);
          }
          ;
          throw new Error("Failed pattern match at Yoga.JSON.Generics.EnumSumRep (line 49, column 37 - line 51, column 51): " + [v.constructor.name]);
        };
      }
    };
  };
};

// output/Backend.Tool.Types/index.js
var genericEnumSumRepSum2 = /* @__PURE__ */ genericEnumSumRepSum(/* @__PURE__ */ genericEnumSumRepConstruc({
  reflectSymbol: function() {
    return "NPM";
  }
}))(/* @__PURE__ */ genericEnumSumRepSum(/* @__PURE__ */ genericEnumSumRepConstruc({
  reflectSymbol: function() {
    return "Spago";
  }
}))(/* @__PURE__ */ genericEnumSumRepSum(/* @__PURE__ */ genericEnumSumRepConstruc({
  reflectSymbol: function() {
    return "Purs";
  }
}))(/* @__PURE__ */ genericEnumSumRepConstruc({
  reflectSymbol: function() {
    return "DhallToJSON";
  }
}))));
var genericEnumConstructor2 = /* @__PURE__ */ genericEnumConstructor(genericEnumNoArguments);
var genericTopConstructor2 = /* @__PURE__ */ genericTopConstructor(genericTopNoArguments);
var genericEnumSum2 = /* @__PURE__ */ genericEnumSum(genericEnumConstructor2)(genericTopConstructor2);
var genericBottomConstructor2 = /* @__PURE__ */ genericBottomConstructor(genericBottomNoArguments);
var genericBottomSum2 = /* @__PURE__ */ genericBottomSum(genericBottomConstructor2);
var genericEnumSum1 = /* @__PURE__ */ genericEnumSum2(/* @__PURE__ */ genericEnumSum2(/* @__PURE__ */ genericEnumSum2(genericEnumConstructor2)(genericBottomConstructor2))(genericBottomSum2))(genericBottomSum2);
var NPM = /* @__PURE__ */ function() {
  function NPM2() {
  }
  ;
  NPM2.value = new NPM2();
  return NPM2;
}();
var Spago = /* @__PURE__ */ function() {
  function Spago2() {
  }
  ;
  Spago2.value = new Spago2();
  return Spago2;
}();
var Purs = /* @__PURE__ */ function() {
  function Purs2() {
  }
  ;
  Purs2.value = new Purs2();
  return Purs2;
}();
var DhallToJSON = /* @__PURE__ */ function() {
  function DhallToJSON2() {
  }
  ;
  DhallToJSON2.value = new DhallToJSON2();
  return DhallToJSON2;
}();
var writeForeignToolPath = writeForeignString;
var genericTool_ = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return NPM.value;
    }
    ;
    if (x2 instanceof Inr && x2.value0 instanceof Inl) {
      return Spago.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && x2.value0.value0 instanceof Inl)) {
      return Purs.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && x2.value0.value0 instanceof Inr)) {
      return DhallToJSON.value;
    }
    ;
    throw new Error("Failed pattern match at Backend.Tool.Types (line 33, column 1 - line 33, column 31): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof NPM) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x2 instanceof Spago) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x2 instanceof Purs) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x2 instanceof DhallToJSON) {
      return new Inr(new Inr(new Inr(NoArguments.value)));
    }
    ;
    throw new Error("Failed pattern match at Backend.Tool.Types (line 33, column 1 - line 33, column 31): " + [x2.constructor.name]);
  }
};
var writeForeignTool = {
  writeImpl: /* @__PURE__ */ genericWriteForeignEnum(genericTool_)(genericEnumSumRepSum2)({
    toConstructorName: snakeCase
  })
};
var eqTool = {
  eq: function(x2) {
    return function(y) {
      if (x2 instanceof NPM && y instanceof NPM) {
        return true;
      }
      ;
      if (x2 instanceof Spago && y instanceof Spago) {
        return true;
      }
      ;
      if (x2 instanceof Purs && y instanceof Purs) {
        return true;
      }
      ;
      if (x2 instanceof DhallToJSON && y instanceof DhallToJSON) {
        return true;
      }
      ;
      return false;
    };
  }
};
var ordTool = {
  compare: function(x2) {
    return function(y) {
      if (x2 instanceof NPM && y instanceof NPM) {
        return EQ.value;
      }
      ;
      if (x2 instanceof NPM) {
        return LT.value;
      }
      ;
      if (y instanceof NPM) {
        return GT.value;
      }
      ;
      if (x2 instanceof Spago && y instanceof Spago) {
        return EQ.value;
      }
      ;
      if (x2 instanceof Spago) {
        return LT.value;
      }
      ;
      if (y instanceof Spago) {
        return GT.value;
      }
      ;
      if (x2 instanceof Purs && y instanceof Purs) {
        return EQ.value;
      }
      ;
      if (x2 instanceof Purs) {
        return LT.value;
      }
      ;
      if (y instanceof Purs) {
        return GT.value;
      }
      ;
      if (x2 instanceof DhallToJSON && y instanceof DhallToJSON) {
        return EQ.value;
      }
      ;
      throw new Error("Failed pattern match at Backend.Tool.Types (line 0, column 0 - line 0, column 0): " + [x2.constructor.name, y.constructor.name]);
    };
  },
  Eq0: function() {
    return eqTool;
  }
};
var enumTool = {
  succ: /* @__PURE__ */ genericSucc(genericTool_)(genericEnumSum1),
  pred: /* @__PURE__ */ genericPred(genericTool_)(genericEnumSum1),
  Ord0: function() {
    return ordTool;
  }
};
var boundedTool = {
  top: /* @__PURE__ */ genericTop(genericTool_)(/* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(genericTopConstructor2)))),
  bottom: /* @__PURE__ */ genericBottom(genericTool_)(genericBottomSum2),
  Ord0: function() {
    return ordTool;
  }
};
var toCommand = function(v) {
  if (v instanceof NPM) {
    return "npm";
  }
  ;
  if (v instanceof DhallToJSON) {
    return "dhall-to-json";
  }
  ;
  if (v instanceof Spago) {
    return "spago";
  }
  ;
  if (v instanceof Purs) {
    return "purs";
  }
  ;
  throw new Error("Failed pattern match at Backend.Tool.Types (line 20, column 13 - line 24, column 16): " + [v.constructor.name]);
};

// output/Yoga.JSON.Generics.TaggedSumRep/index.js
var bind4 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadIdentity));
var read$prime2 = /* @__PURE__ */ read$prime(/* @__PURE__ */ readForeignObject(readForeignForeign));
var fail4 = /* @__PURE__ */ fail(monadIdentity);
var pure5 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
var read$prime1 = /* @__PURE__ */ read$prime(readForeignString);
var map14 = /* @__PURE__ */ map(functorNonEmptyList);
var map15 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var write4 = /* @__PURE__ */ write3(/* @__PURE__ */ writeForeignObject(writeForeignForeign));
var fromFoldable4 = /* @__PURE__ */ fromFoldable3(foldableArray);
var write1 = /* @__PURE__ */ write3(writeForeignString);
var alt3 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var writeGenericTaggedSumRepN = {
  genericWriteForeignTaggedSumRep: function(v) {
    return function(v1) {
      return $$undefined;
    };
  }
};
var writeGenericTaggedSumRepA = function(dictWriteForeign) {
  var writeImpl7 = writeImpl(dictWriteForeign);
  return {
    genericWriteForeignTaggedSumRep: function(v) {
      return function(v1) {
        return writeImpl7(v1);
      };
    }
  };
};
var readGenericTaggedSumRepCo = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return {
    genericReadForeignTaggedSumRep: function(v) {
      return function(f3) {
        var name3 = v.toConstructorName(reflectSymbol2($$Proxy.value));
        return bind4(read$prime2(f3))(function(v1) {
          return bind4(maybe(fail4(new ErrorAtProperty(v.typeTag, new ForeignError("Missing type tag: " + v.typeTag))))(pure5)(lookup2(v.typeTag)(v1)))(function(typeFgn) {
            return bind4(read$prime1(typeFgn))(function(typeStr) {
              var $78 = typeStr === name3;
              if ($78) {
                return withExcept(map14(ErrorAtProperty.create(name3)))(pure5(NoArguments.value));
              }
              ;
              return fail4(new ForeignError("Wrong type tag " + (typeStr + (" where " + (v.typeTag + " was expected.")))));
            });
          });
        });
      };
    }
  };
};
var readGenericTaggedSumRepAr = function(dictReadForeign) {
  var readImpl6 = readImpl(dictReadForeign);
  return {
    genericReadForeignTaggedSumRep: function(v) {
      return function(f3) {
        return map15(Argument)(readImpl6(f3));
      };
    }
  };
};
var genericWriteForeignTaggedSumRep = function(dict) {
  return dict.genericWriteForeignTaggedSumRep;
};
var writeGenericTaggedSumRepC = function(dictWriteGenericTaggedSumRep) {
  var genericWriteForeignTaggedSumRep1 = genericWriteForeignTaggedSumRep(dictWriteGenericTaggedSumRep);
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return {
      genericWriteForeignTaggedSumRep: function(v) {
        return function(v1) {
          var name3 = v.toConstructorName(reflectSymbol2($$Proxy.value));
          return write4(fromFoldable4([new Tuple(v.typeTag, write1(name3)), new Tuple(v.valueTag, genericWriteForeignTaggedSumRep1(v)(v1))]));
        };
      }
    };
  };
};
var writeGenericTaggedSumRepS = function(dictWriteGenericTaggedSumRep) {
  var genericWriteForeignTaggedSumRep1 = genericWriteForeignTaggedSumRep(dictWriteGenericTaggedSumRep);
  return function(dictWriteGenericTaggedSumRep1) {
    var genericWriteForeignTaggedSumRep2 = genericWriteForeignTaggedSumRep(dictWriteGenericTaggedSumRep1);
    return {
      genericWriteForeignTaggedSumRep: function(options) {
        return function(v) {
          if (v instanceof Inl) {
            return genericWriteForeignTaggedSumRep1(options)(v.value0);
          }
          ;
          if (v instanceof Inr) {
            return genericWriteForeignTaggedSumRep2(options)(v.value0);
          }
          ;
          throw new Error("Failed pattern match at Yoga.JSON.Generics.TaggedSumRep (line 106, column 45 - line 108, column 57): " + [v.constructor.name]);
        };
      }
    };
  };
};
var genericWriteForeignTaggedSum = function(dictGeneric) {
  var from3 = from(dictGeneric);
  return function(dictWriteGenericTaggedSumRep) {
    var genericWriteForeignTaggedSumRep1 = genericWriteForeignTaggedSumRep(dictWriteGenericTaggedSumRep);
    return function(options) {
      return function(r2) {
        return genericWriteForeignTaggedSumRep1(options)(from3(r2));
      };
    };
  };
};
var genericReadForeignTaggedSumRep = function(dict) {
  return dict.genericReadForeignTaggedSumRep;
};
var readGenericTaggedSumRepCo1 = function(dictReadGenericTaggedSumRep) {
  var genericReadForeignTaggedSumRep1 = genericReadForeignTaggedSumRep(dictReadGenericTaggedSumRep);
  return function(dictIsSymbol) {
    var reflectSymbol2 = reflectSymbol(dictIsSymbol);
    return {
      genericReadForeignTaggedSumRep: function(v) {
        return function(f3) {
          var name3 = v.toConstructorName(reflectSymbol2($$Proxy.value));
          return bind4(read$prime2(f3))(function(v1) {
            return bind4(maybe(fail4(new ErrorAtProperty(v.typeTag, new ForeignError("Missing type tag: " + v.typeTag))))(pure5)(lookup2(v.typeTag)(v1)))(function(typeFgn) {
              return bind4(read$prime1(typeFgn))(function(typeStr) {
                return bind4(maybe(fail4(new ErrorAtProperty(v.valueTag, new ForeignError("Missing value tag: " + v.valueTag))))(pure5)(lookup2(v.valueTag)(v1)))(function(value2) {
                  var $94 = typeStr === name3;
                  if ($94) {
                    return withExcept(map14(ErrorAtProperty.create(name3)))(map15(Constructor)(genericReadForeignTaggedSumRep1(v)(value2)));
                  }
                  ;
                  return fail4(new ForeignError("Wrong constructor name tag " + (typeStr + (" where " + (name3 + " was expected.")))));
                });
              });
            });
          });
        };
      }
    };
  };
};
var readGenericTaggedSumRepSu = function(dictReadGenericTaggedSumRep) {
  var genericReadForeignTaggedSumRep1 = genericReadForeignTaggedSumRep(dictReadGenericTaggedSumRep);
  return function(dictReadGenericTaggedSumRep1) {
    var genericReadForeignTaggedSumRep2 = genericReadForeignTaggedSumRep(dictReadGenericTaggedSumRep1);
    return {
      genericReadForeignTaggedSumRep: function(options) {
        return function(f3) {
          return alt3(map15(Inl.create)(genericReadForeignTaggedSumRep1(options)(f3)))(map15(Inr.create)(genericReadForeignTaggedSumRep2(options)(f3)));
        };
      }
    };
  };
};
var genericReadForeignTaggedSum = function(dictGeneric) {
  var to2 = to(dictGeneric);
  return function(dictReadGenericTaggedSumRep) {
    var genericReadForeignTaggedSumRep1 = genericReadForeignTaggedSumRep(dictReadGenericTaggedSumRep);
    return function(options) {
      return function(f3) {
        return map15(to2)(genericReadForeignTaggedSumRep1(options)(f3));
      };
    };
  };
};
var defaultOptions = {
  typeTag: "type",
  valueTag: "value",
  toConstructorName: /* @__PURE__ */ identity(categoryFn)
};

// output/Biz.IPC.GetInstalledTools.Types/index.js
var UnsupportedOperatingSystemIsSymbol = {
  reflectSymbol: function() {
    return "UnsupportedOperatingSystem";
  }
};
var ToolsResultIsSymbol = {
  reflectSymbol: function() {
    return "ToolsResult";
  }
};
var UnsupportedOperatingSystem = /* @__PURE__ */ function() {
  function UnsupportedOperatingSystem2() {
  }
  ;
  UnsupportedOperatingSystem2.value = new UnsupportedOperatingSystem2();
  return UnsupportedOperatingSystem2;
}();
var ToolsResult = /* @__PURE__ */ function() {
  function ToolsResult2(value0) {
    this.value0 = value0;
  }
  ;
  ToolsResult2.create = function(value0) {
    return new ToolsResult2(value0);
  };
  return ToolsResult2;
}();
var genericGetInstalledToolsR = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return UnsupportedOperatingSystem.value;
    }
    ;
    if (x2 instanceof Inr) {
      return new ToolsResult(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.GetInstalledTools.Types (line 14, column 1 - line 14, column 50): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof UnsupportedOperatingSystem) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x2 instanceof ToolsResult) {
      return new Inr(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.GetInstalledTools.Types (line 14, column 1 - line 14, column 50): " + [x2.constructor.name]);
  }
};
var writeForeignGetInstalledT = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericGetInstalledToolsR)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(writeGenericTaggedSumRepN)(UnsupportedOperatingSystemIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignTuple(writeForeignTool)(/* @__PURE__ */ writeForeignMaybe(writeForeignToolPath)))))(ToolsResultIsSymbol)))(defaultOptions)
};

// output/Biz.PureScriptSolutionDefinition.Types/index.js
var TestIsSymbol = {
  reflectSymbol: function() {
    return "Test";
  }
};
var BuildIsSymbol = {
  reflectSymbol: function() {
    return "Build";
  }
};
var genericEnumSumRepSum3 = /* @__PURE__ */ genericEnumSumRepSum(/* @__PURE__ */ genericEnumSumRepConstruc(TestIsSymbol))(/* @__PURE__ */ genericEnumSumRepConstruc(BuildIsSymbol));
var entrypointsIsSymbol = {
  reflectSymbol: function() {
    return "entrypoints";
  }
};
var rootIsSymbol = {
  reflectSymbol: function() {
    return "root";
  }
};
var build_commandIsSymbol = {
  reflectSymbol: function() {
    return "build_command";
  }
};
var spago_fileIsSymbol = {
  reflectSymbol: function() {
    return "spago_file";
  }
};
var typeIsSymbol = {
  reflectSymbol: function() {
    return "type";
  }
};
var SpagoAppIsSymbol = {
  reflectSymbol: function() {
    return "SpagoApp";
  }
};
var SpagoLibraryIsSymbol = {
  reflectSymbol: function() {
    return "SpagoLibrary";
  }
};
var readForeignRecord2 = /* @__PURE__ */ readForeignRecord();
var writeForeignRecord3 = /* @__PURE__ */ writeForeignRecord();
var Test = /* @__PURE__ */ function() {
  function Test2() {
  }
  ;
  Test2.value = new Test2();
  return Test2;
}();
var Build = /* @__PURE__ */ function() {
  function Build2() {
  }
  ;
  Build2.value = new Build2();
  return Build2;
}();
var SpagoApp = /* @__PURE__ */ function() {
  function SpagoApp2(value0) {
    this.value0 = value0;
  }
  ;
  SpagoApp2.create = function(value0) {
    return new SpagoApp2(value0);
  };
  return SpagoApp2;
}();
var SpagoLibrary = /* @__PURE__ */ function() {
  function SpagoLibrary2(value0) {
    this.value0 = value0;
  }
  ;
  SpagoLibrary2.create = function(value0) {
    return new SpagoLibrary2(value0);
  };
  return SpagoLibrary2;
}();
var genericPureScriptProjectD = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return new SpagoApp(x2.value0);
    }
    ;
    if (x2 instanceof Inr) {
      return new SpagoLibrary(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 60, column 1 - line 60, column 54): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof SpagoApp) {
      return new Inl(x2.value0);
    }
    ;
    if (x2 instanceof SpagoLibrary) {
      return new Inr(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 60, column 1 - line 60, column 54): " + [x2.constructor.name]);
  }
};
var genericEntryPointType_ = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return Test.value;
    }
    ;
    if (x2 instanceof Inr) {
      return Build.value;
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 48, column 1 - line 48, column 41): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof Test) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x2 instanceof Build) {
      return new Inr(NoArguments.value);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 48, column 1 - line 48, column 41): " + [x2.constructor.name]);
  }
};
var readForeignEntryPointType = {
  readImpl: /* @__PURE__ */ genericReadForeignEnum(genericEntryPointType_)(genericEnumSumRepSum3)({
    toConstructorName: snakeCase
  })
};
var readGenericTaggedSumRepCo12 = /* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(entrypointsIsSymbol)(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(build_commandIsSymbol)(/* @__PURE__ */ readForeignMaybe(readForeignString))(/* @__PURE__ */ readForeignFieldsCons(spago_fileIsSymbol)(readForeignString)(/* @__PURE__ */ readForeignFieldsCons(typeIsSymbol)(readForeignEntryPointType)(readForeignFieldsNilRowRo)()())()())()())))(/* @__PURE__ */ readForeignFieldsCons(rootIsSymbol)(readForeignString)(readForeignFieldsNilRowRo)()())()())));
var writeForeignEntryPointTyp = {
  writeImpl: /* @__PURE__ */ genericWriteForeignEnum(genericEntryPointType_)(genericEnumSumRepSum3)({
    toConstructorName: snakeCase
  })
};
var writeGenericTaggedSumRepC2 = /* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons(entrypointsIsSymbol)(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons(build_commandIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignString))(/* @__PURE__ */ writeForeignFieldsCons(spago_fileIsSymbol)(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(typeIsSymbol)(writeForeignEntryPointTyp)(writeForeignFieldsNilRowR)()()())()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons(rootIsSymbol)(writeForeignString)(writeForeignFieldsNilRowR)()()())()()())));
var serialisationConfig = {
  typeTag: "type",
  valueTag: "definition",
  toConstructorName: kebabCase
};
var readForeignPureScriptProj = {
  readImpl: /* @__PURE__ */ genericReadForeignTaggedSum(genericPureScriptProjectD)(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo12(SpagoAppIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepCo12(SpagoLibraryIsSymbol)))(serialisationConfig)
};
var writeForeignPureScriptPro = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericPureScriptProjectD)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC2(SpagoAppIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC2(SpagoLibraryIsSymbol)))(serialisationConfig)
};
var pureScriptSolutionFileName = ".purescript-solution.json";

// output/Biz.Spago.Types/index.js
var writeForeignVersion = writeForeignString;
var writeForeignSourceGlob = writeForeignString;
var writeForeignProjectName = writeForeignString;
var readForeignVersion = readForeignString;
var readForeignSourceGlob = readForeignString;
var readForeignProjectName = readForeignString;

// output/Biz.IPC.Message.Types/index.js
var writeImpl5 = /* @__PURE__ */ writeImpl(writeForeignString);
var LoadSpagoProjectIsSymbol = {
  reflectSymbol: function() {
    return "LoadSpagoProject";
  }
};
var readForeignRecord3 = /* @__PURE__ */ readForeignRecord();
var directoryIsSymbol = {
  reflectSymbol: function() {
    return "directory";
  }
};
var filtersIsSymbol = {
  reflectSymbol: function() {
    return "filters";
  }
};
var extensionsIsSymbol = {
  reflectSymbol: function() {
    return "extensions";
  }
};
var nameIsSymbol = {
  reflectSymbol: function() {
    return "name";
  }
};
var readForeignFieldsCons2 = /* @__PURE__ */ readForeignFieldsCons(nameIsSymbol);
var readForeignMaybe2 = /* @__PURE__ */ readForeignMaybe(readForeignString);
var ShowOpenDialogIsSymbol = {
  reflectSymbol: function() {
    return "ShowOpenDialog";
  }
};
var GetInstalledToolsIsSymbol = {
  reflectSymbol: function() {
    return "GetInstalledTools";
  }
};
var GetPureScriptSolutionDefinitionsIsSymbol = {
  reflectSymbol: function() {
    return "GetPureScriptSolutionDefinitions";
  }
};
var GetIsLoggedIntoGithubIsSymbol = {
  reflectSymbol: function() {
    return "GetIsLoggedIntoGithub";
  }
};
var QueryGithubGraphQLIsSymbol = {
  reflectSymbol: function() {
    return "QueryGithubGraphQL";
  }
};
var GithubLoginGetDeviceCodeIsSymbol = {
  reflectSymbol: function() {
    return "GithubLoginGetDeviceCode";
  }
};
var GithubPollAccessTokenIsSymbol = {
  reflectSymbol: function() {
    return "GithubPollAccessToken";
  }
};
var readGenericTaggedSumRepCo13 = /* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(readForeignString));
var CopyToClipboardIsSymbol = {
  reflectSymbol: function() {
    return "CopyToClipboard";
  }
};
var GetClipboardTextIsSymbol = {
  reflectSymbol: function() {
    return "GetClipboardText";
  }
};
var GetSpagoGlobalCacheIsSymbol = {
  reflectSymbol: function() {
    return "GetSpagoGlobalCache";
  }
};
var writeForeignRecord4 = /* @__PURE__ */ writeForeignRecord();
var writeForeignFieldsCons2 = /* @__PURE__ */ writeForeignFieldsCons(nameIsSymbol);
var writeForeignMaybe2 = /* @__PURE__ */ writeForeignMaybe(writeForeignString);
var writeGenericTaggedSumRepC1 = /* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignString));
var FailedIsSymbol = {
  reflectSymbol: function() {
    return "Failed";
  }
};
var SucceededIsSymbol = {
  reflectSymbol: function() {
    return "Succeeded";
  }
};
var invalidSpagoDhallIsSymbol = {
  reflectSymbol: function() {
    return "invalidSpagoDhall";
  }
};
var noSpagoDhallIsSymbol = {
  reflectSymbol: function() {
    return "noSpagoDhall";
  }
};
var nothingSelectedIsSymbol = {
  reflectSymbol: function() {
    return "nothingSelected";
  }
};
var validSpagoDhallIsSymbol = {
  reflectSymbol: function() {
    return "validSpagoDhall";
  }
};
var dependenciesIsSymbol = {
  reflectSymbol: function() {
    return "dependencies";
  }
};
var packagesIsSymbol = {
  reflectSymbol: function() {
    return "packages";
  }
};
var repoIsSymbol = {
  reflectSymbol: function() {
    return "repo";
  }
};
var versionIsSymbol = {
  reflectSymbol: function() {
    return "version";
  }
};
var repositoryIsSymbol = {
  reflectSymbol: function() {
    return "repository";
  }
};
var sourcesIsSymbol = {
  reflectSymbol: function() {
    return "sources";
  }
};
var LoadSpagoProjectResponseIsSymbol = {
  reflectSymbol: function() {
    return "LoadSpagoProjectResponse";
  }
};
var UserSelectedFileIsSymbol = {
  reflectSymbol: function() {
    return "UserSelectedFile";
  }
};
var GetInstalledToolsResponseIsSymbol = {
  reflectSymbol: function() {
    return "GetInstalledToolsResponse";
  }
};
var projectsIsSymbol = {
  reflectSymbol: function() {
    return "projects";
  }
};
var GetPureScriptSolutionDefinitionsResponseIsSymbol = {
  reflectSymbol: function() {
    return "GetPureScriptSolutionDefinitionsResponse";
  }
};
var GetIsLoggedIntoGithubResultIsSymbol = {
  reflectSymbol: function() {
    return "GetIsLoggedIntoGithubResult";
  }
};
var GithubGraphQLResultIsSymbol = {
  reflectSymbol: function() {
    return "GithubGraphQLResult";
  }
};
var GithubLoginGetDeviceCodeResultIsSymbol = {
  reflectSymbol: function() {
    return "GithubLoginGetDeviceCodeResult";
  }
};
var errorIsSymbol = {
  reflectSymbol: function() {
    return "error";
  }
};
var error_descriptionIsSymbol = {
  reflectSymbol: function() {
    return "error_description";
  }
};
var error_uriIsSymbol = {
  reflectSymbol: function() {
    return "error_uri";
  }
};
var access_tokenIsSymbol = {
  reflectSymbol: function() {
    return "access_token";
  }
};
var scopeIsSymbol = {
  reflectSymbol: function() {
    return "scope";
  }
};
var token_typeIsSymbol = {
  reflectSymbol: function() {
    return "token_type";
  }
};
var GithubPollAccessTokenResultIsSymbol = {
  reflectSymbol: function() {
    return "GithubPollAccessTokenResult";
  }
};
var CopyToClipboardResultIsSymbol = {
  reflectSymbol: function() {
    return "CopyToClipboardResult";
  }
};
var GetClipboardTextResultIsSymbol = {
  reflectSymbol: function() {
    return "GetClipboardTextResult";
  }
};
var GetSpagoGlobalCacheResultIsSymbol = {
  reflectSymbol: function() {
    return "GetSpagoGlobalCacheResult";
  }
};
var writeForeignRecord1 = /* @__PURE__ */ writeForeignRecord4(writeForeignFieldsNilRowR);
var writeForeignFieldsCons1 = /* @__PURE__ */ writeForeignFieldsCons(dependenciesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignProjectName));
var NoGithubToken = /* @__PURE__ */ function() {
  function NoGithubToken2() {
  }
  ;
  NoGithubToken2.value = new NoGithubToken2();
  return NoGithubToken2;
}();
var LoadSpagoProject = /* @__PURE__ */ function() {
  function LoadSpagoProject2() {
  }
  ;
  LoadSpagoProject2.value = new LoadSpagoProject2();
  return LoadSpagoProject2;
}();
var ShowOpenDialog = /* @__PURE__ */ function() {
  function ShowOpenDialog2(value0) {
    this.value0 = value0;
  }
  ;
  ShowOpenDialog2.create = function(value0) {
    return new ShowOpenDialog2(value0);
  };
  return ShowOpenDialog2;
}();
var GetInstalledTools = /* @__PURE__ */ function() {
  function GetInstalledTools2() {
  }
  ;
  GetInstalledTools2.value = new GetInstalledTools2();
  return GetInstalledTools2;
}();
var GetPureScriptSolutionDefinitions = /* @__PURE__ */ function() {
  function GetPureScriptSolutionDefinitions2() {
  }
  ;
  GetPureScriptSolutionDefinitions2.value = new GetPureScriptSolutionDefinitions2();
  return GetPureScriptSolutionDefinitions2;
}();
var GetIsLoggedIntoGithub = /* @__PURE__ */ function() {
  function GetIsLoggedIntoGithub2() {
  }
  ;
  GetIsLoggedIntoGithub2.value = new GetIsLoggedIntoGithub2();
  return GetIsLoggedIntoGithub2;
}();
var QueryGithubGraphQL = /* @__PURE__ */ function() {
  function QueryGithubGraphQL2(value0) {
    this.value0 = value0;
  }
  ;
  QueryGithubGraphQL2.create = function(value0) {
    return new QueryGithubGraphQL2(value0);
  };
  return QueryGithubGraphQL2;
}();
var GithubLoginGetDeviceCode = /* @__PURE__ */ function() {
  function GithubLoginGetDeviceCode2() {
  }
  ;
  GithubLoginGetDeviceCode2.value = new GithubLoginGetDeviceCode2();
  return GithubLoginGetDeviceCode2;
}();
var GithubPollAccessToken = /* @__PURE__ */ function() {
  function GithubPollAccessToken2(value0) {
    this.value0 = value0;
  }
  ;
  GithubPollAccessToken2.create = function(value0) {
    return new GithubPollAccessToken2(value0);
  };
  return GithubPollAccessToken2;
}();
var CopyToClipboard = /* @__PURE__ */ function() {
  function CopyToClipboard2(value0) {
    this.value0 = value0;
  }
  ;
  CopyToClipboard2.create = function(value0) {
    return new CopyToClipboard2(value0);
  };
  return CopyToClipboard2;
}();
var GetClipboardText = /* @__PURE__ */ function() {
  function GetClipboardText2() {
  }
  ;
  GetClipboardText2.value = new GetClipboardText2();
  return GetClipboardText2;
}();
var GetSpagoGlobalCache = /* @__PURE__ */ function() {
  function GetSpagoGlobalCache2() {
  }
  ;
  GetSpagoGlobalCache2.value = new GetSpagoGlobalCache2();
  return GetSpagoGlobalCache2;
}();
var Failed = /* @__PURE__ */ function() {
  function Failed2(value0) {
    this.value0 = value0;
  }
  ;
  Failed2.create = function(value0) {
    return new Failed2(value0);
  };
  return Failed2;
}();
var Succeeded = /* @__PURE__ */ function() {
  function Succeeded2(value0) {
    this.value0 = value0;
  }
  ;
  Succeeded2.create = function(value0) {
    return new Succeeded2(value0);
  };
  return Succeeded2;
}();
var LoadSpagoProjectResponse = /* @__PURE__ */ function() {
  function LoadSpagoProjectResponse2(value0) {
    this.value0 = value0;
  }
  ;
  LoadSpagoProjectResponse2.create = function(value0) {
    return new LoadSpagoProjectResponse2(value0);
  };
  return LoadSpagoProjectResponse2;
}();
var UserSelectedFile = /* @__PURE__ */ function() {
  function UserSelectedFile2(value0) {
    this.value0 = value0;
  }
  ;
  UserSelectedFile2.create = function(value0) {
    return new UserSelectedFile2(value0);
  };
  return UserSelectedFile2;
}();
var GetInstalledToolsResponse = /* @__PURE__ */ function() {
  function GetInstalledToolsResponse2(value0) {
    this.value0 = value0;
  }
  ;
  GetInstalledToolsResponse2.create = function(value0) {
    return new GetInstalledToolsResponse2(value0);
  };
  return GetInstalledToolsResponse2;
}();
var GetPureScriptSolutionDefinitionsResponse = /* @__PURE__ */ function() {
  function GetPureScriptSolutionDefinitionsResponse2(value0) {
    this.value0 = value0;
  }
  ;
  GetPureScriptSolutionDefinitionsResponse2.create = function(value0) {
    return new GetPureScriptSolutionDefinitionsResponse2(value0);
  };
  return GetPureScriptSolutionDefinitionsResponse2;
}();
var GetIsLoggedIntoGithubResult = /* @__PURE__ */ function() {
  function GetIsLoggedIntoGithubResult2(value0) {
    this.value0 = value0;
  }
  ;
  GetIsLoggedIntoGithubResult2.create = function(value0) {
    return new GetIsLoggedIntoGithubResult2(value0);
  };
  return GetIsLoggedIntoGithubResult2;
}();
var GithubGraphQLResult = /* @__PURE__ */ function() {
  function GithubGraphQLResult2(value0) {
    this.value0 = value0;
  }
  ;
  GithubGraphQLResult2.create = function(value0) {
    return new GithubGraphQLResult2(value0);
  };
  return GithubGraphQLResult2;
}();
var GithubLoginGetDeviceCodeResult = /* @__PURE__ */ function() {
  function GithubLoginGetDeviceCodeResult2(value0) {
    this.value0 = value0;
  }
  ;
  GithubLoginGetDeviceCodeResult2.create = function(value0) {
    return new GithubLoginGetDeviceCodeResult2(value0);
  };
  return GithubLoginGetDeviceCodeResult2;
}();
var GithubPollAccessTokenResult = /* @__PURE__ */ function() {
  function GithubPollAccessTokenResult2(value0) {
    this.value0 = value0;
  }
  ;
  GithubPollAccessTokenResult2.create = function(value0) {
    return new GithubPollAccessTokenResult2(value0);
  };
  return GithubPollAccessTokenResult2;
}();
var CopyToClipboardResult = /* @__PURE__ */ function() {
  function CopyToClipboardResult2(value0) {
    this.value0 = value0;
  }
  ;
  CopyToClipboardResult2.create = function(value0) {
    return new CopyToClipboardResult2(value0);
  };
  return CopyToClipboardResult2;
}();
var GetClipboardTextResult = /* @__PURE__ */ function() {
  function GetClipboardTextResult2(value0) {
    this.value0 = value0;
  }
  ;
  GetClipboardTextResult2.create = function(value0) {
    return new GetClipboardTextResult2(value0);
  };
  return GetClipboardTextResult2;
}();
var GetSpagoGlobalCacheResult = /* @__PURE__ */ function() {
  function GetSpagoGlobalCacheResult2(value0) {
    this.value0 = value0;
  }
  ;
  GetSpagoGlobalCacheResult2.create = function(value0) {
    return new GetSpagoGlobalCacheResult2(value0);
  };
  return GetSpagoGlobalCacheResult2;
}();
var writeForeignNoGithubToken = {
  writeImpl: function(v) {
    return writeImpl5("no_github_token");
  }
};
var genericMessageToRenderer_ = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return new LoadSpagoProjectResponse(x2.value0);
    }
    ;
    if (x2 instanceof Inr && x2.value0 instanceof Inl) {
      return new UserSelectedFile(x2.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && x2.value0.value0 instanceof Inl)) {
      return new GetInstalledToolsResponse(x2.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && x2.value0.value0.value0 instanceof Inl))) {
      return new GetPureScriptSolutionDefinitionsResponse(x2.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0 instanceof Inl)))) {
      return new GetIsLoggedIntoGithubResult(x2.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0 instanceof Inl))))) {
      return new GithubGraphQLResult(x2.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0 instanceof Inl)))))) {
      return new GithubLoginGetDeviceCodeResult(x2.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inl))))))) {
      return new GithubPollAccessTokenResult(x2.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inl)))))))) {
      return new CopyToClipboardResult(x2.value0.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inl))))))))) {
      return new GetClipboardTextResult(x2.value0.value0.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr))))))))) {
      return new GetSpagoGlobalCacheResult(x2.value0.value0.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 84, column 1 - line 84, column 44): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof LoadSpagoProjectResponse) {
      return new Inl(x2.value0);
    }
    ;
    if (x2 instanceof UserSelectedFile) {
      return new Inr(new Inl(x2.value0));
    }
    ;
    if (x2 instanceof GetInstalledToolsResponse) {
      return new Inr(new Inr(new Inl(x2.value0)));
    }
    ;
    if (x2 instanceof GetPureScriptSolutionDefinitionsResponse) {
      return new Inr(new Inr(new Inr(new Inl(x2.value0))));
    }
    ;
    if (x2 instanceof GetIsLoggedIntoGithubResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0)))));
    }
    ;
    if (x2 instanceof GithubGraphQLResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0))))));
    }
    ;
    if (x2 instanceof GithubLoginGetDeviceCodeResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0)))))));
    }
    ;
    if (x2 instanceof GithubPollAccessTokenResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0))))))));
    }
    ;
    if (x2 instanceof CopyToClipboardResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0)))))))));
    }
    ;
    if (x2 instanceof GetClipboardTextResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0))))))))));
    }
    ;
    if (x2 instanceof GetSpagoGlobalCacheResult) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(x2.value0))))))))));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 84, column 1 - line 84, column 44): " + [x2.constructor.name]);
  }
};
var genericMessageToMain_ = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return LoadSpagoProject.value;
    }
    ;
    if (x2 instanceof Inr && x2.value0 instanceof Inl) {
      return new ShowOpenDialog(x2.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && x2.value0.value0 instanceof Inl)) {
      return GetInstalledTools.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && x2.value0.value0.value0 instanceof Inl))) {
      return GetPureScriptSolutionDefinitions.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0 instanceof Inl)))) {
      return GetIsLoggedIntoGithub.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0 instanceof Inl))))) {
      return new QueryGithubGraphQL(x2.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0 instanceof Inl)))))) {
      return GithubLoginGetDeviceCode.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inl))))))) {
      return new GithubPollAccessToken(x2.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inl)))))))) {
      return new CopyToClipboard(x2.value0.value0.value0.value0.value0.value0.value0.value0.value0);
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inl))))))))) {
      return GetClipboardText.value;
    }
    ;
    if (x2 instanceof Inr && (x2.value0 instanceof Inr && (x2.value0.value0 instanceof Inr && (x2.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && (x2.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr && x2.value0.value0.value0.value0.value0.value0.value0.value0.value0 instanceof Inr))))))))) {
      return GetSpagoGlobalCache.value;
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 71, column 1 - line 71, column 40): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof LoadSpagoProject) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x2 instanceof ShowOpenDialog) {
      return new Inr(new Inl(x2.value0));
    }
    ;
    if (x2 instanceof GetInstalledTools) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x2 instanceof GetPureScriptSolutionDefinitions) {
      return new Inr(new Inr(new Inr(new Inl(NoArguments.value))));
    }
    ;
    if (x2 instanceof GetIsLoggedIntoGithub) {
      return new Inr(new Inr(new Inr(new Inr(new Inl(NoArguments.value)))));
    }
    ;
    if (x2 instanceof QueryGithubGraphQL) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0))))));
    }
    ;
    if (x2 instanceof GithubLoginGetDeviceCode) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(NoArguments.value)))))));
    }
    ;
    if (x2 instanceof GithubPollAccessToken) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0))))))));
    }
    ;
    if (x2 instanceof CopyToClipboard) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(x2.value0)))))))));
    }
    ;
    if (x2 instanceof GetClipboardText) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inl(NoArguments.value))))))))));
    }
    ;
    if (x2 instanceof GetSpagoGlobalCache) {
      return new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(new Inr(NoArguments.value))))))))));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 71, column 1 - line 71, column 40): " + [x2.constructor.name]);
  }
};
var readForeignMessageToMain = {
  readImpl: /* @__PURE__ */ genericReadForeignTaggedSum(genericMessageToMain_)(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(LoadSpagoProjectIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(directoryIsSymbol)(readForeignBoolean)(/* @__PURE__ */ readForeignFieldsCons(filtersIsSymbol)(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(extensionsIsSymbol)(/* @__PURE__ */ readForeignMaybe(/* @__PURE__ */ readForeignArray(readForeignString)))(/* @__PURE__ */ readForeignFieldsCons2(readForeignMaybe2)(readForeignFieldsNilRowRo)()())()())))(readForeignFieldsNilRowRo)()())()())))(ShowOpenDialogIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetInstalledToolsIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetPureScriptSolutionDefinitionsIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetIsLoggedIntoGithubIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(readForeignGithubGraphQLQ))(QueryGithubGraphQLIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GithubLoginGetDeviceCodeIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(readForeignDeviceCode))(GithubPollAccessTokenIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo13(CopyToClipboardIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetClipboardTextIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepCo(GetSpagoGlobalCacheIsSymbol))))))))))))(defaultOptions)
};
var genericFailedOr_ = {
  to: function(x2) {
    if (x2 instanceof Inl) {
      return new Failed(x2.value0);
    }
    ;
    if (x2 instanceof Inr) {
      return new Succeeded(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 62, column 1 - line 62, column 41): " + [x2.constructor.name]);
  },
  from: function(x2) {
    if (x2 instanceof Failed) {
      return new Inl(x2.value0);
    }
    ;
    if (x2 instanceof Succeeded) {
      return new Inr(x2.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 62, column 1 - line 62, column 41): " + [x2.constructor.name]);
  }
};
var genericWriteForeignTaggedSum2 = /* @__PURE__ */ genericWriteForeignTaggedSum(genericFailedOr_);
var writeForeignFailedOr = function(dictWriteForeign) {
  var writeGenericTaggedSumRepS2 = writeGenericTaggedSumRepS(writeGenericTaggedSumRepC(writeGenericTaggedSumRepA(dictWriteForeign))(FailedIsSymbol));
  return function(dictWriteForeign1) {
    return {
      writeImpl: genericWriteForeignTaggedSum2(writeGenericTaggedSumRepS2(writeGenericTaggedSumRepC(writeGenericTaggedSumRepA(dictWriteForeign1))(SucceededIsSymbol)))(defaultOptions)
    };
  };
};
var writeForeignFailedOr1 = /* @__PURE__ */ writeForeignFailedOr(writeForeignString);
var writeForeignMessageToRend = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericMessageToRenderer_)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignVariant()(/* @__PURE__ */ writeForeignVariantCons(invalidSpagoDhallIsSymbol)(writeForeignString)()(/* @__PURE__ */ writeForeignVariantCons(noSpagoDhallIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(nothingSelectedIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(validSpagoDhallIsSymbol)(/* @__PURE__ */ writeForeignRecord4(/* @__PURE__ */ writeForeignFieldsCons1(/* @__PURE__ */ writeForeignFieldsCons2(writeForeignProjectName)(/* @__PURE__ */ writeForeignFieldsCons(packagesIsSymbol)(/* @__PURE__ */ writeForeignObject(/* @__PURE__ */ writeForeignRecord4(/* @__PURE__ */ writeForeignFieldsCons1(/* @__PURE__ */ writeForeignFieldsCons(repoIsSymbol)(writeForeignRepository)(/* @__PURE__ */ writeForeignFieldsCons(versionIsSymbol)(writeForeignVersion)(writeForeignFieldsNilRowR)()()())()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons(repositoryIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignRepository))(/* @__PURE__ */ writeForeignFieldsCons(sourcesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignSourceGlob))(writeForeignFieldsNilRowR)()()())()()())()()())()()())()()()))()(writeForeignVariantNilRow)))))))(LoadSpagoProjectResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignMaybe2))(UserSelectedFileIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignGetInstalledT))(GetInstalledToolsResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignTuple(writeForeignString)(/* @__PURE__ */ writeForeignRecord4(/* @__PURE__ */ writeForeignFieldsCons2(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(projectsIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignPureScriptPro))(writeForeignFieldsNilRowR)()()())()()())))))(GetPureScriptSolutionDefinitionsResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignBoolean))(GetIsLoggedIntoGithubResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignFailedOr(writeForeignNoGithubToken)(writeForeignGithubGraphQL)))(GithubGraphQLResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignFailedOr1(writeForeignDeviceCodeRes)))(GithubLoginGetDeviceCodeResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignFailedOr1(/* @__PURE__ */ writeForeignFailedOr(/* @__PURE__ */ writeForeignRecord4(/* @__PURE__ */ writeForeignFieldsCons(errorIsSymbol)(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(error_descriptionIsSymbol)(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(error_uriIsSymbol)(writeForeignString)(writeForeignFieldsNilRowR)()()())()()())()()()))(/* @__PURE__ */ writeForeignRecord4(/* @__PURE__ */ writeForeignFieldsCons(access_tokenIsSymbol)(writeForeignAccessToken)(/* @__PURE__ */ writeForeignFieldsCons(scopeIsSymbol)(writeForeignScopeList)(/* @__PURE__ */ writeForeignFieldsCons(token_typeIsSymbol)(writeForeignTokenType)(writeForeignFieldsNilRowR)()()())()()())()()())))))(GithubPollAccessTokenResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC1(CopyToClipboardResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC1(GetClipboardTextResultIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignFailedOr1(writeForeignSpagoGlobalCa)))(GetSpagoGlobalCacheResultIsSymbol))))))))))))(defaultOptions)
};
var failedOrFromEither = function(v) {
  if (v instanceof Left) {
    return new Failed(v.value0);
  }
  ;
  if (v instanceof Right) {
    return new Succeeded(v.value0);
  }
  ;
  throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 58, column 22 - line 60, column 24): " + [v.constructor.name]);
};

// output/Backend.OperatingSystem.Types/index.js
var MacOS = /* @__PURE__ */ function() {
  function MacOS2() {
  }
  ;
  MacOS2.value = new MacOS2();
  return MacOS2;
}();
var Linux = /* @__PURE__ */ function() {
  function Linux3() {
  }
  ;
  Linux3.value = new Linux3();
  return Linux3;
}();
var Windows = /* @__PURE__ */ function() {
  function Windows2() {
  }
  ;
  Windows2.value = new Windows2();
  return Windows2;
}();

// output/Effect.Aff/foreign.js
var Aff = function() {
  var EMPTY = {};
  var PURE = "Pure";
  var THROW = "Throw";
  var CATCH = "Catch";
  var SYNC = "Sync";
  var ASYNC = "Async";
  var BIND = "Bind";
  var BRACKET = "Bracket";
  var FORK = "Fork";
  var SEQ = "Sequential";
  var MAP = "Map";
  var APPLY = "Apply";
  var ALT = "Alt";
  var CONS = "Cons";
  var RESUME = "Resume";
  var RELEASE = "Release";
  var FINALIZER = "Finalizer";
  var FINALIZED = "Finalized";
  var FORKED = "Forked";
  var FIBER = "Fiber";
  var THUNK = "Thunk";
  function Aff2(tag, _1, _2, _3) {
    this.tag = tag;
    this._1 = _1;
    this._2 = _2;
    this._3 = _3;
  }
  function AffCtr(tag) {
    var fn = function(_1, _2, _3) {
      return new Aff2(tag, _1, _2, _3);
    };
    fn.tag = tag;
    return fn;
  }
  function nonCanceler2(error6) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error6) {
      setTimeout(function() {
        throw error6;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error6) {
      return left(error6);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error6) {
      k(left(error6))();
      return nonCanceler2;
    }
  }
  var Scheduler = function() {
    var limit = 1024;
    var size5 = 0;
    var ix = 0;
    var queue = new Array(limit);
    var draining = false;
    function drain() {
      var thunk;
      draining = true;
      while (size5 !== 0) {
        size5--;
        thunk = queue[ix];
        queue[ix] = void 0;
        ix = (ix + 1) % limit;
        thunk();
      }
      draining = false;
    }
    return {
      isDraining: function() {
        return draining;
      },
      enqueue: function(cb) {
        var i2, tmp;
        if (size5 === limit) {
          tmp = draining;
          drain();
          draining = tmp;
        }
        queue[(ix + size5) % limit] = cb;
        size5++;
        if (!draining) {
          drain();
        }
      }
    };
  }();
  function Supervisor(util) {
    var fibers = {};
    var fiberId = 0;
    var count = 0;
    return {
      register: function(fiber) {
        var fid = fiberId++;
        fiber.onComplete({
          rethrow: true,
          handler: function(result) {
            return function() {
              count--;
              delete fibers[fid];
            };
          }
        })();
        fibers[fid] = fiber;
        count++;
      },
      isEmpty: function() {
        return count === 0;
      },
      killAll: function(killError, cb) {
        return function() {
          if (count === 0) {
            return cb();
          }
          var killCount = 0;
          var kills = {};
          function kill2(fid) {
            kills[fid] = fibers[fid].kill(killError, function(result) {
              return function() {
                delete kills[fid];
                killCount--;
                if (util.isLeft(result) && util.fromLeft(result)) {
                  setTimeout(function() {
                    throw util.fromLeft(result);
                  }, 0);
                }
                if (killCount === 0) {
                  cb();
                }
              };
            })();
          }
          for (var k in fibers) {
            if (fibers.hasOwnProperty(k)) {
              killCount++;
              kill2(k);
            }
          }
          fibers = {};
          fiberId = 0;
          count = 0;
          return function(error6) {
            return new Aff2(SYNC, function() {
              for (var k2 in kills) {
                if (kills.hasOwnProperty(k2)) {
                  kills[k2]();
                }
              }
            });
          };
        };
      }
    };
  }
  var SUSPENDED = 0;
  var CONTINUE = 1;
  var STEP_BIND = 2;
  var STEP_RESULT = 3;
  var PENDING = 4;
  var RETURN = 5;
  var COMPLETED = 6;
  function Fiber(util, supervisor, aff) {
    var runTick = 0;
    var status = SUSPENDED;
    var step2 = aff;
    var fail6 = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run3(localRunTick) {
      var tmp, result, attempt2;
      while (true) {
        tmp = null;
        result = null;
        attempt2 = null;
        switch (status) {
          case STEP_BIND:
            status = CONTINUE;
            try {
              step2 = bhead(step2);
              if (btail === null) {
                bhead = null;
              } else {
                bhead = btail._1;
                btail = btail._2;
              }
            } catch (e2) {
              status = RETURN;
              fail6 = util.left(e2);
              step2 = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step2)) {
              status = RETURN;
              fail6 = step2;
              step2 = null;
            } else if (bhead === null) {
              status = RETURN;
            } else {
              status = STEP_BIND;
              step2 = util.fromRight(step2);
            }
            break;
          case CONTINUE:
            switch (step2.tag) {
              case BIND:
                if (bhead) {
                  btail = new Aff2(CONS, bhead, btail);
                }
                bhead = step2._2;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case PURE:
                if (bhead === null) {
                  status = RETURN;
                  step2 = util.right(step2._1);
                } else {
                  status = STEP_BIND;
                  step2 = step2._1;
                }
                break;
              case SYNC:
                status = STEP_RESULT;
                step2 = runSync(util.left, util.right, step2._1);
                break;
              case ASYNC:
                status = PENDING;
                step2 = runAsync(util.left, step2._1, function(result2) {
                  return function() {
                    if (runTick !== localRunTick) {
                      return;
                    }
                    runTick++;
                    Scheduler.enqueue(function() {
                      if (runTick !== localRunTick + 1) {
                        return;
                      }
                      status = STEP_RESULT;
                      step2 = result2;
                      run3(runTick);
                    });
                  };
                });
                return;
              case THROW:
                status = RETURN;
                fail6 = util.left(step2._1);
                step2 = null;
                break;
              case CATCH:
                if (bhead === null) {
                  attempts = new Aff2(CONS, step2, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case BRACKET:
                bracketCount++;
                if (bhead === null) {
                  attempts = new Aff2(CONS, step2, attempts, interrupt);
                } else {
                  attempts = new Aff2(CONS, step2, new Aff2(CONS, new Aff2(RESUME, bhead, btail), attempts, interrupt), interrupt);
                }
                bhead = null;
                btail = null;
                status = CONTINUE;
                step2 = step2._1;
                break;
              case FORK:
                status = STEP_RESULT;
                tmp = Fiber(util, supervisor, step2._2);
                if (supervisor) {
                  supervisor.register(tmp);
                }
                if (step2._1) {
                  tmp.run();
                }
                step2 = util.right(tmp);
                break;
              case SEQ:
                status = CONTINUE;
                step2 = sequential2(util, supervisor, step2._1);
                break;
            }
            break;
          case RETURN:
            bhead = null;
            btail = null;
            if (attempts === null) {
              status = COMPLETED;
              step2 = interrupt || fail6 || step2;
            } else {
              tmp = attempts._3;
              attempt2 = attempts._1;
              attempts = attempts._2;
              switch (attempt2.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail6) {
                    status = CONTINUE;
                    step2 = attempt2._2(util.fromLeft(fail6));
                    fail6 = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail6) {
                    status = RETURN;
                  } else {
                    bhead = attempt2._1;
                    btail = attempt2._2;
                    status = STEP_BIND;
                    step2 = util.fromRight(step2);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail6 === null) {
                    result = util.fromRight(step2);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt2._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step2 = attempt2._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail6), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step2 = attempt2._1.killed(util.fromLeft(interrupt))(attempt2._2);
                  } else if (fail6) {
                    step2 = attempt2._1.failed(util.fromLeft(fail6))(attempt2._2);
                  } else {
                    step2 = attempt2._1.completed(util.fromRight(step2))(attempt2._2);
                  }
                  fail6 = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail6), attempts, interrupt);
                  status = CONTINUE;
                  step2 = attempt2._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step2 = attempt2._1;
                  fail6 = attempt2._2;
                  break;
              }
            }
            break;
          case COMPLETED:
            for (var k in joins) {
              if (joins.hasOwnProperty(k)) {
                rethrow = rethrow && joins[k].rethrow;
                runEff(joins[k].handler(step2));
              }
            }
            joins = null;
            if (interrupt && fail6) {
              setTimeout(function() {
                throw util.fromLeft(fail6);
              }, 0);
            } else if (util.isLeft(step2) && rethrow) {
              setTimeout(function() {
                if (rethrow) {
                  throw util.fromLeft(step2);
                }
              }, 0);
            }
            return;
          case SUSPENDED:
            status = CONTINUE;
            break;
          case PENDING:
            return;
        }
      }
    }
    function onComplete(join4) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join4.rethrow;
          join4.handler(step2)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join4;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill2(error6, cb) {
      return function() {
        if (status === COMPLETED) {
          cb(util.right(void 0))();
          return function() {
          };
        }
        var canceler = onComplete({
          rethrow: false,
          handler: function() {
            return cb(util.right(void 0));
          }
        })();
        switch (status) {
          case SUSPENDED:
            interrupt = util.left(error6);
            status = COMPLETED;
            step2 = interrupt;
            run3(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error6);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error6)), attempts, interrupt);
              }
              status = RETURN;
              step2 = null;
              fail6 = null;
              run3(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error6);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step2 = null;
              fail6 = null;
            }
        }
        return canceler;
      };
    }
    function join3(cb) {
      return function() {
        var canceler = onComplete({
          rethrow: false,
          handler: cb
        })();
        if (status === SUSPENDED) {
          run3(runTick);
        }
        return canceler;
      };
    }
    return {
      kill: kill2,
      join: join3,
      onComplete,
      isSuspended: function() {
        return status === SUSPENDED;
      },
      run: function() {
        if (status === SUSPENDED) {
          if (!Scheduler.isDraining()) {
            Scheduler.enqueue(function() {
              run3(runTick);
            });
          } else {
            run3(runTick);
          }
        }
      }
    };
  }
  function runPar(util, supervisor, par, cb) {
    var fiberId = 0;
    var fibers = {};
    var killId = 0;
    var kills = {};
    var early = new Error("[ParAff] Early exit");
    var interrupt = null;
    var root = EMPTY;
    function kill2(error6, par2, cb2) {
      var step2 = par2;
      var head5 = null;
      var tail2 = null;
      var count = 0;
      var kills2 = {};
      var tmp, kid;
      loop:
        while (true) {
          tmp = null;
          switch (step2.tag) {
            case FORKED:
              if (step2._3 === EMPTY) {
                tmp = fibers[step2._1];
                kills2[count++] = tmp.kill(error6, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head5 === null) {
                break loop;
              }
              step2 = head5._2;
              if (tail2 === null) {
                head5 = null;
              } else {
                head5 = tail2._1;
                tail2 = tail2._2;
              }
              break;
            case MAP:
              step2 = step2._2;
              break;
            case APPLY:
            case ALT:
              if (head5) {
                tail2 = new Aff2(CONS, head5, tail2);
              }
              head5 = step2;
              step2 = step2._1;
              break;
          }
        }
      if (count === 0) {
        cb2(util.right(void 0))();
      } else {
        kid = 0;
        tmp = count;
        for (; kid < tmp; kid++) {
          kills2[kid] = kills2[kid]();
        }
      }
      return kills2;
    }
    function join3(result, head5, tail2) {
      var fail6, step2, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail6 = result;
        step2 = null;
      } else {
        step2 = result;
        fail6 = null;
      }
      loop:
        while (true) {
          lhs = null;
          rhs = null;
          tmp = null;
          kid = null;
          if (interrupt !== null) {
            return;
          }
          if (head5 === null) {
            cb(fail6 || step2)();
            return;
          }
          if (head5._3 !== EMPTY) {
            return;
          }
          switch (head5.tag) {
            case MAP:
              if (fail6 === null) {
                head5._3 = util.right(head5._1(util.fromRight(step2)));
                step2 = head5._3;
              } else {
                head5._3 = fail6;
              }
              break;
            case APPLY:
              lhs = head5._1._3;
              rhs = head5._2._3;
              if (fail6) {
                head5._3 = fail6;
                tmp = true;
                kid = killId++;
                kills[kid] = kill2(early, fail6 === lhs ? head5._2 : head5._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join3(fail6, null, null);
                    } else {
                      join3(fail6, tail2._1, tail2._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              } else if (lhs === EMPTY || rhs === EMPTY) {
                return;
              } else {
                step2 = util.right(util.fromRight(lhs)(util.fromRight(rhs)));
                head5._3 = step2;
              }
              break;
            case ALT:
              lhs = head5._1._3;
              rhs = head5._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail6 = step2 === lhs ? rhs : lhs;
                step2 = null;
                head5._3 = fail6;
              } else {
                head5._3 = step2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill2(early, step2 === lhs ? head5._2 : head5._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join3(step2, null, null);
                    } else {
                      join3(step2, tail2._1, tail2._2);
                    }
                  };
                });
                if (tmp) {
                  tmp = false;
                  return;
                }
              }
              break;
          }
          if (tail2 === null) {
            head5 = null;
          } else {
            head5 = tail2._1;
            tail2 = tail2._2;
          }
        }
    }
    function resolve2(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join3(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run3() {
      var status = CONTINUE;
      var step2 = par;
      var head5 = null;
      var tail2 = null;
      var tmp, fid;
      loop:
        while (true) {
          tmp = null;
          fid = null;
          switch (status) {
            case CONTINUE:
              switch (step2.tag) {
                case MAP:
                  if (head5) {
                    tail2 = new Aff2(CONS, head5, tail2);
                  }
                  head5 = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                  step2 = step2._2;
                  break;
                case APPLY:
                  if (head5) {
                    tail2 = new Aff2(CONS, head5, tail2);
                  }
                  head5 = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                case ALT:
                  if (head5) {
                    tail2 = new Aff2(CONS, head5, tail2);
                  }
                  head5 = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step2;
                  step2 = new Aff2(FORKED, fid, new Aff2(CONS, head5, tail2), EMPTY);
                  tmp = Fiber(util, supervisor, tmp);
                  tmp.onComplete({
                    rethrow: false,
                    handler: resolve2(step2)
                  })();
                  fibers[fid] = tmp;
                  if (supervisor) {
                    supervisor.register(tmp);
                  }
              }
              break;
            case RETURN:
              if (head5 === null) {
                break loop;
              }
              if (head5._1 === EMPTY) {
                head5._1 = step2;
                status = CONTINUE;
                step2 = head5._2;
                head5._2 = EMPTY;
              } else {
                head5._2 = step2;
                step2 = head5;
                if (tail2 === null) {
                  head5 = null;
                } else {
                  head5 = tail2._1;
                  tail2 = tail2._2;
                }
              }
          }
        }
      root = step2;
      for (fid = 0; fid < fiberId; fid++) {
        fibers[fid].run();
      }
    }
    function cancel(error6, cb2) {
      interrupt = util.left(error6);
      var innerKills;
      for (var kid in kills) {
        if (kills.hasOwnProperty(kid)) {
          innerKills = kills[kid];
          for (kid in innerKills) {
            if (innerKills.hasOwnProperty(kid)) {
              innerKills[kid]();
            }
          }
        }
      }
      kills = null;
      var newKills = kill2(error6, root, cb2);
      return function(killError) {
        return new Aff2(ASYNC, function(killCb) {
          return function() {
            for (var kid2 in newKills) {
              if (newKills.hasOwnProperty(kid2)) {
                newKills[kid2]();
              }
            }
            return nonCanceler2;
          };
        });
      };
    }
    run3();
    return function(killError) {
      return new Aff2(ASYNC, function(killCb) {
        return function() {
          return cancel(killError, killCb);
        };
      });
    };
  }
  function sequential2(util, supervisor, par) {
    return new Aff2(ASYNC, function(cb) {
      return function() {
        return runPar(util, supervisor, par, cb);
      };
    });
  }
  Aff2.EMPTY = EMPTY;
  Aff2.Pure = AffCtr(PURE);
  Aff2.Throw = AffCtr(THROW);
  Aff2.Catch = AffCtr(CATCH);
  Aff2.Sync = AffCtr(SYNC);
  Aff2.Async = AffCtr(ASYNC);
  Aff2.Bind = AffCtr(BIND);
  Aff2.Bracket = AffCtr(BRACKET);
  Aff2.Fork = AffCtr(FORK);
  Aff2.Seq = AffCtr(SEQ);
  Aff2.ParMap = AffCtr(MAP);
  Aff2.ParApply = AffCtr(APPLY);
  Aff2.ParAlt = AffCtr(ALT);
  Aff2.Fiber = Fiber;
  Aff2.Supervisor = Supervisor;
  Aff2.Scheduler = Scheduler;
  Aff2.nonCanceler = nonCanceler2;
  return Aff2;
}();
var _pure = Aff.Pure;
var _throwError = Aff.Throw;
function _catchError(aff) {
  return function(k) {
    return Aff.Catch(aff, k);
  };
}
function _map(f3) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f3(aff._1));
    } else {
      return Aff.Bind(aff, function(value2) {
        return Aff.Pure(f3(value2));
      });
    }
  };
}
function _bind(aff) {
  return function(k) {
    return Aff.Bind(aff, k);
  };
}
var _liftEffect = Aff.Sync;
function _parAffMap(f3) {
  return function(aff) {
    return Aff.ParMap(f3, aff);
  };
}
function _parAffApply(aff1) {
  return function(aff2) {
    return Aff.ParApply(aff1, aff2);
  };
}
var makeAff = Aff.Async;
function _makeFiber(util, aff) {
  return function() {
    return Aff.Fiber(util, null, aff);
  };
}
var _delay = function() {
  function setDelay(n, k) {
    if (n === 0 && typeof setImmediate !== "undefined") {
      return setImmediate(k);
    } else {
      return setTimeout(k, n);
    }
  }
  function clearDelay(n, t2) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t2);
    } else {
      return clearTimeout(t2);
    }
  }
  return function(right, ms) {
    return Aff.Async(function(cb) {
      return function() {
        var timer = setDelay(ms, cb(right()));
        return function() {
          return Aff.Sync(function() {
            return right(clearDelay(ms, timer));
          });
        };
      };
    });
  };
}();
var _sequential = Aff.Seq;

// output/Control.Parallel.Class/index.js
var sequential = function(dict) {
  return dict.sequential;
};
var parallel = function(dict) {
  return dict.parallel;
};

// output/Control.Parallel/index.js
var identity9 = /* @__PURE__ */ identity(categoryFn);
var parTraverse_ = function(dictParallel) {
  var sequential2 = sequential(dictParallel);
  var traverse_2 = traverse_(dictParallel.Applicative1());
  var parallel2 = parallel(dictParallel);
  return function(dictFoldable) {
    var traverse_1 = traverse_2(dictFoldable);
    return function(f3) {
      var $48 = traverse_1(function($50) {
        return parallel2(f3($50));
      });
      return function($49) {
        return sequential2($48($49));
      };
    };
  };
};
var parSequence_ = function(dictParallel) {
  var parTraverse_1 = parTraverse_(dictParallel);
  return function(dictFoldable) {
    return parTraverse_1(dictFoldable)(identity9);
  };
};

// output/Effect.Aff/index.js
var $runtime_lazy3 = function(name3, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name3 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var $$void4 = /* @__PURE__ */ $$void(functorEffect);
var Canceler = function(x2) {
  return x2;
};
var functorParAff = {
  map: _parAffMap
};
var functorAff = {
  map: _map
};
var ffiUtil = /* @__PURE__ */ function() {
  var unsafeFromRight = function(v) {
    if (v instanceof Right) {
      return v.value0;
    }
    ;
    if (v instanceof Left) {
      return unsafeCrashWith("unsafeFromRight: Left");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 407, column 21 - line 409, column 54): " + [v.constructor.name]);
  };
  var unsafeFromLeft = function(v) {
    if (v instanceof Left) {
      return v.value0;
    }
    ;
    if (v instanceof Right) {
      return unsafeCrashWith("unsafeFromLeft: Right");
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 402, column 20 - line 404, column 55): " + [v.constructor.name]);
  };
  var isLeft = function(v) {
    if (v instanceof Left) {
      return true;
    }
    ;
    if (v instanceof Right) {
      return false;
    }
    ;
    throw new Error("Failed pattern match at Effect.Aff (line 397, column 12 - line 399, column 21): " + [v.constructor.name]);
  };
  return {
    isLeft,
    fromLeft: unsafeFromLeft,
    fromRight: unsafeFromRight,
    left: Left.create,
    right: Right.create
  };
}();
var makeFiber = function(aff) {
  return _makeFiber(ffiUtil, aff);
};
var launchAff = function(aff) {
  return function __do2() {
    var fiber = makeFiber(aff)();
    fiber.run();
    return fiber;
  };
};
var launchAff_ = function($73) {
  return $$void4(launchAff($73));
};
var applyParAff = {
  apply: _parAffApply,
  Functor0: function() {
    return functorParAff;
  }
};
var monadAff = {
  Applicative0: function() {
    return applicativeAff;
  },
  Bind1: function() {
    return bindAff;
  }
};
var bindAff = {
  bind: _bind,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var applicativeAff = {
  pure: _pure,
  Apply0: function() {
    return $lazy_applyAff(0);
  }
};
var $lazy_applyAff = /* @__PURE__ */ $runtime_lazy3("applyAff", "Effect.Aff", function() {
  return {
    apply: ap(monadAff),
    Functor0: function() {
      return functorAff;
    }
  };
});
var pure22 = /* @__PURE__ */ pure(applicativeAff);
var monadEffectAff = {
  liftEffect: _liftEffect,
  Monad0: function() {
    return monadAff;
  }
};
var liftEffect2 = /* @__PURE__ */ liftEffect(monadEffectAff);
var effectCanceler = function($74) {
  return Canceler($$const(liftEffect2($74)));
};
var monadThrowAff = {
  throwError: _throwError,
  Monad0: function() {
    return monadAff;
  }
};
var monadErrorAff = {
  catchError: _catchError,
  MonadThrow0: function() {
    return monadThrowAff;
  }
};
var $$try3 = /* @__PURE__ */ $$try2(monadErrorAff);
var attempt = $$try3;
var parallelAff = {
  parallel: unsafeCoerce2,
  sequential: _sequential,
  Monad0: function() {
    return monadAff;
  },
  Applicative1: function() {
    return $lazy_applicativeParAff(0);
  }
};
var $lazy_applicativeParAff = /* @__PURE__ */ $runtime_lazy3("applicativeParAff", "Effect.Aff", function() {
  return {
    pure: function() {
      var $79 = parallel(parallelAff);
      return function($80) {
        return $79(pure22($80));
      };
    }(),
    Apply0: function() {
      return applyParAff;
    }
  };
});
var parSequence_2 = /* @__PURE__ */ parSequence_(parallelAff)(foldableArray);
var semigroupCanceler = {
  append: function(v) {
    return function(v1) {
      return function(err) {
        return parSequence_2([v(err), v1(err)]);
      };
    };
  }
};
var nonCanceler = /* @__PURE__ */ $$const(/* @__PURE__ */ pure22(unit));
var monoidCanceler = {
  mempty: nonCanceler,
  Semigroup0: function() {
    return semigroupCanceler;
  }
};

// output/Node.ChildProcess/foreign.js
var import_child_process = require("child_process");
function unsafeFromNullable(msg) {
  return (x2) => {
    if (x2 === null)
      throw new Error(msg);
    return x2;
  };
}
function spawnImpl(command) {
  return (args) => (opts) => () => (0, import_child_process.spawn)(command, args, opts);
}
function mkOnExit(mkChildExit) {
  return function onExit3(cp) {
    return (cb) => () => {
      cp.on("exit", (code, signal) => {
        cb(mkChildExit(code)(signal))();
      });
    };
  };
}
function onError(cp) {
  return (cb) => () => {
    cp.on("error", (err) => {
      cb(err)();
    });
  };
}
var _undefined2 = void 0;

// output/Data.Posix.Signal/index.js
var SIGABRT = /* @__PURE__ */ function() {
  function SIGABRT2() {
  }
  ;
  SIGABRT2.value = new SIGABRT2();
  return SIGABRT2;
}();
var SIGALRM = /* @__PURE__ */ function() {
  function SIGALRM2() {
  }
  ;
  SIGALRM2.value = new SIGALRM2();
  return SIGALRM2;
}();
var SIGBUS = /* @__PURE__ */ function() {
  function SIGBUS2() {
  }
  ;
  SIGBUS2.value = new SIGBUS2();
  return SIGBUS2;
}();
var SIGCHLD = /* @__PURE__ */ function() {
  function SIGCHLD2() {
  }
  ;
  SIGCHLD2.value = new SIGCHLD2();
  return SIGCHLD2;
}();
var SIGCLD = /* @__PURE__ */ function() {
  function SIGCLD2() {
  }
  ;
  SIGCLD2.value = new SIGCLD2();
  return SIGCLD2;
}();
var SIGCONT = /* @__PURE__ */ function() {
  function SIGCONT2() {
  }
  ;
  SIGCONT2.value = new SIGCONT2();
  return SIGCONT2;
}();
var SIGEMT = /* @__PURE__ */ function() {
  function SIGEMT2() {
  }
  ;
  SIGEMT2.value = new SIGEMT2();
  return SIGEMT2;
}();
var SIGFPE = /* @__PURE__ */ function() {
  function SIGFPE2() {
  }
  ;
  SIGFPE2.value = new SIGFPE2();
  return SIGFPE2;
}();
var SIGHUP = /* @__PURE__ */ function() {
  function SIGHUP2() {
  }
  ;
  SIGHUP2.value = new SIGHUP2();
  return SIGHUP2;
}();
var SIGILL = /* @__PURE__ */ function() {
  function SIGILL2() {
  }
  ;
  SIGILL2.value = new SIGILL2();
  return SIGILL2;
}();
var SIGINFO = /* @__PURE__ */ function() {
  function SIGINFO2() {
  }
  ;
  SIGINFO2.value = new SIGINFO2();
  return SIGINFO2;
}();
var SIGINT = /* @__PURE__ */ function() {
  function SIGINT2() {
  }
  ;
  SIGINT2.value = new SIGINT2();
  return SIGINT2;
}();
var SIGIO = /* @__PURE__ */ function() {
  function SIGIO2() {
  }
  ;
  SIGIO2.value = new SIGIO2();
  return SIGIO2;
}();
var SIGIOT = /* @__PURE__ */ function() {
  function SIGIOT2() {
  }
  ;
  SIGIOT2.value = new SIGIOT2();
  return SIGIOT2;
}();
var SIGKILL = /* @__PURE__ */ function() {
  function SIGKILL2() {
  }
  ;
  SIGKILL2.value = new SIGKILL2();
  return SIGKILL2;
}();
var SIGLOST = /* @__PURE__ */ function() {
  function SIGLOST2() {
  }
  ;
  SIGLOST2.value = new SIGLOST2();
  return SIGLOST2;
}();
var SIGPIPE = /* @__PURE__ */ function() {
  function SIGPIPE2() {
  }
  ;
  SIGPIPE2.value = new SIGPIPE2();
  return SIGPIPE2;
}();
var SIGPOLL = /* @__PURE__ */ function() {
  function SIGPOLL2() {
  }
  ;
  SIGPOLL2.value = new SIGPOLL2();
  return SIGPOLL2;
}();
var SIGPROF = /* @__PURE__ */ function() {
  function SIGPROF2() {
  }
  ;
  SIGPROF2.value = new SIGPROF2();
  return SIGPROF2;
}();
var SIGPWR = /* @__PURE__ */ function() {
  function SIGPWR2() {
  }
  ;
  SIGPWR2.value = new SIGPWR2();
  return SIGPWR2;
}();
var SIGQUIT = /* @__PURE__ */ function() {
  function SIGQUIT2() {
  }
  ;
  SIGQUIT2.value = new SIGQUIT2();
  return SIGQUIT2;
}();
var SIGSEGV = /* @__PURE__ */ function() {
  function SIGSEGV2() {
  }
  ;
  SIGSEGV2.value = new SIGSEGV2();
  return SIGSEGV2;
}();
var SIGSTKFLT = /* @__PURE__ */ function() {
  function SIGSTKFLT2() {
  }
  ;
  SIGSTKFLT2.value = new SIGSTKFLT2();
  return SIGSTKFLT2;
}();
var SIGSTOP = /* @__PURE__ */ function() {
  function SIGSTOP2() {
  }
  ;
  SIGSTOP2.value = new SIGSTOP2();
  return SIGSTOP2;
}();
var SIGSYS = /* @__PURE__ */ function() {
  function SIGSYS2() {
  }
  ;
  SIGSYS2.value = new SIGSYS2();
  return SIGSYS2;
}();
var SIGTERM = /* @__PURE__ */ function() {
  function SIGTERM2() {
  }
  ;
  SIGTERM2.value = new SIGTERM2();
  return SIGTERM2;
}();
var SIGTRAP = /* @__PURE__ */ function() {
  function SIGTRAP2() {
  }
  ;
  SIGTRAP2.value = new SIGTRAP2();
  return SIGTRAP2;
}();
var SIGTSTP = /* @__PURE__ */ function() {
  function SIGTSTP2() {
  }
  ;
  SIGTSTP2.value = new SIGTSTP2();
  return SIGTSTP2;
}();
var SIGTTIN = /* @__PURE__ */ function() {
  function SIGTTIN2() {
  }
  ;
  SIGTTIN2.value = new SIGTTIN2();
  return SIGTTIN2;
}();
var SIGTTOU = /* @__PURE__ */ function() {
  function SIGTTOU2() {
  }
  ;
  SIGTTOU2.value = new SIGTTOU2();
  return SIGTTOU2;
}();
var SIGUNUSED = /* @__PURE__ */ function() {
  function SIGUNUSED2() {
  }
  ;
  SIGUNUSED2.value = new SIGUNUSED2();
  return SIGUNUSED2;
}();
var SIGURG = /* @__PURE__ */ function() {
  function SIGURG2() {
  }
  ;
  SIGURG2.value = new SIGURG2();
  return SIGURG2;
}();
var SIGUSR1 = /* @__PURE__ */ function() {
  function SIGUSR12() {
  }
  ;
  SIGUSR12.value = new SIGUSR12();
  return SIGUSR12;
}();
var SIGUSR2 = /* @__PURE__ */ function() {
  function SIGUSR22() {
  }
  ;
  SIGUSR22.value = new SIGUSR22();
  return SIGUSR22;
}();
var SIGVTALRM = /* @__PURE__ */ function() {
  function SIGVTALRM2() {
  }
  ;
  SIGVTALRM2.value = new SIGVTALRM2();
  return SIGVTALRM2;
}();
var SIGWINCH = /* @__PURE__ */ function() {
  function SIGWINCH2() {
  }
  ;
  SIGWINCH2.value = new SIGWINCH2();
  return SIGWINCH2;
}();
var SIGXCPU = /* @__PURE__ */ function() {
  function SIGXCPU2() {
  }
  ;
  SIGXCPU2.value = new SIGXCPU2();
  return SIGXCPU2;
}();
var SIGXFSZ = /* @__PURE__ */ function() {
  function SIGXFSZ2() {
  }
  ;
  SIGXFSZ2.value = new SIGXFSZ2();
  return SIGXFSZ2;
}();
var toString = function(s2) {
  if (s2 instanceof SIGABRT) {
    return "SIGABRT";
  }
  ;
  if (s2 instanceof SIGALRM) {
    return "SIGALRM";
  }
  ;
  if (s2 instanceof SIGBUS) {
    return "SIGBUS";
  }
  ;
  if (s2 instanceof SIGCHLD) {
    return "SIGCHLD";
  }
  ;
  if (s2 instanceof SIGCLD) {
    return "SIGCLD";
  }
  ;
  if (s2 instanceof SIGCONT) {
    return "SIGCONT";
  }
  ;
  if (s2 instanceof SIGEMT) {
    return "SIGEMT";
  }
  ;
  if (s2 instanceof SIGFPE) {
    return "SIGFPE";
  }
  ;
  if (s2 instanceof SIGHUP) {
    return "SIGHUP";
  }
  ;
  if (s2 instanceof SIGILL) {
    return "SIGILL";
  }
  ;
  if (s2 instanceof SIGINFO) {
    return "SIGINFO";
  }
  ;
  if (s2 instanceof SIGINT) {
    return "SIGINT";
  }
  ;
  if (s2 instanceof SIGIO) {
    return "SIGIO";
  }
  ;
  if (s2 instanceof SIGIOT) {
    return "SIGIOT";
  }
  ;
  if (s2 instanceof SIGKILL) {
    return "SIGKILL";
  }
  ;
  if (s2 instanceof SIGLOST) {
    return "SIGLOST";
  }
  ;
  if (s2 instanceof SIGPIPE) {
    return "SIGPIPE";
  }
  ;
  if (s2 instanceof SIGPOLL) {
    return "SIGPOLL";
  }
  ;
  if (s2 instanceof SIGPROF) {
    return "SIGPROF";
  }
  ;
  if (s2 instanceof SIGPWR) {
    return "SIGPWR";
  }
  ;
  if (s2 instanceof SIGQUIT) {
    return "SIGQUIT";
  }
  ;
  if (s2 instanceof SIGSEGV) {
    return "SIGSEGV";
  }
  ;
  if (s2 instanceof SIGSTKFLT) {
    return "SIGSTKFLT";
  }
  ;
  if (s2 instanceof SIGSTOP) {
    return "SIGSTOP";
  }
  ;
  if (s2 instanceof SIGSYS) {
    return "SIGSYS";
  }
  ;
  if (s2 instanceof SIGTERM) {
    return "SIGTERM";
  }
  ;
  if (s2 instanceof SIGTRAP) {
    return "SIGTRAP";
  }
  ;
  if (s2 instanceof SIGTSTP) {
    return "SIGTSTP";
  }
  ;
  if (s2 instanceof SIGTTIN) {
    return "SIGTTIN";
  }
  ;
  if (s2 instanceof SIGTTOU) {
    return "SIGTTOU";
  }
  ;
  if (s2 instanceof SIGUNUSED) {
    return "SIGUNUSED";
  }
  ;
  if (s2 instanceof SIGURG) {
    return "SIGURG";
  }
  ;
  if (s2 instanceof SIGUSR1) {
    return "SIGUSR1";
  }
  ;
  if (s2 instanceof SIGUSR2) {
    return "SIGUSR2";
  }
  ;
  if (s2 instanceof SIGVTALRM) {
    return "SIGVTALRM";
  }
  ;
  if (s2 instanceof SIGWINCH) {
    return "SIGWINCH";
  }
  ;
  if (s2 instanceof SIGXCPU) {
    return "SIGXCPU";
  }
  ;
  if (s2 instanceof SIGXFSZ) {
    return "SIGXFSZ";
  }
  ;
  throw new Error("Failed pattern match at Data.Posix.Signal (line 48, column 14 - line 86, column 24): " + [s2.constructor.name]);
};
var showSignal = {
  show: toString
};
var fromString4 = function(s2) {
  if (s2 === "SIGABRT") {
    return new Just(SIGABRT.value);
  }
  ;
  if (s2 === "SIGALRM") {
    return new Just(SIGALRM.value);
  }
  ;
  if (s2 === "SIGBUS") {
    return new Just(SIGBUS.value);
  }
  ;
  if (s2 === "SIGCHLD") {
    return new Just(SIGCHLD.value);
  }
  ;
  if (s2 === "SIGCLD") {
    return new Just(SIGCLD.value);
  }
  ;
  if (s2 === "SIGCONT") {
    return new Just(SIGCONT.value);
  }
  ;
  if (s2 === "SIGEMT") {
    return new Just(SIGEMT.value);
  }
  ;
  if (s2 === "SIGFPE") {
    return new Just(SIGFPE.value);
  }
  ;
  if (s2 === "SIGHUP") {
    return new Just(SIGHUP.value);
  }
  ;
  if (s2 === "SIGILL") {
    return new Just(SIGILL.value);
  }
  ;
  if (s2 === "SIGINFO") {
    return new Just(SIGINFO.value);
  }
  ;
  if (s2 === "SIGINT") {
    return new Just(SIGINT.value);
  }
  ;
  if (s2 === "SIGIO") {
    return new Just(SIGIO.value);
  }
  ;
  if (s2 === "SIGIOT") {
    return new Just(SIGIOT.value);
  }
  ;
  if (s2 === "SIGKILL") {
    return new Just(SIGKILL.value);
  }
  ;
  if (s2 === "SIGLOST") {
    return new Just(SIGLOST.value);
  }
  ;
  if (s2 === "SIGPIPE") {
    return new Just(SIGPIPE.value);
  }
  ;
  if (s2 === "SIGPOLL") {
    return new Just(SIGPOLL.value);
  }
  ;
  if (s2 === "SIGPROF") {
    return new Just(SIGPROF.value);
  }
  ;
  if (s2 === "SIGPWR") {
    return new Just(SIGPWR.value);
  }
  ;
  if (s2 === "SIGQUIT") {
    return new Just(SIGQUIT.value);
  }
  ;
  if (s2 === "SIGSEGV") {
    return new Just(SIGSEGV.value);
  }
  ;
  if (s2 === "SIGSTKFLT") {
    return new Just(SIGSTKFLT.value);
  }
  ;
  if (s2 === "SIGSTOP") {
    return new Just(SIGSTOP.value);
  }
  ;
  if (s2 === "SIGSYS") {
    return new Just(SIGSYS.value);
  }
  ;
  if (s2 === "SIGTERM") {
    return new Just(SIGTERM.value);
  }
  ;
  if (s2 === "SIGTRAP") {
    return new Just(SIGTRAP.value);
  }
  ;
  if (s2 === "SIGTSTP") {
    return new Just(SIGTSTP.value);
  }
  ;
  if (s2 === "SIGTTIN") {
    return new Just(SIGTTIN.value);
  }
  ;
  if (s2 === "SIGTTOU") {
    return new Just(SIGTTOU.value);
  }
  ;
  if (s2 === "SIGUNUSED") {
    return new Just(SIGUNUSED.value);
  }
  ;
  if (s2 === "SIGURG") {
    return new Just(SIGURG.value);
  }
  ;
  if (s2 === "SIGUSR1") {
    return new Just(SIGUSR1.value);
  }
  ;
  if (s2 === "SIGUSR2") {
    return new Just(SIGUSR2.value);
  }
  ;
  if (s2 === "SIGVTALRM") {
    return new Just(SIGVTALRM.value);
  }
  ;
  if (s2 === "SIGWINCH") {
    return new Just(SIGWINCH.value);
  }
  ;
  if (s2 === "SIGXCPU") {
    return new Just(SIGXCPU.value);
  }
  ;
  if (s2 === "SIGXFSZ") {
    return new Just(SIGXFSZ.value);
  }
  ;
  return Nothing.value;
};

// output/Effect.Exception.Unsafe/index.js
var unsafeThrowException = function($1) {
  return unsafePerformEffect(throwException($1));
};
var unsafeThrow = function($2) {
  return unsafeThrowException(error($2));
};

// output/Node.Encoding/index.js
var ASCII = /* @__PURE__ */ function() {
  function ASCII2() {
  }
  ;
  ASCII2.value = new ASCII2();
  return ASCII2;
}();
var UTF8 = /* @__PURE__ */ function() {
  function UTF82() {
  }
  ;
  UTF82.value = new UTF82();
  return UTF82;
}();
var UTF16LE = /* @__PURE__ */ function() {
  function UTF16LE2() {
  }
  ;
  UTF16LE2.value = new UTF16LE2();
  return UTF16LE2;
}();
var UCS2 = /* @__PURE__ */ function() {
  function UCS22() {
  }
  ;
  UCS22.value = new UCS22();
  return UCS22;
}();
var Base64 = /* @__PURE__ */ function() {
  function Base642() {
  }
  ;
  Base642.value = new Base642();
  return Base642;
}();
var Latin1 = /* @__PURE__ */ function() {
  function Latin12() {
  }
  ;
  Latin12.value = new Latin12();
  return Latin12;
}();
var Binary = /* @__PURE__ */ function() {
  function Binary2() {
  }
  ;
  Binary2.value = new Binary2();
  return Binary2;
}();
var Hex = /* @__PURE__ */ function() {
  function Hex2() {
  }
  ;
  Hex2.value = new Hex2();
  return Hex2;
}();
var showEncoding = {
  show: function(v) {
    if (v instanceof ASCII) {
      return "ASCII";
    }
    ;
    if (v instanceof UTF8) {
      return "UTF8";
    }
    ;
    if (v instanceof UTF16LE) {
      return "UTF16LE";
    }
    ;
    if (v instanceof UCS2) {
      return "UCS2";
    }
    ;
    if (v instanceof Base64) {
      return "Base64";
    }
    ;
    if (v instanceof Latin1) {
      return "Latin1";
    }
    ;
    if (v instanceof Binary) {
      return "Binary";
    }
    ;
    if (v instanceof Hex) {
      return "Hex";
    }
    ;
    throw new Error("Failed pattern match at Node.Encoding (line 19, column 1 - line 27, column 23): " + [v.constructor.name]);
  }
};
var encodingToNode = function(v) {
  if (v instanceof ASCII) {
    return "ascii";
  }
  ;
  if (v instanceof UTF8) {
    return "utf8";
  }
  ;
  if (v instanceof UTF16LE) {
    return "utf16le";
  }
  ;
  if (v instanceof UCS2) {
    return "ucs2";
  }
  ;
  if (v instanceof Base64) {
    return "base64";
  }
  ;
  if (v instanceof Latin1) {
    return "latin1";
  }
  ;
  if (v instanceof Binary) {
    return "binary";
  }
  ;
  if (v instanceof Hex) {
    return "hex";
  }
  ;
  throw new Error("Failed pattern match at Node.Encoding (line 31, column 1 - line 31, column 37): " + [v.constructor.name]);
};

// output/Node.ChildProcess/index.js
var map16 = /* @__PURE__ */ map(functorArray);
var map17 = /* @__PURE__ */ map(functorMaybe);
var composeKleisli2 = /* @__PURE__ */ composeKleisli(bindMaybe);
var alt4 = /* @__PURE__ */ alt(altMaybe);
var Pipe = /* @__PURE__ */ function() {
  function Pipe2() {
  }
  ;
  Pipe2.value = new Pipe2();
  return Pipe2;
}();
var Ignore = /* @__PURE__ */ function() {
  function Ignore3() {
  }
  ;
  Ignore3.value = new Ignore3();
  return Ignore3;
}();
var ShareStream = /* @__PURE__ */ function() {
  function ShareStream2(value0) {
    this.value0 = value0;
  }
  ;
  ShareStream2.create = function(value0) {
    return new ShareStream2(value0);
  };
  return ShareStream2;
}();
var ShareFD = /* @__PURE__ */ function() {
  function ShareFD2(value0) {
    this.value0 = value0;
  }
  ;
  ShareFD2.create = function(value0) {
    return new ShareFD2(value0);
  };
  return ShareFD2;
}();
var Normally = /* @__PURE__ */ function() {
  function Normally2(value0) {
    this.value0 = value0;
  }
  ;
  Normally2.create = function(value0) {
    return new Normally2(value0);
  };
  return Normally2;
}();
var BySignal = /* @__PURE__ */ function() {
  function BySignal2(value0) {
    this.value0 = value0;
  }
  ;
  BySignal2.create = function(value0) {
    return new BySignal2(value0);
  };
  return BySignal2;
}();
var toStandardError = unsafeCoerce2;
var toActualStdIOBehaviour = function(b) {
  if (b instanceof Pipe) {
    return "pipe";
  }
  ;
  if (b instanceof Ignore) {
    return "ignore";
  }
  ;
  if (b instanceof ShareFD) {
    return b.value0;
  }
  ;
  if (b instanceof ShareStream) {
    return b.value0;
  }
  ;
  throw new Error("Failed pattern match at Node.ChildProcess (line 517, column 28 - line 521, column 33): " + [b.constructor.name]);
};
var toActualStdIOOptions = /* @__PURE__ */ map16(/* @__PURE__ */ function() {
  var $38 = map17(toActualStdIOBehaviour);
  return function($39) {
    return toNullable($38($39));
  };
}());
var spawn2 = function(cmd) {
  return function(args) {
    var convertOpts = function(opts) {
      return {
        cwd: fromMaybe(_undefined2)(opts.cwd),
        stdio: toActualStdIOOptions(opts.stdio),
        env: toNullable(opts.env),
        detached: opts.detached,
        uid: fromMaybe(_undefined2)(opts.uid),
        gid: fromMaybe(_undefined2)(opts.gid)
      };
    };
    var $40 = spawnImpl(cmd)(args);
    return function($41) {
      return $40(convertOpts($41));
    };
  };
};
var runChildProcess = function(v) {
  return v;
};
var pipe = /* @__PURE__ */ function() {
  return map16(Just.create)([Pipe.value, Pipe.value, Pipe.value]);
}();
var mkExit = function(code) {
  return function(signal) {
    var fromSignal = composeKleisli2(toMaybe)(function() {
      var $43 = map17(BySignal.create);
      return function($44) {
        return $43(fromString4($44));
      };
    }());
    var fromCode = function() {
      var $45 = map17(Normally.create);
      return function($46) {
        return $45(toMaybe($46));
      };
    }();
    var v = alt4(fromCode(code))(fromSignal(signal));
    if (v instanceof Just) {
      return v.value0;
    }
    ;
    if (v instanceof Nothing) {
      return unsafeThrow("Node.ChildProcess.mkExit: Invalid arguments");
    }
    ;
    throw new Error("Failed pattern match at Node.ChildProcess (line 170, column 3 - line 172, column 73): " + [v.constructor.name]);
  };
};
var onExit = /* @__PURE__ */ mkOnExit(mkExit);
var mkEffect = unsafeCoerce2;
var missingStream = function(str) {
  return "Node.ChildProcess: stream not available: " + (str + "\nThis is probably because you passed something other than Pipe to the stdio option when you spawned it.");
};
var stderr = /* @__PURE__ */ function() {
  var $47 = unsafeFromNullable(missingStream("stderr"));
  return function($48) {
    return $47(function(v) {
      return v.stderr;
    }(runChildProcess($48)));
  };
}();
var stdin = /* @__PURE__ */ function() {
  var $49 = unsafeFromNullable(missingStream("stdin"));
  return function($50) {
    return $49(function(v) {
      return v.stdin;
    }(runChildProcess($50)));
  };
}();
var stdout = /* @__PURE__ */ function() {
  var $51 = unsafeFromNullable(missingStream("stdout"));
  return function($52) {
    return $51(function(v) {
      return v.stdout;
    }(runChildProcess($52)));
  };
}();
var kill = function(sig) {
  return function(v) {
    return mkEffect(function(v1) {
      return v.kill(toString(sig));
    });
  };
};
var defaultSpawnOptions = /* @__PURE__ */ function() {
  return {
    cwd: Nothing.value,
    stdio: pipe,
    env: Nothing.value,
    detached: false,
    uid: Nothing.value,
    gid: Nothing.value
  };
}();

// output/Node.Stream/foreign.js
function readChunkImpl(Left2) {
  return (Right2) => (chunk) => {
    if (chunk instanceof Buffer) {
      return Right2(chunk);
    } else if (typeof chunk === "string") {
      return Left2(chunk);
    } else {
      throw new Error("Node.Stream.readChunkImpl: Unrecognised chunk type; expected String or Buffer, got: " + chunk);
    }
  };
}
function onDataEitherImpl(readChunk2) {
  return (r2) => (f3) => () => {
    r2.on("data", (data) => {
      f3(readChunk2(data))();
    });
  };
}
function writeStringImpl(w) {
  return (enc) => (s2) => (done) => () => w.write(s2, enc, done);
}
function endImpl(w) {
  return (done) => () => {
    w.end(null, null, done);
  };
}

// output/Node.Buffer.Class/index.js
var toString2 = function(dict) {
  return dict.toString;
};

// output/Node.Buffer.Internal/foreign.js
function copyAll(a) {
  return () => {
    return Buffer.from(a);
  };
}
function writeInternal(ty) {
  return (value2) => {
    return (offset) => {
      return (buf) => {
        return () => {
          buf["write" + ty](value2, offset);
        };
      };
    };
  };
}
function writeStringInternal(encoding) {
  return (offset) => {
    return (length4) => {
      return (value2) => {
        return (buff) => {
          return () => {
            return buff.write(value2, offset, length4, encoding);
          };
        };
      };
    };
  };
}
function setAtOffset(value2) {
  return (offset) => {
    return (buff) => {
      return () => {
        buff[offset] = value2;
      };
    };
  };
}
function copy(srcStart) {
  return (srcEnd) => {
    return (src) => {
      return (targStart) => {
        return (targ) => {
          return () => {
            return src.copy(targ, targStart, srcStart, srcEnd);
          };
        };
      };
    };
  };
}
function fill(octet) {
  return (start) => {
    return (end2) => {
      return (buf) => {
        return () => {
          buf.fill(octet, start, end2);
        };
      };
    };
  };
}

// output/Node.Buffer.Immutable/foreign.js
function create(size5) {
  return Buffer.alloc(size5);
}
function fromArray2(octets) {
  return Buffer.from(octets);
}
function size2(buff) {
  return buff.length;
}
function toArray2(buff) {
  var json = buff.toJSON();
  return json.data || json;
}
function toArrayBuffer(buff) {
  return buff.buffer.slice(buff.byteOffset, buff.byteOffset + buff.byteLength);
}
function fromArrayBuffer(ab) {
  return Buffer.from(ab);
}
function fromStringImpl2(str) {
  return (encoding) => {
    return Buffer.from(str, encoding);
  };
}
function readImpl4(ty) {
  return (offset) => {
    return (buf) => {
      return buf["read" + ty](offset);
    };
  };
}
function readStringImpl(enc) {
  return (start) => {
    return (end2) => {
      return (buff) => {
        return buff.toString(enc, start, end2);
      };
    };
  };
}
function getAtOffsetImpl(just) {
  return (nothing) => {
    return (offset) => {
      return (buff) => {
        var octet = buff[offset];
        return octet == null ? nothing : just(octet);
      };
    };
  };
}
function toStringImpl(enc) {
  return (buff) => {
    return buff.toString(enc);
  };
}
function slice3(start) {
  return (end2) => {
    return (buff) => {
      return buff.slice(start, end2);
    };
  };
}
function concat2(buffs) {
  return Buffer.concat(buffs);
}
function concatToLength(buffs) {
  return (totalLength) => {
    return Buffer.concat(buffs, totalLength);
  };
}

// output/Node.Buffer.Types/index.js
var UInt8 = /* @__PURE__ */ function() {
  function UInt82() {
  }
  ;
  UInt82.value = new UInt82();
  return UInt82;
}();
var UInt16LE = /* @__PURE__ */ function() {
  function UInt16LE2() {
  }
  ;
  UInt16LE2.value = new UInt16LE2();
  return UInt16LE2;
}();
var UInt16BE = /* @__PURE__ */ function() {
  function UInt16BE2() {
  }
  ;
  UInt16BE2.value = new UInt16BE2();
  return UInt16BE2;
}();
var UInt32LE = /* @__PURE__ */ function() {
  function UInt32LE2() {
  }
  ;
  UInt32LE2.value = new UInt32LE2();
  return UInt32LE2;
}();
var UInt32BE = /* @__PURE__ */ function() {
  function UInt32BE2() {
  }
  ;
  UInt32BE2.value = new UInt32BE2();
  return UInt32BE2;
}();
var Int8 = /* @__PURE__ */ function() {
  function Int82() {
  }
  ;
  Int82.value = new Int82();
  return Int82;
}();
var Int16LE = /* @__PURE__ */ function() {
  function Int16LE2() {
  }
  ;
  Int16LE2.value = new Int16LE2();
  return Int16LE2;
}();
var Int16BE = /* @__PURE__ */ function() {
  function Int16BE2() {
  }
  ;
  Int16BE2.value = new Int16BE2();
  return Int16BE2;
}();
var Int32LE = /* @__PURE__ */ function() {
  function Int32LE2() {
  }
  ;
  Int32LE2.value = new Int32LE2();
  return Int32LE2;
}();
var Int32BE = /* @__PURE__ */ function() {
  function Int32BE2() {
  }
  ;
  Int32BE2.value = new Int32BE2();
  return Int32BE2;
}();
var FloatLE = /* @__PURE__ */ function() {
  function FloatLE2() {
  }
  ;
  FloatLE2.value = new FloatLE2();
  return FloatLE2;
}();
var FloatBE = /* @__PURE__ */ function() {
  function FloatBE2() {
  }
  ;
  FloatBE2.value = new FloatBE2();
  return FloatBE2;
}();
var DoubleLE = /* @__PURE__ */ function() {
  function DoubleLE2() {
  }
  ;
  DoubleLE2.value = new DoubleLE2();
  return DoubleLE2;
}();
var DoubleBE = /* @__PURE__ */ function() {
  function DoubleBE2() {
  }
  ;
  DoubleBE2.value = new DoubleBE2();
  return DoubleBE2;
}();
var showBufferValueType = {
  show: function(v) {
    if (v instanceof UInt8) {
      return "UInt8";
    }
    ;
    if (v instanceof UInt16LE) {
      return "UInt16LE";
    }
    ;
    if (v instanceof UInt16BE) {
      return "UInt16BE";
    }
    ;
    if (v instanceof UInt32LE) {
      return "UInt32LE";
    }
    ;
    if (v instanceof UInt32BE) {
      return "UInt32BE";
    }
    ;
    if (v instanceof Int8) {
      return "Int8";
    }
    ;
    if (v instanceof Int16LE) {
      return "Int16LE";
    }
    ;
    if (v instanceof Int16BE) {
      return "Int16BE";
    }
    ;
    if (v instanceof Int32LE) {
      return "Int32LE";
    }
    ;
    if (v instanceof Int32BE) {
      return "Int32BE";
    }
    ;
    if (v instanceof FloatLE) {
      return "FloatLE";
    }
    ;
    if (v instanceof FloatBE) {
      return "FloatBE";
    }
    ;
    if (v instanceof DoubleLE) {
      return "DoubleLE";
    }
    ;
    if (v instanceof DoubleBE) {
      return "DoubleBE";
    }
    ;
    throw new Error("Failed pattern match at Node.Buffer.Types (line 33, column 1 - line 47, column 29): " + [v.constructor.name]);
  }
};

// output/Node.Buffer.Immutable/index.js
var toString3 = function($7) {
  return toStringImpl(encodingToNode($7));
};
var readString3 = function($8) {
  return readStringImpl(encodingToNode($8));
};
var read4 = /* @__PURE__ */ function() {
  var $9 = show(showBufferValueType);
  return function($10) {
    return readImpl4($9($10));
  };
}();
var getAtOffset = /* @__PURE__ */ function() {
  return getAtOffsetImpl(Just.create)(Nothing.value);
}();
var fromString5 = function(str) {
  var $11 = fromStringImpl2(str);
  return function($12) {
    return $11(encodingToNode($12));
  };
};
var concat$prime = concatToLength;

// output/Node.Buffer.Internal/index.js
var show3 = /* @__PURE__ */ show(showBufferValueType);
var writeString = function(dictMonad) {
  return function($43) {
    return writeStringInternal(encodingToNode($43));
  };
};
var write5 = function(dictMonad) {
  return function($44) {
    return writeInternal(show3($44));
  };
};
var unsafeThaw2 = function(dictMonad) {
  var $45 = pure(dictMonad.Applicative0());
  return function($46) {
    return $45($46);
  };
};
var usingToImmutable = function(dictMonad) {
  var unsafeThaw1 = unsafeThaw2(dictMonad);
  return function(f3) {
    return function(x2) {
      return unsafeThaw1(f3(x2));
    };
  };
};
var unsafeFreeze2 = function(dictMonad) {
  var $47 = pure(dictMonad.Applicative0());
  return function($48) {
    return $47($48);
  };
};
var usingFromImmutable = function(dictMonad) {
  var map28 = map(dictMonad.Bind1().Apply0().Functor0());
  var unsafeFreeze1 = unsafeFreeze2(dictMonad);
  return function(f3) {
    return function(buf) {
      return map28(f3)(unsafeFreeze1(buf));
    };
  };
};
var toString4 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(m2) {
    return usingFromImmutable1(toString3(m2));
  };
};
var toArrayBuffer2 = function(dictMonad) {
  return usingFromImmutable(dictMonad)(toArrayBuffer);
};
var toArray3 = function(dictMonad) {
  return usingFromImmutable(dictMonad)(toArray2);
};
var slice4 = slice3;
var size3 = function(dictMonad) {
  return usingFromImmutable(dictMonad)(size2);
};
var readString4 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(m2) {
    return function(o) {
      return function(o$prime) {
        return usingFromImmutable1(readString3(m2)(o)(o$prime));
      };
    };
  };
};
var read5 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(t2) {
    return function(o) {
      return usingFromImmutable1(read4(t2)(o));
    };
  };
};
var getAtOffset2 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(o) {
    return usingFromImmutable1(getAtOffset(o));
  };
};
var fromString6 = function(dictMonad) {
  var usingToImmutable1 = usingToImmutable(dictMonad);
  return function(s2) {
    return usingToImmutable1(fromString5(s2));
  };
};
var fromArrayBuffer2 = function(dictMonad) {
  return usingToImmutable(dictMonad)(fromArrayBuffer);
};
var fromArray3 = function(dictMonad) {
  return usingToImmutable(dictMonad)(fromArray2);
};
var create2 = function(dictMonad) {
  return usingToImmutable(dictMonad)(create);
};
var concat$prime2 = function(dictMonad) {
  return function(arrs) {
    return function(n) {
      return function(v) {
        return concat$prime(arrs)(n);
      };
    };
  };
};
var concat3 = function(arrs) {
  return function(v) {
    return concat2(arrs);
  };
};

// output/Node.Buffer/index.js
var mutableBufferEffect = {
  create: /* @__PURE__ */ create2(monadEffect),
  freeze: copyAll,
  unsafeFreeze: /* @__PURE__ */ unsafeFreeze2(monadEffect),
  thaw: copyAll,
  unsafeThaw: /* @__PURE__ */ unsafeThaw2(monadEffect),
  fromArray: /* @__PURE__ */ fromArray3(monadEffect),
  fromString: /* @__PURE__ */ fromString6(monadEffect),
  fromArrayBuffer: /* @__PURE__ */ fromArrayBuffer2(monadEffect),
  toArrayBuffer: /* @__PURE__ */ toArrayBuffer2(monadEffect),
  read: /* @__PURE__ */ read5(monadEffect),
  readString: /* @__PURE__ */ readString4(monadEffect),
  toString: /* @__PURE__ */ toString4(monadEffect),
  write: /* @__PURE__ */ write5(monadEffect),
  writeString: /* @__PURE__ */ writeString(monadEffect),
  toArray: /* @__PURE__ */ toArray3(monadEffect),
  getAtOffset: /* @__PURE__ */ getAtOffset2(monadEffect),
  setAtOffset,
  slice: slice4,
  size: /* @__PURE__ */ size3(monadEffect),
  concat: concat3,
  "concat'": /* @__PURE__ */ concat$prime2(monadEffect),
  copy,
  fill,
  Monad0: function() {
    return monadEffect;
  }
};

// output/Node.Stream/index.js
var show4 = /* @__PURE__ */ show(showEncoding);
var pure6 = /* @__PURE__ */ pure(applicativeEffect);
var toString5 = /* @__PURE__ */ toString2(mutableBufferEffect);
var composeKleisliFlipped3 = /* @__PURE__ */ composeKleisliFlipped(bindEffect);
var writeString3 = function(w) {
  return function(enc) {
    return function(s2) {
      return function(cb) {
        return writeStringImpl(w)(show4(enc))(s2)(function($20) {
          return cb(toMaybe($20))();
        });
      };
    };
  };
};
var readChunk = /* @__PURE__ */ function() {
  return readChunkImpl(Left.create)(Right.create);
}();
var onDataEither = function(r2) {
  return function(cb) {
    return onDataEitherImpl(readChunk)(r2)(cb);
  };
};
var onData = function(r2) {
  return function(cb) {
    var fromEither = function(x2) {
      if (x2 instanceof Left) {
        return $$throw("Stream encoding should not be set");
      }
      ;
      if (x2 instanceof Right) {
        return pure6(x2.value0);
      }
      ;
      throw new Error("Failed pattern match at Node.Stream (line 97, column 5 - line 101, column 17): " + [x2.constructor.name]);
    };
    return onDataEither(r2)(composeKleisliFlipped3(cb)(fromEither));
  };
};
var onDataString = function(r2) {
  return function(enc) {
    return function(cb) {
      return onData(r2)(composeKleisliFlipped3(cb)(toString5(enc)));
    };
  };
};
var end = function(w) {
  return function(cb) {
    return endImpl(w)(function($22) {
      return cb(toMaybe($22))();
    });
  };
};

// output/Sunde/index.js
var $$void5 = /* @__PURE__ */ $$void(functorEffect);
var mempty2 = /* @__PURE__ */ mempty(/* @__PURE__ */ monoidFn(/* @__PURE__ */ monoidEffect(monoidUnit)));
var pure12 = /* @__PURE__ */ pure(applicativeEither);
var spawn$prime = function(encoding) {
  return function(killSignal) {
    return function(v) {
      return function(options) {
        return makeAff(function(cb) {
          return function __do2() {
            var stdoutRef = $$new("")();
            var stderrRef = $$new("")();
            var process4 = spawn2(v.cmd)(v.args)(options)();
            (function() {
              if (v.stdin instanceof Just) {
                var write8 = stdin(process4);
                return $$void5(writeString3(write8)(UTF8.value)(v.stdin.value0)($$const(end(write8)(mempty2))))();
              }
              ;
              if (v.stdin instanceof Nothing) {
                return unit;
              }
              ;
              throw new Error("Failed pattern match at Sunde (line 41, column 3 - line 46, column 25): " + [v.stdin.constructor.name]);
            })();
            onDataString(stdout(process4))(encoding)(function(string3) {
              return modify_(function(v1) {
                return v1 + string3;
              })(stdoutRef);
            })();
            onDataString(stderr(process4))(encoding)(function(string3) {
              return modify_(function(v1) {
                return v1 + string3;
              })(stderrRef);
            })();
            onError(process4)(function($23) {
              return cb(Left.create(toStandardError($23)));
            })();
            onExit(process4)(function(exit2) {
              return function __do3() {
                var stdout2 = read(stdoutRef)();
                var stderr2 = read(stderrRef)();
                return cb(pure12({
                  stdout: stdout2,
                  stderr: stderr2,
                  exit: exit2
                }))();
              };
            })();
            return effectCanceler($$void5(kill(killSignal)(process4)));
          };
        });
      };
    };
  };
};
var spawn3 = /* @__PURE__ */ function() {
  return spawn$prime(UTF8.value)(SIGTERM.value);
}();

// output/Backend.CheckTools/index.js
var map18 = /* @__PURE__ */ map(functorAff);
var enumFromTo2 = /* @__PURE__ */ enumFromTo(enumTool)(unfoldable1Array);
var bottom4 = /* @__PURE__ */ bottom(boundedTool);
var top4 = /* @__PURE__ */ top(boundedTool);
var traverse2 = /* @__PURE__ */ traverse(traversableArray)(applicativeAff);
var which = function(os) {
  return function(tool) {
    var cmd = function() {
      if (os instanceof Windows) {
        return "where.exe";
      }
      ;
      if (os instanceof Linux) {
        return "which";
      }
      ;
      if (os instanceof MacOS) {
        return "which";
      }
      ;
      throw new Error("Failed pattern match at Backend.CheckTools (line 41, column 9 - line 44, column 20): " + [os.constructor.name]);
    }();
    var arg = toCommand(tool);
    var spawnCmd = spawn3({
      cmd,
      args: [arg],
      stdin: Nothing.value
    })(defaultSpawnOptions);
    return map18(function(v) {
      if (v.exit instanceof Normally && v.exit.value0 === 0) {
        return new Just(trim(v.stdout));
      }
      ;
      return Nothing.value;
    })(spawnCmd);
  };
};
var getToolsWithPaths = function(os) {
  var getOS = function(tool) {
    return map18(function(v) {
      return new Tuple(tool, v);
    })(which(os)(tool));
  };
  var allTools = enumFromTo2(bottom4)(top4);
  return traverse2(getOS)(allTools);
};

// output/Node.Platform/index.js
var AIX = /* @__PURE__ */ function() {
  function AIX2() {
  }
  ;
  AIX2.value = new AIX2();
  return AIX2;
}();
var Darwin = /* @__PURE__ */ function() {
  function Darwin2() {
  }
  ;
  Darwin2.value = new Darwin2();
  return Darwin2;
}();
var FreeBSD = /* @__PURE__ */ function() {
  function FreeBSD2() {
  }
  ;
  FreeBSD2.value = new FreeBSD2();
  return FreeBSD2;
}();
var Linux2 = /* @__PURE__ */ function() {
  function Linux3() {
  }
  ;
  Linux3.value = new Linux3();
  return Linux3;
}();
var OpenBSD = /* @__PURE__ */ function() {
  function OpenBSD2() {
  }
  ;
  OpenBSD2.value = new OpenBSD2();
  return OpenBSD2;
}();
var SunOS = /* @__PURE__ */ function() {
  function SunOS2() {
  }
  ;
  SunOS2.value = new SunOS2();
  return SunOS2;
}();
var Win32 = /* @__PURE__ */ function() {
  function Win322() {
  }
  ;
  Win322.value = new Win322();
  return Win322;
}();
var Android = /* @__PURE__ */ function() {
  function Android2() {
  }
  ;
  Android2.value = new Android2();
  return Android2;
}();
var fromString8 = function(v) {
  if (v === "aix") {
    return new Just(AIX.value);
  }
  ;
  if (v === "darwin") {
    return new Just(Darwin.value);
  }
  ;
  if (v === "freebsd") {
    return new Just(FreeBSD.value);
  }
  ;
  if (v === "linux") {
    return new Just(Linux2.value);
  }
  ;
  if (v === "openbsd") {
    return new Just(OpenBSD.value);
  }
  ;
  if (v === "sunos") {
    return new Just(SunOS.value);
  }
  ;
  if (v === "win32") {
    return new Just(Win32.value);
  }
  ;
  if (v === "android") {
    return new Just(Android.value);
  }
  ;
  return Nothing.value;
};

// output/Node.Process/foreign.js
var import_process = __toESM(require("process"), 1);

// output/Node.Process/index.js
var platformStr = /* @__PURE__ */ function() {
  return import_process.default.platform;
}();
var platform = /* @__PURE__ */ fromString8(platformStr);

// output/Backend.OperatingSystem/index.js
var operatingSystem\u0294 = /* @__PURE__ */ bind(bindMaybe)(platform)(function(v) {
  if (v instanceof Linux2) {
    return new Just(Linux.value);
  }
  ;
  if (v instanceof Darwin) {
    return new Just(MacOS.value);
  }
  ;
  if (v instanceof Win32) {
    return new Just(Windows.value);
  }
  ;
  return Nothing.value;
});

// output/Node.FS.Async/foreign.js
var import_fs = require("fs");
function handleCallbackImpl(left, right, f3) {
  return function(err, value2) {
    if (err) {
      f3(left(err))();
    } else {
      f3(right(value2))();
    }
  };
}

// output/Node.FS.Internal/index.js
var mkEffect2 = unsafeCoerce2;

// output/Node.FS.Async/index.js
var show5 = /* @__PURE__ */ show(showEncoding);
var handleCallback = function(cb) {
  return handleCallbackImpl(Left.create, Right.create, cb);
};
var readFile2 = function(file) {
  return function(cb) {
    return mkEffect2(function(v) {
      return import_fs.readFile(file, {}, handleCallback(cb));
    });
  };
};
var readTextFile = function(encoding) {
  return function(file) {
    return function(cb) {
      return mkEffect2(function(v) {
        return import_fs.readFile(file, {
          encoding: show5(encoding)
        }, handleCallback(cb));
      });
    };
  };
};
var writeFile2 = function(file) {
  return function(buff) {
    return function(cb) {
      return mkEffect2(function(v) {
        return import_fs.writeFile(file, buff, {}, handleCallback(cb));
      });
    };
  };
};
var writeTextFile = function(encoding) {
  return function(file) {
    return function(buff) {
      return function(cb) {
        return mkEffect2(function(v) {
          return import_fs.writeFile(file, buff, {
            encoding: show5(encoding)
          }, handleCallback(cb));
        });
      };
    };
  };
};

// output/Node.FS.Aff/index.js
var voidLeft3 = /* @__PURE__ */ voidLeft(functorEffect);
var toAff = function(p) {
  return makeAff(function(k) {
    return voidLeft3(p(k))(nonCanceler);
  });
};
var toAff1 = function(f3) {
  return function(a) {
    return toAff(f3(a));
  };
};
var toAff2 = function(f3) {
  return function(a) {
    return function(b) {
      return toAff(f3(a)(b));
    };
  };
};
var writeFile3 = /* @__PURE__ */ toAff2(writeFile2);
var toAff3 = function(f3) {
  return function(a) {
    return function(b) {
      return function(c) {
        return toAff(f3(a)(b)(c));
      };
    };
  };
};
var writeTextFile2 = /* @__PURE__ */ toAff3(writeTextFile);
var readTextFile2 = /* @__PURE__ */ toAff2(readTextFile);
var readFile3 = /* @__PURE__ */ toAff1(readFile2);

// output/Node.FS.Sync/foreign.js
var import_fs2 = require("fs");

// output/Node.FS.Sync/index.js
var exists = function(file) {
  return mkEffect2(function(v) {
    return import_fs2.existsSync(file);
  });
};

// output/Node.Path/foreign.js
var import_path = __toESM(require("path"), 1);
var normalize = import_path.default.normalize;
function concat5(segments) {
  return import_path.default.join.apply(this, segments);
}
var basename = import_path.default.basename;
var extname = import_path.default.extname;
var sep = import_path.default.sep;
var delimiter = import_path.default.delimiter;
var parse2 = import_path.default.parse;
var isAbsolute = import_path.default.isAbsolute;

// output/Backend.PureScriptSolutionDefinition/index.js
var bind5 = /* @__PURE__ */ bind(bindAff);
var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
var discard2 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var when2 = /* @__PURE__ */ when(applicativeAff);
var throwError2 = /* @__PURE__ */ throwError(monadThrowAff);
var readJSON2 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord()(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "name";
  }
})(readForeignString)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "projects";
  }
})(/* @__PURE__ */ readForeignArray(readForeignPureScriptProj))(readForeignFieldsNilRowRo)()())()()));
var show6 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var pure7 = /* @__PURE__ */ pure(applicativeAff);
var readSolutionDefinition = function(dir) {
  var path2 = concat5([dir, pureScriptSolutionFileName]);
  return bind5(liftEffect3(exists(path2)))(function(fileExists) {
    return discard2(when2(!fileExists)(throwError2(error("No .purescript-solution.json file in " + path2))))(function() {
      return bind5(readTextFile2(UTF8.value)(path2))(function(strFile) {
        var v = readJSON2(strFile);
        if (v instanceof Left) {
          return throwError2(error("Invalid .purescript-solution.json file:\n" + show6(v.value0)));
        }
        ;
        if (v instanceof Right) {
          return pure7(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Backend.PureScriptSolutionDefinition (line 24, column 3 - line 28, column 30): " + [v.constructor.name]);
      });
    });
  });
};

// output/Affjax/foreign.js
function _ajax(platformSpecificDriver, timeoutErrorMessageIdent, requestFailedMessageIdent, mkHeader, options) {
  return function(errback, callback) {
    var xhr = platformSpecificDriver.newXHR();
    var fixedUrl = platformSpecificDriver.fixupUrl(options.url, xhr);
    xhr.open(options.method || "GET", fixedUrl, true, options.username, options.password);
    if (options.headers) {
      try {
        for (var i2 = 0, header; (header = options.headers[i2]) != null; i2++) {
          xhr.setRequestHeader(header.field, header.value);
        }
      } catch (e2) {
        errback(e2);
      }
    }
    var onerror = function(msgIdent) {
      return function() {
        errback(new Error(msgIdent));
      };
    };
    xhr.onerror = onerror(requestFailedMessageIdent);
    xhr.ontimeout = onerror(timeoutErrorMessageIdent);
    xhr.onload = function() {
      callback({
        status: xhr.status,
        statusText: xhr.statusText,
        headers: xhr.getAllResponseHeaders().split("\r\n").filter(function(header2) {
          return header2.length > 0;
        }).map(function(header2) {
          var i3 = header2.indexOf(":");
          return mkHeader(header2.substring(0, i3))(header2.substring(i3 + 2));
        }),
        body: xhr.response
      });
    };
    xhr.responseType = options.responseType;
    xhr.withCredentials = options.withCredentials;
    xhr.timeout = options.timeout;
    xhr.send(options.content);
    return function(error6, cancelErrback, cancelCallback) {
      try {
        xhr.abort();
      } catch (e2) {
        return cancelErrback(e2);
      }
      return cancelCallback();
    };
  };
}

// output/Data.MediaType.Common/index.js
var applicationJSON = "application/json";
var applicationFormURLEncoded = "application/x-www-form-urlencoded";

// output/Affjax.RequestBody/index.js
var ArrayView = /* @__PURE__ */ function() {
  function ArrayView2(value0) {
    this.value0 = value0;
  }
  ;
  ArrayView2.create = function(value0) {
    return new ArrayView2(value0);
  };
  return ArrayView2;
}();
var Blob = /* @__PURE__ */ function() {
  function Blob5(value0) {
    this.value0 = value0;
  }
  ;
  Blob5.create = function(value0) {
    return new Blob5(value0);
  };
  return Blob5;
}();
var Document = /* @__PURE__ */ function() {
  function Document3(value0) {
    this.value0 = value0;
  }
  ;
  Document3.create = function(value0) {
    return new Document3(value0);
  };
  return Document3;
}();
var $$String = /* @__PURE__ */ function() {
  function $$String3(value0) {
    this.value0 = value0;
  }
  ;
  $$String3.create = function(value0) {
    return new $$String3(value0);
  };
  return $$String3;
}();
var FormData = /* @__PURE__ */ function() {
  function FormData4(value0) {
    this.value0 = value0;
  }
  ;
  FormData4.create = function(value0) {
    return new FormData4(value0);
  };
  return FormData4;
}();
var FormURLEncoded = /* @__PURE__ */ function() {
  function FormURLEncoded2(value0) {
    this.value0 = value0;
  }
  ;
  FormURLEncoded2.create = function(value0) {
    return new FormURLEncoded2(value0);
  };
  return FormURLEncoded2;
}();
var Json = /* @__PURE__ */ function() {
  function Json3(value0) {
    this.value0 = value0;
  }
  ;
  Json3.create = function(value0) {
    return new Json3(value0);
  };
  return Json3;
}();
var toMediaType = function(v) {
  if (v instanceof FormURLEncoded) {
    return new Just(applicationFormURLEncoded);
  }
  ;
  if (v instanceof Json) {
    return new Just(applicationJSON);
  }
  ;
  return Nothing.value;
};
var string = /* @__PURE__ */ function() {
  return $$String.create;
}();

// output/Affjax.RequestHeader/index.js
var unwrap3 = /* @__PURE__ */ unwrap();
var Accept = /* @__PURE__ */ function() {
  function Accept2(value0) {
    this.value0 = value0;
  }
  ;
  Accept2.create = function(value0) {
    return new Accept2(value0);
  };
  return Accept2;
}();
var ContentType = /* @__PURE__ */ function() {
  function ContentType2(value0) {
    this.value0 = value0;
  }
  ;
  ContentType2.create = function(value0) {
    return new ContentType2(value0);
  };
  return ContentType2;
}();
var RequestHeader = /* @__PURE__ */ function() {
  function RequestHeader2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  RequestHeader2.create = function(value0) {
    return function(value1) {
      return new RequestHeader2(value0, value1);
    };
  };
  return RequestHeader2;
}();
var value = function(v) {
  if (v instanceof Accept) {
    return unwrap3(v.value0);
  }
  ;
  if (v instanceof ContentType) {
    return unwrap3(v.value0);
  }
  ;
  if (v instanceof RequestHeader) {
    return v.value1;
  }
  ;
  throw new Error("Failed pattern match at Affjax.RequestHeader (line 26, column 1 - line 26, column 33): " + [v.constructor.name]);
};
var name2 = function(v) {
  if (v instanceof Accept) {
    return "Accept";
  }
  ;
  if (v instanceof ContentType) {
    return "Content-Type";
  }
  ;
  if (v instanceof RequestHeader) {
    return v.value0;
  }
  ;
  throw new Error("Failed pattern match at Affjax.RequestHeader (line 21, column 1 - line 21, column 32): " + [v.constructor.name]);
};

// output/Affjax.ResponseFormat/index.js
var identity10 = /* @__PURE__ */ identity(categoryFn);
var $$ArrayBuffer = /* @__PURE__ */ function() {
  function $$ArrayBuffer2(value0) {
    this.value0 = value0;
  }
  ;
  $$ArrayBuffer2.create = function(value0) {
    return new $$ArrayBuffer2(value0);
  };
  return $$ArrayBuffer2;
}();
var Blob2 = /* @__PURE__ */ function() {
  function Blob5(value0) {
    this.value0 = value0;
  }
  ;
  Blob5.create = function(value0) {
    return new Blob5(value0);
  };
  return Blob5;
}();
var Document2 = /* @__PURE__ */ function() {
  function Document3(value0) {
    this.value0 = value0;
  }
  ;
  Document3.create = function(value0) {
    return new Document3(value0);
  };
  return Document3;
}();
var Json2 = /* @__PURE__ */ function() {
  function Json3(value0) {
    this.value0 = value0;
  }
  ;
  Json3.create = function(value0) {
    return new Json3(value0);
  };
  return Json3;
}();
var $$String2 = /* @__PURE__ */ function() {
  function $$String3(value0) {
    this.value0 = value0;
  }
  ;
  $$String3.create = function(value0) {
    return new $$String3(value0);
  };
  return $$String3;
}();
var Ignore2 = /* @__PURE__ */ function() {
  function Ignore3(value0) {
    this.value0 = value0;
  }
  ;
  Ignore3.create = function(value0) {
    return new Ignore3(value0);
  };
  return Ignore3;
}();
var toResponseType = function(v) {
  if (v instanceof $$ArrayBuffer) {
    return "arraybuffer";
  }
  ;
  if (v instanceof Blob2) {
    return "blob";
  }
  ;
  if (v instanceof Document2) {
    return "document";
  }
  ;
  if (v instanceof Json2) {
    return "text";
  }
  ;
  if (v instanceof $$String2) {
    return "text";
  }
  ;
  if (v instanceof Ignore2) {
    return "";
  }
  ;
  throw new Error("Failed pattern match at Affjax.ResponseFormat (line 44, column 3 - line 50, column 19): " + [v.constructor.name]);
};
var toMediaType2 = function(v) {
  if (v instanceof Json2) {
    return new Just(applicationJSON);
  }
  ;
  return Nothing.value;
};
var string2 = /* @__PURE__ */ function() {
  return new $$String2(identity10);
}();
var ignore = /* @__PURE__ */ function() {
  return new Ignore2(identity10);
}();

// output/Affjax.ResponseHeader/index.js
var ResponseHeader = /* @__PURE__ */ function() {
  function ResponseHeader2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  ResponseHeader2.create = function(value0) {
    return function(value1) {
      return new ResponseHeader2(value0, value1);
    };
  };
  return ResponseHeader2;
}();

// output/Data.Argonaut.Core/foreign.js
function id(x2) {
  return x2;
}
function stringify(j) {
  return JSON.stringify(j);
}

// output/Data.Argonaut.Core/index.js
var jsonEmptyObject = /* @__PURE__ */ id(empty2);

// output/Data.Argonaut.Parser/foreign.js
function _jsonParser(fail6, succ2, s2) {
  try {
    return succ2(JSON.parse(s2));
  } catch (e2) {
    return fail6(e2.message);
  }
}

// output/Data.Argonaut.Parser/index.js
var jsonParser = function(j) {
  return _jsonParser(Left.create, Right.create, j);
};

// output/JSURI/foreign.js
function toRFC3896(input) {
  return input.replace(/[!'()*]/g, function(c) {
    return "%" + c.charCodeAt(0).toString(16);
  });
}
var _encodeFormURLComponent = function encode(fail6, succeed, input) {
  try {
    return succeed(toRFC3896(encodeURIComponent(input)).replace(/%20/g, "+"));
  } catch (err) {
    return fail6(err);
  }
};

// output/JSURI/index.js
var encodeFormURLComponent = /* @__PURE__ */ function() {
  return runFn3(_encodeFormURLComponent)($$const(Nothing.value))(Just.create);
}();

// output/Data.FormURLEncoded/index.js
var apply3 = /* @__PURE__ */ apply(applyMaybe);
var map19 = /* @__PURE__ */ map(functorMaybe);
var traverse3 = /* @__PURE__ */ traverse(traversableArray)(applicativeMaybe);
var toArray5 = function(v) {
  return v;
};
var encode2 = /* @__PURE__ */ function() {
  var encodePart = function(v) {
    if (v.value1 instanceof Nothing) {
      return encodeFormURLComponent(v.value0);
    }
    ;
    if (v.value1 instanceof Just) {
      return apply3(map19(function(key) {
        return function(val) {
          return key + ("=" + val);
        };
      })(encodeFormURLComponent(v.value0)))(encodeFormURLComponent(v.value1.value0));
    }
    ;
    throw new Error("Failed pattern match at Data.FormURLEncoded (line 37, column 16 - line 39, column 114): " + [v.constructor.name]);
  };
  var $37 = map19(joinWith("&"));
  var $38 = traverse3(encodePart);
  return function($39) {
    return $37($38(toArray5($39)));
  };
}();

// output/Data.HTTP.Method/index.js
var OPTIONS = /* @__PURE__ */ function() {
  function OPTIONS2() {
  }
  ;
  OPTIONS2.value = new OPTIONS2();
  return OPTIONS2;
}();
var GET = /* @__PURE__ */ function() {
  function GET2() {
  }
  ;
  GET2.value = new GET2();
  return GET2;
}();
var HEAD = /* @__PURE__ */ function() {
  function HEAD2() {
  }
  ;
  HEAD2.value = new HEAD2();
  return HEAD2;
}();
var POST = /* @__PURE__ */ function() {
  function POST2() {
  }
  ;
  POST2.value = new POST2();
  return POST2;
}();
var PUT = /* @__PURE__ */ function() {
  function PUT2() {
  }
  ;
  PUT2.value = new PUT2();
  return PUT2;
}();
var DELETE = /* @__PURE__ */ function() {
  function DELETE2() {
  }
  ;
  DELETE2.value = new DELETE2();
  return DELETE2;
}();
var TRACE = /* @__PURE__ */ function() {
  function TRACE2() {
  }
  ;
  TRACE2.value = new TRACE2();
  return TRACE2;
}();
var CONNECT = /* @__PURE__ */ function() {
  function CONNECT2() {
  }
  ;
  CONNECT2.value = new CONNECT2();
  return CONNECT2;
}();
var PROPFIND = /* @__PURE__ */ function() {
  function PROPFIND2() {
  }
  ;
  PROPFIND2.value = new PROPFIND2();
  return PROPFIND2;
}();
var PROPPATCH = /* @__PURE__ */ function() {
  function PROPPATCH2() {
  }
  ;
  PROPPATCH2.value = new PROPPATCH2();
  return PROPPATCH2;
}();
var MKCOL = /* @__PURE__ */ function() {
  function MKCOL2() {
  }
  ;
  MKCOL2.value = new MKCOL2();
  return MKCOL2;
}();
var COPY = /* @__PURE__ */ function() {
  function COPY2() {
  }
  ;
  COPY2.value = new COPY2();
  return COPY2;
}();
var MOVE = /* @__PURE__ */ function() {
  function MOVE2() {
  }
  ;
  MOVE2.value = new MOVE2();
  return MOVE2;
}();
var LOCK = /* @__PURE__ */ function() {
  function LOCK2() {
  }
  ;
  LOCK2.value = new LOCK2();
  return LOCK2;
}();
var UNLOCK = /* @__PURE__ */ function() {
  function UNLOCK2() {
  }
  ;
  UNLOCK2.value = new UNLOCK2();
  return UNLOCK2;
}();
var PATCH = /* @__PURE__ */ function() {
  function PATCH2() {
  }
  ;
  PATCH2.value = new PATCH2();
  return PATCH2;
}();
var unCustomMethod = function(v) {
  return v;
};
var showMethod = {
  show: function(v) {
    if (v instanceof OPTIONS) {
      return "OPTIONS";
    }
    ;
    if (v instanceof GET) {
      return "GET";
    }
    ;
    if (v instanceof HEAD) {
      return "HEAD";
    }
    ;
    if (v instanceof POST) {
      return "POST";
    }
    ;
    if (v instanceof PUT) {
      return "PUT";
    }
    ;
    if (v instanceof DELETE) {
      return "DELETE";
    }
    ;
    if (v instanceof TRACE) {
      return "TRACE";
    }
    ;
    if (v instanceof CONNECT) {
      return "CONNECT";
    }
    ;
    if (v instanceof PROPFIND) {
      return "PROPFIND";
    }
    ;
    if (v instanceof PROPPATCH) {
      return "PROPPATCH";
    }
    ;
    if (v instanceof MKCOL) {
      return "MKCOL";
    }
    ;
    if (v instanceof COPY) {
      return "COPY";
    }
    ;
    if (v instanceof MOVE) {
      return "MOVE";
    }
    ;
    if (v instanceof LOCK) {
      return "LOCK";
    }
    ;
    if (v instanceof UNLOCK) {
      return "UNLOCK";
    }
    ;
    if (v instanceof PATCH) {
      return "PATCH";
    }
    ;
    throw new Error("Failed pattern match at Data.HTTP.Method (line 43, column 1 - line 59, column 23): " + [v.constructor.name]);
  }
};
var print = /* @__PURE__ */ either(/* @__PURE__ */ show(showMethod))(unCustomMethod);

// output/Effect.Aff.Compat/index.js
var fromEffectFnAff = function(v) {
  return makeAff(function(k) {
    return function __do2() {
      var v1 = v(function($9) {
        return k(Left.create($9))();
      }, function($10) {
        return k(Right.create($10))();
      });
      return function(e2) {
        return makeAff(function(k2) {
          return function __do3() {
            v1(e2, function($11) {
              return k2(Left.create($11))();
            }, function($12) {
              return k2(Right.create($12))();
            });
            return nonCanceler;
          };
        });
      };
    };
  });
};

// output/Affjax/index.js
var pure8 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
var fail5 = /* @__PURE__ */ fail(monadIdentity);
var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
var alt5 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var composeKleisliFlipped4 = /* @__PURE__ */ composeKleisliFlipped(/* @__PURE__ */ bindExceptT(monadIdentity));
var map20 = /* @__PURE__ */ map(functorMaybe);
var any3 = /* @__PURE__ */ any(foldableArray)(heytingAlgebraBoolean);
var eq2 = /* @__PURE__ */ eq(eqString);
var bindFlipped5 = /* @__PURE__ */ bindFlipped(bindMaybe);
var map110 = /* @__PURE__ */ map(functorArray);
var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorAff);
var $$try4 = /* @__PURE__ */ $$try2(monadErrorAff);
var pure13 = /* @__PURE__ */ pure(applicativeAff);
var RequestContentError = /* @__PURE__ */ function() {
  function RequestContentError2(value0) {
    this.value0 = value0;
  }
  ;
  RequestContentError2.create = function(value0) {
    return new RequestContentError2(value0);
  };
  return RequestContentError2;
}();
var ResponseBodyError = /* @__PURE__ */ function() {
  function ResponseBodyError2(value0, value1) {
    this.value0 = value0;
    this.value1 = value1;
  }
  ;
  ResponseBodyError2.create = function(value0) {
    return function(value1) {
      return new ResponseBodyError2(value0, value1);
    };
  };
  return ResponseBodyError2;
}();
var TimeoutError = /* @__PURE__ */ function() {
  function TimeoutError2() {
  }
  ;
  TimeoutError2.value = new TimeoutError2();
  return TimeoutError2;
}();
var RequestFailedError = /* @__PURE__ */ function() {
  function RequestFailedError2() {
  }
  ;
  RequestFailedError2.value = new RequestFailedError2();
  return RequestFailedError2;
}();
var XHROtherError = /* @__PURE__ */ function() {
  function XHROtherError2(value0) {
    this.value0 = value0;
  }
  ;
  XHROtherError2.create = function(value0) {
    return new XHROtherError2(value0);
  };
  return XHROtherError2;
}();
var request = function(driver2) {
  return function(req) {
    var parseJSON2 = function(v2) {
      if (v2 === "") {
        return pure8(jsonEmptyObject);
      }
      ;
      return either(function($74) {
        return fail5(ForeignError.create($74));
      })(pure8)(jsonParser(v2));
    };
    var fromResponse = function() {
      if (req.responseFormat instanceof $$ArrayBuffer) {
        return unsafeReadTagged2("ArrayBuffer");
      }
      ;
      if (req.responseFormat instanceof Blob2) {
        return unsafeReadTagged2("Blob");
      }
      ;
      if (req.responseFormat instanceof Document2) {
        return function(x2) {
          return alt5(unsafeReadTagged2("Document")(x2))(alt5(unsafeReadTagged2("XMLDocument")(x2))(unsafeReadTagged2("HTMLDocument")(x2)));
        };
      }
      ;
      if (req.responseFormat instanceof Json2) {
        return composeKleisliFlipped4(function($75) {
          return req.responseFormat.value0(parseJSON2($75));
        })(unsafeReadTagged2("String"));
      }
      ;
      if (req.responseFormat instanceof $$String2) {
        return unsafeReadTagged2("String");
      }
      ;
      if (req.responseFormat instanceof Ignore2) {
        return $$const(req.responseFormat.value0(pure8(unit)));
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 274, column 18 - line 283, column 57): " + [req.responseFormat.constructor.name]);
    }();
    var extractContent = function(v2) {
      if (v2 instanceof ArrayView) {
        return new Right(v2.value0(unsafeToForeign));
      }
      ;
      if (v2 instanceof Blob) {
        return new Right(unsafeToForeign(v2.value0));
      }
      ;
      if (v2 instanceof Document) {
        return new Right(unsafeToForeign(v2.value0));
      }
      ;
      if (v2 instanceof $$String) {
        return new Right(unsafeToForeign(v2.value0));
      }
      ;
      if (v2 instanceof FormData) {
        return new Right(unsafeToForeign(v2.value0));
      }
      ;
      if (v2 instanceof FormURLEncoded) {
        return note("Body contains values that cannot be encoded as application/x-www-form-urlencoded")(map20(unsafeToForeign)(encode2(v2.value0)));
      }
      ;
      if (v2 instanceof Json) {
        return new Right(unsafeToForeign(stringify(v2.value0)));
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 235, column 20 - line 250, column 69): " + [v2.constructor.name]);
    };
    var addHeader = function(mh) {
      return function(hs) {
        if (mh instanceof Just && !any3(on(eq2)(name2)(mh.value0))(hs)) {
          return snoc(hs)(mh.value0);
        }
        ;
        return hs;
      };
    };
    var headers = function(reqContent) {
      return addHeader(map20(ContentType.create)(bindFlipped5(toMediaType)(reqContent)))(addHeader(map20(Accept.create)(toMediaType2(req.responseFormat)))(req.headers));
    };
    var ajaxRequest = function(v2) {
      return {
        method: print(req.method),
        url: req.url,
        headers: map110(function(h2) {
          return {
            field: name2(h2),
            value: value(h2)
          };
        })(headers(req.content)),
        content: v2,
        responseType: toResponseType(req.responseFormat),
        username: toNullable(req.username),
        password: toNullable(req.password),
        withCredentials: req.withCredentials,
        timeout: fromMaybe(0)(map20(function(v1) {
          return v1;
        })(req.timeout))
      };
    };
    var send = function(content) {
      return mapFlipped2($$try4(fromEffectFnAff(_ajax(driver2, "AffjaxTimeoutErrorMessageIdent", "AffjaxRequestFailedMessageIdent", ResponseHeader.create, ajaxRequest(content)))))(function(v2) {
        if (v2 instanceof Right) {
          var v1 = runExcept(fromResponse(v2.value0.body));
          if (v1 instanceof Left) {
            return new Left(new ResponseBodyError(head3(v1.value0), v2.value0));
          }
          ;
          if (v1 instanceof Right) {
            return new Right({
              body: v1.value0,
              headers: v2.value0.headers,
              status: v2.value0.status,
              statusText: v2.value0.statusText
            });
          }
          ;
          throw new Error("Failed pattern match at Affjax (line 209, column 9 - line 211, column 52): " + [v1.constructor.name]);
        }
        ;
        if (v2 instanceof Left) {
          return new Left(function() {
            var message2 = message(v2.value0);
            var $61 = message2 === "AffjaxTimeoutErrorMessageIdent";
            if ($61) {
              return TimeoutError.value;
            }
            ;
            var $62 = message2 === "AffjaxRequestFailedMessageIdent";
            if ($62) {
              return RequestFailedError.value;
            }
            ;
            return new XHROtherError(v2.value0);
          }());
        }
        ;
        throw new Error("Failed pattern match at Affjax (line 207, column 144 - line 219, column 28): " + [v2.constructor.name]);
      });
    };
    if (req.content instanceof Nothing) {
      return send(toNullable(Nothing.value));
    }
    ;
    if (req.content instanceof Just) {
      var v = extractContent(req.content.value0);
      if (v instanceof Right) {
        return send(toNullable(new Just(v.value0)));
      }
      ;
      if (v instanceof Left) {
        return pure13(new Left(new RequestContentError(v.value0)));
      }
      ;
      throw new Error("Failed pattern match at Affjax (line 199, column 7 - line 203, column 48): " + [v.constructor.name]);
    }
    ;
    throw new Error("Failed pattern match at Affjax (line 195, column 3 - line 203, column 48): " + [req.content.constructor.name]);
  };
};
var printError = function(v) {
  if (v instanceof RequestContentError) {
    return "There was a problem with the request content: " + v.value0;
  }
  ;
  if (v instanceof ResponseBodyError) {
    return "There was a problem with the response body: " + renderForeignError(v.value0);
  }
  ;
  if (v instanceof TimeoutError) {
    return "There was a problem making the request: timeout";
  }
  ;
  if (v instanceof RequestFailedError) {
    return "There was a problem making the request: request failed";
  }
  ;
  if (v instanceof XHROtherError) {
    return "There was a problem making the request: " + message(v.value0);
  }
  ;
  throw new Error("Failed pattern match at Affjax (line 113, column 14 - line 123, column 66): " + [v.constructor.name]);
};
var defaultRequest = /* @__PURE__ */ function() {
  return {
    method: new Left(GET.value),
    url: "/",
    headers: [],
    content: Nothing.value,
    username: Nothing.value,
    password: Nothing.value,
    withCredentials: false,
    responseFormat: ignore,
    timeout: Nothing.value
  };
}();

// output/Affjax.Node/foreign.js
var import_xhr2 = __toESM(require_xhr2(), 1);
var import_url = __toESM(require("url"), 1);
var driver = {
  newXHR: function() {
    return new import_xhr2.default();
  },
  fixupUrl: function(url, xhr) {
    if (xhr.nodejsBaseUrl === null) {
      var u = import_url.default.parse(url);
      u.protocol = u.protocol || "http:";
      u.hostname = u.hostname || "localhost";
      return import_url.default.format(u);
    } else {
      return url || "/";
    }
  }
};

// output/Affjax.Node/index.js
var request2 = /* @__PURE__ */ request(driver);

// output/Effect.Console/foreign.js
var error2 = function(s2) {
  return function() {
    console.error(s2);
  };
};
var info = function(s2) {
  return function() {
    console.info(s2);
  };
};

// output/Effect.Class.Console/index.js
var info2 = function(dictMonadEffect) {
  var $55 = liftEffect(dictMonadEffect);
  return function($56) {
    return $55(info($56));
  };
};
var error3 = function(dictMonadEffect) {
  var $59 = liftEffect(dictMonadEffect);
  return function($60) {
    return $59(error2($60));
  };
};

// output/Backend.Github.API/index.js
var bind6 = /* @__PURE__ */ bind(bindAff);
var un3 = /* @__PURE__ */ un();
var discard3 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var error4 = /* @__PURE__ */ error3(monadEffectAff);
var throwError3 = /* @__PURE__ */ throwError(monadThrowAff);
var pure9 = /* @__PURE__ */ pure(applicativeAff);
var sendRequest = function(v) {
  return function(query) {
    return bind6(request2({
      method: new Left(POST.value),
      url: "https://api.github.com/graphql",
      headers: [new RequestHeader("Authorization", un3(TokenType)(v.token_type) + (" " + un3(AccessToken)(v.access_token)))],
      content: new Just(string(unGithubGraphQLQuery(query))),
      username: defaultRequest.username,
      password: defaultRequest.password,
      withCredentials: defaultRequest.withCredentials,
      responseFormat: string2,
      timeout: defaultRequest.timeout
    }))(function(errorOrResponse) {
      if (errorOrResponse instanceof Left) {
        return discard3(error4(printError(errorOrResponse.value0)))(function() {
          return throwError3(error(printError(errorOrResponse.value0)));
        });
      }
      ;
      if (errorOrResponse instanceof Right) {
        return pure9(errorOrResponse.value0.body);
      }
      ;
      throw new Error("Failed pattern match at Backend.Github.API (line 45, column 3 - line 55, column 51): " + [errorOrResponse.constructor.name]);
    });
  };
};

// output/Biz.Github/index.js
var scopes = ["user", "repo"];
var clientID = "e1bbd08c15830196cff5";

// output/Yoga.Fetch/foreign.js
var _fetch = (fetchImpl) => (url) => (options) => () => {
  return fetchImpl(url, options).catch(function(e2) {
    throw new Error(e2);
  });
};
var textImpl = (response) => () => response.text();

// output/Control.Promise/foreign.js
function thenImpl(promise2) {
  return function(errCB) {
    return function(succCB) {
      return function() {
        promise2.then(succCB, errCB);
      };
    };
  };
}

// output/Control.Promise/index.js
var voidRight2 = /* @__PURE__ */ voidRight(functorEffect);
var mempty3 = /* @__PURE__ */ mempty(monoidCanceler);
var identity11 = /* @__PURE__ */ identity(categoryFn);
var alt6 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var unsafeReadTagged3 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
var map21 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var readString6 = /* @__PURE__ */ readString(monadIdentity);
var bind7 = /* @__PURE__ */ bind(bindAff);
var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
var toAff$prime = function(customCoerce) {
  return function(p) {
    return makeAff(function(cb) {
      return voidRight2(mempty3)(thenImpl(p)(function($14) {
        return cb(Left.create(customCoerce($14)))();
      })(function($15) {
        return cb(Right.create($15))();
      }));
    });
  };
};
var coerce3 = function(fn) {
  return either(function(v) {
    return error("Promise failed, couldn't extract JS Error or String");
  })(identity11)(runExcept(alt6(unsafeReadTagged3("Error")(fn))(map21(error)(readString6(fn)))));
};
var toAff4 = /* @__PURE__ */ toAff$prime(coerce3);
var toAffE = function(f3) {
  return bind7(liftEffect4(f3))(toAff4);
};

// output/Yoga.Fetch/index.js
var text = function(res) {
  return toAffE(textImpl(res));
};
var statusCode = function(response) {
  return response.status;
};
var postMethod = "POST";
var fetch = function(impl) {
  return function() {
    return function(url$prime) {
      return function(opts) {
        return toAffE(_fetch(impl)(url$prime)(opts));
      };
    };
  };
};

// output/Biz.Github.API.Auth/index.js
var mapFlipped3 = /* @__PURE__ */ mapFlipped(functorAff);
var lmap3 = /* @__PURE__ */ lmap(bifunctorEither);
var show7 = /* @__PURE__ */ show(showError);
var join2 = /* @__PURE__ */ join(bindEither);
var bind8 = /* @__PURE__ */ bind(bindAff);
var fromHomogeneous2 = /* @__PURE__ */ fromHomogeneous();
var writeJSON2 = /* @__PURE__ */ writeJSON(writeForeignDeviceCodeReq);
var readJSON3 = /* @__PURE__ */ readJSON(readForeignDeviceCodeResp);
var pure10 = /* @__PURE__ */ pure(applicativeAff);
var show12 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var show22 = /* @__PURE__ */ show(showInt);
var writeJSON1 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord()(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "client_id";
  }
})(writeForeignClientID)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "device_code";
  }
})(writeForeignDeviceCode)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "grant_type";
  }
})(writeForeignGrantType)(writeForeignFieldsNilRowR)()()())()()())()()()));
var alt7 = /* @__PURE__ */ alt(altEither);
var bimap2 = /* @__PURE__ */ bimap(bifunctorEither);
var readForeignRecord4 = /* @__PURE__ */ readForeignRecord();
var readJSON1 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord4(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "error";
  }
})(readForeignString)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "error_description";
  }
})(readForeignString)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "error_uri";
  }
})(readForeignString)(readForeignFieldsNilRowRo)()())()())()()));
var readJSON22 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord4(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "access_token";
  }
})(readForeignAccessToken)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "scope";
  }
})(readForeignScopeList)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "token_type";
  }
})(readForeignTokenType)(readForeignFieldsNilRowRo)()())()())()()));
var attemptString = function(aff) {
  return mapFlipped3(attempt(aff))(function() {
    var $89 = lmap3(show7);
    return function($90) {
      return join2($89($90));
    };
  }());
};
var getDeviceCode = function(fetch3) {
  return attemptString(bind8(fetch3()("https://github.com/login/device/code")({
    method: postMethod,
    headers: fromHomogeneous2({
      Accept: "application/json",
      "Content-Type": "application/json"
    }),
    body: writeJSON2({
      client_id: clientID,
      scope: scopes
    })
  }))(function(res) {
    var v = statusCode(res);
    if (v === 200) {
      return bind8(mapFlipped3(text(res))(readJSON3))(function(errorOrBody) {
        return pure10(lmap3(show12)(errorOrBody));
      });
    }
    ;
    return mapFlipped3(text(res))(function($91) {
      return Left.create(function(v1) {
        return show22(v) + v1;
      }($91));
    });
  }));
};
var pollAccessToken = function(fetch3) {
  var fetch1 = fetch3();
  return function(device_code) {
    return attemptString(bind8(fetch1("https://github.com/login/oauth/access_token")({
      method: postMethod,
      headers: fromHomogeneous2({
        Accept: "application/json",
        "Content-Type": "application/json"
      }),
      body: writeJSON1({
        client_id: clientID,
        device_code,
        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
      })
    }))(function(res) {
      var v = statusCode(res);
      if (v === 200) {
        return bind8(text(res))(function(stringBody) {
          return pure10(alt7(bimap2(show12)(Left.create)(readJSON1(stringBody)))(bimap2(show12)(Right.create)(readJSON22(stringBody))));
        });
      }
      ;
      return mapFlipped3(text(res))(function($92) {
        return Left.create(function(v1) {
          return show22(v) + v1;
        }($92));
      });
    }));
  };
};

// output/Electron/foreign.js
var import_electron = require("electron");
var whenReadyImpl = () => import_electron.app.whenReady();
var newBrowserWindow = (config) => () => new import_electron.BrowserWindow(config);
var loadFileImpl = (name3) => (browserWindow) => () => browserWindow.loadFile(name3);
var onIPCMainMessage = (listener) => (channel) => () => {
  import_electron.ipcMain.on(channel, listener);
};
var showOpenDialogImpl = (options) => (window2) => () => import_electron.dialog.showOpenDialog(window2, options);
var sendToWebContentsImpl = (message2) => (channel) => (win) => () => {
  win.webContents.send(channel, message2);
};
var getUserDataDirectory = () => import_electron.app.getPath("userData");
var isDefaultProtocolClient = (protocol) => () => import_electron.app.isDefaultProtocolClient(protocol);
var setAsDefaultProtocolClient = (protocol) => () => import_electron.app.setAsDefaultProtocolClient(protocol);
var setWindowOpenHandlerToExternal = (win) => () => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) {
      import_electron.shell.openExternal(url);
    }
    return { action: "deny" };
  });
};
var openHttpsInBrowserAndBlockOtherURLs = () => {
  import_electron.app.on("web-contents-created", (createEvent, contents) => {
    contents.on("new-window", (newEvent) => {
      console.log("Blocked by 'new-window'");
      newEvent.preventDefault();
    });
    contents.on("will-navigate", (newEvent, url) => {
      if (url.startsWith("https:") || url.startsWith("http:")) {
        setImmediate(() => {
          import_electron.shell.openExternal(url);
        });
      }
      console.log("Blocked by 'will-navigate'");
      newEvent.preventDefault();
    });
    contents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith("https:") || url.startsWith("http:")) {
        setImmediate(() => {
          import_electron.shell.openExternal(url);
        });
        return { action: "allow" };
      } else {
        console.log("Blocked by 'setWindowOpenHandler'");
        return { action: "deny" };
      }
    });
  });
};
var encryptStringImpl = (just, nothing, plainText) => {
  try {
    const res = import_electron.safeStorage.encryptString(plainText);
    return just(res);
  } catch {
    return nothing;
  }
};
var decryptStringImpl = (just, nothing, buffer) => {
  try {
    const res = import_electron.safeStorage.decryptString(buffer);
    return just(res);
  } catch {
    return nothing;
  }
};
var copyToClipboard = (text2) => () => import_electron.clipboard.writeText(text2);
var getClipboardText = () => import_electron.clipboard.readText();
var showWhenReadyToShow = (win) => () => {
  win.once("ready-to-show", () => win.show());
};
var appendSwitch = (name3) => (value2) => () => import_electron.app.commandLine.appendSwitch(name3, value2);

// output/Untagged.Castable/index.js
var cast = function() {
  return unsafeCoerce2;
};

// output/Electron/index.js
var cast2 = /* @__PURE__ */ cast();
var waitUntilAppReady = /* @__PURE__ */ toAffE(whenReadyImpl);
var showOpenDialog = function() {
  return function(options) {
    return function(win) {
      return toAffE(showOpenDialogImpl(cast2(options))(win));
    };
  };
};
var sendToWebContents = function(dictWriteForeign) {
  var write8 = write3(dictWriteForeign);
  return function(msg) {
    return function(channel) {
      return function(window2) {
        return sendToWebContentsImpl(write8(msg))(channel)(window2);
      };
    };
  };
};
var openDirectory = "openDirectory";
var loadFile = function(s2) {
  return function(bw) {
    return toAffE(loadFileImpl(s2)(bw));
  };
};
var encryptString = /* @__PURE__ */ function() {
  return runEffectFn3(encryptStringImpl)(Just.create)(Nothing.value);
}();
var decryptString = /* @__PURE__ */ function() {
  return runEffectFn3(decryptStringImpl)(Just.create)(Nothing.value);
}();

// node_modules/node-fetch/src/index.js
var import_node_http2 = __toESM(require("node:http"), 1);
var import_node_https = __toESM(require("node:https"), 1);
var import_node_zlib = __toESM(require("node:zlib"), 1);
var import_node_stream2 = __toESM(require("node:stream"), 1);
var import_node_buffer2 = require("node:buffer");

// node_modules/data-uri-to-buffer/dist/index.js
function dataUriToBuffer(uri) {
  if (!/^data:/i.test(uri)) {
    throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');
  }
  uri = uri.replace(/\r?\n/g, "");
  const firstComma = uri.indexOf(",");
  if (firstComma === -1 || firstComma <= 4) {
    throw new TypeError("malformed data: URI");
  }
  const meta = uri.substring(5, firstComma).split(";");
  let charset = "";
  let base64 = false;
  const type = meta[0] || "text/plain";
  let typeFull = type;
  for (let i2 = 1; i2 < meta.length; i2++) {
    if (meta[i2] === "base64") {
      base64 = true;
    } else {
      typeFull += `;${meta[i2]}`;
      if (meta[i2].indexOf("charset=") === 0) {
        charset = meta[i2].substring(8);
      }
    }
  }
  if (!meta[0] && !charset.length) {
    typeFull += ";charset=US-ASCII";
    charset = "US-ASCII";
  }
  const encoding = base64 ? "base64" : "ascii";
  const data = unescape(uri.substring(firstComma + 1));
  const buffer = Buffer.from(data, encoding);
  buffer.type = type;
  buffer.typeFull = typeFull;
  buffer.charset = charset;
  return buffer;
}
var dist_default = dataUriToBuffer;

// node_modules/node-fetch/src/body.js
var import_node_stream = __toESM(require("node:stream"), 1);
var import_node_util = require("node:util");
var import_node_buffer = require("node:buffer");
init_fetch_blob();
init_esm_min();

// node_modules/node-fetch/src/errors/base.js
var FetchBaseError = class extends Error {
  constructor(message2, type) {
    super(message2);
    Error.captureStackTrace(this, this.constructor);
    this.type = type;
  }
  get name() {
    return this.constructor.name;
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
};

// node_modules/node-fetch/src/errors/fetch-error.js
var FetchError = class extends FetchBaseError {
  constructor(message2, type, systemError) {
    super(message2, type);
    if (systemError) {
      this.code = this.errno = systemError.code;
      this.erroredSysCall = systemError.syscall;
    }
  }
};

// node_modules/node-fetch/src/utils/is.js
var NAME = Symbol.toStringTag;
var isURLSearchParameters = (object) => {
  return typeof object === "object" && typeof object.append === "function" && typeof object.delete === "function" && typeof object.get === "function" && typeof object.getAll === "function" && typeof object.has === "function" && typeof object.set === "function" && typeof object.sort === "function" && object[NAME] === "URLSearchParams";
};
var isBlob = (object) => {
  return object && typeof object === "object" && typeof object.arrayBuffer === "function" && typeof object.type === "string" && typeof object.stream === "function" && typeof object.constructor === "function" && /^(Blob|File)$/.test(object[NAME]);
};
var isAbortSignal = (object) => {
  return typeof object === "object" && (object[NAME] === "AbortSignal" || object[NAME] === "EventTarget");
};
var isDomainOrSubdomain = (destination, original) => {
  const orig = new URL(original).hostname;
  const dest = new URL(destination).hostname;
  return orig === dest || orig.endsWith(`.${dest}`);
};

// node_modules/node-fetch/src/body.js
var pipeline = (0, import_node_util.promisify)(import_node_stream.default.pipeline);
var INTERNALS = Symbol("Body internals");
var Body = class {
  constructor(body, {
    size: size5 = 0
  } = {}) {
    let boundary = null;
    if (body === null) {
      body = null;
    } else if (isURLSearchParameters(body)) {
      body = import_node_buffer.Buffer.from(body.toString());
    } else if (isBlob(body)) {
    } else if (import_node_buffer.Buffer.isBuffer(body)) {
    } else if (import_node_util.types.isAnyArrayBuffer(body)) {
      body = import_node_buffer.Buffer.from(body);
    } else if (ArrayBuffer.isView(body)) {
      body = import_node_buffer.Buffer.from(body.buffer, body.byteOffset, body.byteLength);
    } else if (body instanceof import_node_stream.default) {
    } else if (body instanceof FormData2) {
      body = formDataToBlob(body);
      boundary = body.type.split("=")[1];
    } else {
      body = import_node_buffer.Buffer.from(String(body));
    }
    let stream = body;
    if (import_node_buffer.Buffer.isBuffer(body)) {
      stream = import_node_stream.default.Readable.from(body);
    } else if (isBlob(body)) {
      stream = import_node_stream.default.Readable.from(body.stream());
    }
    this[INTERNALS] = {
      body,
      stream,
      boundary,
      disturbed: false,
      error: null
    };
    this.size = size5;
    if (body instanceof import_node_stream.default) {
      body.on("error", (error_) => {
        const error6 = error_ instanceof FetchBaseError ? error_ : new FetchError(`Invalid response body while trying to fetch ${this.url}: ${error_.message}`, "system", error_);
        this[INTERNALS].error = error6;
      });
    }
  }
  get body() {
    return this[INTERNALS].stream;
  }
  get bodyUsed() {
    return this[INTERNALS].disturbed;
  }
  async arrayBuffer() {
    const { buffer, byteOffset, byteLength } = await consumeBody(this);
    return buffer.slice(byteOffset, byteOffset + byteLength);
  }
  async formData() {
    const ct = this.headers.get("content-type");
    if (ct.startsWith("application/x-www-form-urlencoded")) {
      const formData = new FormData2();
      const parameters = new URLSearchParams(await this.text());
      for (const [name3, value2] of parameters) {
        formData.append(name3, value2);
      }
      return formData;
    }
    const { toFormData: toFormData2 } = await Promise.resolve().then(() => (init_multipart_parser(), multipart_parser_exports));
    return toFormData2(this.body, ct);
  }
  async blob() {
    const ct = this.headers && this.headers.get("content-type") || this[INTERNALS].body && this[INTERNALS].body.type || "";
    const buf = await this.arrayBuffer();
    return new fetch_blob_default([buf], {
      type: ct
    });
  }
  async json() {
    const text2 = await this.text();
    return JSON.parse(text2);
  }
  async text() {
    const buffer = await consumeBody(this);
    return new TextDecoder().decode(buffer);
  }
  buffer() {
    return consumeBody(this);
  }
};
Body.prototype.buffer = (0, import_node_util.deprecate)(Body.prototype.buffer, "Please use 'response.arrayBuffer()' instead of 'response.buffer()'", "node-fetch#buffer");
Object.defineProperties(Body.prototype, {
  body: { enumerable: true },
  bodyUsed: { enumerable: true },
  arrayBuffer: { enumerable: true },
  blob: { enumerable: true },
  json: { enumerable: true },
  text: { enumerable: true },
  data: { get: (0, import_node_util.deprecate)(() => {
  }, "data doesn't exist, use json(), text(), arrayBuffer(), or body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (response)") }
});
async function consumeBody(data) {
  if (data[INTERNALS].disturbed) {
    throw new TypeError(`body used already for: ${data.url}`);
  }
  data[INTERNALS].disturbed = true;
  if (data[INTERNALS].error) {
    throw data[INTERNALS].error;
  }
  const { body } = data;
  if (body === null) {
    return import_node_buffer.Buffer.alloc(0);
  }
  if (!(body instanceof import_node_stream.default)) {
    return import_node_buffer.Buffer.alloc(0);
  }
  const accum = [];
  let accumBytes = 0;
  try {
    for await (const chunk of body) {
      if (data.size > 0 && accumBytes + chunk.length > data.size) {
        const error6 = new FetchError(`content size at ${data.url} over limit: ${data.size}`, "max-size");
        body.destroy(error6);
        throw error6;
      }
      accumBytes += chunk.length;
      accum.push(chunk);
    }
  } catch (error6) {
    const error_ = error6 instanceof FetchBaseError ? error6 : new FetchError(`Invalid response body while trying to fetch ${data.url}: ${error6.message}`, "system", error6);
    throw error_;
  }
  if (body.readableEnded === true || body._readableState.ended === true) {
    try {
      if (accum.every((c) => typeof c === "string")) {
        return import_node_buffer.Buffer.from(accum.join(""));
      }
      return import_node_buffer.Buffer.concat(accum, accumBytes);
    } catch (error6) {
      throw new FetchError(`Could not create Buffer from response body for ${data.url}: ${error6.message}`, "system", error6);
    }
  } else {
    throw new FetchError(`Premature close of server response while trying to fetch ${data.url}`);
  }
}
var clone = (instance, highWaterMark) => {
  let p1;
  let p2;
  let { body } = instance[INTERNALS];
  if (instance.bodyUsed) {
    throw new Error("cannot clone body after it is used");
  }
  if (body instanceof import_node_stream.default && typeof body.getBoundary !== "function") {
    p1 = new import_node_stream.PassThrough({ highWaterMark });
    p2 = new import_node_stream.PassThrough({ highWaterMark });
    body.pipe(p1);
    body.pipe(p2);
    instance[INTERNALS].stream = p1;
    body = p2;
  }
  return body;
};
var getNonSpecFormDataBoundary = (0, import_node_util.deprecate)((body) => body.getBoundary(), "form-data doesn't follow the spec and requires special treatment. Use alternative package", "https://github.com/node-fetch/node-fetch/issues/1167");
var extractContentType = (body, request3) => {
  if (body === null) {
    return null;
  }
  if (typeof body === "string") {
    return "text/plain;charset=UTF-8";
  }
  if (isURLSearchParameters(body)) {
    return "application/x-www-form-urlencoded;charset=UTF-8";
  }
  if (isBlob(body)) {
    return body.type || null;
  }
  if (import_node_buffer.Buffer.isBuffer(body) || import_node_util.types.isAnyArrayBuffer(body) || ArrayBuffer.isView(body)) {
    return null;
  }
  if (body instanceof FormData2) {
    return `multipart/form-data; boundary=${request3[INTERNALS].boundary}`;
  }
  if (body && typeof body.getBoundary === "function") {
    return `multipart/form-data;boundary=${getNonSpecFormDataBoundary(body)}`;
  }
  if (body instanceof import_node_stream.default) {
    return null;
  }
  return "text/plain;charset=UTF-8";
};
var getTotalBytes = (request3) => {
  const { body } = request3[INTERNALS];
  if (body === null) {
    return 0;
  }
  if (isBlob(body)) {
    return body.size;
  }
  if (import_node_buffer.Buffer.isBuffer(body)) {
    return body.length;
  }
  if (body && typeof body.getLengthSync === "function") {
    return body.hasKnownLength && body.hasKnownLength() ? body.getLengthSync() : null;
  }
  return null;
};
var writeToStream = async (dest, { body }) => {
  if (body === null) {
    dest.end();
  } else {
    await pipeline(body, dest);
  }
};

// node_modules/node-fetch/src/headers.js
var import_node_util2 = require("node:util");
var import_node_http = __toESM(require("node:http"), 1);
var validateHeaderName = typeof import_node_http.default.validateHeaderName === "function" ? import_node_http.default.validateHeaderName : (name3) => {
  if (!/^[\^`\-\w!#$%&'*+.|~]+$/.test(name3)) {
    const error6 = new TypeError(`Header name must be a valid HTTP token [${name3}]`);
    Object.defineProperty(error6, "code", { value: "ERR_INVALID_HTTP_TOKEN" });
    throw error6;
  }
};
var validateHeaderValue = typeof import_node_http.default.validateHeaderValue === "function" ? import_node_http.default.validateHeaderValue : (name3, value2) => {
  if (/[^\t\u0020-\u007E\u0080-\u00FF]/.test(value2)) {
    const error6 = new TypeError(`Invalid character in header content ["${name3}"]`);
    Object.defineProperty(error6, "code", { value: "ERR_INVALID_CHAR" });
    throw error6;
  }
};
var Headers = class extends URLSearchParams {
  constructor(init3) {
    let result = [];
    if (init3 instanceof Headers) {
      const raw = init3.raw();
      for (const [name3, values] of Object.entries(raw)) {
        result.push(...values.map((value2) => [name3, value2]));
      }
    } else if (init3 == null) {
    } else if (typeof init3 === "object" && !import_node_util2.types.isBoxedPrimitive(init3)) {
      const method = init3[Symbol.iterator];
      if (method == null) {
        result.push(...Object.entries(init3));
      } else {
        if (typeof method !== "function") {
          throw new TypeError("Header pairs must be iterable");
        }
        result = [...init3].map((pair) => {
          if (typeof pair !== "object" || import_node_util2.types.isBoxedPrimitive(pair)) {
            throw new TypeError("Each header pair must be an iterable object");
          }
          return [...pair];
        }).map((pair) => {
          if (pair.length !== 2) {
            throw new TypeError("Each header pair must be a name/value tuple");
          }
          return [...pair];
        });
      }
    } else {
      throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");
    }
    result = result.length > 0 ? result.map(([name3, value2]) => {
      validateHeaderName(name3);
      validateHeaderValue(name3, String(value2));
      return [String(name3).toLowerCase(), String(value2)];
    }) : void 0;
    super(result);
    return new Proxy(this, {
      get(target, p, receiver) {
        switch (p) {
          case "append":
          case "set":
            return (name3, value2) => {
              validateHeaderName(name3);
              validateHeaderValue(name3, String(value2));
              return URLSearchParams.prototype[p].call(target, String(name3).toLowerCase(), String(value2));
            };
          case "delete":
          case "has":
          case "getAll":
            return (name3) => {
              validateHeaderName(name3);
              return URLSearchParams.prototype[p].call(target, String(name3).toLowerCase());
            };
          case "keys":
            return () => {
              target.sort();
              return new Set(URLSearchParams.prototype.keys.call(target)).keys();
            };
          default:
            return Reflect.get(target, p, receiver);
        }
      }
    });
  }
  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }
  toString() {
    return Object.prototype.toString.call(this);
  }
  get(name3) {
    const values = this.getAll(name3);
    if (values.length === 0) {
      return null;
    }
    let value2 = values.join(", ");
    if (/^content-encoding$/i.test(name3)) {
      value2 = value2.toLowerCase();
    }
    return value2;
  }
  forEach(callback, thisArg = void 0) {
    for (const name3 of this.keys()) {
      Reflect.apply(callback, thisArg, [this.get(name3), name3, this]);
    }
  }
  *values() {
    for (const name3 of this.keys()) {
      yield this.get(name3);
    }
  }
  *entries() {
    for (const name3 of this.keys()) {
      yield [name3, this.get(name3)];
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
  raw() {
    return [...this.keys()].reduce((result, key) => {
      result[key] = this.getAll(key);
      return result;
    }, {});
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return [...this.keys()].reduce((result, key) => {
      const values = this.getAll(key);
      if (key === "host") {
        result[key] = values[0];
      } else {
        result[key] = values.length > 1 ? values : values[0];
      }
      return result;
    }, {});
  }
};
Object.defineProperties(Headers.prototype, ["get", "entries", "forEach", "values"].reduce((result, property) => {
  result[property] = { enumerable: true };
  return result;
}, {}));
function fromRawHeaders(headers = []) {
  return new Headers(headers.reduce((result, value2, index3, array) => {
    if (index3 % 2 === 0) {
      result.push(array.slice(index3, index3 + 2));
    }
    return result;
  }, []).filter(([name3, value2]) => {
    try {
      validateHeaderName(name3);
      validateHeaderValue(name3, String(value2));
      return true;
    } catch {
      return false;
    }
  }));
}

// node_modules/node-fetch/src/utils/is-redirect.js
var redirectStatus = /* @__PURE__ */ new Set([301, 302, 303, 307, 308]);
var isRedirect = (code) => {
  return redirectStatus.has(code);
};

// node_modules/node-fetch/src/response.js
var INTERNALS2 = Symbol("Response internals");
var Response = class extends Body {
  constructor(body = null, options = {}) {
    super(body, options);
    const status = options.status != null ? options.status : 200;
    const headers = new Headers(options.headers);
    if (body !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(body, this);
      if (contentType) {
        headers.append("Content-Type", contentType);
      }
    }
    this[INTERNALS2] = {
      type: "default",
      url: options.url,
      status,
      statusText: options.statusText || "",
      headers,
      counter: options.counter,
      highWaterMark: options.highWaterMark
    };
  }
  get type() {
    return this[INTERNALS2].type;
  }
  get url() {
    return this[INTERNALS2].url || "";
  }
  get status() {
    return this[INTERNALS2].status;
  }
  get ok() {
    return this[INTERNALS2].status >= 200 && this[INTERNALS2].status < 300;
  }
  get redirected() {
    return this[INTERNALS2].counter > 0;
  }
  get statusText() {
    return this[INTERNALS2].statusText;
  }
  get headers() {
    return this[INTERNALS2].headers;
  }
  get highWaterMark() {
    return this[INTERNALS2].highWaterMark;
  }
  clone() {
    return new Response(clone(this, this.highWaterMark), {
      type: this.type,
      url: this.url,
      status: this.status,
      statusText: this.statusText,
      headers: this.headers,
      ok: this.ok,
      redirected: this.redirected,
      size: this.size,
      highWaterMark: this.highWaterMark
    });
  }
  static redirect(url, status = 302) {
    if (!isRedirect(status)) {
      throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');
    }
    return new Response(null, {
      headers: {
        location: new URL(url).toString()
      },
      status
    });
  }
  static error() {
    const response = new Response(null, { status: 0, statusText: "" });
    response[INTERNALS2].type = "error";
    return response;
  }
  get [Symbol.toStringTag]() {
    return "Response";
  }
};
Object.defineProperties(Response.prototype, {
  type: { enumerable: true },
  url: { enumerable: true },
  status: { enumerable: true },
  ok: { enumerable: true },
  redirected: { enumerable: true },
  statusText: { enumerable: true },
  headers: { enumerable: true },
  clone: { enumerable: true }
});

// node_modules/node-fetch/src/request.js
var import_node_url = require("node:url");
var import_node_util3 = require("node:util");

// node_modules/node-fetch/src/utils/get-search.js
var getSearch = (parsedURL) => {
  if (parsedURL.search) {
    return parsedURL.search;
  }
  const lastOffset = parsedURL.href.length - 1;
  const hash = parsedURL.hash || (parsedURL.href[lastOffset] === "#" ? "#" : "");
  return parsedURL.href[lastOffset - hash.length] === "?" ? "?" : "";
};

// node_modules/node-fetch/src/utils/referrer.js
var import_node_net = require("node:net");
function stripURLForUseAsAReferrer(url, originOnly = false) {
  if (url == null) {
    return "no-referrer";
  }
  url = new URL(url);
  if (/^(about|blob|data):$/.test(url.protocol)) {
    return "no-referrer";
  }
  url.username = "";
  url.password = "";
  url.hash = "";
  if (originOnly) {
    url.pathname = "";
    url.search = "";
  }
  return url;
}
var ReferrerPolicy = /* @__PURE__ */ new Set([
  "",
  "no-referrer",
  "no-referrer-when-downgrade",
  "same-origin",
  "origin",
  "strict-origin",
  "origin-when-cross-origin",
  "strict-origin-when-cross-origin",
  "unsafe-url"
]);
var DEFAULT_REFERRER_POLICY = "strict-origin-when-cross-origin";
function validateReferrerPolicy(referrerPolicy) {
  if (!ReferrerPolicy.has(referrerPolicy)) {
    throw new TypeError(`Invalid referrerPolicy: ${referrerPolicy}`);
  }
  return referrerPolicy;
}
function isOriginPotentiallyTrustworthy(url) {
  if (/^(http|ws)s:$/.test(url.protocol)) {
    return true;
  }
  const hostIp = url.host.replace(/(^\[)|(]$)/g, "");
  const hostIPVersion = (0, import_node_net.isIP)(hostIp);
  if (hostIPVersion === 4 && /^127\./.test(hostIp)) {
    return true;
  }
  if (hostIPVersion === 6 && /^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(hostIp)) {
    return true;
  }
  if (/^(.+\.)*localhost$/.test(url.host)) {
    return false;
  }
  if (url.protocol === "file:") {
    return true;
  }
  return false;
}
function isUrlPotentiallyTrustworthy(url) {
  if (/^about:(blank|srcdoc)$/.test(url)) {
    return true;
  }
  if (url.protocol === "data:") {
    return true;
  }
  if (/^(blob|filesystem):$/.test(url.protocol)) {
    return true;
  }
  return isOriginPotentiallyTrustworthy(url);
}
function determineRequestsReferrer(request3, { referrerURLCallback, referrerOriginCallback } = {}) {
  if (request3.referrer === "no-referrer" || request3.referrerPolicy === "") {
    return null;
  }
  const policy = request3.referrerPolicy;
  if (request3.referrer === "about:client") {
    return "no-referrer";
  }
  const referrerSource = request3.referrer;
  let referrerURL = stripURLForUseAsAReferrer(referrerSource);
  let referrerOrigin = stripURLForUseAsAReferrer(referrerSource, true);
  if (referrerURL.toString().length > 4096) {
    referrerURL = referrerOrigin;
  }
  if (referrerURLCallback) {
    referrerURL = referrerURLCallback(referrerURL);
  }
  if (referrerOriginCallback) {
    referrerOrigin = referrerOriginCallback(referrerOrigin);
  }
  const currentURL = new URL(request3.url);
  switch (policy) {
    case "no-referrer":
      return "no-referrer";
    case "origin":
      return referrerOrigin;
    case "unsafe-url":
      return referrerURL;
    case "strict-origin":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin.toString();
    case "strict-origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerOrigin;
    case "same-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return "no-referrer";
    case "origin-when-cross-origin":
      if (referrerURL.origin === currentURL.origin) {
        return referrerURL;
      }
      return referrerOrigin;
    case "no-referrer-when-downgrade":
      if (isUrlPotentiallyTrustworthy(referrerURL) && !isUrlPotentiallyTrustworthy(currentURL)) {
        return "no-referrer";
      }
      return referrerURL;
    default:
      throw new TypeError(`Invalid referrerPolicy: ${policy}`);
  }
}
function parseReferrerPolicyFromHeader(headers) {
  const policyTokens = (headers.get("referrer-policy") || "").split(/[,\s]+/);
  let policy = "";
  for (const token of policyTokens) {
    if (token && ReferrerPolicy.has(token)) {
      policy = token;
    }
  }
  return policy;
}

// node_modules/node-fetch/src/request.js
var INTERNALS3 = Symbol("Request internals");
var isRequest = (object) => {
  return typeof object === "object" && typeof object[INTERNALS3] === "object";
};
var doBadDataWarn = (0, import_node_util3.deprecate)(() => {
}, ".data is not a valid RequestInit property, use .body instead", "https://github.com/node-fetch/node-fetch/issues/1000 (request)");
var Request = class extends Body {
  constructor(input, init3 = {}) {
    let parsedURL;
    if (isRequest(input)) {
      parsedURL = new URL(input.url);
    } else {
      parsedURL = new URL(input);
      input = {};
    }
    if (parsedURL.username !== "" || parsedURL.password !== "") {
      throw new TypeError(`${parsedURL} is an url with embedded credentials.`);
    }
    let method = init3.method || input.method || "GET";
    if (/^(delete|get|head|options|post|put)$/i.test(method)) {
      method = method.toUpperCase();
    }
    if (!isRequest(init3) && "data" in init3) {
      doBadDataWarn();
    }
    if ((init3.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
      throw new TypeError("Request with GET/HEAD method cannot have body");
    }
    const inputBody = init3.body ? init3.body : isRequest(input) && input.body !== null ? clone(input) : null;
    super(inputBody, {
      size: init3.size || input.size || 0
    });
    const headers = new Headers(init3.headers || input.headers || {});
    if (inputBody !== null && !headers.has("Content-Type")) {
      const contentType = extractContentType(inputBody, this);
      if (contentType) {
        headers.set("Content-Type", contentType);
      }
    }
    let signal = isRequest(input) ? input.signal : null;
    if ("signal" in init3) {
      signal = init3.signal;
    }
    if (signal != null && !isAbortSignal(signal)) {
      throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");
    }
    let referrer = init3.referrer == null ? input.referrer : init3.referrer;
    if (referrer === "") {
      referrer = "no-referrer";
    } else if (referrer) {
      const parsedReferrer = new URL(referrer);
      referrer = /^about:(\/\/)?client$/.test(parsedReferrer) ? "client" : parsedReferrer;
    } else {
      referrer = void 0;
    }
    this[INTERNALS3] = {
      method,
      redirect: init3.redirect || input.redirect || "follow",
      headers,
      parsedURL,
      signal,
      referrer
    };
    this.follow = init3.follow === void 0 ? input.follow === void 0 ? 20 : input.follow : init3.follow;
    this.compress = init3.compress === void 0 ? input.compress === void 0 ? true : input.compress : init3.compress;
    this.counter = init3.counter || input.counter || 0;
    this.agent = init3.agent || input.agent;
    this.highWaterMark = init3.highWaterMark || input.highWaterMark || 16384;
    this.insecureHTTPParser = init3.insecureHTTPParser || input.insecureHTTPParser || false;
    this.referrerPolicy = init3.referrerPolicy || input.referrerPolicy || "";
  }
  get method() {
    return this[INTERNALS3].method;
  }
  get url() {
    return (0, import_node_url.format)(this[INTERNALS3].parsedURL);
  }
  get headers() {
    return this[INTERNALS3].headers;
  }
  get redirect() {
    return this[INTERNALS3].redirect;
  }
  get signal() {
    return this[INTERNALS3].signal;
  }
  get referrer() {
    if (this[INTERNALS3].referrer === "no-referrer") {
      return "";
    }
    if (this[INTERNALS3].referrer === "client") {
      return "about:client";
    }
    if (this[INTERNALS3].referrer) {
      return this[INTERNALS3].referrer.toString();
    }
    return void 0;
  }
  get referrerPolicy() {
    return this[INTERNALS3].referrerPolicy;
  }
  set referrerPolicy(referrerPolicy) {
    this[INTERNALS3].referrerPolicy = validateReferrerPolicy(referrerPolicy);
  }
  clone() {
    return new Request(this);
  }
  get [Symbol.toStringTag]() {
    return "Request";
  }
};
Object.defineProperties(Request.prototype, {
  method: { enumerable: true },
  url: { enumerable: true },
  headers: { enumerable: true },
  redirect: { enumerable: true },
  clone: { enumerable: true },
  signal: { enumerable: true },
  referrer: { enumerable: true },
  referrerPolicy: { enumerable: true }
});
var getNodeRequestOptions = (request3) => {
  const { parsedURL } = request3[INTERNALS3];
  const headers = new Headers(request3[INTERNALS3].headers);
  if (!headers.has("Accept")) {
    headers.set("Accept", "*/*");
  }
  let contentLengthValue = null;
  if (request3.body === null && /^(post|put)$/i.test(request3.method)) {
    contentLengthValue = "0";
  }
  if (request3.body !== null) {
    const totalBytes = getTotalBytes(request3);
    if (typeof totalBytes === "number" && !Number.isNaN(totalBytes)) {
      contentLengthValue = String(totalBytes);
    }
  }
  if (contentLengthValue) {
    headers.set("Content-Length", contentLengthValue);
  }
  if (request3.referrerPolicy === "") {
    request3.referrerPolicy = DEFAULT_REFERRER_POLICY;
  }
  if (request3.referrer && request3.referrer !== "no-referrer") {
    request3[INTERNALS3].referrer = determineRequestsReferrer(request3);
  } else {
    request3[INTERNALS3].referrer = "no-referrer";
  }
  if (request3[INTERNALS3].referrer instanceof URL) {
    headers.set("Referer", request3.referrer);
  }
  if (!headers.has("User-Agent")) {
    headers.set("User-Agent", "node-fetch");
  }
  if (request3.compress && !headers.has("Accept-Encoding")) {
    headers.set("Accept-Encoding", "gzip, deflate, br");
  }
  let { agent } = request3;
  if (typeof agent === "function") {
    agent = agent(parsedURL);
  }
  if (!headers.has("Connection") && !agent) {
    headers.set("Connection", "close");
  }
  const search = getSearch(parsedURL);
  const options = {
    path: parsedURL.pathname + search,
    method: request3.method,
    headers: headers[Symbol.for("nodejs.util.inspect.custom")](),
    insecureHTTPParser: request3.insecureHTTPParser,
    agent
  };
  return {
    parsedURL,
    options
  };
};

// node_modules/node-fetch/src/errors/abort-error.js
var AbortError = class extends FetchBaseError {
  constructor(message2, type = "aborted") {
    super(message2, type);
  }
};

// node_modules/node-fetch/src/index.js
init_esm_min();
init_from();
var supportedSchemas = /* @__PURE__ */ new Set(["data:", "http:", "https:"]);
async function fetch2(url, options_) {
  return new Promise((resolve2, reject) => {
    const request3 = new Request(url, options_);
    const { parsedURL, options } = getNodeRequestOptions(request3);
    if (!supportedSchemas.has(parsedURL.protocol)) {
      throw new TypeError(`node-fetch cannot load ${url}. URL scheme "${parsedURL.protocol.replace(/:$/, "")}" is not supported.`);
    }
    if (parsedURL.protocol === "data:") {
      const data = dist_default(request3.url);
      const response2 = new Response(data, { headers: { "Content-Type": data.typeFull } });
      resolve2(response2);
      return;
    }
    const send = (parsedURL.protocol === "https:" ? import_node_https.default : import_node_http2.default).request;
    const { signal } = request3;
    let response = null;
    const abort = () => {
      const error6 = new AbortError("The operation was aborted.");
      reject(error6);
      if (request3.body && request3.body instanceof import_node_stream2.default.Readable) {
        request3.body.destroy(error6);
      }
      if (!response || !response.body) {
        return;
      }
      response.body.emit("error", error6);
    };
    if (signal && signal.aborted) {
      abort();
      return;
    }
    const abortAndFinalize = () => {
      abort();
      finalize();
    };
    const request_ = send(parsedURL.toString(), options);
    if (signal) {
      signal.addEventListener("abort", abortAndFinalize);
    }
    const finalize = () => {
      request_.abort();
      if (signal) {
        signal.removeEventListener("abort", abortAndFinalize);
      }
    };
    request_.on("error", (error6) => {
      reject(new FetchError(`request to ${request3.url} failed, reason: ${error6.message}`, "system", error6));
      finalize();
    });
    fixResponseChunkedTransferBadEnding(request_, (error6) => {
      if (response && response.body) {
        response.body.destroy(error6);
      }
    });
    if (process.version < "v14") {
      request_.on("socket", (s2) => {
        let endedWithEventsCount;
        s2.prependListener("end", () => {
          endedWithEventsCount = s2._eventsCount;
        });
        s2.prependListener("close", (hadError) => {
          if (response && endedWithEventsCount < s2._eventsCount && !hadError) {
            const error6 = new Error("Premature close");
            error6.code = "ERR_STREAM_PREMATURE_CLOSE";
            response.body.emit("error", error6);
          }
        });
      });
    }
    request_.on("response", (response_) => {
      request_.setTimeout(0);
      const headers = fromRawHeaders(response_.rawHeaders);
      if (isRedirect(response_.statusCode)) {
        const location = headers.get("Location");
        let locationURL = null;
        try {
          locationURL = location === null ? null : new URL(location, request3.url);
        } catch {
          if (request3.redirect !== "manual") {
            reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
            finalize();
            return;
          }
        }
        switch (request3.redirect) {
          case "error":
            reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request3.url}`, "no-redirect"));
            finalize();
            return;
          case "manual":
            break;
          case "follow": {
            if (locationURL === null) {
              break;
            }
            if (request3.counter >= request3.follow) {
              reject(new FetchError(`maximum redirect reached at: ${request3.url}`, "max-redirect"));
              finalize();
              return;
            }
            const requestOptions = {
              headers: new Headers(request3.headers),
              follow: request3.follow,
              counter: request3.counter + 1,
              agent: request3.agent,
              compress: request3.compress,
              method: request3.method,
              body: clone(request3),
              signal: request3.signal,
              size: request3.size,
              referrer: request3.referrer,
              referrerPolicy: request3.referrerPolicy
            };
            if (!isDomainOrSubdomain(request3.url, locationURL)) {
              for (const name3 of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                requestOptions.headers.delete(name3);
              }
            }
            if (response_.statusCode !== 303 && request3.body && options_.body instanceof import_node_stream2.default.Readable) {
              reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
              finalize();
              return;
            }
            if (response_.statusCode === 303 || (response_.statusCode === 301 || response_.statusCode === 302) && request3.method === "POST") {
              requestOptions.method = "GET";
              requestOptions.body = void 0;
              requestOptions.headers.delete("content-length");
            }
            const responseReferrerPolicy = parseReferrerPolicyFromHeader(headers);
            if (responseReferrerPolicy) {
              requestOptions.referrerPolicy = responseReferrerPolicy;
            }
            resolve2(fetch2(new Request(locationURL, requestOptions)));
            finalize();
            return;
          }
          default:
            return reject(new TypeError(`Redirect option '${request3.redirect}' is not a valid value of RequestRedirect`));
        }
      }
      if (signal) {
        response_.once("end", () => {
          signal.removeEventListener("abort", abortAndFinalize);
        });
      }
      let body = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error6) => {
        if (error6) {
          reject(error6);
        }
      });
      if (process.version < "v12.10") {
        response_.on("aborted", abortAndFinalize);
      }
      const responseOptions = {
        url: request3.url,
        status: response_.statusCode,
        statusText: response_.statusMessage,
        headers,
        size: request3.size,
        counter: request3.counter,
        highWaterMark: request3.highWaterMark
      };
      const codings = headers.get("Content-Encoding");
      if (!request3.compress || request3.method === "HEAD" || codings === null || response_.statusCode === 204 || response_.statusCode === 304) {
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      const zlibOptions = {
        flush: import_node_zlib.default.Z_SYNC_FLUSH,
        finishFlush: import_node_zlib.default.Z_SYNC_FLUSH
      };
      if (codings === "gzip" || codings === "x-gzip") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createGunzip(zlibOptions), (error6) => {
          if (error6) {
            reject(error6);
          }
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      if (codings === "deflate" || codings === "x-deflate") {
        const raw = (0, import_node_stream2.pipeline)(response_, new import_node_stream2.PassThrough(), (error6) => {
          if (error6) {
            reject(error6);
          }
        });
        raw.once("data", (chunk) => {
          if ((chunk[0] & 15) === 8) {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflate(), (error6) => {
              if (error6) {
                reject(error6);
              }
            });
          } else {
            body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createInflateRaw(), (error6) => {
              if (error6) {
                reject(error6);
              }
            });
          }
          response = new Response(body, responseOptions);
          resolve2(response);
        });
        raw.once("end", () => {
          if (!response) {
            response = new Response(body, responseOptions);
            resolve2(response);
          }
        });
        return;
      }
      if (codings === "br") {
        body = (0, import_node_stream2.pipeline)(body, import_node_zlib.default.createBrotliDecompress(), (error6) => {
          if (error6) {
            reject(error6);
          }
        });
        response = new Response(body, responseOptions);
        resolve2(response);
        return;
      }
      response = new Response(body, responseOptions);
      resolve2(response);
    });
    writeToStream(request_, request3).catch(reject);
  });
}
function fixResponseChunkedTransferBadEnding(request3, errorCallback) {
  const LAST_CHUNK = import_node_buffer2.Buffer.from("0\r\n\r\n");
  let isChunkedTransfer = false;
  let properLastChunkReceived = false;
  let previousChunk;
  request3.on("response", (response) => {
    const { headers } = response;
    isChunkedTransfer = headers["transfer-encoding"] === "chunked" && !headers["content-length"];
  });
  request3.on("socket", (socket) => {
    const onSocketClose = () => {
      if (isChunkedTransfer && !properLastChunkReceived) {
        const error6 = new Error("Premature close");
        error6.code = "ERR_STREAM_PREMATURE_CLOSE";
        errorCallback(error6);
      }
    };
    const onData2 = (buf) => {
      properLastChunkReceived = import_node_buffer2.Buffer.compare(buf.slice(-5), LAST_CHUNK) === 0;
      if (!properLastChunkReceived && previousChunk) {
        properLastChunkReceived = import_node_buffer2.Buffer.compare(previousChunk.slice(-3), LAST_CHUNK.slice(0, 3)) === 0 && import_node_buffer2.Buffer.compare(buf.slice(-2), LAST_CHUNK.slice(3)) === 0;
      }
      previousChunk = buf;
    };
    socket.prependListener("close", onSocketClose);
    socket.on("data", onData2);
    request3.on("close", () => {
      socket.removeListener("close", onSocketClose);
      socket.removeListener("data", onData2);
    });
  });
}

// output/Biz.IPC.MessageToMainHandler.Github/index.js
var bind9 = /* @__PURE__ */ bind(bindAff);
var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectAff);
var pure11 = /* @__PURE__ */ pure(applicativeAff);
var bindFlipped6 = /* @__PURE__ */ bindFlipped(bindMaybe);
var access_tokenIsSymbol2 = {
  reflectSymbol: function() {
    return "access_token";
  }
};
var scopeIsSymbol2 = {
  reflectSymbol: function() {
    return "scope";
  }
};
var token_typeIsSymbol2 = {
  reflectSymbol: function() {
    return "token_type";
  }
};
var readJSON_2 = /* @__PURE__ */ readJSON_(/* @__PURE__ */ readForeignRecord()(/* @__PURE__ */ readForeignFieldsCons(access_tokenIsSymbol2)(readForeignAccessToken)(/* @__PURE__ */ readForeignFieldsCons(scopeIsSymbol2)(readForeignScopeList)(/* @__PURE__ */ readForeignFieldsCons(token_typeIsSymbol2)(readForeignTokenType)(readForeignFieldsNilRowRo)()())()())()()));
var map23 = /* @__PURE__ */ map(functorAff);
var writeJSON3 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord()(/* @__PURE__ */ writeForeignFieldsCons(access_tokenIsSymbol2)(writeForeignAccessToken)(/* @__PURE__ */ writeForeignFieldsCons(scopeIsSymbol2)(writeForeignScopeList)(/* @__PURE__ */ writeForeignFieldsCons(token_typeIsSymbol2)(writeForeignTokenType)(writeForeignFieldsNilRowR)()()())()()())()()()));
var error5 = /* @__PURE__ */ error3(monadEffectAff);
var discard4 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var info3 = /* @__PURE__ */ info2(monadEffectAff);
var map111 = /* @__PURE__ */ map(functorEither);
var githubTokenFile = "github-token";
var readStoredGithubAccessToken = /* @__PURE__ */ bind9(/* @__PURE__ */ liftEffect5(getUserDataDirectory))(function(dir) {
  var path2 = concat5([dir, githubTokenFile]);
  return bind9(liftEffect5(exists(path2)))(function(pathExists) {
    var $54 = !pathExists;
    if ($54) {
      return pure11(Nothing.value);
    }
    ;
    return bind9(readFile3(path2))(function(buf) {
      return bind9(liftEffect5(decryptString(buf)))(function(str\u0294) {
        return pure11(bindFlipped6(readJSON_2)(str\u0294));
      });
    });
  });
});
var queryGithubGraphQL = function(query) {
  return map23(GithubGraphQLResult.create)(bind9(readStoredGithubAccessToken)(function(token\u0294) {
    if (token\u0294 instanceof Just) {
      return map23(Succeeded.create)(sendRequest(token\u0294.value0)(query));
    }
    ;
    if (token\u0294 instanceof Nothing) {
      return pure11(new Failed(NoGithubToken.value));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.MessageToMainHandler.Github (line 29, column 3 - line 31, column 42): " + [token\u0294.constructor.name]);
  }));
};
var storeGithubAccessToken = function(token) {
  return bind9(liftEffect5(getUserDataDirectory))(function(dir) {
    var path2 = concat5([dir, githubTokenFile]);
    return bind9(liftEffect5(encryptString(writeJSON3(token))))(function(encryptedBuf\u0294) {
      if (encryptedBuf\u0294 instanceof Nothing) {
        return error5("Failed to encrypt token");
      }
      ;
      if (encryptedBuf\u0294 instanceof Just) {
        return writeFile3(path2)(encryptedBuf\u0294.value0);
      }
      ;
      throw new Error("Failed pattern match at Biz.IPC.MessageToMainHandler.Github (line 57, column 3 - line 59, column 38): " + [encryptedBuf\u0294.constructor.name]);
    });
  });
};
var pollGithubAccessToken = function(deviceCode) {
  return bind9(pollAccessToken(fetch(fetch2))(deviceCode))(function(response) {
    return discard4(function() {
      if (response instanceof Right && response.value0 instanceof Right) {
        return discard4(info3("Stored Github Access Token"))(function() {
          return storeGithubAccessToken(response.value0.value0);
        });
      }
      ;
      return pure11(unit);
    }())(function() {
      return pure11(GithubPollAccessTokenResult.create(failedOrFromEither(map111(failedOrFromEither)(response))));
    });
  });
};
var getIsLoggedIntoGithub = /* @__PURE__ */ map23(function($62) {
  return GetIsLoggedIntoGithubResult.create(isJust($62));
})(readStoredGithubAccessToken);
var getGithubDeviceCode = /* @__PURE__ */ map23(function($63) {
  return GithubLoginGetDeviceCodeResult.create(failedOrFromEither($63));
})(/* @__PURE__ */ getDeviceCode(/* @__PURE__ */ fetch(fetch2)));

// output/Biz.IPC.SelectFolder.Types/index.js
var inj2 = /* @__PURE__ */ inj();
var inj1 = /* @__PURE__ */ inj2({
  reflectSymbol: function() {
    return "invalidSpagoDhall";
  }
});
var intercalate8 = /* @__PURE__ */ intercalate2(foldableNonEmptyList)(monoidString);
var map24 = /* @__PURE__ */ map(functorNonEmptyList);
var validSpagoDhallKey = /* @__PURE__ */ function() {
  return $$Proxy.value;
}();
var validSpagoDhall = /* @__PURE__ */ inj2({
  reflectSymbol: function() {
    return "validSpagoDhall";
  }
})(validSpagoDhallKey);
var nothingSelectedKey = /* @__PURE__ */ function() {
  return $$Proxy.value;
}();
var nothingSelected = /* @__PURE__ */ inj2({
  reflectSymbol: function() {
    return "nothingSelected";
  }
})(nothingSelectedKey)({});
var noSpagoDhallKey = /* @__PURE__ */ function() {
  return $$Proxy.value;
}();
var noSpagoDhall = /* @__PURE__ */ inj2({
  reflectSymbol: function() {
    return "noSpagoDhall";
  }
})(noSpagoDhallKey)({});
var invalidSpagoDhallKey = /* @__PURE__ */ function() {
  return $$Proxy.value;
}();
var invalidSpagoDhall = function(errs) {
  return inj1(invalidSpagoDhallKey)(intercalate8("\n")(map24(renderForeignError)(errs)));
};

// output/Biz.Preferences.Types/index.js
var defaultAppPreferences = /* @__PURE__ */ function() {
  return {
    solutions: [],
    githubPersonalAccessToken: Nothing.value
  };
}();

// output/Biz.Preferences/index.js
var map25 = /* @__PURE__ */ map(functorEffect);
var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectEffect);
var bind10 = /* @__PURE__ */ bind(bindAff);
var githubPersonalAccessTokenIsSymbol = {
  reflectSymbol: function() {
    return "githubPersonalAccessToken";
  }
};
var solutionsIsSymbol = {
  reflectSymbol: function() {
    return "solutions";
  }
};
var writeJSON4 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord()(/* @__PURE__ */ writeForeignFieldsCons(githubPersonalAccessTokenIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignPersonalAcces))(/* @__PURE__ */ writeForeignFieldsCons(solutionsIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignString))(writeForeignFieldsNilRowR)()()())()()()));
var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectAff);
var discard5 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var when3 = /* @__PURE__ */ when(applicativeAff);
var readJSON4 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord()(/* @__PURE__ */ readForeignFieldsCons(githubPersonalAccessTokenIsSymbol)(/* @__PURE__ */ readForeignMaybe(readForeignPersonalAccess))(/* @__PURE__ */ readForeignFieldsCons(solutionsIsSymbol)(/* @__PURE__ */ readForeignArray(readForeignString))(readForeignFieldsNilRowRo)()())()()));
var throwError4 = /* @__PURE__ */ throwError(monadThrowAff);
var show8 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var pure14 = /* @__PURE__ */ pure(applicativeAff);
var getPreferencesFilePath = function(dictMonadEffect) {
  return liftEffect(dictMonadEffect)(map25(function(v) {
    return concat5([v, "settings.json"]);
  })(liftEffect6(getUserDataDirectory)));
};
var getPreferencesFilePath1 = /* @__PURE__ */ getPreferencesFilePath(monadEffectAff);
var writeAppPreferences = function(settings) {
  return bind10(getPreferencesFilePath1)(function(settingsFilePath) {
    return writeTextFile2(UTF8.value)(settingsFilePath)(writeJSON4(settings));
  });
};
var readAppPreferences = /* @__PURE__ */ bind10(getPreferencesFilePath1)(function(settingsFilePath) {
  return bind10(liftEffect1(exists(settingsFilePath)))(function(settingsFileExists) {
    return discard5(when3(!settingsFileExists)(writeAppPreferences(defaultAppPreferences)))(function() {
      return bind10(readTextFile2(UTF8.value)(settingsFilePath))(function(textContent) {
        var v = readJSON4(textContent);
        if (v instanceof Left) {
          return throwError4(error(show8(v.value0)));
        }
        ;
        if (v instanceof Right) {
          return pure14(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Biz.Preferences (line 34, column 3 - line 36, column 35): " + [v.constructor.name]);
      });
    });
  });
});

// output/Biz.Tool/index.js
var bind11 = /* @__PURE__ */ bind(bindAff);
var pure15 = /* @__PURE__ */ pure(applicativeAff);
var show9 = /* @__PURE__ */ show(showInt);
var show13 = /* @__PURE__ */ show(showSignal);
var runToolAndGetStdout = function(args) {
  return function(spagoPath) {
    var spawnCmd = function(v) {
      return spawn3({
        cmd: v,
        args,
        stdin: Nothing.value
      })(defaultSpawnOptions);
    };
    return bind11(spawnCmd(spagoPath))(function(v) {
      return pure15(function() {
        if (v.exit instanceof Normally && v.exit.value0 === 0) {
          return new Right(trim(v.stdout));
        }
        ;
        if (v.exit instanceof Normally) {
          return new Left("Unexpected exit code: " + (show9(v.exit.value0) + ("\n" + v.stderr)));
        }
        ;
        if (v.exit instanceof BySignal) {
          return new Left("Interrupted by signal: " + (show13(v.exit.value0) + ("\n" + v.stderr)));
        }
        ;
        throw new Error("Failed pattern match at Biz.Tool (line 17, column 8 - line 22, column 72): " + [v.exit.constructor.name]);
      }());
    });
  };
};

// output/Biz.Spago.Service/index.js
var map26 = /* @__PURE__ */ map(functorEither);
var getGlobalCacheDir = /* @__PURE__ */ function() {
  var $4 = map(functorAff)(function(v) {
    return map26(SpagoGlobalCacheDir)(v);
  });
  var $5 = runToolAndGetStdout(["path", "global-cache"]);
  return function($6) {
    return $4($5($6));
  };
}();

// output/Data.UUID/index.js
var toString6 = function(v) {
  return v;
};

// output/Biz.IPC.MessageToMainHandler/index.js
var bind12 = /* @__PURE__ */ bind(bindAff);
var showOpenDialog1 = /* @__PURE__ */ showOpenDialog();
var map27 = /* @__PURE__ */ map(functorAff);
var pure16 = /* @__PURE__ */ pure(applicativeAff);
var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
var readForeignRecord5 = /* @__PURE__ */ readForeignRecord();
var readForeignFieldsCons3 = /* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "dependencies";
  }
})(/* @__PURE__ */ readForeignArray(readForeignProjectName));
var readJSON5 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord5(/* @__PURE__ */ readForeignFieldsCons3(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "name";
  }
})(readForeignProjectName)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "packages";
  }
})(/* @__PURE__ */ readForeignObject(/* @__PURE__ */ readForeignRecord5(/* @__PURE__ */ readForeignFieldsCons3(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "repo";
  }
})(readForeignRepository)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "version";
  }
})(readForeignVersion)(readForeignFieldsNilRowRo)()())()())()())))(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "repository";
  }
})(/* @__PURE__ */ readForeignMaybe(readForeignRepository))(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "sources";
  }
})(/* @__PURE__ */ readForeignArray(readForeignSourceGlob))(readForeignFieldsNilRowRo)()())()())()())()())()()));
var bind1 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadAff));
var except3 = /* @__PURE__ */ except(applicativeAff);
var mapFlipped4 = /* @__PURE__ */ mapFlipped(functorAff);
var bind22 = /* @__PURE__ */ bind(bindMaybe);
var eq3 = /* @__PURE__ */ eq(eqTool);
var $$for2 = /* @__PURE__ */ $$for(applicativeAff)(traversableArray);
var map112 = /* @__PURE__ */ map(functorEffect);
var voidRight3 = /* @__PURE__ */ voidRight(functorEffect);
var sendToWebContents2 = /* @__PURE__ */ sendToWebContents(/* @__PURE__ */ writeForeignRecord()(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "response";
  }
})(writeForeignMessageToRend)(/* @__PURE__ */ writeForeignFieldsCons({
  reflectSymbol: function() {
    return "response_for_message_id";
  }
})(writeForeignString)(writeForeignFieldsNilRowR)()()())()()()));
var showOpenDialog2 = function(window2) {
  return bind12(showOpenDialog1({
    properties: [openDirectory]
  })(window2))(function(result) {
    return map27(UserSelectedFile.create)(function() {
      var v = function(v1) {
        return pure16(Nothing.value);
      };
      if (!result.canceled) {
        if (result.filePaths.length === 1) {
          return map27(Just.create)(readTextFile2(UTF8.value)(result["filePaths"][0]));
        }
        ;
        return v(true);
      }
      ;
      return v(true);
    }());
  });
};
var loadSpagoProject = function(window2) {
  return bind12(showOpenDialog1({
    properties: [openDirectory]
  })(window2))(function(result) {
    return bind12(function() {
      var v = function(v1) {
        return pure16(nothingSelected);
      };
      if (!result.canceled) {
        var $105 = fromArray(result.filePaths);
        if ($105 instanceof Just) {
          var spagoPath = concat5([head2($105.value0), "spago.dhall"]);
          return bind12(liftEffect7(exists(spagoPath)))(function(pathExists\u0294) {
            var packagesPath = concat5([head2($105.value0), "packages.dhall"]);
            return bind12(liftEffect7(exists(packagesPath)))(function(path2Exists\u0294) {
              var $106 = !pathExists\u0294 || !path2Exists\u0294;
              if ($106) {
                return pure16(noSpagoDhall);
              }
              ;
              return bind12(readTextFile2(UTF8.value)(spagoPath))(function(spagoDhall) {
                return bind12(spawn3({
                  cmd: "dhall-to-json",
                  args: [],
                  stdin: new Just(spagoDhall)
                })(defaultSpawnOptions))(function(v1) {
                  return pure16(either(invalidSpagoDhall)(validSpagoDhall)(readJSON5(v1.stdout)));
                });
              });
            });
          });
        }
        ;
        return v(true);
      }
      ;
      return v(true);
    }())(function(v) {
      return pure16(new LoadSpagoProjectResponse(v));
    });
  });
};
var getSpagoGlobalCache = /* @__PURE__ */ map27(function($119) {
  return GetSpagoGlobalCacheResult.create(failedOrFromEither($119));
})(/* @__PURE__ */ runExceptT(/* @__PURE__ */ bind1(/* @__PURE__ */ except3(/* @__PURE__ */ note("Unsupported OS")(operatingSystem\u0294)))(function(os) {
  return bind1(mapFlipped4(getToolsWithPaths(os))(Right.create))(function(tools) {
    return bind1(except3(note("Spago is not installed")(bind22(find2(function($120) {
      return function(v) {
        return eq3(v)(Spago.value);
      }(fst($120));
    })(tools))(snd))))(function(spagoPath) {
      return getGlobalCacheDir(spagoPath);
    });
  });
})));
var getProjectDefinitions = /* @__PURE__ */ bind12(readAppPreferences)(function(prefs) {
  return bind12($$for2(prefs.solutions)(function(fp) {
    return map27(function(v) {
      return new Tuple(fp, v);
    })(readSolutionDefinition(fp));
  }))(function(projects) {
    return pure16(new GetPureScriptSolutionDefinitionsResponse(projects));
  });
});
var getInstalledTools = /* @__PURE__ */ function() {
  return map27(GetInstalledToolsResponse.create)(maybe(pure16(UnsupportedOperatingSystem.value))(map27(ToolsResult.create))(mapFlipped(functorMaybe)(operatingSystem\u0294)(getToolsWithPaths)));
}();
var handleMessageToMain = function(window2) {
  return function(message_id) {
    return function(message2) {
      return bind12(function() {
        if (message2 instanceof LoadSpagoProject) {
          return loadSpagoProject(window2);
        }
        ;
        if (message2 instanceof ShowOpenDialog) {
          return showOpenDialog2(window2);
        }
        ;
        if (message2 instanceof GetInstalledTools) {
          return getInstalledTools;
        }
        ;
        if (message2 instanceof GetPureScriptSolutionDefinitions) {
          return getProjectDefinitions;
        }
        ;
        if (message2 instanceof QueryGithubGraphQL) {
          return queryGithubGraphQL(message2.value0);
        }
        ;
        if (message2 instanceof GetIsLoggedIntoGithub) {
          return getIsLoggedIntoGithub;
        }
        ;
        if (message2 instanceof GithubLoginGetDeviceCode) {
          return getGithubDeviceCode;
        }
        ;
        if (message2 instanceof GithubPollAccessToken) {
          return pollGithubAccessToken(message2.value0);
        }
        ;
        if (message2 instanceof GetClipboardText) {
          return liftEffect7(map112(GetClipboardTextResult.create)(getClipboardText));
        }
        ;
        if (message2 instanceof CopyToClipboard) {
          return liftEffect7(voidRight3(new CopyToClipboardResult(message2.value0))(copyToClipboard(message2.value0)));
        }
        ;
        if (message2 instanceof GetSpagoGlobalCache) {
          return getSpagoGlobalCache;
        }
        ;
        throw new Error("Failed pattern match at Biz.IPC.MessageToMainHandler (line 41, column 34 - line 54, column 46): " + [message2.constructor.name]);
      }())(function(v) {
        return liftEffect7(function() {
          var responsePayload = {
            response_for_message_id: toString6(message_id),
            response: v
          };
          return sendToWebContents2(responsePayload)("ipc")(window2);
        }());
      });
    };
  };
};

// output/Backend.IPC.Handler/index.js
var show10 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var identity12 = /* @__PURE__ */ identity(categoryFn);
var read8 = /* @__PURE__ */ read3(readForeignMessageToMain);
var registerHandler = function(handle) {
  var listener = function(_ev, fgn) {
    var message2 = either(function($5) {
      return unsafeCrashWith(show10($5));
    })(identity12)(read8(fgn.data.payload));
    return launchAff_(handle(fgn.data.message_id)(message2))();
  };
  return onIPCMainMessage(listener)("ipc");
};
var registerAllHandlers = function(window2) {
  return registerHandler(handleMessageToMain(window2));
};

// output/Biz.Protocol/index.js
var duckProtocol = "duck";

// output/Electron.Types/index.js
var showProtocol = {
  show: function(v) {
    return v;
  }
};

// output/Backend.Protocol/index.js
var unless2 = /* @__PURE__ */ unless(applicativeEffect);
var show11 = /* @__PURE__ */ show(showProtocol);
var registerProtocol = function __do() {
  var protocolIsRegistered = liftEffect(monadEffectEffect)(isDefaultProtocolClient(duckProtocol))();
  return unless2(protocolIsRegistered)(function __do2() {
    var registeredNow = setAsDefaultProtocolClient(duckProtocol)();
    return unless2(registeredNow)(unsafeCrashWith("Failed to set " + (show11(duckProtocol) + " to be handled by this application")))();
  })();
};

// output/Main/index.js
var discard6 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var liftEffect8 = /* @__PURE__ */ liftEffect(monadEffectAff);
var bind13 = /* @__PURE__ */ bind(bindAff);
var mkOptions = /* @__PURE__ */ map(functorEffect)(function(v) {
  return {
    width: 800,
    height: 600,
    backgroundColor: "#000000",
    show: false,
    webPreferences: {
      preload: concat5([v, "..", "preload.js"]),
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: true,
      sandbox: false,
      nodeIntegrationInWorker: true,
      worldSafeExecuteJavaScript: true
    }
  };
})(dirnameImpl);
var main = /* @__PURE__ */ launchAff_(/* @__PURE__ */ discard6(waitUntilAppReady)(function() {
  return discard6(liftEffect8(openHttpsInBrowserAndBlockOtherURLs))(function() {
    return discard6(liftEffect8(appendSwitch("enable-features")("CSSContainerQueries")))(function() {
      return discard6(liftEffect8(registerProtocol))(function() {
        return bind13(liftEffect8(mkOptions))(function(options) {
          return bind13(liftEffect8(newBrowserWindow(options)))(function(window2) {
            return discard6(liftEffect8(registerAllHandlers(window2)))(function() {
              return discard6(liftEffect8(showWhenReadyToShow(window2)))(function() {
                return discard6(loadFile("index.html")(window2))(function() {
                  return liftEffect8(setWindowOpenHandlerToExternal(window2));
                });
              });
            });
          });
        });
      });
    });
  });
}));

// script.mjs
main();
/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */
//# sourceMappingURL=script.js.map
