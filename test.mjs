import { orderTags, parseFile } from "music-metadata";
import { inspect } from "util";

export default function parse() {
  parseFile("./video-data/pending/source02-capts3229335.mp4").then(
    (metadata) => {
      const nativeTags = orderTags(metadata.native["iTunes"]);
      const info = {
        formation: metadata.common.grouping,
        flyers: nativeTags["----:com.apple.iTunes:Ensemble"][0].split(","),
        date: metadata.common.date,
        view: metadata.common.media,
      };
      console.log("", info);
    }
  );
}

parse();
