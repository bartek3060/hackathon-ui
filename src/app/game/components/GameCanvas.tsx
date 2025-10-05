"use client";

import { useEffect, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { useGameStore } from "../store";
import { GAME_CONFIG, ASSETS } from "../constants";
import { audioManager } from "../audio";

const LOGICAL_WIDTH = GAME_CONFIG.WIDTH;
const LOGICAL_HEIGHT = GAME_CONFIG.HEIGHT;

interface PooledBullet {
  sprite: PIXI.Graphics;
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface PooledEnemy {
  sprite: PIXI.Sprite;
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

interface PooledPickup {
  sprite: PIXI.Sprite;
  active: boolean;
  x: number;
  y: number;
  vy: number;
  size: number;
  type: "coin" | "health" | "education";
}

interface Particle {
  sprite: PIXI.Graphics;
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

export function GameCanvas() {
  const phase = useGameStore((state) => state.phase);

  const [isAppReady, setIsAppReady] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<PIXI.Container | null>(null);
  const bulletsContainerRef = useRef<PIXI.Container | null>(null);
  const enemiesContainerRef = useRef<PIXI.Container | null>(null);
  const pickupsContainerRef = useRef<PIXI.Container | null>(null);
  const particlesContainerRef = useRef<PIXI.Container | null>(null);
  const shipSpriteRef = useRef<PIXI.Sprite | null>(null);
  const textElementsRef = useRef<PIXI.Text[]>([]);

  const playerPosRef = useRef({ x: 400, y: 1050 });
  const keysPressed = useRef<Set<string>>(new Set());
  const elapsedTimeRef = useRef(0);
  const invulnerableUntilRef = useRef(0);

  const bulletPoolRef = useRef<PooledBullet[]>([]);
  const lastFireTimeRef = useRef(0);

  const enemyPoolRef = useRef<PooledEnemy[]>([]);
  const lastEnemySpawnRef = useRef(0);

  const pickupPoolRef = useRef<PooledPickup[]>([]);
  const lastPickupSpawnRef = useRef(0);

  const particlePoolRef = useRef<Particle[]>([]);
  const app = useRef<PIXI.Application | null>(null);
  const loadedTexturesRef = useRef<string[]>([]);
  const isInitializingRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const previousPhaseRef = useRef<string>(phase);

  useEffect(() => {
    if (phase !== "playing") return;
    if (hasInitializedRef.current) return;
    if (!canvasRef.current || app.current || isInitializingRef.current) return;

    hasInitializedRef.current = true;
    isInitializingRef.current = true;
    
    let isMounted = true;
    const pixiApp = new PIXI.Application();
    app.current = pixiApp;

    (async () => {
      if (!isMounted) {
        isInitializingRef.current = false;
        return;
      }

      await pixiApp.init({
        canvas: canvasRef.current!,
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000011,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: window,
      });

      if (!isMounted) {
        pixiApp.destroy(true);
        isInitializingRef.current = false;
        return;
      }

      const container = new PIXI.Container();
      containerRef.current = container;
      pixiApp.stage.addChild(container);

      const bulletsContainer = new PIXI.Container();
      bulletsContainerRef.current = bulletsContainer;
      container.addChild(bulletsContainer);

      const bulletPoolSize = GAME_CONFIG.BULLET.MAX_POOL_SIZE;
      for (let i = 0; i < bulletPoolSize; i++) {
        const bulletGraphic = new PIXI.Graphics();
        bulletGraphic.circle(0, 0, GAME_CONFIG.BULLET.SIZE / 2);
        bulletGraphic.fill(0xffff00);
        bulletGraphic.visible = false;
        bulletsContainer.addChild(bulletGraphic);

        bulletPoolRef.current.push({
          sprite: bulletGraphic,
          active: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
        });
      }

      const enemiesContainer = new PIXI.Container();
      enemiesContainerRef.current = enemiesContainer;
      container.addChild(enemiesContainer);

      const enemyPoolSize = GAME_CONFIG.ENEMY.MAX_ACTIVE;
      let enemyTexture: PIXI.Texture;
      try {
        enemyTexture = await PIXI.Assets.load(ASSETS.ENEMY);
        if (!isMounted) {
          pixiApp.destroy(true);
          isInitializingRef.current = false;
          return;
        }
        loadedTexturesRef.current.push(ASSETS.ENEMY);
      } catch (error) {
        console.warn("Failed to load enemy texture, using fallback", error);
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, GAME_CONFIG.ENEMY.SIZE / 2);
        graphics.fill(ASSETS.FALLBACK.ENEMY);
        enemyTexture = pixiApp.renderer.generateTexture(graphics);
      }

      for (let i = 0; i < enemyPoolSize; i++) {
        const enemySprite = new PIXI.Sprite(enemyTexture);
        enemySprite.anchor.set(0.5);
        enemySprite.width = GAME_CONFIG.ENEMY.SIZE;
        enemySprite.height = GAME_CONFIG.ENEMY.SIZE;
        enemySprite.visible = false;
        enemiesContainer.addChild(enemySprite);

        enemyPoolRef.current.push({
          sprite: enemySprite,
          active: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: GAME_CONFIG.ENEMY.SIZE,
        });
      }

      const pickupsContainer = new PIXI.Container();
      pickupsContainerRef.current = pickupsContainer;
      container.addChild(pickupsContainer);

      let coinTexture: PIXI.Texture;
      let healthTexture: PIXI.Texture;
      let educationTexture: PIXI.Texture;

      try {
        coinTexture = await PIXI.Assets.load(ASSETS.COIN);
        if (!isMounted) {
          pixiApp.destroy(true);
          isInitializingRef.current = false;
          return;
        }
        loadedTexturesRef.current.push(ASSETS.COIN);
      } catch (error) {
        console.warn("Failed to load coin texture, using fallback", error);
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, GAME_CONFIG.PICKUP.SIZE / 2);
        graphics.fill(ASSETS.FALLBACK.COIN);
        coinTexture = pixiApp.renderer.generateTexture(graphics);
      }

      try {
        healthTexture = await PIXI.Assets.load(ASSETS.HEALTH);
        if (!isMounted) {
          pixiApp.destroy(true);
          isInitializingRef.current = false;
          return;
        }
        loadedTexturesRef.current.push(ASSETS.HEALTH);
      } catch (error) {
        console.warn("Failed to load health texture, using fallback", error);
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, GAME_CONFIG.PICKUP.SIZE / 2);
        graphics.fill(ASSETS.FALLBACK.HEALTH);
        healthTexture = pixiApp.renderer.generateTexture(graphics);
      }

      try {
        educationTexture = await PIXI.Assets.load(ASSETS.EDUCATION);
        if (!isMounted) {
          pixiApp.destroy(true);
          isInitializingRef.current = false;
          return;
        }
        loadedTexturesRef.current.push(ASSETS.EDUCATION);
      } catch (error) {
        console.warn("Failed to load education texture, using fallback", error);
        const graphics = new PIXI.Graphics();
        graphics.circle(0, 0, GAME_CONFIG.PICKUP.SIZE / 2);
        graphics.fill(ASSETS.FALLBACK.EDUCATION);
        educationTexture = pixiApp.renderer.generateTexture(graphics);
      }

      const pickupPoolSize = GAME_CONFIG.PICKUP.MAX_ACTIVE;
      for (let i = 0; i < pickupPoolSize; i++) {
        const pickupSprite = new PIXI.Sprite(coinTexture);
        pickupSprite.anchor.set(0.5);
        pickupSprite.width = GAME_CONFIG.PICKUP.SIZE;
        pickupSprite.height = GAME_CONFIG.PICKUP.SIZE;
        pickupSprite.visible = false;
        pickupsContainer.addChild(pickupSprite);

        pickupPoolRef.current.push({
          sprite: pickupSprite,
          active: false,
          x: 0,
          y: 0,
          vy: 0,
          size: GAME_CONFIG.PICKUP.SIZE,
          type: "coin",
        });
      }

      (window as any).pickupTextures = {
        coinTexture,
        healthTexture,
        educationTexture,
      };

      const particlesContainer = new PIXI.Container();
      particlesContainerRef.current = particlesContainer;
      container.addChild(particlesContainer);

      const particlePoolSize = 50;
      for (let i = 0; i < particlePoolSize; i++) {
        const particleGraphic = new PIXI.Graphics();
        particleGraphic.circle(0, 0, 3);
        particleGraphic.fill(0xffffff);
        particleGraphic.visible = false;
        particlesContainer.addChild(particleGraphic);

        particlePoolRef.current.push({
          sprite: particleGraphic,
          active: false,
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          life: 0,
          maxLife: GAME_CONFIG.PARTICLES.LIFETIME,
        });
      }

      try {
        const texture = await PIXI.Assets.load(ASSETS.SHIP);
        if (!isMounted) {
          pixiApp.destroy(true);
          isInitializingRef.current = false;
          return;
        }
        loadedTexturesRef.current.push(ASSETS.SHIP);
        const shipSprite = new PIXI.Sprite(texture);
        shipSprite.anchor.set(0.5);
        shipSprite.width = GAME_CONFIG.PLAYER.SIZE;
        shipSprite.height = GAME_CONFIG.PLAYER.SIZE;
        playerPosRef.current = {
          x: pixiApp.screen.width / 2,
          y: pixiApp.screen.height - 150,
        };
        shipSprite.x = playerPosRef.current.x;
        shipSprite.y = playerPosRef.current.y;
        shipSpriteRef.current = shipSprite;
        container.addChild(shipSprite);
      } catch (error) {
        console.warn("Failed to load ship texture, using fallback", error);
        const graphics = new PIXI.Graphics();
        graphics.rect(-30, -30, 60, 60);
        graphics.fill(ASSETS.FALLBACK.SHIP);
        const texture = pixiApp.renderer.generateTexture(graphics);
        const shipSprite = new PIXI.Sprite(texture);
        shipSprite.anchor.set(0.5);
        playerPosRef.current = {
          x: pixiApp.screen.width / 2,
          y: pixiApp.screen.height - 150,
        };
        shipSprite.x = playerPosRef.current.x;
        shipSprite.y = playerPosRef.current.y;
        shipSpriteRef.current = shipSprite;
        container.addChild(shipSprite);
      }

      pixiApp.ticker.add((ticker) => {
        updateGame(ticker.deltaMS / 1000);
      });
      
      pixiApp.ticker.stop();

      setIsAppReady(true);
    })();

    return () => {
      isMounted = false;
    };
  }, [phase]);

  useEffect(() => {
    return () => {
      setIsAppReady(false);
      isInitializingRef.current = false;
      hasInitializedRef.current = false;
      
      for (const texturePath of loadedTexturesRef.current) {
        try {
          PIXI.Assets.unload(texturePath);
        } catch (error) {
          console.warn(`Error unloading texture ${texturePath}:`, error);
        }
      }
      loadedTexturesRef.current = [];
      
      if (app.current) {
        try {
          app.current.destroy(true, { children: true });
        } catch (error) {
          console.warn("Error destroying PIXI app:", error);
        }
      }
      app.current = null;
      containerRef.current = null;
      shipSpriteRef.current = null;
      textElementsRef.current = [];
      bulletPoolRef.current = [];
      enemyPoolRef.current = [];
      pickupPoolRef.current = [];
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.code);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.code);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      keysPressed.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isAppReady || !containerRef.current || !app.current) return;

    const previousPhase = previousPhaseRef.current;
    previousPhaseRef.current = phase;

    textElementsRef.current.forEach((text) => text.destroy());
    textElementsRef.current = [];

    if (shipSpriteRef.current) {
      shipSpriteRef.current.visible = phase === "playing" || phase === "paused";
    }

    if (phase === "playing") {
      if (app.current.ticker) {
        app.current.ticker.start();
      }

      const isNewGame = previousPhase === "menu" || previousPhase === "gameover";
      
      if (isNewGame && app.current && shipSpriteRef.current) {
        playerPosRef.current = {
          x: app.current.screen.width / 2,
          y: app.current.screen.height - 150,
        };
        elapsedTimeRef.current = 0;
        lastFireTimeRef.current = 0;
        lastEnemySpawnRef.current = 0;
        lastPickupSpawnRef.current = 0;
        invulnerableUntilRef.current = 0;

        for (const bullet of bulletPoolRef.current) {
          bullet.active = false;
          bullet.sprite.visible = false;
        }

        for (const enemy of enemyPoolRef.current) {
          enemy.active = false;
          enemy.sprite.visible = false;
        }

        for (const pickup of pickupPoolRef.current) {
          pickup.active = false;
          pickup.sprite.visible = false;
        }

        for (const particle of particlePoolRef.current) {
          particle.active = false;
          particle.sprite.visible = false;
        }

        shipSpriteRef.current.x = playerPosRef.current.x;
        shipSpriteRef.current.y = playerPosRef.current.y;
      }
    } else if (phase === "paused") {
      if (app.current?.ticker) {
        app.current.ticker.stop();
      }
    } else if (phase === "menu" || phase === "gameover") {
      if (app.current?.ticker) {
        app.current.ticker.stop();
      }
      
      for (const bullet of bulletPoolRef.current) {
        bullet.active = false;
        bullet.sprite.visible = false;
      }
      for (const enemy of enemyPoolRef.current) {
        enemy.active = false;
        enemy.sprite.visible = false;
      }
      for (const pickup of pickupPoolRef.current) {
        pickup.active = false;
        pickup.sprite.visible = false;
      }
      for (const particle of particlePoolRef.current) {
        particle.active = false;
        particle.sprite.visible = false;
      }
    }
  }, [phase, isAppReady]);

  const spawnBullet = (x: number, y: number) => {
    const bullet = bulletPoolRef.current.find((b) => !b.active);
    if (!bullet) return;

    bullet.active = true;
    bullet.x = x;
    bullet.y = y - 20;
    bullet.vx = 0;
    bullet.vy = -GAME_CONFIG.BULLET.SPEED;

    bullet.sprite.visible = true;
    bullet.sprite.x = bullet.x;
    bullet.sprite.y = bullet.y;

    useGameStore.getState().incrementShots();
    audioManager.play("shoot");
  };

  const updateBullets = (dt: number) => {
    for (const bullet of bulletPoolRef.current) {
      if (!bullet.active) continue;

      bullet.x += bullet.vx * dt;
      bullet.y += bullet.vy * dt;

      if (bullet.y < -20) {
        bullet.active = false;
        bullet.sprite.visible = false;
      } else {
        bullet.sprite.x = bullet.x;
        bullet.sprite.y = bullet.y;
      }
    }
  };

  const getCurrentTier = () => {
    const tier = Math.floor(
      elapsedTimeRef.current / GAME_CONFIG.DIFFICULTY.TIER_DURATION
    );
    return Math.min(tier, GAME_CONFIG.DIFFICULTY.MAX_TIER);
  };

  const spawnEnemy = () => {
    if (!app.current) return;

    const activeCount = enemyPoolRef.current.filter((e) => e.active).length;
    if (activeCount >= GAME_CONFIG.ENEMY.MAX_ACTIVE) return;

    const enemy = enemyPoolRef.current.find((e) => !e.active);
    if (!enemy) return;

    const tier = getCurrentTier();
    const tierConfig = GAME_CONFIG.SPAWN_RATES[tier];

    const padding = GAME_CONFIG.ENEMY.SIZE;
    enemy.x =
      padding + Math.random() * (app.current.screen.width - padding * 2);
    enemy.y = -GAME_CONFIG.ENEMY.SIZE;

    enemy.vx = (Math.random() - 0.5) * 50;
    enemy.vy = GAME_CONFIG.ENEMY.BASE_SPEED * tierConfig.speedMultiplier;

    enemy.active = true;
    enemy.sprite.visible = true;
    enemy.sprite.x = enemy.x;
    enemy.sprite.y = enemy.y;
  };

  const updateEnemies = (dt: number) => {
    if (!app.current) return;

    for (const enemy of enemyPoolRef.current) {
      if (!enemy.active) continue;

      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;

      if (
        enemy.y > app.current.screen.height + 50 ||
        enemy.x < -50 ||
        enemy.x > app.current.screen.width + 50
      ) {
        enemy.active = false;
        enemy.sprite.visible = false;
      } else {
        enemy.sprite.x = enemy.x;
        enemy.sprite.y = enemy.y;
      }
    }
  };

  const spawnPickup = () => {
    if (!app.current) return;

    const activeCount = pickupPoolRef.current.filter((p) => p.active).length;
    if (activeCount >= GAME_CONFIG.PICKUP.MAX_ACTIVE) return;

    const pickup = pickupPoolRef.current.find((p) => !p.active);
    if (!pickup) return;

    const textures = (window as any).pickupTextures;
    if (!textures) return;

    const rand = Math.random();
    if (rand < 0.6) {
      pickup.type = "coin";
      pickup.sprite.texture = textures.coinTexture;
    } else if (rand < 0.85) {
      pickup.type = "health";
      pickup.sprite.texture = textures.healthTexture;
    } else {
      pickup.type = "education";
      pickup.sprite.texture = textures.educationTexture;
    }

    const padding = GAME_CONFIG.PICKUP.SIZE;
    pickup.x =
      padding + Math.random() * (app.current.screen.width - padding * 2);
    pickup.y = -GAME_CONFIG.PICKUP.SIZE;
    pickup.vy = GAME_CONFIG.PICKUP.SPEED;

    pickup.active = true;
    pickup.sprite.visible = true;
    pickup.sprite.x = pickup.x;
    pickup.sprite.y = pickup.y;
  };

  const updatePickups = (dt: number) => {
    if (!app.current) return;

    for (const pickup of pickupPoolRef.current) {
      if (!pickup.active) continue;

      pickup.y += pickup.vy * dt;

        if (pickup.y > app.current.screen.height + 50) {
        pickup.active = false;
        pickup.sprite.visible = false;
      } else {
        pickup.sprite.y = pickup.y;
      }
    }
  };

  const checkAABB = (
    x1: number,
    y1: number,
    size1: number,
    x2: number,
    y2: number,
    size2: number
  ): boolean => {
    const halfSize1 = size1 / 2;
    const halfSize2 = size2 / 2;

    return (
      x1 - halfSize1 < x2 + halfSize2 &&
      x1 + halfSize1 > x2 - halfSize2 &&
      y1 - halfSize1 < y2 + halfSize2 &&
      y1 + halfSize1 > y2 - halfSize2
    );
  };

  const createExplosion = (x: number, y: number, color: number) => {
    const particleCount = GAME_CONFIG.PARTICLES.EXPLOSION_COUNT;
    let spawned = 0;

    for (const particle of particlePoolRef.current) {
      if (spawned >= particleCount) break;
      if (particle.active) continue;

      const angle = (Math.PI * 2 * spawned) / particleCount;
      const speed = GAME_CONFIG.PARTICLES.SPEED;

      particle.active = true;
      particle.x = x;
      particle.y = y;
      particle.vx = Math.cos(angle) * speed;
      particle.vy = Math.sin(angle) * speed;
      particle.life = particle.maxLife;

      particle.sprite.clear();
      particle.sprite.circle(0, 0, 3);
      particle.sprite.fill(color);
      particle.sprite.visible = true;
      particle.sprite.x = x;
      particle.sprite.y = y;
      particle.sprite.alpha = 1;

      spawned++;
    }
  };

  const updateParticles = (dt: number) => {
    for (const particle of particlePoolRef.current) {
      if (!particle.active) continue;

      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.life -= dt;

      particle.sprite.x = particle.x;
      particle.sprite.y = particle.y;
      particle.sprite.alpha = Math.max(0, particle.life / particle.maxLife);

      if (particle.life <= 0) {
        particle.active = false;
        particle.sprite.visible = false;
      }
    }
  };

  const checkCollisions = () => {
    const currentMultiplier = useGameStore.getState().multiplier;
    const currentLives = useGameStore.getState().lives;

    for (const bullet of bulletPoolRef.current) {
      if (!bullet.active) continue;

      for (const enemy of enemyPoolRef.current) {
        if (!enemy.active) continue;

        if (
          checkAABB(
            bullet.x,
            bullet.y,
            GAME_CONFIG.BULLET.SIZE,
            enemy.x,
            enemy.y,
            enemy.size
          )
        ) {
          bullet.active = false;
          bullet.sprite.visible = false;
          enemy.active = false;
          enemy.sprite.visible = false;

          const points = Math.floor(
            GAME_CONFIG.ENEMY.POINTS * currentMultiplier
          );
          useGameStore.getState().addScore(points);
          useGameStore.getState().incrementHits();
          useGameStore.getState().incrementEnemiesDestroyed();
          audioManager.play("hit");

          createExplosion(enemy.x, enemy.y, ASSETS.FALLBACK.ENEMY);
          break;
        }
      }
    }

    for (const pickup of pickupPoolRef.current) {
      if (!pickup.active) continue;

      if (
        checkAABB(
          playerPosRef.current.x,
          playerPosRef.current.y,
          GAME_CONFIG.PLAYER.SIZE,
          pickup.x,
          pickup.y,
          pickup.size
        )
      ) {
        pickup.active = false;
        pickup.sprite.visible = false;
        useGameStore.getState().incrementPickups();
        audioManager.play("pickup");

        switch (pickup.type) {
          case "coin":
            const coinPoints = Math.floor(
              GAME_CONFIG.PICKUP.COIN_POINTS * currentMultiplier
            );
            useGameStore.getState().addScore(coinPoints);
            createExplosion(pickup.x, pickup.y, ASSETS.FALLBACK.COIN);
            break;
          case "health":
            if (currentLives < 5) {
              useGameStore.getState().gainLife();
            }
            createExplosion(pickup.x, pickup.y, ASSETS.FALLBACK.HEALTH);
            break;
          case "education":
            const newMultiplier = Math.min(
              currentMultiplier + GAME_CONFIG.PICKUP.EDU_MULTIPLIER,
              GAME_CONFIG.SCORE.MAX_MULTIPLIER
            );
            useGameStore.getState().updateMultiplier(newMultiplier);
            createExplosion(pickup.x, pickup.y, ASSETS.FALLBACK.EDUCATION);
            break;
        }
      }
    }

    const now = elapsedTimeRef.current;
    const isInvulnerable = now < invulnerableUntilRef.current;

    if (!isInvulnerable) {
      for (const enemy of enemyPoolRef.current) {
        if (!enemy.active) continue;

        if (
          checkAABB(
            playerPosRef.current.x,
            playerPosRef.current.y,
            GAME_CONFIG.PLAYER.SIZE,
            enemy.x,
            enemy.y,
            enemy.size
          )
        ) {
          enemy.active = false;
          enemy.sprite.visible = false;

          useGameStore.getState().loseLife();
          createExplosion(enemy.x, enemy.y, 0xff0000);

          invulnerableUntilRef.current =
            now + GAME_CONFIG.PLAYER.INVULNERABLE_TIME;

          break;
        }
      }
    }
  };

  const updateGame = (deltaTime: number) => {
    const currentPhase = useGameStore.getState().phase;
    if (currentPhase !== "playing" || !shipSpriteRef.current) return;

    const dt = Math.min(deltaTime, GAME_CONFIG.MAX_DELTA_TIME / 1000);

    elapsedTimeRef.current += dt;
    useGameStore.getState().updateElapsed(elapsedTimeRef.current);

    let dx = 0;

    if (
      keysPressed.current.has("ArrowLeft") ||
      keysPressed.current.has("KeyA")
    ) {
      dx -= 1;
    }
    if (
      keysPressed.current.has("ArrowRight") ||
      keysPressed.current.has("KeyD")
    ) {
      dx += 1;
    }

    const speed = GAME_CONFIG.PLAYER.SPEED;
    const newX = playerPosRef.current.x + dx * speed * dt;

    const edgePadding = 20;

    if (app.current) {
      playerPosRef.current.x = Math.max(
        edgePadding,
        Math.min(app.current.screen.width - edgePadding, newX)
      );
    }

    shipSpriteRef.current.x = playerPosRef.current.x;
    shipSpriteRef.current.y = playerPosRef.current.y;

    const now = elapsedTimeRef.current;
    const isInvulnerable = now < invulnerableUntilRef.current;
    if (isInvulnerable) {
      const flickerInterval = 0.1;
      const flickerPhase = Math.floor(now / flickerInterval) % 2;
      shipSpriteRef.current.alpha = flickerPhase === 0 ? 0.3 : 1.0;
    } else {
      shipSpriteRef.current.alpha = 1.0;
    }

    if (keysPressed.current.has("Space")) {
      const now = elapsedTimeRef.current;
      const fireRate = GAME_CONFIG.PLAYER.FIRE_RATE;

      if (now - lastFireTimeRef.current >= fireRate) {
        spawnBullet(playerPosRef.current.x, playerPosRef.current.y);
        lastFireTimeRef.current = now;
      }
    }

    const tier = getCurrentTier();
    const tierConfig = GAME_CONFIG.SPAWN_RATES[tier];

    if (
      elapsedTimeRef.current - lastEnemySpawnRef.current >=
      tierConfig.enemyInterval
    ) {
      spawnEnemy();
      lastEnemySpawnRef.current = elapsedTimeRef.current;
    }

    if (
      elapsedTimeRef.current - lastPickupSpawnRef.current >=
      tierConfig.pickupInterval
    ) {
      spawnPickup();
      lastPickupSpawnRef.current = elapsedTimeRef.current;
    }

    updateBullets(dt);
    updateEnemies(dt);
    updatePickups(dt);
    updateParticles(dt);

    checkCollisions();
  };

  return (
    <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{
          opacity: isAppReady ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </div>
  );
}
