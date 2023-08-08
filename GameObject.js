class GameObject {
    constructor(config) {
        this.id = null;
        this.isMounted = false;
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png",
        })

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
    }

    mount(map) {
        console.log("mounting")
        this.isMounted = true;
        map.addWall(this.x, this.y);

        // if we have a behavior, kick off after a short delay
        setTimeout(() => {this.doBehaviorEvent(map)}, 10) //10
    }

    update() {
    }

    async doBehaviorEvent(map) {

        // don't do anything if there is a more important cuscene or I don't have a config
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
            return;
        }

        // setting up our event with relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];

        eventConfig.who = this.id;

        // create an event instnace out of our next event config
        const eventHandler = new OverworldEvent({map, event: eventConfig});
        await eventHandler.init();

        // setting the next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        // do it again!
        this.doBehaviorEvent(map);
    }
}
