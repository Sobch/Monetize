var MonetizeSettings = /** @class */ (function () {
    function MonetizeSettings() {
    }
    // Drawing from right side of moneySpace element.
    MonetizeSettings.drawFromRightSide = true;
    // Rounds values close to upper bound, for example 9.99 to 10.
    MonetizeSettings.roundingUp = true;
    // Lower value in percent for rounding,
    // it works when value doesn't reach rounding target,
    //  e. g. 9.99->10, 99.90->100
    MonetizeSettings.roundUpLowerValue = 0.99;
    // Higher value in percent for rounding,
    // it works when value is higher than rounding target,
    //  e. g. 19.50->20, 295->300
    MonetizeSettings.roundUpHigherValue = 0.95;
    // Enables drawing animation (requires jQuery)    
    MonetizeSettings.animationEnabled = true;
    // Animation interval
    MonetizeSettings.animationInterval = 300;
    return MonetizeSettings;
}());
var CoinTypes;
(function (CoinTypes) {
    CoinTypes[CoinTypes["thousand"] = 1000] = "thousand";
    CoinTypes[CoinTypes["hundred"] = 100] = "hundred";
    CoinTypes[CoinTypes["ten"] = 10] = "ten";
    CoinTypes[CoinTypes["one"] = 1] = "one";
    CoinTypes[CoinTypes["oneTenth"] = 0.1] = "oneTenth";
    CoinTypes[CoinTypes["oneHundredth"] = 0.01] = "oneHundredth";
})(CoinTypes || (CoinTypes = {}));
var MonetizeUtilities = /** @class */ (function () {
    function MonetizeUtilities() {
    }
    MonetizeUtilities.roundUpStep = function (value, step) {
        if ((value % step >= MonetizeSettings.roundUpLowerValue * step) ||
            (value % step >= MonetizeSettings.roundUpHigherValue * step && value > step)) {
            value += step - (value % step) + 0.0001;
        }
        return value;
    };
    MonetizeUtilities.roundUp = function (value) {
        value = this.roundUpStep(value, 0.1);
        value = this.roundUpStep(value, 1);
        value = this.roundUpStep(value, 10);
        value = this.roundUpStep(value, 100);
        value = this.roundUpStep(value, 1000);
        return value;
    };
    MonetizeUtilities.calculateNominals = function (moneyAmount) {
        var maximumMoneyAmount = 10000;
        if (moneyAmount > maximumMoneyAmount)
            moneyAmount = maximumMoneyAmount;
        if (MonetizeSettings.roundingUp)
            moneyAmount = this.roundUp(moneyAmount);
        var nominalCount = [];
        for (var key in CoinTypes) {
            if (isNaN(Number(key))) {
                nominalCount.push(Math.floor(moneyAmount / Number(CoinTypes[key])));
                moneyAmount %= Number(CoinTypes[key]);
            }
        }
        return nominalCount;
    };
    return MonetizeUtilities;
}());
var MonetizeCoins = /** @class */ (function () {
    function MonetizeCoins() {
    }
    MonetizeCoins.drawCoin = function (monetizeHTMLElement, coinType, horizontalPosition, verticalPosition, zIndex) {
        if (zIndex === void 0) { zIndex = 900; }
        if (typeof jQuery == 'undefined') {
            monetizeHTMLElement.innerHTML += ('<div class="Monetize coin coin-' + CoinTypes[coinType] + '" style="'
                + (MonetizeSettings.drawFromRightSide ? 'right: ' : 'left: ')
                + horizontalPosition + 'px; bottom: ' + verticalPosition + 'px; z-index: ' + zIndex + ';"></div>');
        }
        else {
            $(monetizeHTMLElement).append('<div class="Monetize coin coin-' + CoinTypes[coinType] + '" style="'
                + (MonetizeSettings.drawFromRightSide ? 'right: ' : 'left: ')
                + horizontalPosition + 'px; bottom: ' + verticalPosition + 'px; z-index: ' + zIndex + ';"></div>');
        }
    };
    return MonetizeCoins;
}());
/* needs jQuery to work */
var MonetizeAnimation = /** @class */ (function () {
    function MonetizeAnimation() {
    }
    MonetizeAnimation.drawingAnimation = function (monetizeHTMLElement) {
        if (typeof jQuery == 'undefined') {
            console.warn("Animation of Monetize element cannot be performed, jQuery needed!");
            return;
        }
        var interval = MonetizeSettings.animationInterval;
        var currentElement = $(monetizeHTMLElement).children('.Monetize.coin').not(".droppedCoin").first();
        var bottom = parseInt($(currentElement).css("bottom"));
        $(monetizeHTMLElement).children('.Monetize.coin').not(".droppedCoin").each(function () {
            $(this).css("bottom", parseInt($(this).css("bottom")) + 26).css("opacity", 0);
        });
        $(currentElement).css("bottom", bottom + 26).animate({ "opacity": 1, "bottom": bottom + 12 }, { easing: "linear", duration: interval / 2, complete: function () {
                next();
            } });
        $(currentElement).css("bottom", bottom + 26).animate({ "opacity": 1, "bottom": bottom }, { easing: "linear", duration: interval / 2 });
        function next() {
            currentElement = $(currentElement).next();
            bottom = parseInt($(currentElement).css("bottom"));
            interval -= interval / 30;
            $(currentElement).animate({ "opacity": 1, "bottom": bottom - 13 }, { easing: "linear", duration: interval / 2, complete: function () {
                    next();
                } });
            $(currentElement).animate({ "opacity": 1, "bottom": bottom - 26 }, { easing: "linear", duration: interval / 2 });
        }
    };
    MonetizeAnimation.fadingAnimation = function (monetizeHTMLElement) {
        if (typeof jQuery == 'undefined') {
            console.warn("Animation of Monetize element cannot be performed, jQuery needed!");
            return;
        }
        $(monetizeHTMLElement).children('.Monetize.coin').addClass("droppedCoin").animate({ "opacity": 0, "bottom": "-=25" }, { easing: "swing", duration: MonetizeSettings.animationInterval, complete: function () {
                $(this).remove();
            } });
    };
    ;
    return MonetizeAnimation;
}());
var Monetize = /** @class */ (function () {
    function Monetize() {
    }
    Monetize.redraw = function (monetizeHTMLElement, moneyAmount) {
        if (!monetizeHTMLElement.classList.contains("Monetize") || !monetizeHTMLElement.classList.contains("moneySpace")) {
            throw new Error("Wrong HTML element assigned to Monetize class!\nElement should contain Monetize and moneySpace classes.");
        }
        if (MonetizeSettings.animationEnabled && typeof jQuery != 'undefined') {
            MonetizeAnimation.fadingAnimation(monetizeHTMLElement);
        }
        else
            monetizeHTMLElement.innerHTML = "";
        var nominalCount = MonetizeUtilities.calculateNominals(moneyAmount + 0.0001);
        var horizontalPosition = 0;
        var verticalPosition = 4;
        var coinsInitialHorizontalPosition = 0; // position of coins (not bank notes!), will be below bank notes.
        for (var i = 0; i < nominalCount[0]; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.thousand, horizontalPosition, verticalPosition, -102);
            horizontalPosition += 11;
        }
        if (nominalCount[0] && nominalCount[1])
            horizontalPosition += 21;
        verticalPosition += 6;
        for (var i = 0; i < nominalCount[1]; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.hundred, horizontalPosition, verticalPosition, -102);
            horizontalPosition += 9;
        }
        if (nominalCount[0] || nominalCount[1])
            horizontalPosition += 20;
        else if (nominalCount[3] <= 5)
            verticalPosition = 0;
        if ((nominalCount[0] ? 1 : 0) + (nominalCount[1] ? 1 : 0) + (nominalCount[2] ? 1 : 0) <= 1)
            coinsInitialHorizontalPosition = 0;
        else
            coinsInitialHorizontalPosition = horizontalPosition + 16;
        verticalPosition += 6;
        for (var i = 0; i < nominalCount[2]; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.ten, horizontalPosition, verticalPosition, -102);
            horizontalPosition += 8;
        }
        verticalPosition = 0;
        horizontalPosition = coinsInitialHorizontalPosition;
        for (var i = 0; i < nominalCount[3] && i < 5; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.one, horizontalPosition, verticalPosition, -100);
            verticalPosition += 4;
        }
        if (nominalCount[3] > 5) {
            horizontalPosition += 12;
            verticalPosition = 6;
            for (var i = 5; i < nominalCount[3]; i++) {
                MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.one, horizontalPosition, verticalPosition, -101);
                verticalPosition += 4;
            }
        }
        if (nominalCount[3])
            horizontalPosition += 15;
        verticalPosition = 0;
        for (var i = 0; i < nominalCount[4] && i < 5; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.oneTenth, horizontalPosition, verticalPosition, -100);
            verticalPosition += 3;
        }
        if (nominalCount[4] > 5) {
            verticalPosition = 4;
            horizontalPosition += 7;
            for (var i = 5; i < nominalCount[4]; i++) {
                MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.oneTenth, horizontalPosition, verticalPosition, -101);
                verticalPosition += 3;
            }
        }
        verticalPosition = 0;
        if (nominalCount[4] > 0) {
            horizontalPosition += 7;
        }
        for (var i = 0; i < nominalCount[5] && i < 5; i++) {
            MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.oneHundredth, horizontalPosition, verticalPosition, -100);
            verticalPosition += 2;
        }
        if (nominalCount[5] > 5) {
            verticalPosition = 2;
            horizontalPosition += 6;
            for (var i = 5; i < nominalCount[5]; i++) {
                MonetizeCoins.drawCoin(monetizeHTMLElement, CoinTypes.oneHundredth, horizontalPosition, verticalPosition, -101);
                verticalPosition += 2;
            }
        }
        horizontalPosition += 25;
        if (MonetizeSettings.animationEnabled) {
            MonetizeAnimation.drawingAnimation(monetizeHTMLElement);
        }
    };
    return Monetize;
}());
