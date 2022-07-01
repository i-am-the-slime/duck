var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to2, from3, except2, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to2, key) && key !== except2)
        __defProp(to2, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target, mod3));

// output/Main/foreign.js
var dirnameImpl = () => __dirname;

// output/Data.Bounded/foreign.js
var topInt = 2147483647;
var bottomInt = -2147483648;
var topChar = String.fromCharCode(65535);
var bottomChar = String.fromCharCode(0);
var topNumber = Number.POSITIVE_INFINITY;
var bottomNumber = Number.NEGATIVE_INFINITY;

// output/Data.Ord/foreign.js
var unsafeCompareImpl = function(lt) {
  return function(eq2) {
    return function(gt) {
      return function(x) {
        return function(y) {
          return x < y ? lt : x === y ? eq2 : gt;
        };
      };
    };
  };
};
var ordIntImpl = unsafeCompareImpl;
var ordCharImpl = unsafeCompareImpl;

// output/Data.Eq/foreign.js
var refEq = function(r1) {
  return function(r2) {
    return r1 === r2;
  };
};
var eqIntImpl = refEq;
var eqCharImpl = refEq;

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
var eqInt = {
  eq: eqIntImpl
};
var eqChar = {
  eq: eqCharImpl
};
var eq = function(dict) {
  return dict.eq;
};

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
var intSub = function(x) {
  return function(y) {
    return x - y | 0;
  };
};

