import * as THREE from "three";
import { Camera } from "./camera";
import { EntityManager } from "@shared/entity/EntityManager";
import { SyncComponentsSystem } from "./ecs/system/SyncComponentsSystem";
import { SyncPositionSystem } from "./ecs/system/SyncPositionSystem";
import { SyncRotationSystem } from "./ecs/system/SyncRotationSystem";
import { Renderer } from "./renderer";
import { WebSocketManager } from "./WebsocketManager";
import { InputManager } from "./InputManager";
import { config } from "@shared/network/config";
import { SyncSizeSystem } from "./ecs/system/SyncSizeSystem";
import { CameraFollowSystem } from "./ecs/system/CameraFollowSystem";

export class Game {
  private static instance: Game;
  public entityManager = EntityManager.getInstance();
  private lastRenderTime = Date.now();
  private loopFunction: () => void = this.loop.bind(this);
  public renderer: Renderer;
  public syncComponentSystem: SyncComponentsSystem;
  private syncPositionSystem: SyncPositionSystem;
  private syncRotationSystem: SyncRotationSystem;
  private syncSizeSystem: SyncSizeSystem;
  private cameraFollowSystem: CameraFollowSystem;
  private websocketManager: WebSocketManager;
  public currentPlayerId = 0;
  private inputManager: InputManager;

  private constructor() {
    const camera = new Camera();
    this.renderer = new Renderer(camera, new THREE.Scene());
    this.syncComponentSystem = new SyncComponentsSystem(this);
    this.syncPositionSystem = new SyncPositionSystem();
    this.syncRotationSystem = new SyncRotationSystem();
    this.syncSizeSystem = new SyncSizeSystem();
    this.cameraFollowSystem = new CameraFollowSystem();
    this.websocketManager = new WebSocketManager(this);
    this.inputManager = new InputManager(this.websocketManager);
    this.setupScene();
  }

  public static getInstance(): Game {
    if (!Game.instance) {
      Game.instance = new Game();
    }
    return Game.instance;
  }

  public async start() {
    // Wait for the WebSocket connection to be established
    await this.websocketManager.connect();
    document.body.appendChild(this.renderer.domElement);
    this.renderer.setAnimationLoop(this.loopFunction);
  }

  private setupScene() {
    this.addGround();
  }

  private addGround() {
    // Create a simple colored ground
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x1eefff, // Adjust the color as needed (green in this case)
    });

    const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.receiveShadow = true;
    groundMesh.rotation.x = -Math.PI / 2;
    this.renderer.scene.add(groundMesh);
  }

  private interpolationFactor = 0.1; // Adjust this factor for the desired interpolation speed
  private tickRate = config.TICKRATE; // The tick rate in ticks per second
  private lastTickTime = 0; // Track the time of the last tick

  private loop() {
    const entities = this.entityManager.getAllEntities();
    const now = Date.now();
    this.websocketManager.update();
    this.inputManager.sendInput();
    // Calculate the time since the last tick
    const deltaTime = now - this.lastRenderTime;

    const interpolationFactor = deltaTime / (1000 / this.tickRate);

    // Update position and rotation with interpolation
    this.syncPositionSystem.update(entities, interpolationFactor);
    this.syncRotationSystem.update(entities, interpolationFactor);
    this.syncSizeSystem.update(entities);
    this.cameraFollowSystem.update(entities);

    this.renderer.update();
    this.lastRenderTime = now;
  }
}
