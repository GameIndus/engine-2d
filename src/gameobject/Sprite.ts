import Game from '../core/Game'
import Position from '../geometry/Position'
import Rectangle from '../geometry/Rectangle'
import Texture from '../renderer/texture/Texture'
import SpriteAnimation from './animator/SpriteAnimation'
import GameObject from './GameObject'

export class Sprite extends GameObject {
    private readonly _texture: Texture

    private _animation: SpriteAnimation | null

    private _viewport: Rectangle = new Rectangle(0, 0, 0, 0)

    private _animations: SpriteAnimation[] = []

    private _animated = true

    public constructor(
        game: Game,
        name: string,
        ressource: string,
        position?: Position,
        size?: number | any,
        config?: SpriteConfig,
    ) {
        super(game, name)

        if (size) {
            if (typeof size === 'number') {
                this.setSize(size, size)
            } else if (size instanceof Object) {
                this.setSize(size.width, size.height)
            }
        }
        if (position) {
            this.setPosition(position.x, position.y)
        }

        if (config) {
            this._parseConfig(config)
        }

        if (this._viewport.width === 0 || this._viewport.height === 0) {
            this._viewport.width = this.renderSize.width
            this._viewport.height = this.renderSize.height
        }

        this._texture = new Texture(game, ressource)
        this._animation = null
    }

    public get texture(): Texture {
        return this._texture
    }

    public get viewport(): Rectangle {
        return this._viewport
    }

    public set viewport(viewport: Rectangle) {
        this._viewport = viewport
    }

    public get animations(): SpriteAnimation[] {
        return this._animations
    }

    public set animated(animated: boolean) {
        this._animated = animated
    }

    public get currentAnimation(): SpriteAnimation | null {
        return this._animation
    }

    public get isAnimated(): boolean {
        return this._animated
    }

    public createAnimation(
        name: string,
        frames: [number, number],
        speed: number,
        loop?: boolean,
        dir?: string,
    ): SpriteAnimation {
        const animation = new SpriteAnimation(this, name, frames, speed, loop, dir)

        this._animations.push(animation)
        return animation
    }

    public getAnimation(name: string): SpriteAnimation | null {
        for (const animation of this.animations) {
            if (animation.name === name) {
                return animation
            }
        }

        return null
    }

    public setCurrentAnimation(name: string): SpriteAnimation | null {
        const animation = this.getAnimation(name)
        if (animation) {
            this._animation = animation
        }

        return animation || null
    }

    public update(): void {
        if (this.currentAnimation) {
            this.currentAnimation.update(this.game.time.elapsed)
        }
    }

    public render(): void {
        if (this._texture.valid) {
            this.game.graphics.drawTexture(this._texture, this.renderPosition.x, this.renderPosition.y, this._viewport)
        }
    }

    private _parseConfig(config: SpriteConfig): void {
        if (config.viewport) {
            this._viewport = config.viewport
        }
        if (config.viewportWidth) {
            this._viewport.width = config.viewportWidth
        }
        if (config.viewportHeight) {
            this._viewport.height = config.viewportHeight
        }
    }
}

export interface SpriteConfig {
    viewport?: Rectangle
    viewportWidth?: number
    viewportHeight?: number
}
