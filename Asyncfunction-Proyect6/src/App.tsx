import { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";

const NCBI_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi';

// Lista de IDs de proteínas de ejemplo
const proteinIds = ['NP_000546', 'NP_001276', 'NP_002006', 'NP_002422'];

const App = () => {
  const [sequence, setSequence] = useState('');
  const [error, setError] = useState(null);
  const [currentProteinId, setCurrentProteinId] = useState(proteinIds[0]);

  // Función para obtener una secuencia de proteína por ID
  const fetchSequence = async (proteinId) => {
    try {
      const response = await axios.get(NCBI_URL, {
        params: {
          db: 'protein',
          id: proteinId,
          rettype: 'fasta',
          retmode: 'text',
        },
      });
      setSequence(response.data);
    } catch (error) {
      setError(error);
    }
  };

  // Efecto para cargar la secuencia inicial al montar el componente
  useEffect(() => {
    fetchSequence(currentProteinId);
  }, [currentProteinId]);

  // Función para obtener un nuevo ID de proteína aleatorio
  const getRandomProteinId = () => {
    const randomIndex = Math.floor(Math.random() * proteinIds.length);
    return proteinIds[randomIndex];
  };

  // Maneja el click del botón para obtener una nueva secuencia aleatoria
  const handleNewSequence = () => {
    const newProteinId = getRandomProteinId();
    setCurrentProteinId(newProteinId);
  };

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='container '>
      <div className="row justify-content-center">
          <h1 className='align-self-center mx-0 py-3 fs-1 text-center'>NCBI Protein Sequence</h1>
            <button className="btn my-3 text-center" onClick={handleNewSequence}>
              Get New Random Sequence
            </button>
        <div className="col-12 align-self-center cont ">
          <div className="text-center boton">
          </div>
          <div className="seq text-center">
            <pre className='content my-3 fs-5 text-justify'>{sequence}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
