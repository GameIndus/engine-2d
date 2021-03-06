import GameObject from '../gameobject/GameObject'
import GeometricObject from '../gameobject/GeometricObject'
import { ParticleEmitter, ParticleEmitterConfig } from '../gameobject/ParticleEmitter'
import { Sprite, SpriteConfig } from '../gameobject/Sprite'
import TextObject from '../gameobject/TextObject'
import Point from '../geometry/Point'
import Position from '../geometry/Position'
import { Size } from '../geometry/Rectangle'
import { ComplexShape, ShapeType } from '../geometry/Shape'
import Color from '../math/Color'
import Util from '../util/Util'
import Camera from './Camera'
import Game from './Game'

// THINK MANAGE A ATL + TAB CANNT MOVE

export default class Scene {
    private readonly game: Game

    private readonly _id: number

    private readonly _name: string

    private readonly _gameobjects: GameObject[]

    private _camera: Camera

    private _cameras: Camera[]

    private _sortedGameobjects: GameObject[] = []

    private _gameobjectsRendered = 0

    private _currentObjectId = 0

    private _counterCameraId = 0

    public constructor(game: Game, name: string, camera?: Camera) {
        this.game = game
        this._id = -1
        this._name = name
        this._gameobjects = []
        this._camera = camera || new Camera(game)
        this._cameras = []
    }

    public get id(): number {
        return this._id
    }

    public get name(): string {
        return this._name
    }

    public get gameobjects(): GameObject[] {
        return this._gameobjects
    }

    public get camera(): Camera {
        return this._camera
    }

    public set camera(camera: Camera) {
        this._camera = camera
    }

    public get cameras(): Camera[] {
        return this._cameras
    }

    public add(gameobject: GameObject): GameObject {
        gameobject.id = this._currentObjectId
        if (!gameobject.name) {
            gameobject.name = 'g_' + this._currentObjectId
        }

        this._currentObjectId++

        this._gameobjects.push(gameobject)
        return gameobject
    }

    public addCamera(camera: Camera): Camera {
        camera.id = this._counterCameraId
        if (!camera.name) {
            camera.name = 'c_' + this._counterCameraId
        }

        this._counterCameraId++

        // TODO Change ???
        if (camera.id === 0) {
            this.camera = camera
        }
        this._cameras.push(camera)
        return camera
    }

    public createCamera(name: string, position?: Position, viewport?: Size, target?: GameObject): Camera {
        const camera = new Camera(this.game, name, position, viewport, target)
        this.addCamera(camera)
        return camera
    }

    public createShape(
        name: string,
        shapeType?: ShapeType,
        position?: Position,
        size?: Size | number,
        color?: Color,
    ): GeometricObject {
        const geometricObject = new GeometricObject(this.game, name, shapeType, position, size, color)

        this.add(geometricObject)
        return geometricObject
    }

    public createComplexShape(
        name: string,
        shape: ComplexShape,
        position?: Position,
        size?: Size | number,
        color?: Color,
    ): GeometricObject {
        const geometricObject = new GeometricObject(
            this.game,
            name,
            ShapeType.COMPLEX,
            position,
            size,
            color,
            true,
            shape,
        )

        this.add(geometricObject)
        return geometricObject
    }

    public createCustomShape(name: string, points: Point[], color?: Color): GeometricObject {
        const geometricObject = new GeometricObject(
            this.game,
            name,
            ShapeType.POLYGON,
            new Position(),
            null,
            color,
            true,
            {
                points,
                calculatePoints(): Point[] {
                    return []
                },
            },
        )

        this.add(geometricObject)
        return geometricObject
    }

    public createParticleEmitter(name: string, config?: ParticleEmitterConfig): ParticleEmitter {
        const emitter = new ParticleEmitter(this.game, name, config)

        this.add(emitter)
        return emitter
    }

    public createSprite(
        name: string,
        texture: string,
        position?: Position,
        size?: Size | number,
        config?: SpriteConfig,
    ): Sprite {
        const sprite = new Sprite(this.game, name, texture, position, size, config)

        this.add(sprite)
        return sprite
    }

    public createText(name: string, text: string, position?: Position, color?: Color): TextObject {
        const textObject = new TextObject(this.game, name, text)

        if (position) {
            textObject.position = position
        }
        if (color) {
            textObject.color = color
        }

        this.add(textObject)
        return textObject
    }

    public get(name: string): GameObject | null {
        for (const gameobject of this.gameobjects) {
            if (gameobject.name === name) {
                return gameobject
            }
        }

        return null
    }

    public update(): void {
        for (const gameobject of this._gameobjects) {
            gameobject._update()
        }
    }

    public render(time: number): void {
        // Sort gameobjects by layer when its needed
        if (this._gameobjects.length !== this._gameobjectsRendered) {
            this._sortedGameobjects = Util.sortArrayByProperty(this._gameobjects, 'layer')
            this._gameobjectsRendered = this._gameobjects.length
        }

        for (const gameobject of this._sortedGameobjects) {
            gameobject.render(this.game.graphics, time)
        }
    }
}
