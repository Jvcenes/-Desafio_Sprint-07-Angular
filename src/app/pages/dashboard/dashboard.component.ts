import { VeiculoData } from './../../models/veiculoData.model';
import { ServiceOneService } from './../../service/service-one.service';
import {
  Component,
  NgModule,
  OnInit,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { HeaderComponent } from '../../component/header/header.component';
import { Veiculo } from '../../models/veiculo.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private vehicleService = inject(ServiceOneService);

  // Lista de todos os veículos (para o select)
  vehicles = signal<Veiculo[]>([]);

  // O nome do veículo que está selecionado no <select>
  selectedVehicleName = signal<string>('');

  // Os dados da tabela (odômetro, status, etc.)
  vehicleTableData = signal<VeiculoData | undefined>(undefined);

  searchVinInput = signal<string>('');
  errorMessage = signal<string>('');

  // O objeto COMPLETO do veículo selecionado (calculado a partir do nome)
  selectedVehicle = computed(() => {
    return this.vehicles().find(
      (v) => v.vehicle === this.selectedVehicleName()
    );
  });

  /**
   * MAPA para ligar o NOME do modelo ao VIN.
   * A sua API `/vehicles` não retorna os VINs, então precisamos
   * criar essa "ponte" manualmente com base no `switch` da sua API.
   */
  private readonly vinMap: { [vehicleName: string]: string } = {
    "Ranger": "2FRHDUYS2Y63NHD22454",
    "Mustang": "2RFAASDY54E4HDU34874",
    "Territory": "2FRHDUYS2Y63NHD22455",
    "Bronco Sport": "2RFAASDY54E4HDU34875",
    // Adicione os outros VINs aqui se necessário
  };

  vinList = signal<string[]>([
    '2FRHDUYS2Y63NHD22454',
    '2RFAASDY54E4HDU34874',
    '2FRHDUYS2Y63NHD22455',
    '2RFAASDY54E4HDU34875',
  ]);

  filteredVinList = signal<string[]>([]);

  constructor() {
    // Efeito que reage a mudanças no <select>
    effect(() => {
      const vehicleName = this.selectedVehicleName();
      if (vehicleName) {
        this.loadVehicleTableData(vehicleName);
      }
    });
  }

  ngOnInit(): void {
    // 1. Busca a lista de veículos assim que o componente carrega
    this.vehicleService.getCarModels().subscribe((apiResponse) => {
      const allVehicles = apiResponse.vehicles;
      this.vehicles.set(allVehicles);

      // 2. Define o primeiro veículo da lista como selecionado
      if (allVehicles.length > 0) {
        this.selectedVehicleName.set(allVehicles[0].vehicle);
      }
    });
  }

  public searchByVin(): void {
    const vin = this.searchVinInput().trim();

    if (!vin) return;
    this.errorMessage.set('');

    // Chama o serviço passando o VIN manual
    this.vehicleService.getCarData(vin).subscribe({
      next: (data) => {
        // Sucesso! Agora precisamos sincronizar o visual (imagem/título)
        // A API retorna { id: 1, ... }. Vamos achar qual carro tem id 1 na nossa lista.
        const foundModel = this.vehicles().find((v) => v.id === data.id);

        if (foundModel) {
          // TRUQUE: Atualizamos o vinMap para este modelo usar o VIN que acabamos de buscar.
          // Isso impede que o effect carregue o VIN antigo logo em seguida.
          this.vinMap[foundModel.vehicle] = vin;

          // Atualiza a seleção (isso vai disparar o effect, mas agora com o VIN certo no mapa)
          this.selectedVehicleName.set(foundModel.vehicle);

          // Opcional: Já setar os dados diretamente para evitar delay
          this.vehicleTableData.set({ ...data, vin: vin });
        } else {
          // Caso o ID retornado não bata com nenhum carro da lista (ex: Carro novo não cadastrado)
          this.errorMessage.set(
            'Veículo encontrado, mas modelo não identificado no sistema.'
          );
          this.vehicleTableData.set({ ...data, vin: vin });
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('VIN não encontrado ou erro na busca.');
        this.vehicleTableData.set(undefined);
      },
    });
  }

  filterVin() {
    const input = this.searchVinInput().toLowerCase();

    if (!input) {
      this.filteredVinList.set([]);
      return;
    }

    const filtered = this.vinList().filter(v =>
      v.toLowerCase().includes(input)
    );

    this.filteredVinList.set(filtered);
  }

  selectVin(vin: string) {
  this.searchVinInput.set(vin);
  this.filteredVinList.set([]);
  this.searchByVin();
}

  /**
   * Busca os dados da tabela (odômetro, etc.) com base no nome do modelo.
   */
  private loadVehicleTableData(vehicleName: string): void {
    const vin = this.vinMap[vehicleName]; // 3. Encontra o VIN correspondente

    if (!vin) {
      console.error(`Nenhum VIN encontrado para o modelo: ${vehicleName}`);
      this.vehicleTableData.set(undefined);
      return;
    }

    // 4. Chama a API com o VIN
    this.vehicleService.getCarData(vin).subscribe((data) => {
      // Adiciona o VIN ao objeto para exibição fácil na tabela
      const dataWithVin: VeiculoData = { ...data, vin: vin };
      this.vehicleTableData.set(dataWithVin);
    });
  }
}
