import axios from 'axios';
import React, { useState } from 'react';
import './table.css'

import moment from 'moment';

function Table() {

    const [listacolaborador, guardacolab] = useState([]);
    const [nomeSelecionado, setnomeSelecionado] = useState(null);
    const [somaValores, setSomaValores] = useState(0);

    const [dataInicial, setDataInicial] = useState(null);
const [dataFinal, setDataFinal] = useState(null);

    function onchangename(nome) {
        const name = nome.target.value;
        setnomeSelecionado(name);
    }

   /*  function getcolab() {
        if (!nomeSelecionado) {
            axios.get('http://localhost:8080/transferencias').then((result) => {
                guardacolab(result.data);
                console.log(result.data);
                const valores = result.data.map((colab) => colab.valor);
                const total = valores.reduce((acc, curr) => acc + curr, 0);
                setSomaValores(total);
            });
        }

        if (nomeSelecionado) {
            axios
                .get('http://localhost:8080/contas/dono/' + nomeSelecionado)
                .then((result) => {
                    guardacolab(result.data.transferencias);
                    console.log(result.data.transferencias);
                    const valores = result.data.transferencias.map((colab) => colab.valor);
                    const total = valores.reduce((acc, curr) => acc + curr, 0);
                    setSomaValores(total);
                });
        }
    }
 */


    function getcolab() {
        let url = 'http://localhost:8080/transferencias';
      
        if (nomeSelecionado) {
          url = `http://localhost:8080/contas/dono/${nomeSelecionado}`;
        }
      
        axios.get(url).then((result) => {
          let transferencias = result.data.transferencias || result.data;
          
          if (dataInicial && dataFinal) {
            transferencias = transferencias.filter((colab) => {
              const dataTransferencia = moment(colab.data_transferencia).format('YYYY-MM-DD');
              return moment(dataTransferencia).isBetween(dataInicial, dataFinal, null, '[]');
            });
          }
      
          guardacolab(transferencias);
          console.log(transferencias);
      
          const valores = transferencias.map((colab) => colab.valor);
          const total = valores.reduce((acc, curr) => acc + curr, 0);
          setSomaValores(total);
        });
      }




    return (
        <div className="container">

            <div className='title'>
                <h2>Consultar <span class="badge bg-success">Saldo</span> <span class="badge bg-danger">Transferencia</span> <span class="badge bg-info">Bancaria</span> </h2>
            </div>
            <div className="buttons">
                <div class="col-md-3" id="bott">
                    <label for="inputnome3" class="form-label">Data De Inicio</label>
                    <input type="date" name="inicio"  value={dataInicial} onChange={(e) => setDataInicial(e.target.value)} class="form-control" id="inputnome3" />
                </div>

                <div class="col-md-3" id="bott">
                    <label for="inputnome3" class="form-label">Data Fim</label>
                    <input type="date" name="fim" value={dataFinal} onChange={(e) => setDataFinal(e.target.value)} class="form-control" id="inputnome3" />
                </div>

                <div class="col-md-3" id="bott">
                    <label for="inputnome3" class="form-label">Nome Colaborador</label>
                    <input type="text" name="nome" onChange={onchangename} class="form-control" id="inputnome4" />
                </div>
            </div>
            <div className='pesquisar'>
                <div class="col-md-3" id="bott">
                    <button onClick={getcolab} class="btn btn-danger">Pesquisar</button>
                </div>                
            </div>
               
            <div >
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">Dados</th>
                            <th scope="col">Valencia</th>
                            <th scope="col">Tipo</th>
                            <th scope="col">Nome Operador</th>
                        </tr>
                    </thead>
                    <tbody class="table-group-divider">
                        {listacolaborador.map(colab => (
                            <tr key={colab.id}>
                                <td>{moment(colab.data_transferencia).format('DD/MM/YYYY')}</td>
                                <td>{colab.valor}</td>
                                <td>{colab.tipo}</td>
                                <td>{colab.nome_operador}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>
                
            </div>

            <div className='saldobox'>
                <span className='saldo'>Saldo Total :{somaValores} </span>
            </div>

           

        </div>
    );
}

export default Table;