// output/Data.Semiring/foreign.js
var intAdd = function(x) {
  return function(y) {
    return x + y | 0;
  };
};
var intMul = function(x) {
  return function(y) {
    return x * y | 0;
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

// output/Data.Show/foreign.js
var showIntImpl = function(n) {
  return n.toString();
};
var showStringImpl = function(s) {
  var l = s.length;
  return '"' + s.replace(/[\0-\x1F\x7F"\\]/g, function(c, i) {
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
    var k = i + 1;
    var empty4 = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
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
var Constructor = function(x) {
  return x;
};
var Argument = function(x) {
  return x;
};
var to = function(dict) {
  return dict.to;
};
var from = function(dict) {
  return dict.from;
};

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

// output/Control.Apply/foreign.js
var arrayApply = function(fs) {
  return function(xs) {
    var l = fs.length;
    var k = xs.length;
    var result = new Array(l * k);
    var n = 0;
    for (var i = 0; i < l; i++) {
      var f = fs[i];
      for (var j = 0; j < k; j++) {
        result[n++] = f(xs[j]);
      }
    }
    return result;
  };
};

// output/Control.Semigroupoid/index.js
var semigroupoidFn = {
  compose: function(f) {
    return function(g) {
      return function(x) {
        return f(g(x));
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
  identity: function(x) {
    return x;
  },
  Semigroupoid0: function() {
    return semigroupoidFn;
  }
};

// output/Data.Boolean/index.js
var otherwise = true;

// output/Data.Function/index.js
var flip = function(f) {
  return function(b) {
    return function(a) {
      return f(a)(b);
    };
  };
};
var $$const = function(a) {
  return function(v) {
    return a;
  };
};
var applyFlipped = function(x) {
  return function(f) {
    return f(x);
  };
};

// output/Data.Functor/foreign.js
var arrayMap = function(f) {
  return function(arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

// output/Data.Functor/index.js
var map = function(dict) {
  return dict.map;
};
var mapFlipped = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(fa) {
    return function(f) {
      return map110(f)(fa);
    };
  };
};
var $$void = function(dictFunctor) {
  return map(dictFunctor)($$const(unit));
};
var voidLeft = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(f) {
    return function(x) {
      return map110($$const(x))(f);
    };
  };
};
var voidRight = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(x) {
    return map110($$const(x));
  };
};
var functorArray = {
  map: arrayMap
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
  var map21 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map21($$const(identity2))(a))(b);
    };
  };
};
var lift2 = function(dictApply) {
  var apply1 = apply(dictApply);
  var map21 = map(dictApply.Functor0());
  return function(f) {
    return function(a) {
      return function(b) {
        return apply1(map21(f)(a))(b);
      };
    };
  };
};

// output/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

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
    append: function(f) {
      return function(g) {
        return function(x) {
          return append12(f(x))(g(x));
        };
      };
    }
  };
};

// output/Control.Alt/index.js
var alt = function(dict) {
  return dict.alt;
};

// output/Control.Applicative/index.js
var pure = function(dict) {
  return dict.pure;
};
var when = function(dictApplicative) {
  var pure13 = pure(dictApplicative);
  return function(v) {
    return function(v1) {
      if (v) {
        return v1;
      }
      ;
      if (!v) {
        return pure13(unit);
      }
      ;
      throw new Error("Failed pattern match at Control.Applicative (line 63, column 1 - line 63, column 63): " + [v.constructor.name, v1.constructor.name]);
    };
  };
};
var liftA1 = function(dictApplicative) {
  var apply4 = apply(dictApplicative.Apply0());
  var pure13 = pure(dictApplicative);
  return function(f) {
    return function(a) {
      return apply4(pure13(f))(a);
    };
  };
};

// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
};

// output/Control.Alternative/index.js
var guard = function(dictAlternative) {
  var pure10 = pure(dictAlternative.Applicative0());
  var empty4 = empty(dictAlternative.Plus1());
  return function(v) {
    if (v) {
      return pure10(unit);
    }
    ;
    if (!v) {
      return empty4;
    }
    ;
    throw new Error("Failed pattern match at Control.Alternative (line 48, column 1 - line 48, column 54): " + [v.constructor.name]);
  };
};

// output/Control.Bind/foreign.js
var arrayBind = function(arr) {
  return function(f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

// output/Control.Bind/index.js
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
  return function(f) {
    return function(g) {
      return function(a) {
        return bindFlipped1(f)(g(a));
      };
    };
  };
};
var composeKleisli = function(dictBind) {
  var bind1 = bind(dictBind);
  return function(f) {
    return function(g) {
      return function(a) {
        return bind1(f(a))(g);
      };
    };
  };
};
var discardUnit = {
  discard: function(dictBind) {
    return bind(dictBind);
  }
};

// output/Data.Maybe/index.js
var identity3 = /* @__PURE__ */ identity(categoryFn);
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
  return maybe(a)(identity3);
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
var functorEither = {
  map: function(f) {
    return function(m) {
      if (m instanceof Left) {
        return new Left(m.value0);
      }
      ;
      if (m instanceof Right) {
        return new Right(f(m.value0));
      }
      ;
      throw new Error("Failed pattern match at Data.Either (line 0, column 0 - line 0, column 0): " + [m.constructor.name]);
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
var applicativeEither = /* @__PURE__ */ function() {
  return {
    pure: Right.create,
    Apply0: function() {
      return applyEither;
    }
  };
}();

// output/Data.EuclideanRing/foreign.js
var intDegree = function(x) {
  return Math.min(Math.abs(x), 2147483647);
};
var intDiv = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    return y > 0 ? Math.floor(x / y) : -Math.floor(x / -y);
  };
};
var intMod = function(x) {
  return function(y) {
    if (y === 0)
      return 0;
    var yy = Math.abs(y);
    return (x % yy + yy) % yy;
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
var uncurry = function(f) {
  return function(v) {
    return f(v.value0)(v.value1);
  };
};
var snd = function(v) {
  return v.value1;
};
var fst = function(v) {
  return v.value0;
};

// output/Data.Unfoldable/foreign.js
var unfoldrArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var maybe2 = f(value);
              if (isNothing2(maybe2))
                return result;
              var tuple = fromJust5(maybe2);
              result.push(fst2(tuple));
              value = snd2(tuple);
            }
          };
        };
      };
    };
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
    return function(map21) {
      return function(pure10) {
        return function(f) {
          return function(array) {
            function go(bot, top6) {
              switch (top6 - bot) {
                case 0:
                  return pure10([]);
                case 1:
                  return map21(array1)(f(array[bot]));
                case 2:
                  return apply4(map21(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply4(apply4(map21(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top6 - bot) / 4) * 2;
                  return apply4(map21(concat22)(go(bot, pivot)))(go(pivot, top6));
              }
            }
            return go(0, array.length);
          };
        };
      };
    };
  };
}();

// output/Data.Foldable/foreign.js
var foldrArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};
var foldlArray = function(f) {
  return function(init3) {
    return function(xs) {
      var acc = init3;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

// output/Data.Bifunctor/index.js
var identity4 = /* @__PURE__ */ identity(categoryFn);
var bimap = function(dict) {
  return dict.bimap;
};
var lmap = function(dictBifunctor) {
  var bimap1 = bimap(dictBifunctor);
  return function(f) {
    return bimap1(f)(identity4);
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

// output/Unsafe.Coerce/foreign.js
var unsafeCoerce2 = function(x) {
  return x;
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

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure10 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(f) {
      return foldr22(function($449) {
        return applySecond2(f($449));
      })(pure10(unit));
    };
  };
};
var for_ = function(dictApplicative) {
  var traverse_1 = traverse_(dictApplicative);
  return function(dictFoldable) {
    return flip(traverse_1(dictFoldable));
  };
};
var foldl = function(dict) {
  return dict.foldl;
};
var intercalate2 = function(dictFoldable) {
  var foldl2 = foldl(dictFoldable);
  return function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(sep2) {
      return function(xs) {
        var go = function(v) {
          return function(x) {
            if (v.init) {
              return {
                init: false,
                acc: x
              };
            }
            ;
            return {
              init: false,
              acc: append2(v.acc)(append2(sep2)(x))
            };
          };
        };
        return foldl2(go)({
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
    var append2 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f) {
      return foldr22(function(x) {
        return function(acc) {
          return append2(f(x))(acc);
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

// output/Data.Identity/index.js
var Identity = function(x) {
  return x;
};
var functorIdentity = {
  map: function(f) {
    return function(m) {
      return f(m);
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
    return function(f) {
      return f(v);
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

// output/Data.Traversable/index.js
var identity5 = /* @__PURE__ */ identity(categoryFn);
var traverse = function(dict) {
  return dict.traverse;
};
var sequenceDefault = function(dictTraversable) {
  var traverse22 = traverse(dictTraversable);
  return function(dictApplicative) {
    return traverse22(dictApplicative)(identity5);
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
var sequence = function(dict) {
  return dict.sequence;
};
var $$for = function(dictApplicative) {
  return function(dictTraversable) {
    var traverse22 = traverse(dictTraversable)(dictApplicative);
    return function(x) {
      return function(f) {
        return traverse22(f)(x);
      };
    };
  };
};

// output/Data.Unfoldable1/foreign.js
var unfoldr1ArrayImpl = function(isNothing2) {
  return function(fromJust5) {
    return function(fst2) {
      return function(snd2) {
        return function(f) {
          return function(b) {
            var result = [];
            var value = b;
            while (true) {
              var tuple = f(value);
              result.push(fst2(tuple));
              var maybe2 = snd2(tuple);
              if (isNothing2(maybe2))
                return result;
              value = fromJust5(maybe2);
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
      var step2 = function(i) {
        if (i <= 0) {
          return new Tuple(v, Nothing.value);
        }
        ;
        if (otherwise) {
          return new Tuple(v, new Just(i - 1 | 0));
        }
        ;
        throw new Error("Failed pattern match at Data.Unfoldable1 (line 68, column 5 - line 68, column 39): " + [i.constructor.name]);
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

// output/Data.Enum/index.js
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
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
      return function(x) {
        var v = toEnum1(x);
        if (v instanceof Just) {
          return v.value0;
        }
        ;
        if (v instanceof Nothing) {
          var $140 = x < fromEnum1(bottom1);
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
  if (v >= bottom2 && v <= top2) {
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

// output/Data.Enum.Generic/index.js
var map4 = /* @__PURE__ */ map(functorMaybe);
var genericSucc$prime = function(dict) {
  return dict["genericSucc'"];
};
var genericSucc = function(dictGeneric) {
  var to2 = to(dictGeneric);
  var from3 = from(dictGeneric);
  return function(dictGenericEnum) {
    var $156 = map4(to2);
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
    var $159 = map4(to2);
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
              return map4(Inl.create)(genericPred$prime1(v.value0));
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
              return map4(Inr.create)(genericSucc$prime2(v.value0));
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
      return map4(Constructor)(genericPred$prime1(v));
    },
    "genericSucc'": function(v) {
      return map4(Constructor)(genericSucc$prime1(v));
    }
  };
};

// output/Yoga.JSON/foreign.js
var _parseJSON = JSON.parse;
var _undefined = void 0;
var _unsafeStringify = JSON.stringify;

// output/Effect/foreign.js
var pureE = function(a) {
  return function() {
    return a;
  };
};
var bindE = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};

// output/Control.Monad/index.js
var ap = function(dictMonad) {
  var bind10 = bind(dictMonad.Bind1());
  var pure10 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind10(f)(function(f$prime) {
        return bind10(a)(function(a$prime) {
          return pure10(f$prime(a$prime));
        });
      });
    };
  };
};

// output/Effect/index.js
var $runtime_lazy = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
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
function error(msg) {
  return new Error(msg);
}
function message(e) {
  return e.message;
}
function throwException(e) {
  return function() {
    throw e;
  };
}
function catchException(c) {
  return function(t) {
    return function() {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
}

// output/Effect.Exception/index.js
var pure2 = /* @__PURE__ */ pure(applicativeEffect);
var map5 = /* @__PURE__ */ map(functorEffect);
var $$try = function(action) {
  return catchException(function($3) {
    return pure2(Left.create($3));
  })(map5(Right.create)(action));
};
var $$throw = function($4) {
  return throwException(error($4));
};

// output/Control.Monad.Error.Class/index.js
var throwError = function(dict) {
  return dict.throwError;
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
var modifyImpl = function(f) {
  return function(ref) {
    return function() {
      var t = f(ref.value);
      ref.value = t.state;
      return t.value;
    };
  };
};

// output/Effect.Ref/index.js
var $$void2 = /* @__PURE__ */ $$void(functorEffect);
var $$new = _new;
var modify$prime = modifyImpl;
var modify = function(f) {
  return modify$prime(function(s) {
    var s$prime = f(s);
    return {
      state: s$prime,
      value: s$prime
    };
  });
};
var modify_ = function(f) {
  return function(s) {
    return $$void2(modify(f)(s));
  };
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
var map6 = /* @__PURE__ */ map(functorEither);
var ExceptT = function(x) {
  return x;
};
var withExceptT = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return function(f) {
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
      return map110(mapLeft(f))(v);
    };
  };
};
var runExceptT = function(v) {
  return v;
};
var mapExceptT = function(f) {
  return function(v) {
    return f(v);
  };
};
var functorExceptT = function(dictFunctor) {
  var map110 = map(dictFunctor);
  return {
    map: function(f) {
      return mapExceptT(map110(map6(f)));
    }
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
  var bind10 = bind(dictMonad.Bind1());
  var pure10 = pure(dictMonad.Applicative0());
  return {
    bind: function(v) {
      return function(k) {
        return bind10(v)(either(function($187) {
          return pure10(Left.create($187));
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
  var append2 = append(dictSemigroup);
  return function(dictMonad) {
    var Bind1 = dictMonad.Bind1();
    var bind10 = bind(Bind1);
    var pure10 = pure(dictMonad.Applicative0());
    var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
    return {
      alt: function(v) {
        return function(v1) {
          return bind10(v)(function(rm) {
            if (rm instanceof Right) {
              return pure10(new Right(rm.value0));
            }
            ;
            if (rm instanceof Left) {
              return bind10(v1)(function(rn) {
                if (rn instanceof Right) {
                  return pure10(new Right(rn.value0));
                }
                ;
                if (rn instanceof Left) {
                  return pure10(new Left(append2(rm.value0)(rn.value0)));
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
  return function(value) {
    if (count < 1) {
      return [];
    }
    var result = new Array(count);
    return result.fill(value);
  };
};
var replicatePolyfill = function(count) {
  return function(value) {
    var result = [];
    var n = 0;
    for (var i = 0; i < count; i++) {
      result[n++] = value;
    }
    return result;
  };
};
var replicate = typeof Array.prototype.fill === "function" ? replicateFill : replicatePolyfill;
var fromFoldableImpl = function() {
  function Cons3(head4, tail2) {
    this.head = head4;
    this.tail = tail2;
  }
  var emptyList = {};
  function curryCons(head4) {
    return function(tail2) {
      return new Cons3(head4, tail2);
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
  return function(foldr4) {
    return function(xs) {
      return listToArray(foldr4(curryCons)(emptyList)(xs));
    };
  };
}();
var length = function(xs) {
  return xs.length;
};
var indexImpl = function(just) {
  return function(nothing) {
    return function(xs) {
      return function(i) {
        return i < 0 || i >= xs.length ? nothing : just(xs[i]);
      };
    };
  };
};
var sortByImpl = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from3 + (to2 - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
    i = from3;
    j = mid;
    k = from3;
    while (i < mid && j < to2) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare3(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
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
var map_ = function(f) {
  return function(a) {
    return function() {
      return f(a());
    };
  };
};
var pure_ = function(a) {
  return function() {
    return a;
  };
};
var bind_ = function(a) {
  return function(f) {
    return function() {
      return f(a())();
    };
  };
};
var foreach = function(as) {
  return function(f) {
    return function() {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

// output/Control.Monad.ST.Internal/index.js
var $runtime_lazy2 = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
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
var sortByImpl2 = function() {
  function mergeFromTo(compare3, fromOrdering, xs1, xs2, from3, to2) {
    var mid;
    var i;
    var j;
    var k;
    var x;
    var y;
    var c;
    mid = from3 + (to2 - from3 >> 1);
    if (mid - from3 > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, from3, mid);
    if (to2 - mid > 1)
      mergeFromTo(compare3, fromOrdering, xs2, xs1, mid, to2);
    i = from3;
    j = mid;
    k = from3;
    while (i < mid && j < to2) {
      x = xs2[i];
      y = xs2[j];
      c = fromOrdering(compare3(x)(y));
      if (c > 0) {
        xs1[k++] = y;
        ++j;
      } else {
        xs1[k++] = x;
        ++i;
      }
    }
    while (i < mid) {
      xs1[k++] = xs2[i++];
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

// output/Data.Array/index.js
var unsafeIndex = function() {
  return unsafeIndexImpl;
};
var singleton2 = function(a) {
  return [a];
};
var $$null = function(xs) {
  return length(xs) === 0;
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
var concatMap = /* @__PURE__ */ flip(/* @__PURE__ */ bind(bindArray));
var mapMaybe = function(f) {
  return concatMap(function() {
    var $185 = maybe([])(singleton2);
    return function($186) {
      return $185(f($186));
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
  var ConsCell = function(head4, tail2) {
    this.head = head4;
    this.tail = tail2;
  };
  function finalCell(head4) {
    return new ConsCell(head4, emptyList);
  }
  function consList(x) {
    return function(xs) {
      return new ConsCell(x, xs);
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
    return function(map21) {
      return function(f) {
        var buildFrom = function(x, ys) {
          return apply4(map21(consList)(f(x)))(ys);
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
          var acc = map21(finalCell)(f(array[array.length - 1]));
          var result = go(acc, array.length - 1, array);
          while (result instanceof Cont) {
            result = result.fn();
          }
          return map21(listToArray)(result);
        };
      };
    };
  };
}();

// output/Data.FunctorWithIndex/foreign.js
var mapWithIndexArray = function(f) {
  return function(xs) {
    var l = xs.length;
    var result = Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(i)(xs[i]);
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

// output/Data.FoldableWithIndex/index.js
var foldr8 = /* @__PURE__ */ foldr(foldableArray);
var mapWithIndex2 = /* @__PURE__ */ mapWithIndex(functorWithIndexArray);
var foldl8 = /* @__PURE__ */ foldl(foldableArray);
var foldrWithIndex = function(dict) {
  return dict.foldrWithIndex;
};
var foldMapWithIndexDefaultR = function(dictFoldableWithIndex) {
  var foldrWithIndex1 = foldrWithIndex(dictFoldableWithIndex);
  return function(dictMonoid) {
    var append2 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f) {
      return foldrWithIndex1(function(i) {
        return function(x) {
          return function(acc) {
            return append2(f(i)(x))(acc);
          };
        };
      })(mempty4);
    };
  };
};
var foldableWithIndexArray = {
  foldrWithIndex: function(f) {
    return function(z) {
      var $289 = foldr8(function(v) {
        return function(y) {
          return f(v.value0)(v.value1)(y);
        };
      })(z);
      var $290 = mapWithIndex2(Tuple.create);
      return function($291) {
        return $289($290($291));
      };
    };
  },
  foldlWithIndex: function(f) {
    return function(z) {
      var $292 = foldl8(function(y) {
        return function(v) {
          return f(v.value0)(y)(v.value1);
        };
      })(z);
      var $293 = mapWithIndex2(Tuple.create);
      return function($294) {
        return $292($293($294));
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    return foldMapWithIndexDefaultR(foldableWithIndexArray)(dictMonoid);
  },
  Foldable0: function() {
    return foldableArray;
  }
};

// output/Data.TraversableWithIndex/index.js
var traverseWithIndexDefault = function(dictTraversableWithIndex) {
  var sequence3 = sequence(dictTraversableWithIndex.Traversable2());
  var mapWithIndex4 = mapWithIndex(dictTraversableWithIndex.FunctorWithIndex0());
  return function(dictApplicative) {
    var sequence12 = sequence3(dictApplicative);
    return function(f) {
      var $174 = mapWithIndex4(f);
      return function($175) {
        return sequence12($174($175));
      };
    };
  };
};
var traverseWithIndex = function(dict) {
  return dict.traverseWithIndex;
};
var traversableWithIndexArray = {
  traverseWithIndex: function(dictApplicative) {
    return traverseWithIndexDefault(traversableWithIndexArray)(dictApplicative);
  },
  FunctorWithIndex0: function() {
    return functorWithIndexArray;
  },
  FoldableWithIndex1: function() {
    return foldableWithIndexArray;
  },
  Traversable2: function() {
    return traversableArray;
  }
};

// output/Data.Array.NonEmpty.Internal/index.js
var NonEmptyArray = function(x) {
  return x;
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
  var show8 = show(dictShow);
  return function(dictShow1) {
    var show12 = show(dictShow1);
    return {
      show: function(v) {
        return "(NonEmpty " + (show8(v.value0) + (" " + (show12(v.value1) + ")")));
      }
    };
  };
};
var functorNonEmpty = function(dictFunctor) {
  var map23 = map(dictFunctor);
  return {
    map: function(f) {
      return function(m) {
        return new NonEmpty(f(m.value0), map23(f)(m.value1));
      };
    }
  };
};
var foldableNonEmpty = function(dictFoldable) {
  var foldMap4 = foldMap(dictFoldable);
  var foldl2 = foldl(dictFoldable);
  var foldr4 = foldr(dictFoldable);
  return {
    foldMap: function(dictMonoid) {
      var append12 = append(dictMonoid.Semigroup0());
      var foldMap12 = foldMap4(dictMonoid);
      return function(f) {
        return function(v) {
          return append12(f(v.value0))(foldMap12(f)(v.value1));
        };
      };
    },
    foldl: function(f) {
      return function(b) {
        return function(v) {
          return foldl2(f)(f(b)(v.value0))(v.value1);
        };
      };
    },
    foldr: function(f) {
      return function(b) {
        return function(v) {
          return f(v.value0)(foldr4(f)(b)(v.value1));
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
var adaptMaybe = function(f) {
  return function($123) {
    return fromJust4(f(toArray($123)));
  };
};
var head2 = /* @__PURE__ */ adaptMaybe(head);
var adaptAny = function(f) {
  return function($125) {
    return f(toArray($125));
  };
};
var catMaybes2 = /* @__PURE__ */ adaptAny(catMaybes);

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
var top3 = /* @__PURE__ */ top(boundedInt);
var bottom3 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x) {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  ;
  if (x >= toNumber(top3)) {
    return top3;
  }
  ;
  if (x <= toNumber(bottom3)) {
    return bottom3;
  }
  ;
  if (otherwise) {
    return fromMaybe(0)(fromNumber(x));
  }
  ;
  throw new Error("Failed pattern match at Data.Int (line 72, column 1 - line 72, column 29): " + [x.constructor.name]);
};
var floor2 = function($39) {
  return unsafeClamp(floor($39));
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
var NonEmptyList = function(x) {
  return x;
};
var toList = function(v) {
  return new Cons(v.value0, v.value1);
};
var listMap = function(f) {
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
            return new Cons(f(v1.value0), new Cons(f(v1.value1.value0), Nil.value));
          }
          ;
          if (v1 instanceof Cons && v1.value1 instanceof Nil) {
            return new Cons(f(v1.value0), Nil.value);
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
                $copy_acc = new Cons(f(v1.value0.value0), new Cons(f(v1.value0.value1.value0), new Cons(f(v1.value0.value1.value1.value0), acc)));
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
var map7 = /* @__PURE__ */ map(functorList);
var functorNonEmptyList = /* @__PURE__ */ functorNonEmpty(functorList);
var foldableList = {
  foldr: function(f) {
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
      var $281 = foldl(foldableList)(flip(f))(b);
      return function($282) {
        return $281(rev($282));
      };
    };
  },
  foldl: function(f) {
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
            $tco_var_b = f(b)(v.value0);
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
    var append2 = append(dictMonoid.Semigroup0());
    var mempty4 = mempty(dictMonoid);
    return function(f) {
      return foldl(foldableList)(function(acc) {
        var $283 = append2(acc);
        return function($284) {
          return $283(f($284));
        };
      })(mempty4);
    };
  }
};
var foldr2 = /* @__PURE__ */ foldr(foldableList);
var intercalate4 = /* @__PURE__ */ intercalate2(foldableList)(monoidString);
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
  var show8 = show(dictShow);
  return {
    show: function(v) {
      if (v instanceof Nil) {
        return "Nil";
      }
      ;
      return "(" + (intercalate4(" : ")(map7(show8)(v)) + " : Nil)");
    }
  };
};
var showNonEmptyList = function(dictShow) {
  var show8 = show(showNonEmpty(dictShow)(showList(dictShow)));
  return {
    show: function(v) {
      return "(NonEmptyList " + (show8(v) + ")");
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
        return append1(map7(v.value0)(v1))(apply(applyList)(v.value1)(v1));
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
var _unsafePartial = function(f) {
  return f();
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
var singleton4 = /* @__PURE__ */ function() {
  var $199 = singleton3(plusList);
  return function($200) {
    return NonEmptyList($199($200));
  };
}();

// output/Data.Nullable/foreign.js
var nullImpl = null;
function nullable(a, r, f) {
  return a == null ? r : f(a);
}
function notNull(x) {
  return x;
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
      return function(f) {
        return function(g) {
          return function(r) {
            if (r.type === reflectSymbol2(p)) {
              return f(r.value);
            }
            ;
            return g(r);
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
      return function(value) {
        return {
          type: reflectSymbol2(p),
          value
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

// output/Effect.Unsafe/foreign.js
var unsafePerformEffect = function(f) {
  return f();
};

// output/Foreign/foreign.js
function typeOf(value) {
  return typeof value;
}
function tagOf(value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}
function isNull(value) {
  return value === null;
}
function isUndefined(value) {
  return value === void 0;
}
var isArray = Array.isArray || function(value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

// output/Data.String.CodeUnits/foreign.js
var singleton5 = function(c) {
  return c;
};
var length3 = function(s) {
  return s.length;
};
var drop3 = function(n) {
  return function(s) {
    return s.substring(n);
  };
};

// output/Data.String.Unsafe/foreign.js
var charAt = function(i) {
  return function(s) {
    if (i >= 0 && i < s.length)
      return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
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
    return $153(singleton4($154));
  };
};
var readArray = function(dictMonad) {
  var pure13 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(value) {
    if (isArray(value)) {
      return pure13(unsafeFromForeign(value));
    }
    ;
    if (otherwise) {
      return fail1(new TypeMismatch("array", tagOf(value)));
    }
    ;
    throw new Error("Failed pattern match at Foreign (line 164, column 1 - line 164, column 99): " + [value.constructor.name]);
  };
};
var unsafeReadTagged = function(dictMonad) {
  var pure13 = pure(applicativeExceptT(dictMonad));
  var fail1 = fail(dictMonad);
  return function(tag) {
    return function(value) {
      if (tagOf(value) === tag) {
        return pure13(unsafeFromForeign(value));
      }
      ;
      if (otherwise) {
        return fail1(new TypeMismatch(tag, tagOf(value)));
      }
      ;
      throw new Error("Failed pattern match at Foreign (line 123, column 1 - line 123, column 104): " + [tag.constructor.name, value.constructor.name]);
    };
  };
};
var readString = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("String");
};

// output/Foreign.Index/foreign.js
function unsafeReadPropImpl(f, s, key, value) {
  return value == null ? f : s(value[key]);
}

// output/Foreign.Index/index.js
var unsafeReadProp = function(dictMonad) {
  var fail5 = fail(dictMonad);
  var pure10 = pure(applicativeExceptT(dictMonad));
  return function(k) {
    return function(value) {
      return unsafeReadPropImpl(fail5(new TypeMismatch("object", typeOf(value))), pure10, k, value);
    };
  };
};
var readProp = function(dictMonad) {
  return unsafeReadProp(dictMonad);
};

// output/Foreign.Object/foreign.js
function _copyST(m) {
  return function() {
    var r = {};
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r[k] = m[k];
      }
    }
    return r;
  };
}
var empty2 = {};
function runST(f) {
  return f();
}
function _fmapObject(m0, f) {
  var m = {};
  for (var k in m0) {
    if (hasOwnProperty.call(m0, k)) {
      m[k] = f(m0[k]);
    }
  }
  return m;
}
function _mapWithKey(m0, f) {
  var m = {};
  for (var k in m0) {
    if (hasOwnProperty.call(m0, k)) {
      m[k] = f(k)(m0[k]);
    }
  }
  return m;
}
function _foldM(bind10) {
  return function(f) {
    return function(mz) {
      return function(m) {
        var acc = mz;
        function g(k2) {
          return function(z) {
            return f(z)(k2)(m[k2]);
          };
        }
        for (var k in m) {
          if (hasOwnProperty.call(m, k)) {
            acc = bind10(acc)(g(k));
          }
        }
        return acc;
      };
    };
  };
}
function _lookup(no, yes, k, m) {
  return k in m ? yes(m[k]) : no;
}
function toArrayWithKey(f) {
  return function(m) {
    var r = [];
    for (var k in m) {
      if (hasOwnProperty.call(m, k)) {
        r.push(f(k)(m[k]));
      }
    }
    return r;
  };
}
var keys = Object.keys || toArrayWithKey(function(k) {
  return function() {
    return k;
  };
});

// output/Data.Function.Uncurried/foreign.js
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
    return function(m) {
      return function() {
        m[k] = v;
        return m;
      };
    };
  };
}

// output/Foreign.Object/index.js
var bindFlipped2 = /* @__PURE__ */ bindFlipped(bindST);
var $$void3 = /* @__PURE__ */ $$void(functorST);
var foldr3 = /* @__PURE__ */ foldr(foldableArray);
var identity6 = /* @__PURE__ */ identity(categoryFn);
var values = /* @__PURE__ */ toArrayWithKey(function(v) {
  return function(v1) {
    return v1;
  };
});
var thawST = _copyST;
var singleton6 = function(k) {
  return function(v) {
    return runST(bindFlipped2(poke2(k)(v))(newImpl));
  };
};
var mutate = function(f) {
  return function(m) {
    return runST(function __do() {
      var s = thawST(m)();
      f(s)();
      return s;
    });
  };
};
var mapWithKey = function(f) {
  return function(m) {
    return _mapWithKey(m, f);
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
var functorObject = {
  map: function(f) {
    return function(m) {
      return _fmapObject(m, f);
    };
  }
};
var functorWithIndexObject = {
  mapWithIndex: mapWithKey,
  Functor0: function() {
    return functorObject;
  }
};
var fromFoldable3 = function(dictFoldable) {
  var fromFoldable1 = fromFoldable(dictFoldable);
  return function(l) {
    return runST(function __do() {
      var s = newImpl();
      foreach(fromFoldable1(l))(function(v) {
        return $$void3(poke2(v.value0)(v.value1)(s));
      })();
      return s;
    });
  };
};
var fold2 = /* @__PURE__ */ _foldM(applyFlipped);
var foldMap2 = function(dictMonoid) {
  var append12 = append(dictMonoid.Semigroup0());
  var mempty4 = mempty(dictMonoid);
  return function(f) {
    return fold2(function(acc) {
      return function(k) {
        return function(v) {
          return append12(acc)(f(k)(v));
        };
      };
    })(mempty4);
  };
};
var foldableObject = {
  foldl: function(f) {
    return fold2(function(z) {
      return function(v) {
        return f(z);
      };
    });
  },
  foldr: function(f) {
    return function(z) {
      return function(m) {
        return foldr3(f)(z)(values(m));
      };
    };
  },
  foldMap: function(dictMonoid) {
    var foldMap12 = foldMap2(dictMonoid);
    return function(f) {
      return foldMap12($$const(f));
    };
  }
};
var foldableWithIndexObject = {
  foldlWithIndex: function(f) {
    return fold2(flip(f));
  },
  foldrWithIndex: function(f) {
    return function(z) {
      return function(m) {
        return foldr3(uncurry(f))(z)(toArrayWithKey(Tuple.create)(m));
      };
    };
  },
  foldMapWithIndex: function(dictMonoid) {
    return foldMap2(dictMonoid);
  },
  Foldable0: function() {
    return foldableObject;
  }
};
var traversableWithIndexObject = {
  traverseWithIndex: function(dictApplicative) {
    var Apply0 = dictApplicative.Apply0();
    var apply4 = apply(Apply0);
    var map21 = map(Apply0.Functor0());
    var pure13 = pure(dictApplicative);
    return function(f) {
      return function(ms) {
        return fold2(function(acc) {
          return function(k) {
            return function(v) {
              return apply4(map21(flip(insert2(k)))(acc))(f(k)(v));
            };
          };
        })(pure13(empty2))(ms);
      };
    };
  },
  FunctorWithIndex0: function() {
    return functorWithIndexObject;
  },
  FoldableWithIndex1: function() {
    return foldableWithIndexObject;
  },
  Traversable2: function() {
    return traversableObject;
  }
};
var traversableObject = {
  traverse: function(dictApplicative) {
    var $93 = traverseWithIndex(traversableWithIndexObject)(dictApplicative);
    return function($94) {
      return $93($$const($94));
    };
  },
  sequence: function(dictApplicative) {
    return traverse(traversableObject)(dictApplicative)(identity6);
  },
  Functor0: function() {
    return functorObject;
  },
  Foldable1: function() {
    return foldableObject;
  }
};

// output/Record/index.js
var get = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return function() {
    return function(l) {
      return function(r) {
        return unsafeGet(reflectSymbol2(l))(r);
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
var applicativeExceptT2 = /* @__PURE__ */ applicativeExceptT(monadIdentity);
var pure3 = /* @__PURE__ */ pure(applicativeExceptT2);
var map8 = /* @__PURE__ */ map(functorArray);
var compose1 = /* @__PURE__ */ compose(semigroupoidBuilder);
var insert5 = /* @__PURE__ */ insert3()();
var on3 = /* @__PURE__ */ on2();
var map1 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var map22 = /* @__PURE__ */ map(functorNonEmptyList);
var bindExceptT2 = /* @__PURE__ */ bindExceptT(monadIdentity);
var bindFlipped3 = /* @__PURE__ */ bindFlipped(bindExceptT2);
var composeKleisliFlipped2 = /* @__PURE__ */ composeKleisliFlipped(bindExceptT2);
var sequence2 = /* @__PURE__ */ sequence(traversableObject)(applicativeExceptT2);
var readProp2 = /* @__PURE__ */ readProp(monadIdentity);
var traverseWithIndex2 = /* @__PURE__ */ traverseWithIndex(traversableWithIndexArray)(applicativeExceptT2);
var readArray2 = /* @__PURE__ */ readArray(monadIdentity);
var applyExceptT2 = /* @__PURE__ */ applyExceptT(monadIdentity);
var pure1 = /* @__PURE__ */ pure(applicativeNonEmptyList);
var apply3 = /* @__PURE__ */ apply(applyExceptT2);
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
var readForeignString = {
  readImpl: /* @__PURE__ */ readString(monadIdentity)
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
  var $271 = writeImpl(dictWriteForeign);
  return function($272) {
    return _unsafeStringify($271($272));
  };
};
var writeForeignArray = function(dictWriteForeign) {
  var writeImpl32 = writeImpl(dictWriteForeign);
  return {
    writeImpl: function(xs) {
      return unsafeToForeign(map8(writeImpl32)(xs));
    }
  };
};
var writeImpl1 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignArray(writeForeignForeign));
var writeForeignFieldsCons = function(dictIsSymbol) {
  var get2 = get(dictIsSymbol)();
  var insert32 = insert5(dictIsSymbol);
  return function(dictWriteForeign) {
    var writeImpl32 = writeImpl(dictWriteForeign);
    return function(dictWriteForeignFields) {
      var writeImplFields1 = writeImplFields(dictWriteForeignFields);
      return function() {
        return function() {
          return function() {
            return {
              writeImplFields: function(v) {
                return function(rec) {
                  var rest = writeImplFields1($$Proxy.value)(rec);
                  var value = writeImpl32(get2($$Proxy.value)(rec));
                  var result = compose1(insert32($$Proxy.value)(value))(rest);
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
      var $277 = mapWithKey($$const(writeImpl(dictWriteForeign)));
      return function($278) {
        return unsafeToForeign($277($278));
      };
    }()
  };
};
var writeImpl2 = /* @__PURE__ */ writeImpl(/* @__PURE__ */ writeForeignObject(writeForeignForeign));
var writeForeignTuple = function(dictWriteForeign) {
  var writeImpl32 = writeImpl(dictWriteForeign);
  return function(dictWriteForeign1) {
    var writeImpl42 = writeImpl(dictWriteForeign1);
    return {
      writeImpl: function(v) {
        return writeImpl1([writeImpl32(v.value0), writeImpl42(v.value1)]);
      }
    };
  };
};
var writeForeignVariantCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var on1 = on3(dictIsSymbol);
  return function(dictWriteForeign) {
    var writeImpl32 = writeImpl(dictWriteForeign);
    return function() {
      return function(dictWriteForeignVariant) {
        var writeVariantImpl1 = writeVariantImpl(dictWriteForeignVariant);
        return {
          writeVariantImpl: function(v) {
            return function(variant) {
              var name2 = reflectSymbol2($$Proxy.value);
              var writeVariant = function(value) {
                return writeImpl2(singleton6(name2)(writeImpl32(value)));
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
var readImpl = function(dict) {
  return dict.readImpl;
};
var readForeignMaybe = function(dictReadForeign) {
  return {
    readImpl: function() {
      var readNullOrUndefined = function(v) {
        return function(value) {
          if (isNull(value) || isUndefined(value)) {
            return pure3(Nothing.value);
          }
          ;
          return map1(Just.create)(v(value));
        };
      };
      return readNullOrUndefined(readImpl(dictReadForeign));
    }()
  };
};
var readForeignObject = function(dictReadForeign) {
  return {
    readImpl: function() {
      var readObject$prime = function(value) {
        if (tagOf(value) === "Object") {
          return pure3(unsafeFromForeign(value));
        }
        ;
        if (otherwise) {
          return fail2(new TypeMismatch("Object", tagOf(value)));
        }
        ;
        throw new Error("Failed pattern match at Yoga.JSON (line 207, column 5 - line 207, column 47): " + [value.constructor.name]);
      };
      return composeKleisliFlipped2(function() {
        var $291 = mapWithKey($$const(readImpl(dictReadForeign)));
        return function($292) {
          return sequence2($291($292));
        };
      }())(readObject$prime);
    }()
  };
};
var readAtIdx = function(dictReadForeign) {
  var readImpl22 = readImpl(dictReadForeign);
  return function(i) {
    return function(f) {
      return withExcept(map22(ErrorAtIndex.create(i)))(readImpl22(f));
    };
  };
};
var readForeignArray = function(dictReadForeign) {
  return {
    readImpl: composeKleisliFlipped2(traverseWithIndex2(readAtIdx(dictReadForeign)))(readArray2)
  };
};
var read$prime = function(dictReadForeign) {
  return readImpl(dictReadForeign);
};
var parseJSON = /* @__PURE__ */ function() {
  var $304 = lmap(bifunctorEither)(function($307) {
    return pure1(ForeignError.create(message($307)));
  });
  var $305 = runEffectFn1(_parseJSON);
  return function($306) {
    return ExceptT(Identity($304(unsafePerformEffect($$try($305($306))))));
  };
}();
var readJSON = function(dictReadForeign) {
  var $308 = composeKleisliFlipped2(readImpl(dictReadForeign))(parseJSON);
  return function($309) {
    return runExcept($308($309));
  };
};
var getFields = function(dict) {
  return dict.getFields;
};
var readForeignFieldsCons = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  var insert32 = insert5(dictIsSymbol);
  return function(dictReadForeign) {
    var readImpl22 = readImpl(dictReadForeign);
    return function(dictReadForeignFields) {
      var getFields1 = getFields(dictReadForeignFields);
      return function() {
        return function() {
          return {
            getFields: function(v) {
              return function(obj) {
                var rest = getFields1($$Proxy.value)(obj);
                var name2 = reflectSymbol2($$Proxy.value);
                var withExcept$prime = withExcept(map22(ErrorAtProperty.create(name2)));
                var value = withExcept$prime(bindFlipped3(readImpl22)(readProp2(name2)(obj)));
                var first = map1(insert32($$Proxy.value))(value);
                return apply3(map1(compose1)(first))(rest);
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
        return map1(flip(build)({}))(getFields1($$Proxy.value)(o));
      }
    };
  };
};

// output/Yoga.JSON.Generics.EnumSumRep/index.js
var bind3 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadIdentity));
var readImpl2 = /* @__PURE__ */ readImpl(readForeignString);
var pure4 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
var fail3 = /* @__PURE__ */ fail(monadIdentity);
var writeImpl3 = /* @__PURE__ */ writeImpl(writeForeignString);
var map9 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var alt2 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var genericEnumSumRepConstruc = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return {
    genericEnumReadForeign: function(f) {
      var name2 = reflectSymbol2($$Proxy.value);
      return bind3(readImpl2(f))(function(s) {
        var $35 = s === name2;
        if ($35) {
          return pure4(NoArguments.value);
        }
        ;
        return fail3(ForeignError.create("Enum string " + (s + (" did not match expected string " + name2))));
      });
    },
    genericEnumWriteForeign: function(v) {
      return writeImpl3(reflectSymbol2($$Proxy.value));
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
    return function(a) {
      return genericEnumWriteForeign1(from3(a));
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
    return function(f) {
      return map9(to2)(genericEnumReadForeign1(f));
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
      genericEnumReadForeign: function(f) {
        return alt2(map9(Inl.create)(genericEnumReadForeign1(f)))(map9(Inr.create)(genericEnumReadForeign2(f)));
      },
      genericEnumWriteForeign: function(v) {
        if (v instanceof Inl) {
          return genericEnumWriteForeign1(v.value0);
        }
        ;
        if (v instanceof Inr) {
          return genericEnumWriteForeign2(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Yoga.JSON.Generics.EnumSumRep (line 38, column 29 - line 40, column 43): " + [v.constructor.name]);
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
  to: function(x) {
    if (x instanceof Inl) {
      return NPM.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return Spago.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return Purs.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
      return DhallToJSON.value;
    }
    ;
    throw new Error("Failed pattern match at Backend.Tool.Types (line 32, column 1 - line 32, column 31): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof NPM) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof Spago) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof Purs) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x instanceof DhallToJSON) {
      return new Inr(new Inr(new Inr(NoArguments.value)));
    }
    ;
    throw new Error("Failed pattern match at Backend.Tool.Types (line 32, column 1 - line 32, column 31): " + [x.constructor.name]);
  }
};
var writeForeignTool = {
  writeImpl: /* @__PURE__ */ genericWriteForeignEnum(genericTool_)(genericEnumSumRepSum2)
};
var eqTool = {
  eq: function(x) {
    return function(y) {
      if (x instanceof NPM && y instanceof NPM) {
        return true;
      }
      ;
      if (x instanceof Spago && y instanceof Spago) {
        return true;
      }
      ;
      if (x instanceof Purs && y instanceof Purs) {
        return true;
      }
      ;
      if (x instanceof DhallToJSON && y instanceof DhallToJSON) {
        return true;
      }
      ;
      return false;
    };
  }
};
var ordTool = {
  compare: function(x) {
    return function(y) {
      if (x instanceof NPM && y instanceof NPM) {
        return EQ.value;
      }
      ;
      if (x instanceof NPM) {
        return LT.value;
      }
      ;
      if (y instanceof NPM) {
        return GT.value;
      }
      ;
      if (x instanceof Spago && y instanceof Spago) {
        return EQ.value;
      }
      ;
      if (x instanceof Spago) {
        return LT.value;
      }
      ;
      if (y instanceof Spago) {
        return GT.value;
      }
      ;
      if (x instanceof Purs && y instanceof Purs) {
        return EQ.value;
      }
      ;
      if (x instanceof Purs) {
        return LT.value;
      }
      ;
      if (y instanceof Purs) {
        return GT.value;
      }
      ;
      if (x instanceof DhallToJSON && y instanceof DhallToJSON) {
        return EQ.value;
      }
      ;
      throw new Error("Failed pattern match at Backend.Tool.Types (line 0, column 0 - line 0, column 0): " + [x.constructor.name, y.constructor.name]);
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
  throw new Error("Failed pattern match at Backend.Tool.Types (line 19, column 13 - line 23, column 16): " + [v.constructor.name]);
};

// output/Yoga.JSON.Generics.TaggedSumRep/index.js
var bind4 = /* @__PURE__ */ bind(/* @__PURE__ */ bindExceptT(monadIdentity));
var read$prime2 = /* @__PURE__ */ read$prime(/* @__PURE__ */ readForeignObject(readForeignForeign));
var fail4 = /* @__PURE__ */ fail(monadIdentity);
var pure5 = /* @__PURE__ */ pure(/* @__PURE__ */ applicativeExceptT(monadIdentity));
var read$prime1 = /* @__PURE__ */ read$prime(readForeignString);
var map10 = /* @__PURE__ */ map(functorNonEmptyList);
var map12 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
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
  var writeImpl5 = writeImpl(dictWriteForeign);
  return {
    genericWriteForeignTaggedSumRep: function(v) {
      return function(v1) {
        return writeImpl5(v1);
      };
    }
  };
};
var readGenericTaggedSumRepAr = function(dictReadForeign) {
  var readImpl5 = readImpl(dictReadForeign);
  return {
    genericReadForeignTaggedSumRep: function(v) {
      return function(f) {
        return map12(Argument)(readImpl5(f));
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
          var name2 = v.toConstructorName(reflectSymbol2($$Proxy.value));
          return write4(fromFoldable4([new Tuple(v.typeTag, write1(name2)), new Tuple(v.valueTag, genericWriteForeignTaggedSumRep1(v)(v1))]));
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
      return function(r) {
        return genericWriteForeignTaggedSumRep1(options)(from3(r));
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
        return function(f) {
          var name2 = v.toConstructorName(reflectSymbol2($$Proxy.value));
          return bind4(read$prime2(f))(function(v1) {
            return bind4(maybe(fail4(new ErrorAtProperty(v.typeTag, new ForeignError("Missing type tag: " + v.typeTag))))(pure5)(lookup2(v.typeTag)(v1)))(function(typeFgn) {
              return bind4(read$prime1(typeFgn))(function(typeStr) {
                return bind4(maybe(fail4(new ErrorAtProperty(v.valueTag, new ForeignError("Missing value tag: " + v.valueTag))))(pure5)(lookup2(v.valueTag)(v1)))(function(value) {
                  var $94 = typeStr === name2;
                  if ($94) {
                    return withExcept(map10(ErrorAtProperty.create(name2)))(map12(Constructor)(genericReadForeignTaggedSumRep1(v)(value)));
                  }
                  ;
                  return fail4(new ForeignError("Wrong constructor name tag " + (typeStr + (" where " + (name2 + " was expected.")))));
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
        return function(f) {
          return alt3(map12(Inl.create)(genericReadForeignTaggedSumRep1(options)(f)))(map12(Inr.create)(genericReadForeignTaggedSumRep2(options)(f)));
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
      return function(f) {
        return map12(to2)(genericReadForeignTaggedSumRep1(options)(f));
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
  to: function(x) {
    if (x instanceof Inl) {
      return UnsupportedOperatingSystem.value;
    }
    ;
    if (x instanceof Inr) {
      return new ToolsResult(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.GetInstalledTools.Types (line 14, column 1 - line 14, column 50): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof UnsupportedOperatingSystem) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof ToolsResult) {
      return new Inr(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.GetInstalledTools.Types (line 14, column 1 - line 14, column 50): " + [x.constructor.name]);
  }
};
var writeForeignGetInstalledT = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericGetInstalledToolsR)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(writeGenericTaggedSumRepN)(UnsupportedOperatingSystemIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignTuple(writeForeignTool)(/* @__PURE__ */ writeForeignMaybe(writeForeignToolPath)))))(ToolsResultIsSymbol)))(defaultOptions)
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
            function $tco_loop(i, k) {
              if (i > k || i >= length(array)) {
                $tco_done = true;
                return Nothing.value;
              }
              ;
              if (otherwise) {
                var j = floor2(toNumber(i + k | 0) / 2);
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
                $tco_var_i = i;
                $copy_k = j - 1 | 0;
                return;
              }
              ;
              throw new Error("Failed pattern match at Data.CodePoint.Unicode.Internal (line 5622, column 3 - line 5632, column 30): " + [i.constructor.name, k.constructor.name]);
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
var caseConv = function(f) {
  return function($$char) {
    var maybeConversionRule = getRule(convchars)($$char)(numConvBlocks);
    if (maybeConversionRule instanceof Nothing) {
      return $$char;
    }
    ;
    if (maybeConversionRule instanceof Just) {
      return $$char + f(maybeConversionRule.value0) | 0;
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

// output/Data.String.Common/foreign.js
var trim = function(s) {
  return s.trim();
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output/Data.String.CodePoints/index.js
var fromEnum2 = /* @__PURE__ */ fromEnum(boundedEnumChar);
var map11 = /* @__PURE__ */ map(functorMaybe);
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
var uncons3 = function(s) {
  var v = length3(s);
  if (v === 0) {
    return Nothing.value;
  }
  ;
  if (v === 1) {
    return new Just({
      head: fromEnum2(charAt(0)(s)),
      tail: ""
    });
  }
  ;
  var cu1 = fromEnum2(charAt(1)(s));
  var cu0 = fromEnum2(charAt(0)(s));
  var $42 = isLead(cu0) && isTrail(cu1);
  if ($42) {
    return new Just({
      head: unsurrogate(cu0)(cu1),
      tail: drop3(2)(s)
    });
  }
  ;
  return new Just({
    head: cu0,
    tail: drop3(1)(s)
  });
};
var unconsButWithTuple = function(s) {
  return map11(function(v) {
    return new Tuple(v.head, v.tail);
  })(uncons3(s));
};
var toCodePointArrayFallback = function(s) {
  return unfoldr2(unconsButWithTuple)(s);
};
var unsafeCodePointAt0Fallback = function(s) {
  var cu0 = fromEnum2(charAt(0)(s));
  var $46 = isLead(cu0) && length3(s) > 1;
  if ($46) {
    var cu1 = fromEnum2(charAt(1)(s));
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
    return singleton5($74($75));
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
        } catch (e) {
          return left(e.message);
        }
      };
    };
  };
};
var test = function(r) {
  return function(s) {
    var lastIndex = r.lastIndex;
    var result = r.test(s);
    r.lastIndex = lastIndex;
    return result;
  };
};
var _match = function(just) {
  return function(nothing) {
    return function(r) {
      return function(s) {
        var m = s.match(r);
        if (m == null || m.length === 0) {
          return nothing;
        } else {
          for (var i = 0; i < m.length; i++) {
            m[i] = m[i] == null ? nothing : just(m[i]);
          }
          return just(m);
        }
      };
    };
  };
};

// output/Data.String.Regex.Flags/index.js
var global = {
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
var regex = function(s) {
  return function(f) {
    return regexImpl(Left.create)(Right.create)(s)(renderFlags(f));
  };
};
var match = /* @__PURE__ */ function() {
  return _match(Just.create)(Nothing.value);
}();

// output/Data.String.Regex.Unsafe/index.js
var identity8 = /* @__PURE__ */ identity(categoryFn);
var unsafeRegex = function(s) {
  return function(f) {
    return either(unsafeCrashWith)(identity8)(regex(s)(f));
  };
};

// output/Data.String.Unicode/index.js
var bindFlipped4 = /* @__PURE__ */ bindFlipped(bindArray);
var convertFull = function(f) {
  var $4 = bindFlipped4(f);
  return function($5) {
    return fromCodePointArray($4(toCodePointArray($5)));
  };
};
var toLower3 = /* @__PURE__ */ convertFull(toLower2);

// output/Data.String.Extra/index.js
var foldMap3 = /* @__PURE__ */ foldMap(foldableMaybe);
var foldMap22 = /* @__PURE__ */ foldMap3(monoidArray);
var map13 = /* @__PURE__ */ map(functorArray);
var regexGlobal = function(regexStr) {
  return unsafeRegex(regexStr)(global);
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
var words = function(string) {
  var $13 = hasUnicodeWords(string);
  if ($13) {
    return unicodeWords(string);
  }
  ;
  return asciiWords(string);
};
var kebabCase = /* @__PURE__ */ function() {
  var $25 = joinWith("-");
  var $26 = map13(toLower3);
  return function($27) {
    return $25($26(words($27)));
  };
}();

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
var writeForeignRecord2 = /* @__PURE__ */ writeForeignRecord();
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
  to: function(x) {
    if (x instanceof Inl) {
      return new SpagoApp(x.value0);
    }
    ;
    if (x instanceof Inr) {
      return new SpagoLibrary(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 60, column 1 - line 60, column 54): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof SpagoApp) {
      return new Inl(x.value0);
    }
    ;
    if (x instanceof SpagoLibrary) {
      return new Inr(x.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 60, column 1 - line 60, column 54): " + [x.constructor.name]);
  }
};
var genericEntryPointType_ = {
  to: function(x) {
    if (x instanceof Inl) {
      return Test.value;
    }
    ;
    if (x instanceof Inr) {
      return Build.value;
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 48, column 1 - line 48, column 41): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof Test) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof Build) {
      return new Inr(NoArguments.value);
    }
    ;
    throw new Error("Failed pattern match at Biz.PureScriptSolutionDefinition.Types (line 48, column 1 - line 48, column 41): " + [x.constructor.name]);
  }
};
var readForeignEntryPointType = {
  readImpl: /* @__PURE__ */ genericReadForeignEnum(genericEntryPointType_)(genericEnumSumRepSum3)
};
var readGenericTaggedSumRepCo12 = /* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(entrypointsIsSymbol)(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignRecord2(/* @__PURE__ */ readForeignFieldsCons(build_commandIsSymbol)(/* @__PURE__ */ readForeignMaybe(readForeignString))(/* @__PURE__ */ readForeignFieldsCons(spago_fileIsSymbol)(readForeignString)(/* @__PURE__ */ readForeignFieldsCons(typeIsSymbol)(readForeignEntryPointType)(readForeignFieldsNilRowRo)()())()())()())))(/* @__PURE__ */ readForeignFieldsCons(rootIsSymbol)(readForeignString)(readForeignFieldsNilRowRo)()())()())));
var writeForeignEntryPointTyp = {
  writeImpl: /* @__PURE__ */ genericWriteForeignEnum(genericEntryPointType_)(genericEnumSumRepSum3)
};
var writeGenericTaggedSumRepC2 = /* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(entrypointsIsSymbol)(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignRecord2(/* @__PURE__ */ writeForeignFieldsCons(build_commandIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignString))(/* @__PURE__ */ writeForeignFieldsCons(spago_fileIsSymbol)(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(typeIsSymbol)(writeForeignEntryPointTyp)(writeForeignFieldsNilRowR)()()())()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons(rootIsSymbol)(writeForeignString)(writeForeignFieldsNilRowR)()()())()()())));
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
var writeForeignRepository = writeForeignString;
var writeForeignProjectName = writeForeignString;
var readForeignVersion = readForeignString;
var readForeignSourceGlob = readForeignString;
var readForeignRepository = readForeignString;
var readForeignProjectName = readForeignString;

// output/Electron.Types/index.js
var Channel = function(x) {
  return x;
};

// output/Biz.IPC.Message.Types/index.js
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
var nameIsSymbol = {
  reflectSymbol: function() {
    return "name";
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
var ShowFolderSelectorResponseIsSymbol = {
  reflectSymbol: function() {
    return "ShowFolderSelectorResponse";
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
var writeForeignRecord3 = /* @__PURE__ */ writeForeignRecord();
var writeForeignRecord1 = /* @__PURE__ */ writeForeignRecord3(writeForeignFieldsNilRowR);
var writeForeignFieldsCons2 = /* @__PURE__ */ writeForeignFieldsCons(dependenciesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignProjectName));
var writeForeignFieldsCons1 = /* @__PURE__ */ writeForeignFieldsCons(nameIsSymbol);
var writeForeignMaybe2 = /* @__PURE__ */ writeForeignMaybe(writeForeignString);
var genericEnumConstructor3 = /* @__PURE__ */ genericEnumConstructor(genericEnumNoArguments);
var genericTopConstructor3 = /* @__PURE__ */ genericTopConstructor(genericTopNoArguments);
var genericEnumSum3 = /* @__PURE__ */ genericEnumSum(genericEnumConstructor3)(genericTopConstructor3);
var genericBottomConstructor3 = /* @__PURE__ */ genericBottomConstructor(genericBottomNoArguments);
var genericBottomSum3 = /* @__PURE__ */ genericBottomSum(genericBottomConstructor3);
var genericEnumSum12 = /* @__PURE__ */ genericEnumSum3(/* @__PURE__ */ genericEnumSum3(/* @__PURE__ */ genericEnumSum3(genericEnumConstructor3)(genericBottomConstructor3))(genericBottomSum3))(genericBottomSum3);
var genericTopSum2 = /* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(genericTopConstructor3)));
var ShowFolderSelectorChannel = /* @__PURE__ */ function() {
  function ShowFolderSelectorChannel2() {
  }
  ;
  ShowFolderSelectorChannel2.value = new ShowFolderSelectorChannel2();
  return ShowFolderSelectorChannel2;
}();
var ShowOpenDialogChannel = /* @__PURE__ */ function() {
  function ShowOpenDialogChannel2() {
  }
  ;
  ShowOpenDialogChannel2.value = new ShowOpenDialogChannel2();
  return ShowOpenDialogChannel2;
}();
var GetInstalledToolsChannel = /* @__PURE__ */ function() {
  function GetInstalledToolsChannel2() {
  }
  ;
  GetInstalledToolsChannel2.value = new GetInstalledToolsChannel2();
  return GetInstalledToolsChannel2;
}();
var GetPureScriptSolutionDefinitionsChannel = /* @__PURE__ */ function() {
  function GetPureScriptSolutionDefinitionsChannel2() {
  }
  ;
  GetPureScriptSolutionDefinitionsChannel2.value = new GetPureScriptSolutionDefinitionsChannel2();
  return GetPureScriptSolutionDefinitionsChannel2;
}();
var ShowFolderSelectorResponse = /* @__PURE__ */ function() {
  function ShowFolderSelectorResponse2(value0) {
    this.value0 = value0;
  }
  ;
  ShowFolderSelectorResponse2.create = function(value0) {
    return new ShowFolderSelectorResponse2(value0);
  };
  return ShowFolderSelectorResponse2;
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
var ShowFolderSelectorResponseChannel = /* @__PURE__ */ function() {
  function ShowFolderSelectorResponseChannel2() {
  }
  ;
  ShowFolderSelectorResponseChannel2.value = new ShowFolderSelectorResponseChannel2();
  return ShowFolderSelectorResponseChannel2;
}();
var ShowOpenDialogResponseChannel = /* @__PURE__ */ function() {
  function ShowOpenDialogResponseChannel2() {
  }
  ;
  ShowOpenDialogResponseChannel2.value = new ShowOpenDialogResponseChannel2();
  return ShowOpenDialogResponseChannel2;
}();
var GetInstalledToolsResponseChannel = /* @__PURE__ */ function() {
  function GetInstalledToolsResponseChannel2() {
  }
  ;
  GetInstalledToolsResponseChannel2.value = new GetInstalledToolsResponseChannel2();
  return GetInstalledToolsResponseChannel2;
}();
var GetPureScriptSolutionDefinitionsResponseChannel = /* @__PURE__ */ function() {
  function GetPureScriptSolutionDefinitionsResponseChannel2() {
  }
  ;
  GetPureScriptSolutionDefinitionsResponseChannel2.value = new GetPureScriptSolutionDefinitionsResponseChannel2();
  return GetPureScriptSolutionDefinitionsResponseChannel2;
}();
var genericRendererToMainChan = {
  to: function(x) {
    if (x instanceof Inl) {
      return ShowFolderSelectorChannel.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return ShowOpenDialogChannel.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return GetInstalledToolsChannel.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
      return GetPureScriptSolutionDefinitionsChannel.value;
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 99, column 1 - line 99, column 48): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof ShowFolderSelectorChannel) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof ShowOpenDialogChannel) {
      return new Inr(new Inl(NoArguments.value));
    }
    ;
    if (x instanceof GetInstalledToolsChannel) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x instanceof GetPureScriptSolutionDefinitionsChannel) {
      return new Inr(new Inr(new Inr(NoArguments.value)));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 99, column 1 - line 99, column 48): " + [x.constructor.name]);
  }
};
var genericMessageToRenderer_ = {
  to: function(x) {
    if (x instanceof Inl) {
      return new ShowFolderSelectorResponse(x.value0);
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return new UserSelectedFile(x.value0.value0);
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return new GetInstalledToolsResponse(x.value0.value0.value0);
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inr)) {
      return new GetPureScriptSolutionDefinitionsResponse(x.value0.value0.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 76, column 1 - line 76, column 44): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof ShowFolderSelectorResponse) {
      return new Inl(x.value0);
    }
    ;
    if (x instanceof UserSelectedFile) {
      return new Inr(new Inl(x.value0));
    }
    ;
    if (x instanceof GetInstalledToolsResponse) {
      return new Inr(new Inr(new Inl(x.value0)));
    }
    ;
    if (x instanceof GetPureScriptSolutionDefinitionsResponse) {
      return new Inr(new Inr(new Inr(x.value0)));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 76, column 1 - line 76, column 44): " + [x.constructor.name]);
  }
};
var writeForeignMessageToRend = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericMessageToRenderer_)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignVariant()(/* @__PURE__ */ writeForeignVariantCons(invalidSpagoDhallIsSymbol)(writeForeignString)()(/* @__PURE__ */ writeForeignVariantCons(noSpagoDhallIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(nothingSelectedIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(validSpagoDhallIsSymbol)(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignProjectName)(/* @__PURE__ */ writeForeignFieldsCons(packagesIsSymbol)(/* @__PURE__ */ writeForeignObject(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignFieldsCons(repoIsSymbol)(writeForeignRepository)(/* @__PURE__ */ writeForeignFieldsCons(versionIsSymbol)(writeForeignVersion)(writeForeignFieldsNilRowR)()()())()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons(repositoryIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignRepository))(/* @__PURE__ */ writeForeignFieldsCons(sourcesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignSourceGlob))(writeForeignFieldsNilRowR)()()())()()())()()())()()())()()()))()(writeForeignVariantNilRow)))))))(ShowFolderSelectorResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignMaybe2))(UserSelectedFileIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignGetInstalledT))(GetInstalledToolsResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignTuple(writeForeignString)(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(projectsIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignPureScriptPro))(writeForeignFieldsNilRowR)()()())()()())))))(GetPureScriptSolutionDefinitionsResponseIsSymbol)))))(defaultOptions)
};
var eqRendererToMainChannel = {
  eq: function(x) {
    return function(y) {
      if (x instanceof ShowFolderSelectorChannel && y instanceof ShowFolderSelectorChannel) {
        return true;
      }
      ;
      if (x instanceof ShowOpenDialogChannel && y instanceof ShowOpenDialogChannel) {
        return true;
      }
      ;
      if (x instanceof GetInstalledToolsChannel && y instanceof GetInstalledToolsChannel) {
        return true;
      }
      ;
      if (x instanceof GetPureScriptSolutionDefinitionsChannel && y instanceof GetPureScriptSolutionDefinitionsChannel) {
        return true;
      }
      ;
      return false;
    };
  }
};
var ordRendererToMainChannel = {
  compare: function(x) {
    return function(y) {
      if (x instanceof ShowFolderSelectorChannel && y instanceof ShowFolderSelectorChannel) {
        return EQ.value;
      }
      ;
      if (x instanceof ShowFolderSelectorChannel) {
        return LT.value;
      }
      ;
      if (y instanceof ShowFolderSelectorChannel) {
        return GT.value;
      }
      ;
      if (x instanceof ShowOpenDialogChannel && y instanceof ShowOpenDialogChannel) {
        return EQ.value;
      }
      ;
      if (x instanceof ShowOpenDialogChannel) {
        return LT.value;
      }
      ;
      if (y instanceof ShowOpenDialogChannel) {
        return GT.value;
      }
      ;
      if (x instanceof GetInstalledToolsChannel && y instanceof GetInstalledToolsChannel) {
        return EQ.value;
      }
      ;
      if (x instanceof GetInstalledToolsChannel) {
        return LT.value;
      }
      ;
      if (y instanceof GetInstalledToolsChannel) {
        return GT.value;
      }
      ;
      if (x instanceof GetPureScriptSolutionDefinitionsChannel && y instanceof GetPureScriptSolutionDefinitionsChannel) {
        return EQ.value;
      }
      ;
      throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 0, column 0 - line 0, column 0): " + [x.constructor.name, y.constructor.name]);
    };
  },
  Eq0: function() {
    return eqRendererToMainChannel;
  }
};
var enumRendererToMainChannel = {
  succ: /* @__PURE__ */ genericSucc(genericRendererToMainChan)(genericEnumSum12),
  pred: /* @__PURE__ */ genericPred(genericRendererToMainChan)(genericEnumSum12),
  Ord0: function() {
    return ordRendererToMainChannel;
  }
};
var boundedRendererToMainChan = {
  top: /* @__PURE__ */ genericTop(genericRendererToMainChan)(genericTopSum2),
  bottom: /* @__PURE__ */ genericBottom(genericRendererToMainChan)(genericBottomSum3),
  Ord0: function() {
    return ordRendererToMainChannel;
  }
};
var rendererToMainChannelName = function($659) {
  return Channel(function(v) {
    if (v instanceof ShowFolderSelectorChannel) {
      return "show-folder-selector";
    }
    ;
    if (v instanceof ShowOpenDialogChannel) {
      return "ask-user-to-select-folder";
    }
    ;
    if (v instanceof GetInstalledToolsChannel) {
      return "get-installed-tools";
    }
    ;
    if (v instanceof GetPureScriptSolutionDefinitionsChannel) {
      return "get-app-settings";
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 34, column 41 - line 38, column 63): " + [v.constructor.name]);
  }($659));
};
var messageToRendererToChannel = function(v) {
  if (v instanceof ShowFolderSelectorResponse) {
    return ShowFolderSelectorResponseChannel.value;
  }
  ;
  if (v instanceof UserSelectedFile) {
    return ShowOpenDialogResponseChannel.value;
  }
  ;
  if (v instanceof GetInstalledToolsResponse) {
    return GetInstalledToolsResponseChannel.value;
  }
  ;
  if (v instanceof GetPureScriptSolutionDefinitionsResponse) {
    return GetInstalledToolsResponseChannel.value;
  }
  ;
  throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 48, column 30 - line 52, column 80): " + [v.constructor.name]);
};
var mainToRendererChannelName = function($660) {
  return Channel(function(v) {
    if (v instanceof ShowFolderSelectorResponseChannel) {
      return "show-folder-selector-response";
    }
    ;
    if (v instanceof ShowOpenDialogResponseChannel) {
      return "ask-user-to-select-folder-response";
    }
    ;
    if (v instanceof GetInstalledToolsResponseChannel) {
      return "get-installed-tools-response";
    }
    ;
    if (v instanceof GetPureScriptSolutionDefinitionsResponseChannel) {
      return "get-app-settings-response";
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 41, column 41 - line 45, column 80): " + [v.constructor.name]);
  }($660));
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
  function nonCanceler2(error2) {
    return new Aff2(PURE, void 0);
  }
  function runEff(eff) {
    try {
      eff();
    } catch (error2) {
      setTimeout(function() {
        throw error2;
      }, 0);
    }
  }
  function runSync(left, right, eff) {
    try {
      return right(eff());
    } catch (error2) {
      return left(error2);
    }
  }
  function runAsync(left, eff, k) {
    try {
      return eff(k)();
    } catch (error2) {
      k(left(error2))();
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
        var i, tmp;
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
          return function(error2) {
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
    var fail5 = null;
    var interrupt = null;
    var bhead = null;
    var btail = null;
    var attempts = null;
    var bracketCount = 0;
    var joinId = 0;
    var joins = null;
    var rethrow = true;
    function run3(localRunTick) {
      var tmp, result, attempt;
      while (true) {
        tmp = null;
        result = null;
        attempt = null;
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
            } catch (e) {
              status = RETURN;
              fail5 = util.left(e);
              step2 = null;
            }
            break;
          case STEP_RESULT:
            if (util.isLeft(step2)) {
              status = RETURN;
              fail5 = step2;
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
                fail5 = util.left(step2._1);
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
              step2 = interrupt || fail5 || step2;
            } else {
              tmp = attempts._3;
              attempt = attempts._1;
              attempts = attempts._2;
              switch (attempt.tag) {
                case CATCH:
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    status = RETURN;
                  } else if (fail5) {
                    status = CONTINUE;
                    step2 = attempt._2(util.fromLeft(fail5));
                    fail5 = null;
                  }
                  break;
                case RESUME:
                  if (interrupt && interrupt !== tmp && bracketCount === 0 || fail5) {
                    status = RETURN;
                  } else {
                    bhead = attempt._1;
                    btail = attempt._2;
                    status = STEP_BIND;
                    step2 = util.fromRight(step2);
                  }
                  break;
                case BRACKET:
                  bracketCount--;
                  if (fail5 === null) {
                    result = util.fromRight(step2);
                    attempts = new Aff2(CONS, new Aff2(RELEASE, attempt._2, result), attempts, tmp);
                    if (interrupt === tmp || bracketCount > 0) {
                      status = CONTINUE;
                      step2 = attempt._3(result);
                    }
                  }
                  break;
                case RELEASE:
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail5), attempts, interrupt);
                  status = CONTINUE;
                  if (interrupt && interrupt !== tmp && bracketCount === 0) {
                    step2 = attempt._1.killed(util.fromLeft(interrupt))(attempt._2);
                  } else if (fail5) {
                    step2 = attempt._1.failed(util.fromLeft(fail5))(attempt._2);
                  } else {
                    step2 = attempt._1.completed(util.fromRight(step2))(attempt._2);
                  }
                  fail5 = null;
                  bracketCount++;
                  break;
                case FINALIZER:
                  bracketCount++;
                  attempts = new Aff2(CONS, new Aff2(FINALIZED, step2, fail5), attempts, interrupt);
                  status = CONTINUE;
                  step2 = attempt._1;
                  break;
                case FINALIZED:
                  bracketCount--;
                  status = RETURN;
                  step2 = attempt._1;
                  fail5 = attempt._2;
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
            if (interrupt && fail5) {
              setTimeout(function() {
                throw util.fromLeft(fail5);
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
    function onComplete(join3) {
      return function() {
        if (status === COMPLETED) {
          rethrow = rethrow && join3.rethrow;
          join3.handler(step2)();
          return function() {
          };
        }
        var jid = joinId++;
        joins = joins || {};
        joins[jid] = join3;
        return function() {
          if (joins !== null) {
            delete joins[jid];
          }
        };
      };
    }
    function kill2(error2, cb) {
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
            interrupt = util.left(error2);
            status = COMPLETED;
            step2 = interrupt;
            run3(runTick);
            break;
          case PENDING:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              if (status === PENDING) {
                attempts = new Aff2(CONS, new Aff2(FINALIZER, step2(error2)), attempts, interrupt);
              }
              status = RETURN;
              step2 = null;
              fail5 = null;
              run3(++runTick);
            }
            break;
          default:
            if (interrupt === null) {
              interrupt = util.left(error2);
            }
            if (bracketCount === 0) {
              status = RETURN;
              step2 = null;
              fail5 = null;
            }
        }
        return canceler;
      };
    }
    function join2(cb) {
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
      join: join2,
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
    function kill2(error2, par2, cb2) {
      var step2 = par2;
      var head4 = null;
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
                kills2[count++] = tmp.kill(error2, function(result) {
                  return function() {
                    count--;
                    if (count === 0) {
                      cb2(result)();
                    }
                  };
                });
              }
              if (head4 === null) {
                break loop;
              }
              step2 = head4._2;
              if (tail2 === null) {
                head4 = null;
              } else {
                head4 = tail2._1;
                tail2 = tail2._2;
              }
              break;
            case MAP:
              step2 = step2._2;
              break;
            case APPLY:
            case ALT:
              if (head4) {
                tail2 = new Aff2(CONS, head4, tail2);
              }
              head4 = step2;
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
    function join2(result, head4, tail2) {
      var fail5, step2, lhs, rhs, tmp, kid;
      if (util.isLeft(result)) {
        fail5 = result;
        step2 = null;
      } else {
        step2 = result;
        fail5 = null;
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
          if (head4 === null) {
            cb(fail5 || step2)();
            return;
          }
          if (head4._3 !== EMPTY) {
            return;
          }
          switch (head4.tag) {
            case MAP:
              if (fail5 === null) {
                head4._3 = util.right(head4._1(util.fromRight(step2)));
                step2 = head4._3;
              } else {
                head4._3 = fail5;
              }
              break;
            case APPLY:
              lhs = head4._1._3;
              rhs = head4._2._3;
              if (fail5) {
                head4._3 = fail5;
                tmp = true;
                kid = killId++;
                kills[kid] = kill2(early, fail5 === lhs ? head4._2 : head4._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join2(fail5, null, null);
                    } else {
                      join2(fail5, tail2._1, tail2._2);
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
                head4._3 = step2;
              }
              break;
            case ALT:
              lhs = head4._1._3;
              rhs = head4._2._3;
              if (lhs === EMPTY && util.isLeft(rhs) || rhs === EMPTY && util.isLeft(lhs)) {
                return;
              }
              if (lhs !== EMPTY && util.isLeft(lhs) && rhs !== EMPTY && util.isLeft(rhs)) {
                fail5 = step2 === lhs ? rhs : lhs;
                step2 = null;
                head4._3 = fail5;
              } else {
                head4._3 = step2;
                tmp = true;
                kid = killId++;
                kills[kid] = kill2(early, step2 === lhs ? head4._2 : head4._1, function() {
                  return function() {
                    delete kills[kid];
                    if (tmp) {
                      tmp = false;
                    } else if (tail2 === null) {
                      join2(step2, null, null);
                    } else {
                      join2(step2, tail2._1, tail2._2);
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
            head4 = null;
          } else {
            head4 = tail2._1;
            tail2 = tail2._2;
          }
        }
    }
    function resolve2(fiber) {
      return function(result) {
        return function() {
          delete fibers[fiber._1];
          fiber._3 = result;
          join2(result, fiber._2._1, fiber._2._2);
        };
      };
    }
    function run3() {
      var status = CONTINUE;
      var step2 = par;
      var head4 = null;
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
                  if (head4) {
                    tail2 = new Aff2(CONS, head4, tail2);
                  }
                  head4 = new Aff2(MAP, step2._1, EMPTY, EMPTY);
                  step2 = step2._2;
                  break;
                case APPLY:
                  if (head4) {
                    tail2 = new Aff2(CONS, head4, tail2);
                  }
                  head4 = new Aff2(APPLY, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                case ALT:
                  if (head4) {
                    tail2 = new Aff2(CONS, head4, tail2);
                  }
                  head4 = new Aff2(ALT, EMPTY, step2._2, EMPTY);
                  step2 = step2._1;
                  break;
                default:
                  fid = fiberId++;
                  status = RETURN;
                  tmp = step2;
                  step2 = new Aff2(FORKED, fid, new Aff2(CONS, head4, tail2), EMPTY);
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
              if (head4 === null) {
                break loop;
              }
              if (head4._1 === EMPTY) {
                head4._1 = step2;
                status = CONTINUE;
                step2 = head4._2;
                head4._2 = EMPTY;
              } else {
                head4._2 = step2;
                step2 = head4;
                if (tail2 === null) {
                  head4 = null;
                } else {
                  head4 = tail2._1;
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
    function cancel(error2, cb2) {
      interrupt = util.left(error2);
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
      var newKills = kill2(error2, root, cb2);
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
function _map(f) {
  return function(aff) {
    if (aff.tag === Aff.Pure.tag) {
      return Aff.Pure(f(aff._1));
    } else {
      return Aff.Bind(aff, function(value) {
        return Aff.Pure(f(value));
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
function _parAffMap(f) {
  return function(aff) {
    return Aff.ParMap(f, aff);
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
  function clearDelay(n, t) {
    if (n === 0 && typeof clearImmediate !== "undefined") {
      return clearImmediate(t);
    } else {
      return clearTimeout(t);
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
    return function(f) {
      var $48 = traverse_1(function($50) {
        return parallel2(f($50));
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
var $runtime_lazy3 = function(name2, moduleName, init3) {
  var state2 = 0;
  var val;
  return function(lineNumber) {
    if (state2 === 2)
      return val;
    if (state2 === 1)
      throw new ReferenceError(name2 + " was needed before it finished initializing (module " + moduleName + ", line " + lineNumber + ")", moduleName, lineNumber);
    state2 = 1;
    val = init3();
    state2 = 2;
    return val;
  };
};
var $$void4 = /* @__PURE__ */ $$void(functorEffect);
var Canceler = function(x) {
  return x;
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
  return function __do() {
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
  return (x) => {
    if (x === null)
      throw new Error(msg);
    return x;
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
var toString = function(s) {
  if (s instanceof SIGABRT) {
    return "SIGABRT";
  }
  ;
  if (s instanceof SIGALRM) {
    return "SIGALRM";
  }
  ;
  if (s instanceof SIGBUS) {
    return "SIGBUS";
  }
  ;
  if (s instanceof SIGCHLD) {
    return "SIGCHLD";
  }
  ;
  if (s instanceof SIGCLD) {
    return "SIGCLD";
  }
  ;
  if (s instanceof SIGCONT) {
    return "SIGCONT";
  }
  ;
  if (s instanceof SIGEMT) {
    return "SIGEMT";
  }
  ;
  if (s instanceof SIGFPE) {
    return "SIGFPE";
  }
  ;
  if (s instanceof SIGHUP) {
    return "SIGHUP";
  }
  ;
  if (s instanceof SIGILL) {
    return "SIGILL";
  }
  ;
  if (s instanceof SIGINFO) {
    return "SIGINFO";
  }
  ;
  if (s instanceof SIGINT) {
    return "SIGINT";
  }
  ;
  if (s instanceof SIGIO) {
    return "SIGIO";
  }
  ;
  if (s instanceof SIGIOT) {
    return "SIGIOT";
  }
  ;
  if (s instanceof SIGKILL) {
    return "SIGKILL";
  }
  ;
  if (s instanceof SIGLOST) {
    return "SIGLOST";
  }
  ;
  if (s instanceof SIGPIPE) {
    return "SIGPIPE";
  }
  ;
  if (s instanceof SIGPOLL) {
    return "SIGPOLL";
  }
  ;
  if (s instanceof SIGPROF) {
    return "SIGPROF";
  }
  ;
  if (s instanceof SIGPWR) {
    return "SIGPWR";
  }
  ;
  if (s instanceof SIGQUIT) {
    return "SIGQUIT";
  }
  ;
  if (s instanceof SIGSEGV) {
    return "SIGSEGV";
  }
  ;
  if (s instanceof SIGSTKFLT) {
    return "SIGSTKFLT";
  }
  ;
  if (s instanceof SIGSTOP) {
    return "SIGSTOP";
  }
  ;
  if (s instanceof SIGSYS) {
    return "SIGSYS";
  }
  ;
  if (s instanceof SIGTERM) {
    return "SIGTERM";
  }
  ;
  if (s instanceof SIGTRAP) {
    return "SIGTRAP";
  }
  ;
  if (s instanceof SIGTSTP) {
    return "SIGTSTP";
  }
  ;
  if (s instanceof SIGTTIN) {
    return "SIGTTIN";
  }
  ;
  if (s instanceof SIGTTOU) {
    return "SIGTTOU";
  }
  ;
  if (s instanceof SIGUNUSED) {
    return "SIGUNUSED";
  }
  ;
  if (s instanceof SIGURG) {
    return "SIGURG";
  }
  ;
  if (s instanceof SIGUSR1) {
    return "SIGUSR1";
  }
  ;
  if (s instanceof SIGUSR2) {
    return "SIGUSR2";
  }
  ;
  if (s instanceof SIGVTALRM) {
    return "SIGVTALRM";
  }
  ;
  if (s instanceof SIGWINCH) {
    return "SIGWINCH";
  }
  ;
  if (s instanceof SIGXCPU) {
    return "SIGXCPU";
  }
  ;
  if (s instanceof SIGXFSZ) {
    return "SIGXFSZ";
  }
  ;
  throw new Error("Failed pattern match at Data.Posix.Signal (line 48, column 14 - line 86, column 24): " + [s.constructor.name]);
};
var fromString2 = function(s) {
  if (s === "SIGABRT") {
    return new Just(SIGABRT.value);
  }
  ;
  if (s === "SIGALRM") {
    return new Just(SIGALRM.value);
  }
  ;
  if (s === "SIGBUS") {
    return new Just(SIGBUS.value);
  }
  ;
  if (s === "SIGCHLD") {
    return new Just(SIGCHLD.value);
  }
  ;
  if (s === "SIGCLD") {
    return new Just(SIGCLD.value);
  }
  ;
  if (s === "SIGCONT") {
    return new Just(SIGCONT.value);
  }
  ;
  if (s === "SIGEMT") {
    return new Just(SIGEMT.value);
  }
  ;
  if (s === "SIGFPE") {
    return new Just(SIGFPE.value);
  }
  ;
  if (s === "SIGHUP") {
    return new Just(SIGHUP.value);
  }
  ;
  if (s === "SIGILL") {
    return new Just(SIGILL.value);
  }
  ;
  if (s === "SIGINFO") {
    return new Just(SIGINFO.value);
  }
  ;
  if (s === "SIGINT") {
    return new Just(SIGINT.value);
  }
  ;
  if (s === "SIGIO") {
    return new Just(SIGIO.value);
  }
  ;
  if (s === "SIGIOT") {
    return new Just(SIGIOT.value);
  }
  ;
  if (s === "SIGKILL") {
    return new Just(SIGKILL.value);
  }
  ;
  if (s === "SIGLOST") {
    return new Just(SIGLOST.value);
  }
  ;
  if (s === "SIGPIPE") {
    return new Just(SIGPIPE.value);
  }
  ;
  if (s === "SIGPOLL") {
    return new Just(SIGPOLL.value);
  }
  ;
  if (s === "SIGPROF") {
    return new Just(SIGPROF.value);
  }
  ;
  if (s === "SIGPWR") {
    return new Just(SIGPWR.value);
  }
  ;
  if (s === "SIGQUIT") {
    return new Just(SIGQUIT.value);
  }
  ;
  if (s === "SIGSEGV") {
    return new Just(SIGSEGV.value);
  }
  ;
  if (s === "SIGSTKFLT") {
    return new Just(SIGSTKFLT.value);
  }
  ;
  if (s === "SIGSTOP") {
    return new Just(SIGSTOP.value);
  }
  ;
  if (s === "SIGSYS") {
    return new Just(SIGSYS.value);
  }
  ;
  if (s === "SIGTERM") {
    return new Just(SIGTERM.value);
  }
  ;
  if (s === "SIGTRAP") {
    return new Just(SIGTRAP.value);
  }
  ;
  if (s === "SIGTSTP") {
    return new Just(SIGTSTP.value);
  }
  ;
  if (s === "SIGTTIN") {
    return new Just(SIGTTIN.value);
  }
  ;
  if (s === "SIGTTOU") {
    return new Just(SIGTTOU.value);
  }
  ;
  if (s === "SIGUNUSED") {
    return new Just(SIGUNUSED.value);
  }
  ;
  if (s === "SIGURG") {
    return new Just(SIGURG.value);
  }
  ;
  if (s === "SIGUSR1") {
    return new Just(SIGUSR1.value);
  }
  ;
  if (s === "SIGUSR2") {
    return new Just(SIGUSR2.value);
  }
  ;
  if (s === "SIGVTALRM") {
    return new Just(SIGVTALRM.value);
  }
  ;
  if (s === "SIGWINCH") {
    return new Just(SIGWINCH.value);
  }
  ;
  if (s === "SIGXCPU") {
    return new Just(SIGXCPU.value);
  }
  ;
  if (s === "SIGXFSZ") {
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
var map14 = /* @__PURE__ */ map(functorArray);
var map15 = /* @__PURE__ */ map(functorMaybe);
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
  function Ignore2() {
  }
  ;
  Ignore2.value = new Ignore2();
  return Ignore2;
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
var toActualStdIOOptions = /* @__PURE__ */ map14(/* @__PURE__ */ function() {
  var $38 = map15(toActualStdIOBehaviour);
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
  return map14(Just.create)([Pipe.value, Pipe.value, Pipe.value]);
}();
var mkExit = function(code) {
  return function(signal) {
    var fromSignal = composeKleisli2(toMaybe)(function() {
      var $43 = map15(BySignal.create);
      return function($44) {
        return $43(fromString2($44));
      };
    }());
    var fromCode = function() {
      var $45 = map15(Normally.create);
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
  return (r) => (f) => () => {
    r.on("data", (data) => {
      f(readChunk2(data))();
    });
  };
}
function writeStringImpl(w) {
  return (enc) => (s) => (done) => () => w.write(s, enc, done);
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
  return (value) => {
    return (offset) => {
      return (buf) => {
        return () => {
          buf["write" + ty](value, offset);
        };
      };
    };
  };
}
function writeStringInternal(encoding) {
  return (offset) => {
    return (length4) => {
      return (value) => {
        return (buff) => {
          return () => {
            return buff.write(value, offset, length4, encoding);
          };
        };
      };
    };
  };
}
function setAtOffset(value) {
  return (offset) => {
    return (buff) => {
      return () => {
        buff[offset] = value;
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
function readImpl3(ty) {
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
var readString2 = function($8) {
  return readStringImpl(encodingToNode($8));
};
var read3 = /* @__PURE__ */ function() {
  var $9 = show(showBufferValueType);
  return function($10) {
    return readImpl3($9($10));
  };
}();
var getAtOffset = /* @__PURE__ */ function() {
  return getAtOffsetImpl(Just.create)(Nothing.value);
}();
var fromString3 = function(str) {
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
  return function(f) {
    return function(x) {
      return unsafeThaw1(f(x));
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
  var map21 = map(dictMonad.Bind1().Apply0().Functor0());
  var unsafeFreeze1 = unsafeFreeze2(dictMonad);
  return function(f) {
    return function(buf) {
      return map21(f)(unsafeFreeze1(buf));
    };
  };
};
var toString4 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(m) {
    return usingFromImmutable1(toString3(m));
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
var readString3 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(m) {
    return function(o) {
      return function(o$prime) {
        return usingFromImmutable1(readString2(m)(o)(o$prime));
      };
    };
  };
};
var read4 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(t) {
    return function(o) {
      return usingFromImmutable1(read3(t)(o));
    };
  };
};
var getAtOffset2 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(o) {
    return usingFromImmutable1(getAtOffset(o));
  };
};
var fromString4 = function(dictMonad) {
  var usingToImmutable1 = usingToImmutable(dictMonad);
  return function(s) {
    return usingToImmutable1(fromString3(s));
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
  fromString: /* @__PURE__ */ fromString4(monadEffect),
  fromArrayBuffer: /* @__PURE__ */ fromArrayBuffer2(monadEffect),
  toArrayBuffer: /* @__PURE__ */ toArrayBuffer2(monadEffect),
  read: /* @__PURE__ */ read4(monadEffect),
  readString: /* @__PURE__ */ readString3(monadEffect),
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
    return function(s) {
      return function(cb) {
        return writeStringImpl(w)(show4(enc))(s)(function($20) {
          return cb(toMaybe($20))();
        });
      };
    };
  };
};
var readChunk = /* @__PURE__ */ function() {
  return readChunkImpl(Left.create)(Right.create);
}();
var onDataEither = function(r) {
  return function(cb) {
    return onDataEitherImpl(readChunk)(r)(cb);
  };
};
var onData = function(r) {
  return function(cb) {
    var fromEither = function(x) {
      if (x instanceof Left) {
        return $$throw("Stream encoding should not be set");
      }
      ;
      if (x instanceof Right) {
        return pure6(x.value0);
      }
      ;
      throw new Error("Failed pattern match at Node.Stream (line 97, column 5 - line 101, column 17): " + [x.constructor.name]);
    };
    return onDataEither(r)(composeKleisliFlipped3(cb)(fromEither));
  };
};
var onDataString = function(r) {
  return function(enc) {
    return function(cb) {
      return onData(r)(composeKleisliFlipped3(cb)(toString5(enc)));
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
          return function __do() {
            var stdoutRef = $$new("")();
            var stderrRef = $$new("")();
            var process3 = spawn2(v.cmd)(v.args)(options)();
            (function() {
              if (v.stdin instanceof Just) {
                var write8 = stdin(process3);
                return $$void5(writeString3(write8)(UTF8.value)(v.stdin.value0)($$const(end(write8)(mempty2))))();
              }
              ;
              if (v.stdin instanceof Nothing) {
                return unit;
              }
              ;
              throw new Error("Failed pattern match at Sunde (line 41, column 3 - line 46, column 25): " + [v.stdin.constructor.name]);
            })();
            onDataString(stdout(process3))(encoding)(function(string) {
              return modify_(function(v1) {
                return v1 + string;
              })(stdoutRef);
            })();
            onDataString(stderr(process3))(encoding)(function(string) {
              return modify_(function(v1) {
                return v1 + string;
              })(stderrRef);
            })();
            onError(process3)(function($23) {
              return cb(Left.create(toStandardError($23)));
            })();
            onExit(process3)(function(exit2) {
              return function __do2() {
                var stdout2 = read(stdoutRef)();
                var stderr2 = read(stderrRef)();
                return cb(pure12({
                  stdout: stdout2,
                  stderr: stderr2,
                  exit: exit2
                }))();
              };
            })();
            return effectCanceler($$void5(kill(killSignal)(process3)));
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
var map16 = /* @__PURE__ */ map(functorAff);
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
    return map16(function(v) {
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
    return map16(function(v) {
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
var fromString6 = function(v) {
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
var platform = /* @__PURE__ */ fromString6(platformStr);

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
function handleCallbackImpl(left, right, f) {
  return function(err, value) {
    if (err) {
      f(left(err))();
    } else {
      f(right(value))();
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
var toAff2 = function(f) {
  return function(a) {
    return function(b) {
      return toAff(f(a)(b));
    };
  };
};
var toAff3 = function(f) {
  return function(a) {
    return function(b) {
      return function(c) {
        return toAff(f(a)(b)(c));
      };
    };
  };
};
var writeTextFile2 = /* @__PURE__ */ toAff3(writeTextFile);
var readTextFile2 = /* @__PURE__ */ toAff2(readTextFile);

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

// output/Biz.IPC.SelectFolder.Types/index.js
var inj2 = /* @__PURE__ */ inj();
var inj1 = /* @__PURE__ */ inj2({
  reflectSymbol: function() {
    return "invalidSpagoDhall";
  }
});
var intercalate6 = /* @__PURE__ */ intercalate2(foldableNonEmptyList)(monoidString);
var map17 = /* @__PURE__ */ map(functorNonEmptyList);
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
  return inj1(invalidSpagoDhallKey)(intercalate6("\n")(map17(renderForeignError)(errs)));
};

// output/Biz.Github.Types/index.js
var writeForeignPersonalAcces = writeForeignString;
var readForeignPersonalAccess = readForeignString;

// output/Biz.Preferences.Types/index.js
var defaultAppPreferences = /* @__PURE__ */ function() {
  return {
    solutions: [],
    githubPersonalAccessToken: Nothing.value
  };
}();

// output/Electron/foreign.js
var import_electron = require("electron");
var whenReadyImpl = () => import_electron.app.whenReady();
var newBrowserWindow = (config) => () => new import_electron.BrowserWindow(config);
var loadFileImpl = (name2) => (browserWindow) => () => browserWindow.loadFile(name2);
var onIPCMainMessage = (listener) => (channel) => () => {
  import_electron.ipcMain.on(channel, listener);
};
var showOpenDialogImpl = (options) => (window) => () => import_electron.dialog.showOpenDialog(window, options);
var sendToWebContentsImpl = (message2) => (channel) => (win) => () => {
  win.webContents.send(channel, message2);
};
var getUserDataDirectory = () => import_electron.app.getPath("userData");
var setWindowOpenHandlerToExternal = (win) => () => {
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) {
      import_electron.shell.openExternal(url);
    }
    return { action: "deny" };
  });
};

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
var identity10 = /* @__PURE__ */ identity(categoryFn);
var alt5 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
var map18 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var readString5 = /* @__PURE__ */ readString(monadIdentity);
var bind6 = /* @__PURE__ */ bind(bindAff);
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
  })(identity10)(runExcept(alt5(unsafeReadTagged2("Error")(fn))(map18(error)(readString5(fn)))));
};
var toAff4 = /* @__PURE__ */ toAff$prime(coerce3);
var toAffE = function(f) {
  return bind6(liftEffect4(f))(toAff4);
};

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
      return function(window) {
        return sendToWebContentsImpl(write8(msg))(channel)(window);
      };
    };
  };
};
var openDirectory = "openDirectory";
var loadFile = function(s) {
  return function(bw) {
    return toAffE(loadFileImpl(s)(bw));
  };
};

// output/Biz.Preferences/index.js
var map19 = /* @__PURE__ */ map(functorEffect);
var liftEffect5 = /* @__PURE__ */ liftEffect(monadEffectEffect);
var bind7 = /* @__PURE__ */ bind(bindAff);
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
var writeJSON2 = /* @__PURE__ */ writeJSON(/* @__PURE__ */ writeForeignRecord()(/* @__PURE__ */ writeForeignFieldsCons(githubPersonalAccessTokenIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignPersonalAcces))(/* @__PURE__ */ writeForeignFieldsCons(solutionsIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignString))(writeForeignFieldsNilRowR)()()())()()()));
var liftEffect1 = /* @__PURE__ */ liftEffect(monadEffectAff);
var discard3 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var when3 = /* @__PURE__ */ when(applicativeAff);
var readJSON3 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord()(/* @__PURE__ */ readForeignFieldsCons(githubPersonalAccessTokenIsSymbol)(/* @__PURE__ */ readForeignMaybe(readForeignPersonalAccess))(/* @__PURE__ */ readForeignFieldsCons(solutionsIsSymbol)(/* @__PURE__ */ readForeignArray(readForeignString))(readForeignFieldsNilRowRo)()())()()));
var throwError3 = /* @__PURE__ */ throwError(monadThrowAff);
var show7 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var pure8 = /* @__PURE__ */ pure(applicativeAff);
var getPreferencesFilePath = function(dictMonadEffect) {
  return liftEffect(dictMonadEffect)(map19(function(v) {
    return concat5([v, "settings.json"]);
  })(liftEffect5(getUserDataDirectory)));
};
var getPreferencesFilePath1 = /* @__PURE__ */ getPreferencesFilePath(monadEffectAff);
var writeAppPreferences = function(settings) {
  return bind7(getPreferencesFilePath1)(function(settingsFilePath) {
    return writeTextFile2(UTF8.value)(settingsFilePath)(writeJSON2(settings));
  });
};
var readAppPreferences = /* @__PURE__ */ bind7(getPreferencesFilePath1)(function(settingsFilePath) {
  return bind7(liftEffect1(exists(settingsFilePath)))(function(settingsFileExists) {
    return discard3(when3(!settingsFileExists)(writeAppPreferences(defaultAppPreferences)))(function() {
      return bind7(readTextFile2(UTF8.value)(settingsFilePath))(function(textContent) {
        var v = readJSON3(textContent);
        if (v instanceof Left) {
          return throwError3(error(show7(v.value0)));
        }
        ;
        if (v instanceof Right) {
          return pure8(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Biz.Preferences (line 34, column 3 - line 36, column 35): " + [v.constructor.name]);
      });
    });
  });
});

// output/Biz.IPC.MessageToMainHandler/index.js
var bind8 = /* @__PURE__ */ bind(bindAff);
var showOpenDialog1 = /* @__PURE__ */ showOpenDialog();
var map20 = /* @__PURE__ */ map(functorAff);
var pure9 = /* @__PURE__ */ pure(applicativeAff);
var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
var readForeignRecord3 = /* @__PURE__ */ readForeignRecord();
var readForeignFieldsCons2 = /* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "dependencies";
  }
})(/* @__PURE__ */ readForeignArray(readForeignProjectName));
var readJSON4 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "name";
  }
})(readForeignProjectName)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "packages";
  }
})(/* @__PURE__ */ readForeignObject(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignFieldsCons({
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
var $$for2 = /* @__PURE__ */ $$for(applicativeAff)(traversableArray);
var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
var sendToWebContents2 = /* @__PURE__ */ sendToWebContents(writeForeignMessageToRend);
var showOpenDialog2 = function(window) {
  return bind8(showOpenDialog1({
    properties: [openDirectory]
  })(window))(function(result) {
    return map20(UserSelectedFile.create)(function() {
      var v = function(v1) {
        return pure9(Nothing.value);
      };
      if (!result.canceled) {
        if (result.filePaths.length === 1) {
          return map20(Just.create)(readTextFile2(UTF8.value)(result["filePaths"][0]));
        }
        ;
        return v(true);
      }
      ;
      return v(true);
    }());
  });
};
var showFolderSelector = function(window) {
  return bind8(showOpenDialog1({
    properties: [openDirectory]
  })(window))(function(result) {
    return bind8(function() {
      var v = function(v1) {
        return pure9(nothingSelected);
      };
      if (!result.canceled) {
        var $81 = fromArray(result.filePaths);
        if ($81 instanceof Just) {
          var spagoPath = concat5([head2($81.value0), "spago.dhall"]);
          return bind8(liftEffect6(exists(spagoPath)))(function(pathExists\u0294) {
            var packagesPath = concat5([head2($81.value0), "packages.dhall"]);
            return bind8(liftEffect6(exists(packagesPath)))(function(path2Exists\u0294) {
              var $82 = !pathExists\u0294 || !path2Exists\u0294;
              if ($82) {
                return pure9(noSpagoDhall);
              }
              ;
              return bind8(readTextFile2(UTF8.value)(spagoPath))(function(spagoDhall) {
                return bind8(spawn3({
                  cmd: "dhall-to-json",
                  args: [],
                  stdin: new Just(spagoDhall)
                })(defaultSpawnOptions))(function(v1) {
                  return pure9(either(invalidSpagoDhall)(validSpagoDhall)(readJSON4(v1.stdout)));
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
      return pure9(new ShowFolderSelectorResponse(v));
    });
  });
};
var getProjectDefinitions = /* @__PURE__ */ bind8(readAppPreferences)(function(prefs) {
  return bind8($$for2(prefs.solutions)(function(fp) {
    return map20(function(v) {
      return new Tuple(fp, v);
    })(readSolutionDefinition(fp));
  }))(function(projects) {
    return pure9(new GetPureScriptSolutionDefinitionsResponse(projects));
  });
});
var getInstalledTools = /* @__PURE__ */ function() {
  return map20(GetInstalledToolsResponse.create)(maybe(pure9(UnsupportedOperatingSystem.value))(map20(ToolsResult.create))(mapFlipped(functorMaybe)(operatingSystem\u0294)(getToolsWithPaths)));
}();
var handleMessageToMain = function(window) {
  return function(incomingChannel) {
    return bind8(function() {
      if (incomingChannel instanceof ShowFolderSelectorChannel) {
        return map20(Just.create)(showFolderSelector(window));
      }
      ;
      if (incomingChannel instanceof ShowOpenDialogChannel) {
        return map20(Just.create)(showOpenDialog2(window));
      }
      ;
      if (incomingChannel instanceof GetInstalledToolsChannel) {
        return map20(Just.create)(getInstalledTools);
      }
      ;
      if (incomingChannel instanceof GetPureScriptSolutionDefinitionsChannel) {
        return map20(Just.create)(getProjectDefinitions);
      }
      ;
      throw new Error("Failed pattern match at Biz.IPC.MessageToMainHandler (line 33, column 15 - line 37, column 77): " + [incomingChannel.constructor.name]);
    }())(function(response\u0294) {
      return liftEffect6(for_2(response\u0294)(function(v) {
        return sendToWebContents2(v)(mainToRendererChannelName(messageToRendererToChannel(v)))(window);
      }));
    });
  };
};

// output/Web.Event.EventTarget/foreign.js
function eventListener(fn) {
  return function() {
    return function(event) {
      return fn(event)();
    };
  };
}

// output/Backend.IPC.Handler/index.js
var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorArray);
var enumFromTo3 = /* @__PURE__ */ enumFromTo(enumRendererToMainChannel)(unfoldable1Array);
var bottom5 = /* @__PURE__ */ bottom(boundedRendererToMainChan);
var top5 = /* @__PURE__ */ top(boundedRendererToMainChan);
var for_3 = /* @__PURE__ */ for_(applicativeEffect)(foldableArray);
var registerHandler = function(channel) {
  return function(handle) {
    return function __do() {
      var listener = eventListener($$const(launchAff_(handle)))();
      return onIPCMainMessage(listener)(rendererToMainChannelName(channel))();
    };
  };
};
var registerAllHandlers = function(window) {
  var allHandlers = mapFlipped2(enumFromTo3(bottom5)(top5))(function(channel) {
    var handler = handleMessageToMain(window)(channel);
    return new Tuple(channel, handler);
  });
  return for_3(allHandlers)(uncurry(registerHandler));
};

// output/Main/index.js
var discard4 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var bind9 = /* @__PURE__ */ bind(bindAff);
var liftEffect7 = /* @__PURE__ */ liftEffect(monadEffectAff);
var mkOptions = /* @__PURE__ */ map(functorEffect)(function(v) {
  return {
    width: 800,
    height: 600,
    webPreferences: {
      preload: concat5([v, "preload.js"]),
      nodeIntegration: false,
      enableRemoteModule: false,
      contextIsolation: true,
      sandbox: true
    }
  };
})(dirnameImpl);
var main = /* @__PURE__ */ launchAff_(/* @__PURE__ */ discard4(waitUntilAppReady)(function() {
  return bind9(liftEffect7(mkOptions))(function(options) {
    return bind9(liftEffect7(newBrowserWindow(options)))(function(window) {
      return discard4(liftEffect7(setWindowOpenHandlerToExternal(window)))(function() {
        return discard4(liftEffect7(registerAllHandlers(window)))(function() {
          return loadFile("index.html")(window);
        });
      });
    });
  });
}));

// main.mjs
main();
