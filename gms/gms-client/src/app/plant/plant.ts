export interface Plant {
  _id: string;
  gardenId: number;
  name: string;
  type: string;
  status: string;
  datePlanted?: string;
  dateHarvested?: string;
  dateCreated?: string;
  dateModiﬁed?: string;
}

export type AddPlantDTO = Omit<Plant, '_id' | 'gardenId' | 'dateHarvested' | 'dateCreated' | 'dateModiﬁed'>;
export type UpdatePlantDTO = Omit<Plant, '_id' | 'gardenId' | 'datePlanted' | 'dateHarvested' | 'dateCreated' | 'dateModiﬁed'>;
