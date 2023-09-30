import {
  SerializedComponentType,
  SerializedRotationComponent,
} from "../../../../shared/serialized.js";
import { Component, Serializable } from "./Component.js";

// Define a RotationComponent class
export class RotationComponent extends Component implements Serializable {
  type = SerializedComponentType.ROTATION;

  // Define public properties for pitch, yaw, and roll
  constructor(
    entityId: number,
    public x: number,
    public y: number,
    public z: number,
    public w = 0
  ) {
    super(entityId); // Call the parent constructor with the entityId
  }

  serialize(): SerializedRotationComponent {
    return {
      t: SerializedComponentType.ROTATION,
      x: Number(this.x.toFixed(2)),
      y: Number(this.y.toFixed(2)),
      z: Number(this.z.toFixed(2)),
      w: 0, // Replace with the appropriate value if needed
    };
  }
}
