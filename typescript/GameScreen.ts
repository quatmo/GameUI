declare function getQueryVariable(variable: string);
declare function setMobileScale(a: number);
declare var assetscale: number;

module gameui{

    export class GameScreen {
        
        public stage: createjs.Stage;
        private myCanvas: HTMLCanvasElement;

        private defaultWidth: number;
        private defaultHeight: number;

        private canvasWidth: number;
        private canvasHeight: number;

        //Screen arrangement
        private headerPosition: number;
        private footerPosition: number;
        private viewerOffset: number;

        //Screen state
        private currentScreen: gameui.ScreenState;

        //screen content
        private screenContainer: createjs.Container;

        //-----------------------------------------------------------------------

        constructor(canvasElement: string, gameWidth: number, gameHeight?: number, fps:number=60, showFps?: boolean) {

            this.defaultWidth = gameWidth;
            this.defaultHeight = gameHeight;

            //Initializes canvas Context            
            this.myCanvas = <HTMLCanvasElement> document.getElementById(canvasElement);
            var ctx: any = this.myCanvas.getContext("2d");
            this.stage = new createjs.Stage(this.myCanvas);
            createjs.Touch.enable(this.stage);
            createjs.Ticker.addEventListener("tick", () => {this.stage.update();});
            createjs.Ticker.setFPS(fps);

            this.screenContainer = new createjs.Container();
            this.stage.addChild(this.screenContainer);

            //Framerate meter
            if (showFps) {
               var fpsMeter = new createjs.Text("FPS", " 18px Arial ", "#fff");
                fpsMeter.x = 0;
                fpsMeter.y = 0;
                this.stage.addChild(fpsMeter);
                createjs.Ticker.addEventListener("tick", () => {
                    fpsMeter.text = Math.floor(createjs.Ticker.getMeasuredFPS()) + " FPS";
                });
            }
        
            var windowWidth = window.innerWidth;
            this.resizeGameScreen(windowWidth, window.innerHeight);
            window.onresize = () => { this.resizeGameScreen(windowWidth, window.innerHeight); };
        }

        //switch current screen, optionaly with a pre defined transition
        public switchScreen(newScreen: gameui.ScreenState, parameters?: any, transition?: Transition) {

            //applies a default trainsition
            //TODO to it better
            if (!transition) transition = new Transition();

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
                    createjs.Tween.get(newScreen.view).to({ alpha: 1 }, transition.time).call(() => {
                        newScreen.view.mouseEnabled = true;
                        oldScreen.view.mouseEnabled = true;
                        this.removeOldScreen(oldScreen)
                        oldScreen = null;
                    });
                }
                else {
                    this.removeOldScreen(oldScreen);
                    oldScreen = null;
                }
            }

            //if there is no transistion siply remove screen
            else {
                this.removeOldScreen(oldScreen);
                oldScreen = null;
            }

            //adds the new screen on viewer
            newScreen.activate(parameters);
            this.screenContainer.addChild(newScreen.view);

            this.currentScreen = newScreen;

            //updates current screen
            if (this.currentScreen) this.currentScreen.redim(this.headerPosition, this.footerPosition, this.defaultWidth);
        }

        //resize GameScreen to a diferent scale
        private resizeGameScreen(deviceWidth: number, deviceHeight: number, updateCSS: boolean= true) {

            this.myCanvas.width = deviceWidth;
            this.myCanvas.height = deviceHeight;

            this.updateViewerScale(deviceWidth, deviceHeight, this.defaultWidth, this.defaultHeight);
            //if (updateCSS) setMobileScale(deviceWidth)
        }

        //updates screen viewer scale
        private updateViewerScale(realWidth: number, realHeight: number, defaultWidth: number, defaultHeight: number) {

            var scale = realWidth / defaultWidth;
            var currentHeight = realHeight / scale;
            var currentWidth = realWidth / scale;
            this.defaultWidth = defaultWidth;

            //set header and footer positions
            this.headerPosition = -(currentHeight - defaultHeight) / 2;
            this.footerPosition = defaultHeight + (currentHeight - defaultHeight) / 2;

            //set the viewer offset to centralize in window
            this.screenContainer.scaleX = this.screenContainer.scaleY = scale;
            this.screenContainer.y = this.viewerOffset = (currentHeight - defaultHeight) / 2 * scale;

            //updates current screen
            if (this.currentScreen) this.currentScreen.redim(this.headerPosition, this.footerPosition, this.defaultWidth);
        }

        //deletes old screen
        private removeOldScreen(oldScreen: gameui.ScreenState) {
            if (oldScreen != null) {
                oldScreen.desactivate();
                this.screenContainer.removeChild(oldScreen.view);
                oldScreen = null;
            }
        }
    }
}

