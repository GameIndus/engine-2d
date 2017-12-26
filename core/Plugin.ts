abstract class Plugin {

    private _game: Game;

    private _id: number;

    private _name: string;

    private _registered: boolean;

    public constructor(public name: string) {
        this._name = name;
    }

    protected get game(): Game {
        return this._game;
    }

    public get id(): number {
        return this._id;
    }

    public abstract onEnable(): void;

    public abstract onDisable(): void;

    public onPreRender(): void {
    }

    public onRender(): void {
    }

    public onPostRender(): void {
    }

    public onPreUpdate(): void {
    }

    public onUpdate(): void {

    }

    public onPostUpdate(): void {
    }

    register(game: Game, id: number): boolean {
        if (this._registered) return false;

        this._registered = true;
        this._game = game;
        this._id = id;

        this.onEnable();
        return true;
    }

    unregister(): boolean {
        if (!this._registered) return false;

        this._registered = false;
        this._game = null;
        this._id = -1;

        this.onDisable();
        return true;
    }

}