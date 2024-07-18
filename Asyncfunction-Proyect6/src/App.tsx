import React, { useState, useEffect } from 'react'; // Importa React y hooks para manejar estado y efectos secundarios
import axios from 'axios'; // Importa Axios para hacer peticiones HTTP

const NCBI_URL = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi'; // URL de la API de NCBI para obtener secuencias de proteínas
const PDB_URL = 'https://data.rcsb.org/rest/v1/core/entry/'; // URL base de la API de RCSB PDB

const App = () => {
  const [sequence, setSequence] = useState(''); // Estado para almacenar la secuencia de la proteína
  const [structureUrl, setStructureUrl] = useState(''); // Estado para almacenar la URL de la estructura 3D
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    const fetchSequenceAndStructure = async () => {
      const proteinId = 'NP_000546'; // ID de ejemplo para la proteína
      const pdbId = '4HHB'; // ID de ejemplo para PDB

      try {
        // Obtener la secuencia de la proteína desde NCBI
        const response = await axios.get(NCBI_URL, {
          params: {
            db: 'protein',
            id: proteinId,
            rettype: 'fasta',
            retmode: 'text',
          },
        });
        setSequence(response.data); // Actualiza el estado con la secuencia obtenida

        // Obtener la estructura 3D desde RCSB PDB
        const structureResponse = await axios.get(`${PDB_URL}${pdbId}`);
        setStructureUrl(`https://files.rcsb.org/download/${pdbId}.pdb`); // Actualiza el estado con la URL de la estructura 3D
      } catch (error) {
        setError(error); // Maneja errores actualizando el estado de error
      }
    };

    fetchSequenceAndStructure(); // Llama a la función para obtener los datos al montar el componente
  }, []);

  if (error) return <p>Error: {error.message}</p>; // Muestra un mensaje de error si ocurre un error

  return (
    <div>
      <h1>NCBI Protein Sequence and 3D Structure</h1>
      <pre>{sequence}</pre> {/* Muestra la secuencia de la proteína */}
      {structureUrl && (
        <div>
          <h2>3D Structure</h2>
          <iframe src={`http://www.rcsb.org/structure/${structureUrl}`} width="600" height="400"></iframe> {/* Muestra la estructura 3D */}
        </div>
      )}
    </div>
  );
};

export default App; // Exporta el componente para su uso en otros lugares
