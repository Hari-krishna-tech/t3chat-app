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
    name: "Midnight",
    colors: {
      foreground: "232, 232, 237",
      background: "10, 10, 15",
      backgroundDark: "6, 6, 11",
      accentPrimary: "99, 102, 241",
      accentPrimaryDark: "79, 70, 229",
      accentSecondary: "139, 92, 246",
    },
  },
  {
    name: "Noir",
    colors: {
      foreground: "220, 220, 225",
      background: "8, 8, 8",
      backgroundDark: "0, 0, 0",
      accentPrimary: "255, 255, 255",
      accentPrimaryDark: "180, 180, 180",
      accentSecondary: "160, 160, 160",
    },
  },
  {
    name: "Aurora",
    colors: {
      foreground: "235, 240, 245",
      background: "10, 15, 20",
      backgroundDark: "5, 10, 15",
      accentPrimary: "52, 211, 153",
      accentPrimaryDark: "16, 185, 129",
      accentSecondary: "45, 212, 191",
    },
  },
  {
    name: "Sakura",
    colors: {
      foreground: "240, 235, 240",
      background: "15, 10, 18",
      backgroundDark: "10, 6, 12",
      accentPrimary: "244, 114, 182",
      accentPrimaryDark: "219, 39, 119",
      accentSecondary: "251, 146, 60",
    },
  },
  {
    name: "Ocean",
    colors: {
      foreground: "230, 240, 250",
      background: "8, 12, 22",
      backgroundDark: "4, 8, 16",
      accentPrimary: "56, 189, 248",
      accentPrimaryDark: "14, 165, 233",
      accentSecondary: "99, 102, 241",
    },
  },
  {
    name: "Ember",
    colors: {
      foreground: "245, 240, 235",
      background: "15, 10, 8",
      backgroundDark: "10, 6, 4",
      accentPrimary: "249, 115, 22",
      accentPrimaryDark: "234, 88, 12",
      accentSecondary: "245, 158, 11",
    },
  },
  {
    name: "Obsidian",
    colors: {
      foreground: "236, 240, 241",
      background: "18, 22, 28",
      backgroundDark: "12, 15, 20",
      accentPrimary: "26, 188, 156",
      accentPrimaryDark: "22, 160, 133",
      accentSecondary: "22, 160, 133",
    },
  },
  {
    name: "Twilight",
    colors: {
      foreground: "235, 230, 245",
      background: "16, 10, 24",
      backgroundDark: "10, 5, 18",
      accentPrimary: "168, 85, 247",
      accentPrimaryDark: "147, 51, 234",
      accentSecondary: "192, 132, 252",
    },
  },
  {
    name: "Arctic",
    colors: {
      foreground: "230, 235, 245",
      background: "15, 18, 25",
      backgroundDark: "10, 12, 18",
      accentPrimary: "164, 200, 225",
      accentPrimaryDark: "120, 170, 210",
      accentSecondary: "147, 197, 253",
    },
  },
  {
    name: "Crimson",
    colors: {
      foreground: "240, 235, 235",
      background: "14, 8, 10",
      backgroundDark: "8, 4, 6",
      accentPrimary: "239, 68, 68",
      accentPrimaryDark: "220, 38, 38",
      accentSecondary: "251, 113, 133",
    },
  },
];