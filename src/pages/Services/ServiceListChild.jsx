import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import axios from "axios";

const ServiceListChild = () => {

  const [data, setData] = useState([])

  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`https://incident-system.onrender.com/getnewoccuranceAll/${id}`)
      .then((response) => {
        // Set the fetched data in state
        setData(response.data);
        // console.log(response.data)
        console.log(data)
      })
      .catch((error) => {
        // Handle errors, if any
        console.error("Error fetching data:", error);
      });

  }, [])



  return (
    <div className="container">
      <div className=" row garison my-4 popa ">
        <div style={{ backgroundColor: "#ffff", display: 'flex', justifyContent: 'center' }} className=" col-md-4 col-sm-12 Record_1 ">


          <ul style={{ width: '60%' }}>
            <li>
              <h6> Telephono: {data.phone}</h6>
            </li>
            <li>
              <h6> Solicitante: {data.Applicant}</h6>
            </li>
            <li>
              <h6> Cód. Atendimento: {data.occurance_Code}</h6>
            </li>
            <li>
              <h6> Numero de Ocorrência: {data.occurance_Number}</h6>
            </li>
          </ul>
        </div>
        <div style={{ backgroundColor: "#ffff", display: 'flex', justifyContent: 'center'  }} className=" col-md-4 col-sm-12  Record_2 less-gap_3">
          <ul style={{ width: '40%' }}>
            <li>
              <h6> Rua: {data.Street}</h6>
            </li>
            <li>
              <h6>Bairro: {data.Neighbourhood}</h6>
            </li>
            <li>
              <h6> Cidade: {data.City}</h6>
            </li>

            <li>
              <h6> Referência: {data.Reference}</h6>
            </li>
          </ul>
        </div>
      </div>

      <div className=" row request_card py-5 my-4 less-gap">
        <label for="vehicle3" className="ml-2 font-weight-bold">
          {" "}
          Solicitação
        </label>
        <div class=" col-sm-12 col-md-12 input-group request-group mb-3 mt-3">

          <input
            type="text"
            class="form-control"
            placeholder="Request"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={data.Request}
          />
        </div>
      </div>

      <div className="loki"></div>

      <div className=" row request_card py-5 mb-5 less-gap_2" style={{ marginTop: "10px" }}>
        <label for="vehicle3" className="ml-2 font-weight-bold" >
          {" "}
          Observaçã
        </label>
        <div class=" col-sm-12 col-md-12 input-group request-group mb-3 mt-3">
          <input
            type="text"
            class="form-control"
            placeholder="Description"
            aria-label="Username"
            aria-describedby="basic-addon1"
            value={data.Description}
            onChange={(e) => { e.target.value }}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceListChild;
