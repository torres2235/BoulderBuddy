import { Image } from "react-native";

import wall1 from "@/assets/images/climbs/wall1.jpg";
import wall2 from "@/assets/images/climbs/wall2.jpg";
import wall3 from "@/assets/images/climbs/wall3.jpg";

export default [
  { id: 1, image: Image.resolveAssetSource(wall1).uri },
  { id: 2, image: wall2 },
  { id: 3, image: wall3 },
];
