import React from 'react';
import * as Icons from 'lucide-react';
import { iconMap } from '../utils/lucide-icons';
import { Device } from '../types';
import { DeviceChart } from './DeviceChart';

interface DeviceModalProps {
  device: Device | null;
  onClose: () => void;
}

export const DeviceModal: React.FC<DeviceModalProps> = ({ device, onClose }) => {
  if (!device) return null;

  const IconComponent = iconMap[device.icon as keyof typeof iconMap] as React.ComponentType<any>;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="h4">{device.name}</h2>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                device.status === 'on' ? 'bg-red-100 text-red-700' :
                device.status === 'standby' ? 'bg-orange-100 text-orange-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {device.status === 'on' ? 'Ein' : 
                 device.status === 'standby' ? 'Standby' : 'Aus'}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Details schließen"
            >
              <Icons.X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {/* Device Icon and Status */}
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              device.status === 'on' ? 'bg-green-600 text-white' :
              device.status === 'standby' ? 'bg-orange-100 text-orange-600' :
              'bg-gray-200 text-gray-600'
            }`}>
              <IconComponent size={32} />
            </div>
            <div>
              <h3 className="h5">{device.name}</h3>
              <p className="text-body text-medium-contrast">{device.description}</p>
            </div>
          </div>

          {/* Energy Chart Placeholder */}
          <div className="mb-6">
            <h4 className="h6 mb-3">Energieverbrauch</h4>
            <DeviceChart device={device} />
          </div>

          {/* Device Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {device.status === 'on' ? device.wattage : 
                 device.status === 'standby' ? device.standbyWattage : 
                 device.wattage}W
              </div>
              <div className="text-sm text-gray-600">
                Verbrauch pro Stunde
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">
                {device.status === 'on' ? device.costPerHour.toFixed(3) : 
                 device.status === 'standby' ? (device.standbyWattage * 0.30 / 1000).toFixed(3) : 
                 device.costPerHour.toFixed(3)} CHF
              </div>
              <div className="text-sm text-gray-600">
                Kosten pro Stunde
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
              <div className="text-2xl font-bold text-green-600">
                {device.hasStandby && device.standbyWattage > 0 ? 
                  Math.round((device.standbyWattage / device.wattage) * 100) : 
                  device.energyEfficiencyRating === 'A+' ? '20' :
                  device.energyEfficiencyRating === 'A' ? '15' :
                  device.energyEfficiencyRating === 'B' ? '10' :
                  device.energyEfficiencyRating === 'C' ? '5' : '0'}%
              </div>
              <div className="text-sm text-gray-600">Einsparpotential</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <div className="text-2xl font-bold text-orange-600">
                {(() => {
                  // Realistische jährliche Nutzung für 4-köpfige Familie - Neu berechnet
                  let hoursPerYear = 0;
                  
                  switch (device.category) {
                    case 'entertainment': // TV, Konsole, Soundbar
                      if (device.name.includes('Fernseher')) {
                        hoursPerYear = 2190; // 6h/Tag (Familie schaut abends zusammen)
                      } else if (device.name.includes('Konsole') || device.name.includes('Videokonsole')) {
                        hoursPerYear = 912; // 2.5h/Tag (Kinder + Eltern)
                      } else if (device.name.includes('Sound')) {
                        hoursPerYear = 1825; // 5h/Tag (läuft mit TV mit)
                      } else {
                        hoursPerYear = 1460; // Standard Entertainment
                      }
                      break;
                    case 'cooling': // Kühlschrank, Gefrierschrank
                      hoursPerYear = 8760; // 24h/Tag (immer an)
                      break;
                    case 'heating': // Boiler, Dusche
                      if (device.name.includes('Boiler')) {
                        hoursPerYear = 2190; // 6h/Tag (tatsächliches Heizen, nicht Bereitschaft)
                      } else if (device.name.includes('Dusche') || device.name.includes('Bad')) {
                        hoursPerYear = 548; // 1.5h/Tag (4 Personen à 20min)
                      } else {
                        hoursPerYear = 4380; // 12h/Tag Standard
                      }
                      break;
                    case 'cleaning': // Waschmaschine, Tumbler, Spülmaschine
                      if (device.name.includes('Waschmaschine')) {
                        hoursPerYear = 208; // 4h/Woche (4-köpfige Familie)
                      } else if (device.name.includes('Tumbler')) {
                        hoursPerYear = 156; // 3h/Woche (nicht immer genutzt)
                      } else if (device.name.includes('Spülmaschine')) {
                        hoursPerYear = 365; // 1h/Tag (täglich bei 4 Personen)
                      } else if (device.name.includes('Staubsaugroboter') || device.name.includes('roboter')) {
                        hoursPerYear = 182; // 0.5h/Tag (täglich kurz)
                      } else {
                        hoursPerYear = 200; // Standard Reinigung
                      }
                      break;
                    case 'cooking': // Herd, Ofen, Mikrowelle
                      if (device.name.includes('Herd')) {
                        hoursPerYear = 547; // 1.5h/Tag (Familie kocht mehr)
                      } else if (device.name.includes('Backofen') || device.name.includes('Ofen')) {
                        hoursPerYear = 156; // 3h/Woche (Wochenende backen)
                      } else if (device.name.includes('Mikrowelle')) {
                        hoursPerYear = 146; // 0.4h/Tag (häufiger bei Familie)
                      } else {
                        hoursPerYear = 300; // Standard Kochen
                      }
                      break;
                    case 'network': // Router
                      hoursPerYear = 8760; // 24h/Tag (immer an)
                      break;
                    case 'electronics': // PC, Smartphone
                      if (device.name.includes('PC')) {
                        hoursPerYear = 1825; // 5h/Tag (Homeoffice + Kinder)
                      } else if (device.name.includes('Smartphone')) {
                        hoursPerYear = 1460; // 4h/Tag Laden (4 Geräte)
                      } else {
                        hoursPerYear = 1200; // Standard Elektronik
                      }
                      break;
                    case 'personal-care': // Haartrockner, Zahnbürste
                      if (device.name.includes('Haartrockner') || device.name.includes('Föhn')) {
                        hoursPerYear = 146; // 0.4h/Tag (4 Personen, nicht täglich alle)
                      } else if (device.name.includes('Zahnbürste')) {
                        hoursPerYear = 49; // 0.13h/Tag (4 Personen à 2min)
                      } else if (device.name.includes('Glätteisen')) {
                        hoursPerYear = 73; // 0.2h/Tag (nicht täglich)
                      } else if (device.name.includes('Lockenstab')) {
                        hoursPerYear = 52; // 0.14h/Tag (weniger häufig)
                      } else {
                        hoursPerYear = 80; // Standard Körperpflege
                      }
                      break;
                    case 'comfort': // Ventilator, Luftbefeuchter
                      if (device.name.includes('Ventilator')) {
                        hoursPerYear = 1460; // 4h/Tag (Sommer, mehrere Räume)
                      } else if (device.name.includes('Luftbefeuchter')) {
                        hoursPerYear = 2920; // 8h/Tag (Winter, nachts)
                      } else {
                        hoursPerYear = 1200; // Standard Komfort
                      }
                      break;
                    case 'mobility': // E-Auto, E-Bike, E-Scooter
                      if (device.name.includes('E-Auto') || device.name.includes('Auto')) {
                        hoursPerYear = 547; // 1.5h/Tag Laden (Familie fährt mehr)
                      } else if (device.name.includes('E-Bike') || device.name.includes('Bike')) {
                        hoursPerYear = 156; // 3h/Woche Laden (2 Bikes)
                      } else if (device.name.includes('E-Scooter') || device.name.includes('Scooter')) {
                        hoursPerYear = 104; // 2h/Woche Laden (Kinder nutzen)
                      } else {
                        hoursPerYear = 250; // Standard Mobilität
                      }
                      break;
                    case 'lighting': // Beleuchtung
                      hoursPerYear = 2190; // 6h/Tag (Familie ist abends länger wach)
                      break;
                    case 'ventilation': // Badlüfter
                      hoursPerYear = 547; // 1.5h/Tag (nach Duschen)
                      break;
                    case 'network': // Router
                      hoursPerYear = 8760; // 24h/Tag (immer an)
                      break;
                    default:
                      hoursPerYear = 1200; // Fallback erhöht
                  }
                  
                  // Berechnung der jährlichen Kosten
                  const actualWattage = device.status === 'on' ? device.wattage : 
                                       device.status === 'standby' ? device.standbyWattage : 
                                       device.wattage; // Potentieller Verbrauch wenn aus
                  
                  const yearlyConsumption = (actualWattage / 1000) * hoursPerYear;
                  const yearlyCost = yearlyConsumption * 0.30; // 0.30 CHF/kWh
                  return yearlyCost.toFixed(2);
                })()} CHF
              </div>
              <div className="text-sm text-gray-600">Jährliche Kosten</div>
            </div>
          </div>

          {/* Cost Breakdown Section - especially for high-consumption devices */}
          {device.wattage > 1000 && (
            <div className="mb-6">
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer list-none py-4 hover:bg-repower-gray-50 transition-colors rounded-lg">
                  <span className="h5">Kostenaufschlüsselung</span>
                  <svg className="w-4 h-4 text-repower-gray-600 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 9l6 6 6-6" />
                  </svg>
                </summary>
                <div className="pb-4">
                {(() => {
                  // Calculate usage hours per year (same logic as above)
                  let hoursPerYear = 0;
                  let usageDescription = '';
                  
                  switch (device.category) {
                    case 'heating':
                      if (device.name.includes('Boiler')) {
                        hoursPerYear = 2190;
                        usageDescription = '6 Stunden täglich (Morgens 2h, Abends 2h, Nachheizen 2h)';
                      } else if (device.name.includes('Dusche') || device.name.includes('Bad')) {
                        hoursPerYear = 548;
                        usageDescription = '1.5 Stunden täglich (4 Personen à 20 Minuten)';
                      } else {
                        hoursPerYear = 4380;
                        usageDescription = '12 Stunden täglich';
                      }
                      break;
                    case 'cooking':
                      if (device.name.includes('Herd')) {
                        hoursPerYear = 547;
                        usageDescription = '1.5 Stunden täglich (Familie kocht mehr)';
                      } else if (device.name.includes('Backofen') || device.name.includes('Ofen')) {
                        hoursPerYear = 156;
                        usageDescription = '3 Stunden wöchentlich (Wochenende backen)';
                      } else {
                        hoursPerYear = 300;
                        usageDescription = 'Durchschnittliche Nutzung';
                      }
                      break;
                    case 'cleaning':
                      if (device.name.includes('Waschmaschine')) {
                        hoursPerYear = 208;
                        usageDescription = '4 Stunden wöchentlich (4-köpfige Familie)';
                      } else if (device.name.includes('Tumbler')) {
                        hoursPerYear = 156;
                        usageDescription = '3 Stunden wöchentlich';
                      } else {
                        hoursPerYear = 200;
                        usageDescription = 'Durchschnittliche Nutzung';
                      }
                      break;
                    case 'mobility':
                      if (device.name.includes('E-Auto') || device.name.includes('Auto')) {
                        hoursPerYear = 547;
                        usageDescription = '1.5 Stunden täglich (Familie fährt mehr)';
                      } else {
                        hoursPerYear = 250;
                        usageDescription = 'Durchschnittliche Nutzung';
                      }
                      break;
                    case 'personal-care':
                      if (device.name.includes('Haartrockner') || device.name.includes('Föhn')) {
                        hoursPerYear = 146;
                        usageDescription = '0.4 Stunden täglich (4 Personen, abwechselnd)';
                      } else {
                        hoursPerYear = 80;
                        usageDescription = 'Durchschnittliche Nutzung';
                      }
                      break;
                    default:
                      hoursPerYear = 1200;
                      usageDescription = 'Durchschnittliche Nutzung';
                  }
                  
                  const actualWattage = device.status === 'on' ? device.wattage : 
                                       device.status === 'standby' ? device.standbyWattage : 
                                       device.wattage;
                  
                  const yearlyConsumption = (actualWattage / 1000) * hoursPerYear;
                  const yearlyCost = yearlyConsumption * 0.30;
                  const monthlyCost = yearlyCost / 12;
                  const dailyCost = yearlyCost / 365;
                  
                  return (
                    <div className="space-y-6">
                      <div className="text-sm text-gray-700">
                        <strong>Geschätzte Nutzung:</strong> {usageDescription}
                      </div>
                      
                      {/* Table Layout */}
                      <div className="overflow-hidden">
                        <table className="w-full text-sm">
                          <tbody className="divide-y divide-gray-100">
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Leistung</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">{actualWattage.toLocaleString()}</span>
                                <span className="text-repower-gray-500 ml-1">W</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Nutzung pro Jahr</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">{hoursPerYear.toLocaleString()}</span>
                                <span className="text-repower-gray-500 ml-1">h</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Verbrauch pro Jahr</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">{yearlyConsumption.toFixed(0)}</span>
                                <span className="text-repower-gray-500 ml-1">kWh</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Strompreis</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">0.30</span>
                                <span className="text-repower-gray-500 ml-1">CHF/kWh</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Kosten pro Tag</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">{dailyCost.toFixed(2)}</span>
                                <span className="text-repower-gray-500 ml-1">CHF</span>
                              </td>
                            </tr>
                            <tr className="hover:bg-repower-gray-50">
                              <td className="py-3 text-repower-gray-700 font-medium">Kosten pro Monat</td>
                              <td className="py-3 text-right">
                                <span className="font-semibold text-repower-dark">{monthlyCost.toFixed(2)}</span>
                                <span className="text-repower-gray-500 ml-1">CHF</span>
                              </td>
                            </tr>
                            <tr className="bg-repower-gray-50 border-t-2 border-repower-gray-200">
                              <td className="py-4 text-repower-dark font-bold">Kosten pro Jahr</td>
                              <td className="py-4 text-right">
                                <span className="font-bold text-repower-dark text-lg">{yearlyCost.toFixed(2)}</span>
                                <span className="text-repower-gray-500 ml-1">CHF</span>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {device.name.includes('Boiler') && (
                        <div className="mt-6 p-4 bg-repower-gray-50 rounded-lg border border-repower-gray-200">
                          <div className="text-xs text-repower-gray-700">
                            <strong>💡 Boiler-Tipp:</strong> Moderne Boiler sind gut isoliert und heizen nicht dauerhaft. 
                            Die 6h täglich entsprechen dem tatsächlichen Heizvorgang, nicht der Bereitschaftszeit.
                          </div>
                        </div>
                      )}
                      
                      {device.name.includes('E-Auto') && (
                        <div className="mt-6 p-4 bg-repower-gray-50 rounded-lg border border-repower-gray-200">
                          <div className="text-xs text-repower-gray-700">
                            <strong>🚗 E-Auto-Tipp:</strong> Laden Sie nachts mit günstigeren Tarifen. 
                            Viele Anbieter haben spezielle E-Auto-Tarife ab 0.20 CHF/kWh.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
                </div>
              </details>
            </div>
          )}

          {/* Energy Saving Tips */}
          <div>
            <h4 className="h5 mb-4">
              Stromspartipps
            </h4>
            <div className="space-y-3">
              {device.tips
                .slice(0, 3)
                .map((tip, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border border-gray-200 bg-white">
                    <div className="w-6 h-6 bg-repower-red rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icons.Lightbulb size={14} className="text-white" />
                    </div>
                    <p className="text-body text-medium-contrast">{tip}</p>
                  </div>
                ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};