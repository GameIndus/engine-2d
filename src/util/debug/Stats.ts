import Game from '../../core/Game'
import Time from '../../time/Time'
import StatsPanel from './StatsPanel'

/**
 *  Adapted from Stats.js (https://github.com/mrdoob/stats.js)
 */
export default class Stats {
    private _game: Game

    private _beginTime: number

    private _prevTime: number

    private _frames: number

    private _fpsPanel: StatsPanel

    private _msPanel: StatsPanel

    private _mode: number

    private _container: HTMLElement

    public constructor(game: Game) {
        this._game = game
        this._beginTime = -1
        this._prevTime = -1
        this._frames = -1
        this._fpsPanel = StatsPanel.prototype
        this._msPanel = StatsPanel.prototype
        this._mode = 0
        this._container = HTMLElement.prototype
    }

    public get mode(): number {
        return this._mode
    }

    public get container(): HTMLElement {
        return this._container
    }

    public boot(): void {
        this._container = document.createElement('div')
        this._container.style.cssText = 'position:absolute;top:10px;left:10px;cursor:pointer;opacity:0.9;z-index:9999'

        this._container.addEventListener(
            'click',
            event => {
                event.preventDefault()
                this.showPanel(++this._mode % this.container.children.length)
            },
            false,
        )

        // Init update loop variables
        this._frames = 0
        this._beginTime = Time.now()
        this._prevTime = this._beginTime

        // Add FPS & MS panels
        this._fpsPanel = this.addPanel(new StatsPanel('FPS', '#0ff', '#002'))
        this._msPanel = this.addPanel(new StatsPanel('MS', '#0f0', '#020'))

        this.showPanel(this._mode)

        // Append the stats container to the main container
        this._game.canvas.wrapper.appendChild(this.container)
    }

    public addPanel(panel: StatsPanel): StatsPanel {
        this.container.appendChild(panel.canvas)
        return panel
    }

    public showPanel(id: number): void {
        for (let i = 0; i < this.container.children.length; i++) {
            ;(this.container.children[i] as HTMLElement).style.display = i === id ? 'block' : 'none'
        }

        this._mode = id
    }

    public begin(): void {
        this._beginTime = Time.now()
    }

    public end(): number {
        const time = Time.now()

        this._frames++
        this._msPanel.update(time - this._beginTime, 200)

        if (time > this._prevTime + 1000) {
            this._fpsPanel.update((this._frames * 1000) / (time - this._prevTime), 100)

            this._prevTime = time
            this._frames = 0
        }

        return time
    }
}
