module gameui.ui {

    // Class
    export class Button extends UIItem  {

        public enableAnimation = true;

        private originalScaleX: number;
        private originalScaleY: number;
        private mouse = false;

        constructor() {
            super();
            this.addEventListener("mousedown", (event: createjs.MouseEvent) => { this.onPress(event); });
            this.addEventListener("pressup", (event: createjs.MouseEvent) => { this.onPressUp(event); });

            this.addEventListener("mouseover", () => { this.mouse = true; });
            this.addEventListener("mouseout", () => { this.mouse = false; });


        }                                      

        public returnStatus(): void {
            if (!this.mouse) {
                this.scaleX = this.originalScaleX;
                this.scaleY = this.originalScaleY;
            }
        }

        private onPressUp(Event: createjs.MouseEvent) {
            this.mouse = false;
            //createjs.Tween.removeTweens(this);
            this.set({ scaleX: this.originalScaleX * 1.1, scaleY: this.originalScaleY * 1.1 });
            createjs.Tween.get(this).to({ scaleX: this.originalScaleX, scaleY: this.originalScaleY }, 200, createjs.Ease.backOut);
        }

        private onPress(Event: createjs.MouseEvent) {
            if (!this.enableAnimation) return

            this.mouse = true;
            if (this.originalScaleX == null) {
                this.originalScaleX = this.scaleX;
                this.originalScaleY = this.scaleY;
            }


            createjs.Tween.get(this).to({ scaleX: this.originalScaleX * 1.1, scaleY: this.originalScaleY * 1.1 }, 500, createjs.Ease.elasticOut).call(() => {
                if (!this.mouse) {
                    createjs.Tween.get(this).to({ scaleX: this.originalScaleX, scaleY: this.originalScaleY }, 300, createjs.Ease.backOut);
                }
            });
        }

    }

    export class ImageButton extends Button {

        public background: createjs.DisplayObject;

        constructor(image: string, event: (event?: createjs.MouseEvent) => any) {
            super();

            if (event != null) this.addEventListener("click", event);
           
            //adds image into it
            if (image != null) {
                //TODO tirar createjs ASSETS daqui.
                this.background = AssetsManager.getBitmap(image);
                this.addChildAt(this.background, 0);

                //Sets the image into the pivot center.
                if (this.background.getBounds()) {
                    this.width = this.background.getBounds().width ;
                    this.height = this.background.getBounds().height ;
                    this.background.regX = this.width / 2;
                    this.background.regY = this.height / 2;
                    this.centered = true;
                    this.createHitArea();
                }

            }
        }
    }

    export class TextButton extends ImageButton {

        public text: createjs.Text;

        constructor(text: string = "", font?: string, color?: string , background?: string,  event?: (event: createjs.MouseEvent) => any) {
            super(background,event);

            //add text into it.
            text = text.toUpperCase();

            this.text = new createjs.Text(text, font, color);
            this.text.textBaseline = "middle";
            this.text.textAlign = "center";
            //createHitArea
            if (background == null)
            {
                this.width = this.text.getMeasuredWidth() *1.5;
                this.height= this.text.getMeasuredHeight()*1.5;
            }
            
            this.addChild(this.text);
            this.createHitArea();
        }
    }

    export class IconButton extends TextButton {

        public icon: createjs.DisplayObject;

        constructor(icon: string = "", text = "", font: string = null, color?: string , background?: string, event?: (event: createjs.MouseEvent) => any) {

            //add space before text
            if (text != "") text = " " + text;
            
            super(text, font, color ,background, event);

            //loads icon Image
            this.icon = AssetsManager.getBitmap(icon);
            this.addChild(this.icon);

            if (this.icon.getBounds()) {
                this.icon.regY = this.icon.getBounds().height / 2;
                this.icon.x = -(40 + this.icon.getBounds().width + this.text.getMeasuredWidth()) / 2;
                this.text.x =  this.icon.x + this.icon.getBounds().width;
            }
            
        }
    }
}