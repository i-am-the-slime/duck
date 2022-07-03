var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod3) => function __require() {
  return mod3 || (0, cb[__getOwnPropNames(cb)[0]])((mod3 = { exports: {} }).exports, mod3), mod3.exports;
};
var __copyProps = (to2, from3, except2, desc) => {
  if (from3 && typeof from3 === "object" || typeof from3 === "function") {
    for (let key of __getOwnPropNames(from3))
      if (!__hasOwnProp.call(to2, key) && key !== except2)
        __defProp(to2, key, { get: () => from3[key], enumerable: !(desc = __getOwnPropDesc(from3, key)) || desc.enumerable });
  }
  return to2;
};
var __toESM = (mod3, isNodeMode, target) => (target = mod3 != null ? __create(__getProtoOf(mod3)) : {}, __copyProps(isNodeMode || !mod3 || !mod3.__esModule ? __defProp(target, "default", { value: mod3, enumerable: true }) : target, mod3));

// node_modules/webidl-conversions/lib/index.js
var require_lib = __commonJS({
  "node_modules/webidl-conversions/lib/index.js"(exports, module2) {
    "use strict";
    var conversions = {};
    module2.exports = conversions;
    function sign2(x) {
      return x < 0 ? -1 : 1;
    }
    function evenRound(x) {
      if (x % 1 === 0.5 && (x & 1) === 0) {
        return Math.floor(x);
      } else {
        return Math.round(x);
      }
    }
    function createNumberConversion(bitLength, typeOpts) {
      if (!typeOpts.unsigned) {
        --bitLength;
      }
      const lowerBound = typeOpts.unsigned ? 0 : -Math.pow(2, bitLength);
      const upperBound = Math.pow(2, bitLength) - 1;
      const moduloVal = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength) : Math.pow(2, bitLength);
      const moduloBound = typeOpts.moduloBitLength ? Math.pow(2, typeOpts.moduloBitLength - 1) : Math.pow(2, bitLength - 1);
      return function(V, opts) {
        if (!opts)
          opts = {};
        let x = +V;
        if (opts.enforceRange) {
          if (!Number.isFinite(x)) {
            throw new TypeError("Argument is not a finite number");
          }
          x = sign2(x) * Math.floor(Math.abs(x));
          if (x < lowerBound || x > upperBound) {
            throw new TypeError("Argument is not in byte range");
          }
          return x;
        }
        if (!isNaN(x) && opts.clamp) {
          x = evenRound(x);
          if (x < lowerBound)
            x = lowerBound;
          if (x > upperBound)
            x = upperBound;
          return x;
        }
        if (!Number.isFinite(x) || x === 0) {
          return 0;
        }
        x = sign2(x) * Math.floor(Math.abs(x));
        x = x % moduloVal;
        if (!typeOpts.unsigned && x >= moduloBound) {
          return x - moduloVal;
        } else if (typeOpts.unsigned) {
          if (x < 0) {
            x += moduloVal;
          } else if (x === -0) {
            return 0;
          }
        }
        return x;
      };
    }
    conversions["void"] = function() {
      return void 0;
    };
    conversions["boolean"] = function(val) {
      return !!val;
    };
    conversions["byte"] = createNumberConversion(8, { unsigned: false });
    conversions["octet"] = createNumberConversion(8, { unsigned: true });
    conversions["short"] = createNumberConversion(16, { unsigned: false });
    conversions["unsigned short"] = createNumberConversion(16, { unsigned: true });
    conversions["long"] = createNumberConversion(32, { unsigned: false });
    conversions["unsigned long"] = createNumberConversion(32, { unsigned: true });
    conversions["long long"] = createNumberConversion(32, { unsigned: false, moduloBitLength: 64 });
    conversions["unsigned long long"] = createNumberConversion(32, { unsigned: true, moduloBitLength: 64 });
    conversions["double"] = function(V) {
      const x = +V;
      if (!Number.isFinite(x)) {
        throw new TypeError("Argument is not a finite floating-point value");
      }
      return x;
    };
    conversions["unrestricted double"] = function(V) {
      const x = +V;
      if (isNaN(x)) {
        throw new TypeError("Argument is NaN");
      }
      return x;
    };
    conversions["float"] = conversions["double"];
    conversions["unrestricted float"] = conversions["unrestricted double"];
    conversions["DOMString"] = function(V, opts) {
      if (!opts)
        opts = {};
      if (opts.treatNullAsEmptyString && V === null) {
        return "";
      }
      return String(V);
    };
    conversions["ByteString"] = function(V, opts) {
      const x = String(V);
      let c = void 0;
      for (let i = 0; (c = x.codePointAt(i)) !== void 0; ++i) {
        if (c > 255) {
          throw new TypeError("Argument is not a valid bytestring");
        }
      }
      return x;
    };
    conversions["USVString"] = function(V) {
      const S = String(V);
      const n = S.length;
      const U = [];
      for (let i = 0; i < n; ++i) {
        const c = S.charCodeAt(i);
        if (c < 55296 || c > 57343) {
          U.push(String.fromCodePoint(c));
        } else if (56320 <= c && c <= 57343) {
          U.push(String.fromCodePoint(65533));
        } else {
          if (i === n - 1) {
            U.push(String.fromCodePoint(65533));
          } else {
            const d = S.charCodeAt(i + 1);
            if (56320 <= d && d <= 57343) {
              const a = c & 1023;
              const b = d & 1023;
              U.push(String.fromCodePoint((2 << 15) + (2 << 9) * a + b));
              ++i;
            } else {
              U.push(String.fromCodePoint(65533));
            }
          }
        }
      }
      return U.join("");
    };
    conversions["Date"] = function(V, opts) {
      if (!(V instanceof Date)) {
        throw new TypeError("Argument is not a Date object");
      }
      if (isNaN(V)) {
        return void 0;
      }
      return V;
    };
    conversions["RegExp"] = function(V, opts) {
      if (!(V instanceof RegExp)) {
        V = new RegExp(V);
      }
      return V;
    };
  }
});

// node_modules/whatwg-url/lib/utils.js
var require_utils = __commonJS({
  "node_modules/whatwg-url/lib/utils.js"(exports, module2) {
    "use strict";
    module2.exports.mixin = function mixin(target, source2) {
      const keys2 = Object.getOwnPropertyNames(source2);
      for (let i = 0; i < keys2.length; ++i) {
        Object.defineProperty(target, keys2[i], Object.getOwnPropertyDescriptor(source2, keys2[i]));
      }
    };
    module2.exports.wrapperSymbol = Symbol("wrapper");
    module2.exports.implSymbol = Symbol("impl");
    module2.exports.wrapperForImpl = function(impl) {
      return impl[module2.exports.wrapperSymbol];
    };
    module2.exports.implForWrapper = function(wrapper) {
      return wrapper[module2.exports.implSymbol];
    };
  }
});

// node_modules/tr46/lib/mappingTable.json
var require_mappingTable = __commonJS({
  "node_modules/tr46/lib/mappingTable.json"(exports, module2) {
    module2.exports = [[[0, 44], "disallowed_STD3_valid"], [[45, 46], "valid"], [[47, 47], "disallowed_STD3_valid"], [[48, 57], "valid"], [[58, 64], "disallowed_STD3_valid"], [[65, 65], "mapped", [97]], [[66, 66], "mapped", [98]], [[67, 67], "mapped", [99]], [[68, 68], "mapped", [100]], [[69, 69], "mapped", [101]], [[70, 70], "mapped", [102]], [[71, 71], "mapped", [103]], [[72, 72], "mapped", [104]], [[73, 73], "mapped", [105]], [[74, 74], "mapped", [106]], [[75, 75], "mapped", [107]], [[76, 76], "mapped", [108]], [[77, 77], "mapped", [109]], [[78, 78], "mapped", [110]], [[79, 79], "mapped", [111]], [[80, 80], "mapped", [112]], [[81, 81], "mapped", [113]], [[82, 82], "mapped", [114]], [[83, 83], "mapped", [115]], [[84, 84], "mapped", [116]], [[85, 85], "mapped", [117]], [[86, 86], "mapped", [118]], [[87, 87], "mapped", [119]], [[88, 88], "mapped", [120]], [[89, 89], "mapped", [121]], [[90, 90], "mapped", [122]], [[91, 96], "disallowed_STD3_valid"], [[97, 122], "valid"], [[123, 127], "disallowed_STD3_valid"], [[128, 159], "disallowed"], [[160, 160], "disallowed_STD3_mapped", [32]], [[161, 167], "valid", [], "NV8"], [[168, 168], "disallowed_STD3_mapped", [32, 776]], [[169, 169], "valid", [], "NV8"], [[170, 170], "mapped", [97]], [[171, 172], "valid", [], "NV8"], [[173, 173], "ignored"], [[174, 174], "valid", [], "NV8"], [[175, 175], "disallowed_STD3_mapped", [32, 772]], [[176, 177], "valid", [], "NV8"], [[178, 178], "mapped", [50]], [[179, 179], "mapped", [51]], [[180, 180], "disallowed_STD3_mapped", [32, 769]], [[181, 181], "mapped", [956]], [[182, 182], "valid", [], "NV8"], [[183, 183], "valid"], [[184, 184], "disallowed_STD3_mapped", [32, 807]], [[185, 185], "mapped", [49]], [[186, 186], "mapped", [111]], [[187, 187], "valid", [], "NV8"], [[188, 188], "mapped", [49, 8260, 52]], [[189, 189], "mapped", [49, 8260, 50]], [[190, 190], "mapped", [51, 8260, 52]], [[191, 191], "valid", [], "NV8"], [[192, 192], "mapped", [224]], [[193, 193], "mapped", [225]], [[194, 194], "mapped", [226]], [[195, 195], "mapped", [227]], [[196, 196], "mapped", [228]], [[197, 197], "mapped", [229]], [[198, 198], "mapped", [230]], [[199, 199], "mapped", [231]], [[200, 200], "mapped", [232]], [[201, 201], "mapped", [233]], [[202, 202], "mapped", [234]], [[203, 203], "mapped", [235]], [[204, 204], "mapped", [236]], [[205, 205], "mapped", [237]], [[206, 206], "mapped", [238]], [[207, 207], "mapped", [239]], [[208, 208], "mapped", [240]], [[209, 209], "mapped", [241]], [[210, 210], "mapped", [242]], [[211, 211], "mapped", [243]], [[212, 212], "mapped", [244]], [[213, 213], "mapped", [245]], [[214, 214], "mapped", [246]], [[215, 215], "valid", [], "NV8"], [[216, 216], "mapped", [248]], [[217, 217], "mapped", [249]], [[218, 218], "mapped", [250]], [[219, 219], "mapped", [251]], [[220, 220], "mapped", [252]], [[221, 221], "mapped", [253]], [[222, 222], "mapped", [254]], [[223, 223], "deviation", [115, 115]], [[224, 246], "valid"], [[247, 247], "valid", [], "NV8"], [[248, 255], "valid"], [[256, 256], "mapped", [257]], [[257, 257], "valid"], [[258, 258], "mapped", [259]], [[259, 259], "valid"], [[260, 260], "mapped", [261]], [[261, 261], "valid"], [[262, 262], "mapped", [263]], [[263, 263], "valid"], [[264, 264], "mapped", [265]], [[265, 265], "valid"], [[266, 266], "mapped", [267]], [[267, 267], "valid"], [[268, 268], "mapped", [269]], [[269, 269], "valid"], [[270, 270], "mapped", [271]], [[271, 271], "valid"], [[272, 272], "mapped", [273]], [[273, 273], "valid"], [[274, 274], "mapped", [275]], [[275, 275], "valid"], [[276, 276], "mapped", [277]], [[277, 277], "valid"], [[278, 278], "mapped", [279]], [[279, 279], "valid"], [[280, 280], "mapped", [281]], [[281, 281], "valid"], [[282, 282], "mapped", [283]], [[283, 283], "valid"], [[284, 284], "mapped", [285]], [[285, 285], "valid"], [[286, 286], "mapped", [287]], [[287, 287], "valid"], [[288, 288], "mapped", [289]], [[289, 289], "valid"], [[290, 290], "mapped", [291]], [[291, 291], "valid"], [[292, 292], "mapped", [293]], [[293, 293], "valid"], [[294, 294], "mapped", [295]], [[295, 295], "valid"], [[296, 296], "mapped", [297]], [[297, 297], "valid"], [[298, 298], "mapped", [299]], [[299, 299], "valid"], [[300, 300], "mapped", [301]], [[301, 301], "valid"], [[302, 302], "mapped", [303]], [[303, 303], "valid"], [[304, 304], "mapped", [105, 775]], [[305, 305], "valid"], [[306, 307], "mapped", [105, 106]], [[308, 308], "mapped", [309]], [[309, 309], "valid"], [[310, 310], "mapped", [311]], [[311, 312], "valid"], [[313, 313], "mapped", [314]], [[314, 314], "valid"], [[315, 315], "mapped", [316]], [[316, 316], "valid"], [[317, 317], "mapped", [318]], [[318, 318], "valid"], [[319, 320], "mapped", [108, 183]], [[321, 321], "mapped", [322]], [[322, 322], "valid"], [[323, 323], "mapped", [324]], [[324, 324], "valid"], [[325, 325], "mapped", [326]], [[326, 326], "valid"], [[327, 327], "mapped", [328]], [[328, 328], "valid"], [[329, 329], "mapped", [700, 110]], [[330, 330], "mapped", [331]], [[331, 331], "valid"], [[332, 332], "mapped", [333]], [[333, 333], "valid"], [[334, 334], "mapped", [335]], [[335, 335], "valid"], [[336, 336], "mapped", [337]], [[337, 337], "valid"], [[338, 338], "mapped", [339]], [[339, 339], "valid"], [[340, 340], "mapped", [341]], [[341, 341], "valid"], [[342, 342], "mapped", [343]], [[343, 343], "valid"], [[344, 344], "mapped", [345]], [[345, 345], "valid"], [[346, 346], "mapped", [347]], [[347, 347], "valid"], [[348, 348], "mapped", [349]], [[349, 349], "valid"], [[350, 350], "mapped", [351]], [[351, 351], "valid"], [[352, 352], "mapped", [353]], [[353, 353], "valid"], [[354, 354], "mapped", [355]], [[355, 355], "valid"], [[356, 356], "mapped", [357]], [[357, 357], "valid"], [[358, 358], "mapped", [359]], [[359, 359], "valid"], [[360, 360], "mapped", [361]], [[361, 361], "valid"], [[362, 362], "mapped", [363]], [[363, 363], "valid"], [[364, 364], "mapped", [365]], [[365, 365], "valid"], [[366, 366], "mapped", [367]], [[367, 367], "valid"], [[368, 368], "mapped", [369]], [[369, 369], "valid"], [[370, 370], "mapped", [371]], [[371, 371], "valid"], [[372, 372], "mapped", [373]], [[373, 373], "valid"], [[374, 374], "mapped", [375]], [[375, 375], "valid"], [[376, 376], "mapped", [255]], [[377, 377], "mapped", [378]], [[378, 378], "valid"], [[379, 379], "mapped", [380]], [[380, 380], "valid"], [[381, 381], "mapped", [382]], [[382, 382], "valid"], [[383, 383], "mapped", [115]], [[384, 384], "valid"], [[385, 385], "mapped", [595]], [[386, 386], "mapped", [387]], [[387, 387], "valid"], [[388, 388], "mapped", [389]], [[389, 389], "valid"], [[390, 390], "mapped", [596]], [[391, 391], "mapped", [392]], [[392, 392], "valid"], [[393, 393], "mapped", [598]], [[394, 394], "mapped", [599]], [[395, 395], "mapped", [396]], [[396, 397], "valid"], [[398, 398], "mapped", [477]], [[399, 399], "mapped", [601]], [[400, 400], "mapped", [603]], [[401, 401], "mapped", [402]], [[402, 402], "valid"], [[403, 403], "mapped", [608]], [[404, 404], "mapped", [611]], [[405, 405], "valid"], [[406, 406], "mapped", [617]], [[407, 407], "mapped", [616]], [[408, 408], "mapped", [409]], [[409, 411], "valid"], [[412, 412], "mapped", [623]], [[413, 413], "mapped", [626]], [[414, 414], "valid"], [[415, 415], "mapped", [629]], [[416, 416], "mapped", [417]], [[417, 417], "valid"], [[418, 418], "mapped", [419]], [[419, 419], "valid"], [[420, 420], "mapped", [421]], [[421, 421], "valid"], [[422, 422], "mapped", [640]], [[423, 423], "mapped", [424]], [[424, 424], "valid"], [[425, 425], "mapped", [643]], [[426, 427], "valid"], [[428, 428], "mapped", [429]], [[429, 429], "valid"], [[430, 430], "mapped", [648]], [[431, 431], "mapped", [432]], [[432, 432], "valid"], [[433, 433], "mapped", [650]], [[434, 434], "mapped", [651]], [[435, 435], "mapped", [436]], [[436, 436], "valid"], [[437, 437], "mapped", [438]], [[438, 438], "valid"], [[439, 439], "mapped", [658]], [[440, 440], "mapped", [441]], [[441, 443], "valid"], [[444, 444], "mapped", [445]], [[445, 451], "valid"], [[452, 454], "mapped", [100, 382]], [[455, 457], "mapped", [108, 106]], [[458, 460], "mapped", [110, 106]], [[461, 461], "mapped", [462]], [[462, 462], "valid"], [[463, 463], "mapped", [464]], [[464, 464], "valid"], [[465, 465], "mapped", [466]], [[466, 466], "valid"], [[467, 467], "mapped", [468]], [[468, 468], "valid"], [[469, 469], "mapped", [470]], [[470, 470], "valid"], [[471, 471], "mapped", [472]], [[472, 472], "valid"], [[473, 473], "mapped", [474]], [[474, 474], "valid"], [[475, 475], "mapped", [476]], [[476, 477], "valid"], [[478, 478], "mapped", [479]], [[479, 479], "valid"], [[480, 480], "mapped", [481]], [[481, 481], "valid"], [[482, 482], "mapped", [483]], [[483, 483], "valid"], [[484, 484], "mapped", [485]], [[485, 485], "valid"], [[486, 486], "mapped", [487]], [[487, 487], "valid"], [[488, 488], "mapped", [489]], [[489, 489], "valid"], [[490, 490], "mapped", [491]], [[491, 491], "valid"], [[492, 492], "mapped", [493]], [[493, 493], "valid"], [[494, 494], "mapped", [495]], [[495, 496], "valid"], [[497, 499], "mapped", [100, 122]], [[500, 500], "mapped", [501]], [[501, 501], "valid"], [[502, 502], "mapped", [405]], [[503, 503], "mapped", [447]], [[504, 504], "mapped", [505]], [[505, 505], "valid"], [[506, 506], "mapped", [507]], [[507, 507], "valid"], [[508, 508], "mapped", [509]], [[509, 509], "valid"], [[510, 510], "mapped", [511]], [[511, 511], "valid"], [[512, 512], "mapped", [513]], [[513, 513], "valid"], [[514, 514], "mapped", [515]], [[515, 515], "valid"], [[516, 516], "mapped", [517]], [[517, 517], "valid"], [[518, 518], "mapped", [519]], [[519, 519], "valid"], [[520, 520], "mapped", [521]], [[521, 521], "valid"], [[522, 522], "mapped", [523]], [[523, 523], "valid"], [[524, 524], "mapped", [525]], [[525, 525], "valid"], [[526, 526], "mapped", [527]], [[527, 527], "valid"], [[528, 528], "mapped", [529]], [[529, 529], "valid"], [[530, 530], "mapped", [531]], [[531, 531], "valid"], [[532, 532], "mapped", [533]], [[533, 533], "valid"], [[534, 534], "mapped", [535]], [[535, 535], "valid"], [[536, 536], "mapped", [537]], [[537, 537], "valid"], [[538, 538], "mapped", [539]], [[539, 539], "valid"], [[540, 540], "mapped", [541]], [[541, 541], "valid"], [[542, 542], "mapped", [543]], [[543, 543], "valid"], [[544, 544], "mapped", [414]], [[545, 545], "valid"], [[546, 546], "mapped", [547]], [[547, 547], "valid"], [[548, 548], "mapped", [549]], [[549, 549], "valid"], [[550, 550], "mapped", [551]], [[551, 551], "valid"], [[552, 552], "mapped", [553]], [[553, 553], "valid"], [[554, 554], "mapped", [555]], [[555, 555], "valid"], [[556, 556], "mapped", [557]], [[557, 557], "valid"], [[558, 558], "mapped", [559]], [[559, 559], "valid"], [[560, 560], "mapped", [561]], [[561, 561], "valid"], [[562, 562], "mapped", [563]], [[563, 563], "valid"], [[564, 566], "valid"], [[567, 569], "valid"], [[570, 570], "mapped", [11365]], [[571, 571], "mapped", [572]], [[572, 572], "valid"], [[573, 573], "mapped", [410]], [[574, 574], "mapped", [11366]], [[575, 576], "valid"], [[577, 577], "mapped", [578]], [[578, 578], "valid"], [[579, 579], "mapped", [384]], [[580, 580], "mapped", [649]], [[581, 581], "mapped", [652]], [[582, 582], "mapped", [583]], [[583, 583], "valid"], [[584, 584], "mapped", [585]], [[585, 585], "valid"], [[586, 586], "mapped", [587]], [[587, 587], "valid"], [[588, 588], "mapped", [589]], [[589, 589], "valid"], [[590, 590], "mapped", [591]], [[591, 591], "valid"], [[592, 680], "valid"], [[681, 685], "valid"], [[686, 687], "valid"], [[688, 688], "mapped", [104]], [[689, 689], "mapped", [614]], [[690, 690], "mapped", [106]], [[691, 691], "mapped", [114]], [[692, 692], "mapped", [633]], [[693, 693], "mapped", [635]], [[694, 694], "mapped", [641]], [[695, 695], "mapped", [119]], [[696, 696], "mapped", [121]], [[697, 705], "valid"], [[706, 709], "valid", [], "NV8"], [[710, 721], "valid"], [[722, 727], "valid", [], "NV8"], [[728, 728], "disallowed_STD3_mapped", [32, 774]], [[729, 729], "disallowed_STD3_mapped", [32, 775]], [[730, 730], "disallowed_STD3_mapped", [32, 778]], [[731, 731], "disallowed_STD3_mapped", [32, 808]], [[732, 732], "disallowed_STD3_mapped", [32, 771]], [[733, 733], "disallowed_STD3_mapped", [32, 779]], [[734, 734], "valid", [], "NV8"], [[735, 735], "valid", [], "NV8"], [[736, 736], "mapped", [611]], [[737, 737], "mapped", [108]], [[738, 738], "mapped", [115]], [[739, 739], "mapped", [120]], [[740, 740], "mapped", [661]], [[741, 745], "valid", [], "NV8"], [[746, 747], "valid", [], "NV8"], [[748, 748], "valid"], [[749, 749], "valid", [], "NV8"], [[750, 750], "valid"], [[751, 767], "valid", [], "NV8"], [[768, 831], "valid"], [[832, 832], "mapped", [768]], [[833, 833], "mapped", [769]], [[834, 834], "valid"], [[835, 835], "mapped", [787]], [[836, 836], "mapped", [776, 769]], [[837, 837], "mapped", [953]], [[838, 846], "valid"], [[847, 847], "ignored"], [[848, 855], "valid"], [[856, 860], "valid"], [[861, 863], "valid"], [[864, 865], "valid"], [[866, 866], "valid"], [[867, 879], "valid"], [[880, 880], "mapped", [881]], [[881, 881], "valid"], [[882, 882], "mapped", [883]], [[883, 883], "valid"], [[884, 884], "mapped", [697]], [[885, 885], "valid"], [[886, 886], "mapped", [887]], [[887, 887], "valid"], [[888, 889], "disallowed"], [[890, 890], "disallowed_STD3_mapped", [32, 953]], [[891, 893], "valid"], [[894, 894], "disallowed_STD3_mapped", [59]], [[895, 895], "mapped", [1011]], [[896, 899], "disallowed"], [[900, 900], "disallowed_STD3_mapped", [32, 769]], [[901, 901], "disallowed_STD3_mapped", [32, 776, 769]], [[902, 902], "mapped", [940]], [[903, 903], "mapped", [183]], [[904, 904], "mapped", [941]], [[905, 905], "mapped", [942]], [[906, 906], "mapped", [943]], [[907, 907], "disallowed"], [[908, 908], "mapped", [972]], [[909, 909], "disallowed"], [[910, 910], "mapped", [973]], [[911, 911], "mapped", [974]], [[912, 912], "valid"], [[913, 913], "mapped", [945]], [[914, 914], "mapped", [946]], [[915, 915], "mapped", [947]], [[916, 916], "mapped", [948]], [[917, 917], "mapped", [949]], [[918, 918], "mapped", [950]], [[919, 919], "mapped", [951]], [[920, 920], "mapped", [952]], [[921, 921], "mapped", [953]], [[922, 922], "mapped", [954]], [[923, 923], "mapped", [955]], [[924, 924], "mapped", [956]], [[925, 925], "mapped", [957]], [[926, 926], "mapped", [958]], [[927, 927], "mapped", [959]], [[928, 928], "mapped", [960]], [[929, 929], "mapped", [961]], [[930, 930], "disallowed"], [[931, 931], "mapped", [963]], [[932, 932], "mapped", [964]], [[933, 933], "mapped", [965]], [[934, 934], "mapped", [966]], [[935, 935], "mapped", [967]], [[936, 936], "mapped", [968]], [[937, 937], "mapped", [969]], [[938, 938], "mapped", [970]], [[939, 939], "mapped", [971]], [[940, 961], "valid"], [[962, 962], "deviation", [963]], [[963, 974], "valid"], [[975, 975], "mapped", [983]], [[976, 976], "mapped", [946]], [[977, 977], "mapped", [952]], [[978, 978], "mapped", [965]], [[979, 979], "mapped", [973]], [[980, 980], "mapped", [971]], [[981, 981], "mapped", [966]], [[982, 982], "mapped", [960]], [[983, 983], "valid"], [[984, 984], "mapped", [985]], [[985, 985], "valid"], [[986, 986], "mapped", [987]], [[987, 987], "valid"], [[988, 988], "mapped", [989]], [[989, 989], "valid"], [[990, 990], "mapped", [991]], [[991, 991], "valid"], [[992, 992], "mapped", [993]], [[993, 993], "valid"], [[994, 994], "mapped", [995]], [[995, 995], "valid"], [[996, 996], "mapped", [997]], [[997, 997], "valid"], [[998, 998], "mapped", [999]], [[999, 999], "valid"], [[1e3, 1e3], "mapped", [1001]], [[1001, 1001], "valid"], [[1002, 1002], "mapped", [1003]], [[1003, 1003], "valid"], [[1004, 1004], "mapped", [1005]], [[1005, 1005], "valid"], [[1006, 1006], "mapped", [1007]], [[1007, 1007], "valid"], [[1008, 1008], "mapped", [954]], [[1009, 1009], "mapped", [961]], [[1010, 1010], "mapped", [963]], [[1011, 1011], "valid"], [[1012, 1012], "mapped", [952]], [[1013, 1013], "mapped", [949]], [[1014, 1014], "valid", [], "NV8"], [[1015, 1015], "mapped", [1016]], [[1016, 1016], "valid"], [[1017, 1017], "mapped", [963]], [[1018, 1018], "mapped", [1019]], [[1019, 1019], "valid"], [[1020, 1020], "valid"], [[1021, 1021], "mapped", [891]], [[1022, 1022], "mapped", [892]], [[1023, 1023], "mapped", [893]], [[1024, 1024], "mapped", [1104]], [[1025, 1025], "mapped", [1105]], [[1026, 1026], "mapped", [1106]], [[1027, 1027], "mapped", [1107]], [[1028, 1028], "mapped", [1108]], [[1029, 1029], "mapped", [1109]], [[1030, 1030], "mapped", [1110]], [[1031, 1031], "mapped", [1111]], [[1032, 1032], "mapped", [1112]], [[1033, 1033], "mapped", [1113]], [[1034, 1034], "mapped", [1114]], [[1035, 1035], "mapped", [1115]], [[1036, 1036], "mapped", [1116]], [[1037, 1037], "mapped", [1117]], [[1038, 1038], "mapped", [1118]], [[1039, 1039], "mapped", [1119]], [[1040, 1040], "mapped", [1072]], [[1041, 1041], "mapped", [1073]], [[1042, 1042], "mapped", [1074]], [[1043, 1043], "mapped", [1075]], [[1044, 1044], "mapped", [1076]], [[1045, 1045], "mapped", [1077]], [[1046, 1046], "mapped", [1078]], [[1047, 1047], "mapped", [1079]], [[1048, 1048], "mapped", [1080]], [[1049, 1049], "mapped", [1081]], [[1050, 1050], "mapped", [1082]], [[1051, 1051], "mapped", [1083]], [[1052, 1052], "mapped", [1084]], [[1053, 1053], "mapped", [1085]], [[1054, 1054], "mapped", [1086]], [[1055, 1055], "mapped", [1087]], [[1056, 1056], "mapped", [1088]], [[1057, 1057], "mapped", [1089]], [[1058, 1058], "mapped", [1090]], [[1059, 1059], "mapped", [1091]], [[1060, 1060], "mapped", [1092]], [[1061, 1061], "mapped", [1093]], [[1062, 1062], "mapped", [1094]], [[1063, 1063], "mapped", [1095]], [[1064, 1064], "mapped", [1096]], [[1065, 1065], "mapped", [1097]], [[1066, 1066], "mapped", [1098]], [[1067, 1067], "mapped", [1099]], [[1068, 1068], "mapped", [1100]], [[1069, 1069], "mapped", [1101]], [[1070, 1070], "mapped", [1102]], [[1071, 1071], "mapped", [1103]], [[1072, 1103], "valid"], [[1104, 1104], "valid"], [[1105, 1116], "valid"], [[1117, 1117], "valid"], [[1118, 1119], "valid"], [[1120, 1120], "mapped", [1121]], [[1121, 1121], "valid"], [[1122, 1122], "mapped", [1123]], [[1123, 1123], "valid"], [[1124, 1124], "mapped", [1125]], [[1125, 1125], "valid"], [[1126, 1126], "mapped", [1127]], [[1127, 1127], "valid"], [[1128, 1128], "mapped", [1129]], [[1129, 1129], "valid"], [[1130, 1130], "mapped", [1131]], [[1131, 1131], "valid"], [[1132, 1132], "mapped", [1133]], [[1133, 1133], "valid"], [[1134, 1134], "mapped", [1135]], [[1135, 1135], "valid"], [[1136, 1136], "mapped", [1137]], [[1137, 1137], "valid"], [[1138, 1138], "mapped", [1139]], [[1139, 1139], "valid"], [[1140, 1140], "mapped", [1141]], [[1141, 1141], "valid"], [[1142, 1142], "mapped", [1143]], [[1143, 1143], "valid"], [[1144, 1144], "mapped", [1145]], [[1145, 1145], "valid"], [[1146, 1146], "mapped", [1147]], [[1147, 1147], "valid"], [[1148, 1148], "mapped", [1149]], [[1149, 1149], "valid"], [[1150, 1150], "mapped", [1151]], [[1151, 1151], "valid"], [[1152, 1152], "mapped", [1153]], [[1153, 1153], "valid"], [[1154, 1154], "valid", [], "NV8"], [[1155, 1158], "valid"], [[1159, 1159], "valid"], [[1160, 1161], "valid", [], "NV8"], [[1162, 1162], "mapped", [1163]], [[1163, 1163], "valid"], [[1164, 1164], "mapped", [1165]], [[1165, 1165], "valid"], [[1166, 1166], "mapped", [1167]], [[1167, 1167], "valid"], [[1168, 1168], "mapped", [1169]], [[1169, 1169], "valid"], [[1170, 1170], "mapped", [1171]], [[1171, 1171], "valid"], [[1172, 1172], "mapped", [1173]], [[1173, 1173], "valid"], [[1174, 1174], "mapped", [1175]], [[1175, 1175], "valid"], [[1176, 1176], "mapped", [1177]], [[1177, 1177], "valid"], [[1178, 1178], "mapped", [1179]], [[1179, 1179], "valid"], [[1180, 1180], "mapped", [1181]], [[1181, 1181], "valid"], [[1182, 1182], "mapped", [1183]], [[1183, 1183], "valid"], [[1184, 1184], "mapped", [1185]], [[1185, 1185], "valid"], [[1186, 1186], "mapped", [1187]], [[1187, 1187], "valid"], [[1188, 1188], "mapped", [1189]], [[1189, 1189], "valid"], [[1190, 1190], "mapped", [1191]], [[1191, 1191], "valid"], [[1192, 1192], "mapped", [1193]], [[1193, 1193], "valid"], [[1194, 1194], "mapped", [1195]], [[1195, 1195], "valid"], [[1196, 1196], "mapped", [1197]], [[1197, 1197], "valid"], [[1198, 1198], "mapped", [1199]], [[1199, 1199], "valid"], [[1200, 1200], "mapped", [1201]], [[1201, 1201], "valid"], [[1202, 1202], "mapped", [1203]], [[1203, 1203], "valid"], [[1204, 1204], "mapped", [1205]], [[1205, 1205], "valid"], [[1206, 1206], "mapped", [1207]], [[1207, 1207], "valid"], [[1208, 1208], "mapped", [1209]], [[1209, 1209], "valid"], [[1210, 1210], "mapped", [1211]], [[1211, 1211], "valid"], [[1212, 1212], "mapped", [1213]], [[1213, 1213], "valid"], [[1214, 1214], "mapped", [1215]], [[1215, 1215], "valid"], [[1216, 1216], "disallowed"], [[1217, 1217], "mapped", [1218]], [[1218, 1218], "valid"], [[1219, 1219], "mapped", [1220]], [[1220, 1220], "valid"], [[1221, 1221], "mapped", [1222]], [[1222, 1222], "valid"], [[1223, 1223], "mapped", [1224]], [[1224, 1224], "valid"], [[1225, 1225], "mapped", [1226]], [[1226, 1226], "valid"], [[1227, 1227], "mapped", [1228]], [[1228, 1228], "valid"], [[1229, 1229], "mapped", [1230]], [[1230, 1230], "valid"], [[1231, 1231], "valid"], [[1232, 1232], "mapped", [1233]], [[1233, 1233], "valid"], [[1234, 1234], "mapped", [1235]], [[1235, 1235], "valid"], [[1236, 1236], "mapped", [1237]], [[1237, 1237], "valid"], [[1238, 1238], "mapped", [1239]], [[1239, 1239], "valid"], [[1240, 1240], "mapped", [1241]], [[1241, 1241], "valid"], [[1242, 1242], "mapped", [1243]], [[1243, 1243], "valid"], [[1244, 1244], "mapped", [1245]], [[1245, 1245], "valid"], [[1246, 1246], "mapped", [1247]], [[1247, 1247], "valid"], [[1248, 1248], "mapped", [1249]], [[1249, 1249], "valid"], [[1250, 1250], "mapped", [1251]], [[1251, 1251], "valid"], [[1252, 1252], "mapped", [1253]], [[1253, 1253], "valid"], [[1254, 1254], "mapped", [1255]], [[1255, 1255], "valid"], [[1256, 1256], "mapped", [1257]], [[1257, 1257], "valid"], [[1258, 1258], "mapped", [1259]], [[1259, 1259], "valid"], [[1260, 1260], "mapped", [1261]], [[1261, 1261], "valid"], [[1262, 1262], "mapped", [1263]], [[1263, 1263], "valid"], [[1264, 1264], "mapped", [1265]], [[1265, 1265], "valid"], [[1266, 1266], "mapped", [1267]], [[1267, 1267], "valid"], [[1268, 1268], "mapped", [1269]], [[1269, 1269], "valid"], [[1270, 1270], "mapped", [1271]], [[1271, 1271], "valid"], [[1272, 1272], "mapped", [1273]], [[1273, 1273], "valid"], [[1274, 1274], "mapped", [1275]], [[1275, 1275], "valid"], [[1276, 1276], "mapped", [1277]], [[1277, 1277], "valid"], [[1278, 1278], "mapped", [1279]], [[1279, 1279], "valid"], [[1280, 1280], "mapped", [1281]], [[1281, 1281], "valid"], [[1282, 1282], "mapped", [1283]], [[1283, 1283], "valid"], [[1284, 1284], "mapped", [1285]], [[1285, 1285], "valid"], [[1286, 1286], "mapped", [1287]], [[1287, 1287], "valid"], [[1288, 1288], "mapped", [1289]], [[1289, 1289], "valid"], [[1290, 1290], "mapped", [1291]], [[1291, 1291], "valid"], [[1292, 1292], "mapped", [1293]], [[1293, 1293], "valid"], [[1294, 1294], "mapped", [1295]], [[1295, 1295], "valid"], [[1296, 1296], "mapped", [1297]], [[1297, 1297], "valid"], [[1298, 1298], "mapped", [1299]], [[1299, 1299], "valid"], [[1300, 1300], "mapped", [1301]], [[1301, 1301], "valid"], [[1302, 1302], "mapped", [1303]], [[1303, 1303], "valid"], [[1304, 1304], "mapped", [1305]], [[1305, 1305], "valid"], [[1306, 1306], "mapped", [1307]], [[1307, 1307], "valid"], [[1308, 1308], "mapped", [1309]], [[1309, 1309], "valid"], [[1310, 1310], "mapped", [1311]], [[1311, 1311], "valid"], [[1312, 1312], "mapped", [1313]], [[1313, 1313], "valid"], [[1314, 1314], "mapped", [1315]], [[1315, 1315], "valid"], [[1316, 1316], "mapped", [1317]], [[1317, 1317], "valid"], [[1318, 1318], "mapped", [1319]], [[1319, 1319], "valid"], [[1320, 1320], "mapped", [1321]], [[1321, 1321], "valid"], [[1322, 1322], "mapped", [1323]], [[1323, 1323], "valid"], [[1324, 1324], "mapped", [1325]], [[1325, 1325], "valid"], [[1326, 1326], "mapped", [1327]], [[1327, 1327], "valid"], [[1328, 1328], "disallowed"], [[1329, 1329], "mapped", [1377]], [[1330, 1330], "mapped", [1378]], [[1331, 1331], "mapped", [1379]], [[1332, 1332], "mapped", [1380]], [[1333, 1333], "mapped", [1381]], [[1334, 1334], "mapped", [1382]], [[1335, 1335], "mapped", [1383]], [[1336, 1336], "mapped", [1384]], [[1337, 1337], "mapped", [1385]], [[1338, 1338], "mapped", [1386]], [[1339, 1339], "mapped", [1387]], [[1340, 1340], "mapped", [1388]], [[1341, 1341], "mapped", [1389]], [[1342, 1342], "mapped", [1390]], [[1343, 1343], "mapped", [1391]], [[1344, 1344], "mapped", [1392]], [[1345, 1345], "mapped", [1393]], [[1346, 1346], "mapped", [1394]], [[1347, 1347], "mapped", [1395]], [[1348, 1348], "mapped", [1396]], [[1349, 1349], "mapped", [1397]], [[1350, 1350], "mapped", [1398]], [[1351, 1351], "mapped", [1399]], [[1352, 1352], "mapped", [1400]], [[1353, 1353], "mapped", [1401]], [[1354, 1354], "mapped", [1402]], [[1355, 1355], "mapped", [1403]], [[1356, 1356], "mapped", [1404]], [[1357, 1357], "mapped", [1405]], [[1358, 1358], "mapped", [1406]], [[1359, 1359], "mapped", [1407]], [[1360, 1360], "mapped", [1408]], [[1361, 1361], "mapped", [1409]], [[1362, 1362], "mapped", [1410]], [[1363, 1363], "mapped", [1411]], [[1364, 1364], "mapped", [1412]], [[1365, 1365], "mapped", [1413]], [[1366, 1366], "mapped", [1414]], [[1367, 1368], "disallowed"], [[1369, 1369], "valid"], [[1370, 1375], "valid", [], "NV8"], [[1376, 1376], "disallowed"], [[1377, 1414], "valid"], [[1415, 1415], "mapped", [1381, 1410]], [[1416, 1416], "disallowed"], [[1417, 1417], "valid", [], "NV8"], [[1418, 1418], "valid", [], "NV8"], [[1419, 1420], "disallowed"], [[1421, 1422], "valid", [], "NV8"], [[1423, 1423], "valid", [], "NV8"], [[1424, 1424], "disallowed"], [[1425, 1441], "valid"], [[1442, 1442], "valid"], [[1443, 1455], "valid"], [[1456, 1465], "valid"], [[1466, 1466], "valid"], [[1467, 1469], "valid"], [[1470, 1470], "valid", [], "NV8"], [[1471, 1471], "valid"], [[1472, 1472], "valid", [], "NV8"], [[1473, 1474], "valid"], [[1475, 1475], "valid", [], "NV8"], [[1476, 1476], "valid"], [[1477, 1477], "valid"], [[1478, 1478], "valid", [], "NV8"], [[1479, 1479], "valid"], [[1480, 1487], "disallowed"], [[1488, 1514], "valid"], [[1515, 1519], "disallowed"], [[1520, 1524], "valid"], [[1525, 1535], "disallowed"], [[1536, 1539], "disallowed"], [[1540, 1540], "disallowed"], [[1541, 1541], "disallowed"], [[1542, 1546], "valid", [], "NV8"], [[1547, 1547], "valid", [], "NV8"], [[1548, 1548], "valid", [], "NV8"], [[1549, 1551], "valid", [], "NV8"], [[1552, 1557], "valid"], [[1558, 1562], "valid"], [[1563, 1563], "valid", [], "NV8"], [[1564, 1564], "disallowed"], [[1565, 1565], "disallowed"], [[1566, 1566], "valid", [], "NV8"], [[1567, 1567], "valid", [], "NV8"], [[1568, 1568], "valid"], [[1569, 1594], "valid"], [[1595, 1599], "valid"], [[1600, 1600], "valid", [], "NV8"], [[1601, 1618], "valid"], [[1619, 1621], "valid"], [[1622, 1624], "valid"], [[1625, 1630], "valid"], [[1631, 1631], "valid"], [[1632, 1641], "valid"], [[1642, 1645], "valid", [], "NV8"], [[1646, 1647], "valid"], [[1648, 1652], "valid"], [[1653, 1653], "mapped", [1575, 1652]], [[1654, 1654], "mapped", [1608, 1652]], [[1655, 1655], "mapped", [1735, 1652]], [[1656, 1656], "mapped", [1610, 1652]], [[1657, 1719], "valid"], [[1720, 1721], "valid"], [[1722, 1726], "valid"], [[1727, 1727], "valid"], [[1728, 1742], "valid"], [[1743, 1743], "valid"], [[1744, 1747], "valid"], [[1748, 1748], "valid", [], "NV8"], [[1749, 1756], "valid"], [[1757, 1757], "disallowed"], [[1758, 1758], "valid", [], "NV8"], [[1759, 1768], "valid"], [[1769, 1769], "valid", [], "NV8"], [[1770, 1773], "valid"], [[1774, 1775], "valid"], [[1776, 1785], "valid"], [[1786, 1790], "valid"], [[1791, 1791], "valid"], [[1792, 1805], "valid", [], "NV8"], [[1806, 1806], "disallowed"], [[1807, 1807], "disallowed"], [[1808, 1836], "valid"], [[1837, 1839], "valid"], [[1840, 1866], "valid"], [[1867, 1868], "disallowed"], [[1869, 1871], "valid"], [[1872, 1901], "valid"], [[1902, 1919], "valid"], [[1920, 1968], "valid"], [[1969, 1969], "valid"], [[1970, 1983], "disallowed"], [[1984, 2037], "valid"], [[2038, 2042], "valid", [], "NV8"], [[2043, 2047], "disallowed"], [[2048, 2093], "valid"], [[2094, 2095], "disallowed"], [[2096, 2110], "valid", [], "NV8"], [[2111, 2111], "disallowed"], [[2112, 2139], "valid"], [[2140, 2141], "disallowed"], [[2142, 2142], "valid", [], "NV8"], [[2143, 2207], "disallowed"], [[2208, 2208], "valid"], [[2209, 2209], "valid"], [[2210, 2220], "valid"], [[2221, 2226], "valid"], [[2227, 2228], "valid"], [[2229, 2274], "disallowed"], [[2275, 2275], "valid"], [[2276, 2302], "valid"], [[2303, 2303], "valid"], [[2304, 2304], "valid"], [[2305, 2307], "valid"], [[2308, 2308], "valid"], [[2309, 2361], "valid"], [[2362, 2363], "valid"], [[2364, 2381], "valid"], [[2382, 2382], "valid"], [[2383, 2383], "valid"], [[2384, 2388], "valid"], [[2389, 2389], "valid"], [[2390, 2391], "valid"], [[2392, 2392], "mapped", [2325, 2364]], [[2393, 2393], "mapped", [2326, 2364]], [[2394, 2394], "mapped", [2327, 2364]], [[2395, 2395], "mapped", [2332, 2364]], [[2396, 2396], "mapped", [2337, 2364]], [[2397, 2397], "mapped", [2338, 2364]], [[2398, 2398], "mapped", [2347, 2364]], [[2399, 2399], "mapped", [2351, 2364]], [[2400, 2403], "valid"], [[2404, 2405], "valid", [], "NV8"], [[2406, 2415], "valid"], [[2416, 2416], "valid", [], "NV8"], [[2417, 2418], "valid"], [[2419, 2423], "valid"], [[2424, 2424], "valid"], [[2425, 2426], "valid"], [[2427, 2428], "valid"], [[2429, 2429], "valid"], [[2430, 2431], "valid"], [[2432, 2432], "valid"], [[2433, 2435], "valid"], [[2436, 2436], "disallowed"], [[2437, 2444], "valid"], [[2445, 2446], "disallowed"], [[2447, 2448], "valid"], [[2449, 2450], "disallowed"], [[2451, 2472], "valid"], [[2473, 2473], "disallowed"], [[2474, 2480], "valid"], [[2481, 2481], "disallowed"], [[2482, 2482], "valid"], [[2483, 2485], "disallowed"], [[2486, 2489], "valid"], [[2490, 2491], "disallowed"], [[2492, 2492], "valid"], [[2493, 2493], "valid"], [[2494, 2500], "valid"], [[2501, 2502], "disallowed"], [[2503, 2504], "valid"], [[2505, 2506], "disallowed"], [[2507, 2509], "valid"], [[2510, 2510], "valid"], [[2511, 2518], "disallowed"], [[2519, 2519], "valid"], [[2520, 2523], "disallowed"], [[2524, 2524], "mapped", [2465, 2492]], [[2525, 2525], "mapped", [2466, 2492]], [[2526, 2526], "disallowed"], [[2527, 2527], "mapped", [2479, 2492]], [[2528, 2531], "valid"], [[2532, 2533], "disallowed"], [[2534, 2545], "valid"], [[2546, 2554], "valid", [], "NV8"], [[2555, 2555], "valid", [], "NV8"], [[2556, 2560], "disallowed"], [[2561, 2561], "valid"], [[2562, 2562], "valid"], [[2563, 2563], "valid"], [[2564, 2564], "disallowed"], [[2565, 2570], "valid"], [[2571, 2574], "disallowed"], [[2575, 2576], "valid"], [[2577, 2578], "disallowed"], [[2579, 2600], "valid"], [[2601, 2601], "disallowed"], [[2602, 2608], "valid"], [[2609, 2609], "disallowed"], [[2610, 2610], "valid"], [[2611, 2611], "mapped", [2610, 2620]], [[2612, 2612], "disallowed"], [[2613, 2613], "valid"], [[2614, 2614], "mapped", [2616, 2620]], [[2615, 2615], "disallowed"], [[2616, 2617], "valid"], [[2618, 2619], "disallowed"], [[2620, 2620], "valid"], [[2621, 2621], "disallowed"], [[2622, 2626], "valid"], [[2627, 2630], "disallowed"], [[2631, 2632], "valid"], [[2633, 2634], "disallowed"], [[2635, 2637], "valid"], [[2638, 2640], "disallowed"], [[2641, 2641], "valid"], [[2642, 2648], "disallowed"], [[2649, 2649], "mapped", [2582, 2620]], [[2650, 2650], "mapped", [2583, 2620]], [[2651, 2651], "mapped", [2588, 2620]], [[2652, 2652], "valid"], [[2653, 2653], "disallowed"], [[2654, 2654], "mapped", [2603, 2620]], [[2655, 2661], "disallowed"], [[2662, 2676], "valid"], [[2677, 2677], "valid"], [[2678, 2688], "disallowed"], [[2689, 2691], "valid"], [[2692, 2692], "disallowed"], [[2693, 2699], "valid"], [[2700, 2700], "valid"], [[2701, 2701], "valid"], [[2702, 2702], "disallowed"], [[2703, 2705], "valid"], [[2706, 2706], "disallowed"], [[2707, 2728], "valid"], [[2729, 2729], "disallowed"], [[2730, 2736], "valid"], [[2737, 2737], "disallowed"], [[2738, 2739], "valid"], [[2740, 2740], "disallowed"], [[2741, 2745], "valid"], [[2746, 2747], "disallowed"], [[2748, 2757], "valid"], [[2758, 2758], "disallowed"], [[2759, 2761], "valid"], [[2762, 2762], "disallowed"], [[2763, 2765], "valid"], [[2766, 2767], "disallowed"], [[2768, 2768], "valid"], [[2769, 2783], "disallowed"], [[2784, 2784], "valid"], [[2785, 2787], "valid"], [[2788, 2789], "disallowed"], [[2790, 2799], "valid"], [[2800, 2800], "valid", [], "NV8"], [[2801, 2801], "valid", [], "NV8"], [[2802, 2808], "disallowed"], [[2809, 2809], "valid"], [[2810, 2816], "disallowed"], [[2817, 2819], "valid"], [[2820, 2820], "disallowed"], [[2821, 2828], "valid"], [[2829, 2830], "disallowed"], [[2831, 2832], "valid"], [[2833, 2834], "disallowed"], [[2835, 2856], "valid"], [[2857, 2857], "disallowed"], [[2858, 2864], "valid"], [[2865, 2865], "disallowed"], [[2866, 2867], "valid"], [[2868, 2868], "disallowed"], [[2869, 2869], "valid"], [[2870, 2873], "valid"], [[2874, 2875], "disallowed"], [[2876, 2883], "valid"], [[2884, 2884], "valid"], [[2885, 2886], "disallowed"], [[2887, 2888], "valid"], [[2889, 2890], "disallowed"], [[2891, 2893], "valid"], [[2894, 2901], "disallowed"], [[2902, 2903], "valid"], [[2904, 2907], "disallowed"], [[2908, 2908], "mapped", [2849, 2876]], [[2909, 2909], "mapped", [2850, 2876]], [[2910, 2910], "disallowed"], [[2911, 2913], "valid"], [[2914, 2915], "valid"], [[2916, 2917], "disallowed"], [[2918, 2927], "valid"], [[2928, 2928], "valid", [], "NV8"], [[2929, 2929], "valid"], [[2930, 2935], "valid", [], "NV8"], [[2936, 2945], "disallowed"], [[2946, 2947], "valid"], [[2948, 2948], "disallowed"], [[2949, 2954], "valid"], [[2955, 2957], "disallowed"], [[2958, 2960], "valid"], [[2961, 2961], "disallowed"], [[2962, 2965], "valid"], [[2966, 2968], "disallowed"], [[2969, 2970], "valid"], [[2971, 2971], "disallowed"], [[2972, 2972], "valid"], [[2973, 2973], "disallowed"], [[2974, 2975], "valid"], [[2976, 2978], "disallowed"], [[2979, 2980], "valid"], [[2981, 2983], "disallowed"], [[2984, 2986], "valid"], [[2987, 2989], "disallowed"], [[2990, 2997], "valid"], [[2998, 2998], "valid"], [[2999, 3001], "valid"], [[3002, 3005], "disallowed"], [[3006, 3010], "valid"], [[3011, 3013], "disallowed"], [[3014, 3016], "valid"], [[3017, 3017], "disallowed"], [[3018, 3021], "valid"], [[3022, 3023], "disallowed"], [[3024, 3024], "valid"], [[3025, 3030], "disallowed"], [[3031, 3031], "valid"], [[3032, 3045], "disallowed"], [[3046, 3046], "valid"], [[3047, 3055], "valid"], [[3056, 3058], "valid", [], "NV8"], [[3059, 3066], "valid", [], "NV8"], [[3067, 3071], "disallowed"], [[3072, 3072], "valid"], [[3073, 3075], "valid"], [[3076, 3076], "disallowed"], [[3077, 3084], "valid"], [[3085, 3085], "disallowed"], [[3086, 3088], "valid"], [[3089, 3089], "disallowed"], [[3090, 3112], "valid"], [[3113, 3113], "disallowed"], [[3114, 3123], "valid"], [[3124, 3124], "valid"], [[3125, 3129], "valid"], [[3130, 3132], "disallowed"], [[3133, 3133], "valid"], [[3134, 3140], "valid"], [[3141, 3141], "disallowed"], [[3142, 3144], "valid"], [[3145, 3145], "disallowed"], [[3146, 3149], "valid"], [[3150, 3156], "disallowed"], [[3157, 3158], "valid"], [[3159, 3159], "disallowed"], [[3160, 3161], "valid"], [[3162, 3162], "valid"], [[3163, 3167], "disallowed"], [[3168, 3169], "valid"], [[3170, 3171], "valid"], [[3172, 3173], "disallowed"], [[3174, 3183], "valid"], [[3184, 3191], "disallowed"], [[3192, 3199], "valid", [], "NV8"], [[3200, 3200], "disallowed"], [[3201, 3201], "valid"], [[3202, 3203], "valid"], [[3204, 3204], "disallowed"], [[3205, 3212], "valid"], [[3213, 3213], "disallowed"], [[3214, 3216], "valid"], [[3217, 3217], "disallowed"], [[3218, 3240], "valid"], [[3241, 3241], "disallowed"], [[3242, 3251], "valid"], [[3252, 3252], "disallowed"], [[3253, 3257], "valid"], [[3258, 3259], "disallowed"], [[3260, 3261], "valid"], [[3262, 3268], "valid"], [[3269, 3269], "disallowed"], [[3270, 3272], "valid"], [[3273, 3273], "disallowed"], [[3274, 3277], "valid"], [[3278, 3284], "disallowed"], [[3285, 3286], "valid"], [[3287, 3293], "disallowed"], [[3294, 3294], "valid"], [[3295, 3295], "disallowed"], [[3296, 3297], "valid"], [[3298, 3299], "valid"], [[3300, 3301], "disallowed"], [[3302, 3311], "valid"], [[3312, 3312], "disallowed"], [[3313, 3314], "valid"], [[3315, 3328], "disallowed"], [[3329, 3329], "valid"], [[3330, 3331], "valid"], [[3332, 3332], "disallowed"], [[3333, 3340], "valid"], [[3341, 3341], "disallowed"], [[3342, 3344], "valid"], [[3345, 3345], "disallowed"], [[3346, 3368], "valid"], [[3369, 3369], "valid"], [[3370, 3385], "valid"], [[3386, 3386], "valid"], [[3387, 3388], "disallowed"], [[3389, 3389], "valid"], [[3390, 3395], "valid"], [[3396, 3396], "valid"], [[3397, 3397], "disallowed"], [[3398, 3400], "valid"], [[3401, 3401], "disallowed"], [[3402, 3405], "valid"], [[3406, 3406], "valid"], [[3407, 3414], "disallowed"], [[3415, 3415], "valid"], [[3416, 3422], "disallowed"], [[3423, 3423], "valid"], [[3424, 3425], "valid"], [[3426, 3427], "valid"], [[3428, 3429], "disallowed"], [[3430, 3439], "valid"], [[3440, 3445], "valid", [], "NV8"], [[3446, 3448], "disallowed"], [[3449, 3449], "valid", [], "NV8"], [[3450, 3455], "valid"], [[3456, 3457], "disallowed"], [[3458, 3459], "valid"], [[3460, 3460], "disallowed"], [[3461, 3478], "valid"], [[3479, 3481], "disallowed"], [[3482, 3505], "valid"], [[3506, 3506], "disallowed"], [[3507, 3515], "valid"], [[3516, 3516], "disallowed"], [[3517, 3517], "valid"], [[3518, 3519], "disallowed"], [[3520, 3526], "valid"], [[3527, 3529], "disallowed"], [[3530, 3530], "valid"], [[3531, 3534], "disallowed"], [[3535, 3540], "valid"], [[3541, 3541], "disallowed"], [[3542, 3542], "valid"], [[3543, 3543], "disallowed"], [[3544, 3551], "valid"], [[3552, 3557], "disallowed"], [[3558, 3567], "valid"], [[3568, 3569], "disallowed"], [[3570, 3571], "valid"], [[3572, 3572], "valid", [], "NV8"], [[3573, 3584], "disallowed"], [[3585, 3634], "valid"], [[3635, 3635], "mapped", [3661, 3634]], [[3636, 3642], "valid"], [[3643, 3646], "disallowed"], [[3647, 3647], "valid", [], "NV8"], [[3648, 3662], "valid"], [[3663, 3663], "valid", [], "NV8"], [[3664, 3673], "valid"], [[3674, 3675], "valid", [], "NV8"], [[3676, 3712], "disallowed"], [[3713, 3714], "valid"], [[3715, 3715], "disallowed"], [[3716, 3716], "valid"], [[3717, 3718], "disallowed"], [[3719, 3720], "valid"], [[3721, 3721], "disallowed"], [[3722, 3722], "valid"], [[3723, 3724], "disallowed"], [[3725, 3725], "valid"], [[3726, 3731], "disallowed"], [[3732, 3735], "valid"], [[3736, 3736], "disallowed"], [[3737, 3743], "valid"], [[3744, 3744], "disallowed"], [[3745, 3747], "valid"], [[3748, 3748], "disallowed"], [[3749, 3749], "valid"], [[3750, 3750], "disallowed"], [[3751, 3751], "valid"], [[3752, 3753], "disallowed"], [[3754, 3755], "valid"], [[3756, 3756], "disallowed"], [[3757, 3762], "valid"], [[3763, 3763], "mapped", [3789, 3762]], [[3764, 3769], "valid"], [[3770, 3770], "disallowed"], [[3771, 3773], "valid"], [[3774, 3775], "disallowed"], [[3776, 3780], "valid"], [[3781, 3781], "disallowed"], [[3782, 3782], "valid"], [[3783, 3783], "disallowed"], [[3784, 3789], "valid"], [[3790, 3791], "disallowed"], [[3792, 3801], "valid"], [[3802, 3803], "disallowed"], [[3804, 3804], "mapped", [3755, 3737]], [[3805, 3805], "mapped", [3755, 3745]], [[3806, 3807], "valid"], [[3808, 3839], "disallowed"], [[3840, 3840], "valid"], [[3841, 3850], "valid", [], "NV8"], [[3851, 3851], "valid"], [[3852, 3852], "mapped", [3851]], [[3853, 3863], "valid", [], "NV8"], [[3864, 3865], "valid"], [[3866, 3871], "valid", [], "NV8"], [[3872, 3881], "valid"], [[3882, 3892], "valid", [], "NV8"], [[3893, 3893], "valid"], [[3894, 3894], "valid", [], "NV8"], [[3895, 3895], "valid"], [[3896, 3896], "valid", [], "NV8"], [[3897, 3897], "valid"], [[3898, 3901], "valid", [], "NV8"], [[3902, 3906], "valid"], [[3907, 3907], "mapped", [3906, 4023]], [[3908, 3911], "valid"], [[3912, 3912], "disallowed"], [[3913, 3916], "valid"], [[3917, 3917], "mapped", [3916, 4023]], [[3918, 3921], "valid"], [[3922, 3922], "mapped", [3921, 4023]], [[3923, 3926], "valid"], [[3927, 3927], "mapped", [3926, 4023]], [[3928, 3931], "valid"], [[3932, 3932], "mapped", [3931, 4023]], [[3933, 3944], "valid"], [[3945, 3945], "mapped", [3904, 4021]], [[3946, 3946], "valid"], [[3947, 3948], "valid"], [[3949, 3952], "disallowed"], [[3953, 3954], "valid"], [[3955, 3955], "mapped", [3953, 3954]], [[3956, 3956], "valid"], [[3957, 3957], "mapped", [3953, 3956]], [[3958, 3958], "mapped", [4018, 3968]], [[3959, 3959], "mapped", [4018, 3953, 3968]], [[3960, 3960], "mapped", [4019, 3968]], [[3961, 3961], "mapped", [4019, 3953, 3968]], [[3962, 3968], "valid"], [[3969, 3969], "mapped", [3953, 3968]], [[3970, 3972], "valid"], [[3973, 3973], "valid", [], "NV8"], [[3974, 3979], "valid"], [[3980, 3983], "valid"], [[3984, 3986], "valid"], [[3987, 3987], "mapped", [3986, 4023]], [[3988, 3989], "valid"], [[3990, 3990], "valid"], [[3991, 3991], "valid"], [[3992, 3992], "disallowed"], [[3993, 3996], "valid"], [[3997, 3997], "mapped", [3996, 4023]], [[3998, 4001], "valid"], [[4002, 4002], "mapped", [4001, 4023]], [[4003, 4006], "valid"], [[4007, 4007], "mapped", [4006, 4023]], [[4008, 4011], "valid"], [[4012, 4012], "mapped", [4011, 4023]], [[4013, 4013], "valid"], [[4014, 4016], "valid"], [[4017, 4023], "valid"], [[4024, 4024], "valid"], [[4025, 4025], "mapped", [3984, 4021]], [[4026, 4028], "valid"], [[4029, 4029], "disallowed"], [[4030, 4037], "valid", [], "NV8"], [[4038, 4038], "valid"], [[4039, 4044], "valid", [], "NV8"], [[4045, 4045], "disallowed"], [[4046, 4046], "valid", [], "NV8"], [[4047, 4047], "valid", [], "NV8"], [[4048, 4049], "valid", [], "NV8"], [[4050, 4052], "valid", [], "NV8"], [[4053, 4056], "valid", [], "NV8"], [[4057, 4058], "valid", [], "NV8"], [[4059, 4095], "disallowed"], [[4096, 4129], "valid"], [[4130, 4130], "valid"], [[4131, 4135], "valid"], [[4136, 4136], "valid"], [[4137, 4138], "valid"], [[4139, 4139], "valid"], [[4140, 4146], "valid"], [[4147, 4149], "valid"], [[4150, 4153], "valid"], [[4154, 4159], "valid"], [[4160, 4169], "valid"], [[4170, 4175], "valid", [], "NV8"], [[4176, 4185], "valid"], [[4186, 4249], "valid"], [[4250, 4253], "valid"], [[4254, 4255], "valid", [], "NV8"], [[4256, 4293], "disallowed"], [[4294, 4294], "disallowed"], [[4295, 4295], "mapped", [11559]], [[4296, 4300], "disallowed"], [[4301, 4301], "mapped", [11565]], [[4302, 4303], "disallowed"], [[4304, 4342], "valid"], [[4343, 4344], "valid"], [[4345, 4346], "valid"], [[4347, 4347], "valid", [], "NV8"], [[4348, 4348], "mapped", [4316]], [[4349, 4351], "valid"], [[4352, 4441], "valid", [], "NV8"], [[4442, 4446], "valid", [], "NV8"], [[4447, 4448], "disallowed"], [[4449, 4514], "valid", [], "NV8"], [[4515, 4519], "valid", [], "NV8"], [[4520, 4601], "valid", [], "NV8"], [[4602, 4607], "valid", [], "NV8"], [[4608, 4614], "valid"], [[4615, 4615], "valid"], [[4616, 4678], "valid"], [[4679, 4679], "valid"], [[4680, 4680], "valid"], [[4681, 4681], "disallowed"], [[4682, 4685], "valid"], [[4686, 4687], "disallowed"], [[4688, 4694], "valid"], [[4695, 4695], "disallowed"], [[4696, 4696], "valid"], [[4697, 4697], "disallowed"], [[4698, 4701], "valid"], [[4702, 4703], "disallowed"], [[4704, 4742], "valid"], [[4743, 4743], "valid"], [[4744, 4744], "valid"], [[4745, 4745], "disallowed"], [[4746, 4749], "valid"], [[4750, 4751], "disallowed"], [[4752, 4782], "valid"], [[4783, 4783], "valid"], [[4784, 4784], "valid"], [[4785, 4785], "disallowed"], [[4786, 4789], "valid"], [[4790, 4791], "disallowed"], [[4792, 4798], "valid"], [[4799, 4799], "disallowed"], [[4800, 4800], "valid"], [[4801, 4801], "disallowed"], [[4802, 4805], "valid"], [[4806, 4807], "disallowed"], [[4808, 4814], "valid"], [[4815, 4815], "valid"], [[4816, 4822], "valid"], [[4823, 4823], "disallowed"], [[4824, 4846], "valid"], [[4847, 4847], "valid"], [[4848, 4878], "valid"], [[4879, 4879], "valid"], [[4880, 4880], "valid"], [[4881, 4881], "disallowed"], [[4882, 4885], "valid"], [[4886, 4887], "disallowed"], [[4888, 4894], "valid"], [[4895, 4895], "valid"], [[4896, 4934], "valid"], [[4935, 4935], "valid"], [[4936, 4954], "valid"], [[4955, 4956], "disallowed"], [[4957, 4958], "valid"], [[4959, 4959], "valid"], [[4960, 4960], "valid", [], "NV8"], [[4961, 4988], "valid", [], "NV8"], [[4989, 4991], "disallowed"], [[4992, 5007], "valid"], [[5008, 5017], "valid", [], "NV8"], [[5018, 5023], "disallowed"], [[5024, 5108], "valid"], [[5109, 5109], "valid"], [[5110, 5111], "disallowed"], [[5112, 5112], "mapped", [5104]], [[5113, 5113], "mapped", [5105]], [[5114, 5114], "mapped", [5106]], [[5115, 5115], "mapped", [5107]], [[5116, 5116], "mapped", [5108]], [[5117, 5117], "mapped", [5109]], [[5118, 5119], "disallowed"], [[5120, 5120], "valid", [], "NV8"], [[5121, 5740], "valid"], [[5741, 5742], "valid", [], "NV8"], [[5743, 5750], "valid"], [[5751, 5759], "valid"], [[5760, 5760], "disallowed"], [[5761, 5786], "valid"], [[5787, 5788], "valid", [], "NV8"], [[5789, 5791], "disallowed"], [[5792, 5866], "valid"], [[5867, 5872], "valid", [], "NV8"], [[5873, 5880], "valid"], [[5881, 5887], "disallowed"], [[5888, 5900], "valid"], [[5901, 5901], "disallowed"], [[5902, 5908], "valid"], [[5909, 5919], "disallowed"], [[5920, 5940], "valid"], [[5941, 5942], "valid", [], "NV8"], [[5943, 5951], "disallowed"], [[5952, 5971], "valid"], [[5972, 5983], "disallowed"], [[5984, 5996], "valid"], [[5997, 5997], "disallowed"], [[5998, 6e3], "valid"], [[6001, 6001], "disallowed"], [[6002, 6003], "valid"], [[6004, 6015], "disallowed"], [[6016, 6067], "valid"], [[6068, 6069], "disallowed"], [[6070, 6099], "valid"], [[6100, 6102], "valid", [], "NV8"], [[6103, 6103], "valid"], [[6104, 6107], "valid", [], "NV8"], [[6108, 6108], "valid"], [[6109, 6109], "valid"], [[6110, 6111], "disallowed"], [[6112, 6121], "valid"], [[6122, 6127], "disallowed"], [[6128, 6137], "valid", [], "NV8"], [[6138, 6143], "disallowed"], [[6144, 6149], "valid", [], "NV8"], [[6150, 6150], "disallowed"], [[6151, 6154], "valid", [], "NV8"], [[6155, 6157], "ignored"], [[6158, 6158], "disallowed"], [[6159, 6159], "disallowed"], [[6160, 6169], "valid"], [[6170, 6175], "disallowed"], [[6176, 6263], "valid"], [[6264, 6271], "disallowed"], [[6272, 6313], "valid"], [[6314, 6314], "valid"], [[6315, 6319], "disallowed"], [[6320, 6389], "valid"], [[6390, 6399], "disallowed"], [[6400, 6428], "valid"], [[6429, 6430], "valid"], [[6431, 6431], "disallowed"], [[6432, 6443], "valid"], [[6444, 6447], "disallowed"], [[6448, 6459], "valid"], [[6460, 6463], "disallowed"], [[6464, 6464], "valid", [], "NV8"], [[6465, 6467], "disallowed"], [[6468, 6469], "valid", [], "NV8"], [[6470, 6509], "valid"], [[6510, 6511], "disallowed"], [[6512, 6516], "valid"], [[6517, 6527], "disallowed"], [[6528, 6569], "valid"], [[6570, 6571], "valid"], [[6572, 6575], "disallowed"], [[6576, 6601], "valid"], [[6602, 6607], "disallowed"], [[6608, 6617], "valid"], [[6618, 6618], "valid", [], "XV8"], [[6619, 6621], "disallowed"], [[6622, 6623], "valid", [], "NV8"], [[6624, 6655], "valid", [], "NV8"], [[6656, 6683], "valid"], [[6684, 6685], "disallowed"], [[6686, 6687], "valid", [], "NV8"], [[6688, 6750], "valid"], [[6751, 6751], "disallowed"], [[6752, 6780], "valid"], [[6781, 6782], "disallowed"], [[6783, 6793], "valid"], [[6794, 6799], "disallowed"], [[6800, 6809], "valid"], [[6810, 6815], "disallowed"], [[6816, 6822], "valid", [], "NV8"], [[6823, 6823], "valid"], [[6824, 6829], "valid", [], "NV8"], [[6830, 6831], "disallowed"], [[6832, 6845], "valid"], [[6846, 6846], "valid", [], "NV8"], [[6847, 6911], "disallowed"], [[6912, 6987], "valid"], [[6988, 6991], "disallowed"], [[6992, 7001], "valid"], [[7002, 7018], "valid", [], "NV8"], [[7019, 7027], "valid"], [[7028, 7036], "valid", [], "NV8"], [[7037, 7039], "disallowed"], [[7040, 7082], "valid"], [[7083, 7085], "valid"], [[7086, 7097], "valid"], [[7098, 7103], "valid"], [[7104, 7155], "valid"], [[7156, 7163], "disallowed"], [[7164, 7167], "valid", [], "NV8"], [[7168, 7223], "valid"], [[7224, 7226], "disallowed"], [[7227, 7231], "valid", [], "NV8"], [[7232, 7241], "valid"], [[7242, 7244], "disallowed"], [[7245, 7293], "valid"], [[7294, 7295], "valid", [], "NV8"], [[7296, 7359], "disallowed"], [[7360, 7367], "valid", [], "NV8"], [[7368, 7375], "disallowed"], [[7376, 7378], "valid"], [[7379, 7379], "valid", [], "NV8"], [[7380, 7410], "valid"], [[7411, 7414], "valid"], [[7415, 7415], "disallowed"], [[7416, 7417], "valid"], [[7418, 7423], "disallowed"], [[7424, 7467], "valid"], [[7468, 7468], "mapped", [97]], [[7469, 7469], "mapped", [230]], [[7470, 7470], "mapped", [98]], [[7471, 7471], "valid"], [[7472, 7472], "mapped", [100]], [[7473, 7473], "mapped", [101]], [[7474, 7474], "mapped", [477]], [[7475, 7475], "mapped", [103]], [[7476, 7476], "mapped", [104]], [[7477, 7477], "mapped", [105]], [[7478, 7478], "mapped", [106]], [[7479, 7479], "mapped", [107]], [[7480, 7480], "mapped", [108]], [[7481, 7481], "mapped", [109]], [[7482, 7482], "mapped", [110]], [[7483, 7483], "valid"], [[7484, 7484], "mapped", [111]], [[7485, 7485], "mapped", [547]], [[7486, 7486], "mapped", [112]], [[7487, 7487], "mapped", [114]], [[7488, 7488], "mapped", [116]], [[7489, 7489], "mapped", [117]], [[7490, 7490], "mapped", [119]], [[7491, 7491], "mapped", [97]], [[7492, 7492], "mapped", [592]], [[7493, 7493], "mapped", [593]], [[7494, 7494], "mapped", [7426]], [[7495, 7495], "mapped", [98]], [[7496, 7496], "mapped", [100]], [[7497, 7497], "mapped", [101]], [[7498, 7498], "mapped", [601]], [[7499, 7499], "mapped", [603]], [[7500, 7500], "mapped", [604]], [[7501, 7501], "mapped", [103]], [[7502, 7502], "valid"], [[7503, 7503], "mapped", [107]], [[7504, 7504], "mapped", [109]], [[7505, 7505], "mapped", [331]], [[7506, 7506], "mapped", [111]], [[7507, 7507], "mapped", [596]], [[7508, 7508], "mapped", [7446]], [[7509, 7509], "mapped", [7447]], [[7510, 7510], "mapped", [112]], [[7511, 7511], "mapped", [116]], [[7512, 7512], "mapped", [117]], [[7513, 7513], "mapped", [7453]], [[7514, 7514], "mapped", [623]], [[7515, 7515], "mapped", [118]], [[7516, 7516], "mapped", [7461]], [[7517, 7517], "mapped", [946]], [[7518, 7518], "mapped", [947]], [[7519, 7519], "mapped", [948]], [[7520, 7520], "mapped", [966]], [[7521, 7521], "mapped", [967]], [[7522, 7522], "mapped", [105]], [[7523, 7523], "mapped", [114]], [[7524, 7524], "mapped", [117]], [[7525, 7525], "mapped", [118]], [[7526, 7526], "mapped", [946]], [[7527, 7527], "mapped", [947]], [[7528, 7528], "mapped", [961]], [[7529, 7529], "mapped", [966]], [[7530, 7530], "mapped", [967]], [[7531, 7531], "valid"], [[7532, 7543], "valid"], [[7544, 7544], "mapped", [1085]], [[7545, 7578], "valid"], [[7579, 7579], "mapped", [594]], [[7580, 7580], "mapped", [99]], [[7581, 7581], "mapped", [597]], [[7582, 7582], "mapped", [240]], [[7583, 7583], "mapped", [604]], [[7584, 7584], "mapped", [102]], [[7585, 7585], "mapped", [607]], [[7586, 7586], "mapped", [609]], [[7587, 7587], "mapped", [613]], [[7588, 7588], "mapped", [616]], [[7589, 7589], "mapped", [617]], [[7590, 7590], "mapped", [618]], [[7591, 7591], "mapped", [7547]], [[7592, 7592], "mapped", [669]], [[7593, 7593], "mapped", [621]], [[7594, 7594], "mapped", [7557]], [[7595, 7595], "mapped", [671]], [[7596, 7596], "mapped", [625]], [[7597, 7597], "mapped", [624]], [[7598, 7598], "mapped", [626]], [[7599, 7599], "mapped", [627]], [[7600, 7600], "mapped", [628]], [[7601, 7601], "mapped", [629]], [[7602, 7602], "mapped", [632]], [[7603, 7603], "mapped", [642]], [[7604, 7604], "mapped", [643]], [[7605, 7605], "mapped", [427]], [[7606, 7606], "mapped", [649]], [[7607, 7607], "mapped", [650]], [[7608, 7608], "mapped", [7452]], [[7609, 7609], "mapped", [651]], [[7610, 7610], "mapped", [652]], [[7611, 7611], "mapped", [122]], [[7612, 7612], "mapped", [656]], [[7613, 7613], "mapped", [657]], [[7614, 7614], "mapped", [658]], [[7615, 7615], "mapped", [952]], [[7616, 7619], "valid"], [[7620, 7626], "valid"], [[7627, 7654], "valid"], [[7655, 7669], "valid"], [[7670, 7675], "disallowed"], [[7676, 7676], "valid"], [[7677, 7677], "valid"], [[7678, 7679], "valid"], [[7680, 7680], "mapped", [7681]], [[7681, 7681], "valid"], [[7682, 7682], "mapped", [7683]], [[7683, 7683], "valid"], [[7684, 7684], "mapped", [7685]], [[7685, 7685], "valid"], [[7686, 7686], "mapped", [7687]], [[7687, 7687], "valid"], [[7688, 7688], "mapped", [7689]], [[7689, 7689], "valid"], [[7690, 7690], "mapped", [7691]], [[7691, 7691], "valid"], [[7692, 7692], "mapped", [7693]], [[7693, 7693], "valid"], [[7694, 7694], "mapped", [7695]], [[7695, 7695], "valid"], [[7696, 7696], "mapped", [7697]], [[7697, 7697], "valid"], [[7698, 7698], "mapped", [7699]], [[7699, 7699], "valid"], [[7700, 7700], "mapped", [7701]], [[7701, 7701], "valid"], [[7702, 7702], "mapped", [7703]], [[7703, 7703], "valid"], [[7704, 7704], "mapped", [7705]], [[7705, 7705], "valid"], [[7706, 7706], "mapped", [7707]], [[7707, 7707], "valid"], [[7708, 7708], "mapped", [7709]], [[7709, 7709], "valid"], [[7710, 7710], "mapped", [7711]], [[7711, 7711], "valid"], [[7712, 7712], "mapped", [7713]], [[7713, 7713], "valid"], [[7714, 7714], "mapped", [7715]], [[7715, 7715], "valid"], [[7716, 7716], "mapped", [7717]], [[7717, 7717], "valid"], [[7718, 7718], "mapped", [7719]], [[7719, 7719], "valid"], [[7720, 7720], "mapped", [7721]], [[7721, 7721], "valid"], [[7722, 7722], "mapped", [7723]], [[7723, 7723], "valid"], [[7724, 7724], "mapped", [7725]], [[7725, 7725], "valid"], [[7726, 7726], "mapped", [7727]], [[7727, 7727], "valid"], [[7728, 7728], "mapped", [7729]], [[7729, 7729], "valid"], [[7730, 7730], "mapped", [7731]], [[7731, 7731], "valid"], [[7732, 7732], "mapped", [7733]], [[7733, 7733], "valid"], [[7734, 7734], "mapped", [7735]], [[7735, 7735], "valid"], [[7736, 7736], "mapped", [7737]], [[7737, 7737], "valid"], [[7738, 7738], "mapped", [7739]], [[7739, 7739], "valid"], [[7740, 7740], "mapped", [7741]], [[7741, 7741], "valid"], [[7742, 7742], "mapped", [7743]], [[7743, 7743], "valid"], [[7744, 7744], "mapped", [7745]], [[7745, 7745], "valid"], [[7746, 7746], "mapped", [7747]], [[7747, 7747], "valid"], [[7748, 7748], "mapped", [7749]], [[7749, 7749], "valid"], [[7750, 7750], "mapped", [7751]], [[7751, 7751], "valid"], [[7752, 7752], "mapped", [7753]], [[7753, 7753], "valid"], [[7754, 7754], "mapped", [7755]], [[7755, 7755], "valid"], [[7756, 7756], "mapped", [7757]], [[7757, 7757], "valid"], [[7758, 7758], "mapped", [7759]], [[7759, 7759], "valid"], [[7760, 7760], "mapped", [7761]], [[7761, 7761], "valid"], [[7762, 7762], "mapped", [7763]], [[7763, 7763], "valid"], [[7764, 7764], "mapped", [7765]], [[7765, 7765], "valid"], [[7766, 7766], "mapped", [7767]], [[7767, 7767], "valid"], [[7768, 7768], "mapped", [7769]], [[7769, 7769], "valid"], [[7770, 7770], "mapped", [7771]], [[7771, 7771], "valid"], [[7772, 7772], "mapped", [7773]], [[7773, 7773], "valid"], [[7774, 7774], "mapped", [7775]], [[7775, 7775], "valid"], [[7776, 7776], "mapped", [7777]], [[7777, 7777], "valid"], [[7778, 7778], "mapped", [7779]], [[7779, 7779], "valid"], [[7780, 7780], "mapped", [7781]], [[7781, 7781], "valid"], [[7782, 7782], "mapped", [7783]], [[7783, 7783], "valid"], [[7784, 7784], "mapped", [7785]], [[7785, 7785], "valid"], [[7786, 7786], "mapped", [7787]], [[7787, 7787], "valid"], [[7788, 7788], "mapped", [7789]], [[7789, 7789], "valid"], [[7790, 7790], "mapped", [7791]], [[7791, 7791], "valid"], [[7792, 7792], "mapped", [7793]], [[7793, 7793], "valid"], [[7794, 7794], "mapped", [7795]], [[7795, 7795], "valid"], [[7796, 7796], "mapped", [7797]], [[7797, 7797], "valid"], [[7798, 7798], "mapped", [7799]], [[7799, 7799], "valid"], [[7800, 7800], "mapped", [7801]], [[7801, 7801], "valid"], [[7802, 7802], "mapped", [7803]], [[7803, 7803], "valid"], [[7804, 7804], "mapped", [7805]], [[7805, 7805], "valid"], [[7806, 7806], "mapped", [7807]], [[7807, 7807], "valid"], [[7808, 7808], "mapped", [7809]], [[7809, 7809], "valid"], [[7810, 7810], "mapped", [7811]], [[7811, 7811], "valid"], [[7812, 7812], "mapped", [7813]], [[7813, 7813], "valid"], [[7814, 7814], "mapped", [7815]], [[7815, 7815], "valid"], [[7816, 7816], "mapped", [7817]], [[7817, 7817], "valid"], [[7818, 7818], "mapped", [7819]], [[7819, 7819], "valid"], [[7820, 7820], "mapped", [7821]], [[7821, 7821], "valid"], [[7822, 7822], "mapped", [7823]], [[7823, 7823], "valid"], [[7824, 7824], "mapped", [7825]], [[7825, 7825], "valid"], [[7826, 7826], "mapped", [7827]], [[7827, 7827], "valid"], [[7828, 7828], "mapped", [7829]], [[7829, 7833], "valid"], [[7834, 7834], "mapped", [97, 702]], [[7835, 7835], "mapped", [7777]], [[7836, 7837], "valid"], [[7838, 7838], "mapped", [115, 115]], [[7839, 7839], "valid"], [[7840, 7840], "mapped", [7841]], [[7841, 7841], "valid"], [[7842, 7842], "mapped", [7843]], [[7843, 7843], "valid"], [[7844, 7844], "mapped", [7845]], [[7845, 7845], "valid"], [[7846, 7846], "mapped", [7847]], [[7847, 7847], "valid"], [[7848, 7848], "mapped", [7849]], [[7849, 7849], "valid"], [[7850, 7850], "mapped", [7851]], [[7851, 7851], "valid"], [[7852, 7852], "mapped", [7853]], [[7853, 7853], "valid"], [[7854, 7854], "mapped", [7855]], [[7855, 7855], "valid"], [[7856, 7856], "mapped", [7857]], [[7857, 7857], "valid"], [[7858, 7858], "mapped", [7859]], [[7859, 7859], "valid"], [[7860, 7860], "mapped", [7861]], [[7861, 7861], "valid"], [[7862, 7862], "mapped", [7863]], [[7863, 7863], "valid"], [[7864, 7864], "mapped", [7865]], [[7865, 7865], "valid"], [[7866, 7866], "mapped", [7867]], [[7867, 7867], "valid"], [[7868, 7868], "mapped", [7869]], [[7869, 7869], "valid"], [[7870, 7870], "mapped", [7871]], [[7871, 7871], "valid"], [[7872, 7872], "mapped", [7873]], [[7873, 7873], "valid"], [[7874, 7874], "mapped", [7875]], [[7875, 7875], "valid"], [[7876, 7876], "mapped", [7877]], [[7877, 7877], "valid"], [[7878, 7878], "mapped", [7879]], [[7879, 7879], "valid"], [[7880, 7880], "mapped", [7881]], [[7881, 7881], "valid"], [[7882, 7882], "mapped", [7883]], [[7883, 7883], "valid"], [[7884, 7884], "mapped", [7885]], [[7885, 7885], "valid"], [[7886, 7886], "mapped", [7887]], [[7887, 7887], "valid"], [[7888, 7888], "mapped", [7889]], [[7889, 7889], "valid"], [[7890, 7890], "mapped", [7891]], [[7891, 7891], "valid"], [[7892, 7892], "mapped", [7893]], [[7893, 7893], "valid"], [[7894, 7894], "mapped", [7895]], [[7895, 7895], "valid"], [[7896, 7896], "mapped", [7897]], [[7897, 7897], "valid"], [[7898, 7898], "mapped", [7899]], [[7899, 7899], "valid"], [[7900, 7900], "mapped", [7901]], [[7901, 7901], "valid"], [[7902, 7902], "mapped", [7903]], [[7903, 7903], "valid"], [[7904, 7904], "mapped", [7905]], [[7905, 7905], "valid"], [[7906, 7906], "mapped", [7907]], [[7907, 7907], "valid"], [[7908, 7908], "mapped", [7909]], [[7909, 7909], "valid"], [[7910, 7910], "mapped", [7911]], [[7911, 7911], "valid"], [[7912, 7912], "mapped", [7913]], [[7913, 7913], "valid"], [[7914, 7914], "mapped", [7915]], [[7915, 7915], "valid"], [[7916, 7916], "mapped", [7917]], [[7917, 7917], "valid"], [[7918, 7918], "mapped", [7919]], [[7919, 7919], "valid"], [[7920, 7920], "mapped", [7921]], [[7921, 7921], "valid"], [[7922, 7922], "mapped", [7923]], [[7923, 7923], "valid"], [[7924, 7924], "mapped", [7925]], [[7925, 7925], "valid"], [[7926, 7926], "mapped", [7927]], [[7927, 7927], "valid"], [[7928, 7928], "mapped", [7929]], [[7929, 7929], "valid"], [[7930, 7930], "mapped", [7931]], [[7931, 7931], "valid"], [[7932, 7932], "mapped", [7933]], [[7933, 7933], "valid"], [[7934, 7934], "mapped", [7935]], [[7935, 7935], "valid"], [[7936, 7943], "valid"], [[7944, 7944], "mapped", [7936]], [[7945, 7945], "mapped", [7937]], [[7946, 7946], "mapped", [7938]], [[7947, 7947], "mapped", [7939]], [[7948, 7948], "mapped", [7940]], [[7949, 7949], "mapped", [7941]], [[7950, 7950], "mapped", [7942]], [[7951, 7951], "mapped", [7943]], [[7952, 7957], "valid"], [[7958, 7959], "disallowed"], [[7960, 7960], "mapped", [7952]], [[7961, 7961], "mapped", [7953]], [[7962, 7962], "mapped", [7954]], [[7963, 7963], "mapped", [7955]], [[7964, 7964], "mapped", [7956]], [[7965, 7965], "mapped", [7957]], [[7966, 7967], "disallowed"], [[7968, 7975], "valid"], [[7976, 7976], "mapped", [7968]], [[7977, 7977], "mapped", [7969]], [[7978, 7978], "mapped", [7970]], [[7979, 7979], "mapped", [7971]], [[7980, 7980], "mapped", [7972]], [[7981, 7981], "mapped", [7973]], [[7982, 7982], "mapped", [7974]], [[7983, 7983], "mapped", [7975]], [[7984, 7991], "valid"], [[7992, 7992], "mapped", [7984]], [[7993, 7993], "mapped", [7985]], [[7994, 7994], "mapped", [7986]], [[7995, 7995], "mapped", [7987]], [[7996, 7996], "mapped", [7988]], [[7997, 7997], "mapped", [7989]], [[7998, 7998], "mapped", [7990]], [[7999, 7999], "mapped", [7991]], [[8e3, 8005], "valid"], [[8006, 8007], "disallowed"], [[8008, 8008], "mapped", [8e3]], [[8009, 8009], "mapped", [8001]], [[8010, 8010], "mapped", [8002]], [[8011, 8011], "mapped", [8003]], [[8012, 8012], "mapped", [8004]], [[8013, 8013], "mapped", [8005]], [[8014, 8015], "disallowed"], [[8016, 8023], "valid"], [[8024, 8024], "disallowed"], [[8025, 8025], "mapped", [8017]], [[8026, 8026], "disallowed"], [[8027, 8027], "mapped", [8019]], [[8028, 8028], "disallowed"], [[8029, 8029], "mapped", [8021]], [[8030, 8030], "disallowed"], [[8031, 8031], "mapped", [8023]], [[8032, 8039], "valid"], [[8040, 8040], "mapped", [8032]], [[8041, 8041], "mapped", [8033]], [[8042, 8042], "mapped", [8034]], [[8043, 8043], "mapped", [8035]], [[8044, 8044], "mapped", [8036]], [[8045, 8045], "mapped", [8037]], [[8046, 8046], "mapped", [8038]], [[8047, 8047], "mapped", [8039]], [[8048, 8048], "valid"], [[8049, 8049], "mapped", [940]], [[8050, 8050], "valid"], [[8051, 8051], "mapped", [941]], [[8052, 8052], "valid"], [[8053, 8053], "mapped", [942]], [[8054, 8054], "valid"], [[8055, 8055], "mapped", [943]], [[8056, 8056], "valid"], [[8057, 8057], "mapped", [972]], [[8058, 8058], "valid"], [[8059, 8059], "mapped", [973]], [[8060, 8060], "valid"], [[8061, 8061], "mapped", [974]], [[8062, 8063], "disallowed"], [[8064, 8064], "mapped", [7936, 953]], [[8065, 8065], "mapped", [7937, 953]], [[8066, 8066], "mapped", [7938, 953]], [[8067, 8067], "mapped", [7939, 953]], [[8068, 8068], "mapped", [7940, 953]], [[8069, 8069], "mapped", [7941, 953]], [[8070, 8070], "mapped", [7942, 953]], [[8071, 8071], "mapped", [7943, 953]], [[8072, 8072], "mapped", [7936, 953]], [[8073, 8073], "mapped", [7937, 953]], [[8074, 8074], "mapped", [7938, 953]], [[8075, 8075], "mapped", [7939, 953]], [[8076, 8076], "mapped", [7940, 953]], [[8077, 8077], "mapped", [7941, 953]], [[8078, 8078], "mapped", [7942, 953]], [[8079, 8079], "mapped", [7943, 953]], [[8080, 8080], "mapped", [7968, 953]], [[8081, 8081], "mapped", [7969, 953]], [[8082, 8082], "mapped", [7970, 953]], [[8083, 8083], "mapped", [7971, 953]], [[8084, 8084], "mapped", [7972, 953]], [[8085, 8085], "mapped", [7973, 953]], [[8086, 8086], "mapped", [7974, 953]], [[8087, 8087], "mapped", [7975, 953]], [[8088, 8088], "mapped", [7968, 953]], [[8089, 8089], "mapped", [7969, 953]], [[8090, 8090], "mapped", [7970, 953]], [[8091, 8091], "mapped", [7971, 953]], [[8092, 8092], "mapped", [7972, 953]], [[8093, 8093], "mapped", [7973, 953]], [[8094, 8094], "mapped", [7974, 953]], [[8095, 8095], "mapped", [7975, 953]], [[8096, 8096], "mapped", [8032, 953]], [[8097, 8097], "mapped", [8033, 953]], [[8098, 8098], "mapped", [8034, 953]], [[8099, 8099], "mapped", [8035, 953]], [[8100, 8100], "mapped", [8036, 953]], [[8101, 8101], "mapped", [8037, 953]], [[8102, 8102], "mapped", [8038, 953]], [[8103, 8103], "mapped", [8039, 953]], [[8104, 8104], "mapped", [8032, 953]], [[8105, 8105], "mapped", [8033, 953]], [[8106, 8106], "mapped", [8034, 953]], [[8107, 8107], "mapped", [8035, 953]], [[8108, 8108], "mapped", [8036, 953]], [[8109, 8109], "mapped", [8037, 953]], [[8110, 8110], "mapped", [8038, 953]], [[8111, 8111], "mapped", [8039, 953]], [[8112, 8113], "valid"], [[8114, 8114], "mapped", [8048, 953]], [[8115, 8115], "mapped", [945, 953]], [[8116, 8116], "mapped", [940, 953]], [[8117, 8117], "disallowed"], [[8118, 8118], "valid"], [[8119, 8119], "mapped", [8118, 953]], [[8120, 8120], "mapped", [8112]], [[8121, 8121], "mapped", [8113]], [[8122, 8122], "mapped", [8048]], [[8123, 8123], "mapped", [940]], [[8124, 8124], "mapped", [945, 953]], [[8125, 8125], "disallowed_STD3_mapped", [32, 787]], [[8126, 8126], "mapped", [953]], [[8127, 8127], "disallowed_STD3_mapped", [32, 787]], [[8128, 8128], "disallowed_STD3_mapped", [32, 834]], [[8129, 8129], "disallowed_STD3_mapped", [32, 776, 834]], [[8130, 8130], "mapped", [8052, 953]], [[8131, 8131], "mapped", [951, 953]], [[8132, 8132], "mapped", [942, 953]], [[8133, 8133], "disallowed"], [[8134, 8134], "valid"], [[8135, 8135], "mapped", [8134, 953]], [[8136, 8136], "mapped", [8050]], [[8137, 8137], "mapped", [941]], [[8138, 8138], "mapped", [8052]], [[8139, 8139], "mapped", [942]], [[8140, 8140], "mapped", [951, 953]], [[8141, 8141], "disallowed_STD3_mapped", [32, 787, 768]], [[8142, 8142], "disallowed_STD3_mapped", [32, 787, 769]], [[8143, 8143], "disallowed_STD3_mapped", [32, 787, 834]], [[8144, 8146], "valid"], [[8147, 8147], "mapped", [912]], [[8148, 8149], "disallowed"], [[8150, 8151], "valid"], [[8152, 8152], "mapped", [8144]], [[8153, 8153], "mapped", [8145]], [[8154, 8154], "mapped", [8054]], [[8155, 8155], "mapped", [943]], [[8156, 8156], "disallowed"], [[8157, 8157], "disallowed_STD3_mapped", [32, 788, 768]], [[8158, 8158], "disallowed_STD3_mapped", [32, 788, 769]], [[8159, 8159], "disallowed_STD3_mapped", [32, 788, 834]], [[8160, 8162], "valid"], [[8163, 8163], "mapped", [944]], [[8164, 8167], "valid"], [[8168, 8168], "mapped", [8160]], [[8169, 8169], "mapped", [8161]], [[8170, 8170], "mapped", [8058]], [[8171, 8171], "mapped", [973]], [[8172, 8172], "mapped", [8165]], [[8173, 8173], "disallowed_STD3_mapped", [32, 776, 768]], [[8174, 8174], "disallowed_STD3_mapped", [32, 776, 769]], [[8175, 8175], "disallowed_STD3_mapped", [96]], [[8176, 8177], "disallowed"], [[8178, 8178], "mapped", [8060, 953]], [[8179, 8179], "mapped", [969, 953]], [[8180, 8180], "mapped", [974, 953]], [[8181, 8181], "disallowed"], [[8182, 8182], "valid"], [[8183, 8183], "mapped", [8182, 953]], [[8184, 8184], "mapped", [8056]], [[8185, 8185], "mapped", [972]], [[8186, 8186], "mapped", [8060]], [[8187, 8187], "mapped", [974]], [[8188, 8188], "mapped", [969, 953]], [[8189, 8189], "disallowed_STD3_mapped", [32, 769]], [[8190, 8190], "disallowed_STD3_mapped", [32, 788]], [[8191, 8191], "disallowed"], [[8192, 8202], "disallowed_STD3_mapped", [32]], [[8203, 8203], "ignored"], [[8204, 8205], "deviation", []], [[8206, 8207], "disallowed"], [[8208, 8208], "valid", [], "NV8"], [[8209, 8209], "mapped", [8208]], [[8210, 8214], "valid", [], "NV8"], [[8215, 8215], "disallowed_STD3_mapped", [32, 819]], [[8216, 8227], "valid", [], "NV8"], [[8228, 8230], "disallowed"], [[8231, 8231], "valid", [], "NV8"], [[8232, 8238], "disallowed"], [[8239, 8239], "disallowed_STD3_mapped", [32]], [[8240, 8242], "valid", [], "NV8"], [[8243, 8243], "mapped", [8242, 8242]], [[8244, 8244], "mapped", [8242, 8242, 8242]], [[8245, 8245], "valid", [], "NV8"], [[8246, 8246], "mapped", [8245, 8245]], [[8247, 8247], "mapped", [8245, 8245, 8245]], [[8248, 8251], "valid", [], "NV8"], [[8252, 8252], "disallowed_STD3_mapped", [33, 33]], [[8253, 8253], "valid", [], "NV8"], [[8254, 8254], "disallowed_STD3_mapped", [32, 773]], [[8255, 8262], "valid", [], "NV8"], [[8263, 8263], "disallowed_STD3_mapped", [63, 63]], [[8264, 8264], "disallowed_STD3_mapped", [63, 33]], [[8265, 8265], "disallowed_STD3_mapped", [33, 63]], [[8266, 8269], "valid", [], "NV8"], [[8270, 8274], "valid", [], "NV8"], [[8275, 8276], "valid", [], "NV8"], [[8277, 8278], "valid", [], "NV8"], [[8279, 8279], "mapped", [8242, 8242, 8242, 8242]], [[8280, 8286], "valid", [], "NV8"], [[8287, 8287], "disallowed_STD3_mapped", [32]], [[8288, 8288], "ignored"], [[8289, 8291], "disallowed"], [[8292, 8292], "ignored"], [[8293, 8293], "disallowed"], [[8294, 8297], "disallowed"], [[8298, 8303], "disallowed"], [[8304, 8304], "mapped", [48]], [[8305, 8305], "mapped", [105]], [[8306, 8307], "disallowed"], [[8308, 8308], "mapped", [52]], [[8309, 8309], "mapped", [53]], [[8310, 8310], "mapped", [54]], [[8311, 8311], "mapped", [55]], [[8312, 8312], "mapped", [56]], [[8313, 8313], "mapped", [57]], [[8314, 8314], "disallowed_STD3_mapped", [43]], [[8315, 8315], "mapped", [8722]], [[8316, 8316], "disallowed_STD3_mapped", [61]], [[8317, 8317], "disallowed_STD3_mapped", [40]], [[8318, 8318], "disallowed_STD3_mapped", [41]], [[8319, 8319], "mapped", [110]], [[8320, 8320], "mapped", [48]], [[8321, 8321], "mapped", [49]], [[8322, 8322], "mapped", [50]], [[8323, 8323], "mapped", [51]], [[8324, 8324], "mapped", [52]], [[8325, 8325], "mapped", [53]], [[8326, 8326], "mapped", [54]], [[8327, 8327], "mapped", [55]], [[8328, 8328], "mapped", [56]], [[8329, 8329], "mapped", [57]], [[8330, 8330], "disallowed_STD3_mapped", [43]], [[8331, 8331], "mapped", [8722]], [[8332, 8332], "disallowed_STD3_mapped", [61]], [[8333, 8333], "disallowed_STD3_mapped", [40]], [[8334, 8334], "disallowed_STD3_mapped", [41]], [[8335, 8335], "disallowed"], [[8336, 8336], "mapped", [97]], [[8337, 8337], "mapped", [101]], [[8338, 8338], "mapped", [111]], [[8339, 8339], "mapped", [120]], [[8340, 8340], "mapped", [601]], [[8341, 8341], "mapped", [104]], [[8342, 8342], "mapped", [107]], [[8343, 8343], "mapped", [108]], [[8344, 8344], "mapped", [109]], [[8345, 8345], "mapped", [110]], [[8346, 8346], "mapped", [112]], [[8347, 8347], "mapped", [115]], [[8348, 8348], "mapped", [116]], [[8349, 8351], "disallowed"], [[8352, 8359], "valid", [], "NV8"], [[8360, 8360], "mapped", [114, 115]], [[8361, 8362], "valid", [], "NV8"], [[8363, 8363], "valid", [], "NV8"], [[8364, 8364], "valid", [], "NV8"], [[8365, 8367], "valid", [], "NV8"], [[8368, 8369], "valid", [], "NV8"], [[8370, 8373], "valid", [], "NV8"], [[8374, 8376], "valid", [], "NV8"], [[8377, 8377], "valid", [], "NV8"], [[8378, 8378], "valid", [], "NV8"], [[8379, 8381], "valid", [], "NV8"], [[8382, 8382], "valid", [], "NV8"], [[8383, 8399], "disallowed"], [[8400, 8417], "valid", [], "NV8"], [[8418, 8419], "valid", [], "NV8"], [[8420, 8426], "valid", [], "NV8"], [[8427, 8427], "valid", [], "NV8"], [[8428, 8431], "valid", [], "NV8"], [[8432, 8432], "valid", [], "NV8"], [[8433, 8447], "disallowed"], [[8448, 8448], "disallowed_STD3_mapped", [97, 47, 99]], [[8449, 8449], "disallowed_STD3_mapped", [97, 47, 115]], [[8450, 8450], "mapped", [99]], [[8451, 8451], "mapped", [176, 99]], [[8452, 8452], "valid", [], "NV8"], [[8453, 8453], "disallowed_STD3_mapped", [99, 47, 111]], [[8454, 8454], "disallowed_STD3_mapped", [99, 47, 117]], [[8455, 8455], "mapped", [603]], [[8456, 8456], "valid", [], "NV8"], [[8457, 8457], "mapped", [176, 102]], [[8458, 8458], "mapped", [103]], [[8459, 8462], "mapped", [104]], [[8463, 8463], "mapped", [295]], [[8464, 8465], "mapped", [105]], [[8466, 8467], "mapped", [108]], [[8468, 8468], "valid", [], "NV8"], [[8469, 8469], "mapped", [110]], [[8470, 8470], "mapped", [110, 111]], [[8471, 8472], "valid", [], "NV8"], [[8473, 8473], "mapped", [112]], [[8474, 8474], "mapped", [113]], [[8475, 8477], "mapped", [114]], [[8478, 8479], "valid", [], "NV8"], [[8480, 8480], "mapped", [115, 109]], [[8481, 8481], "mapped", [116, 101, 108]], [[8482, 8482], "mapped", [116, 109]], [[8483, 8483], "valid", [], "NV8"], [[8484, 8484], "mapped", [122]], [[8485, 8485], "valid", [], "NV8"], [[8486, 8486], "mapped", [969]], [[8487, 8487], "valid", [], "NV8"], [[8488, 8488], "mapped", [122]], [[8489, 8489], "valid", [], "NV8"], [[8490, 8490], "mapped", [107]], [[8491, 8491], "mapped", [229]], [[8492, 8492], "mapped", [98]], [[8493, 8493], "mapped", [99]], [[8494, 8494], "valid", [], "NV8"], [[8495, 8496], "mapped", [101]], [[8497, 8497], "mapped", [102]], [[8498, 8498], "disallowed"], [[8499, 8499], "mapped", [109]], [[8500, 8500], "mapped", [111]], [[8501, 8501], "mapped", [1488]], [[8502, 8502], "mapped", [1489]], [[8503, 8503], "mapped", [1490]], [[8504, 8504], "mapped", [1491]], [[8505, 8505], "mapped", [105]], [[8506, 8506], "valid", [], "NV8"], [[8507, 8507], "mapped", [102, 97, 120]], [[8508, 8508], "mapped", [960]], [[8509, 8510], "mapped", [947]], [[8511, 8511], "mapped", [960]], [[8512, 8512], "mapped", [8721]], [[8513, 8516], "valid", [], "NV8"], [[8517, 8518], "mapped", [100]], [[8519, 8519], "mapped", [101]], [[8520, 8520], "mapped", [105]], [[8521, 8521], "mapped", [106]], [[8522, 8523], "valid", [], "NV8"], [[8524, 8524], "valid", [], "NV8"], [[8525, 8525], "valid", [], "NV8"], [[8526, 8526], "valid"], [[8527, 8527], "valid", [], "NV8"], [[8528, 8528], "mapped", [49, 8260, 55]], [[8529, 8529], "mapped", [49, 8260, 57]], [[8530, 8530], "mapped", [49, 8260, 49, 48]], [[8531, 8531], "mapped", [49, 8260, 51]], [[8532, 8532], "mapped", [50, 8260, 51]], [[8533, 8533], "mapped", [49, 8260, 53]], [[8534, 8534], "mapped", [50, 8260, 53]], [[8535, 8535], "mapped", [51, 8260, 53]], [[8536, 8536], "mapped", [52, 8260, 53]], [[8537, 8537], "mapped", [49, 8260, 54]], [[8538, 8538], "mapped", [53, 8260, 54]], [[8539, 8539], "mapped", [49, 8260, 56]], [[8540, 8540], "mapped", [51, 8260, 56]], [[8541, 8541], "mapped", [53, 8260, 56]], [[8542, 8542], "mapped", [55, 8260, 56]], [[8543, 8543], "mapped", [49, 8260]], [[8544, 8544], "mapped", [105]], [[8545, 8545], "mapped", [105, 105]], [[8546, 8546], "mapped", [105, 105, 105]], [[8547, 8547], "mapped", [105, 118]], [[8548, 8548], "mapped", [118]], [[8549, 8549], "mapped", [118, 105]], [[8550, 8550], "mapped", [118, 105, 105]], [[8551, 8551], "mapped", [118, 105, 105, 105]], [[8552, 8552], "mapped", [105, 120]], [[8553, 8553], "mapped", [120]], [[8554, 8554], "mapped", [120, 105]], [[8555, 8555], "mapped", [120, 105, 105]], [[8556, 8556], "mapped", [108]], [[8557, 8557], "mapped", [99]], [[8558, 8558], "mapped", [100]], [[8559, 8559], "mapped", [109]], [[8560, 8560], "mapped", [105]], [[8561, 8561], "mapped", [105, 105]], [[8562, 8562], "mapped", [105, 105, 105]], [[8563, 8563], "mapped", [105, 118]], [[8564, 8564], "mapped", [118]], [[8565, 8565], "mapped", [118, 105]], [[8566, 8566], "mapped", [118, 105, 105]], [[8567, 8567], "mapped", [118, 105, 105, 105]], [[8568, 8568], "mapped", [105, 120]], [[8569, 8569], "mapped", [120]], [[8570, 8570], "mapped", [120, 105]], [[8571, 8571], "mapped", [120, 105, 105]], [[8572, 8572], "mapped", [108]], [[8573, 8573], "mapped", [99]], [[8574, 8574], "mapped", [100]], [[8575, 8575], "mapped", [109]], [[8576, 8578], "valid", [], "NV8"], [[8579, 8579], "disallowed"], [[8580, 8580], "valid"], [[8581, 8584], "valid", [], "NV8"], [[8585, 8585], "mapped", [48, 8260, 51]], [[8586, 8587], "valid", [], "NV8"], [[8588, 8591], "disallowed"], [[8592, 8682], "valid", [], "NV8"], [[8683, 8691], "valid", [], "NV8"], [[8692, 8703], "valid", [], "NV8"], [[8704, 8747], "valid", [], "NV8"], [[8748, 8748], "mapped", [8747, 8747]], [[8749, 8749], "mapped", [8747, 8747, 8747]], [[8750, 8750], "valid", [], "NV8"], [[8751, 8751], "mapped", [8750, 8750]], [[8752, 8752], "mapped", [8750, 8750, 8750]], [[8753, 8799], "valid", [], "NV8"], [[8800, 8800], "disallowed_STD3_valid"], [[8801, 8813], "valid", [], "NV8"], [[8814, 8815], "disallowed_STD3_valid"], [[8816, 8945], "valid", [], "NV8"], [[8946, 8959], "valid", [], "NV8"], [[8960, 8960], "valid", [], "NV8"], [[8961, 8961], "valid", [], "NV8"], [[8962, 9e3], "valid", [], "NV8"], [[9001, 9001], "mapped", [12296]], [[9002, 9002], "mapped", [12297]], [[9003, 9082], "valid", [], "NV8"], [[9083, 9083], "valid", [], "NV8"], [[9084, 9084], "valid", [], "NV8"], [[9085, 9114], "valid", [], "NV8"], [[9115, 9166], "valid", [], "NV8"], [[9167, 9168], "valid", [], "NV8"], [[9169, 9179], "valid", [], "NV8"], [[9180, 9191], "valid", [], "NV8"], [[9192, 9192], "valid", [], "NV8"], [[9193, 9203], "valid", [], "NV8"], [[9204, 9210], "valid", [], "NV8"], [[9211, 9215], "disallowed"], [[9216, 9252], "valid", [], "NV8"], [[9253, 9254], "valid", [], "NV8"], [[9255, 9279], "disallowed"], [[9280, 9290], "valid", [], "NV8"], [[9291, 9311], "disallowed"], [[9312, 9312], "mapped", [49]], [[9313, 9313], "mapped", [50]], [[9314, 9314], "mapped", [51]], [[9315, 9315], "mapped", [52]], [[9316, 9316], "mapped", [53]], [[9317, 9317], "mapped", [54]], [[9318, 9318], "mapped", [55]], [[9319, 9319], "mapped", [56]], [[9320, 9320], "mapped", [57]], [[9321, 9321], "mapped", [49, 48]], [[9322, 9322], "mapped", [49, 49]], [[9323, 9323], "mapped", [49, 50]], [[9324, 9324], "mapped", [49, 51]], [[9325, 9325], "mapped", [49, 52]], [[9326, 9326], "mapped", [49, 53]], [[9327, 9327], "mapped", [49, 54]], [[9328, 9328], "mapped", [49, 55]], [[9329, 9329], "mapped", [49, 56]], [[9330, 9330], "mapped", [49, 57]], [[9331, 9331], "mapped", [50, 48]], [[9332, 9332], "disallowed_STD3_mapped", [40, 49, 41]], [[9333, 9333], "disallowed_STD3_mapped", [40, 50, 41]], [[9334, 9334], "disallowed_STD3_mapped", [40, 51, 41]], [[9335, 9335], "disallowed_STD3_mapped", [40, 52, 41]], [[9336, 9336], "disallowed_STD3_mapped", [40, 53, 41]], [[9337, 9337], "disallowed_STD3_mapped", [40, 54, 41]], [[9338, 9338], "disallowed_STD3_mapped", [40, 55, 41]], [[9339, 9339], "disallowed_STD3_mapped", [40, 56, 41]], [[9340, 9340], "disallowed_STD3_mapped", [40, 57, 41]], [[9341, 9341], "disallowed_STD3_mapped", [40, 49, 48, 41]], [[9342, 9342], "disallowed_STD3_mapped", [40, 49, 49, 41]], [[9343, 9343], "disallowed_STD3_mapped", [40, 49, 50, 41]], [[9344, 9344], "disallowed_STD3_mapped", [40, 49, 51, 41]], [[9345, 9345], "disallowed_STD3_mapped", [40, 49, 52, 41]], [[9346, 9346], "disallowed_STD3_mapped", [40, 49, 53, 41]], [[9347, 9347], "disallowed_STD3_mapped", [40, 49, 54, 41]], [[9348, 9348], "disallowed_STD3_mapped", [40, 49, 55, 41]], [[9349, 9349], "disallowed_STD3_mapped", [40, 49, 56, 41]], [[9350, 9350], "disallowed_STD3_mapped", [40, 49, 57, 41]], [[9351, 9351], "disallowed_STD3_mapped", [40, 50, 48, 41]], [[9352, 9371], "disallowed"], [[9372, 9372], "disallowed_STD3_mapped", [40, 97, 41]], [[9373, 9373], "disallowed_STD3_mapped", [40, 98, 41]], [[9374, 9374], "disallowed_STD3_mapped", [40, 99, 41]], [[9375, 9375], "disallowed_STD3_mapped", [40, 100, 41]], [[9376, 9376], "disallowed_STD3_mapped", [40, 101, 41]], [[9377, 9377], "disallowed_STD3_mapped", [40, 102, 41]], [[9378, 9378], "disallowed_STD3_mapped", [40, 103, 41]], [[9379, 9379], "disallowed_STD3_mapped", [40, 104, 41]], [[9380, 9380], "disallowed_STD3_mapped", [40, 105, 41]], [[9381, 9381], "disallowed_STD3_mapped", [40, 106, 41]], [[9382, 9382], "disallowed_STD3_mapped", [40, 107, 41]], [[9383, 9383], "disallowed_STD3_mapped", [40, 108, 41]], [[9384, 9384], "disallowed_STD3_mapped", [40, 109, 41]], [[9385, 9385], "disallowed_STD3_mapped", [40, 110, 41]], [[9386, 9386], "disallowed_STD3_mapped", [40, 111, 41]], [[9387, 9387], "disallowed_STD3_mapped", [40, 112, 41]], [[9388, 9388], "disallowed_STD3_mapped", [40, 113, 41]], [[9389, 9389], "disallowed_STD3_mapped", [40, 114, 41]], [[9390, 9390], "disallowed_STD3_mapped", [40, 115, 41]], [[9391, 9391], "disallowed_STD3_mapped", [40, 116, 41]], [[9392, 9392], "disallowed_STD3_mapped", [40, 117, 41]], [[9393, 9393], "disallowed_STD3_mapped", [40, 118, 41]], [[9394, 9394], "disallowed_STD3_mapped", [40, 119, 41]], [[9395, 9395], "disallowed_STD3_mapped", [40, 120, 41]], [[9396, 9396], "disallowed_STD3_mapped", [40, 121, 41]], [[9397, 9397], "disallowed_STD3_mapped", [40, 122, 41]], [[9398, 9398], "mapped", [97]], [[9399, 9399], "mapped", [98]], [[9400, 9400], "mapped", [99]], [[9401, 9401], "mapped", [100]], [[9402, 9402], "mapped", [101]], [[9403, 9403], "mapped", [102]], [[9404, 9404], "mapped", [103]], [[9405, 9405], "mapped", [104]], [[9406, 9406], "mapped", [105]], [[9407, 9407], "mapped", [106]], [[9408, 9408], "mapped", [107]], [[9409, 9409], "mapped", [108]], [[9410, 9410], "mapped", [109]], [[9411, 9411], "mapped", [110]], [[9412, 9412], "mapped", [111]], [[9413, 9413], "mapped", [112]], [[9414, 9414], "mapped", [113]], [[9415, 9415], "mapped", [114]], [[9416, 9416], "mapped", [115]], [[9417, 9417], "mapped", [116]], [[9418, 9418], "mapped", [117]], [[9419, 9419], "mapped", [118]], [[9420, 9420], "mapped", [119]], [[9421, 9421], "mapped", [120]], [[9422, 9422], "mapped", [121]], [[9423, 9423], "mapped", [122]], [[9424, 9424], "mapped", [97]], [[9425, 9425], "mapped", [98]], [[9426, 9426], "mapped", [99]], [[9427, 9427], "mapped", [100]], [[9428, 9428], "mapped", [101]], [[9429, 9429], "mapped", [102]], [[9430, 9430], "mapped", [103]], [[9431, 9431], "mapped", [104]], [[9432, 9432], "mapped", [105]], [[9433, 9433], "mapped", [106]], [[9434, 9434], "mapped", [107]], [[9435, 9435], "mapped", [108]], [[9436, 9436], "mapped", [109]], [[9437, 9437], "mapped", [110]], [[9438, 9438], "mapped", [111]], [[9439, 9439], "mapped", [112]], [[9440, 9440], "mapped", [113]], [[9441, 9441], "mapped", [114]], [[9442, 9442], "mapped", [115]], [[9443, 9443], "mapped", [116]], [[9444, 9444], "mapped", [117]], [[9445, 9445], "mapped", [118]], [[9446, 9446], "mapped", [119]], [[9447, 9447], "mapped", [120]], [[9448, 9448], "mapped", [121]], [[9449, 9449], "mapped", [122]], [[9450, 9450], "mapped", [48]], [[9451, 9470], "valid", [], "NV8"], [[9471, 9471], "valid", [], "NV8"], [[9472, 9621], "valid", [], "NV8"], [[9622, 9631], "valid", [], "NV8"], [[9632, 9711], "valid", [], "NV8"], [[9712, 9719], "valid", [], "NV8"], [[9720, 9727], "valid", [], "NV8"], [[9728, 9747], "valid", [], "NV8"], [[9748, 9749], "valid", [], "NV8"], [[9750, 9751], "valid", [], "NV8"], [[9752, 9752], "valid", [], "NV8"], [[9753, 9753], "valid", [], "NV8"], [[9754, 9839], "valid", [], "NV8"], [[9840, 9841], "valid", [], "NV8"], [[9842, 9853], "valid", [], "NV8"], [[9854, 9855], "valid", [], "NV8"], [[9856, 9865], "valid", [], "NV8"], [[9866, 9873], "valid", [], "NV8"], [[9874, 9884], "valid", [], "NV8"], [[9885, 9885], "valid", [], "NV8"], [[9886, 9887], "valid", [], "NV8"], [[9888, 9889], "valid", [], "NV8"], [[9890, 9905], "valid", [], "NV8"], [[9906, 9906], "valid", [], "NV8"], [[9907, 9916], "valid", [], "NV8"], [[9917, 9919], "valid", [], "NV8"], [[9920, 9923], "valid", [], "NV8"], [[9924, 9933], "valid", [], "NV8"], [[9934, 9934], "valid", [], "NV8"], [[9935, 9953], "valid", [], "NV8"], [[9954, 9954], "valid", [], "NV8"], [[9955, 9955], "valid", [], "NV8"], [[9956, 9959], "valid", [], "NV8"], [[9960, 9983], "valid", [], "NV8"], [[9984, 9984], "valid", [], "NV8"], [[9985, 9988], "valid", [], "NV8"], [[9989, 9989], "valid", [], "NV8"], [[9990, 9993], "valid", [], "NV8"], [[9994, 9995], "valid", [], "NV8"], [[9996, 10023], "valid", [], "NV8"], [[10024, 10024], "valid", [], "NV8"], [[10025, 10059], "valid", [], "NV8"], [[10060, 10060], "valid", [], "NV8"], [[10061, 10061], "valid", [], "NV8"], [[10062, 10062], "valid", [], "NV8"], [[10063, 10066], "valid", [], "NV8"], [[10067, 10069], "valid", [], "NV8"], [[10070, 10070], "valid", [], "NV8"], [[10071, 10071], "valid", [], "NV8"], [[10072, 10078], "valid", [], "NV8"], [[10079, 10080], "valid", [], "NV8"], [[10081, 10087], "valid", [], "NV8"], [[10088, 10101], "valid", [], "NV8"], [[10102, 10132], "valid", [], "NV8"], [[10133, 10135], "valid", [], "NV8"], [[10136, 10159], "valid", [], "NV8"], [[10160, 10160], "valid", [], "NV8"], [[10161, 10174], "valid", [], "NV8"], [[10175, 10175], "valid", [], "NV8"], [[10176, 10182], "valid", [], "NV8"], [[10183, 10186], "valid", [], "NV8"], [[10187, 10187], "valid", [], "NV8"], [[10188, 10188], "valid", [], "NV8"], [[10189, 10189], "valid", [], "NV8"], [[10190, 10191], "valid", [], "NV8"], [[10192, 10219], "valid", [], "NV8"], [[10220, 10223], "valid", [], "NV8"], [[10224, 10239], "valid", [], "NV8"], [[10240, 10495], "valid", [], "NV8"], [[10496, 10763], "valid", [], "NV8"], [[10764, 10764], "mapped", [8747, 8747, 8747, 8747]], [[10765, 10867], "valid", [], "NV8"], [[10868, 10868], "disallowed_STD3_mapped", [58, 58, 61]], [[10869, 10869], "disallowed_STD3_mapped", [61, 61]], [[10870, 10870], "disallowed_STD3_mapped", [61, 61, 61]], [[10871, 10971], "valid", [], "NV8"], [[10972, 10972], "mapped", [10973, 824]], [[10973, 11007], "valid", [], "NV8"], [[11008, 11021], "valid", [], "NV8"], [[11022, 11027], "valid", [], "NV8"], [[11028, 11034], "valid", [], "NV8"], [[11035, 11039], "valid", [], "NV8"], [[11040, 11043], "valid", [], "NV8"], [[11044, 11084], "valid", [], "NV8"], [[11085, 11087], "valid", [], "NV8"], [[11088, 11092], "valid", [], "NV8"], [[11093, 11097], "valid", [], "NV8"], [[11098, 11123], "valid", [], "NV8"], [[11124, 11125], "disallowed"], [[11126, 11157], "valid", [], "NV8"], [[11158, 11159], "disallowed"], [[11160, 11193], "valid", [], "NV8"], [[11194, 11196], "disallowed"], [[11197, 11208], "valid", [], "NV8"], [[11209, 11209], "disallowed"], [[11210, 11217], "valid", [], "NV8"], [[11218, 11243], "disallowed"], [[11244, 11247], "valid", [], "NV8"], [[11248, 11263], "disallowed"], [[11264, 11264], "mapped", [11312]], [[11265, 11265], "mapped", [11313]], [[11266, 11266], "mapped", [11314]], [[11267, 11267], "mapped", [11315]], [[11268, 11268], "mapped", [11316]], [[11269, 11269], "mapped", [11317]], [[11270, 11270], "mapped", [11318]], [[11271, 11271], "mapped", [11319]], [[11272, 11272], "mapped", [11320]], [[11273, 11273], "mapped", [11321]], [[11274, 11274], "mapped", [11322]], [[11275, 11275], "mapped", [11323]], [[11276, 11276], "mapped", [11324]], [[11277, 11277], "mapped", [11325]], [[11278, 11278], "mapped", [11326]], [[11279, 11279], "mapped", [11327]], [[11280, 11280], "mapped", [11328]], [[11281, 11281], "mapped", [11329]], [[11282, 11282], "mapped", [11330]], [[11283, 11283], "mapped", [11331]], [[11284, 11284], "mapped", [11332]], [[11285, 11285], "mapped", [11333]], [[11286, 11286], "mapped", [11334]], [[11287, 11287], "mapped", [11335]], [[11288, 11288], "mapped", [11336]], [[11289, 11289], "mapped", [11337]], [[11290, 11290], "mapped", [11338]], [[11291, 11291], "mapped", [11339]], [[11292, 11292], "mapped", [11340]], [[11293, 11293], "mapped", [11341]], [[11294, 11294], "mapped", [11342]], [[11295, 11295], "mapped", [11343]], [[11296, 11296], "mapped", [11344]], [[11297, 11297], "mapped", [11345]], [[11298, 11298], "mapped", [11346]], [[11299, 11299], "mapped", [11347]], [[11300, 11300], "mapped", [11348]], [[11301, 11301], "mapped", [11349]], [[11302, 11302], "mapped", [11350]], [[11303, 11303], "mapped", [11351]], [[11304, 11304], "mapped", [11352]], [[11305, 11305], "mapped", [11353]], [[11306, 11306], "mapped", [11354]], [[11307, 11307], "mapped", [11355]], [[11308, 11308], "mapped", [11356]], [[11309, 11309], "mapped", [11357]], [[11310, 11310], "mapped", [11358]], [[11311, 11311], "disallowed"], [[11312, 11358], "valid"], [[11359, 11359], "disallowed"], [[11360, 11360], "mapped", [11361]], [[11361, 11361], "valid"], [[11362, 11362], "mapped", [619]], [[11363, 11363], "mapped", [7549]], [[11364, 11364], "mapped", [637]], [[11365, 11366], "valid"], [[11367, 11367], "mapped", [11368]], [[11368, 11368], "valid"], [[11369, 11369], "mapped", [11370]], [[11370, 11370], "valid"], [[11371, 11371], "mapped", [11372]], [[11372, 11372], "valid"], [[11373, 11373], "mapped", [593]], [[11374, 11374], "mapped", [625]], [[11375, 11375], "mapped", [592]], [[11376, 11376], "mapped", [594]], [[11377, 11377], "valid"], [[11378, 11378], "mapped", [11379]], [[11379, 11379], "valid"], [[11380, 11380], "valid"], [[11381, 11381], "mapped", [11382]], [[11382, 11383], "valid"], [[11384, 11387], "valid"], [[11388, 11388], "mapped", [106]], [[11389, 11389], "mapped", [118]], [[11390, 11390], "mapped", [575]], [[11391, 11391], "mapped", [576]], [[11392, 11392], "mapped", [11393]], [[11393, 11393], "valid"], [[11394, 11394], "mapped", [11395]], [[11395, 11395], "valid"], [[11396, 11396], "mapped", [11397]], [[11397, 11397], "valid"], [[11398, 11398], "mapped", [11399]], [[11399, 11399], "valid"], [[11400, 11400], "mapped", [11401]], [[11401, 11401], "valid"], [[11402, 11402], "mapped", [11403]], [[11403, 11403], "valid"], [[11404, 11404], "mapped", [11405]], [[11405, 11405], "valid"], [[11406, 11406], "mapped", [11407]], [[11407, 11407], "valid"], [[11408, 11408], "mapped", [11409]], [[11409, 11409], "valid"], [[11410, 11410], "mapped", [11411]], [[11411, 11411], "valid"], [[11412, 11412], "mapped", [11413]], [[11413, 11413], "valid"], [[11414, 11414], "mapped", [11415]], [[11415, 11415], "valid"], [[11416, 11416], "mapped", [11417]], [[11417, 11417], "valid"], [[11418, 11418], "mapped", [11419]], [[11419, 11419], "valid"], [[11420, 11420], "mapped", [11421]], [[11421, 11421], "valid"], [[11422, 11422], "mapped", [11423]], [[11423, 11423], "valid"], [[11424, 11424], "mapped", [11425]], [[11425, 11425], "valid"], [[11426, 11426], "mapped", [11427]], [[11427, 11427], "valid"], [[11428, 11428], "mapped", [11429]], [[11429, 11429], "valid"], [[11430, 11430], "mapped", [11431]], [[11431, 11431], "valid"], [[11432, 11432], "mapped", [11433]], [[11433, 11433], "valid"], [[11434, 11434], "mapped", [11435]], [[11435, 11435], "valid"], [[11436, 11436], "mapped", [11437]], [[11437, 11437], "valid"], [[11438, 11438], "mapped", [11439]], [[11439, 11439], "valid"], [[11440, 11440], "mapped", [11441]], [[11441, 11441], "valid"], [[11442, 11442], "mapped", [11443]], [[11443, 11443], "valid"], [[11444, 11444], "mapped", [11445]], [[11445, 11445], "valid"], [[11446, 11446], "mapped", [11447]], [[11447, 11447], "valid"], [[11448, 11448], "mapped", [11449]], [[11449, 11449], "valid"], [[11450, 11450], "mapped", [11451]], [[11451, 11451], "valid"], [[11452, 11452], "mapped", [11453]], [[11453, 11453], "valid"], [[11454, 11454], "mapped", [11455]], [[11455, 11455], "valid"], [[11456, 11456], "mapped", [11457]], [[11457, 11457], "valid"], [[11458, 11458], "mapped", [11459]], [[11459, 11459], "valid"], [[11460, 11460], "mapped", [11461]], [[11461, 11461], "valid"], [[11462, 11462], "mapped", [11463]], [[11463, 11463], "valid"], [[11464, 11464], "mapped", [11465]], [[11465, 11465], "valid"], [[11466, 11466], "mapped", [11467]], [[11467, 11467], "valid"], [[11468, 11468], "mapped", [11469]], [[11469, 11469], "valid"], [[11470, 11470], "mapped", [11471]], [[11471, 11471], "valid"], [[11472, 11472], "mapped", [11473]], [[11473, 11473], "valid"], [[11474, 11474], "mapped", [11475]], [[11475, 11475], "valid"], [[11476, 11476], "mapped", [11477]], [[11477, 11477], "valid"], [[11478, 11478], "mapped", [11479]], [[11479, 11479], "valid"], [[11480, 11480], "mapped", [11481]], [[11481, 11481], "valid"], [[11482, 11482], "mapped", [11483]], [[11483, 11483], "valid"], [[11484, 11484], "mapped", [11485]], [[11485, 11485], "valid"], [[11486, 11486], "mapped", [11487]], [[11487, 11487], "valid"], [[11488, 11488], "mapped", [11489]], [[11489, 11489], "valid"], [[11490, 11490], "mapped", [11491]], [[11491, 11492], "valid"], [[11493, 11498], "valid", [], "NV8"], [[11499, 11499], "mapped", [11500]], [[11500, 11500], "valid"], [[11501, 11501], "mapped", [11502]], [[11502, 11505], "valid"], [[11506, 11506], "mapped", [11507]], [[11507, 11507], "valid"], [[11508, 11512], "disallowed"], [[11513, 11519], "valid", [], "NV8"], [[11520, 11557], "valid"], [[11558, 11558], "disallowed"], [[11559, 11559], "valid"], [[11560, 11564], "disallowed"], [[11565, 11565], "valid"], [[11566, 11567], "disallowed"], [[11568, 11621], "valid"], [[11622, 11623], "valid"], [[11624, 11630], "disallowed"], [[11631, 11631], "mapped", [11617]], [[11632, 11632], "valid", [], "NV8"], [[11633, 11646], "disallowed"], [[11647, 11647], "valid"], [[11648, 11670], "valid"], [[11671, 11679], "disallowed"], [[11680, 11686], "valid"], [[11687, 11687], "disallowed"], [[11688, 11694], "valid"], [[11695, 11695], "disallowed"], [[11696, 11702], "valid"], [[11703, 11703], "disallowed"], [[11704, 11710], "valid"], [[11711, 11711], "disallowed"], [[11712, 11718], "valid"], [[11719, 11719], "disallowed"], [[11720, 11726], "valid"], [[11727, 11727], "disallowed"], [[11728, 11734], "valid"], [[11735, 11735], "disallowed"], [[11736, 11742], "valid"], [[11743, 11743], "disallowed"], [[11744, 11775], "valid"], [[11776, 11799], "valid", [], "NV8"], [[11800, 11803], "valid", [], "NV8"], [[11804, 11805], "valid", [], "NV8"], [[11806, 11822], "valid", [], "NV8"], [[11823, 11823], "valid"], [[11824, 11824], "valid", [], "NV8"], [[11825, 11825], "valid", [], "NV8"], [[11826, 11835], "valid", [], "NV8"], [[11836, 11842], "valid", [], "NV8"], [[11843, 11903], "disallowed"], [[11904, 11929], "valid", [], "NV8"], [[11930, 11930], "disallowed"], [[11931, 11934], "valid", [], "NV8"], [[11935, 11935], "mapped", [27597]], [[11936, 12018], "valid", [], "NV8"], [[12019, 12019], "mapped", [40863]], [[12020, 12031], "disallowed"], [[12032, 12032], "mapped", [19968]], [[12033, 12033], "mapped", [20008]], [[12034, 12034], "mapped", [20022]], [[12035, 12035], "mapped", [20031]], [[12036, 12036], "mapped", [20057]], [[12037, 12037], "mapped", [20101]], [[12038, 12038], "mapped", [20108]], [[12039, 12039], "mapped", [20128]], [[12040, 12040], "mapped", [20154]], [[12041, 12041], "mapped", [20799]], [[12042, 12042], "mapped", [20837]], [[12043, 12043], "mapped", [20843]], [[12044, 12044], "mapped", [20866]], [[12045, 12045], "mapped", [20886]], [[12046, 12046], "mapped", [20907]], [[12047, 12047], "mapped", [20960]], [[12048, 12048], "mapped", [20981]], [[12049, 12049], "mapped", [20992]], [[12050, 12050], "mapped", [21147]], [[12051, 12051], "mapped", [21241]], [[12052, 12052], "mapped", [21269]], [[12053, 12053], "mapped", [21274]], [[12054, 12054], "mapped", [21304]], [[12055, 12055], "mapped", [21313]], [[12056, 12056], "mapped", [21340]], [[12057, 12057], "mapped", [21353]], [[12058, 12058], "mapped", [21378]], [[12059, 12059], "mapped", [21430]], [[12060, 12060], "mapped", [21448]], [[12061, 12061], "mapped", [21475]], [[12062, 12062], "mapped", [22231]], [[12063, 12063], "mapped", [22303]], [[12064, 12064], "mapped", [22763]], [[12065, 12065], "mapped", [22786]], [[12066, 12066], "mapped", [22794]], [[12067, 12067], "mapped", [22805]], [[12068, 12068], "mapped", [22823]], [[12069, 12069], "mapped", [22899]], [[12070, 12070], "mapped", [23376]], [[12071, 12071], "mapped", [23424]], [[12072, 12072], "mapped", [23544]], [[12073, 12073], "mapped", [23567]], [[12074, 12074], "mapped", [23586]], [[12075, 12075], "mapped", [23608]], [[12076, 12076], "mapped", [23662]], [[12077, 12077], "mapped", [23665]], [[12078, 12078], "mapped", [24027]], [[12079, 12079], "mapped", [24037]], [[12080, 12080], "mapped", [24049]], [[12081, 12081], "mapped", [24062]], [[12082, 12082], "mapped", [24178]], [[12083, 12083], "mapped", [24186]], [[12084, 12084], "mapped", [24191]], [[12085, 12085], "mapped", [24308]], [[12086, 12086], "mapped", [24318]], [[12087, 12087], "mapped", [24331]], [[12088, 12088], "mapped", [24339]], [[12089, 12089], "mapped", [24400]], [[12090, 12090], "mapped", [24417]], [[12091, 12091], "mapped", [24435]], [[12092, 12092], "mapped", [24515]], [[12093, 12093], "mapped", [25096]], [[12094, 12094], "mapped", [25142]], [[12095, 12095], "mapped", [25163]], [[12096, 12096], "mapped", [25903]], [[12097, 12097], "mapped", [25908]], [[12098, 12098], "mapped", [25991]], [[12099, 12099], "mapped", [26007]], [[12100, 12100], "mapped", [26020]], [[12101, 12101], "mapped", [26041]], [[12102, 12102], "mapped", [26080]], [[12103, 12103], "mapped", [26085]], [[12104, 12104], "mapped", [26352]], [[12105, 12105], "mapped", [26376]], [[12106, 12106], "mapped", [26408]], [[12107, 12107], "mapped", [27424]], [[12108, 12108], "mapped", [27490]], [[12109, 12109], "mapped", [27513]], [[12110, 12110], "mapped", [27571]], [[12111, 12111], "mapped", [27595]], [[12112, 12112], "mapped", [27604]], [[12113, 12113], "mapped", [27611]], [[12114, 12114], "mapped", [27663]], [[12115, 12115], "mapped", [27668]], [[12116, 12116], "mapped", [27700]], [[12117, 12117], "mapped", [28779]], [[12118, 12118], "mapped", [29226]], [[12119, 12119], "mapped", [29238]], [[12120, 12120], "mapped", [29243]], [[12121, 12121], "mapped", [29247]], [[12122, 12122], "mapped", [29255]], [[12123, 12123], "mapped", [29273]], [[12124, 12124], "mapped", [29275]], [[12125, 12125], "mapped", [29356]], [[12126, 12126], "mapped", [29572]], [[12127, 12127], "mapped", [29577]], [[12128, 12128], "mapped", [29916]], [[12129, 12129], "mapped", [29926]], [[12130, 12130], "mapped", [29976]], [[12131, 12131], "mapped", [29983]], [[12132, 12132], "mapped", [29992]], [[12133, 12133], "mapped", [3e4]], [[12134, 12134], "mapped", [30091]], [[12135, 12135], "mapped", [30098]], [[12136, 12136], "mapped", [30326]], [[12137, 12137], "mapped", [30333]], [[12138, 12138], "mapped", [30382]], [[12139, 12139], "mapped", [30399]], [[12140, 12140], "mapped", [30446]], [[12141, 12141], "mapped", [30683]], [[12142, 12142], "mapped", [30690]], [[12143, 12143], "mapped", [30707]], [[12144, 12144], "mapped", [31034]], [[12145, 12145], "mapped", [31160]], [[12146, 12146], "mapped", [31166]], [[12147, 12147], "mapped", [31348]], [[12148, 12148], "mapped", [31435]], [[12149, 12149], "mapped", [31481]], [[12150, 12150], "mapped", [31859]], [[12151, 12151], "mapped", [31992]], [[12152, 12152], "mapped", [32566]], [[12153, 12153], "mapped", [32593]], [[12154, 12154], "mapped", [32650]], [[12155, 12155], "mapped", [32701]], [[12156, 12156], "mapped", [32769]], [[12157, 12157], "mapped", [32780]], [[12158, 12158], "mapped", [32786]], [[12159, 12159], "mapped", [32819]], [[12160, 12160], "mapped", [32895]], [[12161, 12161], "mapped", [32905]], [[12162, 12162], "mapped", [33251]], [[12163, 12163], "mapped", [33258]], [[12164, 12164], "mapped", [33267]], [[12165, 12165], "mapped", [33276]], [[12166, 12166], "mapped", [33292]], [[12167, 12167], "mapped", [33307]], [[12168, 12168], "mapped", [33311]], [[12169, 12169], "mapped", [33390]], [[12170, 12170], "mapped", [33394]], [[12171, 12171], "mapped", [33400]], [[12172, 12172], "mapped", [34381]], [[12173, 12173], "mapped", [34411]], [[12174, 12174], "mapped", [34880]], [[12175, 12175], "mapped", [34892]], [[12176, 12176], "mapped", [34915]], [[12177, 12177], "mapped", [35198]], [[12178, 12178], "mapped", [35211]], [[12179, 12179], "mapped", [35282]], [[12180, 12180], "mapped", [35328]], [[12181, 12181], "mapped", [35895]], [[12182, 12182], "mapped", [35910]], [[12183, 12183], "mapped", [35925]], [[12184, 12184], "mapped", [35960]], [[12185, 12185], "mapped", [35997]], [[12186, 12186], "mapped", [36196]], [[12187, 12187], "mapped", [36208]], [[12188, 12188], "mapped", [36275]], [[12189, 12189], "mapped", [36523]], [[12190, 12190], "mapped", [36554]], [[12191, 12191], "mapped", [36763]], [[12192, 12192], "mapped", [36784]], [[12193, 12193], "mapped", [36789]], [[12194, 12194], "mapped", [37009]], [[12195, 12195], "mapped", [37193]], [[12196, 12196], "mapped", [37318]], [[12197, 12197], "mapped", [37324]], [[12198, 12198], "mapped", [37329]], [[12199, 12199], "mapped", [38263]], [[12200, 12200], "mapped", [38272]], [[12201, 12201], "mapped", [38428]], [[12202, 12202], "mapped", [38582]], [[12203, 12203], "mapped", [38585]], [[12204, 12204], "mapped", [38632]], [[12205, 12205], "mapped", [38737]], [[12206, 12206], "mapped", [38750]], [[12207, 12207], "mapped", [38754]], [[12208, 12208], "mapped", [38761]], [[12209, 12209], "mapped", [38859]], [[12210, 12210], "mapped", [38893]], [[12211, 12211], "mapped", [38899]], [[12212, 12212], "mapped", [38913]], [[12213, 12213], "mapped", [39080]], [[12214, 12214], "mapped", [39131]], [[12215, 12215], "mapped", [39135]], [[12216, 12216], "mapped", [39318]], [[12217, 12217], "mapped", [39321]], [[12218, 12218], "mapped", [39340]], [[12219, 12219], "mapped", [39592]], [[12220, 12220], "mapped", [39640]], [[12221, 12221], "mapped", [39647]], [[12222, 12222], "mapped", [39717]], [[12223, 12223], "mapped", [39727]], [[12224, 12224], "mapped", [39730]], [[12225, 12225], "mapped", [39740]], [[12226, 12226], "mapped", [39770]], [[12227, 12227], "mapped", [40165]], [[12228, 12228], "mapped", [40565]], [[12229, 12229], "mapped", [40575]], [[12230, 12230], "mapped", [40613]], [[12231, 12231], "mapped", [40635]], [[12232, 12232], "mapped", [40643]], [[12233, 12233], "mapped", [40653]], [[12234, 12234], "mapped", [40657]], [[12235, 12235], "mapped", [40697]], [[12236, 12236], "mapped", [40701]], [[12237, 12237], "mapped", [40718]], [[12238, 12238], "mapped", [40723]], [[12239, 12239], "mapped", [40736]], [[12240, 12240], "mapped", [40763]], [[12241, 12241], "mapped", [40778]], [[12242, 12242], "mapped", [40786]], [[12243, 12243], "mapped", [40845]], [[12244, 12244], "mapped", [40860]], [[12245, 12245], "mapped", [40864]], [[12246, 12271], "disallowed"], [[12272, 12283], "disallowed"], [[12284, 12287], "disallowed"], [[12288, 12288], "disallowed_STD3_mapped", [32]], [[12289, 12289], "valid", [], "NV8"], [[12290, 12290], "mapped", [46]], [[12291, 12292], "valid", [], "NV8"], [[12293, 12295], "valid"], [[12296, 12329], "valid", [], "NV8"], [[12330, 12333], "valid"], [[12334, 12341], "valid", [], "NV8"], [[12342, 12342], "mapped", [12306]], [[12343, 12343], "valid", [], "NV8"], [[12344, 12344], "mapped", [21313]], [[12345, 12345], "mapped", [21316]], [[12346, 12346], "mapped", [21317]], [[12347, 12347], "valid", [], "NV8"], [[12348, 12348], "valid"], [[12349, 12349], "valid", [], "NV8"], [[12350, 12350], "valid", [], "NV8"], [[12351, 12351], "valid", [], "NV8"], [[12352, 12352], "disallowed"], [[12353, 12436], "valid"], [[12437, 12438], "valid"], [[12439, 12440], "disallowed"], [[12441, 12442], "valid"], [[12443, 12443], "disallowed_STD3_mapped", [32, 12441]], [[12444, 12444], "disallowed_STD3_mapped", [32, 12442]], [[12445, 12446], "valid"], [[12447, 12447], "mapped", [12424, 12426]], [[12448, 12448], "valid", [], "NV8"], [[12449, 12542], "valid"], [[12543, 12543], "mapped", [12467, 12488]], [[12544, 12548], "disallowed"], [[12549, 12588], "valid"], [[12589, 12589], "valid"], [[12590, 12592], "disallowed"], [[12593, 12593], "mapped", [4352]], [[12594, 12594], "mapped", [4353]], [[12595, 12595], "mapped", [4522]], [[12596, 12596], "mapped", [4354]], [[12597, 12597], "mapped", [4524]], [[12598, 12598], "mapped", [4525]], [[12599, 12599], "mapped", [4355]], [[12600, 12600], "mapped", [4356]], [[12601, 12601], "mapped", [4357]], [[12602, 12602], "mapped", [4528]], [[12603, 12603], "mapped", [4529]], [[12604, 12604], "mapped", [4530]], [[12605, 12605], "mapped", [4531]], [[12606, 12606], "mapped", [4532]], [[12607, 12607], "mapped", [4533]], [[12608, 12608], "mapped", [4378]], [[12609, 12609], "mapped", [4358]], [[12610, 12610], "mapped", [4359]], [[12611, 12611], "mapped", [4360]], [[12612, 12612], "mapped", [4385]], [[12613, 12613], "mapped", [4361]], [[12614, 12614], "mapped", [4362]], [[12615, 12615], "mapped", [4363]], [[12616, 12616], "mapped", [4364]], [[12617, 12617], "mapped", [4365]], [[12618, 12618], "mapped", [4366]], [[12619, 12619], "mapped", [4367]], [[12620, 12620], "mapped", [4368]], [[12621, 12621], "mapped", [4369]], [[12622, 12622], "mapped", [4370]], [[12623, 12623], "mapped", [4449]], [[12624, 12624], "mapped", [4450]], [[12625, 12625], "mapped", [4451]], [[12626, 12626], "mapped", [4452]], [[12627, 12627], "mapped", [4453]], [[12628, 12628], "mapped", [4454]], [[12629, 12629], "mapped", [4455]], [[12630, 12630], "mapped", [4456]], [[12631, 12631], "mapped", [4457]], [[12632, 12632], "mapped", [4458]], [[12633, 12633], "mapped", [4459]], [[12634, 12634], "mapped", [4460]], [[12635, 12635], "mapped", [4461]], [[12636, 12636], "mapped", [4462]], [[12637, 12637], "mapped", [4463]], [[12638, 12638], "mapped", [4464]], [[12639, 12639], "mapped", [4465]], [[12640, 12640], "mapped", [4466]], [[12641, 12641], "mapped", [4467]], [[12642, 12642], "mapped", [4468]], [[12643, 12643], "mapped", [4469]], [[12644, 12644], "disallowed"], [[12645, 12645], "mapped", [4372]], [[12646, 12646], "mapped", [4373]], [[12647, 12647], "mapped", [4551]], [[12648, 12648], "mapped", [4552]], [[12649, 12649], "mapped", [4556]], [[12650, 12650], "mapped", [4558]], [[12651, 12651], "mapped", [4563]], [[12652, 12652], "mapped", [4567]], [[12653, 12653], "mapped", [4569]], [[12654, 12654], "mapped", [4380]], [[12655, 12655], "mapped", [4573]], [[12656, 12656], "mapped", [4575]], [[12657, 12657], "mapped", [4381]], [[12658, 12658], "mapped", [4382]], [[12659, 12659], "mapped", [4384]], [[12660, 12660], "mapped", [4386]], [[12661, 12661], "mapped", [4387]], [[12662, 12662], "mapped", [4391]], [[12663, 12663], "mapped", [4393]], [[12664, 12664], "mapped", [4395]], [[12665, 12665], "mapped", [4396]], [[12666, 12666], "mapped", [4397]], [[12667, 12667], "mapped", [4398]], [[12668, 12668], "mapped", [4399]], [[12669, 12669], "mapped", [4402]], [[12670, 12670], "mapped", [4406]], [[12671, 12671], "mapped", [4416]], [[12672, 12672], "mapped", [4423]], [[12673, 12673], "mapped", [4428]], [[12674, 12674], "mapped", [4593]], [[12675, 12675], "mapped", [4594]], [[12676, 12676], "mapped", [4439]], [[12677, 12677], "mapped", [4440]], [[12678, 12678], "mapped", [4441]], [[12679, 12679], "mapped", [4484]], [[12680, 12680], "mapped", [4485]], [[12681, 12681], "mapped", [4488]], [[12682, 12682], "mapped", [4497]], [[12683, 12683], "mapped", [4498]], [[12684, 12684], "mapped", [4500]], [[12685, 12685], "mapped", [4510]], [[12686, 12686], "mapped", [4513]], [[12687, 12687], "disallowed"], [[12688, 12689], "valid", [], "NV8"], [[12690, 12690], "mapped", [19968]], [[12691, 12691], "mapped", [20108]], [[12692, 12692], "mapped", [19977]], [[12693, 12693], "mapped", [22235]], [[12694, 12694], "mapped", [19978]], [[12695, 12695], "mapped", [20013]], [[12696, 12696], "mapped", [19979]], [[12697, 12697], "mapped", [30002]], [[12698, 12698], "mapped", [20057]], [[12699, 12699], "mapped", [19993]], [[12700, 12700], "mapped", [19969]], [[12701, 12701], "mapped", [22825]], [[12702, 12702], "mapped", [22320]], [[12703, 12703], "mapped", [20154]], [[12704, 12727], "valid"], [[12728, 12730], "valid"], [[12731, 12735], "disallowed"], [[12736, 12751], "valid", [], "NV8"], [[12752, 12771], "valid", [], "NV8"], [[12772, 12783], "disallowed"], [[12784, 12799], "valid"], [[12800, 12800], "disallowed_STD3_mapped", [40, 4352, 41]], [[12801, 12801], "disallowed_STD3_mapped", [40, 4354, 41]], [[12802, 12802], "disallowed_STD3_mapped", [40, 4355, 41]], [[12803, 12803], "disallowed_STD3_mapped", [40, 4357, 41]], [[12804, 12804], "disallowed_STD3_mapped", [40, 4358, 41]], [[12805, 12805], "disallowed_STD3_mapped", [40, 4359, 41]], [[12806, 12806], "disallowed_STD3_mapped", [40, 4361, 41]], [[12807, 12807], "disallowed_STD3_mapped", [40, 4363, 41]], [[12808, 12808], "disallowed_STD3_mapped", [40, 4364, 41]], [[12809, 12809], "disallowed_STD3_mapped", [40, 4366, 41]], [[12810, 12810], "disallowed_STD3_mapped", [40, 4367, 41]], [[12811, 12811], "disallowed_STD3_mapped", [40, 4368, 41]], [[12812, 12812], "disallowed_STD3_mapped", [40, 4369, 41]], [[12813, 12813], "disallowed_STD3_mapped", [40, 4370, 41]], [[12814, 12814], "disallowed_STD3_mapped", [40, 44032, 41]], [[12815, 12815], "disallowed_STD3_mapped", [40, 45208, 41]], [[12816, 12816], "disallowed_STD3_mapped", [40, 45796, 41]], [[12817, 12817], "disallowed_STD3_mapped", [40, 46972, 41]], [[12818, 12818], "disallowed_STD3_mapped", [40, 47560, 41]], [[12819, 12819], "disallowed_STD3_mapped", [40, 48148, 41]], [[12820, 12820], "disallowed_STD3_mapped", [40, 49324, 41]], [[12821, 12821], "disallowed_STD3_mapped", [40, 50500, 41]], [[12822, 12822], "disallowed_STD3_mapped", [40, 51088, 41]], [[12823, 12823], "disallowed_STD3_mapped", [40, 52264, 41]], [[12824, 12824], "disallowed_STD3_mapped", [40, 52852, 41]], [[12825, 12825], "disallowed_STD3_mapped", [40, 53440, 41]], [[12826, 12826], "disallowed_STD3_mapped", [40, 54028, 41]], [[12827, 12827], "disallowed_STD3_mapped", [40, 54616, 41]], [[12828, 12828], "disallowed_STD3_mapped", [40, 51452, 41]], [[12829, 12829], "disallowed_STD3_mapped", [40, 50724, 51204, 41]], [[12830, 12830], "disallowed_STD3_mapped", [40, 50724, 54980, 41]], [[12831, 12831], "disallowed"], [[12832, 12832], "disallowed_STD3_mapped", [40, 19968, 41]], [[12833, 12833], "disallowed_STD3_mapped", [40, 20108, 41]], [[12834, 12834], "disallowed_STD3_mapped", [40, 19977, 41]], [[12835, 12835], "disallowed_STD3_mapped", [40, 22235, 41]], [[12836, 12836], "disallowed_STD3_mapped", [40, 20116, 41]], [[12837, 12837], "disallowed_STD3_mapped", [40, 20845, 41]], [[12838, 12838], "disallowed_STD3_mapped", [40, 19971, 41]], [[12839, 12839], "disallowed_STD3_mapped", [40, 20843, 41]], [[12840, 12840], "disallowed_STD3_mapped", [40, 20061, 41]], [[12841, 12841], "disallowed_STD3_mapped", [40, 21313, 41]], [[12842, 12842], "disallowed_STD3_mapped", [40, 26376, 41]], [[12843, 12843], "disallowed_STD3_mapped", [40, 28779, 41]], [[12844, 12844], "disallowed_STD3_mapped", [40, 27700, 41]], [[12845, 12845], "disallowed_STD3_mapped", [40, 26408, 41]], [[12846, 12846], "disallowed_STD3_mapped", [40, 37329, 41]], [[12847, 12847], "disallowed_STD3_mapped", [40, 22303, 41]], [[12848, 12848], "disallowed_STD3_mapped", [40, 26085, 41]], [[12849, 12849], "disallowed_STD3_mapped", [40, 26666, 41]], [[12850, 12850], "disallowed_STD3_mapped", [40, 26377, 41]], [[12851, 12851], "disallowed_STD3_mapped", [40, 31038, 41]], [[12852, 12852], "disallowed_STD3_mapped", [40, 21517, 41]], [[12853, 12853], "disallowed_STD3_mapped", [40, 29305, 41]], [[12854, 12854], "disallowed_STD3_mapped", [40, 36001, 41]], [[12855, 12855], "disallowed_STD3_mapped", [40, 31069, 41]], [[12856, 12856], "disallowed_STD3_mapped", [40, 21172, 41]], [[12857, 12857], "disallowed_STD3_mapped", [40, 20195, 41]], [[12858, 12858], "disallowed_STD3_mapped", [40, 21628, 41]], [[12859, 12859], "disallowed_STD3_mapped", [40, 23398, 41]], [[12860, 12860], "disallowed_STD3_mapped", [40, 30435, 41]], [[12861, 12861], "disallowed_STD3_mapped", [40, 20225, 41]], [[12862, 12862], "disallowed_STD3_mapped", [40, 36039, 41]], [[12863, 12863], "disallowed_STD3_mapped", [40, 21332, 41]], [[12864, 12864], "disallowed_STD3_mapped", [40, 31085, 41]], [[12865, 12865], "disallowed_STD3_mapped", [40, 20241, 41]], [[12866, 12866], "disallowed_STD3_mapped", [40, 33258, 41]], [[12867, 12867], "disallowed_STD3_mapped", [40, 33267, 41]], [[12868, 12868], "mapped", [21839]], [[12869, 12869], "mapped", [24188]], [[12870, 12870], "mapped", [25991]], [[12871, 12871], "mapped", [31631]], [[12872, 12879], "valid", [], "NV8"], [[12880, 12880], "mapped", [112, 116, 101]], [[12881, 12881], "mapped", [50, 49]], [[12882, 12882], "mapped", [50, 50]], [[12883, 12883], "mapped", [50, 51]], [[12884, 12884], "mapped", [50, 52]], [[12885, 12885], "mapped", [50, 53]], [[12886, 12886], "mapped", [50, 54]], [[12887, 12887], "mapped", [50, 55]], [[12888, 12888], "mapped", [50, 56]], [[12889, 12889], "mapped", [50, 57]], [[12890, 12890], "mapped", [51, 48]], [[12891, 12891], "mapped", [51, 49]], [[12892, 12892], "mapped", [51, 50]], [[12893, 12893], "mapped", [51, 51]], [[12894, 12894], "mapped", [51, 52]], [[12895, 12895], "mapped", [51, 53]], [[12896, 12896], "mapped", [4352]], [[12897, 12897], "mapped", [4354]], [[12898, 12898], "mapped", [4355]], [[12899, 12899], "mapped", [4357]], [[12900, 12900], "mapped", [4358]], [[12901, 12901], "mapped", [4359]], [[12902, 12902], "mapped", [4361]], [[12903, 12903], "mapped", [4363]], [[12904, 12904], "mapped", [4364]], [[12905, 12905], "mapped", [4366]], [[12906, 12906], "mapped", [4367]], [[12907, 12907], "mapped", [4368]], [[12908, 12908], "mapped", [4369]], [[12909, 12909], "mapped", [4370]], [[12910, 12910], "mapped", [44032]], [[12911, 12911], "mapped", [45208]], [[12912, 12912], "mapped", [45796]], [[12913, 12913], "mapped", [46972]], [[12914, 12914], "mapped", [47560]], [[12915, 12915], "mapped", [48148]], [[12916, 12916], "mapped", [49324]], [[12917, 12917], "mapped", [50500]], [[12918, 12918], "mapped", [51088]], [[12919, 12919], "mapped", [52264]], [[12920, 12920], "mapped", [52852]], [[12921, 12921], "mapped", [53440]], [[12922, 12922], "mapped", [54028]], [[12923, 12923], "mapped", [54616]], [[12924, 12924], "mapped", [52280, 44256]], [[12925, 12925], "mapped", [51452, 51032]], [[12926, 12926], "mapped", [50864]], [[12927, 12927], "valid", [], "NV8"], [[12928, 12928], "mapped", [19968]], [[12929, 12929], "mapped", [20108]], [[12930, 12930], "mapped", [19977]], [[12931, 12931], "mapped", [22235]], [[12932, 12932], "mapped", [20116]], [[12933, 12933], "mapped", [20845]], [[12934, 12934], "mapped", [19971]], [[12935, 12935], "mapped", [20843]], [[12936, 12936], "mapped", [20061]], [[12937, 12937], "mapped", [21313]], [[12938, 12938], "mapped", [26376]], [[12939, 12939], "mapped", [28779]], [[12940, 12940], "mapped", [27700]], [[12941, 12941], "mapped", [26408]], [[12942, 12942], "mapped", [37329]], [[12943, 12943], "mapped", [22303]], [[12944, 12944], "mapped", [26085]], [[12945, 12945], "mapped", [26666]], [[12946, 12946], "mapped", [26377]], [[12947, 12947], "mapped", [31038]], [[12948, 12948], "mapped", [21517]], [[12949, 12949], "mapped", [29305]], [[12950, 12950], "mapped", [36001]], [[12951, 12951], "mapped", [31069]], [[12952, 12952], "mapped", [21172]], [[12953, 12953], "mapped", [31192]], [[12954, 12954], "mapped", [30007]], [[12955, 12955], "mapped", [22899]], [[12956, 12956], "mapped", [36969]], [[12957, 12957], "mapped", [20778]], [[12958, 12958], "mapped", [21360]], [[12959, 12959], "mapped", [27880]], [[12960, 12960], "mapped", [38917]], [[12961, 12961], "mapped", [20241]], [[12962, 12962], "mapped", [20889]], [[12963, 12963], "mapped", [27491]], [[12964, 12964], "mapped", [19978]], [[12965, 12965], "mapped", [20013]], [[12966, 12966], "mapped", [19979]], [[12967, 12967], "mapped", [24038]], [[12968, 12968], "mapped", [21491]], [[12969, 12969], "mapped", [21307]], [[12970, 12970], "mapped", [23447]], [[12971, 12971], "mapped", [23398]], [[12972, 12972], "mapped", [30435]], [[12973, 12973], "mapped", [20225]], [[12974, 12974], "mapped", [36039]], [[12975, 12975], "mapped", [21332]], [[12976, 12976], "mapped", [22812]], [[12977, 12977], "mapped", [51, 54]], [[12978, 12978], "mapped", [51, 55]], [[12979, 12979], "mapped", [51, 56]], [[12980, 12980], "mapped", [51, 57]], [[12981, 12981], "mapped", [52, 48]], [[12982, 12982], "mapped", [52, 49]], [[12983, 12983], "mapped", [52, 50]], [[12984, 12984], "mapped", [52, 51]], [[12985, 12985], "mapped", [52, 52]], [[12986, 12986], "mapped", [52, 53]], [[12987, 12987], "mapped", [52, 54]], [[12988, 12988], "mapped", [52, 55]], [[12989, 12989], "mapped", [52, 56]], [[12990, 12990], "mapped", [52, 57]], [[12991, 12991], "mapped", [53, 48]], [[12992, 12992], "mapped", [49, 26376]], [[12993, 12993], "mapped", [50, 26376]], [[12994, 12994], "mapped", [51, 26376]], [[12995, 12995], "mapped", [52, 26376]], [[12996, 12996], "mapped", [53, 26376]], [[12997, 12997], "mapped", [54, 26376]], [[12998, 12998], "mapped", [55, 26376]], [[12999, 12999], "mapped", [56, 26376]], [[13e3, 13e3], "mapped", [57, 26376]], [[13001, 13001], "mapped", [49, 48, 26376]], [[13002, 13002], "mapped", [49, 49, 26376]], [[13003, 13003], "mapped", [49, 50, 26376]], [[13004, 13004], "mapped", [104, 103]], [[13005, 13005], "mapped", [101, 114, 103]], [[13006, 13006], "mapped", [101, 118]], [[13007, 13007], "mapped", [108, 116, 100]], [[13008, 13008], "mapped", [12450]], [[13009, 13009], "mapped", [12452]], [[13010, 13010], "mapped", [12454]], [[13011, 13011], "mapped", [12456]], [[13012, 13012], "mapped", [12458]], [[13013, 13013], "mapped", [12459]], [[13014, 13014], "mapped", [12461]], [[13015, 13015], "mapped", [12463]], [[13016, 13016], "mapped", [12465]], [[13017, 13017], "mapped", [12467]], [[13018, 13018], "mapped", [12469]], [[13019, 13019], "mapped", [12471]], [[13020, 13020], "mapped", [12473]], [[13021, 13021], "mapped", [12475]], [[13022, 13022], "mapped", [12477]], [[13023, 13023], "mapped", [12479]], [[13024, 13024], "mapped", [12481]], [[13025, 13025], "mapped", [12484]], [[13026, 13026], "mapped", [12486]], [[13027, 13027], "mapped", [12488]], [[13028, 13028], "mapped", [12490]], [[13029, 13029], "mapped", [12491]], [[13030, 13030], "mapped", [12492]], [[13031, 13031], "mapped", [12493]], [[13032, 13032], "mapped", [12494]], [[13033, 13033], "mapped", [12495]], [[13034, 13034], "mapped", [12498]], [[13035, 13035], "mapped", [12501]], [[13036, 13036], "mapped", [12504]], [[13037, 13037], "mapped", [12507]], [[13038, 13038], "mapped", [12510]], [[13039, 13039], "mapped", [12511]], [[13040, 13040], "mapped", [12512]], [[13041, 13041], "mapped", [12513]], [[13042, 13042], "mapped", [12514]], [[13043, 13043], "mapped", [12516]], [[13044, 13044], "mapped", [12518]], [[13045, 13045], "mapped", [12520]], [[13046, 13046], "mapped", [12521]], [[13047, 13047], "mapped", [12522]], [[13048, 13048], "mapped", [12523]], [[13049, 13049], "mapped", [12524]], [[13050, 13050], "mapped", [12525]], [[13051, 13051], "mapped", [12527]], [[13052, 13052], "mapped", [12528]], [[13053, 13053], "mapped", [12529]], [[13054, 13054], "mapped", [12530]], [[13055, 13055], "disallowed"], [[13056, 13056], "mapped", [12450, 12497, 12540, 12488]], [[13057, 13057], "mapped", [12450, 12523, 12501, 12449]], [[13058, 13058], "mapped", [12450, 12531, 12506, 12450]], [[13059, 13059], "mapped", [12450, 12540, 12523]], [[13060, 13060], "mapped", [12452, 12491, 12531, 12464]], [[13061, 13061], "mapped", [12452, 12531, 12481]], [[13062, 13062], "mapped", [12454, 12457, 12531]], [[13063, 13063], "mapped", [12456, 12473, 12463, 12540, 12489]], [[13064, 13064], "mapped", [12456, 12540, 12459, 12540]], [[13065, 13065], "mapped", [12458, 12531, 12473]], [[13066, 13066], "mapped", [12458, 12540, 12512]], [[13067, 13067], "mapped", [12459, 12452, 12522]], [[13068, 13068], "mapped", [12459, 12521, 12483, 12488]], [[13069, 13069], "mapped", [12459, 12525, 12522, 12540]], [[13070, 13070], "mapped", [12460, 12525, 12531]], [[13071, 13071], "mapped", [12460, 12531, 12510]], [[13072, 13072], "mapped", [12462, 12460]], [[13073, 13073], "mapped", [12462, 12491, 12540]], [[13074, 13074], "mapped", [12461, 12517, 12522, 12540]], [[13075, 13075], "mapped", [12462, 12523, 12480, 12540]], [[13076, 13076], "mapped", [12461, 12525]], [[13077, 13077], "mapped", [12461, 12525, 12464, 12521, 12512]], [[13078, 13078], "mapped", [12461, 12525, 12513, 12540, 12488, 12523]], [[13079, 13079], "mapped", [12461, 12525, 12527, 12483, 12488]], [[13080, 13080], "mapped", [12464, 12521, 12512]], [[13081, 13081], "mapped", [12464, 12521, 12512, 12488, 12531]], [[13082, 13082], "mapped", [12463, 12523, 12476, 12452, 12525]], [[13083, 13083], "mapped", [12463, 12525, 12540, 12493]], [[13084, 13084], "mapped", [12465, 12540, 12473]], [[13085, 13085], "mapped", [12467, 12523, 12490]], [[13086, 13086], "mapped", [12467, 12540, 12509]], [[13087, 13087], "mapped", [12469, 12452, 12463, 12523]], [[13088, 13088], "mapped", [12469, 12531, 12481, 12540, 12512]], [[13089, 13089], "mapped", [12471, 12522, 12531, 12464]], [[13090, 13090], "mapped", [12475, 12531, 12481]], [[13091, 13091], "mapped", [12475, 12531, 12488]], [[13092, 13092], "mapped", [12480, 12540, 12473]], [[13093, 13093], "mapped", [12487, 12471]], [[13094, 13094], "mapped", [12489, 12523]], [[13095, 13095], "mapped", [12488, 12531]], [[13096, 13096], "mapped", [12490, 12494]], [[13097, 13097], "mapped", [12494, 12483, 12488]], [[13098, 13098], "mapped", [12495, 12452, 12484]], [[13099, 13099], "mapped", [12497, 12540, 12475, 12531, 12488]], [[13100, 13100], "mapped", [12497, 12540, 12484]], [[13101, 13101], "mapped", [12496, 12540, 12524, 12523]], [[13102, 13102], "mapped", [12500, 12450, 12473, 12488, 12523]], [[13103, 13103], "mapped", [12500, 12463, 12523]], [[13104, 13104], "mapped", [12500, 12467]], [[13105, 13105], "mapped", [12499, 12523]], [[13106, 13106], "mapped", [12501, 12449, 12521, 12483, 12489]], [[13107, 13107], "mapped", [12501, 12451, 12540, 12488]], [[13108, 13108], "mapped", [12502, 12483, 12471, 12455, 12523]], [[13109, 13109], "mapped", [12501, 12521, 12531]], [[13110, 13110], "mapped", [12504, 12463, 12479, 12540, 12523]], [[13111, 13111], "mapped", [12506, 12477]], [[13112, 13112], "mapped", [12506, 12491, 12498]], [[13113, 13113], "mapped", [12504, 12523, 12484]], [[13114, 13114], "mapped", [12506, 12531, 12473]], [[13115, 13115], "mapped", [12506, 12540, 12472]], [[13116, 13116], "mapped", [12505, 12540, 12479]], [[13117, 13117], "mapped", [12509, 12452, 12531, 12488]], [[13118, 13118], "mapped", [12508, 12523, 12488]], [[13119, 13119], "mapped", [12507, 12531]], [[13120, 13120], "mapped", [12509, 12531, 12489]], [[13121, 13121], "mapped", [12507, 12540, 12523]], [[13122, 13122], "mapped", [12507, 12540, 12531]], [[13123, 13123], "mapped", [12510, 12452, 12463, 12525]], [[13124, 13124], "mapped", [12510, 12452, 12523]], [[13125, 13125], "mapped", [12510, 12483, 12495]], [[13126, 13126], "mapped", [12510, 12523, 12463]], [[13127, 13127], "mapped", [12510, 12531, 12471, 12519, 12531]], [[13128, 13128], "mapped", [12511, 12463, 12525, 12531]], [[13129, 13129], "mapped", [12511, 12522]], [[13130, 13130], "mapped", [12511, 12522, 12496, 12540, 12523]], [[13131, 13131], "mapped", [12513, 12460]], [[13132, 13132], "mapped", [12513, 12460, 12488, 12531]], [[13133, 13133], "mapped", [12513, 12540, 12488, 12523]], [[13134, 13134], "mapped", [12516, 12540, 12489]], [[13135, 13135], "mapped", [12516, 12540, 12523]], [[13136, 13136], "mapped", [12518, 12450, 12531]], [[13137, 13137], "mapped", [12522, 12483, 12488, 12523]], [[13138, 13138], "mapped", [12522, 12521]], [[13139, 13139], "mapped", [12523, 12500, 12540]], [[13140, 13140], "mapped", [12523, 12540, 12502, 12523]], [[13141, 13141], "mapped", [12524, 12512]], [[13142, 13142], "mapped", [12524, 12531, 12488, 12466, 12531]], [[13143, 13143], "mapped", [12527, 12483, 12488]], [[13144, 13144], "mapped", [48, 28857]], [[13145, 13145], "mapped", [49, 28857]], [[13146, 13146], "mapped", [50, 28857]], [[13147, 13147], "mapped", [51, 28857]], [[13148, 13148], "mapped", [52, 28857]], [[13149, 13149], "mapped", [53, 28857]], [[13150, 13150], "mapped", [54, 28857]], [[13151, 13151], "mapped", [55, 28857]], [[13152, 13152], "mapped", [56, 28857]], [[13153, 13153], "mapped", [57, 28857]], [[13154, 13154], "mapped", [49, 48, 28857]], [[13155, 13155], "mapped", [49, 49, 28857]], [[13156, 13156], "mapped", [49, 50, 28857]], [[13157, 13157], "mapped", [49, 51, 28857]], [[13158, 13158], "mapped", [49, 52, 28857]], [[13159, 13159], "mapped", [49, 53, 28857]], [[13160, 13160], "mapped", [49, 54, 28857]], [[13161, 13161], "mapped", [49, 55, 28857]], [[13162, 13162], "mapped", [49, 56, 28857]], [[13163, 13163], "mapped", [49, 57, 28857]], [[13164, 13164], "mapped", [50, 48, 28857]], [[13165, 13165], "mapped", [50, 49, 28857]], [[13166, 13166], "mapped", [50, 50, 28857]], [[13167, 13167], "mapped", [50, 51, 28857]], [[13168, 13168], "mapped", [50, 52, 28857]], [[13169, 13169], "mapped", [104, 112, 97]], [[13170, 13170], "mapped", [100, 97]], [[13171, 13171], "mapped", [97, 117]], [[13172, 13172], "mapped", [98, 97, 114]], [[13173, 13173], "mapped", [111, 118]], [[13174, 13174], "mapped", [112, 99]], [[13175, 13175], "mapped", [100, 109]], [[13176, 13176], "mapped", [100, 109, 50]], [[13177, 13177], "mapped", [100, 109, 51]], [[13178, 13178], "mapped", [105, 117]], [[13179, 13179], "mapped", [24179, 25104]], [[13180, 13180], "mapped", [26157, 21644]], [[13181, 13181], "mapped", [22823, 27491]], [[13182, 13182], "mapped", [26126, 27835]], [[13183, 13183], "mapped", [26666, 24335, 20250, 31038]], [[13184, 13184], "mapped", [112, 97]], [[13185, 13185], "mapped", [110, 97]], [[13186, 13186], "mapped", [956, 97]], [[13187, 13187], "mapped", [109, 97]], [[13188, 13188], "mapped", [107, 97]], [[13189, 13189], "mapped", [107, 98]], [[13190, 13190], "mapped", [109, 98]], [[13191, 13191], "mapped", [103, 98]], [[13192, 13192], "mapped", [99, 97, 108]], [[13193, 13193], "mapped", [107, 99, 97, 108]], [[13194, 13194], "mapped", [112, 102]], [[13195, 13195], "mapped", [110, 102]], [[13196, 13196], "mapped", [956, 102]], [[13197, 13197], "mapped", [956, 103]], [[13198, 13198], "mapped", [109, 103]], [[13199, 13199], "mapped", [107, 103]], [[13200, 13200], "mapped", [104, 122]], [[13201, 13201], "mapped", [107, 104, 122]], [[13202, 13202], "mapped", [109, 104, 122]], [[13203, 13203], "mapped", [103, 104, 122]], [[13204, 13204], "mapped", [116, 104, 122]], [[13205, 13205], "mapped", [956, 108]], [[13206, 13206], "mapped", [109, 108]], [[13207, 13207], "mapped", [100, 108]], [[13208, 13208], "mapped", [107, 108]], [[13209, 13209], "mapped", [102, 109]], [[13210, 13210], "mapped", [110, 109]], [[13211, 13211], "mapped", [956, 109]], [[13212, 13212], "mapped", [109, 109]], [[13213, 13213], "mapped", [99, 109]], [[13214, 13214], "mapped", [107, 109]], [[13215, 13215], "mapped", [109, 109, 50]], [[13216, 13216], "mapped", [99, 109, 50]], [[13217, 13217], "mapped", [109, 50]], [[13218, 13218], "mapped", [107, 109, 50]], [[13219, 13219], "mapped", [109, 109, 51]], [[13220, 13220], "mapped", [99, 109, 51]], [[13221, 13221], "mapped", [109, 51]], [[13222, 13222], "mapped", [107, 109, 51]], [[13223, 13223], "mapped", [109, 8725, 115]], [[13224, 13224], "mapped", [109, 8725, 115, 50]], [[13225, 13225], "mapped", [112, 97]], [[13226, 13226], "mapped", [107, 112, 97]], [[13227, 13227], "mapped", [109, 112, 97]], [[13228, 13228], "mapped", [103, 112, 97]], [[13229, 13229], "mapped", [114, 97, 100]], [[13230, 13230], "mapped", [114, 97, 100, 8725, 115]], [[13231, 13231], "mapped", [114, 97, 100, 8725, 115, 50]], [[13232, 13232], "mapped", [112, 115]], [[13233, 13233], "mapped", [110, 115]], [[13234, 13234], "mapped", [956, 115]], [[13235, 13235], "mapped", [109, 115]], [[13236, 13236], "mapped", [112, 118]], [[13237, 13237], "mapped", [110, 118]], [[13238, 13238], "mapped", [956, 118]], [[13239, 13239], "mapped", [109, 118]], [[13240, 13240], "mapped", [107, 118]], [[13241, 13241], "mapped", [109, 118]], [[13242, 13242], "mapped", [112, 119]], [[13243, 13243], "mapped", [110, 119]], [[13244, 13244], "mapped", [956, 119]], [[13245, 13245], "mapped", [109, 119]], [[13246, 13246], "mapped", [107, 119]], [[13247, 13247], "mapped", [109, 119]], [[13248, 13248], "mapped", [107, 969]], [[13249, 13249], "mapped", [109, 969]], [[13250, 13250], "disallowed"], [[13251, 13251], "mapped", [98, 113]], [[13252, 13252], "mapped", [99, 99]], [[13253, 13253], "mapped", [99, 100]], [[13254, 13254], "mapped", [99, 8725, 107, 103]], [[13255, 13255], "disallowed"], [[13256, 13256], "mapped", [100, 98]], [[13257, 13257], "mapped", [103, 121]], [[13258, 13258], "mapped", [104, 97]], [[13259, 13259], "mapped", [104, 112]], [[13260, 13260], "mapped", [105, 110]], [[13261, 13261], "mapped", [107, 107]], [[13262, 13262], "mapped", [107, 109]], [[13263, 13263], "mapped", [107, 116]], [[13264, 13264], "mapped", [108, 109]], [[13265, 13265], "mapped", [108, 110]], [[13266, 13266], "mapped", [108, 111, 103]], [[13267, 13267], "mapped", [108, 120]], [[13268, 13268], "mapped", [109, 98]], [[13269, 13269], "mapped", [109, 105, 108]], [[13270, 13270], "mapped", [109, 111, 108]], [[13271, 13271], "mapped", [112, 104]], [[13272, 13272], "disallowed"], [[13273, 13273], "mapped", [112, 112, 109]], [[13274, 13274], "mapped", [112, 114]], [[13275, 13275], "mapped", [115, 114]], [[13276, 13276], "mapped", [115, 118]], [[13277, 13277], "mapped", [119, 98]], [[13278, 13278], "mapped", [118, 8725, 109]], [[13279, 13279], "mapped", [97, 8725, 109]], [[13280, 13280], "mapped", [49, 26085]], [[13281, 13281], "mapped", [50, 26085]], [[13282, 13282], "mapped", [51, 26085]], [[13283, 13283], "mapped", [52, 26085]], [[13284, 13284], "mapped", [53, 26085]], [[13285, 13285], "mapped", [54, 26085]], [[13286, 13286], "mapped", [55, 26085]], [[13287, 13287], "mapped", [56, 26085]], [[13288, 13288], "mapped", [57, 26085]], [[13289, 13289], "mapped", [49, 48, 26085]], [[13290, 13290], "mapped", [49, 49, 26085]], [[13291, 13291], "mapped", [49, 50, 26085]], [[13292, 13292], "mapped", [49, 51, 26085]], [[13293, 13293], "mapped", [49, 52, 26085]], [[13294, 13294], "mapped", [49, 53, 26085]], [[13295, 13295], "mapped", [49, 54, 26085]], [[13296, 13296], "mapped", [49, 55, 26085]], [[13297, 13297], "mapped", [49, 56, 26085]], [[13298, 13298], "mapped", [49, 57, 26085]], [[13299, 13299], "mapped", [50, 48, 26085]], [[13300, 13300], "mapped", [50, 49, 26085]], [[13301, 13301], "mapped", [50, 50, 26085]], [[13302, 13302], "mapped", [50, 51, 26085]], [[13303, 13303], "mapped", [50, 52, 26085]], [[13304, 13304], "mapped", [50, 53, 26085]], [[13305, 13305], "mapped", [50, 54, 26085]], [[13306, 13306], "mapped", [50, 55, 26085]], [[13307, 13307], "mapped", [50, 56, 26085]], [[13308, 13308], "mapped", [50, 57, 26085]], [[13309, 13309], "mapped", [51, 48, 26085]], [[13310, 13310], "mapped", [51, 49, 26085]], [[13311, 13311], "mapped", [103, 97, 108]], [[13312, 19893], "valid"], [[19894, 19903], "disallowed"], [[19904, 19967], "valid", [], "NV8"], [[19968, 40869], "valid"], [[40870, 40891], "valid"], [[40892, 40899], "valid"], [[40900, 40907], "valid"], [[40908, 40908], "valid"], [[40909, 40917], "valid"], [[40918, 40959], "disallowed"], [[40960, 42124], "valid"], [[42125, 42127], "disallowed"], [[42128, 42145], "valid", [], "NV8"], [[42146, 42147], "valid", [], "NV8"], [[42148, 42163], "valid", [], "NV8"], [[42164, 42164], "valid", [], "NV8"], [[42165, 42176], "valid", [], "NV8"], [[42177, 42177], "valid", [], "NV8"], [[42178, 42180], "valid", [], "NV8"], [[42181, 42181], "valid", [], "NV8"], [[42182, 42182], "valid", [], "NV8"], [[42183, 42191], "disallowed"], [[42192, 42237], "valid"], [[42238, 42239], "valid", [], "NV8"], [[42240, 42508], "valid"], [[42509, 42511], "valid", [], "NV8"], [[42512, 42539], "valid"], [[42540, 42559], "disallowed"], [[42560, 42560], "mapped", [42561]], [[42561, 42561], "valid"], [[42562, 42562], "mapped", [42563]], [[42563, 42563], "valid"], [[42564, 42564], "mapped", [42565]], [[42565, 42565], "valid"], [[42566, 42566], "mapped", [42567]], [[42567, 42567], "valid"], [[42568, 42568], "mapped", [42569]], [[42569, 42569], "valid"], [[42570, 42570], "mapped", [42571]], [[42571, 42571], "valid"], [[42572, 42572], "mapped", [42573]], [[42573, 42573], "valid"], [[42574, 42574], "mapped", [42575]], [[42575, 42575], "valid"], [[42576, 42576], "mapped", [42577]], [[42577, 42577], "valid"], [[42578, 42578], "mapped", [42579]], [[42579, 42579], "valid"], [[42580, 42580], "mapped", [42581]], [[42581, 42581], "valid"], [[42582, 42582], "mapped", [42583]], [[42583, 42583], "valid"], [[42584, 42584], "mapped", [42585]], [[42585, 42585], "valid"], [[42586, 42586], "mapped", [42587]], [[42587, 42587], "valid"], [[42588, 42588], "mapped", [42589]], [[42589, 42589], "valid"], [[42590, 42590], "mapped", [42591]], [[42591, 42591], "valid"], [[42592, 42592], "mapped", [42593]], [[42593, 42593], "valid"], [[42594, 42594], "mapped", [42595]], [[42595, 42595], "valid"], [[42596, 42596], "mapped", [42597]], [[42597, 42597], "valid"], [[42598, 42598], "mapped", [42599]], [[42599, 42599], "valid"], [[42600, 42600], "mapped", [42601]], [[42601, 42601], "valid"], [[42602, 42602], "mapped", [42603]], [[42603, 42603], "valid"], [[42604, 42604], "mapped", [42605]], [[42605, 42607], "valid"], [[42608, 42611], "valid", [], "NV8"], [[42612, 42619], "valid"], [[42620, 42621], "valid"], [[42622, 42622], "valid", [], "NV8"], [[42623, 42623], "valid"], [[42624, 42624], "mapped", [42625]], [[42625, 42625], "valid"], [[42626, 42626], "mapped", [42627]], [[42627, 42627], "valid"], [[42628, 42628], "mapped", [42629]], [[42629, 42629], "valid"], [[42630, 42630], "mapped", [42631]], [[42631, 42631], "valid"], [[42632, 42632], "mapped", [42633]], [[42633, 42633], "valid"], [[42634, 42634], "mapped", [42635]], [[42635, 42635], "valid"], [[42636, 42636], "mapped", [42637]], [[42637, 42637], "valid"], [[42638, 42638], "mapped", [42639]], [[42639, 42639], "valid"], [[42640, 42640], "mapped", [42641]], [[42641, 42641], "valid"], [[42642, 42642], "mapped", [42643]], [[42643, 42643], "valid"], [[42644, 42644], "mapped", [42645]], [[42645, 42645], "valid"], [[42646, 42646], "mapped", [42647]], [[42647, 42647], "valid"], [[42648, 42648], "mapped", [42649]], [[42649, 42649], "valid"], [[42650, 42650], "mapped", [42651]], [[42651, 42651], "valid"], [[42652, 42652], "mapped", [1098]], [[42653, 42653], "mapped", [1100]], [[42654, 42654], "valid"], [[42655, 42655], "valid"], [[42656, 42725], "valid"], [[42726, 42735], "valid", [], "NV8"], [[42736, 42737], "valid"], [[42738, 42743], "valid", [], "NV8"], [[42744, 42751], "disallowed"], [[42752, 42774], "valid", [], "NV8"], [[42775, 42778], "valid"], [[42779, 42783], "valid"], [[42784, 42785], "valid", [], "NV8"], [[42786, 42786], "mapped", [42787]], [[42787, 42787], "valid"], [[42788, 42788], "mapped", [42789]], [[42789, 42789], "valid"], [[42790, 42790], "mapped", [42791]], [[42791, 42791], "valid"], [[42792, 42792], "mapped", [42793]], [[42793, 42793], "valid"], [[42794, 42794], "mapped", [42795]], [[42795, 42795], "valid"], [[42796, 42796], "mapped", [42797]], [[42797, 42797], "valid"], [[42798, 42798], "mapped", [42799]], [[42799, 42801], "valid"], [[42802, 42802], "mapped", [42803]], [[42803, 42803], "valid"], [[42804, 42804], "mapped", [42805]], [[42805, 42805], "valid"], [[42806, 42806], "mapped", [42807]], [[42807, 42807], "valid"], [[42808, 42808], "mapped", [42809]], [[42809, 42809], "valid"], [[42810, 42810], "mapped", [42811]], [[42811, 42811], "valid"], [[42812, 42812], "mapped", [42813]], [[42813, 42813], "valid"], [[42814, 42814], "mapped", [42815]], [[42815, 42815], "valid"], [[42816, 42816], "mapped", [42817]], [[42817, 42817], "valid"], [[42818, 42818], "mapped", [42819]], [[42819, 42819], "valid"], [[42820, 42820], "mapped", [42821]], [[42821, 42821], "valid"], [[42822, 42822], "mapped", [42823]], [[42823, 42823], "valid"], [[42824, 42824], "mapped", [42825]], [[42825, 42825], "valid"], [[42826, 42826], "mapped", [42827]], [[42827, 42827], "valid"], [[42828, 42828], "mapped", [42829]], [[42829, 42829], "valid"], [[42830, 42830], "mapped", [42831]], [[42831, 42831], "valid"], [[42832, 42832], "mapped", [42833]], [[42833, 42833], "valid"], [[42834, 42834], "mapped", [42835]], [[42835, 42835], "valid"], [[42836, 42836], "mapped", [42837]], [[42837, 42837], "valid"], [[42838, 42838], "mapped", [42839]], [[42839, 42839], "valid"], [[42840, 42840], "mapped", [42841]], [[42841, 42841], "valid"], [[42842, 42842], "mapped", [42843]], [[42843, 42843], "valid"], [[42844, 42844], "mapped", [42845]], [[42845, 42845], "valid"], [[42846, 42846], "mapped", [42847]], [[42847, 42847], "valid"], [[42848, 42848], "mapped", [42849]], [[42849, 42849], "valid"], [[42850, 42850], "mapped", [42851]], [[42851, 42851], "valid"], [[42852, 42852], "mapped", [42853]], [[42853, 42853], "valid"], [[42854, 42854], "mapped", [42855]], [[42855, 42855], "valid"], [[42856, 42856], "mapped", [42857]], [[42857, 42857], "valid"], [[42858, 42858], "mapped", [42859]], [[42859, 42859], "valid"], [[42860, 42860], "mapped", [42861]], [[42861, 42861], "valid"], [[42862, 42862], "mapped", [42863]], [[42863, 42863], "valid"], [[42864, 42864], "mapped", [42863]], [[42865, 42872], "valid"], [[42873, 42873], "mapped", [42874]], [[42874, 42874], "valid"], [[42875, 42875], "mapped", [42876]], [[42876, 42876], "valid"], [[42877, 42877], "mapped", [7545]], [[42878, 42878], "mapped", [42879]], [[42879, 42879], "valid"], [[42880, 42880], "mapped", [42881]], [[42881, 42881], "valid"], [[42882, 42882], "mapped", [42883]], [[42883, 42883], "valid"], [[42884, 42884], "mapped", [42885]], [[42885, 42885], "valid"], [[42886, 42886], "mapped", [42887]], [[42887, 42888], "valid"], [[42889, 42890], "valid", [], "NV8"], [[42891, 42891], "mapped", [42892]], [[42892, 42892], "valid"], [[42893, 42893], "mapped", [613]], [[42894, 42894], "valid"], [[42895, 42895], "valid"], [[42896, 42896], "mapped", [42897]], [[42897, 42897], "valid"], [[42898, 42898], "mapped", [42899]], [[42899, 42899], "valid"], [[42900, 42901], "valid"], [[42902, 42902], "mapped", [42903]], [[42903, 42903], "valid"], [[42904, 42904], "mapped", [42905]], [[42905, 42905], "valid"], [[42906, 42906], "mapped", [42907]], [[42907, 42907], "valid"], [[42908, 42908], "mapped", [42909]], [[42909, 42909], "valid"], [[42910, 42910], "mapped", [42911]], [[42911, 42911], "valid"], [[42912, 42912], "mapped", [42913]], [[42913, 42913], "valid"], [[42914, 42914], "mapped", [42915]], [[42915, 42915], "valid"], [[42916, 42916], "mapped", [42917]], [[42917, 42917], "valid"], [[42918, 42918], "mapped", [42919]], [[42919, 42919], "valid"], [[42920, 42920], "mapped", [42921]], [[42921, 42921], "valid"], [[42922, 42922], "mapped", [614]], [[42923, 42923], "mapped", [604]], [[42924, 42924], "mapped", [609]], [[42925, 42925], "mapped", [620]], [[42926, 42927], "disallowed"], [[42928, 42928], "mapped", [670]], [[42929, 42929], "mapped", [647]], [[42930, 42930], "mapped", [669]], [[42931, 42931], "mapped", [43859]], [[42932, 42932], "mapped", [42933]], [[42933, 42933], "valid"], [[42934, 42934], "mapped", [42935]], [[42935, 42935], "valid"], [[42936, 42998], "disallowed"], [[42999, 42999], "valid"], [[43e3, 43e3], "mapped", [295]], [[43001, 43001], "mapped", [339]], [[43002, 43002], "valid"], [[43003, 43007], "valid"], [[43008, 43047], "valid"], [[43048, 43051], "valid", [], "NV8"], [[43052, 43055], "disallowed"], [[43056, 43065], "valid", [], "NV8"], [[43066, 43071], "disallowed"], [[43072, 43123], "valid"], [[43124, 43127], "valid", [], "NV8"], [[43128, 43135], "disallowed"], [[43136, 43204], "valid"], [[43205, 43213], "disallowed"], [[43214, 43215], "valid", [], "NV8"], [[43216, 43225], "valid"], [[43226, 43231], "disallowed"], [[43232, 43255], "valid"], [[43256, 43258], "valid", [], "NV8"], [[43259, 43259], "valid"], [[43260, 43260], "valid", [], "NV8"], [[43261, 43261], "valid"], [[43262, 43263], "disallowed"], [[43264, 43309], "valid"], [[43310, 43311], "valid", [], "NV8"], [[43312, 43347], "valid"], [[43348, 43358], "disallowed"], [[43359, 43359], "valid", [], "NV8"], [[43360, 43388], "valid", [], "NV8"], [[43389, 43391], "disallowed"], [[43392, 43456], "valid"], [[43457, 43469], "valid", [], "NV8"], [[43470, 43470], "disallowed"], [[43471, 43481], "valid"], [[43482, 43485], "disallowed"], [[43486, 43487], "valid", [], "NV8"], [[43488, 43518], "valid"], [[43519, 43519], "disallowed"], [[43520, 43574], "valid"], [[43575, 43583], "disallowed"], [[43584, 43597], "valid"], [[43598, 43599], "disallowed"], [[43600, 43609], "valid"], [[43610, 43611], "disallowed"], [[43612, 43615], "valid", [], "NV8"], [[43616, 43638], "valid"], [[43639, 43641], "valid", [], "NV8"], [[43642, 43643], "valid"], [[43644, 43647], "valid"], [[43648, 43714], "valid"], [[43715, 43738], "disallowed"], [[43739, 43741], "valid"], [[43742, 43743], "valid", [], "NV8"], [[43744, 43759], "valid"], [[43760, 43761], "valid", [], "NV8"], [[43762, 43766], "valid"], [[43767, 43776], "disallowed"], [[43777, 43782], "valid"], [[43783, 43784], "disallowed"], [[43785, 43790], "valid"], [[43791, 43792], "disallowed"], [[43793, 43798], "valid"], [[43799, 43807], "disallowed"], [[43808, 43814], "valid"], [[43815, 43815], "disallowed"], [[43816, 43822], "valid"], [[43823, 43823], "disallowed"], [[43824, 43866], "valid"], [[43867, 43867], "valid", [], "NV8"], [[43868, 43868], "mapped", [42791]], [[43869, 43869], "mapped", [43831]], [[43870, 43870], "mapped", [619]], [[43871, 43871], "mapped", [43858]], [[43872, 43875], "valid"], [[43876, 43877], "valid"], [[43878, 43887], "disallowed"], [[43888, 43888], "mapped", [5024]], [[43889, 43889], "mapped", [5025]], [[43890, 43890], "mapped", [5026]], [[43891, 43891], "mapped", [5027]], [[43892, 43892], "mapped", [5028]], [[43893, 43893], "mapped", [5029]], [[43894, 43894], "mapped", [5030]], [[43895, 43895], "mapped", [5031]], [[43896, 43896], "mapped", [5032]], [[43897, 43897], "mapped", [5033]], [[43898, 43898], "mapped", [5034]], [[43899, 43899], "mapped", [5035]], [[43900, 43900], "mapped", [5036]], [[43901, 43901], "mapped", [5037]], [[43902, 43902], "mapped", [5038]], [[43903, 43903], "mapped", [5039]], [[43904, 43904], "mapped", [5040]], [[43905, 43905], "mapped", [5041]], [[43906, 43906], "mapped", [5042]], [[43907, 43907], "mapped", [5043]], [[43908, 43908], "mapped", [5044]], [[43909, 43909], "mapped", [5045]], [[43910, 43910], "mapped", [5046]], [[43911, 43911], "mapped", [5047]], [[43912, 43912], "mapped", [5048]], [[43913, 43913], "mapped", [5049]], [[43914, 43914], "mapped", [5050]], [[43915, 43915], "mapped", [5051]], [[43916, 43916], "mapped", [5052]], [[43917, 43917], "mapped", [5053]], [[43918, 43918], "mapped", [5054]], [[43919, 43919], "mapped", [5055]], [[43920, 43920], "mapped", [5056]], [[43921, 43921], "mapped", [5057]], [[43922, 43922], "mapped", [5058]], [[43923, 43923], "mapped", [5059]], [[43924, 43924], "mapped", [5060]], [[43925, 43925], "mapped", [5061]], [[43926, 43926], "mapped", [5062]], [[43927, 43927], "mapped", [5063]], [[43928, 43928], "mapped", [5064]], [[43929, 43929], "mapped", [5065]], [[43930, 43930], "mapped", [5066]], [[43931, 43931], "mapped", [5067]], [[43932, 43932], "mapped", [5068]], [[43933, 43933], "mapped", [5069]], [[43934, 43934], "mapped", [5070]], [[43935, 43935], "mapped", [5071]], [[43936, 43936], "mapped", [5072]], [[43937, 43937], "mapped", [5073]], [[43938, 43938], "mapped", [5074]], [[43939, 43939], "mapped", [5075]], [[43940, 43940], "mapped", [5076]], [[43941, 43941], "mapped", [5077]], [[43942, 43942], "mapped", [5078]], [[43943, 43943], "mapped", [5079]], [[43944, 43944], "mapped", [5080]], [[43945, 43945], "mapped", [5081]], [[43946, 43946], "mapped", [5082]], [[43947, 43947], "mapped", [5083]], [[43948, 43948], "mapped", [5084]], [[43949, 43949], "mapped", [5085]], [[43950, 43950], "mapped", [5086]], [[43951, 43951], "mapped", [5087]], [[43952, 43952], "mapped", [5088]], [[43953, 43953], "mapped", [5089]], [[43954, 43954], "mapped", [5090]], [[43955, 43955], "mapped", [5091]], [[43956, 43956], "mapped", [5092]], [[43957, 43957], "mapped", [5093]], [[43958, 43958], "mapped", [5094]], [[43959, 43959], "mapped", [5095]], [[43960, 43960], "mapped", [5096]], [[43961, 43961], "mapped", [5097]], [[43962, 43962], "mapped", [5098]], [[43963, 43963], "mapped", [5099]], [[43964, 43964], "mapped", [5100]], [[43965, 43965], "mapped", [5101]], [[43966, 43966], "mapped", [5102]], [[43967, 43967], "mapped", [5103]], [[43968, 44010], "valid"], [[44011, 44011], "valid", [], "NV8"], [[44012, 44013], "valid"], [[44014, 44015], "disallowed"], [[44016, 44025], "valid"], [[44026, 44031], "disallowed"], [[44032, 55203], "valid"], [[55204, 55215], "disallowed"], [[55216, 55238], "valid", [], "NV8"], [[55239, 55242], "disallowed"], [[55243, 55291], "valid", [], "NV8"], [[55292, 55295], "disallowed"], [[55296, 57343], "disallowed"], [[57344, 63743], "disallowed"], [[63744, 63744], "mapped", [35912]], [[63745, 63745], "mapped", [26356]], [[63746, 63746], "mapped", [36554]], [[63747, 63747], "mapped", [36040]], [[63748, 63748], "mapped", [28369]], [[63749, 63749], "mapped", [20018]], [[63750, 63750], "mapped", [21477]], [[63751, 63752], "mapped", [40860]], [[63753, 63753], "mapped", [22865]], [[63754, 63754], "mapped", [37329]], [[63755, 63755], "mapped", [21895]], [[63756, 63756], "mapped", [22856]], [[63757, 63757], "mapped", [25078]], [[63758, 63758], "mapped", [30313]], [[63759, 63759], "mapped", [32645]], [[63760, 63760], "mapped", [34367]], [[63761, 63761], "mapped", [34746]], [[63762, 63762], "mapped", [35064]], [[63763, 63763], "mapped", [37007]], [[63764, 63764], "mapped", [27138]], [[63765, 63765], "mapped", [27931]], [[63766, 63766], "mapped", [28889]], [[63767, 63767], "mapped", [29662]], [[63768, 63768], "mapped", [33853]], [[63769, 63769], "mapped", [37226]], [[63770, 63770], "mapped", [39409]], [[63771, 63771], "mapped", [20098]], [[63772, 63772], "mapped", [21365]], [[63773, 63773], "mapped", [27396]], [[63774, 63774], "mapped", [29211]], [[63775, 63775], "mapped", [34349]], [[63776, 63776], "mapped", [40478]], [[63777, 63777], "mapped", [23888]], [[63778, 63778], "mapped", [28651]], [[63779, 63779], "mapped", [34253]], [[63780, 63780], "mapped", [35172]], [[63781, 63781], "mapped", [25289]], [[63782, 63782], "mapped", [33240]], [[63783, 63783], "mapped", [34847]], [[63784, 63784], "mapped", [24266]], [[63785, 63785], "mapped", [26391]], [[63786, 63786], "mapped", [28010]], [[63787, 63787], "mapped", [29436]], [[63788, 63788], "mapped", [37070]], [[63789, 63789], "mapped", [20358]], [[63790, 63790], "mapped", [20919]], [[63791, 63791], "mapped", [21214]], [[63792, 63792], "mapped", [25796]], [[63793, 63793], "mapped", [27347]], [[63794, 63794], "mapped", [29200]], [[63795, 63795], "mapped", [30439]], [[63796, 63796], "mapped", [32769]], [[63797, 63797], "mapped", [34310]], [[63798, 63798], "mapped", [34396]], [[63799, 63799], "mapped", [36335]], [[63800, 63800], "mapped", [38706]], [[63801, 63801], "mapped", [39791]], [[63802, 63802], "mapped", [40442]], [[63803, 63803], "mapped", [30860]], [[63804, 63804], "mapped", [31103]], [[63805, 63805], "mapped", [32160]], [[63806, 63806], "mapped", [33737]], [[63807, 63807], "mapped", [37636]], [[63808, 63808], "mapped", [40575]], [[63809, 63809], "mapped", [35542]], [[63810, 63810], "mapped", [22751]], [[63811, 63811], "mapped", [24324]], [[63812, 63812], "mapped", [31840]], [[63813, 63813], "mapped", [32894]], [[63814, 63814], "mapped", [29282]], [[63815, 63815], "mapped", [30922]], [[63816, 63816], "mapped", [36034]], [[63817, 63817], "mapped", [38647]], [[63818, 63818], "mapped", [22744]], [[63819, 63819], "mapped", [23650]], [[63820, 63820], "mapped", [27155]], [[63821, 63821], "mapped", [28122]], [[63822, 63822], "mapped", [28431]], [[63823, 63823], "mapped", [32047]], [[63824, 63824], "mapped", [32311]], [[63825, 63825], "mapped", [38475]], [[63826, 63826], "mapped", [21202]], [[63827, 63827], "mapped", [32907]], [[63828, 63828], "mapped", [20956]], [[63829, 63829], "mapped", [20940]], [[63830, 63830], "mapped", [31260]], [[63831, 63831], "mapped", [32190]], [[63832, 63832], "mapped", [33777]], [[63833, 63833], "mapped", [38517]], [[63834, 63834], "mapped", [35712]], [[63835, 63835], "mapped", [25295]], [[63836, 63836], "mapped", [27138]], [[63837, 63837], "mapped", [35582]], [[63838, 63838], "mapped", [20025]], [[63839, 63839], "mapped", [23527]], [[63840, 63840], "mapped", [24594]], [[63841, 63841], "mapped", [29575]], [[63842, 63842], "mapped", [30064]], [[63843, 63843], "mapped", [21271]], [[63844, 63844], "mapped", [30971]], [[63845, 63845], "mapped", [20415]], [[63846, 63846], "mapped", [24489]], [[63847, 63847], "mapped", [19981]], [[63848, 63848], "mapped", [27852]], [[63849, 63849], "mapped", [25976]], [[63850, 63850], "mapped", [32034]], [[63851, 63851], "mapped", [21443]], [[63852, 63852], "mapped", [22622]], [[63853, 63853], "mapped", [30465]], [[63854, 63854], "mapped", [33865]], [[63855, 63855], "mapped", [35498]], [[63856, 63856], "mapped", [27578]], [[63857, 63857], "mapped", [36784]], [[63858, 63858], "mapped", [27784]], [[63859, 63859], "mapped", [25342]], [[63860, 63860], "mapped", [33509]], [[63861, 63861], "mapped", [25504]], [[63862, 63862], "mapped", [30053]], [[63863, 63863], "mapped", [20142]], [[63864, 63864], "mapped", [20841]], [[63865, 63865], "mapped", [20937]], [[63866, 63866], "mapped", [26753]], [[63867, 63867], "mapped", [31975]], [[63868, 63868], "mapped", [33391]], [[63869, 63869], "mapped", [35538]], [[63870, 63870], "mapped", [37327]], [[63871, 63871], "mapped", [21237]], [[63872, 63872], "mapped", [21570]], [[63873, 63873], "mapped", [22899]], [[63874, 63874], "mapped", [24300]], [[63875, 63875], "mapped", [26053]], [[63876, 63876], "mapped", [28670]], [[63877, 63877], "mapped", [31018]], [[63878, 63878], "mapped", [38317]], [[63879, 63879], "mapped", [39530]], [[63880, 63880], "mapped", [40599]], [[63881, 63881], "mapped", [40654]], [[63882, 63882], "mapped", [21147]], [[63883, 63883], "mapped", [26310]], [[63884, 63884], "mapped", [27511]], [[63885, 63885], "mapped", [36706]], [[63886, 63886], "mapped", [24180]], [[63887, 63887], "mapped", [24976]], [[63888, 63888], "mapped", [25088]], [[63889, 63889], "mapped", [25754]], [[63890, 63890], "mapped", [28451]], [[63891, 63891], "mapped", [29001]], [[63892, 63892], "mapped", [29833]], [[63893, 63893], "mapped", [31178]], [[63894, 63894], "mapped", [32244]], [[63895, 63895], "mapped", [32879]], [[63896, 63896], "mapped", [36646]], [[63897, 63897], "mapped", [34030]], [[63898, 63898], "mapped", [36899]], [[63899, 63899], "mapped", [37706]], [[63900, 63900], "mapped", [21015]], [[63901, 63901], "mapped", [21155]], [[63902, 63902], "mapped", [21693]], [[63903, 63903], "mapped", [28872]], [[63904, 63904], "mapped", [35010]], [[63905, 63905], "mapped", [35498]], [[63906, 63906], "mapped", [24265]], [[63907, 63907], "mapped", [24565]], [[63908, 63908], "mapped", [25467]], [[63909, 63909], "mapped", [27566]], [[63910, 63910], "mapped", [31806]], [[63911, 63911], "mapped", [29557]], [[63912, 63912], "mapped", [20196]], [[63913, 63913], "mapped", [22265]], [[63914, 63914], "mapped", [23527]], [[63915, 63915], "mapped", [23994]], [[63916, 63916], "mapped", [24604]], [[63917, 63917], "mapped", [29618]], [[63918, 63918], "mapped", [29801]], [[63919, 63919], "mapped", [32666]], [[63920, 63920], "mapped", [32838]], [[63921, 63921], "mapped", [37428]], [[63922, 63922], "mapped", [38646]], [[63923, 63923], "mapped", [38728]], [[63924, 63924], "mapped", [38936]], [[63925, 63925], "mapped", [20363]], [[63926, 63926], "mapped", [31150]], [[63927, 63927], "mapped", [37300]], [[63928, 63928], "mapped", [38584]], [[63929, 63929], "mapped", [24801]], [[63930, 63930], "mapped", [20102]], [[63931, 63931], "mapped", [20698]], [[63932, 63932], "mapped", [23534]], [[63933, 63933], "mapped", [23615]], [[63934, 63934], "mapped", [26009]], [[63935, 63935], "mapped", [27138]], [[63936, 63936], "mapped", [29134]], [[63937, 63937], "mapped", [30274]], [[63938, 63938], "mapped", [34044]], [[63939, 63939], "mapped", [36988]], [[63940, 63940], "mapped", [40845]], [[63941, 63941], "mapped", [26248]], [[63942, 63942], "mapped", [38446]], [[63943, 63943], "mapped", [21129]], [[63944, 63944], "mapped", [26491]], [[63945, 63945], "mapped", [26611]], [[63946, 63946], "mapped", [27969]], [[63947, 63947], "mapped", [28316]], [[63948, 63948], "mapped", [29705]], [[63949, 63949], "mapped", [30041]], [[63950, 63950], "mapped", [30827]], [[63951, 63951], "mapped", [32016]], [[63952, 63952], "mapped", [39006]], [[63953, 63953], "mapped", [20845]], [[63954, 63954], "mapped", [25134]], [[63955, 63955], "mapped", [38520]], [[63956, 63956], "mapped", [20523]], [[63957, 63957], "mapped", [23833]], [[63958, 63958], "mapped", [28138]], [[63959, 63959], "mapped", [36650]], [[63960, 63960], "mapped", [24459]], [[63961, 63961], "mapped", [24900]], [[63962, 63962], "mapped", [26647]], [[63963, 63963], "mapped", [29575]], [[63964, 63964], "mapped", [38534]], [[63965, 63965], "mapped", [21033]], [[63966, 63966], "mapped", [21519]], [[63967, 63967], "mapped", [23653]], [[63968, 63968], "mapped", [26131]], [[63969, 63969], "mapped", [26446]], [[63970, 63970], "mapped", [26792]], [[63971, 63971], "mapped", [27877]], [[63972, 63972], "mapped", [29702]], [[63973, 63973], "mapped", [30178]], [[63974, 63974], "mapped", [32633]], [[63975, 63975], "mapped", [35023]], [[63976, 63976], "mapped", [35041]], [[63977, 63977], "mapped", [37324]], [[63978, 63978], "mapped", [38626]], [[63979, 63979], "mapped", [21311]], [[63980, 63980], "mapped", [28346]], [[63981, 63981], "mapped", [21533]], [[63982, 63982], "mapped", [29136]], [[63983, 63983], "mapped", [29848]], [[63984, 63984], "mapped", [34298]], [[63985, 63985], "mapped", [38563]], [[63986, 63986], "mapped", [40023]], [[63987, 63987], "mapped", [40607]], [[63988, 63988], "mapped", [26519]], [[63989, 63989], "mapped", [28107]], [[63990, 63990], "mapped", [33256]], [[63991, 63991], "mapped", [31435]], [[63992, 63992], "mapped", [31520]], [[63993, 63993], "mapped", [31890]], [[63994, 63994], "mapped", [29376]], [[63995, 63995], "mapped", [28825]], [[63996, 63996], "mapped", [35672]], [[63997, 63997], "mapped", [20160]], [[63998, 63998], "mapped", [33590]], [[63999, 63999], "mapped", [21050]], [[64e3, 64e3], "mapped", [20999]], [[64001, 64001], "mapped", [24230]], [[64002, 64002], "mapped", [25299]], [[64003, 64003], "mapped", [31958]], [[64004, 64004], "mapped", [23429]], [[64005, 64005], "mapped", [27934]], [[64006, 64006], "mapped", [26292]], [[64007, 64007], "mapped", [36667]], [[64008, 64008], "mapped", [34892]], [[64009, 64009], "mapped", [38477]], [[64010, 64010], "mapped", [35211]], [[64011, 64011], "mapped", [24275]], [[64012, 64012], "mapped", [20800]], [[64013, 64013], "mapped", [21952]], [[64014, 64015], "valid"], [[64016, 64016], "mapped", [22618]], [[64017, 64017], "valid"], [[64018, 64018], "mapped", [26228]], [[64019, 64020], "valid"], [[64021, 64021], "mapped", [20958]], [[64022, 64022], "mapped", [29482]], [[64023, 64023], "mapped", [30410]], [[64024, 64024], "mapped", [31036]], [[64025, 64025], "mapped", [31070]], [[64026, 64026], "mapped", [31077]], [[64027, 64027], "mapped", [31119]], [[64028, 64028], "mapped", [38742]], [[64029, 64029], "mapped", [31934]], [[64030, 64030], "mapped", [32701]], [[64031, 64031], "valid"], [[64032, 64032], "mapped", [34322]], [[64033, 64033], "valid"], [[64034, 64034], "mapped", [35576]], [[64035, 64036], "valid"], [[64037, 64037], "mapped", [36920]], [[64038, 64038], "mapped", [37117]], [[64039, 64041], "valid"], [[64042, 64042], "mapped", [39151]], [[64043, 64043], "mapped", [39164]], [[64044, 64044], "mapped", [39208]], [[64045, 64045], "mapped", [40372]], [[64046, 64046], "mapped", [37086]], [[64047, 64047], "mapped", [38583]], [[64048, 64048], "mapped", [20398]], [[64049, 64049], "mapped", [20711]], [[64050, 64050], "mapped", [20813]], [[64051, 64051], "mapped", [21193]], [[64052, 64052], "mapped", [21220]], [[64053, 64053], "mapped", [21329]], [[64054, 64054], "mapped", [21917]], [[64055, 64055], "mapped", [22022]], [[64056, 64056], "mapped", [22120]], [[64057, 64057], "mapped", [22592]], [[64058, 64058], "mapped", [22696]], [[64059, 64059], "mapped", [23652]], [[64060, 64060], "mapped", [23662]], [[64061, 64061], "mapped", [24724]], [[64062, 64062], "mapped", [24936]], [[64063, 64063], "mapped", [24974]], [[64064, 64064], "mapped", [25074]], [[64065, 64065], "mapped", [25935]], [[64066, 64066], "mapped", [26082]], [[64067, 64067], "mapped", [26257]], [[64068, 64068], "mapped", [26757]], [[64069, 64069], "mapped", [28023]], [[64070, 64070], "mapped", [28186]], [[64071, 64071], "mapped", [28450]], [[64072, 64072], "mapped", [29038]], [[64073, 64073], "mapped", [29227]], [[64074, 64074], "mapped", [29730]], [[64075, 64075], "mapped", [30865]], [[64076, 64076], "mapped", [31038]], [[64077, 64077], "mapped", [31049]], [[64078, 64078], "mapped", [31048]], [[64079, 64079], "mapped", [31056]], [[64080, 64080], "mapped", [31062]], [[64081, 64081], "mapped", [31069]], [[64082, 64082], "mapped", [31117]], [[64083, 64083], "mapped", [31118]], [[64084, 64084], "mapped", [31296]], [[64085, 64085], "mapped", [31361]], [[64086, 64086], "mapped", [31680]], [[64087, 64087], "mapped", [32244]], [[64088, 64088], "mapped", [32265]], [[64089, 64089], "mapped", [32321]], [[64090, 64090], "mapped", [32626]], [[64091, 64091], "mapped", [32773]], [[64092, 64092], "mapped", [33261]], [[64093, 64094], "mapped", [33401]], [[64095, 64095], "mapped", [33879]], [[64096, 64096], "mapped", [35088]], [[64097, 64097], "mapped", [35222]], [[64098, 64098], "mapped", [35585]], [[64099, 64099], "mapped", [35641]], [[64100, 64100], "mapped", [36051]], [[64101, 64101], "mapped", [36104]], [[64102, 64102], "mapped", [36790]], [[64103, 64103], "mapped", [36920]], [[64104, 64104], "mapped", [38627]], [[64105, 64105], "mapped", [38911]], [[64106, 64106], "mapped", [38971]], [[64107, 64107], "mapped", [24693]], [[64108, 64108], "mapped", [148206]], [[64109, 64109], "mapped", [33304]], [[64110, 64111], "disallowed"], [[64112, 64112], "mapped", [20006]], [[64113, 64113], "mapped", [20917]], [[64114, 64114], "mapped", [20840]], [[64115, 64115], "mapped", [20352]], [[64116, 64116], "mapped", [20805]], [[64117, 64117], "mapped", [20864]], [[64118, 64118], "mapped", [21191]], [[64119, 64119], "mapped", [21242]], [[64120, 64120], "mapped", [21917]], [[64121, 64121], "mapped", [21845]], [[64122, 64122], "mapped", [21913]], [[64123, 64123], "mapped", [21986]], [[64124, 64124], "mapped", [22618]], [[64125, 64125], "mapped", [22707]], [[64126, 64126], "mapped", [22852]], [[64127, 64127], "mapped", [22868]], [[64128, 64128], "mapped", [23138]], [[64129, 64129], "mapped", [23336]], [[64130, 64130], "mapped", [24274]], [[64131, 64131], "mapped", [24281]], [[64132, 64132], "mapped", [24425]], [[64133, 64133], "mapped", [24493]], [[64134, 64134], "mapped", [24792]], [[64135, 64135], "mapped", [24910]], [[64136, 64136], "mapped", [24840]], [[64137, 64137], "mapped", [24974]], [[64138, 64138], "mapped", [24928]], [[64139, 64139], "mapped", [25074]], [[64140, 64140], "mapped", [25140]], [[64141, 64141], "mapped", [25540]], [[64142, 64142], "mapped", [25628]], [[64143, 64143], "mapped", [25682]], [[64144, 64144], "mapped", [25942]], [[64145, 64145], "mapped", [26228]], [[64146, 64146], "mapped", [26391]], [[64147, 64147], "mapped", [26395]], [[64148, 64148], "mapped", [26454]], [[64149, 64149], "mapped", [27513]], [[64150, 64150], "mapped", [27578]], [[64151, 64151], "mapped", [27969]], [[64152, 64152], "mapped", [28379]], [[64153, 64153], "mapped", [28363]], [[64154, 64154], "mapped", [28450]], [[64155, 64155], "mapped", [28702]], [[64156, 64156], "mapped", [29038]], [[64157, 64157], "mapped", [30631]], [[64158, 64158], "mapped", [29237]], [[64159, 64159], "mapped", [29359]], [[64160, 64160], "mapped", [29482]], [[64161, 64161], "mapped", [29809]], [[64162, 64162], "mapped", [29958]], [[64163, 64163], "mapped", [30011]], [[64164, 64164], "mapped", [30237]], [[64165, 64165], "mapped", [30239]], [[64166, 64166], "mapped", [30410]], [[64167, 64167], "mapped", [30427]], [[64168, 64168], "mapped", [30452]], [[64169, 64169], "mapped", [30538]], [[64170, 64170], "mapped", [30528]], [[64171, 64171], "mapped", [30924]], [[64172, 64172], "mapped", [31409]], [[64173, 64173], "mapped", [31680]], [[64174, 64174], "mapped", [31867]], [[64175, 64175], "mapped", [32091]], [[64176, 64176], "mapped", [32244]], [[64177, 64177], "mapped", [32574]], [[64178, 64178], "mapped", [32773]], [[64179, 64179], "mapped", [33618]], [[64180, 64180], "mapped", [33775]], [[64181, 64181], "mapped", [34681]], [[64182, 64182], "mapped", [35137]], [[64183, 64183], "mapped", [35206]], [[64184, 64184], "mapped", [35222]], [[64185, 64185], "mapped", [35519]], [[64186, 64186], "mapped", [35576]], [[64187, 64187], "mapped", [35531]], [[64188, 64188], "mapped", [35585]], [[64189, 64189], "mapped", [35582]], [[64190, 64190], "mapped", [35565]], [[64191, 64191], "mapped", [35641]], [[64192, 64192], "mapped", [35722]], [[64193, 64193], "mapped", [36104]], [[64194, 64194], "mapped", [36664]], [[64195, 64195], "mapped", [36978]], [[64196, 64196], "mapped", [37273]], [[64197, 64197], "mapped", [37494]], [[64198, 64198], "mapped", [38524]], [[64199, 64199], "mapped", [38627]], [[64200, 64200], "mapped", [38742]], [[64201, 64201], "mapped", [38875]], [[64202, 64202], "mapped", [38911]], [[64203, 64203], "mapped", [38923]], [[64204, 64204], "mapped", [38971]], [[64205, 64205], "mapped", [39698]], [[64206, 64206], "mapped", [40860]], [[64207, 64207], "mapped", [141386]], [[64208, 64208], "mapped", [141380]], [[64209, 64209], "mapped", [144341]], [[64210, 64210], "mapped", [15261]], [[64211, 64211], "mapped", [16408]], [[64212, 64212], "mapped", [16441]], [[64213, 64213], "mapped", [152137]], [[64214, 64214], "mapped", [154832]], [[64215, 64215], "mapped", [163539]], [[64216, 64216], "mapped", [40771]], [[64217, 64217], "mapped", [40846]], [[64218, 64255], "disallowed"], [[64256, 64256], "mapped", [102, 102]], [[64257, 64257], "mapped", [102, 105]], [[64258, 64258], "mapped", [102, 108]], [[64259, 64259], "mapped", [102, 102, 105]], [[64260, 64260], "mapped", [102, 102, 108]], [[64261, 64262], "mapped", [115, 116]], [[64263, 64274], "disallowed"], [[64275, 64275], "mapped", [1396, 1398]], [[64276, 64276], "mapped", [1396, 1381]], [[64277, 64277], "mapped", [1396, 1387]], [[64278, 64278], "mapped", [1406, 1398]], [[64279, 64279], "mapped", [1396, 1389]], [[64280, 64284], "disallowed"], [[64285, 64285], "mapped", [1497, 1460]], [[64286, 64286], "valid"], [[64287, 64287], "mapped", [1522, 1463]], [[64288, 64288], "mapped", [1506]], [[64289, 64289], "mapped", [1488]], [[64290, 64290], "mapped", [1491]], [[64291, 64291], "mapped", [1492]], [[64292, 64292], "mapped", [1499]], [[64293, 64293], "mapped", [1500]], [[64294, 64294], "mapped", [1501]], [[64295, 64295], "mapped", [1512]], [[64296, 64296], "mapped", [1514]], [[64297, 64297], "disallowed_STD3_mapped", [43]], [[64298, 64298], "mapped", [1513, 1473]], [[64299, 64299], "mapped", [1513, 1474]], [[64300, 64300], "mapped", [1513, 1468, 1473]], [[64301, 64301], "mapped", [1513, 1468, 1474]], [[64302, 64302], "mapped", [1488, 1463]], [[64303, 64303], "mapped", [1488, 1464]], [[64304, 64304], "mapped", [1488, 1468]], [[64305, 64305], "mapped", [1489, 1468]], [[64306, 64306], "mapped", [1490, 1468]], [[64307, 64307], "mapped", [1491, 1468]], [[64308, 64308], "mapped", [1492, 1468]], [[64309, 64309], "mapped", [1493, 1468]], [[64310, 64310], "mapped", [1494, 1468]], [[64311, 64311], "disallowed"], [[64312, 64312], "mapped", [1496, 1468]], [[64313, 64313], "mapped", [1497, 1468]], [[64314, 64314], "mapped", [1498, 1468]], [[64315, 64315], "mapped", [1499, 1468]], [[64316, 64316], "mapped", [1500, 1468]], [[64317, 64317], "disallowed"], [[64318, 64318], "mapped", [1502, 1468]], [[64319, 64319], "disallowed"], [[64320, 64320], "mapped", [1504, 1468]], [[64321, 64321], "mapped", [1505, 1468]], [[64322, 64322], "disallowed"], [[64323, 64323], "mapped", [1507, 1468]], [[64324, 64324], "mapped", [1508, 1468]], [[64325, 64325], "disallowed"], [[64326, 64326], "mapped", [1510, 1468]], [[64327, 64327], "mapped", [1511, 1468]], [[64328, 64328], "mapped", [1512, 1468]], [[64329, 64329], "mapped", [1513, 1468]], [[64330, 64330], "mapped", [1514, 1468]], [[64331, 64331], "mapped", [1493, 1465]], [[64332, 64332], "mapped", [1489, 1471]], [[64333, 64333], "mapped", [1499, 1471]], [[64334, 64334], "mapped", [1508, 1471]], [[64335, 64335], "mapped", [1488, 1500]], [[64336, 64337], "mapped", [1649]], [[64338, 64341], "mapped", [1659]], [[64342, 64345], "mapped", [1662]], [[64346, 64349], "mapped", [1664]], [[64350, 64353], "mapped", [1658]], [[64354, 64357], "mapped", [1663]], [[64358, 64361], "mapped", [1657]], [[64362, 64365], "mapped", [1700]], [[64366, 64369], "mapped", [1702]], [[64370, 64373], "mapped", [1668]], [[64374, 64377], "mapped", [1667]], [[64378, 64381], "mapped", [1670]], [[64382, 64385], "mapped", [1671]], [[64386, 64387], "mapped", [1677]], [[64388, 64389], "mapped", [1676]], [[64390, 64391], "mapped", [1678]], [[64392, 64393], "mapped", [1672]], [[64394, 64395], "mapped", [1688]], [[64396, 64397], "mapped", [1681]], [[64398, 64401], "mapped", [1705]], [[64402, 64405], "mapped", [1711]], [[64406, 64409], "mapped", [1715]], [[64410, 64413], "mapped", [1713]], [[64414, 64415], "mapped", [1722]], [[64416, 64419], "mapped", [1723]], [[64420, 64421], "mapped", [1728]], [[64422, 64425], "mapped", [1729]], [[64426, 64429], "mapped", [1726]], [[64430, 64431], "mapped", [1746]], [[64432, 64433], "mapped", [1747]], [[64434, 64449], "valid", [], "NV8"], [[64450, 64466], "disallowed"], [[64467, 64470], "mapped", [1709]], [[64471, 64472], "mapped", [1735]], [[64473, 64474], "mapped", [1734]], [[64475, 64476], "mapped", [1736]], [[64477, 64477], "mapped", [1735, 1652]], [[64478, 64479], "mapped", [1739]], [[64480, 64481], "mapped", [1733]], [[64482, 64483], "mapped", [1737]], [[64484, 64487], "mapped", [1744]], [[64488, 64489], "mapped", [1609]], [[64490, 64491], "mapped", [1574, 1575]], [[64492, 64493], "mapped", [1574, 1749]], [[64494, 64495], "mapped", [1574, 1608]], [[64496, 64497], "mapped", [1574, 1735]], [[64498, 64499], "mapped", [1574, 1734]], [[64500, 64501], "mapped", [1574, 1736]], [[64502, 64504], "mapped", [1574, 1744]], [[64505, 64507], "mapped", [1574, 1609]], [[64508, 64511], "mapped", [1740]], [[64512, 64512], "mapped", [1574, 1580]], [[64513, 64513], "mapped", [1574, 1581]], [[64514, 64514], "mapped", [1574, 1605]], [[64515, 64515], "mapped", [1574, 1609]], [[64516, 64516], "mapped", [1574, 1610]], [[64517, 64517], "mapped", [1576, 1580]], [[64518, 64518], "mapped", [1576, 1581]], [[64519, 64519], "mapped", [1576, 1582]], [[64520, 64520], "mapped", [1576, 1605]], [[64521, 64521], "mapped", [1576, 1609]], [[64522, 64522], "mapped", [1576, 1610]], [[64523, 64523], "mapped", [1578, 1580]], [[64524, 64524], "mapped", [1578, 1581]], [[64525, 64525], "mapped", [1578, 1582]], [[64526, 64526], "mapped", [1578, 1605]], [[64527, 64527], "mapped", [1578, 1609]], [[64528, 64528], "mapped", [1578, 1610]], [[64529, 64529], "mapped", [1579, 1580]], [[64530, 64530], "mapped", [1579, 1605]], [[64531, 64531], "mapped", [1579, 1609]], [[64532, 64532], "mapped", [1579, 1610]], [[64533, 64533], "mapped", [1580, 1581]], [[64534, 64534], "mapped", [1580, 1605]], [[64535, 64535], "mapped", [1581, 1580]], [[64536, 64536], "mapped", [1581, 1605]], [[64537, 64537], "mapped", [1582, 1580]], [[64538, 64538], "mapped", [1582, 1581]], [[64539, 64539], "mapped", [1582, 1605]], [[64540, 64540], "mapped", [1587, 1580]], [[64541, 64541], "mapped", [1587, 1581]], [[64542, 64542], "mapped", [1587, 1582]], [[64543, 64543], "mapped", [1587, 1605]], [[64544, 64544], "mapped", [1589, 1581]], [[64545, 64545], "mapped", [1589, 1605]], [[64546, 64546], "mapped", [1590, 1580]], [[64547, 64547], "mapped", [1590, 1581]], [[64548, 64548], "mapped", [1590, 1582]], [[64549, 64549], "mapped", [1590, 1605]], [[64550, 64550], "mapped", [1591, 1581]], [[64551, 64551], "mapped", [1591, 1605]], [[64552, 64552], "mapped", [1592, 1605]], [[64553, 64553], "mapped", [1593, 1580]], [[64554, 64554], "mapped", [1593, 1605]], [[64555, 64555], "mapped", [1594, 1580]], [[64556, 64556], "mapped", [1594, 1605]], [[64557, 64557], "mapped", [1601, 1580]], [[64558, 64558], "mapped", [1601, 1581]], [[64559, 64559], "mapped", [1601, 1582]], [[64560, 64560], "mapped", [1601, 1605]], [[64561, 64561], "mapped", [1601, 1609]], [[64562, 64562], "mapped", [1601, 1610]], [[64563, 64563], "mapped", [1602, 1581]], [[64564, 64564], "mapped", [1602, 1605]], [[64565, 64565], "mapped", [1602, 1609]], [[64566, 64566], "mapped", [1602, 1610]], [[64567, 64567], "mapped", [1603, 1575]], [[64568, 64568], "mapped", [1603, 1580]], [[64569, 64569], "mapped", [1603, 1581]], [[64570, 64570], "mapped", [1603, 1582]], [[64571, 64571], "mapped", [1603, 1604]], [[64572, 64572], "mapped", [1603, 1605]], [[64573, 64573], "mapped", [1603, 1609]], [[64574, 64574], "mapped", [1603, 1610]], [[64575, 64575], "mapped", [1604, 1580]], [[64576, 64576], "mapped", [1604, 1581]], [[64577, 64577], "mapped", [1604, 1582]], [[64578, 64578], "mapped", [1604, 1605]], [[64579, 64579], "mapped", [1604, 1609]], [[64580, 64580], "mapped", [1604, 1610]], [[64581, 64581], "mapped", [1605, 1580]], [[64582, 64582], "mapped", [1605, 1581]], [[64583, 64583], "mapped", [1605, 1582]], [[64584, 64584], "mapped", [1605, 1605]], [[64585, 64585], "mapped", [1605, 1609]], [[64586, 64586], "mapped", [1605, 1610]], [[64587, 64587], "mapped", [1606, 1580]], [[64588, 64588], "mapped", [1606, 1581]], [[64589, 64589], "mapped", [1606, 1582]], [[64590, 64590], "mapped", [1606, 1605]], [[64591, 64591], "mapped", [1606, 1609]], [[64592, 64592], "mapped", [1606, 1610]], [[64593, 64593], "mapped", [1607, 1580]], [[64594, 64594], "mapped", [1607, 1605]], [[64595, 64595], "mapped", [1607, 1609]], [[64596, 64596], "mapped", [1607, 1610]], [[64597, 64597], "mapped", [1610, 1580]], [[64598, 64598], "mapped", [1610, 1581]], [[64599, 64599], "mapped", [1610, 1582]], [[64600, 64600], "mapped", [1610, 1605]], [[64601, 64601], "mapped", [1610, 1609]], [[64602, 64602], "mapped", [1610, 1610]], [[64603, 64603], "mapped", [1584, 1648]], [[64604, 64604], "mapped", [1585, 1648]], [[64605, 64605], "mapped", [1609, 1648]], [[64606, 64606], "disallowed_STD3_mapped", [32, 1612, 1617]], [[64607, 64607], "disallowed_STD3_mapped", [32, 1613, 1617]], [[64608, 64608], "disallowed_STD3_mapped", [32, 1614, 1617]], [[64609, 64609], "disallowed_STD3_mapped", [32, 1615, 1617]], [[64610, 64610], "disallowed_STD3_mapped", [32, 1616, 1617]], [[64611, 64611], "disallowed_STD3_mapped", [32, 1617, 1648]], [[64612, 64612], "mapped", [1574, 1585]], [[64613, 64613], "mapped", [1574, 1586]], [[64614, 64614], "mapped", [1574, 1605]], [[64615, 64615], "mapped", [1574, 1606]], [[64616, 64616], "mapped", [1574, 1609]], [[64617, 64617], "mapped", [1574, 1610]], [[64618, 64618], "mapped", [1576, 1585]], [[64619, 64619], "mapped", [1576, 1586]], [[64620, 64620], "mapped", [1576, 1605]], [[64621, 64621], "mapped", [1576, 1606]], [[64622, 64622], "mapped", [1576, 1609]], [[64623, 64623], "mapped", [1576, 1610]], [[64624, 64624], "mapped", [1578, 1585]], [[64625, 64625], "mapped", [1578, 1586]], [[64626, 64626], "mapped", [1578, 1605]], [[64627, 64627], "mapped", [1578, 1606]], [[64628, 64628], "mapped", [1578, 1609]], [[64629, 64629], "mapped", [1578, 1610]], [[64630, 64630], "mapped", [1579, 1585]], [[64631, 64631], "mapped", [1579, 1586]], [[64632, 64632], "mapped", [1579, 1605]], [[64633, 64633], "mapped", [1579, 1606]], [[64634, 64634], "mapped", [1579, 1609]], [[64635, 64635], "mapped", [1579, 1610]], [[64636, 64636], "mapped", [1601, 1609]], [[64637, 64637], "mapped", [1601, 1610]], [[64638, 64638], "mapped", [1602, 1609]], [[64639, 64639], "mapped", [1602, 1610]], [[64640, 64640], "mapped", [1603, 1575]], [[64641, 64641], "mapped", [1603, 1604]], [[64642, 64642], "mapped", [1603, 1605]], [[64643, 64643], "mapped", [1603, 1609]], [[64644, 64644], "mapped", [1603, 1610]], [[64645, 64645], "mapped", [1604, 1605]], [[64646, 64646], "mapped", [1604, 1609]], [[64647, 64647], "mapped", [1604, 1610]], [[64648, 64648], "mapped", [1605, 1575]], [[64649, 64649], "mapped", [1605, 1605]], [[64650, 64650], "mapped", [1606, 1585]], [[64651, 64651], "mapped", [1606, 1586]], [[64652, 64652], "mapped", [1606, 1605]], [[64653, 64653], "mapped", [1606, 1606]], [[64654, 64654], "mapped", [1606, 1609]], [[64655, 64655], "mapped", [1606, 1610]], [[64656, 64656], "mapped", [1609, 1648]], [[64657, 64657], "mapped", [1610, 1585]], [[64658, 64658], "mapped", [1610, 1586]], [[64659, 64659], "mapped", [1610, 1605]], [[64660, 64660], "mapped", [1610, 1606]], [[64661, 64661], "mapped", [1610, 1609]], [[64662, 64662], "mapped", [1610, 1610]], [[64663, 64663], "mapped", [1574, 1580]], [[64664, 64664], "mapped", [1574, 1581]], [[64665, 64665], "mapped", [1574, 1582]], [[64666, 64666], "mapped", [1574, 1605]], [[64667, 64667], "mapped", [1574, 1607]], [[64668, 64668], "mapped", [1576, 1580]], [[64669, 64669], "mapped", [1576, 1581]], [[64670, 64670], "mapped", [1576, 1582]], [[64671, 64671], "mapped", [1576, 1605]], [[64672, 64672], "mapped", [1576, 1607]], [[64673, 64673], "mapped", [1578, 1580]], [[64674, 64674], "mapped", [1578, 1581]], [[64675, 64675], "mapped", [1578, 1582]], [[64676, 64676], "mapped", [1578, 1605]], [[64677, 64677], "mapped", [1578, 1607]], [[64678, 64678], "mapped", [1579, 1605]], [[64679, 64679], "mapped", [1580, 1581]], [[64680, 64680], "mapped", [1580, 1605]], [[64681, 64681], "mapped", [1581, 1580]], [[64682, 64682], "mapped", [1581, 1605]], [[64683, 64683], "mapped", [1582, 1580]], [[64684, 64684], "mapped", [1582, 1605]], [[64685, 64685], "mapped", [1587, 1580]], [[64686, 64686], "mapped", [1587, 1581]], [[64687, 64687], "mapped", [1587, 1582]], [[64688, 64688], "mapped", [1587, 1605]], [[64689, 64689], "mapped", [1589, 1581]], [[64690, 64690], "mapped", [1589, 1582]], [[64691, 64691], "mapped", [1589, 1605]], [[64692, 64692], "mapped", [1590, 1580]], [[64693, 64693], "mapped", [1590, 1581]], [[64694, 64694], "mapped", [1590, 1582]], [[64695, 64695], "mapped", [1590, 1605]], [[64696, 64696], "mapped", [1591, 1581]], [[64697, 64697], "mapped", [1592, 1605]], [[64698, 64698], "mapped", [1593, 1580]], [[64699, 64699], "mapped", [1593, 1605]], [[64700, 64700], "mapped", [1594, 1580]], [[64701, 64701], "mapped", [1594, 1605]], [[64702, 64702], "mapped", [1601, 1580]], [[64703, 64703], "mapped", [1601, 1581]], [[64704, 64704], "mapped", [1601, 1582]], [[64705, 64705], "mapped", [1601, 1605]], [[64706, 64706], "mapped", [1602, 1581]], [[64707, 64707], "mapped", [1602, 1605]], [[64708, 64708], "mapped", [1603, 1580]], [[64709, 64709], "mapped", [1603, 1581]], [[64710, 64710], "mapped", [1603, 1582]], [[64711, 64711], "mapped", [1603, 1604]], [[64712, 64712], "mapped", [1603, 1605]], [[64713, 64713], "mapped", [1604, 1580]], [[64714, 64714], "mapped", [1604, 1581]], [[64715, 64715], "mapped", [1604, 1582]], [[64716, 64716], "mapped", [1604, 1605]], [[64717, 64717], "mapped", [1604, 1607]], [[64718, 64718], "mapped", [1605, 1580]], [[64719, 64719], "mapped", [1605, 1581]], [[64720, 64720], "mapped", [1605, 1582]], [[64721, 64721], "mapped", [1605, 1605]], [[64722, 64722], "mapped", [1606, 1580]], [[64723, 64723], "mapped", [1606, 1581]], [[64724, 64724], "mapped", [1606, 1582]], [[64725, 64725], "mapped", [1606, 1605]], [[64726, 64726], "mapped", [1606, 1607]], [[64727, 64727], "mapped", [1607, 1580]], [[64728, 64728], "mapped", [1607, 1605]], [[64729, 64729], "mapped", [1607, 1648]], [[64730, 64730], "mapped", [1610, 1580]], [[64731, 64731], "mapped", [1610, 1581]], [[64732, 64732], "mapped", [1610, 1582]], [[64733, 64733], "mapped", [1610, 1605]], [[64734, 64734], "mapped", [1610, 1607]], [[64735, 64735], "mapped", [1574, 1605]], [[64736, 64736], "mapped", [1574, 1607]], [[64737, 64737], "mapped", [1576, 1605]], [[64738, 64738], "mapped", [1576, 1607]], [[64739, 64739], "mapped", [1578, 1605]], [[64740, 64740], "mapped", [1578, 1607]], [[64741, 64741], "mapped", [1579, 1605]], [[64742, 64742], "mapped", [1579, 1607]], [[64743, 64743], "mapped", [1587, 1605]], [[64744, 64744], "mapped", [1587, 1607]], [[64745, 64745], "mapped", [1588, 1605]], [[64746, 64746], "mapped", [1588, 1607]], [[64747, 64747], "mapped", [1603, 1604]], [[64748, 64748], "mapped", [1603, 1605]], [[64749, 64749], "mapped", [1604, 1605]], [[64750, 64750], "mapped", [1606, 1605]], [[64751, 64751], "mapped", [1606, 1607]], [[64752, 64752], "mapped", [1610, 1605]], [[64753, 64753], "mapped", [1610, 1607]], [[64754, 64754], "mapped", [1600, 1614, 1617]], [[64755, 64755], "mapped", [1600, 1615, 1617]], [[64756, 64756], "mapped", [1600, 1616, 1617]], [[64757, 64757], "mapped", [1591, 1609]], [[64758, 64758], "mapped", [1591, 1610]], [[64759, 64759], "mapped", [1593, 1609]], [[64760, 64760], "mapped", [1593, 1610]], [[64761, 64761], "mapped", [1594, 1609]], [[64762, 64762], "mapped", [1594, 1610]], [[64763, 64763], "mapped", [1587, 1609]], [[64764, 64764], "mapped", [1587, 1610]], [[64765, 64765], "mapped", [1588, 1609]], [[64766, 64766], "mapped", [1588, 1610]], [[64767, 64767], "mapped", [1581, 1609]], [[64768, 64768], "mapped", [1581, 1610]], [[64769, 64769], "mapped", [1580, 1609]], [[64770, 64770], "mapped", [1580, 1610]], [[64771, 64771], "mapped", [1582, 1609]], [[64772, 64772], "mapped", [1582, 1610]], [[64773, 64773], "mapped", [1589, 1609]], [[64774, 64774], "mapped", [1589, 1610]], [[64775, 64775], "mapped", [1590, 1609]], [[64776, 64776], "mapped", [1590, 1610]], [[64777, 64777], "mapped", [1588, 1580]], [[64778, 64778], "mapped", [1588, 1581]], [[64779, 64779], "mapped", [1588, 1582]], [[64780, 64780], "mapped", [1588, 1605]], [[64781, 64781], "mapped", [1588, 1585]], [[64782, 64782], "mapped", [1587, 1585]], [[64783, 64783], "mapped", [1589, 1585]], [[64784, 64784], "mapped", [1590, 1585]], [[64785, 64785], "mapped", [1591, 1609]], [[64786, 64786], "mapped", [1591, 1610]], [[64787, 64787], "mapped", [1593, 1609]], [[64788, 64788], "mapped", [1593, 1610]], [[64789, 64789], "mapped", [1594, 1609]], [[64790, 64790], "mapped", [1594, 1610]], [[64791, 64791], "mapped", [1587, 1609]], [[64792, 64792], "mapped", [1587, 1610]], [[64793, 64793], "mapped", [1588, 1609]], [[64794, 64794], "mapped", [1588, 1610]], [[64795, 64795], "mapped", [1581, 1609]], [[64796, 64796], "mapped", [1581, 1610]], [[64797, 64797], "mapped", [1580, 1609]], [[64798, 64798], "mapped", [1580, 1610]], [[64799, 64799], "mapped", [1582, 1609]], [[64800, 64800], "mapped", [1582, 1610]], [[64801, 64801], "mapped", [1589, 1609]], [[64802, 64802], "mapped", [1589, 1610]], [[64803, 64803], "mapped", [1590, 1609]], [[64804, 64804], "mapped", [1590, 1610]], [[64805, 64805], "mapped", [1588, 1580]], [[64806, 64806], "mapped", [1588, 1581]], [[64807, 64807], "mapped", [1588, 1582]], [[64808, 64808], "mapped", [1588, 1605]], [[64809, 64809], "mapped", [1588, 1585]], [[64810, 64810], "mapped", [1587, 1585]], [[64811, 64811], "mapped", [1589, 1585]], [[64812, 64812], "mapped", [1590, 1585]], [[64813, 64813], "mapped", [1588, 1580]], [[64814, 64814], "mapped", [1588, 1581]], [[64815, 64815], "mapped", [1588, 1582]], [[64816, 64816], "mapped", [1588, 1605]], [[64817, 64817], "mapped", [1587, 1607]], [[64818, 64818], "mapped", [1588, 1607]], [[64819, 64819], "mapped", [1591, 1605]], [[64820, 64820], "mapped", [1587, 1580]], [[64821, 64821], "mapped", [1587, 1581]], [[64822, 64822], "mapped", [1587, 1582]], [[64823, 64823], "mapped", [1588, 1580]], [[64824, 64824], "mapped", [1588, 1581]], [[64825, 64825], "mapped", [1588, 1582]], [[64826, 64826], "mapped", [1591, 1605]], [[64827, 64827], "mapped", [1592, 1605]], [[64828, 64829], "mapped", [1575, 1611]], [[64830, 64831], "valid", [], "NV8"], [[64832, 64847], "disallowed"], [[64848, 64848], "mapped", [1578, 1580, 1605]], [[64849, 64850], "mapped", [1578, 1581, 1580]], [[64851, 64851], "mapped", [1578, 1581, 1605]], [[64852, 64852], "mapped", [1578, 1582, 1605]], [[64853, 64853], "mapped", [1578, 1605, 1580]], [[64854, 64854], "mapped", [1578, 1605, 1581]], [[64855, 64855], "mapped", [1578, 1605, 1582]], [[64856, 64857], "mapped", [1580, 1605, 1581]], [[64858, 64858], "mapped", [1581, 1605, 1610]], [[64859, 64859], "mapped", [1581, 1605, 1609]], [[64860, 64860], "mapped", [1587, 1581, 1580]], [[64861, 64861], "mapped", [1587, 1580, 1581]], [[64862, 64862], "mapped", [1587, 1580, 1609]], [[64863, 64864], "mapped", [1587, 1605, 1581]], [[64865, 64865], "mapped", [1587, 1605, 1580]], [[64866, 64867], "mapped", [1587, 1605, 1605]], [[64868, 64869], "mapped", [1589, 1581, 1581]], [[64870, 64870], "mapped", [1589, 1605, 1605]], [[64871, 64872], "mapped", [1588, 1581, 1605]], [[64873, 64873], "mapped", [1588, 1580, 1610]], [[64874, 64875], "mapped", [1588, 1605, 1582]], [[64876, 64877], "mapped", [1588, 1605, 1605]], [[64878, 64878], "mapped", [1590, 1581, 1609]], [[64879, 64880], "mapped", [1590, 1582, 1605]], [[64881, 64882], "mapped", [1591, 1605, 1581]], [[64883, 64883], "mapped", [1591, 1605, 1605]], [[64884, 64884], "mapped", [1591, 1605, 1610]], [[64885, 64885], "mapped", [1593, 1580, 1605]], [[64886, 64887], "mapped", [1593, 1605, 1605]], [[64888, 64888], "mapped", [1593, 1605, 1609]], [[64889, 64889], "mapped", [1594, 1605, 1605]], [[64890, 64890], "mapped", [1594, 1605, 1610]], [[64891, 64891], "mapped", [1594, 1605, 1609]], [[64892, 64893], "mapped", [1601, 1582, 1605]], [[64894, 64894], "mapped", [1602, 1605, 1581]], [[64895, 64895], "mapped", [1602, 1605, 1605]], [[64896, 64896], "mapped", [1604, 1581, 1605]], [[64897, 64897], "mapped", [1604, 1581, 1610]], [[64898, 64898], "mapped", [1604, 1581, 1609]], [[64899, 64900], "mapped", [1604, 1580, 1580]], [[64901, 64902], "mapped", [1604, 1582, 1605]], [[64903, 64904], "mapped", [1604, 1605, 1581]], [[64905, 64905], "mapped", [1605, 1581, 1580]], [[64906, 64906], "mapped", [1605, 1581, 1605]], [[64907, 64907], "mapped", [1605, 1581, 1610]], [[64908, 64908], "mapped", [1605, 1580, 1581]], [[64909, 64909], "mapped", [1605, 1580, 1605]], [[64910, 64910], "mapped", [1605, 1582, 1580]], [[64911, 64911], "mapped", [1605, 1582, 1605]], [[64912, 64913], "disallowed"], [[64914, 64914], "mapped", [1605, 1580, 1582]], [[64915, 64915], "mapped", [1607, 1605, 1580]], [[64916, 64916], "mapped", [1607, 1605, 1605]], [[64917, 64917], "mapped", [1606, 1581, 1605]], [[64918, 64918], "mapped", [1606, 1581, 1609]], [[64919, 64920], "mapped", [1606, 1580, 1605]], [[64921, 64921], "mapped", [1606, 1580, 1609]], [[64922, 64922], "mapped", [1606, 1605, 1610]], [[64923, 64923], "mapped", [1606, 1605, 1609]], [[64924, 64925], "mapped", [1610, 1605, 1605]], [[64926, 64926], "mapped", [1576, 1582, 1610]], [[64927, 64927], "mapped", [1578, 1580, 1610]], [[64928, 64928], "mapped", [1578, 1580, 1609]], [[64929, 64929], "mapped", [1578, 1582, 1610]], [[64930, 64930], "mapped", [1578, 1582, 1609]], [[64931, 64931], "mapped", [1578, 1605, 1610]], [[64932, 64932], "mapped", [1578, 1605, 1609]], [[64933, 64933], "mapped", [1580, 1605, 1610]], [[64934, 64934], "mapped", [1580, 1581, 1609]], [[64935, 64935], "mapped", [1580, 1605, 1609]], [[64936, 64936], "mapped", [1587, 1582, 1609]], [[64937, 64937], "mapped", [1589, 1581, 1610]], [[64938, 64938], "mapped", [1588, 1581, 1610]], [[64939, 64939], "mapped", [1590, 1581, 1610]], [[64940, 64940], "mapped", [1604, 1580, 1610]], [[64941, 64941], "mapped", [1604, 1605, 1610]], [[64942, 64942], "mapped", [1610, 1581, 1610]], [[64943, 64943], "mapped", [1610, 1580, 1610]], [[64944, 64944], "mapped", [1610, 1605, 1610]], [[64945, 64945], "mapped", [1605, 1605, 1610]], [[64946, 64946], "mapped", [1602, 1605, 1610]], [[64947, 64947], "mapped", [1606, 1581, 1610]], [[64948, 64948], "mapped", [1602, 1605, 1581]], [[64949, 64949], "mapped", [1604, 1581, 1605]], [[64950, 64950], "mapped", [1593, 1605, 1610]], [[64951, 64951], "mapped", [1603, 1605, 1610]], [[64952, 64952], "mapped", [1606, 1580, 1581]], [[64953, 64953], "mapped", [1605, 1582, 1610]], [[64954, 64954], "mapped", [1604, 1580, 1605]], [[64955, 64955], "mapped", [1603, 1605, 1605]], [[64956, 64956], "mapped", [1604, 1580, 1605]], [[64957, 64957], "mapped", [1606, 1580, 1581]], [[64958, 64958], "mapped", [1580, 1581, 1610]], [[64959, 64959], "mapped", [1581, 1580, 1610]], [[64960, 64960], "mapped", [1605, 1580, 1610]], [[64961, 64961], "mapped", [1601, 1605, 1610]], [[64962, 64962], "mapped", [1576, 1581, 1610]], [[64963, 64963], "mapped", [1603, 1605, 1605]], [[64964, 64964], "mapped", [1593, 1580, 1605]], [[64965, 64965], "mapped", [1589, 1605, 1605]], [[64966, 64966], "mapped", [1587, 1582, 1610]], [[64967, 64967], "mapped", [1606, 1580, 1610]], [[64968, 64975], "disallowed"], [[64976, 65007], "disallowed"], [[65008, 65008], "mapped", [1589, 1604, 1746]], [[65009, 65009], "mapped", [1602, 1604, 1746]], [[65010, 65010], "mapped", [1575, 1604, 1604, 1607]], [[65011, 65011], "mapped", [1575, 1603, 1576, 1585]], [[65012, 65012], "mapped", [1605, 1581, 1605, 1583]], [[65013, 65013], "mapped", [1589, 1604, 1593, 1605]], [[65014, 65014], "mapped", [1585, 1587, 1608, 1604]], [[65015, 65015], "mapped", [1593, 1604, 1610, 1607]], [[65016, 65016], "mapped", [1608, 1587, 1604, 1605]], [[65017, 65017], "mapped", [1589, 1604, 1609]], [[65018, 65018], "disallowed_STD3_mapped", [1589, 1604, 1609, 32, 1575, 1604, 1604, 1607, 32, 1593, 1604, 1610, 1607, 32, 1608, 1587, 1604, 1605]], [[65019, 65019], "disallowed_STD3_mapped", [1580, 1604, 32, 1580, 1604, 1575, 1604, 1607]], [[65020, 65020], "mapped", [1585, 1740, 1575, 1604]], [[65021, 65021], "valid", [], "NV8"], [[65022, 65023], "disallowed"], [[65024, 65039], "ignored"], [[65040, 65040], "disallowed_STD3_mapped", [44]], [[65041, 65041], "mapped", [12289]], [[65042, 65042], "disallowed"], [[65043, 65043], "disallowed_STD3_mapped", [58]], [[65044, 65044], "disallowed_STD3_mapped", [59]], [[65045, 65045], "disallowed_STD3_mapped", [33]], [[65046, 65046], "disallowed_STD3_mapped", [63]], [[65047, 65047], "mapped", [12310]], [[65048, 65048], "mapped", [12311]], [[65049, 65049], "disallowed"], [[65050, 65055], "disallowed"], [[65056, 65059], "valid"], [[65060, 65062], "valid"], [[65063, 65069], "valid"], [[65070, 65071], "valid"], [[65072, 65072], "disallowed"], [[65073, 65073], "mapped", [8212]], [[65074, 65074], "mapped", [8211]], [[65075, 65076], "disallowed_STD3_mapped", [95]], [[65077, 65077], "disallowed_STD3_mapped", [40]], [[65078, 65078], "disallowed_STD3_mapped", [41]], [[65079, 65079], "disallowed_STD3_mapped", [123]], [[65080, 65080], "disallowed_STD3_mapped", [125]], [[65081, 65081], "mapped", [12308]], [[65082, 65082], "mapped", [12309]], [[65083, 65083], "mapped", [12304]], [[65084, 65084], "mapped", [12305]], [[65085, 65085], "mapped", [12298]], [[65086, 65086], "mapped", [12299]], [[65087, 65087], "mapped", [12296]], [[65088, 65088], "mapped", [12297]], [[65089, 65089], "mapped", [12300]], [[65090, 65090], "mapped", [12301]], [[65091, 65091], "mapped", [12302]], [[65092, 65092], "mapped", [12303]], [[65093, 65094], "valid", [], "NV8"], [[65095, 65095], "disallowed_STD3_mapped", [91]], [[65096, 65096], "disallowed_STD3_mapped", [93]], [[65097, 65100], "disallowed_STD3_mapped", [32, 773]], [[65101, 65103], "disallowed_STD3_mapped", [95]], [[65104, 65104], "disallowed_STD3_mapped", [44]], [[65105, 65105], "mapped", [12289]], [[65106, 65106], "disallowed"], [[65107, 65107], "disallowed"], [[65108, 65108], "disallowed_STD3_mapped", [59]], [[65109, 65109], "disallowed_STD3_mapped", [58]], [[65110, 65110], "disallowed_STD3_mapped", [63]], [[65111, 65111], "disallowed_STD3_mapped", [33]], [[65112, 65112], "mapped", [8212]], [[65113, 65113], "disallowed_STD3_mapped", [40]], [[65114, 65114], "disallowed_STD3_mapped", [41]], [[65115, 65115], "disallowed_STD3_mapped", [123]], [[65116, 65116], "disallowed_STD3_mapped", [125]], [[65117, 65117], "mapped", [12308]], [[65118, 65118], "mapped", [12309]], [[65119, 65119], "disallowed_STD3_mapped", [35]], [[65120, 65120], "disallowed_STD3_mapped", [38]], [[65121, 65121], "disallowed_STD3_mapped", [42]], [[65122, 65122], "disallowed_STD3_mapped", [43]], [[65123, 65123], "mapped", [45]], [[65124, 65124], "disallowed_STD3_mapped", [60]], [[65125, 65125], "disallowed_STD3_mapped", [62]], [[65126, 65126], "disallowed_STD3_mapped", [61]], [[65127, 65127], "disallowed"], [[65128, 65128], "disallowed_STD3_mapped", [92]], [[65129, 65129], "disallowed_STD3_mapped", [36]], [[65130, 65130], "disallowed_STD3_mapped", [37]], [[65131, 65131], "disallowed_STD3_mapped", [64]], [[65132, 65135], "disallowed"], [[65136, 65136], "disallowed_STD3_mapped", [32, 1611]], [[65137, 65137], "mapped", [1600, 1611]], [[65138, 65138], "disallowed_STD3_mapped", [32, 1612]], [[65139, 65139], "valid"], [[65140, 65140], "disallowed_STD3_mapped", [32, 1613]], [[65141, 65141], "disallowed"], [[65142, 65142], "disallowed_STD3_mapped", [32, 1614]], [[65143, 65143], "mapped", [1600, 1614]], [[65144, 65144], "disallowed_STD3_mapped", [32, 1615]], [[65145, 65145], "mapped", [1600, 1615]], [[65146, 65146], "disallowed_STD3_mapped", [32, 1616]], [[65147, 65147], "mapped", [1600, 1616]], [[65148, 65148], "disallowed_STD3_mapped", [32, 1617]], [[65149, 65149], "mapped", [1600, 1617]], [[65150, 65150], "disallowed_STD3_mapped", [32, 1618]], [[65151, 65151], "mapped", [1600, 1618]], [[65152, 65152], "mapped", [1569]], [[65153, 65154], "mapped", [1570]], [[65155, 65156], "mapped", [1571]], [[65157, 65158], "mapped", [1572]], [[65159, 65160], "mapped", [1573]], [[65161, 65164], "mapped", [1574]], [[65165, 65166], "mapped", [1575]], [[65167, 65170], "mapped", [1576]], [[65171, 65172], "mapped", [1577]], [[65173, 65176], "mapped", [1578]], [[65177, 65180], "mapped", [1579]], [[65181, 65184], "mapped", [1580]], [[65185, 65188], "mapped", [1581]], [[65189, 65192], "mapped", [1582]], [[65193, 65194], "mapped", [1583]], [[65195, 65196], "mapped", [1584]], [[65197, 65198], "mapped", [1585]], [[65199, 65200], "mapped", [1586]], [[65201, 65204], "mapped", [1587]], [[65205, 65208], "mapped", [1588]], [[65209, 65212], "mapped", [1589]], [[65213, 65216], "mapped", [1590]], [[65217, 65220], "mapped", [1591]], [[65221, 65224], "mapped", [1592]], [[65225, 65228], "mapped", [1593]], [[65229, 65232], "mapped", [1594]], [[65233, 65236], "mapped", [1601]], [[65237, 65240], "mapped", [1602]], [[65241, 65244], "mapped", [1603]], [[65245, 65248], "mapped", [1604]], [[65249, 65252], "mapped", [1605]], [[65253, 65256], "mapped", [1606]], [[65257, 65260], "mapped", [1607]], [[65261, 65262], "mapped", [1608]], [[65263, 65264], "mapped", [1609]], [[65265, 65268], "mapped", [1610]], [[65269, 65270], "mapped", [1604, 1570]], [[65271, 65272], "mapped", [1604, 1571]], [[65273, 65274], "mapped", [1604, 1573]], [[65275, 65276], "mapped", [1604, 1575]], [[65277, 65278], "disallowed"], [[65279, 65279], "ignored"], [[65280, 65280], "disallowed"], [[65281, 65281], "disallowed_STD3_mapped", [33]], [[65282, 65282], "disallowed_STD3_mapped", [34]], [[65283, 65283], "disallowed_STD3_mapped", [35]], [[65284, 65284], "disallowed_STD3_mapped", [36]], [[65285, 65285], "disallowed_STD3_mapped", [37]], [[65286, 65286], "disallowed_STD3_mapped", [38]], [[65287, 65287], "disallowed_STD3_mapped", [39]], [[65288, 65288], "disallowed_STD3_mapped", [40]], [[65289, 65289], "disallowed_STD3_mapped", [41]], [[65290, 65290], "disallowed_STD3_mapped", [42]], [[65291, 65291], "disallowed_STD3_mapped", [43]], [[65292, 65292], "disallowed_STD3_mapped", [44]], [[65293, 65293], "mapped", [45]], [[65294, 65294], "mapped", [46]], [[65295, 65295], "disallowed_STD3_mapped", [47]], [[65296, 65296], "mapped", [48]], [[65297, 65297], "mapped", [49]], [[65298, 65298], "mapped", [50]], [[65299, 65299], "mapped", [51]], [[65300, 65300], "mapped", [52]], [[65301, 65301], "mapped", [53]], [[65302, 65302], "mapped", [54]], [[65303, 65303], "mapped", [55]], [[65304, 65304], "mapped", [56]], [[65305, 65305], "mapped", [57]], [[65306, 65306], "disallowed_STD3_mapped", [58]], [[65307, 65307], "disallowed_STD3_mapped", [59]], [[65308, 65308], "disallowed_STD3_mapped", [60]], [[65309, 65309], "disallowed_STD3_mapped", [61]], [[65310, 65310], "disallowed_STD3_mapped", [62]], [[65311, 65311], "disallowed_STD3_mapped", [63]], [[65312, 65312], "disallowed_STD3_mapped", [64]], [[65313, 65313], "mapped", [97]], [[65314, 65314], "mapped", [98]], [[65315, 65315], "mapped", [99]], [[65316, 65316], "mapped", [100]], [[65317, 65317], "mapped", [101]], [[65318, 65318], "mapped", [102]], [[65319, 65319], "mapped", [103]], [[65320, 65320], "mapped", [104]], [[65321, 65321], "mapped", [105]], [[65322, 65322], "mapped", [106]], [[65323, 65323], "mapped", [107]], [[65324, 65324], "mapped", [108]], [[65325, 65325], "mapped", [109]], [[65326, 65326], "mapped", [110]], [[65327, 65327], "mapped", [111]], [[65328, 65328], "mapped", [112]], [[65329, 65329], "mapped", [113]], [[65330, 65330], "mapped", [114]], [[65331, 65331], "mapped", [115]], [[65332, 65332], "mapped", [116]], [[65333, 65333], "mapped", [117]], [[65334, 65334], "mapped", [118]], [[65335, 65335], "mapped", [119]], [[65336, 65336], "mapped", [120]], [[65337, 65337], "mapped", [121]], [[65338, 65338], "mapped", [122]], [[65339, 65339], "disallowed_STD3_mapped", [91]], [[65340, 65340], "disallowed_STD3_mapped", [92]], [[65341, 65341], "disallowed_STD3_mapped", [93]], [[65342, 65342], "disallowed_STD3_mapped", [94]], [[65343, 65343], "disallowed_STD3_mapped", [95]], [[65344, 65344], "disallowed_STD3_mapped", [96]], [[65345, 65345], "mapped", [97]], [[65346, 65346], "mapped", [98]], [[65347, 65347], "mapped", [99]], [[65348, 65348], "mapped", [100]], [[65349, 65349], "mapped", [101]], [[65350, 65350], "mapped", [102]], [[65351, 65351], "mapped", [103]], [[65352, 65352], "mapped", [104]], [[65353, 65353], "mapped", [105]], [[65354, 65354], "mapped", [106]], [[65355, 65355], "mapped", [107]], [[65356, 65356], "mapped", [108]], [[65357, 65357], "mapped", [109]], [[65358, 65358], "mapped", [110]], [[65359, 65359], "mapped", [111]], [[65360, 65360], "mapped", [112]], [[65361, 65361], "mapped", [113]], [[65362, 65362], "mapped", [114]], [[65363, 65363], "mapped", [115]], [[65364, 65364], "mapped", [116]], [[65365, 65365], "mapped", [117]], [[65366, 65366], "mapped", [118]], [[65367, 65367], "mapped", [119]], [[65368, 65368], "mapped", [120]], [[65369, 65369], "mapped", [121]], [[65370, 65370], "mapped", [122]], [[65371, 65371], "disallowed_STD3_mapped", [123]], [[65372, 65372], "disallowed_STD3_mapped", [124]], [[65373, 65373], "disallowed_STD3_mapped", [125]], [[65374, 65374], "disallowed_STD3_mapped", [126]], [[65375, 65375], "mapped", [10629]], [[65376, 65376], "mapped", [10630]], [[65377, 65377], "mapped", [46]], [[65378, 65378], "mapped", [12300]], [[65379, 65379], "mapped", [12301]], [[65380, 65380], "mapped", [12289]], [[65381, 65381], "mapped", [12539]], [[65382, 65382], "mapped", [12530]], [[65383, 65383], "mapped", [12449]], [[65384, 65384], "mapped", [12451]], [[65385, 65385], "mapped", [12453]], [[65386, 65386], "mapped", [12455]], [[65387, 65387], "mapped", [12457]], [[65388, 65388], "mapped", [12515]], [[65389, 65389], "mapped", [12517]], [[65390, 65390], "mapped", [12519]], [[65391, 65391], "mapped", [12483]], [[65392, 65392], "mapped", [12540]], [[65393, 65393], "mapped", [12450]], [[65394, 65394], "mapped", [12452]], [[65395, 65395], "mapped", [12454]], [[65396, 65396], "mapped", [12456]], [[65397, 65397], "mapped", [12458]], [[65398, 65398], "mapped", [12459]], [[65399, 65399], "mapped", [12461]], [[65400, 65400], "mapped", [12463]], [[65401, 65401], "mapped", [12465]], [[65402, 65402], "mapped", [12467]], [[65403, 65403], "mapped", [12469]], [[65404, 65404], "mapped", [12471]], [[65405, 65405], "mapped", [12473]], [[65406, 65406], "mapped", [12475]], [[65407, 65407], "mapped", [12477]], [[65408, 65408], "mapped", [12479]], [[65409, 65409], "mapped", [12481]], [[65410, 65410], "mapped", [12484]], [[65411, 65411], "mapped", [12486]], [[65412, 65412], "mapped", [12488]], [[65413, 65413], "mapped", [12490]], [[65414, 65414], "mapped", [12491]], [[65415, 65415], "mapped", [12492]], [[65416, 65416], "mapped", [12493]], [[65417, 65417], "mapped", [12494]], [[65418, 65418], "mapped", [12495]], [[65419, 65419], "mapped", [12498]], [[65420, 65420], "mapped", [12501]], [[65421, 65421], "mapped", [12504]], [[65422, 65422], "mapped", [12507]], [[65423, 65423], "mapped", [12510]], [[65424, 65424], "mapped", [12511]], [[65425, 65425], "mapped", [12512]], [[65426, 65426], "mapped", [12513]], [[65427, 65427], "mapped", [12514]], [[65428, 65428], "mapped", [12516]], [[65429, 65429], "mapped", [12518]], [[65430, 65430], "mapped", [12520]], [[65431, 65431], "mapped", [12521]], [[65432, 65432], "mapped", [12522]], [[65433, 65433], "mapped", [12523]], [[65434, 65434], "mapped", [12524]], [[65435, 65435], "mapped", [12525]], [[65436, 65436], "mapped", [12527]], [[65437, 65437], "mapped", [12531]], [[65438, 65438], "mapped", [12441]], [[65439, 65439], "mapped", [12442]], [[65440, 65440], "disallowed"], [[65441, 65441], "mapped", [4352]], [[65442, 65442], "mapped", [4353]], [[65443, 65443], "mapped", [4522]], [[65444, 65444], "mapped", [4354]], [[65445, 65445], "mapped", [4524]], [[65446, 65446], "mapped", [4525]], [[65447, 65447], "mapped", [4355]], [[65448, 65448], "mapped", [4356]], [[65449, 65449], "mapped", [4357]], [[65450, 65450], "mapped", [4528]], [[65451, 65451], "mapped", [4529]], [[65452, 65452], "mapped", [4530]], [[65453, 65453], "mapped", [4531]], [[65454, 65454], "mapped", [4532]], [[65455, 65455], "mapped", [4533]], [[65456, 65456], "mapped", [4378]], [[65457, 65457], "mapped", [4358]], [[65458, 65458], "mapped", [4359]], [[65459, 65459], "mapped", [4360]], [[65460, 65460], "mapped", [4385]], [[65461, 65461], "mapped", [4361]], [[65462, 65462], "mapped", [4362]], [[65463, 65463], "mapped", [4363]], [[65464, 65464], "mapped", [4364]], [[65465, 65465], "mapped", [4365]], [[65466, 65466], "mapped", [4366]], [[65467, 65467], "mapped", [4367]], [[65468, 65468], "mapped", [4368]], [[65469, 65469], "mapped", [4369]], [[65470, 65470], "mapped", [4370]], [[65471, 65473], "disallowed"], [[65474, 65474], "mapped", [4449]], [[65475, 65475], "mapped", [4450]], [[65476, 65476], "mapped", [4451]], [[65477, 65477], "mapped", [4452]], [[65478, 65478], "mapped", [4453]], [[65479, 65479], "mapped", [4454]], [[65480, 65481], "disallowed"], [[65482, 65482], "mapped", [4455]], [[65483, 65483], "mapped", [4456]], [[65484, 65484], "mapped", [4457]], [[65485, 65485], "mapped", [4458]], [[65486, 65486], "mapped", [4459]], [[65487, 65487], "mapped", [4460]], [[65488, 65489], "disallowed"], [[65490, 65490], "mapped", [4461]], [[65491, 65491], "mapped", [4462]], [[65492, 65492], "mapped", [4463]], [[65493, 65493], "mapped", [4464]], [[65494, 65494], "mapped", [4465]], [[65495, 65495], "mapped", [4466]], [[65496, 65497], "disallowed"], [[65498, 65498], "mapped", [4467]], [[65499, 65499], "mapped", [4468]], [[65500, 65500], "mapped", [4469]], [[65501, 65503], "disallowed"], [[65504, 65504], "mapped", [162]], [[65505, 65505], "mapped", [163]], [[65506, 65506], "mapped", [172]], [[65507, 65507], "disallowed_STD3_mapped", [32, 772]], [[65508, 65508], "mapped", [166]], [[65509, 65509], "mapped", [165]], [[65510, 65510], "mapped", [8361]], [[65511, 65511], "disallowed"], [[65512, 65512], "mapped", [9474]], [[65513, 65513], "mapped", [8592]], [[65514, 65514], "mapped", [8593]], [[65515, 65515], "mapped", [8594]], [[65516, 65516], "mapped", [8595]], [[65517, 65517], "mapped", [9632]], [[65518, 65518], "mapped", [9675]], [[65519, 65528], "disallowed"], [[65529, 65531], "disallowed"], [[65532, 65532], "disallowed"], [[65533, 65533], "disallowed"], [[65534, 65535], "disallowed"], [[65536, 65547], "valid"], [[65548, 65548], "disallowed"], [[65549, 65574], "valid"], [[65575, 65575], "disallowed"], [[65576, 65594], "valid"], [[65595, 65595], "disallowed"], [[65596, 65597], "valid"], [[65598, 65598], "disallowed"], [[65599, 65613], "valid"], [[65614, 65615], "disallowed"], [[65616, 65629], "valid"], [[65630, 65663], "disallowed"], [[65664, 65786], "valid"], [[65787, 65791], "disallowed"], [[65792, 65794], "valid", [], "NV8"], [[65795, 65798], "disallowed"], [[65799, 65843], "valid", [], "NV8"], [[65844, 65846], "disallowed"], [[65847, 65855], "valid", [], "NV8"], [[65856, 65930], "valid", [], "NV8"], [[65931, 65932], "valid", [], "NV8"], [[65933, 65935], "disallowed"], [[65936, 65947], "valid", [], "NV8"], [[65948, 65951], "disallowed"], [[65952, 65952], "valid", [], "NV8"], [[65953, 65999], "disallowed"], [[66e3, 66044], "valid", [], "NV8"], [[66045, 66045], "valid"], [[66046, 66175], "disallowed"], [[66176, 66204], "valid"], [[66205, 66207], "disallowed"], [[66208, 66256], "valid"], [[66257, 66271], "disallowed"], [[66272, 66272], "valid"], [[66273, 66299], "valid", [], "NV8"], [[66300, 66303], "disallowed"], [[66304, 66334], "valid"], [[66335, 66335], "valid"], [[66336, 66339], "valid", [], "NV8"], [[66340, 66351], "disallowed"], [[66352, 66368], "valid"], [[66369, 66369], "valid", [], "NV8"], [[66370, 66377], "valid"], [[66378, 66378], "valid", [], "NV8"], [[66379, 66383], "disallowed"], [[66384, 66426], "valid"], [[66427, 66431], "disallowed"], [[66432, 66461], "valid"], [[66462, 66462], "disallowed"], [[66463, 66463], "valid", [], "NV8"], [[66464, 66499], "valid"], [[66500, 66503], "disallowed"], [[66504, 66511], "valid"], [[66512, 66517], "valid", [], "NV8"], [[66518, 66559], "disallowed"], [[66560, 66560], "mapped", [66600]], [[66561, 66561], "mapped", [66601]], [[66562, 66562], "mapped", [66602]], [[66563, 66563], "mapped", [66603]], [[66564, 66564], "mapped", [66604]], [[66565, 66565], "mapped", [66605]], [[66566, 66566], "mapped", [66606]], [[66567, 66567], "mapped", [66607]], [[66568, 66568], "mapped", [66608]], [[66569, 66569], "mapped", [66609]], [[66570, 66570], "mapped", [66610]], [[66571, 66571], "mapped", [66611]], [[66572, 66572], "mapped", [66612]], [[66573, 66573], "mapped", [66613]], [[66574, 66574], "mapped", [66614]], [[66575, 66575], "mapped", [66615]], [[66576, 66576], "mapped", [66616]], [[66577, 66577], "mapped", [66617]], [[66578, 66578], "mapped", [66618]], [[66579, 66579], "mapped", [66619]], [[66580, 66580], "mapped", [66620]], [[66581, 66581], "mapped", [66621]], [[66582, 66582], "mapped", [66622]], [[66583, 66583], "mapped", [66623]], [[66584, 66584], "mapped", [66624]], [[66585, 66585], "mapped", [66625]], [[66586, 66586], "mapped", [66626]], [[66587, 66587], "mapped", [66627]], [[66588, 66588], "mapped", [66628]], [[66589, 66589], "mapped", [66629]], [[66590, 66590], "mapped", [66630]], [[66591, 66591], "mapped", [66631]], [[66592, 66592], "mapped", [66632]], [[66593, 66593], "mapped", [66633]], [[66594, 66594], "mapped", [66634]], [[66595, 66595], "mapped", [66635]], [[66596, 66596], "mapped", [66636]], [[66597, 66597], "mapped", [66637]], [[66598, 66598], "mapped", [66638]], [[66599, 66599], "mapped", [66639]], [[66600, 66637], "valid"], [[66638, 66717], "valid"], [[66718, 66719], "disallowed"], [[66720, 66729], "valid"], [[66730, 66815], "disallowed"], [[66816, 66855], "valid"], [[66856, 66863], "disallowed"], [[66864, 66915], "valid"], [[66916, 66926], "disallowed"], [[66927, 66927], "valid", [], "NV8"], [[66928, 67071], "disallowed"], [[67072, 67382], "valid"], [[67383, 67391], "disallowed"], [[67392, 67413], "valid"], [[67414, 67423], "disallowed"], [[67424, 67431], "valid"], [[67432, 67583], "disallowed"], [[67584, 67589], "valid"], [[67590, 67591], "disallowed"], [[67592, 67592], "valid"], [[67593, 67593], "disallowed"], [[67594, 67637], "valid"], [[67638, 67638], "disallowed"], [[67639, 67640], "valid"], [[67641, 67643], "disallowed"], [[67644, 67644], "valid"], [[67645, 67646], "disallowed"], [[67647, 67647], "valid"], [[67648, 67669], "valid"], [[67670, 67670], "disallowed"], [[67671, 67679], "valid", [], "NV8"], [[67680, 67702], "valid"], [[67703, 67711], "valid", [], "NV8"], [[67712, 67742], "valid"], [[67743, 67750], "disallowed"], [[67751, 67759], "valid", [], "NV8"], [[67760, 67807], "disallowed"], [[67808, 67826], "valid"], [[67827, 67827], "disallowed"], [[67828, 67829], "valid"], [[67830, 67834], "disallowed"], [[67835, 67839], "valid", [], "NV8"], [[67840, 67861], "valid"], [[67862, 67865], "valid", [], "NV8"], [[67866, 67867], "valid", [], "NV8"], [[67868, 67870], "disallowed"], [[67871, 67871], "valid", [], "NV8"], [[67872, 67897], "valid"], [[67898, 67902], "disallowed"], [[67903, 67903], "valid", [], "NV8"], [[67904, 67967], "disallowed"], [[67968, 68023], "valid"], [[68024, 68027], "disallowed"], [[68028, 68029], "valid", [], "NV8"], [[68030, 68031], "valid"], [[68032, 68047], "valid", [], "NV8"], [[68048, 68049], "disallowed"], [[68050, 68095], "valid", [], "NV8"], [[68096, 68099], "valid"], [[68100, 68100], "disallowed"], [[68101, 68102], "valid"], [[68103, 68107], "disallowed"], [[68108, 68115], "valid"], [[68116, 68116], "disallowed"], [[68117, 68119], "valid"], [[68120, 68120], "disallowed"], [[68121, 68147], "valid"], [[68148, 68151], "disallowed"], [[68152, 68154], "valid"], [[68155, 68158], "disallowed"], [[68159, 68159], "valid"], [[68160, 68167], "valid", [], "NV8"], [[68168, 68175], "disallowed"], [[68176, 68184], "valid", [], "NV8"], [[68185, 68191], "disallowed"], [[68192, 68220], "valid"], [[68221, 68223], "valid", [], "NV8"], [[68224, 68252], "valid"], [[68253, 68255], "valid", [], "NV8"], [[68256, 68287], "disallowed"], [[68288, 68295], "valid"], [[68296, 68296], "valid", [], "NV8"], [[68297, 68326], "valid"], [[68327, 68330], "disallowed"], [[68331, 68342], "valid", [], "NV8"], [[68343, 68351], "disallowed"], [[68352, 68405], "valid"], [[68406, 68408], "disallowed"], [[68409, 68415], "valid", [], "NV8"], [[68416, 68437], "valid"], [[68438, 68439], "disallowed"], [[68440, 68447], "valid", [], "NV8"], [[68448, 68466], "valid"], [[68467, 68471], "disallowed"], [[68472, 68479], "valid", [], "NV8"], [[68480, 68497], "valid"], [[68498, 68504], "disallowed"], [[68505, 68508], "valid", [], "NV8"], [[68509, 68520], "disallowed"], [[68521, 68527], "valid", [], "NV8"], [[68528, 68607], "disallowed"], [[68608, 68680], "valid"], [[68681, 68735], "disallowed"], [[68736, 68736], "mapped", [68800]], [[68737, 68737], "mapped", [68801]], [[68738, 68738], "mapped", [68802]], [[68739, 68739], "mapped", [68803]], [[68740, 68740], "mapped", [68804]], [[68741, 68741], "mapped", [68805]], [[68742, 68742], "mapped", [68806]], [[68743, 68743], "mapped", [68807]], [[68744, 68744], "mapped", [68808]], [[68745, 68745], "mapped", [68809]], [[68746, 68746], "mapped", [68810]], [[68747, 68747], "mapped", [68811]], [[68748, 68748], "mapped", [68812]], [[68749, 68749], "mapped", [68813]], [[68750, 68750], "mapped", [68814]], [[68751, 68751], "mapped", [68815]], [[68752, 68752], "mapped", [68816]], [[68753, 68753], "mapped", [68817]], [[68754, 68754], "mapped", [68818]], [[68755, 68755], "mapped", [68819]], [[68756, 68756], "mapped", [68820]], [[68757, 68757], "mapped", [68821]], [[68758, 68758], "mapped", [68822]], [[68759, 68759], "mapped", [68823]], [[68760, 68760], "mapped", [68824]], [[68761, 68761], "mapped", [68825]], [[68762, 68762], "mapped", [68826]], [[68763, 68763], "mapped", [68827]], [[68764, 68764], "mapped", [68828]], [[68765, 68765], "mapped", [68829]], [[68766, 68766], "mapped", [68830]], [[68767, 68767], "mapped", [68831]], [[68768, 68768], "mapped", [68832]], [[68769, 68769], "mapped", [68833]], [[68770, 68770], "mapped", [68834]], [[68771, 68771], "mapped", [68835]], [[68772, 68772], "mapped", [68836]], [[68773, 68773], "mapped", [68837]], [[68774, 68774], "mapped", [68838]], [[68775, 68775], "mapped", [68839]], [[68776, 68776], "mapped", [68840]], [[68777, 68777], "mapped", [68841]], [[68778, 68778], "mapped", [68842]], [[68779, 68779], "mapped", [68843]], [[68780, 68780], "mapped", [68844]], [[68781, 68781], "mapped", [68845]], [[68782, 68782], "mapped", [68846]], [[68783, 68783], "mapped", [68847]], [[68784, 68784], "mapped", [68848]], [[68785, 68785], "mapped", [68849]], [[68786, 68786], "mapped", [68850]], [[68787, 68799], "disallowed"], [[68800, 68850], "valid"], [[68851, 68857], "disallowed"], [[68858, 68863], "valid", [], "NV8"], [[68864, 69215], "disallowed"], [[69216, 69246], "valid", [], "NV8"], [[69247, 69631], "disallowed"], [[69632, 69702], "valid"], [[69703, 69709], "valid", [], "NV8"], [[69710, 69713], "disallowed"], [[69714, 69733], "valid", [], "NV8"], [[69734, 69743], "valid"], [[69744, 69758], "disallowed"], [[69759, 69759], "valid"], [[69760, 69818], "valid"], [[69819, 69820], "valid", [], "NV8"], [[69821, 69821], "disallowed"], [[69822, 69825], "valid", [], "NV8"], [[69826, 69839], "disallowed"], [[69840, 69864], "valid"], [[69865, 69871], "disallowed"], [[69872, 69881], "valid"], [[69882, 69887], "disallowed"], [[69888, 69940], "valid"], [[69941, 69941], "disallowed"], [[69942, 69951], "valid"], [[69952, 69955], "valid", [], "NV8"], [[69956, 69967], "disallowed"], [[69968, 70003], "valid"], [[70004, 70005], "valid", [], "NV8"], [[70006, 70006], "valid"], [[70007, 70015], "disallowed"], [[70016, 70084], "valid"], [[70085, 70088], "valid", [], "NV8"], [[70089, 70089], "valid", [], "NV8"], [[70090, 70092], "valid"], [[70093, 70093], "valid", [], "NV8"], [[70094, 70095], "disallowed"], [[70096, 70105], "valid"], [[70106, 70106], "valid"], [[70107, 70107], "valid", [], "NV8"], [[70108, 70108], "valid"], [[70109, 70111], "valid", [], "NV8"], [[70112, 70112], "disallowed"], [[70113, 70132], "valid", [], "NV8"], [[70133, 70143], "disallowed"], [[70144, 70161], "valid"], [[70162, 70162], "disallowed"], [[70163, 70199], "valid"], [[70200, 70205], "valid", [], "NV8"], [[70206, 70271], "disallowed"], [[70272, 70278], "valid"], [[70279, 70279], "disallowed"], [[70280, 70280], "valid"], [[70281, 70281], "disallowed"], [[70282, 70285], "valid"], [[70286, 70286], "disallowed"], [[70287, 70301], "valid"], [[70302, 70302], "disallowed"], [[70303, 70312], "valid"], [[70313, 70313], "valid", [], "NV8"], [[70314, 70319], "disallowed"], [[70320, 70378], "valid"], [[70379, 70383], "disallowed"], [[70384, 70393], "valid"], [[70394, 70399], "disallowed"], [[70400, 70400], "valid"], [[70401, 70403], "valid"], [[70404, 70404], "disallowed"], [[70405, 70412], "valid"], [[70413, 70414], "disallowed"], [[70415, 70416], "valid"], [[70417, 70418], "disallowed"], [[70419, 70440], "valid"], [[70441, 70441], "disallowed"], [[70442, 70448], "valid"], [[70449, 70449], "disallowed"], [[70450, 70451], "valid"], [[70452, 70452], "disallowed"], [[70453, 70457], "valid"], [[70458, 70459], "disallowed"], [[70460, 70468], "valid"], [[70469, 70470], "disallowed"], [[70471, 70472], "valid"], [[70473, 70474], "disallowed"], [[70475, 70477], "valid"], [[70478, 70479], "disallowed"], [[70480, 70480], "valid"], [[70481, 70486], "disallowed"], [[70487, 70487], "valid"], [[70488, 70492], "disallowed"], [[70493, 70499], "valid"], [[70500, 70501], "disallowed"], [[70502, 70508], "valid"], [[70509, 70511], "disallowed"], [[70512, 70516], "valid"], [[70517, 70783], "disallowed"], [[70784, 70853], "valid"], [[70854, 70854], "valid", [], "NV8"], [[70855, 70855], "valid"], [[70856, 70863], "disallowed"], [[70864, 70873], "valid"], [[70874, 71039], "disallowed"], [[71040, 71093], "valid"], [[71094, 71095], "disallowed"], [[71096, 71104], "valid"], [[71105, 71113], "valid", [], "NV8"], [[71114, 71127], "valid", [], "NV8"], [[71128, 71133], "valid"], [[71134, 71167], "disallowed"], [[71168, 71232], "valid"], [[71233, 71235], "valid", [], "NV8"], [[71236, 71236], "valid"], [[71237, 71247], "disallowed"], [[71248, 71257], "valid"], [[71258, 71295], "disallowed"], [[71296, 71351], "valid"], [[71352, 71359], "disallowed"], [[71360, 71369], "valid"], [[71370, 71423], "disallowed"], [[71424, 71449], "valid"], [[71450, 71452], "disallowed"], [[71453, 71467], "valid"], [[71468, 71471], "disallowed"], [[71472, 71481], "valid"], [[71482, 71487], "valid", [], "NV8"], [[71488, 71839], "disallowed"], [[71840, 71840], "mapped", [71872]], [[71841, 71841], "mapped", [71873]], [[71842, 71842], "mapped", [71874]], [[71843, 71843], "mapped", [71875]], [[71844, 71844], "mapped", [71876]], [[71845, 71845], "mapped", [71877]], [[71846, 71846], "mapped", [71878]], [[71847, 71847], "mapped", [71879]], [[71848, 71848], "mapped", [71880]], [[71849, 71849], "mapped", [71881]], [[71850, 71850], "mapped", [71882]], [[71851, 71851], "mapped", [71883]], [[71852, 71852], "mapped", [71884]], [[71853, 71853], "mapped", [71885]], [[71854, 71854], "mapped", [71886]], [[71855, 71855], "mapped", [71887]], [[71856, 71856], "mapped", [71888]], [[71857, 71857], "mapped", [71889]], [[71858, 71858], "mapped", [71890]], [[71859, 71859], "mapped", [71891]], [[71860, 71860], "mapped", [71892]], [[71861, 71861], "mapped", [71893]], [[71862, 71862], "mapped", [71894]], [[71863, 71863], "mapped", [71895]], [[71864, 71864], "mapped", [71896]], [[71865, 71865], "mapped", [71897]], [[71866, 71866], "mapped", [71898]], [[71867, 71867], "mapped", [71899]], [[71868, 71868], "mapped", [71900]], [[71869, 71869], "mapped", [71901]], [[71870, 71870], "mapped", [71902]], [[71871, 71871], "mapped", [71903]], [[71872, 71913], "valid"], [[71914, 71922], "valid", [], "NV8"], [[71923, 71934], "disallowed"], [[71935, 71935], "valid"], [[71936, 72383], "disallowed"], [[72384, 72440], "valid"], [[72441, 73727], "disallowed"], [[73728, 74606], "valid"], [[74607, 74648], "valid"], [[74649, 74649], "valid"], [[74650, 74751], "disallowed"], [[74752, 74850], "valid", [], "NV8"], [[74851, 74862], "valid", [], "NV8"], [[74863, 74863], "disallowed"], [[74864, 74867], "valid", [], "NV8"], [[74868, 74868], "valid", [], "NV8"], [[74869, 74879], "disallowed"], [[74880, 75075], "valid"], [[75076, 77823], "disallowed"], [[77824, 78894], "valid"], [[78895, 82943], "disallowed"], [[82944, 83526], "valid"], [[83527, 92159], "disallowed"], [[92160, 92728], "valid"], [[92729, 92735], "disallowed"], [[92736, 92766], "valid"], [[92767, 92767], "disallowed"], [[92768, 92777], "valid"], [[92778, 92781], "disallowed"], [[92782, 92783], "valid", [], "NV8"], [[92784, 92879], "disallowed"], [[92880, 92909], "valid"], [[92910, 92911], "disallowed"], [[92912, 92916], "valid"], [[92917, 92917], "valid", [], "NV8"], [[92918, 92927], "disallowed"], [[92928, 92982], "valid"], [[92983, 92991], "valid", [], "NV8"], [[92992, 92995], "valid"], [[92996, 92997], "valid", [], "NV8"], [[92998, 93007], "disallowed"], [[93008, 93017], "valid"], [[93018, 93018], "disallowed"], [[93019, 93025], "valid", [], "NV8"], [[93026, 93026], "disallowed"], [[93027, 93047], "valid"], [[93048, 93052], "disallowed"], [[93053, 93071], "valid"], [[93072, 93951], "disallowed"], [[93952, 94020], "valid"], [[94021, 94031], "disallowed"], [[94032, 94078], "valid"], [[94079, 94094], "disallowed"], [[94095, 94111], "valid"], [[94112, 110591], "disallowed"], [[110592, 110593], "valid"], [[110594, 113663], "disallowed"], [[113664, 113770], "valid"], [[113771, 113775], "disallowed"], [[113776, 113788], "valid"], [[113789, 113791], "disallowed"], [[113792, 113800], "valid"], [[113801, 113807], "disallowed"], [[113808, 113817], "valid"], [[113818, 113819], "disallowed"], [[113820, 113820], "valid", [], "NV8"], [[113821, 113822], "valid"], [[113823, 113823], "valid", [], "NV8"], [[113824, 113827], "ignored"], [[113828, 118783], "disallowed"], [[118784, 119029], "valid", [], "NV8"], [[119030, 119039], "disallowed"], [[119040, 119078], "valid", [], "NV8"], [[119079, 119080], "disallowed"], [[119081, 119081], "valid", [], "NV8"], [[119082, 119133], "valid", [], "NV8"], [[119134, 119134], "mapped", [119127, 119141]], [[119135, 119135], "mapped", [119128, 119141]], [[119136, 119136], "mapped", [119128, 119141, 119150]], [[119137, 119137], "mapped", [119128, 119141, 119151]], [[119138, 119138], "mapped", [119128, 119141, 119152]], [[119139, 119139], "mapped", [119128, 119141, 119153]], [[119140, 119140], "mapped", [119128, 119141, 119154]], [[119141, 119154], "valid", [], "NV8"], [[119155, 119162], "disallowed"], [[119163, 119226], "valid", [], "NV8"], [[119227, 119227], "mapped", [119225, 119141]], [[119228, 119228], "mapped", [119226, 119141]], [[119229, 119229], "mapped", [119225, 119141, 119150]], [[119230, 119230], "mapped", [119226, 119141, 119150]], [[119231, 119231], "mapped", [119225, 119141, 119151]], [[119232, 119232], "mapped", [119226, 119141, 119151]], [[119233, 119261], "valid", [], "NV8"], [[119262, 119272], "valid", [], "NV8"], [[119273, 119295], "disallowed"], [[119296, 119365], "valid", [], "NV8"], [[119366, 119551], "disallowed"], [[119552, 119638], "valid", [], "NV8"], [[119639, 119647], "disallowed"], [[119648, 119665], "valid", [], "NV8"], [[119666, 119807], "disallowed"], [[119808, 119808], "mapped", [97]], [[119809, 119809], "mapped", [98]], [[119810, 119810], "mapped", [99]], [[119811, 119811], "mapped", [100]], [[119812, 119812], "mapped", [101]], [[119813, 119813], "mapped", [102]], [[119814, 119814], "mapped", [103]], [[119815, 119815], "mapped", [104]], [[119816, 119816], "mapped", [105]], [[119817, 119817], "mapped", [106]], [[119818, 119818], "mapped", [107]], [[119819, 119819], "mapped", [108]], [[119820, 119820], "mapped", [109]], [[119821, 119821], "mapped", [110]], [[119822, 119822], "mapped", [111]], [[119823, 119823], "mapped", [112]], [[119824, 119824], "mapped", [113]], [[119825, 119825], "mapped", [114]], [[119826, 119826], "mapped", [115]], [[119827, 119827], "mapped", [116]], [[119828, 119828], "mapped", [117]], [[119829, 119829], "mapped", [118]], [[119830, 119830], "mapped", [119]], [[119831, 119831], "mapped", [120]], [[119832, 119832], "mapped", [121]], [[119833, 119833], "mapped", [122]], [[119834, 119834], "mapped", [97]], [[119835, 119835], "mapped", [98]], [[119836, 119836], "mapped", [99]], [[119837, 119837], "mapped", [100]], [[119838, 119838], "mapped", [101]], [[119839, 119839], "mapped", [102]], [[119840, 119840], "mapped", [103]], [[119841, 119841], "mapped", [104]], [[119842, 119842], "mapped", [105]], [[119843, 119843], "mapped", [106]], [[119844, 119844], "mapped", [107]], [[119845, 119845], "mapped", [108]], [[119846, 119846], "mapped", [109]], [[119847, 119847], "mapped", [110]], [[119848, 119848], "mapped", [111]], [[119849, 119849], "mapped", [112]], [[119850, 119850], "mapped", [113]], [[119851, 119851], "mapped", [114]], [[119852, 119852], "mapped", [115]], [[119853, 119853], "mapped", [116]], [[119854, 119854], "mapped", [117]], [[119855, 119855], "mapped", [118]], [[119856, 119856], "mapped", [119]], [[119857, 119857], "mapped", [120]], [[119858, 119858], "mapped", [121]], [[119859, 119859], "mapped", [122]], [[119860, 119860], "mapped", [97]], [[119861, 119861], "mapped", [98]], [[119862, 119862], "mapped", [99]], [[119863, 119863], "mapped", [100]], [[119864, 119864], "mapped", [101]], [[119865, 119865], "mapped", [102]], [[119866, 119866], "mapped", [103]], [[119867, 119867], "mapped", [104]], [[119868, 119868], "mapped", [105]], [[119869, 119869], "mapped", [106]], [[119870, 119870], "mapped", [107]], [[119871, 119871], "mapped", [108]], [[119872, 119872], "mapped", [109]], [[119873, 119873], "mapped", [110]], [[119874, 119874], "mapped", [111]], [[119875, 119875], "mapped", [112]], [[119876, 119876], "mapped", [113]], [[119877, 119877], "mapped", [114]], [[119878, 119878], "mapped", [115]], [[119879, 119879], "mapped", [116]], [[119880, 119880], "mapped", [117]], [[119881, 119881], "mapped", [118]], [[119882, 119882], "mapped", [119]], [[119883, 119883], "mapped", [120]], [[119884, 119884], "mapped", [121]], [[119885, 119885], "mapped", [122]], [[119886, 119886], "mapped", [97]], [[119887, 119887], "mapped", [98]], [[119888, 119888], "mapped", [99]], [[119889, 119889], "mapped", [100]], [[119890, 119890], "mapped", [101]], [[119891, 119891], "mapped", [102]], [[119892, 119892], "mapped", [103]], [[119893, 119893], "disallowed"], [[119894, 119894], "mapped", [105]], [[119895, 119895], "mapped", [106]], [[119896, 119896], "mapped", [107]], [[119897, 119897], "mapped", [108]], [[119898, 119898], "mapped", [109]], [[119899, 119899], "mapped", [110]], [[119900, 119900], "mapped", [111]], [[119901, 119901], "mapped", [112]], [[119902, 119902], "mapped", [113]], [[119903, 119903], "mapped", [114]], [[119904, 119904], "mapped", [115]], [[119905, 119905], "mapped", [116]], [[119906, 119906], "mapped", [117]], [[119907, 119907], "mapped", [118]], [[119908, 119908], "mapped", [119]], [[119909, 119909], "mapped", [120]], [[119910, 119910], "mapped", [121]], [[119911, 119911], "mapped", [122]], [[119912, 119912], "mapped", [97]], [[119913, 119913], "mapped", [98]], [[119914, 119914], "mapped", [99]], [[119915, 119915], "mapped", [100]], [[119916, 119916], "mapped", [101]], [[119917, 119917], "mapped", [102]], [[119918, 119918], "mapped", [103]], [[119919, 119919], "mapped", [104]], [[119920, 119920], "mapped", [105]], [[119921, 119921], "mapped", [106]], [[119922, 119922], "mapped", [107]], [[119923, 119923], "mapped", [108]], [[119924, 119924], "mapped", [109]], [[119925, 119925], "mapped", [110]], [[119926, 119926], "mapped", [111]], [[119927, 119927], "mapped", [112]], [[119928, 119928], "mapped", [113]], [[119929, 119929], "mapped", [114]], [[119930, 119930], "mapped", [115]], [[119931, 119931], "mapped", [116]], [[119932, 119932], "mapped", [117]], [[119933, 119933], "mapped", [118]], [[119934, 119934], "mapped", [119]], [[119935, 119935], "mapped", [120]], [[119936, 119936], "mapped", [121]], [[119937, 119937], "mapped", [122]], [[119938, 119938], "mapped", [97]], [[119939, 119939], "mapped", [98]], [[119940, 119940], "mapped", [99]], [[119941, 119941], "mapped", [100]], [[119942, 119942], "mapped", [101]], [[119943, 119943], "mapped", [102]], [[119944, 119944], "mapped", [103]], [[119945, 119945], "mapped", [104]], [[119946, 119946], "mapped", [105]], [[119947, 119947], "mapped", [106]], [[119948, 119948], "mapped", [107]], [[119949, 119949], "mapped", [108]], [[119950, 119950], "mapped", [109]], [[119951, 119951], "mapped", [110]], [[119952, 119952], "mapped", [111]], [[119953, 119953], "mapped", [112]], [[119954, 119954], "mapped", [113]], [[119955, 119955], "mapped", [114]], [[119956, 119956], "mapped", [115]], [[119957, 119957], "mapped", [116]], [[119958, 119958], "mapped", [117]], [[119959, 119959], "mapped", [118]], [[119960, 119960], "mapped", [119]], [[119961, 119961], "mapped", [120]], [[119962, 119962], "mapped", [121]], [[119963, 119963], "mapped", [122]], [[119964, 119964], "mapped", [97]], [[119965, 119965], "disallowed"], [[119966, 119966], "mapped", [99]], [[119967, 119967], "mapped", [100]], [[119968, 119969], "disallowed"], [[119970, 119970], "mapped", [103]], [[119971, 119972], "disallowed"], [[119973, 119973], "mapped", [106]], [[119974, 119974], "mapped", [107]], [[119975, 119976], "disallowed"], [[119977, 119977], "mapped", [110]], [[119978, 119978], "mapped", [111]], [[119979, 119979], "mapped", [112]], [[119980, 119980], "mapped", [113]], [[119981, 119981], "disallowed"], [[119982, 119982], "mapped", [115]], [[119983, 119983], "mapped", [116]], [[119984, 119984], "mapped", [117]], [[119985, 119985], "mapped", [118]], [[119986, 119986], "mapped", [119]], [[119987, 119987], "mapped", [120]], [[119988, 119988], "mapped", [121]], [[119989, 119989], "mapped", [122]], [[119990, 119990], "mapped", [97]], [[119991, 119991], "mapped", [98]], [[119992, 119992], "mapped", [99]], [[119993, 119993], "mapped", [100]], [[119994, 119994], "disallowed"], [[119995, 119995], "mapped", [102]], [[119996, 119996], "disallowed"], [[119997, 119997], "mapped", [104]], [[119998, 119998], "mapped", [105]], [[119999, 119999], "mapped", [106]], [[12e4, 12e4], "mapped", [107]], [[120001, 120001], "mapped", [108]], [[120002, 120002], "mapped", [109]], [[120003, 120003], "mapped", [110]], [[120004, 120004], "disallowed"], [[120005, 120005], "mapped", [112]], [[120006, 120006], "mapped", [113]], [[120007, 120007], "mapped", [114]], [[120008, 120008], "mapped", [115]], [[120009, 120009], "mapped", [116]], [[120010, 120010], "mapped", [117]], [[120011, 120011], "mapped", [118]], [[120012, 120012], "mapped", [119]], [[120013, 120013], "mapped", [120]], [[120014, 120014], "mapped", [121]], [[120015, 120015], "mapped", [122]], [[120016, 120016], "mapped", [97]], [[120017, 120017], "mapped", [98]], [[120018, 120018], "mapped", [99]], [[120019, 120019], "mapped", [100]], [[120020, 120020], "mapped", [101]], [[120021, 120021], "mapped", [102]], [[120022, 120022], "mapped", [103]], [[120023, 120023], "mapped", [104]], [[120024, 120024], "mapped", [105]], [[120025, 120025], "mapped", [106]], [[120026, 120026], "mapped", [107]], [[120027, 120027], "mapped", [108]], [[120028, 120028], "mapped", [109]], [[120029, 120029], "mapped", [110]], [[120030, 120030], "mapped", [111]], [[120031, 120031], "mapped", [112]], [[120032, 120032], "mapped", [113]], [[120033, 120033], "mapped", [114]], [[120034, 120034], "mapped", [115]], [[120035, 120035], "mapped", [116]], [[120036, 120036], "mapped", [117]], [[120037, 120037], "mapped", [118]], [[120038, 120038], "mapped", [119]], [[120039, 120039], "mapped", [120]], [[120040, 120040], "mapped", [121]], [[120041, 120041], "mapped", [122]], [[120042, 120042], "mapped", [97]], [[120043, 120043], "mapped", [98]], [[120044, 120044], "mapped", [99]], [[120045, 120045], "mapped", [100]], [[120046, 120046], "mapped", [101]], [[120047, 120047], "mapped", [102]], [[120048, 120048], "mapped", [103]], [[120049, 120049], "mapped", [104]], [[120050, 120050], "mapped", [105]], [[120051, 120051], "mapped", [106]], [[120052, 120052], "mapped", [107]], [[120053, 120053], "mapped", [108]], [[120054, 120054], "mapped", [109]], [[120055, 120055], "mapped", [110]], [[120056, 120056], "mapped", [111]], [[120057, 120057], "mapped", [112]], [[120058, 120058], "mapped", [113]], [[120059, 120059], "mapped", [114]], [[120060, 120060], "mapped", [115]], [[120061, 120061], "mapped", [116]], [[120062, 120062], "mapped", [117]], [[120063, 120063], "mapped", [118]], [[120064, 120064], "mapped", [119]], [[120065, 120065], "mapped", [120]], [[120066, 120066], "mapped", [121]], [[120067, 120067], "mapped", [122]], [[120068, 120068], "mapped", [97]], [[120069, 120069], "mapped", [98]], [[120070, 120070], "disallowed"], [[120071, 120071], "mapped", [100]], [[120072, 120072], "mapped", [101]], [[120073, 120073], "mapped", [102]], [[120074, 120074], "mapped", [103]], [[120075, 120076], "disallowed"], [[120077, 120077], "mapped", [106]], [[120078, 120078], "mapped", [107]], [[120079, 120079], "mapped", [108]], [[120080, 120080], "mapped", [109]], [[120081, 120081], "mapped", [110]], [[120082, 120082], "mapped", [111]], [[120083, 120083], "mapped", [112]], [[120084, 120084], "mapped", [113]], [[120085, 120085], "disallowed"], [[120086, 120086], "mapped", [115]], [[120087, 120087], "mapped", [116]], [[120088, 120088], "mapped", [117]], [[120089, 120089], "mapped", [118]], [[120090, 120090], "mapped", [119]], [[120091, 120091], "mapped", [120]], [[120092, 120092], "mapped", [121]], [[120093, 120093], "disallowed"], [[120094, 120094], "mapped", [97]], [[120095, 120095], "mapped", [98]], [[120096, 120096], "mapped", [99]], [[120097, 120097], "mapped", [100]], [[120098, 120098], "mapped", [101]], [[120099, 120099], "mapped", [102]], [[120100, 120100], "mapped", [103]], [[120101, 120101], "mapped", [104]], [[120102, 120102], "mapped", [105]], [[120103, 120103], "mapped", [106]], [[120104, 120104], "mapped", [107]], [[120105, 120105], "mapped", [108]], [[120106, 120106], "mapped", [109]], [[120107, 120107], "mapped", [110]], [[120108, 120108], "mapped", [111]], [[120109, 120109], "mapped", [112]], [[120110, 120110], "mapped", [113]], [[120111, 120111], "mapped", [114]], [[120112, 120112], "mapped", [115]], [[120113, 120113], "mapped", [116]], [[120114, 120114], "mapped", [117]], [[120115, 120115], "mapped", [118]], [[120116, 120116], "mapped", [119]], [[120117, 120117], "mapped", [120]], [[120118, 120118], "mapped", [121]], [[120119, 120119], "mapped", [122]], [[120120, 120120], "mapped", [97]], [[120121, 120121], "mapped", [98]], [[120122, 120122], "disallowed"], [[120123, 120123], "mapped", [100]], [[120124, 120124], "mapped", [101]], [[120125, 120125], "mapped", [102]], [[120126, 120126], "mapped", [103]], [[120127, 120127], "disallowed"], [[120128, 120128], "mapped", [105]], [[120129, 120129], "mapped", [106]], [[120130, 120130], "mapped", [107]], [[120131, 120131], "mapped", [108]], [[120132, 120132], "mapped", [109]], [[120133, 120133], "disallowed"], [[120134, 120134], "mapped", [111]], [[120135, 120137], "disallowed"], [[120138, 120138], "mapped", [115]], [[120139, 120139], "mapped", [116]], [[120140, 120140], "mapped", [117]], [[120141, 120141], "mapped", [118]], [[120142, 120142], "mapped", [119]], [[120143, 120143], "mapped", [120]], [[120144, 120144], "mapped", [121]], [[120145, 120145], "disallowed"], [[120146, 120146], "mapped", [97]], [[120147, 120147], "mapped", [98]], [[120148, 120148], "mapped", [99]], [[120149, 120149], "mapped", [100]], [[120150, 120150], "mapped", [101]], [[120151, 120151], "mapped", [102]], [[120152, 120152], "mapped", [103]], [[120153, 120153], "mapped", [104]], [[120154, 120154], "mapped", [105]], [[120155, 120155], "mapped", [106]], [[120156, 120156], "mapped", [107]], [[120157, 120157], "mapped", [108]], [[120158, 120158], "mapped", [109]], [[120159, 120159], "mapped", [110]], [[120160, 120160], "mapped", [111]], [[120161, 120161], "mapped", [112]], [[120162, 120162], "mapped", [113]], [[120163, 120163], "mapped", [114]], [[120164, 120164], "mapped", [115]], [[120165, 120165], "mapped", [116]], [[120166, 120166], "mapped", [117]], [[120167, 120167], "mapped", [118]], [[120168, 120168], "mapped", [119]], [[120169, 120169], "mapped", [120]], [[120170, 120170], "mapped", [121]], [[120171, 120171], "mapped", [122]], [[120172, 120172], "mapped", [97]], [[120173, 120173], "mapped", [98]], [[120174, 120174], "mapped", [99]], [[120175, 120175], "mapped", [100]], [[120176, 120176], "mapped", [101]], [[120177, 120177], "mapped", [102]], [[120178, 120178], "mapped", [103]], [[120179, 120179], "mapped", [104]], [[120180, 120180], "mapped", [105]], [[120181, 120181], "mapped", [106]], [[120182, 120182], "mapped", [107]], [[120183, 120183], "mapped", [108]], [[120184, 120184], "mapped", [109]], [[120185, 120185], "mapped", [110]], [[120186, 120186], "mapped", [111]], [[120187, 120187], "mapped", [112]], [[120188, 120188], "mapped", [113]], [[120189, 120189], "mapped", [114]], [[120190, 120190], "mapped", [115]], [[120191, 120191], "mapped", [116]], [[120192, 120192], "mapped", [117]], [[120193, 120193], "mapped", [118]], [[120194, 120194], "mapped", [119]], [[120195, 120195], "mapped", [120]], [[120196, 120196], "mapped", [121]], [[120197, 120197], "mapped", [122]], [[120198, 120198], "mapped", [97]], [[120199, 120199], "mapped", [98]], [[120200, 120200], "mapped", [99]], [[120201, 120201], "mapped", [100]], [[120202, 120202], "mapped", [101]], [[120203, 120203], "mapped", [102]], [[120204, 120204], "mapped", [103]], [[120205, 120205], "mapped", [104]], [[120206, 120206], "mapped", [105]], [[120207, 120207], "mapped", [106]], [[120208, 120208], "mapped", [107]], [[120209, 120209], "mapped", [108]], [[120210, 120210], "mapped", [109]], [[120211, 120211], "mapped", [110]], [[120212, 120212], "mapped", [111]], [[120213, 120213], "mapped", [112]], [[120214, 120214], "mapped", [113]], [[120215, 120215], "mapped", [114]], [[120216, 120216], "mapped", [115]], [[120217, 120217], "mapped", [116]], [[120218, 120218], "mapped", [117]], [[120219, 120219], "mapped", [118]], [[120220, 120220], "mapped", [119]], [[120221, 120221], "mapped", [120]], [[120222, 120222], "mapped", [121]], [[120223, 120223], "mapped", [122]], [[120224, 120224], "mapped", [97]], [[120225, 120225], "mapped", [98]], [[120226, 120226], "mapped", [99]], [[120227, 120227], "mapped", [100]], [[120228, 120228], "mapped", [101]], [[120229, 120229], "mapped", [102]], [[120230, 120230], "mapped", [103]], [[120231, 120231], "mapped", [104]], [[120232, 120232], "mapped", [105]], [[120233, 120233], "mapped", [106]], [[120234, 120234], "mapped", [107]], [[120235, 120235], "mapped", [108]], [[120236, 120236], "mapped", [109]], [[120237, 120237], "mapped", [110]], [[120238, 120238], "mapped", [111]], [[120239, 120239], "mapped", [112]], [[120240, 120240], "mapped", [113]], [[120241, 120241], "mapped", [114]], [[120242, 120242], "mapped", [115]], [[120243, 120243], "mapped", [116]], [[120244, 120244], "mapped", [117]], [[120245, 120245], "mapped", [118]], [[120246, 120246], "mapped", [119]], [[120247, 120247], "mapped", [120]], [[120248, 120248], "mapped", [121]], [[120249, 120249], "mapped", [122]], [[120250, 120250], "mapped", [97]], [[120251, 120251], "mapped", [98]], [[120252, 120252], "mapped", [99]], [[120253, 120253], "mapped", [100]], [[120254, 120254], "mapped", [101]], [[120255, 120255], "mapped", [102]], [[120256, 120256], "mapped", [103]], [[120257, 120257], "mapped", [104]], [[120258, 120258], "mapped", [105]], [[120259, 120259], "mapped", [106]], [[120260, 120260], "mapped", [107]], [[120261, 120261], "mapped", [108]], [[120262, 120262], "mapped", [109]], [[120263, 120263], "mapped", [110]], [[120264, 120264], "mapped", [111]], [[120265, 120265], "mapped", [112]], [[120266, 120266], "mapped", [113]], [[120267, 120267], "mapped", [114]], [[120268, 120268], "mapped", [115]], [[120269, 120269], "mapped", [116]], [[120270, 120270], "mapped", [117]], [[120271, 120271], "mapped", [118]], [[120272, 120272], "mapped", [119]], [[120273, 120273], "mapped", [120]], [[120274, 120274], "mapped", [121]], [[120275, 120275], "mapped", [122]], [[120276, 120276], "mapped", [97]], [[120277, 120277], "mapped", [98]], [[120278, 120278], "mapped", [99]], [[120279, 120279], "mapped", [100]], [[120280, 120280], "mapped", [101]], [[120281, 120281], "mapped", [102]], [[120282, 120282], "mapped", [103]], [[120283, 120283], "mapped", [104]], [[120284, 120284], "mapped", [105]], [[120285, 120285], "mapped", [106]], [[120286, 120286], "mapped", [107]], [[120287, 120287], "mapped", [108]], [[120288, 120288], "mapped", [109]], [[120289, 120289], "mapped", [110]], [[120290, 120290], "mapped", [111]], [[120291, 120291], "mapped", [112]], [[120292, 120292], "mapped", [113]], [[120293, 120293], "mapped", [114]], [[120294, 120294], "mapped", [115]], [[120295, 120295], "mapped", [116]], [[120296, 120296], "mapped", [117]], [[120297, 120297], "mapped", [118]], [[120298, 120298], "mapped", [119]], [[120299, 120299], "mapped", [120]], [[120300, 120300], "mapped", [121]], [[120301, 120301], "mapped", [122]], [[120302, 120302], "mapped", [97]], [[120303, 120303], "mapped", [98]], [[120304, 120304], "mapped", [99]], [[120305, 120305], "mapped", [100]], [[120306, 120306], "mapped", [101]], [[120307, 120307], "mapped", [102]], [[120308, 120308], "mapped", [103]], [[120309, 120309], "mapped", [104]], [[120310, 120310], "mapped", [105]], [[120311, 120311], "mapped", [106]], [[120312, 120312], "mapped", [107]], [[120313, 120313], "mapped", [108]], [[120314, 120314], "mapped", [109]], [[120315, 120315], "mapped", [110]], [[120316, 120316], "mapped", [111]], [[120317, 120317], "mapped", [112]], [[120318, 120318], "mapped", [113]], [[120319, 120319], "mapped", [114]], [[120320, 120320], "mapped", [115]], [[120321, 120321], "mapped", [116]], [[120322, 120322], "mapped", [117]], [[120323, 120323], "mapped", [118]], [[120324, 120324], "mapped", [119]], [[120325, 120325], "mapped", [120]], [[120326, 120326], "mapped", [121]], [[120327, 120327], "mapped", [122]], [[120328, 120328], "mapped", [97]], [[120329, 120329], "mapped", [98]], [[120330, 120330], "mapped", [99]], [[120331, 120331], "mapped", [100]], [[120332, 120332], "mapped", [101]], [[120333, 120333], "mapped", [102]], [[120334, 120334], "mapped", [103]], [[120335, 120335], "mapped", [104]], [[120336, 120336], "mapped", [105]], [[120337, 120337], "mapped", [106]], [[120338, 120338], "mapped", [107]], [[120339, 120339], "mapped", [108]], [[120340, 120340], "mapped", [109]], [[120341, 120341], "mapped", [110]], [[120342, 120342], "mapped", [111]], [[120343, 120343], "mapped", [112]], [[120344, 120344], "mapped", [113]], [[120345, 120345], "mapped", [114]], [[120346, 120346], "mapped", [115]], [[120347, 120347], "mapped", [116]], [[120348, 120348], "mapped", [117]], [[120349, 120349], "mapped", [118]], [[120350, 120350], "mapped", [119]], [[120351, 120351], "mapped", [120]], [[120352, 120352], "mapped", [121]], [[120353, 120353], "mapped", [122]], [[120354, 120354], "mapped", [97]], [[120355, 120355], "mapped", [98]], [[120356, 120356], "mapped", [99]], [[120357, 120357], "mapped", [100]], [[120358, 120358], "mapped", [101]], [[120359, 120359], "mapped", [102]], [[120360, 120360], "mapped", [103]], [[120361, 120361], "mapped", [104]], [[120362, 120362], "mapped", [105]], [[120363, 120363], "mapped", [106]], [[120364, 120364], "mapped", [107]], [[120365, 120365], "mapped", [108]], [[120366, 120366], "mapped", [109]], [[120367, 120367], "mapped", [110]], [[120368, 120368], "mapped", [111]], [[120369, 120369], "mapped", [112]], [[120370, 120370], "mapped", [113]], [[120371, 120371], "mapped", [114]], [[120372, 120372], "mapped", [115]], [[120373, 120373], "mapped", [116]], [[120374, 120374], "mapped", [117]], [[120375, 120375], "mapped", [118]], [[120376, 120376], "mapped", [119]], [[120377, 120377], "mapped", [120]], [[120378, 120378], "mapped", [121]], [[120379, 120379], "mapped", [122]], [[120380, 120380], "mapped", [97]], [[120381, 120381], "mapped", [98]], [[120382, 120382], "mapped", [99]], [[120383, 120383], "mapped", [100]], [[120384, 120384], "mapped", [101]], [[120385, 120385], "mapped", [102]], [[120386, 120386], "mapped", [103]], [[120387, 120387], "mapped", [104]], [[120388, 120388], "mapped", [105]], [[120389, 120389], "mapped", [106]], [[120390, 120390], "mapped", [107]], [[120391, 120391], "mapped", [108]], [[120392, 120392], "mapped", [109]], [[120393, 120393], "mapped", [110]], [[120394, 120394], "mapped", [111]], [[120395, 120395], "mapped", [112]], [[120396, 120396], "mapped", [113]], [[120397, 120397], "mapped", [114]], [[120398, 120398], "mapped", [115]], [[120399, 120399], "mapped", [116]], [[120400, 120400], "mapped", [117]], [[120401, 120401], "mapped", [118]], [[120402, 120402], "mapped", [119]], [[120403, 120403], "mapped", [120]], [[120404, 120404], "mapped", [121]], [[120405, 120405], "mapped", [122]], [[120406, 120406], "mapped", [97]], [[120407, 120407], "mapped", [98]], [[120408, 120408], "mapped", [99]], [[120409, 120409], "mapped", [100]], [[120410, 120410], "mapped", [101]], [[120411, 120411], "mapped", [102]], [[120412, 120412], "mapped", [103]], [[120413, 120413], "mapped", [104]], [[120414, 120414], "mapped", [105]], [[120415, 120415], "mapped", [106]], [[120416, 120416], "mapped", [107]], [[120417, 120417], "mapped", [108]], [[120418, 120418], "mapped", [109]], [[120419, 120419], "mapped", [110]], [[120420, 120420], "mapped", [111]], [[120421, 120421], "mapped", [112]], [[120422, 120422], "mapped", [113]], [[120423, 120423], "mapped", [114]], [[120424, 120424], "mapped", [115]], [[120425, 120425], "mapped", [116]], [[120426, 120426], "mapped", [117]], [[120427, 120427], "mapped", [118]], [[120428, 120428], "mapped", [119]], [[120429, 120429], "mapped", [120]], [[120430, 120430], "mapped", [121]], [[120431, 120431], "mapped", [122]], [[120432, 120432], "mapped", [97]], [[120433, 120433], "mapped", [98]], [[120434, 120434], "mapped", [99]], [[120435, 120435], "mapped", [100]], [[120436, 120436], "mapped", [101]], [[120437, 120437], "mapped", [102]], [[120438, 120438], "mapped", [103]], [[120439, 120439], "mapped", [104]], [[120440, 120440], "mapped", [105]], [[120441, 120441], "mapped", [106]], [[120442, 120442], "mapped", [107]], [[120443, 120443], "mapped", [108]], [[120444, 120444], "mapped", [109]], [[120445, 120445], "mapped", [110]], [[120446, 120446], "mapped", [111]], [[120447, 120447], "mapped", [112]], [[120448, 120448], "mapped", [113]], [[120449, 120449], "mapped", [114]], [[120450, 120450], "mapped", [115]], [[120451, 120451], "mapped", [116]], [[120452, 120452], "mapped", [117]], [[120453, 120453], "mapped", [118]], [[120454, 120454], "mapped", [119]], [[120455, 120455], "mapped", [120]], [[120456, 120456], "mapped", [121]], [[120457, 120457], "mapped", [122]], [[120458, 120458], "mapped", [97]], [[120459, 120459], "mapped", [98]], [[120460, 120460], "mapped", [99]], [[120461, 120461], "mapped", [100]], [[120462, 120462], "mapped", [101]], [[120463, 120463], "mapped", [102]], [[120464, 120464], "mapped", [103]], [[120465, 120465], "mapped", [104]], [[120466, 120466], "mapped", [105]], [[120467, 120467], "mapped", [106]], [[120468, 120468], "mapped", [107]], [[120469, 120469], "mapped", [108]], [[120470, 120470], "mapped", [109]], [[120471, 120471], "mapped", [110]], [[120472, 120472], "mapped", [111]], [[120473, 120473], "mapped", [112]], [[120474, 120474], "mapped", [113]], [[120475, 120475], "mapped", [114]], [[120476, 120476], "mapped", [115]], [[120477, 120477], "mapped", [116]], [[120478, 120478], "mapped", [117]], [[120479, 120479], "mapped", [118]], [[120480, 120480], "mapped", [119]], [[120481, 120481], "mapped", [120]], [[120482, 120482], "mapped", [121]], [[120483, 120483], "mapped", [122]], [[120484, 120484], "mapped", [305]], [[120485, 120485], "mapped", [567]], [[120486, 120487], "disallowed"], [[120488, 120488], "mapped", [945]], [[120489, 120489], "mapped", [946]], [[120490, 120490], "mapped", [947]], [[120491, 120491], "mapped", [948]], [[120492, 120492], "mapped", [949]], [[120493, 120493], "mapped", [950]], [[120494, 120494], "mapped", [951]], [[120495, 120495], "mapped", [952]], [[120496, 120496], "mapped", [953]], [[120497, 120497], "mapped", [954]], [[120498, 120498], "mapped", [955]], [[120499, 120499], "mapped", [956]], [[120500, 120500], "mapped", [957]], [[120501, 120501], "mapped", [958]], [[120502, 120502], "mapped", [959]], [[120503, 120503], "mapped", [960]], [[120504, 120504], "mapped", [961]], [[120505, 120505], "mapped", [952]], [[120506, 120506], "mapped", [963]], [[120507, 120507], "mapped", [964]], [[120508, 120508], "mapped", [965]], [[120509, 120509], "mapped", [966]], [[120510, 120510], "mapped", [967]], [[120511, 120511], "mapped", [968]], [[120512, 120512], "mapped", [969]], [[120513, 120513], "mapped", [8711]], [[120514, 120514], "mapped", [945]], [[120515, 120515], "mapped", [946]], [[120516, 120516], "mapped", [947]], [[120517, 120517], "mapped", [948]], [[120518, 120518], "mapped", [949]], [[120519, 120519], "mapped", [950]], [[120520, 120520], "mapped", [951]], [[120521, 120521], "mapped", [952]], [[120522, 120522], "mapped", [953]], [[120523, 120523], "mapped", [954]], [[120524, 120524], "mapped", [955]], [[120525, 120525], "mapped", [956]], [[120526, 120526], "mapped", [957]], [[120527, 120527], "mapped", [958]], [[120528, 120528], "mapped", [959]], [[120529, 120529], "mapped", [960]], [[120530, 120530], "mapped", [961]], [[120531, 120532], "mapped", [963]], [[120533, 120533], "mapped", [964]], [[120534, 120534], "mapped", [965]], [[120535, 120535], "mapped", [966]], [[120536, 120536], "mapped", [967]], [[120537, 120537], "mapped", [968]], [[120538, 120538], "mapped", [969]], [[120539, 120539], "mapped", [8706]], [[120540, 120540], "mapped", [949]], [[120541, 120541], "mapped", [952]], [[120542, 120542], "mapped", [954]], [[120543, 120543], "mapped", [966]], [[120544, 120544], "mapped", [961]], [[120545, 120545], "mapped", [960]], [[120546, 120546], "mapped", [945]], [[120547, 120547], "mapped", [946]], [[120548, 120548], "mapped", [947]], [[120549, 120549], "mapped", [948]], [[120550, 120550], "mapped", [949]], [[120551, 120551], "mapped", [950]], [[120552, 120552], "mapped", [951]], [[120553, 120553], "mapped", [952]], [[120554, 120554], "mapped", [953]], [[120555, 120555], "mapped", [954]], [[120556, 120556], "mapped", [955]], [[120557, 120557], "mapped", [956]], [[120558, 120558], "mapped", [957]], [[120559, 120559], "mapped", [958]], [[120560, 120560], "mapped", [959]], [[120561, 120561], "mapped", [960]], [[120562, 120562], "mapped", [961]], [[120563, 120563], "mapped", [952]], [[120564, 120564], "mapped", [963]], [[120565, 120565], "mapped", [964]], [[120566, 120566], "mapped", [965]], [[120567, 120567], "mapped", [966]], [[120568, 120568], "mapped", [967]], [[120569, 120569], "mapped", [968]], [[120570, 120570], "mapped", [969]], [[120571, 120571], "mapped", [8711]], [[120572, 120572], "mapped", [945]], [[120573, 120573], "mapped", [946]], [[120574, 120574], "mapped", [947]], [[120575, 120575], "mapped", [948]], [[120576, 120576], "mapped", [949]], [[120577, 120577], "mapped", [950]], [[120578, 120578], "mapped", [951]], [[120579, 120579], "mapped", [952]], [[120580, 120580], "mapped", [953]], [[120581, 120581], "mapped", [954]], [[120582, 120582], "mapped", [955]], [[120583, 120583], "mapped", [956]], [[120584, 120584], "mapped", [957]], [[120585, 120585], "mapped", [958]], [[120586, 120586], "mapped", [959]], [[120587, 120587], "mapped", [960]], [[120588, 120588], "mapped", [961]], [[120589, 120590], "mapped", [963]], [[120591, 120591], "mapped", [964]], [[120592, 120592], "mapped", [965]], [[120593, 120593], "mapped", [966]], [[120594, 120594], "mapped", [967]], [[120595, 120595], "mapped", [968]], [[120596, 120596], "mapped", [969]], [[120597, 120597], "mapped", [8706]], [[120598, 120598], "mapped", [949]], [[120599, 120599], "mapped", [952]], [[120600, 120600], "mapped", [954]], [[120601, 120601], "mapped", [966]], [[120602, 120602], "mapped", [961]], [[120603, 120603], "mapped", [960]], [[120604, 120604], "mapped", [945]], [[120605, 120605], "mapped", [946]], [[120606, 120606], "mapped", [947]], [[120607, 120607], "mapped", [948]], [[120608, 120608], "mapped", [949]], [[120609, 120609], "mapped", [950]], [[120610, 120610], "mapped", [951]], [[120611, 120611], "mapped", [952]], [[120612, 120612], "mapped", [953]], [[120613, 120613], "mapped", [954]], [[120614, 120614], "mapped", [955]], [[120615, 120615], "mapped", [956]], [[120616, 120616], "mapped", [957]], [[120617, 120617], "mapped", [958]], [[120618, 120618], "mapped", [959]], [[120619, 120619], "mapped", [960]], [[120620, 120620], "mapped", [961]], [[120621, 120621], "mapped", [952]], [[120622, 120622], "mapped", [963]], [[120623, 120623], "mapped", [964]], [[120624, 120624], "mapped", [965]], [[120625, 120625], "mapped", [966]], [[120626, 120626], "mapped", [967]], [[120627, 120627], "mapped", [968]], [[120628, 120628], "mapped", [969]], [[120629, 120629], "mapped", [8711]], [[120630, 120630], "mapped", [945]], [[120631, 120631], "mapped", [946]], [[120632, 120632], "mapped", [947]], [[120633, 120633], "mapped", [948]], [[120634, 120634], "mapped", [949]], [[120635, 120635], "mapped", [950]], [[120636, 120636], "mapped", [951]], [[120637, 120637], "mapped", [952]], [[120638, 120638], "mapped", [953]], [[120639, 120639], "mapped", [954]], [[120640, 120640], "mapped", [955]], [[120641, 120641], "mapped", [956]], [[120642, 120642], "mapped", [957]], [[120643, 120643], "mapped", [958]], [[120644, 120644], "mapped", [959]], [[120645, 120645], "mapped", [960]], [[120646, 120646], "mapped", [961]], [[120647, 120648], "mapped", [963]], [[120649, 120649], "mapped", [964]], [[120650, 120650], "mapped", [965]], [[120651, 120651], "mapped", [966]], [[120652, 120652], "mapped", [967]], [[120653, 120653], "mapped", [968]], [[120654, 120654], "mapped", [969]], [[120655, 120655], "mapped", [8706]], [[120656, 120656], "mapped", [949]], [[120657, 120657], "mapped", [952]], [[120658, 120658], "mapped", [954]], [[120659, 120659], "mapped", [966]], [[120660, 120660], "mapped", [961]], [[120661, 120661], "mapped", [960]], [[120662, 120662], "mapped", [945]], [[120663, 120663], "mapped", [946]], [[120664, 120664], "mapped", [947]], [[120665, 120665], "mapped", [948]], [[120666, 120666], "mapped", [949]], [[120667, 120667], "mapped", [950]], [[120668, 120668], "mapped", [951]], [[120669, 120669], "mapped", [952]], [[120670, 120670], "mapped", [953]], [[120671, 120671], "mapped", [954]], [[120672, 120672], "mapped", [955]], [[120673, 120673], "mapped", [956]], [[120674, 120674], "mapped", [957]], [[120675, 120675], "mapped", [958]], [[120676, 120676], "mapped", [959]], [[120677, 120677], "mapped", [960]], [[120678, 120678], "mapped", [961]], [[120679, 120679], "mapped", [952]], [[120680, 120680], "mapped", [963]], [[120681, 120681], "mapped", [964]], [[120682, 120682], "mapped", [965]], [[120683, 120683], "mapped", [966]], [[120684, 120684], "mapped", [967]], [[120685, 120685], "mapped", [968]], [[120686, 120686], "mapped", [969]], [[120687, 120687], "mapped", [8711]], [[120688, 120688], "mapped", [945]], [[120689, 120689], "mapped", [946]], [[120690, 120690], "mapped", [947]], [[120691, 120691], "mapped", [948]], [[120692, 120692], "mapped", [949]], [[120693, 120693], "mapped", [950]], [[120694, 120694], "mapped", [951]], [[120695, 120695], "mapped", [952]], [[120696, 120696], "mapped", [953]], [[120697, 120697], "mapped", [954]], [[120698, 120698], "mapped", [955]], [[120699, 120699], "mapped", [956]], [[120700, 120700], "mapped", [957]], [[120701, 120701], "mapped", [958]], [[120702, 120702], "mapped", [959]], [[120703, 120703], "mapped", [960]], [[120704, 120704], "mapped", [961]], [[120705, 120706], "mapped", [963]], [[120707, 120707], "mapped", [964]], [[120708, 120708], "mapped", [965]], [[120709, 120709], "mapped", [966]], [[120710, 120710], "mapped", [967]], [[120711, 120711], "mapped", [968]], [[120712, 120712], "mapped", [969]], [[120713, 120713], "mapped", [8706]], [[120714, 120714], "mapped", [949]], [[120715, 120715], "mapped", [952]], [[120716, 120716], "mapped", [954]], [[120717, 120717], "mapped", [966]], [[120718, 120718], "mapped", [961]], [[120719, 120719], "mapped", [960]], [[120720, 120720], "mapped", [945]], [[120721, 120721], "mapped", [946]], [[120722, 120722], "mapped", [947]], [[120723, 120723], "mapped", [948]], [[120724, 120724], "mapped", [949]], [[120725, 120725], "mapped", [950]], [[120726, 120726], "mapped", [951]], [[120727, 120727], "mapped", [952]], [[120728, 120728], "mapped", [953]], [[120729, 120729], "mapped", [954]], [[120730, 120730], "mapped", [955]], [[120731, 120731], "mapped", [956]], [[120732, 120732], "mapped", [957]], [[120733, 120733], "mapped", [958]], [[120734, 120734], "mapped", [959]], [[120735, 120735], "mapped", [960]], [[120736, 120736], "mapped", [961]], [[120737, 120737], "mapped", [952]], [[120738, 120738], "mapped", [963]], [[120739, 120739], "mapped", [964]], [[120740, 120740], "mapped", [965]], [[120741, 120741], "mapped", [966]], [[120742, 120742], "mapped", [967]], [[120743, 120743], "mapped", [968]], [[120744, 120744], "mapped", [969]], [[120745, 120745], "mapped", [8711]], [[120746, 120746], "mapped", [945]], [[120747, 120747], "mapped", [946]], [[120748, 120748], "mapped", [947]], [[120749, 120749], "mapped", [948]], [[120750, 120750], "mapped", [949]], [[120751, 120751], "mapped", [950]], [[120752, 120752], "mapped", [951]], [[120753, 120753], "mapped", [952]], [[120754, 120754], "mapped", [953]], [[120755, 120755], "mapped", [954]], [[120756, 120756], "mapped", [955]], [[120757, 120757], "mapped", [956]], [[120758, 120758], "mapped", [957]], [[120759, 120759], "mapped", [958]], [[120760, 120760], "mapped", [959]], [[120761, 120761], "mapped", [960]], [[120762, 120762], "mapped", [961]], [[120763, 120764], "mapped", [963]], [[120765, 120765], "mapped", [964]], [[120766, 120766], "mapped", [965]], [[120767, 120767], "mapped", [966]], [[120768, 120768], "mapped", [967]], [[120769, 120769], "mapped", [968]], [[120770, 120770], "mapped", [969]], [[120771, 120771], "mapped", [8706]], [[120772, 120772], "mapped", [949]], [[120773, 120773], "mapped", [952]], [[120774, 120774], "mapped", [954]], [[120775, 120775], "mapped", [966]], [[120776, 120776], "mapped", [961]], [[120777, 120777], "mapped", [960]], [[120778, 120779], "mapped", [989]], [[120780, 120781], "disallowed"], [[120782, 120782], "mapped", [48]], [[120783, 120783], "mapped", [49]], [[120784, 120784], "mapped", [50]], [[120785, 120785], "mapped", [51]], [[120786, 120786], "mapped", [52]], [[120787, 120787], "mapped", [53]], [[120788, 120788], "mapped", [54]], [[120789, 120789], "mapped", [55]], [[120790, 120790], "mapped", [56]], [[120791, 120791], "mapped", [57]], [[120792, 120792], "mapped", [48]], [[120793, 120793], "mapped", [49]], [[120794, 120794], "mapped", [50]], [[120795, 120795], "mapped", [51]], [[120796, 120796], "mapped", [52]], [[120797, 120797], "mapped", [53]], [[120798, 120798], "mapped", [54]], [[120799, 120799], "mapped", [55]], [[120800, 120800], "mapped", [56]], [[120801, 120801], "mapped", [57]], [[120802, 120802], "mapped", [48]], [[120803, 120803], "mapped", [49]], [[120804, 120804], "mapped", [50]], [[120805, 120805], "mapped", [51]], [[120806, 120806], "mapped", [52]], [[120807, 120807], "mapped", [53]], [[120808, 120808], "mapped", [54]], [[120809, 120809], "mapped", [55]], [[120810, 120810], "mapped", [56]], [[120811, 120811], "mapped", [57]], [[120812, 120812], "mapped", [48]], [[120813, 120813], "mapped", [49]], [[120814, 120814], "mapped", [50]], [[120815, 120815], "mapped", [51]], [[120816, 120816], "mapped", [52]], [[120817, 120817], "mapped", [53]], [[120818, 120818], "mapped", [54]], [[120819, 120819], "mapped", [55]], [[120820, 120820], "mapped", [56]], [[120821, 120821], "mapped", [57]], [[120822, 120822], "mapped", [48]], [[120823, 120823], "mapped", [49]], [[120824, 120824], "mapped", [50]], [[120825, 120825], "mapped", [51]], [[120826, 120826], "mapped", [52]], [[120827, 120827], "mapped", [53]], [[120828, 120828], "mapped", [54]], [[120829, 120829], "mapped", [55]], [[120830, 120830], "mapped", [56]], [[120831, 120831], "mapped", [57]], [[120832, 121343], "valid", [], "NV8"], [[121344, 121398], "valid"], [[121399, 121402], "valid", [], "NV8"], [[121403, 121452], "valid"], [[121453, 121460], "valid", [], "NV8"], [[121461, 121461], "valid"], [[121462, 121475], "valid", [], "NV8"], [[121476, 121476], "valid"], [[121477, 121483], "valid", [], "NV8"], [[121484, 121498], "disallowed"], [[121499, 121503], "valid"], [[121504, 121504], "disallowed"], [[121505, 121519], "valid"], [[121520, 124927], "disallowed"], [[124928, 125124], "valid"], [[125125, 125126], "disallowed"], [[125127, 125135], "valid", [], "NV8"], [[125136, 125142], "valid"], [[125143, 126463], "disallowed"], [[126464, 126464], "mapped", [1575]], [[126465, 126465], "mapped", [1576]], [[126466, 126466], "mapped", [1580]], [[126467, 126467], "mapped", [1583]], [[126468, 126468], "disallowed"], [[126469, 126469], "mapped", [1608]], [[126470, 126470], "mapped", [1586]], [[126471, 126471], "mapped", [1581]], [[126472, 126472], "mapped", [1591]], [[126473, 126473], "mapped", [1610]], [[126474, 126474], "mapped", [1603]], [[126475, 126475], "mapped", [1604]], [[126476, 126476], "mapped", [1605]], [[126477, 126477], "mapped", [1606]], [[126478, 126478], "mapped", [1587]], [[126479, 126479], "mapped", [1593]], [[126480, 126480], "mapped", [1601]], [[126481, 126481], "mapped", [1589]], [[126482, 126482], "mapped", [1602]], [[126483, 126483], "mapped", [1585]], [[126484, 126484], "mapped", [1588]], [[126485, 126485], "mapped", [1578]], [[126486, 126486], "mapped", [1579]], [[126487, 126487], "mapped", [1582]], [[126488, 126488], "mapped", [1584]], [[126489, 126489], "mapped", [1590]], [[126490, 126490], "mapped", [1592]], [[126491, 126491], "mapped", [1594]], [[126492, 126492], "mapped", [1646]], [[126493, 126493], "mapped", [1722]], [[126494, 126494], "mapped", [1697]], [[126495, 126495], "mapped", [1647]], [[126496, 126496], "disallowed"], [[126497, 126497], "mapped", [1576]], [[126498, 126498], "mapped", [1580]], [[126499, 126499], "disallowed"], [[126500, 126500], "mapped", [1607]], [[126501, 126502], "disallowed"], [[126503, 126503], "mapped", [1581]], [[126504, 126504], "disallowed"], [[126505, 126505], "mapped", [1610]], [[126506, 126506], "mapped", [1603]], [[126507, 126507], "mapped", [1604]], [[126508, 126508], "mapped", [1605]], [[126509, 126509], "mapped", [1606]], [[126510, 126510], "mapped", [1587]], [[126511, 126511], "mapped", [1593]], [[126512, 126512], "mapped", [1601]], [[126513, 126513], "mapped", [1589]], [[126514, 126514], "mapped", [1602]], [[126515, 126515], "disallowed"], [[126516, 126516], "mapped", [1588]], [[126517, 126517], "mapped", [1578]], [[126518, 126518], "mapped", [1579]], [[126519, 126519], "mapped", [1582]], [[126520, 126520], "disallowed"], [[126521, 126521], "mapped", [1590]], [[126522, 126522], "disallowed"], [[126523, 126523], "mapped", [1594]], [[126524, 126529], "disallowed"], [[126530, 126530], "mapped", [1580]], [[126531, 126534], "disallowed"], [[126535, 126535], "mapped", [1581]], [[126536, 126536], "disallowed"], [[126537, 126537], "mapped", [1610]], [[126538, 126538], "disallowed"], [[126539, 126539], "mapped", [1604]], [[126540, 126540], "disallowed"], [[126541, 126541], "mapped", [1606]], [[126542, 126542], "mapped", [1587]], [[126543, 126543], "mapped", [1593]], [[126544, 126544], "disallowed"], [[126545, 126545], "mapped", [1589]], [[126546, 126546], "mapped", [1602]], [[126547, 126547], "disallowed"], [[126548, 126548], "mapped", [1588]], [[126549, 126550], "disallowed"], [[126551, 126551], "mapped", [1582]], [[126552, 126552], "disallowed"], [[126553, 126553], "mapped", [1590]], [[126554, 126554], "disallowed"], [[126555, 126555], "mapped", [1594]], [[126556, 126556], "disallowed"], [[126557, 126557], "mapped", [1722]], [[126558, 126558], "disallowed"], [[126559, 126559], "mapped", [1647]], [[126560, 126560], "disallowed"], [[126561, 126561], "mapped", [1576]], [[126562, 126562], "mapped", [1580]], [[126563, 126563], "disallowed"], [[126564, 126564], "mapped", [1607]], [[126565, 126566], "disallowed"], [[126567, 126567], "mapped", [1581]], [[126568, 126568], "mapped", [1591]], [[126569, 126569], "mapped", [1610]], [[126570, 126570], "mapped", [1603]], [[126571, 126571], "disallowed"], [[126572, 126572], "mapped", [1605]], [[126573, 126573], "mapped", [1606]], [[126574, 126574], "mapped", [1587]], [[126575, 126575], "mapped", [1593]], [[126576, 126576], "mapped", [1601]], [[126577, 126577], "mapped", [1589]], [[126578, 126578], "mapped", [1602]], [[126579, 126579], "disallowed"], [[126580, 126580], "mapped", [1588]], [[126581, 126581], "mapped", [1578]], [[126582, 126582], "mapped", [1579]], [[126583, 126583], "mapped", [1582]], [[126584, 126584], "disallowed"], [[126585, 126585], "mapped", [1590]], [[126586, 126586], "mapped", [1592]], [[126587, 126587], "mapped", [1594]], [[126588, 126588], "mapped", [1646]], [[126589, 126589], "disallowed"], [[126590, 126590], "mapped", [1697]], [[126591, 126591], "disallowed"], [[126592, 126592], "mapped", [1575]], [[126593, 126593], "mapped", [1576]], [[126594, 126594], "mapped", [1580]], [[126595, 126595], "mapped", [1583]], [[126596, 126596], "mapped", [1607]], [[126597, 126597], "mapped", [1608]], [[126598, 126598], "mapped", [1586]], [[126599, 126599], "mapped", [1581]], [[126600, 126600], "mapped", [1591]], [[126601, 126601], "mapped", [1610]], [[126602, 126602], "disallowed"], [[126603, 126603], "mapped", [1604]], [[126604, 126604], "mapped", [1605]], [[126605, 126605], "mapped", [1606]], [[126606, 126606], "mapped", [1587]], [[126607, 126607], "mapped", [1593]], [[126608, 126608], "mapped", [1601]], [[126609, 126609], "mapped", [1589]], [[126610, 126610], "mapped", [1602]], [[126611, 126611], "mapped", [1585]], [[126612, 126612], "mapped", [1588]], [[126613, 126613], "mapped", [1578]], [[126614, 126614], "mapped", [1579]], [[126615, 126615], "mapped", [1582]], [[126616, 126616], "mapped", [1584]], [[126617, 126617], "mapped", [1590]], [[126618, 126618], "mapped", [1592]], [[126619, 126619], "mapped", [1594]], [[126620, 126624], "disallowed"], [[126625, 126625], "mapped", [1576]], [[126626, 126626], "mapped", [1580]], [[126627, 126627], "mapped", [1583]], [[126628, 126628], "disallowed"], [[126629, 126629], "mapped", [1608]], [[126630, 126630], "mapped", [1586]], [[126631, 126631], "mapped", [1581]], [[126632, 126632], "mapped", [1591]], [[126633, 126633], "mapped", [1610]], [[126634, 126634], "disallowed"], [[126635, 126635], "mapped", [1604]], [[126636, 126636], "mapped", [1605]], [[126637, 126637], "mapped", [1606]], [[126638, 126638], "mapped", [1587]], [[126639, 126639], "mapped", [1593]], [[126640, 126640], "mapped", [1601]], [[126641, 126641], "mapped", [1589]], [[126642, 126642], "mapped", [1602]], [[126643, 126643], "mapped", [1585]], [[126644, 126644], "mapped", [1588]], [[126645, 126645], "mapped", [1578]], [[126646, 126646], "mapped", [1579]], [[126647, 126647], "mapped", [1582]], [[126648, 126648], "mapped", [1584]], [[126649, 126649], "mapped", [1590]], [[126650, 126650], "mapped", [1592]], [[126651, 126651], "mapped", [1594]], [[126652, 126703], "disallowed"], [[126704, 126705], "valid", [], "NV8"], [[126706, 126975], "disallowed"], [[126976, 127019], "valid", [], "NV8"], [[127020, 127023], "disallowed"], [[127024, 127123], "valid", [], "NV8"], [[127124, 127135], "disallowed"], [[127136, 127150], "valid", [], "NV8"], [[127151, 127152], "disallowed"], [[127153, 127166], "valid", [], "NV8"], [[127167, 127167], "valid", [], "NV8"], [[127168, 127168], "disallowed"], [[127169, 127183], "valid", [], "NV8"], [[127184, 127184], "disallowed"], [[127185, 127199], "valid", [], "NV8"], [[127200, 127221], "valid", [], "NV8"], [[127222, 127231], "disallowed"], [[127232, 127232], "disallowed"], [[127233, 127233], "disallowed_STD3_mapped", [48, 44]], [[127234, 127234], "disallowed_STD3_mapped", [49, 44]], [[127235, 127235], "disallowed_STD3_mapped", [50, 44]], [[127236, 127236], "disallowed_STD3_mapped", [51, 44]], [[127237, 127237], "disallowed_STD3_mapped", [52, 44]], [[127238, 127238], "disallowed_STD3_mapped", [53, 44]], [[127239, 127239], "disallowed_STD3_mapped", [54, 44]], [[127240, 127240], "disallowed_STD3_mapped", [55, 44]], [[127241, 127241], "disallowed_STD3_mapped", [56, 44]], [[127242, 127242], "disallowed_STD3_mapped", [57, 44]], [[127243, 127244], "valid", [], "NV8"], [[127245, 127247], "disallowed"], [[127248, 127248], "disallowed_STD3_mapped", [40, 97, 41]], [[127249, 127249], "disallowed_STD3_mapped", [40, 98, 41]], [[127250, 127250], "disallowed_STD3_mapped", [40, 99, 41]], [[127251, 127251], "disallowed_STD3_mapped", [40, 100, 41]], [[127252, 127252], "disallowed_STD3_mapped", [40, 101, 41]], [[127253, 127253], "disallowed_STD3_mapped", [40, 102, 41]], [[127254, 127254], "disallowed_STD3_mapped", [40, 103, 41]], [[127255, 127255], "disallowed_STD3_mapped", [40, 104, 41]], [[127256, 127256], "disallowed_STD3_mapped", [40, 105, 41]], [[127257, 127257], "disallowed_STD3_mapped", [40, 106, 41]], [[127258, 127258], "disallowed_STD3_mapped", [40, 107, 41]], [[127259, 127259], "disallowed_STD3_mapped", [40, 108, 41]], [[127260, 127260], "disallowed_STD3_mapped", [40, 109, 41]], [[127261, 127261], "disallowed_STD3_mapped", [40, 110, 41]], [[127262, 127262], "disallowed_STD3_mapped", [40, 111, 41]], [[127263, 127263], "disallowed_STD3_mapped", [40, 112, 41]], [[127264, 127264], "disallowed_STD3_mapped", [40, 113, 41]], [[127265, 127265], "disallowed_STD3_mapped", [40, 114, 41]], [[127266, 127266], "disallowed_STD3_mapped", [40, 115, 41]], [[127267, 127267], "disallowed_STD3_mapped", [40, 116, 41]], [[127268, 127268], "disallowed_STD3_mapped", [40, 117, 41]], [[127269, 127269], "disallowed_STD3_mapped", [40, 118, 41]], [[127270, 127270], "disallowed_STD3_mapped", [40, 119, 41]], [[127271, 127271], "disallowed_STD3_mapped", [40, 120, 41]], [[127272, 127272], "disallowed_STD3_mapped", [40, 121, 41]], [[127273, 127273], "disallowed_STD3_mapped", [40, 122, 41]], [[127274, 127274], "mapped", [12308, 115, 12309]], [[127275, 127275], "mapped", [99]], [[127276, 127276], "mapped", [114]], [[127277, 127277], "mapped", [99, 100]], [[127278, 127278], "mapped", [119, 122]], [[127279, 127279], "disallowed"], [[127280, 127280], "mapped", [97]], [[127281, 127281], "mapped", [98]], [[127282, 127282], "mapped", [99]], [[127283, 127283], "mapped", [100]], [[127284, 127284], "mapped", [101]], [[127285, 127285], "mapped", [102]], [[127286, 127286], "mapped", [103]], [[127287, 127287], "mapped", [104]], [[127288, 127288], "mapped", [105]], [[127289, 127289], "mapped", [106]], [[127290, 127290], "mapped", [107]], [[127291, 127291], "mapped", [108]], [[127292, 127292], "mapped", [109]], [[127293, 127293], "mapped", [110]], [[127294, 127294], "mapped", [111]], [[127295, 127295], "mapped", [112]], [[127296, 127296], "mapped", [113]], [[127297, 127297], "mapped", [114]], [[127298, 127298], "mapped", [115]], [[127299, 127299], "mapped", [116]], [[127300, 127300], "mapped", [117]], [[127301, 127301], "mapped", [118]], [[127302, 127302], "mapped", [119]], [[127303, 127303], "mapped", [120]], [[127304, 127304], "mapped", [121]], [[127305, 127305], "mapped", [122]], [[127306, 127306], "mapped", [104, 118]], [[127307, 127307], "mapped", [109, 118]], [[127308, 127308], "mapped", [115, 100]], [[127309, 127309], "mapped", [115, 115]], [[127310, 127310], "mapped", [112, 112, 118]], [[127311, 127311], "mapped", [119, 99]], [[127312, 127318], "valid", [], "NV8"], [[127319, 127319], "valid", [], "NV8"], [[127320, 127326], "valid", [], "NV8"], [[127327, 127327], "valid", [], "NV8"], [[127328, 127337], "valid", [], "NV8"], [[127338, 127338], "mapped", [109, 99]], [[127339, 127339], "mapped", [109, 100]], [[127340, 127343], "disallowed"], [[127344, 127352], "valid", [], "NV8"], [[127353, 127353], "valid", [], "NV8"], [[127354, 127354], "valid", [], "NV8"], [[127355, 127356], "valid", [], "NV8"], [[127357, 127358], "valid", [], "NV8"], [[127359, 127359], "valid", [], "NV8"], [[127360, 127369], "valid", [], "NV8"], [[127370, 127373], "valid", [], "NV8"], [[127374, 127375], "valid", [], "NV8"], [[127376, 127376], "mapped", [100, 106]], [[127377, 127386], "valid", [], "NV8"], [[127387, 127461], "disallowed"], [[127462, 127487], "valid", [], "NV8"], [[127488, 127488], "mapped", [12411, 12363]], [[127489, 127489], "mapped", [12467, 12467]], [[127490, 127490], "mapped", [12469]], [[127491, 127503], "disallowed"], [[127504, 127504], "mapped", [25163]], [[127505, 127505], "mapped", [23383]], [[127506, 127506], "mapped", [21452]], [[127507, 127507], "mapped", [12487]], [[127508, 127508], "mapped", [20108]], [[127509, 127509], "mapped", [22810]], [[127510, 127510], "mapped", [35299]], [[127511, 127511], "mapped", [22825]], [[127512, 127512], "mapped", [20132]], [[127513, 127513], "mapped", [26144]], [[127514, 127514], "mapped", [28961]], [[127515, 127515], "mapped", [26009]], [[127516, 127516], "mapped", [21069]], [[127517, 127517], "mapped", [24460]], [[127518, 127518], "mapped", [20877]], [[127519, 127519], "mapped", [26032]], [[127520, 127520], "mapped", [21021]], [[127521, 127521], "mapped", [32066]], [[127522, 127522], "mapped", [29983]], [[127523, 127523], "mapped", [36009]], [[127524, 127524], "mapped", [22768]], [[127525, 127525], "mapped", [21561]], [[127526, 127526], "mapped", [28436]], [[127527, 127527], "mapped", [25237]], [[127528, 127528], "mapped", [25429]], [[127529, 127529], "mapped", [19968]], [[127530, 127530], "mapped", [19977]], [[127531, 127531], "mapped", [36938]], [[127532, 127532], "mapped", [24038]], [[127533, 127533], "mapped", [20013]], [[127534, 127534], "mapped", [21491]], [[127535, 127535], "mapped", [25351]], [[127536, 127536], "mapped", [36208]], [[127537, 127537], "mapped", [25171]], [[127538, 127538], "mapped", [31105]], [[127539, 127539], "mapped", [31354]], [[127540, 127540], "mapped", [21512]], [[127541, 127541], "mapped", [28288]], [[127542, 127542], "mapped", [26377]], [[127543, 127543], "mapped", [26376]], [[127544, 127544], "mapped", [30003]], [[127545, 127545], "mapped", [21106]], [[127546, 127546], "mapped", [21942]], [[127547, 127551], "disallowed"], [[127552, 127552], "mapped", [12308, 26412, 12309]], [[127553, 127553], "mapped", [12308, 19977, 12309]], [[127554, 127554], "mapped", [12308, 20108, 12309]], [[127555, 127555], "mapped", [12308, 23433, 12309]], [[127556, 127556], "mapped", [12308, 28857, 12309]], [[127557, 127557], "mapped", [12308, 25171, 12309]], [[127558, 127558], "mapped", [12308, 30423, 12309]], [[127559, 127559], "mapped", [12308, 21213, 12309]], [[127560, 127560], "mapped", [12308, 25943, 12309]], [[127561, 127567], "disallowed"], [[127568, 127568], "mapped", [24471]], [[127569, 127569], "mapped", [21487]], [[127570, 127743], "disallowed"], [[127744, 127776], "valid", [], "NV8"], [[127777, 127788], "valid", [], "NV8"], [[127789, 127791], "valid", [], "NV8"], [[127792, 127797], "valid", [], "NV8"], [[127798, 127798], "valid", [], "NV8"], [[127799, 127868], "valid", [], "NV8"], [[127869, 127869], "valid", [], "NV8"], [[127870, 127871], "valid", [], "NV8"], [[127872, 127891], "valid", [], "NV8"], [[127892, 127903], "valid", [], "NV8"], [[127904, 127940], "valid", [], "NV8"], [[127941, 127941], "valid", [], "NV8"], [[127942, 127946], "valid", [], "NV8"], [[127947, 127950], "valid", [], "NV8"], [[127951, 127955], "valid", [], "NV8"], [[127956, 127967], "valid", [], "NV8"], [[127968, 127984], "valid", [], "NV8"], [[127985, 127991], "valid", [], "NV8"], [[127992, 127999], "valid", [], "NV8"], [[128e3, 128062], "valid", [], "NV8"], [[128063, 128063], "valid", [], "NV8"], [[128064, 128064], "valid", [], "NV8"], [[128065, 128065], "valid", [], "NV8"], [[128066, 128247], "valid", [], "NV8"], [[128248, 128248], "valid", [], "NV8"], [[128249, 128252], "valid", [], "NV8"], [[128253, 128254], "valid", [], "NV8"], [[128255, 128255], "valid", [], "NV8"], [[128256, 128317], "valid", [], "NV8"], [[128318, 128319], "valid", [], "NV8"], [[128320, 128323], "valid", [], "NV8"], [[128324, 128330], "valid", [], "NV8"], [[128331, 128335], "valid", [], "NV8"], [[128336, 128359], "valid", [], "NV8"], [[128360, 128377], "valid", [], "NV8"], [[128378, 128378], "disallowed"], [[128379, 128419], "valid", [], "NV8"], [[128420, 128420], "disallowed"], [[128421, 128506], "valid", [], "NV8"], [[128507, 128511], "valid", [], "NV8"], [[128512, 128512], "valid", [], "NV8"], [[128513, 128528], "valid", [], "NV8"], [[128529, 128529], "valid", [], "NV8"], [[128530, 128532], "valid", [], "NV8"], [[128533, 128533], "valid", [], "NV8"], [[128534, 128534], "valid", [], "NV8"], [[128535, 128535], "valid", [], "NV8"], [[128536, 128536], "valid", [], "NV8"], [[128537, 128537], "valid", [], "NV8"], [[128538, 128538], "valid", [], "NV8"], [[128539, 128539], "valid", [], "NV8"], [[128540, 128542], "valid", [], "NV8"], [[128543, 128543], "valid", [], "NV8"], [[128544, 128549], "valid", [], "NV8"], [[128550, 128551], "valid", [], "NV8"], [[128552, 128555], "valid", [], "NV8"], [[128556, 128556], "valid", [], "NV8"], [[128557, 128557], "valid", [], "NV8"], [[128558, 128559], "valid", [], "NV8"], [[128560, 128563], "valid", [], "NV8"], [[128564, 128564], "valid", [], "NV8"], [[128565, 128576], "valid", [], "NV8"], [[128577, 128578], "valid", [], "NV8"], [[128579, 128580], "valid", [], "NV8"], [[128581, 128591], "valid", [], "NV8"], [[128592, 128639], "valid", [], "NV8"], [[128640, 128709], "valid", [], "NV8"], [[128710, 128719], "valid", [], "NV8"], [[128720, 128720], "valid", [], "NV8"], [[128721, 128735], "disallowed"], [[128736, 128748], "valid", [], "NV8"], [[128749, 128751], "disallowed"], [[128752, 128755], "valid", [], "NV8"], [[128756, 128767], "disallowed"], [[128768, 128883], "valid", [], "NV8"], [[128884, 128895], "disallowed"], [[128896, 128980], "valid", [], "NV8"], [[128981, 129023], "disallowed"], [[129024, 129035], "valid", [], "NV8"], [[129036, 129039], "disallowed"], [[129040, 129095], "valid", [], "NV8"], [[129096, 129103], "disallowed"], [[129104, 129113], "valid", [], "NV8"], [[129114, 129119], "disallowed"], [[129120, 129159], "valid", [], "NV8"], [[129160, 129167], "disallowed"], [[129168, 129197], "valid", [], "NV8"], [[129198, 129295], "disallowed"], [[129296, 129304], "valid", [], "NV8"], [[129305, 129407], "disallowed"], [[129408, 129412], "valid", [], "NV8"], [[129413, 129471], "disallowed"], [[129472, 129472], "valid", [], "NV8"], [[129473, 131069], "disallowed"], [[131070, 131071], "disallowed"], [[131072, 173782], "valid"], [[173783, 173823], "disallowed"], [[173824, 177972], "valid"], [[177973, 177983], "disallowed"], [[177984, 178205], "valid"], [[178206, 178207], "disallowed"], [[178208, 183969], "valid"], [[183970, 194559], "disallowed"], [[194560, 194560], "mapped", [20029]], [[194561, 194561], "mapped", [20024]], [[194562, 194562], "mapped", [20033]], [[194563, 194563], "mapped", [131362]], [[194564, 194564], "mapped", [20320]], [[194565, 194565], "mapped", [20398]], [[194566, 194566], "mapped", [20411]], [[194567, 194567], "mapped", [20482]], [[194568, 194568], "mapped", [20602]], [[194569, 194569], "mapped", [20633]], [[194570, 194570], "mapped", [20711]], [[194571, 194571], "mapped", [20687]], [[194572, 194572], "mapped", [13470]], [[194573, 194573], "mapped", [132666]], [[194574, 194574], "mapped", [20813]], [[194575, 194575], "mapped", [20820]], [[194576, 194576], "mapped", [20836]], [[194577, 194577], "mapped", [20855]], [[194578, 194578], "mapped", [132380]], [[194579, 194579], "mapped", [13497]], [[194580, 194580], "mapped", [20839]], [[194581, 194581], "mapped", [20877]], [[194582, 194582], "mapped", [132427]], [[194583, 194583], "mapped", [20887]], [[194584, 194584], "mapped", [20900]], [[194585, 194585], "mapped", [20172]], [[194586, 194586], "mapped", [20908]], [[194587, 194587], "mapped", [20917]], [[194588, 194588], "mapped", [168415]], [[194589, 194589], "mapped", [20981]], [[194590, 194590], "mapped", [20995]], [[194591, 194591], "mapped", [13535]], [[194592, 194592], "mapped", [21051]], [[194593, 194593], "mapped", [21062]], [[194594, 194594], "mapped", [21106]], [[194595, 194595], "mapped", [21111]], [[194596, 194596], "mapped", [13589]], [[194597, 194597], "mapped", [21191]], [[194598, 194598], "mapped", [21193]], [[194599, 194599], "mapped", [21220]], [[194600, 194600], "mapped", [21242]], [[194601, 194601], "mapped", [21253]], [[194602, 194602], "mapped", [21254]], [[194603, 194603], "mapped", [21271]], [[194604, 194604], "mapped", [21321]], [[194605, 194605], "mapped", [21329]], [[194606, 194606], "mapped", [21338]], [[194607, 194607], "mapped", [21363]], [[194608, 194608], "mapped", [21373]], [[194609, 194611], "mapped", [21375]], [[194612, 194612], "mapped", [133676]], [[194613, 194613], "mapped", [28784]], [[194614, 194614], "mapped", [21450]], [[194615, 194615], "mapped", [21471]], [[194616, 194616], "mapped", [133987]], [[194617, 194617], "mapped", [21483]], [[194618, 194618], "mapped", [21489]], [[194619, 194619], "mapped", [21510]], [[194620, 194620], "mapped", [21662]], [[194621, 194621], "mapped", [21560]], [[194622, 194622], "mapped", [21576]], [[194623, 194623], "mapped", [21608]], [[194624, 194624], "mapped", [21666]], [[194625, 194625], "mapped", [21750]], [[194626, 194626], "mapped", [21776]], [[194627, 194627], "mapped", [21843]], [[194628, 194628], "mapped", [21859]], [[194629, 194630], "mapped", [21892]], [[194631, 194631], "mapped", [21913]], [[194632, 194632], "mapped", [21931]], [[194633, 194633], "mapped", [21939]], [[194634, 194634], "mapped", [21954]], [[194635, 194635], "mapped", [22294]], [[194636, 194636], "mapped", [22022]], [[194637, 194637], "mapped", [22295]], [[194638, 194638], "mapped", [22097]], [[194639, 194639], "mapped", [22132]], [[194640, 194640], "mapped", [20999]], [[194641, 194641], "mapped", [22766]], [[194642, 194642], "mapped", [22478]], [[194643, 194643], "mapped", [22516]], [[194644, 194644], "mapped", [22541]], [[194645, 194645], "mapped", [22411]], [[194646, 194646], "mapped", [22578]], [[194647, 194647], "mapped", [22577]], [[194648, 194648], "mapped", [22700]], [[194649, 194649], "mapped", [136420]], [[194650, 194650], "mapped", [22770]], [[194651, 194651], "mapped", [22775]], [[194652, 194652], "mapped", [22790]], [[194653, 194653], "mapped", [22810]], [[194654, 194654], "mapped", [22818]], [[194655, 194655], "mapped", [22882]], [[194656, 194656], "mapped", [136872]], [[194657, 194657], "mapped", [136938]], [[194658, 194658], "mapped", [23020]], [[194659, 194659], "mapped", [23067]], [[194660, 194660], "mapped", [23079]], [[194661, 194661], "mapped", [23e3]], [[194662, 194662], "mapped", [23142]], [[194663, 194663], "mapped", [14062]], [[194664, 194664], "disallowed"], [[194665, 194665], "mapped", [23304]], [[194666, 194667], "mapped", [23358]], [[194668, 194668], "mapped", [137672]], [[194669, 194669], "mapped", [23491]], [[194670, 194670], "mapped", [23512]], [[194671, 194671], "mapped", [23527]], [[194672, 194672], "mapped", [23539]], [[194673, 194673], "mapped", [138008]], [[194674, 194674], "mapped", [23551]], [[194675, 194675], "mapped", [23558]], [[194676, 194676], "disallowed"], [[194677, 194677], "mapped", [23586]], [[194678, 194678], "mapped", [14209]], [[194679, 194679], "mapped", [23648]], [[194680, 194680], "mapped", [23662]], [[194681, 194681], "mapped", [23744]], [[194682, 194682], "mapped", [23693]], [[194683, 194683], "mapped", [138724]], [[194684, 194684], "mapped", [23875]], [[194685, 194685], "mapped", [138726]], [[194686, 194686], "mapped", [23918]], [[194687, 194687], "mapped", [23915]], [[194688, 194688], "mapped", [23932]], [[194689, 194689], "mapped", [24033]], [[194690, 194690], "mapped", [24034]], [[194691, 194691], "mapped", [14383]], [[194692, 194692], "mapped", [24061]], [[194693, 194693], "mapped", [24104]], [[194694, 194694], "mapped", [24125]], [[194695, 194695], "mapped", [24169]], [[194696, 194696], "mapped", [14434]], [[194697, 194697], "mapped", [139651]], [[194698, 194698], "mapped", [14460]], [[194699, 194699], "mapped", [24240]], [[194700, 194700], "mapped", [24243]], [[194701, 194701], "mapped", [24246]], [[194702, 194702], "mapped", [24266]], [[194703, 194703], "mapped", [172946]], [[194704, 194704], "mapped", [24318]], [[194705, 194706], "mapped", [140081]], [[194707, 194707], "mapped", [33281]], [[194708, 194709], "mapped", [24354]], [[194710, 194710], "mapped", [14535]], [[194711, 194711], "mapped", [144056]], [[194712, 194712], "mapped", [156122]], [[194713, 194713], "mapped", [24418]], [[194714, 194714], "mapped", [24427]], [[194715, 194715], "mapped", [14563]], [[194716, 194716], "mapped", [24474]], [[194717, 194717], "mapped", [24525]], [[194718, 194718], "mapped", [24535]], [[194719, 194719], "mapped", [24569]], [[194720, 194720], "mapped", [24705]], [[194721, 194721], "mapped", [14650]], [[194722, 194722], "mapped", [14620]], [[194723, 194723], "mapped", [24724]], [[194724, 194724], "mapped", [141012]], [[194725, 194725], "mapped", [24775]], [[194726, 194726], "mapped", [24904]], [[194727, 194727], "mapped", [24908]], [[194728, 194728], "mapped", [24910]], [[194729, 194729], "mapped", [24908]], [[194730, 194730], "mapped", [24954]], [[194731, 194731], "mapped", [24974]], [[194732, 194732], "mapped", [25010]], [[194733, 194733], "mapped", [24996]], [[194734, 194734], "mapped", [25007]], [[194735, 194735], "mapped", [25054]], [[194736, 194736], "mapped", [25074]], [[194737, 194737], "mapped", [25078]], [[194738, 194738], "mapped", [25104]], [[194739, 194739], "mapped", [25115]], [[194740, 194740], "mapped", [25181]], [[194741, 194741], "mapped", [25265]], [[194742, 194742], "mapped", [25300]], [[194743, 194743], "mapped", [25424]], [[194744, 194744], "mapped", [142092]], [[194745, 194745], "mapped", [25405]], [[194746, 194746], "mapped", [25340]], [[194747, 194747], "mapped", [25448]], [[194748, 194748], "mapped", [25475]], [[194749, 194749], "mapped", [25572]], [[194750, 194750], "mapped", [142321]], [[194751, 194751], "mapped", [25634]], [[194752, 194752], "mapped", [25541]], [[194753, 194753], "mapped", [25513]], [[194754, 194754], "mapped", [14894]], [[194755, 194755], "mapped", [25705]], [[194756, 194756], "mapped", [25726]], [[194757, 194757], "mapped", [25757]], [[194758, 194758], "mapped", [25719]], [[194759, 194759], "mapped", [14956]], [[194760, 194760], "mapped", [25935]], [[194761, 194761], "mapped", [25964]], [[194762, 194762], "mapped", [143370]], [[194763, 194763], "mapped", [26083]], [[194764, 194764], "mapped", [26360]], [[194765, 194765], "mapped", [26185]], [[194766, 194766], "mapped", [15129]], [[194767, 194767], "mapped", [26257]], [[194768, 194768], "mapped", [15112]], [[194769, 194769], "mapped", [15076]], [[194770, 194770], "mapped", [20882]], [[194771, 194771], "mapped", [20885]], [[194772, 194772], "mapped", [26368]], [[194773, 194773], "mapped", [26268]], [[194774, 194774], "mapped", [32941]], [[194775, 194775], "mapped", [17369]], [[194776, 194776], "mapped", [26391]], [[194777, 194777], "mapped", [26395]], [[194778, 194778], "mapped", [26401]], [[194779, 194779], "mapped", [26462]], [[194780, 194780], "mapped", [26451]], [[194781, 194781], "mapped", [144323]], [[194782, 194782], "mapped", [15177]], [[194783, 194783], "mapped", [26618]], [[194784, 194784], "mapped", [26501]], [[194785, 194785], "mapped", [26706]], [[194786, 194786], "mapped", [26757]], [[194787, 194787], "mapped", [144493]], [[194788, 194788], "mapped", [26766]], [[194789, 194789], "mapped", [26655]], [[194790, 194790], "mapped", [26900]], [[194791, 194791], "mapped", [15261]], [[194792, 194792], "mapped", [26946]], [[194793, 194793], "mapped", [27043]], [[194794, 194794], "mapped", [27114]], [[194795, 194795], "mapped", [27304]], [[194796, 194796], "mapped", [145059]], [[194797, 194797], "mapped", [27355]], [[194798, 194798], "mapped", [15384]], [[194799, 194799], "mapped", [27425]], [[194800, 194800], "mapped", [145575]], [[194801, 194801], "mapped", [27476]], [[194802, 194802], "mapped", [15438]], [[194803, 194803], "mapped", [27506]], [[194804, 194804], "mapped", [27551]], [[194805, 194805], "mapped", [27578]], [[194806, 194806], "mapped", [27579]], [[194807, 194807], "mapped", [146061]], [[194808, 194808], "mapped", [138507]], [[194809, 194809], "mapped", [146170]], [[194810, 194810], "mapped", [27726]], [[194811, 194811], "mapped", [146620]], [[194812, 194812], "mapped", [27839]], [[194813, 194813], "mapped", [27853]], [[194814, 194814], "mapped", [27751]], [[194815, 194815], "mapped", [27926]], [[194816, 194816], "mapped", [27966]], [[194817, 194817], "mapped", [28023]], [[194818, 194818], "mapped", [27969]], [[194819, 194819], "mapped", [28009]], [[194820, 194820], "mapped", [28024]], [[194821, 194821], "mapped", [28037]], [[194822, 194822], "mapped", [146718]], [[194823, 194823], "mapped", [27956]], [[194824, 194824], "mapped", [28207]], [[194825, 194825], "mapped", [28270]], [[194826, 194826], "mapped", [15667]], [[194827, 194827], "mapped", [28363]], [[194828, 194828], "mapped", [28359]], [[194829, 194829], "mapped", [147153]], [[194830, 194830], "mapped", [28153]], [[194831, 194831], "mapped", [28526]], [[194832, 194832], "mapped", [147294]], [[194833, 194833], "mapped", [147342]], [[194834, 194834], "mapped", [28614]], [[194835, 194835], "mapped", [28729]], [[194836, 194836], "mapped", [28702]], [[194837, 194837], "mapped", [28699]], [[194838, 194838], "mapped", [15766]], [[194839, 194839], "mapped", [28746]], [[194840, 194840], "mapped", [28797]], [[194841, 194841], "mapped", [28791]], [[194842, 194842], "mapped", [28845]], [[194843, 194843], "mapped", [132389]], [[194844, 194844], "mapped", [28997]], [[194845, 194845], "mapped", [148067]], [[194846, 194846], "mapped", [29084]], [[194847, 194847], "disallowed"], [[194848, 194848], "mapped", [29224]], [[194849, 194849], "mapped", [29237]], [[194850, 194850], "mapped", [29264]], [[194851, 194851], "mapped", [149e3]], [[194852, 194852], "mapped", [29312]], [[194853, 194853], "mapped", [29333]], [[194854, 194854], "mapped", [149301]], [[194855, 194855], "mapped", [149524]], [[194856, 194856], "mapped", [29562]], [[194857, 194857], "mapped", [29579]], [[194858, 194858], "mapped", [16044]], [[194859, 194859], "mapped", [29605]], [[194860, 194861], "mapped", [16056]], [[194862, 194862], "mapped", [29767]], [[194863, 194863], "mapped", [29788]], [[194864, 194864], "mapped", [29809]], [[194865, 194865], "mapped", [29829]], [[194866, 194866], "mapped", [29898]], [[194867, 194867], "mapped", [16155]], [[194868, 194868], "mapped", [29988]], [[194869, 194869], "mapped", [150582]], [[194870, 194870], "mapped", [30014]], [[194871, 194871], "mapped", [150674]], [[194872, 194872], "mapped", [30064]], [[194873, 194873], "mapped", [139679]], [[194874, 194874], "mapped", [30224]], [[194875, 194875], "mapped", [151457]], [[194876, 194876], "mapped", [151480]], [[194877, 194877], "mapped", [151620]], [[194878, 194878], "mapped", [16380]], [[194879, 194879], "mapped", [16392]], [[194880, 194880], "mapped", [30452]], [[194881, 194881], "mapped", [151795]], [[194882, 194882], "mapped", [151794]], [[194883, 194883], "mapped", [151833]], [[194884, 194884], "mapped", [151859]], [[194885, 194885], "mapped", [30494]], [[194886, 194887], "mapped", [30495]], [[194888, 194888], "mapped", [30538]], [[194889, 194889], "mapped", [16441]], [[194890, 194890], "mapped", [30603]], [[194891, 194891], "mapped", [16454]], [[194892, 194892], "mapped", [16534]], [[194893, 194893], "mapped", [152605]], [[194894, 194894], "mapped", [30798]], [[194895, 194895], "mapped", [30860]], [[194896, 194896], "mapped", [30924]], [[194897, 194897], "mapped", [16611]], [[194898, 194898], "mapped", [153126]], [[194899, 194899], "mapped", [31062]], [[194900, 194900], "mapped", [153242]], [[194901, 194901], "mapped", [153285]], [[194902, 194902], "mapped", [31119]], [[194903, 194903], "mapped", [31211]], [[194904, 194904], "mapped", [16687]], [[194905, 194905], "mapped", [31296]], [[194906, 194906], "mapped", [31306]], [[194907, 194907], "mapped", [31311]], [[194908, 194908], "mapped", [153980]], [[194909, 194910], "mapped", [154279]], [[194911, 194911], "disallowed"], [[194912, 194912], "mapped", [16898]], [[194913, 194913], "mapped", [154539]], [[194914, 194914], "mapped", [31686]], [[194915, 194915], "mapped", [31689]], [[194916, 194916], "mapped", [16935]], [[194917, 194917], "mapped", [154752]], [[194918, 194918], "mapped", [31954]], [[194919, 194919], "mapped", [17056]], [[194920, 194920], "mapped", [31976]], [[194921, 194921], "mapped", [31971]], [[194922, 194922], "mapped", [32e3]], [[194923, 194923], "mapped", [155526]], [[194924, 194924], "mapped", [32099]], [[194925, 194925], "mapped", [17153]], [[194926, 194926], "mapped", [32199]], [[194927, 194927], "mapped", [32258]], [[194928, 194928], "mapped", [32325]], [[194929, 194929], "mapped", [17204]], [[194930, 194930], "mapped", [156200]], [[194931, 194931], "mapped", [156231]], [[194932, 194932], "mapped", [17241]], [[194933, 194933], "mapped", [156377]], [[194934, 194934], "mapped", [32634]], [[194935, 194935], "mapped", [156478]], [[194936, 194936], "mapped", [32661]], [[194937, 194937], "mapped", [32762]], [[194938, 194938], "mapped", [32773]], [[194939, 194939], "mapped", [156890]], [[194940, 194940], "mapped", [156963]], [[194941, 194941], "mapped", [32864]], [[194942, 194942], "mapped", [157096]], [[194943, 194943], "mapped", [32880]], [[194944, 194944], "mapped", [144223]], [[194945, 194945], "mapped", [17365]], [[194946, 194946], "mapped", [32946]], [[194947, 194947], "mapped", [33027]], [[194948, 194948], "mapped", [17419]], [[194949, 194949], "mapped", [33086]], [[194950, 194950], "mapped", [23221]], [[194951, 194951], "mapped", [157607]], [[194952, 194952], "mapped", [157621]], [[194953, 194953], "mapped", [144275]], [[194954, 194954], "mapped", [144284]], [[194955, 194955], "mapped", [33281]], [[194956, 194956], "mapped", [33284]], [[194957, 194957], "mapped", [36766]], [[194958, 194958], "mapped", [17515]], [[194959, 194959], "mapped", [33425]], [[194960, 194960], "mapped", [33419]], [[194961, 194961], "mapped", [33437]], [[194962, 194962], "mapped", [21171]], [[194963, 194963], "mapped", [33457]], [[194964, 194964], "mapped", [33459]], [[194965, 194965], "mapped", [33469]], [[194966, 194966], "mapped", [33510]], [[194967, 194967], "mapped", [158524]], [[194968, 194968], "mapped", [33509]], [[194969, 194969], "mapped", [33565]], [[194970, 194970], "mapped", [33635]], [[194971, 194971], "mapped", [33709]], [[194972, 194972], "mapped", [33571]], [[194973, 194973], "mapped", [33725]], [[194974, 194974], "mapped", [33767]], [[194975, 194975], "mapped", [33879]], [[194976, 194976], "mapped", [33619]], [[194977, 194977], "mapped", [33738]], [[194978, 194978], "mapped", [33740]], [[194979, 194979], "mapped", [33756]], [[194980, 194980], "mapped", [158774]], [[194981, 194981], "mapped", [159083]], [[194982, 194982], "mapped", [158933]], [[194983, 194983], "mapped", [17707]], [[194984, 194984], "mapped", [34033]], [[194985, 194985], "mapped", [34035]], [[194986, 194986], "mapped", [34070]], [[194987, 194987], "mapped", [160714]], [[194988, 194988], "mapped", [34148]], [[194989, 194989], "mapped", [159532]], [[194990, 194990], "mapped", [17757]], [[194991, 194991], "mapped", [17761]], [[194992, 194992], "mapped", [159665]], [[194993, 194993], "mapped", [159954]], [[194994, 194994], "mapped", [17771]], [[194995, 194995], "mapped", [34384]], [[194996, 194996], "mapped", [34396]], [[194997, 194997], "mapped", [34407]], [[194998, 194998], "mapped", [34409]], [[194999, 194999], "mapped", [34473]], [[195e3, 195e3], "mapped", [34440]], [[195001, 195001], "mapped", [34574]], [[195002, 195002], "mapped", [34530]], [[195003, 195003], "mapped", [34681]], [[195004, 195004], "mapped", [34600]], [[195005, 195005], "mapped", [34667]], [[195006, 195006], "mapped", [34694]], [[195007, 195007], "disallowed"], [[195008, 195008], "mapped", [34785]], [[195009, 195009], "mapped", [34817]], [[195010, 195010], "mapped", [17913]], [[195011, 195011], "mapped", [34912]], [[195012, 195012], "mapped", [34915]], [[195013, 195013], "mapped", [161383]], [[195014, 195014], "mapped", [35031]], [[195015, 195015], "mapped", [35038]], [[195016, 195016], "mapped", [17973]], [[195017, 195017], "mapped", [35066]], [[195018, 195018], "mapped", [13499]], [[195019, 195019], "mapped", [161966]], [[195020, 195020], "mapped", [162150]], [[195021, 195021], "mapped", [18110]], [[195022, 195022], "mapped", [18119]], [[195023, 195023], "mapped", [35488]], [[195024, 195024], "mapped", [35565]], [[195025, 195025], "mapped", [35722]], [[195026, 195026], "mapped", [35925]], [[195027, 195027], "mapped", [162984]], [[195028, 195028], "mapped", [36011]], [[195029, 195029], "mapped", [36033]], [[195030, 195030], "mapped", [36123]], [[195031, 195031], "mapped", [36215]], [[195032, 195032], "mapped", [163631]], [[195033, 195033], "mapped", [133124]], [[195034, 195034], "mapped", [36299]], [[195035, 195035], "mapped", [36284]], [[195036, 195036], "mapped", [36336]], [[195037, 195037], "mapped", [133342]], [[195038, 195038], "mapped", [36564]], [[195039, 195039], "mapped", [36664]], [[195040, 195040], "mapped", [165330]], [[195041, 195041], "mapped", [165357]], [[195042, 195042], "mapped", [37012]], [[195043, 195043], "mapped", [37105]], [[195044, 195044], "mapped", [37137]], [[195045, 195045], "mapped", [165678]], [[195046, 195046], "mapped", [37147]], [[195047, 195047], "mapped", [37432]], [[195048, 195048], "mapped", [37591]], [[195049, 195049], "mapped", [37592]], [[195050, 195050], "mapped", [37500]], [[195051, 195051], "mapped", [37881]], [[195052, 195052], "mapped", [37909]], [[195053, 195053], "mapped", [166906]], [[195054, 195054], "mapped", [38283]], [[195055, 195055], "mapped", [18837]], [[195056, 195056], "mapped", [38327]], [[195057, 195057], "mapped", [167287]], [[195058, 195058], "mapped", [18918]], [[195059, 195059], "mapped", [38595]], [[195060, 195060], "mapped", [23986]], [[195061, 195061], "mapped", [38691]], [[195062, 195062], "mapped", [168261]], [[195063, 195063], "mapped", [168474]], [[195064, 195064], "mapped", [19054]], [[195065, 195065], "mapped", [19062]], [[195066, 195066], "mapped", [38880]], [[195067, 195067], "mapped", [168970]], [[195068, 195068], "mapped", [19122]], [[195069, 195069], "mapped", [169110]], [[195070, 195071], "mapped", [38923]], [[195072, 195072], "mapped", [38953]], [[195073, 195073], "mapped", [169398]], [[195074, 195074], "mapped", [39138]], [[195075, 195075], "mapped", [19251]], [[195076, 195076], "mapped", [39209]], [[195077, 195077], "mapped", [39335]], [[195078, 195078], "mapped", [39362]], [[195079, 195079], "mapped", [39422]], [[195080, 195080], "mapped", [19406]], [[195081, 195081], "mapped", [170800]], [[195082, 195082], "mapped", [39698]], [[195083, 195083], "mapped", [4e4]], [[195084, 195084], "mapped", [40189]], [[195085, 195085], "mapped", [19662]], [[195086, 195086], "mapped", [19693]], [[195087, 195087], "mapped", [40295]], [[195088, 195088], "mapped", [172238]], [[195089, 195089], "mapped", [19704]], [[195090, 195090], "mapped", [172293]], [[195091, 195091], "mapped", [172558]], [[195092, 195092], "mapped", [172689]], [[195093, 195093], "mapped", [40635]], [[195094, 195094], "mapped", [19798]], [[195095, 195095], "mapped", [40697]], [[195096, 195096], "mapped", [40702]], [[195097, 195097], "mapped", [40709]], [[195098, 195098], "mapped", [40719]], [[195099, 195099], "mapped", [40726]], [[195100, 195100], "mapped", [40763]], [[195101, 195101], "mapped", [173568]], [[195102, 196605], "disallowed"], [[196606, 196607], "disallowed"], [[196608, 262141], "disallowed"], [[262142, 262143], "disallowed"], [[262144, 327677], "disallowed"], [[327678, 327679], "disallowed"], [[327680, 393213], "disallowed"], [[393214, 393215], "disallowed"], [[393216, 458749], "disallowed"], [[458750, 458751], "disallowed"], [[458752, 524285], "disallowed"], [[524286, 524287], "disallowed"], [[524288, 589821], "disallowed"], [[589822, 589823], "disallowed"], [[589824, 655357], "disallowed"], [[655358, 655359], "disallowed"], [[655360, 720893], "disallowed"], [[720894, 720895], "disallowed"], [[720896, 786429], "disallowed"], [[786430, 786431], "disallowed"], [[786432, 851965], "disallowed"], [[851966, 851967], "disallowed"], [[851968, 917501], "disallowed"], [[917502, 917503], "disallowed"], [[917504, 917504], "disallowed"], [[917505, 917505], "disallowed"], [[917506, 917535], "disallowed"], [[917536, 917631], "disallowed"], [[917632, 917759], "disallowed"], [[917760, 917999], "ignored"], [[918e3, 983037], "disallowed"], [[983038, 983039], "disallowed"], [[983040, 1048573], "disallowed"], [[1048574, 1048575], "disallowed"], [[1048576, 1114109], "disallowed"], [[1114110, 1114111], "disallowed"]];
  }
});

// node_modules/tr46/index.js
var require_tr46 = __commonJS({
  "node_modules/tr46/index.js"(exports, module2) {
    "use strict";
    var punycode = require("punycode");
    var mappingTable = require_mappingTable();
    var PROCESSING_OPTIONS = {
      TRANSITIONAL: 0,
      NONTRANSITIONAL: 1
    };
    function normalize2(str) {
      return str.split("\0").map(function(s) {
        return s.normalize("NFC");
      }).join("\0");
    }
    function findStatus(val) {
      var start = 0;
      var end2 = mappingTable.length - 1;
      while (start <= end2) {
        var mid = Math.floor((start + end2) / 2);
        var target = mappingTable[mid];
        if (target[0][0] <= val && target[0][1] >= val) {
          return target;
        } else if (target[0][0] > val) {
          end2 = mid - 1;
        } else {
          start = mid + 1;
        }
      }
      return null;
    }
    var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    function countSymbols(string) {
      return string.replace(regexAstralSymbols, "_").length;
    }
    function mapChars(domain_name, useSTD3, processing_option) {
      var hasError = false;
      var processed = "";
      var len = countSymbols(domain_name);
      for (var i = 0; i < len; ++i) {
        var codePoint = domain_name.codePointAt(i);
        var status = findStatus(codePoint);
        switch (status[1]) {
          case "disallowed":
            hasError = true;
            processed += String.fromCodePoint(codePoint);
            break;
          case "ignored":
            break;
          case "mapped":
            processed += String.fromCodePoint.apply(String, status[2]);
            break;
          case "deviation":
            if (processing_option === PROCESSING_OPTIONS.TRANSITIONAL) {
              processed += String.fromCodePoint.apply(String, status[2]);
            } else {
              processed += String.fromCodePoint(codePoint);
            }
            break;
          case "valid":
            processed += String.fromCodePoint(codePoint);
            break;
          case "disallowed_STD3_mapped":
            if (useSTD3) {
              hasError = true;
              processed += String.fromCodePoint(codePoint);
            } else {
              processed += String.fromCodePoint.apply(String, status[2]);
            }
            break;
          case "disallowed_STD3_valid":
            if (useSTD3) {
              hasError = true;
            }
            processed += String.fromCodePoint(codePoint);
            break;
        }
      }
      return {
        string: processed,
        error: hasError
      };
    }
    var combiningMarksRegex = /[\u0300-\u036F\u0483-\u0489\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B62\u0B63\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0C00-\u0C03\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0D01-\u0D03\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D82\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u192B\u1930-\u193B\u19B0-\u19C0\u19C8\u19C9\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F\u1AB0-\u1ABE\u1B00-\u1B04\u1B34-\u1B44\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BF3\u1C24-\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF2-\u1CF4\u1CF8\u1CF9\u1DC0-\u1DF5\u1DFC-\u1DFF\u20D0-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA66F-\uA672\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA880\uA881\uA8B4-\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9E5\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE2D]|\uD800[\uDDFD\uDEE0\uDF76-\uDF7A]|\uD802[\uDE01-\uDE03\uDE05\uDE06\uDE0C-\uDE0F\uDE38-\uDE3A\uDE3F\uDEE5\uDEE6]|\uD804[\uDC00-\uDC02\uDC38-\uDC46\uDC7F-\uDC82\uDCB0-\uDCBA\uDD00-\uDD02\uDD27-\uDD34\uDD73\uDD80-\uDD82\uDDB3-\uDDC0\uDE2C-\uDE37\uDEDF-\uDEEA\uDF01-\uDF03\uDF3C\uDF3E-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF62\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDCB0-\uDCC3\uDDAF-\uDDB5\uDDB8-\uDDC0\uDE30-\uDE40\uDEAB-\uDEB7]|\uD81A[\uDEF0-\uDEF4\uDF30-\uDF36]|\uD81B[\uDF51-\uDF7E\uDF8F-\uDF92]|\uD82F[\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD83A[\uDCD0-\uDCD6]|\uDB40[\uDD00-\uDDEF]/;
    function validateLabel(label, processing_option) {
      if (label.substr(0, 4) === "xn--") {
        label = punycode.toUnicode(label);
        processing_option = PROCESSING_OPTIONS.NONTRANSITIONAL;
      }
      var error2 = false;
      if (normalize2(label) !== label || label[3] === "-" && label[4] === "-" || label[0] === "-" || label[label.length - 1] === "-" || label.indexOf(".") !== -1 || label.search(combiningMarksRegex) === 0) {
        error2 = true;
      }
      var len = countSymbols(label);
      for (var i = 0; i < len; ++i) {
        var status = findStatus(label.codePointAt(i));
        if (processing === PROCESSING_OPTIONS.TRANSITIONAL && status[1] !== "valid" || processing === PROCESSING_OPTIONS.NONTRANSITIONAL && status[1] !== "valid" && status[1] !== "deviation") {
          error2 = true;
          break;
        }
      }
      return {
        label,
        error: error2
      };
    }
    function processing(domain_name, useSTD3, processing_option) {
      var result = mapChars(domain_name, useSTD3, processing_option);
      result.string = normalize2(result.string);
      var labels = result.string.split(".");
      for (var i = 0; i < labels.length; ++i) {
        try {
          var validation = validateLabel(labels[i]);
          labels[i] = validation.label;
          result.error = result.error || validation.error;
        } catch (e) {
          result.error = true;
        }
      }
      return {
        string: labels.join("."),
        error: result.error
      };
    }
    module2.exports.toASCII = function(domain_name, useSTD3, processing_option, verifyDnsLength) {
      var result = processing(domain_name, useSTD3, processing_option);
      var labels = result.string.split(".");
      labels = labels.map(function(l) {
        try {
          return punycode.toASCII(l);
        } catch (e) {
          result.error = true;
          return l;
        }
      });
      if (verifyDnsLength) {
        var total = labels.slice(0, labels.length - 1).join(".").length;
        if (total.length > 253 || total.length === 0) {
          result.error = true;
        }
        for (var i = 0; i < labels.length; ++i) {
          if (labels.length > 63 || labels.length === 0) {
            result.error = true;
            break;
          }
        }
      }
      if (result.error)
        return null;
      return labels.join(".");
    };
    module2.exports.toUnicode = function(domain_name, useSTD3) {
      var result = processing(domain_name, useSTD3, PROCESSING_OPTIONS.NONTRANSITIONAL);
      return {
        domain: result.string,
        error: result.error
      };
    };
    module2.exports.PROCESSING_OPTIONS = PROCESSING_OPTIONS;
  }
});

// node_modules/whatwg-url/lib/url-state-machine.js
var require_url_state_machine = __commonJS({
  "node_modules/whatwg-url/lib/url-state-machine.js"(exports, module2) {
    "use strict";
    var punycode = require("punycode");
    var tr46 = require_tr46();
    var specialSchemes = {
      ftp: 21,
      file: null,
      gopher: 70,
      http: 80,
      https: 443,
      ws: 80,
      wss: 443
    };
    var failure = Symbol("failure");
    function countSymbols(str) {
      return punycode.ucs2.decode(str).length;
    }
    function at(input, idx) {
      const c = input[idx];
      return isNaN(c) ? void 0 : String.fromCodePoint(c);
    }
    function isASCIIDigit(c) {
      return c >= 48 && c <= 57;
    }
    function isASCIIAlpha(c) {
      return c >= 65 && c <= 90 || c >= 97 && c <= 122;
    }
    function isASCIIAlphanumeric(c) {
      return isASCIIAlpha(c) || isASCIIDigit(c);
    }
    function isASCIIHex(c) {
      return isASCIIDigit(c) || c >= 65 && c <= 70 || c >= 97 && c <= 102;
    }
    function isSingleDot(buffer) {
      return buffer === "." || buffer.toLowerCase() === "%2e";
    }
    function isDoubleDot(buffer) {
      buffer = buffer.toLowerCase();
      return buffer === ".." || buffer === "%2e." || buffer === ".%2e" || buffer === "%2e%2e";
    }
    function isWindowsDriveLetterCodePoints(cp1, cp2) {
      return isASCIIAlpha(cp1) && (cp2 === 58 || cp2 === 124);
    }
    function isWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && (string[1] === ":" || string[1] === "|");
    }
    function isNormalizedWindowsDriveLetterString(string) {
      return string.length === 2 && isASCIIAlpha(string.codePointAt(0)) && string[1] === ":";
    }
    function containsForbiddenHostCodePoint(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|%|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function containsForbiddenHostCodePointExcludingPercent(string) {
      return string.search(/\u0000|\u0009|\u000A|\u000D|\u0020|#|\/|:|\?|@|\[|\\|\]/) !== -1;
    }
    function isSpecialScheme(scheme) {
      return specialSchemes[scheme] !== void 0;
    }
    function isSpecial(url) {
      return isSpecialScheme(url.scheme);
    }
    function defaultPort(scheme) {
      return specialSchemes[scheme];
    }
    function percentEncode(c) {
      let hex = c.toString(16).toUpperCase();
      if (hex.length === 1) {
        hex = "0" + hex;
      }
      return "%" + hex;
    }
    function utf8PercentEncode(c) {
      const buf = new Buffer(c);
      let str = "";
      for (let i = 0; i < buf.length; ++i) {
        str += percentEncode(buf[i]);
      }
      return str;
    }
    function utf8PercentDecode(str) {
      const input = new Buffer(str);
      const output = [];
      for (let i = 0; i < input.length; ++i) {
        if (input[i] !== 37) {
          output.push(input[i]);
        } else if (input[i] === 37 && isASCIIHex(input[i + 1]) && isASCIIHex(input[i + 2])) {
          output.push(parseInt(input.slice(i + 1, i + 3).toString(), 16));
          i += 2;
        } else {
          output.push(input[i]);
        }
      }
      return new Buffer(output).toString();
    }
    function isC0ControlPercentEncode(c) {
      return c <= 31 || c > 126;
    }
    var extraPathPercentEncodeSet = /* @__PURE__ */ new Set([32, 34, 35, 60, 62, 63, 96, 123, 125]);
    function isPathPercentEncode(c) {
      return isC0ControlPercentEncode(c) || extraPathPercentEncodeSet.has(c);
    }
    var extraUserinfoPercentEncodeSet = /* @__PURE__ */ new Set([47, 58, 59, 61, 64, 91, 92, 93, 94, 124]);
    function isUserinfoPercentEncode(c) {
      return isPathPercentEncode(c) || extraUserinfoPercentEncodeSet.has(c);
    }
    function percentEncodeChar(c, encodeSetPredicate) {
      const cStr = String.fromCodePoint(c);
      if (encodeSetPredicate(c)) {
        return utf8PercentEncode(cStr);
      }
      return cStr;
    }
    function parseIPv4Number(input) {
      let R = 10;
      if (input.length >= 2 && input.charAt(0) === "0" && input.charAt(1).toLowerCase() === "x") {
        input = input.substring(2);
        R = 16;
      } else if (input.length >= 2 && input.charAt(0) === "0") {
        input = input.substring(1);
        R = 8;
      }
      if (input === "") {
        return 0;
      }
      const regex2 = R === 10 ? /[^0-9]/ : R === 16 ? /[^0-9A-Fa-f]/ : /[^0-7]/;
      if (regex2.test(input)) {
        return failure;
      }
      return parseInt(input, R);
    }
    function parseIPv4(input) {
      const parts = input.split(".");
      if (parts[parts.length - 1] === "") {
        if (parts.length > 1) {
          parts.pop();
        }
      }
      if (parts.length > 4) {
        return input;
      }
      const numbers = [];
      for (const part of parts) {
        if (part === "") {
          return input;
        }
        const n = parseIPv4Number(part);
        if (n === failure) {
          return input;
        }
        numbers.push(n);
      }
      for (let i = 0; i < numbers.length - 1; ++i) {
        if (numbers[i] > 255) {
          return failure;
        }
      }
      if (numbers[numbers.length - 1] >= Math.pow(256, 5 - numbers.length)) {
        return failure;
      }
      let ipv4 = numbers.pop();
      let counter = 0;
      for (const n of numbers) {
        ipv4 += n * Math.pow(256, 3 - counter);
        ++counter;
      }
      return ipv4;
    }
    function serializeIPv4(address) {
      let output = "";
      let n = address;
      for (let i = 1; i <= 4; ++i) {
        output = String(n % 256) + output;
        if (i !== 4) {
          output = "." + output;
        }
        n = Math.floor(n / 256);
      }
      return output;
    }
    function parseIPv6(input) {
      const address = [0, 0, 0, 0, 0, 0, 0, 0];
      let pieceIndex = 0;
      let compress = null;
      let pointer = 0;
      input = punycode.ucs2.decode(input);
      if (input[pointer] === 58) {
        if (input[pointer + 1] !== 58) {
          return failure;
        }
        pointer += 2;
        ++pieceIndex;
        compress = pieceIndex;
      }
      while (pointer < input.length) {
        if (pieceIndex === 8) {
          return failure;
        }
        if (input[pointer] === 58) {
          if (compress !== null) {
            return failure;
          }
          ++pointer;
          ++pieceIndex;
          compress = pieceIndex;
          continue;
        }
        let value = 0;
        let length4 = 0;
        while (length4 < 4 && isASCIIHex(input[pointer])) {
          value = value * 16 + parseInt(at(input, pointer), 16);
          ++pointer;
          ++length4;
        }
        if (input[pointer] === 46) {
          if (length4 === 0) {
            return failure;
          }
          pointer -= length4;
          if (pieceIndex > 6) {
            return failure;
          }
          let numbersSeen = 0;
          while (input[pointer] !== void 0) {
            let ipv4Piece = null;
            if (numbersSeen > 0) {
              if (input[pointer] === 46 && numbersSeen < 4) {
                ++pointer;
              } else {
                return failure;
              }
            }
            if (!isASCIIDigit(input[pointer])) {
              return failure;
            }
            while (isASCIIDigit(input[pointer])) {
              const number = parseInt(at(input, pointer));
              if (ipv4Piece === null) {
                ipv4Piece = number;
              } else if (ipv4Piece === 0) {
                return failure;
              } else {
                ipv4Piece = ipv4Piece * 10 + number;
              }
              if (ipv4Piece > 255) {
                return failure;
              }
              ++pointer;
            }
            address[pieceIndex] = address[pieceIndex] * 256 + ipv4Piece;
            ++numbersSeen;
            if (numbersSeen === 2 || numbersSeen === 4) {
              ++pieceIndex;
            }
          }
          if (numbersSeen !== 4) {
            return failure;
          }
          break;
        } else if (input[pointer] === 58) {
          ++pointer;
          if (input[pointer] === void 0) {
            return failure;
          }
        } else if (input[pointer] !== void 0) {
          return failure;
        }
        address[pieceIndex] = value;
        ++pieceIndex;
      }
      if (compress !== null) {
        let swaps = pieceIndex - compress;
        pieceIndex = 7;
        while (pieceIndex !== 0 && swaps > 0) {
          const temp = address[compress + swaps - 1];
          address[compress + swaps - 1] = address[pieceIndex];
          address[pieceIndex] = temp;
          --pieceIndex;
          --swaps;
        }
      } else if (compress === null && pieceIndex !== 8) {
        return failure;
      }
      return address;
    }
    function serializeIPv6(address) {
      let output = "";
      const seqResult = findLongestZeroSequence(address);
      const compress = seqResult.idx;
      let ignore0 = false;
      for (let pieceIndex = 0; pieceIndex <= 7; ++pieceIndex) {
        if (ignore0 && address[pieceIndex] === 0) {
          continue;
        } else if (ignore0) {
          ignore0 = false;
        }
        if (compress === pieceIndex) {
          const separator = pieceIndex === 0 ? "::" : ":";
          output += separator;
          ignore0 = true;
          continue;
        }
        output += address[pieceIndex].toString(16);
        if (pieceIndex !== 7) {
          output += ":";
        }
      }
      return output;
    }
    function parseHost(input, isSpecialArg) {
      if (input[0] === "[") {
        if (input[input.length - 1] !== "]") {
          return failure;
        }
        return parseIPv6(input.substring(1, input.length - 1));
      }
      if (!isSpecialArg) {
        return parseOpaqueHost(input);
      }
      const domain = utf8PercentDecode(input);
      const asciiDomain = tr46.toASCII(domain, false, tr46.PROCESSING_OPTIONS.NONTRANSITIONAL, false);
      if (asciiDomain === null) {
        return failure;
      }
      if (containsForbiddenHostCodePoint(asciiDomain)) {
        return failure;
      }
      const ipv4Host = parseIPv4(asciiDomain);
      if (typeof ipv4Host === "number" || ipv4Host === failure) {
        return ipv4Host;
      }
      return asciiDomain;
    }
    function parseOpaqueHost(input) {
      if (containsForbiddenHostCodePointExcludingPercent(input)) {
        return failure;
      }
      let output = "";
      const decoded = punycode.ucs2.decode(input);
      for (let i = 0; i < decoded.length; ++i) {
        output += percentEncodeChar(decoded[i], isC0ControlPercentEncode);
      }
      return output;
    }
    function findLongestZeroSequence(arr) {
      let maxIdx = null;
      let maxLen = 1;
      let currStart = null;
      let currLen = 0;
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i] !== 0) {
          if (currLen > maxLen) {
            maxIdx = currStart;
            maxLen = currLen;
          }
          currStart = null;
          currLen = 0;
        } else {
          if (currStart === null) {
            currStart = i;
          }
          ++currLen;
        }
      }
      if (currLen > maxLen) {
        maxIdx = currStart;
        maxLen = currLen;
      }
      return {
        idx: maxIdx,
        len: maxLen
      };
    }
    function serializeHost(host) {
      if (typeof host === "number") {
        return serializeIPv4(host);
      }
      if (host instanceof Array) {
        return "[" + serializeIPv6(host) + "]";
      }
      return host;
    }
    function trimControlChars(url) {
      return url.replace(/^[\u0000-\u001F\u0020]+|[\u0000-\u001F\u0020]+$/g, "");
    }
    function trimTabAndNewline(url) {
      return url.replace(/\u0009|\u000A|\u000D/g, "");
    }
    function shortenPath(url) {
      const path2 = url.path;
      if (path2.length === 0) {
        return;
      }
      if (url.scheme === "file" && path2.length === 1 && isNormalizedWindowsDriveLetter(path2[0])) {
        return;
      }
      path2.pop();
    }
    function includesCredentials(url) {
      return url.username !== "" || url.password !== "";
    }
    function cannotHaveAUsernamePasswordPort(url) {
      return url.host === null || url.host === "" || url.cannotBeABaseURL || url.scheme === "file";
    }
    function isNormalizedWindowsDriveLetter(string) {
      return /^[A-Za-z]:$/.test(string);
    }
    function URLStateMachine(input, base, encodingOverride, url, stateOverride) {
      this.pointer = 0;
      this.input = input;
      this.base = base || null;
      this.encodingOverride = encodingOverride || "utf-8";
      this.stateOverride = stateOverride;
      this.url = url;
      this.failure = false;
      this.parseError = false;
      if (!this.url) {
        this.url = {
          scheme: "",
          username: "",
          password: "",
          host: null,
          port: null,
          path: [],
          query: null,
          fragment: null,
          cannotBeABaseURL: false
        };
        const res2 = trimControlChars(this.input);
        if (res2 !== this.input) {
          this.parseError = true;
        }
        this.input = res2;
      }
      const res = trimTabAndNewline(this.input);
      if (res !== this.input) {
        this.parseError = true;
      }
      this.input = res;
      this.state = stateOverride || "scheme start";
      this.buffer = "";
      this.atFlag = false;
      this.arrFlag = false;
      this.passwordTokenSeenFlag = false;
      this.input = punycode.ucs2.decode(this.input);
      for (; this.pointer <= this.input.length; ++this.pointer) {
        const c = this.input[this.pointer];
        const cStr = isNaN(c) ? void 0 : String.fromCodePoint(c);
        const ret = this["parse " + this.state](c, cStr);
        if (!ret) {
          break;
        } else if (ret === failure) {
          this.failure = true;
          break;
        }
      }
    }
    URLStateMachine.prototype["parse scheme start"] = function parseSchemeStart(c, cStr) {
      if (isASCIIAlpha(c)) {
        this.buffer += cStr.toLowerCase();
        this.state = "scheme";
      } else if (!this.stateOverride) {
        this.state = "no scheme";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse scheme"] = function parseScheme(c, cStr) {
      if (isASCIIAlphanumeric(c) || c === 43 || c === 45 || c === 46) {
        this.buffer += cStr.toLowerCase();
      } else if (c === 58) {
        if (this.stateOverride) {
          if (isSpecial(this.url) && !isSpecialScheme(this.buffer)) {
            return false;
          }
          if (!isSpecial(this.url) && isSpecialScheme(this.buffer)) {
            return false;
          }
          if ((includesCredentials(this.url) || this.url.port !== null) && this.buffer === "file") {
            return false;
          }
          if (this.url.scheme === "file" && (this.url.host === "" || this.url.host === null)) {
            return false;
          }
        }
        this.url.scheme = this.buffer;
        this.buffer = "";
        if (this.stateOverride) {
          return false;
        }
        if (this.url.scheme === "file") {
          if (this.input[this.pointer + 1] !== 47 || this.input[this.pointer + 2] !== 47) {
            this.parseError = true;
          }
          this.state = "file";
        } else if (isSpecial(this.url) && this.base !== null && this.base.scheme === this.url.scheme) {
          this.state = "special relative or authority";
        } else if (isSpecial(this.url)) {
          this.state = "special authority slashes";
        } else if (this.input[this.pointer + 1] === 47) {
          this.state = "path or authority";
          ++this.pointer;
        } else {
          this.url.cannotBeABaseURL = true;
          this.url.path.push("");
          this.state = "cannot-be-a-base-URL path";
        }
      } else if (!this.stateOverride) {
        this.buffer = "";
        this.state = "no scheme";
        this.pointer = -1;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    URLStateMachine.prototype["parse no scheme"] = function parseNoScheme(c) {
      if (this.base === null || this.base.cannotBeABaseURL && c !== 35) {
        return failure;
      } else if (this.base.cannotBeABaseURL && c === 35) {
        this.url.scheme = this.base.scheme;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.url.cannotBeABaseURL = true;
        this.state = "fragment";
      } else if (this.base.scheme === "file") {
        this.state = "file";
        --this.pointer;
      } else {
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special relative or authority"] = function parseSpecialRelativeOrAuthority(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "relative";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse path or authority"] = function parsePathOrAuthority(c) {
      if (c === 47) {
        this.state = "authority";
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative"] = function parseRelative(c) {
      this.url.scheme = this.base.scheme;
      if (isNaN(c)) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
      } else if (c === 47) {
        this.state = "relative slash";
      } else if (c === 63) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice();
        this.url.query = this.base.query;
        this.url.fragment = "";
        this.state = "fragment";
      } else if (isSpecial(this.url) && c === 92) {
        this.parseError = true;
        this.state = "relative slash";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.url.path = this.base.path.slice(0, this.base.path.length - 1);
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse relative slash"] = function parseRelativeSlash(c) {
      if (isSpecial(this.url) && (c === 47 || c === 92)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "special authority ignore slashes";
      } else if (c === 47) {
        this.state = "authority";
      } else {
        this.url.username = this.base.username;
        this.url.password = this.base.password;
        this.url.host = this.base.host;
        this.url.port = this.base.port;
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority slashes"] = function parseSpecialAuthoritySlashes(c) {
      if (c === 47 && this.input[this.pointer + 1] === 47) {
        this.state = "special authority ignore slashes";
        ++this.pointer;
      } else {
        this.parseError = true;
        this.state = "special authority ignore slashes";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse special authority ignore slashes"] = function parseSpecialAuthorityIgnoreSlashes(c) {
      if (c !== 47 && c !== 92) {
        this.state = "authority";
        --this.pointer;
      } else {
        this.parseError = true;
      }
      return true;
    };
    URLStateMachine.prototype["parse authority"] = function parseAuthority(c, cStr) {
      if (c === 64) {
        this.parseError = true;
        if (this.atFlag) {
          this.buffer = "%40" + this.buffer;
        }
        this.atFlag = true;
        const len = countSymbols(this.buffer);
        for (let pointer = 0; pointer < len; ++pointer) {
          const codePoint = this.buffer.codePointAt(pointer);
          if (codePoint === 58 && !this.passwordTokenSeenFlag) {
            this.passwordTokenSeenFlag = true;
            continue;
          }
          const encodedCodePoints = percentEncodeChar(codePoint, isUserinfoPercentEncode);
          if (this.passwordTokenSeenFlag) {
            this.url.password += encodedCodePoints;
          } else {
            this.url.username += encodedCodePoints;
          }
        }
        this.buffer = "";
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        if (this.atFlag && this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        this.pointer -= countSymbols(this.buffer) + 1;
        this.buffer = "";
        this.state = "host";
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse hostname"] = URLStateMachine.prototype["parse host"] = function parseHostName(c, cStr) {
      if (this.stateOverride && this.url.scheme === "file") {
        --this.pointer;
        this.state = "file host";
      } else if (c === 58 && !this.arrFlag) {
        if (this.buffer === "") {
          this.parseError = true;
          return failure;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "port";
        if (this.stateOverride === "hostname") {
          return false;
        }
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92) {
        --this.pointer;
        if (isSpecial(this.url) && this.buffer === "") {
          this.parseError = true;
          return failure;
        } else if (this.stateOverride && this.buffer === "" && (includesCredentials(this.url) || this.url.port !== null)) {
          this.parseError = true;
          return false;
        }
        const host = parseHost(this.buffer, isSpecial(this.url));
        if (host === failure) {
          return failure;
        }
        this.url.host = host;
        this.buffer = "";
        this.state = "path start";
        if (this.stateOverride) {
          return false;
        }
      } else {
        if (c === 91) {
          this.arrFlag = true;
        } else if (c === 93) {
          this.arrFlag = false;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse port"] = function parsePort(c, cStr) {
      if (isASCIIDigit(c)) {
        this.buffer += cStr;
      } else if (isNaN(c) || c === 47 || c === 63 || c === 35 || isSpecial(this.url) && c === 92 || this.stateOverride) {
        if (this.buffer !== "") {
          const port = parseInt(this.buffer);
          if (port > Math.pow(2, 16) - 1) {
            this.parseError = true;
            return failure;
          }
          this.url.port = port === defaultPort(this.url.scheme) ? null : port;
          this.buffer = "";
        }
        if (this.stateOverride) {
          return false;
        }
        this.state = "path start";
        --this.pointer;
      } else {
        this.parseError = true;
        return failure;
      }
      return true;
    };
    var fileOtherwiseCodePoints = /* @__PURE__ */ new Set([47, 92, 63, 35]);
    URLStateMachine.prototype["parse file"] = function parseFile(c) {
      this.url.scheme = "file";
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file slash";
      } else if (this.base !== null && this.base.scheme === "file") {
        if (isNaN(c)) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
        } else if (c === 63) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = "";
          this.state = "query";
        } else if (c === 35) {
          this.url.host = this.base.host;
          this.url.path = this.base.path.slice();
          this.url.query = this.base.query;
          this.url.fragment = "";
          this.state = "fragment";
        } else {
          if (this.input.length - this.pointer - 1 === 0 || !isWindowsDriveLetterCodePoints(c, this.input[this.pointer + 1]) || this.input.length - this.pointer - 1 >= 2 && !fileOtherwiseCodePoints.has(this.input[this.pointer + 2])) {
            this.url.host = this.base.host;
            this.url.path = this.base.path.slice();
            shortenPath(this.url);
          } else {
            this.parseError = true;
          }
          this.state = "path";
          --this.pointer;
        }
      } else {
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file slash"] = function parseFileSlash(c) {
      if (c === 47 || c === 92) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "file host";
      } else {
        if (this.base !== null && this.base.scheme === "file") {
          if (isNormalizedWindowsDriveLetterString(this.base.path[0])) {
            this.url.path.push(this.base.path[0]);
          } else {
            this.url.host = this.base.host;
          }
        }
        this.state = "path";
        --this.pointer;
      }
      return true;
    };
    URLStateMachine.prototype["parse file host"] = function parseFileHost(c, cStr) {
      if (isNaN(c) || c === 47 || c === 92 || c === 63 || c === 35) {
        --this.pointer;
        if (!this.stateOverride && isWindowsDriveLetterString(this.buffer)) {
          this.parseError = true;
          this.state = "path";
        } else if (this.buffer === "") {
          this.url.host = "";
          if (this.stateOverride) {
            return false;
          }
          this.state = "path start";
        } else {
          let host = parseHost(this.buffer, isSpecial(this.url));
          if (host === failure) {
            return failure;
          }
          if (host === "localhost") {
            host = "";
          }
          this.url.host = host;
          if (this.stateOverride) {
            return false;
          }
          this.buffer = "";
          this.state = "path start";
        }
      } else {
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse path start"] = function parsePathStart(c) {
      if (isSpecial(this.url)) {
        if (c === 92) {
          this.parseError = true;
        }
        this.state = "path";
        if (c !== 47 && c !== 92) {
          --this.pointer;
        }
      } else if (!this.stateOverride && c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (!this.stateOverride && c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else if (c !== void 0) {
        this.state = "path";
        if (c !== 47) {
          --this.pointer;
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse path"] = function parsePath(c) {
      if (isNaN(c) || c === 47 || isSpecial(this.url) && c === 92 || !this.stateOverride && (c === 63 || c === 35)) {
        if (isSpecial(this.url) && c === 92) {
          this.parseError = true;
        }
        if (isDoubleDot(this.buffer)) {
          shortenPath(this.url);
          if (c !== 47 && !(isSpecial(this.url) && c === 92)) {
            this.url.path.push("");
          }
        } else if (isSingleDot(this.buffer) && c !== 47 && !(isSpecial(this.url) && c === 92)) {
          this.url.path.push("");
        } else if (!isSingleDot(this.buffer)) {
          if (this.url.scheme === "file" && this.url.path.length === 0 && isWindowsDriveLetterString(this.buffer)) {
            if (this.url.host !== "" && this.url.host !== null) {
              this.parseError = true;
              this.url.host = "";
            }
            this.buffer = this.buffer[0] + ":";
          }
          this.url.path.push(this.buffer);
        }
        this.buffer = "";
        if (this.url.scheme === "file" && (c === void 0 || c === 63 || c === 35)) {
          while (this.url.path.length > 1 && this.url.path[0] === "") {
            this.parseError = true;
            this.url.path.shift();
          }
        }
        if (c === 63) {
          this.url.query = "";
          this.state = "query";
        }
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += percentEncodeChar(c, isPathPercentEncode);
      }
      return true;
    };
    URLStateMachine.prototype["parse cannot-be-a-base-URL path"] = function parseCannotBeABaseURLPath(c) {
      if (c === 63) {
        this.url.query = "";
        this.state = "query";
      } else if (c === 35) {
        this.url.fragment = "";
        this.state = "fragment";
      } else {
        if (!isNaN(c) && c !== 37) {
          this.parseError = true;
        }
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        if (!isNaN(c)) {
          this.url.path[0] = this.url.path[0] + percentEncodeChar(c, isC0ControlPercentEncode);
        }
      }
      return true;
    };
    URLStateMachine.prototype["parse query"] = function parseQuery(c, cStr) {
      if (isNaN(c) || !this.stateOverride && c === 35) {
        if (!isSpecial(this.url) || this.url.scheme === "ws" || this.url.scheme === "wss") {
          this.encodingOverride = "utf-8";
        }
        const buffer = new Buffer(this.buffer);
        for (let i = 0; i < buffer.length; ++i) {
          if (buffer[i] < 33 || buffer[i] > 126 || buffer[i] === 34 || buffer[i] === 35 || buffer[i] === 60 || buffer[i] === 62) {
            this.url.query += percentEncode(buffer[i]);
          } else {
            this.url.query += String.fromCodePoint(buffer[i]);
          }
        }
        this.buffer = "";
        if (c === 35) {
          this.url.fragment = "";
          this.state = "fragment";
        }
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.buffer += cStr;
      }
      return true;
    };
    URLStateMachine.prototype["parse fragment"] = function parseFragment(c) {
      if (isNaN(c)) {
      } else if (c === 0) {
        this.parseError = true;
      } else {
        if (c === 37 && (!isASCIIHex(this.input[this.pointer + 1]) || !isASCIIHex(this.input[this.pointer + 2]))) {
          this.parseError = true;
        }
        this.url.fragment += percentEncodeChar(c, isC0ControlPercentEncode);
      }
      return true;
    };
    function serializeURL(url, excludeFragment) {
      let output = url.scheme + ":";
      if (url.host !== null) {
        output += "//";
        if (url.username !== "" || url.password !== "") {
          output += url.username;
          if (url.password !== "") {
            output += ":" + url.password;
          }
          output += "@";
        }
        output += serializeHost(url.host);
        if (url.port !== null) {
          output += ":" + url.port;
        }
      } else if (url.host === null && url.scheme === "file") {
        output += "//";
      }
      if (url.cannotBeABaseURL) {
        output += url.path[0];
      } else {
        for (const string of url.path) {
          output += "/" + string;
        }
      }
      if (url.query !== null) {
        output += "?" + url.query;
      }
      if (!excludeFragment && url.fragment !== null) {
        output += "#" + url.fragment;
      }
      return output;
    }
    function serializeOrigin(tuple) {
      let result = tuple.scheme + "://";
      result += serializeHost(tuple.host);
      if (tuple.port !== null) {
        result += ":" + tuple.port;
      }
      return result;
    }
    module2.exports.serializeURL = serializeURL;
    module2.exports.serializeURLOrigin = function(url) {
      switch (url.scheme) {
        case "blob":
          try {
            return module2.exports.serializeURLOrigin(module2.exports.parseURL(url.path[0]));
          } catch (e) {
            return "null";
          }
        case "ftp":
        case "gopher":
        case "http":
        case "https":
        case "ws":
        case "wss":
          return serializeOrigin({
            scheme: url.scheme,
            host: url.host,
            port: url.port
          });
        case "file":
          return "file://";
        default:
          return "null";
      }
    };
    module2.exports.basicURLParse = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      const usm = new URLStateMachine(input, options.baseURL, options.encodingOverride, options.url, options.stateOverride);
      if (usm.failure) {
        return "failure";
      }
      return usm.url;
    };
    module2.exports.setTheUsername = function(url, username) {
      url.username = "";
      const decoded = punycode.ucs2.decode(username);
      for (let i = 0; i < decoded.length; ++i) {
        url.username += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module2.exports.setThePassword = function(url, password) {
      url.password = "";
      const decoded = punycode.ucs2.decode(password);
      for (let i = 0; i < decoded.length; ++i) {
        url.password += percentEncodeChar(decoded[i], isUserinfoPercentEncode);
      }
    };
    module2.exports.serializeHost = serializeHost;
    module2.exports.cannotHaveAUsernamePasswordPort = cannotHaveAUsernamePasswordPort;
    module2.exports.serializeInteger = function(integer) {
      return String(integer);
    };
    module2.exports.parseURL = function(input, options) {
      if (options === void 0) {
        options = {};
      }
      return module2.exports.basicURLParse(input, { baseURL: options.baseURL, encodingOverride: options.encodingOverride });
    };
  }
});

// node_modules/whatwg-url/lib/URL-impl.js
var require_URL_impl = __commonJS({
  "node_modules/whatwg-url/lib/URL-impl.js"(exports) {
    "use strict";
    var usm = require_url_state_machine();
    exports.implementation = class URLImpl {
      constructor(constructorArgs) {
        const url = constructorArgs[0];
        const base = constructorArgs[1];
        let parsedBase = null;
        if (base !== void 0) {
          parsedBase = usm.basicURLParse(base);
          if (parsedBase === "failure") {
            throw new TypeError("Invalid base URL");
          }
        }
        const parsedURL = usm.basicURLParse(url, { baseURL: parsedBase });
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get href() {
        return usm.serializeURL(this._url);
      }
      set href(v) {
        const parsedURL = usm.basicURLParse(v);
        if (parsedURL === "failure") {
          throw new TypeError("Invalid URL");
        }
        this._url = parsedURL;
      }
      get origin() {
        return usm.serializeURLOrigin(this._url);
      }
      get protocol() {
        return this._url.scheme + ":";
      }
      set protocol(v) {
        usm.basicURLParse(v + ":", { url: this._url, stateOverride: "scheme start" });
      }
      get username() {
        return this._url.username;
      }
      set username(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setTheUsername(this._url, v);
      }
      get password() {
        return this._url.password;
      }
      set password(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        usm.setThePassword(this._url, v);
      }
      get host() {
        const url = this._url;
        if (url.host === null) {
          return "";
        }
        if (url.port === null) {
          return usm.serializeHost(url.host);
        }
        return usm.serializeHost(url.host) + ":" + usm.serializeInteger(url.port);
      }
      set host(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "host" });
      }
      get hostname() {
        if (this._url.host === null) {
          return "";
        }
        return usm.serializeHost(this._url.host);
      }
      set hostname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        usm.basicURLParse(v, { url: this._url, stateOverride: "hostname" });
      }
      get port() {
        if (this._url.port === null) {
          return "";
        }
        return usm.serializeInteger(this._url.port);
      }
      set port(v) {
        if (usm.cannotHaveAUsernamePasswordPort(this._url)) {
          return;
        }
        if (v === "") {
          this._url.port = null;
        } else {
          usm.basicURLParse(v, { url: this._url, stateOverride: "port" });
        }
      }
      get pathname() {
        if (this._url.cannotBeABaseURL) {
          return this._url.path[0];
        }
        if (this._url.path.length === 0) {
          return "";
        }
        return "/" + this._url.path.join("/");
      }
      set pathname(v) {
        if (this._url.cannotBeABaseURL) {
          return;
        }
        this._url.path = [];
        usm.basicURLParse(v, { url: this._url, stateOverride: "path start" });
      }
      get search() {
        if (this._url.query === null || this._url.query === "") {
          return "";
        }
        return "?" + this._url.query;
      }
      set search(v) {
        const url = this._url;
        if (v === "") {
          url.query = null;
          return;
        }
        const input = v[0] === "?" ? v.substring(1) : v;
        url.query = "";
        usm.basicURLParse(input, { url, stateOverride: "query" });
      }
      get hash() {
        if (this._url.fragment === null || this._url.fragment === "") {
          return "";
        }
        return "#" + this._url.fragment;
      }
      set hash(v) {
        if (v === "") {
          this._url.fragment = null;
          return;
        }
        const input = v[0] === "#" ? v.substring(1) : v;
        this._url.fragment = "";
        usm.basicURLParse(input, { url: this._url, stateOverride: "fragment" });
      }
      toJSON() {
        return this.href;
      }
    };
  }
});

// node_modules/whatwg-url/lib/URL.js
var require_URL = __commonJS({
  "node_modules/whatwg-url/lib/URL.js"(exports, module2) {
    "use strict";
    var conversions = require_lib();
    var utils = require_utils();
    var Impl = require_URL_impl();
    var impl = utils.implSymbol;
    function URL(url) {
      if (!this || this[impl] || !(this instanceof URL)) {
        throw new TypeError("Failed to construct 'URL': Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
      }
      if (arguments.length < 1) {
        throw new TypeError("Failed to construct 'URL': 1 argument required, but only " + arguments.length + " present.");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 2; ++i) {
        args[i] = arguments[i];
      }
      args[0] = conversions["USVString"](args[0]);
      if (args[1] !== void 0) {
        args[1] = conversions["USVString"](args[1]);
      }
      module2.exports.setup(this, args);
    }
    URL.prototype.toJSON = function toJSON() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      const args = [];
      for (let i = 0; i < arguments.length && i < 0; ++i) {
        args[i] = arguments[i];
      }
      return this[impl].toJSON.apply(this[impl], args);
    };
    Object.defineProperty(URL.prototype, "href", {
      get() {
        return this[impl].href;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].href = V;
      },
      enumerable: true,
      configurable: true
    });
    URL.prototype.toString = function() {
      if (!this || !module2.exports.is(this)) {
        throw new TypeError("Illegal invocation");
      }
      return this.href;
    };
    Object.defineProperty(URL.prototype, "origin", {
      get() {
        return this[impl].origin;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "protocol", {
      get() {
        return this[impl].protocol;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].protocol = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "username", {
      get() {
        return this[impl].username;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].username = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "password", {
      get() {
        return this[impl].password;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].password = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "host", {
      get() {
        return this[impl].host;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].host = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hostname", {
      get() {
        return this[impl].hostname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hostname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "port", {
      get() {
        return this[impl].port;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].port = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "pathname", {
      get() {
        return this[impl].pathname;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].pathname = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "search", {
      get() {
        return this[impl].search;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].search = V;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(URL.prototype, "hash", {
      get() {
        return this[impl].hash;
      },
      set(V) {
        V = conversions["USVString"](V);
        this[impl].hash = V;
      },
      enumerable: true,
      configurable: true
    });
    module2.exports = {
      is(obj) {
        return !!obj && obj[impl] instanceof Impl.implementation;
      },
      create(constructorArgs, privateData) {
        let obj = Object.create(URL.prototype);
        this.setup(obj, constructorArgs, privateData);
        return obj;
      },
      setup(obj, constructorArgs, privateData) {
        if (!privateData)
          privateData = {};
        privateData.wrapper = obj;
        obj[impl] = new Impl.implementation(constructorArgs, privateData);
        obj[impl][utils.wrapperSymbol] = obj;
      },
      interface: URL,
      expose: {
        Window: { URL },
        Worker: { URL }
      }
    };
  }
});

// node_modules/whatwg-url/lib/public-api.js
var require_public_api = __commonJS({
  "node_modules/whatwg-url/lib/public-api.js"(exports) {
    "use strict";
    exports.URL = require_URL().interface;
    exports.serializeURL = require_url_state_machine().serializeURL;
    exports.serializeURLOrigin = require_url_state_machine().serializeURLOrigin;
    exports.basicURLParse = require_url_state_machine().basicURLParse;
    exports.setTheUsername = require_url_state_machine().setTheUsername;
    exports.setThePassword = require_url_state_machine().setThePassword;
    exports.serializeHost = require_url_state_machine().serializeHost;
    exports.serializeInteger = require_url_state_machine().serializeInteger;
    exports.parseURL = require_url_state_machine().parseURL;
  }
});

// node_modules/node-fetch/lib/index.js
var require_lib2 = __commonJS({
  "node_modules/node-fetch/lib/index.js"(exports, module2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function _interopDefault(ex) {
      return ex && typeof ex === "object" && "default" in ex ? ex["default"] : ex;
    }
    var Stream = _interopDefault(require("stream"));
    var http = _interopDefault(require("http"));
    var Url = _interopDefault(require("url"));
    var whatwgUrl = _interopDefault(require_public_api());
    var https = _interopDefault(require("https"));
    var zlib = _interopDefault(require("zlib"));
    var Readable = Stream.Readable;
    var BUFFER = Symbol("buffer");
    var TYPE = Symbol("type");
    var Blob = class {
      constructor() {
        this[TYPE] = "";
        const blobParts = arguments[0];
        const options = arguments[1];
        const buffers = [];
        let size5 = 0;
        if (blobParts) {
          const a = blobParts;
          const length4 = Number(a.length);
          for (let i = 0; i < length4; i++) {
            const element = a[i];
            let buffer;
            if (element instanceof Buffer) {
              buffer = element;
            } else if (ArrayBuffer.isView(element)) {
              buffer = Buffer.from(element.buffer, element.byteOffset, element.byteLength);
            } else if (element instanceof ArrayBuffer) {
              buffer = Buffer.from(element);
            } else if (element instanceof Blob) {
              buffer = element[BUFFER];
            } else {
              buffer = Buffer.from(typeof element === "string" ? element : String(element));
            }
            size5 += buffer.length;
            buffers.push(buffer);
          }
        }
        this[BUFFER] = Buffer.concat(buffers);
        let type = options && options.type !== void 0 && String(options.type).toLowerCase();
        if (type && !/[^\u0020-\u007E]/.test(type)) {
          this[TYPE] = type;
        }
      }
      get size() {
        return this[BUFFER].length;
      }
      get type() {
        return this[TYPE];
      }
      text() {
        return Promise.resolve(this[BUFFER].toString());
      }
      arrayBuffer() {
        const buf = this[BUFFER];
        const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        return Promise.resolve(ab);
      }
      stream() {
        const readable = new Readable();
        readable._read = function() {
        };
        readable.push(this[BUFFER]);
        readable.push(null);
        return readable;
      }
      toString() {
        return "[object Blob]";
      }
      slice() {
        const size5 = this.size;
        const start = arguments[0];
        const end2 = arguments[1];
        let relativeStart, relativeEnd;
        if (start === void 0) {
          relativeStart = 0;
        } else if (start < 0) {
          relativeStart = Math.max(size5 + start, 0);
        } else {
          relativeStart = Math.min(start, size5);
        }
        if (end2 === void 0) {
          relativeEnd = size5;
        } else if (end2 < 0) {
          relativeEnd = Math.max(size5 + end2, 0);
        } else {
          relativeEnd = Math.min(end2, size5);
        }
        const span3 = Math.max(relativeEnd - relativeStart, 0);
        const buffer = this[BUFFER];
        const slicedBuffer = buffer.slice(relativeStart, relativeStart + span3);
        const blob = new Blob([], { type: arguments[2] });
        blob[BUFFER] = slicedBuffer;
        return blob;
      }
    };
    Object.defineProperties(Blob.prototype, {
      size: { enumerable: true },
      type: { enumerable: true },
      slice: { enumerable: true }
    });
    Object.defineProperty(Blob.prototype, Symbol.toStringTag, {
      value: "Blob",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function FetchError(message2, type, systemError) {
      Error.call(this, message2);
      this.message = message2;
      this.type = type;
      if (systemError) {
        this.code = this.errno = systemError.code;
      }
      Error.captureStackTrace(this, this.constructor);
    }
    FetchError.prototype = Object.create(Error.prototype);
    FetchError.prototype.constructor = FetchError;
    FetchError.prototype.name = "FetchError";
    var convert;
    try {
      convert = require("encoding").convert;
    } catch (e) {
    }
    var INTERNALS = Symbol("Body internals");
    var PassThrough = Stream.PassThrough;
    function Body(body) {
      var _this = this;
      var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, _ref$size = _ref.size;
      let size5 = _ref$size === void 0 ? 0 : _ref$size;
      var _ref$timeout = _ref.timeout;
      let timeout = _ref$timeout === void 0 ? 0 : _ref$timeout;
      if (body == null) {
        body = null;
      } else if (isURLSearchParams(body)) {
        body = Buffer.from(body.toString());
      } else if (isBlob(body))
        ;
      else if (Buffer.isBuffer(body))
        ;
      else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        body = Buffer.from(body);
      } else if (ArrayBuffer.isView(body)) {
        body = Buffer.from(body.buffer, body.byteOffset, body.byteLength);
      } else if (body instanceof Stream)
        ;
      else {
        body = Buffer.from(String(body));
      }
      this[INTERNALS] = {
        body,
        disturbed: false,
        error: null
      };
      this.size = size5;
      this.timeout = timeout;
      if (body instanceof Stream) {
        body.on("error", function(err) {
          const error2 = err.name === "AbortError" ? err : new FetchError(`Invalid response body while trying to fetch ${_this.url}: ${err.message}`, "system", err);
          _this[INTERNALS].error = error2;
        });
      }
    }
    Body.prototype = {
      get body() {
        return this[INTERNALS].body;
      },
      get bodyUsed() {
        return this[INTERNALS].disturbed;
      },
      arrayBuffer() {
        return consumeBody.call(this).then(function(buf) {
          return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
        });
      },
      blob() {
        let ct = this.headers && this.headers.get("content-type") || "";
        return consumeBody.call(this).then(function(buf) {
          return Object.assign(new Blob([], {
            type: ct.toLowerCase()
          }), {
            [BUFFER]: buf
          });
        });
      },
      json() {
        var _this2 = this;
        return consumeBody.call(this).then(function(buffer) {
          try {
            return JSON.parse(buffer.toString());
          } catch (err) {
            return Body.Promise.reject(new FetchError(`invalid json response body at ${_this2.url} reason: ${err.message}`, "invalid-json"));
          }
        });
      },
      text() {
        return consumeBody.call(this).then(function(buffer) {
          return buffer.toString();
        });
      },
      buffer() {
        return consumeBody.call(this);
      },
      textConverted() {
        var _this3 = this;
        return consumeBody.call(this).then(function(buffer) {
          return convertBody(buffer, _this3.headers);
        });
      }
    };
    Object.defineProperties(Body.prototype, {
      body: { enumerable: true },
      bodyUsed: { enumerable: true },
      arrayBuffer: { enumerable: true },
      blob: { enumerable: true },
      json: { enumerable: true },
      text: { enumerable: true }
    });
    Body.mixIn = function(proto) {
      for (const name2 of Object.getOwnPropertyNames(Body.prototype)) {
        if (!(name2 in proto)) {
          const desc = Object.getOwnPropertyDescriptor(Body.prototype, name2);
          Object.defineProperty(proto, name2, desc);
        }
      }
    };
    function consumeBody() {
      var _this4 = this;
      if (this[INTERNALS].disturbed) {
        return Body.Promise.reject(new TypeError(`body used already for: ${this.url}`));
      }
      this[INTERNALS].disturbed = true;
      if (this[INTERNALS].error) {
        return Body.Promise.reject(this[INTERNALS].error);
      }
      let body = this.body;
      if (body === null) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      if (isBlob(body)) {
        body = body.stream();
      }
      if (Buffer.isBuffer(body)) {
        return Body.Promise.resolve(body);
      }
      if (!(body instanceof Stream)) {
        return Body.Promise.resolve(Buffer.alloc(0));
      }
      let accum = [];
      let accumBytes = 0;
      let abort = false;
      return new Body.Promise(function(resolve2, reject) {
        let resTimeout;
        if (_this4.timeout) {
          resTimeout = setTimeout(function() {
            abort = true;
            reject(new FetchError(`Response timeout while trying to fetch ${_this4.url} (over ${_this4.timeout}ms)`, "body-timeout"));
          }, _this4.timeout);
        }
        body.on("error", function(err) {
          if (err.name === "AbortError") {
            abort = true;
            reject(err);
          } else {
            reject(new FetchError(`Invalid response body while trying to fetch ${_this4.url}: ${err.message}`, "system", err));
          }
        });
        body.on("data", function(chunk) {
          if (abort || chunk === null) {
            return;
          }
          if (_this4.size && accumBytes + chunk.length > _this4.size) {
            abort = true;
            reject(new FetchError(`content size at ${_this4.url} over limit: ${_this4.size}`, "max-size"));
            return;
          }
          accumBytes += chunk.length;
          accum.push(chunk);
        });
        body.on("end", function() {
          if (abort) {
            return;
          }
          clearTimeout(resTimeout);
          try {
            resolve2(Buffer.concat(accum, accumBytes));
          } catch (err) {
            reject(new FetchError(`Could not create Buffer from response body for ${_this4.url}: ${err.message}`, "system", err));
          }
        });
      });
    }
    function convertBody(buffer, headers) {
      if (typeof convert !== "function") {
        throw new Error("The package `encoding` must be installed to use the textConverted() function");
      }
      const ct = headers.get("content-type");
      let charset = "utf-8";
      let res, str;
      if (ct) {
        res = /charset=([^;]*)/i.exec(ct);
      }
      str = buffer.slice(0, 1024).toString();
      if (!res && str) {
        res = /<meta.+?charset=(['"])(.+?)\1/i.exec(str);
      }
      if (!res && str) {
        res = /<meta[\s]+?http-equiv=(['"])content-type\1[\s]+?content=(['"])(.+?)\2/i.exec(str);
        if (!res) {
          res = /<meta[\s]+?content=(['"])(.+?)\1[\s]+?http-equiv=(['"])content-type\3/i.exec(str);
          if (res) {
            res.pop();
          }
        }
        if (res) {
          res = /charset=(.*)/i.exec(res.pop());
        }
      }
      if (!res && str) {
        res = /<\?xml.+?encoding=(['"])(.+?)\1/i.exec(str);
      }
      if (res) {
        charset = res.pop();
        if (charset === "gb2312" || charset === "gbk") {
          charset = "gb18030";
        }
      }
      return convert(buffer, "UTF-8", charset).toString();
    }
    function isURLSearchParams(obj) {
      if (typeof obj !== "object" || typeof obj.append !== "function" || typeof obj.delete !== "function" || typeof obj.get !== "function" || typeof obj.getAll !== "function" || typeof obj.has !== "function" || typeof obj.set !== "function") {
        return false;
      }
      return obj.constructor.name === "URLSearchParams" || Object.prototype.toString.call(obj) === "[object URLSearchParams]" || typeof obj.sort === "function";
    }
    function isBlob(obj) {
      return typeof obj === "object" && typeof obj.arrayBuffer === "function" && typeof obj.type === "string" && typeof obj.stream === "function" && typeof obj.constructor === "function" && typeof obj.constructor.name === "string" && /^(Blob|File)$/.test(obj.constructor.name) && /^(Blob|File)$/.test(obj[Symbol.toStringTag]);
    }
    function clone(instance) {
      let p1, p2;
      let body = instance.body;
      if (instance.bodyUsed) {
        throw new Error("cannot clone body after it is used");
      }
      if (body instanceof Stream && typeof body.getBoundary !== "function") {
        p1 = new PassThrough();
        p2 = new PassThrough();
        body.pipe(p1);
        body.pipe(p2);
        instance[INTERNALS].body = p1;
        body = p2;
      }
      return body;
    }
    function extractContentType(body) {
      if (body === null) {
        return null;
      } else if (typeof body === "string") {
        return "text/plain;charset=UTF-8";
      } else if (isURLSearchParams(body)) {
        return "application/x-www-form-urlencoded;charset=UTF-8";
      } else if (isBlob(body)) {
        return body.type || null;
      } else if (Buffer.isBuffer(body)) {
        return null;
      } else if (Object.prototype.toString.call(body) === "[object ArrayBuffer]") {
        return null;
      } else if (ArrayBuffer.isView(body)) {
        return null;
      } else if (typeof body.getBoundary === "function") {
        return `multipart/form-data;boundary=${body.getBoundary()}`;
      } else if (body instanceof Stream) {
        return null;
      } else {
        return "text/plain;charset=UTF-8";
      }
    }
    function getTotalBytes(instance) {
      const body = instance.body;
      if (body === null) {
        return 0;
      } else if (isBlob(body)) {
        return body.size;
      } else if (Buffer.isBuffer(body)) {
        return body.length;
      } else if (body && typeof body.getLengthSync === "function") {
        if (body._lengthRetrievers && body._lengthRetrievers.length == 0 || body.hasKnownLength && body.hasKnownLength()) {
          return body.getLengthSync();
        }
        return null;
      } else {
        return null;
      }
    }
    function writeToStream(dest, instance) {
      const body = instance.body;
      if (body === null) {
        dest.end();
      } else if (isBlob(body)) {
        body.stream().pipe(dest);
      } else if (Buffer.isBuffer(body)) {
        dest.write(body);
        dest.end();
      } else {
        body.pipe(dest);
      }
    }
    Body.Promise = global.Promise;
    var invalidTokenRegex = /[^\^_`a-zA-Z\-0-9!#$%&'*+.|~]/;
    var invalidHeaderCharRegex = /[^\t\x20-\x7e\x80-\xff]/;
    function validateName(name2) {
      name2 = `${name2}`;
      if (invalidTokenRegex.test(name2) || name2 === "") {
        throw new TypeError(`${name2} is not a legal HTTP header name`);
      }
    }
    function validateValue(value) {
      value = `${value}`;
      if (invalidHeaderCharRegex.test(value)) {
        throw new TypeError(`${value} is not a legal HTTP header value`);
      }
    }
    function find3(map23, name2) {
      name2 = name2.toLowerCase();
      for (const key in map23) {
        if (key.toLowerCase() === name2) {
          return key;
        }
      }
      return void 0;
    }
    var MAP = Symbol("map");
    var Headers = class {
      constructor() {
        let init3 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : void 0;
        this[MAP] = /* @__PURE__ */ Object.create(null);
        if (init3 instanceof Headers) {
          const rawHeaders = init3.raw();
          const headerNames = Object.keys(rawHeaders);
          for (const headerName of headerNames) {
            for (const value of rawHeaders[headerName]) {
              this.append(headerName, value);
            }
          }
          return;
        }
        if (init3 == null)
          ;
        else if (typeof init3 === "object") {
          const method = init3[Symbol.iterator];
          if (method != null) {
            if (typeof method !== "function") {
              throw new TypeError("Header pairs must be iterable");
            }
            const pairs = [];
            for (const pair of init3) {
              if (typeof pair !== "object" || typeof pair[Symbol.iterator] !== "function") {
                throw new TypeError("Each header pair must be iterable");
              }
              pairs.push(Array.from(pair));
            }
            for (const pair of pairs) {
              if (pair.length !== 2) {
                throw new TypeError("Each header pair must be a name/value tuple");
              }
              this.append(pair[0], pair[1]);
            }
          } else {
            for (const key of Object.keys(init3)) {
              const value = init3[key];
              this.append(key, value);
            }
          }
        } else {
          throw new TypeError("Provided initializer must be an object");
        }
      }
      get(name2) {
        name2 = `${name2}`;
        validateName(name2);
        const key = find3(this[MAP], name2);
        if (key === void 0) {
          return null;
        }
        return this[MAP][key].join(", ");
      }
      forEach(callback) {
        let thisArg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : void 0;
        let pairs = getHeaders(this);
        let i = 0;
        while (i < pairs.length) {
          var _pairs$i = pairs[i];
          const name2 = _pairs$i[0], value = _pairs$i[1];
          callback.call(thisArg, value, name2, this);
          pairs = getHeaders(this);
          i++;
        }
      }
      set(name2, value) {
        name2 = `${name2}`;
        value = `${value}`;
        validateName(name2);
        validateValue(value);
        const key = find3(this[MAP], name2);
        this[MAP][key !== void 0 ? key : name2] = [value];
      }
      append(name2, value) {
        name2 = `${name2}`;
        value = `${value}`;
        validateName(name2);
        validateValue(value);
        const key = find3(this[MAP], name2);
        if (key !== void 0) {
          this[MAP][key].push(value);
        } else {
          this[MAP][name2] = [value];
        }
      }
      has(name2) {
        name2 = `${name2}`;
        validateName(name2);
        return find3(this[MAP], name2) !== void 0;
      }
      delete(name2) {
        name2 = `${name2}`;
        validateName(name2);
        const key = find3(this[MAP], name2);
        if (key !== void 0) {
          delete this[MAP][key];
        }
      }
      raw() {
        return this[MAP];
      }
      keys() {
        return createHeadersIterator(this, "key");
      }
      values() {
        return createHeadersIterator(this, "value");
      }
      [Symbol.iterator]() {
        return createHeadersIterator(this, "key+value");
      }
    };
    Headers.prototype.entries = Headers.prototype[Symbol.iterator];
    Object.defineProperty(Headers.prototype, Symbol.toStringTag, {
      value: "Headers",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Headers.prototype, {
      get: { enumerable: true },
      forEach: { enumerable: true },
      set: { enumerable: true },
      append: { enumerable: true },
      has: { enumerable: true },
      delete: { enumerable: true },
      keys: { enumerable: true },
      values: { enumerable: true },
      entries: { enumerable: true }
    });
    function getHeaders(headers) {
      let kind = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "key+value";
      const keys2 = Object.keys(headers[MAP]).sort();
      return keys2.map(kind === "key" ? function(k) {
        return k.toLowerCase();
      } : kind === "value" ? function(k) {
        return headers[MAP][k].join(", ");
      } : function(k) {
        return [k.toLowerCase(), headers[MAP][k].join(", ")];
      });
    }
    var INTERNAL = Symbol("internal");
    function createHeadersIterator(target, kind) {
      const iterator2 = Object.create(HeadersIteratorPrototype);
      iterator2[INTERNAL] = {
        target,
        kind,
        index: 0
      };
      return iterator2;
    }
    var HeadersIteratorPrototype = Object.setPrototypeOf({
      next() {
        if (!this || Object.getPrototypeOf(this) !== HeadersIteratorPrototype) {
          throw new TypeError("Value of `this` is not a HeadersIterator");
        }
        var _INTERNAL = this[INTERNAL];
        const target = _INTERNAL.target, kind = _INTERNAL.kind, index3 = _INTERNAL.index;
        const values2 = getHeaders(target, kind);
        const len = values2.length;
        if (index3 >= len) {
          return {
            value: void 0,
            done: true
          };
        }
        this[INTERNAL].index = index3 + 1;
        return {
          value: values2[index3],
          done: false
        };
      }
    }, Object.getPrototypeOf(Object.getPrototypeOf([][Symbol.iterator]())));
    Object.defineProperty(HeadersIteratorPrototype, Symbol.toStringTag, {
      value: "HeadersIterator",
      writable: false,
      enumerable: false,
      configurable: true
    });
    function exportNodeCompatibleHeaders(headers) {
      const obj = Object.assign({ __proto__: null }, headers[MAP]);
      const hostHeaderKey = find3(headers[MAP], "Host");
      if (hostHeaderKey !== void 0) {
        obj[hostHeaderKey] = obj[hostHeaderKey][0];
      }
      return obj;
    }
    function createHeadersLenient(obj) {
      const headers = new Headers();
      for (const name2 of Object.keys(obj)) {
        if (invalidTokenRegex.test(name2)) {
          continue;
        }
        if (Array.isArray(obj[name2])) {
          for (const val of obj[name2]) {
            if (invalidHeaderCharRegex.test(val)) {
              continue;
            }
            if (headers[MAP][name2] === void 0) {
              headers[MAP][name2] = [val];
            } else {
              headers[MAP][name2].push(val);
            }
          }
        } else if (!invalidHeaderCharRegex.test(obj[name2])) {
          headers[MAP][name2] = [obj[name2]];
        }
      }
      return headers;
    }
    var INTERNALS$1 = Symbol("Response internals");
    var STATUS_CODES = http.STATUS_CODES;
    var Response = class {
      constructor() {
        let body = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : null;
        let opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        Body.call(this, body, opts);
        const status = opts.status || 200;
        const headers = new Headers(opts.headers);
        if (body != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(body);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        this[INTERNALS$1] = {
          url: opts.url,
          status,
          statusText: opts.statusText || STATUS_CODES[status],
          headers,
          counter: opts.counter
        };
      }
      get url() {
        return this[INTERNALS$1].url || "";
      }
      get status() {
        return this[INTERNALS$1].status;
      }
      get ok() {
        return this[INTERNALS$1].status >= 200 && this[INTERNALS$1].status < 300;
      }
      get redirected() {
        return this[INTERNALS$1].counter > 0;
      }
      get statusText() {
        return this[INTERNALS$1].statusText;
      }
      get headers() {
        return this[INTERNALS$1].headers;
      }
      clone() {
        return new Response(clone(this), {
          url: this.url,
          status: this.status,
          statusText: this.statusText,
          headers: this.headers,
          ok: this.ok,
          redirected: this.redirected
        });
      }
    };
    Body.mixIn(Response.prototype);
    Object.defineProperties(Response.prototype, {
      url: { enumerable: true },
      status: { enumerable: true },
      ok: { enumerable: true },
      redirected: { enumerable: true },
      statusText: { enumerable: true },
      headers: { enumerable: true },
      clone: { enumerable: true }
    });
    Object.defineProperty(Response.prototype, Symbol.toStringTag, {
      value: "Response",
      writable: false,
      enumerable: false,
      configurable: true
    });
    var INTERNALS$2 = Symbol("Request internals");
    var URL = Url.URL || whatwgUrl.URL;
    var parse_url = Url.parse;
    var format_url = Url.format;
    function parseURL(urlStr) {
      if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.exec(urlStr)) {
        urlStr = new URL(urlStr).toString();
      }
      return parse_url(urlStr);
    }
    var streamDestructionSupported = "destroy" in Stream.Readable.prototype;
    function isRequest(input) {
      return typeof input === "object" && typeof input[INTERNALS$2] === "object";
    }
    function isAbortSignal(signal) {
      const proto = signal && typeof signal === "object" && Object.getPrototypeOf(signal);
      return !!(proto && proto.constructor.name === "AbortSignal");
    }
    var Request = class {
      constructor(input) {
        let init3 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        let parsedURL;
        if (!isRequest(input)) {
          if (input && input.href) {
            parsedURL = parseURL(input.href);
          } else {
            parsedURL = parseURL(`${input}`);
          }
          input = {};
        } else {
          parsedURL = parseURL(input.url);
        }
        let method = init3.method || input.method || "GET";
        method = method.toUpperCase();
        if ((init3.body != null || isRequest(input) && input.body !== null) && (method === "GET" || method === "HEAD")) {
          throw new TypeError("Request with GET/HEAD method cannot have body");
        }
        let inputBody = init3.body != null ? init3.body : isRequest(input) && input.body !== null ? clone(input) : null;
        Body.call(this, inputBody, {
          timeout: init3.timeout || input.timeout || 0,
          size: init3.size || input.size || 0
        });
        const headers = new Headers(init3.headers || input.headers || {});
        if (inputBody != null && !headers.has("Content-Type")) {
          const contentType = extractContentType(inputBody);
          if (contentType) {
            headers.append("Content-Type", contentType);
          }
        }
        let signal = isRequest(input) ? input.signal : null;
        if ("signal" in init3)
          signal = init3.signal;
        if (signal != null && !isAbortSignal(signal)) {
          throw new TypeError("Expected signal to be an instanceof AbortSignal");
        }
        this[INTERNALS$2] = {
          method,
          redirect: init3.redirect || input.redirect || "follow",
          headers,
          parsedURL,
          signal
        };
        this.follow = init3.follow !== void 0 ? init3.follow : input.follow !== void 0 ? input.follow : 20;
        this.compress = init3.compress !== void 0 ? init3.compress : input.compress !== void 0 ? input.compress : true;
        this.counter = init3.counter || input.counter || 0;
        this.agent = init3.agent || input.agent;
      }
      get method() {
        return this[INTERNALS$2].method;
      }
      get url() {
        return format_url(this[INTERNALS$2].parsedURL);
      }
      get headers() {
        return this[INTERNALS$2].headers;
      }
      get redirect() {
        return this[INTERNALS$2].redirect;
      }
      get signal() {
        return this[INTERNALS$2].signal;
      }
      clone() {
        return new Request(this);
      }
    };
    Body.mixIn(Request.prototype);
    Object.defineProperty(Request.prototype, Symbol.toStringTag, {
      value: "Request",
      writable: false,
      enumerable: false,
      configurable: true
    });
    Object.defineProperties(Request.prototype, {
      method: { enumerable: true },
      url: { enumerable: true },
      headers: { enumerable: true },
      redirect: { enumerable: true },
      clone: { enumerable: true },
      signal: { enumerable: true }
    });
    function getNodeRequestOptions(request) {
      const parsedURL = request[INTERNALS$2].parsedURL;
      const headers = new Headers(request[INTERNALS$2].headers);
      if (!headers.has("Accept")) {
        headers.set("Accept", "*/*");
      }
      if (!parsedURL.protocol || !parsedURL.hostname) {
        throw new TypeError("Only absolute URLs are supported");
      }
      if (!/^https?:$/.test(parsedURL.protocol)) {
        throw new TypeError("Only HTTP(S) protocols are supported");
      }
      if (request.signal && request.body instanceof Stream.Readable && !streamDestructionSupported) {
        throw new Error("Cancellation of streamed requests with AbortSignal is not supported in node < 8");
      }
      let contentLengthValue = null;
      if (request.body == null && /^(POST|PUT)$/i.test(request.method)) {
        contentLengthValue = "0";
      }
      if (request.body != null) {
        const totalBytes = getTotalBytes(request);
        if (typeof totalBytes === "number") {
          contentLengthValue = String(totalBytes);
        }
      }
      if (contentLengthValue) {
        headers.set("Content-Length", contentLengthValue);
      }
      if (!headers.has("User-Agent")) {
        headers.set("User-Agent", "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)");
      }
      if (request.compress && !headers.has("Accept-Encoding")) {
        headers.set("Accept-Encoding", "gzip,deflate");
      }
      let agent = request.agent;
      if (typeof agent === "function") {
        agent = agent(parsedURL);
      }
      if (!headers.has("Connection") && !agent) {
        headers.set("Connection", "close");
      }
      return Object.assign({}, parsedURL, {
        method: request.method,
        headers: exportNodeCompatibleHeaders(headers),
        agent
      });
    }
    function AbortError(message2) {
      Error.call(this, message2);
      this.type = "aborted";
      this.message = message2;
      Error.captureStackTrace(this, this.constructor);
    }
    AbortError.prototype = Object.create(Error.prototype);
    AbortError.prototype.constructor = AbortError;
    AbortError.prototype.name = "AbortError";
    var URL$1 = Url.URL || whatwgUrl.URL;
    var PassThrough$1 = Stream.PassThrough;
    var isDomainOrSubdomain = function isDomainOrSubdomain2(destination, original) {
      const orig = new URL$1(original).hostname;
      const dest = new URL$1(destination).hostname;
      return orig === dest || orig[orig.length - dest.length - 1] === "." && orig.endsWith(dest);
    };
    function fetch2(url, opts) {
      if (!fetch2.Promise) {
        throw new Error("native promise missing, set fetch.Promise to your favorite alternative");
      }
      Body.Promise = fetch2.Promise;
      return new fetch2.Promise(function(resolve2, reject) {
        const request = new Request(url, opts);
        const options = getNodeRequestOptions(request);
        const send = (options.protocol === "https:" ? https : http).request;
        const signal = request.signal;
        let response = null;
        const abort = function abort2() {
          let error2 = new AbortError("The user aborted a request.");
          reject(error2);
          if (request.body && request.body instanceof Stream.Readable) {
            request.body.destroy(error2);
          }
          if (!response || !response.body)
            return;
          response.body.emit("error", error2);
        };
        if (signal && signal.aborted) {
          abort();
          return;
        }
        const abortAndFinalize = function abortAndFinalize2() {
          abort();
          finalize();
        };
        const req = send(options);
        let reqTimeout;
        if (signal) {
          signal.addEventListener("abort", abortAndFinalize);
        }
        function finalize() {
          req.abort();
          if (signal)
            signal.removeEventListener("abort", abortAndFinalize);
          clearTimeout(reqTimeout);
        }
        if (request.timeout) {
          req.once("socket", function(socket) {
            reqTimeout = setTimeout(function() {
              reject(new FetchError(`network timeout at: ${request.url}`, "request-timeout"));
              finalize();
            }, request.timeout);
          });
        }
        req.on("error", function(err) {
          reject(new FetchError(`request to ${request.url} failed, reason: ${err.message}`, "system", err));
          finalize();
        });
        req.on("response", function(res) {
          clearTimeout(reqTimeout);
          const headers = createHeadersLenient(res.headers);
          if (fetch2.isRedirect(res.statusCode)) {
            const location = headers.get("Location");
            let locationURL = null;
            try {
              locationURL = location === null ? null : new URL$1(location, request.url).toString();
            } catch (err) {
              if (request.redirect !== "manual") {
                reject(new FetchError(`uri requested responds with an invalid redirect URL: ${location}`, "invalid-redirect"));
                finalize();
                return;
              }
            }
            switch (request.redirect) {
              case "error":
                reject(new FetchError(`uri requested responds with a redirect, redirect mode is set to error: ${request.url}`, "no-redirect"));
                finalize();
                return;
              case "manual":
                if (locationURL !== null) {
                  try {
                    headers.set("Location", locationURL);
                  } catch (err) {
                    reject(err);
                  }
                }
                break;
              case "follow":
                if (locationURL === null) {
                  break;
                }
                if (request.counter >= request.follow) {
                  reject(new FetchError(`maximum redirect reached at: ${request.url}`, "max-redirect"));
                  finalize();
                  return;
                }
                const requestOpts = {
                  headers: new Headers(request.headers),
                  follow: request.follow,
                  counter: request.counter + 1,
                  agent: request.agent,
                  compress: request.compress,
                  method: request.method,
                  body: request.body,
                  signal: request.signal,
                  timeout: request.timeout,
                  size: request.size
                };
                if (!isDomainOrSubdomain(request.url, locationURL)) {
                  for (const name2 of ["authorization", "www-authenticate", "cookie", "cookie2"]) {
                    requestOpts.headers.delete(name2);
                  }
                }
                if (res.statusCode !== 303 && request.body && getTotalBytes(request) === null) {
                  reject(new FetchError("Cannot follow redirect with body being a readable stream", "unsupported-redirect"));
                  finalize();
                  return;
                }
                if (res.statusCode === 303 || (res.statusCode === 301 || res.statusCode === 302) && request.method === "POST") {
                  requestOpts.method = "GET";
                  requestOpts.body = void 0;
                  requestOpts.headers.delete("content-length");
                }
                resolve2(fetch2(new Request(locationURL, requestOpts)));
                finalize();
                return;
            }
          }
          res.once("end", function() {
            if (signal)
              signal.removeEventListener("abort", abortAndFinalize);
          });
          let body = res.pipe(new PassThrough$1());
          const response_options = {
            url: request.url,
            status: res.statusCode,
            statusText: res.statusMessage,
            headers,
            size: request.size,
            timeout: request.timeout,
            counter: request.counter
          };
          const codings = headers.get("Content-Encoding");
          if (!request.compress || request.method === "HEAD" || codings === null || res.statusCode === 204 || res.statusCode === 304) {
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          const zlibOptions = {
            flush: zlib.Z_SYNC_FLUSH,
            finishFlush: zlib.Z_SYNC_FLUSH
          };
          if (codings == "gzip" || codings == "x-gzip") {
            body = body.pipe(zlib.createGunzip(zlibOptions));
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          if (codings == "deflate" || codings == "x-deflate") {
            const raw = res.pipe(new PassThrough$1());
            raw.once("data", function(chunk) {
              if ((chunk[0] & 15) === 8) {
                body = body.pipe(zlib.createInflate());
              } else {
                body = body.pipe(zlib.createInflateRaw());
              }
              response = new Response(body, response_options);
              resolve2(response);
            });
            return;
          }
          if (codings == "br" && typeof zlib.createBrotliDecompress === "function") {
            body = body.pipe(zlib.createBrotliDecompress());
            response = new Response(body, response_options);
            resolve2(response);
            return;
          }
          response = new Response(body, response_options);
          resolve2(response);
        });
        writeToStream(req, request);
      });
    }
    fetch2.isRedirect = function(code) {
      return code === 301 || code === 302 || code === 303 || code === 307 || code === 308;
    };
    fetch2.Promise = global.Promise;
    module2.exports = exports = fetch2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = exports;
    exports.Headers = Headers;
    exports.Request = Request;
    exports.Response = Response;
    exports.FetchError = FetchError;
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
var unwrap1 = /* @__PURE__ */ unwrap();
var un = function() {
  return function(v) {
    return unwrap1;
  };
};

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

// output/Data.String.Common/foreign.js
var trim = function(s) {
  return s.trim();
};
var joinWith = function(s) {
  return function(xs) {
    return xs.join(s);
  };
};

// output/Yoga.JSON/foreign.js
var _parseJSON = JSON.parse;
var _undefined = void 0;
var _unsafeStringify = JSON.stringify;

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
  var map23 = map(dictApply.Functor0());
  return function(a) {
    return function(b) {
      return apply1(map23($$const(identity2))(a))(b);
    };
  };
};
var lift2 = function(dictApply) {
  var apply1 = apply(dictApply);
  var map23 = map(dictApply.Functor0());
  return function(f) {
    return function(a) {
      return function(b) {
        return apply1(map23(f)(a))(b);
      };
    };
  };
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
  var bind11 = bind(dictMonad.Bind1());
  var pure11 = pure(dictMonad.Applicative0());
  return function(f) {
    return function(a) {
      return bind11(f)(function(f$prime) {
        return bind11(a)(function(a$prime) {
          return pure11(f$prime(a$prime));
        });
      });
    };
  };
};

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
var map4 = /* @__PURE__ */ map(functorEffect);
var $$try = function(action) {
  return catchException(function($3) {
    return pure2(Left.create($3));
  })(map4(Right.create)(action));
};
var $$throw = function($4) {
  return throwException(error($4));
};

// output/Control.Monad.Error.Class/index.js
var throwError = function(dict) {
  return dict.throwError;
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
      return mapExceptT(map110(map5(f)));
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
  var bind11 = bind(dictMonad.Bind1());
  var pure11 = pure(dictMonad.Applicative0());
  return {
    bind: function(v) {
      return function(k) {
        return bind11(v)(either(function($187) {
          return pure11(Left.create($187));
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
    var bind11 = bind(Bind1);
    var pure11 = pure(dictMonad.Applicative0());
    var functorExceptT1 = functorExceptT(Bind1.Apply0().Functor0());
    return {
      alt: function(v) {
        return function(v1) {
          return bind11(v)(function(rm) {
            if (rm instanceof Right) {
              return pure11(new Right(rm.value0));
            }
            ;
            if (rm instanceof Left) {
              return bind11(v1)(function(rn) {
                if (rn instanceof Right) {
                  return pure11(new Right(rn.value0));
                }
                ;
                if (rn instanceof Left) {
                  return pure11(new Left(append2(rm.value0)(rn.value0)));
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

// output/Control.Plus/index.js
var empty = function(dict) {
  return dict.empty;
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

// output/Data.Foldable/index.js
var foldr = function(dict) {
  return dict.foldr;
};
var traverse_ = function(dictApplicative) {
  var applySecond2 = applySecond(dictApplicative.Apply0());
  var pure11 = pure(dictApplicative);
  return function(dictFoldable) {
    var foldr22 = foldr(dictFoldable);
    return function(f) {
      return foldr22(function($449) {
        return applySecond2(f($449));
      })(pure11(unit));
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
    return function(map23) {
      return function(pure11) {
        return function(f) {
          return function(array) {
            function go(bot, top6) {
              switch (top6 - bot) {
                case 0:
                  return pure11([]);
                case 1:
                  return map23(array1)(f(array[bot]));
                case 2:
                  return apply4(map23(array2)(f(array[bot])))(f(array[bot + 1]));
                case 3:
                  return apply4(apply4(map23(array3)(f(array[bot])))(f(array[bot + 1])))(f(array[bot + 2]));
                default:
                  var pivot = bot + Math.floor((top6 - bot) / 4) * 2;
                  return apply4(map23(concat22)(go(bot, pivot)))(go(pivot, top6));
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
    return function(map23) {
      return function(f) {
        var buildFrom = function(x, ys) {
          return apply4(map23(consList)(f(x)))(ys);
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
          var acc = map23(finalCell)(f(array[array.length - 1]));
          var result = go(acc, array.length - 1, array);
          while (result instanceof Cont) {
            result = result.fn();
          }
          return map23(listToArray)(result);
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
  var show9 = show(dictShow);
  return function(dictShow1) {
    var show12 = show(dictShow1);
    return {
      show: function(v) {
        return "(NonEmpty " + (show9(v.value0) + (" " + (show12(v.value1) + ")")));
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
var top2 = /* @__PURE__ */ top(boundedInt);
var bottom2 = /* @__PURE__ */ bottom(boundedInt);
var fromNumber = /* @__PURE__ */ function() {
  return fromNumberImpl(Just.create)(Nothing.value);
}();
var unsafeClamp = function(x) {
  if (!isFiniteImpl(x)) {
    return 0;
  }
  ;
  if (x >= toNumber(top2)) {
    return top2;
  }
  ;
  if (x <= toNumber(bottom2)) {
    return bottom2;
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
var map6 = /* @__PURE__ */ map(functorList);
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
  var show9 = show(dictShow);
  return {
    show: function(v) {
      if (v instanceof Nil) {
        return "Nil";
      }
      ;
      return "(" + (intercalate4(" : ")(map6(show9)(v)) + " : Nil)");
    }
  };
};
var showNonEmptyList = function(dictShow) {
  var show9 = show(showNonEmpty(dictShow)(showList(dictShow)));
  return {
    show: function(v) {
      return "(NonEmptyList " + (show9(v) + ")");
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

// output/Data.Enum/foreign.js
function toCharCode(c) {
  return c.charCodeAt(0);
}
function fromCharCode(c) {
  return String.fromCharCode(c);
}

// output/Control.Alternative/index.js
var guard = function(dictAlternative) {
  var pure11 = pure(dictAlternative.Applicative0());
  var empty4 = empty(dictAlternative.Plus1());
  return function(v) {
    if (v) {
      return pure11(unit);
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
var readBoolean = function(dictMonad) {
  return unsafeReadTagged(dictMonad)("Boolean");
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
  var pure11 = pure(applicativeExceptT(dictMonad));
  return function(k) {
    return function(value) {
      return unsafeReadPropImpl(fail5(new TypeMismatch("object", typeOf(value))), pure11, k, value);
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
function _foldM(bind11) {
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
            acc = bind11(acc)(g(k));
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
var fromHomogeneous = function() {
  return unsafeCoerce2;
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
    var map23 = map(Apply0.Functor0());
    var pure13 = pure(dictApplicative);
    return function(f) {
      return function(ms) {
        return fold2(function(acc) {
          return function(k) {
            return function(v) {
              return apply4(map23(flip(insert2(k)))(acc))(f(k)(v));
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
var map7 = /* @__PURE__ */ map(functorArray);
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
  var $271 = writeImpl(dictWriteForeign);
  return function($272) {
    return _unsafeStringify($271($272));
  };
};
var writeForeignArray = function(dictWriteForeign) {
  var writeImpl32 = writeImpl(dictWriteForeign);
  return {
    writeImpl: function(xs) {
      return unsafeToForeign(map7(writeImpl32)(xs));
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
var read3 = function(dictReadForeign) {
  var $300 = readImpl(dictReadForeign);
  return function($301) {
    return runExcept($300($301));
  };
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

// output/Backend.Github.API.Types/index.js
var writeForeignGithubGraphQL = writeForeignString;
var readForeignGithubGraphQLQ = readForeignString;
var unGithubGraphQLQuery = function(v) {
  return v;
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

// output/Data.Enum.Generic/index.js
var map8 = /* @__PURE__ */ map(functorMaybe);
var genericSucc$prime = function(dict) {
  return dict["genericSucc'"];
};
var genericSucc = function(dictGeneric) {
  var to2 = to(dictGeneric);
  var from3 = from(dictGeneric);
  return function(dictGenericEnum) {
    var $156 = map8(to2);
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
    var $159 = map8(to2);
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
              return map8(Inl.create)(genericPred$prime1(v.value0));
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
              return map8(Inr.create)(genericSucc$prime2(v.value0));
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
      return map8(Constructor)(genericPred$prime1(v));
    },
    "genericSucc'": function(v) {
      return map8(Constructor)(genericSucc$prime1(v));
    }
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
var readGenericTaggedSumRepCo = function(dictIsSymbol) {
  var reflectSymbol2 = reflectSymbol(dictIsSymbol);
  return {
    genericReadForeignTaggedSumRep: function(v) {
      return function(f) {
        var name2 = v.toConstructorName(reflectSymbol2($$Proxy.value));
        return bind4(read$prime2(f))(function(v1) {
          return bind4(maybe(fail4(new ErrorAtProperty(v.typeTag, new ForeignError("Missing type tag: " + v.typeTag))))(pure5)(lookup2(v.typeTag)(v1)))(function(typeFgn) {
            return bind4(read$prime1(typeFgn))(function(typeStr) {
              var $78 = typeStr === name2;
              if ($78) {
                return withExcept(map10(ErrorAtProperty.create(name2)))(pure5(NoArguments.value));
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
          throw new Error("Failed pattern match at Yoga.JSON.Generics.TaggedSumRep (line 133, column 45 - line 135, column 57): " + [v.constructor.name]);
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

// output/Biz.OAuth.Types/index.js
var TokenType = function(x) {
  return x;
};
var AccessToken = function(x) {
  return x;
};
var readForeignTokenType = readForeignString;
var readForeignScopeList = readForeignString;
var readForeignAccessToken = readForeignString;

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
var readForeignRecord3 = /* @__PURE__ */ readForeignRecord();
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
var readForeignFieldsCons1 = /* @__PURE__ */ readForeignFieldsCons(nameIsSymbol);
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
var readForeignMaybe2 = /* @__PURE__ */ readForeignMaybe(readForeignString);
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
var GithubGraphQLResultIsSymbol = {
  reflectSymbol: function() {
    return "GithubGraphQLResult";
  }
};
var writeForeignRecord3 = /* @__PURE__ */ writeForeignRecord();
var writeForeignRecord1 = /* @__PURE__ */ writeForeignRecord3(writeForeignFieldsNilRowR);
var writeForeignFieldsCons2 = /* @__PURE__ */ writeForeignFieldsCons(dependenciesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignProjectName));
var writeForeignFieldsCons1 = /* @__PURE__ */ writeForeignFieldsCons(nameIsSymbol);
var writeForeignMaybe2 = /* @__PURE__ */ writeForeignMaybe(writeForeignString);
var ShowFolderSelectorIsSymbol = {
  reflectSymbol: function() {
    return "ShowFolderSelector";
  }
};
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
var queryIsSymbol = {
  reflectSymbol: function() {
    return "query";
  }
};
var tokenIsSymbol = {
  reflectSymbol: function() {
    return "token";
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
var QueryGithubGraphQLIsSymbol = {
  reflectSymbol: function() {
    return "QueryGithubGraphQL";
  }
};
var genericEnumConstructor3 = /* @__PURE__ */ genericEnumConstructor(genericEnumNoArguments);
var genericTopConstructor3 = /* @__PURE__ */ genericTopConstructor(genericTopNoArguments);
var genericEnumSum3 = /* @__PURE__ */ genericEnumSum(genericEnumConstructor3)(genericTopConstructor3);
var genericBottomConstructor3 = /* @__PURE__ */ genericBottomConstructor(genericBottomNoArguments);
var genericBottomSum3 = /* @__PURE__ */ genericBottomSum(genericBottomConstructor3);
var genericEnumSum12 = /* @__PURE__ */ genericEnumSum3(/* @__PURE__ */ genericEnumSum3(/* @__PURE__ */ genericEnumSum3(/* @__PURE__ */ genericEnumSum3(genericEnumConstructor3)(genericBottomConstructor3))(genericBottomSum3))(genericBottomSum3))(genericBottomSum3);
var genericTopSum2 = /* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(/* @__PURE__ */ genericTopSum(genericTopConstructor3))));
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
var QueryGithubGraphQLChannel = /* @__PURE__ */ function() {
  function QueryGithubGraphQLChannel2() {
  }
  ;
  QueryGithubGraphQLChannel2.value = new QueryGithubGraphQLChannel2();
  return QueryGithubGraphQLChannel2;
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
var ShowFolderSelector = /* @__PURE__ */ function() {
  function ShowFolderSelector2() {
  }
  ;
  ShowFolderSelector2.value = new ShowFolderSelector2();
  return ShowFolderSelector2;
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
var GithubGraphQLResultChannel = /* @__PURE__ */ function() {
  function GithubGraphQLResultChannel2() {
  }
  ;
  GithubGraphQLResultChannel2.value = new GithubGraphQLResultChannel2();
  return GithubGraphQLResultChannel2;
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
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
      return GetPureScriptSolutionDefinitionsChannel.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inr))) {
      return QueryGithubGraphQLChannel.value;
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 111, column 1 - line 111, column 48): " + [x.constructor.name]);
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
      return new Inr(new Inr(new Inr(new Inl(NoArguments.value))));
    }
    ;
    if (x instanceof QueryGithubGraphQLChannel) {
      return new Inr(new Inr(new Inr(new Inr(NoArguments.value))));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 111, column 1 - line 111, column 48): " + [x.constructor.name]);
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
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
      return new GetPureScriptSolutionDefinitionsResponse(x.value0.value0.value0.value0);
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inr))) {
      return new GithubGraphQLResult(x.value0.value0.value0.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 88, column 1 - line 88, column 44): " + [x.constructor.name]);
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
      return new Inr(new Inr(new Inr(new Inl(x.value0))));
    }
    ;
    if (x instanceof GithubGraphQLResult) {
      return new Inr(new Inr(new Inr(new Inr(x.value0))));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 88, column 1 - line 88, column 44): " + [x.constructor.name]);
  }
};
var writeForeignMessageToRend = {
  writeImpl: /* @__PURE__ */ genericWriteForeignTaggedSum(genericMessageToRenderer_)(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignVariant()(/* @__PURE__ */ writeForeignVariantCons(invalidSpagoDhallIsSymbol)(writeForeignString)()(/* @__PURE__ */ writeForeignVariantCons(noSpagoDhallIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(nothingSelectedIsSymbol)(writeForeignRecord1)()(/* @__PURE__ */ writeForeignVariantCons(validSpagoDhallIsSymbol)(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignProjectName)(/* @__PURE__ */ writeForeignFieldsCons(packagesIsSymbol)(/* @__PURE__ */ writeForeignObject(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons2(/* @__PURE__ */ writeForeignFieldsCons(repoIsSymbol)(writeForeignRepository)(/* @__PURE__ */ writeForeignFieldsCons(versionIsSymbol)(writeForeignVersion)(writeForeignFieldsNilRowR)()()())()()())()()())))(/* @__PURE__ */ writeForeignFieldsCons(repositoryIsSymbol)(/* @__PURE__ */ writeForeignMaybe(writeForeignRepository))(/* @__PURE__ */ writeForeignFieldsCons(sourcesIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignSourceGlob))(writeForeignFieldsNilRowR)()()())()()())()()())()()())()()()))()(writeForeignVariantNilRow)))))))(ShowFolderSelectorResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignMaybe2))(UserSelectedFileIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignGetInstalledT))(GetInstalledToolsResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepS(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(/* @__PURE__ */ writeForeignArray(/* @__PURE__ */ writeForeignTuple(writeForeignString)(/* @__PURE__ */ writeForeignRecord3(/* @__PURE__ */ writeForeignFieldsCons1(writeForeignString)(/* @__PURE__ */ writeForeignFieldsCons(projectsIsSymbol)(/* @__PURE__ */ writeForeignArray(writeForeignPureScriptPro))(writeForeignFieldsNilRowR)()()())()()())))))(GetPureScriptSolutionDefinitionsResponseIsSymbol))(/* @__PURE__ */ writeGenericTaggedSumRepC(/* @__PURE__ */ writeGenericTaggedSumRepA(writeForeignGithubGraphQL))(GithubGraphQLResultIsSymbol))))))(defaultOptions)
};
var genericMessageToMain_ = {
  to: function(x) {
    if (x instanceof Inl) {
      return ShowFolderSelector.value;
    }
    ;
    if (x instanceof Inr && x.value0 instanceof Inl) {
      return new ShowOpenDialog(x.value0.value0);
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && x.value0.value0 instanceof Inl)) {
      return GetInstalledTools.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inl))) {
      return GetPureScriptSolutionDefinitions.value;
    }
    ;
    if (x instanceof Inr && (x.value0 instanceof Inr && (x.value0.value0 instanceof Inr && x.value0.value0.value0 instanceof Inr))) {
      return new QueryGithubGraphQL(x.value0.value0.value0.value0);
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 75, column 1 - line 75, column 40): " + [x.constructor.name]);
  },
  from: function(x) {
    if (x instanceof ShowFolderSelector) {
      return new Inl(NoArguments.value);
    }
    ;
    if (x instanceof ShowOpenDialog) {
      return new Inr(new Inl(x.value0));
    }
    ;
    if (x instanceof GetInstalledTools) {
      return new Inr(new Inr(new Inl(NoArguments.value)));
    }
    ;
    if (x instanceof GetPureScriptSolutionDefinitions) {
      return new Inr(new Inr(new Inr(new Inl(NoArguments.value))));
    }
    ;
    if (x instanceof QueryGithubGraphQL) {
      return new Inr(new Inr(new Inr(new Inr(x.value0))));
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 75, column 1 - line 75, column 40): " + [x.constructor.name]);
  }
};
var readForeignMessageToMain = {
  readImpl: /* @__PURE__ */ genericReadForeignTaggedSum(genericMessageToMain_)(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(ShowFolderSelectorIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(directoryIsSymbol)(readForeignBoolean)(/* @__PURE__ */ readForeignFieldsCons(filtersIsSymbol)(/* @__PURE__ */ readForeignArray(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(extensionsIsSymbol)(/* @__PURE__ */ readForeignMaybe(/* @__PURE__ */ readForeignArray(readForeignString)))(/* @__PURE__ */ readForeignFieldsCons1(readForeignMaybe2)(readForeignFieldsNilRowRo)()())()())))(readForeignFieldsNilRowRo)()())()())))(ShowOpenDialogIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetInstalledToolsIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepSu(/* @__PURE__ */ readGenericTaggedSumRepCo(GetPureScriptSolutionDefinitionsIsSymbol))(/* @__PURE__ */ readGenericTaggedSumRepCo1(/* @__PURE__ */ readGenericTaggedSumRepAr(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(queryIsSymbol)(readForeignGithubGraphQLQ)(/* @__PURE__ */ readForeignFieldsCons(tokenIsSymbol)(/* @__PURE__ */ readForeignRecord3(/* @__PURE__ */ readForeignFieldsCons(access_tokenIsSymbol)(readForeignAccessToken)(/* @__PURE__ */ readForeignFieldsCons(scopeIsSymbol)(readForeignScopeList)(/* @__PURE__ */ readForeignFieldsCons(token_typeIsSymbol)(readForeignTokenType)(readForeignFieldsNilRowRo)()())()())()()))(readForeignFieldsNilRowRo)()())()())))(QueryGithubGraphQLIsSymbol))))))(defaultOptions)
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
      if (x instanceof QueryGithubGraphQLChannel && y instanceof QueryGithubGraphQLChannel) {
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
      if (x instanceof GetPureScriptSolutionDefinitionsChannel) {
        return LT.value;
      }
      ;
      if (y instanceof GetPureScriptSolutionDefinitionsChannel) {
        return GT.value;
      }
      ;
      if (x instanceof QueryGithubGraphQLChannel && y instanceof QueryGithubGraphQLChannel) {
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
var rendererToMainChannelName = function($847) {
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
    if (v instanceof QueryGithubGraphQLChannel) {
      return "query-github-graphql";
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 38, column 41 - line 43, column 53): " + [v.constructor.name]);
  }($847));
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
  if (v instanceof GithubGraphQLResult) {
    return GithubGraphQLResultChannel.value;
  }
  ;
  throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 54, column 30 - line 59, column 53): " + [v.constructor.name]);
};
var mainToRendererChannelName = function($848) {
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
    if (v instanceof GithubGraphQLResultChannel) {
      return "query-github-graphql-response";
    }
    ;
    throw new Error("Failed pattern match at Biz.IPC.Message.Types (line 46, column 41 - line 51, column 63): " + [v.constructor.name]);
  }($848));
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
var read4 = /* @__PURE__ */ function() {
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
  var map23 = map(dictMonad.Bind1().Apply0().Functor0());
  var unsafeFreeze1 = unsafeFreeze2(dictMonad);
  return function(f) {
    return function(buf) {
      return map23(f)(unsafeFreeze1(buf));
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
var read5 = function(dictMonad) {
  var usingFromImmutable1 = usingFromImmutable(dictMonad);
  return function(t) {
    return function(o) {
      return usingFromImmutable1(read4(t)(o));
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
  read: /* @__PURE__ */ read5(monadEffect),
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

// output/Yoga.Fetch/foreign.js
var _fetch = (fetchImpl) => (url) => (options) => () => {
  return fetchImpl(url, options).catch(function(e) {
    throw new Error(e);
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
var identity10 = /* @__PURE__ */ identity(categoryFn);
var alt5 = /* @__PURE__ */ alt(/* @__PURE__ */ altExceptT(semigroupNonEmptyList)(monadIdentity));
var unsafeReadTagged2 = /* @__PURE__ */ unsafeReadTagged(monadIdentity);
var map17 = /* @__PURE__ */ map(/* @__PURE__ */ functorExceptT(functorIdentity));
var readString5 = /* @__PURE__ */ readString(monadIdentity);
var bind5 = /* @__PURE__ */ bind(bindAff);
var liftEffect3 = /* @__PURE__ */ liftEffect(monadEffectAff);
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
  })(identity10)(runExcept(alt5(unsafeReadTagged2("Error")(fn))(map17(error)(readString5(fn)))));
};
var toAff = /* @__PURE__ */ toAff$prime(coerce3);
var toAffE = function(f) {
  return bind5(liftEffect3(f))(toAff);
};

// output/Yoga.Fetch/index.js
var text = function(res) {
  return toAffE(textImpl(res));
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

// output/Yoga.Fetch.Impl.Node/foreign.js
var import_node_fetch = __toESM(require_lib2(), 1);

// output/Backend.Github.API/index.js
var bind6 = /* @__PURE__ */ bind(bindAff);
var fromHomogeneous2 = /* @__PURE__ */ fromHomogeneous();
var un2 = /* @__PURE__ */ un();
var pure7 = /* @__PURE__ */ pure(applicativeAff);
var sendRequest = function(v) {
  return function(query) {
    return bind6(fetch(import_node_fetch.default)()("https://api.github.com/graphql")({
      method: postMethod,
      headers: fromHomogeneous2({
        Authorization: un2(TokenType)(v.token_type) + (" " + un2(AccessToken)(v.access_token)),
        "Content-Type": "application/json"
      }),
      body: unGithubGraphQLQuery(query)
    }))(function(response) {
      return bind6(text(response))(function(body) {
        return pure7(body);
      });
    });
  };
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
var toAff2 = function(p) {
  return makeAff(function(k) {
    return voidLeft3(p(k))(nonCanceler);
  });
};
var toAff22 = function(f) {
  return function(a) {
    return function(b) {
      return toAff2(f(a)(b));
    };
  };
};
var toAff3 = function(f) {
  return function(a) {
    return function(b) {
      return function(c) {
        return toAff2(f(a)(b)(c));
      };
    };
  };
};
var writeTextFile2 = /* @__PURE__ */ toAff3(writeTextFile);
var readTextFile2 = /* @__PURE__ */ toAff22(readTextFile);

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
var bind7 = /* @__PURE__ */ bind(bindAff);
var liftEffect4 = /* @__PURE__ */ liftEffect(monadEffectAff);
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
var pure8 = /* @__PURE__ */ pure(applicativeAff);
var readSolutionDefinition = function(dir) {
  var path2 = concat5([dir, pureScriptSolutionFileName]);
  return bind7(liftEffect4(exists(path2)))(function(fileExists) {
    return discard2(when2(!fileExists)(throwError2(error("No .purescript-solution.json file in " + path2))))(function() {
      return bind7(readTextFile2(UTF8.value)(path2))(function(strFile) {
        var v = readJSON2(strFile);
        if (v instanceof Left) {
          return throwError2(error("Invalid .purescript-solution.json file:\n" + show6(v.value0)));
        }
        ;
        if (v instanceof Right) {
          return pure8(v.value0);
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
var map18 = /* @__PURE__ */ map(functorNonEmptyList);
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
  return inj1(invalidSpagoDhallKey)(intercalate6("\n")(map18(renderForeignError)(errs)));
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
var bind8 = /* @__PURE__ */ bind(bindAff);
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
var pure9 = /* @__PURE__ */ pure(applicativeAff);
var getPreferencesFilePath = function(dictMonadEffect) {
  return liftEffect(dictMonadEffect)(map19(function(v) {
    return concat5([v, "settings.json"]);
  })(liftEffect5(getUserDataDirectory)));
};
var getPreferencesFilePath1 = /* @__PURE__ */ getPreferencesFilePath(monadEffectAff);
var writeAppPreferences = function(settings) {
  return bind8(getPreferencesFilePath1)(function(settingsFilePath) {
    return writeTextFile2(UTF8.value)(settingsFilePath)(writeJSON2(settings));
  });
};
var readAppPreferences = /* @__PURE__ */ bind8(getPreferencesFilePath1)(function(settingsFilePath) {
  return bind8(liftEffect1(exists(settingsFilePath)))(function(settingsFileExists) {
    return discard3(when3(!settingsFileExists)(writeAppPreferences(defaultAppPreferences)))(function() {
      return bind8(readTextFile2(UTF8.value)(settingsFilePath))(function(textContent) {
        var v = readJSON3(textContent);
        if (v instanceof Left) {
          return throwError3(error(show7(v.value0)));
        }
        ;
        if (v instanceof Right) {
          return pure9(v.value0);
        }
        ;
        throw new Error("Failed pattern match at Biz.Preferences (line 34, column 3 - line 36, column 35): " + [v.constructor.name]);
      });
    });
  });
});

// output/Biz.IPC.MessageToMainHandler/index.js
var bind9 = /* @__PURE__ */ bind(bindAff);
var showOpenDialog1 = /* @__PURE__ */ showOpenDialog();
var map20 = /* @__PURE__ */ map(functorAff);
var pure10 = /* @__PURE__ */ pure(applicativeAff);
var liftEffect6 = /* @__PURE__ */ liftEffect(monadEffectAff);
var readForeignRecord4 = /* @__PURE__ */ readForeignRecord();
var readForeignFieldsCons2 = /* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "dependencies";
  }
})(/* @__PURE__ */ readForeignArray(readForeignProjectName));
var readJSON4 = /* @__PURE__ */ readJSON(/* @__PURE__ */ readForeignRecord4(/* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "name";
  }
})(readForeignProjectName)(/* @__PURE__ */ readForeignFieldsCons({
  reflectSymbol: function() {
    return "packages";
  }
})(/* @__PURE__ */ readForeignObject(/* @__PURE__ */ readForeignRecord4(/* @__PURE__ */ readForeignFieldsCons2(/* @__PURE__ */ readForeignFieldsCons({
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
var mapFlipped2 = /* @__PURE__ */ mapFlipped(functorAff);
var $$for2 = /* @__PURE__ */ $$for(applicativeAff)(traversableArray);
var for_2 = /* @__PURE__ */ for_(applicativeEffect)(foldableMaybe);
var sendToWebContents2 = /* @__PURE__ */ sendToWebContents(writeForeignMessageToRend);
var showOpenDialog2 = function(window) {
  return bind9(showOpenDialog1({
    properties: [openDirectory]
  })(window))(function(result) {
    return map20(UserSelectedFile.create)(function() {
      var v = function(v1) {
        return pure10(Nothing.value);
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
  return bind9(showOpenDialog1({
    properties: [openDirectory]
  })(window))(function(result) {
    return bind9(function() {
      var v = function(v1) {
        return pure10(nothingSelected);
      };
      if (!result.canceled) {
        var $85 = fromArray(result.filePaths);
        if ($85 instanceof Just) {
          var spagoPath = concat5([head2($85.value0), "spago.dhall"]);
          return bind9(liftEffect6(exists(spagoPath)))(function(pathExists\u0294) {
            var packagesPath = concat5([head2($85.value0), "packages.dhall"]);
            return bind9(liftEffect6(exists(packagesPath)))(function(path2Exists\u0294) {
              var $86 = !pathExists\u0294 || !path2Exists\u0294;
              if ($86) {
                return pure10(noSpagoDhall);
              }
              ;
              return bind9(readTextFile2(UTF8.value)(spagoPath))(function(spagoDhall) {
                return bind9(spawn3({
                  cmd: "dhall-to-json",
                  args: [],
                  stdin: new Just(spagoDhall)
                })(defaultSpawnOptions))(function(v1) {
                  return pure10(either(invalidSpagoDhall)(validSpagoDhall)(readJSON4(v1.stdout)));
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
      return pure10(new ShowFolderSelectorResponse(v));
    });
  });
};
var queryGithubGraphQL = function(v) {
  if (v instanceof QueryGithubGraphQL) {
    return mapFlipped2(sendRequest(v.value0.token)(v.value0.query))(function($100) {
      return Just.create(GithubGraphQLResult.create($100));
    });
  }
  ;
  return pure10(Nothing.value);
};
var getProjectDefinitions = /* @__PURE__ */ bind9(readAppPreferences)(function(prefs) {
  return bind9($$for2(prefs.solutions)(function(fp) {
    return map20(function(v) {
      return new Tuple(fp, v);
    })(readSolutionDefinition(fp));
  }))(function(projects) {
    return pure10(new GetPureScriptSolutionDefinitionsResponse(projects));
  });
});
var getInstalledTools = /* @__PURE__ */ function() {
  return map20(GetInstalledToolsResponse.create)(maybe(pure10(UnsupportedOperatingSystem.value))(map20(ToolsResult.create))(mapFlipped(functorMaybe)(operatingSystem\u0294)(getToolsWithPaths)));
}();
var handleMessageToMain = function(window) {
  return function(incomingChannel) {
    return function(message2) {
      return bind9(function() {
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
        if (incomingChannel instanceof QueryGithubGraphQLChannel) {
          return queryGithubGraphQL(message2);
        }
        ;
        throw new Error("Failed pattern match at Biz.IPC.MessageToMainHandler (line 34, column 41 - line 40, column 59): " + [incomingChannel.constructor.name]);
      }())(function(v) {
        return liftEffect6(for_2(v)(function(v1) {
          return sendToWebContents2(v1)(mainToRendererChannelName(messageToRendererToChannel(v1)))(window);
        }));
      });
    };
  };
};

// output/Backend.IPC.Handler/index.js
var show8 = /* @__PURE__ */ show(/* @__PURE__ */ showNonEmptyList(showForeignError));
var identity11 = /* @__PURE__ */ identity(categoryFn);
var read8 = /* @__PURE__ */ read3(readForeignMessageToMain);
var enumFromTo3 = /* @__PURE__ */ enumFromTo(enumRendererToMainChannel)(unfoldable1Array);
var bottom5 = /* @__PURE__ */ bottom(boundedRendererToMainChan);
var top5 = /* @__PURE__ */ top(boundedRendererToMainChan);
var map21 = /* @__PURE__ */ map(functorArray);
var for_3 = /* @__PURE__ */ for_(applicativeEffect)(foldableArray);
var registerHandler = function(channel) {
  return function(handle) {
    var listener = function(_ev, fgn) {
      var message2 = either(function($14) {
        return unsafeCrashWith(show8($14));
      })(identity11)(read8(fgn.data));
      return launchAff_(handle(message2))();
    };
    return onIPCMainMessage(listener)(rendererToMainChannelName(channel));
  };
};
var registerAllHandlers = function(window) {
  var allChannels = enumFromTo3(bottom5)(top5);
  var allHandlers = map21(function(v) {
    return new Tuple(v, handleMessageToMain(window)(v));
  })(allChannels);
  return for_3(allHandlers)(uncurry(registerHandler));
};

// output/Main/index.js
var discard4 = /* @__PURE__ */ discard(discardUnit)(bindAff);
var bind10 = /* @__PURE__ */ bind(bindAff);
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
  return bind10(liftEffect7(mkOptions))(function(options) {
    return bind10(liftEffect7(newBrowserWindow(options)))(function(window) {
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
