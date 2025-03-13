import { useState, useEffect, useCallback } from 'react';
import './styles.css';

type Dados = {
    [key: string]: {
        tier: string;
        prioridade: string;
        cnpj: string;
    };
};

export default function CarregaTier() {
    const [dados, setDados] = useState<Dados>({});
    const [numeroInput, setNumeroInput] = useState<string>('');
    const [resultado, setResultado] = useState<string>('');
    const [carregando, setCarregando] = useState<boolean>(true);

    const carregarDados = async () => {
        setCarregando(true);
        try {
            const response = await fetch('/ex.csv')
            if (!response.ok) {
                throw new Error(`Erro ao carregar o arquivo: ${response.statusText}`);
               
            }
            const data = await response.text();
            const linhas = data.split('\n').slice(1)
            const dadosCarregados: Dados = {}

            linhas.forEach(linha => {
                const [numero, tier, prioridade, cnpj] = linha.split(',').map(item => item.trim().replace(/"/g, ''));
                if (numero && tier && prioridade && cnpj) {
                    dadosCarregados[numero] = { tier, prioridade, cnpj }
                    
                }
            })
           

            console.log('Buscador de Tier')
            setDados(dadosCarregados)
            setResultado('')
        } catch (error) {
            console.error('Erro ao carregar dados:', error)
            setResultado('Erro ao carregar dados. Verifique o arquivo ex.csv.');
        } finally {
            setCarregando(false);
           
        }
    };

    const buscarTier = useCallback(() => {
        const numeroBuscado = numeroInput.trim()
       
        if (!numeroBuscado) {
            setResultado('Por favor, digite um número.')
            return;
        }

        if (dados[numeroBuscado]) {
            const { tier, prioridade, cnpj } = dados[numeroBuscado]
            setResultado(
                `Tenant: ${numeroBuscado} <br />
                 Tier: ${tier} <br />
                 CNPJ: ${prioridade} <br />
                 Revenda: ${cnpj}`

            );
            console.log("%c********************** Buscador de Tier desenvolvido por Elias ********************** ", "color: green; font-size: 10px; font-weight: bold;");

        } else {
            setResultado('Número não encontrado.');
        }
    }, [numeroInput, dados]);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            buscarTier();
        }
    };

    useEffect(() => {
        carregarDados();
    }, []);

    if (carregando) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div className="container">
            <h3>TIER EYE</h3>
            <input
                type="number"
                value={numeroInput}
                onChange={(e) => setNumeroInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Digite o número"
            />
            <button onClick={buscarTier}>Buscar</button>
            <p dangerouslySetInnerHTML={{ __html: resultado }}></p>
        </div>
    );
}