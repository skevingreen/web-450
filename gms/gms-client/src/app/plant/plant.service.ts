import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Plant, AddPlantDTO, UpdatePlantDTO } from './plant';
import { GardenService } from '../garden/garden.service';
import { Garden } from '../garden/garden';

@Injectable({
  providedIn: 'root'
})

export class PlantService {
  constructor(private http: HttpClient) { }

  getPlants() {
    return this.http.get<Plant[]>(`${environment.apiBaseUrl}/api/plants`);
  }

  getPlant(plantId: string) {
    return this.http.get<Plant>(`${environment.apiBaseUrl}/api/plants/${plantId}`);
  }

  addPlant(gardenId: number, plant: AddPlantDTO) {
    return this.http.post<Plant>(`${environment.apiBaseUrl}/api/plants/${gardenId}`, plant);
  }

  updatePlant(plantId: string, updatePlant: UpdatePlantDTO) {
    return this.http.patch<Plant>(`${environment.apiBaseUrl}/api/plants/${plantId}`, updatePlant);
  }

  deletePlant(plantId: string) {
    return this.http.delete(`${environment.apiBaseUrl}/api/plants/${plantId}`);
  }
}
