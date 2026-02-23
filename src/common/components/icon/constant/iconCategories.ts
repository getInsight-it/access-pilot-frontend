export interface IconCategory {
  id: string;
  label: string;
  test: (iconName: string) => boolean;
}

export const iconCategories: IconCategory[] = [
  { id: "arrows",        label: "Setas",        test: (n) => /Arrow/i.test(n) },
  { id: "user",          label: "Usuário",       test: (n) => /^(User|Person|People|Baby|Bot)/i.test(n) },
  { id: "files",         label: "Arquivos",      test: (n) => /^(File|Folder|Archive|Clipboard|Notebook)/i.test(n) },
  { id: "charts",        label: "Gráficos",      test: (n) => /^(Chart|BarChart|LineChart|PieChart|AreaChart|TrendingUp|TrendingDown|Gauge)/i.test(n) },
  { id: "communication", label: "Comunicação",   test: (n) => /^(Mail|Message|Phone|Chat|Send|Bell|Inbox|Rss|Voicemail|Megaphone)/i.test(n) },
  { id: "media",         label: "Mídia",         test: (n) => /^(Image|Video|Music|Camera|Film|Headphones|Speaker|Mic|Tv|Clapperboard)/i.test(n) },
  { id: "shapes",        label: "Formas",        test: (n) => /^(Circle|Square|Triangle|Diamond|Pentagon|Hexagon|Octagon|Star|Heart)/i.test(n) },
  { id: "devices",       label: "Dispositivos",  test: (n) => /^(Laptop|Monitor|Smartphone|Tablet|Keyboard|Server|Database|Cpu|HardDrive|Wifi|Bluetooth|Watch)/i.test(n) },
  { id: "weather",       label: "Clima",         test: (n) => /^(Cloud|Sun|Moon|Wind|Thermometer|Umbrella|Tornado|Snowflake|Sunrise|Sunset|Flame|Droplets)/i.test(n) },
  { id: "navigation",    label: "Navegação",     test: (n) => /^(Map|Navigation|Compass|Globe|Locate|Route|Waypoints)/i.test(n) },
  { id: "outros",        label: "Outros",        test: () => false }, // sentinel — matched by exclusion
];
