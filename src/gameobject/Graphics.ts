import Circle from '../geometry/Circle'
import Point from '../geometry/Point'
import Polygon from '../geometry/Polygon'
import Rectangle from '../geometry/Rectangle'
import { ComplexShape } from '../geometry/Shape'
import Triangle from '../geometry/Triangle'
import Color from '../math/Color'
import Canvas from '../renderer/canvas/Canvas'
import Texture from '../renderer/texture/Texture'

export default class Graphics {
    private canvas: Canvas

    private _colorsCache: any[] = []

    public constructor(canvas: Canvas) {
        this.canvas = canvas
    }

    public get context(): CanvasRenderingContext2D {
        return this.canvas.context
    }

    public drawParticle(texture: Texture, x: number, y: number): void {
        if (this.context != null) {
            this.drawTexture(texture, x, y)
        }
    }

    public drawTexture(texture: Texture, x: number, y: number, viewport?: Rectangle): void {
        if (this.context != null) {
            if (viewport) {
                this.context.drawImage(
                    texture.buffer.canvas,
                    viewport.x,
                    viewport.y,
                    viewport.width,
                    viewport.height,
                    x,
                    y,
                    viewport.width,
                    viewport.height,
                )
            } else {
                this.context.drawImage(texture.buffer.canvas, x, y, texture.frame.width, texture.frame.height)
            }
        }
    }

    public drawShape(
        shape: Rectangle | Triangle | Circle | Polygon | ComplexShape,
        fill = true,
        color: Color = Color.Black,
    ): void {
        if (this.context == null) {
            return
        }

        if (fill) {
            this.context.fillStyle = this.colorToString(color)
        } else {
            this.context.strokeStyle = this.colorToString(color)
        }

        this.context.globalAlpha = color.a

        // this.context.save();

        // Use HTML5 functions
        if (shape instanceof Rectangle) {
            this.drawRectangle(shape, fill)
        } else {
            this.context.beginPath()

            if (shape instanceof Circle) {
                this.drawCircle(shape)
            } else {
                this.drawPolygon(shape.points)
            }

            this.context.closePath()

            if (fill) {
                this.context.fill()
            } else {
                this.context.stroke()
            }
        }

        if (color.a < 255) {
            this.context.globalAlpha = 1
        }

        // this.context.restore();
    }

    public writeTextAt(
        text: string,
        x: number,
        y: number,
        color: Color = Color.Black,
        font = 'sans-serif',
        size = 16,
        lineSpacing?: number,
    ): void {
        if (this.context != null) {
            this.context.fillStyle = this.colorToString(color)
            this.context.font = size + 'px ' + font

            if (text.indexOf('\n') > -1) {
                // Un texte multiligne
                const parts = text.split('\n')
                const spacing = lineSpacing || size + size / 8

                for (const part of parts) {
                    this.context.fillText(part, x, y + size)
                    y += spacing
                }
            } else {
                this.context.fillText(text, x, y + size)
            }
        }
    }

    private drawCircle(shape: Circle): void {
        this.context.arc(shape.x, shape.y, shape.radius, 0, Math.PI * 2)
    }

    private drawPolygon(points: Point[]): void {
        if (points.length > 0) {
            this.context.moveTo(points[0].x, points[0].y)

            for (let i = 0; i < points.length; i++) {
                const p1: Point = points[i]
                let p2 = null

                if (i === points.length - 1) {
                    p2 = points[0]
                } else {
                    p2 = points[i + 1]
                }

                if (!p1 || !p2) {
                    break
                }

                this.context.lineTo(p2.x, p2.y)
            }
        }
    }

    private drawRectangle(shape: Rectangle, fill: boolean): void {
        if (fill) {
            this.context.fillRect(shape.x, shape.y, shape.width, shape.height)
        } else {
            this.context.strokeRect(shape.x, shape.y, shape.width, shape.height)
        }
    }

    private colorToString(color: Color): string {
        const cacheColor = this._colorsCache[color.value]
        if (cacheColor) {
            return cacheColor
        }

        const str = color.rgba
        this._colorsCache[color.value] = str
        return str
    }
}
