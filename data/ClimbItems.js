import { Image } from "react-native";

import wall1 from "@/assets/images/climbs/wall1.jpg";
import wall2 from "@/assets/images/climbs/wall2.jpg";
import wall3 from "@/assets/images/climbs/wall3.jpg";

export const data = [
  {
    id: 1,
    title: "Easy v1",
    grade: "v1",
    color: "Green",
    date: "2/1/2025",
    rating: 4,
    completed: true,
    tags: [],
    image: Image.resolveAssetSource(wall1).uri,
  },
  {
    id: 2,
    title: "Breazy v2",
    grade: "v2",
    color: "Blue",
    date: "2/2/2025",
    rating: 5,
    completed: true,
    tags: [],
    image: Image.resolveAssetSource(wall2).uri,
  },
  {
    id: 3,
    title: "Tougher v3",
    grade: "v3",
    color: "Yellow",
    date: "2/3/2025",
    rating: 3.5,
    completed: false,
    tags: ["dyno", "slab", "crimp", "campus"],
    image: Image.resolveAssetSource(wall3).uri,
  },
];
