import { Component, ComponentSchema } from "ecsy/Component";
import { Types } from "ecsy/Types";
import { Vector2, Vector2Type } from "../../../Mathematics/Vector2";

export class ImageRenderData2D extends Component<ImageRenderData2D> {
  static schema: ComponentSchema = {
    img: {
      type: Types.Ref,
      default: null,
    },
    imageCenter: {
      type: Vector2Type,
      default: new Vector2(0, 0),
    },
  };

  img: CanvasImageSource | null = null;
  imageCenter!: Vector2;
}