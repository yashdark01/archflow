export interface EraserCatalogIcon {
  id: string;
  url: string;
}

export interface EraserCatalogCategory {
  id: string;
  label: string;
  icons: EraserCatalogIcon[];
}

export interface EraserIconCatalog {
  source: string;
  cdnBase: string;
  categories: EraserCatalogCategory[];
}
