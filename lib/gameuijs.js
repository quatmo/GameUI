﻿var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var gameui;
(function (gameui) {
    (function (ui) {
        // Class
        var UIItem = (function (_super) {
            __extends(UIItem, _super);
            function UIItem() {
                _super.apply(this, arguments);
                this.centered = false;
                this.animating = false;
            }
            UIItem.prototype.centralize = function () {
                this.regX = this.width / 2;
                this.regY = this.height / 2;
                this.centered = true;
            };

            UIItem.prototype.fadeOut = function () {
                var _this = this;
                this.animating = true;
                this.antX = this.x;
                this.antY = this.y;
                this.mouseEnabled = false;
                createjs.Tween.removeTweens(this);
                createjs.Tween.get(this).to({
                    scaleX: 0.5,
                    scaleY: 0.5,
                    alpha: 0,
                    x: this.antX,
                    y: this.antY
                }, 200, createjs.Ease.quadIn).call(function () {
                    _this.visible = false;
                    _this.x = _this.antX;
                    _this.y = _this.antY;
                    _this.scaleX = _this.scaleY = 1;
                    _this.alpha = 1;
                    _this.animating = false;
                    _this.mouseEnabled = true;
                    ;
                });
            };

            UIItem.prototype.fadeIn = function () {
                var _this = this;
                this.visible = true;
                this.animating = true;

                if (this.antX == null) {
                    this.antX = this.x;
                    this.antY = this.y;
                }

                this.scaleX = 0.5, this.scaleY = 0.5, this.alpha = 0, this.x = this.x;
                this.y = this.y;

                this.mouseEnabled = false;
                createjs.Tween.removeTweens(this);
                createjs.Tween.get(this).to({
                    scaleX: 1,
                    scaleY: 1,
                    alpha: 1,
                    x: this.antX,
                    y: this.antY
                }, 400, createjs.Ease.quadOut).call(function () {
                    _this.mouseEnabled = true;
                    _this.animating = false;
                });
            };

            //calcula
            UIItem.prototype.createHitArea = function () {
                var hit = new createjs.Shape();

                var b = this.getBounds();

                if (b)
                    hit.graphics.beginFill("#000").drawRect(b.x, b.y, b.width, b.height);

                //TODO. se for texto colocar uma sobra. !
                this.hitArea = hit;
            };
            return UIItem;
        })(createjs.Container);
        ui.UIItem = UIItem;
    })(gameui.ui || (gameui.ui = {}));
    var ui = gameui.ui;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    (function (ui) {
        //this class alow user to arrange objects in a grid forrmat
        //the anchor point is the center of object
        var Grid = (function (_super) {
            __extends(Grid, _super);
            function Grid(cols, rows, width, height, padding, flowHorizontal) {
                if (typeof cols === "undefined") { cols = null; }
                if (typeof rows === "undefined") { rows = null; }
                if (typeof padding === "undefined") { padding = 20; }
                if (typeof flowHorizontal === "undefined") { flowHorizontal = false; }
                _super.call(this);
                //default spacing
                this.defaultWSpacing = 800;
                this.defaultHSpacing = 300;
                //provided variables
                this.flowHorizontal = false;
                //control variables;
                this.currentCol = 0;
                this.currentRow = 0;

                //define the variables
                this.flowHorizontal = flowHorizontal;
                this.cols = cols;
                this.rows = rows;
                this.padding = padding;

                if (width == null)
                    width = 1536;
                if (height == null)
                    height = 2048;

                this.width = width;
                this.height = height;

                //define other parameters
                this.wSpacing = cols == 0 ? this.defaultWSpacing : (width - padding * 2) / cols;
                this.hSpacing = rows == 0 ? this.defaultHSpacing : (height - padding * 2) / rows;

                if (rows == null)
                    this.hSpacing = this.wSpacing;
                if (cols == null)
                    this.wSpacing = this.hSpacing;
            }
            //place objecrs into a grid format
            Grid.prototype.addObject = function (object, clickCallback) {
                if (typeof clickCallback === "undefined") { clickCallback = null; }
                this.addChild(object);
                object.x = this.getXPos();
                object.y = this.getYPos();
                if (clickCallback != null)
                    object.addEventListener("click", clickCallback);
                this.updatePosition();
            };

            Grid.prototype.getXPos = function () {
                return this.padding + this.currentCol * this.wSpacing + this.wSpacing / 2;
            };
            Grid.prototype.getYPos = function () {
                return this.padding + this.currentRow * this.hSpacing + this.hSpacing / 2;
            };

            //define next Item position
            Grid.prototype.updatePosition = function () {
                if (!this.flowHorizontal) {
                    this.currentCol++;
                    if (this.currentCol >= this.cols) {
                        this.currentCol = 0;
                        this.currentRow++;
                    }
                } else {
                    this.currentRow++;
                    if (this.currentRow >= this.rows) {
                        this.currentRow = 0;
                        this.currentCol++;
                    }
                }
            };
            return Grid;
        })(ui.UIItem);
        ui.Grid = Grid;
    })(gameui.ui || (gameui.ui = {}));
    var ui = gameui.ui;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    (function (ui) {
        // Class
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button() {
                var _this = this;
                _super.call(this);
                this.enableAnimation = true;
                this.mouse = false;
                this.addEventListener("mousedown", function (event) {
                    _this.onPress(event);
                });
                this.addEventListener("pressup", function (event) {
                    _this.onPressUp(event);
                });

                this.addEventListener("mouseover", function () {
                    _this.mouse = true;
                });
                this.addEventListener("mouseout", function () {
                    _this.mouse = false;
                });
            }
            Button.prototype.returnStatus = function () {
                if (!this.mouse) {
                    this.scaleX = this.originalScaleX;
                    this.scaleY = this.originalScaleY;
                }
            };

            Button.prototype.onPressUp = function (Event) {
                this.mouse = false;

                //createjs.Tween.removeTweens(this);
                this.set({ scaleX: this.originalScaleX * 1.1, scaleY: this.originalScaleY * 1.1 });
                createjs.Tween.get(this).to({ scaleX: this.originalScaleX, scaleY: this.originalScaleY }, 200, createjs.Ease.backOut);
            };

            Button.prototype.onPress = function (Event) {
                var _this = this;
                if (!this.enableAnimation)
                    return;

                this.mouse = true;
                if (this.originalScaleX == null) {
                    this.originalScaleX = this.scaleX;
                    this.originalScaleY = this.scaleY;
                }

                createjs.Tween.get(this).to({ scaleX: this.originalScaleX * 1.1, scaleY: this.originalScaleY * 1.1 }, 500, createjs.Ease.elasticOut).call(function () {
                    if (!_this.mouse) {
                        createjs.Tween.get(_this).to({ scaleX: _this.originalScaleX, scaleY: _this.originalScaleY }, 300, createjs.Ease.backOut);
                    }
                });
            };
            return Button;
        })(ui.UIItem);
        ui.Button = Button;

        var ImageButton = (function (_super) {
            __extends(ImageButton, _super);
            function ImageButton(background, event) {
                if (typeof event === "undefined") { event = null; }
                _super.call(this);

                if (event != null)
                    this.addEventListener("click", event);

                //adds image into it
                if (background != null) {
                    //TODO tirar createjs ASSETS daqui.
                    this.background = gameui.AssetsManager.getBitmap(background);
                    this.addChildAt(this.background, 0);

                    //Sets the image into the pivot center.
                    if (this.background.getBounds()) {
                        this.width = this.background.getBounds().width;
                        this.height = this.background.getBounds().height;
                        this.background.regX = this.width / 2;
                        this.background.regY = this.height / 2;
                        this.centered = true;
                        this.createHitArea();
                    }
                }
            }
            return ImageButton;
        })(Button);
        ui.ImageButton = ImageButton;

        var TextButton = (function (_super) {
            __extends(TextButton, _super);
            function TextButton(text, event, background, font, color) {
                if (typeof text === "undefined") { text = ""; }
                if (typeof event === "undefined") { event = null; }
                _super.call(this, background, event);

                //add text into it.
                text = text.toUpperCase();

                this.text = new createjs.Text(text, font, color);
                this.text.textBaseline = "middle";
                this.text.textAlign = "center";

                //createHitArea
                if (background == null) {
                    this.width = this.text.getMeasuredWidth() * 1.5;
                    this.height = this.text.getMeasuredHeight() * 1.5;
                }

                this.addChild(this.text);
                this.createHitArea();
            }
            return TextButton;
        })(ImageButton);
        ui.TextButton = TextButton;

        var IconButton = (function (_super) {
            __extends(IconButton, _super);
            function IconButton(icon, text, background, event, font, color) {
                if (typeof icon === "undefined") { icon = ""; }
                if (typeof text === "undefined") { text = ""; }
                if (typeof event === "undefined") { event = null; }
                if (typeof font === "undefined") { font = null; }
                if (typeof color === "undefined") { color = null; }
                //add space before text
                if (text != "")
                    text = " " + text;

                _super.call(this, text, event, background, font, color);

                //loads icon Image
                this.icon = gameui.AssetsManager.getBitmap(icon);
                this.addChild(this.icon);

                if (this.icon.getBounds()) {
                    this.icon.regY = this.icon.getBounds().height / 2;
                    this.icon.x = -(40 + this.icon.getBounds().width + this.text.getMeasuredWidth()) / 2;
                    this.text.x = this.icon.x + this.icon.getBounds().width;
                }
            }
            return IconButton;
        })(TextButton);
        ui.IconButton = IconButton;
    })(gameui.ui || (gameui.ui = {}));
    var ui = gameui.ui;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    (function (ui) {
        var MenuContainer = (function (_super) {
            __extends(MenuContainer, _super);
            function MenuContainer(width, height, flowHorizontal) {
                if (typeof width === "undefined") { width = null; }
                if (typeof height === "undefined") { height = null; }
                if (typeof flowHorizontal === "undefined") { flowHorizontal = false; }
                if (!flowHorizontal)
                    _super.call(this, 1, 0, width, height, 0, flowHorizontal);
                else
                    _super.call(this, 0, 1, width, height, 0, flowHorizontal);
            }
            //adds a text object
            MenuContainer.prototype.addLabel = function (text) {
                var textObj;
                textObj = new ui.Label(text);
                this.addObject(textObj);
                return textObj.textField;
            };

            //creates a button object
            MenuContainer.prototype.addButton = function (text, event) {
                if (typeof event === "undefined") { event = null; }
                var buttonObj = new ui.TextButton(text, event);
                this.addObject(buttonObj);
                return buttonObj;
            };

            MenuContainer.prototype.addOutButton = function (text, event) {
                if (typeof event === "undefined") { event = null; }
                var buttonObj = new ui.TextButton(text, event);
                this.addObject(buttonObj);
                return buttonObj;
            };
            return MenuContainer;
        })(ui.Grid);
        ui.MenuContainer = MenuContainer;
    })(gameui.ui || (gameui.ui = {}));
    var ui = gameui.ui;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    (function (ui) {
        var Label = (function (_super) {
            __extends(Label, _super);
            //public container: createjs.Container;
            function Label(text, font, color) {
                if (typeof text === "undefined") { text = ""; }
                if (typeof font === "undefined") { font = "600 90px Myriad Pro"; }
                if (typeof color === "undefined") { color = "#82e790"; }
                _super.call(this);
                text = text.toUpperCase();

                //add text into it.
                this.textField = new createjs.Text(text, font, color);
                this.textField.textBaseline = "middle";
                this.textField.textAlign = "center";
                this.addChild(this.textField);
            }
            return Label;
        })(ui.UIItem);
        ui.Label = Label;
    })(gameui.ui || (gameui.ui = {}));
    var ui = gameui.ui;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    var ScreenState = (function () {
        function ScreenState() {
            this.view = new createjs.Container();
            this.content = new createjs.Container();
            this.header = new createjs.Container();
            this.footer = new createjs.Container();
            this.background = new createjs.Container();

            this.view.addChild(this.background);
            this.view.addChild(this.content);
            this.view.addChild(this.header);
            this.view.addChild(this.footer);
        }
        ScreenState.prototype.activate = function (parameters) {
            this.content.visible = true;
        };

        ScreenState.prototype.desactivate = function (parameters) {
            this.content.visible = false;
        };

        ScreenState.prototype.redim = function (headerY, footerY, width) {
            this.footer.y = footerY;
            this.header.y = headerY;

            var dh = footerY + headerY;
            var ch = footerY - headerY;
            var scale = ch / dh;

            if (scale < 1) {
                scale = 1;
                this.background.y = 0;
                this.background.x = 0;
            } else {
                this.background.y = headerY;
                this.background.x = -(width * scale - width) / 2;
            }

            this.background.scaleX = this.background.scaleY = scale;
        };

        ScreenState.prototype.back = function () {
            exitApp();
        };
        return ScreenState;
    })();
    gameui.ScreenState = ScreenState;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    var GameScreen = (function () {
        //-----------------------------------------------------------------------
        function GameScreen(canvasElement, gameWidth, gameHeight, fps, showFps) {
            if (typeof fps === "undefined") { fps = 60; }
            var _this = this;
            //Initializes canvas Context
            this.myCanvas = document.getElementById(canvasElement);
            var ctx = this.myCanvas.getContext("2d");
            this.stage = new createjs.Stage(this.myCanvas);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.addEventListener("tick", function () {
                _this.stage.update();
            });
            createjs.Ticker.setFPS(fps);

            //Initialize screenViewer
            this.viewer = new createjs.Container();
            this.stage.addChild(this.viewer);

            //Framerate meter
            if (showFps) {
                var fpsMeter = new createjs.Text("FPS", " 18px Arial ", "#fff");
                fpsMeter.x = 0;
                fpsMeter.y = 0;
                this.stage.addChild(fpsMeter);
                createjs.Ticker.addEventListener("tick", function () {
                    fpsMeter.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + " FPS";
                });
            }

            //set screen size
            //if (parseInt(getQueryVariable("res"))) var windowWidth = forcedWidth;
            var windowWidth = window.innerWidth;
            this.resizeGameScreen(windowWidth, window.innerHeight);
            window.onresize = function () {
                _this.resizeGameScreen(windowWidth, window.innerHeight);
            };
        }
        //switch current screen, optionaly with a pre defined transition
        GameScreen.prototype.switchScreen = function (newScreen, parameters, transition) {
            var _this = this;
            //applies a default trainsition
            //TODO to it better
            if (!transition)
                transition = new gameui.Transition();

            //save oldscreen
            var oldScreen = this.currentScreen;

            //if transition
            if (transition && oldScreen) {
                //and transition = fade
                if (transition.type == "fade") {
                    //fade between transitions
                    newScreen.view.alpha = 0;
                    newScreen.view.mouseEnabled = false;
                    oldScreen.view.mouseEnabled = false;
                    createjs.Tween.get(newScreen.view).to({ alpha: 1 }, transition.time).call(function () {
                        newScreen.view.mouseEnabled = true;
                        oldScreen.view.mouseEnabled = true;
                        _this.removeOldScreen(oldScreen);
                        oldScreen = null;
                    });
                } else {
                    this.removeOldScreen(oldScreen);
                    oldScreen = null;
                }
            } else {
                this.removeOldScreen(oldScreen);
                oldScreen = null;
            }

            //adds the new screen on viewer
            newScreen.activate(parameters);
            this.viewer.addChild(newScreen.view);

            this.currentScreen = newScreen;

            //updates current screen
            if (this.currentScreen)
                this.currentScreen.redim(this.headerPosition, this.footerPosition, this.defaultWidth);
        };

        //resize GameScreen to a diferent scale
        GameScreen.prototype.resizeGameScreen = function (deviceWidth, deviceHeight, updateCSS) {
            if (typeof updateCSS === "undefined") { updateCSS = true; }
            this.myCanvas.width = deviceWidth;
            this.myCanvas.height = deviceHeight;

            this.updateViewerScale(deviceWidth, deviceHeight, this.defaultWidth, this.defaultHeight);
            if (updateCSS)
                setMobileScale(deviceWidth);
        };

        //updates screen viewer scale
        GameScreen.prototype.updateViewerScale = function (realWidth, realHeight, defaultWidth, defaultHeight) {
            var scale = realWidth / defaultWidth;
            var currentHeight = realHeight / scale;
            var currentWidth = realWidth / scale;
            this.defaultWidth = defaultWidth;

            //set header and footer positions
            this.headerPosition = -(currentHeight - defaultHeight) / 2;
            this.footerPosition = defaultHeight + (currentHeight - defaultHeight) / 2;

            //set the viewer offset to centralize in window
            this.viewer.scaleX = this.viewer.scaleY = scale;
            this.viewer.y = this.viewerOffset = (currentHeight - defaultHeight) / 2 * scale;

            //updates current screen
            if (this.currentScreen)
                this.currentScreen.redim(this.headerPosition, this.footerPosition, this.defaultWidth);
        };

        //deletes old screen
        GameScreen.prototype.removeOldScreen = function (oldScreen) {
            if (oldScreen != null) {
                oldScreen.desactivate();
                this.viewer.removeChild(oldScreen.view);
                oldScreen = null;
            }
        };
        return GameScreen;
    })();
    gameui.GameScreen = GameScreen;
})(gameui || (gameui = {}));
var gameui;
(function (gameui) {
    // Class
    var AssetsManager = (function () {
        function AssetsManager() {
        }
        AssetsManager.loadAssets = function (assetsManifest, spriteSheets, imagesArray) {
            this.spriteSheets = spriteSheets ? spriteSheets : [];
            this.assetsManifest = assetsManifest;

            //create a image array
            this.imagesArray = new Array();

            //creates a preload queue
            this.loader = new createjs.LoadQueue(false);

            //install sound plug-in for sounds format
            this.loader.installPlugin(createjs.Sound);

            //create eventListeners
            this.loader.addEventListener("fileload", function (evt) {
                if (evt.item.type == "image")
                    imagesArray[evt.item.id] = evt.result;
                return true;
            });

            //loads entire manifest
            this.loader.loadManifest(this.assetsManifest);

            return this.loader;
        };

        AssetsManager.getImagesArray = function () {
            return this.imagesArray;
        };

        AssetsManager.getBitmap = function (name) {
            if (this.spriteSheets[name])
                return this.getSprite(name, false);
            else
                return new createjs.Bitmap(this.getImage(name));
        };

        AssetsManager.getImage = function (name) {
            return this.loader.getResult(name);
        };

        //DEPRECIATED
        //get a movie clip
        AssetsManager.getMovieClip = function (name) {
            var t = new window[name];
            return t;
        };

        //return a sprite according to the image
        AssetsManager.getSprite = function (name, play) {
            if (typeof play === "undefined") { play = true; }
            var data = this.spriteSheets[name];
            for (var i in data.images)
                if (typeof data.images[i] == "string")
                    data.images[i] = this.getImage(data.images[i]);

            var spritesheet = new createjs.SpriteSheet(data);

            var sprite = new createjs.Sprite(spritesheet);
            if (play)
                sprite.play();
            return sprite;
        };
        return AssetsManager;
    })();
    gameui.AssetsManager = AssetsManager;
})(gameui || (gameui = {}));
/// <reference path="script/typing/createjs/createjs.d.ts" />
/*GameUI JS*/
/// <reference path="typescript/UI/UIItem.ts" />
/// <reference path="typescript/UI/Grid.ts" />
/// <reference path="typescript/UI/Button.ts" />
/// <reference path="typescript/UI/MenuContainer.ts" />
/// <reference path="typescript/UI/Label.ts" />
/// <reference path="typescript/ScreenState.ts" />
/// <reference path="typescript/GameScreen.ts" />
/// <reference path="typescript/AssetsManager.ts" />
var gameui;
(function (gameui) {
    var Transition = (function () {
        function Transition() {
            this.time = 300;
            this.type = "fade";
        }
        return Transition;
    })();
    gameui.Transition = Transition;
})(gameui || (gameui = {}));
