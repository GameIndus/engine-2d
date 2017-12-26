// Inspired from www.mrspeaker.net/dev/parcycle/script/particle.js (Mr. Speaker)
class Particle extends GeometricObject {

    protected _animator: GeometricAnimator;
    private _massFactor: number = 0;

    public constructor(game: Game, emitter: ParticleEmitter) {
        super(game);
    }

    private _type: ParticleType = ParticleType.CIRCULAR;

    public get type(): ParticleType {
        return this._type;
    }

    public set type(type: ParticleType) {
        this._type = type;
    }

    private _texture: Texture;

    public get texture(): Texture {
        return this._texture;
    }

    private _lifeTime: number = 0;

    public get lifeTime(): number {
        return this._lifeTime;
    }

    public set lifeTime(lifeTime: number) {
        this._lifeTime = lifeTime;
    }

    private _sharpness: number = 0;

    public get sharpness(): number {
        return this._sharpness;
    }

    public set sharpness(sharpness: number) {
        this._sharpness = sharpness;
    }

    private _sizeCenter: number = 0;

    public get sizeCenter(): number {
        return this._sizeCenter;
    }

    public set sizeCenter(sizeCenter: number) {
        this._sizeCenter = sizeCenter;
    }

    private _mass: number = 0;

    public get mass(): number {
        return this._mass;
    }

    public set mass(mass: number) {
        this._mass = mass;
    }

    public spawn(): void {
        switch (this.type) {
            case ParticleType.GRADIENT:

                this._texture = new GradientTexture(this._game,
                    Gradient.createRadialGradient(this.size, this.sizeCenter, this.color, this.color)
                );
                break;
        }

        // console.log( this.animator._colorTween );
    }

    public update(): void {
        // Update mass
        if (this.mass > 0) {
            this._massFactor *= this.mass;
            this.velocity.addY(this._massFactor);
        }
    }

    public render(): void {
        switch (this.type) {
            case ParticleType.GRADIENT:

                if (this.texture != null) {
                    this._game.graphics.drawParticle(this.texture, this.renderPosition.x, this.renderPosition.y);
                }
                break;

            case ParticleType.CIRCULAR:
                let min = Math.min(this.renderSize.width, this.renderSize.height);

                this._game.graphics.drawShape(new Circle(this.renderPosition.x, this.renderPosition.y, min), true, this.color);
                break;

            case ParticleType.SQUARE:
                this._game.graphics.drawShape(new Rectangle(
                    this.renderPosition.x, this.renderPosition.y,
                    this.renderSize.width, this.renderSize.height
                ), true, this.color);
                break;

            case ParticleType.STAR:
                let star = new Star(4);
                star.calculatePoints(this.renderPosition, this.renderSize);

                this._game.graphics.drawShape(star, true, this.color);
                break;
        }
    }

}

enum ParticleType {
    GRADIENT,
    CIRCULAR,
    SQUARE,
    STAR,

    TEXTURED
}