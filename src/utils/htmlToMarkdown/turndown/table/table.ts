import { Rule } from "turndown";

export default {
  filter: "table",

  replacement: function (content) {
    try {
      const table = content
        .split("\n")
        .filter(Boolean)
        .map((i) => i.split("|").filter(Boolean));
      let cols_max_width = [];
      for (let i = 0; i < table[0].length; i++) {
        let max_width = 0;
        for (let j = 0; j < table.length; j++) {
          max_width = Math.max(max_width, table[j][i].length);
        }
        cols_max_width.push(max_width);
      }
      for (let r = 0; r < table.length; r++) {
        for (let c = 0; c < table[0].length; c++) {
          table[r][c] = table[r][c].padEnd(
            cols_max_width[c],
            r == 1 ? "-" : " ",
          );
        }
      }
      return (
        "\n\n" + table.map((i) => "|" + i.join("|") + "|").join("\n") + "\n\n"
      );
    } catch {
      return "\n\n" + content + "\n\n";
    }
  },
} as Rule;
