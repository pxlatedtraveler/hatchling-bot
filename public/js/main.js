//////////////////////////////////////////////////
// PIXI
//////////////////////////////////////////////////

let renderer = new PIXI.Renderer({ width: 910, height: 411,  transparent: true, antialias: true, resolution: 1});
renderer.plugins.interaction.autoPreventDefault = false;
renderer.view.style.touchAction = 'auto';

let stage =  new PIXI.Container();
//stage.interactive = true;

const loader = PIXI.Loader.shared;

document.getElementById('app').appendChild(renderer.view);

let headerContainer;
let headerSprite;

let animEmotesContainer;
let animEmotes = [];

initialize();

function initialize()
{
    load();
}

function load()
{
    loader.add('titleSprite', './assets/title.png')
          .add('anim01Json', './assets/spritesheets/emotesAnim01.json')
          .add('anim02Json', './assets/spritesheets/emotesAnim02.json')
          .load((loader, resource) =>
          {
                onAssetsLoaded(resource);
          });
}

function onAssetsLoaded(resource)
{
    headerContainer = new PIXI.Container();
    headerSprite = new PIXI.Sprite(resource.titleSprite.texture);

    animEmotesContainer = new PIXI.Container();

    animEmotes[0] = new PIXI.AnimatedSprite(resource.anim02Json.spritesheet.animations['blush']);
    animEmotes[1] = new PIXI.AnimatedSprite(resource.anim01Json.spritesheet.animations['lol']);
    animEmotes[2] = new PIXI.AnimatedSprite(resource.anim02Json.spritesheet.animations['tea']);

    for(let i = 0; i < 3; i++)
    {
        animEmotes[i].x = animEmotes[i].width * i;
        animEmotes[i].y = headerSprite.height + 20;
        animEmotes[i].animationSpeed = 0.5;
        animEmotes[i].loop = true;
        animEmotes[i].play();
    }

    animEmotesContainer.addChild(animEmotes[0], animEmotes[1], animEmotes[2]);
    headerContainer.addChild(headerSprite, animEmotesContainer);

    animEmotesContainer.x = headerContainer.width / 2 - animEmotesContainer.width / 2;

    stage.addChild(headerContainer);

    headerContainer.x = stage.width / 2 - headerContainer.width / 2;



    animate();

    console.log('assets loaded');
}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(stage);
}