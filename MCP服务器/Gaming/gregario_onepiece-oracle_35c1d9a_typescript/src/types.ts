export interface Card {
  card_name: string;
  card_number: string;
  rarity: string;
  is_alternate_art: boolean;
  card_type: 'LEADER' | 'CHARACTER' | 'EVENT' | 'STAGE';
  image_url: string;
  life: string;
  cost: string;
  attributes: string[];
  power: string;
  counter: string;
  block_icon: string;
  colors: string[];
  types: string[];
  effects: string;
  card_effects: string[];
  card_sets: string;
  image_name: string;
}

export interface SearchFilters {
  query?: string;
  color?: string;
  card_type?: string;
  cost?: number;
  cost_min?: number;
  cost_max?: number;
  power_min?: number;
  power_max?: number;
  rarity?: string;
  attribute?: string;
  type?: string; // character type like "Straw Hat Crew"
  set?: string;
  has_counter?: boolean;
  limit?: number;
  offset?: number;
}
