export type Theme = {
  name: string;
  colors: {
    foreground: string;
    background: string;
    backgroundDark: string;
    accentPrimary: string;
    accentPrimaryDark: string;
    accentSecondary: string;
  };
};

export const themes: Theme[] = [
  {
    name: "Midnight Shadows",
    colors: {
      foreground: "249, 249, 249",
      background: "22, 33, 62",
      backgroundDark: "26, 26, 46",
      accentPrimary: "233, 70, 96",
      accentPrimaryDark: "15, 52, 96",
      accentSecondary: "15, 52, 96",
    },
  },
  {
    name: "Obsidian Depths",
    colors: {
      foreground: "236, 240, 241",
      background: "52, 73, 94",
      backgroundDark: "44, 62, 80",
      accentPrimary: "26, 188, 156",
      accentPrimaryDark: "22, 160, 133",
      accentSecondary: "22, 160, 133",
    },
  },
  {
    name: "Twilight Hues",
    colors: {
      foreground: "245, 245, 245",
      background: "106, 15, 186",
      backgroundDark: "75, 0, 178",
      accentPrimary: "218, 112, 214",
      accentPrimaryDark: "186, 43, 226",
      accentSecondary: "186, 43, 226",
    },
  },
  {
    name: "Raven's Wing",
    colors: {
      foreground: "191, 191, 191",
      background: "46, 46, 46",
      backgroundDark: "0, 0, 0",
      accentPrimary: "125, 125, 125",
      accentPrimaryDark: "75, 75, 75",
      accentSecondary: "75, 75, 75",
    },
  },
  {
    name: "Stormy Night",
    colors: {
      foreground: "214, 48, 49",
      background: "53, 59, 72",
      backgroundDark: "47, 54, 64",
      accentPrimary: "0, 191, 255",
      accentPrimaryDark: "0, 184, 148",
      accentSecondary: "0, 184, 148",
    },
  },
  {
    name: "Charcoal Dreams",
    colors: {
      foreground: "178, 178, 178",
      background: "74, 74, 74",
      backgroundDark: "59, 59, 59",
      accentPrimary: "117, 117, 117",
      accentPrimaryDark: "97, 97, 97",
      accentSecondary: "97, 97, 97",
    },
  },
  {
    name: "Deep Sea Abyss",
    colors: {
      foreground: "174, 238, 238",
      background: "0, 51, 102",
      backgroundDark: "0, 31, 63",
      accentPrimary: "0, 123, 255",
      accentPrimaryDark: "0, 91, 150",
      accentSecondary: "0, 91, 150",
    },
  },
  {
    name: "Forest Dusk",
    colors: {
      foreground: "240, 243, 244",
      background: "74, 94, 61",
      backgroundDark: "46, 58, 36",
      accentPrimary: "154, 223, 191",
      accentPrimaryDark: "107, 190, 35",
      accentSecondary: "107, 190, 35",
    },
  },
  {
    name: "Gothic Elegance",
    colors: {
      foreground: "232, 216, 224",
      background: "93, 58, 141",
      backgroundDark: "59, 10, 69",
      accentPrimary: "164, 93, 186",
      accentPrimaryDark: "123, 45, 145",
      accentSecondary: "123, 45, 145",
    },
  },
  {
    name: "Dark Forest",
    colors: {
      foreground: "240, 240, 240",
      background: "44, 62, 80",
      backgroundDark: "27, 58, 87",
      accentPrimary: "164, 200, 225",
      accentPrimaryDark: "164, 110, 141",
      accentSecondary: "164, 110, 141",
    },
  },
]; 