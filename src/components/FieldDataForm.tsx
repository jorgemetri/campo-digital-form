
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Download, Save, Loader2 } from 'lucide-react';
import DataGrid from './DataGrid';
import { ParcelData, FormData } from '../types/formTypes';
import { exportToCSV } from '../utils/csvExport';
// INTEGRAÇÃO: Importando hooks da API
import { useSaveFieldData, useFarms } from '../services/apiService';
import { useToast } from '@/hooks/use-toast';

const FARMS = ['Onça Pintada', 'Mantiqueira', 'Nova Era'];

const FieldDataForm = () => {
  const [formData, setFormData] = useState<FormData>({
    date: new Date().toISOString().split('T')[0],
    farm: '',
    plot: '',
    parcels: {
      1: { data: [], observations: '' },
      2: { data: [], observations: '' },
      3: { data: [], observations: '' },
      4: { data: [], observations: '' }
    }
  });

  // INTEGRAÇÃO: Hooks da API
  const saveDataMutation = useSaveFieldData();
  const { toast } = useToast();
  
  // INTEGRAÇÃO: Buscar fazendas da API (opcional)
  // const { data: farmsFromApi, isLoading: farmsLoading } = useFarms();
  // const farmOptions = farmsFromApi?.data || FARMS;

  const handleParcelDataChange = (parcelNumber: number, data: any[], observations?: string) => {
    setFormData(prev => ({
      ...prev,
      parcels: {
        ...prev.parcels,
        [parcelNumber]: {
          data: data,
          observations: observations !== undefined ? observations : prev.parcels[parcelNumber].observations
        }
      }
    }));
  };

  const handleObservationsChange = (parcelNumber: number, observations: string) => {
    setFormData(prev => ({
      ...prev,
      parcels: {
        ...prev.parcels,
        [parcelNumber]: {
          ...prev.parcels[parcelNumber],
          observations
        }
      }
    }));
  };

  // INTEGRAÇÃO: Função para salvar na API
  const handleSaveToApi = async () => {
    try {
      console.log('Salvando dados na API:', formData);
      
      const result = await saveDataMutation.mutateAsync(formData);
      
      if (result.success) {
        toast({
          title: "Sucesso!",
          description: "Dados salvos na API com sucesso.",
        });
      } else {
        throw new Error(result.error || 'Erro ao salvar dados');
      }
    } catch (error) {
      console.error('Erro ao salvar na API:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados na API. Verifique a conexão.",
        variant: "destructive",
      });
    }
  };

  const handleExport = () => {
    exportToCSV(formData);
  };

  const isFormValid = formData.farm && formData.plot;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Calendar className="h-6 w-6" />
              Formulário de Coleta de Dados de Campo
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Header Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg border">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-gray-700">
                  Data da Coleta
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="border-2 border-gray-200 focus:border-green-500 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="farm" className="text-sm font-semibold text-gray-700">
                  Fazenda
                </Label>
                <Select value={formData.farm} onValueChange={(value) => setFormData(prev => ({ ...prev, farm: value }))}>
                  <SelectTrigger className="border-2 border-gray-200 focus:border-green-500">
                    <SelectValue placeholder="Selecione a fazenda" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-gray-200 z-50">
                    {/* INTEGRAÇÃO: Use farmOptions se buscar da API */}
                    {FARMS.map((farm) => (
                      <SelectItem key={farm} value={farm} className="hover:bg-green-50">
                        {farm}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plot" className="text-sm font-semibold text-gray-700">
                  Talhão / Bloco
                </Label>
                <Input
                  id="plot"
                  value={formData.plot}
                  onChange={(e) => setFormData(prev => ({ ...prev, plot: e.target.value }))}
                  placeholder="Digite o talhão/bloco"
                  className="border-2 border-gray-200 focus:border-green-500 transition-colors"
                />
              </div>
            </div>

            {/* Parcels Tabs */}
            <Tabs defaultValue="1" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-green-100">
                {[1, 2, 3, 4].map((num) => (
                  <TabsTrigger 
                    key={num} 
                    value={num.toString()}
                    className="data-[state=active]:bg-green-600 data-[state=active]:text-white font-semibold"
                  >
                    Parcela {num}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {[1, 2, 3, 4].map((parcelNumber) => (
                <TabsContent key={parcelNumber} value={parcelNumber.toString()} className="space-y-6">
                  <Card className="border-2 border-green-200">
                    <CardHeader className="bg-green-50 pb-4">
                      <CardTitle className="text-lg text-green-800">
                        Dados da Parcela {parcelNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <DataGrid
                        data={formData.parcels[parcelNumber].data}
                        onChange={(data) => handleParcelDataChange(parcelNumber, data)}
                      />
                      
                      <div className="mt-6 space-y-2">
                        <Label htmlFor={`obs-${parcelNumber}`} className="text-sm font-semibold text-gray-700">
                          Observações (ex: Coordenadas GPS)
                        </Label>
                        <Textarea
                          id={`obs-${parcelNumber}`}
                          value={formData.parcels[parcelNumber].observations}
                          onChange={(e) => handleObservationsChange(parcelNumber, e.target.value)}
                          placeholder="Digite observações relevantes para esta parcela..."
                          className="min-h-[100px] border-2 border-gray-200 focus:border-green-500 transition-colors resize-none"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>

            {/* INTEGRAÇÃO: Seção de Ações com botão para salvar na API */}
            <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-2 border-green-200">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Finalizar Coleta de Dados
                </h3>
                <p className="text-sm text-gray-600">
                  Salve os dados na API ou gere e baixe o relatório em formato CSV
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {/* INTEGRAÇÃO: Botão para salvar na API */}
                  <Button 
                    onClick={handleSaveToApi}
                    disabled={!isFormValid || saveDataMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {saveDataMutation.isPending ? (
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-5 w-5" />
                    )}
                    {saveDataMutation.isPending ? 'Salvando...' : 'Salvar na API'}
                  </Button>

                  <Button 
                    onClick={handleExport}
                    disabled={!isFormValid}
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Gerar e Baixar CSV
                  </Button>
                </div>
                
                {!isFormValid && (
                  <p className="text-sm text-red-600 mt-2">
                    Preencha a fazenda e o talhão/bloco para habilitar as ações
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FieldDataForm;
