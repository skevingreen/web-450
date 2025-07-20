import { Component } from '@angular/core';
import { PlantService } from '../plant.service';
import { Plant } from '../plant';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HighlightRecentDirective } from '../highlight-recent.directive';

@Component({
  selector: 'app-plant-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule, HighlightRecentDirective],
  template: `
    <div class="plant-page">
      <h1 class="plant-page__title">Plant List</h1>

      <div class="plant-page__filter-container">
        <select [(ngModel)]="filterType" class="plant-page__filter">
          <option value="">All</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Flower">Flower</option>
          <option value="Herb">Herb</option>
          <option value="Tree">Tree</option>
        </select>
        <input type="button" (click)="filterPlants()" value="Filter Plants" class="plantpage__filter-button" />
      </div>

      <button class="plant-page__button" routerLink="/plants/add">Add Plant</button>

      <div class="plant-page__highlight-info">
        <p>Rows highlighted in green indicate plants that were planted within the last 30 days.</p>
      </div>

      @if (serverMessage) {
        <div [ngClass]="{'message-alert': serverMessageType === 'error', 'message-success': serverMessageType === 'success'}">
          {{ serverMessage }}
        </div>
      }

      @if (plants && plants.length > 0) {
        <table class="plant-page__table">
          <thead class="plant-page__table-head">
            <tr class="plant-page__table-row">
              <th class="plant-page__table-header">Plant ID</th>
              <th class="plant-page__table-header">Name</th>
              <th class="plant-page__table-header">Type</th>
              <th class="plant-page__table-header">Status</th>
              <th class="plant-page__table-header">Date Planted</th>
              <th class="plant-page__table-header">Functions</th>
            </tr>
          </thead>

          <tbody class="plant-page__table-body">
            @for (plant of plants; track plant) {
              <tr class="plant-page__table-row" [appHighlightRecent]="plant.datePlanted ?? ''">
                <td class="plant-page__table-cell">{{ plant._id }}</td>
                <td class="plant-page__table-cell">{{ plant.name }}</td>
                <td class="plant-page__table-cell">{{ plant.type }}</td>
                <td class="plant-page__table-cell">{{ plant.status }}</td>
                <td class="plant-page__table-cell">{{ plant.datePlanted }}</td>
                <td class="plant-page__table-cell plant-page__table-cell--functions">
                  <a routerLink="/plants/{{plant._id}}" class="plant-page__icon-link"><i class="fas fa-edit"></i></a>
                  <a (click)="deletePlant(plant._id)" class="plant-page__icon-link"><i class="fas fa-trash-alt"></i></a>
                </td>
            </tr>
            }
          </tbody>
        </table>
      } @else {
        <p class="plant-page__no-plants">No plants found, consider adding one...</p>
      }
    </div>
  `,
  styles: `
    .plant-page {
      max-width: 80%;
      margin: 0 auto;
      padding: 20px;
    }

    .plant-page__title {
      text-align: center;
      color: #563d7c;
    }

    .plant-page__table {
      width: 100%;
      border-collapse: collapse;
    }

    .plant-page__table-header {
      background-color: #FFE484;
      color: #000;
      border: 1px solid black;
      padding: 5px;
      text-align: left;
    }

    .plant-page__table-cell {
      border: 1px solid black;
      padding: 5px;
      text-align: left;
    }

    .plant-page__table-cell--functions {
      text-align: center;
    }

    .plant-page__icon-link {
      cursor: pointer;
      color: #6c757d;
      text-decoration: none;
      margin: 0 5px;
    }

    .plant-page__icon-link:hover {
      color: #000;
      }

    .plant-page__no-plants {
      text-align: center;
      color: #6c757d;
    }

    .plant-page__button {
      background-color: #563d7c;
      color: #fff;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      margin: 10px 2px;
      cursor: pointer;
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .plant-page__button:hover {
      background-color: #6c757d;
      }

    .message-alert {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #a94442;
      background-color: #f2dede;
      border-color: #ebccd1;
    }

    .message-success {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
      color: #3c763d;
      background-color: #dff0d8;
      border-color: #d6e9c6;
    }

    .plant-page__filter-container {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
    }

    .plant-page__filter {
      flex: 1;
      padding: 0.5rem;
      margin-right: 0.5rem;
    }

    .plant-page__filter-button {
      background-color: #563d7c;
      color: #fff;
      border: none;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      margin: 10px 2px;
      cursor: pointer;\
      border-radius: 5px;
      transition: background-color 0.3s;
    }

    .plant-page__filter-button:hover {
      background-color: #6c757d;
    }

    .plant-page__highlight-info {
      text-align: center;\
      color: #6c757d;
      margin-bottom: 1rem;
    }
  `
})
export class PlantListComponent {
  allPlants: Plant[] = [];
  plants: Plant[] = [];
  filterType: string = '';
  serverMessage: string | null = null;
  serverMessageType: 'success' | 'error' | null = null;

  constructor(private plantService: PlantService) {
    this.plantService.getPlants().subscribe({
      next: (plants: Plant[]) => {
        this.plants = plants;
        console.log(`Plants: ${JSON.stringify(this.plants)}`);
      },
      error: (err: any) => {
        console.error(`Error occurred while retrieving plants: ${err}`);
        this.plants = [];
      }
    });
  }

  filterPlants() {
    if (this.filterType === '') {
      this.plants = this.allPlants;
      return;
    }

    this.plants = this.allPlants.filter(plant => plant.type === this.filterType);
  }

  deletePlant(plantId: string) {
    if (!confirm('Are you sure you want to delete this plant?')) {
      return;
    }

    this.plantService.deletePlant(plantId).subscribe({
      next: () => {
        console.log(`Plant with ID ${plantId} deleted successfully`);
        this.plants = this.plants.filter(p => p._id !== plantId);
        this.serverMessageType = 'success';
        this.serverMessage = `Plant with ID ${plantId} deleted successfully`;
        this.clearMessageAfterDelay();
      },
      error: (err: any) => {
        console.error(`Error occurred while deleting plant with ID ${plantId}: ${err}`);
        this.serverMessageType = 'error';
        this.serverMessage = `Error occurred while deleting plant with ID ${plantId}. Please try again later.`;
        this.clearMessageAfterDelay();
      }
    });
  }

  private clearMessageAfterDelay() {
    setTimeout(() => {
      this.serverMessage = null;
      this.serverMessageType = null;
    }, 3000);
  }
}
